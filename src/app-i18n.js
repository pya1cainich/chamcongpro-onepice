/* ==================== FULL i18n SYSTEM ==================== */
/* ════════════════════════════════════════════════════════════════════
   UI_STR — KHO CHUỖI GIAO DIỆN TẬP TRUNG (11 ngôn ngữ)
   ════════════════════════════════════════════════════════════════════

   🔧 CÁCH SỬA NỘI DUNG:
     1. Tìm key theo section bên dưới (ví dụ: 'home.in_at')
     2. Sửa text ở ngôn ngữ bạn muốn
     3. Không được xóa ngôn ngữ khác!

   ➕ THÊM NGÔN NGỮ MỚI:
     1. Thêm entry vào LANGS[] và TRAN{}
     2. Thêm key mới vào MỌI entry trong UI_STR
     3. Dùng en: làm mẫu nếu chưa dịch kịp

   🔍 TRA CỨU NHANH — key nào điều khiển chỗ nào:
     'home.*'     → Trang chủ (nút VÀO/HẾT CA, trạng thái, giờ)
     'salary.*'   → Bảng lương (bảo hiểm, thuế, loại ngày)
     'gps.*'      → GPS panel (tiêu đề, nhãn slider, nút, tip)
     'appear.*'   → Panel Giao diện (avatar, màu, ảnh nền)
     'setup.*'    → Panel Thiết lập (tên, chức vụ, ca làm)
     'delete.*'   → Xác nhận xóa dữ liệu
     'splash.*'   → Popup chào buổi sáng

   ════════════════════════════════════════════════════════════════════ */
