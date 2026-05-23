/* ═══════════════════════════════════════════════════════════════════════════════
   6. ACTIONS — Thực hiện chấm công
   ═══════════════════════════════════════════════════════════════════════════════ */

/** Auto check-in */
function saIsOutsideWorkGps(){
  return saGpsFresh() && _sa.signals.gpsInside === false;
}

function saIsAtHomeWifi(){
  return saWifiFresh() && saHomeHasWifi() && saMatchWifi(_sa.signals.wifi, _sa.home.wifi);
}

function saCurrentShiftInfo(){
  try {
    if(typeof gpsCurrentShiftSchedule === 'function') return gpsCurrentShiftSchedule();
  } catch(e){}
  return {inMin: 8 * 60, outMin: 17 * 60};
}

function saMinutesFromShiftStart(){
  var shift = saCurrentShiftInfo();
  var now = new Date();
  var nowMin = now.getHours() * 60 + now.getMinutes();
  var diff = nowMin - (Number(shift.inMin) || 8 * 60);
  if(diff > 12 * 60) diff -= 24 * 60;
  if(diff < -12 * 60) diff += 24 * 60;
  return diff;
}

function saIsNearShiftStart(){
  var diffMs = saMinutesFromShiftStart() * 60 * 1000;
  return diffMs >= -TIMING.HOME_GPS_BEFORE_SHIFT_MS
    && diffMs <= TIMING.HOME_GPS_AFTER_SHIFT_MS;
}

function saShouldRunHomeGpsCheck(){
  if(saIsAtHomeWifi()) return false;
  // Wi-Fi tắt + có GPS profile nào → bật GPS (verify nhà/công ty)
  // Bỏ qua mọi điều kiện khác để đảm bảo có GPS làm backup khi Wi-Fi không dùng được
  if(saWifiUnavailable() && (saHomeHasGps() || saWorkHasGps())) return true;
  if(!saWorkHasGps()) return false;
  if(_sa.todayCheckedIn) return false;
  if(saHasLeftHome()) return true;
  // Sau khi bỏ BTS: chỉ còn Wi-Fi là tín hiệu nhận diện nhà — không có Wi-Fi nhà thì luôn cần GPS
  if(!saHomeHasWifi()) return true;
  return saIsNearShiftStart();
}

function saAttendanceData(){
  return (typeof attData !== 'undefined' && attData) ? attData : {};
}

function saAttendanceRecord(key){
  var data = saAttendanceData();
  return data[key] || null;
}

function saYesterdayKey(){
  var yd = new Date();
  yd.setDate(yd.getDate() - 1);
  return yd.getFullYear() + '-' + yd.getMonth() + '-' + yd.getDate();
}

function saOpenAttendanceKey(){
  var today = saAttendanceRecord(todayKey());
  if(today && today.in && !today.out) return todayKey();
  var y = saAttendanceRecord(saYesterdayKey());
  if(y && y.in && !y.out) return saYesterdayKey();
  return '';
}

function saHasOpenAttendance(){
  return !!saOpenAttendanceKey();
}

function saSyncAttendanceFlagsFromData(){
  var today = saAttendanceRecord(todayKey()) || {};
  _sa.todayCheckedIn = !!today.in;
  _sa.todayCheckedOut = !!today.out;
  _sa.todayCheckedInSub = !!(today.sub && today.sub.in);
  _sa.todayCheckedOutSub = !!(today.sub && today.sub.out);
}

function saNeedsOpenAttendanceState(state){
  return state === STATE.WORKING || state === STATE.WAIT_CHECKOUT_CONFIRM;
}

function saResetStaleWorkState(reason){
  saSyncAttendanceFlagsFromData();
  if(!saNeedsOpenAttendanceState(_sa.state) || saHasOpenAttendance()) return false;
  var old = _sa.state;
  _sa.state = STATE.HOME;
  _sa.stateChangedAt = Date.now();
  _sa.checkoutWaitStart = 0;
  _sa.wifiLostAt = 0;
  saResetCheckinConfirm();
  saResetCheckoutConfirm();
  if(_sa.gpsActive) saStopGps();
  saSave();
  saLog('STATE_RESET', old + ' -> HOME (' + (reason || 'khong co IN dang mo') + ')');
  return true;
}

