function downloadPdf(){
  /* SAFE PDF EXPORT: không tạo HTML mới chứa script để tránh lỗi code rơi ra màn hình. */
  var oldTitle=document.title;
  var name=(document.getElementById('excelFilename')?.value||'ChamCong').trim();
  document.title=name;
  try{ window.print(); }
  finally{ setTimeout(function(){ document.title=oldTitle; },500); }
}

/* PATCH v2.2.3 — Hard-text i18n deep sync for GPS / Sub job / Salary / Calendar / Export */
(function(){
  const PACK={
    vi:{main:'Công việc chính',mainShort:'CHÍNH',sub:'Việc phụ',subShort:'PHỤ',hasSub:'💼 Có job phụ không?',subHelp:'Freelance, part-time, làm thêm...',subName:'TÊN CÔNG VIỆC PHỤ',subNamePh:'Freelance / Gia sư / Part-time...',subSalary:'LƯƠNG VIỆC PHỤ',hour:'/ giờ',day:'/ ngày',month:'/ tháng',hintHour:'Nhập lương theo giờ — tự tính theo số giờ làm thực tế',hintDay:'Nhập lương theo ngày công thực tế',hintMonth:'Nhập lương tháng cố định cho việc này',gpsAuto:'GPS tự động 출퇴근',gpsAutoSub:'Tự động vào/ra ca khi đến/rời công ty',gpsTarget:'🎯 GPS ÁP DỤNG CHO VIỆC',gpsSaved:'Đã lưu',gpsNotSaved:'Chưa lưu',gpsHint:'Chọn việc rồi bấm “Lấy vị trí hiện tại” để lưu GPS riêng cho việc đó.',companyLocation:'📍 Vị trí công ty',companyNoLocation:'Chưa thiết lập vị trí công ty',radius:'Cảm biến khoảng cách',checkinMin:'⏱️ Xác nhận vào ca (phút)',checkoutMin:'⏱️ Xác nhận ra ca (phút)',getLocation:'📍 Lấy vị trí hiện tại',clearLocation:'✕ Xóa',calendarText:'🎨 MÀU CHỮ TRONG LỊCH',sun:'Chủ nhật (CN)',sunSub:'Màu chữ ngày Chủ nhật',sat:'Thứ 7 (T7)',satSub:'Màu chữ ngày Thứ 7',normal:'Ngày thường (T2–T6)',normalSub:'Màu chữ ngày trong tuần',resetColor:'↺ Đặt lại màu mặc định',saveAppearance:'✓ Lưu giao diện',estNet:'Ước tính thực nhận',gross:'Tổng trước khấu trừ',combined:'Hợp nhất thu nhập (chính + phụ)',total:'Tổng',saveSalary:'✓ Lưu thông tin lương',format:'ĐỊNH DẠNG FILE',csv:'📊 Xuất file Excel (.csv)',pdf:'📄 Xuất file PDF',filter:'CHẾ ĐỘ XUẤT',all:'Tất cả',filename:'TÊN FILE'},
    ko:{main:'주업무',mainShort:'주업',sub:'부업',subShort:'부업',hasSub:'💼 부업이 있나요?',subHelp:'프리랜서, 파트타임, 추가 근무...',subName:'부업 이름',subNamePh:'프리랜서 / 과외 / 파트타임...',subSalary:'부업 급여',hour:'/ 시간',day:'/ 일',month:'/ 월',hintHour:'시간급 입력 — 실제 근무시간 기준 자동 계산',hintDay:'일급 입력 — 실제 근무일 기준 계산',hintMonth:'이 작업의 고정 월급 입력',gpsAuto:'GPS 자동 출퇴근',gpsAutoSub:'회사 도착/이탈 시 자동 출퇴근 처리',gpsTarget:'🎯 GPS 적용 작업',gpsSaved:'저장됨',gpsNotSaved:'미저장',gpsHint:'작업을 선택한 뒤 “현재 위치 가져오기”를 눌러 작업별 GPS를 저장하세요.',companyLocation:'📍 회사 위치',companyNoLocation:'회사 위치가 설정되지 않음',radius:'감지 반경',checkinMin:'⏱️ 출근 확인 (분)',checkoutMin:'⏱️ 퇴근 확인 (분)',getLocation:'📍 현재 위치 가져오기',clearLocation:'✕ 삭제',calendarText:'🎨 달력 글자색',sun:'일요일 (일)',sunSub:'일요일 글자색',sat:'토요일 (토)',satSub:'토요일 글자색',normal:'평일 (월–금)',normalSub:'평일 글자색',resetColor:'↺ 기본 색상으로 재설정',saveAppearance:'✓ 저장',estNet:'예상 실수령액',gross:'총액',combined:'합산 수입 (주업+부업)',total:'합계',saveSalary:'✓ 급여 정보 저장',format:'파일 형식',csv:'📊 Excel CSV 내보내기',pdf:'📄 PDF 내보내기',filter:'내보내기 모드',all:'전체',filename:'파일 이름'},
    en:{main:'Main job',mainShort:'MAIN',sub:'Sub job',subShort:'SUB',hasSub:'💼 Do you have a sub job?',subHelp:'Freelance, part-time, extra work...',subName:'SUB JOB NAME',subNamePh:'Freelance / Tutoring / Part-time...',subSalary:'SUB JOB SALARY',hour:'/ hour',day:'/ day',month:'/ month',hintHour:'Enter hourly rate — auto calculated from actual hours',hintDay:'Enter daily rate',hintMonth:'Enter fixed monthly salary for this job',gpsAuto:'Automatic GPS attendance',gpsAutoSub:'Auto check in/out when arriving/leaving company',gpsTarget:'🎯 GPS TARGET JOB',gpsSaved:'Saved',gpsNotSaved:'Not saved',gpsHint:'Select a job, then press “Get current location” to save GPS separately.',companyLocation:'📍 Company location',companyNoLocation:'Company location not set',radius:'Detection radius',checkinMin:'⏱️ Check-in confirm (min)',checkoutMin:'⏱️ Check-out confirm (min)',getLocation:'📍 Get current location',clearLocation:'✕ Clear',calendarText:'🎨 Calendar text colors',sun:'Sunday (Sun)',sunSub:'Sunday text color',sat:'Saturday (Sat)',satSub:'Saturday text color',normal:'Weekdays (Mon–Fri)',normalSub:'Weekday text color',resetColor:'↺ Reset default colors',saveAppearance:'✓ Save appearance',estNet:'Estimated net pay',gross:'Gross',combined:'Combined income (main + sub)',total:'Total',saveSalary:'✓ Save salary info',format:'FILE FORMAT',csv:'📊 Export Excel CSV',pdf:'📄 Export PDF',filter:'EXPORT MODE',all:'All',filename:'FILE NAME'},
    ja:{main:'本業',mainShort:'本業',sub:'副業',subShort:'副業',hasSub:'💼 副業がありますか？',subHelp:'フリーランス、パート、追加勤務...',subName:'副業名',subNamePh:'フリーランス / 家庭教師 / パート...',subSalary:'副業給与',hour:'/ 時間',day:'/ 日',month:'/ 月',hintHour:'時給を入力 — 実働時間で自動計算',hintDay:'日給を入力',hintMonth:'固定月給を入力',gpsAuto:'GPS自動出退勤',gpsAutoSub:'会社到着/退出時に自動処理',gpsTarget:'🎯 GPS適用ジョブ',gpsSaved:'保存済み',gpsNotSaved:'未保存',gpsHint:'ジョブを選択し「現在地を取得」でジョブ別GPSを保存します。',companyLocation:'📍 会社位置',companyNoLocation:'会社位置未設定',radius:'検出半径',checkinMin:'⏱️ 出勤確認（分）',checkoutMin:'⏱️ 退勤確認（分）',getLocation:'📍 現在地を取得',clearLocation:'✕ 削除',calendarText:'🎨 カレンダー文字色',sun:'日曜日（日）',sunSub:'日曜日の文字色',sat:'土曜日（土）',satSub:'土曜日の文字色',normal:'平日（月–金）',normalSub:'平日の文字色',resetColor:'↺ 既定色に戻す',saveAppearance:'✓ 保存',estNet:'推定手取り',gross:'総支給',combined:'合算収入（本業＋副業）',total:'合計',saveSalary:'✓ 給与情報を保存',format:'ファイル形式',csv:'📊 Excel CSV出力',pdf:'📄 PDF出力',filter:'出力モード',all:'すべて',filename:'ファイル名'},
    zh:{main:'主业',mainShort:'主业',sub:'副业',subShort:'副业',hasSub:'💼 有副业吗？',subHelp:'自由职业、兼职、额外工作...',subName:'副业名称',subNamePh:'自由职业 / 家教 / 兼职...',subSalary:'副业工资',hour:'/ 小时',day:'/ 天',month:'/ 月',hintHour:'输入时薪 — 按实际工时自动计算',hintDay:'输入日薪',hintMonth:'输入固定月薪',gpsAuto:'GPS自动打卡',gpsAutoSub:'到达/离开公司时自动打卡',gpsTarget:'🎯 GPS适用工作',gpsSaved:'已保存',gpsNotSaved:'未保存',gpsHint:'选择工作后点击“获取当前位置”分别保存GPS。',companyLocation:'📍 公司位置',companyNoLocation:'未设置公司位置',radius:'检测半径',checkinMin:'⏱️ 上班确认（分）',checkoutMin:'⏱️ 下班确认（分）',getLocation:'📍 获取当前位置',clearLocation:'✕ 删除',calendarText:'🎨 日历文字颜色',sun:'星期日（日）',sunSub:'星期日文字颜色',sat:'星期六（六）',satSub:'星期六文字颜色',normal:'工作日（一–五）',normalSub:'工作日文字颜色',resetColor:'↺ 恢复默认颜色',saveAppearance:'✓ 保存',estNet:'预计实收',gross:'税前总额',combined:'合并收入（主业+副业）',total:'合计',saveSalary:'✓ 保存工资信息',format:'文件格式',csv:'📊 导出 Excel CSV',pdf:'📄 导出 PDF',filter:'导出模式',all:'全部',filename:'文件名'},
    my:{main:'အဓိကအလုပ်',mainShort:'အဓိက',sub:'ဘေးအလုပ်',subShort:'ဘေး',hasSub:'💼 ဘေးအလုပ်ရှိပါသလား？',subHelp:'Freelance, part-time, အပိုအလုပ်...',subName:'ဘေးအလုပ် အမည်',subNamePh:'Freelance / Part-time...',subSalary:'ဘေးအလုပ် လစာ',hour:'/ နာရီ',day:'/ ရက်',month:'/ လ',hintHour:'နာရီလစာ — အမှန်တကယ်နာရီအလိုက် တွက်',hintDay:'နေ့စဉ်လစာ',hintMonth:'ဤအလုပ်အတွက် လချုပ်',gpsAuto:'GPS အလိုအလျောက်',gpsAutoSub:'ကုမ္ပဏီ ရောက်/ထွက်ချိန် အလိုအလျောက်',gpsTarget:'🎯 GPS အလုပ်',gpsSaved:'သိမ်းပြီး',gpsNotSaved:'မသိမ်းရသေး',gpsHint:'အလုပ်ရွေးပြီး „လက်ရှိနေရာ‟ ကိုနှိပ်ပါ။',companyLocation:'📍 ကုမ္ပဏီနေရာ',companyNoLocation:'ကုမ္ပဏီနေရာ မသတ်မှတ်ရသေး',radius:'ဖော်ထုတ်ရန် အကွာအဝေး',checkinMin:'⏱️ တက်အတည်ပြု (မိနစ်)',checkoutMin:'⏱️ ဆင်းအတည်ပြု (မိနစ်)',getLocation:'📍 လက်ရှိနေရာ',clearLocation:'✕ ဖျက်',calendarText:'🎨 ပြက္ခဒိန် စာသား',sun:'တနင်္ဂနွေ',sunSub:'တနင်္ဂနွေ စာသား',sat:'စနေ',satSub:'စနေ စာသား',normal:'ပုံမှန် (တ–သော)',normalSub:'ပုံမှန် စာသား',resetColor:'↺ မူရင်းအရောင်',saveAppearance:'✓ သိမ်း',estNet:'ခန့်မှန်း လက်ခံငွေ',gross:'စုစုပေါင်း',combined:'စုပေါင်းဝင်ငွေ',total:'စုစုပေါင်း',saveSalary:'✓ လစာ သိမ်း',format:'ဖိုင်ပုံစံ',csv:'📊 Excel CSV ထုတ်',pdf:'📄 PDF ထုတ်',filter:'ထုတ်နည်း',all:'အားလုံး',filename:'ဖိုင်အမည်'},
    th:{main:'งานหลัก',mainShort:'หลัก',sub:'งานเสริม',subShort:'เสริม',hasSub:'💼 มีงานเสริมไหม?',subHelp:'ฟรีแลนซ์, พาร์ทไทม์, งานพิเศษ...',subName:'ชื่องานเสริม',subNamePh:'ฟรีแลนซ์ / สอนพิเศษ / พาร์ทไทม์...',subSalary:'เงินเดือนงานเสริม',hour:'/ ชั่วโมง',day:'/ วัน',month:'/ เดือน',hintHour:'ใส่ค่าจ้างต่อชั่วโมง — คำนวณอัตโนมัติ',hintDay:'ใส่ค่าจ้างรายวัน',hintMonth:'ใส่เงินเดือนคงที่ของงานนี้',gpsAuto:'ลงเวลาอัตโนมัติด้วย GPS',gpsAutoSub:'เข้า/ออกงานอัตโนมัติเมื่อถึง/ออกบริษัท',gpsTarget:'🎯 งานที่ใช้ GPS',gpsSaved:'บันทึกแล้ว',gpsNotSaved:'ยังไม่บันทึก',gpsHint:'เลือกงาน แล้วกด „รับตำแหน่งปัจจุบัน‟ เพื่อบันทึก GPS แยก',companyLocation:'📍 ตำแหน่งบริษัท',companyNoLocation:'ยังไม่ได้ตั้งตำแหน่งบริษัท',radius:'รัศมีตรวจจับ',checkinMin:'⏱️ ยืนยันเข้างาน (นาที)',checkoutMin:'⏱️ ยืนยันออกงาน (นาที)',getLocation:'📍 รับตำแหน่งปัจจุบัน',clearLocation:'✕ ลบ',calendarText:'🎨 สีตัวอักษรปฏิทิน',sun:'อาทิตย์',sunSub:'สีตัวอักษรอาทิตย์',sat:'เสาร์',satSub:'สีตัวอักษรเสาร์',normal:'วันธรรมดา (จ–ศ)',normalSub:'สีตัวอักษรวันธรรมดา',resetColor:'↺ รีเซ็ตเป็นค่าเริ่มต้น',saveAppearance:'✓ บันทึกธีม',estNet:'รายได้สุทธิประมาณ',gross:'รวมก่อนหัก',combined:'รายได้รวม (หลัก+เสริม)',total:'รวม',saveSalary:'✓ บันทึกเงินเดือน',format:'รูปแบบไฟล์',csv:'📊 ส่งออก Excel CSV',pdf:'📄 ส่งออก PDF',filter:'โหมดส่งออก',all:'ทั้งหมด',filename:'ชื่อไฟล์'},
    id:{main:'Pekerjaan utama',mainShort:'UTAMA',sub:'Pekerjaan sampingan',subShort:'SAMPING',hasSub:'💼 Punya kerja sampingan?',subHelp:'Freelance, paruh waktu, tambahan...',subName:'NAMA KERJA SAMPINGAN',subNamePh:'Freelance / Les / Paruh waktu...',subSalary:'GAJI SAMPINGAN',hour:'/ jam',day:'/ hari',month:'/ bulan',hintHour:'Masukkan tarif per jam — dihitung otomatis',hintDay:'Masukkan upah harian',hintMonth:'Masukkan gaji bulanan tetap',gpsAuto:'Absensi GPS otomatis',gpsAutoSub:'Auto masuk/keluar saat tiba/pergi dari kantor',gpsTarget:'🎯 PEKERJAAN TARGET GPS',gpsSaved:'Tersimpan',gpsNotSaved:'Belum disimpan',gpsHint:'Pilih pekerjaan, lalu tekan „Lokasi saat ini‟ untuk simpan GPS terpisah.',companyLocation:'📍 Lokasi kantor',companyNoLocation:'Lokasi kantor belum diatur',radius:'Radius deteksi',checkinMin:'⏱️ Konfirmasi masuk (menit)',checkoutMin:'⏱️ Konfirmasi keluar (menit)',getLocation:'📍 Lokasi saat ini',clearLocation:'✕ Hapus',calendarText:'🎨 Warna teks kalender',sun:'Minggu',sunSub:'Warna teks Minggu',sat:'Sabtu',satSub:'Warna teks Sabtu',normal:'Hari kerja (Sen–Jum)',normalSub:'Warna teks hari kerja',resetColor:'↺ Reset warna default',saveAppearance:'✓ Simpan tampilan',estNet:'Estimasi gaji bersih',gross:'Bruto',combined:'Pendapatan gabungan (utama+sampingan)',total:'Total',saveSalary:'✓ Simpan info gaji',format:'FORMAT FILE',csv:'📊 Ekspor Excel CSV',pdf:'📄 Ekspor PDF',filter:'MODE EKSPOR',all:'Semua',filename:'NAMA FILE'},
    ph:{main:'Pangunahing trabaho',mainShort:'PANGUNAHIN',sub:'Sideline',subShort:'SIDE',hasSub:'💼 May sideline ka ba?',subHelp:'Freelance, part-time, dagdag trabaho...',subName:'PANGALAN NG SIDELINE',subNamePh:'Freelance / Tutor / Part-time...',subSalary:'SAHOD NG SIDELINE',hour:'/ oras',day:'/ araw',month:'/ buwan',hintHour:'Ilagay ang oras-oras na rate — auto-compute',hintDay:'Ilagay ang araw-araw na rate',hintMonth:'Ilagay ang buwanang sahod ng trabahong ito',gpsAuto:'Awtomatikong GPS attendance',gpsAutoSub:'Auto-sign in/out kapag pumasok/lumabas',gpsTarget:'🎯 TRABAHONG NA-TARGET NG GPS',gpsSaved:'Nai-save na',gpsNotSaved:'Hindi pa naka-save',gpsHint:'Pumili ng trabaho, pindutin „Kunin ang kasalukuyang lokasyon‟.',companyLocation:'📍 Lokasyon ng kumpanya',companyNoLocation:'Hindi naka-set ang lokasyon ng kumpanya',radius:'Radius ng pagtukoy',checkinMin:'⏱️ Kumpirmahin ang pasok (min)',checkoutMin:'⏱️ Kumpirmahin ang labas (min)',getLocation:'📍 Kunin ang kasalukuyang lokasyon',clearLocation:'✕ I-clear',calendarText:'🎨 Mga kulay ng teksto sa kalendaryo',sun:'Linggo',sunSub:'Kulay ng Linggo',sat:'Sabado',satSub:'Kulay ng Sabado',normal:'Mga araw ng trabaho (Lun–Biy)',normalSub:'Kulay ng araw ng trabaho',resetColor:'↺ I-reset sa default',saveAppearance:'✓ I-save ang hitsura',estNet:'Tinatayang net pay',gross:'Gross',combined:'Pinagsamang kita (pangunahin+side)',total:'Kabuuan',saveSalary:'✓ I-save ang impormasyon ng sahod',format:'FORMAT NG FILE',csv:'📊 I-export ang Excel CSV',pdf:'📄 I-export ang PDF',filter:'MODE NG EXPORT',all:'Lahat',filename:'PANGALAN NG FILE'},
    ne:{main:'मुख्य काम',mainShort:'मुख्य',sub:'सहायक काम',subShort:'सहायक',hasSub:'💼 सहायक काम छ?',subHelp:'फ्रिल्यान्स, पार्ट-टाइम, अतिरिक्त काम...',subName:'सहायक काम नाम',subNamePh:'फ्रिल्यान्स / ट्युटर / पार्ट-टाइम...',subSalary:'सहायक काम तलब',hour:'/ घन्टा',day:'/ दिन',month:'/ महिना',hintHour:'घण्टाको दर — स्वत: गणना',hintDay:'दैनिक दर',hintMonth:'यो कामको स्थिर मासिक तलब',gpsAuto:'स्वत: GPS हाजिरी',gpsAutoSub:'कम्पनी पुग्दा/छोड्दा स्वत: हाजिर/बाहिर',gpsTarget:'🎯 GPS लक्षित काम',gpsSaved:'सुरक्षित',gpsNotSaved:'सुरक्षित छैन',gpsHint:'काम छान्नुहोस्, „हालको स्थान‟ थिच्नुहोस्।',companyLocation:'📍 कम्पनी स्थान',companyNoLocation:'कम्पनी स्थान सेट गरिएको छैन',radius:'पहिचान त्रिज्या',checkinMin:'⏱️ प्रवेश पुष्टि (मिनेट)',checkoutMin:'⏱️ बाहिर पुष्टि (मिनेट)',getLocation:'📍 हालको स्थान लिनुहोस्',clearLocation:'✕ हटाउनुहोस्',calendarText:'🎨 क्यालेन्डर पाठ रंग',sun:'आइतबार',sunSub:'आइतबार पाठ रंग',sat:'शनिबार',satSub:'शनिबार पाठ रंग',normal:'कार्यदिन (सोम–शुक्र)',normalSub:'कार्यदिन पाठ रंग',resetColor:'↺ डिफल्टमा रिसेट',saveAppearance:'✓ थिम सुरक्षित गर्नुहोस्',estNet:'अनुमानित नेट तलब',gross:'कुल',combined:'मिलाएको आम्दानी (मुख्य+सहायक)',total:'जम्मा',saveSalary:'✓ तलब जानकारी सुरक्षित गर्नुहोस्',format:'फाइल ढाँचा',csv:'📊 Excel CSV निर्यात',pdf:'📄 PDF निर्यात',filter:'निर्यात मोड',all:'सबै',filename:'फाइल नाम'},
    hi:{main:'मुख्य नौकरी',mainShort:'मुख्य',sub:'अतिरिक्त नौकरी',subShort:'अतिरिक्त',hasSub:'💼 क्या आपकी अतिरिक्त नौकरी है?',subHelp:'फ्रीलांस, पार्ट-टाइम, अतिरिक्त काम...',subName:'अतिरिक्त नौकरी का नाम',subNamePh:'फ्रीलांस / ट्यूटर / पार्ट-टाइम...',subSalary:'अतिरिक्त वेतन',hour:'/ घंटा',day:'/ दिन',month:'/ माह',hintHour:'प्रति घंटा दर — स्वचालित गणना',hintDay:'दैनिक दर दर्ज करें',hintMonth:'इस कार्य का निश्चित मासिक वेतन',gpsAuto:'स्वचालित GPS उपस्थिति',gpsAutoSub:'कंपनी पहुंचने/छोड़ने पर ऑटो',gpsTarget:'🎯 GPS लक्ष्य कार्य',gpsSaved:'सहेजा गया',gpsNotSaved:'सहेजा नहीं',gpsHint:'कार्य चुनें, फिर „वर्तमान स्थान‟ दबाएं।',companyLocation:'📍 कंपनी स्थान',companyNoLocation:'कंपनी स्थान सेट नहीं',radius:'पहचान त्रिज्या',checkinMin:'⏱️ प्रवेश पुष्टि (मिनट)',checkoutMin:'⏱️ निकास पुष्टि (मिनट)',getLocation:'📍 वर्तमान स्थान प्राप्त करें',clearLocation:'✕ साफ करें',calendarText:'🎨 कैलेंडर पाठ रंग',sun:'रविवार',sunSub:'रविवार पाठ रंग',sat:'शनिवार',satSub:'शनिवार पाठ रंग',normal:'कार्यदिवस (सोम–शुक्र)',normalSub:'कार्यदिवस पाठ रंग',resetColor:'↺ डिफ़ॉल्ट पर रीसेट',saveAppearance:'✓ थीम सहेजें',estNet:'अनुमानित शुद्ध वेतन',gross:'सकल',combined:'संयुक्त आय (मुख्य+अतिरिक्त)',total:'कुल',saveSalary:'✓ वेतन जानकारी सहेजें',format:'फ़ाइल प्रारूप',csv:'📊 Excel CSV निर्यात',pdf:'📄 PDF निर्यात',filter:'निर्यात मोड',all:'सभी',filename:'फ़ाइल नाम'}
  };
  const ALIAS={};
  function getLang2(){try{return (window.userData&&userData.lang)||localStorage.getItem('cc_lang')||localStorage.getItem('lang')||'vi'}catch(e){return 'vi'}}
  function P(){let l=getLang2();return PACK[l]||PACK[ALIAS[l]]||PACK.en}
  function safeText(s){return String(s||'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
  function set(id,val,attr){const e=document.getElementById(id); if(!e)return; if(attr)e.setAttribute(attr,val); else e.textContent=val}
  function replaceTextNode(n){let s=n.nodeValue, p=P(); const pairs=[
    ['TÊN CÔNG VIỆC PHỤ',p.subName],['TÊN CÔNG 부업',p.subName],['TÊN CÔNG 副业',p.subName],['TÊN CÔNG 副業',p.subName],['TÊN CÔNG SUB JOB',p.subName],
    ['LƯƠNG JOB PHỤ',p.subSalary],['LƯƠNG VIỆC PHỤ',p.subSalary],['LƯƠNG JOB 부업',p.subSalary],['LƯƠNG JOB 副业',p.subSalary],['LƯƠNG JOB 副業',p.subSalary],
    ['💼 Có job phụ không?',p.hasSub],['Có job phụ không?',p.hasSub.replace(/^💼\s*/, '')],['Freelance, part-time, làm thêm...',p.subHelp],
    ['Job chính',p.main],['Công việc chính',p.main],['CÔNG VIỆC CHÍNH',p.main],['CHÍNH',p.mainShort],['주업',p.mainShort],
    ['Job phụ',p.sub],['Việc phụ',p.sub],['VIỆC PHỤ',p.sub],['VIEC PHU',p.sub],['PHỤ',p.subShort],
    ['GPS ÁP DỤNG CHO JOB',p.gpsTarget],['GPS áp dụng cho job',p.gpsTarget.replace(/^🎯\s*/, '')],['GPS tự động 출퇴근',p.gpsAuto],['Chấm công tự động GPS',p.gpsAuto],['Tự động vào/ra ca khi đến/rời công ty',p.gpsAutoSub],
    ['Vị trí công ty',p.companyLocation.replace(/^📍\s*/, '')],['회사 위치가 설정되지 않음',p.companyNoLocation],['Chưa thiết lập vị trí công ty',p.companyNoLocation],['Cảm biến khoảng cách',p.radius],['감지 반경',p.radius],
    ['출근 확인 (분)',p.checkinMin.replace(/^⏱️\s*/, '')],['퇴근 확인 (분)',p.checkoutMin.replace(/^⏱️\s*/, '')],['Phút xác nhận VÀO ca',p.checkinMin.replace(/^⏱️\s*/, '')],['Phút xác nhận HẾT ca',p.checkoutMin.replace(/^⏱️\s*/, '')],
    ['Lấy vị trí hiện tại',p.getLocation.replace(/^📍\s*/, '')],['Xóa',p.clearLocation.replace(/^✕\s*/, '')],['Đã lưu',p.gpsSaved],['Chưa lưu',p.gpsNotSaved],['Chọn job rồi bấm “Lấy vị trí hiện tại” để lưu GPS riêng cho job đó.',p.gpsHint],
    ['MÀU CHỮ TRONG LỊCH',p.calendarText],['Chủ nhật (CN)',p.sun],['Màu chữ ngày Chủ nhật',p.sunSub],['Thứ 7 (T7)',p.sat],['Màu chữ ngày Thứ 7',p.satSub],['Ngày thường (T2–T6)',p.normal],['Màu chữ ngày trong tuần',p.normalSub],['Đặt lại màu mặc định',p.resetColor.replace(/^↺\s*/, '')],['Lưu giao diện',p.saveAppearance.replace(/^✓\s*/, '')],
    ['Ước tính thực nhận',p.estNet],['예상 실수령액',p.estNet],['Gross',p.gross],['합산 수입 (주+부)',p.combined],['Hợp nhất thu nhập (chính + phụ)',p.combined],['Tổng',p.total],['Lưu thông tin lương',p.saveSalary.replace(/^✓\s*/, '')],
    ['ĐỊNH DẠNG FILE',p.format],['CHẾ ĐỘ XUẤT',p.filter],['TÊN FILE',p.filename],['Tất cả',p.all],['Xuất file Excel (.csv)',p.csv.replace(/^📊\s*/, '')],['Xuất file PDF',p.pdf.replace(/^📄\s*/, '')],
    ['/ giờ',p.hour],['/ ngày',p.day],['/ tháng',p.month]
  ];
  pairs.sort((a,b)=>b[0].length-a[0].length).forEach(([a,b])=>{s=s.split(a).join(b)}); if(s!==n.nodeValue)n.nodeValue=s;
  }
  function syncAttrs(){const p=P();
    set('setupSubNameLbl',p.subName); set('setupSubSalaryLbl',p.subSalary); set('setupSubJob',p.subNamePh,'placeholder'); set('setupSubSalaryHint',p.hintHour);
    set('btnResetColors',p.resetColor); set('btnSaveAppear',p.saveAppearance); set('apSecCalColor',p.calendarText);
    set('calColorSunLbl',p.sun); set('calColorSunSub',p.sunSub); set('calColorSatLbl',p.sat); set('calColorSatSub',p.satSub); set('calColorNormLbl',p.normal); set('calColorNormSub',p.normalSub);
    set('excelFilterLbl',p.filter); set('excelFilenameLbl',p.filename); set('efAll',p.all);
    const fmt=document.querySelector('#excelFormatRow > div:first-child'); if(fmt)fmt.textContent=p.format;
    const btn=document.getElementById('excelExportBtn'); if(btn)btn.textContent=(window._exportFormat==='pdf')?p.pdf:p.csv;
    const hint=document.getElementById('setupSubSalaryHint'); if(hint){const mode=(window._subSalaryMode||'hour'); hint.textContent=mode==='day'?p.hintDay:mode==='month'?p.hintMonth:p.hintHour;}
  }
  let busy=false;
  function syncAll(){if(busy)return; busy=true; try{syncAttrs(); const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(n){const e=n.parentElement;if(!e||!n.nodeValue.trim()||['SCRIPT','STYLE','TEXTAREA','INPUT'].includes(e.tagName))return NodeFilter.FILTER_REJECT;if(e.isContentEditable||e.closest('input,textarea,[contenteditable="true"]'))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT;}}); const arr=[]; while(w.nextNode())arr.push(w.currentNode); arr.forEach(replaceTextNode);}catch(e){} busy=false;}
  const oldApply=window.applyI18n; window.applyI18n=function(){const r=oldApply&&oldApply.apply(this,arguments); setTimeout(syncAll,20); return r;};
  const oldOpen=window.openPanel; window.openPanel=function(id){const r=oldOpen&&oldOpen.apply(this,arguments); setTimeout(syncAll,80); return r;};
  const oldGps=window.openPanelGPS; if(oldGps) window.openPanelGPS=function(){const r=oldGps.apply(this,arguments); setTimeout(syncAll,120); return r;};
  const oldRenderSetup=window.renderSetupSubJob; if(oldRenderSetup) window.renderSetupSubJob=function(){const r=oldRenderSetup.apply(this,arguments); setTimeout(syncAll,30); return r;};
  const oldSelSub=window.selSubMode; if(oldSelSub) window.selSubMode=function(mode){window._subSalaryMode=mode; const r=oldSelSub.apply(this,arguments); setTimeout(syncAll,20); return r;};
  // ═══ FIX LAG TIẾNG VIỆT v4 — DISCONNECT-RECONNECT approach ═══
  //
  // Vấn đề: MutationObserver vẫn trigger khi IME tạo popup → lag composition.
  // Giải pháp v4 (cuối cùng): DISCONNECT observer hoàn toàn khi user focus input.
  // Reconnect khi user blur hoặc 1 giây không gõ.
  let _syncTimer = null;
  let _observerActive = false;
  let _disconnectTimer = null;
  let _lastInputTime = 0;

  const mo = new MutationObserver(() => {
    // Khi observer chạy, debounce 500ms rồi sync
    if(_syncTimer) clearTimeout(_syncTimer);
    _syncTimer = setTimeout(syncAll, 500);
  });

  function startObserver(){
    if(_observerActive || !document.body) return;
    try{ mo.observe(document.body, {childList:true, subtree:true}); _observerActive = true; }catch(e){}
  }
  function stopObserver(){
    if(!_observerActive) return;
    try{ mo.disconnect(); _observerActive = false; if(_syncTimer){clearTimeout(_syncTimer); _syncTimer=null;} }catch(e){}
  }

  // ═══ STOP OBSERVER NGAY KHI USER FOCUS VÀO INPUT ═══
  // Đây là approach triệt để nhất — không có observer nào chạy khi user gõ
  document.addEventListener('focusin', (e) => {
    const t = e.target;
    if(t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)){
      stopObserver();
      _lastInputTime = Date.now();
    }
  }, true);
  document.addEventListener('focusout', (e) => {
    const t = e.target;
    if(t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)){
      // Đợi 800ms để chắc IME đã đóng → mới reconnect observer
      setTimeout(() => {
        // Nếu user lại focus input khác trong 800ms thì không cần start
        const active = document.activeElement;
        if(active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)){
          return;
        }
        startObserver();
      }, 800);
    }
  }, true);

  // ═══ COMPOSITION EVENTS — đảm bảo dừng observer khi gõ tiếng Việt ═══
  document.addEventListener('compositionstart', () => {
    stopObserver();
    _lastInputTime = Date.now();
  }, true);
  document.addEventListener('compositionupdate', () => {
    _lastInputTime = Date.now();
  }, true);
  document.addEventListener('compositionend', () => {
    _lastInputTime = Date.now();
    // KHÔNG restart observer ngay — chờ đến khi blur input
  }, true);

  // ═══ INPUT/KEYDOWN — track activity, không restart observer ═══
  document.addEventListener('input', (e) => {
    const t = e.target;
    if(t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)){
      _lastInputTime = Date.now();
      stopObserver();  // chắc chắn observer dừng
    }
  }, true);

  document.addEventListener('DOMContentLoaded', () => { syncAll(); startObserver(); });
  setTimeout(() => { syncAll(); startObserver(); }, 500);
  window.syncDeepI18n = syncAll;
  // Expose for debugging
  window._mo = { start: startObserver, stop: stopObserver, status: () => _observerActive };
})();

