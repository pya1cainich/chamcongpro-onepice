/* ===== ĐỒNG HỒ REALTIME ===== */
const ATT_TIME_PLACEHOLDER = '__ __';

function getTodayAttendanceTimeText(){
  const now = new Date();
  const k = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  const day = attData[k] || {};
  const rec = (day.in || day.out) ? day : (day.sub || {});
  const inTime = rec.in || ATT_TIME_PLACEHOLDER;
  const outTime = rec.out || ATT_TIME_PLACEHOLDER;
  return `${inTime}-${outTime}`;
}

function updateTodayStatusTime(){
  const statusEl = document.getElementById('todayStatus');
  if(!statusEl) return;
  const now = new Date();
  const day = attData[`${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`] || {};
  const rec = (day.in || day.out) ? day : (day.sub || {});
  statusEl.textContent = getTodayAttendanceTimeText();
  statusEl.className = 'status-pill ' + (rec.out ? 'out' : rec.in ? 'in' : 'none');
}

function updateClockShiftTime(){
  const oldShiftEl = document.getElementById('clockShiftTime');
  if(oldShiftEl) oldShiftEl.remove();
  updateTodayStatusTime();
}

/** Cập nhật đồng hồ realtime (gọi mỗi giây) */
function updateClock(){
  const now=new Date();
  const h=String(now.getHours()).padStart(2,'0');
  const min=String(now.getMinutes()).padStart(2,'0');
  document.getElementById('clockTime').textContent=`${h}:${min}`;
  const days=(window._DAYS&&window._DAYS.length===7)?[...window._DAYS]:['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];
  document.getElementById('clockDate').textContent=`${days[now.getDay()]}, ${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;
  updateClockShiftTime();
  document.getElementById('clockDay').textContent=now.getDate();
  document.getElementById('clockMonth').textContent=`${MONTHS[now.getMonth()]}, ${now.getFullYear()}`;
}
setInterval(updateClock,1000);


/* --- Tiếp theo: Kiểu trả lương, Panel chi tiết, Popup chào, i18n, Init --- */

/* ===== KIỂU TRẢ LƯƠNG: Tháng / Ngày / Giờ ===== */
let _salaryMode = 'month'; // 'month' | 'day' | 'hour'

/** Đổi kiểu trả lương — cập nhật label input + ẩn/hiện ô ngày công */
function setSalaryMode(mode, el){
  _salaryMode = mode;
  userData.salaryMode = mode;
  saveUser();

  // Style nút active
  document.querySelectorAll('.salary-mode-btn').forEach(b=>{
    b.style.background='white'; b.style.color='var(--text2)'; b.style.borderColor='var(--border)';
  });
  if(el){ el.style.background='var(--ac)'; el.style.color='white'; el.style.borderColor='var(--ac)'; }

  // Đổi label input theo kiểu
  const L = userData.lang||'vi';
  const lblMap = {
    month: {vi:'Lương hợp đồng / tháng', en:'Contract salary / month', ko:'월 계약 급여',  ja:'月額契約給与', zh:'合同月薪',     my:'လစဉ်လစာ',th:'เงินเดือนต่อเดือน',id:'Gaji per bulan',ph:'Sahod bawat buwan',ne:'मासिक तलब',hi:'मासिक वेतन'},
    day:   {vi:'Lương / ngày công',       en:'Salary / day',           ko:'일 급여',        ja:'日給',         zh:'日薪',         my:'နေ့စဉ်လစာ',th:'เงินเดือนต่อวัน',id:'Gaji per hari',ph:'Sahod bawat araw',ne:'दैनिक तलब',hi:'दैनिक वेतन'},
    hour:  {vi:'Lương / giờ',             en:'Salary / hour',          ko:'시급',           ja:'時給',         zh:'时薪',         my:'နာရီလစာ',th:'เงินเดือนต่อชั่วโมง',id:'Gaji per jam',ph:'Sahod bawat oras',ne:'प्रति घण्टा तलब',hi:'प्रति घंटे वेतन'},
  };
  const phMap = {
    month: '10,000,000',
    day:   '500,000',
    hour:  '60,000',
  };
  _s('salaryContract2', (lblMap[mode][L]||lblMap[mode].vi));
  const inp = document.getElementById('salaryInput');
  if(inp){ inp.placeholder = phMap[mode]; inp.value=''; }

  // Ẩn ô "ngày công chuẩn" khi không phải month
  const daysBlock = document.getElementById('salaryDaysBlock');
  if(daysBlock) daysBlock.style.display = (mode === 'month') ? '' : 'none';

  calcSalary();
}

/** Đồng bộ nút khi mở panel theo userData.salaryMode đã lưu */
function _syncSalaryModeButtons(){
  const mode = userData.salaryMode || 'month';
  _salaryMode = mode;
  const ids = {month:'smbMonth', day:'smbDay', hour:'smbHour'};
  Object.keys(ids).forEach(m=>{
    const el = document.getElementById(ids[m]);
    if(!el) return;
    const isActive = (m === mode);
    el.style.background  = isActive ? 'var(--ac)' : 'white';
    el.style.color       = isActive ? 'white' : 'var(--text2)';
    el.style.borderColor = isActive ? 'var(--ac)' : 'var(--border)';
  });
  const daysBlock = document.getElementById('salaryDaysBlock');
  if(daysBlock) daysBlock.style.display = (mode === 'month') ? '' : 'none';
}

/** Đổi tab Bảng giờ / Bảng lương */
function switchSalaryTab(tab){
  const isHours = tab === 'hours';
  document.getElementById('tabHoursContent').style.display  = isHours ? '' : 'none';
  document.getElementById('tabSalaryContent').style.display = isHours ? 'none' : '';
  const bH = document.getElementById('tabHours');
  const bS = document.getElementById('tabSalary');
  if(bH){ bH.style.color = isHours ? 'var(--ac)' : 'var(--text3)'; bH.style.borderBottomColor = isHours ? 'var(--ac)' : 'transparent'; }
  if(bS){ bS.style.color = isHours ? 'var(--text3)' : 'var(--ac)'; bS.style.borderBottomColor = isHours ? 'transparent' : 'var(--ac)'; }
  if(!isHours){ renderHoursTable(); calcSalary(); }
  else renderHoursTable();
}

/** Chọn kỳ tính giờ */
let _salaryPeriod = 'month';
function setSalaryPeriod(p, el){
  _salaryPeriod = p;
  document.querySelectorAll('.period-btn').forEach(b=>{
    b.style.background='white'; b.style.color='var(--text2)'; b.style.borderColor='var(--border)';
  });
  if(el){ el.style.background='var(--ac)'; el.style.color='white'; el.style.borderColor='var(--ac)'; }
  renderHoursTable();
}

/** Tính toán và render bảng giờ */
function renderHoursTable(){
  const now = new Date();
  const pr = getPayrollRule();
  const shiftH = userData.hoursPerShift || 8;

  // Xác định khoảng ngày
  let days=[], label='';
  if(_salaryPeriod==='week'){
    const dow=now.getDay();
    const mon=new Date(now); mon.setDate(now.getDate()-(dow===0?6:dow-1));
    for(let i=0;i<7;i++){const d=new Date(mon);d.setDate(mon.getDate()+i);days.push(d);}
    label=`${mon.getDate()}/${mon.getMonth()+1} – ${days[6].getDate()}/${days[6].getMonth()+1}/${now.getFullYear()}`;
  } else if(_salaryPeriod==='month'){
    const y=now.getFullYear(),m=now.getMonth(),nd=new Date(y,m+1,0).getDate();
    for(let g=1;g<=nd;g++) days.push(new Date(y,m,g));
    const mn=getLang().months||['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
    label=mn[now.getMonth()]+' '+now.getFullYear();
  } else {
    const y=now.getFullYear();
    for(let m=0;m<12;m++){const nd=new Date(y,m+1,0).getDate();for(let g=1;g<=nd;g++)days.push(new Date(y,m,g));}
    label=(getLang().year||'Năm')+' '+now.getFullYear();
  }

  // Tích lũy giờ từ attData (trừ giờ nghỉ giữa giờ nếu có)
  const breakHours = (userData.hasBreak && userData.breakMinutes) ? userData.breakMinutes/60 : 0;
  let bH=0,otH=0,niH=0,hoH=0,bD=0,otD=0,niD=0,hoD=0;
  days.forEach(d=>{
    const k=`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const rec=attData[k]; if(!rec) return;
    let worked=shiftH;
    if(rec.in&&rec.out) worked=((timeToMin(rec.out)-timeToMin(rec.in)+1440)%1440)/60;
    // Trừ thời gian nghỉ giữa giờ ra khỏi giờ làm thực tế
    worked = Math.max(0, worked - breakHours);
    const nl=gNL(d.getFullYear(),d.getMonth(),d.getDate());
    if(rec.type==='ll'||nl){hoH+=worked;hoD++;}
    else if(rec.type==='cm'){
      const basic=Math.min(worked,shiftH), ot=Math.max(0,worked-shiftH);
      bH+=basic; if(basic>0)bD++;
      otH+=ot;   if(ot>0)otD++;
      if(rec.out&&timeToMin(rec.out)>22*60){niH+=(timeToMin(rec.out)-22*60)/60;niD++;}
      if(rec.in &&timeToMin(rec.in) < 6*60){niH+=(6*60-timeToMin(rec.in))/60;}
    }
  });

  const totH=bH+otH+niH+hoH, totD=bD+otD+niD+hoD;
  const wk = _salaryPeriod==='week'?1:_salaryPeriod==='month'?4.33:52;
  const fn=v=>v>0?(Math.round(v*10)/10)+'h':'0h';
  const fd=v=>v>0?v:'0';
  const fw=v=>v>0?(Math.round(v/wk*10)/10)+'h':'0h';
  const fm=v=>{
    const mv=_salaryPeriod==='month'?v:_salaryPeriod==='week'?v*4.33:v/12;
    return mv>0?(Math.round(mv*10)/10)+'h':'0h';
  };

  // Summary cards
  _s('thTongGio',  fn(totH)); _s('thNgayCong',(bD+hoD).toString()); _s('thTangCa',fn(otH));

  // Table rows
  _s('thBasicH',fn(bH));  _s('thBasicD',fd(bD));  _s('thBasicW',fw(bH));  _s('thBasicM',fm(bH));
  _s('thOTH',   fn(otH)); _s('thOTD',   fd(otD)); _s('thOTW',   fw(otH)); _s('thOTM',   fm(otH));
  _s('thNightH',fn(niH)); _s('thNightD',fd(niD)); _s('thNightW',fw(niH)); _s('thNightM',fm(niH));
  _s('thHolH',  fn(hoH)); _s('thHolD',  fd(hoD)); _s('thHolW',  fw(hoH)); _s('thHolM',  fm(hoH));
  _s('thTotalH',fn(totH));_s('thTotalD',fd(totD));_s('thTotalW',fw(totH));_s('thTotalM',fm(totH));

  // Rate labels từ payroll rule của nước đang dùng
  _s('thRowOTRate',   '×'+pr.otFactor.toFixed(1));
  _s('thRowNightRate','+'+Math.round((pr.nightFactor-1)*100)+'%');
  _s('thRowHolRate',  '×'+pr.holidayFactor.toFixed(1));
  _s('thPeriodLabel', label);

  // Lưu cho bảng lương dùng
  window._hoursData={basicH:bH,otH,nightH:niH,holH:hoH,basicD:bD,totalD:totD};
}