function saShouldBlockTransition(newState){
  saSyncAttendanceFlagsFromData();
  if(saNeedsOpenAttendanceState(newState) && !saHasOpenAttendance()) return true;
  if(newState === STATE.CHECKED_OUT && !saHasOpenAttendance() && !_sa.todayCheckedOut) return true;
  return false;
}

/** Trả về job đang active: 'sub' nếu user bật sub-job và GPS đang nhắm vào sub, ngược lại 'main' */
function saActiveJob(){
  return (window._gpsData && _gpsData.activeJob === 'sub'
       && window.userData && userData.subJob && userData.subJob.active)
    ? 'sub' : 'main';
}

/** Trả về profile địa điểm làm việc đang active (main hoặc sub) */
function saGetWorkProfile(){
  if(saActiveJob() === 'sub'){
    if(!_sa.subWork) _sa.subWork = {wifi:[], gps:null};
    return _sa.subWork;
  }
  return _sa.work;
}

function saDateKeyFromDate(d){
  return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
}

function saRecordDateFromMs(ms, fallbackMs){
  var n = Number(ms);
  if(!Number.isFinite(n) || n <= 0) n = fallbackMs;
  return new Date(n);
}

function saDoCheckin(method, atMs){
  var isSub = saActiveJob() === 'sub';

  // Guard: đã chấm hôm nay rồi
  if(isSub ? _sa.todayCheckedInSub : _sa.todayCheckedIn) return false;

  // Record the moment the confirmation window started, not the wake/open time.
  var t = saRecordDateFromMs(atMs, Date.now() - saCheckinMs());
  var k = saDateKeyFromDate(t);
  var targetJob = isSub ? 'sub' : 'main';

  if(typeof gpsEnsureCycleForCheckin === 'function'){
    var canConfirm = !(document && document.visibilityState === 'hidden');
    var cycle = gpsEnsureCycleForCheckin(targetJob, {
      source: 'smart_attendance',
      nowMs: t.getTime(),
      closeMs: t.getTime(),
      allowConfirm: canConfirm,
      showBanner: true
    });
    if(!cycle || !cycle.allowed){
      saLog('CHECK_IN_BLOCKED', targetJob + ': blocked by cycle guard (' + (cycle && cycle.reason ? cycle.reason : 'unknown') + ')');
      return false;
    }
  }

  if(isSub){
    // Kiểm tra chu kỳ 8 tiếng cho sub-job
    if(typeof gpsCanStartNewAutoCycle === 'function' && !gpsCanStartNewAutoCycle('sub')){
      saLog('CHECK_IN_BLOCKED', 'sub: chưa đủ 8h từ lần ra ca gần nhất'); return false;
    }
    if(attData[k] && attData[k].sub && attData[k].sub.in){
      saLog('CHECK_IN_SKIP', 'Đã có IN sub hôm nay'); return false;
    }
  } else {
    if(typeof gpsCanStartNewAutoCycle === 'function' && !gpsCanStartNewAutoCycle('main')){
      saLog('CHECK_IN_BLOCKED', 'Chưa đủ 8h từ lần ra ca gần nhất'); return false;
    }
    if(attData[k] && attData[k].in){
      saLog('CHECK_IN_SKIP', 'Đã có IN hôm nay'); return false;
    }
  }

  var hm = fmtTime(t);
  if(!attData[k]) attData[k] = {type:'cm'};

  if(isSub){
    if(!attData[k].sub) attData[k].sub = {type:'cm'};
    attData[k].sub.in = hm;
    attData[k].sub.type = 'cm';
    attData[k].sub.auto = true;
    attData[k].sub.autoMethod = method || 'smart';
    _sa.todayCheckedInSub = true;
  } else {
    attData[k].in = hm;
    attData[k].type = 'cm';
    attData[k].auto = true;
    attData[k].autoMethod = method || 'smart';
    _sa.todayCheckedIn = true;
  }

  saveAtt();
  if(typeof renderHomeStats === 'function') renderHomeStats();
  saSave();

  // Thông báo
  var methodLabel = method === 'wifi' ? 'Wi-Fi' : method === 'gps' ? 'GPS' : 'Smart';
  var _L0 = _saL();
  var subName = isSub ? ((userData && userData.subJob && userData.subJob.name) || 'Job phụ') : '';
  var _inMsg = {vi:'✅ Đã vào ca lúc ',en:'✅ Clocked in at ',ko:'✅ 출근 완료 ',ja:'✅ 出勤 ',zh:'✅ 上班打卡 ',my:'✅ ဝင်ချိန် ',th:'✅ เข้างานเวลา ',id:'✅ Masuk pukul ',ph:'✅ Nag-time in ',ne:'✅ भित्रिएको ',hi:'✅ अंदर समय '}[_L0]||'✅ Đã vào ca lúc ';
  var _inNotifTitle = {vi:'✅ Đã vào ca',en:'✅ Clocked In',ko:'✅ 출근',ja:'✅ 出勤',zh:'✅ 上班',my:'✅ ဝင်',th:'✅ เข้างาน',id:'✅ Masuk',ph:'✅ Time In',ne:'✅ भित्रियो',hi:'✅ प्रवेश'}[_L0]||'✅ Đã vào ca';
  var _inNotifBody = {vi:'Chấm công vào ca lúc ',en:'Clocked in at ',ko:'출근 ',ja:'出勤 ',zh:'上班打卡 ',my:'ဝင်ချိန် ',th:'เข้างานเวลา ',id:'Masuk pukul ',ph:'Time in ng ',ne:'भित्रिएको ',hi:'अंदर समय '}[_L0]||'Chấm công vào ca lúc ';
  var _autoSfx = {vi:' tự động',en:' auto',ko:' 자동',ja:' 自動',zh:' 自动',my:' အော်တို',th:' อัตโนมัติ',id:' otomatis',ph:' auto',ne:' स्वतः',hi:' स्वतः'}[_L0]||' tự động';
  var prefix = isSub ? ('💼 ' + subName + ' ') : '';
  showGpsBanner(prefix + _inMsg + hm + ' (' + methodLabel + ')', isSub ? '#7B5EA7' : '#0D9E75');

  if(window.ccNative && window.ccNative.sendNotification){
    window.ccNative.sendNotification(
      (isSub ? '💼 ' + subName + ' — ' : '') + _inNotifTitle,
      _inNotifBody + hm + ' (' + methodLabel + _autoSfx + ')',
      isSub ? 2003 : 2001
    );
  }

  saLog('CHECK_IN_OK', method + ' — ' + hm + (isSub ? ' [sub]' : ''));
  return true;
}

