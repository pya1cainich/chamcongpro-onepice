/* ═══════════════════════════════════════════════════════════════════════════════
   10. UI — Cập nhật giao diện
   ═══════════════════════════════════════════════════════════════════════════════ */

/** Cập nhật UI hiển thị trạng thái */
/* Optimized smart-attendance rules.
   Legacy state-machine code above is kept for reference; this block is the
   active implementation because it is declared later in the same scope. */
/**
 * QUY TẮC POLLING:
 *   ✦ Wi-Fi LUÔN poll (đảm bảo có 1 trong 2 tín hiệu — trừ trường hợp CHECKED_OUT)
 *   ✦ GPS TẮT khi đang kết nối Wi-Fi ĐÃ LƯU (nhà / công ty / việc phụ)
 *   ✦ GPS BẬT khi mất Wi-Fi HOẶC kết nối Wi-Fi LẠ (chưa lưu) — trong chu kỳ làm việc
 *   ✦ ĐẶC BIỆT: state CHECKED_OUT → TẮT GPS HOÀN TOÀN (kể cả không có Wi-Fi).
 *     Sau 8h, _saScheduleGpsWakeup tự reset về HOME → vòng làm việc mới.
 *   ✦ Chu kỳ GPS chọn theo state để tiết kiệm pin (di chuyển nhanh / trong ca chậm)
 *
 * Hàm này được gọi:
 *   1) Mỗi lần state đổi (saTransition)
 *   2) Mỗi lần trạng thái Wi-Fi-đã-lưu đổi (saWifiPoll phát hiện match/no-match)
 */
function saConfigurePolling(){
  // Wi-Fi luôn chạy — là tín hiệu chính để biết khi nào cần bật/tắt GPS
  saStartWifiPoll();

  // Đã tan ca → đợi 8h cho vòng mới, KHÔNG dùng GPS để tiết kiệm pin tối đa.
  // Nếu có Wi-Fi nhà sau khi về thì cũng vẫn tắt (đằng nào cũng đợi 8h).
  // Wakeup timer (_saScheduleGpsWakeup) sẽ tự reset state về HOME khi đủ 8h.
  if(_sa.state === STATE.CHECKED_OUT){
    saStopGps();
    return;
  }

  // Kết nối VÀO Wi-Fi đã lưu → tắt GPS (Wi-Fi đã đủ tin cậy để biết vị trí)
  // Wi-Fi lạ (vd quán cà phê) không được tính → vẫn cần GPS để biết đang ở đâu
  if(saIsConnectedToSavedWifi()){
    saStopGps();
    return;
  }

  // Mất Wi-Fi → bật GPS làm tín hiệu thay thế. Chu kỳ theo state:
  var s = _sa.state;
  var interval;
  if(s === STATE.WAIT_CHECKIN_CONFIRM){
    interval = TIMING.GPS_POLL_NEAR_SHIFT_MS;   // 30s — đang xác nhận vào ca
  } else if(s === STATE.WORKING){
    interval = TIMING.GPS_POLL_BACKUP_MS;        // 2p — trong ca, dùng GPS backup
  } else if(s === STATE.WAIT_CHECKOUT_CONFIRM){
    interval = TIMING.GPS_POLL_TRAVEL_MS;        // 90s — đang xác nhận tan ca
  } else if(s === STATE.HOME){
    interval = TIMING.GPS_HOME_CHECK_MS;         // 2p — ở nhà nhưng Wi-Fi tắt
  } else {
    interval = TIMING.GPS_POLL_TRAVEL_MS;        // 90s — đang di chuyển
  }
  saStartGps(interval);
}

function saWorkPresenceMethod(){
  if(saIsAtWorkWifi()) return 'wifi';
  if(saIsAtWorkGps()) return 'gps';
  return '';
}

function saCheckoutAwayMethod(){
  if(saIsAtHomeWifi()) return 'wifi_home';
  if(saIsAtHomeGps()) return 'gps_home';
  if(saIsOutsideWorkGps()) return 'gps';
  return '';
}

function saResetCheckinConfirm(){
  _sa.wifiWaitStart = 0;
  _sa.checkinConfirmMethod = '';
  _sa.checkinConfirmLastSeen = 0;
  _sa.checkinWindowStart = 0;
  _sa.checkinSignalOnMs = 0;
  _sa.checkinSignalOffMs = 0;
  _sa.checkinLastSignalState = false;
  _sa.checkinLastFlipAt = 0;
}

function saResetCheckoutConfirm(){
  _sa.checkoutWaitStart = 0;
  _sa.checkoutConfirmMethod = '';
  _sa.checkoutConfirmLastSeen = 0;
  _sa.checkoutWindowStart = 0;
  _sa.checkoutSignalOnMs = 0;
  _sa.checkoutSignalOffMs = 0;
  _sa.checkoutLastSignalState = true;
  _sa.checkoutLastFlipAt = 0;
}

function saTouchCheckinConfirm(method, now){
  var stale = _sa.checkinConfirmLastSeen && (now - _sa.checkinConfirmLastSeen > TIMING.CONFIRM_SIGNAL_GAP_MS);
  if(!_sa.wifiWaitStart || stale){
    _sa.wifiWaitStart = now;
    if(stale) saLog('CHECK_IN_WAIT_RESET', 'tin hieu vao ca gian doan, dem lai ' + Math.round(saCheckinMs()/60000) + 'p');
  }
  _sa.checkinConfirmMethod = method || '';
  _sa.checkinConfirmLastSeen = now;
}

