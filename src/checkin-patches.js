/* ═══════════════════════════════════════════════════════════════ */
/* PATCHES — v2.2.x */
/* ═══════════════════════════════════════════════════════════════ */


/* PATCH v2.2.2 — Calendar harmony + language sync for Sub Job / GPS / PDF */
(function(){
  const I18N2={
    vi:{filter:'LỌC DỮ LIỆU',all:'Tất cả',filename:'TÊN FILE',format:'ĐỊNH DẠNG FILE',csvBtn:'📊 Xuất file Excel (.csv)',pdfBtn:'📄 Xuất file PDF',gpsTarget:'🎯 GPS ÁP DỤNG CHO JOB',saved:'Đã lưu',notSaved:'Chưa lưu',gpsHint:'Chọn job rồi bấm “Lấy vị trí hiện tại” để lưu GPS riêng cho job đó.',print:'In / Lưu PDF',report:'Chấm Công Pro — Báo cáo chấm công',rows:'dòng dữ liệu',date:'Ngày',day:'Thứ',job:'Job',status:'Trạng thái',inn:'Vào',out:'Ra',hours:'Giờ',type:'Loại',note:'Ghi chú'},
    en:{filter:'DATA FILTER',all:'All',filename:'FILE NAME',format:'FILE FORMAT',csvBtn:'📊 Export Excel (.csv)',pdfBtn:'📄 Export PDF',gpsTarget:'🎯 GPS TARGET JOB',saved:'Saved',notSaved:'Not saved',gpsHint:'Choose a job, then tap “Get current location” to save GPS separately.',print:'Print / Save PDF',report:'Work Tracker Pro — Attendance report',rows:'data rows',date:'Date',day:'Day',job:'Job',status:'Status',inn:'In',out:'Out',hours:'Hours',type:'Type',note:'Note'},
    ko:{filter:'데이터 필터',all:'전체',filename:'파일 이름',format:'파일 형식',csvBtn:'📊 Excel 내보내기 (.csv)',pdfBtn:'📄 PDF 내보내기',gpsTarget:'🎯 GPS 적용 작업',saved:'저장됨',notSaved:'미저장',gpsHint:'작업을 선택한 뒤 “현재 위치 가져오기”를 눌러 GPS를 따로 저장하세요.',print:'인쇄 / PDF 저장',report:'근태 Pro — 근태 보고서',rows:'개 데이터',date:'날짜',day:'요일',job:'작업',status:'상태',inn:'출근',out:'퇴근',hours:'시간',type:'유형',note:'메모'},
    ja:{filter:'データフィルター',all:'すべて',filename:'ファイル名',format:'ファイル形式',csvBtn:'📊 Excel出力 (.csv)',pdfBtn:'📄 PDF出力',gpsTarget:'🎯 GPS対象ジョブ',saved:'保存済み',notSaved:'未保存',gpsHint:'ジョブを選び「現在地を取得」でGPSを個別保存します。',print:'印刷 / PDF保存',report:'勤怠Pro — 勤怠レポート',rows:'行のデータ',date:'日付',day:'曜日',job:'ジョブ',status:'状態',inn:'出勤',out:'退勤',hours:'時間',type:'種類',note:'メモ'},
    zh:{filter:'数据筛选',all:'全部',filename:'文件名',format:'文件格式',csvBtn:'📊 导出 Excel (.csv)',pdfBtn:'📄 导出 PDF',gpsTarget:'🎯 GPS适用工作',saved:'已保存',notSaved:'未保存',gpsHint:'选择工作后点击“获取当前位置”，分别保存GPS。',print:'打印 / 保存 PDF',report:'考勤Pro — 考勤报告',rows:'行数据',date:'日期',day:'星期',job:'工作',status:'状态',inn:'上班',out:'下班',hours:'小时',type:'类型',note:'备注'},
    my:{filter:'ဒေတာ စစ်ထုတ်',all:'အားလုံး',filename:'ဖိုင်အမည်',format:'ဖိုင်အမျိုးအစား',csvBtn:'📊 Excel ထုတ်ရန် (.csv)',pdfBtn:'📄 PDF ထုတ်ရန်',gpsTarget:'🎯 GPS အလုပ်ရွေးရန်',saved:'သိမ်းပြီး',notSaved:'မသိမ်းရသေး',gpsHint:'အလုပ်ရွေးပြီး လက်ရှိတည်နေရာကို သိမ်းပါ။',print:'Print / PDF သိမ်း',report:'Chấm Công Pro — Attendance report',rows:'ဒေတာတန်း',date:'ရက်စွဲ',day:'နေ့',job:'အလုပ်',status:'အခြေအနေ',inn:'ဝင်',out:'ထွက်',hours:'နာရီ',type:'အမျိုးအစား',note:'မှတ်ချက်'},
    th:{filter:'ตัวกรองข้อมูล',all:'ทั้งหมด',filename:'ชื่อไฟล์',format:'รูปแบบไฟล์',csvBtn:'📊 ส่งออก Excel (.csv)',pdfBtn:'📄 ส่งออก PDF',gpsTarget:'🎯 GPS สำหรับงาน',saved:'บันทึกแล้ว',notSaved:'ยังไม่บันทึก',gpsHint:'เลือกงานแล้วกด “รับตำแหน่งปัจจุบัน” เพื่อบันทึก GPS แยกกัน',print:'พิมพ์ / บันทึก PDF',report:'Work Tracker Pro — รายงานเข้างาน',rows:'แถวข้อมูล',date:'วันที่',day:'วัน',job:'งาน',status:'สถานะ',inn:'เข้า',out:'ออก',hours:'ชั่วโมง',type:'ประเภท',note:'หมายเหตุ'},
    id:{filter:'FILTER DATA',all:'Semua',filename:'NAMA FILE',format:'FORMAT FILE',csvBtn:'📊 Ekspor Excel (.csv)',pdfBtn:'📄 Ekspor PDF',gpsTarget:'🎯 GPS UNTUK PEKERJAAN',saved:'Tersimpan',notSaved:'Belum tersimpan',gpsHint:'Pilih pekerjaan lalu tekan “Ambil lokasi saat ini” untuk menyimpan GPS terpisah.',print:'Cetak / Simpan PDF',report:'Work Tracker Pro — Laporan absensi',rows:'baris data',date:'Tanggal',day:'Hari',job:'Pekerjaan',status:'Status',inn:'Masuk',out:'Keluar',hours:'Jam',type:'Jenis',note:'Catatan'},
    ph:{filter:'FILTER NG DATA',all:'Lahat',filename:'PANGALAN NG FILE',format:'FORMAT NG FILE',csvBtn:'📊 I-export Excel (.csv)',pdfBtn:'📄 I-export PDF',gpsTarget:'🎯 GPS PARA SA TRABAHO',saved:'Nai-save',notSaved:'Hindi pa save',gpsHint:'Pumili ng trabaho at pindutin ang “Kunin ang lokasyon” para i-save ang GPS.',print:'Print / Save PDF',report:'Work Tracker Pro — Ulat ng attendance',rows:'hanay ng data',date:'Petsa',day:'Araw',job:'Trabaho',status:'Katayuan',inn:'Pasok',out:'Labas',hours:'Oras',type:'Uri',note:'Tala'},
    ne:{filter:'डेटा फिल्टर',all:'सबै',filename:'फाइल नाम',format:'फाइल ढाँचा',csvBtn:'📊 Excel निर्यात (.csv)',pdfBtn:'📄 PDF निर्यात',gpsTarget:'🎯 GPS लागू हुने काम',saved:'सुरक्षित',notSaved:'सुरक्षित छैन',gpsHint:'काम छानेर “हालको स्थान लिनुहोस्” थिची GPS अलग सुरक्षित गर्नुहोस्।',print:'प्रिन्ट / PDF सुरक्षित',report:'Work Tracker Pro — हाजिरी रिपोर्ट',rows:'डेटा पंक्ति',date:'मिति',day:'बार',job:'काम',status:'अवस्था',inn:'प्रवेश',out:'निस्किने',hours:'घण्टा',type:'प्रकार',note:'नोट'},
    hi:{filter:'डेटा फ़िल्टर',all:'सभी',filename:'फ़ाइल नाम',format:'फ़ाइल फ़ॉर्मैट',csvBtn:'📊 Excel निर्यात करें (.csv)',pdfBtn:'📄 PDF निर्यात करें',gpsTarget:'🎯 GPS लागू नौकरी',saved:'सहेजा गया',notSaved:'सहेजा नहीं',gpsHint:'नौकरी चुनकर “वर्तमान स्थान लें” दबाएँ ताकि GPS अलग सेव हो।',print:'प्रिंट / PDF सेव',report:'Work Tracker Pro — उपस्थिति रिपोर्ट',rows:'डेटा पंक्तियाँ',date:'तारीख',day:'दिन',job:'नौकरी',status:'स्थिति',inn:'प्रवेश',out:'प्रस्थान',hours:'घंटे',type:'प्रकार',note:'नोट'}
  };
  function L2(){return (window.userData&&userData.lang)||'vi'}
  function i2(k){const L=L2(); return (I18N2[L]&&I18N2[L][k]) || I18N2.vi[k] || k}
  function exportType2(auto){const p=({vi:{auto:'Tự động',manual:'Thủ công'},en:{auto:'Auto',manual:'Manual'},ko:{auto:'자동',manual:'수동'},ja:{auto:'自動',manual:'手動'},zh:{auto:'自动',manual:'手动'},my:{auto:'အလိုအလျောက်',manual:'လက်ဖြင့်'},th:{auto:'อัตโนมัติ',manual:'ด้วยตนเอง'},id:{auto:'Otomatis',manual:'Manual'},ph:{auto:'Awtomatiko',manual:'Manual'},ne:{auto:'स्वचालित',manual:'म्यानुअल'},hi:{auto:'स्वचालित',manual:'मैनुअल'}}[L2()]||{auto:'Auto',manual:'Manual'});return auto?p.auto:p.manual;}
  function setTxt(id,txt){const el=document.getElementById(id); if(el) el.textContent=txt}

  const oldApply=window.applyI18n;
  window.applyI18n=function(){
    if(typeof oldApply==='function') oldApply.apply(this,arguments);
    syncNewFeatureLang();
  };

  window.syncNewFeatureLang=function(){
    setTxt('excelFilterLbl', i2('filter'));
    setTxt('efAll', i2('all'));
    setTxt('efMain', typeof u==='function'?u('job.main'):'Job chính');
    setTxt('efSub', typeof u==='function'?u('job.sub'):'Job phụ');
    setTxt('excelFilenameLbl', i2('filename'));
    const fmt=document.querySelector('#excelFormatRow > div:first-child'); if(fmt) fmt.textContent=i2('format');
    setTxt('efmtCsv','📊 Excel CSV'); setTxt('efmtPdf','📄 PDF');
    const btn=document.getElementById('excelExportBtn');
    if(btn) btn.textContent=(window._exportFormat==='pdf')?i2('pdfBtn'):i2('csvBtn');
    if(typeof window.renderGpsJobSwitch==='function') window.renderGpsJobSwitch();
  };

  window.renderGpsJobSwitch=function(){
    if(typeof ensureGpsV221==='function') ensureGpsV221();
    if(typeof _gpsData==='undefined') return;
    const card=document.getElementById('gpsSetupCard'); if(!card) return;
    let box=document.getElementById('gpsJobSwitchBox');
    if(!box){box=document.createElement('div');box.id='gpsJobSwitchBox';box.style.cssText='background:#F4F7F6;border-radius:14px;padding:12px;margin-bottom:12px;border:1px solid var(--border)';card.insertBefore(box,card.firstChild);}
    const hasSub=!!(window.userData&&userData.subJob&&userData.subJob.active);
    const subName=(hasSub&&userData.subJob.name)?userData.subJob.name:(typeof u==='function'?u('job.sub'):'Job phụ');
    const mainOn=(_gpsData.activeJob||'main')==='main', subOn=(_gpsData.activeJob||'main')==='sub';
    const mainLoc=(_gpsData.locations&&_gpsData.locations.main)||{}, subLoc=(_gpsData.locations&&_gpsData.locations.sub)||{};
    box.innerHTML=
      '<div style="font-size:12px;font-weight:900;color:var(--text2);margin-bottom:8px">'+i2('gpsTarget')+'</div>'+
      '<div style="display:flex;gap:8px;margin-bottom:8px">'+
      '<button onclick="setActiveGpsJob(\'main\')" style="flex:1;padding:10px;border-radius:10px;border:1.5px solid '+(mainOn?'var(--ac)':'var(--border)')+';background:'+(mainOn?'var(--ac)':'white')+';color:'+(mainOn?'white':'var(--text2)')+';font-size:12px;font-weight:900;font-family:Nunito,sans-serif">🏢 '+(typeof u==='function'?u('job.main'):'Job chính')+'</button>'+
      '<button onclick="setActiveGpsJob(\'sub\')" '+(!hasSub?'disabled':'')+' style="flex:1;padding:10px;border-radius:10px;border:1.5px solid '+(subOn?'#7B5EA7':'var(--border)')+';background:'+(subOn?'#7B5EA7':'white')+';color:'+(subOn?'white':'var(--text2)')+';opacity:'+(!hasSub?'.45':'1')+';font-size:12px;font-weight:900;font-family:Nunito,sans-serif">💼 '+String(subName).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))+'</button>'+
      '</div><div style="font-size:11px;color:var(--text3);line-height:1.45">🏢 '+(mainLoc.lat?i2('saved'):i2('notSaved'))+' · 💼 '+(subLoc.lat?i2('saved'):i2('notSaved'))+'<br>'+i2('gpsHint')+'</div>';
  };

  const oldSelExportFormat=window.selExportFormat;
  window.selExportFormat=function(fmt){
    if(typeof oldSelExportFormat==='function') oldSelExportFormat(fmt);
    const btn=document.getElementById('excelExportBtn');
    if(btn) btn.textContent=(window._exportFormat==='pdf')?i2('pdfBtn'):i2('csvBtn');
    const fmtLbl=document.querySelector('#excelFormatRow > div:first-child'); if(fmtLbl) fmtLbl.textContent=i2('format');
  };

  // Override PDF download through doExport so PDF header also follows language.
  const oldDoExport=window.doExport;
  window.doExport=function(){
    if(window._exportFormat!=='pdf') return oldDoExport && oldDoExport();
    const esc=v=>String(v==null?'':v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    const y=calView.y,m=calView.m,nd=new Date(y,m+1,0).getDate(),rows=[],T=getLang();
    const STATUS={cm:T.coMat||'Có mặt',vang:T.vang||'Vắng',np:T.nghiPhep||'Nghỉ phép',ll:legacyHolidayLabel(T)};
    function add(g,rec,label){
      let ins=rec?.in||'', outs=rec?.out||'', dur='';
      if(ins&&outs)dur=(((timeToMin(outs)-timeToMin(ins)+1440)%1440)/60).toFixed(1)+'h';
      let gps='',gi=rec?.gpsIn,go=rec?.gpsOut;
      if(gi&&gi.lat)gps='IN '+gi.lat.toFixed(5)+','+gi.lng.toFixed(5);
      if(go&&go.lat)gps+=(gps?' | ':'')+'OUT '+go.lat.toFixed(5)+','+go.lng.toFixed(5);
      rows.push({date:g+'/'+(m+1)+'/'+y,day:DAYS[new Date(y,m,g).getDay()],job:label,status:STATUS[rec?.type]||'',in:ins,out:outs,hours:dur,type:exportType2(!!(rec&&rec.auto)),note:rec?.note||'',gps});
    }
    for(let g=1;g<=nd;g++){const rec=attData[y+'-'+m+'-'+g]; if(!rec)continue; if(_exportFilter!=='sub')add(g,rec,u('job.main')); if(rec.sub&&_exportFilter!=='main')add(g,rec.sub,userData.subJob?.name||u('job.sub'));}
    const rawName=document.getElementById('excelFilename')?.value.trim()||'ChamCong';
    const th=[i2('date'),i2('day'),i2('job'),i2('status'),i2('inn'),i2('out'),i2('hours'),i2('type'),i2('note'),'GPS'];
    const html='<!doctype html><html><head><meta charset="utf-8"><title>'+esc(rawName)+'</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#1A2332}h1{font-size:20px;margin:0 0 6px}p{color:#667;margin:0 0 16px}table{width:100%;border-collapse:collapse;font-size:11px}th{background:#0D9E75;color:white}th,td{border:1px solid #ddd;padding:6px;text-align:left}.sub{color:#7B5EA7;font-weight:bold}@media print{button{display:none}}</style></head><body><button onclick="window.print()" style="padding:10px 16px;border-radius:10px;border:0;background:#0D9E75;color:white;font-weight:bold;margin-bottom:14px">'+i2('print')+'</button><h1>'+i2('report')+'</h1><p>'+(MONTHS[calView.m]||('T'+(calView.m+1)))+' '+calView.y+' · '+rows.length+' '+i2('rows')+'</p><table><thead><tr>'+th.map(x=>'<th>'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr><td>'+esc(r.date)+'</td><td>'+esc(r.day)+'</td><td class="'+(r.job===u('job.main')?'':'sub')+'">'+esc(r.job)+'</td><td>'+esc(r.status)+'</td><td>'+esc(r.in)+'</td><td>'+esc(r.out)+'</td><td>'+esc(r.hours)+'</td><td>'+esc(r.type)+'</td><td>'+esc(r.note)+'</td><td>'+esc(r.gps)+'</td></tr>').join('')+'</tbody></table><\u0073cript>setTimeout(function(){window.print()},500)<\/\u0073cript></body></html>';
    const w=window.open('','_blank');
    if(w){ w.document.open(); w.document.write(html); w.document.close(); }
    else { showGpsBanner(u('export.popup_blocked'),'#E8433A'); }
  };
})();


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


