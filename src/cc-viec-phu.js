/* ═══════════════════════════════════════════════════════════════════════
   SUB JOB — JOB PHỤ (thêm mới, backward compatible)
   ═══════════════════════════════════════════════════════════════════════

   DATA MODEL:
     userData.subJob = { active, name, salaryMode, salary, salaryDay, salaryHour }
     attData[k].jobType = 'main' | 'sub' | null   (null = main mặc định)

   📌 ĐỂ CHỈNH SỬA:
     - Màu job phụ trên lịch: CSS class 'sub' trong style.css
     - Logic tính lương phụ: calcSubJobSalary() bên dưới
     - Xuất CSV: doExport() bên dưới
   ═══════════════════════════════════════════════════════════════════════ */

var _exportFilter = 'all'; // 'all' | 'main' | 'sub'
var _dayJobType   = null;  // 'main' | 'sub' | null — jobType cho ngày đang edit

// ── SETUP PANEL: Toggle sub job ─────────────────────────────────────────

/** Bật/tắt job phụ */
function toggleSubJob(){
  const tog   = document.getElementById('togSubJob');
  const knob  = document.getElementById('togSubKnob');
  const fields = document.getElementById('subJobFields');
  if(!tog || !fields) return;
  if(!userData.subJob) userData.subJob = {active:false,name:'',salaryMode:'hour',salary:0,salaryDay:0,salaryHour:0};
  const isOn = !userData.subJob.active;
  userData.subJob.active = isOn;
  // Update toggle visual
  tog.style.background  = isOn ? '#7B5EA7' : '#ccc';
  if(knob) knob.style.left = isOn ? '23px' : '3px';
  fields.style.display = isOn ? 'block' : 'none';
  saveUser();
}

/** Chọn chế độ tính lương job phụ: 'hour' | 'day' | 'month' */
function selSubMode(mode){
  if(!userData.subJob) userData.subJob = {active:false,name:'',salaryMode:'hour',salary:0,salaryDay:0,salaryHour:0};
  userData.subJob.salaryMode = mode;
  ['hour','day','month'].forEach(m => {
    const btn = document.getElementById(`subMode${m.charAt(0).toUpperCase()+m.slice(1)}`);
    if(!btn) return;
    const active = m === mode;
    btn.style.background  = active ? '#7B5EA7' : 'white';
    btn.style.color       = active ? 'white'   : '#7B5EA7';
    btn.style.borderColor = active ? '#7B5EA7' : '#c8b4f0';
  });
  const hint = document.getElementById('setupSubSalaryHint');
  const L = userData.lang || 'vi';
  const hints = {
    hour: {vi:'Nhập lương theo giờ — tự tính theo số giờ làm thực tế', en:'Enter hourly rate — auto calculated from actual hours', ko:'시간급 입력 — 실제 근무시간 기준 자동 계산', ja:'時給を入力 — 実働時間で自動計算', zh:'输入时薪 — 按实际工时自动计算', my:'နာရီလစာ — အမှန်တကယ်နာရီအလိုက် တွက်ချက်', th:'ใส่ค่าจ้างต่อชั่วโมง — คำนวณตามชั่วโมงจริง', id:'Masukkan tarif per jam — dihitung dari jam aktual', ph:'Ilagay ang hourly rate — awtomatikong kokompyutin', ne:'घण्टाको दर राख्नुहोस् — वास्तविक घण्टाबाट गणना', hi:'प्रति घंटा दर डालें — वास्तविक घंटों से गणना'},
    day:  {vi:'Nhập lương theo ngày công thực tế', en:'Enter daily rate', ko:'실제 근무일 기준 일급 입력', ja:'実勤務日数に基づく日給を入力', zh:'输入实际工作日的日薪', my:'အမှန်တကယ်အလုပ်ရက်အလိုက် နေ့စားလစာ ထည့်ပါ', th:'ใส่ค่าจ้างรายวันตามวันทำงานจริง', id:'Masukkan upah harian berdasarkan hari kerja aktual', ph:'Ilagay ang daily rate batay sa araw na nagtrabaho', ne:'वास्तविक काम दिन अनुसार दैनिक दर राख्नुहोस्', hi:'वास्तविक कार्य दिवस के अनुसार दैनिक दर डालें'},
    month:{vi:'Nhập lương tháng cố định cho job này', en:'Enter fixed monthly salary for this job', ko:'이 작업의 고정 월급 입력', ja:'この仕事の固定月給を入力', zh:'输入此工作的固定月薪', my:'ဤအလုပ်အတွက် လစဉ်လစာ ထည့်ပါ', th:'ใส่เงินเดือนคงที่ของงานนี้', id:'Masukkan gaji bulanan tetap untuk pekerjaan ini', ph:'Ilagay ang fixed monthly salary ng trabahong ito', ne:'यो कामको स्थिर मासिक तलब राख्नुहोस्', hi:'इस नौकरी का निश्चित मासिक वेतन डालें'},
  };
  if(hint) hint.textContent = (hints[mode]||hints.hour)[L] || hints[mode].en;
  saveUser();
}

/** Render Setup sub job fields từ userData.subJob */
function renderSetupSubJob(){
  const sj = userData.subJob || {};
  const tog  = document.getElementById('togSubJob');
  const knob = document.getElementById('togSubKnob');
  const fields = document.getElementById('subJobFields');
  if(!tog || !fields) return;
  const isOn = !!sj.active;
  // Sync toggle visual
  tog.style.background = isOn ? '#7B5EA7' : '#ccc';
  if(knob) knob.style.left = isOn ? '23px' : '3px';
  fields.style.display = isOn ? 'block' : 'none';
  // Fill fields
  const nameEl = document.getElementById('setupSubJob');
  if(nameEl) nameEl.value = sj.name || '';
  const salEl = document.getElementById('setupSubSalary');
  if(salEl){
    const mode = sj.salaryMode || 'hour';
    salEl.value = mode==='hour' ? (sj.salaryHour||'') : mode==='day' ? (sj.salaryDay||'') : (sj.salary||'');
  }
  selSubMode(sj.salaryMode || 'hour');
}

// ── SAVE SETUP: lưu sub job fields ──────────────────────────────────────

