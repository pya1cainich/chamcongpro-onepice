/* ===== ONBOARDING - THIẾT LẬP LẦN ĐẦU ===== */
/** Render màn hình Onboarding theo trang hiện tại (obPage: 1-4) */
function renderOB(){
  const progress=document.getElementById('obProgress');
  const dots=progress.children;
  for(let i=0;i<4;i++){
    dots[i].className='ob-dot'+(i<obPage-1?' done':i===obPage-1?' active':'');
  }
  document.getElementById('obBtnBack').style.opacity=obPage===1?'0.3':'1';
  // Use lang selected in onboarding (obLang), fallback to TRAN.vi
  const t=TRAN[obLang]||TRAN.vi;
  // Update onboarding header with selected language
  const obAppNameEl=document.getElementById('obAppName');
  if(obAppNameEl)obAppNameEl.textContent=t.appName||'Chấm Công Pro';
  const obSkipEl=document.getElementById('obSkipBtn');
  if(obSkipEl)obSkipEl.textContent=({vi:'Bỏ qua',en:'Skip',ko:'건너뛰기',ja:'スキップ',zh:'跳过',my:'ကျော်',th:'ข้าม',id:'Lewati',ph:'Laktawan',ne:'छोड्नुस्',hi:'छोड़ें'}[obLang]||'Bỏ qua');
  const body=document.getElementById('obBody');
  const nextBtn=document.getElementById('obBtnNext');
  if(obPage===1){
    const [titleLine1,titleLine2]=(t.obLang||'Chào mừng! 👋\nChọn ngôn ngữ').split('\n');
    body.innerHTML=`
      <div class="ob-title">${titleLine1}<br>${titleLine2||''}</div>
      <div class="ob-sub">${t.obLangSub||''}</div>
      <div class="lang-grid" id="obLangGrid"></div>
      <div style="height:8px"></div>
      <div class="ob-title" style="font-size:20px;margin-top:8px">${t.obShiftCountry||'Quốc gia làm việc'}</div>
      <div class="country-grid" id="obCountryGrid"></div>
    `;
    renderLangGrid('obLangGrid',obLang,id=>{obLang=id;renderOB();});
    renderCountryGrid('obCountryGrid',obCountry,id=>{obCountry=id;renderOB();});
    if(nextBtn)nextBtn.textContent=(t.obNext||'Tiếp theo →');
  }else if(obPage===2){
    const _sj=userData.subJob||{};
    const _sjOn=!!_sj.active;
    const _sjMode=_sj.salaryMode||'hour';
    const _sjName=_sj.name||'';
    const _sjSal=_sjMode==='hour'?(_sj.salaryHour||''):_sjMode==='day'?(_sj.salaryDay||''):(_sj.salary||'');
    body.innerHTML=`
      <div class="ob-title">${t.obUser||'Thông tin của bạn 👤'}</div>
      <div class="ob-sub">${t.obUserSub||''}</div>
      <div class="field-group">
        <div>
          <div class="field-label">${t.obName||'Họ và tên'}</div>
          <input class="field-input" id="ob2Name" placeholder="${t.obNameP||'Nguyễn Văn A'}" value="${userData.name||''}">
        </div>
        <div>
          <div class="field-label">${t.obJob||'Chức vụ / Công việc'}</div>
          <input class="field-input" id="ob2Job" placeholder="${t.obJobP||'Nhân viên...'}" value="${userData.job||''}">
        </div>
        <div>
          <div class="field-label">${t.obCo||'Tên công ty'}</div>
          <input class="field-input" id="ob2Co" placeholder="${t.obCoP||'Công ty ABC'}" value="${userData.company||''}">
        </div>
      </div>
      <div style="background:linear-gradient(135deg,#f0ebff,#e8f4ff);border-radius:14px;padding:14px 16px;margin-top:14px;border:1.5px solid #c8b4f0">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div style="flex:1">
            <div style="font-size:13px;font-weight:800;color:#5a3e8e">💼 Có job phụ không?</div>
            <div style="font-size:11px;color:#7B5EA7;margin-top:2px">Freelance, part-time, làm thêm...</div>
          </div>
          <div id="obTogSubJob" onclick="ob_toggleSubJob()" style="width:48px;height:28px;border-radius:14px;background:${_sjOn?'#7B5EA7':'#ccc'};position:relative;cursor:pointer;flex-shrink:0;transition:background .3s;margin-left:12px">
            <div id="obTogSubKnob" style="width:22px;height:22px;border-radius:11px;background:white;position:absolute;top:3px;left:${_sjOn?'23':'3'}px;transition:left .3s;box-shadow:0 1px 4px rgba(0,0,0,.25)"></div>
          </div>
        </div>
        <div id="obSubJobFields" style="display:${_sjOn?'block':'none'};margin-top:14px;padding-top:14px;border-top:1px solid #c8b4f0">
          <div style="font-size:11px;font-weight:800;color:#5a3e8e;margin-bottom:6px">TÊN CÔNG VIỆC PHỤ</div>
          <input class="field-input" id="obSubJobName" placeholder="Freelance / Gia sư / Part-time..." value="${_sjName}" style="margin-bottom:14px">
          <div style="font-size:11px;font-weight:800;color:#5a3e8e;margin-bottom:8px">LƯƠNG JOB PHỤ</div>
          <div style="display:flex;gap:6px;margin-bottom:10px">
            <button id="obSubModeHour"  onclick="ob_selSubMode('hour')"  style="flex:1;padding:8px 4px;border-radius:10px;border:1.5px solid #c8b4f0;background:white;color:#7B5EA7;font-size:11px;font-weight:800;cursor:pointer;font-family:Nunito,sans-serif">⏱ / giờ</button>
            <button id="obSubModeDay"   onclick="ob_selSubMode('day')"   style="flex:1;padding:8px 4px;border-radius:10px;border:1.5px solid #c8b4f0;background:white;color:#7B5EA7;font-size:11px;font-weight:800;cursor:pointer;font-family:Nunito,sans-serif">📅 / ngày</button>
            <button id="obSubModeMonth" onclick="ob_selSubMode('month')" style="flex:1;padding:8px 4px;border-radius:10px;border:1.5px solid #c8b4f0;background:white;color:#7B5EA7;font-size:11px;font-weight:800;cursor:pointer;font-family:Nunito,sans-serif">🗓 / tháng</button>
          </div>
          <input class="field-input" id="obSubJobSalary" type="number" min="0" placeholder="0" value="${_sjSal}" style="margin-bottom:4px;border-color:#c8b4f0">
          <div style="font-size:11px;color:#7B5EA7;margin-top:2px" id="obSubSalaryHint"></div>
        </div>
      </div>
    `;
    if(nextBtn)nextBtn.textContent=(t.obNext||'Tiếp theo →');
    ob_selSubMode(_sjMode);
  }else if(obPage===3){
    body.innerHTML=`
      <div class="ob-title">${t.obShift||'Lịch làm việc ⏰'}</div>
      <div class="ob-sub">${t.obShiftSub||''}</div>
      <div class="field-label">${t.obShiftNum||'Số ca làm việc'}</div>
      <div class="num-grid" id="ob3ShiftGrid" style="margin-bottom:16px">
        <div class="num-btn${setupShifts===1?' sel':''}" onclick="selShift(1,this)">1</div>
        <div class="num-btn${setupShifts===2?' sel':''}" onclick="selShift(2,this)">2</div>
        <div class="num-btn${setupShifts===3?' sel':''}" onclick="selShift(3,this)">3</div>
        <div class="num-btn${setupShifts===4?' sel':''}" onclick="selShift(4,this)">4</div>
      </div>
      <div class="field-label">${t.obHours||'Số giờ mỗi ca'}</div>
      <div class="num-grid" style="grid-template-columns:repeat(5,1fr);margin-bottom:8px" id="ob3HoursGrid">
        <div class="num-btn${setupHours===6?' sel':''}" onclick="selHours(6,this)">6h</div>
        <div class="num-btn${setupHours===7?' sel':''}" onclick="selHours(7,this)">7h</div>
        <div class="num-btn${setupHours===8?' sel':''}" onclick="selHours(8,this)">8h</div>
        <div class="num-btn${setupHours===10?' sel':''}" onclick="selHours(10,this)">10h</div>
        <div class="num-btn${setupHours===12?' sel':''}" onclick="selHours(12,this)">12h</div>
      </div>
      <!-- ═══ ĐIỀU CHỈNH GIỜ TÙY CHỈNH ═══ -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;padding:10px 14px;background:#F0F6FF;border-radius:12px;border:1.5px dashed #2D7DD2">
        <span style="font-size:12px;font-weight:700;color:#1F4F8F;white-space:nowrap">⚙️ ${t.obHoursCustom||'Hoặc nhập:'}</span>
        <input id="ob3HoursCustom" type="number" min="1" max="24" step="0.5" value="${setupHours}" 
          oninput="selHoursCustom(this.value)" 
          style="flex:1;border:1.5px solid #C7DBF8;border-radius:8px;padding:8px 12px;font-size:14px;font-weight:700;color:#1F4F8F;background:white;outline:none;font-family:'Nunito',sans-serif;text-align:center">
        <span style="font-size:12px;font-weight:700;color:#1F4F8F">${t.obHoursUnit||'giờ/ca'}</span>
      </div>
    `;
    if(nextBtn)nextBtn.textContent=(t.obNext||'Tiếp theo →');
  }else if(obPage===4){
    const shifts=setupShifts;
    const defaultTimes=[{in:'06:00',out:'14:00'},{in:'14:00',out:'22:00'},{in:'22:00',out:'06:00'},{in:'00:00',out:'08:00'}];
    const nightLbl={vi:'Ca đêm',en:'Night shift',ko:'야간',ja:'夜勤',zh:'夜班',my:'ညဆင်း',th:'กะกลางคืน',id:'Shift malam',ph:'Night shift',ne:'रात पाली',hi:'रात शिफ्ट'}[obLang]||'Ca đêm';
    const shiftLbl={vi:'Ca',en:'Shift',ko:'교대',ja:'シフト',zh:'班',my:'ဆင်း',th:'กะ',id:'Shift',ph:'Shift',ne:'सिफ्ट',hi:'शिफ्ट'}[obLang]||'Ca';
    const inLbl=t.dpInTime||'Vào ca'; const outLbl=t.dpOutTime||'Hết ca';
    let shiftCards='';
    for(let i=0;i<shifts;i++){
      const ti=defaultTimes[i]||{in:'08:00',out:'17:00'};
      shiftCards+=`
        <div class="shift-card">
          <div class="shift-card-head">
            <div class="shift-label">${shiftLbl} ${i+1}</div>
            <div class="shift-night" style="${i>=2?'':'opacity:.4'}">🌙 ${nightLbl}</div>
          </div>
          <div class="time-row">
            <div><div class="field-label">${inLbl}</div><input class="time-inp" id="sIn${i}" type="time" value="${ti.in}"></div>
            <div class="time-sep">→</div>
            <div><div class="field-label">${outLbl}</div><input class="time-inp" id="sOut${i}" type="time" value="${ti.out}"></div>
          </div>
        </div>`;
    }
    const weekLbl=t.obWeeks||'Số tuần một vòng';
    const weekNames=['1','2','3','4'].map(w=>{
      const wLabels={vi:'tuần',en:'wk',ko:'주',ja:'週',zh:'周',my:'ပတ်',th:'สัปดาห์',id:'minggu',ph:'linggo',ne:'हप्ता',hi:'सप्ताह'};
      return w+' '+(wLabels[obLang]||'tuần');
    });
    // Câu hỏi nghỉ giữa giờ
    const breakLbl     = {vi:'Có nghỉ giữa giờ không?',en:'Any break time?',ko:'중간 휴식 있나요?',ja:'休憩時間ありますか？',zh:'有中途休息吗？',my:'အကြားနားချိန်ရှိပါသလား?',th:'มีเวลาพักไหม?',id:'Ada waktu istirahat?',ph:'May pahinga ba?',ne:'बिचमा विश्राम छ?',hi:'बीच में विराम है?'}[obLang]||'Có nghỉ giữa giờ không?';
    const breakNo      = {vi:'Không',en:'No',ko:'아니오',ja:'なし',zh:'没有',my:'မရှိ',th:'ไม่มี',id:'Tidak',ph:'Wala',ne:'छैन',hi:'नहीं'}[obLang]||'Không';
    const breakYes     = {vi:'Có',en:'Yes',ko:'예',ja:'あり',zh:'有',my:'ရှိ',th:'มี',id:'Ada',ph:'Mayroon',ne:'छ',hi:'हाँ'}[obLang]||'Có';
    const breakMinLbl  = {vi:'Số phút nghỉ',en:'Break minutes',ko:'휴식 분',ja:'休憩時間（分）',zh:'休息分钟',my:'အနားမိနစ်',th:'นาทีพัก',id:'Menit istirahat',ph:'Minutong pahinga',ne:'विश्राम मिनेट',hi:'विश्राम मिनट'}[obLang]||'Số phút nghỉ';

    // Câu hỏi tuần này làm ca nào (chỉ hiện khi >=2 ca)
    const curShiftLbl = {vi:'Tuần này bạn làm ca nào?',en:'Which shift this week?',ko:'이번 주 어느 교대?',ja:'今週はどのシフト？',zh:'本周哪个班次？',my:'ဒီအပတ် ဘယ်ဆင်း?',th:'สัปดาห์นี้กะอะไร?',id:'Shift minggu ini?',ph:'Anong shift ngayong linggo?',ne:'यो हप्ता कुन सिफ्ट?',hi:'इस सप्ताह कौन सी शिफ्ट?'}[obLang]||'Tuần này bạn làm ca nào?';
    const shiftLblShort = {vi:'Ca',en:'Shift',ko:'교대',ja:'シフト',zh:'班',my:'ဆင်း',th:'กะ',id:'Shift',ph:'Shift',ne:'सिफ्ट',hi:'शिफ्ट'}[obLang]||'Ca';
    let curShiftHtml = '';
    if(setupShifts >= 2){
      let btns = '';
      for(let i = 1; i <= setupShifts; i++){
        btns += `<div class="num-btn${i===1?' sel':''}" onclick="ob_setCurShift(${i},this)">${shiftLblShort} ${i}</div>`;
      }
      curShiftHtml = `
        <div class="field-label" style="margin-top:14px">${curShiftLbl}</div>
        <div class="num-grid" style="grid-template-columns:repeat(${Math.min(setupShifts,4)},1fr);margin-bottom:12px" id="obCurShiftGrid">
          ${btns}
        </div>`;
    }
    body.innerHTML=`
      <div class="ob-title">${t.obTime||'Giờ giấc ca làm 🕐'}</div>
      <div class="ob-sub">${t.obTimeSub||''}</div>
      <div class="field-label">${weekLbl}</div>
      <div class="week-grid" style="margin-bottom:16px" id="ob4WeekGrid">
        ${weekNames.map((w,i)=>`<div class="week-btn${i===0?' sel':''}" onclick="this.parentElement.querySelectorAll('.week-btn').forEach(b=>b.classList.remove('sel'));this.classList.add('sel')">${w}</div>`).join('')}
      </div>
      ${curShiftHtml}
      ${shiftCards}
      ${setupShifts >= 2 ? '<div id="ob4RotationBlock" style="margin-bottom:16px"></div>' : ''}
      <!-- Hỏi nghỉ giữa giờ -->
      <div class="field-label" style="margin-top:14px">${breakLbl}</div>
      <div class="num-grid" style="grid-template-columns:1fr 1fr;margin-bottom:12px" id="obBreakGrid">
        <div class="num-btn sel" id="obBrNo"  onclick="ob_setBreak(0,this)">${breakNo}</div>
        <div class="num-btn"     id="obBrYes" onclick="ob_setBreak(1,this)">${breakYes}</div>
      </div>
      <div id="obBreakMinBlock" style="display:none">
        <div class="field-label">${breakMinLbl}</div>
        <div class="num-grid" style="grid-template-columns:repeat(5,1fr);margin-bottom:8px" id="obBreakMinGrid">
          <div class="num-btn"     onclick="ob_setBreakMin(30,this)">30'</div>
          <div class="num-btn sel" onclick="ob_setBreakMin(60,this)">60'</div>
          <div class="num-btn"     onclick="ob_setBreakMin(75,this)">75'</div>
          <div class="num-btn"     onclick="ob_setBreakMin(90,this)">90'</div>
          <div class="num-btn"     onclick="ob_setBreakMin(120,this)">120'</div>
        </div>
      </div>
    `;
    if(nextBtn)nextBtn.textContent=(t.obStart||'Bắt đầu dùng app ✓');
    if(setupShifts >= 2) ob_renderRotation();
  }
  // Also update Back button
  const backBtn=document.getElementById('obBtnBack');
  if(backBtn)backBtn.textContent=(t.obBack||'←');
}

