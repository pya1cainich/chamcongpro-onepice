/* ===== THÔNG BÁO ===== */
function togNotif(id){
  const el=document.getElementById(id);
  el.classList.toggle('on');
  const key=id.replace('togN','n');
  notifCfg[key]=el.classList.contains('on');
  saveNotif();
  // Re-schedule native notifications khi user thay đổi toggle
  if(typeof window.rescheduleNativeNotifications === 'function'){
    window.rescheduleNativeNotifications();
  }
  // Cập nhật UI status sau 500ms
  setTimeout(refreshBgStatus, 500);
}

/** ═══ UI HELPERS CHO BACKGROUND STATUS (chỉ hoạt động trong APK) ═══ */

/** Refresh thông tin trạng thái chạy ngầm */
async function refreshBgStatus(){
  const body = document.getElementById('bgStatusBody');
  if(!body) return;
  // Helper lấy text đa ngôn ngữ với fallback
  const _t = (key, fallback) => (typeof u === 'function') ? (u(key) || fallback) : fallback;
  if(!window.ccNative || !window.ccNative.isNative){
    const L = (window.userData && window.userData.lang) || 'vi';
    const noNative = {
      vi:'⚠️ Chỉ hoạt động trong APK Android', en:'⚠️ Only works in Android APK',
      ko:'⚠️ Android APK에서만 동작', ja:'⚠️ Android APKでのみ動作',
      zh:'⚠️ 仅在 Android APK 中可用', my:'⚠️ Android APK တွင်သာ',
      th:'⚠️ ทำงานเฉพาะ APK Android', id:'⚠️ Hanya berfungsi di APK',
      ph:'⚠️ Sa Android APK lang', ne:'⚠️ Android APK मा मात्र',
      hi:'⚠️ केवल Android APK में'
    };
    body.innerHTML = noNative[L] || noNative.vi;
    return;
  }
  try{
    const L = (window.userData && window.userData.lang) || 'vi';
    const labels = {
      vi: {plat:'📱 Platform', gps:'📍 GPS Service', bg:'🌐 Background watcher', n1:'⏰ Nhắc trước ca (n1)', n2:'🏁 Xác nhận ra ca (n2)', n4:'📊 Tổng kết tuần (n4)', total:'📅 Tổng', scheduled:'đã lên lịch', notifs:'thông báo nền', on:'✅ Đang chạy', off:'❌ Tắt', active:'✅ Active', inactive:'❌ Inactive', plugins:'🔌 Plugins'},
      en: {plat:'📱 Platform', gps:'📍 GPS Service', bg:'🌐 Background watcher', n1:'⏰ Pre-shift reminder (n1)', n2:'🏁 Post-shift confirm (n2)', n4:'📊 Weekly summary (n4)', total:'📅 Total', scheduled:'scheduled', notifs:'background notifications', on:'✅ Running', off:'❌ Off', active:'✅ Active', inactive:'❌ Inactive', plugins:'🔌 Plugins'},
      ko: {plat:'📱 플랫폼', gps:'📍 GPS 서비스', bg:'🌐 백그라운드', n1:'⏰ 출근 전 알림 (n1)', n2:'🏁 퇴근 확인 (n2)', n4:'📊 주간 요약 (n4)', total:'📅 총', scheduled:'예약됨', notifs:'백그라운드 알림', on:'✅ 동작 중', off:'❌ 꺼짐', active:'✅ 활성', inactive:'❌ 비활성', plugins:'🔌 플러그인'},
      ja: {plat:'📱 プラットフォーム', gps:'📍 GPS サービス', bg:'🌐 バックグラウンド', n1:'⏰ 始業前通知 (n1)', n2:'🏁 退勤確認 (n2)', n4:'📊 週間まとめ (n4)', total:'📅 合計', scheduled:'予定済み', notifs:'バックグラウンド通知', on:'✅ 動作中', off:'❌ オフ', active:'✅ アクティブ', inactive:'❌ 非アクティブ', plugins:'🔌 プラグイン'},
      zh: {plat:'📱 平台', gps:'📍 GPS 服务', bg:'🌐 后台监听', n1:'⏰ 上班前提醒 (n1)', n2:'🏁 下班确认 (n2)', n4:'📊 周总结 (n4)', total:'📅 共', scheduled:'已安排', notifs:'后台通知', on:'✅ 运行中', off:'❌ 关闭', active:'✅ 活跃', inactive:'❌ 未活跃', plugins:'🔌 插件'},
      th: {plat:'📱 แพลตฟอร์ม', gps:'📍 บริการ GPS', bg:'🌐 ทำงานเบื้องหลัง', n1:'⏰ เตือนก่อนเข้างาน', n2:'🏁 ยืนยันออกงาน', n4:'📊 สรุปสัปดาห์', total:'📅 รวม', scheduled:'นัดไว้แล้ว', notifs:'การแจ้งเตือนเบื้องหลัง', on:'✅ ทำงาน', off:'❌ ปิด', active:'✅ ใช้งาน', inactive:'❌ ไม่ใช้งาน', plugins:'🔌 ปลั๊กอิน'},
      id: {plat:'📱 Platform', gps:'📍 Layanan GPS', bg:'🌐 Background', n1:'⏰ Pengingat sebelum shift', n2:'🏁 Konfirmasi keluar', n4:'📊 Ringkasan mingguan', total:'📅 Total', scheduled:'dijadwalkan', notifs:'notifikasi latar', on:'✅ Berjalan', off:'❌ Mati', active:'✅ Aktif', inactive:'❌ Tidak aktif', plugins:'🔌 Plugin'},
      my: {plat:'📱 ပလက်ဖောင်း', gps:'📍 GPS ဝန်ဆောင်မှု', bg:'🌐 နောက်ခံ', n1:'⏰ ဆင်းမတိုင်မီ သတိပေးချက်', n2:'🏁 ဆင်းပြီး အတည်ပြု', n4:'📊 အပတ်စဉ် အကျဉ်း', total:'📅 စုစုပေါင်း', scheduled:'စီစဉ်ထား', notifs:'အသိပေးချက်', on:'✅ အလုပ်လုပ်', off:'❌ ပိတ်', active:'✅ အသုံးပြု', inactive:'❌ မအသုံးပြု', plugins:'🔌 Plugin'},
      ph: {plat:'📱 Platform', gps:'📍 GPS Service', bg:'🌐 Background', n1:'⏰ Paalala bago shift', n2:'🏁 Kumpirma paglabas', n4:'📊 Lingguhang buod', total:'📅 Kabuuan', scheduled:'naka-iskedyul', notifs:'mga abiso', on:'✅ Tumatakbo', off:'❌ Off', active:'✅ Aktibo', inactive:'❌ Hindi aktibo', plugins:'🔌 Plugins'},
      ne: {plat:'📱 प्लेटफर्म', gps:'📍 GPS सेवा', bg:'🌐 पृष्ठभूमि', n1:'⏰ शिफ्ट अघि सम्झना', n2:'🏁 बाहिर पुष्टि', n4:'📊 साप्ताहिक सार', total:'📅 जम्मा', scheduled:'तालिका गरिएको', notifs:'सूचनाहरू', on:'✅ चलिरहेको', off:'❌ बन्द', active:'✅ सक्रिय', inactive:'❌ निष्क्रिय', plugins:'🔌 प्लगइन'},
      hi: {plat:'📱 प्लेटफ़ॉर्म', gps:'📍 GPS सेवा', bg:'🌐 बैकग्राउंड', n1:'⏰ शिफ्ट से पहले रिमाइंडर', n2:'🏁 बाहर पुष्टि', n4:'📊 साप्ताहिक सारांश', total:'📅 कुल', scheduled:'निर्धारित', notifs:'बैकग्राउंड नोटिफिकेशन', on:'✅ चालू', off:'❌ बंद', active:'✅ सक्रिय', inactive:'❌ निष्क्रिय', plugins:'🔌 प्लगइन'}
    };
    const lbl = labels[L] || labels.vi;
    const pending = await window.ccNative.getPending();
    const n1 = pending.filter(n => n.id >= 10000 && n.id <= 19999).length;
    const n2 = pending.filter(n => n.id >= 20000 && n.id <= 29999).length;
    const n4 = pending.filter(n => n.id >= 40000 && n.id <= 49999).length;
    const gpsOn = (window._gpsData && window._gpsData.enabled) ? lbl.on : lbl.off;
    const bgWatch = (window._gpsBgWatchId != null) ? lbl.active : lbl.inactive;
    const platform = window.ccNative.platform || 'unknown';
    // Plugin status - hiển thị plugin nào có sẵn
    const pluginsInfo = window.ccNative.plugins || {};
    const pluginStatus = [
      `BG=${pluginsInfo.BG ? '✅' : '❌'}`,
      `Geo=${pluginsInfo.Geo ? '✅' : '❌'}`,
      `Notif=${pluginsInfo.Notif ? '✅' : '❌'}`,
      `App=${pluginsInfo.App ? '✅' : '❌'}`
    ].join(' ');

    let extraWarning = '';
    if(!pluginsInfo.BG){
      const warningMsg = {
        vi:'⚠️ Plugin BackgroundGeolocation CHƯA cài → cần npm install + npx cap sync',
        en:'⚠️ BackgroundGeolocation plugin NOT installed',
        ko:'⚠️ BackgroundGeolocation 플러그인 설치 안됨',
        ja:'⚠️ BackgroundGeolocation プラグイン未インストール',
        zh:'⚠️ BackgroundGeolocation 插件未安装',
        hi:'⚠️ BackgroundGeolocation प्लगइन इंस्टॉल नहीं है'
      };
      extraWarning = `<br><span style="color:#E8433A">${warningMsg[L] || warningMsg.vi}</span>`;
    } else if(window._gpsData && window._gpsData.enabled && window._gpsBgWatchId == null){
      const warningMsg = {
        vi:'⚠️ Plugin OK nhưng watcher chưa active → bấm "🚀 Bật chạy ngầm" bên dưới',
        en:'⚠️ Plugin OK but watcher not active → press "🚀 Start background"',
        ko:'⚠️ 플러그인 OK이지만 watcher 비활성 → "🚀 백그라운드 시작" 누르기',
        ja:'⚠️ プラグインOKだがwatcher非アクティブ → 「🚀 バックグラウンド開始」を押す',
        zh:'⚠️ 插件OK但watcher未激活 → 按"🚀 开始后台"',
        hi:'⚠️ प्लगइन OK लेकिन watcher निष्क्रिय → "🚀 बैकग्राउंड चालू" दबाएं'
      };
      extraWarning = `<br><span style="color:#F5A623">${warningMsg[L] || warningMsg.vi}</span>`;
    }

    body.innerHTML =
      `${lbl.plat}: <b>${platform}</b><br>` +
      `${lbl.plugins}: <b>${pluginStatus}</b><br>` +
      `${lbl.gps}: <b>${gpsOn}</b><br>` +
      `${lbl.bg}: <b>${bgWatch}</b>` +
      (window._gpsBgWatchId ? ` (id=${window._gpsBgWatchId})` : '') +
      `<br>` +
      `${lbl.n1}: <b>${n1}</b> ${lbl.scheduled}<br>` +
      `${lbl.n2}: <b>${n2}</b> ${lbl.scheduled}<br>` +
      `${lbl.n4}: <b>${n4}</b> ${lbl.scheduled}<br>` +
      `<b>${lbl.total}: ${pending.length} ${lbl.notifs}</b>` +
      extraWarning;
  }catch(e){
    body.textContent = bgForceText('error', {err:e.message || e});
  }
}