/** Gọi sau saveSetup() để lưu thêm sub job data */
function saveSubJob(){
  if(!userData.subJob) userData.subJob = {active:false,name:'',salaryMode:'hour',salary:0,salaryDay:0,salaryHour:0};
  const nameEl = document.getElementById('setupSubJob');
  const salEl  = document.getElementById('setupSubSalary');
  if(nameEl) userData.subJob.name = nameEl.value.trim();
  if(salEl){
    const val = parseFloat(salEl.value) || 0;
    const mode = userData.subJob.salaryMode || 'hour';
    if(mode === 'hour')       userData.subJob.salaryHour = val;
    else if(mode === 'day')   userData.subJob.salaryDay  = val;
    else                      userData.subJob.salary      = val;
  }
  saveUser();
}

// ── DAY DETAIL PANEL: jobType selector ──────────────────────────────────

/** Chọn jobType trong Day detail panel */
function selDayJobType(type){
  _dayJobType = type;
  const btnMain = document.getElementById('dayJobMain');
  const btnSub  = document.getElementById('dayJobSub');
  if(!btnMain || !btnSub) return;
  const isMain = type === 'main';
  // Main = màu xanh theme
  btnMain.style.background   = isMain ? 'var(--ac)' : 'white';
  btnMain.style.color        = isMain ? 'white' : 'var(--text2)';
  btnMain.style.borderColor  = isMain ? 'var(--ac)' : 'var(--border)';
  // Sub = màu tím
  btnSub.style.background    = !isMain ? '#7B5EA7' : 'white';
  btnSub.style.color         = !isMain ? 'white' : '#7B5EA7';
  btnSub.style.borderColor   = !isMain ? '#7B5EA7' : '#c8b4f0';
}

/** Hiển thị/ẩn jobType selector khi mở Day panel */
function updateDayJobTypeUI(rec){
  const row = document.getElementById('dayJobTypeRow');
  if(!row) return;
  const hasSub = userData.subJob && userData.subJob.active;
  row.style.display = hasSub ? 'block' : 'none';
  if(!hasSub) return;

  // Update sub job name label
  const nameLbl = document.getElementById('daySubJobName');
  if(nameLbl) nameLbl.textContent = '💼 ' + (userData.subJob.name || u('job.sub'));

  // Check if this day has sub data
  const hasDaySub = rec && rec.sub && rec.sub.in;
  const tog  = document.getElementById('togDaySub');
  const knob = document.getElementById('togDaySubKnob');
  const fields = document.getElementById('daySubFields');

  if(hasDaySub){
    // Sub data exists → show toggle ON + fill times
    if(tog) tog.style.background = '#7B5EA7';
    if(knob) knob.style.left = '21px';
    if(fields) fields.style.display = 'block';
    const inEl  = document.getElementById('daySubTimeIn');
    const outEl = document.getElementById('daySubTimeOut');
    if(inEl)  inEl.value  = rec.sub.in  || '';
    if(outEl) outEl.value = rec.sub.out || '';
  } else {
    // No sub data → toggle OFF
    if(tog) tog.style.background = '#ccc';
    if(knob) knob.style.left = '3px';
    if(fields) fields.style.display = 'none';
    const inEl  = document.getElementById('daySubTimeIn');
    const outEl = document.getElementById('daySubTimeOut');
    if(inEl)  inEl.value  = '';
    if(outEl) outEl.value = '';
  }
}

/** Toggle sub job fields trong day panel */
function toggleDaySub(){
  const tog    = document.getElementById('togDaySub');
  const knob   = document.getElementById('togDaySubKnob');
  const fields = document.getElementById('daySubFields');
  if(!tog || !fields) return;
  const isShowing = fields.style.display !== 'none';
  const nowOn = !isShowing;
  tog.style.background = nowOn ? '#7B5EA7' : '#ccc';
  if(knob) knob.style.left = nowOn ? '21px' : '3px';
  fields.style.display = nowOn ? 'block' : 'none';
}


// ── CALENDAR: hiển thị jobType trên lịch ────────────────────────────────

/** Trả về sub-label cho ô lịch nếu là job phụ */
function getJobTypeBadge(rec){
  if(!rec || !rec.jobType || rec.jobType === 'main') return '';
  if(!(userData.subJob && userData.subJob.active)) return '';
  const name = userData.subJob.name || u('job.sub');
  return `<div style="font-size:8px;background:#7B5EA7;color:white;border-radius:3px;padding:1px 3px;margin-top:1px;line-height:1.2;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${name}</div>`;
}

// ── SALARY: tính lương job phụ ────────────────────────────────────────────

/** Tính lương job phụ — đọc từ attData[k].sub */
function calcSubJobSalary(){
  const sj = userData.subJob;
  if(!sj || !sj.active) return { gross:0, net:0, days:0, hours:0 };
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();
  const nd = new Date(y, m+1, 0).getDate();
  const ngc = userData.ngc || 26;
  const gioCA = userData.hoursPerShift || 8;

  let subDays = 0, subHours = 0;
  for(let d = 1; d <= nd; d++){
    const rec = attData[`${y}-${m}-${d}`];
    if(!rec || !rec.sub || !rec.sub.in) continue;
    subDays++;
    if(rec.sub.in && rec.sub.out){
      subHours += ((timeToMin(rec.sub.out) - timeToMin(rec.sub.in) + 1440) % 1440) / 60;
    } else {
      subHours += gioCA;
    }
  }

  const mode = sj.salaryMode || 'hour';
  let gross = 0;
  if(mode === 'hour')       gross = (sj.salaryHour || 0) * subHours;
  else if(mode === 'day')   gross = (sj.salaryDay  || 0) * subDays;
  else                      gross = subDays > 0 ? ((sj.salary || 0) * subDays / ngc) : 0;

  return { gross: Math.round(gross), net: Math.round(gross), days: subDays, hours: Math.round(subHours*10)/10 };
}