function saTouchCheckoutConfirm(method, now){
  var stale = _sa.checkoutConfirmLastSeen && (now - _sa.checkoutConfirmLastSeen > TIMING.CONFIRM_SIGNAL_GAP_MS);
  if(!_sa.checkoutWaitStart || stale){
    _sa.checkoutWaitStart = now;
    if(stale) saLog('CHECK_OUT_WAIT_RESET', 'tin hieu ra ca gian doan, dem lai ' + Math.round(saCheckoutMs()/60000) + 'p');
  }
  _sa.checkoutConfirmMethod = method || '';
  _sa.checkoutConfirmLastSeen = now;
}

/** Mở cửa sổ check-in: đặt lại tất cả accumulator, chuyển sang WAIT_CHECKIN_CONFIRM */
function saOpenCheckinWindow(now, reason){
  var checkinMinVal = (window._gpsData && _gpsData.checkinMin > 0) ? _gpsData.checkinMin : 20;
  _sa.checkinWindowStart     = now;
  _sa.checkinSignalOnMs      = 0;
  _sa.checkinSignalOffMs     = 0;
  _sa.checkinLastSignalState = true;  // tín hiệu có mặt khi bắt đầu cửa sổ
  _sa.checkinLastFlipAt      = now;
  saTransition(STATE.WAIT_CHECKIN_CONFIRM,
    reason || ('mo cua so check-in ' + checkinMinVal + 'p'));
}

/** Cập nhật accumulator check-in dựa trên tín hiệu hiện tại. Trả về {totalOnMs, totalOffMs} */
function saTickCheckinWindow(hasSignal, now){
  if(hasSignal !== _sa.checkinLastSignalState){
    var dt = now - _sa.checkinLastFlipAt;
    if(_sa.checkinLastSignalState) _sa.checkinSignalOnMs  += dt;
    else                            _sa.checkinSignalOffMs += dt;
    _sa.checkinLastSignalState = hasSignal;
    _sa.checkinLastFlipAt = now;
  }
  var pending = now - _sa.checkinLastFlipAt;
  return {
    totalOnMs:  _sa.checkinSignalOnMs  + (hasSignal ? pending : 0),
    totalOffMs: _sa.checkinSignalOffMs + (hasSignal ? 0 : pending)
  };
}

/** Mở cửa sổ tan ca: chuyển sang WAIT_CHECKOUT_CONFIRM */
function saOpenCheckoutWindow(now, reason){
  var checkoutMinVal = (window._gpsData && _gpsData.checkoutMin > 0) ? _gpsData.checkoutMin : 80;
  _sa.checkoutWindowStart     = now;
  _sa.checkoutSignalOnMs      = 0;
  _sa.checkoutSignalOffMs     = 0;
  _sa.checkoutLastSignalState = false;  // tín hiệu vừa mất khi bắt đầu cửa sổ
  _sa.checkoutLastFlipAt      = now;
  saTransition(STATE.WAIT_CHECKOUT_CONFIRM,
    reason || ('mo cua so checkout ' + checkoutMinVal + 'p'));
}

/** Cập nhật accumulator tan ca. Trả về {totalOnMs, totalOffMs} */
function saTickCheckoutWindow(hasSignal, now){
  if(hasSignal !== _sa.checkoutLastSignalState){
    var dt2 = now - _sa.checkoutLastFlipAt;
    if(_sa.checkoutLastSignalState) _sa.checkoutSignalOnMs  += dt2;
    else                             _sa.checkoutSignalOffMs += dt2;
    _sa.checkoutLastSignalState = hasSignal;
    _sa.checkoutLastFlipAt = now;
  }
  var pending2 = now - _sa.checkoutLastFlipAt;
  return {
    totalOnMs:  _sa.checkoutSignalOnMs  + (hasSignal ? pending2 : 0),
    totalOffMs: _sa.checkoutSignalOffMs + (hasSignal ? 0 : pending2)
  };
}

/** Thời gian tín hiệu tối thiểu để check-in (15% checkinMs, ít nhất 20s) */
function saMinCheckinSignalMs(){
  return Math.max(20 * 1000, Math.floor(saCheckinMs() * 0.15));
}