function bgForceText(key, vars){
  const L = (window.userData && window.userData.lang) || 'vi';
  const packs = {
    vi:{apkOnly:'⚠️ Chỉ hoạt động trong APK',pluginMissing:'❌ Plugin BackgroundGeolocation CHƯA được cài trong APK!\n\nCần rebuild APK với:\n  npm install\n  npx cap sync android\n  ./gradlew assembleDebug',gpsFirst:'⚠️ Hãy bật GPS toggle trước',starting:'🚀 Đang khởi động background watcher...',started:'✅ Đã bật chạy ngầm thành công!',failed:'❌ Vẫn chưa bật được. Kiểm tra quyền vị trí "Luôn cho phép" trong Cài đặt.',error:'❌ Lỗi: {err}'},
    en:{apkOnly:'⚠️ APK only',pluginMissing:'❌ BackgroundGeolocation plugin is not installed!\n\nRebuild the APK with:\n  npm install\n  npx cap sync android',gpsFirst:'⚠️ Enable the GPS toggle first',starting:'🚀 Starting background watcher...',started:'✅ Background watcher started!',failed:'❌ Failed. Check Location permission "Allow all the time".',error:'❌ Error: {err}'},
    ko:{apkOnly:'⚠️ APK 전용',pluginMissing:'❌ BackgroundGeolocation 플러그인이 설치되지 않았습니다!\n\nAPK를 다시 빌드하세요.',gpsFirst:'⚠️ 먼저 GPS 토글을 켜세요',starting:'🚀 백그라운드 감시를 시작하는 중...',started:'✅ 백그라운드 감시가 시작되었습니다!',failed:'❌ 실패했습니다. 위치 권한 "항상 허용"을 확인하세요.',error:'❌ 오류: {err}'},
    ja:{apkOnly:'⚠️ APKのみ',pluginMissing:'❌ BackgroundGeolocationプラグインがインストールされていません。\n\nAPKを再ビルドしてください。',gpsFirst:'⚠️ 先にGPSトグルを有効にしてください',starting:'🚀 バックグラウンド監視を開始中...',started:'✅ バックグラウンド監視を開始しました!',failed:'❌ 失敗しました。位置情報権限「常に許可」を確認してください。',error:'❌ エラー: {err}'},
    zh:{apkOnly:'⚠️ 仅APK可用',pluginMissing:'❌ 尚未安装 BackgroundGeolocation 插件！\n\n请重新构建 APK。',gpsFirst:'⚠️ 请先开启 GPS 开关',starting:'🚀 正在启动后台监听...',started:'✅ 后台监听已启动！',failed:'❌ 启动失败。请检查位置权限“始终允许”。',error:'❌ 错误: {err}'},
    my:{apkOnly:'⚠️ APK တွင်သာ အသုံးပြုနိုင်သည်',pluginMissing:'❌ BackgroundGeolocation plugin မထည့်ရသေးပါ။\n\nAPK ကို ပြန် build လုပ်ပါ။',gpsFirst:'⚠️ GPS toggle ကို အရင်ဖွင့်ပါ',starting:'🚀 နောက်ခံ watcher စတင်နေသည်...',started:'✅ နောက်ခံ watcher စတင်ပြီး!',failed:'❌ မစတင်နိုင်သေးပါ။ Location permission “Allow all the time” ကို စစ်ဆေးပါ။',error:'❌ အမှား: {err}'},
    th:{apkOnly:'⚠️ ใช้ได้เฉพาะ APK',pluginMissing:'❌ ยังไม่ได้ติดตั้งปลั๊กอิน BackgroundGeolocation!\n\nโปรด rebuild APK',gpsFirst:'⚠️ เปิดสวิตช์ GPS ก่อน',starting:'🚀 กำลังเริ่ม background watcher...',started:'✅ เริ่ม background watcher แล้ว!',failed:'❌ ไม่สำเร็จ ตรวจสอบสิทธิ์ตำแหน่ง "อนุญาตตลอดเวลา"',error:'❌ ข้อผิดพลาด: {err}'},
    id:{apkOnly:'⚠️ Hanya untuk APK',pluginMissing:'❌ Plugin BackgroundGeolocation belum terpasang!\n\nRebuild APK terlebih dahulu.',gpsFirst:'⚠️ Aktifkan toggle GPS dulu',starting:'🚀 Memulai background watcher...',started:'✅ Background watcher dimulai!',failed:'❌ Gagal. Periksa izin Lokasi "Izinkan sepanjang waktu".',error:'❌ Error: {err}'},
    ph:{apkOnly:'⚠️ APK lang',pluginMissing:'❌ Hindi naka-install ang BackgroundGeolocation plugin!\n\nI-rebuild ang APK.',gpsFirst:'⚠️ I-on muna ang GPS toggle',starting:'🚀 Sinisimulan ang background watcher...',started:'✅ Nagsimula na ang background watcher!',failed:'❌ Nabigo. Suriin ang Location permission na "Allow all the time".',error:'❌ Error: {err}'},
    ne:{apkOnly:'⚠️ APK मा मात्र',pluginMissing:'❌ BackgroundGeolocation plugin install भएको छैन!\n\nAPK फेरि build गर्नुहोस्।',gpsFirst:'⚠️ पहिले GPS toggle खोल्नुहोस्',starting:'🚀 background watcher सुरु हुँदै...',started:'✅ background watcher सुरु भयो!',failed:'❌ असफल भयो। Location permission "Allow all the time" जाँच्नुहोस्।',error:'❌ त्रुटि: {err}'},
    hi:{apkOnly:'⚠️ केवल APK',pluginMissing:'❌ BackgroundGeolocation plugin इंस्टॉल नहीं है!\n\nAPK फिर से build करें।',gpsFirst:'⚠️ पहले GPS toggle चालू करें',starting:'🚀 background watcher शुरू हो रहा है...',started:'✅ background watcher शुरू हो गया!',failed:'❌ विफल। Location permission "Allow all the time" जांचें।',error:'❌ त्रुटि: {err}'}
  };
  const pack = packs[L] || packs.en || packs.vi;
  let out = pack[key] || key;
  vars = vars || {};
  Object.keys(vars).forEach(k => { out = out.replace(new RegExp('\\{'+k+'\\}', 'g'), vars[k]); });
  return out;
}

