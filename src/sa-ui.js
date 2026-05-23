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

/* ═══════════════════════════════════════════════════════════════════════════════
   11. LOGGING — Ghi log cho debug/audit
   ═══════════════════════════════════════════════════════════════════════════════ */

var _saTrail = [];
var SA_TRAIL_MAX = 200;

function saLog(type, msg){
  var entry = {
    t: Date.now(),
    type: type,
    state: _sa.state,
    msg: msg || ''
  };
  _saTrail.push(entry);
  if(_saTrail.length > SA_TRAIL_MAX) _saTrail.shift();
  console.log('[SA]', type, msg || '', '| state=' + _sa.state);
}

/* ═══════════════════════════════════════════════════════════════════════════════
   12. PROFILE SETUP — Lưu hồ sơ nhà / công ty
   ═══════════════════════════════════════════════════════════════════════════════ */

/** Bảng thông báo profile dùng chung cho tất cả hàm save/clear */
var _SA_BANNER = {
  noWifi:      {vi:'⚠️ Chưa kết nối Wi-Fi.',en:'⚠️ Not connected to Wi-Fi.',ko:'⚠️ Wi-Fi 미연결.',ja:'⚠️ Wi-Fi未接続。',zh:'⚠️ 未连接Wi-Fi。',my:'⚠️ Wi-Fi မချိတ်ဆက်ရ။',th:'⚠️ ยังไม่เชื่อมต่อ Wi-Fi',id:'⚠️ Belum terhubung Wi-Fi.',ph:'⚠️ Hindi nakakonekta sa Wi-Fi.',ne:'⚠️ Wi-Fi कनेक्ट छैन।',hi:'⚠️ Wi-Fi कनेक्ट नहीं।'},
  // Đã bỏ noBts / btsAmbigH / btsAmbigW — không còn dùng BTS
  noGps:       {vi:'⚠️ Không lấy được GPS.',en:'⚠️ Cannot get GPS.',ko:'⚠️ GPS 없음.',ja:'⚠️ GPS取得失敗。',zh:'⚠️ 无法获取GPS。',my:'⚠️ GPS မရ။',th:'⚠️ ไม่สามารถรับ GPS',id:'⚠️ Tidak bisa dapat GPS.',ph:'⚠️ Hindi makuha ang GPS.',ne:'⚠️ GPS लिन सकिएन।',hi:'⚠️ GPS नहीं मिला।'},
  wifiDupH:    {vi:'ℹ️ Wi-Fi đã có trong hồ sơ nhà.',en:'ℹ️ Wi-Fi already in home profile.',ko:'ℹ️ Wi-Fi 이미 집 프로필에 있음.',ja:'ℹ️ Wi-Fiは自宅プロファイルに既存。',zh:'ℹ️ Wi-Fi已在家庭配置中。',my:'ℹ️ Wi-Fi အိမ်ပရိုဖိုင်တွင် ရှိပြီး။',th:'ℹ️ Wi-Fi มีในโปรไฟล์บ้านแล้ว',id:'ℹ️ Wi-Fi sudah di profil rumah.',ph:'ℹ️ Nasa home profile na ang Wi-Fi.',ne:'ℹ️ Wi-Fi घर प्रोफाइलमा छ।',hi:'ℹ️ Wi-Fi घर प्रोफाइल में पहले से है।'},
  wifiDupW:    {vi:'ℹ️ Wi-Fi đã có trong hồ sơ công ty.',en:'ℹ️ Wi-Fi already in work profile.',ko:'ℹ️ Wi-Fi 이미 회사 프로필에 있음.',ja:'ℹ️ Wi-Fiは会社プロファイルに既存。',zh:'ℹ️ Wi-Fi已在公司配置中。',my:'ℹ️ Wi-Fi ကုမ္ပဏီပရိုဖိုင်တွင် ရှိပြီး။',th:'ℹ️ Wi-Fi มีในโปรไฟล์บริษัทแล้ว',id:'ℹ️ Wi-Fi sudah di profil kantor.',ph:'ℹ️ Nasa work profile na ang Wi-Fi.',ne:'ℹ️ Wi-Fi कम्पनी प्रोफाइलमा छ।',hi:'ℹ️ Wi-Fi कंपनी प्रोफाइल में पहले से है।'},
  // Đã bỏ btsDupH / btsDupW — không còn dùng BTS
  savedWifiH:  {vi:'✅ Đã lưu Wi-Fi nhà: ',en:'✅ Home Wi-Fi saved: ',ko:'✅ 집 Wi-Fi 저장: ',ja:'✅ 自宅Wi-Fi保存: ',zh:'✅ 家Wi-Fi已保存: ',my:'✅ အိမ် Wi-Fi သိမ်းပြီး: ',th:'✅ บันทึก Wi-Fi บ้าน: ',id:'✅ Wi-Fi rumah disimpan: ',ph:'✅ Na-save ang Wi-Fi bahay: ',ne:'✅ घर Wi-Fi सेभ: ',hi:'✅ घर Wi-Fi सहेजा: '},
  savedWifiW:  {vi:'✅ Đã lưu Wi-Fi công ty: ',en:'✅ Work Wi-Fi saved: ',ko:'✅ 회사 Wi-Fi 저장: ',ja:'✅ 会社Wi-Fi保存: ',zh:'✅ 公司Wi-Fi已保存: ',my:'✅ ကုမ္ပဏီ Wi-Fi သိမ်းပြီး: ',th:'✅ บันทึก Wi-Fi บริษัท: ',id:'✅ Wi-Fi kantor disimpan: ',ph:'✅ Na-save ang Wi-Fi trabaho: ',ne:'✅ कम्पनी Wi-Fi सेभ: ',hi:'✅ कंपनी Wi-Fi सहेजा: '},
  // Đã bỏ savedBtsH / savedBtsW — không còn dùng BTS
  savedGpsH:   {vi:'✅ Đã lưu GPS nhà',en:'✅ Home GPS saved',ko:'✅ 집 GPS 저장됨',ja:'✅ 自宅GPS保存済',zh:'✅ 家GPS已保存',my:'✅ အိမ် GPS သိမ်းပြီ',th:'✅ บันทึก GPS บ้านแล้ว',id:'✅ GPS rumah disimpan',ph:'✅ Na-save ang GPS bahay',ne:'✅ घर GPS सेभ भयो',hi:'✅ घर GPS सहेजा'},
  savedGpsW:   {vi:'✅ Đã lưu GPS công ty',en:'✅ Work GPS saved',ko:'✅ 회사 GPS 저장됨',ja:'✅ 会社GPS保存済',zh:'✅ 公司GPS已保存',my:'✅ ကုမ္ပဏီ GPS သိမ်းပြီ',th:'✅ บันทึก GPS บริษัทแล้ว',id:'✅ GPS kantor disimpan',ph:'✅ Na-save ang GPS trabaho',ne:'✅ कम्पनी GPS सेभ भयो',hi:'✅ कंपनी GPS सहेजा'},
  clearedH:    {vi:'🗑️ Đã xóa hồ sơ nhà',en:'🗑️ Home profile cleared',ko:'🗑️ 집 프로필 초기화됨',ja:'🗑️ 自宅プロファイルを削除しました',zh:'🗑️ 家庭配置已清除',my:'🗑️ အိမ်ပရိုဖိုင်ဖျက်ပြီ',th:'🗑️ ลบโปรไฟล์บ้านแล้ว',id:'🗑️ Profil rumah dihapus',ph:'🗑️ Na-clear ang home profile',ne:'🗑️ घर प्रोफाइल मेटाइयो',hi:'🗑️ घर प्रोफाइल साफ किया'},
  clearedW:    {vi:'🗑️ Đã xóa Wi-Fi công ty',en:'🗑️ Work Wi-Fi cleared',ko:'🗑️ 회사 Wi-Fi 초기화됨',ja:'🗑️ 会社Wi-Fiを削除しました',zh:'🗑️ 公司Wi-Fi已清除',my:'🗑️ ကုမ္ပဏီ Wi-Fi ဖျက်ပြီ',th:'🗑️ ลบ Wi-Fi บริษัทแล้ว',id:'🗑️ Wi-Fi kantor dihapus',ph:'🗑️ Na-clear ang work Wi-Fi',ne:'🗑️ कम्पनी Wi-Fi मेटाइयो',hi:'🗑️ कंपनी Wi-Fi साफ किया'},
  noWifiSub:   {vi:'❌ Không tìm thấy Wi-Fi',en:'❌ No Wi-Fi found',ko:'❌ Wi-Fi 없음',ja:'❌ Wi-Fiが見つかりません',zh:'❌ 找不到Wi-Fi',my:'❌ Wi-Fi မတွေ့',th:'❌ ไม่พบ Wi-Fi',id:'❌ Wi-Fi tidak ditemukan',ph:'❌ Walang Wi-Fi',ne:'❌ Wi-Fi भेटिएन',hi:'❌ Wi-Fi नहीं मिला'},
  wifiDupSub:  {vi:'ℹ️ Wi-Fi việc phụ đã có',en:'ℹ️ Sub-job Wi-Fi already saved',ko:'ℹ️ 부업 Wi-Fi 이미 저장됨',ja:'ℹ️ 副業Wi-Fiは既存',zh:'ℹ️ 副业Wi-Fi已存在',my:'ℹ️ Sub-job Wi-Fi ရှိပြီး',th:'ℹ️ Wi-Fi งานเสริมมีแล้ว',id:'ℹ️ Wi-Fi sub-job sudah ada',ph:'ℹ️ Naroon na ang Wi-Fi ng sub-job',ne:'ℹ️ Sub-job Wi-Fi छ',hi:'ℹ️ Sub-job Wi-Fi पहले से है'},
  savedWifiSub:{vi:'✅ Đã lưu Wi-Fi việc phụ: ',en:'✅ Sub-job Wi-Fi saved: ',ko:'✅ 부업 Wi-Fi 저장: ',ja:'✅ 副業Wi-Fi保存: ',zh:'✅ 副业Wi-Fi已保存: ',my:'✅ Sub-job Wi-Fi သိမ်းပြီး: ',th:'✅ บันทึก Wi-Fi งานเสริม: ',id:'✅ Wi-Fi sub-job disimpan: ',ph:'✅ Na-save ang Wi-Fi ng sub-job: ',ne:'✅ Sub-job Wi-Fi सेभ: ',hi:'✅ Sub-job Wi-Fi सहेजा: '},
  // Đã bỏ noBtsSub / btsDupSub / savedBtsSub — không còn dùng BTS
  noGpsSub:    {vi:'❌ Không có GPS',en:'❌ No GPS',ko:'❌ GPS 없음',ja:'❌ GPSなし',zh:'❌ 无GPS',my:'❌ GPS မရှိ',th:'❌ ไม่มี GPS',id:'❌ Tidak ada GPS',ph:'❌ Walang GPS',ne:'❌ GPS छैन',hi:'❌ GPS नहीं'},
  savedGpsSub: {vi:'✅ Đã lưu GPS việc phụ',en:'✅ Sub-job GPS saved',ko:'✅ 부업 GPS 저장됨',ja:'✅ 副業GPS保存済',zh:'✅ 副业GPS已保存',my:'✅ Sub-job GPS သိမ်းပြီ',th:'✅ บันทึก GPS งานเสริมแล้ว',id:'✅ GPS sub-job disimpan',ph:'✅ Na-save ang GPS ng sub-job',ne:'✅ Sub-job GPS सेभ भयो',hi:'✅ Sub-job GPS सहेजा'},
  clearedSub:  {vi:'🗑️ Đã xóa hồ sơ việc phụ',en:'🗑️ Sub-job profile cleared',ko:'🗑️ 부업 프로필 초기화됨',ja:'🗑️ 副業プロファイル削除',zh:'🗑️ 副业配置已清除',my:'🗑️ Sub-job ပရိုဖိုင်ဖျက်ပြီ',th:'🗑️ ลบโปรไฟล์งานเสริมแล้ว',id:'🗑️ Profil sub-job dihapus',ph:'🗑️ Na-clear ang sub-job profile',ne:'🗑️ Sub-job प्रोफाइल मेटाइयो',hi:'🗑️ Sub-job प्रोफाइल साफ किया'},
};
function _saB(key){ var L=_saL(); return (_SA_BANNER[key]||{})[L] || (_SA_BANNER[key]||{}).vi || ''; }