function saEvaluate(){
  if(!_sa.enabled) return;
  if(saResetStaleWorkState('evaluate khong co ca dang mo')){
    saConfigurePolling();
    saUpdateUI();
    return;
  }
  var s = _sa.state;
  var now = Date.now();

  switch(s){

    /* ─── HOME ─────────────────────────────────────────────────── */
    case STATE.HOME:
      // Phát hiện vùng công ty → mở cửa sổ check-in ngay
      var homeMethod = saWorkPresenceMethod();
      if(homeMethod){
        saOpenCheckinWindow(now, 'phat hien tin hieu cong ty tu HOME');
        break;
      }
      if(saIsAtHomeWifi()){
        if(_sa.gpsActive) saStopGps();
        break;
      }
      // Debounce 60s trước khi chuyển LEAVING_HOME (tránh Wi-Fi nhà rớt 1 nhịp)
      if(saConfirmedLeftHome(now)){
        saTransition(STATE.LEAVING_HOME, 'mat tin hieu nha (debounce 60s)');
        break;
      }
      if(saShouldRunHomeGpsCheck()){
        if(!_sa.gpsActive) saStartGps(TIMING.GPS_HOME_CHECK_MS);
        if(saIsAtWorkGps()){
          saOpenCheckinWindow(now, 'GPS vao vung cong ty tu HOME');
        }
      } else if(_sa.gpsActive){
        saStopGps();
      }
      break;

    /* ─── LEAVING_HOME ──────────────────────────────────────────── */
    case STATE.LEAVING_HOME:
      if(saIsAtHome()){
        _sa.homeSignalLostAt = 0;
        saTransition(STATE.HOME, 'quay lai nha');
        break;
      }
      var leavingMethod = saWorkPresenceMethod();
      if(leavingMethod){
        saOpenCheckinWindow(now, 'phat hien tin hieu cong ty khi roi nha');
        break;
      }
      saTransition(STATE.GOING_TO_WORK, 'bat GPS tim cong ty');
      break;

    /* ─── GOING_TO_WORK ─────────────────────────────────────────── */
    case STATE.GOING_TO_WORK:
      if(saIsAtHome()){
        saTransition(STATE.HOME, 'quay lai nha');
        break;
      }
      var goingMethod = saWorkPresenceMethod();
      if(goingMethod){
        saOpenCheckinWindow(now, 'phat hien tin hieu cong ty khi di lam');
      }
      break;

    /* ─── WAIT_CHECKIN_CONFIRM ──────────────────────────────────── */
    case STATE.WAIT_CHECKIN_CONFIRM:{
      var hasWorkSig = !!(saIsAtWorkWifi() || saIsAtWorkGps());
      var ciTick = saTickCheckinWindow(hasWorkSig, now);
      var ciElapsed = now - _sa.checkinWindowStart;
      var ciMinMs = saMinCheckinSignalMs();
      var ciCheckinMs = saCheckinMs();
      var ciMinVal = Math.round(ciCheckinMs / 60000);

      // Điều kiện check-in: cửa sổ đã đủ thời gian + on > off + đủ tín hiệu tối thiểu
      if(ciElapsed >= ciCheckinMs && ciTick.totalOnMs > ciTick.totalOffMs && ciTick.totalOnMs >= ciMinMs){
        var ciMethod = saIsAtWorkWifi() ? 'wifi' : 'gps';
        var didCheckin = saDoCheckin(ciMethod, _sa.checkinWindowStart || (now - ciCheckinMs));
        if(didCheckin){
          saTransition(STATE.WORKING,
            'check-in: ' + Math.round(ciTick.totalOnMs/60000) + 'p on / ' + Math.round(ciTick.totalOffMs/60000) + 'p off');
        } else {
          saLog('CHECK_IN_WAIT_BLOCKED', 'du dieu kien tin hieu nhung bi chan boi cycle guard');
        }
        break;
      }
      // Hết cửa sổ nhưng tín hiệu không đủ → hủy, quay về GOING_TO_WORK
      if(ciElapsed >= ciCheckinMs && ciTick.totalOnMs < ciMinMs){
        saLog('CHECKIN_CANCEL', 'het cua so ' + ciMinVal + 'p, tin hieu khong du toi thieu');
        saTransition(STATE.GOING_TO_WORK, 'het cua so check-in, tin hieu qua it');
        break;
      }
      // Về nhà trong lúc chờ → hủy
      if(saIsAtHome()){
        saTransition(STATE.HOME, 'quay ve nha khi dang cho check-in');
        break;
      }
      // Đang trong cửa sổ → log và tiếp tục tích lũy
      saLog('WAIT_CHECKIN',
        Math.round(ciElapsed/1000) + 's/' + ciMinVal + 'p | on=' + Math.round(ciTick.totalOnMs/1000) + 's off=' + Math.round(ciTick.totalOffMs/1000) + 's');
      break;
    }

    /* ─── WORKING ────────────────────────────────────────────────── */
    case STATE.WORKING:
      // Vẫn có tín hiệu công ty → tiếp tục
      if(saIsAtWorkWifi() || saIsAtWorkGps()) break;
      // Về nhà cũng chỉ mở cửa sổ xác nhận, không checkout ngay.
      if(saIsAtHomeWifi()){
        saOpenCheckoutWindow(now, 've Wi-Fi nha, mo cua so checkout');
        break;
      }
      // Mất tín hiệu → mở cửa sổ tan ca
      saOpenCheckoutWindow(now, 'mat tin hieu cong ty, mo cua so checkout');
      break;

    /* ─── WAIT_CHECKOUT_CONFIRM ─────────────────────────────────── */
    case STATE.WAIT_CHECKOUT_CONFIRM:{
      var hasWorkSig2 = !!(saIsAtWorkWifi() || saIsAtWorkGps());
      var coTick = saTickCheckoutWindow(hasWorkSig2, now);
      var coElapsed = now - _sa.checkoutWindowStart;
      var coCheckoutMs = saCheckoutMs();
      var coMinVal = Math.round(coCheckoutMs / 60000);

      // Tín hiệu quay lại nhiều hơn mất → quay về WORKING
      if(coTick.totalOnMs > coTick.totalOffMs && hasWorkSig2){
        saTransition(STATE.WORKING, 'tin hieu cong ty quay lai (on > off)');
        break;
      }
      // Đủ thời gian + mất tín hiệu > có tín hiệu → auto checkout
      if(coElapsed >= coCheckoutMs && coTick.totalOffMs > coTick.totalOnMs){
        var coMethod = saIsAtHomeWifi() ? 'wifi_home' : (saIsAtHomeGps() ? 'gps_home' : (saIsOutsideWorkGps() ? 'gps' : 'timeout'));
        saDoCheckout(coMethod, _sa.checkoutWindowStart || (now - coCheckoutMs));
        saTransition(STATE.CHECKED_OUT,
          'checkout: ' + Math.round(coTick.totalOffMs/60000) + 'p off / ' + Math.round(coTick.totalOnMs/60000) + 'p on');
        break;
      }
      // Đang trong cửa sổ → log và tiếp tục
      saLog('WAIT_CHECKOUT',
        Math.round(coElapsed/1000) + 's/' + coMinVal + 'p | off=' + Math.round(coTick.totalOffMs/1000) + 's on=' + Math.round(coTick.totalOnMs/1000) + 's');
      break;
    }

    /* ─── CHECKED_OUT ────────────────────────────────────────────── */
    case STATE.CHECKED_OUT:
      if(saIsAtHome()){
        saTransition(STATE.HOME, 'da ve nha sau checkout');
      }
      break;
  }
}