/** Force start background watcher (gọi từ nút "🚀 Bật chạy ngầm") */
async function forceStartBgWatcher(){
  const L = (window.userData && window.userData.lang) || 'vi';
  if(!window.ccNative || !window.ccNative.isNative){
    alert(bgForceText('apkOnly'));
    return;
  }
  if(!window.ccNative.startBg && !window.startBackgroundGps){
    alert(bgForceText('pluginMissing'));
    return;
  }
  if(!window._gpsData || !window._gpsData.enabled){
    alert(bgForceText('gpsFirst'));
    return;
  }

  // Force start
  const banner = (msg, color) => {
    if(typeof showGpsBanner === 'function') showGpsBanner(msg, color);
  };

  banner(bgForceText('starting'), '#2D7DD2');
  console.log('[ForceBg] Starting background watcher manually');

  try{
    if(window.ccNative.startBg){
      const result = await window.ccNative.startBg();
      console.log('[ForceBg] startBg result:', result);
    } else if(window.startBackgroundGps){
      const result = window.startBackgroundGps();
      console.log('[ForceBg] startBackgroundGps result:', result);
    }
    // Đợi 1.5s để watcher init xong
    setTimeout(() => {
      refreshBgStatus();
      if(window._gpsBgWatchId){
        banner(bgForceText('started'), '#0D9E75');
      } else {
        banner(bgForceText('failed'), '#E8433A');
      }
    }, 1500);
  }catch(e){
    console.warn('[ForceBg] Error:', e);
    banner(bgForceText('error', {err:e.message || e}), '#E8433A');
  }
}

