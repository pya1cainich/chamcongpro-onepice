/* ===== Onboarding step 4: nghỉ giữa giờ ===== */
let _obBreak = 0;       // 0 = không, 1 = có
let _obBreakMin = 60;   // số phút nghỉ mặc định
let _obCurShift = 1;    // tuần này đang làm ca số mấy (1-based, mặc định Ca 1)

/** Người dùng chọn Có/Không có nghỉ giữa giờ trong onboarding */
function ob_setBreak(v, el){
  _obBreak = v;
  document.querySelectorAll('#obBreakGrid .num-btn').forEach(b => b.classList.remove('sel'));
  if(el) el.classList.add('sel');
  const blk = document.getElementById('obBreakMinBlock');
  if(blk) blk.style.display = v === 1 ? '' : 'none';
}

/** Người dùng chọn số phút nghỉ trong onboarding */
function ob_setBreakMin(min, el){
  _obBreakMin = min;
  document.querySelectorAll('#obBreakMinGrid .num-btn').forEach(b => b.classList.remove('sel'));
  if(el) el.classList.add('sel');
}

/** Người dùng chọn tuần này đang làm ca số mấy (cho ca xoay) */
function ob_setCurShift(n, el){
  _obCurShift = n;
  document.querySelectorAll('#obCurShiftGrid .num-btn').forEach(b => b.classList.remove('sel'));
  if(el) el.classList.add('sel');
}

/** Bật/tắt job phụ trong onboarding (dùng IDs riêng obTogSubJob/obSubJobFields) */
function ob_toggleSubJob(){
  if(!userData.subJob) userData.subJob={active:false,name:'',salaryMode:'hour',salary:0,salaryDay:0,salaryHour:0};
  const isOn=!userData.subJob.active;
  userData.subJob.active=isOn;
  const tog=document.getElementById('obTogSubJob');
  const knob=document.getElementById('obTogSubKnob');
  const fields=document.getElementById('obSubJobFields');
  if(tog) tog.style.background=isOn?'#7B5EA7':'#ccc';
  if(knob) knob.style.left=isOn?'23px':'3px';
  if(fields) fields.style.display=isOn?'block':'none';
}

/** Chọn chế độ tính lương job phụ trong onboarding */
function ob_selSubMode(mode){
  if(!userData.subJob) userData.subJob={active:false,name:'',salaryMode:'hour',salary:0,salaryDay:0,salaryHour:0};
  userData.subJob.salaryMode=mode;
  ['hour','day','month'].forEach(m=>{
    const btn=document.getElementById('obSubMode'+m.charAt(0).toUpperCase()+m.slice(1));
    if(!btn) return;
    const active=m===mode;
    btn.style.background=active?'#7B5EA7':'white';
    btn.style.color=active?'white':'#7B5EA7';
    btn.style.borderColor=active?'#7B5EA7':'#c8b4f0';
  });
  const hint=document.getElementById('obSubSalaryHint');
  const L=obLang||userData.lang||'vi';
  const hints={
    hour:{vi:'Nhập lương theo giờ — tự tính theo số giờ làm thực tế',en:'Enter hourly rate — auto calculated from actual hours',ko:'시간급 입력 — 실제 근무시간 기준 자동 계산',ja:'時給を入力 — 実働時間で自動計算',zh:'输入时薪 — 按实际工时自动计算',my:'နာရီလစာ — အမှန်တကယ်နာရီအလိုက် တွက်ချက်',th:'ใส่ค่าจ้างต่อชั่วโมง — คำนวณตามชั่วโมงจริง',id:'Masukkan tarif per jam — dihitung dari jam aktual',ph:'Ilagay ang hourly rate — awtomatikong kokompyutin',ne:'घण्टाको दर राख्नुहोस् — वास्तविक घण्टाबाट गणना',hi:'प्रति घंटा दर डालें — वास्तविक घंटों से गणना'},
    day: {vi:'Nhập lương theo ngày công thực tế',en:'Enter daily rate',ko:'실제 근무일 기준 일급 입력',ja:'実勤務日数に基づく日給を入力',zh:'输入实际工作日的日薪',my:'အမှန်တကယ်အလုပ်ရက်အလိုက် နေ့စားလစာ ထည့်ပါ',th:'ใส่ค่าจ้างรายวันตามวันทำงานจริง',id:'Masukkan upah harian berdasarkan hari kerja aktual',ph:'Ilagay ang daily rate batay sa araw na nagtrabaho',ne:'वास्तविक काम दिन अनुसार दैनिक दर राख्नुहोस्',hi:'वास्तविक कार्य दिवस के अनुसार दैनिक दर डालें'},
    month:{vi:'Nhập lương tháng cố định cho job này',en:'Enter fixed monthly salary for this job',ko:'이 작업의 고정 월급 입력',ja:'この仕事の固定月給を入力',zh:'输入此工作的固定月薪',my:'ဤအလုပ်အတွက် လစဉ်လစာ ထည့်ပါ',th:'ใส่เงินเดือนคงที่ของงานนี้',id:'Masukkan gaji bulanan tetap untuk pekerjaan ini',ph:'Ilagay ang fixed monthly salary ng trabahong ito',ne:'यो कामको स्थिर मासिक तलब राख्नुहोस्',hi:'इस नौकरी का निश्चित मासिक वेतन डालें'},
  };
  if(hint) hint.textContent=(hints[mode]||hints.hour)[L]||(hints[mode]||hints.hour).en||'';
}

