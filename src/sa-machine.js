/* ═══════════════════════════════════════════════════════════════════════════════
   7. GPS CONTROL — Bật/tắt GPS theo trạng thái
   ═══════════════════════════════════════════════════════════════════════════════ */

/** Bật GPS polling với tần suất nhất định */
function saStartGps(intervalMs){
  intervalMs = intervalMs || TIMING.GPS_POLL_TRAVEL_MS;
  if(_sa.gpsActive && _saTimers.gps && _saTimers.gpsIntervalMs === intervalMs) return;
  saStopGps();
  _sa.gpsActive = true;
  _saTimers.gpsIntervalMs = intervalMs;
  // Poll ngay lần đầu
  saGpsPoll();
  // Đặt interval
  _saTimers.gps = setInterval(saGpsPoll, intervalMs);
  saLog('GPS_ON', 'interval=' + Math.round(intervalMs / 1000) + 's');
}

/** Tắt GPS polling */
function saStopGps(){
  if(!_saTimers.gps && !_sa.gpsActive) return;
  if(_saTimers.gps){
    clearInterval(_saTimers.gps);
    _saTimers.gps = null;
  }
  _saTimers.gpsIntervalMs = 0;
  _sa.gpsActive = false;
}

var _saGpsWakeupTimer = null;

/** Huỷ timer đánh thức GPS */
function _saCancelGpsWakeup(){
  if(_saGpsWakeupTimer){ clearTimeout(_saGpsWakeupTimer); _saGpsWakeupTimer = null; }
  try{ lsSet('cp22_sa_gps_wakeup_at', null); }catch(e){}
}

/**
 * Đặt timer đánh thức GPS sau 8h kể từ lúc ra ca.
 * Sau 8h → reset todayCheckedIn/Out + saEvaluate() để GPS bắt đầu poll
 * chuẩn bị sẵn trước khi chu kỳ 8h kết thúc.
 * Nếu app bị kill, wakeupAt được lưu localStorage — saEnable() sẽ phục hồi.
 */
function _saScheduleGpsWakeup(){
  _saCancelGpsWakeup();
  var wakeupAt = Date.now() + TIMING.GPS_WAKEUP_AFTER_OUT_MS;
  try{ lsSet('cp22_sa_gps_wakeup_at', wakeupAt); }catch(e){}
  _saGpsWakeupTimer = setTimeout(function(){
    _saGpsWakeupTimer = null;
    try{ lsSet('cp22_sa_gps_wakeup_at', null); }catch(e){}
    if(!_sa || !_sa.enabled) return;
    saLog('GPS_WAKEUP', '8h sau ra ca — reset chu ky va danh thuc GPS');
    // Reset flag ngày để cho phép saEvaluate bắt đầu theo dõi lại
    _sa.todayCheckedIn = false;
    _sa.todayCheckedOut = false;
    _sa.todayCheckedInSub = false;
    _sa.todayCheckedOutSub = false;
    _sa.state = STATE.HOME;
    _sa.stateChangedAt = Date.now();
    saSave();
    saEvaluate();
  }, TIMING.GPS_WAKEUP_AFTER_OUT_MS);
  saLog('GPS_WAKEUP_SCHEDULED', '8h sau ra ca');
}

/**
 * Phục hồi wakeup timer khi app khởi động lại (nếu còn thời gian chưa hết)
 */
function _saRestoreGpsWakeup(){
  try{
    var wakeupAt = lsGet('cp22_sa_gps_wakeup_at');
    if(!wakeupAt) return;
    var remaining = wakeupAt - Date.now();
    if(remaining <= 0){
      // Timer đã hết trong lúc app bị kill → wake up ngay
      lsSet('cp22_sa_gps_wakeup_at', null);
      if(!_sa || !_sa.enabled) return;
      saLog('GPS_WAKEUP_RESTORED', 'timer da het trong luc app tat — wake up ngay');
      _sa.todayCheckedIn = false;
      _sa.todayCheckedOut = false;
      _sa.state = STATE.HOME;
      _sa.stateChangedAt = Date.now();
      saSave();
    } else {
      // Còn thời gian → đặt lại timer với thời gian còn lại
      _saGpsWakeupTimer = setTimeout(function(){
        _saGpsWakeupTimer = null;
        try{ lsSet('cp22_sa_gps_wakeup_at', null); }catch(e){}
        if(!_sa || !_sa.enabled) return;
        saLog('GPS_WAKEUP_RESTORED', '8h da du — wake up GPS');
        _sa.todayCheckedIn = false;
        _sa.todayCheckedOut = false;
        _sa.state = STATE.HOME;
        _sa.stateChangedAt = Date.now();
        saSave();
        saEvaluate();
      }, remaining);
      saLog('GPS_WAKEUP_RESTORED', 'con ' + Math.round(remaining / 60000) + ' phut');
    }
  }catch(e){}
}