function confirmReset(){
  openPanel('panelConfirmReset');
}

/** Xóa toàn bộ localStorage và reload app về trạng thái ban đầu */
function renderHelpPanel(){
  const el = document.getElementById('helpPanelBody');
  if(!el) return;
  const L = (window.userData && window.userData.lang) || 'vi';
  const guide = {
    vi:{
      title:'Hướng dẫn sử dụng',
      intro:'Ứng dụng này dùng để chấm công và ghi lại giờ làm thực tế mỗi ngày. Cuối tháng, bạn có dữ liệu để so sánh với bảng chấm công của chủ lao động hoặc công ty.',
      sections:[
        {h:'1. Thiết lập ban đầu', b:['Chọn <b>ngôn ngữ</b> và <b>quốc gia làm việc</b>.','Nhập tên, công ty, vị trí công việc, lịch làm dự kiến, số giờ mỗi ca và cách tính lương.','Nếu có việc phụ, bật <b>công việc phụ</b> rồi nhập tên việc và cách tính lương riêng.']},
        {h:'2. Chấm công hằng ngày', b:['Khi bắt đầu làm, bấm <b>Vào ca</b>. Khi kết thúc, bấm <b>Hết ca</b>.','Nếu cần sửa giờ hoặc ghi chú, vào <b>Lịch chấm công</b>, chọn ngày và chỉnh lại thông tin.','Sau khi một ngày đã có giờ vào hoặc giờ ra, hãy sửa trong lịch nếu muốn thay đổi.']},
        {h:'3. Dùng GPS tự động', b:['Mở mục <b>GPS</b>, bật chấm công tự động và chọn công việc chính hoặc công việc phụ.','Đứng tại vị trí công ty rồi bấm <b>Lấy vị trí hiện tại</b>. Vị trí này sẽ được lưu để dùng cho các lần sau.','Giữ <b>Vị trí</b> của điện thoại luôn bật khi đi làm. Nếu công ty rộng hoặc tín hiệu yếu, chỉnh bán kính trong mục GPS.','Khi đổi sang địa điểm làm việc mới, vào GPS và bấm lấy vị trí mới.']},
        {h:'4. Quyền cần bật', b:['Trong nút chuông có các nút mở nhanh: <b>quyền thông báo</b>, <b>quyền vị trí</b> và <b>cài đặt pin của ứng dụng</b>.','Với vị trí, chọn <b>Luôn cho phép</b> và bật <b>vị trí chính xác</b>.','Với pin, chọn <b>Không hạn chế</b> hoặc tắt tối ưu pin cho ứng dụng.']},
        {h:'5. Lịch, lương và xuất file', b:['Vào <b>Lịch chấm công</b> để xem từng ngày, sửa giờ, sửa trạng thái hoặc thêm ghi chú.','Vào <b>Lương</b> để xem số tiền ước tính theo dữ liệu đã ghi.','Dùng <b>Xuất Excel</b> cuối tháng để lưu dữ liệu đối chiếu.']},
        {h:'6. Dữ liệu cá nhân', b:['Dữ liệu chấm công, lương, GPS và thông tin cá nhân được lưu trên điện thoại của bạn.','Hãy xuất file định kỳ nếu bạn đổi điện thoại, xóa ứng dụng hoặc cần lưu bản đối chiếu riêng.']}
      ]
    },
    en:{
      title:'User Guide',
      intro:'This app is for clocking in/out and recording your actual work hours each day. At the end of the month, you have data to compare with your employer or company attendance records.',
      sections:[
        {h:'1. First setup', b:['Choose your <b>language</b> and <b>work country</b>.','Enter your name, company, job position, expected schedule, hours per shift, and salary method.','If you have a second job, turn on <b>Sub job</b> and enter its name and pay method.']},
        {h:'2. Daily attendance', b:['When work starts, tap <b>IN</b>. When work ends, tap <b>OUT</b>.','To change time or notes, open <b>Calendar</b>, choose the day, and edit the record.','After a day already has an IN or OUT time, use Calendar if you need to change it.']},
        {h:'3. Auto GPS', b:['Open <b>GPS</b>, turn on automatic attendance, and choose the main job or sub job.','Stand at the company location and tap <b>Get current location</b>. This location is saved for future use.','Keep phone <b>Location</b> on while working. If the workplace is large or the signal is weak, adjust the radius in GPS.','When you move to a new work location, open GPS and save the new location.']},
        {h:'4. Required permissions', b:['The bell menu has quick buttons for <b>Notification permission</b>, <b>Location permission</b>, and <b>App battery settings</b>.','For location, choose <b>Allow all the time</b> and turn on <b>Precise location</b>.','For battery, choose <b>Unrestricted</b> or turn off battery optimization for the app.']},
        {h:'5. Calendar, salary, export', b:['Use <b>Calendar</b> to review each day, edit times, change status, or add notes.','Use <b>Salary</b> to view estimated pay from your saved records.','Use <b>Export Excel</b> at month-end to save comparison data.']},
        {h:'6. Personal data', b:['Attendance, salary, GPS, and personal settings are stored on your phone.','Export regularly when changing phones, removing the app, or keeping your own comparison copy.']}
      ]
    },
    ko:{
      title:'사용 가이드',
      intro:'이 앱은 매일 실제 출퇴근 시간과 근무 시간을 기록하기 위한 앱입니다. 월말에 고용주 또는 회사의 근태 기록과 비교할 수 있는 데이터를 남길 수 있습니다.',
      sections:[
        {h:'1. 처음 설정', b:['<b>언어</b>와 <b>근무 국가</b>를 선택합니다.','이름, 회사, 직무, 예정 근무표, 한 근무의 시간, 급여 계산 방식을 입력합니다.','부업이 있으면 <b>부업</b>을 켜고 이름과 급여 방식을 입력합니다.']},
        {h:'2. 매일 출퇴근 기록', b:['근무를 시작할 때 <b>출근</b>, 끝날 때 <b>퇴근</b>을 누릅니다.','시간이나 메모를 바꾸려면 <b>달력</b>에서 날짜를 선택해 수정합니다.','이미 출근 또는 퇴근 시간이 있는 날은 달력에서 수정합니다.']},
        {h:'3. 자동 GPS 사용', b:['<b>GPS</b>를 열고 자동 출퇴근을 켠 뒤 주 업무 또는 부업을 선택합니다.','회사 위치에 서서 <b>현재 위치 가져오기</b>를 누릅니다. 이 위치는 다음에도 사용됩니다.','근무 중에는 휴대폰 <b>위치</b>를 켜 둡니다. 회사가 넓거나 신호가 약하면 GPS 화면에서 반경을 조정합니다.','근무지가 바뀌면 GPS에서 새 위치를 저장합니다.']},
        {h:'4. 필요한 권한', b:['알림 종 메뉴에서 <b>알림 권한</b>, <b>위치 권한</b>, <b>앱 배터리 설정</b>을 바로 열 수 있습니다.','위치는 <b>항상 허용</b>을 선택하고 <b>정확한 위치</b>를 켭니다.','배터리는 <b>제한 없음</b> 또는 앱 배터리 최적화 해제를 선택합니다.']},
        {h:'5. 달력, 급여, 내보내기', b:['<b>달력</b>에서 날짜별 기록, 시간, 상태, 메모를 확인하고 수정합니다.','<b>급여</b>에서 저장된 기록 기준의 예상 급여를 확인합니다.','월말에는 <b>Excel 내보내기</b>로 비교용 데이터를 저장합니다.']},
        {h:'6. 개인 데이터', b:['근태, 급여, GPS, 개인 설정은 휴대폰에 저장됩니다.','휴대폰을 바꾸거나 앱을 삭제하기 전, 또는 별도 보관이 필요할 때 정기적으로 내보내세요.']}
      ]
    },
    ja:{
      title:'使用ガイド',
      intro:'このアプリは、毎日の出退勤と実際の勤務時間を記録するためのものです。月末に、雇用主または会社の勤怠記録と比較できるデータを残せます。',
      sections:[
        {h:'1. 初期設定', b:['<b>言語</b>と<b>勤務国</b>を選びます。','名前、会社、職種、予定シフト、1シフトの時間、給与計算方法を入力します。','副業がある場合は<b>副業</b>をオンにし、名前と給与方法を入力します。']},
        {h:'2. 毎日の打刻', b:['仕事を始める時は<b>出勤</b>、終わる時は<b>退勤</b>を押します。','時間やメモを変更する場合は<b>カレンダー</b>で日付を選んで編集します。','すでに出勤または退勤時刻がある日は、カレンダーから修正します。']},
        {h:'3. 自動GPS', b:['<b>GPS</b>を開き、自動打刻をオンにして、本業または副業を選びます。','会社の場所に立って<b>現在地を取得</b>を押します。この場所は次回以降も使われます。','勤務中はスマホの<b>位置情報</b>をオンにします。職場が広い、または電波が弱い場合はGPS画面で半径を調整します。','勤務場所が変わったら、GPSで新しい場所を保存します。']},
        {h:'4. 必要な権限', b:['ベルメニューから<b>通知権限</b>、<b>位置情報権限</b>、<b>アプリのバッテリー設定</b>を開けます。','位置情報は<b>常に許可</b>を選び、<b>正確な位置情報</b>をオンにします。','バッテリーは<b>制限なし</b>、またはこのアプリの最適化をオフにします。']},
        {h:'5. カレンダー、給与、出力', b:['<b>カレンダー</b>で日別記録、時間、状態、メモを確認・編集します。','<b>給与</b>で保存済み記録から推定給与を確認します。','月末に<b>Excel出力</b>で比較用データを保存します。']},
        {h:'6. 個人データ', b:['勤怠、給与、GPS、個人設定はスマホに保存されます。','機種変更、アプリ削除、別保存が必要な時は定期的に出力してください。']}
      ]
    },
    zh:{
      title:'使用指南',
      intro:'本应用用于每天打卡并记录实际工作时间。到月底，你可以用这些数据与雇主或公司的考勤记录进行对比。',
      sections:[
        {h:'1. 初始设置', b:['选择<b>语言</b>和<b>工作国家</b>。','填写姓名、公司、职位、预计班表、每班小时数和工资计算方式。','如果有副业，开启<b>副业</b>并填写名称和工资方式。']},
        {h:'2. 每日打卡', b:['开始工作时点<b>上班</b>，结束工作时点<b>下班</b>。','需要修改时间或备注时，打开<b>日历</b>，选择日期后编辑。','当天已有上班或下班时间后，如需更改请到日历修改。']},
        {h:'3. 使用自动GPS', b:['打开<b>GPS</b>，开启自动打卡，并选择主工作或副业。','站在公司位置，点击<b>获取当前位置</b>。该位置会保存供以后使用。','工作时保持手机<b>位置</b>开启。公司范围较大或信号较弱时，在GPS页面调整半径。','更换工作地点时，到GPS保存新的位置。']},
        {h:'4. 需要开启的权限', b:['铃铛菜单中有快捷按钮：<b>通知权限</b>、<b>位置权限</b>、<b>应用电池设置</b>。','位置请选择<b>始终允许</b>，并开启<b>精确位置</b>。','电池请选择<b>不受限制</b>，或关闭本应用的电池优化。']},
        {h:'5. 日历、工资、导出', b:['在<b>日历</b>查看每天记录，修改时间、状态或备注。','在<b>工资</b>查看根据记录估算的工资。','月底使用<b>导出Excel</b>保存对比数据。']},
        {h:'6. 个人数据', b:['考勤、工资、GPS和个人设置保存在你的手机上。','换手机、删除应用或需要单独保存时，请定期导出。']}
      ]
    },
    my:{
      title:'အသုံးပြုနည်း',
      intro:'ဤအက်ပ်သည် နေ့စဉ် အလုပ်ဝင်/ထွက်ချိန်နှင့် အလုပ်လုပ်ချိန်ကို မှတ်တမ်းတင်ရန် အသုံးပြုသည်။ လကုန်တွင် သင့်အလုပ်ရှင် သို့မဟုတ် ကုမ္ပဏီ၏ အချိန်မှတ်တမ်းနှင့် နှိုင်းယှဉ်ရန် ဒေတာရှိနေမည်။',
      sections:[
        {h:'1. ပထမဆုံး စတင်သတ်မှတ်ခြင်း', b:['<b>ဘာသာစကား</b>နှင့် <b>အလုပ်လုပ်သောနိုင်ငံ</b>ကို ရွေးပါ။','အမည်၊ ကုမ္ပဏီ၊ အလုပ်ရာထူး၊ မျှော်မှန်းအလုပ်ချိန်ဇယား၊ တစ်ဆိုင်းနာရီနှင့် လစာတွက်နည်းကို ထည့်ပါ။','အပိုအလုပ်ရှိပါက <b>Sub job</b> ကိုဖွင့်ပြီး အမည်နှင့် လစာတွက်နည်းကို ထည့်ပါ။']},
        {h:'2. နေ့စဉ် အလုပ်ချိန်မှတ်ခြင်း', b:['အလုပ်စချိန် <b>IN</b> ကိုနှိပ်ပါ။ အလုပ်ပြီးချိန် <b>OUT</b> ကိုနှိပ်ပါ။','ချိန် သို့မဟုတ် မှတ်ချက် ပြင်ရန် <b>Calendar</b> တွင်နေ့ရက်ကိုရွေးပြီး ပြင်ပါ။','နေ့တစ်နေ့တွင် IN သို့မဟုတ် OUT ရှိပြီးသားဖြစ်ပါက Calendar ထဲတွင် ပြင်ပါ။']},
        {h:'3. Auto GPS အသုံးပြုခြင်း', b:['<b>GPS</b> ကိုဖွင့်ပြီး automatic attendance ကိုဖွင့်ကာ main job သို့မဟုတ် sub job ကိုရွေးပါ။','ကုမ္ပဏီနေရာတွင် ရပ်ပြီး <b>Get current location</b> ကိုနှိပ်ပါ။ ထိုနေရာကို နောက်ပိုင်းအသုံးပြုရန် သိမ်းထားမည်။','အလုပ်လုပ်နေစဉ် ဖုန်း <b>Location</b> ကိုဖွင့်ထားပါ။ နေရာကျယ်ခြင်း သို့မဟုတ် signal အားနည်းခြင်းရှိပါက GPS တွင် radius ကိုပြင်ပါ။','အလုပ်နေရာအသစ်ပြောင်းပါက GPS တွင် နေရာအသစ်ကိုသိမ်းပါ။']},
        {h:'4. လိုအပ်သော ခွင့်ပြုချက်များ', b:['bell menu တွင် <b>Notification permission</b>, <b>Location permission</b>, <b>App battery settings</b> ခလုတ်များရှိသည်။','Location အတွက် <b>Allow all the time</b> ကိုရွေးပြီး <b>Precise location</b> ကိုဖွင့်ပါ။','Battery အတွက် <b>Unrestricted</b> သို့မဟုတ် app battery optimization ပိတ်ပါ။']},
        {h:'5. Calendar, Salary, Export', b:['<b>Calendar</b> တွင် နေ့စဉ်မှတ်တမ်း၊ ချိန်၊ status၊ note ကိုကြည့်ပြီး ပြင်ပါ။','<b>Salary</b> တွင် သိမ်းထားသောဒေတာအရ ခန့်မှန်းလစာကိုကြည့်ပါ။','လကုန်တွင် <b>Export Excel</b> ဖြင့် နှိုင်းယှဉ်ဒေတာကို သိမ်းပါ။']},
        {h:'6. ကိုယ်ရေးဒေတာ', b:['Attendance, salary, GPS နှင့် personal settings များကို သင့်ဖုန်းထဲတွင် သိမ်းထားသည်။','ဖုန်းပြောင်းခြင်း၊ app ဖျက်ခြင်း သို့မဟုတ် သီးခြားသိမ်းလိုခြင်းရှိပါက ပုံမှန် export လုပ်ပါ။']}
      ]
    },
    th:{
      title:'คู่มือการใช้งาน',
      intro:'แอปนี้ใช้สำหรับลงเวลาเข้าออกงานและบันทึกชั่วโมงทำงานจริงในแต่ละวัน เมื่อถึงสิ้นเดือน คุณจะมีข้อมูลไว้เปรียบเทียบกับบันทึกเวลาของนายจ้างหรือบริษัท.',
      sections:[
        {h:'1. ตั้งค่าครั้งแรก', b:['เลือก<b>ภาษา</b>และ<b>ประเทศที่ทำงาน</b>.','กรอกชื่อ บริษัท ตำแหน่งงาน ตารางงานที่คาดไว้ ชั่วโมงต่อกะ และวิธีคำนวณเงินเดือน.','ถ้ามีงานเสริม ให้เปิด <b>Sub job</b> แล้วกรอกชื่องานและวิธีคำนวณเงิน.']},
        {h:'2. ลงเวลาประจำวัน', b:['เมื่อเริ่มงานให้แตะ <b>IN</b> เมื่อเลิกงานให้แตะ <b>OUT</b>.','ถ้าต้องแก้เวลา หรือหมายเหตุ ให้เปิด <b>Calendar</b> เลือกวันแล้วแก้ไข.','ถ้าวันนั้นมีเวลา IN หรือ OUT แล้ว ให้แก้จาก Calendar เมื่อต้องการเปลี่ยน.']},
        {h:'3. ใช้ GPS อัตโนมัติ', b:['เปิด <b>GPS</b> เปิด automatic attendance แล้วเลือกงานหลักหรืองานเสริม.','ยืนที่ตำแหน่งบริษัทแล้วแตะ <b>Get current location</b> ตำแหน่งนี้จะถูกบันทึกไว้ใช้ครั้งต่อไป.','เปิด <b>Location</b> ของโทรศัพท์ไว้ระหว่างทำงาน ถ้าพื้นที่บริษัทกว้างหรือสัญญาณอ่อน ให้ปรับ radius ในหน้า GPS.','เมื่อเปลี่ยนสถานที่ทำงาน ให้บันทึกตำแหน่งใหม่ใน GPS.']},
        {h:'4. สิทธิ์ที่ต้องเปิด', b:['ในเมนูรูประฆังมีปุ่มลัดสำหรับ <b>Notification permission</b>, <b>Location permission</b>, และ <b>App battery settings</b>.','ตำแหน่งให้เลือก <b>Allow all the time</b> และเปิด <b>Precise location</b>.','แบตเตอรี่ให้เลือก <b>Unrestricted</b> หรือปิด battery optimization สำหรับแอปนี้.']},
        {h:'5. Calendar, Salary, Export', b:['ใช้ <b>Calendar</b> เพื่อดูและแก้เวลา สถานะ หรือหมายเหตุในแต่ละวัน.','ใช้ <b>Salary</b> เพื่อดูเงินเดือนประมาณจากข้อมูลที่บันทึก.','สิ้นเดือนใช้ <b>Export Excel</b> เพื่อเก็บข้อมูลเปรียบเทียบ.']},
        {h:'6. ข้อมูลส่วนตัว', b:['ข้อมูลเวลา เงินเดือน GPS และการตั้งค่าส่วนตัวถูกบันทึกไว้ในโทรศัพท์ของคุณ.','ควร export เป็นประจำเมื่อเปลี่ยนโทรศัพท์ ลบแอป หรือต้องการเก็บสำเนาไว้เอง.']}
      ]
    },
    id:{
      title:'Panduan Penggunaan',
      intro:'Aplikasi ini digunakan untuk absen masuk/keluar dan mencatat jam kerja nyata setiap hari. Di akhir bulan, Anda punya data untuk dibandingkan dengan catatan absensi dari pemberi kerja atau perusahaan.',
      sections:[
        {h:'1. Pengaturan awal', b:['Pilih <b>bahasa</b> dan <b>negara kerja</b>.','Isi nama, perusahaan, posisi, jadwal kerja perkiraan, jam per shift, dan metode gaji.','Jika ada pekerjaan tambahan, aktifkan <b>Sub job</b> lalu isi nama dan metode gajinya.']},
        {h:'2. Absensi harian', b:['Saat mulai kerja, tekan <b>IN</b>. Saat selesai kerja, tekan <b>OUT</b>.','Untuk mengubah jam atau catatan, buka <b>Calendar</b>, pilih tanggal, lalu edit.','Jika hari tersebut sudah punya jam IN atau OUT, ubah melalui Calendar.']},
        {h:'3. GPS otomatis', b:['Buka <b>GPS</b>, aktifkan automatic attendance, lalu pilih main job atau sub job.','Berdiri di lokasi perusahaan lalu tekan <b>Get current location</b>. Lokasi ini disimpan untuk digunakan lagi.','Biarkan <b>Location</b> ponsel aktif saat bekerja. Jika area perusahaan besar atau sinyal lemah, atur radius di menu GPS.','Saat pindah lokasi kerja, simpan lokasi baru di GPS.']},
        {h:'4. Izin yang diperlukan', b:['Menu lonceng memiliki tombol cepat untuk <b>Notification permission</b>, <b>Location permission</b>, dan <b>App battery settings</b>.','Untuk lokasi, pilih <b>Allow all the time</b> dan aktifkan <b>Precise location</b>.','Untuk baterai, pilih <b>Unrestricted</b> atau matikan battery optimization untuk aplikasi ini.']},
        {h:'5. Calendar, Salary, Export', b:['Gunakan <b>Calendar</b> untuk melihat dan mengedit jam, status, atau catatan harian.','Gunakan <b>Salary</b> untuk melihat estimasi gaji dari data tersimpan.','Di akhir bulan, gunakan <b>Export Excel</b> untuk menyimpan data pembanding.']},
        {h:'6. Data pribadi', b:['Absensi, gaji, GPS, dan pengaturan pribadi disimpan di ponsel Anda.','Export secara berkala saat ganti ponsel, hapus aplikasi, atau ingin menyimpan salinan sendiri.']}
      ]
    },
    ph:{
      title:'Gabay sa Paggamit',
      intro:'Ginagamit ang app na ito para mag-clock in/out at itala ang totoong oras ng trabaho araw-araw. Sa katapusan ng buwan, may data kang maihahambing sa attendance record ng employer o kumpanya.',
      sections:[
        {h:'1. Unang setup', b:['Piliin ang <b>wika</b> at <b>bansa ng trabaho</b>.','Ilagay ang pangalan, kumpanya, posisyon, inaasahang schedule, oras bawat shift, at paraan ng sahod.','Kung may second job, i-on ang <b>Sub job</b> at ilagay ang pangalan at paraan ng bayad.']},
        {h:'2. Araw-araw na attendance', b:['Kapag magsisimula sa trabaho, tapikin ang <b>IN</b>. Kapag tapos na, tapikin ang <b>OUT</b>.','Para baguhin ang oras o notes, buksan ang <b>Calendar</b>, pumili ng araw, at i-edit.','Kung may IN o OUT na ang araw, sa Calendar ito baguhin.']},
        {h:'3. Auto GPS', b:['Buksan ang <b>GPS</b>, i-on ang automatic attendance, at piliin ang main job o sub job.','Tumayo sa lokasyon ng kumpanya at tapikin ang <b>Get current location</b>. Mase-save ito para sa mga susunod na gamit.','Panatilihing naka-on ang phone <b>Location</b> habang nagtatrabaho. Kung malaki ang lugar o mahina ang signal, ayusin ang radius sa GPS.','Kapag lumipat ng work location, mag-save ng bagong location sa GPS.']},
        {h:'4. Mga kailangang permission', b:['Sa bell menu may quick buttons para sa <b>Notification permission</b>, <b>Location permission</b>, at <b>App battery settings</b>.','Sa location, piliin ang <b>Allow all the time</b> at i-on ang <b>Precise location</b>.','Sa battery, piliin ang <b>Unrestricted</b> o i-off ang battery optimization para sa app.']},
        {h:'5. Calendar, Salary, Export', b:['Gamitin ang <b>Calendar</b> para tingnan at baguhin ang oras, status, o notes bawat araw.','Gamitin ang <b>Salary</b> para makita ang tantiyang sahod mula sa na-save na records.','Sa katapusan ng buwan, gamitin ang <b>Export Excel</b> para mag-save ng comparison data.']},
        {h:'6. Personal data', b:['Attendance, salary, GPS, at personal settings ay naka-save sa iyong phone.','Mag-export nang regular kapag magpapalit ng phone, mag-aalis ng app, o kailangan ng sariling kopya.']}
      ]
    },
    ne:{
      title:'प्रयोग मार्गदर्शिका',
      intro:'यो एप दैनिक हाजिरी लगाउन र वास्तविक काम गरेको समय रेकर्ड गर्न प्रयोग हुन्छ। महिनाको अन्त्यमा, तपाईंले रोजगारदाता वा कम्पनीको हाजिरी विवरणसँग तुलना गर्न डेटा पाउनुहुन्छ।',
      sections:[
        {h:'1. सुरुको सेटअप', b:['<b>भाषा</b> र <b>काम गर्ने देश</b> छान्नुहोस्।','नाम, कम्पनी, पद, अपेक्षित काम तालिका, प्रति सिफ्ट घण्टा र तलब गणना तरिका भर्नुहोस्।','अर्को काम छ भने <b>Sub job</b> खोल्नुहोस् र नाम तथा तलब तरिका भर्नुहोस्।']},
        {h:'2. दैनिक हाजिरी', b:['काम सुरु गर्दा <b>IN</b> थिच्नुहोस्। काम सकिँदा <b>OUT</b> थिच्नुहोस्।','समय वा नोट सच्याउन <b>Calendar</b> खोल्नुहोस्, दिन छान्नुहोस् र सम्पादन गर्नुहोस्।','दिनमा IN वा OUT समय भइसकेपछि परिवर्तन गर्न Calendar प्रयोग गर्नुहोस्।']},
        {h:'3. Auto GPS प्रयोग', b:['<b>GPS</b> खोल्नुहोस्, automatic attendance खोल्नुहोस् र main job वा sub job छान्नुहोस्।','कम्पनीको स्थानमा उभिएर <b>Get current location</b> थिच्नुहोस्। यो स्थान पछि प्रयोगका लागि सेभ हुन्छ।','काम गर्दा फोनको <b>Location</b> खुला राख्नुहोस्। कम्पनी ठूलो वा signal कमजोर भए GPS मा radius मिलाउनुहोस्।','काम गर्ने ठाउँ परिवर्तन भए GPS मा नयाँ स्थान सेभ गर्नुहोस्।']},
        {h:'4. आवश्यक अनुमति', b:['bell menu मा <b>Notification permission</b>, <b>Location permission</b>, र <b>App battery settings</b> का छिटो बटन छन्।','Location मा <b>Allow all the time</b> छान्नुहोस् र <b>Precise location</b> खोल्नुहोस्।','Battery मा <b>Unrestricted</b> छान्नुहोस् वा app battery optimization बन्द गर्नुहोस्।']},
        {h:'5. Calendar, Salary, Export', b:['<b>Calendar</b> मा दिनअनुसार समय, status वा note हेर्न र सच्याउन सकिन्छ।','<b>Salary</b> मा सेभ गरिएको रेकर्डबाट अनुमानित तलब हेर्नुहोस्।','महिनाको अन्त्यमा <b>Export Excel</b> प्रयोग गरेर तुलना गर्ने डेटा सेभ गर्नुहोस्।']},
        {h:'6. व्यक्तिगत डेटा', b:['हाजिरी, तलब, GPS र व्यक्तिगत सेटिङ तपाईंको फोनमा सेभ हुन्छ।','फोन फेर्दा, app हटाउँदा वा आफ्नै प्रतिलिपि राख्नुपर्दा नियमित export गर्नुहोस्।']}
      ]
    },
    hi:{
      title:'उपयोग गाइड',
      intro:'यह ऐप रोज़ clock in/out करने और वास्तविक काम के घंटे रिकॉर्ड करने के लिए है। महीने के अंत में आपके पास नियोक्ता या कंपनी के attendance record से तुलना करने के लिए डेटा रहेगा।',
      sections:[
        {h:'1. पहली सेटिंग', b:['<b>भाषा</b> और <b>काम का देश</b> चुनें।','नाम, कंपनी, पद, expected schedule, हर shift के घंटे और salary method भरें।','अगर दूसरा काम है, तो <b>Sub job</b> चालू करें और उसका नाम तथा pay method भरें।']},
        {h:'2. रोज़ की attendance', b:['काम शुरू करते समय <b>IN</b> दबाएँ। काम खत्म करते समय <b>OUT</b> दबाएँ।','समय या note बदलने के लिए <b>Calendar</b> खोलें, दिन चुनें और edit करें।','अगर किसी दिन IN या OUT time पहले से है, तो बदलाव Calendar से करें।']},
        {h:'3. Auto GPS इस्तेमाल', b:['<b>GPS</b> खोलें, automatic attendance चालू करें और main job या sub job चुनें।','कंपनी की जगह पर खड़े होकर <b>Get current location</b> दबाएँ। यह location आगे के लिए save रहेगी।','काम के समय phone <b>Location</b> चालू रखें। कंपनी बड़ी हो या signal कमजोर हो तो GPS में radius बदलें।','काम की जगह बदलने पर GPS में नई location save करें।']},
        {h:'4. जरूरी permissions', b:['bell menu में <b>Notification permission</b>, <b>Location permission</b>, और <b>App battery settings</b> के quick buttons हैं।','Location में <b>Allow all the time</b> चुनें और <b>Precise location</b> चालू करें।','Battery में <b>Unrestricted</b> चुनें या इस app के लिए battery optimization बंद करें।']},
        {h:'5. Calendar, Salary, Export', b:['<b>Calendar</b> में हर दिन का time, status या note देखें और edit करें।','<b>Salary</b> में saved records से estimated salary देखें।','महीने के अंत में <b>Export Excel</b> से comparison data save करें।']},
        {h:'6. Personal data', b:['Attendance, salary, GPS और personal settings आपके phone में save रहती हैं।','Phone बदलने, app हटाने या अपनी copy रखने के लिए regular export करें।']}
      ]
    }
  };
  const data = guide[L] || guide.en || guide.vi;
  const panel = document.querySelector('#panelHelp .panel-title');
  if(panel) panel.textContent = data.title;
  const sectionHtml = (sec) => `
    <div style="border-bottom:1px solid var(--border);padding:0 0 14px;margin-bottom:14px">
      <div style="font-size:15px;font-weight:900;color:var(--text);margin-bottom:7px">${sec.h}</div>
      <ul style="margin:0 0 0 18px;padding:0;font-size:13.5px;line-height:1.65;color:var(--text2)">
        ${sec.b.map(item => `<li style="margin-bottom:5px">${item}</li>`).join('')}
      </ul>
    </div>`;
  el.innerHTML = `
    <div style="font-size:13.5px;line-height:1.65;color:var(--text2);background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:14px">${data.intro}</div>
    ${data.sections.map(sectionHtml).join('')}
  `;
}