/** Manual reschedule (gọi từ nút "Lên lịch lại tất cả") */
function manualRescheduleNotifs(){
  if(!window.ccNative || !window.ccNative.isNative){
    alert(bgForceText('apkOnly'));
    return;
  }
  if(typeof window.rescheduleNativeNotifications === 'function'){
    window.rescheduleNativeNotifications();
    setTimeout(refreshBgStatus, 800);
  }
}

/** Mở nhanh trang quyền hệ thống: thông báo / vị trí / pin */
var _batteryPermissionReturnHandler = null;
var _batteryPermissionCheckTimer = null;

function permEscHtml(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
  });
}

function getBatteryGuideText(){
  const L = (window.userData && window.userData.lang) || 'vi';
  const txt = {
    vi:{title:'Chưa bật quyền pin cho Chấm Công Pro',body:'Để GPS và chấm công ngầm ổn định, hãy đặt pin của ứng dụng sang Không hạn chế.',steps:['Mở Cài đặt > Ứng dụng > Chấm Công Pro.','Vào Pin hoặc Sử dụng pin.','Chọn Không hạn chế / Unrestricted. Nếu thấy mục Ngủ hoặc Ngủ sâu, hãy bỏ Chấm Công Pro khỏi danh sách đó.'],reopen:'Mở lại cài đặt pin',close:'Đã hiểu',granted:'Đã bật quyền pin. GPS chạy ngầm sẽ ổn định hơn.',denied:'Chưa bật quyền pin. Hãy chọn Không hạn chế trong phần Pin của ứng dụng.',openFail:'Không mở được trang pin tự động. Hãy mở thủ công theo hướng dẫn.'},
    en:{title:'Battery permission is not enabled',body:'For reliable background GPS and auto attendance, set this app battery mode to Unrestricted.',steps:['Open Settings > Apps > Cham Cong Pro.','Open Battery or Battery usage.','Choose Unrestricted. If the app is in Sleeping or Deep sleeping apps, remove it from that list.'],reopen:'Open battery settings',close:'Got it',granted:'Battery permission is enabled. Background GPS should be more reliable.',denied:'Battery permission is still off. Choose Unrestricted in the app battery page.',openFail:'Could not open battery settings automatically. Please follow the steps.'},
    ko:{title:'배터리 권한이 켜져 있지 않습니다',body:'백그라운드 GPS와 자동 출퇴근 기록을 안정적으로 사용하려면 배터리를 제한 없음으로 설정하세요.',steps:['설정 > 애플리케이션 > Cham Cong Pro를 여세요.','배터리 또는 배터리 사용량을 여세요.','제한 없음을 선택하세요. 절전/초절전 앱 목록에 있으면 제거하세요.'],reopen:'배터리 설정 열기',close:'확인',granted:'배터리 권한이 켜졌습니다.',denied:'배터리 권한이 아직 꺼져 있습니다. 제한 없음을 선택하세요.',openFail:'배터리 설정을 자동으로 열 수 없습니다. 안내대로 직접 열어 주세요.'},
    ja:{title:'バッテリー権限が有効ではありません',body:'バックグラウンドGPSと自動打刻を安定させるには、バッテリー設定を無制限にしてください。',steps:['設定 > アプリ > Cham Cong Pro を開きます。','バッテリーまたはバッテリー使用量を開きます。','無制限を選びます。スリープ中のアプリ一覧にある場合は削除してください。'],reopen:'バッテリー設定を開く',close:'了解',granted:'バッテリー権限が有効になりました。',denied:'まだ有効ではありません。アプリのバッテリーで無制限を選んでください。',openFail:'バッテリー設定を自動で開けません。手順に沿って開いてください。'},
    zh:{title:'尚未开启电池权限',body:'为保证后台 GPS 和自动打卡稳定，请将应用电池设置为不受限制。',steps:['打开 设置 > 应用 > Cham Cong Pro。','进入 电池 或 电池使用情况。','选择 不受限制。若在睡眠/深度睡眠应用中，请移除。'],reopen:'打开电池设置',close:'知道了',granted:'电池权限已开启，后台 GPS 会更稳定。',denied:'电池权限仍未开启，请选择不受限制。',openFail:'无法自动打开电池设置，请按步骤手动打开。'},
    my:{title:'Battery permission မဖွင့်ရသေးပါ',body:'နောက်ခံ GPS နှင့် auto attendance တည်ငြိမ်ရန် app battery ကို Unrestricted သို့ ပြောင်းပါ။',steps:['Settings > Apps > Cham Cong Pro ကို ဖွင့်ပါ။','Battery သို့မဟုတ် Battery usage ကို ဖွင့်ပါ။','Unrestricted ကို ရွေးပါ။ Sleeping/Deep sleeping apps ထဲရှိပါက ဖယ်ရှားပါ။'],reopen:'Battery settings ဖွင့်ရန်',close:'နားလည်ပါပြီ',granted:'Battery permission ဖွင့်ပြီးပါပြီ။',denied:'Battery permission မဖွင့်ရသေးပါ။ Unrestricted ကို ရွေးပါ။',openFail:'Battery settings ကို အလိုအလျောက် မဖွင့်နိုင်ပါ။ လမ်းညွှန်အတိုင်း ဖွင့်ပါ။'},
    th:{title:'ยังไม่ได้เปิดสิทธิ์แบตเตอรี่',body:'เพื่อให้ GPS เบื้องหลังและการลงเวลาอัตโนมัติเสถียร ให้ตั้งค่าแบตเตอรี่เป็นไม่จำกัด',steps:['เปิด ตั้งค่า > แอป > Cham Cong Pro','เข้า แบตเตอรี่ หรือ การใช้แบตเตอรี่','เลือก ไม่จำกัด หากอยู่ในรายการแอปพัก/หลับลึก ให้เอาออก'],reopen:'เปิดตั้งค่าแบตเตอรี่',close:'เข้าใจแล้ว',granted:'เปิดสิทธิ์แบตเตอรี่แล้ว',denied:'ยังไม่ได้เปิดสิทธิ์แบตเตอรี่ กรุณาเลือกไม่จำกัด',openFail:'เปิดหน้าแบตเตอรี่อัตโนมัติไม่ได้ กรุณาทำตามขั้นตอน'},
    id:{title:'Izin baterai belum aktif',body:'Agar GPS latar belakang dan absensi otomatis stabil, atur baterai aplikasi ke Tidak dibatasi.',steps:['Buka Setelan > Aplikasi > Cham Cong Pro.','Buka Baterai atau Penggunaan baterai.','Pilih Tidak dibatasi. Jika ada di aplikasi tidur/tidur nyenyak, hapus dari daftar itu.'],reopen:'Buka setelan baterai',close:'Mengerti',granted:'Izin baterai sudah aktif.',denied:'Izin baterai belum aktif. Pilih Tidak dibatasi.',openFail:'Setelan baterai tidak bisa dibuka otomatis. Ikuti langkah manual.'},
    ph:{title:'Hindi pa naka-on ang battery permission',body:'Para maging maayos ang background GPS at auto attendance, gawing Unrestricted ang battery ng app.',steps:['Buksan ang Settings > Apps > Cham Cong Pro.','Buksan ang Battery o Battery usage.','Piliin ang Unrestricted. Kung nasa Sleeping/Deep sleeping apps, alisin ito doon.'],reopen:'Buksan battery settings',close:'Nakuha ko',granted:'Naka-on na ang battery permission.',denied:'Hindi pa naka-on. Piliin ang Unrestricted sa battery page.',openFail:'Hindi mabuksan nang automatic ang battery settings. Sundin ang steps.'},
    ne:{title:'ब्याट्री अनुमति खुलेको छैन',body:'Background GPS र auto attendance स्थिर बनाउन app battery लाई Unrestricted राख्नुहोस्।',steps:['Settings > Apps > Cham Cong Pro खोल्नुहोस्।','Battery वा Battery usage खोल्नुहोस्।','Unrestricted छान्नुहोस्। Sleeping/Deep sleeping apps मा भए हटाउनुहोस्।'],reopen:'Battery settings खोल्नुहोस्',close:'बुझेँ',granted:'Battery permission खुलेको छ।',denied:'Battery permission अझै खुलेको छैन। Unrestricted छान्नुहोस्।',openFail:'Battery settings आफैं खुल्न सकेन। यी चरण पालना गर्नुहोस्।'},
    hi:{title:'बैटरी अनुमति चालू नहीं है',body:'Background GPS और auto attendance स्थिर रखने के लिए app battery को Unrestricted करें।',steps:['Settings > Apps > Cham Cong Pro खोलें।','Battery या Battery usage खोलें।','Unrestricted चुनें। Sleeping/Deep sleeping apps में हो तो हटाएं।'],reopen:'Battery settings खोलें',close:'समझ गया',granted:'Battery permission चालू हो गई है।',denied:'Battery permission अभी भी बंद है। Unrestricted चुनें।',openFail:'Battery settings अपने आप नहीं खुली। कृपया चरणों का पालन करें।'}
  };
  return txt[L] || txt.en || txt.vi;
}