(function(){
  function textFrom(key, fallback){
    try{
      if(typeof u === 'function'){
        var v = u(key);
        if(v && v !== key) return v;
      }
    }catch(e){}
    return fallback;
  }
  function setText(id, value){
    var el = document.getElementById(id);
    if(el) el.textContent = value;
  }
  function applySmartAutoLabels(){
    var title = textFrom('sa.title', '🧠 Chấm công thông minh');
    var hint = textFrom('sa.hint', 'Wi-Fi + GPS — tự động phát hiện đi/về');
    var tip = textFrom('gps.tip', '💡 Chấm công tự động dùng Wi-Fi + GPS; GPS chỉ là một tín hiệu xác thực, không còn chấm độc lập.');
    setText('gpsPanelTitle', title);
    setText('gpsAutoTitle', title);
    setText('gpsAutoSub', hint);
    setText('gpsTip', tip);
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', applySmartAutoLabels);
  } else {
    applySmartAutoLabels();
  }
  setTimeout(applySmartAutoLabels, 300);
  setTimeout(applySmartAutoLabels, 1200);
  window.gpsApplySmartAutoLabels = applySmartAutoLabels;
})();

/* PATCH v2.2.9 - show saved company GPS location from persisted store */
(function(){
  if(window.__gpsSavedLocationStatusPatchInstalled) return;
  window.__gpsSavedLocationStatusPatchInstalled = true;

  function toNumber(value){
    var n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  function validPair(lat, lng){
    return lat !== null && lng !== null && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }

  function radiusValue(value){
    var r = Number(value);
    if(Number.isFinite(r) && r > 0) return Math.round(r);
    if(window._gpsData && Number(_gpsData.radius) > 0) return Math.round(Number(_gpsData.radius));
    return 15;
  }

  function currentStoredLocation(){
    if(typeof _gpsData === 'undefined' || !_gpsData) return null;

    try{
      if(typeof gpsRepairLocationPersistence === 'function') gpsRepairLocationPersistence();
    }catch(e){}

    var loc = null;
    try{
      if(typeof gpsGetStoredCompanyLocation === 'function'){
        loc = gpsGetStoredCompanyLocation(_gpsData.activeJob || 'main');
      }
    }catch(e){}

    if(!loc && _gpsData.locations){
      var job = _gpsData.activeJob === 'sub' ? 'sub' : 'main';
      loc = _gpsData.locations[job] || _gpsData.locations.main || _gpsData.locations.sub || null;
    }

    if(!loc) loc = {lat:_gpsData.lat, lng:_gpsData.lng, radius:_gpsData.radius};

    var lat = toNumber(loc && loc.lat);
    var lng = toNumber(loc && loc.lng);
    if(!validPair(lat, lng)) return null;
    return {lat:lat, lng:lng, radius:radiusValue(loc.radius)};
  }

  function savedText(){
    try{
      if(typeof u === 'function') return u('gps.saved') || '✅ Đã lưu vị trí công ty. Đang chờ GPS xác nhận vị trí hiện tại.';
    }catch(e){}
    return '✅ Đã lưu vị trí công ty. Đang chờ GPS xác nhận vị trí hiện tại.';
  }

  function noSetupText(){
    try{
      if(typeof u === 'function') return u('gps.no_setup') || 'Chưa thiết lập vị trí công ty';
    }catch(e){}
    return 'Chưa thiết lập vị trí công ty';
  }

  function renderSavedLocationStatus(){
    var statusTxt = document.getElementById('gpsStatusTxt');
    var statusDot = document.getElementById('gpsStatusDot');
    var coordsBox = document.getElementById('gpsCoordsBox');
    var coordsTxt = document.getElementById('gpsCoordsText');
    if(!statusTxt) return false;

    var loc = currentStoredLocation();
    if(!loc){
      statusTxt.textContent = noSetupText();
      if(statusDot) statusDot.style.background = '#ccc';
      if(coordsBox) coordsBox.style.display = 'none';
      return false;
    }

    if(typeof _gpsData !== 'undefined' && _gpsData){
      _gpsData.lat = loc.lat;
      _gpsData.lng = loc.lng;
      _gpsData.radius = loc.radius;
    }

    var inside = (typeof _gpsWasInside !== 'undefined') ? _gpsWasInside : null;
    statusTxt.textContent = inside === true  ? u('gps.in_zone')
                          : inside === false ? u('gps.out_zone')
                          : savedText();
    if(statusDot) statusDot.style.background = inside === true ? '#0D9E75' : inside === false ? '#E8433A' : '#F5A623';
    if(coordsBox) coordsBox.style.display = 'block';
    if(coordsTxt){
      var polling = (typeof _gpsPollMs !== 'undefined' && _gpsPollMs) ? Math.round(_gpsPollMs / 1000) : null;
      coordsTxt.innerHTML =
        'Lat: ' + loc.lat.toFixed(6) + ' | Lng: ' + loc.lng.toFixed(6) +
        '<br>Bán kính: ' + loc.radius + 'm' + (polling ? ' | Polling: ' + polling + 's' : '');
    }
    return true;
  }

  var oldUpdateGpsStatus = window.updateGpsStatus;
  window.updateGpsStatus = function(){
    if(renderSavedLocationStatus()) return;
    if(typeof oldUpdateGpsStatus === 'function') return oldUpdateGpsStatus.apply(this, arguments);
  };
  try{ updateGpsStatus = window.updateGpsStatus; }catch(e){}

  var oldOpenPanelGPS = window.openPanelGPS;
  window.openPanelGPS = function(){
    var result;
    if(typeof oldOpenPanelGPS === 'function') result = oldOpenPanelGPS.apply(this, arguments);
    setTimeout(renderSavedLocationStatus, 120);
    setTimeout(renderSavedLocationStatus, 350);
    return result;
  };
  try{ openPanelGPS = window.openPanelGPS; }catch(e){}
})();

/* PATCH v2.2.6 - actual attendance hours for salary */
(function(){
  if(window.__actualSalaryPatchInstalled) return;
  window.__actualSalaryPatchInstalled = true;

  function actualBreakHours(){
    return (window.userData && userData.hasBreak && userData.breakMinutes) ? userData.breakMinutes / 60 : 0;
  }

  function actualWorkedHours(rec){
    if(!rec || !rec.in || !rec.out) return null;
    let h = null;
    if(typeof soGio === 'function') h = soGio(rec.in, rec.out);
    if(h == null && typeof timeToMin === 'function'){
      h = ((timeToMin(rec.out) - timeToMin(rec.in) + 1440) % 1440) / 60;
    }
    if(!isFinite(h)) return null;
    return Math.max(0, h - actualBreakHours());
  }

  /**
   * Làm tròn giờ trong ngày dùng cho tính lương:
   *   - phần lẻ ≥ 30 phút (0.5h) → làm tròn LÊN
   *   - phần lẻ < 30 phút        → làm tròn XUỐNG
   * Giờ vào/ra ca trong record vẫn giữ nguyên — chỉ giá trị tổng giờ/ngày được làm tròn.
   */
  function roundDailyHoursForSalary(h){
    if(h == null || !isFinite(h)) return h;
    const whole = Math.floor(h);
    const frac = h - whole;
    return frac >= 0.5 ? whole + 1 : whole;
  }

  function fmtActualMoney(n, country, pr){
    const v = Math.max(0, Number(n) || 0);
    if(typeof fmtMoney === 'function') return fmtMoney(v, country || 'VN');
    if(country === 'VN') return Math.round(v).toLocaleString('vi-VN') + '₫';
    return (pr && pr.currency ? pr.currency : '') + Math.round(v).toLocaleString();
  }

  function safeSetText(id, value){
    const el = document.getElementById(id);
    if(el) el.textContent = value;
  }

  function calcSalaryActual(){
    const salInp = document.getElementById('salaryInput');
    const mode = (typeof _salaryMode !== 'undefined' && _salaryMode) || userData.salaryMode || 'month';
    const saved = mode === 'month' ? (userData.salary || 0)
      : mode === 'day' ? (userData.salaryDay || 0)
      : (userData.salaryHour || 0);
    const inputVal = parseFloat(salInp && salInp.value) || saved || 0;
    const ngc = userData.ngc || 26;
    const gioCA = userData.hoursPerShift || 8;

    let raw = 0;
    if(mode === 'month'){
      raw = inputVal || userData.salary || 0;
      userData.salary = raw;
    }else if(mode === 'day'){
      userData.salaryDay = inputVal;
      raw = inputVal * ngc;
      userData.salary = raw;
    }else{
      userData.salaryHour = inputVal;
      raw = inputVal * gioCA * ngc;
      userData.salary = raw;
    }
    userData.salaryMode = mode;
    if(typeof saveUser === 'function') saveUser();

    window._cfg_shim = {luong:raw, ngayCong:ngc, gioNgay:gioCA, kieu:'thang', vung:5310000};
    if(typeof syncLangCfg === 'function') syncLangCfg();

    const rule = typeof getPayrollRule === 'function' ? getPayrollRule() : {otFactor:1.5, nightFactor:1.3, holidayFactor:4};
    const country = (window.langCfg && langCfg.payrollCountry) || 'VN';
    const pr = (typeof PAYROLL_RULES !== 'undefined' && PAYROLL_RULES[country]) ? PAYROLL_RULES[country] : (typeof PAYROLL_RULES !== 'undefined' ? PAYROLL_RULES.VN : {});
    const rateDay = mode === 'hour' ? inputVal * gioCA : mode === 'day' ? inputVal : (raw / ngc || 0);
    const rateHour = mode === 'hour' ? inputVal : (rateDay / gioCA || 0);
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    let cm = 0, np = 0, v = 0, ll = 0, nightDays = 0;
    let gross = 0, basePay = 0, leavePay = 0, absentDeduct = 0, holidayPay = 0, nightPay = 0, otPay = 0, actualHours = 0, baseHours = 0;

    for(let d = 1; d <= daysInMonth; d++){
      const rec = attData[`${y}-${m}-${d}`];
      if(!rec) continue;

      if(rec.type === 'np'){
        np++;
        if(mode === 'month'){
          leavePay += rateDay;
          gross += rateDay;
        }
        continue;
      }
      if(rec.type === 'vang'){
        v++;
        if(mode === 'month'){
          absentDeduct += rateDay;
          gross -= rateDay;
        }
        continue;
      }
      if(rec.type !== 'cm' && rec.type !== 'll') continue;

      // Làm tròn giờ/ngày cho lương: ≥30p lên, <30p xuống. Giờ vào/ra ca trong record giữ nguyên.
      const workedRaw = actualWorkedHours(rec);
      if(workedRaw == null) continue;
      const worked = roundDailyHoursForSalary(workedRaw);

      actualHours += worked;
      const otGio = Math.max(0, worked - gioCA);
      const normalGio = Math.min(worked, gioCA);
      const nightGio = (typeof calcNightHours === 'function') ? calcNightHours(rec.in, rec.out, rule.nightStart, rule.nightEnd) : 0;
      const nightPct = (rule.nightFactor || 1.3) - 1;
      const dayNightPay = rule.nightIsAdditive ? nightGio * rateHour * (rule.nightFactor || 1.3) : nightGio * rateHour * nightPct;
      let dayOtPay = 0;
      if(window.langCfg && langCfg.payrollCountry === 'TW'){
        const ot1 = Math.min(otGio, rule.ot1Hours || 2);
        const ot2 = Math.min(Math.max(0, otGio - (rule.ot1Hours || 2)), rule.ot2Hours || 2);
        dayOtPay = (ot1 * rateHour * (rule.ot1Factor || 1.33)) + (ot2 * rateHour * (rule.ot2Factor || 1.67));
      }else{
        dayOtPay = otGio * rateHour * (rule.otFactor || 1.5);
      }

      if(rec.type === 'll'){
        ll++;
        const hPay = mode === 'hour' ? worked * rateHour * (rule.holidayFactor || 4) : rateDay * (rule.holidayFactor || 4);
        holidayPay += hPay;
        nightPay += dayNightPay;
        otPay += dayOtPay;
        gross += hPay + dayNightPay + dayOtPay;
        if(nightGio > 1) nightDays++;
        continue;
      }

      cm++;
      const bPay = mode === 'hour' ? normalGio * rateHour : rateDay;
      baseHours += normalGio;
      basePay += bPay;
      nightPay += dayNightPay;
      otPay += dayOtPay;
      gross += bPay + dayNightPay + dayOtPay;
      if(nightGio > 1) nightDays++;
    }

    const taxResult = typeof taxEngineCalculate === 'function'
      ? taxEngineCalculate(country, Math.max(0, gross), userData.dependents || 0)
      : {insurance:0, tax:0, net:Math.max(0, gross), rule:{}};
    const bhTong = taxResult.insurance || 0;
    const thueTong = taxResult.tax || 0;
    const net = taxResult.net == null ? Math.max(0, gross - bhTong - thueTong) : taxResult.net;
    const fmtN = n => fmtActualMoney(n, country, pr);
    const ruleName = typeof cLang === 'function' ? cLang(pr.name || country) : (pr.name || country);
    const basis = typeof cLang === 'function' ? cLang(pr.basis || '') : (pr.basis || '');
    const paidDays = cm + ll;
    const hourTxt = (Math.round(actualHours * 10) / 10).toLocaleString('vi-VN') + 'h';
    const baseHourTxt = (Math.round(baseHours * 10) / 10).toLocaleString('vi-VN') + 'h';

    const labels = {
      vi:{present:'Có mặt đã tan ca',hour:'Giờ thực tế',day:'ngày',night:'Ca đêm',ot:'Tăng ca',leave:'Nghỉ phép',absent:'Vắng',holiday:'Làm ngày lễ',real:'theo dữ liệu thực tế'},
      en:{present:'Completed shifts',hour:'Actual hours',day:'days',night:'Night shift',ot:'Overtime',leave:'Leave',absent:'Absent',holiday:'Holiday work',real:'from actual attendance'}
    };
    const b = labels[userData.lang || 'vi'] || labels.vi;

    const bd = document.getElementById('salaryBreakdown');
    if(bd){
      const baseLine = mode === 'hour'
        ? `${b.hour}: ${baseHourTxt} × ${fmtN(rateHour)} = <strong>${fmtN(basePay)}</strong><br>`
        : `${b.present}: ${cm} ${b.day} × ${fmtN(rateDay)} = <strong>${fmtN(basePay)}</strong><br>`;
      bd.innerHTML =
        `<strong>${pr.flag || ''} ${ruleName}</strong>${basis ? ' · ' + basis : ''}<br>` +
        `<span style="color:#607080">${b.real}</span><br>` +
        baseLine +
        (nightPay > 0 ? `${b.night} (${nightDays} ${b.day}): <strong style="color:#7B5EA7">+${fmtN(nightPay)}</strong><br>` : '') +
        (otPay > 0 ? `${b.ot} (×${rule.otFactor || 1.5}): <strong style="color:#F5A623">+${fmtN(otPay)}</strong><br>` : '') +
        (leavePay > 0 ? `${b.leave}: ${np} ${b.day} = <strong>${fmtN(leavePay)}</strong><br>` : '') +
        (absentDeduct > 0 ? `${b.absent}: -${v} ${b.day} = <strong style="color:#E8433A">-${fmtN(absentDeduct)}</strong><br>` : '') +
        (holidayPay > 0 ? `${b.holiday}: ${ll} ${b.day} × ${rule.holidayFactor || 4} = <strong style="color:#2D7DD2">${fmtN(holidayPay)}</strong><br>` : '');

      const insLabel = typeof u === 'function' ? u('salary.insurance') : 'Bảo hiểm';
      const taxLabel = typeof u === 'function' ? u('salary.tax') : 'Thuế';
      const bhPct = bhTong > 0 && gross > 0 ? ' (' + (bhTong / gross * 100).toFixed(1) + '%)' : '';
      let insTxt = '';
      if(bhTong > 0) insTxt += `${insLabel}${bhPct}: <strong style="color:#E8433A">-${fmtN(bhTong)}</strong>`;
      if(thueTong > 0) insTxt += (insTxt ? '<br>' : '') + `${taxLabel}: <strong style="color:#E8433A">-${fmtN(thueTong)}</strong>`;
      if(insTxt) bd.innerHTML += insTxt;
    }

    safeSetText('salaryNet', fmtN(net));
    safeSetText('salaryAmount', fmtN(Math.max(0, gross)));
    const detEl = document.getElementById('salaryDetail');
    if(detEl){
      if(!raw) detEl.textContent = u('salary.detail_empty');
      else if(mode === 'hour') detEl.textContent = u('salary.detail_hour', {h:hourTxt, r:ruleName, n:fmtN(net)});
      else detEl.textContent = u('salary.detail_day', {d:paidDays, r:ruleName, n:fmtN(net)});
    }
    if(typeof saveUser === 'function') saveUser();
  }

  function renderHomeStatsActual(){
    const tl = typeof getLang === 'function' ? getLang() : {};
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    let cm = 0, v = 0, np = 0, totalH = 0;
    for(let d = 1; d <= daysInMonth; d++){
      const rec = attData[`${y}-${m}-${d}`];
      if(!rec) continue;
      if(rec.type === 'cm') cm++;
      else if(rec.type === 'vang') v++;
      else if(rec.type === 'np') np++;
      const h = actualWorkedHours(rec);
      // Cộng giờ đã làm tròn (≥30p lên, <30p xuống) để khớp với cách tính lương
      const hRounded = roundDailyHoursForSalary(h);
      if(hRounded != null) totalH += hRounded;
    }
    const ot = Math.max(0, totalH - 176);
    safeSetText('statCM', cm);
    safeSetText('statV', v);
    safeSetText('statNP', np);
    safeSetText('statOT', ot > 0 ? `${ot.toFixed(0)}h` : '0h');
    safeSetText('meterHours', `${totalH.toFixed(0)}h`);
    const fill = document.getElementById('meterFill');
    const mb = document.getElementById('meterBadge');
    const pct = Math.min(100, totalH / 260 * 100);
    let fillColor = 'linear-gradient(90deg,#0D9E75,#40E0D0)';
    let badgeTxt = tl.binhThuong || 'Bình thường', badgeBg = '#E0F5EE', badgeFg = '#0a7d5c';
    if(totalH > 220){
      fillColor = 'linear-gradient(90deg,#0D9E75,#F5A623,#E8433A)';
      badgeTxt = tl.quaSuc || 'Quá sức';
      badgeBg = '#FFF0EF';
      badgeFg = '#E8433A';
    }else if(totalH > 176){
      fillColor = 'linear-gradient(90deg,#0D9E75,#F5A623)';
      badgeTxt = tl.chamChi || 'Chăm chỉ';
      badgeBg = '#FFF8E8';
      badgeFg = '#cc8800';
    }
    if(fill){
      fill.style.width = `${Math.max(2, pct)}%`;
      fill.style.background = fillColor;
    }
    if(mb){
      mb.textContent = badgeTxt;
      mb.style.background = badgeBg;
      mb.style.color = badgeFg;
    }
    calcSalaryActual();
  }

  function renderHoursTableActual(){
    const now = new Date();
    const pr = typeof getPayrollRule === 'function' ? getPayrollRule() : {otFactor:1.5, nightFactor:1.3, holidayFactor:4};
    const shiftH = userData.hoursPerShift || 8;
    let days = [], label = '';

    if(typeof _salaryPeriod !== 'undefined' && _salaryPeriod === 'week'){
      const dow = now.getDay();
      const mon = new Date(now); mon.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1));
      for(let i = 0; i < 7; i++){ const d = new Date(mon); d.setDate(mon.getDate() + i); days.push(d); }
      label = `${mon.getDate()}/${mon.getMonth()+1} - ${days[6].getDate()}/${days[6].getMonth()+1}/${now.getFullYear()}`;
    }else if(typeof _salaryPeriod === 'undefined' || _salaryPeriod === 'month'){
      const y = now.getFullYear(), m = now.getMonth(), nd = new Date(y, m + 1, 0).getDate();
      for(let g = 1; g <= nd; g++) days.push(new Date(y, m, g));
      const mn = (typeof getLang === 'function' && getLang().months) || ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
      label = mn[now.getMonth()] + ' ' + now.getFullYear();
    }else{
      const y = now.getFullYear();
      for(let m = 0; m < 12; m++){ const nd = new Date(y, m + 1, 0).getDate(); for(let g = 1; g <= nd; g++) days.push(new Date(y, m, g)); }
      label = ((typeof getLang === 'function' && getLang().year) || 'Năm') + ' ' + now.getFullYear();
    }

    let bH = 0, otH = 0, niH = 0, hoH = 0, bD = 0, otD = 0, niD = 0, hoD = 0;
    days.forEach(d => {
      const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const rec = attData[k];
      if(!rec) return;
      const worked = actualWorkedHours(rec);
      if(worked == null) return;
      const nl = typeof gNL === 'function' ? gNL(d.getFullYear(), d.getMonth(), d.getDate()) : false;
      if(rec.type === 'll' || nl){
        hoH += worked;
        hoD++;
      }else if(rec.type === 'cm'){
        const basic = Math.min(worked, shiftH), ot = Math.max(0, worked - shiftH);
        bH += basic; if(basic > 0) bD++;
        otH += ot; if(ot > 0) otD++;
        const night = (typeof calcNightHours === 'function') ? calcNightHours(rec.in, rec.out, pr.nightStart, pr.nightEnd) : 0;
        niH += night; if(night > 0) niD++;
      }
    });

    const totH = bH + otH + niH + hoH, totD = bD + otD + niD + hoD;
    const wk = (typeof _salaryPeriod !== 'undefined' && _salaryPeriod === 'week') ? 1 : (typeof _salaryPeriod !== 'undefined' && _salaryPeriod === 'month') ? 4.33 : 52;
    const fn = v => v > 0 ? (Math.round(v * 10) / 10) + 'h' : '0h';
    const fd = v => v > 0 ? String(v) : '0';
    const fw = v => v > 0 ? (Math.round(v / wk * 10) / 10) + 'h' : '0h';
    const fm = v => {
      const period = typeof _salaryPeriod !== 'undefined' ? _salaryPeriod : 'month';
      const mv = period === 'month' ? v : period === 'week' ? v * 4.33 : v / 12;
      return mv > 0 ? (Math.round(mv * 10) / 10) + 'h' : '0h';
    };

    safeSetText('thTongGio', fn(totH)); safeSetText('thNgayCong', String(bD + hoD)); safeSetText('thTangCa', fn(otH));
    safeSetText('thBasicH', fn(bH)); safeSetText('thBasicD', fd(bD)); safeSetText('thBasicW', fw(bH)); safeSetText('thBasicM', fm(bH));
    safeSetText('thOTH', fn(otH)); safeSetText('thOTD', fd(otD)); safeSetText('thOTW', fw(otH)); safeSetText('thOTM', fm(otH));
    safeSetText('thNightH', fn(niH)); safeSetText('thNightD', fd(niD)); safeSetText('thNightW', fw(niH)); safeSetText('thNightM', fm(niH));
    safeSetText('thHolH', fn(hoH)); safeSetText('thHolD', fd(hoD)); safeSetText('thHolW', fw(hoH)); safeSetText('thHolM', fm(hoH));
    safeSetText('thTotalH', fn(totH)); safeSetText('thTotalD', fd(totD)); safeSetText('thTotalW', fw(totH)); safeSetText('thTotalM', fm(totH));
    safeSetText('thRowOTRate', '×' + (pr.otFactor || 1.5).toFixed(1));
    safeSetText('thRowNightRate', '+' + Math.round(((pr.nightFactor || 1.3) - 1) * 100) + '%');
    safeSetText('thRowHolRate', '×' + (pr.holidayFactor || 4).toFixed(1));
    safeSetText('thPeriodLabel', label);
    window._hoursData = {basicH:bH, otH, nightH:niH, holH:hoH, basicD:bD, totalD:totD};
  }

  window.calcSalary = calcSalaryActual;
  window.renderHomeStats = renderHomeStatsActual;
  window.renderHoursTable = renderHoursTableActual;
  try{ calcSalary = calcSalaryActual; }catch(e){}
  try{ renderHomeStats = renderHomeStatsActual; }catch(e){}
  try{ renderHoursTable = renderHoursTableActual; }catch(e){}
})();