function saEsc(value){
  return String(value == null ? '' : value).replace(/[&<>"']/g, function(ch){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch];
  });
}

function saDebugBadge(text, ok){
  var bg = ok ? '#E8F7EF' : '#FFF0F0';
  var color = ok ? '#0D6E3F' : '#B42318';
  return '<span style="display:inline-block;padding:1px 5px;border-radius:6px;background:' + bg + ';color:' + color + ';font-weight:800">' + saEsc(text) + '</span>';
}

function saSignalAge(ts){
  var L = _saL();
  var noData = {vi:'chưa có',en:'no data',ko:'없음',ja:'なし',zh:'无',my:'မရှိ',th:'ไม่มี',id:'belum ada',ph:'wala pa',ne:'छैन',hi:'नहीं'}[L]||'chưa có';
  var secSfx = {vi:'s trước',en:'s ago',ko:'초 전',ja:'秒前',zh:'秒前',my:'s မတိုင်ခင်',th:'วินาทีที่แล้ว',id:'dtk lalu',ph:'sg nakaraang',ne:'s अघि',hi:'s पहले'}[L]||'s trước';
  var minSfx = {vi:'p trước',en:'m ago',ko:'분 전',ja:'分前',zh:'分前',my:'p မတိုင်ခင်',th:'นาทีที่แล้ว',id:'mnt lalu',ph:'m nakaraang',ne:'m अघि',hi:'m पहले'}[L]||'p trước';
  if(!ts) return noData;
  var sec = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if(sec < 60) return sec + secSfx;
  return Math.round(sec / 60) + minSfx;
}

function saGpsInsideText(){
  var L = _saL();
  var inside  = {vi:'trong vùng công ty',en:'inside work zone',ko:'회사 구역 내',ja:'会社エリア内',zh:'公司范围内',my:'ကုမ္ပဏီဇုန်အတွင်း',th:'ในพื้นที่บริษัท',id:'dalam zona kantor',ph:'loob ng zone ng trabaho',ne:'कम्पनी क्षेत्र भित्र',hi:'कंपनी क्षेत्र के अंदर'}[L]||'trong vùng công ty';
  var outside = {vi:'ngoài vùng công ty',en:'outside work zone',ko:'회사 구역 밖',ja:'会社エリア外',zh:'公司范围外',my:'ကုမ္ပဏီဇုန်ပြင်ပ',th:'นอกพื้นที่บริษัท',id:'luar zona kantor',ph:'labas ng zone ng trabaho',ne:'कम्पनी क्षेत्र बाहिर',hi:'कंपनी क्षेत्र के बाहर'}[L]||'ngoài vùng công ty';
  var unknown = {vi:'chưa rõ',en:'unknown',ko:'불명',ja:'不明',zh:'未知',my:'မသိ',th:'ไม่ทราบ',id:'belum jelas',ph:'hindi pa malinaw',ne:'अज्ञात',hi:'अज्ञात'}[L]||'chưa rõ';
  if(!saGpsFresh()) return '<span style="color:#687385">' + saEsc(unknown) + '</span>';
  if(_sa.signals.gpsInside === true)  return saDebugBadge(inside, true);
  if(_sa.signals.gpsInside === false) return saDebugBadge(outside, false);
  return '<span style="color:#687385">' + saEsc(unknown) + '</span>';
}