/**
 * Helper kiểm tra Wi-Fi đã có trong danh sách chưa.
 * STRICT BSSID-FIRST:
 *   - Nếu cả 2 đều có BSSID → so BSSID (lowercase). Khác BSSID = entry MỚI (cho phép lưu).
 *   - Nếu thiếu BSSID 1 bên → fallback so SSID (backward compat / OS che BSSID).
 * Cho phép nhiều router cùng SSID (mesh, multi-AP) lưu thành nhiều entry riêng.
 */
function _saWifiIsDuplicate(list, info){
  if(!list || !list.length || !info) return false;
  var curBssid = info.bssid ? String(info.bssid).toLowerCase() : '';
  for(var i = 0; i < list.length; i++){
    var p = list[i];
    var pBssid = p.bssid ? String(p.bssid).toLowerCase() : '';
    if(pBssid && curBssid){
      if(pBssid === curBssid) return true; // cùng router vật lý
      continue; // khác BSSID → không tính trùng dù SSID có thể giống
    }
    // Thiếu BSSID 1 bên → fallback SSID
    if(p.ssid && info.ssid && p.ssid === info.ssid) return true;
  }
  return false;
}

/** Lưu Wi-Fi hiện tại vào hồ sơ nhà (ưu tiên BSSID làm khoá duy nhất) */
function saSaveHomeWifi(){
  saGetWifi(function(info){
    if(!info || !info.connected || !info.ssid){
      showGpsBanner(_saB('noWifi'), '#E8433A');
      return;
    }
    if(_saWifiIsDuplicate(_sa.home.wifi, info)){
      showGpsBanner(_saB('wifiDupH'), '#2D7DD2');
      return;
    }
    _sa.home.wifi.push({ssid: info.ssid, bssid: info.bssid || ''});
    saSave();
    saSyncNativeSmartState();
    saRenderHomeProfile();
    showGpsBanner(_saB('savedWifiH') + info.ssid, '#0D9E75');
  });
}