/* PATCH v2.2.4 — App-level onboarding/language selector polish */
(function(){
  var css = `
  #screenOB{background:linear-gradient(160deg,#F1FFFB 0%,#FFFFFF 45%,#EEF4FF 100%);}
  #screenOB .ob-wrap{min-height:100vh;position:relative;overflow:hidden;}
  #screenOB .ob-wrap:before{content:"";position:absolute;width:240px;height:240px;border-radius:50%;background:rgba(13,158,117,.12);top:-80px;right:-80px;}
  #screenOB .ob-wrap:after{content:"";position:absolute;width:200px;height:200px;border-radius:50%;background:rgba(123,94,167,.10);bottom:70px;left:-70px;}
  #screenOB .ob-header,#screenOB .ob-progress,#screenOB .ob-body,#screenOB .ob-footer{position:relative;z-index:1;}
  #screenOB .ob-header{padding:24px 20px 0;}
  #screenOB .ob-logo{font-size:23px;letter-spacing:.2px;}
  #screenOB .ob-skip{background:rgba(255,255,255,.82);backdrop-filter:blur(10px);box-shadow:0 6px 18px rgba(0,0,0,.05);}
  #screenOB .ob-progress{gap:8px;padding-top:20px;}
  #screenOB .ob-dot{height:5px;background:rgba(26,35,50,.08);}
  #screenOB .ob-dot.done,#screenOB .ob-dot.active{background:linear-gradient(90deg,var(--ac),#40E0D0);}
  #screenOB .ob-body{padding:28px 20px 12px;}
  #screenOB .ob-title{font-size:29px;line-height:1.15;letter-spacing:-.5px;}
  #screenOB .ob-sub{font-size:15px;color:#6B7B8D;line-height:1.65;max-width:330px;}
  #screenOB .lang-grid{grid-template-columns:repeat(2,1fr);gap:12px;margin-top:8px;}
  #screenOB .lang-item{border-radius:20px;padding:16px 10px;background:rgba(255,255,255,.9);box-shadow:0 10px 28px rgba(0,0,0,.06);border:2px solid rgba(232,236,240,.9);}
  #screenOB .lang-item .flag{font-size:32px;margin-bottom:6px;}
  #screenOB .lang-item .lname{font-size:13px;color:#546274;}
  #screenOB .lang-item.sel{background:linear-gradient(135deg,var(--ac-lt),#fff);border-color:var(--ac);transform:translateY(-2px);box-shadow:0 12px 30px rgba(13,158,117,.20);}
  #screenOB .country-grid{gap:12px;}
  #screenOB .country-item{border-radius:18px;background:rgba(255,255,255,.92);box-shadow:0 8px 24px rgba(0,0,0,.045);}
  #screenOB .field-input{border-radius:16px;padding:16px;background:rgba(255,255,255,.92);box-shadow:0 8px 20px rgba(0,0,0,.035);}
  #screenOB .ob-footer{padding:18px 20px 24px;background:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,.75));}
  #screenOB .ob-btn-back{box-shadow:0 10px 24px rgba(0,0,0,.06);background:white;}
  #screenOB .ob-btn-next{height:56px;border-radius:28px;background:linear-gradient(135deg,var(--ac),var(--ac2));box-shadow:0 12px 28px rgba(13,158,117,.30);}
  .ob-hero-card{background:rgba(255,255,255,.82);border:1px solid rgba(232,236,240,.85);box-shadow:0 16px 42px rgba(13,158,117,.11);border-radius:26px;padding:18px;margin:4px 0 6px;display:flex;align-items:center;gap:14px;}
  .ob-hero-icon{width:56px;height:56px;border-radius:18px;background:linear-gradient(135deg,var(--ac),#40E0D0);display:flex;align-items:center;justify-content:center;font-size:28px;box-shadow:0 10px 22px rgba(13,158,117,.25);}
  .ob-hero-title{font-size:15px;font-weight:900;color:#1A2332;}
  .ob-hero-sub{font-size:12px;color:#6B7B8D;margin-top:3px;line-height:1.35;}
  `;
  var style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
  var EXTRA={
    vi:{heroTitle:'Chấm công đa quốc gia',heroSub:'GPS, job phụ, lương, Excel/PDF và đa ngôn ngữ trong một app.',chooseLang:'Chọn ngôn ngữ bạn muốn dùng cho toàn bộ ứng dụng.'},
    ko:{heroTitle:'다국가 출퇴근 관리',heroSub:'GPS, 부업, 급여, Excel/PDF, 다국어를 하나의 앱에서 관리합니다.',chooseLang:'앱 전체에서 사용할 언어를 선택하세요.'},
    en:{heroTitle:'Multi-country attendance',heroSub:'GPS, side job, salary, Excel/PDF and multilingual support in one app.',chooseLang:'Choose the language for the whole app.'},
    ja:{heroTitle:'多国対応の勤怠管理',heroSub:'GPS、副業、給与、Excel/PDF、多言語を1つのアプリで管理します。',chooseLang:'アプリ全体で使う言語を選択してください。'},
    zh:{heroTitle:'多国考勤管理',heroSub:'GPS、副业、工资、Excel/PDF 和多语言集成在一个应用中。',chooseLang:'选择整个应用使用的语言。'},
    my:{heroTitle:'နိုင်ငံစုံ အလုပ်ချိန်မှတ်တမ်း',heroSub:'GPS၊ အပိုအလုပ်၊ လစာ၊ Excel/PDF နှင့် ဘာသာစကားစုံကို app တစ်ခုတည်းတွင် သုံးနိုင်သည်။',chooseLang:'App တစ်ခုလုံးတွင် အသုံးပြုမည့် ဘာသာစကားကို ရွေးပါ။'},
    th:{heroTitle:'ลงเวลาหลายประเทศ',heroSub:'GPS งานเสริม เงินเดือน Excel/PDF และหลายภาษาในแอปเดียว',chooseLang:'เลือกภาษาที่ต้องการใช้ทั้งแอป'},
    id:{heroTitle:'Absensi multi-negara',heroSub:'GPS, kerja sampingan, gaji, Excel/PDF, dan dukungan banyak bahasa dalam satu aplikasi.',chooseLang:'Pilih bahasa untuk seluruh aplikasi.'},
    ph:{heroTitle:'Multi-country attendance',heroSub:'GPS, sideline, sahod, Excel/PDF, at maraming wika sa iisang app.',chooseLang:'Piliin ang wikang gagamitin sa buong app.'},
    ne:{heroTitle:'बहु-देशीय हाजिरी',heroSub:'GPS, सहायक काम, तलब, Excel/PDF र बहुभाषा एउटै app मा।',chooseLang:'पूरै app मा प्रयोग गर्ने भाषा छान्नुहोस्।'},
    hi:{heroTitle:'बहु-देश उपस्थिति',heroSub:'GPS, दूसरी नौकरी, वेतन, Excel/PDF और कई भाषाएं एक ही app में।',chooseLang:'पूरे app के लिए भाषा चुनें।'}
  };
  function lang(){try{return userData?.lang||localStorage.getItem('lang')||'vi'}catch(e){return localStorage.getItem('lang')||'vi'}}
  function msg(k){var l=lang();return (EXTRA[l]&&EXTRA[l][k])||EXTRA.vi[k]||k}
  function enhanceOnboarding(){
    var body=document.getElementById('obBody'); if(!body) return;
    var title=body.querySelector('.ob-title');
    var sub=body.querySelector('.ob-sub');
    if(sub && /ngôn ngữ|언어|language/i.test(sub.textContent||'')) sub.textContent=msg('chooseLang');
    if(!body.querySelector('.ob-hero-card')){
      var card=document.createElement('div');card.className='ob-hero-card pop-in';
      card.innerHTML='<div class="ob-hero-icon">🌍</div><div><div class="ob-hero-title">'+msg('heroTitle')+'</div><div class="ob-hero-sub">'+msg('heroSub')+'</div></div>';
      if(title && title.parentNode) title.insertAdjacentElement('afterend',card); else body.prepend(card);
    }else{
      var ht=body.querySelector('.ob-hero-title'), hs=body.querySelector('.ob-hero-sub');
      if(ht) ht.textContent=msg('heroTitle'); if(hs) hs.textContent=msg('heroSub');
    }
  }
  var oldRender=window.renderOB;
  if(typeof oldRender==='function') window.renderOB=function(){var r=oldRender.apply(this,arguments);setTimeout(enhanceOnboarding,0);return r;};
  var oldSetLang=window.setLang;
  if(typeof oldSetLang==='function') window.setLang=function(l){var r=oldSetLang.apply(this,arguments);setTimeout(function(){try{applyI18n&&applyI18n()}catch(e){} enhanceOnboarding();},0);return r;};
  document.addEventListener('DOMContentLoaded',function(){setTimeout(enhanceOnboarding,80);});
  setTimeout(enhanceOnboarding,200);
})();

