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