function doReset(){
  ['cp22_user','cp22_user_backup','cp22_att','cp22_ap','cp22_notif','cp22_lang'].forEach(k=>localStorage.removeItem(k));
  location.reload();
}

/* ===== PANEL CHI TIẾT TỪNG NGÀY (chọn trạng thái, nhập giờ) ===== */
const TT_CFG=[{id:'cm',ten:'Có mặt',sub:'Đi làm đúng ca',bg:'#1D9E75',svgC:'#0F6E56',bgI:'#E1F5EE',sel:'s-cm'},{id:'np',ten:'Nghỉ phép',sub:'Có hưởng lương',bg:'#EF9F27',svgC:'#633806',bgI:'#FAEEDA',sel:'s-np'},{id:'vang',ten:'Vắng mặt',sub:'Không phép — trừ lương',bg:'#E24B4A',svgC:'#791F1F',bgI:'#FCEBEB',sel:'s-vang'},{id:'ll',ten:'Làm ngày lễ',sub:'Tính 400%',bg:'#378ADD',svgC:'#0C447C',bgI:'#E6F1FB',sel:'s-ll'}];
const ICONS={cm:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><path d="M5 13l4 4L19 7"/></svg>`,np:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M3 12h4M17 12h4M12 3v4M12 17v4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M6.3 17.7l2.8-2.8M14.9 9.1l2.8-2.8"/></svg>`,vang:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><path d="M18 6L6 18M6 6l12 12"/></svg>`,ll:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,dem:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M12 3a6 6 0 009 9 9 9 0 11-9-9z"/></svg>`};

