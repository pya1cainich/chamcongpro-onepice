/* ===== GPS TỰ ĐỘNG CHẤM CÔNG (Capacitor Native) =====
   Dùng Capacitor.Plugins.Geolocation thay navigator.geolocation
   → Yêu cầu build APK qua Capacitor + Android Studio
   ===== */

// GPS globals → declared in app.js to avoid TDZ when files are merged
// _gpsData, _gpsInterval, _gpsWasInside, _gpsPollMs, timers

/** Đọc cài đặt GPS từ localStorage */
function loadGpsData(){
  const g = lsGet('cp22_gps');
  if(g) _gpsData = Object.assign(_gpsData, g);
  _gpsData.tightCompanyGps = !!_gpsData.tightCompanyGps;
  _gpsData.smartAttendanceMode = _gpsData.enabled ? true : !!_gpsData.smartAttendanceMode;
  _gpsData.insideScheduleOut = false;
  if(typeof gpsApplyDefaultRadiusMigration === 'function') gpsApplyDefaultRadiusMigration();
  if(typeof gpsRepairLocationPersistence === 'function'){
    gpsRepairLocationPersistence();
    lsSet('cp22_gps', _gpsData);
  }
}

function gpsNum(value){
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function gpsValidPair(lat, lng){
  return lat !== null && lng !== null && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function gpsHasLocation(loc){
  if(!loc) return false;
  return gpsValidPair(gpsNum(loc.lat), gpsNum(loc.lng));
}

function gpsJobKey(jobKey){
  return jobKey === 'sub' ? 'sub' : 'main';
}

function gpsLocationRadius(radius){
  const r = Number(radius);
  return Number.isFinite(r) && r > 0 ? Math.round(r) : ((_gpsData && Number(_gpsData.radius) > 0) ? Math.round(Number(_gpsData.radius)) : 15);
}

function gpsTightCompanyEnabled(){
  return !!(_gpsData && _gpsData.tightCompanyGps);
}

function gpsActiveRadius(radius){
  return gpsTightCompanyEnabled() ? 15 : gpsLocationRadius(radius);
}

function gpsApplyDefaultRadiusMigration(){
  if(!_gpsData || _gpsData.radiusDefault15) return;
  const oldDefaults = [100, 75];
  const nextDefault = 15;
  const rootRadius = Number(_gpsData.radius);
  if(!Number.isFinite(rootRadius) || oldDefaults.includes(rootRadius)) _gpsData.radius = nextDefault;
  if(_gpsData.locations && typeof _gpsData.locations === 'object'){
    ['main','sub'].forEach(job => {
      const loc = _gpsData.locations[job];
      if(!loc) return;
      const locRadius = Number(loc.radius);
      if(!Number.isFinite(locRadius) || oldDefaults.includes(locRadius)) loc.radius = nextDefault;
    });
  }
  _gpsData.radiusDefault15 = true;
}

function gpsEnsureLocationStore(){
  if(typeof _gpsData === 'undefined' || !_gpsData) return null;
  const radius = gpsLocationRadius(_gpsData.radius);
  if(!_gpsData.locations || typeof _gpsData.locations !== 'object') _gpsData.locations = {};
  if(!_gpsData.locations.main) _gpsData.locations.main = {lat:null, lng:null, radius};
  if(!_gpsData.locations.sub) _gpsData.locations.sub = {lat:null, lng:null, radius};
  _gpsData.activeJob = gpsJobKey(_gpsData.activeJob);
  return _gpsData.locations;
}

function gpsGetStoredCompanyLocation(jobKey){
  const locations = gpsEnsureLocationStore();
  if(!locations) return null;
  const job = gpsJobKey(jobKey || _gpsData.activeJob);
  const preferred = locations[job];
  if(gpsHasLocation(preferred)){
    return {
      lat: gpsNum(preferred.lat),
      lng: gpsNum(preferred.lng),
      radius: gpsLocationRadius(preferred.radius)
    };
  }
  if(gpsHasLocation(locations.main)){
    return {
      lat: gpsNum(locations.main.lat),
      lng: gpsNum(locations.main.lng),
      radius: gpsLocationRadius(locations.main.radius)
    };
  }
  const lat = gpsNum(_gpsData.lat);
  const lng = gpsNum(_gpsData.lng);
  if(gpsValidPair(lat, lng)) return {lat, lng, radius: gpsLocationRadius(_gpsData.radius)};
  return null;
}

function gpsRepairLocationPersistence(){
  const locations = gpsEnsureLocationStore();
  if(!locations) return;
  const rootLat = gpsNum(_gpsData.lat);
  const rootLng = gpsNum(_gpsData.lng);
  if(gpsValidPair(rootLat, rootLng) && !gpsHasLocation(locations.main)){
    locations.main = {lat:rootLat, lng:rootLng, radius:gpsLocationRadius(_gpsData.radius)};
  }
  const loc = gpsGetStoredCompanyLocation(_gpsData.activeJob);
  if(loc){
    _gpsData.lat = loc.lat;
    _gpsData.lng = loc.lng;
    _gpsData.radius = loc.radius;
  }
}

function gpsPersistCompanyLocation(lat, lng, radius, jobKey){
  const nLat = gpsNum(lat);
  const nLng = gpsNum(lng);
  if(!gpsValidPair(nLat, nLng)) return false;
  const locations = gpsEnsureLocationStore();
  if(!locations) return false;
  const job = gpsJobKey(jobKey || _gpsData.activeJob);
  const loc = {lat:nLat, lng:nLng, radius:gpsLocationRadius(radius)};
  locations[job] = loc;
  if(job === 'main' || !gpsHasLocation(locations.main)){
    locations.main = Object.assign({}, loc);
  }
  if(gpsJobKey(_gpsData.activeJob) === job){
    _gpsData.lat = loc.lat;
    _gpsData.lng = loc.lng;
    _gpsData.radius = loc.radius;
  }
  try{ _gpsWasInside = null; }catch(e){}
  try{
    if(typeof saSyncWorkGpsFromLegacy === 'function') saSyncWorkGpsFromLegacy();
    if(window._sa && typeof saSave === 'function') saSave();
  }catch(e){}
  return true;
}

window.gpsGetStoredCompanyLocation = gpsGetStoredCompanyLocation;

function gpsTimeToMinutes(value, fallback){
  const s = String(value || '');
  const m = s.match(/^(\d{1,2}):(\d{2})$/);
  if(!m) return fallback;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if(!Number.isFinite(h) || !Number.isFinite(min) || h < 0 || h > 23 || min < 0 || min > 59) return fallback;
  return h * 60 + min;
}

function gpsCurrentShiftSchedule(){
  const shifts = (userData && Array.isArray(userData.shiftTimes) && userData.shiftTimes.length) ? userData.shiftTimes : [{in:'08:00', out:'17:00'}];
  // Dùng getEffectiveCurrentShift (xét rotation pattern nếu user bật) thay vì
  // userData.currentShift trực tiếp. Hàm này được expose bởi app.js; fallback
  // về userData.currentShift khi app.js chưa load (vd: native preview).
  const curShift = (typeof window.getEffectiveCurrentShift === 'function')
    ? window.getEffectiveCurrentShift()
    : ((userData && Number(userData.currentShift)) || 1);
  const idx = Math.max(0, Math.min(shifts.length - 1, curShift - 1));
  const shift = shifts[idx] || shifts[0] || {};
  const inTime = shift.in || '08:00';
  const outTime = shift.out || '17:00';
  return {
    in: inTime,
    out: outTime,
    inMin: gpsTimeToMinutes(inTime, 8 * 60),
    outMin: gpsTimeToMinutes(outTime, 17 * 60)
  };
}

function gpsNativeConfigFromData(){
  const loc = gpsGetStoredCompanyLocation(_gpsData.activeJob || 'main');
  const sa = window._sa || {};
  const saHome = sa.home || {};
  const saWork = sa.work || {};
  const shift = gpsCurrentShiftSchedule();
  const smartAttendanceMode = !!(_gpsData.enabled || _gpsData.smartAttendanceMode || sa.enabled);
  const smartJson = (value, fallback) => {
    try{ return JSON.stringify(value == null ? fallback : value); }
    catch(e){ return JSON.stringify(fallback); }
  };
  return {
    lat: loc ? loc.lat : 0,
    lng: loc ? loc.lng : 0,
    radius: loc ? gpsActiveRadius(loc.radius) : gpsActiveRadius(_gpsData.radius),
    checkinMin: smartAttendanceMode ? 20 : (Number(_gpsData.checkinMin) || 20),
    checkoutMin: smartAttendanceMode ? 80 : (Number(_gpsData.checkoutMin) || 80),
    scheduleInMin: shift.inMin,
    scheduleOutMin: shift.outMin,
    tightCompanyGps: !!_gpsData.tightCompanyGps,
    smartAttendanceMode: smartAttendanceMode,
    smartState: smartAttendanceMode && sa.state ? String(sa.state) : '',
    smartHomeWifi: smartJson(saHome.wifi, []),
    // smartHomeBts đã bỏ — không còn dùng BTS
    smartHomeGps: smartJson(saHome.gps, null),
    smartWorkWifi: smartJson(saWork.wifi, []),
    // smartWorkBts đã bỏ — không còn dùng BTS
    smartWorkGps: smartJson(saWork.gps, null),
    insideScheduleOut: false,
    enabled: !!((_gpsData.enabled || (sa && sa.enabled)) && loc),
    hasLocation: !!loc
  };
}

function gpsSyncNativeNow(){
  const cfg = gpsNativeConfigFromData();
  try{ lsSet('cp22_gps_native_cfg', cfg); }catch(e){}

  try{
    const plugin = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.ChamCongNative;
    if(plugin && plugin.setGpsConfig){
      plugin.setGpsConfig(cfg)
        .then(() => {
          if(cfg.enabled && plugin.startNativeGps) return plugin.startNativeGps(cfg);
          if(!cfg.enabled && plugin.stopNativeGps) return plugin.stopNativeGps();
          return null;
        })
        .catch(e => console.warn('[GPS] direct native sync failed:', e));
    }
  }catch(e){}

  try{
    if(window.ccNative && window.ccNative.syncNativeGps){
      window.ccNative.syncNativeGps(_gpsData).catch(() => {});
    }
  }catch(e){}
  return cfg;
}

window.gpsSyncNativeNow = gpsSyncNativeNow;

/** Lưu cài đặt GPS vào localStorage */
function saveGpsData(){
  if(typeof gpsRepairLocationPersistence === 'function') gpsRepairLocationPersistence();
  _gpsData.tightCompanyGps = !!_gpsData.tightCompanyGps;
  _gpsData.smartAttendanceMode = _gpsData.enabled ? true : !!_gpsData.smartAttendanceMode;
  _gpsData.insideScheduleOut = false;
  lsSet('cp22_gps', _gpsData);
  try{ gpsSyncNativeNow(); }catch(e){}
}

function toggleGpsTightCompany(btn){
  if(!_gpsData) return;
  _gpsData.tightCompanyGps = !(_gpsData.tightCompanyGps);
  _gpsData.insideScheduleOut = false;
  if(btn) btn.className = 'toggle-sw' + (_gpsData.tightCompanyGps ? ' on' : '');
  saveGpsData();
  if(typeof syncGpsSliders === 'function') syncGpsSliders();
  if(_gpsData.enabled && _gpsData.lat){
    stopGeofencing();
    startGeofencing();
  }
}

/** Lấy Geolocation API: ưu tiên Capacitor (native), fallback về Web API */
function getGeoAPI(){
  if(window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.Geolocation){
    return 'capacitor';
  }
  if(navigator.geolocation){
    return 'web';
  }
  return null;
}

function gpsIsNativeRuntime(){
  return !!(window.Capacitor && (
    typeof window.Capacitor.isNativePlatform !== 'function' ||
    window.Capacitor.isNativePlatform()
  ));
}

function gpsPermissionGranted(res){
  return !!(res && (
    res.granted === true ||
    res.location === 'granted' ||
    res.coarseLocation === 'granted'
  ));
}

async function gpsEnsureNativeLocationPermission(){
  if(!gpsIsNativeRuntime()) return true;
  try{
    if(window.ccNative && window.ccNative.ensureLocationPermission){
      return gpsPermissionGranted(await window.ccNative.ensureLocationPermission());
    }
    const plugin = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.ChamCongNative;
    if(plugin){
      if(plugin.checkLocationPermission){
        const cur = await plugin.checkLocationPermission();
        if(gpsPermissionGranted(cur)) return true;
      }
      if(plugin.requestLocationPermission){
        return gpsPermissionGranted(await plugin.requestLocationPermission());
      }
    }
    const geo = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Geolocation;
    if(geo){
      if(geo.checkPermissions){
        const cur = await geo.checkPermissions();
        if(gpsPermissionGranted(cur)) return true;
      }
      if(geo.requestPermissions){
        return gpsPermissionGranted(await geo.requestPermissions());
      }
    }
  }catch(e){
    console.warn('[GPS Permission] native request failed:', e);
  }
  return false;
}

/** Lấy vị trí hiện tại — tự động chọn Capacitor hoặc Web API */
function gpsCurrentPosition(onSuccess, onError){
  const api = getGeoAPI();
  // v3: Lấy battery profile để quyết định enableHighAccuracy
  const profile = (typeof GPS_BATTERY_PROFILES !== 'undefined' && typeof _gpsBatteryProfile !== 'undefined')
    ? GPS_BATTERY_PROFILES[_gpsBatteryProfile] || GPS_BATTERY_PROFILES.NORMAL
    : {enableHighAccuracy: true};
  const useHighAcc = profile.enableHighAccuracy !== false;

  function readWebPosition(){
    // FIX timeout (code=3): trước đây timeout 15s + maximumAge 0 (bắt GPS lấy fix
    // mới hoàn toàn) → trong nhà / GPS lạnh thường quá 15s → timeout liên tục.
    // Sửa:
    //  - timeout 30s cho high-accuracy (GPS vệ tinh cần thời gian cold-start)
    //  - maximumAge 30s: cho phép dùng fix gần đây (đỡ phải chờ fix mới mỗi lần)
    //  - Nếu high-accuracy vẫn timeout → tự thử lại 1 lần với low-accuracy
    //    (network/Wi-Fi location — nhanh hơn nhiều, vẫn đủ dùng cho geofence)
    var triedLowAccuracy = false;
    function attempt(highAcc){
      navigator.geolocation.getCurrentPosition(
        function(pos){ onSuccess(pos); },
        function(err){
          if(err && err.code === 3 && highAcc && !triedLowAccuracy){
            triedLowAccuracy = true;
            console.warn('[GPS] high-accuracy timeout — thử lại low-accuracy');
            attempt(false);
            return;
          }
          onError(err);
        },
        {
          enableHighAccuracy: highAcc,
          timeout: highAcc ? 30000 : 15000,
          maximumAge: 30000
        }
      );
    }
    attempt(useHighAcc);
  }

  if(api === 'capacitor'){
    // Native Capacitor — không bị chặn quyền như Chrome
    // timeout 20s (đủ cho GPS lạnh khi không có Wi-Fi assist)
    // maximumAge 30s: cho phép dùng fix gần đây (tiết kiệm pin, ổn định)
    Capacitor.Plugins.Geolocation.getCurrentPosition({
      enableHighAccuracy: useHighAcc,
      timeout: 20000,
      maximumAge: 30000
    }).then(pos => onSuccess(pos))
      .catch(err => onError(err));
  } else if(api === 'web'){
    // Fallback Web API (chạy trong browser thường)
    if(gpsIsNativeRuntime()){
      gpsEnsureNativeLocationPermission()
        .then(ok => {
          if(ok) readWebPosition();
          else onError({code: 1, message: 'Location permission denied'});
        })
        .catch(err => onError(err));
    } else {
      readWebPosition();
    }
  } else {
    onError({code: 0, message: 'Thiết bị không hỗ trợ GPS'});
  }
}

/** Yêu cầu quyền GPS (Capacitor tự xử lý, Web fallback hỏi trình duyệt) */
async function gpsRequestPermission(){
  const api = getGeoAPI();
  const permGuide = document.getElementById('gpsPermGuide');
  const manualBox = document.getElementById('gpsManualBox');

  if(api === 'capacitor'){
    // Capacitor: yêu cầu quyền native Android/iOS
    try{
      const perm = await Capacitor.Plugins.Geolocation.requestPermissions();
      if(perm.location === 'granted'){
        gpsGetCurrentPos();
      } else {
        if(permGuide) permGuide.style.display = 'block';
        if(manualBox) manualBox.style.display = 'block';
      }
    } catch(e){
      gpsGetCurrentPos(); // Thử trực tiếp nếu requestPermissions lỗi
    }
  } else if(api === 'web'){
    // Web fallback: dùng navigator.permissions
    if(navigator.permissions){
      navigator.permissions.query({name:'geolocation'}).then(result => {
        if(result.state === 'denied'){
          if(permGuide) permGuide.style.display = 'block';
          if(manualBox) manualBox.style.display = 'block';
        } else {
          gpsGetCurrentPos();
        }
      }).catch(() => gpsGetCurrentPos());
    } else {
      gpsGetCurrentPos();
    }
  } else {
    if(permGuide) permGuide.style.display = 'block';
    if(manualBox) manualBox.style.display = 'block';
  }
}

function gpsShowHostGuide(){
  const g = document.getElementById('gpsHostGuide');
  if(g) g.style.display = g.style.display === 'none' ? 'block' : 'none';
  return false;
}

/** Lưu tọa độ công ty nhập thủ công */
function gpsSaveManual(){
  const lat = parseFloat(document.getElementById('gpsManualLat')?.value);
  const lng = parseFloat(document.getElementById('gpsManualLng')?.value);
  if(isNaN(lat)||isNaN(lng)||lat<-90||lat>90||lng<-180||lng>180){
    showGpsBanner(u('gps.coords_invalid'), '#E8433A');
    return;
  }
  gpsPersistCompanyLocation(lat, lng, parseInt(document.getElementById('gpsRadius')?.value) || 15);
  saveGpsData();
  updateGpsStatus();
  startGeofencing();
  showGpsBanner(u('gps.saved'),'#0D9E75');
  const pg = document.getElementById('gpsPermGuide');
  if(pg) pg.style.display = 'none';
}

/** Lấy vị trí GPS hiện tại 1 lần để lưu làm vị trí công ty */
function gpsGetCurrentPos(){
  const statusTxt = document.getElementById('gpsStatusTxt');
  const statusDot = document.getElementById('gpsStatusDot');
  const permGuide = document.getElementById('gpsPermGuide');

  if(!getGeoAPI()){
    if(statusTxt) statusTxt.textContent = u('gps.no_device');
    if(statusDot) statusDot.style.background = '#E8433A';
    return;
  }

  if(statusTxt) statusTxt.textContent = u('gps.loading');
  if(statusDot) statusDot.style.background = '#F5A623';

  gpsCurrentPosition(
    pos => {
      gpsPersistCompanyLocation(
        pos.coords.latitude,
        pos.coords.longitude,
        parseInt(document.getElementById('gpsRadius')?.value) || 15
      );
      saveGpsData();
      updateGpsStatus();
      startGeofencing();
      if(permGuide) permGuide.style.display = 'none';
    },
    err => {
      const msgs = {
        1: u('gps.err_denied'),
        2: u('gps.err_position'),
        3: u('gps.err_timeout')
      };
      if(statusTxt) statusTxt.textContent = msgs[err.code] || (u('gps.err_label') + ': ' + err.message);
      if(statusDot) statusDot.style.background = '#E8433A';
      if(err.code === 1 && permGuide){
        permGuide.style.display = 'block';
        const mb = document.getElementById('gpsManualBox');
        if(mb) mb.style.display = 'block';
      }
    }
  );
}

/** Bật/tắt GPS auto check-in */
function togGPS(btn){
  const willEnable = !(btn && btn.classList && btn.classList.contains('on'));
  return gpsSetSmartAutoAttendance(willEnable, 'togGPS-legacy');
}

/** Xóa cài đặt GPS và dừng theo dõi */
function gpsClear(){
  window.__gpsManualOffThisSession = true;
  stopGeofencing();
  _gpsData.lat = null;
  _gpsData.lng = null;
  _gpsData.enabled = false;
  saveGpsData();
  const btn = document.getElementById('togN3');
  if(btn) btn.classList.remove('on');
  notifCfg.n3 = false; saveNotif();
  const card = document.getElementById('gpsSetupCard');
  if(card) card.style.display = 'none';
  updateGpsStatus();
}

/** Cập nhật UI trạng thái GPS */
function updateGpsStatus(){
  const statusTxt = document.getElementById('gpsStatusTxt');
  const statusDot = document.getElementById('gpsStatusDot');
  const coordsBox = document.getElementById('gpsCoordsBox');
  const coordsTxt = document.getElementById('gpsCoordsText');
  if(!statusTxt) return;
  const api = getGeoAPI();
  const apiLabel = api === 'capacitor' ? '📱 Capacitor Native' : api === 'web' ? '🌐 Web GPS' : u('gps.no_gps_api');
  if(_gpsData.lat && _gpsData.lng){
    const inside = _gpsWasInside;
    statusTxt.textContent = inside === true  ? u('gps.in_zone')
                          : inside === false ? u('gps.out_zone')
                          : u('gps.saved');
    statusDot.style.background = inside === true ? '#0D9E75' : inside === false ? '#E8433A' : '#F5A623';
    if(coordsBox) coordsBox.style.display = 'block';
    if(coordsTxt) coordsTxt.innerHTML =
      `${apiLabel}<br>Lat: ${_gpsData.lat.toFixed(6)} | Lng: ${_gpsData.lng.toFixed(6)}<br>` +
      u('gps.coords_line', {r:_gpsData.radius, p:_gpsPollMs/1000});
  } else {
    statusTxt.textContent = u('gps.no_setup');
    statusDot.style.background = '#ccc';
    if(coordsBox) coordsBox.style.display = 'none';
  }
}

/** Tính khoảng cách (mét) giữa 2 điểm GPS theo công thức Haversine */
function gpsDistance(lat1, lng1, lat2, lng2){
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

/* ══════════════════════════════════════════════════════════════════════════════
   GPS ENGINE — Stub layer (Smart Attendance đã thay thế toàn bộ)
   Các hàm bên dưới chỉ delegate sang smart-attendance.js.
   Không có polling, không có debounce, không có trail logging.
   ══════════════════════════════════════════════════════════════════════════════ */

// Giữ lại để capacitor-integration.js không bị crash khi tham chiếu
var GPS_MAX_ACCURACY = 25;
var GPS_ACCURACY_TRUST = 15;
var GPS_ACCURACY_LOG = 200;
var GPS_BUFFER_ZONE = 20;
var GPS_DEBOUNCE_IN = 2;
var GPS_DEBOUNCE_OUT = 5;
var GPS_NEW_CYCLE_WAIT_MS = 8 * 60 * 60 * 1000;
var GPS_OPEN_SHIFT_CONFIRM_MS = 20 * 60 * 60 * 1000;
var GPS_OPEN_SHIFT_PROMPT_COOLDOWN_MS = 5 * 60 * 1000;
var GPS_POLL_SCHEDULE = {
  BUFFER_ZONE: 3000,
  NEAR: 5000,
  INSIDE: 30000,
  FAR_AWAY: 60000
};
var GPS_BATTERY_PROFILES = {
  NORMAL:    { name: 'Normal',    pollMultiplier: 1, enableHighAccuracy: true,  maxAccuracy: 80  },
  LOW_POWER: { name: 'Low Power', pollMultiplier: 3, enableHighAccuracy: false, maxAccuracy: 150 },
  CRITICAL:  { name: 'Critical',  pollMultiplier: 6, enableHighAccuracy: false, maxAccuracy: 200 }
};
var _gpsBatteryProfile = 'NORMAL';

// Biến state tối thiểu (giữ để không crash các hàm đọc chúng)
var _gpsLastPosition  = null;
var _gpsErrorCount    = 0;
var _gpsTrail         = [];
var _gpsLastOutsideAt = 0;
var _gpsBgWatchId     = null;
var _gpsOpenShiftPromptTs = { main: 0, sub: 0 };

function _addGpsTrail(entry){
  try{
    var e = Object.assign({ timestamp: Date.now() }, entry || {});
    _gpsTrail.push(e);
    if(_gpsTrail.length > 200) _gpsTrail.shift();
    return e;
  }catch(err){
    return null;
  }
}

function _classifyAccuracy(acc){
  var n = Number(acc);
  if(!Number.isFinite(n)) return 'REJECT';
  if(n <= GPS_ACCURACY_TRUST) return 'TRUSTED';
  if(n <= GPS_MAX_ACCURACY) return 'NORMAL';
  if(n <= GPS_ACCURACY_LOG) return 'LOG_ONLY';
  return 'REJECT';
}

function _calcSmoothedPosition(samples){
  if(!samples || !samples.length) return null;
  if(samples.length === 1) return samples[0];
  var lat = 0, lng = 0, weightSum = 0;
  samples.forEach(function(p){
    var acc = Math.max(1, Number(p.acc || p.accuracy || GPS_MAX_ACCURACY));
    var w = 1 / acc;
    lat += Number(p.lat) * w;
    lng += Number(p.lng) * w;
    weightSum += w;
  });
  if(!weightSum) return samples[samples.length - 1];
  return {
    lat: lat / weightSum,
    lng: lng / weightSum,
    acc: Math.min.apply(null, samples.map(function(p){ return Number(p.acc || p.accuracy || GPS_MAX_ACCURACY); }))
  };
}

function _calcAdaptivePollMs(dist, wasInside, wasOutside){
  if(dist == null || !Number.isFinite(Number(dist))) return GPS_POLL_SCHEDULE.FAR_AWAY;
  var d = Number(dist);
  var r = gpsActiveRadius(_gpsData && _gpsData.radius);
  if(!wasInside && !wasOutside && d <= r + GPS_BUFFER_ZONE) return GPS_POLL_SCHEDULE.BUFFER_ZONE;
  if(Math.abs(d - r) <= 100) return GPS_POLL_SCHEDULE.NEAR;
  if(d > r + 500) return GPS_POLL_SCHEDULE.FAR_AWAY;
  return wasInside ? GPS_POLL_SCHEDULE.INSIDE : GPS_POLL_SCHEDULE.NEAR;
}

function _distanceToPolygonCenter(lat, lng, polygon){
  if(!polygon || polygon.length < 3) return null;
  var center = polygon.reduce(function(acc, p){
    acc.lat += Number(p.lat);
    acc.lng += Number(p.lng);
    return acc;
  }, {lat:0, lng:0});
  center.lat /= polygon.length;
  center.lng /= polygon.length;
  return gpsDistance(lat, lng, center.lat, center.lng);
}

// ── Migration data sang format multi-location ─────────────────────────────────
function _migrateGpsData(){
  if(_gpsData.locations){ return; }
  _gpsData.locations = {
    main: { lat: _gpsData.lat || null, lng: _gpsData.lng || null, radius: gpsActiveRadius(_gpsData.radius) },
    sub:  { lat: null, lng: null, radius: 15 }
  };
  _gpsData.activeJob = _gpsData.activeJob || 'main';
  saveGpsData();
}

function getActiveGpsLocation(jobKey){
  _migrateGpsData();
  var j = jobKey || _gpsData.activeJob || 'main';
  return (_gpsData.locations && _gpsData.locations[j]) || null;
}

function setActiveGpsJob(jobKey){
  _migrateGpsData();
  if(jobKey !== 'main' && jobKey !== 'sub') return;
  _gpsData.activeJob = jobKey;
  var loc = _gpsData.locations[jobKey];
  if(loc && loc.lat && loc.lng){
    _gpsData.lat = loc.lat;
    _gpsData.lng = loc.lng;
    _gpsData.radius = loc.radius || 15;
  }
  saveGpsData();
  if(_gpsData.enabled && typeof saStopGps === 'function'){
    try{ saStopGps(); }catch(e){}
    if(typeof saEnable === 'function') setTimeout(function(){ saEnable(); }, 300);
  }
  if(typeof updateGpsStatus === 'function') updateGpsStatus();
}

function saveGpsLocationForJob(jobKey, lat, lng, radius){
  _migrateGpsData();
  if(jobKey !== 'main' && jobKey !== 'sub') return;
  if(typeof gpsPersistCompanyLocation === 'function') gpsPersistCompanyLocation(lat, lng, radius, jobKey);
  saveGpsData();
}

// ── Polygon helper (dùng bởi UI / saIsAtWorkGps) ─────────────────────────────
function isInsidePolygon(lat, lng, polygon){
  if(!polygon || polygon.length < 3) return false;
  var inside = false;
  for(var i = 0, j = polygon.length - 1; i < polygon.length; j = i++){
    var xi = polygon[i].lat, yi = polygon[i].lng;
    var xj = polygon[j].lat, yj = polygon[j].lng;
    var intersect = ((yi > lng) !== (yj > lng)) &&
      (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
    if(intersect) inside = !inside;
  }
  return inside;
}

// ── Cycle guard — dùng bởi smart-attendance.js ───────────────────────────────
function gpsDateFromKey(dateKey){
  var p = String(dateKey || '').split('-').map(Number);
  if(p.length !== 3 || p.some(function(n){ return !Number.isFinite(n); })) return null;
  return new Date(p[0], p[1], p[2], 0, 0, 0, 0);
}

function gpsCheckoutTsForRecord(dateKey, rec){
  if(!rec || !rec.out) return 0;
  var base = gpsDateFromKey(dateKey);
  if(!base) return 0;
  var outMin = gpsTimeToMinutes(rec.out, null);
  if(outMin == null) return 0;
  base.setHours(Math.floor(outMin / 60), outMin % 60, 0, 0);
  var inMin = rec.in ? gpsTimeToMinutes(rec.in, null) : null;
  if(inMin != null && outMin <= inMin) base.setDate(base.getDate() + 1);
  return base.getTime();
}

function gpsCheckinTsForRecord(dateKey, rec){
  if(!rec || !rec.in) return 0;
  var base = gpsDateFromKey(dateKey);
  if(!base) return 0;
  var inMin = gpsTimeToMinutes(rec.in, null);
  if(inMin == null) return 0;
  base.setHours(Math.floor(inMin / 60), inMin % 60, 0, 0);
  return base.getTime();
}

function gpsFindLastCheckoutInfo(jobKey){
  var best = null;
  var useSub = jobKey === 'sub';
  if(!attData) return null;
  Object.keys(attData).forEach(function(k){
    var day = attData[k];
    var rec = useSub ? (day && day.sub) : day;
    var ts = gpsCheckoutTsForRecord(k, rec);
    if(ts > 0 && (!best || ts > best.ts))
      best = { ts: ts, dateKey: k, time: rec.out, job: useSub ? 'sub' : 'main' };
  });
  return best;
}

function gpsFindOpenShiftInfo(jobKey){
  var best = null;
  var useSub = jobKey === 'sub';
  if(!attData) return null;
  Object.keys(attData).forEach(function(k){
    var day = attData[k];
    var rec = useSub ? (day && day.sub) : day;
    if(!rec || !rec.in || rec.out) return;
    var ts = gpsCheckinTsForRecord(k, rec);
    if(ts > 0 && (!best || ts > best.ts)){
      best = { ts: ts, dateKey: k, time: rec.in, job: useSub ? 'sub' : 'main' };
    }
  });
  return best;
}

function gpsCycleGuardInfo(jobKey, nowMs){
  var job = (jobKey === 'sub') ? 'sub' : 'main';
  var now = Number(nowMs);
  if(!Number.isFinite(now) || now <= 0) now = Date.now();

  var open = gpsFindOpenShiftInfo(job);
  if(open){
    var elapsed = Math.max(0, now - open.ts);
    return {
      allow: false,
      reason: 'open_shift',
      job: job,
      open: open,
      elapsedMs: elapsed,
      elapsedMin: Math.floor(elapsed / 60000),
      needsLongOpenConfirm: elapsed >= GPS_OPEN_SHIFT_CONFIRM_MS
    };
  }

  var last = gpsFindLastCheckoutInfo(job);
  if(!last){
    return { allow: true, reason: 'ok', job: job, minutesLeft: 0 };
  }
  var left = GPS_NEW_CYCLE_WAIT_MS - (now - last.ts);
  if(left > 0){
    return {
      allow: false,
      reason: 'wait_8h',
      job: job,
      lastCheckout: last,
      leftMs: left,
      minutesLeft: Math.max(0, Math.ceil(left / 60000))
    };
  }
  return { allow: true, reason: 'ok', job: job, minutesLeft: 0, lastCheckout: last };
}

function gpsCanStartNewAutoCycle(jobKey){
  return !!gpsCycleGuardInfo(jobKey).allow;
}

function gpsMinutesUntilNewCycle(jobKey){
  var info = gpsCycleGuardInfo(jobKey);
  return info.reason === 'wait_8h' ? (info.minutesLeft || 0) : 0;
}

function gpsOpenShiftBlockText(info){
  var jobLabel = (info && info.job === 'sub') ? 'Job phụ' : 'Job chính';
  if(!info || !info.open){
    return jobLabel + ': ca trước chưa checkout, chưa thể vào ca mới.';
  }
  return jobLabel + ': ca trước chưa checkout (' + info.open.dateKey + ' ' + info.open.time + ').';
}

function gpsOpenShiftConfirmText(info){
  var hours = Math.max(20, Math.floor((info.elapsedMs || 0) / 3600000));
  var jobLabel = (info && info.job === 'sub') ? 'job phụ' : 'job chính';
  var start = info && info.open ? (info.open.dateKey + ' ' + info.open.time) : 'ca trước';
  return 'Bạn chưa checkout ' + jobLabel + ' từ ' + start + '.\n\n'
    + 'Đã quá ' + hours + ' giờ. Xác nhận checkout ca cũ ngay bây giờ để mở ca mới?';
}

function gpsShouldPromptOpenShift(job, nowMs){
  var key = job === 'sub' ? 'sub' : 'main';
  var now = Number(nowMs);
  if(!Number.isFinite(now) || now <= 0) now = Date.now();
  var last = Number(_gpsOpenShiftPromptTs[key] || 0);
  if(last > 0 && (now - last) < GPS_OPEN_SHIFT_PROMPT_COOLDOWN_MS) return false;
  _gpsOpenShiftPromptTs[key] = now;
  return true;
}

function gpsCloseOpenShift(openInfo, closeMs){
  if(!openInfo || !openInfo.dateKey || !attData) return false;
  var day = attData[openInfo.dateKey];
  if(!day) return false;
  var rec;
  if(openInfo.job === 'sub'){
    if(!day.sub) day.sub = { type: 'cm' };
    rec = day.sub;
  } else {
    rec = day;
  }
  if(!rec || !rec.in || rec.out) return false;
  var t = new Date(Number(closeMs) > 0 ? Number(closeMs) : Date.now());
  rec.out = fmtTime(t);
  rec.type = rec.type || 'cm';
  rec.auto = true;
  rec.autoMethod = 'recover_open_shift';
  saveAtt();
  if(typeof updateTodayStatusTime === 'function') updateTodayStatusTime();
  if(typeof renderHomeStats === 'function') renderHomeStats();
  return true;
}

function gpsEnsureCycleForCheckin(jobKey, opts){
  opts = opts || {};
  var info = gpsCycleGuardInfo(jobKey, opts.nowMs);
  if(info.allow) return { allowed: true, reason: 'ok', info: info };

  if(info.reason === 'wait_8h'){
    if(opts.showBanner !== false && typeof showGpsBanner === 'function'){
      showGpsBanner(u('gps.cycle_wait', { m: info.minutesLeft || 0 }), '#F5A623');
    }
    return { allowed: false, reason: 'wait_8h', minutesLeft: info.minutesLeft || 0, info: info };
  }

  var blockText = gpsOpenShiftBlockText(info);
  if(opts.showBanner !== false && typeof showGpsBanner === 'function'){
    showGpsBanner(blockText, '#F5A623');
  }
  if(!info.needsLongOpenConfirm){
    return { allowed: false, reason: 'open_shift', info: info };
  }

  if(opts.allowConfirm === false){
    return { allowed: false, reason: 'open_shift_confirm_required', info: info };
  }
  if(!gpsShouldPromptOpenShift(info.job, opts.nowMs)){
    return { allowed: false, reason: 'open_shift_prompt_cooldown', info: info };
  }

  var ok = false;
  try{
    ok = window.confirm ? !!window.confirm(gpsOpenShiftConfirmText(info)) : true;
  }catch(e){
    ok = false;
  }
  if(!ok) return { allowed: false, reason: 'open_shift_user_declined', info: info };

  var closeTs = Number(opts.closeMs);
  if(!Number.isFinite(closeTs) || closeTs <= 0) closeTs = Date.now();
  if(!gpsCloseOpenShift(info.open, closeTs)){
    if(opts.showBanner !== false && typeof showGpsBanner === 'function'){
      showGpsBanner('Không thể đóng ca cũ tự động. Vui lòng checkout thủ công trước.', '#E8433A');
    }
    return { allowed: false, reason: 'open_shift_close_failed', info: info };
  }

  if(opts.showBanner !== false && typeof showGpsBanner === 'function'){
    showGpsBanner('✅ Đã checkout ca cũ. Tiếp tục vào ca mới.', '#0D9E75');
  }
  return { allowed: true, reason: 'open_shift_closed', info: info };
}

// ── Banner thông báo nổi ──────────────────────────────────────────────────────
function showGpsBanner(msg, color){
  var banner = document.getElementById('gpsBanner');
  if(!banner){
    banner = document.createElement('div');
    banner.id = 'gpsBanner';
    banner.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);'
      + 'z-index:9999;padding:12px 20px;border-radius:12px;font-size:13px;font-weight:700;'
      + 'font-family:Nunito,sans-serif;color:white;box-shadow:0 4px 20px rgba(0,0,0,.25);'
      + 'transition:opacity .4s;max-width:320px;text-align:center;pointer-events:none';
    document.body.appendChild(banner);
  }
  banner.textContent = msg;
  banner.style.background = color || '#0D9E75';
  banner.style.opacity = '1';
  clearTimeout(banner._timer);
  banner._timer = setTimeout(function(){ banner.style.opacity = '0'; }, 4000);
}

// ── Geofencing stubs — Smart Attendance tự quản lý GPS ───────────────────────
function startGeofencing(){
  // Smart attendance đang chạy → nhường hoàn toàn cho nó, không chạy song song
  if(window._gpsData && window._gpsData.smartAttendanceMode && window._sa && window._sa.enabled) return;
  // Chế độ GPS engine cũ không còn hỗ trợ — bật smartAttendanceMode để chấm công GPS
  console.warn('[GPS] startGeofencing: chỉ hỗ trợ smartAttendanceMode. Bật Smart Attendance để dùng GPS.');
}

function stopGeofencing(options){
  if(typeof saStopGps === 'function') try{ saStopGps(); }catch(e){}
}

function startBackgroundGps(){
  // Native GPS được quản lý bởi smart-attendance — chỉ cần sync config
  try{
    if(window.ccNative && window.ccNative.syncNativeGps){
      window.ccNative.syncNativeGps(_gpsData).catch(function(){});
      _gpsBgWatchId = 'native';
      window._gpsBgWatchId = 'native';
      return true;
    }
  }catch(e){}
  return false;
}

function stopBackgroundGps(){
  _gpsBgWatchId = null;
  window._gpsBgWatchId = null;
  try{
    var plugin = window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.ChamCongNative;
    if(plugin && plugin.stopNativeGps) plugin.stopNativeGps();
  }catch(e){}
}

// Smart Attendance xử lý GPS position nội bộ — không cần làm gì ở đây
function _processGpsPosition(pos){}

function _handleGpsError(err){
  _gpsErrorCount++;
  console.warn('[GPS Error]', err && (err.code || err.message) || err);
}

function setGpsBatteryProfile(profile){
  if(GPS_BATTERY_PROFILES[profile]) _gpsBatteryProfile = profile;
}

// ── Auto check-in / check-out — delegate sang Smart Attendance ────────────────
function gpsAutoCheckin(){
  if(typeof saDoCheckin === 'function'){ saDoCheckin('gps'); return; }
  console.warn('[GPS] gpsAutoCheckin: saDoCheckin chưa sẵn sàng');
}

function gpsAutoCheckout(){
  if(typeof saDoCheckout === 'function'){ saDoCheckout('gps'); return; }
  console.warn('[GPS] gpsAutoCheckout: saDoCheckout chưa sẵn sàng');
}

// ── Public API (giữ interface cũ để capacitor-integration.js không crash) ─────
window.gpsV3 = {
  setActiveJob       : setActiveGpsJob,
  getActiveLocation  : getActiveGpsLocation,
  saveLocationForJob : saveGpsLocationForJob,
  setBatteryProfile  : setGpsBatteryProfile,
  getTrail           : function(){ return _gpsTrail.slice(); },
  isInsidePolygon    : isInsidePolygon,
  startBackground    : startBackgroundGps,
  stopBackground     : stopBackgroundGps,
  restart            : function(){
    if(typeof saStopGps === 'function') try{ saStopGps(); }catch(e){}
    if(typeof saEnable === 'function') setTimeout(function(){ saEnable(); }, 300);
  },
  getStats           : function(){
    return { enabled: _gpsData && _gpsData.enabled, smartMode: true, batteryProfile: _gpsBatteryProfile };
  }
};

window.startBackgroundGps      = startBackgroundGps;
window.stopBackgroundGps       = stopBackgroundGps;
window.gpsAutoCheckin          = gpsAutoCheckin;
window.gpsAutoCheckout         = gpsAutoCheckout;
window.gpsCurrentPosition      = gpsCurrentPosition;
window._processGpsPosition     = _processGpsPosition;
window._addGpsTrail            = _addGpsTrail;
window.toggleGpsTightCompany   = toggleGpsTightCompany;
window.gpsActiveRadius         = gpsActiveRadius;
window.gpsFindLastCheckoutInfo = gpsFindLastCheckoutInfo;
window.gpsFindOpenShiftInfo    = gpsFindOpenShiftInfo;
window.gpsCycleGuardInfo       = gpsCycleGuardInfo;
window.gpsEnsureCycleForCheckin = gpsEnsureCycleForCheckin;
window.gpsCanStartNewAutoCycle = gpsCanStartNewAutoCycle;
window._handleGpsError         = _handleGpsError;
window.showGpsBanner           = showGpsBanner;
window.startGeofencing         = startGeofencing;
window.stopGeofencing          = stopGeofencing;
window.GPS_BATTERY_PROFILES    = GPS_BATTERY_PROFILES;

function gpsResolveRunnableLocation(){
  if(!_gpsData) return null;
  var loc = null;
  try{
    if(typeof gpsGetStoredCompanyLocation === 'function'){
      loc = gpsGetStoredCompanyLocation(_gpsData.activeJob || 'main')
        || gpsGetStoredCompanyLocation('main')
        || gpsGetStoredCompanyLocation('sub');
    }
  }catch(e){}
  if(!loc && typeof gpsHasLocation === 'function' && gpsHasLocation(_gpsData)){
    loc = {
      lat: Number(_gpsData.lat),
      lng: Number(_gpsData.lng),
      radius: (typeof gpsLocationRadius === 'function') ? gpsLocationRadius(_gpsData.radius) : (Number(_gpsData.radius) || 15)
    };
  }
  if(!loc) return null;
  _gpsData.lat = Number(loc.lat);
  _gpsData.lng = Number(loc.lng);
  _gpsData.radius = (typeof gpsLocationRadius === 'function') ? gpsLocationRadius(loc.radius) : (Number(loc.radius) || 15);
  return loc;
}
// ── Logic start GPS thực sự (gọi sau khi đã xác nhận plugin + quyền OK) ───────
function _ensureGpsAutoRunningCore(reason){
  try{
    if(!_gpsData.enabled || !_gpsData.smartAttendanceMode){
      _gpsData.enabled = true;
      _gpsData.smartAttendanceMode = true;
      gpsSetAutoAttendanceUi(true);
      if(window.notifCfg){
        notifCfg.n3 = true;
        if(typeof saveNotif === 'function') saveNotif();
      }
      if(typeof saveGpsData === 'function') saveGpsData();
      console.log('[GPS] auto-start smart attendance:', reason || 'startup');
    }

    if(_gpsData.smartAttendanceMode){
      gpsSetAutoAttendanceUi(true);
      if(typeof window.saEnable === 'function'){
        if(!window._sa || !window._sa.enabled) window.saEnable();
        else if(typeof window.saUpdateUI === 'function') window.saUpdateUI();
      } else {
        setTimeout(function(){
          if(window._gpsData && window._gpsData.smartAttendanceMode && typeof window.saEnable === 'function'){
            window.saEnable();
          }
        }, 800);
      }
      if(typeof gpsSyncNativeNow === 'function') gpsSyncNativeNow();
      else if(window.ccNative && window.ccNative.syncNativeGps) window.ccNative.syncNativeGps(_gpsData).catch(function(){});
      return true;
    }

    var loc = gpsResolveRunnableLocation();
    if(!loc){
      if(typeof updateGpsStatus === 'function') updateGpsStatus();
      console.warn('[GPS] auto-start skipped: no saved location', reason || '');
      return false;
    }

    try{
      var btn = document.getElementById('togN3');
      if(btn) btn.classList.add('on');
      var card = document.getElementById('gpsSetupCard');
      if(card) card.style.display = 'block';
      if(window.notifCfg){
        notifCfg.n3 = true;
        if(typeof saveNotif === 'function') saveNotif();
      }
    }catch(e){}

    if(typeof gpsSyncNativeNow === 'function') gpsSyncNativeNow();
    else if(window.ccNative && window.ccNative.syncNativeGps) window.ccNative.syncNativeGps(_gpsData).catch(function(){});

    if(!_gpsInterval && typeof startGeofencing === 'function'){
      console.log('[GPS] auto-start geofence:', reason || 'ensure');
      startGeofencing();
    } else if(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform()
      && _gpsBgWatchId !== 'native'
      && typeof window.startBackgroundGps === 'function'){
      window.startBackgroundGps();
    }

    if(typeof updateGpsStatus === 'function') updateGpsStatus();
    return true;
  }catch(e){
    console.warn('[GPS] _ensureGpsAutoRunningCore failed:', e);
    return false;
  }
}
// ── Banner xin quyền GPS khi chưa được cấp ───────────────────────────────────
function _gpsShowPermNeeded(reason){
  var banner = document.getElementById('gpsPermNeededBanner');
  if(!banner){
    banner = document.createElement('div');
    banner.id = 'gpsPermNeededBanner';
    banner.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);'
      + 'z-index:9998;width:calc(100% - 32px);max-width:360px;padding:14px 16px;'
      + 'border-radius:16px;background:#1A2332;color:white;font-size:13px;font-weight:800;'
      + 'font-family:Nunito,sans-serif;text-align:center;'
      + 'box-shadow:0 8px 32px rgba(0,0,0,.35)';
    document.body.appendChild(banner);
  }
  banner.innerHTML = '📍 Cần quyền vị trí để chấm công GPS tự động'
    + '<br><button onclick="openNativePermissionSetting(\'location\')"'
    + ' style="margin-top:10px;padding:8px 20px;border:0;border-radius:10px;'
    + 'background:#0D9E75;color:white;font-size:13px;font-weight:800;'
    + 'cursor:pointer;font-family:Nunito,sans-serif">Cấp quyền ngay</button>';
  banner.style.display = 'block';
  console.log('[GPS] permission needed, reason:', reason);
}
function _gpsHidePermNeeded(){
  var banner = document.getElementById('gpsPermNeededBanner');
  if(banner) banner.style.display = 'none';
}
function ensureGpsAutoRunning(reason){
  try{
    if(typeof loadGpsData === 'function') loadGpsData();
    if(!_gpsData) return false;
    if(window.__gpsManualOffThisSession) return false;

    // ── Kiểm tra plugin + quyền GPS trước khi start (chỉ trong APK) ──────────
    var isCapNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
    if(isCapNative){
      // ccNative chưa sẵn sàng → defer, sẽ được gọi lại bởi 'ccNative-ready'
      if(!window.ccNative) return false;
      // Plugin ChamCongNative phải tồn tại
      if(!window.ccNative.plugins || !window.ccNative.plugins.CN){
        _gpsShowPermNeeded('plugin-not-ready');
        return false;
      }
      // Kiểm tra quyền vị trí async
      window.ccNative.checkLocationPermission().then(function(perm){
        var granted = !!(perm && (perm.location === 'granted'
          || perm.fineLocation === 'granted'
          || perm.coarseLocation === 'granted'));
        if(granted){
          _gpsHidePermNeeded();
          _ensureGpsAutoRunningCore(reason);
        } else {
          _gpsShowPermNeeded('denied');
        }
      }).catch(function(){
        // Không check được → cứ start (fallback an toàn)
        _ensureGpsAutoRunningCore(reason);
      });
      return true; // async đang xử lý
    }

    // Browser/non-native → không cần check permission
    _ensureGpsAutoRunningCore(reason);
    return true;
  }catch(e){
    console.warn('[GPS] ensureGpsAutoRunning failed:', e);
    return false;
  }
}

function scheduleGpsAutoStart(reason){
  [0, 700, 2000, 5000].forEach(function(delay){
    setTimeout(function(){ ensureGpsAutoRunning((reason || 'auto') + '+' + delay); }, delay);
  });
}

window.gpsResolveRunnableLocation = gpsResolveRunnableLocation;
window.ensureGpsAutoRunning = ensureGpsAutoRunning;
window.gpsScheduleAutoStart = scheduleGpsAutoStart;

function gpsSetAutoAttendanceUi(enabled){
  var on = !!enabled;
  var gpsBtn = document.getElementById('togN3');
  if(gpsBtn) gpsBtn.classList.toggle('on', on);
  var saBtn = document.getElementById('togSA');
  if(saBtn) saBtn.classList.toggle('on', on);
  var card = document.getElementById('gpsSetupCard');
  if(card) card.style.display = on ? 'block' : 'none';
  if(window.notifCfg) notifCfg.n3 = on;
}

function gpsSetSmartAutoAttendance(enabled, reason){
  var on = !!enabled;
  window.__gpsManualOffThisSession = !on;
  if(typeof loadGpsData === 'function') loadGpsData();
  _gpsData.enabled = on;
  _gpsData.smartAttendanceMode = on;
  gpsSetAutoAttendanceUi(on);

  if(on){
    if(typeof window.saEnable === 'function'){
      window.saEnable();
    } else {
      setTimeout(function(){
        if(window._gpsData && window._gpsData.smartAttendanceMode && typeof window.saEnable === 'function'){
          window.saEnable();
        }
      }, 800);
    }
  } else {
    if(typeof window.saDisable === 'function') window.saDisable();
    if(typeof stopGeofencing === 'function') stopGeofencing();
  }

  if(typeof saveNotif === 'function') saveNotif();
  if(typeof saveGpsData === 'function') saveGpsData();
  if(typeof updateGpsStatus === 'function') updateGpsStatus();
  _addGpsTrail({type:'SMART_AUTO_TOGGLE', enabled:on, reason:reason || 'toggle'});
  return true;
}

window.gpsSetSmartAutoAttendance = gpsSetSmartAutoAttendance;

function installGpsResumeHooks(){
  if(window.__gpsAutoStartHooksInstalled) return;
  window.__gpsAutoStartHooksInstalled = true;
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ scheduleGpsAutoStart('dom-ready'); });
  } else {
    scheduleGpsAutoStart('dom-ready');
  }
  window.addEventListener('focus', function(){ setTimeout(function(){ ensureGpsAutoRunning('window-focus'); }, 250); });
  document.addEventListener('visibilitychange', function(){
    if(!document.hidden) setTimeout(function(){ ensureGpsAutoRunning('visible'); }, 250);
  });
}