function saDecisionText(){
  var L = _saL();
  var T = {
    workWifi:  {vi:'Có Wi-Fi công ty: check-in/working bằng Wi-Fi, GPS tắt.',en:'Work Wi-Fi detected: check-in via Wi-Fi, GPS off.',ko:'회사 Wi-Fi 감지: Wi-Fi로 체크인, GPS 꺼짐.',ja:'会社Wi-Fi検出: Wi-Fiでチェックイン、GPSオフ。',zh:'检测到公司Wi-Fi：通过Wi-Fi签到，GPS关闭。',my:'ကုမ္ပဏီ Wi-Fi ရှိ: Wi-Fi ဖြင့် check-in, GPS ပိတ်။',th:'Wi-Fi บริษัทพบ: เช็กอินผ่าน Wi-Fi, GPS ปิด',id:'Wi-Fi kantor terdeteksi: check-in via Wi-Fi, GPS mati.',ph:'Wi-Fi trabaho nakita: check-in sa Wi-Fi, GPS off.',ne:'कम्पनी Wi-Fi भेटियो: Wi-Fi मार्फत check-in, GPS बन्द।',hi:'कंपनी Wi-Fi मिला: Wi-Fi से check-in, GPS बंद।'},
    homeWifi:  {vi:'Có Wi-Fi nhà: đang ở nhà, GPS tắt.',en:'Home Wi-Fi: at home, GPS off.',ko:'집 Wi-Fi: 집에 있음, GPS 꺼짐.',ja:'自宅Wi-Fi: 自宅にいます、GPSオフ。',zh:'家庭Wi-Fi：在家，GPS关闭。',my:'အိမ် Wi-Fi: အိမ်မှာ, GPS ပိတ်။',th:'Wi-Fi บ้าน: อยู่บ้าน, GPS ปิด',id:'Wi-Fi rumah: di rumah, GPS mati.',ph:'Wi-Fi bahay: nasa bahay, GPS off.',ne:'घर Wi-Fi: घरमा छौ, GPS बन्द।',hi:'घर Wi-Fi: घर पर, GPS बंद।'},
    leftHome:  {vi:'Wi-Fi báo đã rời nhà: bật GPS kiểm tra.',en:'Wi-Fi: left home, turning on GPS.',ko:'Wi-Fi: 집 떠남, GPS 켜짐.',ja:'Wi-Fi: 自宅を出た、GPS起動。',zh:'Wi-Fi：已离家，开启GPS。',my:'Wi-Fi: အိမ်ကထွက်ပြီ၊ GPS ဖွင့်မည်。',th:'Wi-Fi แจ้งออกจากบ้าน: เปิด GPS ตรวจสอบ',id:'Wi-Fi: keluar rumah, GPS dinyalakan.',ph:'Wi-Fi: lumabas sa bahay, GPS bubuksan.',ne:'Wi-Fi: घर छोड्यो, GPS सुरु गर्दै।',hi:'Wi-Fi: घर छोड़ा, GPS चालू हो रहा है।'},
    nearShift: {vi:'Ở nhà nhưng gần giờ ca: GPS bật nhẹ.',en:'At home, near shift time: light GPS on.',ko:'집에 있지만 교대 임박: GPS 경량 켜짐.',ja:'在宅だが交代時間が近い：GPS軽量起動。',zh:'在家但接近班次时间：轻GPS开启。',my:'အိမ်မှာ ဆင်းနီးနေ: GPS နည်းနည်းဖွင့်မည်。',th:'อยู่บ้านแต่ใกล้กะ: เปิด GPS เบาๆ',id:'Di rumah tapi hampir giliran: GPS ringan aktif.',ph:'Sa bahay pero malapit na shift: GPS maliit buksan.',ne:'घरमा तर सिफ्ट नजिक: हल्का GPS सुरु।',hi:'घर पर पर शिफ्ट नजदीक: हल्का GPS चालू।'},
    waitIn:    {vi:'Đang xác nhận vào ca: đủ 20 phút ở công ty mới check-in.',en:'Confirming check-in: need 20 min at workplace.',ko:'체크인 확인 중: 회사에서 20분 필요.',ja:'チェックイン確認中：職場に20分必要。',zh:'正在确认签到：需在公司20分钟。',my:'Check-in အတည်ပြုနေဆဲ: 20 မိနစ်လိုသည်。',th:'กำลังยืนยันเข้ากะ: ต้อง 20 นาทีที่บริษัท',id:'Konfirmasi check-in: butuh 20 menit di kantor.',ph:'Kinukumpirma ang check-in: kailangan 20 min sa trabaho.',ne:'Check-in पुष्टि गर्दै: कम्पनीमा 20 मिनेट चाहिन्छ।',hi:'Check-in पुष्टि: दफ्तर में 20 मिनट चाहिए।'},
    wifiLost:  {vi:'Mất Wi-Fi công ty: GPS đang xác nhận vị trí.',en:'Work Wi-Fi lost: GPS verifying location.',ko:'회사 Wi-Fi 손실: GPS 위치 확인 중.',ja:'会社Wi-Fi喪失：GPS位置確認中。',zh:'公司Wi-Fi断开：GPS正在验证位置。',my:'ကုမ္ပဏီ Wi-Fi ပျောက်: GPS တည်နေရာ စစ်ဆေးနေ。',th:'หาย Wi-Fi บริษัท: GPS กำลังยืนยันตำแหน่ง',id:'Wi-Fi kantor hilang: GPS memverifikasi lokasi.',ph:'Nawala Wi-Fi trabaho: GPS nag-verify ng lokasyon.',ne:'कम्पनी Wi-Fi गुम्यो: GPS स्थान प्रमाणित गर्दै।',hi:'कंपनी Wi-Fi खो गई: GPS स्थान सत्यापित कर रहा है।'},
    gpsBackup: {vi:'Không có Wi-Fi công ty: GPS nền nhẹ giữ trạng thái làm việc.',en:'No work Wi-Fi: light background GPS keeping work state.',ko:'회사 Wi-Fi 없음: GPS 백그라운드 근무 상태 유지.',ja:'会社Wi-Fiなし：バックグラウンドGPSで勤務状態維持。',zh:'无公司Wi-Fi：轻量GPS后台维持工作状态。',my:'ကုမ္ပဏီ Wi-Fi မရှိ: GPS နောက်ခံ အလုပ်အခြေအနေ ထိန်းနေ。',th:'ไม่มี Wi-Fi บริษัท: GPS เบื้องหลังรักษาสถานะทำงาน',id:'Tidak ada Wi-Fi kantor: GPS ringan latar belakang menjaga status kerja.',ph:'Walang Wi-Fi trabaho: GPS background nagpapanatili ng status.',ne:'कम्पनी Wi-Fi छैन: हल्का GPS ले काम अवस्था राख्दैछ।',hi:'कंपनी Wi-Fi नहीं: हल्के GPS से काम की स्थिति बनाए रखना।'},
    waitOut:   {vi:'Đang xác nhận ra ca: đủ 80 phút rời công ty mới checkout.',en:'Confirming checkout: need 80 min away from workplace.',ko:'체크아웃 확인 중: 회사에서 80분 필요.',ja:'チェックアウト確認中：職場離脱80分必要。',zh:'正在确认签出：需离开公司80分钟。',my:'Checkout အတည်ပြုနေ: 80 မိနစ်ထွက်ရမည်。',th:'กำลังยืนยันออกกะ: ต้อง 80 นาทีออกจากบริษัท',id:'Konfirmasi checkout: butuh 80 menit pergi dari kantor.',ph:'Kinukumpirma ang checkout: kailangan 80 min malayo sa trabaho.',ne:'Checkout पुष्टि गर्दै: कम्पनीबाट 80 मिनेट टाढा चाहिन्छ।',hi:'Checkout पुष्टि: दफ्तर से 80 मिनट दूर चाहिए।'},
    gpsOn:     {vi:'GPS đang bật để xác minh.',en:'GPS active for verification.',ko:'GPS 활성화 중.',ja:'GPS検証中。',zh:'GPS正在运行验证。',my:'GPS ဖွင့်ထား အတည်ပြုနေ。',th:'GPS เปิดอยู่เพื่อยืนยัน',id:'GPS aktif untuk verifikasi.',ph:'GPS aktibo para sa verification.',ne:'GPS प्रमाणिकरणका लागि सक्रिय।',hi:'GPS सत्यापन के लिए सक्रिय है।'},
    gpsOff:    {vi:'GPS đang tắt, chỉ theo dõi Wi-Fi.',en:'GPS off, monitoring Wi-Fi only.',ko:'GPS 꺼짐, Wi-Fi만 모니터링.',ja:'GPSオフ、Wi-Fiのみ監視。',zh:'GPS关闭，仅监控Wi-Fi。',my:'GPS ပိတ်, Wi-Fi သာ စောင့်ကြည့်။',th:'GPS ปิด ติดตามเฉพาะ Wi-Fi',id:'GPS mati, hanya memantau Wi-Fi.',ph:'GPS off, Wi-Fi lang ang monitored.',ne:'GPS बन्द, Wi-Fi मात्र निगरानी।',hi:'GPS बंद, केवल Wi-Fi निगरानी।'},
  };
  try {
    if(_sa.state === STATE.WAIT_CHECKIN_CONFIRM)  return T.waitIn[L]||T.waitIn.vi;
    if(_sa.state === STATE.WAIT_CHECKOUT_CONFIRM) return T.waitOut[L]||T.waitOut.vi;
    if(saIsAtWorkWifi()) return T.workWifi[L]||T.workWifi.vi;
    if(saIsAtHomeWifi()) return T.homeWifi[L]||T.homeWifi.vi;
    if(_sa.state === STATE.HOME && saHasLeftHome()) return T.leftHome[L]||T.leftHome.vi;
    if(_sa.state === STATE.HOME && saShouldRunHomeGpsCheck()) return T.nearShift[L]||T.nearShift.vi;
    if(_sa.state === STATE.WORKING && !saIsAtWorkWifi()) return T.gpsBackup[L]||T.gpsBackup.vi;
  } catch(e){}
  return _sa.gpsActive ? (T.gpsOn[L]||T.gpsOn.vi) : (T.gpsOff[L]||T.gpsOff.vi);
}