// (Đã bỏ saSaveHomeBts — không còn lưu BTS cho hồ sơ nhà)

/** Lưu GPS hiện tại vào hồ sơ nhà */
function saSaveHomeGps(){
  saGetGps(function(gps){
    if(!gps){
      showGpsBanner(_saB('noGps'), '#E8433A');
      return;
    }
    _sa.home.gps = {lat: gps.lat, lng: gps.lng, radius: 200};
    saSave();
    saSyncNativeSmartState();
    saRenderHomeProfile();
    showGpsBanner(_saB('savedGpsH'), '#0D9E75');
  });
}

/** Lưu Wi-Fi hiện tại vào hồ sơ công ty (ưu tiên BSSID làm khoá duy nhất) */
function saSaveWorkWifi(){
  saGetWifi(function(info){
    if(!info || !info.connected || !info.ssid){
      showGpsBanner(_saB('noWifi'), '#E8433A');
      return;
    }
    if(_saWifiIsDuplicate(_sa.work.wifi, info)){
      showGpsBanner(_saB('wifiDupW'), '#2D7DD2');
      return;
    }
    _sa.work.wifi.push({ssid: info.ssid, bssid: info.bssid || ''});
    saSave();
    saSyncNativeSmartState();
    saRenderWorkProfile();
    showGpsBanner(_saB('savedWifiW') + info.ssid, '#0D9E75');
  });
}