function installCapacitorGpsResumeHook(){
  if(window.__gpsCapacitorResumeHookInstalled) return;
  var App = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
  if(!App || !App.addListener) return;
  window.__gpsCapacitorResumeHookInstalled = true;
  try{
    App.addListener('appStateChange', function(state){
      if(state && state.isActive) setTimeout(function(){ ensureGpsAutoRunning('appState-active'); }, 250);
    });
  }catch(e){}
}

installGpsResumeHooks();
installCapacitorGpsResumeHook();
setTimeout(installCapacitorGpsResumeHook, 2000);
// Note: _gpsData, _gpsBgWatchId, _gpsLastPosition, _gpsPositionHistory, _gpsBatteryProfile
// are already exposed automatically via top-level `var` declarations.
// We DON'T redefine them as accessors (would throw "Cannot redefine property").
// The values stay in sync because top-level vars in classic script ARE properties of window.


/** Đọc cài đặt GPS từ localStorage */
function loadGpsData(){
  const g = lsGet('cp22_gps');
  if(g) _gpsData = Object.assign(_gpsData, g);
  _gpsData.tightCompanyGps = !!_gpsData.tightCompanyGps;
  _gpsData.smartAttendanceMode = _gpsData.enabled ? true : !!_gpsData.smartAttendanceMode;
  _gpsData.insideScheduleOut = false;
  if(typeof gpsApplyDefaultRadiusMigration === 'function') gpsApplyDefaultRadiusMigration();
  if(typeof gpsRepairLocationPersistence === 'function'){
    gpsRepairLocationPersistence();
    lsSet('cp22_gps', _gpsData);
  }
}