/** Render section "Lịch xoay ca tự động" trong bước 4 onboarding */
function ob_renderRotation(){
  const block=document.getElementById('ob4RotationBlock');
  if(!block) return;
  const shifts=setupShifts||userData.shifts||1;
  if(shifts<2){block.style.display='none';return;}
  const L=obLang||userData.lang||'vi';
  const enabled=!!userData.shiftRotationEnabled;
  const cycleWeeks=Math.max(1,Math.min(8,Number(userData.weeksPerCycle)||shifts));
  let rotation=Array.isArray(userData.shiftRotation)?userData.shiftRotation.slice():[];
  while(rotation.length<cycleWeeks) rotation.push((rotation.length%shifts)+1);
  if(rotation.length>cycleWeeks) rotation=rotation.slice(0,cycleWeeks);
  rotation=rotation.map(n=>Math.max(1,Math.min(shifts,Number(n)||1)));
  const titleTxt={vi:'🔄 Lịch xoay ca tự động',en:'🔄 Auto shift rotation',ko:'🔄 자동 교대 순환',ja:'🔄 自動シフトローテーション',zh:'🔄 自动轮班',my:'🔄 အလိုအလျောက် ဆင်းအလှည့်',th:'🔄 หมุนกะอัตโนมัติ',id:'🔄 Rotasi shift otomatis',ph:'🔄 Auto shift rotation',ne:'🔄 स्वतः सिफ्ट परिवर्तन',hi:'🔄 स्वतः शिफ्ट रोटेशन'}[L]||'🔄 Lịch xoay ca tự động';
  const hintTxt={vi:'App tự đổi ca theo lịch tuần. Tắt nếu muốn chọn ca thủ công.',en:'App auto-switches shift every week. Turn off to choose manually.',ko:'매주 자동으로 교대를 변경합니다.',ja:'毎週シフトを自動切替。手動選択はオフに。',zh:'每周自动切换班次。手动选择请关闭。',my:'အပတ်တိုင်း အလိုအလျောက် ဆင်းပြောင်းသည်။',th:'แอปเปลี่ยนกะอัตโนมัติทุกสัปดาห์',id:'Aplikasi otomatis ganti shift tiap minggu',ph:'Awtomatikong magpapalit ng shift kada linggo',ne:'हरेक हप्ता सिफ्ट स्वतः परिवर्तन हुन्छ',hi:'हर सप्ताह शिफ्ट स्वतः बदलेगी'}[L]||'';
  const weekLbl={vi:'Tuần',en:'Week',ko:'주',ja:'週',zh:'第',my:'အပတ်',th:'สัปดาห์',id:'Minggu',ph:'Linggo',ne:'हप्ता',hi:'सप्ताह'}[L]||'Tuần';
  const shiftLbl={vi:'Ca',en:'Shift',ko:'교대',ja:'シフト',zh:'班',my:'ဆင်း',th:'กะ',id:'Shift',ph:'Shift',ne:'सिफ्ट',hi:'शिफ्ट'}[L]||'Ca';
  let weeksHtml='';
  for(let w=0;w<cycleWeeks;w++){
    let opts='';
    for(let s=1;s<=shifts;s++){
      const lbl=getShiftLabel(s);
      const sel=(rotation[w]===s)?' selected':'';
      opts+=`<option value="${s}"${sel}>${shiftLbl} ${s} — ${lbl}</option>`;
    }
    weeksHtml+=`
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <span style="flex:0 0 70px;font-size:13px;font-weight:700;color:var(--text2)">${weekLbl} ${w+1}</span>
        <select onchange="ob_rotationWeekChange(${w},this.value)" ${enabled?'':'disabled'}
                style="flex:1;border:1.5px solid var(--border);border-radius:8px;padding:8px 10px;font-size:13px;font-weight:600;font-family:Nunito,sans-serif;color:var(--text);background:white;outline:none;${enabled?'':'opacity:.5'}">${opts}</select>
      </div>`;
  }
  block.innerHTML=`
    <div style="background:#F4FBFF;border-radius:12px;padding:12px;border:1px solid #C7DBF8">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        <div style="font-size:13px;font-weight:800;color:#1F4F8F">${titleTxt}</div>
        <button class="toggle-sw${enabled?' on':''}" onclick="ob_toggleRotation(this)"></button>
      </div>
      <div style="font-size:11px;color:var(--text3);line-height:1.4;margin-bottom:10px">${hintTxt}</div>
      ${weeksHtml}
    </div>`;
}