// Map v22 attData keys to v21 format
let _dayKey='', _daySelType=null, _dayCa=null;

const TT_COLORS={cm:'#0D9E75',np:'#F5A623',vang:'#E8433A',ll:'#2D7DD2'};
const TT_BG={cm:'#E0F5EE',np:'#FFF8E8',vang:'#FFF0EF',ll:'#EEF4FF'};
const TT_ICON={cm:'✓',np:'☀',vang:'✕',ll:'★'};
const DAY_STATUS_I18N={
  vi:{cm:{n:'Có mặt',s:'Đi làm đúng ca'},np:{n:'Nghỉ phép',s:'Có hưởng lương'},vang:{n:'Vắng mặt',s:'Không phép — trừ lương'},ll:{n:'Làm ngày lễ',s:'Tính theo luật'}},
  en:{cm:{n:'Present',s:'Worked the shift'},np:{n:'Leave',s:'Paid leave'},vang:{n:'Absent',s:'Unpaid absence'},ll:{n:'Holiday work',s:'By law'}},
  ko:{cm:{n:'출근',s:'정상 출근'},np:{n:'연차',s:'유급 휴가'},vang:{n:'결근',s:'무단 결근'},ll:{n:'휴일 근무',s:'법적 기준'}},
  ja:{cm:{n:'出勤',s:'通常出勤'},np:{n:'有給',s:'有給休暇'},vang:{n:'欠勤',s:'無断欠勤'},ll:{n:'休日出勤',s:'法定'}},
  zh:{cm:{n:'出勤',s:'正常出勤'},np:{n:'请假',s:'带薪假'},vang:{n:'缺勤',s:'无故缺勤'},ll:{n:'节假日',s:'按法律'}},
  my:{cm:{n:'တက်',s:'ပုံမှန်'},np:{n:'ခွင့်',s:'လစာပါ'},vang:{n:'ပျက်',s:'ခွင့်မဲ့'},ll:{n:'ရုံးပိတ်',s:'ဥပဒေ'}},
  th:{cm:{n:'มาทำงาน',s:'ทำงานตามกะ'},np:{n:'ลาหยุด',s:'ลาโดยได้รับเงิน'},vang:{n:'ขาดงาน',s:'ขาดงานโดยไม่มีเหตุ'},ll:{n:'ทำงานวันหยุด',s:'ตามกฎหมาย'}},
  id:{cm:{n:'Hadir',s:'Masuk kerja sesuai shift'},np:{n:'Cuti',s:'Cuti berbayar'},vang:{n:'Absen',s:'Tidak masuk tanpa izin'},ll:{n:'Kerja hari libur',s:'Sesuai hukum'}},
  ph:{cm:{n:'Naroroon',s:'Nagtrabaho ng shift'},np:{n:'Leave',s:'Bayad na bakasyon'},vang:{n:'Absent',s:'Walang pahintulot'},ll:{n:'Trabaho sa holiday',s:'Ayon sa batas'}},
  ne:{cm:{n:'उपस्थित',s:'सिफ्ट अनुसार काम गरे'},np:{n:'बिदा',s:'तलबसहित बिदा'},vang:{n:'अनुपस्थित',s:'अनुमति बिना अनुपस्थित'},ll:{n:'बिदाको दिन काम',s:'कानुन अनुसार'}},
  hi:{cm:{n:'उपस्थित',s:'शिफ्ट के अनुसार काम किया'},np:{n:'छुट्टी',s:'सवेतन अवकाश'},vang:{n:'अनुपस्थित',s:'बिना अनुमति अनुपस्थित'},ll:{n:'अवकाश पर काम',s:'कानून के अनुसार'}},
};
/** Lấy object tên trạng thái ngày theo ngôn ngữ hiện tại */
function getDayStatus(){return DAY_STATUS_I18N[userData.lang||'vi']||DAY_STATUS_I18N.vi;}