const UI_STR = {

  /* ── GPS v3 PANEL — Battery profile / Stats / Trail ────────────────── */
  'gpsv3.battery_title':  {vi:'🔋 Chế độ pin',                       en:'🔋 Battery mode',                ko:'🔋 배터리 모드',          ja:'🔋 バッテリーモード',           zh:'🔋 电池模式',          my:'🔋 ဘက်ထရီ',             th:'🔋 โหมดแบตเตอรี่',           id:'🔋 Mode baterai',           ph:'🔋 Battery mode',         ne:'🔋 ब्याट्री मोड',           hi:'🔋 बैटरी मोड'},
  'gps.panel_title':      {vi:'🧠 Chấm công thông minh', en:'🧠 Smart attendance', ko:'🧠 스마트 출퇴근', ja:'🧠 スマート打刻', zh:'🧠 智能打卡', my:'🧠 Smart attendance', th:'🧠 เช็คอินอัจฉริยะ', id:'🧠 Absensi pintar', ph:'🧠 Smart attendance', ne:'🧠 स्मार्ट हाजिरी', hi:'🧠 स्मार्ट उपस्थिति'},
  'gps.auto_title':       {vi:'Chấm công tự động thông minh', en:'Smart auto attendance', ko:'스마트 자동 출퇴근', ja:'スマート自動打刻', zh:'智能自动打卡', my:'အလိုအလျောက် တက်မှတ်', th:'เช็คอินอัตโนมัติอัจฉริยะ', id:'Absensi otomatis cerdas', ph:'Smart auto attendance', ne:'स्मार्ट स्वचालित हाजिरी', hi:'स्मार्ट स्वत: उपस्थिति'},
  'gps.auto_sub':         {vi:'Dùng Wi-Fi + BTS + GPS để tự động vào/ra ca', en:'Wi-Fi + BTS + GPS for auto clock-in/out', ko:'Wi-Fi + BTS + GPS로 자동 출퇴근', ja:'Wi-Fi + BTS + GPSで自動打刻', zh:'Wi-Fi + BTS + GPS 自动上下班', my:'Wi-Fi + BTS + GPS — အလိုအလျောက် တက်/ဆင်း', th:'Wi-Fi + BTS + GPS สำหรับเช็คอิน/เอาท์อัตโนมัติ', id:'Wi-Fi + BTS + GPS untuk absen otomatis', ph:'Wi-Fi + BTS + GPS para auto time in/out', ne:'Wi-Fi + BTS + GPS स्वत: इन/आउट', hi:'Wi-Fi + BTS + GPS से स्वत: प्रवेश/निकास'},
  'gps.home_title':       {vi:'🏠 Hồ sơ nhà', en:'🏠 Home Profile', ko:'🏠 집 프로필', ja:'🏠 自宅プロフィール', zh:'🏠 家庭档案', my:'🏠 အိမ် ပရိုဖိုင်', th:'🏠 โปรไฟล์บ้าน', id:'🏠 Profil Rumah', ph:'🏠 Home Profile', ne:'🏠 घर प्रोफाइल', hi:'🏠 घर प्रोफ़ाइल'},
  'gps.home_hint':        {vi:'Đứng ở nhà → bấm để lưu tín hiệu nhận diện.', en:'At home → tap to save identification signals.', ko:'집에서 → 눌러서 신호 저장', ja:'自宅で → タップして信号を保存', zh:'在家 → 点击保存识别信号', my:'အိမ်မှာ → တင်ဒေသသိမ်းရန် နှိပ်ပါ', th:'อยู่บ้าน → กดบันทึกสัญญาณ', id:'Di rumah → tekan untuk simpan sinyal', ph:'Nasa bahay → i-tap para i-save ang signal', ne:'घरमा → संकेत सेभ गर्न थिच्नुस्', hi:'घर पर → संकेत सहेजने के लिए टैप करें'},
  'gps.work_title':       {vi:'🏢 Hồ sơ công ty', en:'🏢 Work Profile', ko:'🏢 회사 프로필', ja:'🏢 職場プロフィール', zh:'🏢 公司档案', my:'🏢 ကုမ္ပဏီ ပရိုဖိုင်', th:'🏢 โปรไฟล์บริษัท', id:'🏢 Profil Kantor', ph:'🏢 Work Profile', ne:'🏢 कार्य प्रोफाइल', hi:'🏢 कंपनी प्रोफ़ाइल'},
  'gps.work_hint':        {vi:'Đứng ở công ty → bấm để lưu Wi-Fi / GPS công ty.', en:'At work → tap to save work Wi-Fi / GPS.', ko:'회사에서 → Wi-Fi/GPS 저장', ja:'職場で → Wi-Fi/GPS保存', zh:'在公司 → 保存Wi-Fi/GPS', my:'ကုမ္ပဏီမှာ → Wi-Fi/GPS သိမ်းရန် နှိပ်ပါ', th:'อยู่บริษัท → กดบันทึก Wi-Fi/GPS', id:'Di kantor → simpan Wi-Fi/GPS kantor.', ph:'Nasa work → i-save ang Wi-Fi/GPS.', ne:'कम्पनीमा → Wi-Fi/GPS सेभ गर्नुस्', hi:'कंपनी में → Wi-Fi/GPS सहेजें'},
  'gps.signal_title':     {vi:'📡 Tín hiệu hiện tại', en:'📡 Current signals', ko:'📡 현재 신호', ja:'📡 現在の信号', zh:'📡 当前信号', my:'📡 လက်ရှိ အချက်ပြ', th:'📡 สัญญาณปัจจุบัน', id:'📡 Sinyal saat ini', ph:'📡 Kasalukuyang signal', ne:'📡 हालको संकेत', hi:'📡 वर्तमान संकेत'},
  'gps.signal_refresh':   {vi:'Cập nhật', en:'Refresh', ko:'새로고침', ja:'更新', zh:'刷新', my:'ပြန်စစ်', th:'รีเฟรช', id:'Segarkan', ph:'I-refresh', ne:'ताजा', hi:'रिफ्रेश'},
  'gps.signal_waiting':   {vi:'Đang chờ tín hiệu...', en:'Waiting for signals...', ko:'신호 대기 중...', ja:'信号待機中...', zh:'等待信号...', my:'အချက်ပြ စောင့်နေ...', th:'รอสัญญาณ...', id:'Menunggu sinyal...', ph:'Naghihintay ng signal...', ne:'संकेत पर्खँदै...', hi:'संकेत प्रतीक्षा...'},
  'sa.status_starting':   {vi:'Đang khởi động...', en:'Starting...', ko:'시작 중...', ja:'起動中...', zh:'正在启动...', my:'စတင်နေသည်...', th:'กำลังเริ่มต้น...', id:'Memulai...', ph:'Nagsisimula...', ne:'सुरु हुँदैछ...', hi:'प्रारंभ हो रहा...'},
  'gpsv3.battery_normal': {vi:'Bình thường',                          en:'Normal',                          ko:'일반',                     ja:'通常',                          zh:'正常',                  my:'ပုံမှန်',                  th:'ปกติ',                       id:'Normal',                    ph:'Normal',                   ne:'सामान्य',                    hi:'सामान्य'},
  'gpsv3.battery_low':    {vi:'Tiết kiệm',                            en:'Low Power',                       ko:'절전',                     ja:'省電力',                        zh:'省电',                  my:'ပါဝါသက်သာ',             th:'ประหยัด',                    id:'Hemat',                     ph:'Tipid',                    ne:'किफायती',                    hi:'कम बिजली'},
  'gpsv3.battery_min':    {vi:'Tối thiểu',                            en:'Critical',                        ko:'최소',                     ja:'最小',                          zh:'最低',                  my:'အနိမ့်ဆုံး',              th:'ต่ำสุด',                     id:'Minimum',                   ph:'Pinakamababa',             ne:'न्यूनतम',                    hi:'न्यूनतम'},
  'gpsv3.battery_hint':   {vi:'⚡ Tự động chuyển khi pin yếu (cần Battery API)', en:'⚡ Auto-switch on low battery (Battery API)',  ko:'⚡ 배터리 부족 시 자동 전환 (Battery API 필요)', ja:'⚡ バッテリー低下時に自動切替 (Battery API)',  zh:'⚡ 电量低时自动切换 (需 Battery API)',  my:'⚡ ဘက်ထရီနည်းသည့်အခါ အလိုအလျောက် ပြောင်း',  th:'⚡ สลับอัตโนมัติเมื่อแบตอ่อน',  id:'⚡ Otomatis ganti saat baterai lemah',  ph:'⚡ Auto-switch sa mababang baterya',  ne:'⚡ ब्याट्री कम भएमा स्वत: स्विच',  hi:'⚡ कम बैटरी पर ऑटो स्विच'},
  'gpsv3.stats_title':    {vi:'📊 Trạng thái GPS',                    en:'📊 GPS Status',                   ko:'📊 GPS 상태',              ja:'📊 GPS 状態',                   zh:'📊 GPS 状态',           my:'📊 GPS အခြေအနေ',         th:'📊 สถานะ GPS',               id:'📊 Status GPS',             ph:'📊 GPS Status',            ne:'📊 GPS स्थिति',              hi:'📊 GPS स्थिति'},
  'gpsv3.refresh':        {vi:'Refresh',                              en:'Refresh',                         ko:'새로고침',                 ja:'更新',                          zh:'刷新',                  my:'ပြန်စစ်',                 th:'รีเฟรช',                     id:'Segarkan',                  ph:'I-refresh',                ne:'ताजा गर्ने',                  hi:'रिफ्रेश'},
  'gpsv3.stats_empty':    {vi:'Bấm Refresh để xem...',                 en:'Tap Refresh to view...',          ko:'새로고침을 눌러주세요...',  ja:'更新ボタンを押してください...', zh:'点击刷新查看...',     my:'ကြည့်ရန် ပြန်စစ်ကို နှိပ်ပါ', th:'แตะรีเฟรชเพื่อดู...',         id:'Tekan Segarkan untuk lihat...', ph:'I-tap ang Refresh upang tingnan...', ne:'हेर्न ताजा गर्ने थिच्नुहोस्...', hi:'देखने के लिए रिफ्रेश दबाएं...'},
  'gpsv3.trail_title':    {vi:'📍 GPS Trail (Audit)',                  en:'📍 GPS Trail (Audit)',            ko:'📍 GPS 기록 (감사)',       ja:'📍 GPS 履歴 (監査)',           zh:'📍 GPS 轨迹 (审计)',     my:'📍 GPS မှတ်တမ်း (စစ်ဆေးရန်)', th:'📍 GPS Trail (ตรวจสอบ)',     id:'📍 Riwayat GPS (Audit)',    ph:'📍 GPS Trail (Audit)',     ne:'📍 GPS पथ (परीक्षण)',         hi:'📍 GPS ट्रेल (ऑडिट)'},
  'gpsv3.trail_today':    {vi:'Xem hôm nay',                          en:'View today',                      ko:'오늘 보기',                ja:'今日を表示',                    zh:'查看今天',              my:'ယနေ့ ကြည့်ရန်',           th:'ดูวันนี้',                    id:'Lihat hari ini',            ph:'Tingnan ngayon',           ne:'आज हेर्ने',                  hi:'आज देखें'},
  'gpsv3.trail_empty':    {vi:'Bấm "Xem hôm nay" để hiển thị...',     en:'Tap "View today" to show...',     ko:'"오늘 보기"를 눌러주세요...', ja:'「今日を表示」を押してください...', zh:'点击"查看今天"显示...', my:'"ယနေ့ ကြည့်ရန်"ကို နှိပ်ပါ',  th:'แตะ "ดูวันนี้" เพื่อแสดง...', id:'Tekan "Lihat hari ini"...', ph:'I-tap ang "Tingnan ngayon"...', ne:'"आज हेर्ने" थिच्नुहोस्...', hi:'"आज देखें" दबाएं...'},
  'gpsv3.trail_no_data':  {vi:'Chưa có dữ liệu hôm nay',              en:'No data for today',               ko:'오늘 데이터 없음',          ja:'今日のデータなし',              zh:'今天暂无数据',          my:'ယနေ့အတွက် ဒေတာ မရှိ',     th:'ไม่มีข้อมูลวันนี้',           id:'Tidak ada data hari ini',   ph:'Walang data ngayong araw', ne:'आजको डाटा छैन',              hi:'आज का डेटा नहीं'},

  /* ── SMART ATTENDANCE (chấm công thông minh) ────────────────────────── */
  'sa.title':            {vi:'🧠 Chấm công thông minh',                en:'🧠 Smart Attendance',             ko:'🧠 스마트 출퇴근',          ja:'🧠 スマート出勤',                zh:'🧠 智能考勤',            my:'🧠 စမတ်တက်ရောက်',         th:'🧠 เช็คอินอัจฉริยะ',          id:'🧠 Absensi Pintar',         ph:'🧠 Smart Attendance',      ne:'🧠 स्मार्ट हाजिरी',           hi:'🧠 स्मार्ट अटेंडेंस'},
  'sa.hint':             {vi:'Wi-Fi + BTS + GPS — tự động phát hiện đi/về', en:'Wi-Fi + BTS + GPS — auto detect leave/arrive', ko:'Wi-Fi + BTS + GPS — 자동 감지', ja:'Wi-Fi + BTS + GPS — 自動検出', zh:'Wi-Fi + BTS + GPS — 自动检测', my:'Wi-Fi + BTS + GPS — အလိုအလျောက်', th:'Wi-Fi + BTS + GPS — ตรวจจับอัตโนมัติ', id:'Wi-Fi + BTS + GPS — deteksi otomatis', ph:'Wi-Fi + BTS + GPS — auto detect', ne:'Wi-Fi + BTS + GPS — स्वचालित', hi:'Wi-Fi + BTS + GPS — स्वत: पहचान'},
  'sa.status_off':       {vi:'Chưa bật',                                en:'Not enabled',                     ko:'비활성화',                  ja:'無効',                          zh:'未启用',                my:'ပိတ်ထား',                   th:'ยังไม่เปิด',                  id:'Belum aktif',               ph:'Hindi pa naka-on',         ne:'सक्षम छैन',                   hi:'सक्षम नहीं'},
  'sa.home_title':       {vi:'🏠 Hồ sơ nhà',                           en:'🏠 Home Profile',                 ko:'🏠 집 프로필',              ja:'🏠 自宅プロフィール',            zh:'🏠 家庭档案',            my:'🏠 အိမ် ပရိုဖိုင်',         th:'🏠 โปรไฟล์บ้าน',              id:'🏠 Profil Rumah',           ph:'🏠 Home Profile',          ne:'🏠 घर प्रोफाइल',              hi:'🏠 होम प्रोफ़ाइल'},
  'sa.home_hint':        {vi:'Bấm nút bên dưới khi đang ở nhà để lưu tín hiệu.', en:'Tap below while at home to save signals.', ko:'집에서 아래 버튼을 눌러 신호를 저장하세요.', ja:'自宅で下のボタンを押して信号を保存', zh:'在家时点击下方保存信号', my:'အိမ်မှာ ရှိစဉ် အောက်ဖက်ကို နှိပ်ပါ', th:'กดปุ่มด้านล่างขณะอยู่บ้าน', id:'Tekan tombol saat di rumah', ph:'I-tap ang button habang nasa bahay', ne:'घरमा हुँदा तल थिच्नुहोस्', hi:'घर पर होने पर नीचे टैप करें'},
  'sa.work_title':       {vi:'🏢 Hồ sơ công ty (Wi-Fi + GPS)',          en:'🏢 Work Profile (Wi-Fi + GPS)',   ko:'🏢 회사 프로필 (Wi-Fi + GPS)', ja:'🏢 職場プロフィール (Wi-Fi + GPS)', zh:'🏢 公司档案 (Wi-Fi + GPS)', my:'🏢 အလုပ် ပရိုဖိုင် (Wi-Fi + GPS)', th:'🏢 โปรไฟล์ที่ทำงาน (Wi-Fi + GPS)', id:'🏢 Profil Kantor (Wi-Fi + GPS)', ph:'🏢 Work Profile (Wi-Fi + GPS)', ne:'🏢 कार्य प्रोफाइल (Wi-Fi + GPS)', hi:'🏢 वर्क प्रोफ़ाइल (Wi-Fi + GPS)'},
  'sa.work_gps_note':    {vi:'GPS công ty dùng chung với phần "Vị trí công ty" ở trên', en:'Work GPS shared with "Company Location" above', ko:'회사 GPS는 위의 "회사 위치"와 공유', ja:'職場GPSは上の「会社の位置」と共有', zh:'公司GPS与上方"公司位置"共享', my:'ကုမ္ပဏီ GPS အထက်က "ကုမ္ပဏီ တည်နေရာ"နှင့် မျှဝေ', th:'GPS ที่ทำงานใช้ร่วมกับ "ตำแหน่งบริษัท" ด้านบน', id:'GPS kantor sama dengan "Lokasi Kantor" di atas', ph:'Work GPS shared sa "Company Location" sa itaas', ne:'कार्य GPS माथिको "कम्पनी स्थान"सँग साझा', hi:'वर्क GPS ऊपर "कंपनी स्थान" के साथ साझा'},
  'sa.save_wifi':        {vi:'📶 Lưu Wi-Fi',                            en:'📶 Save Wi-Fi',                   ko:'📶 Wi-Fi 저장',             ja:'📶 Wi-Fi保存',                  zh:'📶 保存Wi-Fi',           my:'📶 Wi-Fi သိမ်း',             th:'📶 บันทึก Wi-Fi',             id:'📶 Simpan Wi-Fi',           ph:'📶 I-save Wi-Fi',          ne:'📶 Wi-Fi सेभ',                hi:'📶 Wi-Fi सेव करें'},
  'sa.save_bts':         {vi:'📡 Lưu BTS',                              en:'📡 Save BTS',                     ko:'📡 BTS 저장',               ja:'📡 BTS保存',                    zh:'📡 保存BTS',             my:'📡 BTS သိမ်း',               th:'📡 บันทึก BTS',               id:'📡 Simpan BTS',             ph:'📡 I-save BTS',            ne:'📡 BTS सेभ',                  hi:'📡 BTS सेव करें'},
  'sa.save_gps':         {vi:'📍 Lưu GPS',                              en:'📍 Save GPS',                     ko:'📍 GPS 저장',               ja:'📍 GPS保存',                    zh:'📍 保存GPS',             my:'📍 GPS သိမ်း',               th:'📍 บันทึก GPS',               id:'📍 Simpan GPS',             ph:'📍 I-save GPS',            ne:'📍 GPS सेभ',                  hi:'📍 GPS सेव करें'},
  'sa.trail_title':      {vi:'🧠 Smart Trail (Debug)',                  en:'🧠 Smart Trail (Debug)',          ko:'🧠 스마트 기록 (디버그)',    ja:'🧠 スマートトレイル (デバッグ)',   zh:'🧠 智能轨迹 (调试)',     my:'🧠 စမတ် မှတ်တမ်း (Debug)',  th:'🧠 Smart Trail (Debug)',      id:'🧠 Smart Trail (Debug)',    ph:'🧠 Smart Trail (Debug)',   ne:'🧠 स्मार्ट ट्रेल (डिबग)',     hi:'🧠 स्मार्ट ट्रेल (डीबग)'},

  /* ── BACKGROUND STATUS PANEL ────────────────────────────────────────── */
  'bg.status_title':      {vi:'🛡️ Trạng thái chạy ngầm',              en:'🛡️ Background status',           ko:'🛡️ 백그라운드 상태',       ja:'🛡️ バックグラウンド状態',       zh:'🛡️ 后台状态',           my:'🛡️ နောက်ခံ အခြေအနေ',     th:'🛡️ สถานะเบื้องหลัง',         id:'🛡️ Status latar',           ph:'🛡️ Background status',     ne:'🛡️ पृष्ठभूमि स्थिति',         hi:'🛡️ बैकग्राउंड स्थिति'},
  'bg.refresh':           {vi:'🔄 Làm mới',                           en:'🔄 Refresh',                      ko:'🔄 새로고침',              ja:'🔄 更新',                       zh:'🔄 刷新',                my:'🔄 ပြန်စစ်',                th:'🔄 รีเฟรช',                  id:'🔄 Segarkan',               ph:'🔄 I-refresh',             ne:'🔄 ताजा गर्ने',               hi:'🔄 रिफ्रेश'},
  'bg.reschedule':        {vi:'⏰ Lên lịch lại tất cả',                en:'⏰ Reschedule all',               ko:'⏰ 모두 다시 예약',         ja:'⏰ すべて再スケジュール',         zh:'⏰ 全部重新安排',         my:'⏰ အားလုံး ပြန်ဇယားဆွဲ',  th:'⏰ ตั้งเวลาทั้งหมดใหม่',      id:'⏰ Jadwal ulang semua',     ph:'⏰ I-reschedule lahat',    ne:'⏰ सबै पुनः तालिका',          hi:'⏰ सब पुनर्निर्धारित'},
  'bg.force_bg':          {vi:'🚀 Bật chạy ngầm GPS (force)',          en:'🚀 Force start background GPS',   ko:'🚀 백그라운드 GPS 강제 시작', ja:'🚀 バックグラウンドGPS強制起動', zh:'🚀 强制启动后台GPS',    my:'🚀 နောက်ခံ GPS အတင်းစ',     th:'🚀 บังคับเริ่ม GPS เบื้องหลัง',  id:'🚀 Paksa mulai GPS latar',  ph:'🚀 Pilitin BG GPS',        ne:'🚀 बैकग्राउन्ड GPS जबरजस्ती सुरु', hi:'🚀 बैकग्राउंड GPS जबरन शुरू'},
  'perm.notif':           {vi:'🔔 Quyền thông báo',                    en:'🔔 Notification permission',      ko:'🔔 알림 권한',             ja:'🔔 通知権限',                   zh:'🔔 通知权限',           my:'🔔 အသိပေး ခွင့်ပြုချက်', th:'🔔 สิทธิ์การแจ้งเตือน',       id:'🔔 Izin notifikasi',       ph:'🔔 Notification permission', ne:'🔔 सूचना अनुमति',          hi:'🔔 नोटिफिकेशन अनुमति'},
  'perm.location':        {vi:'📍 Quyền vị trí',                       en:'📍 Location permission',          ko:'📍 위치 권한',             ja:'📍 位置情報の権限',             zh:'📍 位置权限',           my:'📍 တည်နေရာ ခွင့်ပြုချက်', th:'📍 สิทธิ์ตำแหน่ง',           id:'📍 Izin lokasi',          ph:'📍 Location permission',   ne:'📍 स्थान अनुमति',          hi:'📍 स्थान अनुमति'},
  'perm.battery':         {vi:'🔋 Cài đặt pin',                        en:'🔋 Battery settings',             ko:'🔋 배터리 설정',           ja:'🔋 バッテリー設定',             zh:'🔋 电池设置',           my:'🔋 ဘက်ထရီ ဆက်တင်',       th:'🔋 ตั้งค่าแบตเตอรี่',        id:'🔋 Pengaturan baterai',    ph:'🔋 Battery settings',      ne:'🔋 ब्याट्री सेटिङ',        hi:'🔋 बैटरी सेटिंग'},
  'bg.loading':           {vi:'Đang tải...',                          en:'Loading...',                      ko:'불러오는 중...',          ja:'読み込み中...',                  zh:'加载中...',             my:'တင်နေသည်...',            th:'กำลังโหลด...',                id:'Memuat...',                  ph:'Naglo-load...',            ne:'लोड हुँदै...',                hi:'लोड हो रहा...'},

  /* ── TRANG CHỦ ─────────────────────────────────────────────────────
     Nút VÀO CA: sub-text bên dưới nút (hiển thị giờ đã bấm)
     Nút HẾT CA: sub-text bên dưới nút
     Status pill: badge trạng thái (xanh khi vào ca, đỏ khi ra)
     Hours badge: chip giờ làm nhỏ bên phải ngày
     ─────────────────────────────────────────────────────────────── */
  'home.in_at':      {vi:'Vào lúc',       en:'In at',         ko:'출근',     ja:'出勤',    zh:'上班',   my:'တက် ',    th:'เข้า ',     id:'Masuk ',     ph:'Pumasok ',   ne:'प्रवेश ',  hi:'प्रवेश '},
  'home.out_at':     {vi:'Ra lúc',        en:'Out at',        ko:'퇴근',     ja:'退勤',    zh:'下班',   my:'ဆင်း ',   th:'ออก ',      id:'Keluar ',    ph:'Lumabas ',   ne:'निस्किने ',hi:'प्रस्थान '},
  'home.status_in':  {vi:'✓ Vào ca',      en:'✓ In',          ko:'✓ 출근',   ja:'✓ 出勤',  zh:'✓ 上班', my:'✓ တက် ',  th:'✓ เข้างาน ',id:'✓ Masuk ',   ph:'✓ Pumasok ', ne:'✓ प्रवेश ', hi:'✓ प्रवेश '},
  'home.h_worked':   {vi:'h làm việc',    en:'h worked',      ko:'h 근무',   ja:'h 勤務',  zh:'工作h',  my:'h အလုပ်',  th:'h ทำงาน',   id:'j kerja',    ph:'h nagtrabaho',ne:'h काम',  hi:'h काम'},

  /* ── BẢNG LƯƠNG ─────────────────────────────────────────────────────
     salaryBreakdown: các dòng chi tiết trong bảng tính lương
     Muốn đổi tên "Bảo hiểm" → sửa 'salary.insurance'
     Muốn đổi "Tăng ca"      → sửa 'salary.overtime'
     ─────────────────────────────────────────────────────────────── */
  'salary.insurance': {vi:'Bảo hiểm',      en:'Insurance',     ko:'사회보험',  ja:'社会保険', zh:'社保',   my:'အာမခံ',    th:'ประกันสังคม',id:'Asuransi',  ph:'Insurance',  ne:'बीमा',      hi:'बीमा'},
  'salary.tax':       {vi:'Thuế thu nhập', en:'Income tax',    ko:'소득세',    ja:'所得税',   zh:'所得税', my:'ဝင်ငွေခွန်',th:'ภาษีเงินได้',id:'Pajak penghasilan',ph:'Income tax',ne:'आयकर',  hi:'आयकर'},
  'salary.present':   {vi:'Có mặt',        en:'Present',       ko:'출근',      ja:'出勤',     zh:'出勤',   my:'တက်',      th:'มาทำงาน',    id:'Hadir',     ph:'Dumalo',     ne:'उपस्थित',  hi:'उपस्थित'},
  'salary.days':      {vi:'ngày',          en:'days',          ko:'일',        ja:'日',       zh:'天',     my:'ရက်',      th:'วัน',         id:'hari',      ph:'araw',       ne:'दिन',       hi:'दिन'},
  'salary.night':     {vi:'Ca đêm',        en:'Night shift',   ko:'야간 근무', ja:'夜勤',     zh:'夜班',   my:'ညဆင်း',   th:'กะกลางคืน',  id:'Shift malam',ph:'Night shift',ne:'रात पाली',hi:'रात शिफ्ट'},
  'salary.overtime':  {vi:'Tăng ca',       en:'Overtime',      ko:'초과근무',  ja:'残業',     zh:'加班',   my:'ချိန်ပို',  th:'ล่วงเวลา',   id:'Lembur',    ph:'Overtime',   ne:'ओभरटाइम',  hi:'ओवरटाइम'},
  'salary.leave':     {vi:'Nghỉ phép',     en:'Leave',         ko:'연차',      ja:'有給',     zh:'请假',   my:'ခွင့်',    th:'ลา',          id:'Cuti',      ph:'Leave',      ne:'बिदा',      hi:'छुट्टी'},
  'salary.absent':    {vi:'Vắng',          en:'Absent',        ko:'결근',      ja:'欠勤',     zh:'缺勤',   my:'ပျက်',     th:'ขาดงาน',     id:'Absen',     ph:'Absent',     ne:'अनुपस्थित',hi:'अनुपस्थित'},
  'salary.holiday':   {vi:'Làm ngày lễ',   en:'Holiday work',  ko:'휴일 근무', ja:'休日出勤', zh:'节假日', my:'ရုံးပိတ်ရက်',th:'ทำงานวันหยุด',id:'Kerja hari libur',ph:'Holiday work',ne:'बिदा काम',hi:'छुट्टी काम'},

  /* ── GPS PANEL ───────────────────────────────────────────────────────
     Nhãn trên panel GPS (Thông báo > GPS auto)
     Muốn đổi tiêu đề section → 'gps.section'
     Muốn đổi nhãn bán kính   → 'gps.radius'
     Muốn đổi nút lấy vị trí  → 'gps.btn_get'
     Muốn đổi tip dưới cùng   → 'gps.tip'
     Muốn đổi nhãn slider vào/ra ca → 'gps.checkin_lbl' / 'gps.checkout_lbl'
     ─────────────────────────────────────────────────────────────── */
  'gps.section':      {vi:'📍 VỊ TRÍ CÔNG TY',      en:'📍 COMPANY LOCATION',       ko:'📍 회사 위치',        ja:'📍 会社の位置',     zh:'📍 公司位置',     my:'📍 ကုမ္ပဏီတည်နေရာ',th:'📍 ที่ตั้งบริษัท',id:'📍 LOKASI PERUSAHAAN',ph:'📍 LOKASYON NG KUMPANYA',ne:'📍 कम्पनीको स्थान',hi:'📍 कंपनी का स्थान'},
  'gps.radius':       {vi:'Bán kính phát hiện',      en:'Detection radius',          ko:'감지 반경',           ja:'検出半径',          zh:'检测半径',        my:'သိရှိနိုင်သောအချင်း',th:'รัศมีตรวจจับ',  id:'Radius deteksi',ph:'Radius ng pagtuklas',ne:'पहिचान त्रिज्या',hi:'पहचान त्रिज्या'},
  'gps.checkin_lbl':  {vi:'⏱️ Phút xác nhận VÀO ca', en:'⏱️ Check-in confirm (min)', ko:'⏱️ 출근 확인 (분)',   ja:'⏱️ 出勤確認 (分)',  zh:'⏱️ 上班确认 (分)', my:'⏱️ တက် မိနစ်',   th:'⏱️ นาทียืนยันเข้างาน',id:'⏱️ Menit konfirmasi MASUK',ph:'⏱️ Minuto para kumpirmahin ang PASOK',ne:'⏱️ हाजिर मिनेट',hi:'⏱️ प्रवेश मिनट'},
  'gps.checkout_lbl': {vi:'⏱️ Phút xác nhận HẾT ca', en:'⏱️ Check-out confirm (min)',ko:'⏱️ 퇴근 확인 (분)',   ja:'⏱️ 退勤確認 (分)',  zh:'⏱️ 下班确认 (分)', my:'⏱️ ဆင်း မိနစ်',  th:'⏱️ นาทียืนยันออกงาน',id:'⏱️ Menit konfirmasi KELUAR',ph:'⏱️ Minuto para kumpirmahin ang LABAS',ne:'⏱️ विदाइ मिनेट',hi:'⏱️ प्रस्थान मिनट'},
  'gps.tight_company_lbl': {vi:'Ở công ty: GPS chặt', en:'At company: tight GPS', ko:'회사 안: 정밀 GPS', ja:'会社内: 高精度GPS', zh:'在公司: 精准GPS', my:'ကုမ္ပဏီတွင်: တင်းကျပ် GPS', th:'อยู่บริษัท: GPS เข้มงวด', id:'Di kantor: GPS ketat', ph:'Nasa kumpanya: tight GPS', ne:'कम्पनीमै: कडा GPS', hi:'कंपनी में: सख्त GPS'},
  'gps.tight_company_hint': {vi:'Dùng bán kính 15m và vùng đệm 20m, vẫn chấm vào/ra bằng GPS.', en:'Use a 15m radius and 20m buffer; clock in/out still uses GPS.', ko:'반경 15m와 버퍼 20m를 사용하며 출퇴근은 계속 GPS로 처리합니다.', ja:'半径15mとバッファ20mを使い、打刻は引き続きGPSで行います。', zh:'使用15米半径和20米缓冲区，仍然通过GPS上下班打卡。', my:'15m အချင်းဝက်နှင့် 20m buffer သုံးပြီး GPS ဖြင့်သာ တက်/ဆင်းမှတ်မည်။', th:'ใช้รัศมี 15 ม. และเขตกันชน 20 ม. โดยยังเช็คเข้า/ออกด้วย GPS', id:'Gunakan radius 15m dan buffer 20m; absen masuk/keluar tetap memakai GPS.', ph:'Gamit ang 15m radius at 20m buffer; GPS pa rin ang in/out.', ne:'१५m radius र २०m buffer प्रयोग हुन्छ; इन/आउट GPS बाटै हुन्छ।', hi:'15m radius और 20m buffer उपयोग होगा; इन/आउट GPS से ही होगा।'},
  'gps.btn_get':      {vi:'📍 Lấy vị trí hiện tại',  en:'📍 Get current location',   ko:'📍 현재 위치 가져오기',ja:'📍 現在地を取得',   zh:'📍 获取当前位置', my:'📍 လက်ရှိတည်နေရာ',th:'📍 รับตำแหน่งปัจจุบัน',id:'📍 Dapatkan lokasi saat ini',ph:'📍 Kunin ang kasalukuyang lokasyon',ne:'📍 हालको स्थान',hi:'📍 वर्तमान स्थान'},
  'gps.tip':          {vi:'💡 Chấm công tự động dùng Wi-Fi + BTS + GPS; GPS chỉ là một tín hiệu xác thực, không còn chấm độc lập.',en:'💡 Auto attendance uses Wi-Fi + BTS + GPS; GPS is only one verification signal, not a standalone clock-in method.',ko:'💡 Wi-Fi + BTS + GPS로 자동 출퇴근하며 GPS 단독打刻은 사용하지 않습니다.',ja:'💡 Wi-Fi + BTS + GPSで自動打刻します。GPS単独打刻は使いません。',zh:'💡 自动打卡使用 Wi-Fi + BTS + GPS；GPS 不再单独打卡。',my:'💡 Wi-Fi + BTS + GPS ဖြင့် auto attendance လုပ်သည်; GPS သီးသန့်မသုံးပါ။',th:'💡 ใช้ Wi-Fi + BTS + GPS สำหรับเช็คอินอัตโนมัติ ไม่ใช้ GPS เดี่ยว',id:'💡 Absensi otomatis memakai Wi-Fi + BTS + GPS; GPS bukan metode tunggal.',ph:'💡 Auto attendance uses Wi-Fi + BTS + GPS; hindi na GPS-only.',ne:'💡 Auto attendance Wi-Fi + BTS + GPS प्रयोग गर्छ; GPS मात्र होइन।',hi:'💡 Auto attendance Wi-Fi + BTS + GPS उपयोग करता है; केवल GPS नहीं।'},
  'gps.no_setup':     {vi:'Chưa thiết lập vị trí công ty',en:'Company location not set',ko:'회사 위치가 설정되지 않음',ja:'会社の位置が未設定',zh:'公司位置未设置',my:'ကုမ္ပဏီနေရာ မသတ်မှတ်ရသေး',th:'ยังไม่ได้ตั้งค่าตำแหน่งบริษัท',id:'Lokasi perusahaan belum diatur',ph:'Hindi pa naitakda ang lokasyon',ne:'कम्पनीको स्थान सेट गरिएको छैन',hi:'कंपनी का स्थान निर्धारित नहीं है'},
  'gps.loading':      {vi:'⏳ Đang lấy vị trí...',  en:'⏳ Getting location...',  ko:'⏳ 위치 가져오는 중...',ja:'⏳ 位置取得中...',  zh:'⏳ 正在获取位置...', my:'⏳ နေရာရယူနေသည်...',th:'⏳ กำลังรับตำแหน่ง...',id:'⏳ Mendapatkan lokasi...',ph:'⏳ Kinukuha ang lokasyon...',ne:'⏳ स्थान प्राप्त गर्दैछ...',hi:'⏳ स्थान प्राप्त हो रहा है...'},
  'gps.active':       {vi:'📍 GPS đang theo dõi (cứ {s}s/lần)',en:'📍 GPS tracking active (every {s}s)',ko:'📍 GPS 추적 중 ({s}s 간격)',ja:'📍 GPS追跡中（{s}秒ごと）',zh:'📍 GPS追踪中（每{s}秒）',my:'📍 GPS ပြေး ({s}s)',th:'📍 GPS กำลังติดตาม (ทุก {s}วิ)',id:'📍 GPS aktif (setiap {s}dtk)',ph:'📍 GPS aktibo (bawat {s}s)',ne:'📍 GPS सक्रिय ({s}s अन्तर)',hi:'📍 GPS सक्रिय (हर {s}s)'},
  'gps.saved':        {vi:'✅ Đã lưu vị trí công ty. Đang chờ GPS xác nhận vị trí hiện tại.',en:'✅ Company location saved. Waiting for GPS to confirm current position.',ko:'✅ 회사 위치 저장됨. GPS가 현재 위치를 확인하는 중입니다.',ja:'✅ 会社の位置を保存しました。GPSで現在地を確認中です。',zh:'✅ 公司位置已保存。正在等待GPS确认当前位置。',my:'✅ ကုမ္ပဏီနေရာ သိမ်းပြီးပါပြီ။ GPS က လက်ရှိနေရာ အတည်ပြုနေသည်။',th:'✅ บันทึกตำแหน่งบริษัทแล้ว กำลังรอ GPS ยืนยันตำแหน่งปัจจุบัน',id:'✅ Lokasi perusahaan disimpan. Menunggu GPS mengonfirmasi posisi saat ini.',ph:'✅ Na-save ang lokasyon ng kumpanya. Hinihintay ang GPS na kumpirmahin ang kasalukuyang lokasyon.',ne:'✅ कम्पनी स्थान सुरक्षित भयो। GPS ले हालको स्थान पुष्टि गर्दैछ।',hi:'✅ कंपनी स्थान सहेजा गया। GPS वर्तमान स्थान की पुष्टि कर रहा है।'},
  'gps.in_zone':      {vi:'🟢 Đang trong khu vực công ty',en:'🟢 Inside company area',ko:'🟢 회사 구역 내',ja:'🟢 会社エリア内',zh:'🟢 在公司区域内',my:'🟢 ကုမ္ပဏီနယ်အတွင်း',th:'🟢 อยู่ในเขตบริษัท',id:'🟢 Dalam area kantor',ph:'🟢 Loob ng kumpanya',ne:'🟢 कम्पनी क्षेत्रभित्र',hi:'🟢 कंपनी क्षेत्र में'},
  'gps.out_zone':     {vi:'🔴 Ngoài khu vực công ty',en:'🔴 Outside company area',ko:'🔴 회사 구역 외',ja:'🔴 会社エリア外',zh:'🔴 在公司区域外',my:'🔴 ကုမ္ပဏီနယ်အပြင်',th:'🔴 นอกเขตบริษัท',id:'🔴 Luar area kantor',ph:'🔴 Labas ng kumpanya',ne:'🔴 कम्पनी क्षेत्रबाहिर',hi:'🔴 कंपनी क्षेत्र के बाहर'},
  'gps.no_device':    {vi:'Thiết bị không hỗ trợ GPS',en:'Device does not support GPS',ko:'기기가 GPS를 지원하지 않음',ja:'端末がGPSをサポートしていません',zh:'设备不支持GPS',my:'စက်ပစ္စည်းသည် GPS မထောက်ပံ့',th:'อุปกรณ์ไม่รองรับ GPS',id:'Perangkat tidak mendukung GPS',ph:'Hindi sinusuportahan ng device ang GPS',ne:'उपकरणले GPS समर्थन गर्दैन',hi:'उपकरण GPS का समर्थन नहीं करता'},
  'gps.err_denied':   {vi:'GPS bị từ chối. Vui lòng nhập tọa độ thủ công.',en:'GPS denied. Please enter coordinates manually.',ko:'GPS 거부됨. 좌표를 수동으로 입력하세요.',ja:'GPSが拒否されました。座標を手動入力してください。',zh:'GPS被拒绝。请手动输入坐标。',my:'GPS ငြင်းပယ်ခံရ။ ကိုသြဒိနိတ်ကို လက်ဖြင့်ထည့်ပါ။',th:'ปฏิเสธ GPS โปรดใส่พิกัดด้วยตนเอง',id:'GPS ditolak. Masukkan koordinat secara manual.',ph:'Hindi pinayagan ang GPS. Ipasok ang koordinate nang manu-mano.',ne:'GPS अस्वीकार। निर्देशांक हस्तसंलग्न गर्नुस्।',hi:'GPS अस्वीकृत। मैन्युअल रूप से निर्देशांक डालें।'},
  'gps.err_position': {vi:'Không xác định được vị trí. Thử ở nơi thoáng hơn.',en:'Position unavailable. Try in an open area.',ko:'위치를 확인할 수 없음. 트인 곳에서 시도하세요.',ja:'位置を取得できません。開けた場所で試してください。',zh:'无法确定位置。请在开阔处尝试。',my:'တည်နေရာ ဆုံးဖြတ်မရ။ ပွင့်လင်းသောနေရာတွင် ကြိုးစားပါ။',th:'ระบุตำแหน่งไม่ได้ ลองในที่โล่ง',id:'Lokasi tidak ditemukan. Coba di area terbuka.',ph:'Hindi makita ang lokasyon. Subukan sa lantad.',ne:'स्थान पत्ता लाग्न सकेन। खुला ठाउँमा प्रयास।',hi:'स्थान अनुपलब्ध। खुले स्थान पर प्रयास करें।'},
  'gps.err_timeout':  {vi:'Hết thời gian. Thử lại.',en:'Timeout. Try again.',ko:'시간 초과. 다시 시도.',ja:'タイムアウト。再試行。',zh:'超时。请重试。',my:'အချိန်ကုန်။ ပြန်ကြိုးစား။',th:'หมดเวลา ลองใหม่',id:'Waktu habis. Coba lagi.',ph:'Nag-timeout. Subukan muli.',ne:'समय सकियो। पुन: प्रयास।',hi:'समय समाप्त। पुन: प्रयास।'},
  'gps.err_label':    {vi:'Lỗi GPS',en:'GPS error',ko:'GPS 오류',ja:'GPSエラー',zh:'GPS错误',my:'GPS အမှား',th:'ผิดพลาด GPS',id:'Kesalahan GPS',ph:'Error sa GPS',ne:'GPS त्रुटि',hi:'GPS त्रुटि'},
  'gps.no_gps_api':   {vi:'❌ Không có GPS',en:'❌ No GPS',ko:'❌ GPS 없음',ja:'❌ GPSなし',zh:'❌ 无GPS',my:'❌ GPS မရှိ',th:'❌ ไม่มี GPS',id:'❌ Tidak ada GPS',ph:'❌ Walang GPS',ne:'❌ GPS छैन',hi:'❌ GPS नहीं'},
  'gps.coords_line':  {vi:'Bán kính: {r}m | Polling: {p}s',en:'Radius: {r}m | Polling: {p}s',ko:'반경: {r}m | 폴링: {p}s',ja:'半径: {r}m | ポーリング: {p}s',zh:'半径: {r}m | 轮询: {p}s',my:'အချင်း: {r}m | Polling: {p}s',th:'รัศมี: {r}m | Polling: {p}s',id:'Radius: {r}m | Polling: {p}s',ph:'Radius: {r}m | Polling: {p}s',ne:'त्रिज्या: {r}m | Polling: {p}s',hi:'त्रिज्या: {r}m | Polling: {p}s'},
  'gps.coords_invalid':{vi:'Tọa độ không hợp lệ. Kiểm tra lại.',en:'Invalid coordinates. Check again.',ko:'좌표가 잘못되었습니다. 다시 확인하세요.',ja:'座標が無効です。再確認してください。',zh:'坐标无效。请重新检查。',my:'ကိုသြဒိနိတ် မမှန်ပါ။ ပြန်စစ်ပါ။',th:'พิกัดไม่ถูกต้อง โปรดตรวจสอบ',id:'Koordinat tidak valid. Periksa lagi.',ph:'Maling koordinate. Suriin muli.',ne:'निर्देशांक अमान्य। पुन: जाँच गर्नुस्।',hi:'निर्देशांक अमान्य। फिर जाँचें।'},
  'gps.cycle_wait':   {vi:'GPS đã ra ca - chưa đủ 8 tiếng để vào chu kỳ mới ({m}p)',en:'GPS clocked out - need 8h before new cycle ({m}m)',ko:'GPS 퇴근 - 새 사이클까지 8시간 필요 ({m}분)',ja:'GPS退勤 - 新サイクルまで8時間 ({m}分)',zh:'GPS已签退 - 距新周期还需8小时 ({m}分钟)',my:'GPS ထွက်ပြီး - စက်ဝန်းသစ်အတွက် 8 နာရီ ({m}မိနစ်)',th:'GPS ออกแล้ว - ต้องรอ 8 ชม. ({m}น)',id:'GPS keluar - butuh 8 jam untuk siklus baru ({m}m)',ph:'GPS time out - kailangan 8h bago bagong cycle ({m}m)',ne:'GPS बाहिर - नयाँ चक्रलाई ८ घण्टा ({m}मि)',hi:'GPS बाहर - नए चक्र के लिए 8 घंटे ({m}m)'},
  'export.popup_blocked':{vi:'⚠️ Trình duyệt chặn pop-up. Vui lòng cho phép pop-up để xuất PDF.',en:'⚠️ Browser blocked pop-up. Allow pop-ups to export PDF.',ko:'⚠️ 브라우저가 팝업을 차단했습니다. PDF 내보내기를 위해 팝업을 허용하세요.',ja:'⚠️ ブラウザがポップアップをブロックしました。PDFエクスポートのため許可してください。',zh:'⚠️ 浏览器拦截了弹窗。请允许弹窗以导出PDF。',my:'⚠️ ဘရောက်ဇာက pop-up ပိတ်ထား။ PDF ထုတ်ရန် ခွင့်ပြုပါ။',th:'⚠️ เบราว์เซอร์บล็อกป๊อปอัป โปรดอนุญาตเพื่อส่งออก PDF',id:'⚠️ Browser memblokir pop-up. Izinkan pop-up untuk ekspor PDF.',ph:'⚠️ Hinaharangan ng browser ang pop-up. Payagan para mag-export ng PDF.',ne:'⚠️ ब्राउजरले पप-अप रोक्यो। PDF निर्यातका लागि अनुमति दिनुस्।',hi:'⚠️ ब्राउज़र ने पॉप-अप को रोका। PDF निर्यात के लिए अनुमति दें।'},
  'salary.detail_empty':{vi:'Nhập thông tin lương để tính tự động',en:'Enter salary info to auto-calculate',ko:'급여 정보를 입력하면 자동 계산',ja:'給与情報を入力すると自動計算',zh:'输入工资信息以自动计算',my:'အလိုအလျောက် တွက်ရန် လစာအချက်အလက် ထည့်ပါ',th:'กรอกข้อมูลเงินเดือนเพื่อคำนวณอัตโนมัติ',id:'Masukkan info gaji untuk hitung otomatis',ph:'Ilagay ang impormasyon ng sahod para auto-compute',ne:'स्वत: गणनाका लागि तलब जानकारी',hi:'स्वत: गणना के लिए वेतन जानकारी डालें'},
  'salary.detail_hour':{vi:'{h} thực tế · {r} · Thực nhận ≈ {n}',en:'{h} actual · {r} · Net ≈ {n}',ko:'{h} 실제 · {r} · 실수령 ≈ {n}',ja:'{h} 実績 · {r} · 手取り ≈ {n}',zh:'{h} 实际 · {r} · 实收 ≈ {n}',my:'{h} အမှန် · {r} · လက်ခံ ≈ {n}',th:'{h} จริง · {r} · สุทธิ ≈ {n}',id:'{h} aktual · {r} · Bersih ≈ {n}',ph:'{h} aktwal · {r} · Net ≈ {n}',ne:'{h} वास्तविक · {r} · निखुर ≈ {n}',hi:'{h} वास्तविक · {r} · नेट ≈ {n}'},
  'salary.detail_day':{vi:'{d} ngày đã tan ca · {r} · Thực nhận ≈ {n}',en:'{d} completed days · {r} · Net ≈ {n}',ko:'{d}일 완료 · {r} · 실수령 ≈ {n}',ja:'{d}日完了 · {r} · 手取り ≈ {n}',zh:'{d} 天已完成 · {r} · 实收 ≈ {n}',my:'{d} ရက် ပြီးပြီး · {r} · လက်ခံ ≈ {n}',th:'{d} วันเสร็จ · {r} · สุทธิ ≈ {n}',id:'{d} hari selesai · {r} · Bersih ≈ {n}',ph:'{d} araw tapos · {r} · Net ≈ {n}',ne:'{d} दिन समापन · {r} · निखुर ≈ {n}',hi:'{d} दिन पूर्ण · {r} · नेट ≈ {n}'},
  'validate.empty_name':{vi:'Vui lòng nhập họ và tên!',en:'Please enter your full name!',ko:'이름을 입력하세요!',ja:'氏名を入力してください！',zh:'请输入姓名！',my:'အမည် ထည့်ပါ။',th:'กรุณากรอกชื่อ-นามสกุล!',id:'Masukkan nama lengkap!',ph:'Ilagay ang buong pangalan!',ne:'पूरा नाम लेख्नुस्!',hi:'अपना पूरा नाम दर्ज करें!'},

  /* ── PANEL GIAO DIỆN (⭐ Thiết lập > Giao diện) ─────────────────────
     Muốn đổi nhãn "Ảnh đại diện" → 'appear.avatar'
     Muốn đổi nhãn "Màu chủ đạo" → 'appear.color'
     Muốn đổi nhãn "Ảnh nền lịch" → 'appear.bg'
     Muốn đổi nút "Chọn ảnh"     → 'appear.btn_choose'
     Muốn đổi nút "Lưu giao diện"→ 'appear.save'
     ─────────────────────────────────────────────────────────────── */
  'appear.avatar':    {vi:'Ảnh đại diện',      en:'Avatar',          ko:'아바타',    ja:'アバター',    zh:'头像',   my:'ဓာတ်ပုံ',   th:'รูปโปรไฟล์',   id:'Avatar',     ph:'Avatar',       ne:'अवतार',     hi:'अवतार'},
  'appear.avt_desc':  {vi:'Ảnh hiển thị trên trang chủ',en:'Photo shown on home',ko:'홈에 표시되는 사진',ja:'ホームに表示する写真',zh:'显示在主页的照片',my:'မူလစာမျက်နှာတွင်ပြသ',th:'รูปที่แสดงบนหน้าหลัก',id:'Foto ditampilkan di beranda',ph:'Larawan sa home',ne:'गृह पृष्ठमा देखिने फोटो',hi:'होम स्क्रीन पर दिखाई जाने वाली फ़ोटो'},
  'appear.btn_choose':{vi:'📷 Chọn ảnh',       en:'📷 Choose photo', ko:'📷 사진 선택',ja:'📷 写真を選択',zh:'📷 选择照片',my:'📷 ဓာတ်ပုံရွေး',th:'📷 เลือกรูป',  id:'📷 Pilih foto', ph:'📷 Pumili ng larawan',ne:'📷 फोटो छान्नुस्',hi:'📷 फ़ोटो चुनें'},
  'appear.color':     {vi:'Màu chủ đạo',       en:'Theme color',     ko:'테마 색상',  ja:'テーマカラー',zh:'主题颜色',my:'အရောင်',     th:'สีธีม',         id:'Warna tema',  ph:'Kulay ng tema', ne:'थिम रंग',    hi:'थीम रंग'},
  'appear.bg':        {vi:'Ảnh nền lịch',       en:'Calendar background',ko:'달력 배경',ja:'カレンダー背景',zh:'日历背景',my:'ပြက္ခဒိန်နောက်ခံ',th:'พื้นหลังปฏิทิน',id:'Latar kalender',ph:'Background ng kalendaryo',ne:'क्यालेन्डर पृष्ठभूमि',hi:'कैलेंडर पृष्ठभूमि'},
  'appear.btn_bg':    {vi:'📷 Chọn ảnh từ máy', en:'📷 Choose from device',ko:'📷 기기에서 선택',ja:'📷 端末から選択',zh:'📷 从设备选择',my:'📷 ထည့်သွင်း',th:'📷 เลือกจากอุปกรณ์',id:'📷 Pilih dari perangkat',ph:'📷 Pumili mula sa device',ne:'📷 उपकरणबाट छान्नुस्',hi:'📷 डिवाइस से चुनें'},
  'appear.btn_clear': {vi:'✕ Xóa ảnh',         en:'✕ Remove',        ko:'✕ 제거',    ja:'✕ 削除',      zh:'✕ 删除', my:'✕ ဖျက်',   th:'✕ ลบ',          id:'✕ Hapus',     ph:'✕ Alisin',     ne:'✕ हटाउनुस्',hi:'✕ हटाएं'},
  'appear.gradient':  {vi:'Màu nền gradient',   en:'Gradient presets',ko:'그라데이션', ja:'グラデーション',zh:'渐变预设',my:'Gradient',  th:'พื้นหลัง Gradient',id:'Preset Gradient',ph:'Mga Gradient preset',ne:'Gradient प्रिसेट',hi:'Gradient प्रीसेट'},
  'appear.no_bg':     {vi:'Chưa có ảnh nền',    en:'No background image',ko:'배경 이미지 없음',ja:'背景画像なし',zh:'无背景图片',my:'နောက်ခံပုံမရှိ',th:'ไม่มีภาพพื้นหลัง',id:'Tidak ada gambar latar',ph:'Walang background',ne:'पृष्ठभूमि छैन',hi:'कोई पृष्ठभूमि नहीं'},
  'appear.save':      {vi:'✓ Lưu giao diện',    en:'✓ Save appearance',ko:'✓ 저장',    ja:'✓ 外観を保存', zh:'✓ 保存外观',my:'✓ သိမ်း',   th:'✓ บันทึกธีม',   id:'✓ Simpan tampilan',ph:'✓ I-save ang hitsura',ne:'✓ थिम सुरक्षित',hi:'✓ थीम सहेजें'},

  /* ── PANEL THIẾT LẬP (📝 Thiết lập > Thiết lập thông tin) ───────────
     Muốn đổi nhãn "Họ và tên"     → 'setup.name'
     Muốn đổi nhãn "Chức vụ"       → 'setup.job'
     Muốn đổi nhãn "Công ty"       → 'setup.company'
     Muốn đổi nhãn "Số ca làm việc"→ 'setup.shifts'
     Muốn đổi nút "Lưu thông tin"  → 'setup.save'
     Muốn đổi nhãn "Nghỉ giữa giờ"→ 'setup.break'
     ─────────────────────────────────────────────────────────────── */
  'setup.name':        {vi:'Họ và tên',      en:'Full Name',      ko:'성명',    ja:'氏名',    zh:'姓名',   my:'အမည်',   th:'ชื่อ-นามสกุล',id:'Nama Lengkap',ph:'Buong Pangalan',ne:'पूरा नाम',hi:'पूरा नाम'},
  'setup.job':         {vi:'Chức vụ',        en:'Job Title',      ko:'직책',    ja:'職種',    zh:'职位',   my:'ရာထူး',  th:'ตำแหน่งงาน',  id:'Jabatan',    ph:'Trabaho',      ne:'पद',        hi:'पद'},
  'setup.company':     {vi:'Công ty',        en:'Company',        ko:'회사',    ja:'会社名',  zh:'公司',   my:'ကုမ္ပဏီ',th:'บริษัท',       id:'Perusahaan', ph:'Kumpanya',     ne:'कम्पनी',    hi:'कंपनी'},
  'setup.shifts':      {vi:'Số ca làm việc', en:'Number of shifts',ko:'교대 수',ja:'シフト数',zh:'班次数量',my:'Shift', th:'จำนวนกะ',     id:'Jumlah shift',ph:'Bilang ng shift',ne:'सिफ्ट संख्या',hi:'शिफ्ट की संख्या'},
  'setup.hours':       {vi:'Số giờ / ca',    en:'Hours / shift',  ko:'교대당 시간',ja:'時間/シフト',zh:'每班时长',my:'နာရီ',th:'ชั่วโมง/กะ', id:'Jam/shift',  ph:'Oras/shift',   ne:'घण्टा/सिफ्ट',hi:'घंटे/शिफ्ट'},
  'setup.save':        {vi:'✓ Lưu thông tin',en:'✓ Save Info',    ko:'✓ 저장',  ja:'✓ 保存',  zh:'✓ 保存信息',my:'✓ သိမ်း',th:'✓ บันทึกข้อมูล',id:'✓ Simpan info',ph:'✓ I-save',   ne:'✓ सुरक्षित',hi:'✓ जानकारी सहेजें'},
  'setup.weeks':       {vi:'Số tuần một vòng',en:'Weeks per rotation',ko:'순환 주 수',ja:'ローテーション週数',zh:'轮班周数',my:'အပတ်လည်ပတ်',th:'สัปดาห์/รอบ',id:'Minggu/siklus',ph:'Linggo/siklo',ne:'हप्ता/चक्र',hi:'सप्ताह/चक्र'},
  'setup.break_q':     {vi:'Có nghỉ giữa giờ không?',en:'Any break time?',ko:'중간 휴식 있나요?',ja:'休憩時間ありますか？',zh:'有中途休息吗？',my:'အကြားနားချိန်ရှိပါသလား?',th:'มีเวลาพักไหม?',id:'Ada waktu istirahat?',ph:'May break?',ne:'बिश्राम छ?',hi:'कोई ब्रेक है?'},
  'setup.break_no':    {vi:'Không',   en:'No',    ko:'아니오', ja:'なし', zh:'没有', my:'မရှိ', th:'ไม่',  id:'Tidak', ph:'Hindi', ne:'छैन',  hi:'नहीं'},
  'setup.break_yes':   {vi:'Có',      en:'Yes',   ko:'예',     ja:'あり', zh:'有',   my:'ရှိ',  th:'ใช่',  id:'Ya',    ph:'Oo',    ne:'छ',    hi:'हाँ'},
  'setup.break_min':   {vi:'Số phút nghỉ (sẽ trừ vào giờ thực tế)',en:'Break minutes (will subtract from worked hours)',ko:'휴식 분 (실제 근무시간에서 차감)',ja:'休憩時間（実働から差し引き）',zh:'休息分钟数（从实际工时扣除）',my:'အနားချိန် (အလုပ်ချိန်မှနုတ်)',th:'นาทีพัก (หักจากชั่วโมงทำงาน)',id:'Menit istirahat (dikurangi dari jam kerja)',ph:'Minuto ng pahinga (ibabawas sa oras ng trabaho)',ne:'बिश्राम मिनेट (काम घण्टाबाट घटाइन्छ)',hi:'ब्रेक मिनट (काम के घंटों से घटाया जाएगा)'},
  /* ── JOB PHỤ (Sub Job) ────────────────────────────────────────────────
     Muốn đổi nhãn "Có job phụ không?" → 'setup.has_sub'
     Muốn đổi nhãn "Tên job phụ"       → 'setup.sub_name'
     Muốn đổi nhãn "Lương job phụ"     → 'setup.sub_salary'
     ─────────────────────────────────────────────────────────────── */
  'setup.has_sub':      {vi:'Có job phụ không?',      en:'Have a secondary job?',  ko:'부업 있나요?',     ja:'副業はありますか？', zh:'有副业吗？',    my:'အလုပ်ခွဲရှိပါသလား?', th:'มีงานเสริมไหม?',     id:'Punya pekerjaan sampingan?', ph:'May pangalawang trabaho?', ne:'दोस्रो काम छ?',       hi:'कोई दूसरी नौकरी है?'},
  'setup.sub_name':     {vi:'Tên job phụ',             en:'Sub-job name',           ko:'부업 이름',         ja:'副業名',             zh:'副业名称',      my:'အလုပ်ခွဲ အမည်',      th:'ชื่องานเสริม',        id:'Nama pekerjaan sampingan',   ph:'Pangalan ng pangalawang trabaho', ne:'दोस्रो काम नाम',   hi:'दूसरी नौकरी का नाम'},
  'setup.sub_salary':   {vi:'Lương job phụ',           en:'Sub-job salary',         ko:'부업 급여',         ja:'副業給与',           zh:'副业薪资',      my:'အလုပ်ခွဲ လစာ',       th:'รายได้งานเสริม',      id:'Gaji sampingan',             ph:'Sahod ng pangalawang trabaho',   ne:'दोस्रो काम तलब',  hi:'दूसरी नौकरी का वेतन'},
  'setup.sub_total':    {vi:'Tổng thu nhập (Main + Sub)', en:'Total income (Main + Sub)', ko:'합산 수입 (주+부)',ja:'合計収入（主+副）', zh:'合计收入（主+副）', my:'စုစုပေါင်း (Main+Sub)', th:'รายได้รวม (หลัก+เสริม)', id:'Total pendapatan (Utama+Sampingan)', ph:'Kabuuang kita (Main+Sub)', ne:'कुल आय (Main+Sub)', hi:'कुल आय (Main+Sub)'},
  'job.main':           {vi:'Job chính',   en:'Main job',   ko:'주업',     ja:'本業',     zh:'主业',   my:'အဓိကအလုပ်', th:'งานหลัก',  id:'Pekerjaan utama',   ph:'Pangunahing trabaho', ne:'मुख्य काम', hi:'मुख्य नौकरी'},
  'job.sub':            {vi:'Job phụ',     en:'Sub job',    ko:'부업',     ja:'副業',     zh:'副业',   my:'အလုပ်ခွဲ',  th:'งานเสริม', id:'Pekerjaan sampingan',ph:'Pangalawang trabaho', ne:'दोस्रो काम', hi:'दूसरी नौकरी'},
  'export.all':         {vi:'Xuất tất cả',  en:'Export ALL',  ko:'전체 내보내기',ja:'全て出力', zh:'导出全部', my:'အားလုံး',  th:'ส่งออกทั้งหมด',id:'Ekspor SEMUA',  ph:'I-export Lahat',  ne:'सबै निर्यात', hi:'सभी निर्यात'},
  'export.main':        {vi:'Xuất job chính',en:'Export MAIN',ko:'주업만 내보내기',ja:'本業のみ出力',zh:'仅导出主业',my:'အဓိကသာ',th:'ส่งออกงานหลัก',id:'Ekspor UTAMA',ph:'I-export MAIN',ne:'मुख्य निर्यात',hi:'मुख्य निर्यात'},
  'export.sub':         {vi:'Xuất job phụ', en:'Export SUB',  ko:'부업만 내보내기',ja:'副業のみ出力',zh:'仅导出副业',my:'အလုပ်ခွဲသာ',th:'ส่งออกงานเสริม',id:'Ekspor SAMPINGAN',ph:'I-export SUB',ne:'दोस्रो निर्यात',hi:'दूसरी निर्यात'},

  'setup.which_shift': {vi:'Tuần này bạn làm ca nào?',en:'Which shift this week?',ko:'이번 주 어느 교대?',ja:'今週はどのシフト？',zh:'本周哪个班次？',my:'ဒီအပတ် ဘယ်ဆင်း?',th:'สัปดาห์นี้กะอะไร?',id:'Shift minggu ini?',ph:'Anong shift ngayong linggo?',ne:'यो हप्ता कुन सिफ्ट?',hi:'इस सप्ताह कौन सी शिफ्ट?'},

  /* ── XÁC NHẬN XÓA DỮ LIỆU ───────────────────────────────────────────
     Muốn đổi tiêu đề popup xóa → 'delete.title'
     Muốn đổi mô tả xóa         → 'delete.desc'
     Muốn đổi nhãn setting       → 'delete.setting_name' / 'delete.setting_sub'
     ─────────────────────────────────────────────────────────────── */
  /* ── FALLBACK TÊN / CHỨC VỤ NGƯỜI DÙNG ─────────────────────────────
     Muốn đổi tên mặc định khi chưa nhập → 'user.default_name'
     Muốn đổi chức vụ mặc định          → 'user.default_job'
     ─────────────────────────────────────────────────────────────── */
  'user.default_name': {vi:'Người dùng',en:'User',ko:'사용자',ja:'ユーザー',zh:'用户',my:'သုံးစွဲသူ',th:'ผู้ใช้',id:'Pengguna',ph:'Gumagamit',ne:'प्रयोगकर्ता',hi:'उपयोगकर्ता'},
  'user.default_job':  {vi:'Nhân viên',  en:'Employee',ko:'직원',ja:'社員',zh:'员工',my:'ဝန်ထမ်း',th:'พนักงาน',id:'Karyawan',ph:'Empleyado',ne:'कर्मचारी',hi:'कर्मचारी'},

  'delete.title':       {vi:'Xóa toàn bộ dữ liệu',en:'Delete All Data',ko:'모든 데이터 삭제',ja:'全データ削除',zh:'删除所有数据',my:'ဒေတာဖျက်',th:'ลบข้อมูลทั้งหมด',id:'Hapus Semua Data',ph:'Burahin Lahat ng Data',ne:'सबै डेटा मेटाउनुस्',hi:'सभी डेटा हटाएं'},
  'delete.subtitle':    {vi:'Không thể khôi phục',en:'Cannot be recovered',ko:'복구 불가',ja:'元に戻せません',zh:'无法恢复',my:'ပြန်မရနိုင်',th:'กู้คืนไม่ได้',id:'Tidak dapat dipulihkan',ph:'Hindi mababawi',ne:'पुनः प्राप्त हुँदैन',hi:'पुनः प्राप्त नहीं किया जा सकता'},

  /* ── POPUP CHÀO BUỔI SÁNG (splash) ──────────────────────────────────
     Muốn đổi "ngày có mặt tháng này" → 'splash.days_present'
     Muốn đổi nút "Bắt đầu ngày làm"  → 'splash.start_btn'
     ─────────────────────────────────────────────────────────────── */
  'splash.days_present':{vi:'ngày có mặt tháng này',en:'days present this month',ko:'이달 출근일',ja:'今月の出勤日数',zh:'本月出勤天数',my:'ဤလ တက်ရောက်ရက်',th:'วันมาทำงานเดือนนี้',id:'hari hadir bulan ini',ph:'araw ng pagdalo ngayong buwan',ne:'यो महिना उपस्थिति दिन',hi:'इस महीने उपस्थिति दिन'},
  'splash.start_btn':   {vi:'Bắt đầu ngày làm việc',en:'Start the workday',ko:'오늘 업무 시작',ja:'今日の業務を開始',zh:'开始今天的工作',my:'ယနေ့အလုပ်စတင်',th:'เริ่มต้นวันทำงาน',id:'Mulai hari kerja',ph:'Simulan ang araw ng trabaho',ne:'आज काम सुरु',hi:'आज का कार्यदिवस शुरू'},
};