function saRenderDebugUI(){
  var el = document.getElementById('saSignalDebugBody');
  if(!el) return;

  var wifi = _sa.signals.wifi || {};
  var gps = _sa.signals.gps || {};
  var homeWifi = saIsAtHomeWifi();
  var workWifi = saIsAtWorkWifi();
  // Các biến BTS đã bỏ — không còn dùng BTS
  var L = _saL();
  var _noData  = {vi:'chưa có',en:'no data',ko:'없음',ja:'なし',zh:'无',my:'မရှိ',th:'ไม่มี',id:'belum ada',ph:'wala pa',ne:'छैन',hi:'नहीं'}[L]||'chưa có';
  var _noConn  = {vi:'chưa kết nối',en:'not connected',ko:'미연결',ja:'未接続',zh:'未连接',my:'မချိတ်ဆက်ရ',th:'ยังไม่เชื่อมต่อ',id:'belum terhubung',ph:'hindi pa nakakonekta',ne:'जडान भएको छैन',hi:'कनेक्ट नहीं'}[L]||'chưa kết nối';
  var _noName  = {vi:'không tên',en:'no name',ko:'이름없음',ja:'名前なし',zh:'无名称',my:'အမည်မရှိ',th:'ไม่มีชื่อ',id:'tanpa nama',ph:'walang pangalan',ne:'नाम छैन',hi:'नाम नहीं'}[L]||'không tên';
  var _homeW   = {vi:'nhà',en:'home',ko:'집',ja:'自宅',zh:'家',my:'အိမ်',th:'บ้าน',id:'rumah',ph:'bahay',ne:'घर',hi:'घर'}[L]||'nhà';
  var _workW   = {vi:'công ty',en:'work',ko:'회사',ja:'会社',zh:'公司',my:'ကုမ္ပဏီ',th:'บริษัท',id:'kantor',ph:'trabaho',ne:'कम्पनी',hi:'कंपनी'}[L]||'công ty';
  var _gpsZone = {vi:'GPS vùng công ty',en:'GPS work zone',ko:'GPS 회사 구역',ja:'GPS会社エリア',zh:'GPS公司区域',my:'GPS ကုမ္ပဏီဇုန်',th:'GPS พื้นที่บริษัท',id:'GPS zona kantor',ph:'GPS work zone',ne:'GPS कम्पनी क्षेत्र',hi:'GPS कंपनी क्षेत्र'}[L]||'GPS vùng công ty';
  var _decide  = {vi:'Quyết định',en:'Decision',ko:'판단',ja:'判断',zh:'决定',my:'ဆုံးဖြတ်',th:'การตัดสินใจ',id:'Keputusan',ph:'Desisyon',ne:'निर्णय',hi:'निर्णय'}[L]||'Quyết định';

  var gpsText = gps && gps.lat
    ? (Number(gps.lat).toFixed(5) + ',' + Number(gps.lng).toFixed(5) + ' ±' + Math.round(Number(gps.accuracy) || 0) + 'm')
    : _noData;
  var wifiText = wifi && wifi.connected
    ? (saEsc(wifi.ssid || '(' + _noName + ')') + (wifi.bssid ? ' / ' + saEsc(wifi.bssid) : ''))
    : _noConn;
  // Đã bỏ btsText / BTS rows trong debug — không còn dùng BTS

  el.innerHTML =
    '<div>State: <b>' + saEsc(_sa.state) + '</b> | Auto: ' + (_sa.enabled ? saDebugBadge('ON', true) : saDebugBadge('OFF', false)) + ' | GPS: ' + (_sa.gpsActive ? saDebugBadge('ON', true) : saDebugBadge('OFF', false)) + '</div>' +
    '<div>Poll: Wi-Fi ' + (_saTimers.wifi ? saDebugBadge('ON', true) : saDebugBadge('OFF', false)) + '</div>' +
    '<div>Wi-Fi: ' + wifiText + ' <span style="color:#687385">(' + saSignalAge(_sa.signals.ts && _sa.signals.ts.wifi) + ')</span></div>' +
    '<div>Wi-Fi match: ' + _homeW + '=' + (homeWifi ? saDebugBadge('YES', true) : saDebugBadge('NO', false)) + ' ' + _workW + '=' + (workWifi ? saDebugBadge('YES', true) : saDebugBadge('NO', false)) + '</div>' +
    '<div>GPS: ' + saEsc(gpsText) + ' <span style="color:#687385">(' + saSignalAge(_sa.signals.ts && _sa.signals.ts.gps) + ')</span></div>' +
    '<div>' + _gpsZone + ': ' + saGpsInsideText() + '</div>' +
    '<div style="margin-top:4px;color:#1F4F8F;white-space:normal">' + _decide + ': ' + saEsc(saDecisionText()) + '</div>';
}