/** Bật/tắt lịch xoay ca trong onboarding */
function ob_toggleRotation(btn){
  userData.shiftRotationEnabled=!userData.shiftRotationEnabled;
  saveUser();
  ob_renderRotation();
}

/** User đổi ca cho 1 tuần trong lịch xoay (onboarding) */
function ob_rotationWeekChange(weekIdx,shiftNum){
  if(!userData.shiftRotation) userData.shiftRotation=[];
  const n=Math.max(1,Math.min(userData.shifts||setupShifts||1,Number(shiftNum)));
  userData.shiftRotation[weekIdx]=n;
  const cycleWeeks=Math.max(1,userData.weeksPerCycle||(userData.shifts||setupShifts||1));
  userData.shiftRotation=userData.shiftRotation.slice(0,cycleWeeks);
  saveUser();
}

/** Chọn số tuần một vòng (cho ca xoay) */
let setupWeeks = 1;
function selWeeks(n,el){
  setupWeeks=n;
  userData.weeksPerCycle=n;
  selNumBtn(el);
  saveUser();
  // Re-render rotation section vì số tuần chu kỳ vừa đổi
  if(typeof renderShiftRotationSection === 'function') renderShiftRotationSection();
}

/** Có nghỉ giữa giờ hay không (0 = không, 1 = có) */
let setupHasBreak = 0;
function selBreak(v,el){
  setupHasBreak = v;
  userData.hasBreak = v === 1;
  selNumBtn(el);
  const blk = document.getElementById('breakMinutesBlock');
  if(blk) blk.style.display = v === 1 ? '' : 'none';
  if(v === 0) userData.breakMinutes = 0;
  saveUser();
}

/** Số phút nghỉ giữa giờ — sẽ trừ vào giờ làm thực tế khi tính lương/giờ */
let setupBreakMin = 60;
function selBreakMin(min,el){
  setupBreakMin = min;
  userData.breakMinutes = min;
  selNumBtn(el);
  saveUser();
}

/** Chọn ngày công chuẩn tháng */
function selNgc(n,el){ngcVal=n;userData.ngc=n;selNumBtn(el);}