// (Đã bỏ saSaveWorkBts — không còn lưu BTS cho hồ sơ công ty)

/** Lưu GPS hiện tại vào hồ sơ công ty */
function saSaveWorkGps(){
  saGetGps(function(gps){
    if(!gps){
      showGpsBanner(_saB('noGps'), '#E8433A');
      return;
    }
    _sa.work.gps = {lat:gps.lat, lng:gps.lng, radius:100};
    try{
      if(window._gpsData && typeof gpsPersistCompanyLocation === 'function'){
        gpsPersistCompanyLocation(gps.lat, gps.lng, 100, 'main');
      }
      if(window._gpsData){
        _gpsData.activeJob = 'main';
        _gpsData.lat = gps.lat;
        _gpsData.lng = gps.lng;
        _gpsData.radius = 100;
      }
    }catch(e){}
    saSave();
    saSyncNativeSmartState();
    saRenderWorkProfile();
    showGpsBanner(_saB('savedGpsW'), '#0D9E75');
  });
}

/** Xóa hồ sơ nhà */
function saClearHome(){
  _sa.home = {wifi:[], gps:null};
  saSave();
  saSyncNativeSmartState();
  saRenderHomeProfile();
  showGpsBanner(_saB('clearedH'), '#9CA3AF');
}

/** Xóa Wi-Fi công ty (giữ GPS) */
function saClearWorkSignals(){
  _sa.work.wifi = [];
  // _sa.work.bts đã bỏ — không còn dùng BTS
  saSave();
  saSyncNativeSmartState();
  saRenderWorkProfile();
  showGpsBanner(_saB('clearedW'), '#9CA3AF');
}

/* ── Hồ sơ việc phụ ── */

function saSaveSubWorkWifi(){
  saGetWifi(function(info){
    if(!info || !info.connected || !info.ssid){ showGpsBanner(_saB('noWifiSub'), '#E8433A'); return; }
    if(!_sa.subWork) _sa.subWork = {wifi:[], gps:null};
    if(_saWifiIsDuplicate(_sa.subWork.wifi, info)){
      showGpsBanner(_saB('wifiDupSub'), '#2D7DD2'); return;
    }
    _sa.subWork.wifi.push({ssid:info.ssid, bssid:info.bssid||''});
    saSave(); saRenderSubWorkProfile();
    showGpsBanner(_saB('savedWifiSub')+info.ssid, '#7B5EA7');
  });
}

// (Đã bỏ saSaveSubWorkBts — không còn lưu BTS cho việc phụ)

function saSaveSubWorkGps(){
  saGetGps(function(gps){
    if(!gps){ showGpsBanner(_saB('noGpsSub'), '#E8433A'); return; }
    if(!_sa.subWork) _sa.subWork = {wifi:[], gps:null};
    _sa.subWork.gps = {lat:gps.lat, lng:gps.lng, radius:100};
    saSave(); saRenderSubWorkProfile();
    showGpsBanner(_saB('savedGpsSub'), '#7B5EA7');
  });
}