/** Mở panel chi tiết ngày: hiển thị ca, trạng thái, giờ vào/ra, ghi chú */
function openDayPanel(g, y, m) {
  const k = `${y}-${m}-${g}`;
  _dayKey = k;
  const rec = attData[k] || {};
  _daySelType = rec.type || null;

  // Title — dùng getLang() để lấy tên thứ theo ngôn ngữ hiện tại
  const now = new Date(y,m,g);
  const _tDP = getLang();
  const dayNames = _tDP.days || ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];
  // Từ "ngày" dịch theo ngôn ngữ: vi=ngày, en=date, ko=일, ja=日, zh=日, my=ရက်
  const _dayWord = {vi:'ngày',en:'',ko:'',ja:'',zh:'',my:'ရက်',th:'',id:'',ph:'',ne:'',hi:''}[userData.lang||'vi']||'';
  const _titleDate = _dayWord ? `${dayNames[now.getDay()]}, ${_dayWord} ${g}/${m+1}/${y}` : `${dayNames[now.getDay()]}, ${g}/${m+1}/${y}`;
  document.getElementById('dayPanelTitle').textContent = _titleDate;
  
  // Ca info — "Ca:" dịch theo ngôn ngữ
  const _caWord = {vi:'Ca',en:'Shift',ko:'교대',ja:'シフト',zh:'班',my:'ဆင်း',th:'กะ',id:'Shift',ph:'Shift',ne:'सिफ्ट',hi:'शिफ्ट'}[userData.lang||'vi']||'Ca';
  const _caMainName = {vi:'Ca hành chính',en:'Main shift',ko:'정규 근무',ja:'通常シフト',zh:'正常班',my:'ပုံမှန်ဆင်း',th:'กะปกติ',id:'Shift normal',ph:'Regular shift',ne:'नियमित सिफ्ट',hi:'नियमित शिफ्ट'}[userData.lang||'vi']||'Ca hành chính';
  const caEl = document.getElementById('dayPanelCa');
  if(userData.shifts >= 1) {
    caEl.textContent = `${_caWord}: ${_caMainName} (08:00 – 17:00)`;
    caEl.style.display = 'block';
    _dayCa = {vao:'08:00', ra:'17:00'};
  } else {
    caEl.style.display = 'none';
    _dayCa = null;
  }

  // Time inputs
  document.getElementById('dayTimeIn').value = rec.in || '';
  // Để trống nếu chưa có out thực tế — tránh ghi nhầm giờ mặc định vào attData khi user bấm Lưu
  document.getElementById('dayTimeOut').value = rec.out || '';
  
  // Note
  document.getElementById('dayNote').value = rec.note || '';
  if(typeof updateDayJobTypeUI==='function') updateDayJobTypeUI(rec);
  
  // Status grid
  renderDayStatusGrid();
  
  // Show panel
  document.getElementById('panelDay').classList.add('open');
}