/** Hiển thị grid chọn ngôn ngữ (6 cờ) với callback khi chọn */
function renderLangGrid(elId,selLang,onSel){
  const el=document.getElementById(elId);if(!el)return;
  // Lưu callback vào window để onclick gọi trực tiếp, tránh toString() dễ vỡ
  window._langGridCb=onSel;
  el.innerHTML=LANGS.map(l=>`
    <div class="lang-item${l.id===selLang?' sel':''}" onclick="window._langGridCb('${l.id}')">
      <span class="flag">${l.flag}</span>
      <span class="lname">${l.name}</span>
    </div>`).join('');
}
/** Hiển thị grid chọn quốc gia làm việc với luật lương tương ứng */
function renderCountryGrid(elId,selC,onSel){
  const el=document.getElementById(elId);if(!el)return;
  // Lưu callback vào window để onclick gọi trực tiếp, tránh toString() dễ vỡ
  window._countryGridCb=onSel;
  el.innerHTML=COUNTRIES.map(c=>`
    <div class="country-item${c.id===selC?' sel':''}" onclick="window._countryGridCb('${c.id}')">
      <span class="cflag">${c.flag}</span>
      <div><div class="cname">${cLang(c.name)}</div><div class="crule">${cLang(c.rule)}</div></div>
    </div>`).join('');
}