function saClearSubWorkSignals(){
  if(!_sa.subWork) _sa.subWork = {wifi:[], gps:null};
  _sa.subWork.wifi = []; _sa.subWork.gps = null;
  saSave(); saRenderSubWorkProfile();
  showGpsBanner(_saB('clearedSub'), '#9CA3AF');
}

/* ═══════════════════════════════════════════════════════════════════════════════
   13. RENDER PROFILE UI — Hiển thị hồ sơ trong panel GPS
   ═══════════════════════════════════════════════════════════════════════════════ */

function saEscHtml(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
  });
}

/** Render phần hồ sơ nhà */
function saRenderHomeProfile(){
  var box = document.getElementById('saHomeProfile');
  if(!box) return;
  var L = _saL();
  var _notSaved  = {vi:'Chưa lưu',en:'Not saved',ko:'저장 안됨',ja:'未保存',zh:'未保存',my:'မသိမ်း',th:'ยังไม่บันทึก',id:'Belum disimpan',ph:'Hindi pa naka-save',ne:'सेभ भएको छैन',hi:'सहेजा नहीं'}[L]||'Chưa lưu';
  var _wifiHome  = {vi:'📶 Wi-Fi nhà',en:'📶 Home Wi-Fi',ko:'📶 집 Wi-Fi',ja:'📶 自宅Wi-Fi',zh:'📶 家庭Wi-Fi',my:'📶 အိမ် Wi-Fi',th:'📶 Wi-Fi บ้าน',id:'📶 Wi-Fi rumah',ph:'📶 Wi-Fi bahay',ne:'📶 घर Wi-Fi',hi:'📶 घर Wi-Fi'}[L]||'📶 Wi-Fi nhà';
  var _saveWifi  = {vi:'📶 Lưu Wi-Fi hiện tại',en:'📶 Save current Wi-Fi',ko:'📶 현재 Wi-Fi 저장',ja:'📶 現在のWi-Fiを保存',zh:'📶 保存当前Wi-Fi',my:'📶 လက်ရှိ Wi-Fi သိမ်း',th:'📶 บันทึก Wi-Fi ปัจจุบัน',id:'📶 Simpan Wi-Fi saat ini',ph:'📶 I-save ang Wi-Fi ngayon',ne:'📶 हालको Wi-Fi सेभ गर्नुस्',hi:'📶 वर्तमान Wi-Fi सहेजें'}[L]||'📶 Lưu Wi-Fi hiện tại';
  // Đã bỏ _btsHome / _saveBts — không còn BTS
  var _gpsHome   = {vi:'📍 GPS nhà (dự phòng)',en:'📍 Home GPS (backup)',ko:'📍 집 GPS (백업)',ja:'📍 自宅GPS（バックアップ）',zh:'📍 家庭GPS（备用）',my:'📍 အိမ် GPS (backup)',th:'📍 GPS บ้าน (สำรอง)',id:'📍 GPS rumah (cadangan)',ph:'📍 GPS bahay (backup)',ne:'📍 घर GPS (ब्याकअप)',hi:'📍 घर GPS (बैकअप)'}[L]||'📍 GPS nhà (dự phòng)';
  var _saveGps   = {vi:'📍 Lưu GPS nhà',en:'📍 Save home GPS',ko:'📍 집 GPS 저장',ja:'📍 自宅GPSを保存',zh:'📍 保存家庭GPS',my:'📍 အိမ် GPS သိမ်း',th:'📍 บันทึก GPS บ้าน',id:'📍 Simpan GPS rumah',ph:'📍 I-save ang GPS bahay',ne:'📍 घर GPS सेभ गर्नुस्',hi:'📍 घर GPS सहेजें'}[L]||'📍 Lưu GPS nhà';
  var _clearHome = {vi:'🗑️ Xóa hồ sơ nhà',en:'🗑️ Clear home profile',ko:'🗑️ 집 프로필 초기화',ja:'🗑️ 自宅プロファイルを削除',zh:'🗑️ 清除家庭配置',my:'🗑️ အိမ်ပရိုဖိုင်ဖျက်',th:'🗑️ ลบโปรไฟล์บ้าน',id:'🗑️ Hapus profil rumah',ph:'🗑️ Burahin ang profile ng bahay',ne:'🗑️ घर प्रोफाइल मेटाउनुस्',hi:'🗑️ घर प्रोफाइल हटाएं'}[L]||'🗑️ Xóa hồ sơ nhà';

  var html = '';
  html += '<div style="font-size:11px;font-weight:900;color:var(--text3);margin-bottom:6px">' + _wifiHome + '</div>';
  if(_sa.home.wifi.length === 0){
    html += '<div style="font-size:12px;color:var(--text3);margin-bottom:8px">' + _notSaved + '</div>';
  } else {
    for(var i = 0; i < _sa.home.wifi.length; i++){
      var w = _sa.home.wifi[i];
      html += '<div style="font-size:12px;color:var(--text);margin-bottom:4px">• ' + saEscHtml(w.ssid) +
              ' <span onclick="_saRemoveHomeWifi('+i+')" style="color:#E8433A;cursor:pointer;font-size:11px">✕</span></div>';
    }
  }
  html += '<button onclick="saSaveHomeWifi()" style="margin:6px 0 12px;padding:8px 14px;border-radius:8px;border:1.5px solid var(--ac);background:white;color:var(--ac);font-size:11px;font-weight:800;font-family:Nunito,sans-serif">' + _saveWifi + '</button>';

  // Đã bỏ section BTS nhà — không còn dùng BTS

  html += '<div style="font-size:11px;font-weight:900;color:var(--text3);margin-bottom:6px">' + _gpsHome + '</div>';
  if(!_sa.home.gps){
    html += '<div style="font-size:12px;color:var(--text3);margin-bottom:8px">' + _notSaved + '</div>';
  } else {
    html += '<div style="font-size:12px;color:var(--text);margin-bottom:8px">' +
            _sa.home.gps.lat.toFixed(5) + ', ' + _sa.home.gps.lng.toFixed(5) + '</div>';
  }
  html += '<button onclick="saSaveHomeGps()" style="margin:6px 0 8px;padding:8px 14px;border-radius:8px;border:1.5px solid var(--border);background:white;color:var(--text2);font-size:11px;font-weight:800;font-family:Nunito,sans-serif">' + _saveGps + '</button>';

  html += '<div style="margin-top:8px"><button onclick="saClearHome()" style="padding:6px 12px;border-radius:8px;border:1px solid #E8433A;background:white;color:#E8433A;font-size:11px;font-weight:800;font-family:Nunito,sans-serif">' + _clearHome + '</button></div>';

  box.innerHTML = html;
}