/* PATCH v2.2.5 - Final hard-text i18n sweep for all 11 app languages */
(function(){
  const LANGS_11 = ['vi','en','ko','ja','zh','my','th','id','ph','ne','hi'];
  const HARD_TEXT = {
    heroTitle:{vi:'Chấm công đa quốc gia',en:'Multi-country attendance',ko:'다국가 출퇴근 관리',ja:'多国対応の勤怠管理',zh:'多国考勤管理',my:'နိုင်ငံစုံ အလုပ်ချိန်မှတ်တမ်း',th:'ลงเวลาหลายประเทศ',id:'Absensi multi-negara',ph:'Multi-country attendance',ne:'बहु-देशीय हाजिरी',hi:'बहु-देश उपस्थिति'},
    heroSub:{vi:'GPS, job phụ, lương, Excel/PDF và 11 ngôn ngữ trong một app.',en:'GPS, sub jobs, salary, Excel/PDF, and 11 languages in one app.',ko:'GPS, 부업, 급여, Excel/PDF, 11개 언어를 한 앱에서 관리합니다.',ja:'GPS、副業、給与、Excel/PDF、11言語を1つのアプリで管理します。',zh:'GPS、副业、工资、Excel/PDF 和 11 种语言集成在一个应用中。',my:'GPS၊ အပိုအလုပ်၊ လစာ၊ Excel/PDF နှင့် ဘာသာစကား ၁၁ မျိုးကို app တစ်ခုတည်းတွင် သုံးနိုင်သည်။',th:'GPS งานเสริม เงินเดือน Excel/PDF และ 11 ภาษาในแอปเดียว',id:'GPS, kerja sampingan, gaji, Excel/PDF, dan 11 bahasa dalam satu aplikasi.',ph:'GPS, sideline, sahod, Excel/PDF, at 11 wika sa iisang app.',ne:'GPS, सहायक काम, तलब, Excel/PDF र ११ भाषा एउटै app मा।',hi:'GPS, दूसरी नौकरी, वेतन, Excel/PDF और 11 भाषाएं एक ही app में।'},
    chooseLang:{vi:'Chọn ngôn ngữ bạn muốn dùng cho toàn bộ ứng dụng.',en:'Choose the language for the whole app.',ko:'앱 전체에서 사용할 언어를 선택하세요.',ja:'アプリ全体で使う言語を選択してください。',zh:'选择整个应用使用的语言。',my:'App တစ်ခုလုံးတွင် အသုံးပြုမည့် ဘာသာစကားကို ရွေးပါ။',th:'เลือกภาษาที่ต้องการใช้ทั้งแอป',id:'Pilih bahasa untuk seluruh aplikasi.',ph:'Piliin ang wikang gagamitin sa buong app.',ne:'पूरै app मा प्रयोग गर्ने भाषा छान्नुहोस्।',hi:'पूरे app के लिए भाषा चुनें।'},
    salaryTabHours:{vi:'⏱ Bảng giờ',en:'⏱ Hours',ko:'⏱ 근무시간',ja:'⏱ 時間表',zh:'⏱ 工时表',my:'⏱ နာရီဇယား',th:'⏱ ตารางชั่วโมง',id:'⏱ Jam kerja',ph:'⏱ Oras',ne:'⏱ घण्टा',hi:'⏱ घंटे'},
    salaryTabSalary:{vi:'💵 Bảng lương',en:'💵 Salary',ko:'💵 급여',ja:'💵 給与',zh:'💵 工资',my:'💵 လစာ',th:'💵 เงินเดือน',id:'💵 Gaji',ph:'💵 Sahod',ne:'💵 तलब',hi:'💵 वेतन'},
    periodWeek:{vi:'Tuần này',en:'This week',ko:'이번 주',ja:'今週',zh:'本周',my:'ဒီအပတ်',th:'สัปดาห์นี้',id:'Minggu ini',ph:'Linggong ito',ne:'यो हप्ता',hi:'इस सप्ताह'},
    periodMonth:{vi:'Tháng này',en:'This month',ko:'이번 달',ja:'今月',zh:'本月',my:'ဒီလ',th:'เดือนนี้',id:'Bulan ini',ph:'Buwang ito',ne:'यो महिना',hi:'इस महीने'},
    periodYear:{vi:'Năm nay',en:'This year',ko:'올해',ja:'今年',zh:'今年',my:'ဒီနှစ်',th:'ปีนี้',id:'Tahun ini',ph:'Taong ito',ne:'यो वर्ष',hi:'इस वर्ष'},
    totalHours:{vi:'Tổng giờ',en:'Total hours',ko:'총 시간',ja:'合計時間',zh:'总工时',my:'စုစုပေါင်းနာရီ',th:'ชั่วโมงรวม',id:'Total jam',ph:'Kabuuang oras',ne:'कुल घण्टा',hi:'कुल घंटे'},
    workDays:{vi:'Ngày công',en:'Workdays',ko:'근무일',ja:'勤務日',zh:'工作日',my:'အလုပ်ရက်',th:'วันทำงาน',id:'Hari kerja',ph:'Araw ng trabaho',ne:'काम दिन',hi:'कार्य दिवस'},
    overtime:{vi:'Tăng ca',en:'Overtime',ko:'초과근무',ja:'残業',zh:'加班',my:'အချိန်ပို',th:'ล่วงเวลา',id:'Lembur',ph:'Overtime',ne:'ओभरटाइम',hi:'ओवरटाइम'},
    hourType:{vi:'Loại giờ',en:'Hour type',ko:'시간 유형',ja:'時間区分',zh:'工时类型',my:'နာရီအမျိုးအစား',th:'ประเภทชั่วโมง',id:'Jenis jam',ph:'Uri ng oras',ne:'घण्टा प्रकार',hi:'घंटे का प्रकार'},
    hour:{vi:'Giờ',en:'Hours',ko:'시간',ja:'時間',zh:'小时',my:'နာရီ',th:'ชั่วโมง',id:'Jam',ph:'Oras',ne:'घण्टा',hi:'घंटे'},
    day:{vi:'Ngày',en:'Day',ko:'일',ja:'日',zh:'天',my:'ရက်',th:'วัน',id:'Hari',ph:'Araw',ne:'दिन',hi:'दिन'},
    week:{vi:'Tuần',en:'Week',ko:'주',ja:'週',zh:'周',my:'အပတ်',th:'สัปดาห์',id:'Minggu',ph:'Linggo',ne:'हप्ता',hi:'सप्ताह'},
    month:{vi:'Tháng',en:'Month',ko:'월',ja:'月',zh:'月',my:'လ',th:'เดือน',id:'Bulan',ph:'Buwan',ne:'महिना',hi:'माह'},
    basicHours:{vi:'🟢 Giờ cơ bản',en:'🟢 Basic hours',ko:'🟢 기본 시간',ja:'🟢 基本時間',zh:'🟢 基本工时',my:'🟢 အခြေခံနာရီ',th:'🟢 ชั่วโมงพื้นฐาน',id:'🟢 Jam dasar',ph:'🟢 Basic hours',ne:'🟢 आधारभूत घण्टा',hi:'🟢 मूल घंटे'},
    nightShift:{vi:'🌙 Ca đêm',en:'🌙 Night shift',ko:'🌙 야간',ja:'🌙 夜勤',zh:'🌙 夜班',my:'🌙 ညဆိုင်း',th:'🌙 กะกลางคืน',id:'🌙 Shift malam',ph:'🌙 Night shift',ne:'🌙 रात्री सिफ्ट',hi:'🌙 रात की शिफ्ट'},
    holidayWork:{vi:'🎌 Ngày lễ',en:'🎌 Holiday',ko:'🎌 공휴일',ja:'🎌 祝日',zh:'🎌 节假日',my:'🎌 ရုံးပိတ်ရက်',th:'🎌 วันหยุด',id:'🎌 Hari libur',ph:'🎌 Holiday',ne:'🎌 बिदा',hi:'🎌 अवकाश'},
    total:{vi:'📊 Tổng',en:'📊 Total',ko:'📊 합계',ja:'📊 合計',zh:'📊 合计',my:'📊 စုစုပေါင်း',th:'📊 รวม',id:'📊 Total',ph:'📊 Kabuuan',ne:'📊 कुल',hi:'📊 कुल'},
    salaryMode:{vi:'Cách trả lương',en:'Pay method',ko:'급여 방식',ja:'給与方式',zh:'工资方式',my:'လစာပေးချေမှု',th:'วิธีจ่ายเงิน',id:'Metode gaji',ph:'Paraan ng sahod',ne:'तलब विधि',hi:'वेतन विधि'},
    byMonth:{vi:'Theo tháng',en:'Monthly',ko:'월급',ja:'月給',zh:'按月',my:'လစဉ်',th:'รายเดือน',id:'Bulanan',ph:'Buwanang',ne:'मासिक',hi:'मासिक'},
    byDay:{vi:'Theo ngày',en:'Daily',ko:'일급',ja:'日給',zh:'按天',my:'နေ့စဉ်',th:'รายวัน',id:'Harian',ph:'Arawan',ne:'दैनिक',hi:'दैनिक'},
    byHour:{vi:'Theo giờ',en:'Hourly',ko:'시급',ja:'時給',zh:'按小时',my:'နာရီလိုက်',th:'รายชั่วโมง',id:'Per jam',ph:'Orasan',ne:'घण्टाको',hi:'प्रति घंटा'},
    estSalary:{vi:'Lương ước tính tháng này',en:'Estimated salary this month',ko:'이번 달 예상 급여',ja:'今月の推定給与',zh:'本月预计工资',my:'ဒီလ ခန့်မှန်းလစာ',th:'เงินเดือนประมาณเดือนนี้',id:'Estimasi gaji bulan ini',ph:'Tinatayang sahod ngayong buwan',ne:'यो महिनाको अनुमानित तलब',hi:'इस महीने का अनुमानित वेतन'},
    estNet:{vi:'Thực nhận ước tính',en:'Estimated net pay',ko:'예상 실수령액',ja:'推定手取り',zh:'预计实收',my:'ခန့်မှန်းလက်ခံငွေ',th:'รายได้สุทธิประมาณ',id:'Estimasi bersih',ph:'Tinatayang net pay',ne:'अनुमानित शुद्ध तलब',hi:'अनुमानित शुद्ध वेतन'},
    saveSalary:{vi:'✓ Lưu thông tin lương',en:'✓ Save salary info',ko:'✓ 급여 정보 저장',ja:'✓ 給与情報を保存',zh:'✓ 保存工资信息',my:'✓ လစာအချက်အလက် သိမ်း',th:'✓ บันทึกเงินเดือน',id:'✓ Simpan info gaji',ph:'✓ I-save ang sahod',ne:'✓ तलब जानकारी सुरक्षित',hi:'✓ वेतन जानकारी सहेजें'},
    saved:{vi:'✓ Đã lưu',en:'✓ Saved',ko:'✓ 저장됨',ja:'✓ 保存しました',zh:'✓ 已保存',my:'✓ သိမ်းပြီး',th:'✓ บันทึกแล้ว',id:'✓ Tersimpan',ph:'✓ Nai-save',ne:'✓ सुरक्षित भयो',hi:'✓ सहेजा गया'},
    excelPreview:{vi:'Xem trước dữ liệu xuất ra:',en:'Export preview:',ko:'내보내기 미리보기:',ja:'出力プレビュー:',zh:'导出预览：',my:'Export preview:',th:'ตัวอย่างข้อมูลส่งออก:',id:'Pratinjau ekspor:',ph:'Preview ng export:',ne:'निर्यात पूर्वावलोकन:',hi:'निर्यात पूर्वावलोकन:'},
    date:{vi:'Ngày',en:'Date',ko:'날짜',ja:'日付',zh:'日期',my:'ရက်',th:'วันที่',id:'Tanggal',ph:'Petsa',ne:'मिति',hi:'तारीख'},
    dow:{vi:'Thứ',en:'Day',ko:'요일',ja:'曜日',zh:'星期',my:'နေ့',th:'วัน',id:'Hari',ph:'Araw',ne:'बार',hi:'दिन'},
    status:{vi:'Trạng thái',en:'Status',ko:'상태',ja:'状態',zh:'状态',my:'အခြေအနေ',th:'สถานะ',id:'Status',ph:'Katayuan',ne:'अवस्था',hi:'स्थिति'},
    inTime:{vi:'Giờ vào',en:'In',ko:'출근',ja:'出勤',zh:'上班',my:'တက်',th:'เข้า',id:'Masuk',ph:'Pasok',ne:'प्रवेश',hi:'प्रवेश'},
    outTime:{vi:'Giờ ra',en:'Out',ko:'퇴근',ja:'退勤',zh:'下班',my:'ဆင်း',th:'ออก',id:'Keluar',ph:'Labas',ne:'निस्कने',hi:'प्रस्थान'},
    exportFilter:{vi:'LỌC DỮ LIỆU',en:'EXPORT FILTER',ko:'내보내기 필터',ja:'出力フィルター',zh:'导出筛选',my:'Export filter',th:'ตัวกรองส่งออก',id:'FILTER EKSPOR',ph:'EXPORT FILTER',ne:'निर्यात फिल्टर',hi:'निर्यात फ़िल्टर'},
    all:{vi:'Tất cả',en:'All',ko:'전체',ja:'すべて',zh:'全部',my:'အားလုံး',th:'ทั้งหมด',id:'Semua',ph:'Lahat',ne:'सबै',hi:'सभी'},
    mainJob:{vi:'Job chính',en:'Main job',ko:'주업무',ja:'本業',zh:'主业',my:'အဓိကအလုပ်',th:'งานหลัก',id:'Pekerjaan utama',ph:'Pangunahing trabaho',ne:'मुख्य काम',hi:'मुख्य नौकरी'},
    subJob:{vi:'Job phụ',en:'Sub job',ko:'부업',ja:'副業',zh:'副业',my:'အပိုအလုပ်',th:'งานเสริม',id:'Pekerjaan sampingan',ph:'Sideline',ne:'सहायक काम',hi:'दूसरी नौकरी'},
    fileName:{vi:'TÊN FILE',en:'FILE NAME',ko:'파일 이름',ja:'ファイル名',zh:'文件名',my:'ဖိုင်အမည်',th:'ชื่อไฟล์',id:'NAMA FILE',ph:'PANGALAN NG FILE',ne:'फाइल नाम',hi:'फ़ाइल नाम'},
    exportCsv:{vi:'📊 Xuất file Excel (.csv)',en:'📊 Export Excel (.csv)',ko:'📊 Excel CSV 내보내기',ja:'📊 Excel CSV出力',zh:'📊 导出 Excel CSV',my:'📊 Excel CSV ထုတ်',th:'📊 ส่งออก Excel CSV',id:'📊 Ekspor Excel CSV',ph:'📊 I-export Excel CSV',ne:'📊 Excel CSV निर्यात',hi:'📊 Excel CSV निर्यात'},
    exportPdf:{vi:'📄 Xuất file PDF',en:'📄 Export PDF',ko:'📄 PDF 내보내기',ja:'📄 PDF出力',zh:'📄 导出 PDF',my:'📄 PDF ထုတ်',th:'📄 ส่งออก PDF',id:'📄 Ekspor PDF',ph:'📄 I-export PDF',ne:'📄 PDF निर्यात',hi:'📄 PDF निर्यात'},
    dayResetShift:{vi:'Đặt lại theo ca',en:'Reset to shift',ko:'근무시간으로 재설정',ja:'シフトに戻す',zh:'按班次重置',my:'ဆိုင်းအတိုင်းပြန်ထား',th:'รีเซ็ตตามกะ',id:'Reset ke shift',ph:'I-reset sa shift',ne:'सिफ्ट अनुसार रिसेट',hi:'शिफ्ट के अनुसार रीसेट'},
    daySubTitle:{vi:'💼 Thêm ca job phụ',en:'💼 Add sub-job shift',ko:'💼 부업 근무 추가',ja:'💼 副業シフトを追加',zh:'💼 添加副业班次',my:'💼 အပိုအလုပ်ဆိုင်း ထည့်',th:'💼 เพิ่มกะงานเสริม',id:'💼 Tambah shift sampingan',ph:'💼 Magdagdag ng sideline shift',ne:'💼 सहायक काम सिफ्ट थप्नुहोस्',hi:'💼 दूसरी नौकरी की शिफ्ट जोड़ें'},
    daySubDesc:{vi:'Nhập giờ làm job phụ cùng ngày',en:'Enter sub-job hours for this day',ko:'이 날짜의 부업 시간을 입력하세요',ja:'この日の副業時間を入力',zh:'输入当天副业工时',my:'ဒီနေ့အပိုအလုပ်ချိန် ထည့်ပါ',th:'ใส่เวลางานเสริมของวันนี้',id:'Masukkan jam kerja sampingan hari ini',ph:'Ilagay ang oras ng sideline ngayong araw',ne:'आजको सहायक काम समय राख्नुहोस्',hi:'आज की दूसरी नौकरी का समय दर्ज करें'},
    subIn:{vi:'Giờ vào (phụ)',en:'In (sub)',ko:'출근 (부업)',ja:'出勤（副）',zh:'上班（副业）',my:'တက် (အပို)',th:'เข้า (เสริม)',id:'Masuk (sampingan)',ph:'Pasok (side)',ne:'प्रवेश (सहायक)',hi:'प्रवेश (दूसरी)'},
    subOut:{vi:'Giờ ra (phụ)',en:'Out (sub)',ko:'퇴근 (부업)',ja:'退勤（副）',zh:'下班（副业）',my:'ဆင်း (အပို)',th:'ออก (เสริม)',id:'Keluar (sampingan)',ph:'Labas (side)',ne:'निस्कने (सहायक)',hi:'प्रस्थान (दूसरी)'},
    cancel:{vi:'Hủy bỏ',en:'Cancel',ko:'취소',ja:'キャンセル',zh:'取消',my:'မလုပ်တော့ပါ',th:'ยกเลิก',id:'Batal',ph:'Kanselahin',ne:'रद्द',hi:'रद्द करें'},
    save:{vi:'Lưu lại',en:'Save',ko:'저장',ja:'保存',zh:'保存',my:'သိမ်း',th:'บันทึก',id:'Simpan',ph:'I-save',ne:'सुरक्षित',hi:'सहेजें'},
    deleteAll:{vi:'🗑 Xóa hết',en:'🗑 Delete all',ko:'🗑 모두 삭제',ja:'🗑 すべて削除',zh:'🗑 全部删除',my:'🗑 အားလုံးဖျက်',th:'🗑 ลบทั้งหมด',id:'🗑 Hapus semua',ph:'🗑 Burahin lahat',ne:'🗑 सबै मेटाउनुहोस्',hi:'🗑 सभी हटाएं'},
    resetTitle:{vi:'Xóa toàn bộ dữ liệu?',en:'Delete all data?',ko:'모든 데이터를 삭제할까요?',ja:'すべてのデータを削除しますか？',zh:'删除所有数据？',my:'ဒေတာအားလုံး ဖျက်မလား?',th:'ลบข้อมูลทั้งหมด?',id:'Hapus semua data?',ph:'Burahin lahat ng data?',ne:'सबै डेटा मेटाउने?',hi:'सभी डेटा हटाएं?'},
    aboutDesc:{vi:'App chấm công thông minh hỗ trợ 11 ngôn ngữ, GPS, job phụ, tính lương theo quốc gia và xuất Excel/PDF. Dữ liệu lưu trên thiết bị.',en:'Smart attendance app with 11 languages, GPS, sub jobs, country-based salary, and Excel/PDF export. Data stays on your device.',ko:'11개 언어, GPS, 부업, 국가별 급여 계산, Excel/PDF 내보내기를 지원하는 스마트 근태 앱입니다. 데이터는 기기에 저장됩니다.',ja:'11言語、GPS、副業、国別給与計算、Excel/PDF出力に対応した勤怠アプリです。データは端末に保存されます。',zh:'支持 11 种语言、GPS、副业、按国家计算工资和 Excel/PDF 导出的智能考勤应用。数据保存在设备上。',my:'ဘာသာစကား ၁၁ မျိုး၊ GPS၊ အပိုအလုပ်၊ နိုင်ငံအလိုက် လစာတွက်ချက်မှုနှင့် Excel/PDF export ပါသော app ဖြစ်သည်။ ဒေတာကို စက်ထဲတွင်သိမ်းသည်။',th:'แอปลงเวลาอัจฉริยะ รองรับ 11 ภาษา GPS งานเสริม คำนวณเงินเดือนตามประเทศ และส่งออก Excel/PDF ข้อมูลเก็บในอุปกรณ์',id:'Aplikasi absensi cerdas dengan 11 bahasa, GPS, pekerjaan sampingan, gaji berbasis negara, dan ekspor Excel/PDF. Data tersimpan di perangkat.',ph:'Smart attendance app na may 11 wika, GPS, sideline, salary per country, at Excel/PDF export. Nasa device ang data.',ne:'११ भाषा, GPS, सहायक काम, देश अनुसार तलब र Excel/PDF निर्यात भएको smart attendance app। डेटा तपाईंको device मै रहन्छ।',hi:'11 भाषाओं, GPS, दूसरी नौकरी, देश-आधारित वेतन और Excel/PDF export वाला smart attendance app। डेटा आपके device में रहता है।'},
    gpsTightTitle:{vi:'Ở công ty: GPS chặt',en:'At company: tight GPS',ko:'회사 근처: 정밀 GPS',ja:'会社付近: 厳密GPS',zh:'公司附近：严格 GPS',my:'ကုမ္ပဏီတွင်: GPS တင်းကျပ်',th:'ที่บริษัท: GPS เข้มงวด',id:'Di kantor: GPS ketat',ph:'Sa kumpanya: mahigpit na GPS',ne:'कम्पनीमा: कडा GPS',hi:'कंपनी में: सख्त GPS'},
    gpsTightHint:{vi:'Dùng bán kính 15m và vùng đệm 20m, vẫn chấm vào/ra bằng GPS.',en:'Use 15m radius and 20m buffer; GPS still clocks in/out.',ko:'15m 반경과 20m 버퍼를 사용하며 GPS 출퇴근은 계속 동작합니다.',ja:'半径15mと20mのバッファを使い、GPS打刻は維持します。',zh:'使用 15m 半径和 20m 缓冲区，仍通过 GPS 打卡。',my:'15m radius နှင့် 20m buffer သုံးပြီး GPS ဖြင့် ဆက်လက် မှတ်တမ်းတင်သည်။',th:'ใช้รัศมี 15m และ buffer 20m ยังลงเวลาเข้า/ออกด้วย GPS',id:'Gunakan radius 15m dan buffer 20m; GPS tetap absen masuk/keluar.',ph:'Gamit ang 15m radius at 20m buffer; GPS pa rin ang in/out.',ne:'१५m radius र २०m buffer प्रयोग हुन्छ; GPS ले नै प्रवेश/निस्कने गर्छ।',hi:'15m radius और 20m buffer का उपयोग; GPS से in/out जारी रहेगा।'},
    gpsPermTitle:{vi:'⚠️ Chưa cấp quyền vị trí',en:'⚠️ Location permission missing',ko:'⚠️ 위치 권한 없음',ja:'⚠️ 位置情報権限がありません',zh:'⚠️ 未授予位置权限',my:'⚠️ တည်နေရာခွင့်ပြုချက် မရှိသေး',th:'⚠️ ยังไม่ได้ให้สิทธิ์ตำแหน่ง',id:'⚠️ Izin lokasi belum ada',ph:'⚠️ Walang location permission',ne:'⚠️ स्थान अनुमति छैन',hi:'⚠️ स्थान अनुमति नहीं है'},
    gpsPermBody:{vi:'Vào <b>Cài đặt → Ứng dụng → Quyền</b> để bật vị trí.',en:'Open <b>Settings → Apps → Permissions</b> to enable Location.',ko:'<b>설정 → 앱 → 권한</b>에서 위치를 켜세요.',ja:'<b>設定 → アプリ → 権限</b>で位置情報を有効にしてください。',zh:'前往<b>设置 → 应用 → 权限</b>开启位置。',my:'<b>Settings → Apps → Permissions</b> တွင် Location ကို ဖွင့်ပါ။',th:'ไปที่ <b>ตั้งค่า → แอป → สิทธิ์</b> เพื่อเปิดตำแหน่ง',id:'Buka <b>Setelan → Aplikasi → Izin</b> untuk mengaktifkan Lokasi.',ph:'Buksan ang <b>Settings → Apps → Permissions</b> para i-on ang Location.',ne:'स्थान खोल्न <b>Settings → Apps → Permissions</b> मा जानुहोस्।',hi:'स्थान चालू करने के लिए <b>Settings → Apps → Permissions</b> खोलें।'},
    gpsHostTitle:{vi:'🌐 Cấp quyền GPS',en:'🌐 Enable GPS permission',ko:'🌐 GPS 권한 켜기',ja:'🌐 GPS権限を有効化',zh:'🌐 启用 GPS 权限',my:'🌐 GPS ခွင့်ပြုချက် ဖွင့်',th:'🌐 เปิดสิทธิ์ GPS',id:'🌐 Aktifkan izin GPS',ph:'🌐 I-enable GPS permission',ne:'🌐 GPS अनुमति खोल्नुहोस्',hi:'🌐 GPS अनुमति चालू करें'},
    gpsHostBody:{vi:'Upload lên <b>GitHub Pages</b> hoặc <b>Netlify</b> → mở HTTPS → GPS hoạt động.',en:'Upload to <b>GitHub Pages</b> or <b>Netlify</b> → open HTTPS → GPS works.',ko:'<b>GitHub Pages</b> 또는 <b>Netlify</b>에 업로드 → HTTPS로 열면 GPS가 동작합니다.',ja:'<b>GitHub Pages</b>または<b>Netlify</b>へアップロード → HTTPSで開くとGPSが動作します。',zh:'上传到 <b>GitHub Pages</b> 或 <b>Netlify</b> → 用 HTTPS 打开 → GPS 可用。',my:'<b>GitHub Pages</b> သို့မဟုတ် <b>Netlify</b> သို့ upload → HTTPS ဖြင့်ဖွင့် → GPS အသုံးပြုနိုင်သည်။',th:'อัปโหลดไป <b>GitHub Pages</b> หรือ <b>Netlify</b> → เปิดผ่าน HTTPS → GPS ใช้งานได้',id:'Upload ke <b>GitHub Pages</b> atau <b>Netlify</b> → buka HTTPS → GPS berfungsi.',ph:'I-upload sa <b>GitHub Pages</b> o <b>Netlify</b> → buksan HTTPS → gagana ang GPS.',ne:'<b>GitHub Pages</b> वा <b>Netlify</b> मा upload → HTTPS खोल्नुहोस् → GPS चल्छ।',hi:'<b>GitHub Pages</b> या <b>Netlify</b> पर upload → HTTPS खोलें → GPS चलेगा।'},
    gpsTip:{vi:'💡 Sau khi lưu vị trí, app dùng GPS để tự chấm công.',en:'💡 After saving location, the app uses GPS for automatic attendance.',ko:'💡 위치 저장 후 앱이 GPS로 자동 출퇴근을 기록합니다.',ja:'💡 位置を保存すると、GPSで自動打刻します。',zh:'💡 保存位置后，应用会用 GPS 自动打卡。',my:'💡 တည်နေရာသိမ်းပြီးပါက app သည် GPS ဖြင့် auto attendance လုပ်သည်။',th:'💡 หลังบันทึกตำแหน่ง แอปจะใช้ GPS ลงเวลาอัตโนมัติ',id:'💡 Setelah lokasi disimpan, aplikasi memakai GPS untuk absensi otomatis.',ph:'💡 Pag na-save ang lokasyon, GPS ang gagamitin para sa auto attendance.',ne:'💡 स्थान सुरक्षित भएपछि app ले GPS बाट auto attendance गर्छ।',hi:'💡 स्थान सहेजने के बाद app GPS से auto attendance करता है।'},
    splashQuote:{vi:'Chào buổi sáng! Chăm chỉ hôm nay, thanh thản ngày mai.',en:'Good morning! Work steadily today, breathe easier tomorrow.',ko:'좋은 아침입니다! 오늘의 성실함이 내일을 가볍게 합니다.',ja:'おはようございます。今日の積み重ねが明日の安心になります。',zh:'早上好！今天认真一点，明天轻松一点。',my:'မင်္ဂလာနံနက်ခင်းပါ။ ဒီနေ့ကြိုးစားမှုက မနက်ဖြန်ကို ပိုအေးချမ်းစေပါသည်။',th:'สวัสดีตอนเช้า! ตั้งใจวันนี้ พรุ่งนี้สบายใจขึ้น',id:'Selamat pagi! Tekun hari ini, lebih tenang esok hari.',ph:'Magandang umaga! Sipag ngayon, gaan bukas.',ne:'शुभ प्रभात! आजको मेहनतले भोलि सहज बनाउँछ।',hi:'सुप्रभात! आज मेहनत करें, कल सुकून मिलेगा।'},
    enterNameAlert:{vi:'Vui lòng nhập họ và tên!',en:'Please enter your full name!',ko:'이름을 입력하세요!',ja:'氏名を入力してください！',zh:'请输入姓名！',my:'အမည်အပြည့်အစုံ ထည့်ပါ။',th:'กรุณากรอกชื่อ-นามสกุล!',id:'Masukkan nama lengkap!',ph:'Ilagay ang buong pangalan!',ne:'कृपया पूरा नाम राख्नुहोस्!',hi:'कृपया पूरा नाम दर्ज करें!'},
    apkOnly:{vi:'⚠️ Chỉ hoạt động trong APK Android',en:'⚠️ Only works in the Android APK',ko:'⚠️ Android APK에서만 동작합니다',ja:'⚠️ Android APKでのみ動作します',zh:'⚠️ 仅在 Android APK 中可用',my:'⚠️ Android APK တွင်သာ အသုံးပြုနိုင်သည်',th:'⚠️ ใช้ได้เฉพาะ Android APK',id:'⚠️ Hanya berfungsi di APK Android',ph:'⚠️ Gumagana lang sa Android APK',ne:'⚠️ Android APK मा मात्र काम गर्छ',hi:'⚠️ केवल Android APK में काम करता है'},
    settingsOpenFail:{vi:'⚠️ Không mở được cài đặt: {err}',en:'⚠️ Could not open settings: {err}',ko:'⚠️ 설정을 열 수 없습니다: {err}',ja:'⚠️ 設定を開けません: {err}',zh:'⚠️ 无法打开设置：{err}',my:'⚠️ Settings ဖွင့်မရပါ: {err}',th:'⚠️ เปิดการตั้งค่าไม่ได้: {err}',id:'⚠️ Tidak bisa membuka setelan: {err}',ph:'⚠️ Hindi mabuksan ang settings: {err}',ne:'⚠️ Settings खोल्न सकिएन: {err}',hi:'⚠️ सेटिंग नहीं खुली: {err}'}
  };

  function lang(){
    try{
      const l = (window.userData && userData.lang) || localStorage.getItem('cp22_lang_ui') || localStorage.getItem('lang') || 'vi';
      return LANGS_11.includes(l) ? l : 'vi';
    }catch(e){ return 'vi'; }
  }
  function tr(key, subs){
    const L = lang();
    let txt;
    if(HARD_TEXT[key]) txt = HARD_TEXT[key][L] || HARD_TEXT[key].en || HARD_TEXT[key].vi;
    if(!txt && typeof u === 'function'){
      const v = u(key);
      if(v && v !== key) txt = v;
    }
    if(!txt && typeof TRAN !== 'undefined'){
      const pack = TRAN[L] || TRAN.vi || {};
      txt = pack[key];
    }
    txt = txt || key;
    if(subs) Object.keys(subs).forEach(k => { txt = txt.replace('{'+k+'}', subs[k]); });
    return txt;
  }
  function setText(id, key){
    const el = document.getElementById(id);
    if(el) el.textContent = tr(key);
  }
  function setHtml(id, key){
    const el = document.getElementById(id);
    if(el) el.innerHTML = tr(key);
  }
  function setAttr(id, attr, key){
    const el = document.getElementById(id);
    if(el) el.setAttribute(attr, tr(key));
  }
  function qText(sel, key){
    const el = document.querySelector(sel);
    if(el) el.textContent = tr(key);
  }
  function qHtml(sel, key){
    const el = document.querySelector(sel);
    if(el) el.innerHTML = tr(key);
  }

  function syncSalaryHardText(){
    setText('tabHours','salaryTabHours');
    setText('tabSalary','salaryTabSalary');
    setText('pbWeek','periodWeek');
    setText('pbMonth','periodMonth');
    setText('pbYear','periodYear');
    setText('thTongGioLbl','totalHours');
    setText('thNgayCongLbl','workDays');
    setText('thTangCaLbl','overtime');
    setText('thHLoai','hourType');
    setText('thHGio','hour');
    setText('thHNgay','day');
    setText('thHTuan','week');
    setText('thHThang','month');
    setText('thRowBasicLbl','basicHours');
    setText('thRowOTLbl','overtime');
    setText('thRowNightLbl','nightShift');
    setText('thRowHolLbl','holidayWork');
    setText('thRowTotalLbl','total');
    setText('salaryModeLbl','salaryMode');
    setText('smLblMonth','byMonth');
    setText('smLblDay','byDay');
    setText('smLblHour','byHour');
    setText('salaryEstTitle','estSalary');
    setText('salaryNetLabel','estNet');
    setText('btnSaveSalary','saveSalary');
    const btn = document.getElementById('btnSaveSalary');
    if(btn && !btn._i18nSaveHooked){
      btn.onclick = function(){
        if(typeof calcSalary === 'function') calcSalary();
        if(typeof showGpsBanner === 'function') showGpsBanner(tr('saved'), '#0D9E75');
      };
      btn._i18nSaveHooked = true;
    }
  }

  function syncExcelHardText(){
    setText('excelPreviewLbl','excelPreview');
    setText('excelFilterLbl','exportFilter');
    setText('efAll','all');
    setText('efMain','mainJob');
    setText('efSub','subJob');
    setText('excelFilenameLbl','fileName');
    const headers = ['date','dow','status','inTime','outTime'];
    document.querySelectorAll('#excelPreview .excel-row.head .excel-cell').forEach((el,i) => {
      if(headers[i]) el.textContent = tr(headers[i]);
    });
    const btn = document.getElementById('excelExportBtn');
    if(btn) btn.textContent = (window._exportFormat === 'pdf') ? tr('exportPdf') : tr('exportCsv');
    const fmt = document.querySelector('#excelFormatRow > div:first-child');
    if(fmt) fmt.textContent = tr('format');
  }

  function syncDayPanelHardText(){
    setText('dpStatusLbl','dpStatus');
    setText('dpActualLbl','dpActual');
    setText('dpInTimeLbl','inTime');
    setText('dpOutTimeLbl','outTime');
    setText('dpNoteLbl','dpNote');
    setAttr('dayNote','placeholder','dpNoteP');
    setText('dayCancelBtn','cancel');
    setText('daySaveBtn','save');
    qText('#dayTimeBlock span[onclick="dayResetTime()"]','dayResetShift');
    setText('daySubJobName','daySubTitle');
    qText('#dayJobTypeRow > div > div:nth-child(2)','daySubDesc');
    qText('#daySubFields > div:first-child > div','subIn');
    qText('#daySubFields > div:nth-child(2) > div','subOut');
  }

  function syncGpsHardText(){
    setText('gpsTightCompanyLbl','gpsTightTitle');
    setText('gpsTightCompanyHint','gpsTightHint');
    setText('gpsPermTitle','gpsPermTitle');
    setHtml('gpsPermBody','gpsPermBody');
    setText('gpsHostTitle','gpsHostTitle');
    qHtml('#gpsHostTitle + div','gpsHostBody');
    setText('gpsTip','gpsTip');
    setText('gpsV3StatsBtn','gpsv3.refresh');
    setText('gpsV3TrailBtn','gpsv3.trail_today');
    const status = document.getElementById('gpsStatusTxt');
    if(status){
      const raw = status.textContent || '';
      if(/Chưa thiết lập|Company location not set|회사|会社|公司|ကုမ္ပဏီ|ตำแหน่งบริษัท|kantor|कम्पनी|कंपनी/i.test(raw) && !/[()]/.test(raw)){
        status.textContent = tr('gps.no_setup');
      }
    }
  }

  function syncResetAndAbout(){
    qText('#panelConfirmReset [style*="E8433A"]','resetTitle');
    qText('#panelConfirmReset button:first-child','cancel');
    qText('#panelConfirmReset button:last-child','deleteAll');
    const aboutDesc = document.querySelector('#panelAbout [style*="line-height:1.6"]');
    if(aboutDesc) aboutDesc.textContent = tr('aboutDesc');
  }

  function syncOnboardingHardText(){
    const title = document.querySelector('.ob-hero-title');
    const sub = document.querySelector('.ob-hero-sub');
    if(title) title.textContent = tr('heroTitle');
    if(sub) sub.textContent = tr('heroSub');
    const obSub = document.querySelector('#obBody .ob-sub');
    if(obSub && /ngôn ngữ|language|언어|言語|语言|ဘာသာ|ภาษา|bahasa|wika|भाषा/i.test(obSub.textContent || '')){
      obSub.textContent = tr('chooseLang');
    }
  }

  function syncSplash(){
    setText('spDv','splash.days_present');
    setText('spNut','splash.start_btn');
    setText('spCau','splashQuote');
  }

  function syncStatic(){
    const L = lang();
    document.documentElement.lang = L;
    if(typeof getLang === 'function'){
      const pack = getLang();
      if(pack && pack.appName) document.title = pack.appName;
    }
    syncSalaryHardText();
    syncExcelHardText();
    syncDayPanelHardText();
    syncGpsHardText();
    syncResetAndAbout();
    syncOnboardingHardText();
    syncSplash();
  }

  function wrap(name){
    const fn = window[name];
    if(typeof fn !== 'function' || fn._hardI18nWrapped) return;
    const wrapped = function(){
      const result = fn.apply(this, arguments);
      setTimeout(syncStatic, 0);
      setTimeout(syncStatic, 80);
      return result;
    };
    wrapped._hardI18nWrapped = true;
    window[name] = wrapped;
  }

  function patchAlert(){
    if(window.alert && !window.alert._hardI18nWrapped){
      const rawAlert = window.alert;
      const patched = function(msg){
        let out = String(msg == null ? '' : msg);
        if(out === 'Vui lòng nhập họ và tên!') out = tr('enterNameAlert');
        else if(out === '⚠️ Chỉ hoạt động trong APK' || out === '⚠️ Chỉ hoạt động trong APK Android') out = tr('apkOnly');
        else if(out.indexOf('Không mở được cài đặt:') >= 0){
          out = tr('settingsOpenFail', {err: out.split('Không mở được cài đặt:').pop().trim()});
        }
        return rawAlert.call(this, out);
      };
      patched._hardI18nWrapped = true;
      window.alert = patched;
    }
  }

  function bootHardI18n(){
    patchAlert();
    ['applyI18n','renderOB','initHome','openPanel','openPanelGPS','renderCalBig','renderCalDayList','renderExcelPreview','updateExcelPanel','renderSetupSubJob','renderSubJobSalary','renderHoursTable','calcSalary','switchSalaryTab','setSalaryPeriod','setSalaryMode','openDayPanel','renderDayStatusGrid','updateDayJobTypeUI','refreshBgStatus','updateGpsStatus'].forEach(wrap);
    syncStatic();
  }

  document.addEventListener('DOMContentLoaded', () => {
    bootHardI18n();
    setTimeout(syncStatic, 250);
    setTimeout(syncStatic, 800);
  });
  setTimeout(bootHardI18n, 0);
  setTimeout(syncStatic, 1200);
  window.syncAllHardTextI18n = syncStatic;
})();