/** Auto check-out */
function saDoCheckout(method, atMs){
  var isSub = saActiveJob() === 'sub';

  // Guard: đã chấm ra hôm nay rồi
  if(isSub ? _sa.todayCheckedOutSub : _sa.todayCheckedOut) return;

  // Record the time the leave/home signal started, even if the app wakes later.
  var t = saRecordDateFromMs(atMs, Date.now() - saCheckoutMs());
  var k = saDateKeyFromDate(t);
  var yd = new Date(t.getTime()); yd.setDate(yd.getDate() - 1);
  var yk = saDateKeyFromDate(yd);

  if(isSub){
    // Tìm ngày có sub.in mà chưa có sub.out
    if(!attData[k] || !attData[k].sub || !attData[k].sub.in){
      if(attData[yk] && attData[yk].sub && attData[yk].sub.in && !attData[yk].sub.out){
        k = yk;
      } else {
        saLog('CHECK_OUT_SKIP', 'sub: không có IN để checkout'); return;
      }
    }
    if(attData[k].sub && attData[k].sub.out){
      saLog('CHECK_OUT_SKIP', 'sub: đã có OUT'); return;
    }
  } else {
    // Tìm ngày có IN mà chưa có OUT (xử lý ca qua đêm)
    if(!attData[k] || !attData[k].in){
      if(attData[yk] && attData[yk].in && !attData[yk].out){
        k = yk;
      } else {
        saLog('CHECK_OUT_SKIP', 'Không có IN để checkout'); return;
      }
    }
    if(attData[k] && attData[k].out){
      saLog('CHECK_OUT_SKIP', 'Đã có OUT'); return;
    }
  }

  var hm = fmtTime(t);

  if(isSub){
    if(!attData[k].sub) attData[k].sub = {type:'cm'};
    attData[k].sub.out = hm;
    attData[k].sub.auto = true;
    attData[k].sub.autoOutMethod = method || 'smart';
    _sa.todayCheckedOutSub = true;
  } else {
    attData[k].out = hm;
    attData[k].auto = true;
    attData[k].autoOutMethod = method || 'smart';
    _sa.todayCheckedOut = true;
  }

  saveAtt();
  if(typeof renderHomeStats === 'function') renderHomeStats();
  saSave();

  var _L1 = _saL();
  var _homeWifi = {vi:'Wi-Fi nhà',en:'Home Wi-Fi',ko:'집 Wi-Fi',ja:'自宅Wi-Fi',zh:'家Wi-Fi',my:'အိမ် Wi-Fi',th:'Wi-Fi บ้าน',id:'Wi-Fi rumah',ph:'Wi-Fi bahay',ne:'घर Wi-Fi',hi:'घर Wi-Fi'}[_L1]||'Wi-Fi nhà';
  var _tout80   = {vi:'timeout 80p',en:'timeout 80m',ko:'타임아웃80분',ja:'タイムアウト80分',zh:'超时80分',my:'timeout 80p',th:'หมดเวลา 80น',id:'timeout 80m',ph:'timeout 80m',ne:'timeout 80m',hi:'timeout 80m'}[_L1]||'timeout 80p';
  var methodLabel = method === 'wifi_home' ? _homeWifi : method === 'gps_home' ? 'GPS nhà' : method === 'timeout' ? _tout80 : method === 'gps' ? 'GPS' : 'Smart';
  var _outMsg = {vi:'🏁 Đã ra ca lúc ',en:'🏁 Clocked out at ',ko:'🏁 퇴근 완료 ',ja:'🏁 退勤 ',zh:'🏁 下班打卡 ',my:'🏁 ထွက်ချိန် ',th:'🏁 ออกงานเวลา ',id:'🏁 Keluar pukul ',ph:'🏁 Nag-time out ',ne:'🏁 बाहिरिएको ',hi:'🏁 बाहर समय '}[_L1]||'🏁 Đã ra ca lúc ';
  var _outNotifTitle = {vi:'🏁 Đã ra ca',en:'🏁 Clocked Out',ko:'🏁 퇴근',ja:'🏁 退勤',zh:'🏁 下班',my:'🏁 ထွက်',th:'🏁 ออกงาน',id:'🏁 Keluar',ph:'🏁 Time Out',ne:'🏁 बाहिरियो',hi:'🏁 बाहर'}[_L1]||'🏁 Đã ra ca';
  var _outNotifBody = {vi:'Chấm công ra ca lúc ',en:'Clocked out at ',ko:'퇴근 ',ja:'退勤 ',zh:'下班打卡 ',my:'ထွက်ချိန် ',th:'ออกงานเวลา ',id:'Keluar pukul ',ph:'Time out ng ',ne:'बाहिरिएको ',hi:'बाहर समय '}[_L1]||'Chấm công ra ca lúc ';
  var _autoSfx1 = {vi:' tự động',en:' auto',ko:' 자동',ja:' 自動',zh:' 自动',my:' အော်တို',th:' อัตโนมัติ',id:' otomatis',ph:' auto',ne:' स्वतः',hi:' स्वतः'}[_L1]||' tự động';
  var subName1 = isSub ? ((userData && userData.subJob && userData.subJob.name) || 'Job phụ') : '';
  var prefix1 = isSub ? ('💼 ' + subName1 + ' ') : '';
  showGpsBanner(prefix1 + _outMsg + hm + ' (' + methodLabel + ')', isSub ? '#9B6FC0' : '#F5A623');

  if(window.ccNative && window.ccNative.sendNotification){
    window.ccNative.sendNotification(
      (isSub ? '💼 ' + subName1 + ' — ' : '') + _outNotifTitle,
      _outNotifBody + hm + ' (' + methodLabel + _autoSfx1 + ')',
      isSub ? 2004 : 2002
    );
  }

  saLog('CHECK_OUT_OK', method + ' — ' + hm + (isSub ? ' [sub]' : ''));

  // Tắt GPS ngay sau ra ca, đặt timer đánh thức lại sau 8h
  saStopGps();
  _saScheduleGpsWakeup();
}

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