/** Render phần Wi-Fi công ty */
function saRenderWorkProfile(){
  var box = document.getElementById('saWorkProfile');
  if(!box) return;
  var L = _saL();
  var _notSaved  = {vi:'Chưa lưu',en:'Not saved',ko:'저장 안됨',ja:'未保存',zh:'未保存',my:'မသိမ်း',th:'ยังไม่บันทึก',id:'Belum disimpan',ph:'Hindi pa naka-save',ne:'सेभ भएको छैन',hi:'सहेजा नहीं'}[L]||'Chưa lưu';
  var _wifiWork  = {vi:'📶 Wi-Fi công ty',en:'📶 Work Wi-Fi',ko:'📶 회사 Wi-Fi',ja:'📶 会社Wi-Fi',zh:'📶 公司Wi-Fi',my:'📶 ကုမ္ပဏီ Wi-Fi',th:'📶 Wi-Fi บริษัท',id:'📶 Wi-Fi kantor',ph:'📶 Wi-Fi trabaho',ne:'📶 कम्पनी Wi-Fi',hi:'📶 कंपनी Wi-Fi'}[L]||'📶 Wi-Fi công ty';
  var _saveWifi  = {vi:'📶 Lưu Wi-Fi hiện tại',en:'📶 Save current Wi-Fi',ko:'📶 현재 Wi-Fi 저장',ja:'📶 現在のWi-Fiを保存',zh:'📶 保存当前Wi-Fi',my:'📶 လက်ရှိ Wi-Fi သိမ်း',th:'📶 บันทึก Wi-Fi ปัจจุบัน',id:'📶 Simpan Wi-Fi saat ini',ph:'📶 I-save ang Wi-Fi ngayon',ne:'📶 हालको Wi-Fi सेभ गर्नुस्',hi:'📶 वर्तमान Wi-Fi सहेजें'}[L]||'📶 Lưu Wi-Fi hiện tại';
  var _gpsWork   = {vi:'📍 GPS công ty',en:'📍 Work GPS',ko:'📍 회사 GPS',ja:'📍 会社GPS',zh:'📍 公司GPS',my:'📍 ကုမ္ပဏီ GPS',th:'📍 GPS บริษัท',id:'📍 GPS kantor',ph:'📍 GPS trabaho',ne:'📍 कम्पनी GPS',hi:'📍 कंपनी GPS'}[L]||'📍 GPS công ty';
  var _saveGps   = {vi:'📍 Lưu GPS công ty',en:'📍 Save work GPS',ko:'📍 회사 GPS 저장',ja:'📍 会社GPSを保存',zh:'📍 保存公司GPS',my:'📍 ကုမ္ပဏီ GPS သိမ်း',th:'📍 บันทึก GPS บริษัท',id:'📍 Simpan GPS kantor',ph:'📍 I-save ang GPS trabaho',ne:'📍 कम्पनी GPS सेभ गर्नुस्',hi:'📍 कंपनी GPS सहेजें'}[L]||'📍 Lưu GPS công ty';
  // Đã bỏ _btsWork / _saveBts — không còn BTS
  var _clearWork = {vi:'🗑️ Xóa Wi-Fi công ty',en:'🗑️ Clear work Wi-Fi',ko:'🗑️ 회사 Wi-Fi 초기화',ja:'🗑️ 会社Wi-Fiを削除',zh:'🗑️ 清除公司Wi-Fi',my:'🗑️ ကုမ္ပဏီ Wi-Fi ဖျက်',th:'🗑️ ลบ Wi-Fi บริษัท',id:'🗑️ Hapus Wi-Fi kantor',ph:'🗑️ Burahin ang Wi-Fi trabaho',ne:'🗑️ कम्पनी Wi-Fi मेटाउनुस्',hi:'🗑️ कंपनी Wi-Fi हटाएं'}[L]||'🗑️ Xóa Wi-Fi công ty';

  var html = '';
  html += '<div style="font-size:11px;font-weight:900;color:var(--text3);margin-bottom:6px">' + _wifiWork + '</div>';
  if(_sa.work.wifi.length === 0){
    html += '<div style="font-size:12px;color:var(--text3);margin-bottom:8px">' + _notSaved + '</div>';
  } else {
    for(var i = 0; i < _sa.work.wifi.length; i++){
      var w = _sa.work.wifi[i];
      html += '<div style="font-size:12px;color:var(--text);margin-bottom:4px">• ' + saEscHtml(w.ssid) +
              ' <span onclick="_saRemoveWorkWifi('+i+')" style="color:#E8433A;cursor:pointer;font-size:11px">✕</span></div>';
    }
  }
  html += '<button onclick="saSaveWorkWifi()" style="margin:6px 0 12px;padding:8px 14px;border-radius:8px;border:1.5px solid var(--ac);background:white;color:var(--ac);font-size:11px;font-weight:800;font-family:Nunito,sans-serif">' + _saveWifi + '</button>';

  // Đã bỏ section BTS công ty — không còn dùng BTS

  html += '<div style="font-size:11px;font-weight:900;color:var(--text3);margin:8px 0 6px">' + _gpsWork + '</div>';
  if(!_sa.work.gps){
    html += '<div style="font-size:12px;color:var(--text3);margin-bottom:4px">' + _notSaved + '</div>';
  } else {
    html += '<div style="font-size:12px;color:var(--text);margin-bottom:4px">' +
            _sa.work.gps.lat.toFixed(5) + ', ' + _sa.work.gps.lng.toFixed(5) +
            ' <span onclick="saClearWorkGps&&saClearWorkGps()" style="color:#E8433A;cursor:pointer;font-size:11px">✕</span></div>';
  }
  html += '<button onclick="saSaveWorkGps()" style="margin:4px 0 8px;padding:8px 14px;border-radius:8px;border:1.5px solid var(--border);background:white;color:var(--text2);font-size:11px;font-weight:800;font-family:Nunito,sans-serif">' + _saveGps + '</button>';

  html += '<div style="margin-top:8px"><button onclick="saClearWorkSignals()" style="padding:6px 12px;border-radius:8px;border:1px solid #E8433A;background:white;color:#E8433A;font-size:11px;font-weight:800;font-family:Nunito,sans-serif">' + _clearWork + '</button></div>';

  box.innerHTML = html;
}