/* PATCH v2.2.5 — GPS permission guard, native attendance sync, professional permission fallback */
(function(){
  if(window.__gpsPermissionAndSyncPatchInstalled) return;
  window.__gpsPermissionAndSyncPatchInstalled = true;

  function isNativeRuntime(){
    try{
      return !!((window.Capacitor && (!Capacitor.isNativePlatform || Capacitor.isNativePlatform())) ||
        (window.ccNative && window.ccNative.isNative));
    }catch(e){ return false; }
  }

  function nativePlugin(){
    return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.ChamCongNative;
  }

  function showPermissionNotice(kind, openFail){
    const L = (window.userData && userData.lang) || 'vi';
    const all = {
      vi:{
        openFailTitle:'Không mở được cài đặt tự động', openFailBody:'Bạn vẫn có thể cấp quyền thủ công theo các bước bên dưới.', closeBtn:'Đã hiểu', openBtn:'Mở cài đặt',
        notification:{icon:'🔔',title:'Cần bật quyền thông báo',body:'Chấm Công Pro dùng thông báo để nhắc vào ca, xác nhận tan ca và báo khi GPS tự chấm công.',steps:['Mở Cài đặt > Ứng dụng > Chấm Công Pro.','Vào Thông báo.','Bật Cho phép thông báo và các kênh nhắc ca.']},
        location:{icon:'📍',title:'Cần bật quyền vị trí',body:'GPS tự động cần quyền Vị trí để lưu nơi làm việc và chấm vào/ra ca ổn định.',steps:['Mở Cài đặt > Ứng dụng > Chấm Công Pro.','Vào Quyền > Vị trí.','Chọn Luôn cho phép hoặc Cho phép mọi lúc, bật Vị trí chính xác nếu có.']},
        battery:{icon:'🔋',title:'Cần chỉnh quyền pin',body:'Để GPS chạy nền ổn định, hãy đặt pin của ứng dụng sang Không hạn chế.',steps:['Mở Cài đặt > Ứng dụng > Chấm Công Pro.','Vào Pin hoặc Sử dụng pin.','Chọn Không hạn chế / Unrestricted. Nếu app nằm trong Ngủ hoặc Ngủ sâu, hãy bỏ khỏi danh sách đó.']}
      },
      en:{
        openFailTitle:'Could not open settings automatically', openFailBody:'You can still grant permission manually by following the steps below.', closeBtn:'Got it', openBtn:'Open settings',
        notification:{icon:'🔔',title:'Enable notification permission',body:'Chấm Công Pro uses notifications for shift reminders and GPS attendance results.',steps:['Open Settings > Apps > Chấm Công Pro.','Open Notifications.','Allow notifications and shift reminder channels.']},
        location:{icon:'📍',title:'Enable location permission',body:'Automatic GPS needs Location permission to save your workplace and clock in/out reliably.',steps:['Open Settings > Apps > Chấm Công Pro.','Open Permissions > Location.','Choose Allow all the time and enable Precise location if available.']},
        battery:{icon:'🔋',title:'Adjust battery permission',body:'For reliable background GPS, set this app battery mode to Unrestricted.',steps:['Open Settings > Apps > Chấm Công Pro.','Open Battery or Battery usage.','Choose Unrestricted. Remove the app from Sleeping or Deep sleeping apps if present.']}
      },
      ko:{
        openFailTitle:'설정을 자동으로 열 수 없습니다', openFailBody:'아래 단계에 따라 수동으로 권한을 허용할 수 있습니다.', closeBtn:'확인', openBtn:'설정 열기',
        notification:{icon:'🔔',title:'알림 권한을 켜세요',body:'Chấm Công Pro는 출근 알림, 퇴근 확인, GPS 자동 기록 결과 알림에 사용됩니다.',steps:['설정 > 앱 > Chấm Công Pro를 엽니다.','알림을 엽니다.','알림 허용과 근무 알림 채널을 켭니다.']},
        location:{icon:'📍',title:'위치 권한을 켜세요',body:'GPS 자동 출퇴근은 근무지를 저장하고 안정적으로 출퇴근을 기록하기 위해 위치 권한이 필요합니다.',steps:['설정 > 앱 > Chấm Công Pro를 엽니다.','권한 > 위치를 엽니다.','항상 허용을 선택하고 가능한 경우 정확한 위치를 켭니다.']},
        battery:{icon:'🔋',title:'배터리 권한을 조정하세요',body:'백그라운드 GPS가 안정적으로 동작하려면 앱 배터리를 제한 없음으로 설정하세요.',steps:['설정 > 앱 > Chấm Công Pro를 엽니다.','배터리 또는 배터리 사용량을 엽니다.','제한 없음을 선택합니다. 절전/초절전 앱 목록에 있으면 제거합니다.']}
      },
      ja:{
        openFailTitle:'設定を自動で開けません', openFailBody:'下の手順で手動でも権限を許可できます。', closeBtn:'了解', openBtn:'設定を開く',
        notification:{icon:'🔔',title:'通知権限を有効にしてください',body:'Chấm Công Proはシフト通知、退勤確認、GPS自動打刻の結果通知に使います。',steps:['設定 > アプリ > Chấm Công Pro を開きます。','通知を開きます。','通知許可とシフト通知チャンネルを有効にします。']},
        location:{icon:'📍',title:'位置情報権限を有効にしてください',body:'GPS自動打刻には、勤務先の保存と安定した出退勤記録のため位置情報権限が必要です。',steps:['設定 > アプリ > Chấm Công Pro を開きます。','権限 > 位置情報を開きます。','常に許可を選び、可能なら正確な位置情報を有効にします。']},
        battery:{icon:'🔋',title:'バッテリー権限を調整してください',body:'バックグラウンドGPSを安定させるには、アプリのバッテリー設定を無制限にしてください。',steps:['設定 > アプリ > Chấm Công Pro を開きます。','バッテリーまたはバッテリー使用量を開きます。','無制限を選びます。スリープ中のアプリにある場合は削除してください。']}
      },
      zh:{
        openFailTitle:'无法自动打开设置', openFailBody:'你仍可按以下步骤手动授予权限。', closeBtn:'知道了', openBtn:'打开设置',
        notification:{icon:'🔔',title:'请开启通知权限',body:'Chấm Công Pro 使用通知来提醒上班、确认下班，并提示 GPS 自动打卡结果。',steps:['打开 设置 > 应用 > Chấm Công Pro。','进入 通知。','允许通知并开启班次提醒频道。']},
        location:{icon:'📍',title:'请开启位置权限',body:'GPS 自动打卡需要位置权限，以保存工作地点并稳定记录上下班。',steps:['打开 设置 > 应用 > Chấm Công Pro。','进入 权限 > 位置。','选择始终允许，并在可用时开启精确位置。']},
        battery:{icon:'🔋',title:'请调整电池权限',body:'为保证后台 GPS 稳定运行，请将应用电池设置为不受限制。',steps:['打开 设置 > 应用 > Chấm Công Pro。','进入 电池 或 电池使用情况。','选择不受限制。若应用在睡眠/深度睡眠列表中，请移除。']}
      },
      my:{
        openFailTitle:'Settings ကို အလိုအလျောက် မဖွင့်နိုင်ပါ', openFailBody:'အောက်ပါအဆင့်များအတိုင်း လက်ဖြင့် ခွင့်ပြုနိုင်ပါသည်။', closeBtn:'နားလည်ပါပြီ', openBtn:'Settings ဖွင့်ရန်',
        notification:{icon:'🔔',title:'အသိပေးချက် ခွင့်ပြုချက် ဖွင့်ပါ',body:'Chấm Công Pro သည် shift သတိပေးချက်၊ ဆင်းချိန်အတည်ပြုချက်နှင့် GPS auto attendance ရလဒ်များအတွက် notification ကို အသုံးပြုသည်။',steps:['Settings > Apps > Chấm Công Pro ကို ဖွင့်ပါ။','Notifications ကို ဖွင့်ပါ။','Notifications နှင့် shift reminder channels ကို ခွင့်ပြုပါ။']},
        location:{icon:'📍',title:'တည်နေရာ ခွင့်ပြုချက် ဖွင့်ပါ',body:'GPS auto attendance သည် အလုပ်နေရာ သိမ်းရန်နှင့် ဝင်/ထွက် မှတ်တမ်းတင်ရန် Location permission လိုအပ်သည်။',steps:['Settings > Apps > Chấm Công Pro ကို ဖွင့်ပါ။','Permissions > Location ကို ဖွင့်ပါ။','Allow all the time ကို ရွေးပြီး ရှိပါက Precise location ကို ဖွင့်ပါ။']},
        battery:{icon:'🔋',title:'Battery permission ပြင်ပါ',body:'Background GPS တည်ငြိမ်ရန် app battery mode ကို Unrestricted သို့ ပြောင်းပါ။',steps:['Settings > Apps > Chấm Công Pro ကို ဖွင့်ပါ။','Battery သို့မဟုတ် Battery usage ကို ဖွင့်ပါ။','Unrestricted ကို ရွေးပါ။ Sleeping/Deep sleeping apps ထဲရှိပါက ဖယ်ရှားပါ။']}
      },
      th:{
        openFailTitle:'เปิดการตั้งค่าอัตโนมัติไม่ได้', openFailBody:'คุณยังสามารถให้สิทธิ์ด้วยตนเองตามขั้นตอนด้านล่าง', closeBtn:'เข้าใจแล้ว', openBtn:'เปิดการตั้งค่า',
        notification:{icon:'🔔',title:'เปิดสิทธิ์การแจ้งเตือน',body:'Chấm Công Pro ใช้การแจ้งเตือนเพื่อเตือนกะ ยืนยันเวลาออก และแจ้งผล GPS อัตโนมัติ',steps:['เปิด ตั้งค่า > แอป > Chấm Công Pro','เข้า การแจ้งเตือน','อนุญาตการแจ้งเตือนและช่องเตือนกะ']},
        location:{icon:'📍',title:'เปิดสิทธิ์ตำแหน่ง',body:'GPS อัตโนมัติต้องใช้ตำแหน่งเพื่อบันทึกที่ทำงานและลงเวลาเข้า/ออกอย่างเสถียร',steps:['เปิด ตั้งค่า > แอป > Chấm Công Pro','เข้า สิทธิ์ > ตำแหน่ง','เลือก อนุญาตตลอดเวลา และเปิดตำแหน่งที่แม่นยำถ้ามี']},
        battery:{icon:'🔋',title:'ปรับสิทธิ์แบตเตอรี่',body:'เพื่อให้ GPS ทำงานเบื้องหลังได้เสถียร ให้ตั้งค่าแบตเตอรี่ของแอปเป็นไม่จำกัด',steps:['เปิด ตั้งค่า > แอป > Chấm Công Pro','เข้า แบตเตอรี่ หรือ การใช้แบตเตอรี่','เลือก ไม่จำกัด และนำแอปออกจากรายการพัก/หลับลึกถ้ามี']}
      },
      id:{
        openFailTitle:'Setelan tidak bisa dibuka otomatis', openFailBody:'Anda tetap bisa memberi izin manual dengan langkah berikut.', closeBtn:'Mengerti', openBtn:'Buka setelan',
        notification:{icon:'🔔',title:'Aktifkan izin notifikasi',body:'Chấm Công Pro memakai notifikasi untuk pengingat shift, konfirmasi pulang, dan hasil absensi GPS.',steps:['Buka Setelan > Aplikasi > Chấm Công Pro.','Buka Notifikasi.','Izinkan notifikasi dan kanal pengingat shift.']},
        location:{icon:'📍',title:'Aktifkan izin lokasi',body:'GPS otomatis membutuhkan izin Lokasi untuk menyimpan tempat kerja dan mencatat masuk/keluar dengan stabil.',steps:['Buka Setelan > Aplikasi > Chấm Công Pro.','Buka Izin > Lokasi.','Pilih Izinkan sepanjang waktu dan aktifkan lokasi presisi jika tersedia.']},
        battery:{icon:'🔋',title:'Sesuaikan izin baterai',body:'Agar GPS latar belakang stabil, atur baterai aplikasi ke Tidak dibatasi.',steps:['Buka Setelan > Aplikasi > Chấm Công Pro.','Buka Baterai atau Penggunaan baterai.','Pilih Tidak dibatasi. Jika ada di aplikasi tidur/tidur nyenyak, hapus dari daftar.']}
      },
      ph:{
        openFailTitle:'Hindi mabuksan ang settings nang awtomatiko', openFailBody:'Maaari mo pa ring payagan ito nang manual gamit ang mga hakbang sa ibaba.', closeBtn:'Nakuha ko', openBtn:'Buksan settings',
        notification:{icon:'🔔',title:'I-enable ang notification permission',body:'Ginagamit ng Chấm Công Pro ang notifications para sa shift reminders, checkout confirmation, at GPS attendance results.',steps:['Buksan Settings > Apps > Chấm Công Pro.','Buksan Notifications.','Payagan ang notifications at shift reminder channels.']},
        location:{icon:'📍',title:'I-enable ang location permission',body:'Kailangan ng automatic GPS ang Location permission para i-save ang workplace at mag-clock in/out nang maayos.',steps:['Buksan Settings > Apps > Chấm Công Pro.','Buksan Permissions > Location.','Piliin ang Allow all the time at i-on ang Precise location kung meron.']},
        battery:{icon:'🔋',title:'Ayusin ang battery permission',body:'Para sa maaasahang background GPS, gawing Unrestricted ang battery mode ng app.',steps:['Buksan Settings > Apps > Chấm Công Pro.','Buksan Battery o Battery usage.','Piliin ang Unrestricted. Alisin sa Sleeping/Deep sleeping apps kung naroon.']}
      },
      ne:{
        openFailTitle:'Settings आफैं खुल्न सकेन', openFailBody:'तलका चरण पालना गरेर अनुमति हातैले दिन सक्नुहुन्छ।', closeBtn:'बुझेँ', openBtn:'Settings खोल्नुहोस्',
        notification:{icon:'🔔',title:'सूचना अनुमति खोल्नुहोस्',body:'Chấm Công Pro ले shift reminder, बाहिर पुष्टि र GPS attendance नतिजाका लागि सूचना प्रयोग गर्छ।',steps:['Settings > Apps > Chấm Công Pro खोल्नुहोस्।','Notifications खोल्नुहोस्।','Notifications र shift reminder channels अनुमति दिनुहोस्।']},
        location:{icon:'📍',title:'स्थान अनुमति खोल्नुहोस्',body:'Automatic GPS लाई कार्यस्थल सुरक्षित गर्न र प्रवेश/बाहिर स्थिर रूपमा रेकर्ड गर्न Location permission चाहिन्छ।',steps:['Settings > Apps > Chấm Công Pro खोल्नुहोस्।','Permissions > Location खोल्नुहोस्।','Allow all the time छान्नुहोस् र उपलब्ध भए Precise location खोल्नुहोस्।']},
        battery:{icon:'🔋',title:'ब्याट्री अनुमति मिलाउनुहोस्',body:'Background GPS स्थिर राख्न app battery mode लाई Unrestricted राख्नुहोस्।',steps:['Settings > Apps > Chấm Công Pro खोल्नुहोस्।','Battery वा Battery usage खोल्नुहोस्।','Unrestricted छान्नुहोस्। Sleeping/Deep sleeping apps मा भए हटाउनुहोस्।']}
      },
      hi:{
        openFailTitle:'Settings अपने आप नहीं खुली', openFailBody:'आप नीचे दिए चरणों से अनुमति मैन्युअल रूप से दे सकते हैं।', closeBtn:'समझ गया', openBtn:'Settings खोलें',
        notification:{icon:'🔔',title:'Notification permission चालू करें',body:'Chấm Công Pro shift reminders, checkout confirmation और GPS attendance results के लिए notifications का उपयोग करता है।',steps:['Settings > Apps > Chấm Công Pro खोलें।','Notifications खोलें।','Notifications और shift reminder channels अनुमति दें।']},
        location:{icon:'📍',title:'Location permission चालू करें',body:'Automatic GPS को workplace save करने और clock in/out स्थिर रूप से रिकॉर्ड करने के लिए Location permission चाहिए।',steps:['Settings > Apps > Chấm Công Pro खोलें।','Permissions > Location खोलें।','Allow all the time चुनें और उपलब्ध हो तो Precise location चालू करें।']},
        battery:{icon:'🔋',title:'Battery permission समायोजित करें',body:'Background GPS स्थिर रखने के लिए app battery mode को Unrestricted करें।',steps:['Settings > Apps > Chấm Công Pro खोलें।','Battery या Battery usage खोलें।','Unrestricted चुनें। Sleeping/Deep sleeping apps में हो तो हटाएं।']}
      }
    };
    const pack = all[L] || all.en;
    const set = (pack[kind]) || all.vi.location;
    const esc = typeof permEscHtml === 'function' ? permEscHtml : function(s){
      return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
    };
    let ov = document.getElementById('permissionGuideOv');
    if(ov) ov.remove();
    ov = document.createElement('div');
    ov.id = 'permissionGuideOv';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(10,16,28,.62);z-index:32000;display:flex;align-items:center;justify-content:center;padding:18px;backdrop-filter:blur(6px)';
    ov.innerHTML =
      '<div style="width:100%;max-width:390px;background:white;border-radius:22px;padding:22px 18px;box-shadow:0 24px 80px rgba(0,0,0,.35);font-family:Nunito,sans-serif;color:var(--text)">'+
        '<div style="display:flex;gap:12px;align-items:center;margin-bottom:10px">'+
          '<div style="width:42px;height:42px;border-radius:14px;background:#EEF4FF;color:#2D7DD2;display:flex;align-items:center;justify-content:center;font-size:22px">'+esc(set.icon)+'</div>'+
          '<div style="font-size:18px;font-weight:900;line-height:1.2">'+esc(openFail ? pack.openFailTitle : set.title)+'</div>'+
        '</div>'+
        '<div style="font-size:13px;color:var(--text2);line-height:1.55;margin-bottom:12px">'+esc(openFail ? pack.openFailBody : set.body)+'</div>'+
        '<div style="display:flex;flex-direction:column;gap:8px;margin:12px 0 16px">'+
          set.steps.map(function(s,i){return '<div style="background:#F4F7F6;border-radius:12px;padding:10px 12px;font-size:13px;line-height:1.45"><b>'+(i+1)+'.</b> '+esc(s)+'</div>';}).join('')+
        '</div>'+
        '<div style="display:flex;gap:10px">'+
          '<button id="permissionGuideClose" style="flex:1;padding:13px;border-radius:12px;border:1.5px solid var(--border);background:white;color:var(--text2);font-size:13px;font-weight:800;font-family:Nunito,sans-serif">'+esc(pack.closeBtn)+'</button>'+
          '<button id="permissionGuideOpen" style="flex:1.45;padding:13px;border-radius:12px;border:none;background:var(--ac);color:white;font-size:13px;font-weight:900;font-family:Nunito,sans-serif">'+esc(pack.openBtn)+'</button>'+
        '</div>'+
      '</div>';
    document.body.appendChild(ov);
    document.getElementById('permissionGuideClose').onclick = function(){ ov.remove(); };
    document.getElementById('permissionGuideOpen').onclick = function(){
      ov.remove();
      window.openNativePermissionSetting(kind);
    };
  }

  async function ensureLocationPermissionForGps(){
    if(isNativeRuntime() && typeof gpsEnsureNativeLocationPermission === 'function'){
      return await gpsEnsureNativeLocationPermission();
    }
    const geo = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Geolocation;
    if(!geo || !isNativeRuntime()) return true;
    try{
      if(geo.checkPermissions){
        const cur = await geo.checkPermissions();
        if(cur && (cur.location === 'granted' || cur.coarseLocation === 'granted')) return true;
      }
      if(geo.requestPermissions){
        const res = await geo.requestPermissions();
        return !!(res && (res.location === 'granted' || res.coarseLocation === 'granted'));
      }
    }catch(e){ console.warn('[GPS Permission] request/check failed:', e); }
    return false;
  }

  /* [ATTENDANCE_NATIVE_QUEUE_MERGE]
     Ghi chu: day la cau noi dua record native ve so cham cong chinh attData.
     NativeGpsService chi ghi queue; app merge vao cp22_att roi moi hien tren UI.
  */
  async function mergeNativeAttendanceRecords(records){
    let merged = 0;
    if(!window.attData) window.attData = {};
    (records || []).forEach(function(rec){
      const key = rec && rec.date;
      const type = rec && rec.type;
      const time = rec && rec.time;
      if(!key || !time) return;
      if(!attData[key]) attData[key] = {type:'cm'};
      attData[key].type = attData[key].type || 'cm';
      if(type === 'IN' && !attData[key].in){
        attData[key].in = time;
        attData[key].auto = true;
        if(rec.ts) attData[key].gpsInTs = rec.ts;
        merged++;
      }else if(type === 'OUT' && !attData[key].out){
        attData[key].out = time;
        attData[key].auto = true;
        if(rec.ts) attData[key].gpsOutTs = rec.ts;
        merged++;
      }
    });
    if(merged > 0){
      if(typeof saveAtt === 'function') saveAtt();
      else if(typeof lsSet === 'function') lsSet('cp22_att', attData);
      if(typeof renderHomeStats === 'function') renderHomeStats();
      if(typeof updateTodayStatusTime === 'function') updateTodayStatusTime();
      if(typeof renderCalBig === 'function') renderCalBig();
      if(typeof renderExcelPreview === 'function') renderExcelPreview();
      if(typeof updateExcelPanel === 'function') updateExcelPanel();
    }
    return merged;
  }

  window.pullNativeAttendanceNow = async function(){
    const plugin = nativePlugin();
    if(!plugin || !plugin.getNativeAttendance) return {merged:0, skipped:true};
    try{
      const res = await plugin.getNativeAttendance();
      const records = (res && res.records) || [];
      const merged = await mergeNativeAttendanceRecords(records);
      if(records.length && plugin.clearNativeAttendance){
        if(window.ccNative && window.ccNative.syncNativeAttendanceState){
          try{ await window.ccNative.syncNativeAttendanceState(); }catch(e){}
        }
        try{ await plugin.clearNativeAttendance({clearAll:true}); }catch(e){ console.warn('[NativeAtt] clear failed:', e); }
      }
      return {merged, records:records.length};
    }catch(e){
      console.warn('[NativeAtt] pull failed:', e);
      return {merged:0, error:String(e && e.message || e)};
    }
  };

  const oldOpenNativePermissionSetting = window.openNativePermissionSetting;
  window.openNativePermissionSetting = async function(kind){
    const plugin = nativePlugin();
    const nativeOk = isNativeRuntime() || !!plugin;
    if(!nativeOk){
      showPermissionNotice(kind, true);
      return;
    }
    try{
      let result = null;
      if(kind === 'notification'){
        if(window.ccNative && window.ccNative.openNotificationSettings) result = await window.ccNative.openNotificationSettings();
        else if(plugin && plugin.openNotificationSettings) result = await plugin.openNotificationSettings();
        else throw new Error('notification settings bridge unavailable');
      }else if(kind === 'location'){
        if(window.ccNative && window.ccNative.openLocationSettings) result = await window.ccNative.openLocationSettings();
        else if(plugin && plugin.openLocationSettings) result = await plugin.openLocationSettings();
        else throw new Error('location settings bridge unavailable');
      }else if(kind === 'battery'){
        if(window.ccNative && window.ccNative.requestIgnoreBatteryOptimization) result = await window.ccNative.requestIgnoreBatteryOptimization();
        else if(plugin && plugin.requestIgnoreBatteryOptimization) result = await plugin.requestIgnoreBatteryOptimization();
        else throw new Error('battery settings bridge unavailable');
        if(typeof scheduleBatteryPermissionCheck === 'function') scheduleBatteryPermissionCheck(result);
        else if(!(result && (result.granted || result.ignoringBatteryOptimizations))) showPermissionNotice('battery', !(result && result.openedSettings));
        return;
      }
      if(!result || result.openedSettings === false) showPermissionNotice(kind, true);
    }catch(e){
      console.warn('[PermissionSettings] robust open failed:', kind, e);
      if(typeof oldOpenNativePermissionSetting === 'function' && kind === 'battery'){
        try{ return await oldOpenNativePermissionSetting(kind); }catch(_){}
      }
      showPermissionNotice(kind, true);
    }
  };

  const oldGpsRequestPermission = window.gpsRequestPermission;
  window.gpsRequestPermission = async function(){
    const permGuide = document.getElementById('gpsPermGuide');
    const manualBox = document.getElementById('gpsManualBox');
    const ok = await ensureLocationPermissionForGps();
    if(!ok){
      if(permGuide) permGuide.style.display = 'block';
      if(manualBox) manualBox.style.display = 'block';
      showPermissionNotice('location', false);
      return;
    }
    if(typeof gpsGetCurrentPos === 'function') return gpsGetCurrentPos();
    if(typeof oldGpsRequestPermission === 'function') return oldGpsRequestPermission.apply(this, arguments);
  };

  const oldTogGPS = window.togGPS;
  window.togGPS = async function(btn){
    const willEnable = btn && !btn.classList.contains('on');
    if(willEnable){
      const ok = await ensureLocationPermissionForGps();
      if(!ok){
        if(btn) btn.classList.remove('on');
        if(window._gpsData) _gpsData.enabled = false;
        if(window.notifCfg) notifCfg.n3 = false;
        try{ if(typeof saveNotif === 'function') saveNotif(); if(typeof saveGpsData === 'function') saveGpsData(); }catch(e){}
        const card = document.getElementById('gpsSetupCard');
        if(card) card.style.display = 'block';
        showPermissionNotice('location', false);
        return;
      }
    }
    if(typeof oldTogGPS === 'function') return oldTogGPS.apply(this, arguments);
  };

  setTimeout(window.pullNativeAttendanceNow, 1200);
  setInterval(window.pullNativeAttendanceNow, 10000);
  window.addEventListener('focus', function(){ setTimeout(window.pullNativeAttendanceNow, 300); });
  document.addEventListener('visibilitychange', function(){
    if(!document.hidden) setTimeout(window.pullNativeAttendanceNow, 300);
  });
})();