function showBatteryPermissionGuide(openFail){
  const t = getBatteryGuideText();
  let ov = document.getElementById('batteryGuideOv');
  if(ov)ov.remove();
  ov = document.createElement('div');
  ov.id = 'batteryGuideOv';
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:30000;display:flex;align-items:center;justify-content:center;padding:18px';
  ov.innerHTML = '<div style="width:100%;max-width:380px;background:white;border-radius:20px;padding:22px 18px;box-shadow:0 20px 70px rgba(0,0,0,.32);font-family:Nunito,sans-serif;color:var(--text)"><div style="font-size:18px;font-weight:900;margin-bottom:8px">'+permEscHtml(t.title)+'</div><div style="font-size:13px;color:var(--text2);line-height:1.55;margin-bottom:12px">'+permEscHtml(openFail?t.openFail:t.body)+'</div><div style="display:flex;flex-direction:column;gap:8px;margin:12px 0 16px">'+t.steps.map(function(s,i){return '<div style="background:#F4F7F6;border-radius:12px;padding:10px 12px;font-size:13px;line-height:1.45"><b>'+(i+1)+'.</b> '+permEscHtml(s)+'</div>';}).join('')+'</div><div style="display:flex;gap:10px"><button id="batteryGuideClose" style="flex:1;padding:13px;border-radius:12px;border:1.5px solid var(--border);background:white;color:var(--text2);font-size:13px;font-weight:800;font-family:Nunito,sans-serif">'+permEscHtml(t.close)+'</button><button id="batteryGuideOpen" style="flex:1.5;padding:13px;border-radius:12px;border:none;background:var(--ac);color:white;font-size:13px;font-weight:900;font-family:Nunito,sans-serif">'+permEscHtml(t.reopen)+'</button></div></div>';
  document.body.appendChild(ov);
  document.getElementById('batteryGuideClose').onclick = function(){ ov.remove(); };
  document.getElementById('batteryGuideOpen').onclick = function(){ ov.remove(); openNativePermissionSetting('battery'); };
}