function saRenderSubWorkProfile(){
  var section = document.getElementById('saSubWorkSection');
  var box = document.getElementById('saSubWorkProfile');
  if(!box) return;
  var active = !!(window.userData && userData.subJob && userData.subJob.active);
  if(section) section.style.display = active ? 'block' : 'none';
  if(!active){ box.innerHTML = ''; return; }
  if(!_sa.subWork) _sa.subWork = {wifi:[], gps:null};
  var html = '';
  html += '<div style="font-size:11px;font-weight:900;color:#5a3e8e;margin-bottom:6px">📶 Wi-Fi việc phụ</div>';
  if(!_sa.subWork.wifi.length){
    html += '<div style="font-size:12px;color:var(--text3);margin-bottom:8px">Chưa lưu</div>';
  } else {
    for(var i=0; i<_sa.subWork.wifi.length; i++){
      var w=_sa.subWork.wifi[i];
      html += '<div style="font-size:12px;color:var(--text);margin-bottom:4px">• '+saEscHtml(w.ssid)+
              ' <span onclick="_saRemoveSubWorkWifi('+i+')" style="color:#E8433A;cursor:pointer;font-size:11px">✕</span></div>';
    }
  }
  html += '<button onclick="saSaveSubWorkWifi()" style="margin:6px 0 12px;padding:8px 14px;border-radius:8px;border:1.5px solid #7B5EA7;background:white;color:#7B5EA7;font-size:11px;font-weight:800;font-family:Nunito,sans-serif">📶 Lưu Wi-Fi việc phụ</button>';
  // Đã bỏ section BTS việc phụ — không còn dùng BTS
  html += '<div style="font-size:11px;font-weight:900;color:#5a3e8e;margin:8px 0 6px">📍 GPS việc phụ</div>';
  if(_sa.subWork.gps){
    html += '<div style="font-size:12px;color:var(--text);margin-bottom:4px">'+
            _sa.subWork.gps.lat.toFixed(5)+', '+_sa.subWork.gps.lng.toFixed(5)+
            ' <span onclick="saClearSubWorkGps&&saClearSubWorkGps()" style="color:#E8433A;cursor:pointer;font-size:11px">✕</span></div>';
  } else {
    html += '<div style="font-size:12px;color:var(--text3);margin-bottom:4px">Chưa lưu</div>';
  }
  html += '<button onclick="saSaveSubWorkGps()" style="margin:4px 0 8px;padding:8px 14px;border-radius:8px;border:1.5px solid var(--border);background:white;color:var(--text2);font-size:11px;font-weight:800;font-family:Nunito,sans-serif">📍 Lưu GPS việc phụ</button>';
  html += '<div style="margin-top:8px"><button onclick="saClearSubWorkSignals()" style="padding:6px 12px;border-radius:8px;border:1px solid #E8433A;background:white;color:#E8433A;font-size:11px;font-weight:800;font-family:Nunito,sans-serif">🗑️ Xóa hồ sơ việc phụ</button></div>';
  box.innerHTML = html;
}

