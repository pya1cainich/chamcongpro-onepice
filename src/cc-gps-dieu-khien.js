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