/** GPS poll 1 lần */
function saGpsPoll(){
  saGetGps(function(gps){
    _sa.signals.gps = gps;
    _sa.signals.ts.gps = Date.now();
    if(gps && saWorkHasGps()){
      _sa.signals.gpsInside = saGpsInside(gps, saGetWorkProfile().gps);
    } else {
      _sa.signals.gpsInside = null;
    }
    try{ _gpsWasInside = _sa.signals.gpsInside; }catch(e){}
    try{ if(typeof updateGpsStatus === 'function') updateGpsStatus(); }catch(e){}
    // Trigger state machine sau khi có GPS mới
    saRequestEvaluate();
  });
}

/* ═══════════════════════════════════════════════════════════════════════════════
   8. POLLING — Wi-Fi định kỳ
   ═══════════════════════════════════════════════════════════════════════════════ */

/** Bắt đầu poll Wi-Fi */
function saStartWifiPoll(){
  if(_saTimers.wifi) return;
  saWifiPoll(); // poll ngay
  _saTimers.wifi = setInterval(saWifiPoll, TIMING.WIFI_POLL_MS);
}

/** Dừng poll Wi-Fi */
function saStopWifiPoll(){
  if(_saTimers.wifi){ clearInterval(_saTimers.wifi); _saTimers.wifi = null; }
}

/** Poll Wi-Fi 1 lần.
 *  Nếu trạng thái "đang kết nối Wi-Fi ĐÃ LƯU" đổi (vừa rớt / vừa bắt được Wi-Fi
 *  đã lưu / chuyển sang Wi-Fi lạ) → gọi saConfigurePolling bật/tắt GPS.
 *  Wi-Fi lạ KHÔNG được tính là "có tín hiệu" — vẫn coi như mất Wi-Fi.
 */
function saWifiPoll(){
  var prevMatched = saIsConnectedToSavedWifi();
  saGetWifi(function(info){
    _sa.signals.wifi = info;
    _sa.signals.ts.wifi = Date.now();
    var nowMatched = saIsConnectedToSavedWifi();
    if(prevMatched !== nowMatched){
      // Trạng thái "Wi-Fi đã lưu" đổi → re-cấu hình GPS
      saLog('WIFI_SAVED_CHANGE', prevMatched + ' -> ' + nowMatched);
      saConfigurePolling();
    }
    saRequestEvaluate();
  });
}

// (Đã bỏ saStartBtsPoll / saStopBtsPoll / saBtsPoll — không còn poll BTS)

function saRequestEvaluate(){
  if(_saTimers.evaluate) return;
  _saTimers.evaluate = setTimeout(function(){
    _saTimers.evaluate = null;
    saEvaluate();
    saUpdateUI();
  }, TIMING.EVALUATE_DEBOUNCE_MS);
}

/* ═══════════════════════════════════════════════════════════════════════════════
   9. STATE MACHINE — Bộ não chính
   ═══════════════════════════════════════════════════════════════════════════════ */

