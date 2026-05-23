/* ═══════════════════════════════════════════════════════════════════════════════
   4. TÍN HIỆU — Đọc Wi-Fi, GPS
   ═══════════════════════════════════════════════════════════════════════════════ */

/** Đọc Wi-Fi hiện tại qua native bridge */
function saGetWifi(callback){
  if(window.ccNative && window.ccNative.getWifiInfo){
    window.ccNative.getWifiInfo().then(function(info){
      callback(info);
    }).catch(function(){
      callback(null);
    });
  } else {
    // Fallback: không có native → không có Wi-Fi info
    callback(null);
  }
}

// (Đã bỏ saGetBts — không còn đọc BTS/Cell Tower)

/** Đọc GPS 1 lần (dùng API hiện có) */
function saGetGps(callback){
  if(typeof gpsCurrentPosition === 'function'){
    gpsCurrentPosition(
      function(pos){
        callback({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy || 50
        });
      },
      function(err){
        // Log chi tiết để debug (err thường non-enumerable)
        var code = err && err.code !== undefined ? err.code : '?';
        var msg  = err && err.message ? err.message : 'unknown';
        console.warn('[SA] GPS error: code=' + code + ' msg=' + msg);
        callback(null);
      }
    );
  } else if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      function(pos){
        callback({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy || 50
        });
      },
      function(){ callback(null); },
      // FIX timeout: nới 15s → 30s cho high-accuracy (GPS cold-start cần thời gian).
      // Fallback này chỉ chạy khi gpsCurrentPosition (checkin.js) không tồn tại.
      {enableHighAccuracy: true, timeout: 30000, maximumAge: 30000}
    );
  } else {
    callback(null);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════════
   5. SO KHỚP TÍN HIỆU — Kiểm tra match với hồ sơ
   ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * Kiểm tra Wi-Fi hiện tại có khớp với danh sách hồ sơ không.
 * STRICT BSSID-FIRST: nếu cả profile và Wi-Fi hiện tại đều có BSSID
 * → BẮT BUỘC khớp BSSID (KHÔNG fallback SSID nữa). Tránh bị giả mạo
 * bằng router cùng tên SSID nhưng MAC khác (vd: Wi-Fi tên giống ở quán cà phê).
 * Chỉ dùng SSID khi entry cũ chưa có BSSID (backward compat) hoặc OS không trả BSSID.
 */
function saMatchWifi(currentWifi, profileWifiList){
  if(!currentWifi || !currentWifi.connected || !currentWifi.ssid) return false;
  if(!profileWifiList || profileWifiList.length === 0) return false;
  var curBssid = currentWifi.bssid ? String(currentWifi.bssid).toLowerCase() : '';
  for(var i = 0; i < profileWifiList.length; i++){
    var p = profileWifiList[i];
    var pBssid = p.bssid ? String(p.bssid).toLowerCase() : '';
    // Trường hợp 1: cả 2 đều có BSSID → khớp BSSID là tin cậy duy nhất
    if(pBssid && curBssid){
      if(pBssid === curBssid) return true;
      continue; // BSSID khác nhau → entry này KHÔNG khớp, không fallback SSID
    }
    // Trường hợp 2: thiếu BSSID ở 1 bên (entry cũ hoặc OS không trả) → SSID dự phòng
    if(p.ssid && currentWifi.ssid && p.ssid === currentWifi.ssid){
      return true;
    }
  }
  return false;
}

// (Đã bỏ toàn bộ hàm so khớp BTS: saValidBts, saSameBts, saBtsExists,
//  saBtsIsAmbiguous, saHasUsableBts, saMatchBts — không còn dùng BTS)

function saGpsDistanceToProfile(currentGps, profileGps){
  if(!currentGps || !profileGps) return null;
  var curLat = Number(currentGps.lat), curLng = Number(currentGps.lng);
  var profLat = Number(profileGps.lat), profLng = Number(profileGps.lng);
  if(!Number.isFinite(curLat) || !Number.isFinite(curLng) || !Number.isFinite(profLat) || !Number.isFinite(profLng)) return null;
  var dist = gpsDistance(curLat, curLng, profLat, profLng);
  return Number.isFinite(dist) ? dist : null;
}

function saGpsRadius(profileGps, fallback){
  var r = profileGps ? Number(profileGps.radius) : 0;
  return Number.isFinite(r) && r > 0 ? r : fallback;
}

function saGpsExitBuffer(currentGps){
  var acc = currentGps ? Number(currentGps.accuracy || currentGps.acc) : 0;
  if(!Number.isFinite(acc) || acc <= 0) return TIMING.GPS_WORK_EXIT_BUFFER_MIN_M;
  return Math.min(TIMING.GPS_WORK_EXIT_BUFFER_MAX_M, Math.max(TIMING.GPS_WORK_EXIT_BUFFER_MIN_M, acc * 2.5));
}

/**
 * GPS-only decision cho công ty.
 * Nếu nhà và công ty quá gần nhau, không dùng mỗi bán kính vì vùng có thể chồng lên nhau.
 * Khi GPS gần nhà hơn rõ rệt, trả "home"/"ambiguous" thay vì "outside" để state machine
 * không nhảy sai chỉ vì một mẫu GPS lệch.
 */
function saGpsWorkState(currentGps, profileGps){
  var workDist = saGpsDistanceToProfile(currentGps, profileGps);
  if(workDist == null) return null;
  var workRadius = saGpsRadius(profileGps, 100);
  var buffer = saGpsExitBuffer(currentGps);
  var homeGps = _sa.home && _sa.home.gps;
  var homeDist = saGpsDistanceToProfile(currentGps, homeGps);
  var homeWorkDist = saGpsDistanceToProfile(homeGps, profileGps);
  var closeProfiles = homeWorkDist != null && homeWorkDist <= TIMING.GPS_HOME_WORK_CLOSE_M;

  if(closeProfiles && homeDist != null){
    var margin = TIMING.GPS_WORK_HOME_MARGIN_M;
    var homeRadius = saGpsRadius(homeGps, 200);
    if(homeDist + margin < workDist){
      return homeDist <= (homeRadius + buffer) ? 'home' : 'ambiguous';
    }
    if(workDist <= workRadius) return 'inside';
    if(workDist <= workRadius + buffer) return 'ambiguous';
    return 'outside';
  }

  if(workDist <= workRadius) return 'inside';
  if(workDist <= workRadius + buffer) return 'ambiguous';
  return 'outside';
}

/** Kiểm tra GPS hiện tại có trong vùng công ty không */
function saGpsInside(currentGps, profileGps){
  var state = saGpsWorkState(currentGps, profileGps);
  if(state === 'inside') return true;
  if(state === 'outside') return false;
  return null;
}

function saSignalFresh(kind, maxAge){
  var ts = _sa.signals && _sa.signals.ts ? Number(_sa.signals.ts[kind]) : 0;
  return !!ts && (Date.now() - ts) <= maxAge;
}

function saWifiFresh(){ return saSignalFresh('wifi', TIMING.WIFI_SIGNAL_FRESH_MS); }
// saBtsFresh đã bỏ — không còn dùng BTS
function saGpsFresh(){ return saSignalFresh('gps', TIMING.GPS_SIGNAL_FRESH_MS); }

/**
 * Wi-Fi không khả dụng (đã tắt radio hoặc không kết nối mạng nào).
 * Khi này phải bật GPS làm backup vì Wi-Fi không còn dùng được để xác định vị trí.
 */
function saWifiUnavailable(){
  if(!saWifiFresh()) return false; // chưa có dữ liệu mới → chưa kết luận được
  var w = _sa.signals.wifi;
  if(!w) return true;              // null → Wi-Fi tắt
  return w.connected !== true;     // có info nhưng không kết nối
}

/** Kiểm tra GPS gần nhà (nếu có GPS nhà) */
function saGpsNearHome(currentGps){
  if(!currentGps || !_sa.home.gps) return null;
  var dist = saGpsDistanceToProfile(currentGps, _sa.home.gps);
  if(dist == null) return null;
  var workGps = saGetWorkProfile().gps;
  var workDist = saGpsDistanceToProfile(currentGps, workGps);
  var homeWorkDist = saGpsDistanceToProfile(_sa.home.gps, workGps);
  if(homeWorkDist != null && homeWorkDist <= TIMING.GPS_HOME_WORK_CLOSE_M && workDist != null){
    if(workDist + TIMING.GPS_WORK_HOME_MARGIN_M < dist) return false;
  }
  var radius = _sa.home.gps.radius || 200; // bán kính nhà rộng hơn
  return dist <= radius;
}

/** Hồ sơ nhà có Wi-Fi không */
function saHomeHasWifi(){ return _sa.home.wifi && _sa.home.wifi.length > 0; }

// saHomeHasBts đã bỏ — không còn dùng BTS

/** Hồ sơ nhà có GPS không */
function saHomeHasGps(){ return !!_sa.home.gps; }

/** Đang ở nhà theo GPS không */
function saIsAtHomeGps(){
  return saGpsFresh() && saGpsNearHome(_sa.signals.gps) === true;
}

/** Hồ sơ công ty có Wi-Fi không */
function saWorkHasWifi(){ var p=saGetWorkProfile(); return p.wifi && p.wifi.length > 0; }

/** Hồ sơ công ty có GPS không */
function saWorkHasGps(){ return !!saGetWorkProfile().gps; }

/** Đang ở nhà? (theo tín hiệu hiện tại) */
function saIsAtHome(){
  var sig = _sa.signals;
  var wifiFresh = saWifiFresh();
  // 1) Wi-Fi nhà match → chắc chắn ở nhà
  if(wifiFresh && saHomeHasWifi() && saMatchWifi(sig.wifi, _sa.home.wifi)){
    return true;
  }
  // 2) GPS gần nhà (fallback khi Wi-Fi tắt/mất; cần đã lưu GPS nhà)
  if(saHomeHasGps() && saIsAtHomeGps()){
    return true;
  }
  return false;
}

/** Đã rời nhà? (theo tín hiệu hiện tại) */
function saHasLeftHome(){
  var sig = _sa.signals;
  var wifiFresh = saWifiFresh();
  // Fast path: GPS xác nhận đi xa nhà → rời nhà
  if(saHomeHasGps() && saGpsFresh() && saGpsNearHome(sig.gps) === false){
    return true;
  }
  // Mất Wi-Fi nhà → coi như rời (sau khi BTS bị bỏ, Wi-Fi là tín hiệu chính)
  if(saHomeHasWifi()){
    return wifiFresh && !saMatchWifi(sig.wifi, _sa.home.wifi);
  }
  return false;
}

/**
 * FIX P1 #2: Debounce 60s cho việc rời nhà — chỉ trả true khi tín hiệu nhà
 * mất LIÊN TỤC trong HOME_LEAVE_DEBOUNCE_MS. Tránh dao động HOME ↔ LEAVING_HOME
 * khi Wi-Fi rớt 1 nhịp do roaming/handoff giữa các AP.
 *
 * Cách dùng: thay saHasLeftHome() bằng saConfirmedLeftHome(now) ở case STATE.HOME.
 * Khi tín hiệu nhà có lại → tự reset homeSignalLostAt.
 */
function saConfirmedLeftHome(now){
  if(!saHasLeftHome()){
    if(_sa.homeSignalLostAt) _sa.homeSignalLostAt = 0;
    return false;
  }
  if(!_sa.homeSignalLostAt) _sa.homeSignalLostAt = now;
  return (now - _sa.homeSignalLostAt) >= TIMING.HOME_LEAVE_DEBOUNCE_MS;
}

/** Đang ở công ty? (theo Wi-Fi) */
function saIsAtWorkWifi(){
  return saWifiFresh() && saWorkHasWifi() && saMatchWifi(_sa.signals.wifi, saGetWorkProfile().wifi);
}

/** Đang ở công ty? (theo GPS) */
function saIsAtWorkGps(){
  return saGpsFresh() && _sa.signals.gpsInside === true;
}

/**
 * Đang KẾT NỐI VÀO 1 trong các Wi-Fi ĐÃ LƯU (nhà / công ty / việc phụ) không?
 * Đây là điều kiện quyết định bật/tắt GPS:
 *   - Kết nối Wi-Fi đã lưu → "có tín hiệu" → tắt GPS
 *   - Mất Wi-Fi HOẶC kết nối Wi-Fi lạ → "mất tín hiệu" → bật GPS
 * Wi-Fi lạ (vd quán cà phê) không được tính vì app không biết đó là ở đâu.
 */
function saIsConnectedToSavedWifi(){
  var sig = _sa.signals.wifi;
  if(!sig || !sig.connected) return false;
  if(saMatchWifi(sig, _sa.home.wifi)) return true;
  if(saMatchWifi(sig, _sa.work.wifi)) return true;
  if(_sa.subWork && saMatchWifi(sig, _sa.subWork.wifi)) return true;
  return false;
}