// FIX P3 #6: throttle 800ms để chặn user spam click (log thấy 14 click trong 19s).
// Disable + fade button trong khi quét để user thấy feedback rõ ràng.
var _saRefreshBusy = false;
function saRefreshDebug(){
  if(_saRefreshBusy) return;
  _saRefreshBusy = true;
  var btn = document.getElementById('saSignalRefreshBtn');
  var prevOpacity = '';
  if(btn){
    btn.disabled = true;
    prevOpacity = btn.style.opacity;
    btn.style.opacity = '0.5';
    btn.style.cursor = 'wait';
  }
  saWifiPoll();
  // saBtsPoll đã bỏ — không còn poll BTS
  if(_sa.gpsActive) saGpsPoll();
  else saUpdateUI();
  setTimeout(function(){
    _saRefreshBusy = false;
    if(btn){
      btn.disabled = false;
      btn.style.opacity = prevOpacity;
      btn.style.cursor = '';
    }
  }, 800);
}

function saUpdateUI(){
  var s = _sa.state;
  var statusEl = document.getElementById('saStatusText');
  var dotEl = document.getElementById('saStatusDot');
  if(!statusEl) return;

  var L = (window.userData && window.userData.lang) || 'vi';
  var text = '', color = '#ccc';

  var LABELS = {
    HOME:                 {vi:'🏠 Đang ở nhà',              en:'🏠 At home',                  ko:'🏠 집에 있음',             ja:'🏠 自宅',                zh:'🏠 在家',              my:'🏠 အိမ်မှာ',             th:'🏠 อยู่บ้าน',             id:'🏠 Di rumah',             ph:'🏠 Nasa bahay',           ne:'🏠 घरमा',                hi:'🏠 घर पर'},
    LEAVING_HOME:         {vi:'🚶 Đang rời nhà...',         en:'🚶 Leaving home...',           ko:'🚶 집에서 출발 중...',      ja:'🚶 外出中...',             zh:'🚶 离开家...',           my:'🚶 အိမ်မှ ထွက်...',       th:'🚶 ออกจากบ้าน...',         id:'🚶 Keluar rumah...',       ph:'🚶 Umaalis...',            ne:'🚶 घरबाट निस्कँदै...',    hi:'🚶 घर से निकल रहे...'},
    GOING_TO_WORK:        {vi:'🚗 Đang đi tới công ty...',  en:'🚗 Going to work...',          ko:'🚗 출근 중...',             ja:'🚗 出勤中...',             zh:'🚗 去上班...',           my:'🚗 အလုပ်သွား...',         th:'🚗 กำลังไปทำงาน...',       id:'🚗 Ke kantor...',          ph:'🚗 Papunta sa work...',    ne:'🚗 कार्यालय जाँदै...',     hi:'🚗 काम पर जा रहे...'},
    WAIT_CHECKIN_CONFIRM:  {vi:'⏳ Chờ xác nhận vào ca...', en:'⏳ Confirming check-in...', ko:'⏳ 출근 확인 중...', ja:'⏳ 出勤確認中...', zh:'⏳ 正在确认上班...', my:'⏳ အလုပျအဝင်က် အတည်နပᯀ...', th:'⏳ ยืนยันเข้างาน...', id:'⏳ Konfirmasi masuk...', ph:'⏳ Kinukumpirma ang pasok...', ne:'⏳ प्रवेश पुष्टि...', hi:'⏳ प्रवेश पुष्टि...'},
    WORKING:               {vi:'✅ Đang làm việc', en:'✅ Working', ko:'✅ 근무 중', ja:'✅ 勤務中', zh:'✅ 工作中', my:'✅ အလုပ်လုပ်နေ', th:'✅ ทำงานอยู่', id:'✅ Bekerja', ph:'✅ Nagta-trabaho', ne:'✅ काममा', hi:'✅ काम पर'},
    WAIT_CHECKOUT_CONFIRM: {vi:'⏱️ Chờ xác nhận ra ca...', en:'⏱️ Confirming check-out...', ko:'⏱️ 퇴근 확인 대기 중...', ja:'⏱️ 退勤確認待ち...', zh:'⏱️ 等待确认下班...', my:'⏱️ အတည်နပᯀ စောင်...', th:'⏱️ รอยืนยันเลิกงาน...', id:'⏱️ Menunggu konfirmasi...', ph:'⏱️ Naghihintay...', ne:'⏱️ पुष्टि पर्खँदै...', hi:'⏱️ पुष्टि की प्रतीक्षा...'},
    CHECKED_OUT:          {vi:'🏁 Đã ra ca',                en:'🏁 Checked out',               ko:'🏁 퇴근 완료',             ja:'🏁 退勤済み',              zh:'🏁 已下班',              my:'🏁 အလုပ်ပြန်ပြီ',        th:'🏁 ออกงานแล้ว',            id:'🏁 Sudah pulang',          ph:'🏁 Nag-check out na',    ne:'🏁 चेकआउट भयो',           hi:'🏁 चेक आउट हो गया'}
  };

  var COLORS = {
    HOME: '#9CA3AF', LEAVING_HOME: '#F5A623', GOING_TO_WORK: '#2D7DD2',
    WAIT_CHECKIN_CONFIRM: '#F5A623', WORKING: '#0D9E75',
    WAIT_CHECKOUT_CONFIRM: '#F5A623', CHECKED_OUT: '#9CA3AF'
  };

  var label = LABELS[s];
  text = label ? (label[L] || label.en || label.vi) : s;
  color = COLORS[s] || '#ccc';

  // Countdown: thời gian còn lại trong cửa sổ check-in / tan ca
  if(s === STATE.WAIT_CHECKIN_CONFIRM && _sa.checkinWindowStart){
    var elapsed2 = Date.now() - _sa.checkinWindowStart;
    var remain2 = Math.max(0, saCheckinMs() - elapsed2);
    var mins2 = Math.ceil(remain2 / 60000);
    text += ' (' + mins2 + 'p)';
  }
  if(s === STATE.WAIT_CHECKOUT_CONFIRM && _sa.checkoutWindowStart){
    var elapsed = Date.now() - _sa.checkoutWindowStart;
    var remain = Math.max(0, saCheckoutMs() - elapsed);
    var mins = Math.ceil(remain / 60000);
    text += ' (' + mins + 'p)';
  }

  statusEl.textContent = text;
  if(dotEl) dotEl.style.background = color;

  // Cập nhật GPS panel cũ nếu tồn tại
  var gpsTxt = document.getElementById('gpsStatusTxt');
  if(gpsTxt && _sa.enabled) gpsTxt.textContent = text;
  var gpsDot = document.getElementById('gpsStatusDot');
  if(gpsDot && _sa.enabled) gpsDot.style.background = color;
  var now = Date.now();
  if(now - _saPerf.lastDebugRenderAt >= TIMING.DEBUG_RENDER_MS){
    _saPerf.lastDebugRenderAt = now;
    saRenderDebugUI();
  }
  if(now - _saPerf.lastProfileRenderAt >= TIMING.PROFILE_RENDER_MS){
    _saPerf.lastProfileRenderAt = now;
    saRenderProfiles(false);
  }
}