/* ── Helpers xóa từng mục ── */
window._saRemoveHomeWifi = function(i){ _sa.home.wifi.splice(i,1); saSave(); saSyncNativeSmartState(); saRenderHomeProfile(); };
window._saRemoveWorkWifi = function(i){ _sa.work.wifi.splice(i,1); saSave(); saSyncNativeSmartState(); saRenderWorkProfile(); };
window._saRemoveSubWorkWifi = function(i){ if(_sa.subWork) _sa.subWork.wifi.splice(i,1); saSave(); saRenderSubWorkProfile(); };
window.saClearWorkGps      = function(){ _sa.work.gps=null; saSave(); saSyncNativeSmartState(); saRenderWorkProfile(); };
window.saClearSubWorkGps    = function(){ if(_sa.subWork) _sa.subWork.gps=null; saSave(); saRenderSubWorkProfile(); };
// Đã bỏ _saRemoveHomeBts / _saRemoveWorkBts / _saRemoveSubWorkBts — không còn BTS

var _saProfileRenderSig = '';
function saProfileRenderSignature(){
  try {
    return JSON.stringify({
      homeWifi: _sa.home.wifi || [],
      homeGps: _sa.home.gps || null,
      workWifi: _sa.work.wifi || [],
      workGps: _sa.work.gps || null,
      // homeBts/workBts/subWorkBts đã bỏ — không còn BTS
      subWorkWifi: (_sa.subWork && _sa.subWork.wifi) || [],
      subWorkGps:  (_sa.subWork && _sa.subWork.gps)  || null
    });
  } catch(e){
    return String(Date.now());
  }
}

function saRenderProfiles(force){
  var sig = saProfileRenderSignature();
  if(!force && sig === _saProfileRenderSig) return;
  _saProfileRenderSig = sig;
  saRenderHomeProfile();
  saRenderWorkProfile();
  saRenderSubWorkProfile();
}

function saSyncLegacyAutoSwitch(enabled){
  var on = !!enabled;
  try {
    if(window._gpsData){
      _gpsData.enabled = on;
      _gpsData.smartAttendanceMode = on;
      _gpsData.insideScheduleOut = false;
    }
    if(window.notifCfg) notifCfg.n3 = on;
    var gpsBtn = document.getElementById('togN3');
    if(gpsBtn) gpsBtn.classList.toggle('on', on);
    var saBtn = document.getElementById('togSA');
    if(saBtn) saBtn.classList.toggle('on', on);
    var card = document.getElementById('gpsSetupCard');
    if(card) card.style.display = on ? 'block' : 'none';
    if(typeof saveNotif === 'function') saveNotif();
    if(typeof saveGpsData === 'function') saveGpsData();
    if(!on && typeof stopGeofencing === 'function') stopGeofencing();
  } catch(e){
    console.warn('[SA] sync legacy switch failed:', e);
  }
}