/** Lưu cài đặt GPS vào localStorage */
function saveGpsData(){
  if(typeof gpsRepairLocationPersistence === 'function') gpsRepairLocationPersistence();
  _gpsData.tightCompanyGps = !!_gpsData.tightCompanyGps;
  _gpsData.smartAttendanceMode = _gpsData.enabled ? true : !!_gpsData.smartAttendanceMode;
  _gpsData.insideScheduleOut = false;
  lsSet('cp22_gps', _gpsData);
  try{ gpsSyncNativeNow(); }catch(e){}
}

// FIX P3 #7: debounce 300ms khi user kéo slider GPS (gpsRadius/gpsCheckinDelay/gpsCheckoutDelay).
// Trước đây mỗi event input ghi cp22_gps + sync native ngay → log thấy 5-10 lần ghi cho 1 lần kéo.
// _gpsData vẫn được update vào RAM ngay (giữ UI responsive), chỉ phần persist + sync native là debounce.
var _gpsSliderSaveTimer = null;
function gpsSliderSaveDebounced(){
  if(_gpsSliderSaveTimer) clearTimeout(_gpsSliderSaveTimer);
  _gpsSliderSaveTimer = setTimeout(function(){
    _gpsSliderSaveTimer = null;
    saveGpsData();
  }, 300);
}
window.gpsSliderSaveDebounced = gpsSliderSaveDebounced;