async function checkBatteryOptimizationState(){
  try{
    if(window.ccNative && window.ccNative.checkBatteryOptimization)return await window.ccNative.checkBatteryOptimization();
    const plugin = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.ChamCongNative;
    if(plugin && plugin.checkBatteryOptimizationPermission)return await plugin.checkBatteryOptimizationPermission();
  }catch(e){ console.warn('[BatteryPermission] check failed:', e); }
  return { granted:false, missingBridge:true };
}

async function finishBatteryPermissionCheck(openFail){
  clearTimeout(_batteryPermissionCheckTimer);
  if(_batteryPermissionReturnHandler){
    window.removeEventListener('focus', _batteryPermissionReturnHandler);
    document.removeEventListener('visibilitychange', _batteryPermissionReturnHandler);
    _batteryPermissionReturnHandler = null;
  }
  const t = getBatteryGuideText();
  const status = await checkBatteryOptimizationState();
  const granted = !!(status && (status.granted || status.ignoringBatteryOptimizations));
  if(granted){
    if(typeof showGpsBanner === 'function')showGpsBanner(t.granted, '#0D9E75');
  }else{
    if(typeof showGpsBanner === 'function')showGpsBanner(t.denied, '#E8433A');
    showBatteryPermissionGuide(openFail);
  }
}