/** Chuyển trạng thái */
function saTransition(newState, reason){
  var old = _sa.state;
  if(old === newState) return;
  if(saShouldBlockTransition(newState)){
    _sa.state = STATE.HOME;
    _sa.stateChangedAt = Date.now();
    _sa.checkoutWaitStart = 0;
    _sa.wifiLostAt = 0;
    saResetCheckinConfirm();
    saResetCheckoutConfirm();
    if(_sa.gpsActive) saStopGps();
    saSave();
    saLog('TRANSITION_BLOCKED', old + ' -> ' + newState + ' (khong co IN dang mo)');
    saUpdateUI();
    saConfigurePolling();
    return;
  }
  _sa.state = newState;
  _sa.stateChangedAt = Date.now();
  saSave();
  saSyncNativeSmartState();
  saLog('TRANSITION', old + ' → ' + newState + (reason ? ' (' + reason + ')' : ''));
  saUpdateUI();
  saConfigurePolling();
}

/** Cấu hình polling phù hợp với trạng thái hiện tại */
function saConfigurePolling(){
  var s = _sa.state;

  switch(s){
    case STATE.HOME:
      saStartWifiPoll();
      if(saShouldRunHomeGpsCheck()) saStartGps(TIMING.GPS_HOME_CHECK_MS);
      else saStopGps();
      break;
      if(saIsAtWorkWifi()){
        saDoCheckin('wifi');
        saTransition(STATE.WORKING_WIFI, 'ket noi Wi-Fi cong ty');
        break;
      }
      if(saIsAtHome()){
        if(_sa.gpsActive) saStopGps();
        break;
      }
      if(saHasLeftHome()){
        saTransition(STATE.LEAVING_HOME, 'roi vung nha');
        break;
      }
      if(saShouldRunHomeGpsCheck()){
        if(!_sa.gpsActive) saStartGps(TIMING.GPS_HOME_CHECK_MS);
        if(saIsAtWorkGps()){
          _sa.wifiWaitStart = now;
          saTransition(STATE.WAIT_WORK_WIFI_5_MIN, 'GPS vao vung, cho Wi-Fi');
        }
      } else if(_sa.gpsActive) {
        saStopGps();
      }
      break;
      // Ở nhà: poll Wi-Fi để phát hiện rời nhà, GPS tắt
      saStartWifiPoll();
      if(saShouldRunHomeGpsCheck()) saStartGps(TIMING.GPS_HOME_CHECK_MS);
      else saStopGps();
      break;

    case STATE.LEAVING_HOME:
      // Vừa rời nhà: bật GPS để tìm công ty
      saStartWifiPoll();
      saStartGps(TIMING.GPS_POLL_TRAVEL_MS);
      break;

    case STATE.GOING_TO_WORK:
      // Đang đi: GPS poll 1.5p, Wi-Fi poll để phát hiện công ty
      saStartWifiPoll();
      if(!_sa.gpsActive) saStartGps(TIMING.GPS_POLL_TRAVEL_MS);
      break;

    case STATE.WAIT_WORK_WIFI_5_MIN:
      // GPS vào vùng, chờ Wi-Fi: poll Wi-Fi nhanh hơn, GPS vẫn chạy
      saStartWifiPoll();
      if(!_sa.gpsActive) saStartGps(TIMING.GPS_POLL_NEAR_SHIFT_MS);
      break;

    case STATE.WORKING_WIFI:
      // Đang làm việc bằng Wi-Fi: tắt GPS, chỉ poll Wi-Fi
      saStartWifiPoll();
      saStopGps();
      break;

    case STATE.WORKING_GPS_BACKUP:
      saStartWifiPoll();
      saStartGps(TIMING.GPS_POLL_BACKUP_MS);
      break;
      if(saIsAtHome()){
        saDoCheckout('wifi_home');
        saTransition(STATE.CHECKED_OUT, 've Wi-Fi nha');
        break;
      }
      // Đang làm việc bằng GPS backup: GPS chạy nền nhẹ
      saStartWifiPoll(); // vẫn kiểm tra Wi-Fi
      saStartGps(TIMING.GPS_POLL_BACKUP_MS);
      break;

    case STATE.WORK_WIFI_LOST:
      saStartWifiPoll();
      saStartGps(TIMING.GPS_POLL_NEAR_SHIFT_MS);
      break;
      if(saIsAtHomeWifi()){
        saDoCheckout('wifi_home');
        saTransition(STATE.CHECKED_OUT, 've Wi-Fi nha');
        break;
      }
      if(saIsAtWorkWifi()){
        saTransition(STATE.WORKING_WIFI, 'Wi-Fi cong ty quay lai');
        break;
      }
      if(saIsAtWorkGps()){
        saTransition(STATE.WORKING_GPS_BACKUP, 'GPS xac nhan van o cong ty');
        break;
      }
      if(saIsOutsideWorkGps()){
        saTransition(STATE.POSSIBLE_CHECKOUT, 'GPS xac nhan roi cong ty');
      }
      break;
      // Mất Wi-Fi, đang verify GPS
      saStartWifiPoll();
      saStartGps(TIMING.GPS_POLL_NEAR_SHIFT_MS);
      break;

    case STATE.POSSIBLE_CHECKOUT:
    case STATE.CHECKOUT_WAIT_75_MIN:
      // Có thể đã tan ca: GPS + Wi-Fi để kiểm tra
      saStartWifiPoll();
      saStartGps(TIMING.GPS_POLL_TRAVEL_MS);
      break;

    case STATE.CHECKED_OUT:
      // Đã checkout: chỉ cần Wi-Fi để phát hiện về nhà
      saStartWifiPoll();
      saStopGps();
      break;
  }
}