/** Bật/tắt GPS auto check-in: hiện/ẩn panel cấu hình */
function togGPS(btn){
  const willEnable = !(btn && btn.classList && btn.classList.contains('on'));
  return gpsSetSmartAutoAttendance(willEnable, 'togGPS');
}

/** Yêu cầu quyền GPS — hiển thị hướng dẫn + form nhập thủ công */
function gpsRequestPermission(){
  const permGuide = document.getElementById('gpsPermGuide');
  const manualBox = document.getElementById('gpsManualBox');
  // Kiểm tra xem trình duyệt có hỗ trợ GPS không
  if(!navigator.geolocation){
    if(permGuide) permGuide.style.display = 'block';
    if(manualBox) manualBox.style.display = 'block';
    return;
  }
  // Thử kiểm tra quyền trước (API mới hơn)
  if(navigator.permissions){
    navigator.permissions.query({name:'geolocation'})
      .then(result => {
        if(result.state === 'denied'){
          // Bị từ chối → hiện hướng dẫn + form nhập tay
          if(permGuide) permGuide.style.display = 'block';
          if(manualBox) manualBox.style.display = 'block';
        } else {
          gpsGetCurrentPos();
        }
      })
      .catch(() => gpsGetCurrentPos()); // fallback nếu API permission không hỗ trợ
  } else {
    gpsGetCurrentPos(); // Trực tiếp lấy vị trí
  }
}