function scheduleBatteryPermissionCheck(openResult){
  const granted = !!(openResult && (openResult.granted || openResult.ignoringBatteryOptimizations));
  const opened = !!(openResult && openResult.openedSettings);
  if(granted){
    const t = getBatteryGuideText();
    if(typeof showGpsBanner === 'function')showGpsBanner(t.granted, '#0D9E75');
    return;
  }
  if(!opened){ finishBatteryPermissionCheck(true); return; }
  _batteryPermissionReturnHandler = function(){
    if(document.visibilityState && document.visibilityState !== 'visible')return;
    setTimeout(function(){ finishBatteryPermissionCheck(false); }, 650);
  };
  window.addEventListener('focus', _batteryPermissionReturnHandler);
  document.addEventListener('visibilitychange', _batteryPermissionReturnHandler);
  clearTimeout(_batteryPermissionCheckTimer);
  _batteryPermissionCheckTimer = setTimeout(function(){
    if(!document.visibilityState || document.visibilityState === 'visible')finishBatteryPermissionCheck(false);
  }, 3500);
}

async function openNativePermissionSetting(kind){
  const L = (window.userData && window.userData.lang) || 'vi';
  const onlyApk = {
    vi:'⚠️ Chỉ hoạt động trong APK Android',
    en:'⚠️ Only works in the Android APK',
    ko:'⚠️ Android APK에서만 작동합니다',
    ja:'⚠️ Android APKでのみ動作します',
    zh:'⚠️ 仅在 Android APK 中可用',
    my:'⚠️ Android APK တွင်သာ အလုပ်လုပ်သည်',
    th:'⚠️ ใช้งานได้เฉพาะใน Android APK',
    id:'⚠️ Hanya berfungsi di APK Android',
    ph:'⚠️ Sa Android APK lang',
    ne:'⚠️ Android APK मा मात्र काम गर्छ',
    hi:'⚠️ केवल Android APK में काम करता है'
  };
  const openFailNative = {
    vi:'⚠️ Không mở được cài đặt: ',
    en:'⚠️ Could not open settings: ',
    ko:'⚠️ 설정을 열 수 없습니다: ',
    ja:'⚠️ 設定を開けません: ',
    zh:'⚠️ 无法打开设置: ',
    my:'⚠️ ဆက်တင်များကို မဖွင့်နိုင်ပါ: ',
    th:'⚠️ เปิดการตั้งค่าไม่ได้: ',
    id:'⚠️ Tidak dapat membuka setelan: ',
    ph:'⚠️ Hindi mabuksan ang settings: ',
    ne:'⚠️ सेटिङ खोल्न सकिएन: ',
    hi:'⚠️ सेटिंग नहीं खुली: '
  };
  if(!window.ccNative || !window.ccNative.isNative){
    alert(onlyApk[L] || onlyApk.vi);
    return;
  }

  try{
    if(kind === 'notification' && window.ccNative.openNotificationSettings){
      await window.ccNative.openNotificationSettings();
    } else if(kind === 'location' && window.ccNative.openLocationSettings){
      await window.ccNative.openLocationSettings();
    } else if(kind === 'battery' && window.ccNative.requestIgnoreBatteryOptimization){
      scheduleBatteryPermissionCheck(await window.ccNative.requestIgnoreBatteryOptimization());
      return;
    } else {
      const plugin = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.ChamCongNative;
      if(kind === 'notification' && plugin && plugin.openNotificationSettings) await plugin.openNotificationSettings();
      else if(kind === 'location' && plugin && plugin.openLocationSettings) await plugin.openLocationSettings();
      else if(kind === 'battery' && plugin && plugin.requestIgnoreBatteryOptimization){
        scheduleBatteryPermissionCheck(await plugin.requestIgnoreBatteryOptimization());
        return;
      }
      else throw new Error('Native settings bridge unavailable');
    }
  }catch(e){
    console.warn('[PermissionSettings] open failed:', kind, e);
    if(kind === 'battery'){
      showBatteryPermissionGuide(true);
      return;
    }
    alert((openFailNative[L] || openFailNative.en || openFailNative.vi) + (e && e.message ? e.message : e));
  }
}

