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

  // Schedule 22-hour reminder notification for unchecked checkout
  _sa22HourReminderSchedule(targetJob);

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

  // Cancel 22-hour reminder notification khi checkout
  _sa22HourReminderCancel(isSub ? 'sub' : 'main');
}

/** Schedule 22-hour reminder notification for open checkout */
function _sa22HourReminderSchedule(job){
  if(!window.ccNative || !window.ccNative.scheduleNotification) return;

  var isSub = job === 'sub';
  var notifId = isSub ? 30002 : 30001;
  var delayMs = 22 * 60 * 60 * 1000;

  var _L = _saL();
  var subName = isSub ? ((userData && userData.subJob && userData.subJob.name) || 'Job phụ') : '';
  var _title = {
    vi: isSub ? ('💼 ' + subName + ' — ⏰ Nhắc nhở: Chưa checkout') : '⏰ Nhắc nhở: Chưa checkout',
    en: isSub ? ('💼 ' + subName + ' — ⏰ Reminder: No checkout') : '⏰ Reminder: No checkout',
    ko: isSub ? ('💼 ' + subName + ' — ⏰ 알림: 퇴근 없음') : '⏰ 알림: 퇴근 없음',
    ja: isSub ? ('💼 ' + subName + ' — ⏰ 通知: 退勤なし') : '⏰ 通知: 退勤なし',
    zh: isSub ? ('💼 ' + subName + ' — ⏰ 提醒：未下班') : '⏰ 提醒：未下班',
    my: isSub ? ('💼 ' + subName + ' — ⏰ သတိပေးချက်: ထွက်မည်မရှိ') : '⏰ သတိပေးချက်: ထွက်မည်မရှိ',
    th: isSub ? ('💼 ' + subName + ' — ⏰ เตือน: ยังไม่ออกงาน') : '⏰ เตือน: ยังไม่ออกงาน',
    id: isSub ? ('💼 ' + subName + ' — ⏰ Pengingat: Belum checkout') : '⏰ Pengingat: Belum checkout',
    ph: isSub ? ('💼 ' + subName + ' — ⏰ Paalala: Walang time out') : '⏰ Paalala: Walang time out',
    ne: isSub ? ('💼 ' + subName + ' — ⏰ सूचना: चेकआउट नहीं') : '⏰ सूचना: चेकआउट नहीं',
    hi: isSub ? ('💼 ' + subName + ' — ⏰ अनुस्मारक: कोई बाहरी नहीं') : '⏰ अनुस्मारक: कोई बाहरी नहीं'
  }[_L] || ('⏰ Nhắc nhở: Chưa checkout');

  var _body = {
    vi: 'Bạn đã vào ca 22 tiếng mà chưa có checkout. Hãy kiểm tra và checkout ngay.',
    en: 'You clocked in 22 hours ago. Please check out.',
    ko: '22시간 전에 출근했습니다. 퇴근하세요.',
    ja: '22時間前に出勤しました。退勤してください。',
    zh: '22小时前打卡。请立即下班。',
    my: '22 ကြာ အရင်ဝင်ခြင်း ပြုလုပ်သည်။ ထွက်ပါ။',
    th: 'คุณเข้างาน 22 ชั่วโมงแล้ว โปรดออกงาน',
    id: 'Anda masuk 22 jam yang lalu. Silakan checkout.',
    ph: 'Nag-time in ka 22 oras na. Mag-time out na.',
    ne: 'तपाईं 22 घंटा अगाडि भित्रिएको छ। कृपया बाहिर जानुहोस्।',
    hi: 'आप 22 घंटे पहले अंदर आए हैं। कृपया बाहर जाएं।'
  }[_L] || 'Bạn đã vào ca 22 tiếng mà chưa có checkout. Hãy kiểm tra và checkout ngay.';

  try {
    window.ccNative.scheduleNotification(_title, _body, notifId, delayMs);
    saLog('NOTIF_SCHEDULED_22H', job + ' — notification ID ' + notifId);
  } catch(err) {
    saLog('NOTIF_SCHEDULE_ERR', job + ': ' + (err.message || err));
  }
}

/** Cancel 22-hour reminder notification */
function _sa22HourReminderCancel(job){
  if(!window.ccNative || !window.ccNative.cancelNotification) return;

  var isSub = job === 'sub';
  var notifId = isSub ? 30002 : 30001;

  try {
    window.ccNative.cancelNotification(notifId);
    saLog('NOTIF_CANCELLED_22H', job + ' — notification ID ' + notifId);
  } catch(err) {
    saLog('NOTIF_CANCEL_ERR', job + ': ' + (err.message || err));
  }
}