/* PATCH v2.2.7 - net worked hours after break for sub salary and exports */
(function(){
  if(window.__netWorkedHoursEverywherePatchInstalled) return;
  window.__netWorkedHoursEverywherePatchInstalled = true;

  function breakHours(){
    var mins = (window.userData && userData.hasBreak && userData.breakMinutes) ? Number(userData.breakMinutes) : 0;
    return isFinite(mins) && mins > 0 ? mins / 60 : 0;
  }

  function parseHM(value){
    var m = String(value || '').trim().match(/^(\d{1,2}):(\d{2})/);
    if(!m) return null;
    var h = Number(m[1]), min = Number(m[2]);
    if(!isFinite(h) || !isFinite(min) || h < 0 || h > 47 || min < 0 || min > 59) return null;
    return h * 60 + min;
  }

  function rawHoursBetween(ins, outs){
    var a = parseHM(ins), b = parseHM(outs);
    if(a == null || b == null) return null;
    return ((b - a + 1440) % 1440) / 60;
  }

  function netHoursBetween(ins, outs){
    var h = rawHoursBetween(ins, outs);
    if(h == null || !isFinite(h)) return null;
    return Math.max(0, h - breakHours());
  }

  function netHoursFromRec(rec){
    if(!rec || !rec.in || !rec.out) return null;
    return netHoursBetween(rec.in, rec.out);
  }

  function oneDecimal(value){
    return Math.round((Number(value) || 0) * 10) / 10;
  }

  function fmtHoursNumber(value){
    if(value == null || !isFinite(value)) return '';
    return oneDecimal(value).toFixed(1);
  }

  function fmtHoursText(value){
    var n = fmtHoursNumber(value);
    return n ? n + 'h' : '';
  }

  window.ccBreakHours = breakHours;
  window.ccRawHoursBetween = rawHoursBetween;
  window.ccNetHoursBetween = netHoursBetween;
  window.ccNetWorkedHours = netHoursFromRec;

  function calcSubJobSalaryNet(){
    var sj = window.userData && userData.subJob;
    if(!sj || !sj.active) return {gross:0, net:0, days:0, hours:0};
    var now = new Date();
    var y = now.getFullYear(), m = now.getMonth();
    var nd = new Date(y, m + 1, 0).getDate();
    var ngc = userData.ngc || 26;
    var subDays = 0, subHours = 0;

    for(var d = 1; d <= nd; d++){
      var rec = window.attData && attData[y + '-' + m + '-' + d];
      var h = rec && rec.sub ? netHoursFromRec(rec.sub) : null;
      if(h == null) continue;
      subDays++;
      subHours += h;
    }

    var mode = sj.salaryMode || 'hour';
    var gross = 0;
    if(mode === 'hour') gross = (Number(sj.salaryHour) || 0) * subHours;
    else if(mode === 'day') gross = (Number(sj.salaryDay) || 0) * subDays;
    else gross = subDays > 0 ? ((Number(sj.salary) || 0) * subDays / ngc) : 0;

    return {gross:Math.round(gross), net:Math.round(gross), days:subDays, hours:oneDecimal(subHours)};
  }

  window.calcSubJobSalary = calcSubJobSalaryNet;
  try{ calcSubJobSalary = calcSubJobSalaryNet; }catch(e){}

  function currentLang(){
    try{ return (window.userData && userData.lang) || 'vi'; }catch(e){ return 'vi'; }
  }

  function labels(){
    var packs = {
      vi:{date:'Ng\u00e0y',day:'Th\u1ee9',job:'C\u00f4ng vi\u1ec7c',status:'Tr\u1ea1ng th\u00e1i',inn:'V\u00e0o',out:'Ra',hours:'Gi\u1edd',type:'Lo\u1ea1i',note:'Ghi ch\u00fa',gps:'GPS',report:'Ch\u1ea5m C\u00f4ng Pro - B\u00e1o c\u00e1o ch\u1ea5m c\u00f4ng',rows:'d\u00f2ng d\u1eef li\u1ec7u',print:'In / L\u01b0u PDF',manual:'Th\u1ee7 c\u00f4ng',auto:'Tự động',popupBlocked:'Không thể mở cửa sổ PDF. Hãy cho phép pop-up để xuất PDF.'},
      en:{date:'Date',day:'Day',job:'Job',status:'Status',inn:'In',out:'Out',hours:'Hours',type:'Type',note:'Note',gps:'GPS',report:'Work Tracker Pro - Attendance report',rows:'data rows',print:'Print / Save PDF',manual:'Manual',auto:'Auto',popupBlocked:'Could not open the PDF window. Please allow pop-ups to export PDF.'},
      ko:{date:'날짜',day:'요일',job:'업무',status:'상태',inn:'출근',out:'퇴근',hours:'시간',type:'유형',note:'메모',gps:'GPS',report:'근태 Pro - 근태 보고서',rows:'개 데이터',print:'인쇄 / PDF 저장',manual:'수동',auto:'자동',popupBlocked:'PDF 창을 열 수 없습니다. PDF 내보내기를 위해 팝업을 허용하세요.'},
      ja:{date:'日付',day:'曜日',job:'ジョブ',status:'状態',inn:'出勤',out:'退勤',hours:'時間',type:'種類',note:'メモ',gps:'GPS',report:'勤怠Pro - 勤怠レポート',rows:'行のデータ',print:'印刷 / PDF保存',manual:'手動',auto:'自動',popupBlocked:'PDFウィンドウを開けません。PDF出力のためポップアップを許可してください。'},
      zh:{date:'日期',day:'星期',job:'工作',status:'状态',inn:'上班',out:'下班',hours:'小时',type:'类型',note:'备注',gps:'GPS',report:'考勤Pro - 考勤报告',rows:'行数据',print:'打印 / 保存 PDF',manual:'手动',auto:'自动',popupBlocked:'无法打开 PDF 窗口。请允许弹窗以导出 PDF。'},
      my:{date:'ရက်စွဲ',day:'နေ့',job:'အလုပ်',status:'အခြေအနေ',inn:'ဝင်',out:'ထွက်',hours:'နာရီ',type:'အမျိုးအစား',note:'မှတ်စု',gps:'GPS',report:'Chấm Công Pro - Attendance report',rows:'ကြောင်း ဒေတာ',print:'Print / PDF သိမ်း',manual:'လက်ဖြင့်',auto:'အလိုအလျောက်',popupBlocked:'PDF window ကို မဖွင့်နိုင်ပါ။ PDF ထုတ်ရန် pop-up ခွင့်ပြုပါ။'},
      th:{date:'วันที่',day:'วัน',job:'งาน',status:'สถานะ',inn:'เข้า',out:'ออก',hours:'ชั่วโมง',type:'ประเภท',note:'หมายเหตุ',gps:'GPS',report:'Work Tracker Pro - รายงานการลงเวลา',rows:'แถวข้อมูล',print:'พิมพ์ / บันทึก PDF',manual:'ด้วยตนเอง',auto:'อัตโนมัติ',popupBlocked:'เปิดหน้าต่าง PDF ไม่ได้ กรุณาอนุญาต pop-up เพื่อส่งออก PDF'},
      id:{date:'Tanggal',day:'Hari',job:'Pekerjaan',status:'Status',inn:'Masuk',out:'Keluar',hours:'Jam',type:'Jenis',note:'Catatan',gps:'GPS',report:'Work Tracker Pro - Laporan absensi',rows:'baris data',print:'Cetak / Simpan PDF',manual:'Manual',auto:'Otomatis',popupBlocked:'Tidak dapat membuka jendela PDF. Izinkan pop-up untuk mengekspor PDF.'},
      ph:{date:'Petsa',day:'Araw',job:'Trabaho',status:'Katayuan',inn:'Pasok',out:'Labas',hours:'Oras',type:'Uri',note:'Tala',gps:'GPS',report:'Work Tracker Pro - Ulat ng attendance',rows:'hanay ng data',print:'I-print / I-save PDF',manual:'Manual',auto:'Awtomatiko',popupBlocked:'Hindi mabuksan ang PDF window. Payagan ang pop-up para makapag-export ng PDF.'},
      ne:{date:'मिति',day:'बार',job:'काम',status:'अवस्था',inn:'प्रवेश',out:'बाहिर',hours:'घण्टा',type:'प्रकार',note:'नोट',gps:'GPS',report:'Chấm Công Pro - हाजिरी रिपोर्ट',rows:'डाटा पङ्क्ति',print:'प्रिन्ट / PDF सुरक्षित',manual:'म्यानुअल',auto:'स्वचालित',popupBlocked:'PDF window खोल्न सकिएन। PDF निर्यात गर्न pop-up अनुमति दिनुहोस्।'},
      hi:{date:'तारीख',day:'दिन',job:'नौकरी',status:'स्थिति',inn:'प्रवेश',out:'प्रस्थान',hours:'घंटे',type:'प्रकार',note:'नोट',gps:'GPS',report:'Chấm Công Pro - उपस्थिति रिपोर्ट',rows:'डेटा पंक्तियां',print:'प्रिंट / PDF सहेजें',manual:'मैनुअल',auto:'स्वचालित',popupBlocked:'PDF window नहीं खुली। PDF export करने के लिए pop-up की अनुमति दें।'}
    };
    return packs[currentLang()] || packs.en;
  }

  function statusLabels(){
    var t = {};
    try{ if(typeof getLang === 'function') t = getLang() || {}; }catch(e){}
    return {
      cm:t.coMat || 'Present',
      vang:t.vang || 'Absent',
      np:t.nghiPhep || 'Leave',
      ll:t.lamLe || t.chipLL || 'Holiday work'
    };
  }

  function dayName(y, m, g){
    try{
      if(typeof DAYS !== 'undefined' && DAYS[new Date(y, m, g).getDay()]) return DAYS[new Date(y, m, g).getDay()];
    }catch(e){}
    return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(y, m, g).getDay()];
  }

  function mainJobLabel(){
    try{ if(typeof u === 'function') return u('job.main'); }catch(e){}
    return 'Main job';
  }

  function subJobLabel(){
    try{ return (window.userData && userData.subJob && userData.subJob.name) || (typeof u === 'function' ? u('job.sub') : 'Sub job'); }catch(e){}
    return 'Sub job';
  }

  function gpsText(rec){
    function point(label, p){
      var lat = p && Number(p.lat), lng = p && Number(p.lng);
      if(!isFinite(lat) || !isFinite(lng)) return '';
      var extra = '';
      if(isFinite(Number(p.acc))) extra += ' +' + Math.round(Number(p.acc)) + 'm';
      if(isFinite(Number(p.dist))) extra += ' / ' + Math.round(Number(p.dist)) + 'm';
      return label + ' ' + lat.toFixed(5) + ',' + lng.toFixed(5) + extra;
    }
    var a = point('IN', rec && rec.gpsIn);
    var b = point('OUT', rec && rec.gpsOut);
    return a && b ? a + ' | ' + b : (a || b || '');
  }

  function exportBaseName(){
    var raw = '';
    try{ raw = (document.getElementById('excelFilename') && document.getElementById('excelFilename').value) || ''; }catch(e){}
    raw = String(raw || 'ChamCong').trim().replace(/[\\/:*?"<>|]+/g, '_');
    return raw || 'ChamCong';
  }

  function buildExportRows(){
    var y = calView.y, m = calView.m;
    var nd = new Date(y, m + 1, 0).getDate();
    var filter = (typeof _exportFilter !== 'undefined' && _exportFilter) || window._exportFilter || 'all';
    var st = statusLabels();
    var rows = [];

    function add(g, rec, label){
      var h = netHoursFromRec(rec);
      rows.push({
        date:g + '/' + (m + 1) + '/' + y,
        day:dayName(y, m, g),
        job:label,
        status:st[(rec && rec.type) || 'cm'] || '',
        inTime:(rec && rec.in) || '',
        outTime:(rec && rec.out) || '',
        hoursNumber:fmtHoursNumber(h),
        hoursText:fmtHoursText(h),
        type:(rec && rec.auto) ? labels().auto : labels().manual,
        note:(rec && rec.note) || '',
        gps:gpsText(rec)
      });
    }

    for(var g = 1; g <= nd; g++){
      var rec = window.attData && attData[y + '-' + m + '-' + g];
      if(!rec) continue;
      if(filter !== 'sub') add(g, rec, mainJobLabel());
      if(rec.sub && filter !== 'main') add(g, rec.sub, subJobLabel());
    }
    return rows;
  }

  function csvCell(value){
    var s = String(value == null ? '' : value);
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function exportCsv(rows){
    var L = labels();
    var header = [L.date, L.day, L.job, L.status, L.inn, L.out, L.hours, L.type, L.note, L.gps];
    var csv = header.map(csvCell).join(',') + '\n' + rows.map(function(r){
      return [r.date, r.day, r.job, r.status, r.inTime, r.outTime, r.hoursNumber, r.type, r.note, r.gps].map(csvCell).join(',');
    }).join('\n');
    var blob = new Blob(['\uFEFF' + csv], {type:'text/csv;charset=utf-8'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = exportBaseName() + '.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){
      if(a.parentNode) a.parentNode.removeChild(a);
      URL.revokeObjectURL(url);
    }, 300);
    if(typeof closePanel === 'function') closePanel('panelExcel');
  }

  function escHtml(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function exportPdf(rows){
    var L = labels();
    var monthTitle = '';
    try{ monthTitle = (typeof MONTHS !== 'undefined' && MONTHS[calView.m]) ? MONTHS[calView.m] : ('T' + (calView.m + 1)); }catch(e){ monthTitle = 'T' + (calView.m + 1); }
    var th = [L.date, L.day, L.job, L.status, L.inn, L.out, L.hours, L.type, L.note, L.gps];
    var html = '<!doctype html><html><head><meta charset="utf-8"><title>' + escHtml(exportBaseName()) + '</title>' +
      '<style>body{font-family:Arial,sans-serif;padding:24px;color:#1A2332}h1{font-size:20px;margin:0 0 6px}p{color:#667;margin:0 0 16px}table{width:100%;border-collapse:collapse;font-size:11px}th{background:#0D9E75;color:white}th,td{border:1px solid #ddd;padding:6px;text-align:left;vertical-align:top}.sub{color:#7B5EA7;font-weight:bold}@media print{button{display:none}}</style>' +
      '</head><body><button onclick="window.print()" style="padding:10px 16px;border-radius:10px;border:0;background:#0D9E75;color:white;font-weight:bold;margin-bottom:14px">' + escHtml(L.print) + '</button>' +
      '<h1>' + escHtml(L.report) + '</h1><p>' + escHtml(monthTitle) + ' ' + escHtml(calView.y) + ' - ' + rows.length + ' ' + escHtml(L.rows) + '</p>' +
      '<table><thead><tr>' + th.map(function(x){ return '<th>' + escHtml(x) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function(r){
        return '<tr><td>' + escHtml(r.date) + '</td><td>' + escHtml(r.day) + '</td><td class="' + (r.job === mainJobLabel() ? '' : 'sub') + '">' + escHtml(r.job) + '</td><td>' + escHtml(r.status) + '</td><td>' + escHtml(r.inTime) + '</td><td>' + escHtml(r.outTime) + '</td><td>' + escHtml(r.hoursText) + '</td><td>' + escHtml(r.type) + '</td><td>' + escHtml(r.note) + '</td><td>' + escHtml(r.gps) + '</td></tr>';
      }).join('') +
      '</tbody></table><script>setTimeout(function(){window.print()},500)<\/script></body></html>';
    var w = window.open('', '_blank');
    if(w){
      w.document.open();
      w.document.write(html);
      w.document.close();
    }else if(typeof showGpsBanner === 'function'){
      showGpsBanner(L.popupBlocked, '#E8433A');
    }
  }

  function doExportNet(){
    var rows = buildExportRows();
    if((window._exportFormat || (typeof _exportFormat !== 'undefined' ? _exportFormat : 'csv')) === 'pdf') return exportPdf(rows);
    return exportCsv(rows);
  }

  window.doExport = doExportNet;
  try{ doExport = doExportNet; }catch(e){}
  window.downloadPdf = function(){
    window._exportFormat = 'pdf';
    try{ _exportFormat = 'pdf'; }catch(e){}
    return doExportNet();
  };
  try{ downloadPdf = window.downloadPdf; }catch(e){}

  setTimeout(function(){
    try{ if(typeof renderSubJobSalary === 'function') renderSubJobSalary(); }catch(e){}
    try{ if(typeof renderHomeStats === 'function') renderHomeStats(); }catch(e){}
    try{ if(typeof renderHoursTable === 'function') renderHoursTable(); }catch(e){}
  }, 0);
})();