/** Render sub job salary section vào cuối salary panel */
function renderSubJobSalary(){
  const sj = userData.subJob;
  const el = document.getElementById('subJobSalaryBlock');
  if(!el) return;
  if(!sj || !sj.active){ el.style.display='none'; return; }
  el.style.display = 'block';
  const result = calcSubJobSalary();
  const fmtN = n => fmtMoney(n, langCfg.payrollCountry||'VN');
  el.innerHTML = `
    <div style="font-size:12px;font-weight:800;color:#7B5EA7;margin-bottom:8px">
      💼 ${sj.name} <span style="font-weight:400;color:#999;font-size:11px">(${u('job.sub')})</span>
    </div>
    <div style="font-size:13px;color:var(--text);line-height:2">
      ${u('salary.present')}: <strong>${result.days}</strong> ${u('salary.days')} · ${result.hours}h<br>
      Gross: <strong style="color:#7B5EA7">${fmtN(result.gross)}</strong>
    </div>
    <div style="margin-top:10px;padding:12px 14px;background:linear-gradient(135deg,#7B5EA7,#5a3e8e);border-radius:12px;color:white">
      <div style="font-size:12px;font-weight:800;margin-bottom:8px">${u('setup.sub_total')}</div>
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
        <span>${u('job.main')}</span><span id="_subMain">—</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:8px">
        <span>${sj.name}</span><span>${fmtN(result.net)}</span>
      </div>
      <div style="border-top:1px solid rgba(255,255,255,.3);padding-top:8px;display:flex;justify-content:space-between;font-size:16px;font-weight:900">
        <span>Tổng</span><span id="_subTotal">—</span>
      </div>
    </div>`;
  const mainNetEl = document.getElementById('salaryNet');
  const mainNum = parseFloat((mainNetEl?.textContent||'').replace(/[^\d.-]/g,''))||0;
  const mainFmt = mainNetEl?.textContent||'0';
  const m1 = el.querySelector('#_subMain');
  const m2 = el.querySelector('#_subTotal');
  if(m1) m1.textContent = mainFmt;
  if(m2) m2.textContent = fmtN(mainNum + result.net);
}
function selExportFilter(filter){
  _exportFilter = filter;
  ['all','main','sub'].forEach(f => {
    const btn = document.getElementById(`ef${f.charAt(0).toUpperCase()+f.slice(1)}`);
    if(!btn) return;
    const active = f === filter;
    btn.style.background  = active ? 'var(--ac)' : 'var(--card)';
    btn.style.color       = active ? 'white' : 'var(--text2)';
    btn.style.borderColor = active ? 'var(--ac)' : 'var(--border)';
  });
}

/** Hiển thị/ẩn export filter row + set default filename */
function updateExcelPanel(){
  const filterRow = document.getElementById('excelFilterRow');
  const filenameEl = document.getElementById('excelFilename');
  const hasSub = userData.subJob && userData.subJob.active;
  if(filterRow) filterRow.style.display = hasSub ? 'block' : 'none';
  if(!hasSub) _exportFilter = 'all';
  // Set default filename
  if(filenameEl && (!filenameEl.value || /^ChamCong_/i.test(filenameEl.value))){
    filenameEl.value = 'ChamCong';
  }
}

// ── Patch doExport to support filter + jobType column + custom filename ────