/** Render 4 nút chọn trạng thái ngày (Có mặt/Nghỉ phép/Vắng/Làm lễ) */
function renderDayStatusGrid() {
  const types = ['cm','np','vang','ll'];
  const grid = document.getElementById('dayStatusGrid');
  const _dst=getDayStatus();
  grid.innerHTML = types.map(id => {
    const sel = _daySelType === id;
    return `<button onclick="selectDayType('${id}')" style="border:2px solid ${sel?TT_COLORS[id]:'var(--border)'};border-radius:14px;padding:14px 8px;text-align:center;cursor:pointer;background:${sel?TT_BG[id]:'white'};transition:all .15s;font-family:Nunito,sans-serif">
      <div style="font-size:22px;width:32px;height:32px;border-radius:50%;background:${sel?TT_COLORS[id]:'#F0F0F0'};display:flex;align-items:center;justify-content:center;margin:0 auto 6px;color:${sel?'white':TT_COLORS[id]};font-weight:900">${TT_ICON[id]}</div>
      <div style="font-size:12px;font-weight:800;color:${sel?TT_COLORS[id]:'var(--text)'}">${_dst[id].n}</div>
      <div style="font-size:10px;color:var(--text3);margin-top:2px;line-height:1.3">${_dst[id].s}</div>
    </button>`;
  }).join('');
  
  // Show time block only for cm or ll
  const showTime = _daySelType === 'cm' || _daySelType === 'll';
  document.getElementById('dayTimeBlock').style.display = showTime ? 'block' : 'none';
  dayCalcHours();
}

