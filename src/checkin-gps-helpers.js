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