var _doExport_original = doExport;
doExport = function(){
  const {y,m} = calView;
  const nd = new Date(y, m+1, 0).getDate();
  const _t3 = getLang();
  const L = userData.lang || 'vi';
  const hasSub = userData.subJob && userData.subJob.active;

  const STATUS = {cm:_t3.coMat||'Có mặt',vang:_t3.vang||'Vắng',np:_t3.nghiPhep||'Nghỉ phép',ll:legacyHolidayLabel(_t3)};

  // CSV header — thêm cột Job nếu có sub job
  const jobColHdr = hasSub ? (','+u('job.main')+'/'+u('job.sub')) : '';
  const _csvHdr = {
    vi:'Ngày,Thứ,Trạng thái,Giờ vào,Giờ ra,Số giờ,Vị trí GPS',
    en:'Date,Day,Status,In,Out,Hours,GPS Location',
    ko:'날짜,요일,상태,출근,퇴근,시간,GPS 위치',
    ja:'日付,曜日,状態,出勤,退勤,時間,GPS位置',
    zh:'日期,星期,状态,上班,下班,时长,GPS位置',
    my:'ရက်,နေ့,အခြေ,တက်,ဆင်,ချိန်,GPS တည်နေရာ',
    th:'วันที่,วัน,สถานะ,เข้า,ออก,ชั่วโมง,GPS',
    id:'Tanggal,Hari,Status,Masuk,Keluar,Jam,GPS',
    ph:'Petsa,Araw,Katayuan,Pasok,Labas,Oras,GPS',
    ne:'मिति,बार,अवस्था,प्रवेश,निस्किने,घण्टा,GPS',
    hi:'तारीख,दिन,स्थिति,प्रवेश,प्रस्थान,घंटे,GPS'
  }[L] || 'Ngày,Thứ,Trạng thái,Giờ vào,Giờ ra,Số giờ,Vị trí GPS';

  let csv = _csvHdr + jobColHdr + '\n';

  const gpsCoord = (_gpsData && _gpsData.lat && _gpsData.lng)
    ? `${_gpsData.lat.toFixed(6)}, ${_gpsData.lng.toFixed(6)}` : '';

  for(let g = 1; g <= nd; g++){
    const k = `${y}-${m}-${g}`;
    const rec = attData[k];

    // Filter theo jobType
    if(_exportFilter !== 'all'){
      const recType = rec ? (rec.jobType || 'main') : null;
      if(!rec || recType !== _exportFilter) continue; // bỏ qua ngày không khớp
    }

    const thu  = DAYS[new Date(y, m, g).getDay()];
    const lbl  = rec ? STATUS[rec.type] || '' : '';
    const ins  = rec?.in  || '';
    const outs = rec?.out || '';
    let dur = '';
    if(ins && outs) dur = (((timeToMin(outs) - timeToMin(ins) + 1440) % 1440) / 60).toFixed(1);
    const loc = (ins || outs) ? `"${gpsCoord}"` : '';

    // Cột job type
    const jobCell = hasSub ? (','+((rec?.jobType === 'sub') ? (userData.subJob.name||u('job.sub')) : u('job.main'))) : '';

    csv += `${g}/${m+1}/${y},${thu},${lbl},${ins},${outs},${dur},${loc}${jobCell}\n`;
  }

  const blob = new Blob(['\uFEFF' + csv], {type:'text/csv;charset=utf-8'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;

  // Custom filename
  const filenameEl = document.getElementById('excelFilename');
  const rawName = filenameEl?.value.trim() || 'ChamCong';
  // Sanitize filename
  a.download = rawName.replace(/[\\/:*?"<>|]/g,'_') + '.csv';

  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 300);
  closePanel('panelExcel');
};



/* PATCH v2.2.1 — JOB PHỤ GPS + EXPORT PDF */
(function(){
  function escHtml(v){return String(v==null?'':v).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function ensureGpsV221(){
    if(typeof _gpsData==='undefined') return;
    if(typeof gpsRepairLocationPersistence==='function'){gpsRepairLocationPersistence(); return;}
    // Lưu radius hiện tại (đã được user set trước đó) — KHÔNG để bị reset bởi loc.radius
    var savedRadius = (_gpsData.radius && _gpsData.radius > 0) ? _gpsData.radius : 15;
    if(!_gpsData.locations){_gpsData.locations={main:{lat:_gpsData.lat||null,lng:_gpsData.lng||null,radius:savedRadius},sub:{lat:null,lng:null,radius:savedRadius}};}
    if(!_gpsData.locations.main) _gpsData.locations.main={lat:_gpsData.lat||null,lng:_gpsData.lng||null,radius:savedRadius};
    if(!_gpsData.locations.sub) _gpsData.locations.sub={lat:null,lng:null,radius:savedRadius};
    if(!_gpsData.activeJob) _gpsData.activeJob='main';
    var loc=_gpsData.locations[_gpsData.activeJob]||_gpsData.locations.main;
    _gpsData.lat=loc.lat||null; _gpsData.lng=loc.lng||null;
    // QUAN TRỌNG: Chỉ dùng loc.radius nếu nó đã được set; ngược lại giữ savedRadius
    _gpsData.radius = (loc.radius && loc.radius > 0) ? loc.radius : savedRadius;
  }
  window.ensureGpsV221=ensureGpsV221;
  function activeGpsLoc(){ensureGpsV221();if(typeof gpsGetStoredCompanyLocation==='function')return gpsGetStoredCompanyLocation(_gpsData.activeJob||'main')||_gpsData.locations.main;return _gpsData.locations[_gpsData.activeJob||'main']||_gpsData.locations.main;}
  function gps221Pack(){
    var L=(window.userData&&userData.lang)||'vi';
    var packs={
      vi:{target:'🎯 GPS ÁP DỤNG CHO JOB',main:'Job chính',sub:'Job phụ',saved:'Đã lưu',notSaved:'Chưa lưu',hint:'Chọn job rồi bấm “Lấy vị trí hiện tại” để lưu GPS riêng cho job đó.',locating:'⏳ Đang lấy vị trí cho {job}...',savedFor:'✅ Đã lưu GPS cho {job}',denied:'GPS bị từ chối. Hãy bật quyền vị trí.',unavailable:'Không xác định được vị trí. Thử ở nơi thoáng hơn.',timeout:'Hết thời gian. Thử lại.',error:'Lỗi GPS: ',subGps:'Job phụ GPS',autoIn:'✅ GPS đã chấm vào Job phụ lúc {time}',autoOut:'✅ GPS đã chấm hết Job phụ lúc {time}',abort:'GPS chưa xác nhận rời vùng đủ chắc chắn - bỏ qua ra ca Job phụ',fileFormat:'ĐỊNH DẠNG FILE',csv:'📊 Xuất file Excel (.csv)',pdf:'📄 Xuất file PDF'},
      en:{target:'🎯 GPS TARGET JOB',main:'Main job',sub:'Sub job',saved:'Saved',notSaved:'Not saved',hint:'Select a job, then press “Get current location” to save GPS separately for that job.',locating:'⏳ Getting location for {job}...',savedFor:'✅ GPS saved for {job}',denied:'GPS permission was denied. Please enable location permission.',unavailable:'Could not determine location. Try again in a more open area.',timeout:'Timed out. Please try again.',error:'GPS error: ',subGps:'Sub job GPS',autoIn:'✅ GPS checked in sub job at {time}',autoOut:'✅ GPS checked out sub job at {time}',abort:'GPS has not confirmed leaving the area reliably - skipping sub job checkout',fileFormat:'FILE FORMAT',csv:'📊 Export Excel CSV',pdf:'📄 Export PDF'},
      ko:{target:'🎯 GPS 적용 작업',main:'주업',sub:'부업',saved:'저장됨',notSaved:'미저장',hint:'작업을 선택한 뒤 “현재 위치 가져오기”를 눌러 작업별 GPS를 저장하세요.',locating:'⏳ {job} 위치를 가져오는 중...',savedFor:'✅ {job} GPS 저장됨',denied:'GPS 권한이 거부되었습니다. 위치 권한을 켜세요.',unavailable:'위치를 확인할 수 없습니다. 더 트인 곳에서 다시 시도하세요.',timeout:'시간이 초과되었습니다. 다시 시도하세요.',error:'GPS 오류: ',subGps:'부업 GPS',autoIn:'✅ GPS가 {time}에 부업 출근을 기록했습니다',autoOut:'✅ GPS가 {time}에 부업 퇴근을 기록했습니다',abort:'GPS가 영역 이탈을 충분히 확인하지 못해 부업 퇴근을 건너뜁니다',fileFormat:'파일 형식',csv:'📊 Excel CSV 내보내기',pdf:'📄 PDF 내보내기'},
      ja:{target:'🎯 GPS適用ジョブ',main:'本業',sub:'副業',saved:'保存済み',notSaved:'未保存',hint:'ジョブを選択し「現在地を取得」でジョブ別GPSを保存します。',locating:'⏳ {job} の位置を取得中...',savedFor:'✅ {job} のGPSを保存しました',denied:'GPSが拒否されました。位置情報の権限を有効にしてください。',unavailable:'位置を特定できません。開けた場所で再試行してください。',timeout:'タイムアウトしました。もう一度お試しください。',error:'GPSエラー: ',subGps:'副業GPS',autoIn:'✅ GPSが{time}に副業の出勤を記録しました',autoOut:'✅ GPSが{time}に副業の退勤を記録しました',abort:'GPSがエリア離脱を十分確認できないため、副業の退勤をスキップします',fileFormat:'ファイル形式',csv:'📊 Excel CSV出力',pdf:'📄 PDF出力'},
      zh:{target:'🎯 GPS适用工作',main:'主业',sub:'副业',saved:'已保存',notSaved:'未保存',hint:'选择工作后点击“获取当前位置”分别保存GPS。',locating:'⏳ 正在获取 {job} 的位置...',savedFor:'✅ 已保存 {job} 的GPS',denied:'GPS权限被拒绝。请开启位置权限。',unavailable:'无法确定位置。请在开阔处重试。',timeout:'已超时。请重试。',error:'GPS错误: ',subGps:'副业GPS',autoIn:'✅ GPS已在{time}记录副业上班',autoOut:'✅ GPS已在{time}记录副业下班',abort:'GPS尚未可靠确认离开区域，跳过副业下班打卡',fileFormat:'文件格式',csv:'📊 导出 Excel CSV',pdf:'📄 导出 PDF'},
      my:{target:'🎯 GPS အလုပ်',main:'အဓိကအလုပ်',sub:'ဘေးအလုပ်',saved:'သိမ်းပြီး',notSaved:'မသိမ်းရသေး',hint:'အလုပ်ရွေးပြီး “လက်ရှိနေရာ” ကိုနှိပ်ကာ အလုပ်အလိုက် GPS သိမ်းပါ။',locating:'⏳ {job} အတွက် နေရာရယူနေသည်...',savedFor:'✅ {job} အတွက် GPS သိမ်းပြီး',denied:'GPS ခွင့်ပြုချက် ငြင်းထားသည်။ Location permission ကိုဖွင့်ပါ။',unavailable:'နေရာ မသတ်မှတ်နိုင်ပါ။ ပိုကျယ်သောနေရာတွင် ထပ်စမ်းပါ။',timeout:'အချိန်ကုန်သွားသည်။ ထပ်စမ်းပါ။',error:'GPS အမှား: ',subGps:'ဘေးအလုပ် GPS',autoIn:'✅ GPS သည် {time} တွင် ဘေးအလုပ် တက်ချိန် မှတ်ပြီး',autoOut:'✅ GPS သည် {time} တွင် ဘေးအလုပ် ဆင်းချိန် မှတ်ပြီး',abort:'GPS သည် ဧရိယာမှ ထွက်ခြင်းကို မသေချာသေးသဖြင့် ဘေးအလုပ် ဆင်းချိန်ကို ကျော်ထားသည်',fileFormat:'ဖိုင်ပုံစံ',csv:'📊 Excel CSV ထုတ်',pdf:'📄 PDF ထုတ်'},
      th:{target:'🎯 งานที่ใช้ GPS',main:'งานหลัก',sub:'งานเสริม',saved:'บันทึกแล้ว',notSaved:'ยังไม่บันทึก',hint:'เลือกงาน แล้วกด “รับตำแหน่งปัจจุบัน” เพื่อบันทึก GPS แยกตามงาน',locating:'⏳ กำลังรับตำแหน่งสำหรับ {job}...',savedFor:'✅ บันทึก GPS สำหรับ {job} แล้ว',denied:'GPS ถูกปฏิเสธ โปรดเปิดสิทธิ์ตำแหน่ง',unavailable:'ระบุตำแหน่งไม่ได้ ลองในพื้นที่เปิดกว่าเดิม',timeout:'หมดเวลา โปรดลองอีกครั้ง',error:'ข้อผิดพลาด GPS: ',subGps:'GPS งานเสริม',autoIn:'✅ GPS บันทึกเข้างานเสริมเวลา {time}',autoOut:'✅ GPS บันทึกออกงานเสริมเวลา {time}',abort:'GPS ยังยืนยันการออกจากพื้นที่ไม่ชัดเจน จึงข้ามการออกงานเสริม',fileFormat:'รูปแบบไฟล์',csv:'📊 ส่งออก Excel CSV',pdf:'📄 ส่งออก PDF'},
      id:{target:'🎯 PEKERJAAN TARGET GPS',main:'Pekerjaan utama',sub:'Pekerjaan sampingan',saved:'Tersimpan',notSaved:'Belum disimpan',hint:'Pilih pekerjaan, lalu tekan “Lokasi saat ini” untuk menyimpan GPS terpisah.',locating:'⏳ Mengambil lokasi untuk {job}...',savedFor:'✅ GPS tersimpan untuk {job}',denied:'GPS ditolak. Aktifkan izin lokasi.',unavailable:'Lokasi tidak dapat ditentukan. Coba di area lebih terbuka.',timeout:'Waktu habis. Coba lagi.',error:'Kesalahan GPS: ',subGps:'GPS pekerjaan sampingan',autoIn:'✅ GPS mencatat masuk pekerjaan sampingan pada {time}',autoOut:'✅ GPS mencatat keluar pekerjaan sampingan pada {time}',abort:'GPS belum memastikan keluar area, absen keluar pekerjaan sampingan dilewati',fileFormat:'FORMAT FILE',csv:'📊 Ekspor Excel CSV',pdf:'📄 Ekspor PDF'},
      ph:{target:'🎯 TRABAHONG NA-TARGET NG GPS',main:'Pangunahing trabaho',sub:'Sideline',saved:'Nai-save na',notSaved:'Hindi pa naka-save',hint:'Pumili ng trabaho, pindutin ang “Kunin ang kasalukuyang lokasyon” para i-save ang GPS.',locating:'⏳ Kinukuha ang lokasyon para sa {job}...',savedFor:'✅ Na-save ang GPS para sa {job}',denied:'Tinanggihan ang GPS. I-on ang location permission.',unavailable:'Hindi matukoy ang lokasyon. Subukan sa mas bukas na lugar.',timeout:'Nag-time out. Subukan muli.',error:'GPS error: ',subGps:'GPS ng sideline',autoIn:'✅ Naitala ng GPS ang pasok sa sideline nang {time}',autoOut:'✅ Naitala ng GPS ang labas sa sideline nang {time}',abort:'Hindi pa kumpirmado ng GPS na lumabas sa area - nilaktawan ang out ng sideline',fileFormat:'FORMAT NG FILE',csv:'📊 I-export ang Excel CSV',pdf:'📄 I-export ang PDF'},
      ne:{target:'🎯 GPS लक्षित काम',main:'मुख्य काम',sub:'सहायक काम',saved:'सुरक्षित',notSaved:'सुरक्षित छैन',hint:'काम छान्नुहोस्, “हालको स्थान” थिचेर GPS छुट्टै सुरक्षित गर्नुहोस्।',locating:'⏳ {job} को स्थान लिँदै...',savedFor:'✅ {job} का लागि GPS सुरक्षित भयो',denied:'GPS अस्वीकृत भयो। स्थान अनुमति खोल्नुहोस्।',unavailable:'स्थान पत्ता लागेन। खुला ठाउँमा फेरि प्रयास गर्नुहोस्।',timeout:'समय सकियो। फेरि प्रयास गर्नुहोस्।',error:'GPS त्रुटि: ',subGps:'सहायक काम GPS',autoIn:'✅ GPS ले {time} मा सहायक काम प्रवेश रेकर्ड गर्‍यो',autoOut:'✅ GPS ले {time} मा सहायक काम बाहिर रेकर्ड गर्‍यो',abort:'GPS ले क्षेत्र छोडेको पर्याप्त पुष्टि गरेन - सहायक काम बाहिर छोडियो',fileFormat:'फाइल ढाँचा',csv:'📊 Excel CSV निर्यात',pdf:'📄 PDF निर्यात'},
      hi:{target:'🎯 GPS लक्ष्य कार्य',main:'मुख्य नौकरी',sub:'अतिरिक्त नौकरी',saved:'सहेजा गया',notSaved:'सहेजा नहीं',hint:'कार्य चुनें, फिर “वर्तमान स्थान” दबाकर GPS अलग से सहेजें।',locating:'⏳ {job} के लिए स्थान मिल रहा है...',savedFor:'✅ {job} के लिए GPS सहेजा गया',denied:'GPS अस्वीकार हुआ। स्थान अनुमति चालू करें।',unavailable:'स्थान निर्धारित नहीं हो सका। खुले स्थान में फिर प्रयास करें।',timeout:'समय समाप्त। फिर प्रयास करें।',error:'GPS त्रुटि: ',subGps:'अतिरिक्त नौकरी GPS',autoIn:'✅ GPS ने {time} पर अतिरिक्त नौकरी प्रवेश दर्ज किया',autoOut:'✅ GPS ने {time} पर अतिरिक्त नौकरी प्रस्थान दर्ज किया',abort:'GPS ने क्षेत्र छोड़ना पर्याप्त रूप से पुष्टि नहीं किया - अतिरिक्त नौकरी प्रस्थान छोड़ा गया',fileFormat:'फ़ाइल प्रारूप',csv:'📊 Excel CSV निर्यात',pdf:'📄 PDF निर्यात'}
    };
    return packs[L]||packs.en||packs.vi;
  }
  function gps221Tpl(key, vars){
    var txt=(gps221Pack()[key]||'');
    vars=vars||{};
    Object.keys(vars).forEach(function(k){txt=txt.replace(new RegExp('\\{'+k+'\\}','g'),vars[k]);});
    return txt;
  }
  function gps221JobName(job){
    try{if(typeof u==='function')return u(job==='sub'?'job.sub':'job.main');}catch(e){}
    var p=gps221Pack();
    return job==='sub'?p.sub:p.main;
  }
  window.setActiveGpsJob=function(job){
    ensureGpsV221(); if(job!=='sub') job='main'; _gpsData.activeJob=job;
    var savedRadius = (_gpsData.radius && _gpsData.radius > 0) ? _gpsData.radius : 15;
    var loc=activeGpsLoc(); _gpsData.lat=loc.lat||null; _gpsData.lng=loc.lng||null;
    _gpsData.radius = (loc.radius && loc.radius > 0) ? loc.radius : savedRadius;
    if(typeof saveGpsData==='function') saveGpsData();
    if(typeof syncGpsSliders==='function') syncGpsSliders();
    if(typeof updateGpsStatus==='function') updateGpsStatus();
    renderGpsJobSwitch();
    if(_gpsData.enabled){ if(typeof stopGeofencing==='function') stopGeofencing(); if(_gpsData.lat && typeof startGeofencing==='function') startGeofencing(); }
  };
  function renderGpsJobSwitch(){
    ensureGpsV221(); var card=document.getElementById('gpsSetupCard'); if(!card) return;
    var box=document.getElementById('gpsJobSwitchBox');
    if(!box){box=document.createElement('div');box.id='gpsJobSwitchBox';box.style.cssText='background:#F4F7F6;border-radius:14px;padding:12px;margin-bottom:12px;border:1px solid var(--border)';card.insertBefore(box,card.firstChild);}
    var hasSub=!!(window.userData&&userData.subJob&&userData.subJob.active);
    var p=gps221Pack();
    var subName=(hasSub&&userData.subJob.name)?userData.subJob.name:gps221JobName('sub');
    var mainName=gps221JobName('main');
    var mainOn=(_gpsData.activeJob||'main')==='main', subOn=(_gpsData.activeJob||'main')==='sub';
    var mainLoc=_gpsData.locations.main||{}, subLoc=_gpsData.locations.sub||{};
    box.innerHTML='<div style="font-size:12px;font-weight:900;color:var(--text2);margin-bottom:8px">'+escHtml(p.target)+'</div><div style="display:flex;gap:8px;margin-bottom:8px"><button onclick="setActiveGpsJob(\'main\')" style="flex:1;padding:10px;border-radius:10px;border:1.5px solid '+(mainOn?'var(--ac)':'var(--border)')+';background:'+(mainOn?'var(--ac)':'white')+';color:'+(mainOn?'white':'var(--text2)')+';font-size:12px;font-weight:900;font-family:Nunito,sans-serif">🏢 '+escHtml(mainName)+'</button><button onclick="setActiveGpsJob(\'sub\')" '+(!hasSub?'disabled':'')+' style="flex:1;padding:10px;border-radius:10px;border:1.5px solid '+(subOn?'#7B5EA7':'var(--border)')+';background:'+(subOn?'#7B5EA7':'white')+';color:'+(subOn?'white':'var(--text2)')+';opacity:'+(!hasSub?'.45':'1')+';font-size:12px;font-weight:900;font-family:Nunito,sans-serif">💼 '+escHtml(subName)+'</button></div><div style="font-size:11px;color:var(--text3);line-height:1.45">🏢 '+(mainLoc.lat?escHtml(p.saved):escHtml(p.notSaved))+' · 💼 '+(subLoc.lat?escHtml(p.saved):escHtml(p.notSaved))+'<br>'+escHtml(p.hint)+'</div>';
  }
  window.renderGpsJobSwitch=renderGpsJobSwitch;
  var oldOpenPanelGPS=window.openPanelGPS; window.openPanelGPS=function(){ensureGpsV221(); if(typeof oldOpenPanelGPS==='function') oldOpenPanelGPS(); setTimeout(renderGpsJobSwitch,120);};
  var oldGpsGetCurrentPos=window.gpsGetCurrentPos;
  window.gpsGetCurrentPos=function(){
    ensureGpsV221(); var statusTxt=document.getElementById('gpsStatusTxt'), statusDot=document.getElementById('gpsStatusDot'), permGuide=document.getElementById('gpsPermGuide');
    if(typeof gpsCurrentPosition!=='function'){return oldGpsGetCurrentPos&&oldGpsGetCurrentPos();}
    if(statusTxt) statusTxt.textContent=gps221Tpl('locating',{job:gps221JobName(_gpsData.activeJob==='sub'?'sub':'main')}); if(statusDot) statusDot.style.background='#F5A623';
    gpsCurrentPosition(function(pos){
      var job=_gpsData.activeJob||'main'; if(typeof gpsPersistCompanyLocation==='function')gpsPersistCompanyLocation(pos.coords.latitude,pos.coords.longitude,parseInt(document.getElementById('gpsRadius')?.value)||(_gpsData.radius||15),job);else{_gpsData.locations[job]={lat:pos.coords.latitude,lng:pos.coords.longitude,radius:parseInt(document.getElementById('gpsRadius')?.value)||(_gpsData.radius||15)};var loc=_gpsData.locations[job]; _gpsData.lat=loc.lat; _gpsData.lng=loc.lng; _gpsData.radius=loc.radius;}
      if(typeof saveGpsData==='function') saveGpsData(); if(typeof updateGpsStatus==='function') updateGpsStatus(); renderGpsJobSwitch(); if(typeof startGeofencing==='function') startGeofencing(); if(permGuide) permGuide.style.display='none'; if(typeof showGpsBanner==='function') showGpsBanner(gps221Tpl('savedFor',{job:gps221JobName(job)}),'#0D9E75');
    },function(err){var msgs={1:gps221Tpl('denied'),2:gps221Tpl('unavailable'),3:gps221Tpl('timeout')}; if(statusTxt) statusTxt.textContent=msgs[err.code]||(gps221Tpl('error')+(err.message||'')); if(statusDot) statusDot.style.background='#E8433A'; if(permGuide) permGuide.style.display='block';});
  };
  var oldGpsClear=window.gpsClear; window.gpsClear=function(){ensureGpsV221(); var job=_gpsData.activeJob||'main'; _gpsData.locations[job]={lat:null,lng:null,radius:_gpsData.radius||15}; _gpsData.lat=null; _gpsData.lng=null; var loc=(typeof gpsGetStoredCompanyLocation==='function')?gpsGetStoredCompanyLocation(job):activeGpsLoc(); if(loc&&loc.lat!=null&&loc.lng!=null){_gpsData.lat=loc.lat; _gpsData.lng=loc.lng; _gpsData.radius=loc.radius||15;} if(!_gpsData.locations.main.lat&&!_gpsData.locations.sub.lat){if(typeof oldGpsClear==='function') oldGpsClear();}else{if(typeof saveGpsData==='function') saveGpsData(); if(typeof stopGeofencing==='function') stopGeofencing(); if(_gpsData.enabled&&_gpsData.lat&&typeof startGeofencing==='function') startGeofencing(); if(typeof updateGpsStatus==='function') updateGpsStatus(); renderGpsJobSwitch();}};
  function getPosPromise(){return new Promise(function(resolve){if(typeof gpsCurrentPosition!=='function')return resolve(null);gpsCurrentPosition(function(pos){resolve(pos);},function(){resolve(null);});});}
  function distFromJob(job,pos){ensureGpsV221(); var loc=_gpsData.locations[job]; if(!loc||!loc.lat||!pos||typeof gpsDistance!=='function') return null; return gpsDistance(pos.coords.latitude,pos.coords.longitude,loc.lat,loc.lng);}
  async function markSubGps(type){var k=todayKey(); if(!attData[k])attData[k]={type:'cm'}; if(!attData[k].sub)attData[k].sub={type:'cm'}; var pos=await getPosPromise(); if(!pos)return; var d=distFromJob('sub',pos), loc=_gpsData.locations&&_gpsData.locations.sub; var obj={lat:pos.coords.latitude,lng:pos.coords.longitude,acc:pos.coords.accuracy||null,dist:d,inside:(d==null||!loc)?null:d<=((loc&&loc.radius)||_gpsData.radius||15),at:new Date().toISOString()}; if(type==='in')attData[k].sub.gpsIn=obj; else attData[k].sub.gpsOut=obj; saveAtt(); if(d!=null&&typeof showGpsBanner==='function')showGpsBanner((obj.inside?'✅':'⚠️')+' '+gps221Tpl('subGps')+': '+Math.round(d)+'m',obj.inside?'#0D9E75':'#F5A623');}
  /* [LEGACY_ATTENDANCE_SUBJOB_PATCH]
     Ghi chu: wrapper cu cho cham cong job phu va GPS rieng cua job phu.
     Khong xoa vi van bo sung gpsIn/gpsOut cho attData[k].sub.
  */
  var oldSubIn=window._doCheckinSub; window._doCheckinSub=function(){if(typeof oldSubIn==='function')oldSubIn(); markSubGps('in');};
  var oldSubOut=window._doCheckoutSub; window._doCheckoutSub=function(){if(typeof oldSubOut==='function')oldSubOut(); markSubGps('out');};
  var oldGpsAutoIn=window.gpsAutoCheckin; window.gpsAutoCheckin=function(){ensureGpsV221(); if((_gpsData.activeJob||'main')==='sub'){var t=new Date();t.setMinutes(t.getMinutes()-((typeof _gpsCheckinMinus==='function')?_gpsCheckinMinus():5));var k=t.getFullYear()+'-'+t.getMonth()+'-'+t.getDate();if(!attData[k])attData[k]={type:'cm'};if(!attData[k].sub)attData[k].sub={type:'cm'};if(!attData[k].sub.in){var hm=fmtTime(t);attData[k].sub.type='cm';attData[k].sub.in=hm;attData[k].sub.auto=true;saveAtt();renderHomeStats();var subName=userData.subJob?.name||gps221JobName('sub');var el=document.getElementById('lastIn');if(el)el.textContent='GPS 💼 '+subName+' '+hm;if(typeof updateTodayStatusTime==='function')updateTodayStatusTime();if(typeof showGpsBanner==='function')showGpsBanner(gps221Tpl('autoIn',{time:hm}),'#7B5EA7');}return;} if(typeof oldGpsAutoIn==='function')oldGpsAutoIn();};
  var oldGpsAutoOut=window.gpsAutoCheckout; window.gpsAutoCheckout=function(){ensureGpsV221(); if((_gpsData.activeJob||'main')==='sub'){var t=new Date();t.setMinutes(t.getMinutes()-((typeof _gpsCheckoutMinus==='function')?_gpsCheckoutMinus():75));var k=t.getFullYear()+'-'+t.getMonth()+'-'+t.getDate();if(attData[k]&&attData[k].sub&&attData[k].sub.in&&!attData[k].sub.out){var hm=fmtTime(t);attData[k].sub.out=hm;attData[k].sub.auto=true;saveAtt();renderHomeStats();var subName=userData.subJob?.name||gps221JobName('sub');var el=document.getElementById('lastOut');if(el)el.textContent='GPS 💼 '+subName+' '+hm;if(typeof showGpsBanner==='function')showGpsBanner(gps221Tpl('autoOut',{time:hm}),'#7B5EA7');}return;} if(typeof oldGpsAutoOut==='function')oldGpsAutoOut();};
  var guardedSubGpsAutoOut=window.gpsAutoCheckout;
  window.gpsAutoCheckout=function(){ensureGpsV221(); if((_gpsData.activeJob||'main')==='sub'&&typeof _gpsCanAutoCheckoutNow==='function'&&!_gpsCanAutoCheckoutNow()){if(typeof _addGpsTrail==='function')_addGpsTrail({type:'AUTO_CHECKOUT_ABORTED',job:'sub',reason:'not_freshly_outside'});if(typeof showGpsBanner==='function')showGpsBanner(gps221Tpl('abort'),'#F5A623');return;} if(typeof guardedSubGpsAutoOut==='function')guardedSubGpsAutoOut();};
  var _exportFormat='csv'; window._exportFormat=_exportFormat;
  window.selExportFormat=function(fmt){_exportFormat=(fmt==='pdf')?'pdf':'csv';window._exportFormat=_exportFormat;['Csv','Pdf'].forEach(function(x){var b=document.getElementById('efmt'+x);if(!b)return;var on=(x.toLowerCase()===_exportFormat);b.style.background=on?'var(--ac)':'white';b.style.color=on?'white':'var(--text2)';b.style.borderColor=on?'var(--ac)':'var(--border)';});var ext=document.getElementById('excelFileExt');if(ext)ext.textContent=_exportFormat==='pdf'?'.html':'.csv';var btn=document.getElementById('excelExportBtn');if(btn)btn.textContent=_exportFormat==='pdf'?gps221Tpl('pdf'):gps221Tpl('csv');};
  function ensureExportFormatUi(){var nameBlock=document.getElementById('excelFilenameLbl');if(!nameBlock||document.getElementById('excelFormatRow'))return;var p=gps221Pack();var row=document.createElement('div');row.id='excelFormatRow';row.style.cssText='margin:12px 0';row.innerHTML='<div style="font-size:11px;font-weight:800;color:var(--text3);margin-bottom:8px">'+escHtml(p.fileFormat)+'</div><div style="display:flex;gap:6px"><button id="efmtCsv" onclick="selExportFormat(\'csv\')" style="flex:1;padding:8px;border-radius:8px;border:1.5px solid var(--ac);background:var(--ac);color:white;font-size:12px;font-weight:900;font-family:Nunito,sans-serif">'+escHtml(p.csv)+'</button><button id="efmtPdf" onclick="selExportFormat(\'pdf\')" style="flex:1;padding:8px;border-radius:8px;border:1.5px solid var(--border);background:white;color:var(--text2);font-size:12px;font-weight:900;font-family:Nunito,sans-serif">'+escHtml(p.pdf)+'</button></div>';var parent=nameBlock.parentElement;parent.parentElement.insertBefore(row,parent);var span=parent.querySelector('span');if(span)span.id='excelFileExt';}
  var oldUpdateExcelPanel=window.updateExcelPanel; window.updateExcelPanel=function(){if(typeof oldUpdateExcelPanel==='function')oldUpdateExcelPanel();ensureExportFormatUi();window.selExportFormat(_exportFormat);};
  function legacyExportTypeLabel(auto){var L=(window.userData&&userData.lang)||'vi';var packs={vi:{auto:'Tự động',manual:'Thủ công'},en:{auto:'Auto',manual:'Manual'},ko:{auto:'자동',manual:'수동'},ja:{auto:'自動',manual:'手動'},zh:{auto:'自动',manual:'手动'},my:{auto:'အလိုအလျောက်',manual:'လက်ဖြင့်'},th:{auto:'อัตโนมัติ',manual:'ด้วยตนเอง'},id:{auto:'Otomatis',manual:'Manual'},ph:{auto:'Awtomatiko',manual:'Manual'},ne:{auto:'स्वचालित',manual:'म्यानुअल'},hi:{auto:'स्वचालित',manual:'मैनुअल'}};var p=packs[L]||packs.en;return auto?p.auto:p.manual;}
  function exportRows(){var y=calView.y,m=calView.m,nd=new Date(y,m+1,0).getDate(),rows=[],T=getLang(),STATUS={cm:T.coMat||'Có mặt',vang:T.vang||'Vắng',np:T.nghiPhep||'Nghỉ phép',ll:legacyHolidayLabel(T)};function add(g,rec,label){var ins=rec?.in||'',outs=rec?.out||'',dur='';if(ins&&outs)dur=(((timeToMin(outs)-timeToMin(ins)+1440)%1440)/60).toFixed(1)+'h';var gps='',gi=rec?.gpsIn,go=rec?.gpsOut;if(gi&&gi.lat)gps='IN '+gi.lat.toFixed(5)+','+gi.lng.toFixed(5);if(go&&go.lat)gps+=(gps?' | ':'')+'OUT '+go.lat.toFixed(5)+','+go.lng.toFixed(5);rows.push({date:g+'/'+(m+1)+'/'+y,day:DAYS[new Date(y,m,g).getDay()],job:label,status:STATUS[rec?.type]||'',in:ins,out:outs,hours:dur,type:legacyExportTypeLabel(!!(rec&&rec.auto)),note:rec?.note||'',gps:gps});}for(var g=1;g<=nd;g++){var rec=attData[y+'-'+m+'-'+g];if(!rec)continue;if(_exportFilter!=='sub')add(g,rec,u('job.main'));if(rec.sub&&_exportFilter!=='main')add(g,rec.sub,userData.subJob?.name||u('job.sub'));}return rows;}
  