;(function(){
  if(window.__gpsCycleGuardInstalled) return;
  window.__gpsCycleGuardInstalled = true;
  var prevAutoIn = window.gpsAutoCheckin;
  if(typeof prevAutoIn !== 'function') return;
  window.gpsAutoCheckin = function(){
    var job = ((_gpsData && _gpsData.activeJob) || 'main') === 'sub' ? 'sub' : 'main';
    if(typeof gpsEnsureCycleForCheckin === 'function'){
      var canConfirm = !(document && document.visibilityState === 'hidden');
      var guard = gpsEnsureCycleForCheckin(job, {
        source: 'auto_wrapper',
        allowConfirm: canConfirm,
        showBanner: true
      });
      if(!guard || !guard.allowed){
        if(typeof _addGpsTrail === 'function'){
          _addGpsTrail({
            type: 'AUTO_CHECKIN_ABORTED',
            job: job,
            reason: guard && guard.reason ? guard.reason : 'cycle_blocked',
            minutesLeft: guard && guard.minutesLeft ? guard.minutesLeft : 0
          });
        }
        return;
      }
    } else if(typeof gpsCanStartNewAutoCycle === 'function' && !gpsCanStartNewAutoCycle(job)){
      var left = (typeof gpsMinutesUntilNewCycle === 'function') ? gpsMinutesUntilNewCycle(job) : 0;
      if(typeof _addGpsTrail === 'function') _addGpsTrail({type:'AUTO_CHECKIN_ABORTED', job:job, reason:'cycle_wait_8h', minutesLeft:left});
      if(typeof showGpsBanner === 'function') showGpsBanner(u('gps.cycle_wait', {m:left}), '#F5A623');
      return;
    }
    return prevAutoIn.apply(this, arguments);
  };
})();

  var oldDoExport=window.doExport; window.doExport=function(){if(_exportFormat==='pdf')return downloadPdf();if(typeof oldDoExport==='function')return oldDoExport();};
  try{ensureGpsV221();}catch(e){}
})();