/** Toggle hướng dẫn mở server cục bộ */
function gpsShowHostGuide(){
  const g = document.getElementById('gpsHostGuide');
  if(g) g.style.display = g.style.display === 'none' ? 'block' : 'none';
  return false;
}

/** Lưu tọa độ nhập thủ công từ Google Maps */
function gpsSaveManual(){
  const lat = parseFloat(document.getElementById('gpsManualLat')?.value);
  const lng = parseFloat(document.getElementById('gpsManualLng')?.value);
  // Kiểm tra tọa độ hợp lệ
  if(isNaN(lat)||isNaN(lng)||lat<-90||lat>90||lng<-180||lng>180){
    showGpsBanner('Tọa độ không hợp lệ. Kiểm tra lại.','#E8433A');
    return;
  }
  gpsPersistCompanyLocation(lat, lng, parseInt(document.getElementById('gpsRadius')?.value) || 15);
  saveGpsData();
  updateGpsStatus();
  startGeofencing(); // Bắt đầu theo dõi ngay sau khi lưu
  showGpsBanner(u('gps.saved'),'#0D9E75');
  const pg = document.getElementById('gpsPermGuide');
  if(pg) pg.style.display = 'none';
}

/** Lấy vị trí GPS hiện tại 1 lần để lưu làm vị trí công ty */
function gpsGetCurrentPos(){
  const statusTxt = document.getElementById('gpsStatusTxt');
  const statusDot = document.getElementById('gpsStatusDot');
  const permGuide = document.getElementById('gpsPermGuide');
  if(!navigator.geolocation){
    if(statusTxt) statusTxt.textContent = u('gps.no_device');
    if(statusDot) statusDot.style.background = '#E8433A';
    return;
  }
  if(statusTxt) statusTxt.textContent = u('gps.loading');
  if(statusDot) statusDot.style.background = '#F5A623';
  navigator.geolocation.getCurrentPosition(
    pos => {
      // Thành công → lưu vị trí công ty
      gpsPersistCompanyLocation(
        pos.coords.latitude,
        pos.coords.longitude,
        parseInt(document.getElementById('gpsRadius')?.value) || 15
      );
      saveGpsData();
      updateGpsStatus();
      startGeofencing();
      if(permGuide) permGuide.style.display = 'none';
    },
    err => {
      // Thất bại → hiện thông báo lỗi và hướng dẫn
      const msgs = {
        1: u('gps.err_denied'),
        2: u('gps.err_position'),
        3: u('gps.err_timeout')
      };
      if(statusTxt) statusTxt.textContent = msgs[err.code] || u('gps.err_label');
      if(statusDot) statusDot.style.background = '#E8433A';
      if(err.code === 1 && permGuide){
        permGuide.style.display = 'block';
        const mb = document.getElementById('gpsManualBox');
        if(mb) mb.style.display = 'block';
      }
    },
    {enableHighAccuracy: true, timeout: 15000, maximumAge: 0}
  );
}