/** Chọn/bỏ chọn trạng thái ngày, cập nhật UI */
function selectDayType(id) {
  _daySelType = _daySelType === id ? null : id;
  renderDayStatusGrid();
}

/** Reset giờ vào/ra về mặc định của ca làm việc */
function dayResetTime() {
  if(_dayCa) {
    document.getElementById('dayTimeIn').value = _dayCa.vao;
    document.getElementById('dayTimeOut').value = _dayCa.ra;
    dayCalcHours();
  }
}

/** Tính số giờ và tăng ca khi người dùng nhập giờ vào/ra */
function dayCalcHours() {
  const inv = document.getElementById('dayTimeIn').value;
  const outv = document.getElementById('dayTimeOut').value;
  const el = document.getElementById('dayHoursSummary');
  if(inv && outv) {
    const dur = ((pGio(outv)-pGio(inv)+1440)%1440)/60;
    const gioCA = userData.hoursPerShift||8;
    const ot = Math.max(0,dur-gioCA);
    el.textContent = `Tổng: ${dur.toFixed(1)}h${ot>0?' | Tăng ca: +'+ot.toFixed(1)+'h':''}`;
    el.style.color = ot>0?'#F5A623':'var(--ac)';
  } else {
    el.textContent = '';
  }
}

function closeDayPanel() {
  document.getElementById('panelDay').classList.remove('open');
}

/** Lưu trạng thái + giờ + ghi chú cho ngày được chọn */
function saveDayPanel() {
  if(!_daySelType) {
    delete attData[_dayKey];
  } else {
    if(!attData[_dayKey]) attData[_dayKey] = {};
    attData[_dayKey].type = _daySelType;
    const inv = document.getElementById('dayTimeIn').value;
    const outv = document.getElementById('dayTimeOut').value;
    if((_daySelType==='cm'||_daySelType==='ll') && inv && outv) {
      attData[_dayKey].in = inv;
      attData[_dayKey].out = outv;
    } else {
      delete attData[_dayKey].in;
      delete attData[_dayKey].out;
    }
    const note = document.getElementById('dayNote').value.trim();
    if(note) attData[_dayKey].note = note;
    else delete attData[_dayKey].note;
    // Save sub job data (dual job model)
    if(userData.subJob && userData.subJob.active){
      const subIn  = document.getElementById('daySubTimeIn')?.value || '';
      const subOut = document.getElementById('daySubTimeOut')?.value || '';
      const subFields = document.getElementById('daySubFields');
      const subActive = subFields && subFields.style.display !== 'none';
      if(subActive && subIn){
        attData[_dayKey].sub = { type:'cm', in:subIn, out:subOut };
      } else {
        delete attData[_dayKey].sub;
      }
    }
  }
  saveAtt();
  closeDayPanel();
  renderCalBig();
  renderHomeStats();

  // ═══ GỬI NATIVE NOTIFICATION KHI CHẤM CÔNG THỦ CÔNG ═══
  if(window.ccNative && window.ccNative.sendNotification && _daySelType){
    const L = userData.lang || 'vi';
    const inv = document.getElementById('dayTimeIn')?.value || '';
    const outv = document.getElementById('dayTimeOut')?.value || '';
    if(_daySelType === 'cm' && inv){
      const titleMap = {
        vi:'📝 Đã ghi nhận chấm công', en:'📝 Attendance recorded', ko:'📝 출퇴근 기록됨',
        ja:'📝 打刻記録済み', zh:'📝 已记录考勤', th:'📝 บันทึกแล้ว',
        id:'📝 Absensi tercatat', my:'📝 မှတ်တမ်းတင်ပြီး', ph:'📝 Na-record na',
        ne:'📝 हाजिरी दर्ता भयो', hi:'📝 उपस्थिति दर्ज'
      };
      const bodyMap = {
        vi: outv ? `Vào: ${inv} — Ra: ${outv}` : `Vào ca: ${inv}`,
        en: outv ? `In: ${inv} — Out: ${outv}` : `Clock in: ${inv}`,
        ko: outv ? `출근: ${inv} — 퇴근: ${outv}` : `출근: ${inv}`,
        ja: outv ? `出勤: ${inv} — 退勤: ${outv}` : `出勤: ${inv}`,
        zh: outv ? `上班: ${inv} — 下班: ${outv}` : `上班: ${inv}`,
        hi: outv ? `प्रवेश: ${inv} — निकास: ${outv}` : `प्रवेश: ${inv}`
      };
      window.ccNative.sendNotification(
        titleMap[L] || titleMap.vi,
        bodyMap[L] || bodyMap.vi,
        1003
      );
    }
  }
}