/**
 * u(key) — Lấy chuỗi UI từ UI_STR theo ngôn ngữ hiện tại
 *
 * Dùng: u('home.in_at')     → 'Vào lúc' (tiếng Việt)
 *       u('salary.tax')     → 'ภาษีเงินได้' (tiếng Thái)
 *
 * Nếu key không tồn tại → trả về chính key (dễ debug)
 * Fallback: en → vi → key
 *
 * @param {string} key  - key trong UI_STR, vd: 'home.in_at'
 * @param {string} [subs] - object thay thế {s:'60'} cho template '{s}'
 */
function u(key, subs){
  const obj = UI_STR[key];
  if(!obj) return key;
  const L = (typeof userData!=='undefined' && userData.lang) || 'vi';
  let txt = obj[L] || obj.en || obj.vi || key;
  if(subs) Object.keys(subs).forEach(k=>{ txt=txt.replace('{'+k+'}', subs[k]); });
  return txt;
}

/* ──────────────────────────────────────────────────────────────────────
   TRAN — CHUỖI GIAO DIỆN CHÍNH (menu, nút lớn, onboarding, cài đặt)
   ──────────────────────────────────────────────────────────────────── */
const TRAN = {
  vi:{
    appName:'Chấm Công Pro', appSub:'Chấm công thông minh · Lương đúng luật',
    vaoCA:'VÀO CA', hetCA:'HẾT CA',
    batDauCa:'Nhấn để bắt đầu ca', ketThucCa:'Nhấn khi kết thúc ca',
    chuaChamCong:'Chưa chấm công',
    gioLam:'Giờ làm tháng này',
    binhThuong:'Bình thường', chamChi:'Chăm chỉ ⚡', quaSuc:'Quá sức 🔥',
    coMat:'Có mặt', vang:'Vắng', nghiPhep:'Nghỉ phép', tangCa:'Tăng ca',
    chucNang:'Chức năng',
    lich:'Lịch', thietLap:'Thiết lập', giaoDien:'Giao diện', caiDat:'Cài đặt',
    luong:'Lương', xuatExcel:'Xuất Excel', thongBao:'Thông báo', huongDan:'Hướng dẫn',
    flGPS:'GPS', flUtil:'Trò chơi', flTax:'Thuế & BH',
    taxTitle:'🏛️ Quy định Thuế & Bảo hiểm',
    utilTitle:'🎮 Trò chơi', utilEmptyTitle:'Chọn game để chơi',
    utilEmptyDesc:'Các trò chơi đã được thêm vào khu vực này.',
    taxSecIns:'🛡️ BẢO HIỂM XÃ HỘI / AN SINH',
    taxSecDeduct:'💰 GIẢM TRỪ GIA CẢNH / MIỄN THUẾ',
    taxSecBrackets:'📊 BIỂU THUẾ THU NHẬP CÁ NHÂN (LŨY TIẾN)',
    taxSecPayroll:'⏱️ HỆ SỐ LƯƠNG THEO LUẬT',
    taxBandNo:'Bậc', taxBandIncome:'Thu nhập chịu thuế', taxBandRate:'Thuế suất',
    taxInsRate:'Tỷ lệ đóng', taxInsCap:'Trần lương/tháng', taxInsMax:'Đóng tối đa/tháng',
    taxInsFlat:'Tỷ lệ phẳng', taxSS:'Social Security', taxSsCap:'Cap SS/năm', taxMedicare:'Medicare',
    taxPersonal:'Bản thân', taxDependent:'Người phụ thuộc', taxStandard:'Khấu trừ cơ bản',
    taxExempt:'0% (miễn)', taxAbove:'Trên',
    taxInsDeductY:'✓ BH được trừ trước khi tính thuế',
    taxInsDeductN:'⚠️ BH không trừ khỏi thu nhập chịu thuế',
    taxLocalTax:'Thuế địa phương', taxResidentTax:'Thuế cư trú',
    taxCalcBy:'Tính theo', taxPeriodAnnual:'năm (quy về tháng)', taxPeriodMonthly:'tháng',
    taxPerYear:'năm', taxPerMonth:'tháng',
    taxNote:'Số liệu tham khảo theo luật 2025. Thuế/BH thực tế tùy chính sách công ty, tình trạng gia đình và các khoản giảm trừ riêng.',
    luongUocTinh:'💼 Lương ước tính tháng này',
    lichChamCong:'Lịch chấm công',
    chipCM:'✓ Có mặt', chipV:'✕ Vắng', chipNP:'☀ Nghỉ phép', chipLL:'★ Làm lễ',
    navHome:'Trang chủ', navLich:'Lịch', navLuong:'Lương', navCaiDat:'Cài đặt',
    // Settings screen
    settingsTitle:'Cài đặt',
    siLang:'Ngôn ngữ', siCountry:'Quốc gia làm việc',
    siSetup:'Thiết lập thông tin', siSetupSub:'Tên, chức vụ, ca làm việc',
    siNotif:'Cài đặt thông báo', siNotifSub:'Nhắc giờ làm, tự động chấm công',
    siAppear:'Chỉnh sửa giao diện', siAppearSub:'Màu sắc, ảnh đại diện, ảnh nền',
    siAbout:'Thông tin về app', siAboutSub:'Phiên bản 2.2.0',
    siHelp:'Hướng dẫn sử dụng', siHelpSub:'Cách dùng app hiệu quả',
    siDelete:'Xóa toàn bộ dữ liệu', siDeleteSub:'Không thể khôi phục',
    // Panels
    panelAppear:'⭐ Chỉnh sửa giao diện', panelNotif:'🔔 Cài đặt thông báo',
    panelSalary:'💰 Bảng lương', panelExcel:'📊 Xuất Excel',
    panelSetup:'📝 Thiết lập thông tin', panelHelp:'📖 Hướng dẫn sử dụng',
    panelAbout:'ℹ️ Về ứng dụng', panelLang:'🌐 Chọn ngôn ngữ',
    panelCountry:'🗺️ Quốc gia làm việc',
    closeBtn:'Đóng',
    // Onboarding
    obLang:'Chào mừng! 👋\nChọn ngôn ngữ', obLangSub:'Chọn ngôn ngữ và quốc gia bạn đang làm việc.',
    obUser:'Thông tin của bạn 👤', obUserSub:'Nhập thông tin cá nhân để cá nhân hóa app.',
    obShift:'Lịch làm việc ⏰', obShiftSub:'Bạn làm mấy ca? Mỗi ca mấy tiếng?',
    obTime:'Giờ giấc ca làm 🕐', obTimeSub:'Thiết lập giờ vào và hết ca cho từng ca.',
    obNext:'Tiếp theo →', obBack:'←', obStart:'Bắt đầu dùng app ✓',
    obName:'Họ và tên', obNameP:'Nguyễn Văn A',
    obJob:'Chức vụ / Công việc', obJobP:'Nhân viên / Công nhân...',
    obCo:'Tên công ty', obCoP:'Công ty ABC',
    obShiftNum:'Số ca làm việc', obHours:'Số giờ mỗi ca', obHoursCustom:'Hoặc nhập:', obHoursUnit:'giờ/ca',
    obWeeks:'Số tuần một vòng',
    obShiftCountry:'Quốc gia làm việc',
    // Days and months
    days:['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'],
    daysShort:['CN','T2','T3','T4','T5','T6','T7'],
    months:['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'],
    // Salary panel
    salaryContract:'Lương hợp đồng / tháng', salaryDays:'Ngày công chuẩn / tháng',
    salaryEst:'Lương ước tính tháng này', salaryNet:'Thực nhận ước tính',
    salarySave:'✓ Lưu thông tin lương',
    // Day panel
    dpStatus:'TRẠNG THÁI', dpActual:'GIỜ THỰC TẾ', dpNote:'GHI CHÚ',
    dpReset:'Đặt lại theo ca', dpCancel:'Hủy bỏ', dpSave:'Lưu lại',
    dpTotalHours:'Tổng:', dpOT:'Tăng ca:',
    dpInTime:'Giờ vào', dpOutTime:'Giờ ra',
    dpNoteP:'Thêm ghi chú cho ngày này...',
    // Status labels
    stCM:'Có mặt', stCMSub:'Đi làm đúng ca',
    stNP:'Nghỉ phép', stNPSub:'Có hưởng lương',
    stV:'Vắng mặt', stVSub:'Không phép — trừ lương',
    stLL:'Làm ngày lễ', stLLSub:'Tính theo luật',
    // Splash
    spPresent:'ngày có mặt tháng này', spStart:'Bắt đầu ngày làm việc',
    // Reset
    resetTitle:'Xóa toàn bộ dữ liệu?',
    resetDesc:'Tất cả dữ liệu sẽ bị xóa vĩnh viễn. Không thể khôi phục!',
    resetCancel:'Hủy bỏ', resetOk:'🗑 Xóa hết',
    // Export
    exportPreview:'Xem trước dữ liệu xuất ra:',
    exportBtn:'📊 Xuất file Excel (.csv)',
    // Notif panel
    n1Name:'Nhắc trước giờ làm 30 phút', n1Desc:'Thông báo nhắc nhở trước ca bắt đầu',
    n2Name:'Xác nhận giờ nghỉ sau 30 phút', n2Desc:'Hỏi giờ tan ca thực tế sau khi hết ca',
    n3Name:'Chấm công tự động (GPS)', n3Desc:'Tự động ghi nhận khi vào/ra khu vực công ty',
    n4Name:'Nhắc cuối tuần tổng kết', n4Desc:'Xem tổng hợp tuần vào thứ 6 hàng tuần',
    calEmpty:'Chưa có dữ liệu tháng này', noData:'Chưa có dữ liệu',
    salaryDetail:'Nhập thông tin lương để tính tự động',
  },
  en:{
    appName:'Work Tracker Pro', appSub:'Smart attendance · Legal payroll',
    vaoCA:'CLOCK IN', hetCA:'CLOCK OUT',
    batDauCa:'Tap to start shift', ketThucCa:'Tap when shift ends',
    chuaChamCong:'Not checked in',
    gioLam:'Work hours this month',
    binhThuong:'Normal', chamChi:'Diligent ⚡', quaSuc:'Overworked 🔥',
    coMat:'Present', vang:'Absent', nghiPhep:'Leave', tangCa:'Overtime',
    chucNang:'Functions',
    lich:'Calendar', thietLap:'Setup', giaoDien:'Appearance', caiDat:'Settings',
    luong:'Salary', xuatExcel:'Export Excel', thongBao:'Notifications', huongDan:'Help',
    flGPS:'GPS', flUtil:'Games', flTax:'Tax & Ins.',
    taxTitle:'🏛️ Tax & Insurance Guide',
    utilTitle:'🎮 Games', utilEmptyTitle:'Choose a game',
    utilEmptyDesc:'Games have been added to this area.',
    taxSecIns:'🛡️ SOCIAL INSURANCE / SOCIAL SECURITY',
    taxSecDeduct:'💰 PERSONAL ALLOWANCE / DEDUCTIONS',
    taxSecBrackets:'📊 INCOME TAX BRACKETS (PROGRESSIVE)',
    taxSecPayroll:'⏱️ STATUTORY PAY FACTORS',
    taxBandNo:'Band', taxBandIncome:'Taxable income', taxBandRate:'Tax rate',
    taxInsRate:'Contribution rate', taxInsCap:'Monthly salary cap', taxInsMax:'Max contribution/month',
    taxInsFlat:'Flat rate', taxSS:'Social Security', taxSsCap:'SS cap/year', taxMedicare:'Medicare',
    taxPersonal:'Personal', taxDependent:'Dependents', taxStandard:'Standard deduction',
    taxExempt:'0% (exempt)', taxAbove:'Over',
    taxInsDeductY:'✓ Insurance deductible from taxable income',
    taxInsDeductN:'⚠️ Insurance NOT deductible from taxable income',
    taxLocalTax:'Local tax', taxResidentTax:'Resident tax',
    taxCalcBy:'Based on', taxPeriodAnnual:'year (shown monthly)', taxPeriodMonthly:'month',
    taxPerYear:'year', taxPerMonth:'month',
    taxNote:'Reference data per 2025 law. Actual tax/insurance depends on employer policy, family status and individual deductions.',
    luongUocTinh:'💼 Estimated salary this month',
    lichChamCong:'Attendance Calendar',
    chipCM:'✓ Present', chipV:'✕ Absent', chipNP:'☀ Leave', chipLL:'★ Holiday work',
    navHome:'Home', navLich:'Calendar', navLuong:'Salary', navCaiDat:'Settings',
    settingsTitle:'Settings',
    siLang:'Language', siCountry:'Working country',
    siSetup:'Setup Info', siSetupSub:'Name, job, work shifts',
    siNotif:'Notifications', siNotifSub:'Work reminders, auto check-in',
    siAppear:'Appearance', siAppearSub:'Colors, avatar, background',
    siAbout:'About App', siAboutSub:'Version 2.2.0',
    siHelp:'User Guide', siHelpSub:'How to use the app effectively',
    siDelete:'Delete All Data', siDeleteSub:'Cannot be recovered',
    panelAppear:'⭐ Appearance', panelNotif:'🔔 Notifications',
    panelSalary:'💰 Salary', panelExcel:'📊 Export Excel',
    panelSetup:'📝 Setup Info', panelHelp:'📖 User Guide',
    panelAbout:'ℹ️ About App', panelLang:'🌐 Language',
    panelCountry:'🗺️ Working Country',
    closeBtn:'Close',
    obLang:'Welcome! 👋\nChoose Language', obLangSub:'Select your display language and working country.',
    obUser:'Your Info 👤', obUserSub:'Enter your info to personalize the app.',
    obShift:'Work Schedule ⏰', obShiftSub:'How many shifts? Hours per shift?',
    obTime:'Shift Hours 🕐', obTimeSub:'Set check-in and check-out times for each shift.',
    obNext:'Next →', obBack:'←', obStart:'Start Using App ✓',
    obName:'Full Name', obNameP:'John Smith',
    obJob:'Job Title', obJobP:'Employee / Worker...',
    obCo:'Company', obCoP:'Company ABC',
    obShiftNum:'Number of shifts', obHours:'Hours per shift', obHoursCustom:'Or enter:', obHoursUnit:'h/shift',
    obWeeks:'Weeks per cycle',
    obShiftCountry:'Working country',
    days:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    daysShort:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    months:['January','February','March','April','May','June','July','August','September','October','November','December'],
    salaryContract:'Contract salary / month', salaryDays:'Standard working days / month',
    salaryEst:'Estimated salary this month', salaryNet:'Estimated take-home pay',
    salarySave:'✓ Save salary info',
    dpStatus:'STATUS', dpActual:'ACTUAL HOURS', dpNote:'NOTE',
    dpReset:'Reset to shift', dpCancel:'Cancel', dpSave:'Save',
    dpTotalHours:'Total:', dpOT:'Overtime:',
    dpInTime:'Check-in', dpOutTime:'Check-out',
    dpNoteP:'Add a note for this day...',
    stCM:'Present', stCMSub:'Worked the full shift',
    stNP:'Leave', stNPSub:'Paid leave',
    stV:'Absent', stVSub:'Unpaid absence',
    stLL:'Holiday work', stLLSub:'By law',
    spPresent:'days present this month', spStart:'Start the workday',
    resetTitle:'Delete all data?',
    resetDesc:'All data will be permanently deleted. Cannot be recovered!',
    resetCancel:'Cancel', resetOk:'🗑 Delete All',
    exportPreview:'Preview data to export:',
    exportBtn:'📊 Export Excel (.csv)',
    n1Name:'Remind 30min before shift', n1Desc:'Notification before shift starts',
    n2Name:'Confirm break after 30min', n2Desc:'Ask for actual clock-out time',
    n3Name:'Auto check-in (GPS)', n3Desc:'Auto record when entering/leaving workplace',
    n4Name:'Weekly summary reminder', n4Desc:'View weekly summary every Friday',
    calEmpty:'No data for this month', noData:'No data',
    salaryDetail:'Enter salary info to auto-calculate',
  },
  ko:{
    appName:'근태관리 Pro', appSub:'스마트 출퇴근 · 법정 급여 계산',
    vaoCA:'출근', hetCA:'퇴근',
    batDauCa:'탭하여 출근 시작', ketThucCa:'퇴근 시 탭하세요',
    chuaChamCong:'미출근',
    gioLam:'이달 근무시간',
    binhThuong:'정상', chamChi:'열심히 ⚡', quaSuc:'과로 🔥',
    coMat:'출근', vang:'결근', nghiPhep:'연차', tangCa:'초과근무',
    chucNang:'기능',
    lich:'달력', thietLap:'설정', giaoDien:'테마', caiDat:'환경설정',
    luong:'급여', xuatExcel:'Excel 내보내기', thongBao:'알림', huongDan:'도움말',
    flGPS:'GPS', flUtil:'게임', flTax:'세금/보험',
    taxTitle:'🏛️ 세금 & 보험 안내',
    utilTitle:'🎮 게임', utilEmptyTitle:'게임 선택',
    utilEmptyDesc:'이 영역에 게임이 추가되었습니다.',
    taxSecIns:'🛡️ 사회보험 / 사회보장',
    taxSecDeduct:'💰 소득공제 / 인적공제',
    taxSecBrackets:'📊 소득세 구간 (누진세율)',
    taxSecPayroll:'⏱️ 법정 급여 계수',
    taxBandNo:'구간', taxBandIncome:'과세 소득', taxBandRate:'세율',
    taxInsRate:'납부 비율', taxInsCap:'월 기준소득 상한', taxInsMax:'월 최대 납부액',
    taxInsFlat:'정률', taxSS:'Social Security', taxSsCap:'SS 연간 상한', taxMedicare:'메디케어',
    taxPersonal:'본인', taxDependent:'부양가족', taxStandard:'기본공제',
    taxExempt:'0% (면세)', taxAbove:'초과',
    taxInsDeductY:'✓ 보험료 과세소득 공제 가능',
    taxInsDeductN:'⚠️ 보험료 과세소득 공제 불가',
    taxLocalTax:'지방소득세', taxResidentTax:'주민세',
    taxCalcBy:'기준', taxPeriodAnnual:'연간 (월 환산)', taxPeriodMonthly:'월',
    taxPerYear:'년', taxPerMonth:'월',
    taxNote:'2025년 기준 참고 데이터입니다. 실제 세금/보험은 회사 정책, 가족 상황에 따라 다를 수 있습니다.',
    luongUocTinh:'💼 이달 예상 급여',
    lichChamCong:'근태 달력',
    chipCM:'✓ 출근', chipV:'✕ 결근', chipNP:'☀ 연차', chipLL:'★ 휴일근무',
    navHome:'홈', navLich:'달력', navLuong:'급여', navCaiDat:'설정',
    settingsTitle:'설정',
    siLang:'언어', siCountry:'근무 국가',
    siSetup:'정보 설정', siSetupSub:'이름, 직책, 교대근무',
    siNotif:'알림 설정', siNotifSub:'출근 알림, 자동 체크인',
    siAppear:'화면 꾸미기', siAppearSub:'색상, 아바타, 배경',
    siAbout:'앱 정보', siAboutSub:'버전 2.2.0',
    siHelp:'사용 가이드', siHelpSub:'앱을 효과적으로 사용하는 방법',
    siDelete:'모든 데이터 삭제', siDeleteSub:'복구 불가',
    panelAppear:'⭐ 화면 꾸미기', panelNotif:'🔔 알림 설정',
    panelSalary:'💰 급여 계산', panelExcel:'📊 Excel 내보내기',
    panelSetup:'📝 정보 설정', panelHelp:'📖 사용 가이드',
    panelAbout:'ℹ️ 앱 정보', panelLang:'🌐 언어 선택',
    panelCountry:'🗺️ 근무 국가',
    closeBtn:'닫기',
    obLang:'환영합니다! 👋\n언어 선택', obLangSub:'표시 언어와 근무 국가를 선택하세요.',
    obUser:'내 정보 👤', obUserSub:'앱 개인화를 위해 정보를 입력하세요.',
    obShift:'근무 일정 ⏰', obShiftSub:'몇 교대 근무? 한 교대당 시간은?',
    obTime:'교대 시간 🕐', obTimeSub:'각 교대의 출퇴근 시간을 설정하세요.',
    obNext:'다음 →', obBack:'←', obStart:'앱 사용 시작 ✓',
    obName:'성명', obNameP:'홍길동',
    obJob:'직책', obJobP:'직원 / 근로자...',
    obCo:'회사명', obCoP:'ABC 회사',
    obShiftNum:'교대 수', obHours:'교대당 시간', obHoursCustom:'또는 입력:', obHoursUnit:'시간/교대',
    obWeeks:'주기당 주 수',
    obShiftCountry:'근무 국가',
    days:['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
    daysShort:['일','월','화','수','목','금','토'],
    months:['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    salaryContract:'계약 급여 / 월', salaryDays:'월 기준 근무일수',
    salaryEst:'이달 예상 급여', salaryNet:'예상 실수령액',
    salarySave:'✓ 급여 정보 저장',
    dpStatus:'상태', dpActual:'실제 시간', dpNote:'메모',
    dpReset:'교대로 초기화', dpCancel:'취소', dpSave:'저장',
    dpTotalHours:'합계:', dpOT:'초과근무:',
    dpInTime:'출근 시간', dpOutTime:'퇴근 시간',
    dpNoteP:'이날의 메모를 추가하세요...',
    stCM:'출근', stCMSub:'정상 출근',
    stNP:'연차', stNPSub:'유급 휴가',
    stV:'결근', stVSub:'무단 결근',
    stLL:'휴일 근무', stLLSub:'법적 기준 적용',
    spPresent:'이달 출근일', spStart:'오늘 업무 시작',
    resetTitle:'모든 데이터를 삭제할까요?',
    resetDesc:'모든 데이터가 영구 삭제됩니다. 복구할 수 없습니다!',
    resetCancel:'취소', resetOk:'🗑 모두 삭제',
    exportPreview:'내보낼 데이터 미리보기:',
    exportBtn:'📊 Excel 파일 내보내기 (.csv)',
    n1Name:'출근 30분 전 알림', n1Desc:'교대 시작 전 알림',
    n2Name:'30분 후 퇴근 확인', n2Desc:'실제 퇴근 시간 확인',
    n3Name:'자동 체크인 (GPS)', n3Desc:'회사 구역 진입/이탈 시 자동 기록',
    n4Name:'주간 요약 알림', n4Desc:'매주 금요일 주간 요약 보기',
    calEmpty:'이달 데이터 없음', noData:'데이터 없음',
    salaryDetail:'급여 정보를 입력하면 자동 계산됩니다',
  },
  ja:{
    appName:'勤怠管理 Pro', appSub:'スマート出退勤 · 法定給与計算',
    vaoCA:'出勤', hetCA:'退勤',
    batDauCa:'タップして出勤', ketThucCa:'退勤時にタップ',
    chuaChamCong:'未打刻',
    gioLam:'今月の勤務時間',
    binhThuong:'通常', chamChi:'勤勉 ⚡', quaSuc:'過労 🔥',
    coMat:'出勤', vang:'欠勤', nghiPhep:'有給', tangCa:'残業',
    chucNang:'機能',
    lich:'カレンダー', thietLap:'設定', giaoDien:'外観', caiDat:'設定',
    luong:'給与', xuatExcel:'Excel出力', thongBao:'通知', huongDan:'ヘルプ',
    flGPS:'GPS', flUtil:'ゲーム', flTax:'税金・保険',
    taxTitle:'🏛️ 税金・保険ガイド',
    utilTitle:'🎮 ゲーム', utilEmptyTitle:'ゲームを選択',
    utilEmptyDesc:'このエリアにゲームが追加されました。',
    taxSecIns:'🛡️ 社会保険',
    taxSecDeduct:'💰 所得控除・人的控除',
    taxSecBrackets:'📊 所得税率表（累進課税）',
    taxSecPayroll:'⏱️ 法定給与係数',
    taxBandNo:'区分', taxBandIncome:'課税所得', taxBandRate:'税率',
    taxInsRate:'保険料率', taxInsCap:'月額上限（給与）', taxInsMax:'月最大額',
    taxInsFlat:'一律', taxSS:'Social Security', taxSsCap:'SS年間上限', taxMedicare:'メディケア',
    taxPersonal:'本人', taxDependent:'扶養家族', taxStandard:'基礎控除',
    taxExempt:'0%（非課税）', taxAbove:'超え',
    taxInsDeductY:'✓ 保険料は課税所得から控除可能',
    taxInsDeductN:'⚠️ 保険料は課税所得から控除不可',
    taxLocalTax:'住民税', taxResidentTax:'地方税',
    taxCalcBy:'計算基準', taxPeriodAnnual:'年間（月換算）', taxPeriodMonthly:'月',
    taxPerYear:'年', taxPerMonth:'月',
    taxNote:'2025年法令に基づく参考値です。実際の税額・保険料は会社方針・家族状況により異なります。',
    luongUocTinh:'💼 今月の給与見込み',
    lichChamCong:'勤怠カレンダー',
    chipCM:'✓ 出勤', chipV:'✕ 欠勤', chipNP:'☀ 有給', chipLL:'★ 休日出勤',
    navHome:'ホーム', navLich:'カレンダー', navLuong:'給与', navCaiDat:'設定',
    settingsTitle:'設定',
    siLang:'言語', siCountry:'勤務国',
    siSetup:'情報設定', siSetupSub:'氏名、職種、シフト',
    siNotif:'通知設定', siNotifSub:'出勤リマインダー、自動打刻',
    siAppear:'外観設定', siAppearSub:'色、アバター、背景',
    siAbout:'アプリ情報', siAboutSub:'バージョン 2.2.0',
    siHelp:'使用ガイド', siHelpSub:'アプリの効果的な使い方',
    siDelete:'全データ削除', siDeleteSub:'元に戻せません',
    panelAppear:'⭐ 外観設定', panelNotif:'🔔 通知設定',
    panelSalary:'💰 給与計算', panelExcel:'📊 Excel出力',
    panelSetup:'📝 情報設定', panelHelp:'📖 使用ガイド',
    panelAbout:'ℹ️ アプリ情報', panelLang:'🌐 言語選択',
    panelCountry:'🗺️ 勤務国',
    closeBtn:'閉じる',
    obLang:'ようこそ！ 👋\n言語選択', obLangSub:'表示言語と勤務国を選択してください。',
    obUser:'あなたの情報 👤', obUserSub:'アプリをパーソナライズするために情報を入力してください。',
    obShift:'勤務スケジュール ⏰', obShiftSub:'シフト数は？1シフトの時間は？',
    obTime:'シフト時間 🕐', obTimeSub:'各シフトの出退勤時間を設定してください。',
    obNext:'次へ →', obBack:'←', obStart:'アプリを開始 ✓',
    obName:'氏名', obNameP:'山田太郎',
    obJob:'職種', obJobP:'社員 / 作業員...',
    obCo:'会社名', obCoP:'ABC株式会社',
    obShiftNum:'シフト数', obHours:'1シフトの時間', obHoursCustom:'または入力:', obHoursUnit:'時間/シフト',
    obWeeks:'サイクル週数',
    obShiftCountry:'勤務国',
    days:['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
    daysShort:['日','月','火','水','木','金','土'],
    months:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    salaryContract:'契約給与 / 月', salaryDays:'月間基準勤務日数',
    salaryEst:'今月の給与見込み', salaryNet:'手取り見込み',
    salarySave:'✓ 給与情報を保存',
    dpStatus:'状態', dpActual:'実際の時間', dpNote:'メモ',
    dpReset:'シフトに戻す', dpCancel:'キャンセル', dpSave:'保存',
    dpTotalHours:'合計:', dpOT:'残業:',
    dpInTime:'出勤時間', dpOutTime:'退勤時間',
    dpNoteP:'この日のメモを追加...',
    stCM:'出勤', stCMSub:'通常出勤',
    stNP:'有給', stNPSub:'有給休暇',
    stV:'欠勤', stVSub:'無断欠勤',
    stLL:'休日出勤', stLLSub:'法定基準適用',
    spPresent:'今月の出勤日数', spStart:'今日の業務を開始',
    resetTitle:'全データを削除しますか？',
    resetDesc:'全データが永久に削除されます。元に戻せません！',
    resetCancel:'キャンセル', resetOk:'🗑 全て削除',
    exportPreview:'エクスポートデータのプレビュー:',
    exportBtn:'📊 Excelファイルを出力 (.csv)',
    n1Name:'30分前出勤リマインダー', n1Desc:'シフト開始前の通知',
    n2Name:'30分後退勤確認', n2Desc:'実際の退勤時間を確認',
    n3Name:'自動打刻 (GPS)', n3Desc:'職場エリア入退場時に自動記録',
    n4Name:'週次サマリーリマインダー', n4Desc:'毎週金曜日に週次サマリーを表示',
    calEmpty:'今月のデータなし', noData:'データなし',
    salaryDetail:'給与情報を入力すると自動計算されます',
  },
  zh:{
    appName:'考勤管理 Pro', appSub:'智能打卡 · 合规薪资计算',
    vaoCA:'上班打卡', hetCA:'下班打卡',
    batDauCa:'点击开始上班', ketThucCa:'下班时点击',
    chuaChamCong:'未打卡',
    gioLam:'本月工作时长',
    binhThuong:'正常', chamChi:'勤奋 ⚡', quaSuc:'过劳 🔥',
    coMat:'出勤', vang:'缺勤', nghiPhep:'请假', tangCa:'加班',
    chucNang:'功能',
    lich:'日历', thietLap:'设置', giaoDien:'外观', caiDat:'设置',
    luong:'薪资', xuatExcel:'导出Excel', thongBao:'通知', huongDan:'帮助',
    flGPS:'GPS', flUtil:'游戏', flTax:'税务/保险',
    taxTitle:'🏛️ 税务与保险指南',
    utilTitle:'🎮 游戏', utilEmptyTitle:'选择游戏',
    utilEmptyDesc:'游戏已添加到此区域。',
    taxSecIns:'🛡️ 社会保险',
    taxSecDeduct:'💰 个人免税额 / 扣除额',
    taxSecBrackets:'📊 个人所得税税率表（累进）',
    taxSecPayroll:'⏱️ 法定薪资系数',
    taxBandNo:'级', taxBandIncome:'应纳税所得额', taxBandRate:'税率',
    taxInsRate:'缴纳比例', taxInsCap:'月工资上限', taxInsMax:'月最高缴纳额',
    taxInsFlat:'固定税率', taxSS:'社会保障', taxSsCap:'SS年度上限', taxMedicare:'医疗保险',
    taxPersonal:'本人', taxDependent:'家属', taxStandard:'标准扣除额',
    taxExempt:'0%（免税）', taxAbove:'超过',
    taxInsDeductY:'✓ 社保费可从应税收入中扣除',
    taxInsDeductN:'⚠️ 社保费不可从应税收入扣除',
    taxLocalTax:'地方税', taxResidentTax:'居民税',
    taxCalcBy:'计算依据', taxPeriodAnnual:'年（换算月均）', taxPeriodMonthly:'月',
    taxPerYear:'年', taxPerMonth:'月',
    taxNote:'数据基于2025年法律，仅供参考。实际税/保险因公司政策及个人情况而异。',
    luongUocTinh:'💼 本月预计薪资',
    lichChamCong:'考勤日历',
    chipCM:'✓ 出勤', chipV:'✕ 缺勤', chipNP:'☀ 请假', chipLL:'★ 节假日工作',
    navHome:'主页', navLich:'日历', navLuong:'薪资', navCaiDat:'设置',
    settingsTitle:'设置',
    siLang:'语言', siCountry:'工作国家',
    siSetup:'信息设置', siSetupSub:'姓名、职位、班次',
    siNotif:'通知设置', siNotifSub:'上班提醒、自动打卡',
    siAppear:'外观设置', siAppearSub:'颜色、头像、背景',
    siAbout:'关于应用', siAboutSub:'版本 2.2.0',
    siHelp:'使用指南', siHelpSub:'如何高效使用应用',
    siDelete:'删除所有数据', siDeleteSub:'无法恢复',
    panelAppear:'⭐ 外观设置', panelNotif:'🔔 通知设置',
    panelSalary:'💰 薪资计算', panelExcel:'📊 导出Excel',
    panelSetup:'📝 信息设置', panelHelp:'📖 使用指南',
    panelAbout:'ℹ️ 关于应用', panelLang:'🌐 选择语言',
    panelCountry:'🗺️ 工作国家',
    closeBtn:'关闭',
    obLang:'欢迎！ 👋\n选择语言', obLangSub:'请选择显示语言和工作国家。',
    obUser:'您的信息 👤', obUserSub:'请输入个人信息以个性化应用。',
    obShift:'工作安排 ⏰', obShiftSub:'几个班次？每班多少小时？',
    obTime:'班次时间 🕐', obTimeSub:'为每个班次设置上下班时间。',
    obNext:'下一步 →', obBack:'←', obStart:'开始使用 ✓',
    obName:'姓名', obNameP:'张伟',
    obJob:'职位', obJobP:'员工 / 工人...',
    obCo:'公司名称', obCoP:'ABC公司',
    obShiftNum:'班次数量', obHours:'每班时长', obHoursCustom:'或输入:', obHoursUnit:'小时/班',
    obWeeks:'周期周数',
    obShiftCountry:'工作国家',
    days:['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
    daysShort:['日','一','二','三','四','五','六'],
    months:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    salaryContract:'合同工资 / 月', salaryDays:'月基准工作天数',
    salaryEst:'本月预计薪资', salaryNet:'预计实到手薪资',
    salarySave:'✓ 保存薪资信息',
    dpStatus:'状态', dpActual:'实际时间', dpNote:'备注',
    dpReset:'重置为班次', dpCancel:'取消', dpSave:'保存',
    dpTotalHours:'合计:', dpOT:'加班:',
    dpInTime:'上班时间', dpOutTime:'下班时间',
    dpNoteP:'为这天添加备注...',
    stCM:'出勤', stCMSub:'正常出勤',
    stNP:'请假', stNPSub:'带薪假',
    stV:'缺勤', stVSub:'无故缺勤',
    stLL:'节假日工作', stLLSub:'按法律计算',
    spPresent:'本月出勤天数', spStart:'开始今天的工作',
    resetTitle:'删除所有数据？',
    resetDesc:'所有数据将被永久删除，无法恢复！',
    resetCancel:'取消', resetOk:'🗑 全部删除',
    exportPreview:'预览导出数据：',
    exportBtn:'📊 导出Excel文件 (.csv)',
    n1Name:'上班前30分钟提醒', n1Desc:'班次开始前通知',
    n2Name:'30分钟后确认下班', n2Desc:'确认实际下班时间',
    n3Name:'自动打卡 (GPS)', n3Desc:'进入/离开公司区域时自动记录',
    n4Name:'每周总结提醒', n4Desc:'每周五查看每周总结',
    calEmpty:'本月暂无数据', noData:'暂无数据',
    salaryDetail:'输入薪资信息以自动计算',
  },
  my:{
    appName:'လုပ်ငန်း Pro', appSub:'အလုပ်မှတ်တမ်း · လစာတွက်ချက်မှု',
    vaoCA:'တက်မှတ်', hetCA:'ဆင်းမှတ်',
    batDauCa:'နှိပ်ပြီးစတင်ပါ', ketThucCa:'ဆင်းချိန် နှိပ်ပါ',
    chuaChamCong:'မမှတ်ရသေး',
    gioLam:'ဤလ အလုပ်ချိန်',
    binhThuong:'ပုံမှန်', chamChi:'ကြိုးစား ⚡', quaSuc:'အလွန်အကျွံ 🔥',
    coMat:'တက်ရောက်', vang:'ပျက်ကွက်', nghiPhep:'ခွင့်', tangCa:'ချိန်ပို',
    chucNang:'လုပ်ဆောင်ချက်',
    lich:'ပြက္ခဒိန်', thietLap:'သတ်မှတ်', giaoDien:'ဒီဇိုင်း', caiDat:'ဆက်တင်',
    luong:'လစာ', xuatExcel:'Excel ထုတ်ယူ', thongBao:'အသိပေး', huongDan:'အကူအညီ',
    flGPS:'GPS', flUtil:'ဂိမ်းများ', flTax:'အခွန်/အာမခံ',
    taxTitle:'🏛️ အခွန် & အာမခံ လမ်းညွှန်',
    utilTitle:'🎮 ဂိမ်းများ', utilEmptyTitle:'ဂိမ်းရွေးပါ',
    utilEmptyDesc:'ဂိမ်းများကို ဤနေရာတွင် ထည့်ပြီးပါပြီ။',
    taxSecIns:'🛡️ လူမှုဖူလုံရေး / အာမခံ',
    taxSecDeduct:'💰 ကိုယ်ရေး ကင်းလွတ်ခွင့်',
    taxSecBrackets:'📊 ဝင်ငွေခွန် ဇယား (ပိုမိုကောက်ခံ)',
    taxSecPayroll:'⏱️ ဥပဒေနှင့်အညီ လစာကိန်းဂဏန်းများ',
    taxBandNo:'အဆင့်', taxBandIncome:'အခွန်ကျသင့်ဝင်ငွေ', taxBandRate:'နှုန်း',
    taxInsRate:'ထည့်ဝင်နှုန်း', taxInsCap:'လစာ အများဆုံး/လ', taxInsMax:'အများဆုံး/လ',
    taxInsFlat:'သတ်မှတ်နှုန်း', taxSS:'Social Security', taxSsCap:'SS နှစ်စဉ်ကန့်သတ်', taxMedicare:'Medicare',
    taxPersonal:'ကိုယ်တိုင်', taxDependent:'မှီခိုသူ', taxStandard:'ပုံသေနုတ်ငွေ',
    taxExempt:'0% (ကင်းလွတ်)', taxAbove:'ကျော်',
    taxInsDeductY:'✓ အာမခံ အခွန်မှ နုတ်ယူနိုင်',
    taxInsDeductN:'⚠️ အာမခံ အခွန်မှ နုတ်မရ',
    taxLocalTax:'ဒေသဆိုင်ရာ အခွန်', taxResidentTax:'နေထိုင်သူ အခွန်',
    taxCalcBy:'တွက်ချက်မူ', taxPeriodAnnual:'နှစ်စဉ် (လပေါင်းပြ)', taxPeriodMonthly:'လ',
    taxPerYear:'နှစ်', taxPerMonth:'လ',
    taxNote:'၂၀၂၅ ဥပဒေနှင့်အညီ ကိုးကားသာသုံးရမည်။ အမှန်တကယ် အခွန်/အာမခံ ကုမ္ပဏီမူဝါဒနှင့် မိသားစုအပေါ် မူတည်သည်။',
    luongUocTinh:'💼 ဤလ ခန့်မှန်းလစာ',
    lichChamCong:'တက်ရောက်မှု ပြက္ခဒိန်',
    chipCM:'✓ တက်', chipV:'✕ ပျက်', chipNP:'☀ ခွင့်', chipLL:'★ အားလပ်ရက်',
    navHome:'မူလ', navLich:'ပြက္ခဒိန်', navLuong:'လစာ', navCaiDat:'ဆက်တင်',
    settingsTitle:'ဆက်တင်',
    siLang:'ဘာသာစကား', siCountry:'အလုပ်လုပ်သောနိုင်ငံ',
    siSetup:'အချက်အလက်', siSetupSub:'အမည်၊ ရာထူး၊ Shift',
    siNotif:'အသိပေး', siNotifSub:'အချိန်သတိပေး',
    siAppear:'ဒီဇိုင်း', siAppearSub:'အရောင်၊ ဓာတ်ပုံ',
    siAbout:'အပ်အကြောင်း', siAboutSub:'ဗားရှင်း 2.2.0',
    siHelp:'အသုံးပြုနည်း', siHelpSub:'ထိရောက်စွာ အသုံးပြုနည်း',
    siDelete:'ဒေတာအားလုံးဖျက်', siDeleteSub:'ပြန်ရမည်မဟုတ်',
    panelAppear:'⭐ ဒီဇိုင်း', panelNotif:'🔔 အသိပေးချိန်',
    panelSalary:'💰 လစာ', panelExcel:'📊 Excel ထုတ်ယူ',
    panelSetup:'📝 အချက်အလက်', panelHelp:'📖 အသုံးပြုနည်း',
    panelAbout:'ℹ️ အပ်အကြောင်း', panelLang:'🌐 ဘာသာ',
    panelCountry:'🗺️ နိုင်ငံ',
    closeBtn:'ပိတ်',
    obLang:'ကြိုဆိုပါသည်! 👋\nဘာသာရွေးချယ်', obLangSub:'ဘာသာစကားနှင့်နိုင်ငံကိုရွေးချယ်ပါ',
    obUser:'သင့်အချက်အလက် 👤', obUserSub:'အပ်ကိုပုဂ္ဂိုလ်ဆိုင်ရာပြုလုပ်ရန်',
    obShift:'အလုပ်ချိန် ⏰', obShiftSub:'ဘယ်နှစ်ဆင်း? တစ်ဆင်းဘယ်နှစ်နာရီ?',
    obTime:'Shift အချိန် 🕐', obTimeSub:'တစ်ဆင်းချင်းအချိန်သတ်မှတ်ပါ',
    obNext:'ရှေ့ →', obBack:'←', obStart:'အပ်စတင် ✓',
    obName:'အမည်', obNameP:'ကိုစိုး',
    obJob:'ရာထူး', obJobP:'ဝန်ထမ်း...',
    obCo:'ကုမ္ပဏီ', obCoP:'ABC ကုမ္ပဏီ',
    obShiftNum:'Shift အရေ', obHours:'တစ်ဆင်းနာရီ', obHoursCustom:'သို့မဟုတ် ရိုက်ထည့်:', obHoursUnit:'နာရီ/ဆင်း',
    obWeeks:'Cycle ပတ်',
    obShiftCountry:'အလုပ်နိုင်ငံ',
    days:['တနင်္ဂနွေ','တနင်္လာ','အင်္ဂါ','ဗုဒ္ဓဟူး','ကြာသပတေး','သောကြာ','စနေ'],
    daysShort:['တ','တ','အ','ဗ','က','သ','စ'],
    months:['ဇန်နဝါရီ','ဖေဖော်ဝါရီ','မတ်','ဧပြီ','မေ','ဇွန်','ဇူလိုင်','သြဂုတ်','စက်တင်ဘာ','အောက်တိုဘာ','နိုဝင်ဘာ','ဒီဇင်ဘာ'],
    salaryContract:'စာချုပ်လစာ / လ', salaryDays:'လ ပုံမှန်အလုပ်ရက်',
    salaryEst:'ဤလ ခန့်မှန်းလစာ', salaryNet:'ခန့်မှန်းလက်ခံ',
    salarySave:'✓ လစာသိမ်း',
    dpStatus:'အခြေအနေ', dpActual:'အချိန်တိတိ', dpNote:'မှတ်ချက်',
    dpReset:'Shift အချိန်ပြန်', dpCancel:'ပယ်ဖျက်', dpSave:'သိမ်း',
    dpTotalHours:'စုစုပေါင်း:', dpOT:'ချိန်ပို:',
    dpInTime:'တက်ချိန်', dpOutTime:'ဆင်းချိန်',
    dpNoteP:'ဤနေ့အတွက်မှတ်ချက်ထည့်ပါ...',
    stCM:'တက်ရောက်', stCMSub:'ပုံမှန်တက်',
    stNP:'ခွင့်', stNPSub:'လစာပါ ခွင့်',
    stV:'ပျက်ကွက်', stVSub:'ခွင့်မဲ့',
    stLL:'အားလပ်ရက်', stLLSub:'ဥပဒေအတိုင်း',
    spPresent:'ဤလ တက်ရောက်ရက်', spStart:'ယနေ့အလုပ်စတင်',
    resetTitle:'ဒေတာအားလုံးဖျက်မလား?',
    resetDesc:'ဒေတာအားလုံး ပြန်မရနိုင်ဘဲ ဖျက်မည်!',
    resetCancel:'ပယ်ဖျက်', resetOk:'🗑 အားလုံးဖျက်',
    exportPreview:'ထုတ်ယူမည့်ဒေတာကြိုကြည့်:',
    exportBtn:'📊 Excel ထုတ်ယူ (.csv)',
    n1Name:'30မိနစ်ကြိုသတိပေး', n1Desc:'Shift မစမီ အသိပေး',
    n2Name:'30မိနစ်ပြီး ဆင်းအချိန်အတည်ပြု', n2Desc:'တိတိကျကျ ဆင်းချိန်မေးမြန်း',
    n3Name:'အလိုအလျောက် (GPS)', n3Desc:'ကုမ္ပဏီဝင်/ထွက်သောအခါ မှတ်တမ်း',
    n4Name:'အပတ်စဉ်နောင်',n4Desc:'သောကြာတိုင်းအပတ်ချုပ်',
    calEmpty:'ဤလတွင် ဒေတာမရှိသေးပါ', noData:'ဒေတာမရှိသေးပါ',
    salaryDetail:'လစာအချက်အလက် ထည့်ပါ',
  },

  th:{
    appName:'บันทึกเวลาทำงาน Pro', appSub:'บันทึกการทำงาน · คำนวณเงินเดือนตามกฎหมาย',
    vaoCA:'เข้างาน', hetCA:'ออกงาน',
    batDauCa:'กดเพื่อเริ่มกะ', ketThucCa:'กดเมื่อสิ้นสุดกะ',
    chuaChamCong:'ยังไม่ได้บันทึก',
    gioLam:'ชั่วโมงทำงานเดือนนี้',
    binhThuong:'ปกติ', chamChi:'ขยัน ⚡', quaSuc:'หนักเกินไป 🔥',
    coMat:'มาทำงาน', vang:'ขาดงาน', nghiPhep:'ลาพักร้อน', tangCa:'ล่วงเวลา',
    chucNang:'ฟังก์ชัน',
    lich:'ปฏิทิน', thietLap:'ตั้งค่า', giaoDien:'ธีม', caiDat:'การตั้งค่า',
    luong:'เงินเดือน', xuatExcel:'ส่งออก Excel', thongBao:'การแจ้งเตือน', huongDan:'คู่มือ',
    flGPS:'GPS', flUtil:'เกม', flTax:'ภาษี/ประกัน',
    taxTitle:'🏛️ คู่มือภาษีและประกันสังคม',
    utilTitle:'🎮 เกม', utilEmptyTitle:'เลือกเกม',
    utilEmptyDesc:'เพิ่มเกมไว้ในส่วนนี้แล้ว',
    taxSecIns:'🛡️ ประกันสังคม',
    taxSecDeduct:'💰 ค่าลดหย่อนส่วนตัว',
    taxSecBrackets:'📊 อัตราภาษีเงินได้บุคคลธรรมดา (อัตราก้าวหน้า)',
    taxSecPayroll:'⏱️ ค่าตอบแทนตามกฎหมาย',
    taxBandNo:'ระดับ', taxBandIncome:'รายได้ที่ต้องเสียภาษี', taxBandRate:'อัตราภาษี',
    taxInsRate:'อัตราการจ่าย', taxInsCap:'เพดานเงินเดือน/เดือน', taxInsMax:'จ่ายสูงสุด/เดือน',
    taxInsFlat:'อัตราคงที่', taxSS:'Social Security', taxSsCap:'เพดาน SS/ปี', taxMedicare:'Medicare',
    taxPersonal:'ส่วนตัว', taxDependent:'ผู้อยู่ในความดูแล', taxStandard:'ค่าลดหย่อนมาตรฐาน',
    taxExempt:'0% (ยกเว้น)', taxAbove:'เกิน',
    taxInsDeductY:'✓ หักประกันสังคมจากรายได้ที่ต้องเสียภาษีได้',
    taxInsDeductN:'⚠️ ไม่สามารถหักประกันสังคมจากรายได้ที่ต้องเสียภาษี',
    taxLocalTax:'ภาษีท้องถิ่น', taxResidentTax:'ภาษีถิ่นที่อยู่',
    taxCalcBy:'คำนวณตาม', taxPeriodAnnual:'ปี (แสดงรายเดือน)', taxPeriodMonthly:'เดือน',
    taxPerYear:'ปี', taxPerMonth:'เดือน',
    taxNote:'ข้อมูลอ้างอิงตามกฎหมายปี 2568 ภาษี/ประกันจริงขึ้นอยู่กับนโยบายบริษัทและสถานะครอบครัว',
    luongUocTinh:'💼 ประมาณการเงินเดือนเดือนนี้',
    lichChamCong:'ปฏิทินการทำงาน',
    chipCM:'✓ มาทำงาน', chipV:'✕ ขาดงาน', chipNP:'☀ ลา', chipLL:'★ ทำงานวันหยุด',
    navHome:'หน้าหลัก', navLich:'ปฏิทิน', navLuong:'เงินเดือน', navCaiDat:'การตั้งค่า',
    settingsTitle:'การตั้งค่า',
    siLang:'ภาษา', siCountry:'ประเทศที่ทำงาน',
    siSetup:'ตั้งค่าข้อมูล', siSetupSub:'ชื่อ ตำแหน่ง กะการทำงาน',
    siNotif:'การแจ้งเตือน', siNotifSub:'แจ้งเตือนเวลาทำงาน GPS',
    siAppear:'ธีม', siAppearSub:'สี รูปโปรไฟล์ พื้นหลัง',
    siAbout:'เกี่ยวกับแอป', siAboutSub:'เวอร์ชัน 2.2.0',
    siHelp:'คู่มือการใช้งาน', siHelpSub:'วิธีใช้งานแอปอย่างมีประสิทธิภาพ',
    siDelete:'ลบข้อมูลทั้งหมด', siDeleteSub:'ไม่สามารถกู้คืนได้',
    panelAppear:'⭐ ธีม', panelNotif:'🔔 การแจ้งเตือน',
    panelSalary:'💰 เงินเดือน', panelExcel:'📊 ส่งออก Excel',
    panelSetup:'📝 ตั้งค่าข้อมูล', panelHelp:'📖 คู่มือ',
    panelAbout:'ℹ️ เกี่ยวกับแอป', panelLang:'🌐 ภาษา',
    panelCountry:'🗺️ ประเทศ',
    closeBtn:'ปิด',
    obLang:'ยินดีต้อนรับ! 👋\nเลือกภาษา', obLangSub:'เลือกภาษาและประเทศที่ทำงาน',
    obUser:'ข้อมูลของคุณ 👤', obUserSub:'กรอกข้อมูลเพื่อปรับแต่งแอป',
    obShift:'ตารางงาน ⏰', obShiftSub:'กี่กะ? กี่ชั่วโมงต่อกะ?',
    obTime:'เวลากะ 🕐', obTimeSub:'ตั้งเวลาเข้า-ออกสำหรับแต่ละกะ',
    obNext:'ถัดไป →', obBack:'←', obStart:'เริ่มใช้งาน ✓',
    obName:'ชื่อ-นามสกุล', obNameP:'สมชาย ใจดี',
    obJob:'ตำแหน่งงาน', obJobP:'พนักงาน...',
    obCo:'บริษัท', obCoP:'บริษัท ABC',
    obShiftNum:'จำนวนกะ', obHours:'ชั่วโมง/กะ', obHoursCustom:'หรือใส่:', obHoursUnit:'ชม./กะ',
    obWeeks:'สัปดาห์/รอบ',
    obShiftCountry:'ประเทศที่ทำงาน',
    days:['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'],
    daysShort:['อา','จ','อ','พ','พฤ','ศ','ส'],
    months:['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'],
    salaryContract:'เงินเดือนสัญญา/เดือน', salaryDays:'วันทำงานมาตรฐาน/เดือน',
    salaryEst:'ประมาณการเดือนนี้', salaryNet:'ประมาณการรับสุทธิ',
    salarySave:'✓ บันทึกข้อมูลเงินเดือน',
    dpStatus:'สถานะ', dpActual:'ชั่วโมงจริง', dpNote:'หมายเหตุ',
    dpReset:'รีเซ็ตตามกะ', dpCancel:'ยกเลิก', dpSave:'บันทึก',
    dpTotalHours:'รวม:', dpOT:'ล่วงเวลา:',
    dpInTime:'เวลาเข้า', dpOutTime:'เวลาออก',
    dpNoteP:'เพิ่มหมายเหตุสำหรับวันนี้...',
    stCM:'มาทำงาน', stCMSub:'ทำงานครบกะ',
    stNP:'ลาพักร้อน', stNPSub:'ลาโดยได้รับค่าจ้าง',
    stV:'ขาดงาน', stVSub:'ขาดโดยไม่ได้รับค่าจ้าง',
    stLL:'ทำงานวันหยุด', stLLSub:'ตามกฎหมาย',
    spPresent:'วันมาทำงานเดือนนี้', spStart:'เริ่มต้นวันทำงาน',
    resetTitle:'ลบข้อมูลทั้งหมด?',
    resetDesc:'ข้อมูลทั้งหมดจะถูกลบถาวร ไม่สามารถกู้คืนได้!',
    resetCancel:'ยกเลิก', resetOk:'🗑 ลบทั้งหมด',
    exportPreview:'ตัวอย่างข้อมูลที่จะส่งออก:',
    exportBtn:'📊 ส่งออก Excel (.csv)',
    n1Name:'แจ้งเตือนก่อน 30 นาที', n1Desc:'แจ้งก่อนกะเริ่ม',
    n2Name:'ยืนยันหลัง 30 นาที', n2Desc:'ถามเวลาออกจริง',
    n3Name:'เช็คชื่ออัตโนมัติ (GPS)', n3Desc:'บันทึกอัตโนมัติเมื่อเข้า/ออกบริษัท',
    n4Name:'สรุปรายสัปดาห์', n4Desc:'ดูสรุปทุกวันศุกร์',
    calEmpty:'ไม่มีข้อมูลเดือนนี้', noData:'ไม่มีข้อมูล',
    salaryDetail:'กรอกข้อมูลเงินเดือนเพื่อคำนวณอัตโนมัติ',
  },
  id:{
    appName:'Absensi Pro', appSub:'Catat Waktu Kerja · Hitung Gaji Sesuai Hukum',
    vaoCA:'MASUK', hetCA:'KELUAR',
    batDauCa:'Tekan untuk mulai shift', ketThucCa:'Tekan saat shift selesai',
    chuaChamCong:'Belum absen',
    gioLam:'Jam kerja bulan ini',
    binhThuong:'Normal', chamChi:'Rajin ⚡', quaSuc:'Terlalu berat 🔥',
    coMat:'Hadir', vang:'Absen', nghiPhep:'Cuti', tangCa:'Lembur',
    chucNang:'Fitur',
    lich:'Kalender', thietLap:'Pengaturan', giaoDien:'Tampilan', caiDat:'Setelan',
    luong:'Gaji', xuatExcel:'Ekspor Excel', thongBao:'Notifikasi', huongDan:'Panduan',
    flGPS:'GPS', flUtil:'Game', flTax:'Pajak/Asuransi',
    taxTitle:'🏛️ Panduan Pajak & Asuransi',
    utilTitle:'🎮 Game', utilEmptyTitle:'Pilih game',
    utilEmptyDesc:'Game telah ditambahkan di area ini.',
    taxSecIns:'🛡️ JAMINAN SOSIAL / BPJS',
    taxSecDeduct:'💰 PENGURANGAN PRIBADI / PTKP',
    taxSecBrackets:'📊 TARIF PPh PASAL 21 (PROGRESIF)',
    taxSecPayroll:'⏱️ KOEFISIEN UPAH SESUAI HUKUM',
    taxBandNo:'Lapisan', taxBandIncome:'Penghasilan Kena Pajak', taxBandRate:'Tarif Pajak',
    taxInsRate:'Tarif iuran', taxInsCap:'Batas gaji/bulan', taxInsMax:'Iuran maks/bulan',
    taxInsFlat:'Tarif tetap', taxSS:'Social Security', taxSsCap:'Batas SS/tahun', taxMedicare:'Medicare',
    taxPersonal:'Pribadi', taxDependent:'Tanggungan', taxStandard:'Pengurangan standar',
    taxExempt:'0% (bebas)', taxAbove:'Di atas',
    taxInsDeductY:'✓ Iuran BPJS dapat dikurangkan dari penghasilan kena pajak',
    taxInsDeductN:'⚠️ Iuran BPJS TIDAK dapat dikurangkan dari penghasilan kena pajak',
    taxLocalTax:'Pajak daerah', taxResidentTax:'Pajak penduduk',
    taxCalcBy:'Dihitung per', taxPeriodAnnual:'tahun (dibagi bulanan)', taxPeriodMonthly:'bulan',
    taxPerYear:'tahun', taxPerMonth:'bulan',
    taxNote:'Data referensi berdasarkan hukum 2025. Pajak/asuransi aktual tergantung kebijakan perusahaan dan kondisi keluarga.',
    luongUocTinh:'💼 Estimasi gaji bulan ini',
    lichChamCong:'Kalender Kehadiran',
    chipCM:'✓ Hadir', chipV:'✕ Absen', chipNP:'☀ Cuti', chipLL:'★ Kerja Hari Libur',
    navHome:'Beranda', navLich:'Kalender', navLuong:'Gaji', navCaiDat:'Setelan',
    settingsTitle:'Setelan',
    siLang:'Bahasa', siCountry:'Negara kerja',
    siSetup:'Info Pengaturan', siSetupSub:'Nama, jabatan, shift kerja',
    siNotif:'Notifikasi', siNotifSub:'Pengingat kerja, absen otomatis',
    siAppear:'Tampilan', siAppearSub:'Warna, avatar, latar belakang',
    siAbout:'Tentang Aplikasi', siAboutSub:'Versi 2.2.0',
    siHelp:'Panduan Pengguna', siHelpSub:'Cara menggunakan aplikasi',
    siDelete:'Hapus Semua Data', siDeleteSub:'Tidak dapat dipulihkan',
    panelAppear:'⭐ Tampilan', panelNotif:'🔔 Notifikasi',
    panelSalary:'💰 Gaji', panelExcel:'📊 Ekspor Excel',
    panelSetup:'📝 Info Pengaturan', panelHelp:'📖 Panduan',
    panelAbout:'ℹ️ Tentang Aplikasi', panelLang:'🌐 Bahasa',
    panelCountry:'🗺️ Negara',
    closeBtn:'Tutup',
    obLang:'Selamat Datang! 👋\nPilih Bahasa', obLangSub:'Pilih bahasa dan negara tempat bekerja.',
    obUser:'Info Anda 👤', obUserSub:'Masukkan info untuk personalisasi.',
    obShift:'Jadwal Kerja ⏰', obShiftSub:'Berapa shift? Jam per shift?',
    obTime:'Jam Shift 🕐', obTimeSub:'Atur jam masuk-keluar tiap shift.',
    obNext:'Lanjut →', obBack:'←', obStart:'Mulai Gunakan ✓',
    obName:'Nama Lengkap', obNameP:'Budi Santoso',
    obJob:'Jabatan', obJobP:'Karyawan...',
    obCo:'Perusahaan', obCoP:'PT ABC',
    obShiftNum:'Jumlah shift', obHours:'Jam/shift', obHoursCustom:'Atau ketik:', obHoursUnit:'jam/shift',
    obWeeks:'Minggu/siklus',
    obShiftCountry:'Negara kerja',
    days:['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],
    daysShort:['Min','Sen','Sel','Rab','Kam','Jum','Sab'],
    months:['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'],
    salaryContract:'Gaji kontrak/bulan', salaryDays:'Hari kerja standar/bulan',
    salaryEst:'Estimasi gaji bulan ini', salaryNet:'Estimasi gaji bersih',
    salarySave:'✓ Simpan info gaji',
    dpStatus:'STATUS', dpActual:'JAM AKTUAL', dpNote:'CATATAN',
    dpReset:'Reset ke shift', dpCancel:'Batal', dpSave:'Simpan',
    dpTotalHours:'Total:', dpOT:'Lembur:',
    dpInTime:'Jam masuk', dpOutTime:'Jam keluar',
    dpNoteP:'Tambahkan catatan untuk hari ini...',
    stCM:'Hadir', stCMSub:'Masuk penuh shift',
    stNP:'Cuti', stNPSub:'Cuti berbayar',
    stV:'Absen', stVSub:'Absen tidak berbayar',
    stLL:'Kerja Hari Libur', stLLSub:'Sesuai hukum',
    spPresent:'hari hadir bulan ini', spStart:'Mulai hari kerja',
    resetTitle:'Hapus semua data?',
    resetDesc:'Semua data akan dihapus permanen. Tidak dapat dipulihkan!',
    resetCancel:'Batal', resetOk:'🗑 Hapus Semua',
    exportPreview:'Pratinjau data yang akan diekspor:',
    exportBtn:'📊 Ekspor Excel (.csv)',
    n1Name:'Ingatkan 30 menit sebelum shift', n1Desc:'Notifikasi sebelum shift mulai',
    n2Name:'Konfirmasi setelah 30 menit', n2Desc:'Tanya jam keluar aktual',
    n3Name:'Absen Otomatis (GPS)', n3Desc:'Catat otomatis saat masuk/keluar area',
    n4Name:'Ringkasan mingguan', n4Desc:'Lihat ringkasan tiap Jumat',
    calEmpty:'Tidak ada data bulan ini', noData:'Tidak ada data',
    salaryDetail:'Masukkan info gaji untuk kalkulasi otomatis',
  },
  ph:{
    appName:'Attendance Pro', appSub:'I-record ang Oras · Kalkulahin ang Sahod',
    vaoCA:'PUMASOK', hetCA:'LUMABAS',
    batDauCa:'Pindutin para magsimula', ketThucCa:'Pindutin sa katapusan ng shift',
    chuaChamCong:'Hindi pa naka-record',
    gioLam:'Oras ng trabaho ngayong buwan',
    binhThuong:'Normal', chamChi:'Masipag ⚡', quaSuc:'Sobrang pagod 🔥',
    coMat:'Dumalo', vang:'Absent', nghiPhep:'Leave', tangCa:'Overtime',
    chucNang:'Mga Feature',
    lich:'Kalendaryo', thietLap:'Setup', giaoDien:'Hitsura', caiDat:'Settings',
    luong:'Sahod', xuatExcel:'I-export sa Excel', thongBao:'Mga Abiso', huongDan:'Gabay',
    flGPS:'GPS', flUtil:'Mga Laro', flTax:'Buwis/Seguro',
    taxTitle:'🏛️ Gabay sa Buwis at Seguro',
    utilTitle:'🎮 Mga Laro', utilEmptyTitle:'Pumili ng laro',
    utilEmptyDesc:'Naidagdag na ang mga laro sa bahaging ito.',
    taxSecIns:'🛡️ SOCIAL INSURANCE / SSS',
    taxSecDeduct:'💰 PERSONAL EXEMPTION / DEDUCTIONS',
    taxSecBrackets:'📊 INCOME TAX BRACKETS (PROGRESIBO)',
    taxSecPayroll:'⏱️ STATUTORY PAY RATES',
    taxBandNo:'Antas', taxBandIncome:'Taxable na kita', taxBandRate:'Tax rate',
    taxInsRate:'Rate ng kontribusyon', taxInsCap:'Limitasyon ng sahod/buwan', taxInsMax:'Pinakamataas/buwan',
    taxInsFlat:'Flat rate', taxSS:'Social Security', taxSsCap:'SS cap/taon', taxMedicare:'Medicare',
    taxPersonal:'Personal', taxDependent:'Dependent', taxStandard:'Standard deduction',
    taxExempt:'0% (exempt)', taxAbove:'Higit sa',
    taxInsDeductY:'✓ Ang insurance ay mababawas mula sa taxable income',
    taxInsDeductN:'⚠️ Ang insurance ay HINDI mababawas mula sa taxable income',
    taxLocalTax:'Local tax', taxResidentTax:'Resident tax',
    taxCalcBy:'Batay sa', taxPeriodAnnual:'taon (ipinapakita buwanang)', taxPeriodMonthly:'buwan',
    taxPerYear:'taon', taxPerMonth:'buwan',
    taxNote:'Sangguniang datos batay sa batas 2025. Ang aktwal na buwis/seguro ay depende sa patakaran ng kumpanya at katayuan ng pamilya.',
    luongUocTinh:'💼 Tinatantiyang sahod ngayong buwan',
    lichChamCong:'Kalendaryo ng Attendance',
    chipCM:'✓ Dumalo', chipV:'✕ Absent', chipNP:'☀ Leave', chipLL:'★ Holiday Work',
    navHome:'Home', navLich:'Kalendaryo', navLuong:'Sahod', navCaiDat:'Settings',
    settingsTitle:'Settings',
    siLang:'Wika', siCountry:'Bansang pinagtatrabahuhan',
    siSetup:'Setup ng Info', siSetupSub:'Pangalan, trabaho, shift',
    siNotif:'Mga Abiso', siNotifSub:'Paalala ng trabaho, auto check-in',
    siAppear:'Hitsura', siAppearSub:'Kulay, avatar, background',
    siAbout:'Tungkol sa App', siAboutSub:'Bersyon 2.2.0',
    siHelp:'Gabay ng Gumagamit', siHelpSub:'Paano gamitin ang app',
    siDelete:'Burahin Lahat ng Data', siDeleteSub:'Hindi na mababawi',
    panelAppear:'⭐ Hitsura', panelNotif:'🔔 Mga Abiso',
    panelSalary:'💰 Sahod', panelExcel:'📊 I-export sa Excel',
    panelSetup:'📝 Setup ng Info', panelHelp:'📖 Gabay',
    panelAbout:'ℹ️ Tungkol sa App', panelLang:'🌐 Wika',
    panelCountry:'🗺️ Bansa',
    closeBtn:'Isara',
    obLang:'Maligayang pagdating! 👋\nPiliin ang Wika', obLangSub:'Piliin ang wika at bansang pinagtatrabahuhan.',
    obUser:'Iyong Impormasyon 👤', obUserSub:'Ilagay ang info para i-personalize ang app.',
    obShift:'Iskedyul ng Trabaho ⏰', obShiftSub:'Ilang shift? Ilang oras bawat shift?',
    obTime:'Oras ng Shift 🕐', obTimeSub:'Itakda ang oras ng pasok at labas.',
    obNext:'Susunod →', obBack:'←', obStart:'Simulan ang Paggamit ✓',
    obName:'Buong Pangalan', obNameP:'Juan dela Cruz',
    obJob:'Trabaho', obJobP:'Empleyado...',
    obCo:'Kumpanya', obCoP:'ABC Company',
    obShiftNum:'Bilang ng shift', obHours:'Oras/shift', obHoursCustom:'O ilagay:', obHoursUnit:'oras/shift',
    obWeeks:'Linggo/siklo',
    obShiftCountry:'Bansang pinagtatrabahuhan',
    days:['Linggo','Lunes','Martes','Miyerkules','Huwebes','Biyernes','Sabado'],
    daysShort:['Lin','Lun','Mar','Miy','Huw','Biy','Sab'],
    months:['Enero','Pebrero','Marso','Abril','Mayo','Hunyo','Hulyo','Agosto','Setyembre','Oktubre','Nobyembre','Disyembre'],
    salaryContract:'Kontratang sahod/buwan', salaryDays:'Karaniwang araw ng trabaho/buwan',
    salaryEst:'Tinatantiyang sahod ngayong buwan', salaryNet:'Tinatantiyang take-home pay',
    salarySave:'✓ I-save ang impormasyon ng sahod',
    dpStatus:'KATAYUAN', dpActual:'AKTWAL NA ORAS', dpNote:'TALA',
    dpReset:'I-reset sa shift', dpCancel:'Kanselahin', dpSave:'I-save',
    dpTotalHours:'Kabuuan:', dpOT:'Overtime:',
    dpInTime:'Oras ng pasok', dpOutTime:'Oras ng labas',
    dpNoteP:'Magdagdag ng tala para sa araw na ito...',
    stCM:'Dumalo', stCMSub:'Kumpleto ang shift',
    stNP:'Leave', stNPSub:'Bayad na leave',
    stV:'Absent', stVSub:'Absent na walang bayad',
    stLL:'Holiday Work', stLLSub:'Ayon sa batas',
    spPresent:'araw ng pagdalo ngayong buwan', spStart:'Simulan ang araw ng trabaho',
    resetTitle:'Burahin ang lahat ng data?',
    resetDesc:'Lahat ng data ay permanenteng mabubura. Hindi na mababawi!',
    resetCancel:'Kanselahin', resetOk:'🗑 Burahin Lahat',
    exportPreview:'Preview ng data na ie-export:',
    exportBtn:'📊 I-export sa Excel (.csv)',
    n1Name:'Paalala 30 minuto bago shift', n1Desc:'Abiso bago magsimula ang shift',
    n2Name:'Kumpirmahin pagkatapos ng 30 minuto', n2Desc:'Tanungin ang aktwal na oras ng labas',
    n3Name:'Auto check-in (GPS)', n3Desc:'Awtomatikong i-record sa pasukan/labasan ng opisina',
    n4Name:'Lingguhang buod', n4Desc:'Tingnan ang buod tuwing Biyernes',
    calEmpty:'Walang data ngayong buwan', noData:'Walang data',
    salaryDetail:'Ilagay ang impormasyon ng sahod para awtomatikong kalkulahin',
  },
  ne:{
    appName:'हाजिरी Pro', appSub:'समय ट्र्याक गर्नुस् · कानुनी तलब गणना',
    vaoCA:'हाजिर', hetCA:'विदाइ',
    batDauCa:'सिफ्ट सुरु गर्न थिच्नुस्', ketThucCa:'सिफ्ट सकिँदा थिच्नुस्',
    chuaChamCong:'अझै रेकर्ड गरिएको छैन',
    gioLam:'यो महिनाको कार्य घण्टा',
    binhThuong:'सामान्य', chamChi:'मेहनती ⚡', quaSuc:'अति थकित 🔥',
    coMat:'उपस्थित', vang:'अनुपस्थित', nghiPhep:'बिदा', tangCa:'ओभरटाइम',
    chucNang:'सुविधाहरू',
    lich:'क्यालेन्डर', thietLap:'सेटअप', giaoDien:'थिम', caiDat:'सेटिङ',
    luong:'तलब', xuatExcel:'Excel निर्यात', thongBao:'सूचनाहरू', huongDan:'गाइड',
    flGPS:'GPS', flUtil:'खेलहरू', flTax:'कर/बीमा',
    taxTitle:'🏛️ कर र बीमा गाइड',
    utilTitle:'🎮 खेलहरू', utilEmptyTitle:'खेल छान्नुहोस्',
    utilEmptyDesc:'खेलहरू यस क्षेत्रमा थपिएका छन्।',
    taxSecIns:'🛡️ सामाजिक बीमा',
    taxSecDeduct:'💰 व्यक्तिगत छुट',
    taxSecBrackets:'📊 आयकर स्ल्याब (प्रगतिशील)',
    taxSecPayroll:'⏱️ कानुनी पारिश्रमिक दर',
    taxBandNo:'स्ल्याब', taxBandIncome:'करयोग्य आय', taxBandRate:'कर दर',
    taxInsRate:'योगदान दर', taxInsCap:'तलब सीमा/महिना', taxInsMax:'अधिकतम/महिना',
    taxInsFlat:'एकल दर', taxSS:'Social Security', taxSsCap:'SS सीमा/वर्ष', taxMedicare:'Medicare',
    taxPersonal:'व्यक्तिगत', taxDependent:'आश्रित', taxStandard:'मानक कटौती',
    taxExempt:'0% (छुट)', taxAbove:'माथि',
    taxInsDeductY:'✓ बीमा करयोग्य आयबाट कटाउन सकिन्छ',
    taxInsDeductN:'⚠️ बीमा करयोग्य आयबाट कटाउन सकिँदैन',
    taxLocalTax:'स्थानीय कर', taxResidentTax:'आवासीय कर',
    taxCalcBy:'आधारमा', taxPeriodAnnual:'वार्षिक (मासिक देखाइन्छ)', taxPeriodMonthly:'महिनाको',
    taxPerYear:'वर्ष', taxPerMonth:'महिना',
    taxNote:'२०२५ को कानुनमा आधारित सन्दर्भ डेटा। वास्तविक कर/बीमा कम्पनीको नीति र पारिवारिक अवस्थामा निर्भर छ।',
    luongUocTinh:'💼 यो महिनाको अनुमानित तलब',
    lichChamCong:'हाजिरी क्यालेन्डर',
    chipCM:'✓ उपस्थित', chipV:'✕ अनुपस्थित', chipNP:'☀ बिदा', chipLL:'★ छुट्टीमा काम',
    navHome:'होम', navLich:'क्यालेन्डर', navLuong:'तलब', navCaiDat:'सेटिङ',
    settingsTitle:'सेटिङ',
    siLang:'भाषा', siCountry:'काम गर्ने देश',
    siSetup:'जानकारी सेटअप', siSetupSub:'नाम, पद, सिफ्ट',
    siNotif:'सूचनाहरू', siNotifSub:'काम रिमाइन्डर, GPS',
    siAppear:'थिम', siAppearSub:'रङ, अवतार, पृष्ठभूमि',
    siAbout:'एपको बारेमा', siAboutSub:'संस्करण 2.2.0',
    siHelp:'प्रयोगकर्ता गाइड', siHelpSub:'एप प्रभावकारी रूपमा कसरी प्रयोग गर्ने',
    siDelete:'सबै डेटा मेटाउनुस्', siDeleteSub:'पुनः प्राप्त गर्न सकिँदैन',
    panelAppear:'⭐ थिम', panelNotif:'🔔 सूचनाहरू',
    panelSalary:'💰 तलब', panelExcel:'📊 Excel निर्यात',
    panelSetup:'📝 जानकारी सेटअप', panelHelp:'📖 गाइड',
    panelAbout:'ℹ️ एपको बारेमा', panelLang:'🌐 भाषा',
    panelCountry:'🗺️ देश',
    closeBtn:'बन्द गर्नुस्',
    obLang:'स्वागत छ! 👋\nभाषा चयन गर्नुस्', obLangSub:'भाषा र कार्यस्थल देश चयन गर्नुस्।',
    obUser:'तपाईंको जानकारी 👤', obUserSub:'एप व्यक्तिगत बनाउन जानकारी भर्नुस्।',
    obShift:'कार्य तालिका ⏰', obShiftSub:'कति सिफ्ट? प्रति सिफ्ट कति घण्टा?',
    obTime:'सिफ्ट समय 🕐', obTimeSub:'प्रत्येक सिफ्टको समय सेट गर्नुस्।',
    obNext:'अर्को →', obBack:'←', obStart:'एप सुरु गर्नुस् ✓',
    obName:'पूरा नाम', obNameP:'राम श्रेष्ठ',
    obJob:'पद', obJobP:'कर्मचारी...',
    obCo:'कम्पनी', obCoP:'ABC कम्पनी',
    obShiftNum:'सिफ्ट संख्या', obHours:'घण्टा/सिफ्ट', obHoursCustom:'वा प्रविष्ट:', obHoursUnit:'घन्टा/पाली',
    obWeeks:'हप्ता/चक्र',
    obShiftCountry:'काम गर्ने देश',
    days:['आइतबार','सोमबार','मङ्गलबार','बुधबार','बिहिबार','शुक्रबार','शनिबार'],
    daysShort:['आइत','सोम','मङ्गल','बुध','बिहि','शुक्र','शनि'],
    months:['जनवरी','फेब्रुअरी','मार्च','अप्रिल','मे','जुन','जुलाई','अगस्ट','सेप्टेम्बर','अक्टोबर','नोभेम्बर','डिसेम्बर'],
    salaryContract:'सम्झौता तलब/महिना', salaryDays:'मानक कार्य दिन/महिना',
    salaryEst:'यो महिनाको अनुमानित तलब', salaryNet:'अनुमानित शुद्ध तलब',
    salarySave:'✓ तलब जानकारी सुरक्षित गर्नुस्',
    dpStatus:'अवस्था', dpActual:'वास्तविक समय', dpNote:'टिप्पणी',
    dpReset:'सिफ्टमा रिसेट', dpCancel:'रद्द गर्नुस्', dpSave:'सुरक्षित गर्नुस्',
    dpTotalHours:'जम्मा:', dpOT:'ओभरटाइम:',
    dpInTime:'प्रवेश समय', dpOutTime:'निस्कने समय',
    dpNoteP:'आजको लागि टिप्पणी थप्नुस्...',
    stCM:'उपस्थित', stCMSub:'पूर्ण सिफ्ट गरियो',
    stNP:'बिदा', stNPSub:'पारिश्रमिक सहित बिदा',
    stV:'अनुपस्थित', stVSub:'बिना पारिश्रमिक अनुपस्थित',
    stLL:'छुट्टीमा काम', stLLSub:'कानुन अनुसार',
    spPresent:'यो महिना उपस्थिति दिन', spStart:'कार्य दिन सुरु गर्नुस्',
    resetTitle:'सबै डेटा मेटाउने?',
    resetDesc:'सबै डेटा स्थायी रूपमा मेटिनेछ। पुनः प्राप्त गर्न सकिँदैन!',
    resetCancel:'रद्द', resetOk:'🗑 सबै मेटाउनुस्',
    exportPreview:'निर्यात हुने डेटाको पूर्वावलोकन:',
    exportBtn:'📊 Excel निर्यात (.csv)',
    n1Name:'३० मिनेट अघि रिमाइन्डर', n1Desc:'सिफ्ट सुरु हुनु अघि सूचना',
    n2Name:'३० मिनेट पछि पुष्टि', n2Desc:'वास्तविक निस्कने समय सोध्नुस्',
    n3Name:'स्वचालित हाजिरी (GPS)', n3Desc:'कार्यालय क्षेत्रमा प्रवेश/निस्किँदा स्वतः रेकर्ड',
    n4Name:'साप्ताहिक सारांश', n4Desc:'प्रत्येक शुक्रबार सारांश हेर्नुस्',
    calEmpty:'यो महिना डेटा छैन', noData:'डेटा छैन',
    salaryDetail:'स्वतः गणनाको लागि तलब जानकारी भर्नुस्',
  },
  hi:{
    appName:'उपस्थिति Pro', appSub:'काम का समय रिकॉर्ड करें · वेतन गणना',
    vaoCA:'उपस्थित', hetCA:'प्रस्थान',
    batDauCa:'शिफ्ट शुरू करने के लिए दबाएं', ketThucCa:'शिफ्ट समाप्त होने पर दबाएं',
    chuaChamCong:'अभी तक रिकॉर्ड नहीं किया',
    gioLam:'इस महीने काम के घंटे',
    binhThuong:'सामान्य', chamChi:'मेहनती ⚡', quaSuc:'बहुत थका हुआ 🔥',
    coMat:'उपस्थित', vang:'अनुपस्थित', nghiPhep:'छुट्टी', tangCa:'ओवरटाइम',
    chucNang:'सुविधाएँ',
    lich:'कैलेंडर', thietLap:'सेटअप', giaoDien:'थीम', caiDat:'सेटिंग',
    luong:'वेतन', xuatExcel:'Excel में निर्यात', thongBao:'सूचनाएं', huongDan:'मार्गदर्शिका',
    flGPS:'GPS', flUtil:'गेम', flTax:'कर/बीमा',
    taxTitle:'🏛️ कर और बीमा मार्गदर्शिका',
    utilTitle:'🎮 गेम', utilEmptyTitle:'गेम चुनें',
    utilEmptyDesc:'गेम इस क्षेत्र में जोड़ दिए गए हैं।',
    taxSecIns:'🛡️ सामाजिक बीमा / भविष्य निधि',
    taxSecDeduct:'💰 व्यक्तिगत छूट / कटौती',
    taxSecBrackets:'📊 आयकर स्लैब (प्रगतिशील)',
    taxSecPayroll:'⏱️ कानूनी वेतन दर',
    taxBandNo:'स्लैब', taxBandIncome:'कर योग्य आय', taxBandRate:'कर दर',
    taxInsRate:'अंशदान दर', taxInsCap:'वेतन सीमा/माह', taxInsMax:'अधिकतम/माह',
    taxInsFlat:'एकल दर', taxSS:'Social Security', taxSsCap:'SS सीमा/वर्ष', taxMedicare:'Medicare',
    taxPersonal:'व्यक्तिगत', taxDependent:'आश्रित', taxStandard:'मानक कटौती',
    taxExempt:'0% (छूट)', taxAbove:'से अधिक',
    taxInsDeductY:'✓ बीमा कर योग्य आय से काटा जा सकता है',
    taxInsDeductN:'⚠️ बीमा कर योग्य आय से नहीं काटा जा सकता',
    taxLocalTax:'स्थानीय कर', taxResidentTax:'निवासी कर',
    taxCalcBy:'आधार', taxPeriodAnnual:'वार्षिक (मासिक दिखाया)', taxPeriodMonthly:'माह',
    taxPerYear:'वर्ष', taxPerMonth:'माह',
    taxNote:'2025 के कानून के अनुसार संदर्भ डेटा। वास्तविक कर/बीमा कंपनी की नीति और पारिवारिक स्थिति पर निर्भर करता है।',
    luongUocTinh:'💼 इस महीने का अनुमानित वेतन',
    lichChamCong:'उपस्थिति कैलेंडर',
    chipCM:'✓ उपस्थित', chipV:'✕ अनुपस्थित', chipNP:'☀ छुट्टी', chipLL:'★ छुट्टी पर काम',
    navHome:'होम', navLich:'कैलेंडर', navLuong:'वेतन', navCaiDat:'सेटिंग',
    settingsTitle:'सेटिंग',
    siLang:'भाषा', siCountry:'कार्यस्थल देश',
    siSetup:'जानकारी सेटअप', siSetupSub:'नाम, पद, शिफ्ट',
    siNotif:'सूचनाएं', siNotifSub:'काम रिमाइंडर, GPS',
    siAppear:'थीम', siAppearSub:'रंग, अवतार, पृष्ठभूमि',
    siAbout:'ऐप के बारे में', siAboutSub:'संस्करण 2.2.0',
    siHelp:'उपयोगकर्ता मार्गदर्शिका', siHelpSub:'ऐप को प्रभावी ढंग से कैसे उपयोग करें',
    siDelete:'सभी डेटा हटाएं', siDeleteSub:'पुनः प्राप्त नहीं किया जा सकता',
    panelAppear:'⭐ थीम', panelNotif:'🔔 सूचनाएं',
    panelSalary:'💰 वेतन', panelExcel:'📊 Excel निर्यात',
    panelSetup:'📝 जानकारी सेटअप', panelHelp:'📖 मार्गदर्शिका',
    panelAbout:'ℹ️ ऐप के बारे में', panelLang:'🌐 भाषा',
    panelCountry:'🗺️ देश',
    closeBtn:'बंद करें',
    obLang:'स्वागत है! 👋\nभाषा चुनें', obLangSub:'अपनी भाषा और कार्यस्थल देश चुनें।',
    obUser:'आपकी जानकारी 👤', obUserSub:'ऐप को व्यक्तिगत बनाने के लिए जानकारी भरें।',
    obShift:'काम का शेड्यूल ⏰', obShiftSub:'कितनी शिफ्ट? प्रति शिफ्ट कितने घंटे?',
    obTime:'शिफ्ट समय 🕐', obTimeSub:'प्रत्येक शिफ्ट के लिए समय सेट करें।',
    obNext:'अगला →', obBack:'←', obStart:'ऐप शुरू करें ✓',
    obName:'पूरा नाम', obNameP:'राम कुमार',
    obJob:'पद', obJobP:'कर्मचारी...',
    obCo:'कंपनी', obCoP:'ABC कंपनी',
    obShiftNum:'शिफ्ट की संख्या', obHours:'घंटे/शिफ्ट', obHoursCustom:'या दर्ज:', obHoursUnit:'घंटे/शिफ्ट',
    obWeeks:'सप्ताह/चक्र',
    obShiftCountry:'कार्यस्थल देश',
    days:['रविवार','सोमवार','मंगलवार','बुधवार','गुरुवार','शुक्रवार','शनिवार'],
    daysShort:['रवि','सोम','मंगल','बुध','गुरु','शुक्र','शनि'],
    months:['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'],
    salaryContract:'अनुबंध वेतन/माह', salaryDays:'मानक कार्य दिवस/माह',
    salaryEst:'इस महीने का अनुमानित वेतन', salaryNet:'अनुमानित शुद्ध वेतन',
    salarySave:'✓ वेतन जानकारी सहेजें',
    dpStatus:'स्थिति', dpActual:'वास्तविक समय', dpNote:'टिप्पणी',
    dpReset:'शिफ्ट पर रीसेट', dpCancel:'रद्द करें', dpSave:'सहेजें',
    dpTotalHours:'कुल:', dpOT:'ओवरटाइम:',
    dpInTime:'प्रवेश समय', dpOutTime:'प्रस्थान समय',
    dpNoteP:'इस दिन के लिए टिप्पणी जोड़ें...',
    stCM:'उपस्थित', stCMSub:'पूरी शिफ्ट की',
    stNP:'छुट्टी', stNPSub:'वेतन सहित छुट्टी',
    stV:'अनुपस्थित', stVSub:'बिना वेतन अनुपस्थित',
    stLL:'छुट्टी पर काम', stLLSub:'कानून के अनुसार',
    spPresent:'इस महीने उपस्थिति दिन', spStart:'काम का दिन शुरू करें',
    resetTitle:'सभी डेटा हटाएं?',
    resetDesc:'सभी डेटा स्थायी रूप से हटा दिया जाएगा। पुनः प्राप्त नहीं किया जा सकता!',
    resetCancel:'रद्द करें', resetOk:'🗑 सभी हटाएं',
    exportPreview:'निर्यात किए जाने वाले डेटा का पूर्वावलोकन:',
    exportBtn:'📊 Excel निर्यात (.csv)',
    n1Name:'शिफ्ट से 30 मिनट पहले याद दिलाएं', n1Desc:'शिफ्ट शुरू होने से पहले सूचना',
    n2Name:'30 मिनट बाद पुष्टि करें', n2Desc:'वास्तविक निकलने का समय पूछें',
    n3Name:'स्वचालित उपस्थिति (GPS)', n3Desc:'कार्यालय में प्रवेश/निकलने पर स्वतः रिकॉर्ड',
    n4Name:'साप्ताहिक सारांश', n4Desc:'हर शुक्रवार सारांश देखें',
    calEmpty:'इस महीने कोई डेटा नहीं', noData:'कोई डेटा नहीं',
    salaryDetail:'स्वतः गणना के लिए वेतन जानकारी भरें',
  },
};

/** Hàm dịch ngắn gọn: lấy chuỗi theo key từ bảng TRAN */
function T(key){ return (TRAN[userData.lang||'vi']||TRAN.vi)[key]||(TRAN.vi)[key]||key; }


/* ===== ĐA NGÔN NGỮ - DỊCH UI (6 ngôn ngữ) ===== */
/** Helper: set textContent cho element theo ID (an toàn, bỏ qua nếu null) */
function _s(id,txt){const el=document.getElementById(id);if(el&&txt!==undefined)el.textContent=txt;}
/** Helper: set innerHTML cho element theo ID (an toàn) */
function _h(id,html){const el=document.getElementById(id);if(el&&html!==undefined)el.innerHTML=html;}
/** Áp dụng bản dịch toàn bộ UI theo ngôn ngữ userData.lang
 * Gọi sau mỗi lần đổi ngôn ngữ hoặc khi initHome() */
function applyI18n(){
  const L=userData.lang||'vi'; // ngôn ngữ hiện tại
  const t=getLang();           // object bản dịch
  const s=_s; // global helper
  const h=_h; // global helper

  // App names
  document.querySelectorAll('.rgb-text').forEach(el=>el.textContent=t.appName);
  document.querySelectorAll('#homeAppTitle').forEach(el=>el.textContent=t.appName);
  document.title=t.appName;
  // Onboarding skip button
  const skipLbl={vi:'Bỏ qua',en:'Skip',ko:'건너뛰기',ja:'スキップ',zh:'跳过',my:'ကျော်',th:'ข้าม',id:'Lewati',ph:'Laktawan',ne:'छोड्नुस्',hi:'छोड़ें'};
  s('obSkipBtn',skipLbl[L]||skipLbl.vi);
  // About panel app name (not rgb-text)
  const aboutName=document.querySelector('#panelAbout .rgb-text');
  if(aboutName)aboutName.textContent=t.appName;

  // Home screen
  s('lblVaoCA',t.vaoCA); s('lblHetCA',t.hetCA);
  s('lastIn',t.batDauCa); s('lastOut',t.ketThucCa);
  s('todayStatus',t.chuaChamCong);
  s('meterTitle',t.gioLam);
  s('lblCM',t.coMat); s('lblV',t.vang); s('lblNP',t.nghiPhep); s('lblOT',t.tangCa);
  s('lblFuncTitle',t.chucNang);
  s('flLich',t.lich); s('flThietLap',t.thietLap); s('flGiaoDien',t.giaoDien);
  s('flCaiDat',t.caiDat); s('flLuong',t.luong); s('flExcel',t.xuatExcel);
  s('flThongBao',t.thongBao); s('flHuongDan',t.huongDan);
  s('flGPS',t.flGPS); s('flUtil',t.flUtil); s('flTax',t.flTax);
  s('flRelax',({vi:'Thư giãn',en:'Relax',ko:'휴식',ja:'リラックス',zh:'放松',my:'အနားယူ',th:'ผ่อนคลาย',id:'Relaks',ph:'Relax',ne:'आराम',hi:'आराम'}[L]||'Thư giãn'));
  if(t.taxTitle) s('taxTitle',t.taxTitle);
  if(t.utilTitle) s('utilTitle',t.utilTitle);
  if(t.utilEmptyTitle) s('utilEmptyTitle',t.utilEmptyTitle);
  if(t.utilEmptyDesc) s('utilEmptyDesc',t.utilEmptyDesc);
  s('lblSalaryCard',t.luongUocTinh);

  // Bottom nav labels
  document.querySelectorAll('.nav-lbl').forEach((el,i)=>{
    const lbls=[t.navHome,t.navLich,t.navLuong,t.navCaiDat];
    // Find which nav this is by sibling icon
    const icon=el.previousElementSibling?.textContent;
    if(icon==='🏠')el.textContent=t.navHome;
    else if(icon==='📅')el.textContent=t.navLich;
    else if(icon==='💰')el.textContent=t.navLuong;
    else if(icon==='⚙️')el.textContent=t.navCaiDat;
  });

  // Calendar screen
  s('calScreenTitle',t.lichChamCong);
  s('chipCM',t.chipCM); s('chipV',t.chipV); s('chipNP',t.chipNP); s('chipLL',t.chipLL);

  // Calendar day headers — cập nhật 7 span CN/T2.../T7
  // daysShort[0]=CN(Chủ nhật), [1]=T2, ..., [6]=T7
  const _ds = t.daysShort;
  [0,1,2,3,4,5,6].forEach(i=>{
    const el=document.getElementById('dowD'+i);
    if(el) el.textContent=_ds[i];
  });
  // Fallback: cập nhật qua querySelectorAll nếu id không tìm được
  const dow=document.getElementById('calDow');
  if(dow){
    const spans=dow.querySelectorAll('span');
    _ds.forEach((d,i)=>{if(spans[i])spans[i].textContent=d;});
  }
  // Cập nhật ô preview trong panel Giao diện (CN T2 T3 T4 T5 T6 T7)
  const _previewIds=['previewSun','previewD1','previewD2','previewD3','previewD4','previewD5','previewSat'];
  _previewIds.forEach((pid,i)=>{
    const pel=document.getElementById(pid);
    if(pel) pel.textContent=_ds[i];
  });
  // Đồng thời update mảng DAYS dùng trong renderCalBig và danh sách ngày
  if(typeof DAYS!=='undefined'&&DAYS.length===7) DAYS.splice(0,7,..._ds);
  window._DAYS_SHORT=_ds;

  // Settings screen
  s('settingsTitle',t.settingsTitle);
  // Settings items - find by structure
  document.querySelectorAll('.settings-item').forEach(item=>{
    const icon=item.querySelector('.si-icon')?.textContent?.trim();
    const name=item.querySelector('.si-name');
    const sub=item.querySelector('.si-sub');
    if(!name)return;
    if(icon==='🌐'){name.textContent=t.siLang;}
    else if(icon==='🗺️'){name.textContent=t.siCountry;}
    else if(icon==='📝'){name.textContent=t.siSetup;if(sub)sub.textContent=t.siSetupSub;}
    else if(icon==='🔔'){name.textContent=t.siNotif;if(sub)sub.textContent=t.siNotifSub;}
    else if(icon==='⭐'){name.textContent=t.siAppear;if(sub)sub.textContent=t.siAppearSub;}
    else if(icon==='ℹ️'){name.textContent=t.siAbout;if(sub)sub.textContent=t.siAboutSub;}
    else if(icon==='📖'){name.textContent=t.siHelp;if(sub)sub.textContent=t.siHelpSub;}
    else if(icon==='🗑️'){if(sub)sub.textContent=t.siDeleteSub;}
  });

  // Panel titles
  document.querySelectorAll('.panel-title').forEach(el=>{
    const txt=el.textContent.trim();
    if(txt.includes('Giao diện')||txt.includes('Appearance')||txt.includes('화면')||txt.includes('外観')||txt.includes('外观')||txt.includes('ဒီဇိုင်း'))el.textContent=t.panelAppear;
    else if(txt.includes('Thông báo')||txt.includes('Notif')||txt.includes('알림')||txt.includes('通知'))el.textContent=t.panelNotif;
    else if(txt.includes('Bảng lương')||txt.includes('Salary')||txt.includes('급여')||txt.includes('給与')||txt.includes('薪资')||txt.includes('လစာ'))el.textContent=t.panelSalary;
    else if(txt.includes('Excel'))el.textContent=t.panelExcel;
    else if(txt.includes('Thiết lập')||txt.includes('Setup')||txt.includes('정보 설정')||txt.includes('情報設定')||txt.includes('信息设置'))el.textContent=t.panelSetup;
    else if(txt.includes('Hướng dẫn')||txt.includes('Guide')||txt.includes('사용 가이드')||txt.includes('使用'))el.textContent=t.panelHelp;
    else if(txt.includes('Về ứng')||txt.includes('About')||txt.includes('앱 정보')||txt.includes('アプリ情報')||txt.includes('关于')||txt.includes('အပ်'))el.textContent=t.panelAbout;
    else if(txt.includes('ngôn ngữ')||txt.includes('Language')||txt.includes('언어')||txt.includes('言語')||txt.includes('语言')||txt.includes('ဘာသာ'))el.textContent=t.panelLang;
    else if(txt.includes('Quốc gia')||txt.includes('Country')||txt.includes('국가')||txt.includes('勤務国')||txt.includes('国家')||txt.includes('နိုင်ငံ'))el.textContent=t.panelCountry;
  });

  // Panel close buttons
  document.querySelectorAll('.panel-close').forEach(btn=>{if(btn.textContent==='✕'||btn.textContent===t.closeBtn)btn.textContent='✕';});

  // Notif panel rows
  // 4 dòng thông báo — dùng id trực tiếp thay vì querySelectorAll (tránh bị lệch index)
  _s('n1Name',t.n1Name); _s('n1Desc',t.n1Desc);
  _s('n2Name',t.n2Name); _s('n2Desc',t.n2Desc);
  _s('n3Name',t.n3Name); _s('n3Desc',t.n3Desc);
  _s('n4Name',t.n4Name); _s('n4Desc',t.n4Desc);
  // Tiêu đề panel thông báo
  _s('notifPanelTitle', '🔔 '+(t.panelNotif||t.panelNotif||'Cài đặt thông báo').replace('🔔 ',''));
  // Settings list - notif item
  _s('siNotifName', t.siNotif||'Cài đặt thông báo');
  _s('siNotifSub',  t.siNotifSub||'Nhắc giờ làm, tự động chấm công');

  // Salary panel
  document.querySelectorAll('.field-label').forEach(el=>{
    const txt=el.textContent;
    if(txt.includes('Lương hợp đồng')||txt.includes('Contract')||txt.includes('계약')||txt.includes('契約')||txt.includes('合同'))el.textContent=t.salaryContract;
    else if(txt.includes('Ngày công')||txt.includes('working day')||txt.includes('근무일')||txt.includes('勤務日')||txt.includes('工作天'))el.textContent=t.salaryDays;
  });

  // Reset confirm panel
  const rTitle=document.querySelector('#panelConfirmReset [style*="E8433A"]');
  if(rTitle)rTitle.textContent=t.resetTitle;
  const rDesc=document.querySelector('#panelConfirmReset [style*="text2"]');

  // Day panel labels
  s('dpStatusLbl',t.dpStatus); s('dpActualLbl',t.dpActual); s('dpNoteLbl',t.dpNote);
  s('dpInTimeLbl',t.dpInTime||'Giờ vào'); s('dpOutTimeLbl',t.dpOutTime||'Giờ ra');
  // Excel preview headers
  const _eh2={vi:['Ngày','Thứ','Trạng thái','Vào','Ra'],en:['Date','Day','Status','In','Out'],ko:['날짜','요일','상태','출근','퇴근'],ja:['日付','曜日','状態','出勤','退勤'],zh:['日期','星期','状态','上班','下班'],my:['ရက်','နေ့','အခြေ','တက်','ဆင်'],th:['วันที่','วัน','สถานะ','เข้า','ออก'],id:['Tanggal','Hari','Status','Masuk','Keluar'],ph:['Petsa','Araw','Katayuan','Pasok','Labas'],ne:['मिति','बार','अवस्था','प्रवेश','निस्किने'],hi:['तारीख','दिन','स्थिति','प्रवेश','प्रस्थान']}[L]||['Ngày','Thứ','Trạng thái','Vào','Ra'];
  s('exHNgay',_eh2[0]);s('exHThu',_eh2[1]);s('exHTT',_eh2[2]);s('exHVao',_eh2[3]);s('exHRa',_eh2[4]);
  const dayNote=document.getElementById('dayNote');if(dayNote)dayNote.placeholder=t.dpNoteP;
  const dayReset=document.getElementById('dayResetBtn');if(dayReset)dayReset.textContent=t.dpReset;
  const dayCancel=document.getElementById('dayCancelBtn');if(dayCancel)dayCancel.textContent=t.dpCancel;
  const daySave=document.getElementById('daySaveBtn');if(daySave)daySave.textContent=t.dpSave;

  // Update days/months arrays used by updateClock and renderCalBig
  window._DAYS=t.days;
  window._MONTHS=t.months;
  window._DAYS_SHORT=t.daysShort;
  // Also update the let variables directly so renderCalBig uses them immediately
  if(typeof DAYS!=='undefined')DAYS.splice(0,7,...t.daysShort);
  if(typeof MONTHS!=='undefined')MONTHS.splice(0,12,...t.months);

  // Appearance panel section titles
  const apSec={
    vi:{avt:'Ảnh đại diện',avtDesc:'Ảnh hiển thị trên trang chủ',avtBtn:'📷 Chọn ảnh',color:'Màu chủ đạo',bg:'Ảnh nền lịch',bgBtn:'📷 Chọn ảnh từ máy',bgClear:'✕ Xóa ảnh',gradient:'Màu nền gradient',calColor:'🎨 Màu chữ trong lịch',sunLbl:'Chủ nhật (CN)',sunSub:'Màu chữ ngày Chủ nhật',satLbl:'Thứ 7 (T7)',satSub:'Màu chữ ngày Thứ 7',normLbl:'Ngày thường (T2–T6)',normSub:'Màu chữ ngày trong tuần',reset:'↺ Đặt lại màu mặc định',save:'✓ Lưu giao diện'},
    en:{avt:'Avatar',avtDesc:'Photo shown on home screen',avtBtn:'📷 Choose photo',color:'Theme color',bg:'Calendar background',bgBtn:'📷 Choose from device',bgClear:'✕ Remove',gradient:'Gradient presets',calColor:'🎨 Calendar text colors',sunLbl:'Sunday (Sun)',sunSub:'Sunday text color',satLbl:'Saturday (Sat)',satSub:'Saturday text color',normLbl:'Weekdays (Mon–Fri)',normSub:'Weekday text color',reset:'↺ Reset to default',save:'✓ Save appearance'},
    ko:{avt:'아바타',avtDesc:'홈 화면에 표시되는 사진',avtBtn:'📷 사진 선택',color:'테마 색상',bg:'달력 배경',bgBtn:'📷 기기에서 선택',bgClear:'✕ 제거',gradient:'그라데이션 프리셋',calColor:'🎨 달력 텍스트 색상',sunLbl:'일요일 (일)',sunSub:'일요일 글자색',satLbl:'토요일 (토)',satSub:'토요일 글자색',normLbl:'평일 (월–금)',normSub:'평일 글자색',reset:'↺ 기본값으로',save:'✓ 저장'},
    ja:{avt:'アバター',avtDesc:'ホーム画面に表示する写真',avtBtn:'📷 写真を選択',color:'テーマカラー',bg:'カレンダー背景',bgBtn:'📷 端末から選択',bgClear:'✕ 削除',gradient:'グラデーション',calColor:'🎨 カレンダー文字色',sunLbl:'日曜日（日）',sunSub:'日曜の文字色',satLbl:'土曜日（土）',satSub:'土曜の文字色',normLbl:'平日（月〜金）',normSub:'平日の文字色',reset:'↺ デフォルトに戻す',save:'✓ 外観を保存'},
    zh:{avt:'头像',avtDesc:'显示在主页的照片',avtBtn:'📷 选择照片',color:'主题颜色',bg:'日历背景',bgBtn:'📷 从设备选择',bgClear:'✕ 删除',gradient:'渐变预设',calColor:'🎨 日历文字颜色',sunLbl:'周日（日）',sunSub:'周日文字颜色',satLbl:'周六（六）',satSub:'周六文字颜色',normLbl:'工作日（一–五）',normSub:'工作日文字颜色',reset:'↺ 重置为默认',save:'✓ 保存外观'},
    my:{avt:'ဓာတ်ပုံ',avtDesc:'မူလစာမျက်နှာတွင်ပြသ',avtBtn:'📷 ဓာတ်ပုံရွေး',color:'အရောင်',bg:'ပြက္ခဒိန်နောက်ခံ',bgBtn:'📷 ထည့်သွင်း',bgClear:'✕ ဖျက်',gradient:'Gradient',calColor:'🎨 ပြက္ခဒိန်အရောင်',sunLbl:'တနင်္ဂနွေ',sunSub:'တနင်္ဂနွေ',satLbl:'စနေ',satSub:'စနေ',normLbl:'ပုံမှန်ရက်',normSub:'ပုံမှန်',reset:'↺ မူရင်းပြန်',save:'✓ သိမ်း'},
    th:{avt:'รูปโปรไฟล์',avtDesc:'รูปที่แสดงบนหน้าหลัก',avtBtn:'📷 เลือกรูป',color:'สีธีม',bg:'พื้นหลังปฏิทิน',bgBtn:'📷 เลือกจากอุปกรณ์',bgClear:'✕ ลบ',gradient:'พื้นหลัง Gradient',calColor:'🎨 สีข้อความในปฏิทิน',sunLbl:'วันอาทิตย์',sunSub:'สีข้อความวันอาทิตย์',satLbl:'วันเสาร์',satSub:'สีข้อความวันเสาร์',normLbl:'วันธรรมดา (จ–ศ)',normSub:'สีข้อความวันธรรมดา',reset:'↺ รีเซ็ตเป็นค่าเริ่มต้น',save:'✓ บันทึกธีม'},
    id:{avt:'Avatar',avtDesc:'Foto ditampilkan di beranda',avtBtn:'📷 Pilih foto',color:'Warna tema',bg:'Latar kalender',bgBtn:'📷 Pilih dari perangkat',bgClear:'✕ Hapus',gradient:'Preset Gradient',calColor:'🎨 Warna teks kalender',sunLbl:'Minggu',sunSub:'Warna teks Minggu',satLbl:'Sabtu',satSub:'Warna teks Sabtu',normLbl:'Hari kerja (Sen–Jum)',normSub:'Warna teks hari kerja',reset:'↺ Reset ke default',save:'✓ Simpan tampilan'},
    ph:{avt:'Avatar',avtDesc:'Larawan na ipinapakita sa home',avtBtn:'📷 Pumili ng larawan',color:'Kulay ng tema',bg:'Background ng kalendaryo',bgBtn:'📷 Pumili mula sa device',bgClear:'✕ Alisin',gradient:'Mga Gradient preset',calColor:'🎨 Mga kulay ng teksto ng kalendaryo',sunLbl:'Linggo',sunSub:'Kulay ng teksto ng Linggo',satLbl:'Sabado',satSub:'Kulay ng teksto ng Sabado',normLbl:'Mga araw ng trabaho (Lun–Biy)',normSub:'Kulay ng teksto ng araw ng trabaho',reset:'↺ I-reset sa default',save:'✓ I-save ang hitsura'},
    ne:{avt:'अवतार',avtDesc:'गृह पृष्ठमा देखिने फोटो',avtBtn:'📷 फोटो छान्नुस्',color:'थिम रंग',bg:'क्यालेन्डर पृष्ठभूमि',bgBtn:'📷 उपकरणबाट छान्नुस्',bgClear:'✕ हटाउनुस्',gradient:'Gradient प्रिसेट',calColor:'🎨 क्यालेन्डर पाठ रंग',sunLbl:'आइतबार',sunSub:'आइतबार पाठ रंग',satLbl:'शनिबार',satSub:'शनिबार पाठ रंग',normLbl:'कार्यदिन (सोम–शुक्र)',normSub:'कार्यदिन पाठ रंग',reset:'↺ डिफल्टमा रिसेट',save:'✓ थिम सुरक्षित गर्नुस्'},
    hi:{avt:'अवतार',avtDesc:'होम स्क्रीन पर दिखाई जाने वाली फ़ोटो',avtBtn:'📷 फ़ोटो चुनें',color:'थीम रंग',bg:'कैलेंडर पृष्ठभूमि',bgBtn:'📷 डिवाइस से चुनें',bgClear:'✕ हटाएं',gradient:'Gradient प्रीसेट',calColor:'🎨 कैलेंडर पाठ रंग',sunLbl:'रविवार',sunSub:'रविवार पाठ रंग',satLbl:'शनिवार',satSub:'शनिवार पाठ रंग',normLbl:'कार्यदिवस (सोम–शुक्र)',normSub:'कार्यदिवस पाठ रंग',reset:'↺ डिफ़ॉल्ट पर रीसेट',save:'✓ थीम सहेजें'},
  };
  const av=apSec[L]||apSec.vi;
  // Tiêu đề panel Giao diện
  _s('appearPanelTitle', '⭐ '+(t.panelAppear||'Chỉnh sửa giao diện').replace(/^⭐\s*/,''));
  // Settings list — appearance item
  _s('siAppearName', t.siAppear||'Chỉnh sửa giao diện');
  _s('siAppearSub2', t.siAppearSub||'Màu sắc, ảnh đại diện, ảnh nền');
  // Text "Chưa có ảnh nền" trong preview vùng ảnh
  _s('apBgPreviewTxt', u('appear.no_bg'));
  s('apSecAvt',      u('appear.avatar'));
  s('apSecColor',    u('appear.color'));
  s('apSecBg',       u('appear.bg'));
  s('apSecGradient', u('appear.gradient'));
  s('apAvtDesc',     u('appear.avt_desc'));
  s('btnChooseAvt',  u('appear.btn_choose'));
  s('btnChooseImg',  u('appear.btn_bg'));
  s('btnClearBg',    u('appear.btn_clear'));
  s('calColorSunLbl',av.sunLbl); s('calColorSunSub',av.sunSub);
  s('calColorSatLbl',av.satLbl); s('calColorSatSub',av.satSub);
  s('calColorNormLbl',av.normLbl); s('calColorNormSub',av.normSub);
  s('btnSaveAppear',  u('appear.save'));
  // Excel panel labels
  _s('excelPanelTitle',  '📊 '+(t.xuatExcel||'Xuất Excel'));
  _s('excelPreviewLbl',  t.exportPreview||'Xem trước dữ liệu xuất ra:');
  _s('excelExportBtn',   t.exportBtn||'📊 Xuất file Excel (.csv)');

  // Setup panel labels
  const sp2={
    vi:{name:'Họ và tên',nameP:'Nguyễn Văn A',job:'Chức vụ',jobP:'Nhân viên...',co:'Công ty',coP:'Công ty ABC',shift:'Số ca làm việc',hours:'Số giờ / ca',save:'✓ Lưu thông tin'},
    en:{name:'Full Name',nameP:'John Smith',job:'Job Title',jobP:'Employee...',co:'Company',coP:'ABC Company',shift:'Number of shifts',hours:'Hours / shift',save:'✓ Save Info'},
    ko:{name:'성명',nameP:'홍길동',job:'직책',jobP:'직원...',co:'회사',coP:'ABC 회사',shift:'교대 수',hours:'교대당 시간',save:'✓ 저장'},
    ja:{name:'氏名',nameP:'山田太郎',job:'職種',jobP:'社員...',co:'会社名',coP:'ABC株式会社',shift:'シフト数',hours:'時間/シフト',save:'✓ 保存'},
    zh:{name:'姓名',nameP:'张伟',job:'职位',jobP:'员工...',co:'公司',coP:'ABC公司',shift:'班次数量',hours:'每班时长',save:'✓ 保存信息'},
    my:{name:'အမည်',nameP:'ကိုစိုး',job:'ရာထူး',jobP:'ဝန်ထမ်း...',co:'ကုမ္ပဏီ',coP:'ABC',shift:'Shift',hours:'နာရီ',save:'✓ သိမ်း'},
    th:{name:'ชื่อ-นามสกุล',nameP:'สมชาย ใจดี',job:'ตำแหน่งงาน',jobP:'พนักงาน...',co:'บริษัท',coP:'บริษัท ABC',shift:'จำนวนกะ',hours:'ชั่วโมง/กะ',save:'✓ บันทึกข้อมูล'},
    id:{name:'Nama Lengkap',nameP:'Budi Santoso',job:'Jabatan',jobP:'Karyawan...',co:'Perusahaan',coP:'PT ABC',shift:'Jumlah shift',hours:'Jam/shift',save:'✓ Simpan info'},
    ph:{name:'Buong Pangalan',nameP:'Juan dela Cruz',job:'Trabaho',jobP:'Empleyado...',co:'Kumpanya',coP:'ABC Corp',shift:'Bilang ng shift',hours:'Oras/shift',save:'✓ I-save'},
    ne:{name:'पूरा नाम',nameP:'राम श्रेष्ठ',job:'पद',jobP:'कर्मचारी...',co:'कम्पनी',coP:'ABC कम्पनी',shift:'सिफ्ट संख्या',hours:'घण्टा/सिफ्ट',save:'✓ सुरक्षित गर्नुस्'},
    hi:{name:'पूरा नाम',nameP:'राम कुमार',job:'पद',jobP:'कर्मचारी...',co:'कंपनी',coP:'ABC कंपनी',shift:'शिफ्ट की संख्या',hours:'घंटे/शिफ्ट',save:'✓ जानकारी सहेजें'},
  };
  const sv2=sp2[L]||sp2.vi;
  s('setupLblName',  u('setup.name'));
  s('setupLblJob',   u('setup.job'));
  s('setupLblCo',    u('setup.company'));
  s('setupLblShift', u('setup.shifts'));
  s('setupLblHours', u('setup.hours'));
  s('btnSaveSetup',  u('setup.save'));
  // Số tuần một vòng + nghỉ giữa giờ
  const _setupT = {
    weeks:    {vi:'Số tuần một vòng',         en:'Weeks per rotation',         ko:'순환 주 수',          ja:'ローテーション週数',         zh:'轮班周数',                 my:'အပတ်လည်ပတ်',th:'สัปดาห์/รอบ',id:'Minggu/siklus',ph:'Linggo/siklo',ne:'हप्ता/चक्र',hi:'सप्ताह/चक्र'},
    break:    {vi:'Có nghỉ giữa giờ không?',  en:'Any break time?',            ko:'중간 휴식 있나요?',   ja:'休憩時間ありますか？',       zh:'有中途休息吗？',           my:'အကြားနားချိန်ရှိပါသလား?',th:'มีเวลาพักไหม?',id:'Ada waktu istirahat?',ph:'May break?',ne:'बिश्राम छ?',hi:'कोई ब्रेक है?'},
    no:       {vi:'Không',                    en:'No',                          ko:'아니오',              ja:'なし',                       zh:'没有',                     my:'မရှိ',th:'ไม่',id:'Tidak',ph:'Hindi',ne:'छैन',hi:'नहीं'},
    yes:      {vi:'Có',                       en:'Yes',                         ko:'예',                  ja:'あり',                       zh:'有',                       my:'ရှိ',th:'ใช่',id:'Ya',ph:'Oo',ne:'छ',hi:'हाँ'},
    breakMin: {vi:'Số phút nghỉ (sẽ trừ vào giờ thực tế)', en:'Break minutes (will subtract from worked hours)', ko:'휴식 분 (실제 근무시간에서 차감)', ja:'休憩時間（実働から差し引き）', zh:'休息分钟数（从实际工时扣除）', my:'အနားချိန် (အလုပ်ချိန်မှနုတ်)',th:'นาทีพัก (หักจากชั่วโมงทำงาน)',id:'Menit istirahat (dikurangi dari jam kerja)',ph:'Minuto ng pahinga (ibabawas sa oras ng trabaho)',ne:'बिश्राम मिनेट (काम घण्टाबाट घटाइन्छ)',hi:'ब्रेक मिनट (काम के घंटों से घटाया जाएगा)'},
  };
  _s('setupLblWeeks',    u('setup.weeks'));
  _s('setupLblBreak',    u('setup.break_q'));
  _s('brLblNo',          u('setup.break_no'));
  _s('brLblYes',         u('setup.break_yes'));
  _s('setupLblBreakMin', u('setup.break_min'));
  // Tuần này làm ca nào
  const _curShiftT = {vi:'Tuần này bạn làm ca nào?',en:'Which shift this week?',ko:'이번 주 어느 교대?',ja:'今週はどのシフト？',zh:'本周哪个班次？',my:'ဒီအပတ် ဘယ်ဆင်း?',th:'สัปดาห์นี้กะอะไร?',id:'Shift minggu ini?',ph:'Anong shift ngayong linggo?',ne:'यो हप्ता कुन सिफ्ट?',hi:'इस सप्ताह कौन सी शिफ्ट?'};
  _s('setupLblCurShift', u('setup.which_shift'));
  // Re-render lại label các nút "Ca 1, Ca 2..." theo ngôn ngữ mới
  if(typeof renderSetupCurShift === 'function' && document.getElementById('setupCurShiftGrid')) renderSetupCurShift();
  const sn=document.getElementById('setupName');if(sn)sn.placeholder=sv2.nameP;
  const sj=document.getElementById('setupJob');if(sj)sj.placeholder=sv2.jobP;
  const sc=document.getElementById('setupCo');if(sc)sc.placeholder=sv2.coP;

  // Delete row in settings
  const delName={vi:'Xóa toàn bộ dữ liệu',en:'Delete All Data',ko:'모든 데이터 삭제',ja:'全データ削除',zh:'删除所有数据',my:'ဒေတာဖျက်',th:'ลบข้อมูลทั้งหมด',id:'Hapus Semua Data',ph:'Burahin Lahat ng Data',ne:'सबै डेटा मेटाउनुस्',hi:'सभी डेटा हटाएं'};
  s('siDeleteName',delName[L]||delName.vi);
  // Mô tả xóa dữ liệu (dòng phụ trong settings + nội dung trong panel confirm)
  const delSubMap={vi:'Không thể khôi phục',en:'Cannot be recovered',ko:'복구 불가',ja:'元に戻せません',zh:'无法恢复',my:'ပြန်မရနိုင်',th:'กู้คืนไม่ได้',id:'Tidak dapat dipulihkan',ph:'Hindi mababawi',ne:'पुनः प्राप्त हुँदैन',hi:'पुनः प्राप्त नहीं किया जा सकता'};
  s('siDeleteSub', delSubMap[L]||delSubMap.vi);
  // Đoạn mô tả trong panel xác nhận xóa (có html bold nên dùng innerHTML)
  const resetDescEl=document.getElementById('resetDescTxt');
  if(resetDescEl){
    const rd={
      vi:'Tất cả dữ liệu chấm công, cài đặt và thông tin cá nhân sẽ bị xóa vĩnh viễn.<br><strong>Không thể khôi phục!</strong>',
      en:'All attendance data, settings and personal info will be permanently deleted.<br><strong>Cannot be recovered!</strong>',
      ko:'모든 출퇴근 데이터, 설정 및 개인 정보가 영구적으로 삭제됩니다.<br><strong>복구할 수 없습니다!</strong>',
      ja:'全ての打刻データ、設定、個人情報が永久に削除されます。<br><strong>元に戻せません！</strong>',
      zh:'所有考勤数据、设置和个人信息将被永久删除。<br><strong>无法恢复！</strong>',
      my:'ဒေတာ၊ ဆက်တင်နှင့် ကိုယ်ရေးအချက်အလက်အားလုံး ဖျက်မည်။<br><strong>ပြန်မရနိုင်!</strong>',th:'ข้อมูลทั้งหมดจะถูกลบถาวร<br><strong>ไม่สามารถกู้คืนได้!</strong>',id:'Semua data akan dihapus permanen.<br><strong>Tidak dapat dipulihkan!</strong>',ph:'Lahat ng data ay permanenteng mabubura.<br><strong>Hindi na mababawi!</strong>',ne:'सबै डेटा स्थायी रूपमा मेटिनेछ।<br><strong>पुनः प्राप्त गर्न सकिँदैन!</strong>',hi:'सभी डेटा स्थायी रूप से हटा दिया जाएगा।<br><strong>पुनः प्राप्त नहीं किया जा सकता!</strong>'
    };
    resetDescEl.innerHTML=rd[L]||rd.vi;
  }

  // ===== GPS PANEL TRANSLATIONS =====
  const gpsT = {
    vi:{section:'📍 VỊ TRÍ CÔNG TY', radius:'Bán kính phát hiện', checkinLbl:'⏱️ Phút xác nhận VÀO ca', checkoutLbl:'⏱️ Phút xác nhận HẾT ca', btnGet:'📍 Lấy vị trí hiện tại',
      permTitle:'⚠️ Chrome chặn GPS với file cục bộ',
      permBody:'Chrome trên điện thoại không cho phép GPS khi mở file .html trực tiếp.<br><br><b>Giải pháp nhanh:</b> Nhập tọa độ công ty thủ công 👇',
      manualTitle:'🗺️ NHẬP TỌA ĐỘ THỦ CÔNG',
      manualHint:'Mở <b>Google Maps</b> → nhấn giữ vị trí công ty → copy tọa độ',
      lat:'Vĩ độ (Latitude)', lng:'Kinh độ (Longitude)', saveManual:'✓ Lưu vị trí công ty',
      manualFooter:'📌 Cách lấy tọa độ: Mở <b>Google Maps</b> → tìm công ty → nhấn giữ → copy 2 số xuất hiện',
      hostTitle:'🌐 Cấp quyền GPS tự động',
      tip:'💡 Sau khi lưu vị trí, app dùng GPS điện thoại để kiểm tra khoảng cách và tự chấm công.',
      noSetup:'Chưa thiết lập vị trí công ty', notSupport:'Thiết bị không hỗ trợ GPS',
      loading:'⏳ Đang lấy vị trí...', denied:'GPS bị từ chối. Vui lòng nhập tọa độ thủ công.'},
    en:{section:'📍 COMPANY LOCATION', radius:'Detection radius', checkinLbl:'⏱️ Check-in confirm (min)', checkoutLbl:'⏱️ Check-out confirm (min)', btnGet:'📍 Get current location',
      permTitle:'⚠️ Chrome blocks GPS for local files',
      permBody:'Chrome on mobile does not allow GPS when opening .html files directly.<br><br><b>Quick fix:</b> Enter company coordinates manually 👇',
      manualTitle:'🗺️ MANUAL COORDINATES',
      manualHint:'Open <b>Google Maps</b> → long press company location → copy coordinates',
      lat:'Latitude', lng:'Longitude', saveManual:'✓ Save company location',
      manualFooter:'📌 How to get coordinates: Open <b>Google Maps</b> → find company → long press → copy 2 numbers',
      hostTitle:'🌐 Enable GPS automatically',
      tip:'💡 After saving location, app uses GPS to check distance and auto clock in/out.',
      noSetup:'Company location not set', notSupport:'Device does not support GPS',
      loading:'⏳ Getting location...', denied:'GPS denied. Please enter coordinates manually.'},
    ko:{section:'📍 회사 위치', radius:'감지 반경', checkinLbl:'⏱️ 출근 확인 (분)', checkoutLbl:'⏱️ 퇴근 확인 (분)', btnGet:'📍 현재 위치 가져오기',
      permTitle:'⚠️ Chrome이 로컬 파일의 GPS를 차단함',
      permBody:'Chrome 모바일은 .html 파일을 직접 열면 GPS를 허용하지 않습니다.<br><br><b>빠른 해결책:</b> 회사 좌표를 수동으로 입력하세요 👇',
      manualTitle:'🗺️ 수동 좌표 입력',
      manualHint:'<b>Google Maps</b> 열기 → 회사 위치 길게 누르기 → 좌표 복사',
      lat:'위도 (Latitude)', lng:'경도 (Longitude)', saveManual:'✓ 회사 위치 저장',
      manualFooter:'📌 좌표 얻기: <b>Google Maps</b> → 회사 찾기 → 길게 누르기 → 숫자 2개 복사',
      hostTitle:'🌐 GPS 자동 허용',
      tip:'💡 위치 저장 후 앱이 GPS로 거리를 확인하여 자동 출퇴근합니다.',
      noSetup:'회사 위치가 설정되지 않음', notSupport:'기기가 GPS를 지원하지 않음',
      loading:'⏳ 위치 가져오는 중...', denied:'GPS 거부됨. 수동으로 좌표를 입력하세요.'},
    ja:{section:'📍 会社の位置', radius:'検出半径', checkinLbl:'⏱️ 出勤確認 (分)', checkoutLbl:'⏱️ 退勤確認 (分)', btnGet:'📍 現在地を取得',
      permTitle:'⚠️ ChromeはローカルファイルのGPSをブロック',
      permBody:'Chromeモバイルは.htmlを直接開くとGPSを許可しません。<br><br><b>簡単な解決策:</b> 会社の座標を手動入力してください 👇',
      manualTitle:'🗺️ 手動座標入力',
      manualHint:'<b>Google Maps</b>を開く → 会社の場所を長押し → 座標をコピー',
      lat:'緯度 (Latitude)', lng:'経度 (Longitude)', saveManual:'✓ 会社の位置を保存',
      manualFooter:'📌 座標の取得: <b>Google Maps</b> → 会社を検索 → 長押し → 数字2つをコピー',
      hostTitle:'🌐 GPS自動許可',
      tip:'💡 位置保存後、アプリがGPSで距離を確認し自動打刻します。',
      noSetup:'会社の位置が未設定', notSupport:'デバイスがGPSをサポートしていません',
      loading:'⏳ 位置取得中...', denied:'GPS拒否されました。座標を手動入力してください。'},
    zh:{section:'📍 公司位置', radius:'检测半径', checkinLbl:'⏱️ 上班确认 (分钟)', checkoutLbl:'⏱️ 下班确认 (分钟)', btnGet:'📍 获取当前位置',
      permTitle:'⚠️ Chrome阻止本地文件的GPS',
      permBody:'Chrome手机版不允许直接打开.html文件时使用GPS。<br><br><b>快速解决方案:</b> 手动输入公司坐标 👇',
      manualTitle:'🗺️ 手动输入坐标',
      manualHint:'打开<b>Google Maps</b> → 长按公司位置 → 复制坐标',
      lat:'纬度 (Latitude)', lng:'经度 (Longitude)', saveManual:'✓ 保存公司位置',
      manualFooter:'📌 获取坐标: 打开<b>Google Maps</b> → 找到公司 → 长按 → 复制2个数字',
      hostTitle:'🌐 自动启用GPS',
      tip:'💡 保存位置后，应用通过GPS检查距离并自动打卡。',
      noSetup:'公司位置未设置', notSupport:'设备不支持GPS',
      loading:'⏳ 正在获取位置...', denied:'GPS被拒绝。请手动输入坐标。'},
    my:{section:'📍 ကုမ္ပဏီတည်နေရာ', radius:'သိရှိနိုင်သောအချင်း', btnGet:'📍 လက်ရှိတည်နေရာ',
      checkinLbl:'⏱️ မိနစ် — VÀO ca အတည်ပြု', checkoutLbl:'⏱️ မိနစ် — HẾT ca အတည်ပြု',
      permTitle:'⚠️ Chrome GPS ကိုပိတ်ထားသည်',
      permBody:'.html ဖိုင်ကိုတိုက်ရိုက်ဖွင့်သောအခါ GPS ခွင့်မပြု<br><br><b>အမြန်ဖြေရှင်းချက်:</b> ကုမ္ပဏီကိုဩဒိနိတ် ထည့်ပါ 👇',
      manualTitle:'🗺️ ကိုဩဒိနိတ် ထည့်ပါ',
      manualHint:'<b>Google Maps</b> ဖွင့် → ကုမ္ပဏီနေရာ နှိပ်ဆွဲ → ကိုဩဒိနိတ် ကူးယူ',
      lat:'အလျားဒီဂရီ (Latitude)', lng:'အကျယ်ဒီဂရီ (Longitude)', saveManual:'✓ ကုမ္ပဏီနေရာ သိမ်း',
      manualFooter:'📌 ကိုဩဒိနိတ်ရယူနည်း: <b>Google Maps</b> → ကုမ္ပဏီရှာ → နှိပ်ဆွဲ → ဂဏန်း ၂ ခုကူးယူ',
      hostTitle:'🌐 GPS အလိုအလျောက်ခွင့်ပြု',
      tip:'💡 နေရာသိမ်းပြီးနောက် app သည် GPS ဖြင့် တက်/ဆင်းမှတ်မည်',
      noSetup:'ကုမ္ပဏီနေရာ မသတ်မှတ်ရသေး', notSupport:'GPS ပံ့ပိုးမှုမရှိ',
      loading:'⏳ နေရာရယူနေသည်...', denied:'GPS ငြင်းဆန်ခြင်း။ ကိုဩဒိနိတ် ထည့်ပါ'},
    th:{section:'📍 ที่ตั้งบริษัท', radius:'รัศมีตรวจจับ', btnGet:'📍 รับตำแหน่งปัจจุบัน',
      checkinLbl:'⏱️ นาทียืนยันเข้างาน', checkoutLbl:'⏱️ นาทียืนยันออกงาน',
      permTitle:'⚠️ Chrome ปิดกั้น GPS สำหรับไฟล์ในเครื่อง',
      permBody:'Chrome มือถือไม่อนุญาต GPS เมื่อเปิดไฟล์ .html โดยตรง<br><br><b>แก้ไขด่วน:</b> ลองเปิดผ่าน HTTPS',
      manualTitle:'🗺️ กรอกพิกัดด้วยตนเอง',
      manualHint:'เปิด <b>Google Maps</b> → กดค้างที่ตำแหน่งบริษัท → คัดลอกพิกัด',
      lat:'ละติจูด (Latitude)', lng:'ลองจิจูด (Longitude)', saveManual:'✓ บันทึกตำแหน่งบริษัท',
      manualFooter:'📌 วิธีรับพิกัด: เปิด <b>Google Maps</b> → ค้นหาบริษัท → กดค้าง → คัดลอก 2 ตัวเลข',
      hostTitle:'🌐 เปิดใช้ GPS อัตโนมัติ',
      tip:'💡 หลังบันทึกตำแหน่ง แอปจะใช้ GPS ตรวจสอบระยะทางและเช็คชื่ออัตโนมัติ',
      noSetup:'ยังไม่ได้ตั้งค่าตำแหน่งบริษัท', notSupport:'อุปกรณ์ไม่รองรับ GPS',
      loading:'⏳ กำลังรับตำแหน่ง...', denied:'GPS ถูกปฏิเสธ กรุณากรอกพิกัดด้วยตนเอง'},
    id:{section:'📍 LOKASI PERUSAHAAN', radius:'Radius deteksi', btnGet:'📍 Dapatkan lokasi saat ini',
      checkinLbl:'⏱️ Menit konfirmasi MASUK', checkoutLbl:'⏱️ Menit konfirmasi KELUAR',
      permTitle:'⚠️ Chrome memblokir GPS untuk file lokal',
      permBody:'Chrome mobile tidak mengizinkan GPS saat membuka file .html langsung<br><br><b>Solusi cepat:</b> Buka melalui HTTPS',
      manualTitle:'🗺️ MASUKKAN KOORDINAT MANUAL',
      manualHint:'Buka <b>Google Maps</b> → tekan lama lokasi perusahaan → salin koordinat',
      lat:'Latitude', lng:'Longitude', saveManual:'✓ Simpan lokasi perusahaan',
      manualFooter:'📌 Cara mendapatkan koordinat: Buka <b>Google Maps</b> → cari perusahaan → tekan lama → salin 2 angka',
      hostTitle:'🌐 Aktifkan GPS otomatis',
      tip:'💡 Setelah menyimpan lokasi, app menggunakan GPS untuk memeriksa jarak dan absen otomatis.',
      noSetup:'Lokasi perusahaan belum diatur', notSupport:'Perangkat tidak mendukung GPS',
      loading:'⏳ Mendapatkan lokasi...', denied:'GPS ditolak. Silakan masukkan koordinat secara manual.'},
    ph:{section:'📍 LOKASYON NG KUMPANYA', radius:'Radius ng pagtuklas', btnGet:'📍 Kunin ang kasalukuyang lokasyon',
      checkinLbl:'⏱️ Minuto para kumpirmahin ang PASOK', checkoutLbl:'⏱️ Minuto para kumpirmahin ang LABAS',
      permTitle:'⚠️ Hinaharangan ng Chrome ang GPS para sa lokal na mga file',
      permBody:'Hindi pinapayagan ng Chrome mobile ang GPS kapag direktang binubuksan ang .html file<br><br><b>Mabilis na solusyon:</b> Buksan sa pamamagitan ng HTTPS',
      manualTitle:'🗺️ MAGLAGAY NG KOORDINASYON NG KAMAY',
      manualHint:'Buksan ang <b>Google Maps</b> → matagal na pindutin ang lokasyon ng kumpanya → kopyahin ang koordinasyon',
      lat:'Latitude', lng:'Longitude', saveManual:'✓ I-save ang lokasyon ng kumpanya',
      manualFooter:'📌 Paraan ng pagkuha ng koordinasyon: Buksan ang <b>Google Maps</b> → hanapin ang kumpanya → matagal na pindutin → kopyahin ang 2 numero',
      hostTitle:'🌐 I-enable ang GPS awtomatiko',
      tip:'💡 Pagkatapos i-save ang lokasyon, gagamitin ng app ang GPS upang suriin ang distansya at awtomatikong mag-record.',
      noSetup:'Hindi pa naitakda ang lokasyon ng kumpanya', notSupport:'Hindi sinusuportahan ng device ang GPS',
      loading:'⏳ Kinukuha ang lokasyon...', denied:'Tinanggihan ang GPS. Mangyaring ilagay ang mga koordinasyon nang mano-mano.'},
    ne:{section:'📍 कम्पनीको स्थान', radius:'पहिचान त्रिज्या', btnGet:'📍 हालको स्थान प्राप्त गर्नुस्',
      checkinLbl:'⏱️ हाजिर मिनेट पुष्टि', checkoutLbl:'⏱️ विदाइ मिनेट पुष्टि',
      permTitle:'⚠️ Chrome ले स्थानीय फाइलहरूको GPS ब्लक गर्छ',
      permBody:'Chrome मोबाइलले .html फाइल सिधै खोल्दा GPS अनुमति दिँदैन<br><br><b>द्रुत समाधान:</b> HTTPS मार्फत खोल्नुस्',
      manualTitle:'🗺️ म्यानुअल निर्देशांक प्रविष्ट गर्नुस्',
      manualHint:'<b>Google Maps</b> खोल्नुस् → कम्पनी स्थान लामो समय थिच्नुस् → निर्देशांक कोपी गर्नुस्',
      lat:'अक्षांश (Latitude)', lng:'देशान्तर (Longitude)', saveManual:'✓ कम्पनी स्थान सुरक्षित गर्नुस्',
      manualFooter:'📌 निर्देशांक कसरी पाउने: <b>Google Maps</b> खोल्नुस् → कम्पनी खोज्नुस् → लामो थिच्नुस् → २ संख्या कोपी गर्नुस्',
      hostTitle:'🌐 GPS स्वचालित रूपमा सक्षम गर्नुस्',
      tip:'💡 स्थान सुरक्षित गरेपछि, app ले GPS प्रयोग गरी दूरी जाँच्छ र स्वतः हाजिरी मार्छ।',
      noSetup:'कम्पनीको स्थान सेट गरिएको छैन', notSupport:'यन्त्रले GPS समर्थन गर्दैन',
      loading:'⏳ स्थान प्राप्त गर्दैछ...', denied:'GPS अस्वीकृत। कृपया निर्देशांक म्यानुअल रूपमा प्रविष्ट गर्नुस्।'},
    hi:{section:'📍 कंपनी का स्थान', radius:'पहचान त्रिज्या', btnGet:'📍 वर्तमान स्थान प्राप्त करें',
      checkinLbl:'⏱️ प्रवेश मिनट की पुष्टि', checkoutLbl:'⏱️ प्रस्थान मिनट की पुष्टि',
      permTitle:'⚠️ Chrome स्थानीय फ़ाइलों के लिए GPS ब्लॉक करता है',
      permBody:'Chrome मोबाइल .html फ़ाइल सीधे खोलने पर GPS की अनुमति नहीं देता<br><br><b>त्वरित समाधान:</b> HTTPS के माध्यम से खोलें',
      manualTitle:'🗺️ मैन्युअल निर्देशांक दर्ज करें',
      manualHint:'<b>Google Maps</b> खोलें → कंपनी स्थान को देर तक दबाएं → निर्देशांक कॉपी करें',
      lat:'अक्षांश (Latitude)', lng:'देशांतर (Longitude)', saveManual:'✓ कंपनी स्थान सहेजें',
      manualFooter:'📌 निर्देशांक कैसे प्राप्त करें: <b>Google Maps</b> → कंपनी खोजें → देर तक दबाएं → 2 संख्याएं कॉपी करें',
      hostTitle:'🌐 GPS स्वचालित रूप से सक्षम करें',
      tip:'💡 स्थान सहेजने के बाद, ऐप GPS से दूरी जांचता है और स्वचालित रूप से उपस्थिति दर्ज करता है।',
      noSetup:'कंपनी का स्थान निर्धारित नहीं है', notSupport:'डिवाइस GPS का समर्थन नहीं करता',
      loading:'⏳ स्थान प्राप्त हो रहा है...', denied:'GPS अस्वीकृत। कृपया निर्देशांक मैन्युअल रूप से दर्ज करें।'},
  };
  const gv = gpsT[L]||gpsT.vi;
  _s('gpsSectionTitle',      u('gps.section'));
  _s('gpsRadiusLbl',         u('gps.radius'));
  _s('gpsCheckinDelayLbl',   u('gps.checkin_lbl'));
  _s('gpsCheckoutDelayLbl',  u('gps.checkout_lbl'));
  _s('gpsTightCompanyLbl',   u('gps.tight_company_lbl'));
  _s('gpsTightCompanyHint',  u('gps.tight_company_hint'));
  _s('gpsBtnGetPos',         u('gps.btn_get'));
  _h('gpsPermTitle',    gv.permTitle);
  _h('gpsPermBody',     gv.permBody);
  _s('gpsManualTitle',  gv.manualTitle);
  _h('gpsManualHint',   gv.manualHint);
  _s('gpsLatLbl',       gv.lat);
  _s('gpsLngLbl',       gv.lng);
  _s('gpsBtnSaveManual',gv.saveManual);
  _h('gpsManualFooter', gv.manualFooter);
  _s('gpsHostTitle',    gv.hostTitle);
  _s('gpsTip',          u('gps.tip'));
  _s('gpsPanelTitle',   u('gps.panel_title'));
  _s('gpsAutoTitle',    u('gps.auto_title'));
  _s('gpsAutoSub',      u('gps.auto_sub'));

  // ═══ GPS v3 panel: Battery profile / Stats / Trail ═══
  _s('gpsV3BatteryTitle',    u('gpsv3.battery_title'));
  _s('gpsV3BatBtnNormal',    u('gpsv3.battery_normal'));
  _s('gpsV3BatBtnLow',       u('gpsv3.battery_low'));
  _s('gpsV3BatBtnCritical',  u('gpsv3.battery_min'));
  _s('gpsV3BatteryHint',     u('gpsv3.battery_hint'));
  _s('gpsV3StatsTitle',      u('gpsv3.stats_title'));
  _s('gpsV3StatsBtn',        u('gpsv3.refresh'));
  _s('gpsV3TrailTitle',      u('gpsv3.trail_title'));
  _s('gpsV3TrailBtn',        u('gpsv3.trail_today'));
  // Cập nhật placeholder text body chỉ khi đang ở placeholder mặc định (chưa load data)
  const v3statsBody = document.getElementById('gpsV3StatsBody');
  if(v3statsBody){
    const cur = v3statsBody.textContent || '';
    if(cur.includes('Bấm Refresh') || cur.includes('Tap Refresh') || cur.includes('새로고침을') || cur.includes('更新ボタン') || cur.includes('点击刷新')){
      v3statsBody.textContent = u('gpsv3.stats_empty');
    }
  }
  const v3trailBody = document.getElementById('gpsV3TrailBody');
  if(v3trailBody){
    const cur = v3trailBody.textContent || '';
    if(cur.includes('Bấm "Xem hôm nay"') || cur.includes('Tap "View today"') || cur.includes('"오늘 보기"') || cur.includes('「今日を表示」') || cur.includes('点击"查看今天"')){
      v3trailBody.textContent = u('gpsv3.trail_empty');
    }
  }

  // ═══ Smart Attendance panel (chấm công thông minh) ═══
  // Cập nhật saStatusText chỉ khi đang ở placeholder mặc định
  const saStatus = document.getElementById('saStatusText');
  if(saStatus){
    const _saTxt = saStatus.textContent || '';
    const _saPlaceholders = ['Chưa bật','Not enabled','비활성화','無効','未启用','ပိတ်ထား','ยังไม่เปิด','Belum aktif','Hindi pa naka-on','सक्षम छैन','सक्षम नहीं','Đang khởi động...','Starting...','시작 중...','起動中...','正在启动...','စတင်နေသည်...','กำลังเริ่มต้น...','Memulai...','Nagsisimula...','सुरु हुँदैछ...','प्रारंभ हो रहा...'];
    if(_saPlaceholders.indexOf(_saTxt) >= 0) saStatus.textContent = u('sa.status_off');
  }
  // Section headers: home/work profile titles+hints, signal debug
  _s('saHomeSectionTitle',   u('gps.home_title'));
  _s('saHomeSectionHint',    u('gps.home_hint'));
  _s('saWorkSectionTitle',   u('gps.work_title'));
  _s('saWorkSectionHint',    u('gps.work_hint'));
  _s('saSignalTitle',        u('gps.signal_title'));
  _s('saSignalRefreshBtn',   u('gps.signal_refresh'));
  // saSignalDebugBody placeholder
  const _saDbg = document.getElementById('saSignalDebugBody');
  if(_saDbg){
    const _dbgTxt = _saDbg.textContent || '';
    if(_dbgTxt.includes('Đang chờ') || _dbgTxt.includes('Waiting for') || _dbgTxt.includes('신호 대기') || _dbgTxt.includes('等待信号') || _dbgTxt.includes('Menunggu sinyal')){
      _saDbg.textContent = u('gps.signal_waiting');
    }
  }

  // Notification permission quick buttons
  _s('btnOpenNotifPerm',    u('perm.notif'));
  _s('btnOpenLocationPerm', u('perm.location'));
  _s('btnOpenBatteryPerm',  u('perm.battery'));
  // Cập nhật status text nếu đang hiện placeholder
  const gStEl=document.getElementById('gpsStatusTxt');
  if(gStEl && (gStEl.textContent.includes('Chưa thiết lập')||gStEl.textContent.includes('not set')||gStEl.textContent.includes('미설정')||gStEl.textContent.includes('未設定')||gStEl.textContent.includes('未设置')))
    gStEl.textContent=u('gps.no_setup');
  const sdEl=document.getElementById('salaryDetail');
  if(sdEl && (sdEl.textContent.includes('Nhập thông tin') || !sdEl.textContent.trim())){
    sdEl.textContent=t.salaryDetail||'Nhập thông tin lương để tính tự động';
  }
  // Panel lương — tiêu đề, nhãn thực nhận, nút lưu
  _s('salaryEstTitle', t.salaryEst||'Lương ước tính tháng này');
  _s('salaryNetLabel', t.salaryNet||'Thực nhận ước tính');
  _s('btnSaveSalary',  t.salarySave||'✓ Lưu thông tin lương');

  // ===== BẢNG GIỜ — toàn bộ label =====
  const _hT = {
    panelTitle: {vi:'💰 Bảng lương',en:'💰 Salary',ko:'💰 급여',ja:'💰 給与',zh:'💰 薪资',my:'💰 လစာ',th:'💰 เงินเดือน',id:'💰 Gaji',ph:'💰 Sahod',ne:'💰 तलब',hi:'💰 वेतन'},
    tabHours:   {vi:'⏱ Bảng giờ',  en:'⏱ Hours',  ko:'⏱ 근무시간',ja:'⏱ 勤務時間',zh:'⏱ 工时表',my:'⏱ နာရီ',th:'⏱ ชั่วโมง',id:'⏱ Jam',ph:'⏱ Oras',ne:'⏱ घण्टा',hi:'⏱ घंटे'},
    tabSalary:  {vi:'💵 Bảng lương',en:'💵 Salary', ko:'💵 급여',  ja:'💵 給与',  zh:'💵 薪资',  my:'💵 လစာ',th:'💵 เงินเดือน',id:'💵 Gaji',ph:'💵 Sahod',ne:'💵 तलब',hi:'💵 वेतन'},
    week:  {vi:'Tuần này',en:'This week',ko:'이번 주', ja:'今週',    zh:'本周',     my:'အပတ်',th:'สัปดาห์นี้',id:'Minggu ini',ph:'Linggong ito',ne:'यो हप्ता',hi:'इस सप्ताह'},
    month: {vi:'Tháng này',en:'This month',ko:'이번 달',ja:'今月',  zh:'本月',     my:'လ',th:'เดือนนี้',id:'Bulan ini',ph:'Ngayong buwan',ne:'यो महिना',hi:'इस महीने'},
    year:  {vi:'Năm nay', en:'This year',ko:'올해',   ja:'今年',    zh:'今年',     my:'နှစ်',th:'ปีนี้',id:'Tahun ini',ph:'Ngayong taon',ne:'यो वर्ष',hi:'इस वर्ष'},
    tongGio:  {vi:'Tổng giờ', en:'Total',     ko:'총 시간',  ja:'合計',  zh:'总时',  my:'စုစုပေါင်း',th:'รวมชั่วโมง',id:'Total jam',ph:'Kabuuang oras',ne:'जम्मा घण्टा',hi:'कुल घंटे'},
    ngayCong: {vi:'Ngày công',en:'Workdays',  ko:'근무일',  ja:'勤務日', zh:'工作日',my:'အလုပ်ရက်',th:'วันทำงาน',id:'Hari kerja',ph:'Araw ng trabaho',ne:'कार्य दिन',hi:'कार्य दिवस'},
    tangCa:   {vi:'Tăng ca',  en:'Overtime',  ko:'초과근무',ja:'残業',  zh:'加班',  my:'ချိန်ပို',th:'ล่วงเวลา',id:'Lembur',ph:'Overtime',ne:'ओभरटाइम',hi:'ओवरटाइम'},
    hLoai:  {vi:'Loại giờ',en:'Type',  ko:'구분', ja:'種類',  zh:'类型', my:'အမျိုးအစား',th:'ประเภท',id:'Jenis',ph:'Uri',ne:'प्रकार',hi:'प्रकार'},
    hGio:   {vi:'Giờ',     en:'Hour',  ko:'시간', ja:'時間',  zh:'小时', my:'နာရီ',th:'ชั่วโมง',id:'Jam',ph:'Oras',ne:'घण्टा',hi:'घंटे'},
    hNgay:  {vi:'Ngày',    en:'Day',   ko:'일',   ja:'日',    zh:'日',   my:'ရက်',th:'วัน',id:'Hari',ph:'Araw',ne:'दिन',hi:'दिन'},
    hTuan:  {vi:'Tuần',    en:'Week',  ko:'주',   ja:'週',    zh:'周',   my:'အပတ်',th:'สัปดาห์',id:'Minggu',ph:'Linggo',ne:'हप्ता',hi:'सप्ताह'},
    hThang: {vi:'Tháng',   en:'Month', ko:'월',   ja:'月',    zh:'月',   my:'လ',th:'เดือน',id:'Bulan',ph:'Buwan',ne:'महिना',hi:'माह'},
    rowBasic:{vi:'🟢 Giờ cơ bản',en:'🟢 Basic hours',ko:'🟢 기본 시간',ja:'🟢 基本時間',zh:'🟢 基本工时',my:'🟢 အခြေခံ',th:'🟢 ชั่วโมงปกติ',id:'🟢 Jam dasar',ph:'🟢 Oras base',ne:'🟢 आधारभूत',hi:'🟢 आधार घंटे'},
    rowOT:   {vi:'⚡ Tăng ca',   en:'⚡ Overtime',   ko:'⚡ 초과근무',  ja:'⚡ 残業',     zh:'⚡ 加班',     my:'⚡ ချိန်ပို',th:'⚡ ล่วงเวลา',id:'⚡ Lembur',ph:'⚡ Overtime',ne:'⚡ ओभरटाइम',hi:'⚡ ओवरटाइम'},
    rowNight:{vi:'🌙 Ca đêm',    en:'🌙 Night shift',ko:'🌙 야간근무', ja:'🌙 夜勤',    zh:'🌙 夜班',     my:'🌙 ညဆင်း',th:'🌙 กะกลางคืน',id:'🌙 Shift malam',ph:'🌙 Night shift',ne:'🌙 रात पाली',hi:'🌙 रात शिफ्ट'},
    rowHol:  {vi:'🎌 Ngày lễ',   en:'🎌 Holiday',    ko:'🎌 휴일근무', ja:'🎌 休日',    zh:'🎌 节假日',   my:'🎌 ရုံးပိတ်',th:'🎌 วันหยุด',id:'🎌 Libur',ph:'🎌 Holiday',ne:'🎌 बिदा',hi:'🎌 छुट्टी'},
    rowTotal:{vi:'📊 Tổng',      en:'📊 Total',      ko:'📊 합계',    ja:'📊 合計',    zh:'📊 总计',     my:'📊 စုစုပေါင်း',th:'📊 รวม',id:'📊 Total',ph:'📊 Kabuuan',ne:'📊 जम्मा',hi:'📊 कुल'},
  };
  _s('salaryPanelTitle', _hT.panelTitle[L]||_hT.panelTitle.vi);
  _s('tabHours',         _hT.tabHours[L]  ||_hT.tabHours.vi);
  _s('tabSalary',        _hT.tabSalary[L] ||_hT.tabSalary.vi);
  _s('pbWeek',           _hT.week[L]      ||_hT.week.vi);
  _s('pbMonth',          _hT.month[L]     ||_hT.month.vi);
  _s('pbYear',           _hT.year[L]      ||_hT.year.vi);
  _s('thTongGioLbl',     _hT.tongGio[L]   ||_hT.tongGio.vi);
  _s('thNgayCongLbl',    _hT.ngayCong[L]  ||_hT.ngayCong.vi);
  _s('thTangCaLbl',      _hT.tangCa[L]    ||_hT.tangCa.vi);
  _s('thHLoai',          _hT.hLoai[L]     ||_hT.hLoai.vi);
  _s('thHGio',           _hT.hGio[L]      ||_hT.hGio.vi);
  _s('thHNgay',          _hT.hNgay[L]     ||_hT.hNgay.vi);
  _s('thHTuan',          _hT.hTuan[L]     ||_hT.hTuan.vi);
  _s('thHThang',         _hT.hThang[L]    ||_hT.hThang.vi);
  _s('thRowBasicLbl',    _hT.rowBasic[L]  ||_hT.rowBasic.vi);
  _s('thRowOTLbl',       _hT.rowOT[L]     ||_hT.rowOT.vi);
  _s('thRowNightLbl',    _hT.rowNight[L]  ||_hT.rowNight.vi);
  _s('thRowHolLbl',      _hT.rowHol[L]    ||_hT.rowHol.vi);
  _s('thRowTotalLbl',    _hT.rowTotal[L]  ||_hT.rowTotal.vi);

  // Re-render các panel có nội dung động khi đổi ngôn ngữ
  if(document.getElementById('helpPanelBody')) renderHelpPanel();
  if(document.querySelector('#panelExcel.open')) renderExcelPreview();
  // Selector kiểu trả lương: Tháng / Ngày / Giờ
  const _smT={
    lbl: {vi:'Cách trả lương',en:'Payment method',ko:'급여 지급 방식',ja:'給与支払方法',zh:'薪资支付方式',my:'လစာပေးချေနည်း',th:'วิธีรับเงินเดือน',id:'Metode pembayaran',ph:'Paraan ng bayad',ne:'तलब भुक्तानी विधि',hi:'वेतन भुगतान विधि'},
    mo:  {vi:'Theo tháng',    en:'Monthly',       ko:'월급',          ja:'月給',         zh:'月薪',           my:'လစဉ်',th:'รายเดือน',id:'Bulanan',ph:'Buwanang',ne:'मासिक',hi:'मासिक'},
    da:  {vi:'Theo ngày',     en:'Daily',         ko:'일급',          ja:'日給',         zh:'日薪',           my:'နေ့စဉ်',th:'รายวัน',id:'Harian',ph:'Araw-araw',ne:'दैनिक',hi:'दैनिक'},
    ho:  {vi:'Theo giờ',      en:'Hourly',        ko:'시급',          ja:'時給',         zh:'时薪',           my:'နာရီ',th:'รายชั่วโมง',id:'Per jam',ph:'Bawat oras',ne:'प्रति घण्टा',hi:'प्रति घंटे'},
  };
  _s('salaryModeLbl', _smT.lbl[L]||_smT.lbl.vi);
  _s('smLblMonth',    _smT.mo[L]||_smT.mo.vi);
  _s('smLblDay',      _smT.da[L]||_smT.da.vi);
  _s('smLblHour',     _smT.ho[L]||_smT.ho.vi);
  // Cập nhật label input theo mode hiện tại
  if(typeof _salaryMode!=='undefined'){
    const _lblM={
      month:{vi:'Lương hợp đồng / tháng',en:'Contract salary / month',ko:'월 계약 급여',ja:'月額契約給与',zh:'合同月薪',my:'လစဉ်လစာ',th:'เงินเดือน/เดือน',id:'Gaji/bulan',ph:'Sahod/buwan',ne:'तलब/महिना',hi:'वेतन/माह'},
      day:  {vi:'Lương / ngày công',     en:'Salary / day',           ko:'일 급여',     ja:'日給',         zh:'日薪',     my:'နေ့စဉ်လစာ',th:'เงินค่าจ้าง/วัน',id:'Gaji/hari',ph:'Sahod/araw',ne:'तलब/दिन',hi:'वेतन/दिन'},
      hour: {vi:'Lương / giờ',           en:'Salary / hour',          ko:'시급',        ja:'時給',         zh:'时薪',     my:'နာရီလစာ',th:'เงินค่าจ้าง/ชั่วโมง',id:'Gaji/jam',ph:'Sahod/oras',ne:'तलब/घण्टा',hi:'वेतन/घंटे'},
    };
    _s('salaryContract2', _lblM[_salaryMode][L]||_lblM[_salaryMode].vi);
  }

  // Panel Về ứng dụng
  _s('aboutPanelTitle', 'ℹ️ '+(t.panelAbout||'Về ứng dụng').replace(/^ℹ️\s*/,''));
  const _ver={vi:'Phiên bản',en:'Version',ko:'버전',ja:'バージョン',zh:'版本',my:'ဗားရှင်း',th:'เวอร์ชัน',id:'Versi',ph:'Bersyon',ne:'संस्करण',hi:'संस्करण'}[L]||'Phiên bản';
  _s('aboutVersion', _ver+' 2.2.0');
  const _desc={
    vi:'App chấm công thông minh hỗ trợ đa ngôn ngữ, tính lương theo luật lao động 6 quốc gia. Dữ liệu lưu trên thiết bị, bảo mật tuyệt đối.',
    en:'Smart attendance app with multilingual support and salary calculation per labor law for 6 countries. Data stored locally on your device.',
    ko:'6개국 노동법에 따른 급여 계산을 지원하는 스마트 출퇴근 앱. 데이터는 기기에 로컬로 저장됩니다.',
    ja:'6か国の労働法に基づく給与計算に対応したスマート勤怠管理アプリ。データは端末内に保存されます。',
    zh:'支持6国劳动法薪资计算的智能考勤应用。数据存储在本地设备上，安全可靠。',
    my:'နိုင်ငံ ၆ ခု၏ အလုပ်သမားဥပဒေအတိုင်း လစာတွက်ချက်သောApp။ ဒေတာကိုကိရိယာပေါ်တွင်သိမ်းသည်။'
  }[L]||'';
  _s('aboutDesc', _desc);

  // Reset confirm panel buttons
  const resetBox=document.querySelector('#panelConfirmReset');
  if(resetBox){
    const rBtns=resetBox.querySelectorAll('button');
    const rCancel={vi:'Hủy bỏ',en:'Cancel',ko:'취소',ja:'キャンセル',zh:'取消',my:'ပယ်ဖျက်',th:'ยกเลิก',id:'Batal',ph:'Kanselahin',ne:'रद्द',hi:'रद्द करें'};
    const rOk={vi:'🗑 Xóa hết',en:'🗑 Delete All',ko:'🗑 모두 삭제',ja:'🗑 全て削除',zh:'🗑 全部删除',my:'🗑 ဖျက်',th:'🗑 ลบทั้งหมด',id:'🗑 Hapus Semua',ph:'🗑 Burahin Lahat',ne:'🗑 सबै मेटाउनुस्',hi:'🗑 सभी हटाएं'};
    if(rBtns[0])rBtns[0].textContent=rCancel[L]||rCancel.vi;
    if(rBtns[1])rBtns[1].textContent=rOk[L]||rOk.vi;
    const rTitle=resetBox.querySelector('[style*="E8433A"][style*="font-size:18px"]');
    const rTitleMap={vi:'Xóa toàn bộ dữ liệu?',en:'Delete all data?',ko:'모든 데이터를 삭제할까요?',ja:'全データを削除しますか？',zh:'删除所有数据？',my:'ဒေတာဖျက်မလား?',th:'ลบข้อมูลทั้งหมด?',id:'Hapus semua data?',ph:'Burahin ang lahat ng data?',ne:'सबै डेटा मेटाउने?',hi:'सभी डेटा हटाएं?'};
    if(rTitle)rTitle.textContent=rTitleMap[L]||rTitleMap.vi;
  }

  // Re-render if on cal screen
  if(document.getElementById('screenCal')?.classList.contains('active')){
    renderCalBig();
  }
  updateClock();

  // Sync i18n cho các UI mới của GPS v3 + Background notifications
  if(typeof syncGpsV3I18n === 'function') syncGpsV3I18n();
  if(typeof syncBgStatusI18n === 'function') syncBgStatusI18n();

  // Re-render các UI có nội dung động dùng helper i18n (_saB, u, getLang…).
  // Đảm bảo khi đổi ngôn ngữ là tất cả text user-visible refresh ngay, không phải tắt-mở app.
  try{ if(typeof saUpdateUI === 'function') saUpdateUI(); }catch(e){}
  try{ if(typeof saRenderHomeProfile === 'function') saRenderHomeProfile(); }catch(e){}
  try{ if(typeof saRenderWorkProfile === 'function') saRenderWorkProfile(); }catch(e){}
  try{ if(typeof saRenderSubWorkProfile === 'function') saRenderSubWorkProfile(); }catch(e){}
  try{ if(typeof updateGpsStatus === 'function') updateGpsStatus(); }catch(e){}
  try{ if(typeof renderHomeStats === 'function') renderHomeStats(); }catch(e){}
  try{ if(typeof renderHomeStatsActual === 'function') renderHomeStatsActual(); }catch(e){}
  try{ if(typeof renderSubJobSalary === 'function') renderSubJobSalary(); }catch(e){}
  try{ if(typeof renderCalDayList === 'function') renderCalDayList(); }catch(e){}
  try{ if(typeof updateTodayStatusTime === 'function') updateTodayStatusTime(); }catch(e){}
  // Salary panel — chỉ re-render khi đang mở (calcSalaryActual có side-effect)
  try{
    if(typeof calcSalaryActual === 'function' && document.querySelector('#panelSalary.open')){
      calcSalaryActual();
    }
  }catch(e){}
  // Đồng bộ ngôn ngữ sang native ngay → notification native cũng đổi theo
  try{
    if(window.ccNative && window.ccNative.syncNativeGps && window._gpsData){
      window.ccNative.syncNativeGps(window._gpsData);
    }
  }catch(e){}
}

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