/** Xóa cài đặt GPS và dừng theo dõi */
function gpsClear(){
  window.__gpsManualOffThisSession = true;
  stopGeofencing();
  _gpsData.lat = null;
  _gpsData.lng = null;
  _gpsData.enabled = false;
  saveGpsData();
  const btn = document.getElementById('togN3');
  if(btn) btn.classList.remove('on');
  notifCfg.n3 = false; saveNotif();
  const card = document.getElementById('gpsSetupCard');
  if(card) card.style.display = 'none';
  updateGpsStatus();
}

/** Cập nhật UI trạng thái GPS (đang trong/ngoài khu vực, tọa độ) */
function updateGpsStatus(){
  const statusTxt = document.getElementById('gpsStatusTxt');
  const statusDot = document.getElementById('gpsStatusDot');
  const coordsBox = document.getElementById('gpsCoordsBox');
  const coordsTxt = document.getElementById('gpsCoordsText');
  if(!statusTxt) return;
  if(_gpsData.lat && _gpsData.lng){
    const inside = _gpsWasInside;
    statusTxt.textContent = inside === true  ? u('gps.in_zone')
                          : inside === false ? u('gps.out_zone')
                          : u('gps.saved');
    statusDot.style.background = inside === true ? '#0D9E75' : inside === false ? '#E8433A' : '#F5A623';
    if(coordsBox) coordsBox.style.display = 'block';
    if(coordsTxt) coordsTxt.innerHTML =
      `Lat: ${_gpsData.lat.toFixed(6)} | Lng: ${_gpsData.lng.toFixed(6)} | R: ${_gpsData.radius}m<br>` +
      u('gps.coords_line', {r:_gpsData.radius, p:_gpsPollMs/1000});
  } else {
    statusTxt.textContent = u('gps.no_setup');
    statusDot.style.background = '#ccc';
    if(coordsBox) coordsBox.style.display = 'none';
  }
}

/** Tính khoảng cách (mét) giữa 2 điểm GPS theo công thức Haversine */
function gpsDistance(lat1, lng1, lat2, lng2){
  const R = 6371000; // Bán kính Trái Đất (mét)
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

/* showGpsBanner and helpers below */
function showGpsBanner(msg, color){
  let banner = document.getElementById('gpsBanner');
  if(!banner){
    banner = document.createElement('div');
    banner.id = 'gpsBanner';
    banner.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);'
      + 'z-index:9999;padding:12px 20px;border-radius:12px;font-size:13px;font-weight:700;'
      + 'font-family:Nunito,sans-serif;color:white;box-shadow:0 4px 20px rgba(0,0,0,.25);'
      + 'transition:opacity .4s;max-width:320px;text-align:center;pointer-events:none';
    document.body.appendChild(banner);
  }
  banner.textContent = msg;
  banner.style.background = color || '#0D9E75';
  banner.style.opacity = '1';
  clearTimeout(banner._timer);
  banner._timer = setTimeout(() => { banner.style.opacity = '0'; }, 4000);
}


/** Render nội dung panel Hướng dẫn theo ngôn ngữ hiện tại */