/* ===== POPUP CHÀO BUỔI SÁNG ===== */
const TEN_THANG=['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
const cauGD1=[
"Hành trình vạn dặm bắt đầu từ một bước chân nhỏ.",
"Cần cù bù thông minh — tục ngữ Việt Nam.",
"Bắt đầu là đã thành công một nửa rồi!",
"Siêng năng là cha của may mắn.",
"Chăm chỉ hôm nay, thanh thản ngày mai.",
"Đầu xuôi đuôi lọt — bắt đầu tốt, cả tháng tốt!",
"Gieo hạt hôm nay, gặt quả ngày mai.",
"Mỗi ngày đến làm là thêm một viên gạch xây tương lai.",
"Không gì khó, chỉ cần có quyết tâm từ bước đầu.",
"Mưa dầm thấm lâu — chăm chỉ ắt thành công.",
"Người siêng năng sẽ đứng trên người lười biếng.",
"Thắng không kiêu, bại không nản — ngày đầu cứ bền.",
"Tháng mới — trang mới — năng lượng mới — tiến thôi!",
"Đã bắt đầu thì phải bền, bền thì mới thắng.",
"Mỗi buổi sáng là một cơ hội mới để thay đổi cuộc đời.",
"Người không làm thì không ăn — tục ngữ.",
"Ngày hôm nay bạn làm là nền móng cho thành công tháng này!"
];
const cauGD2=[
"Công mài sắt có ngày nên kim — tục ngữ.",
"Nước chảy đá mòn — bạn đang thắng từng ngày!",
"Không có gì khó, chỉ sợ lòng không bền — Hồ Chí Minh.",
"Sự xuất sắc không phải là hành động mà là thói quen — Aristotle.",
"Tài năng không bằng sự kiên trì — Calvin Coolidge.",
"Kiên trì và nhẫn nại là hai người thầy vĩ đại nhất — Dickens.",
"Người chăm chỉ thắng người thông minh mà lười biếng.",
"Một tuần làm đầy đủ — ví đã ấm hơn rồi đấy!",
"Thất bại là mẹ thành công — nhưng bạn đang thành công rồi!",
"Ai ơi đã quyết thì hành, đã đi thì đến, đã làm thì xong.",
"Bạn đang chứng minh mình không phải người bỏ cuộc!",
"Bền gan vững chí mới thành, dao cùn mài mãi cũng sắc đi.",
"Nửa tháng rồi — tiếp tục phát huy nhé!",
"Hãy nhớ lý do bạn bắt đầu — nó vẫn còn nguyên vẹn!",
"Bạn đang xây dựng thói quen kỷ luật — thứ quý giá nhất!",
"Chí lớn ai cũng có, khó ở chỗ giữ được lâu dài.",
"Giữa chặng đường là lúc thử thách — bạn đang vượt qua tốt lắm!"
];
const cauGD3=[
"Sắp về đích rồi — bứt tốc nào!",
"Cuối tháng là lúc thành quả được quy ra tiền!",
"Người dũng cảm vẫn tiến dù mệt — Nelson Mandela.",
"Nước về biển lớn — lương về túi ta!",
"Dẻo dai mới thắng, bền chí mới nên — tục ngữ.",
"Bạn đã đi quá xa để dừng lại bây giờ!",
"Thành công là tổng những nỗ lực nhỏ mỗi ngày — R.Collier.",
"Sắp ngày lương — mồ hôi hôm nay thành nụ cười ngày mai!",
"Người làm đến cùng mới nếm hương vị của thành công.",
"Khi mệt nhất, hãy nhớ: cuối tháng là tài khoản rạng rỡ!",
"Mỗi giờ làm những ngày cuối đều đang tính thêm tiền!",
"Bạn đã chứng minh sự kiên trì suốt tháng này — tuyệt vời!",
"Vài ngày nữa thôi — đừng để nước rút mà nhụt chí!",
"Kết thúc tháng trong vinh quang, tháng sau bắt đầu mạnh hơn!",
"Tự hào về bản thân đi — bạn xứng đáng được như vậy!",
"Bạn đã làm điều tuyệt vời tháng này — hãy tự hào lên!"
];

const quotesI18N={
  en:['Hard work beats talent when talent does not work hard.','Every day is a new opportunity.','Success is the sum of small efforts repeated daily.','The secret of getting ahead is getting started.'],
  ko:['오늘도 최선을 다하세요!','작은 노력이 쌓여 큰 성과를 만듭니다.','시작이 반입니다. 잘하고 있어요!','꾸준함이 재능을 이깁니다.'],
  ja:['継続は力なり。今日も頑張りましょう！','小さな努力が大きな成果を生みます。','始めることが最初の一歩です。'],
  zh:['坚持就是胜利，今天也要加油！','积少成多，每天进步一点点。','今天的努力是明天成果的种子。'],
  my:['ကြိုးစားမှုသည်အောင်မြင်မှု၏သော့ချက်','တစ်နေ့တစ်နေ့တိုးတက်မှု','ကြိုးပမ်းသမျှ ရလဒ်ရမည်'],
  th:['ก้าวแรกคือชัยชนะครึ่งหนึ่ง!','ขยันวันนี้ สบายวันหน้า','เดินทีละก้าว สำเร็จทีละวัน','เดือนใหม่ พลังใหม่ ไปเลย!','ความสำเร็จเริ่มต้นจากวันนี้'],
  id:['Langkah pertama adalah separuh keberhasilan!','Rajin pangkal pandai!','Setiap hari adalah kesempatan baru!','Bulan baru, semangat baru, ayo!','Kerja keras hari ini, panen esok!'],
  ph:['Ang unang hakbang ay kalahati ng tagumpay!','Ang kasipagan ay ina ng kapalaran!','Bawat araw ay bagong pagkakataon!','Bagong buwan, bagong lakas, go!','Patuloy lang, magaling ka!'],
  ne:['पहिलो कदम आधा सफलता हो!','मेहनत भाग्यको आमा हो!','हरेक दिन नयाँ अवसर हो!','नयाँ महिना, नयाँ शक्ति, जाऊ!','ढिलोस्तो भए पनि नरोकिनुस्'],
  hi:['पहला कदम आधी सफलता है!','मेहनत किस्मत की माँ है!','हर दिन एक नया अवसर है!','नया महीना, नई ऊर्जा, चलो!','लगे रहो, सफलता मिलेगी!'],
};

/** Hiển thị popup chào buổi sáng với thống kê tháng và câu động viên ngẫu nhiên */
function moSplash(){
  const now=new Date();
  const y=now.getFullYear(),m=now.getMonth();
  const nd=new Date(y,m,1).getDay();
  let tCM=0;
  for(let g=1;g<=now.getDate();g++){
    const thu=(nd+g-1)%7;
    if(thu===0||thu===6)continue;
    const rec=attData[y+'-'+m+'-'+g];
    if(rec&&(rec.type==='cm'||rec.type==='ll'))tCM++;
  }
  const isCL=false;
  const h=now.getHours();
  const L=userData.lang||'vi';
  const chaoMap={vi:h<12?'Chào buổi sáng':h<18?'Chào buổi chiều':'Chào buổi tối',en:h<12?'Good morning':h<18?'Good afternoon':'Good evening',ko:h<12?'좋은 아침이에요':h<18?'안녕하세요':'좋은 저녁이에요',ja:h<12?'おはようございます':h<18?'こんにちは':'こんばんは',zh:h<12?'早上好':h<18?'下午好':'晚上好',my:h<12?'မင်္ဂလာနံနက်ခင်း':h<18?'မင်္ဂလာနေ့ခင်း':'မင်္ဂလာညနေ',th:h<12?'สวัสดีตอนเช้า':h<18?'สวัสดีตอนบ่าย':'สวัสดีตอนเย็น',id:h<12?'Selamat pagi':h<18?'Selamat siang':'Selamat malam',ph:h<12?'Magandang umaga':h<18?'Magandang tanghali':'Magandang gabi',ne:h<12?'शुभ प्रभात':h<18?'शुभ अपरान्ह':'शुभ सन्ध्या',hi:h<12?'सुप्रभात':h<18?'शुभ दोपहर':'शुभ संध्या'};
  const chao=chaoMap[L]||chaoMap.vi;
  // dvMap → u('splash.days_present')
  // startMap → u('splash.start_btn')
  // Dùng userData.lang (ngôn ngữ đã lưu), KHÔNG dùng obLang (chỉ dành cho onboarding)
  const _mthLang = userData.lang||'vi';
  const _mths=(TRAN[_mthLang]||TRAN.vi).months||TEN_THANG;
  // Format tháng theo ngôn ngữ: zh/ja dùng "4月", ko dùng "4월", th dùng tên tháng, vi dùng "Tháng 4"
  const _mNum = m+1;
  const _mthName = _mths[m] || (
    ['zh','ja'].includes(_mthLang) ? `${_mNum}月` :
    _mthLang==='ko' ? `${_mNum}월` :
    `Tháng ${_mNum}`
  );
  const monthLbl = _mthName + ' · ' + y;
  const L2=userData.lang||'vi';
  const pool=L2!=='vi'&&quotesI18N[L2]?quotesI18N[L2]:(tCM<=7?cauGD1:tCM<=14?cauGD2:cauGD3);
  const cau=pool[Math.floor(Math.random()*pool.length)];

  // Fill splash content - with null guards
  const _s=(id,txt)=>{const el=document.getElementById(id);if(el)el.textContent=txt;};
  const _st=(id,prop,val)=>{const el=document.getElementById(id);if(el)el.style[prop]=val;};
  _s('spBadgeTxt',monthLbl);
  _s('spSo',String(tCM));
  _s('spDv',u('splash.days_present'));
  _s('spCau',chao+', '+(userData.name||'bạn')+'! '+cau);
  _s('spNut',u('splash.start_btn'));
  _st('spNut','background','var(--ac)');
  _st('spDot','background','var(--ac)');
  _st('spBadge','background','var(--ac-lt)');
  _st('spBadgeTxt','color','var(--ac2)');
  _st('spSo','color','var(--ac)');

  const p=document.getElementById('splashBox');
  p.style.animation='none';p.offsetHeight;p.style.animation='pop-in .38s cubic-bezier(.34,1.56,.64,1) both';
  document.getElementById('splashOv').className='splash-ov mo';
}

/** Đóng popup chào */
function dongSplash(){
  document.getElementById('splashOv').className='splash-ov';
}