/** Đánh giá tín hiệu và chuyển trạng thái (gọi mỗi khi có tín hiệu mới) */
function saEvaluate(){
  if(!_sa.enabled) return;
  if(saResetStaleWorkState('evaluate khong co ca dang mo')){
    saConfigurePolling();
    saUpdateUI();
    return;
  }
  var s = _sa.state;
  var now = Date.now();

  if(s === STATE.HOME){
    if(saIsAtWorkWifi()){
      saDoCheckin('wifi');
      saTransition(STATE.WORKING_WIFI, 'ket noi Wi-Fi cong ty');
      return;
    }
    if(saIsAtHomeWifi()){
      if(_sa.gpsActive) saStopGps();
      return;
    }
    if(saHasLeftHome()){
      saTransition(STATE.LEAVING_HOME, 'mat tin hieu nha');
      return;
    }
    if(saShouldRunHomeGpsCheck()){
      if(!_sa.gpsActive) saStartGps(TIMING.GPS_HOME_CHECK_MS);
      if(saIsAtWorkGps()){
        _sa.wifiWaitStart = now;
        saTransition(STATE.WAIT_WORK_WIFI_5_MIN, 'GPS vao vung, cho Wi-Fi');
      }
    } else if(_sa.gpsActive) {
      saStopGps();
    }
    return;
  }

  if(s === STATE.WORKING_GPS_BACKUP){
    if(saIsAtHomeWifi()){
      saDoCheckout('wifi_home');
      saTransition(STATE.CHECKED_OUT, 've Wi-Fi nha');
      return;
    }
    if(saIsAtWorkWifi()){
      saTransition(STATE.WORKING_WIFI, 'bat duoc Wi-Fi cong ty');
      return;
    }
    if(saIsAtWorkGps()) return;
    if(saIsOutsideWorkGps()) saTransition(STATE.POSSIBLE_CHECKOUT, 'GPS xac nhan roi cong ty');
    return;
  }

  if(s === STATE.WORK_WIFI_LOST){
    if(saIsAtHomeWifi()){
      saDoCheckout('wifi_home');
      saTransition(STATE.CHECKED_OUT, 've Wi-Fi nha');
      return;
    }
    if(saIsAtWorkWifi()){
      saTransition(STATE.WORKING_WIFI, 'Wi-Fi cong ty quay lai');
      return;
    }
    if(saIsAtWorkGps()){
      saTransition(STATE.WORKING_GPS_BACKUP, 'GPS xac nhan van o cong ty');
      return;
    }
    if(saIsOutsideWorkGps()) saTransition(STATE.POSSIBLE_CHECKOUT, 'GPS xac nhan roi cong ty');
    return;
  }

  switch(s){

    /* ─── HOME: Đang ở nhà ──────────────────────────────────── */
    case STATE.HOME:
      if(saHasLeftHome()){
        saTransition(STATE.LEAVING_HOME, 'mất Wi-Fi nhà');
      }
      break;

    /* ─── LEAVING_HOME: Vừa rời nhà ─────────────────────────── */
    case STATE.LEAVING_HOME:
      // Nếu quay lại nhà → về HOME
      if(saIsAtHomeWifi()){
        saTransition(STATE.HOME, 'quay lại nhà');
        break;
      }
      // Kết nối Wi-Fi công ty → check-in ngay
      if(saIsAtWorkWifi()){
        saDoCheckin('wifi');
        saTransition(STATE.WORKING_WIFI, 'kết nối Wi-Fi công ty');
        break;
      }
      // Chuyển sang GOING_TO_WORK (GPS đã được bật ở configurePolling)
      saTransition(STATE.GOING_TO_WORK, 'GPS bật, đang tìm công ty');
      break;

    /* ─── GOING_TO_WORK: Đang di chuyển ─────────────────────── */
    case STATE.GOING_TO_WORK:
      // Quay lại nhà
      if(saIsAtHomeWifi()){
        saTransition(STATE.HOME, 'quay lại nhà');
        break;
      }
      // Kết nối Wi-Fi công ty → check-in ngay
      if(saIsAtWorkWifi()){
        saDoCheckin('wifi');
        saTransition(STATE.WORKING_WIFI, 'kết nối Wi-Fi công ty');
        break;
      }
      // GPS vào vùng công ty → chờ 20p để Wi-Fi xác nhận, nếu không có Wi-Fi thì check-in GPS
      if(saIsAtWorkGps()){
        _sa.wifiWaitStart = now;
        saTransition(STATE.WAIT_WORK_WIFI_5_MIN, 'GPS vào vùng, chờ Wi-Fi');
        break;
      }
      break;

    /* ─── WAIT_WORK_WIFI_5_MIN: GPS vào vùng, chờ Wi-Fi 5p ──── */
    case STATE.WAIT_WORK_WIFI_5_MIN:
      // Bắt được Wi-Fi công ty → check-in bằng Wi-Fi
      if(saIsAtWorkWifi()){
        saDoCheckin('wifi');
        saTransition(STATE.WORKING_WIFI, 'Wi-Fi công ty bắt được trong 5p');
        break;
      }
      // Hết giờ chờ, vẫn không có Wi-Fi → check-in GPS (hoặc theo đồng hồ nếu GPS stale)
      if(now - _sa.wifiWaitStart >= saCheckinMs()){
        // P0 FIX: luôn check-in khi đã đủ giờ xác nhận — không quay về GOING_TO_WORK.
        // Nếu quay về, saStartCheckinConfirm → saTouchCheckinConfirm sẽ thấy gap > 15p → stale=true
        // → reset wifiWaitStart = now → đếm lại từ đầu → check-in không bao giờ xảy ra.
        // GPS stale sau khi app bị throttle background là bình thường, không phải user rời công ty.
        var _atGps = saIsAtWorkGps();
        saDoCheckin('gps');
        saTransition(STATE.WORKING_GPS_BACKUP,
          _atGps ? 'hết giờ chờ, GPS backup check-in'
                 : 'hết giờ chờ, GPS stale — check-in theo đồng hồ');
        break;
      }
      // P1 FIX: chỉ hủy countdown khi GPS FRESH và xác nhận ngoài vùng.
      // Nếu GPS stale (app bị throttle background) → giữ nguyên WAIT, không reset wifiWaitStart.
      if(saGpsFresh() && !saIsAtWorkGps()){
        saTransition(STATE.GOING_TO_WORK, 'GPS fresh - ra khỏi vùng khi đang chờ');
      }
      break;

    /* ─── WORKING_WIFI: Đang làm việc bằng Wi-Fi ─────────────── */
    case STATE.WORKING_WIFI:
      // Vẫn có Wi-Fi → không làm gì
      if(saIsAtWorkWifi()) break;
      // Mất Wi-Fi → bắt đầu đếm 5 phút
      _sa.wifiLostAt = now;
      saTransition(STATE.WORK_WIFI_LOST, 'mất Wi-Fi công ty');
      break;

    /* ─── WORKING_GPS_BACKUP: Làm việc bằng GPS ─────────────── */
    case STATE.WORKING_GPS_BACKUP:
      // Bắt được Wi-Fi công ty → chuyển sang WORKING_WIFI, tắt GPS
      if(saIsAtWorkWifi()){
        saTransition(STATE.WORKING_WIFI, 'bắt được Wi-Fi công ty');
        break;
      }
      // GPS vẫn trong vùng → tiếp tục
      if(saIsAtWorkGps()) break;
      if(!saIsOutsideWorkGps()) break;
      // GPS ra ngoài → có thể tan ca
      saTransition(STATE.POSSIBLE_CHECKOUT, 'GPS ra ngoài (đang backup)');
      break;

    /* ─── WORK_WIFI_LOST: Mất Wi-Fi > 5p, verify GPS ─────────── */
    case STATE.WORK_WIFI_LOST:
      // Wi-Fi quay lại → tiếp tục làm việc
      if(saIsAtWorkWifi()){
        saTransition(STATE.WORKING_WIFI, 'Wi-Fi công ty quay lại');
        break;
      }
      // Chưa đủ 5 phút → chờ
      if(now - _sa.wifiLostAt < saCheckoutMs()) break;

      // Đã 5 phút, bật GPS verify
      if(saIsAtWorkGps()){
        // GPS vẫn ở công ty → Wi-Fi lỗi, chuyển sang GPS backup
        saTransition(STATE.WORKING_GPS_BACKUP, 'Wi-Fi lỗi, GPS xác nhận vẫn ở công ty');
      } else {
        // GPS cũng ngoài → có thể đã tan ca
        saTransition(STATE.POSSIBLE_CHECKOUT, 'mất Wi-Fi 5p + GPS ngoài vùng');
      }
      break;

    /* ─── POSSIBLE_CHECKOUT: Có thể đã tan ca ─────────────────── */
    case STATE.POSSIBLE_CHECKOUT:
      // Quay lại công ty (Wi-Fi hoặc GPS)
      if(saIsAtWorkWifi()){
        saTransition(STATE.WORKING_WIFI, 'quay lại công ty (Wi-Fi)');
        break;
      }
      if(saIsAtWorkGps()){
        saTransition(STATE.WORKING_GPS_BACKUP, 'quay lại công ty (GPS)');
        break;
      }
      // Về nhà (Wi-Fi nhà) → checkout ngay
      if(saIsAtHomeWifi()){
        saDoCheckout('wifi_home');
        saTransition(STATE.CHECKED_OUT, 'về nhà (Wi-Fi nhà) → checkout ngay');
        break;
      }
      // Bắt đầu đếm 75 phút
      _sa.checkoutWaitStart = now;
      saTransition(STATE.CHECKOUT_WAIT_75_MIN, 'bắt đầu đếm 75 phút');
      break;

    /* ─── CHECKOUT_WAIT_75_MIN: Đang chờ 75 phút ────────────── */
    case STATE.CHECKOUT_WAIT_75_MIN:
      // Quay lại công ty → hủy checkout
      if(saIsAtWorkWifi()){
        saTransition(STATE.WORKING_WIFI, 'quay lại công ty trong 75p');
        break;
      }
      if(saIsAtWorkGps()){
        saTransition(STATE.WORKING_GPS_BACKUP, 'quay lại công ty (GPS) trong 75p');
        break;
      }
      // Về nhà → checkout ngay
      if(saIsAtHomeWifi()){
        saDoCheckout('wifi_home');
        saTransition(STATE.CHECKED_OUT, 'về nhà trong 75p → checkout ngay');
        break;
      }
      // Hết 75 phút → auto checkout
      if(now - _sa.checkoutWaitStart >= saCheckoutMs()){
        saDoCheckout('timeout');
        saTransition(STATE.CHECKED_OUT, 'hết 75 phút → auto checkout');
      }
      break;

    /* ─── CHECKED_OUT: Đã checkout ───────────────────────────── */
    case STATE.CHECKED_OUT:
      // Về nhà → reset sang HOME
      if(saIsAtHome()){
        saTransition(STATE.HOME, 'đã về nhà sau checkout');
      }
      break;
  }
}