/** Xử lý nút Tiếp theo: lưu dữ liệu trang hiện tại rồi chuyển sang trang sau */
function obNext(){
  if(obPage===1){
    userData.lang=obLang;userData.country=obCountry;syncLangCfg();
  }else if(obPage===2){
    const n=document.getElementById('ob2Name')?.value.trim();
    const j=document.getElementById('ob2Job')?.value.trim();
    const c=document.getElementById('ob2Co')?.value.trim();
    if(!n){alert(u('validate.empty_name'));return;}
    userData.name=n;userData.job=j;userData.company=c;
    // Lưu sub job data từ onboarding
    if(!userData.subJob) userData.subJob={active:false,name:'',salaryMode:'hour',salary:0,salaryDay:0,salaryHour:0};
    const _obSubName=document.getElementById('obSubJobName')?.value.trim()||'';
    const _obSubSalVal=parseFloat(document.getElementById('obSubJobSalary')?.value)||0;
    userData.subJob.name=_obSubName;
    const _obSubMode=userData.subJob.salaryMode||'hour';
    if(_obSubMode==='hour') userData.subJob.salaryHour=_obSubSalVal;
    else if(_obSubMode==='day') userData.subJob.salaryDay=_obSubSalVal;
    else userData.subJob.salary=_obSubSalVal;
  }else if(obPage===3){
    userData.shifts=setupShifts;userData.hoursPerShift=setupHours;
  }else if(obPage===4){
    // Lưu cài đặt nghỉ giữa giờ từ bước 4
    userData.hasBreak     = (typeof _obBreak !== 'undefined') ? _obBreak === 1 : false;
    userData.breakMinutes = userData.hasBreak ? (_obBreakMin || 60) : 0;
    // Lưu số tuần một vòng từ ô đã chọn
    const wkSel = document.querySelector('#ob4WeekGrid .week-btn.sel');
    if(wkSel){
      const idx = Array.from(wkSel.parentElement.children).indexOf(wkSel);
      userData.weeksPerCycle = idx + 1;
    }
    // Lưu tuần này đang làm ca nào (chỉ có ý nghĩa khi >=2 ca)
    userData.currentShift = setupShifts >= 2 ? (_obCurShift || 1) : 1;
    // ═══ LƯU GIỜ VÀO/RA CỦA TỪNG CA ═══
    const shiftTimes = [];
    for(let i = 0; i < setupShifts; i++){
      const inEl = document.getElementById('sIn'+i);
      const outEl = document.getElementById('sOut'+i);
      shiftTimes.push({
        in:  inEl  ? inEl.value  : '08:00',
        out: outEl ? outEl.value : '17:00'
      });
    }
    userData.shiftTimes = shiftTimes;
    saveUser();
    goScreen('screenHome');
    initHome();
    applyI18n();
    setTimeout(moSplash, 600);
    return;
  }
  obPage=Math.min(4,obPage+1);
  renderOB();
}
/** Quay lại trang trước trong Onboarding */
function obBack(){
  if(obPage===1)return;
  obPage=Math.max(1,obPage-1);
  renderOB();
}
/** Bỏ qua Onboarding, dùng tên mặc định và vào thẳng Trang chủ */
function skipOB(){
  userData.name=u('user.default_name');userData.job=u('user.default_job');
  saveUser();goScreen('screenHome');initHome();
}

/** Chọn số ca (1-4) */
/** Chọn số ca (1-4) — đồng thời hiện/ẩn ô "Tuần này làm ca nào" trong Setup */
function selShift(n,el){
  setupShifts=n;
  selNumBtn(el);
  // Re-render ô "Tuần này làm ca nào" trong panel Setup
  if(typeof renderSetupCurShift === 'function') renderSetupCurShift();
  // Re-render shift cards (giờ vào/ra cho từng ca) trong panel Setup
  if(typeof renderSetupShiftCards === 'function') renderSetupShiftCards();
  // Re-render rotation pattern khi đổi số ca
  if(typeof renderShiftRotationSection === 'function') renderShiftRotationSection();
}

