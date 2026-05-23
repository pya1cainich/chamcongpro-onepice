/* ═══════════════════════════════════════════════════════════════════════════
   I18N CHO GPS v3 CARDS (Battery profile, Stats, Trail viewer)
   ═══════════════════════════════════════════════════════════════════════════ */
/** Đồng bộ text các card GPS v3 theo ngôn ngữ */
function syncGpsV3I18n(){
  const L = (userData && userData.lang) || 'vi';
  const T = {
    vi:{
      batteryTitle:'🔋 Chế độ pin', batNormal:'Bình thường', batLow:'Tiết kiệm', batCritical:'Tối thiểu',
      batteryHint:'⚡ Tự động chuyển khi pin yếu (cần Battery API)',
      statsTitle:'📊 Trạng thái GPS', statsRefresh:'Làm mới', statsHint:'Bấm Làm mới để xem...',
      trailTitle:'📍 GPS Trail (Audit)', trailView:'Xem hôm nay', trailHint:'Bấm "Xem hôm nay" để hiển thị...'
    },
    en:{
      batteryTitle:'🔋 Battery mode', batNormal:'Normal', batLow:'Saver', batCritical:'Minimum',
      batteryHint:'⚡ Auto-switch on low battery (Battery API required)',
      statsTitle:'📊 GPS Status', statsRefresh:'Refresh', statsHint:'Tap Refresh to view...',
      trailTitle:'📍 GPS Trail (Audit)', trailView:'View today', trailHint:'Tap "View today" to show...'
    },
    ko:{
      batteryTitle:'🔋 배터리 모드', batNormal:'보통', batLow:'절약', batCritical:'최소',
      batteryHint:'⚡ 배터리 부족 시 자동 전환 (Battery API 필요)',
      statsTitle:'📊 GPS 상태', statsRefresh:'새로고침', statsHint:'새로고침을 눌러 확인...',
      trailTitle:'📍 GPS 기록 (감사)', trailView:'오늘 보기', trailHint:'"오늘 보기"를 눌러 표시...'
    },
    ja:{
      batteryTitle:'🔋 バッテリーモード', batNormal:'通常', batLow:'省電力', batCritical:'最小',
      batteryHint:'⚡ バッテリー残量低下時に自動切替 (Battery APIが必要)',
      statsTitle:'📊 GPSステータス', statsRefresh:'更新', statsHint:'更新を押して表示...',
      trailTitle:'📍 GPS履歴 (監査)', trailView:'今日を表示', trailHint:'「今日を表示」を押して表示...'
    },
    zh:{
      batteryTitle:'🔋 电池模式', batNormal:'正常', batLow:'省电', batCritical:'最低',
      batteryHint:'⚡ 电量低时自动切换 (需要 Battery API)',
      statsTitle:'📊 GPS 状态', statsRefresh:'刷新', statsHint:'点击刷新查看...',
      trailTitle:'📍 GPS 轨迹 (审计)', trailView:'查看今天', trailHint:'点击"查看今天"显示...'
    },
    my:{
      batteryTitle:'🔋 ဘတ္ထရီ မုဒ်', batNormal:'ပုံမှန်', batLow:'ချွေတာ', batCritical:'အနည်းဆုံး',
      batteryHint:'⚡ ဘတ္ထရီနည်းသောအခါ အလိုအလျောက်ပြောင်းသည် (Battery API လိုအပ်)',
      statsTitle:'📊 GPS အခြေအနေ', statsRefresh:'ပြန်လည်ဖွင့်', statsHint:'ကြည့်ရန် ပြန်လည်ဖွင့်ကို နှိပ်ပါ...',
      trailTitle:'📍 GPS မှတ်တမ်း', trailView:'ဒီနေ့ ကြည့်', trailHint:'"ဒီနေ့ ကြည့်" ကို နှိပ်ပါ...'
    },
    th:{
      batteryTitle:'🔋 โหมดแบตเตอรี่', batNormal:'ปกติ', batLow:'ประหยัด', batCritical:'ขั้นต่ำ',
      batteryHint:'⚡ สลับอัตโนมัติเมื่อแบตอ่อน (ต้องใช้ Battery API)',
      statsTitle:'📊 สถานะ GPS', statsRefresh:'รีเฟรช', statsHint:'กดรีเฟรชเพื่อดู...',
      trailTitle:'📍 บันทึก GPS', trailView:'ดูวันนี้', trailHint:'กด "ดูวันนี้" เพื่อแสดง...'
    },
    id:{
      batteryTitle:'🔋 Mode baterai', batNormal:'Normal', batLow:'Hemat', batCritical:'Minimum',
      batteryHint:'⚡ Otomatis beralih saat baterai lemah (perlu Battery API)',
      statsTitle:'📊 Status GPS', statsRefresh:'Refresh', statsHint:'Tap Refresh untuk lihat...',
      trailTitle:'📍 Jejak GPS (Audit)', trailView:'Lihat hari ini', trailHint:'Tap "Lihat hari ini" untuk tampilkan...'
    },
    ph:{
      batteryTitle:'🔋 Battery mode', batNormal:'Normal', batLow:'Tipid', batCritical:'Minimum',
      batteryHint:'⚡ Awtomatikong lumipat kapag mababa ang baterya (kailangan ng Battery API)',
      statsTitle:'📊 Status ng GPS', statsRefresh:'I-refresh', statsHint:'Pindutin ang Refresh upang tingnan...',
      trailTitle:'📍 GPS Trail (Audit)', trailView:'Tingnan ngayon', trailHint:'Pindutin ang "Tingnan ngayon" upang ipakita...'
    },
    ne:{
      batteryTitle:'🔋 ब्याट्री मोड', batNormal:'सामान्य', batLow:'बचत', batCritical:'न्यूनतम',
      batteryHint:'⚡ ब्याट्री कम भएमा स्वत: परिवर्तन (Battery API चाहिन्छ)',
      statsTitle:'📊 GPS स्थिति', statsRefresh:'रिफ्रेस', statsHint:'हेर्न रिफ्रेस थिच्नुहोस्...',
      trailTitle:'📍 GPS ट्रेल (अडिट)', trailView:'आज हेर्नुस्', trailHint:'देखाउन "आज हेर्नुस्" थिच्नुहोस्...'
    },
    hi:{
      batteryTitle:'🔋 बैटरी मोड', batNormal:'सामान्य', batLow:'बचत', batCritical:'न्यूनतम',
      batteryHint:'⚡ बैटरी कम होने पर स्वत: स्विच (Battery API आवश्यक)',
      statsTitle:'📊 GPS स्थिति', statsRefresh:'रिफ्रेश', statsHint:'देखने के लिए रिफ्रेश दबाएं...',
      trailTitle:'📍 GPS ट्रेल (ऑडिट)', trailView:'आज देखें', trailHint:'दिखाने के लिए "आज देखें" दबाएं...'
    }
  };
  const t = T[L] || T.vi;

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if(el) el.textContent = val;
  };

  setText('gpsV3BatteryTitle',  t.batteryTitle);
  setText('gpsV3BatBtnNormal',  t.batNormal);
  setText('gpsV3BatBtnLow',     t.batLow);
  setText('gpsV3BatBtnCritical',t.batCritical);
  setText('gpsV3BatteryHint',   t.batteryHint);
  setText('gpsV3StatsTitle',    t.statsTitle);
  setText('gpsV3StatsBtn',      t.statsRefresh);
  setText('gpsV3TrailTitle',    t.trailTitle);
  setText('gpsV3TrailBtn',      t.trailView);

  // Cập nhật text mặc định trong body chỉ nếu đang là placeholder
  const statsBody = document.getElementById('gpsV3StatsBody');
  if(statsBody){
    const isDefault = /^Bấm |^Tap |^새로고침|^更新|^刷新|^ကြည့်|^กด|^Pindutin|^हेर्न|^देखने/.test(statsBody.textContent.trim());
    if(isDefault || !statsBody.textContent.includes('Platform')) statsBody.textContent = t.statsHint;
  }
  const trailBody = document.getElementById('gpsV3TrailBody');
  if(trailBody){
    const isDefault = /^Bấm |^Tap |^"오늘|^「今日|^点击|^"ဒီနေ့|^กด |^Pindutin |^"आज/.test(trailBody.textContent.trim());
    if(isDefault) trailBody.textContent = t.trailHint;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   I18N CHO BACKGROUND STATUS CARD (panel Notification)
   ═══════════════════════════════════════════════════════════════════════════ */
/** Đồng bộ text card "Trạng thái chạy ngầm" theo ngôn ngữ */
function syncBgStatusI18n(){
  const L = (userData && userData.lang) || 'vi';
  const T = {
    vi:{title:'🛡️ Trạng thái chạy ngầm', refresh:'🔄 Làm mới',
        reschedule:'⏰ Lên lịch lại tất cả'},
    en:{title:'🛡️ Background Status', refresh:'🔄 Refresh',
        reschedule:'⏰ Re-schedule all'},
    ko:{title:'🛡️ 백그라운드 상태', refresh:'🔄 새로고침',
        reschedule:'⏰ 모두 재예약'},
    ja:{title:'🛡️ バックグラウンド状態', refresh:'🔄 更新',
        reschedule:'⏰ 全て再スケジュール'},
    zh:{title:'🛡️ 后台状态', refresh:'🔄 刷新',
        reschedule:'⏰ 重新安排全部'},
    my:{title:'🛡️ နောက်ခံ အခြေအနေ', refresh:'🔄 ပြန်လည်ဖွင့်',
        reschedule:'⏰ အားလုံး ပြန်စီစဉ်ရန်'},
    th:{title:'🛡️ สถานะพื้นหลัง', refresh:'🔄 รีเฟรช',
        reschedule:'⏰ จัดตารางใหม่ทั้งหมด'},
    id:{title:'🛡️ Status Background', refresh:'🔄 Refresh',
        reschedule:'⏰ Jadwalkan ulang semua'},
    ph:{title:'🛡️ Background Status', refresh:'🔄 I-refresh',
        reschedule:'⏰ I-reschedule lahat'},
    ne:{title:'🛡️ ब्याकग्राउन्ड स्थिति', refresh:'🔄 रिफ्रेस',
        reschedule:'⏰ सबै फेरि तालिका'},
    hi:{title:'🛡️ बैकग्राउंड स्थिति', refresh:'🔄 रिफ्रेश',
        reschedule:'⏰ सब रीशेड्यूल करें'}
  };
  const t = T[L] || T.vi;

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if(el) el.textContent = val;
  };

  setText('bgStatusTitle', t.title);
  setText('btnOpenNotifPerm',    u('perm.notif') || '🔔 Quyền thông báo');
  setText('btnOpenLocationPerm', u('perm.location') || '📍 Quyền vị trí');
  setText('btnOpenBatteryPerm',  u('perm.battery') || '🔋 Cài đặt pin');

  // Cập nhật nút Refresh (là sibling của bgStatusTitle, không có id riêng)
}

