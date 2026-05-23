/* ── checkin.js ── */
/* ════════════════════════════════════════════════════════════════════
   checkin.js — CHẤM CÔNG THỦ CÔNG & TỰ ĐỘNG GPS
   Load SAU app.js (cần: userData, attData, renderHomeStats, u(), lsGet/lsSet)

   📌 Chỉnh sửa:
   ┌─────────────────────────────────────────────────────────────┐
   │ Thay đổi thời gian xác nhận GPS mặc định:                  │
   │   _gpsData.checkinMin  = 20  (phút chờ xác nhận VÀO ca)    │
   │   _gpsData.checkoutMin = 80  (phút chờ xác nhận HẾT ca)    │
   │ Thay đổi bán kính GPS tối thiểu:                           │
   │   Slider HTML: min="25" max="500" step="25"                 │
   │ Thay đổi thông báo GPS (banner):                           │
   │   UI_STR['gps.active'], UI_STR['gps.saved'] trong app.js   │
   └─────────────────────────────────────────────────────────────┘

   ════════════════════════════════════════════════════════════════════ */

/* ===== CHẤM CÔNG THỦ CÔNG ===== */
/* [LEGACY_ATTENDANCE_MANUAL]
   Ghi chu: day la logic cham cong thu cong cu cho nut Vao/Ra ca
   va popup chon job. Khong xoa khi sua GPS/native vi nhieu man hinh
   van ghi truc tiep vao attData thong qua cac ham ben duoi.
*/
/** Tạo key cho ngày hôm nay theo format 'YYYY-M-D' để lưu attData */
function todayKey(){const n=new Date();return`${n.getFullYear()}-${n.getMonth()}-${n.getDate()}`;}
function fmtTime(d){return`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;}

function _attJobLabel(job){
  if(job === 'sub') return (userData.subJob && userData.subJob.name) || (typeof u === 'function' ? u('job.sub') : 'Job phụ');
  return typeof u === 'function' ? u('job.main') : 'Công việc chính';
}

function _attEditNoticeText(action, job, time){
  const L = (userData && userData.lang) || 'vi';
  const dict = {
    vi:'Đã chấm công mốc này rồi. Hãy vào Lịch chấm công để sửa.',
    en:'This attendance time is already recorded. Edit it in Attendance Calendar.',
    ko:'이 출퇴근 기록은 이미 저장되었습니다. 근태 달력에서 수정하세요.',
    ja:'この打刻はすでに記録されています。勤怠カレンダーで修正してください。',
    zh:'此打卡时间已记录。请到考勤日历中修改。',
    my:'ဤအချိန်ကို မှတ်တမ်းတင်ပြီးပါပြီ။ ပြင်ရန် Attendance Calendar သို့ သွားပါ။',
    th:'บันทึกเวลานี้แล้ว กรุณาแก้ไขในปฏิทินลงเวลา',
    id:'Waktu absensi ini sudah tercatat. Ubah melalui Kalender Absensi.',
    ph:'Naitala na ang oras na ito. I-edit sa Attendance Calendar.',
    ne:'यो हाजिरी समय पहिले नै रेकर्ड भएको छ। Attendance Calendar मा गएर सच्याउनुहोस्।',
    hi:'यह उपस्थिति समय पहले ही दर्ज है। Attendance Calendar में जाकर संशोधित करें।'
  };
  const label = _attJobLabel(job);
  const kind = action === 'out' ? 'OUT' : 'IN';
  return `${label} ${kind}${time ? ' ' + time : ''}: ${dict[L] || dict.vi}`;
}

function showAttendanceEditNotice(action, job, time){
  let banner = document.getElementById('attendanceEditNotice');
  if(!banner){
    banner = document.createElement('div');
    banner.id = 'attendanceEditNotice';
    banner.style.cssText = 'position:fixed;top:12px;left:50%;transform:translateX(-50%);'
      + 'z-index:30000;width:calc(100% - 28px);max-width:380px;padding:13px 16px;'
      + 'border-radius:14px;background:#1A2332;color:white;font-size:13px;font-weight:800;'
      + 'font-family:Nunito,sans-serif;line-height:1.35;text-align:center;'
      + 'box-shadow:0 12px 32px rgba(0,0,0,.32);transition:opacity .25s, transform .25s;'
      + 'pointer-events:auto';
    banner.onclick = () => { banner.style.opacity = '0'; };
    document.body.appendChild(banner);
  }
  banner.textContent = _attEditNoticeText(action, job, time);
  banner.style.opacity = '1';
  banner.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(banner._timer);
  banner._timer = setTimeout(() => { banner.style.opacity = '0'; }, 4200);
  if(navigator.vibrate) navigator.vibrate(35);
}

function _attendanceRec(job){
  const day = attData[todayKey()];
  return job === 'sub' ? day && day.sub : day;
}

function _blockIfAttendanceExists(action, job){
  const rec = _attendanceRec(job);
  if(rec && rec[action]){
    showAttendanceEditNotice(action, job, rec[action]);
    return true;
  }
  return false;
}

/** Bấm VÀO CA: ghi nhận giờ vào, cập nhật UI và stats */
function doCheckin(){
  const hasSub = userData.subJob && userData.subJob.active;
  if(hasSub){
    showJobPicker('in');
  } else {
    _doCheckinMain();
  }
}
function doCheckout(){
  const hasSub = userData.subJob && userData.subJob.active;
  if(hasSub){
    showJobPicker('out');
  } else {
    _doCheckoutMain();
  }
}

/** Thực hiện chấm VÀO ca job chính */
function _doCheckinMain(){
  if(typeof gpsEnsureCycleForCheckin === 'function'){
    var guardMain = gpsEnsureCycleForCheckin('main', { source: 'manual', allowConfirm: true, showBanner: true });
    if(!guardMain || !guardMain.allowed) return;
  }
  if(_blockIfAttendanceExists('in', 'main')) return;
  const k=todayKey();
  const t=fmtTime(new Date());
  if(!attData[k])attData[k]={type:'cm'};
  attData[k].in=t;attData[k].type='cm';
  saveAtt();
  addRipple('rippleIn');
  document.getElementById('lastIn').textContent=_lbl_in(t);
  if(typeof updateTodayStatusTime === 'function') updateTodayStatusTime();
  renderHomeStats();
  // Schedule 22-hour reminder notification for unchecked checkout
  if(typeof _sa22HourReminderSchedule === 'function') _sa22HourReminderSchedule('main');
}
/** Thực hiện chấm HẾT ca job chính */
function _doCheckoutMain(){
  if(_blockIfAttendanceExists('out', 'main')) return;
  const k=todayKey();
  const t=fmtTime(new Date());
  if(!attData[k])attData[k]={type:'cm'};
  attData[k].out=t;
  saveAtt();
  addRipple('rippleOut');
  document.getElementById('lastOut').textContent=_lbl_out(t);
  if(typeof updateTodayStatusTime === 'function') updateTodayStatusTime();
  renderHomeStats();
  // Cancel 22-hour reminder notification when checkout
  if(typeof _sa22HourReminderCancel === 'function') _sa22HourReminderCancel('main');
}
/** Thực hiện chấm VÀO ca job phụ */
function _doCheckinSub(){
  if(typeof gpsEnsureCycleForCheckin === 'function'){
    var guardSub = gpsEnsureCycleForCheckin('sub', { source: 'manual', allowConfirm: true, showBanner: true });
    if(!guardSub || !guardSub.allowed) return;
  }
  if(_blockIfAttendanceExists('in', 'sub')) return;
  const k=todayKey();
  const t=fmtTime(new Date());
  if(!attData[k])attData[k]={type:'cm'};
  if(!attData[k].sub) attData[k].sub={type:'cm'};
  attData[k].sub.in=t; attData[k].sub.type='cm';
  saveAtt();
  addRipple('rippleIn');
  const subName = userData.subJob?.name || u('job.sub');
  document.getElementById('lastIn').textContent='💼 '+subName+' '+t;
  if(typeof updateTodayStatusTime === 'function') updateTodayStatusTime();
  renderHomeStats();
  // Schedule 22-hour reminder notification for unchecked checkout
  if(typeof _sa22HourReminderSchedule === 'function') _sa22HourReminderSchedule('sub');
}
/** Thực hiện chấm HẾT ca job phụ */
function _doCheckoutSub(){
  if(_blockIfAttendanceExists('out', 'sub')) return;
  const k=todayKey();
  const t=fmtTime(new Date());
  if(!attData[k])attData[k]={type:'cm'};
  if(!attData[k].sub) attData[k].sub={type:'cm'};
  attData[k].sub.out=t;
  saveAtt();
  addRipple('rippleOut');
  const subName = userData.subJob?.name || u('job.sub');
  document.getElementById('lastOut').textContent='💼 '+subName+' '+t;
  if(typeof updateTodayStatusTime === 'function') updateTodayStatusTime();
  renderHomeStats();
  // Cancel 22-hour reminder notification when checkout
  if(typeof _sa22HourReminderCancel === 'function') _sa22HourReminderCancel('sub');
}

/** Hiện popup chọn Job chính / Job phụ trước khi chấm công */
function showJobPicker(action){
  // action = 'in' hoặc 'out'
  const subName = userData.subJob?.name || u('job.sub');
  const isIn = action === 'in';
  const titleText = isIn ? u('home.in_at').replace(/\s*$/,'') : u('home.out_at').replace(/\s*$/,'');

  // Tạo overlay popup
  let ov = document.getElementById('jobPickerOv');
  if(ov) ov.remove();
  ov = document.createElement('div');
  ov.id = 'jobPickerOv';
  ov.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s';
  ov.onclick = e => { if(e.target===ov) ov.remove(); };

  const box = document.createElement('div');
  box.style.cssText = 'background:white;border-radius:20px;padding:24px 20px;width:90%;max-width:340px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.3)';
  box.innerHTML = `
    <div style="font-size:16px;font-weight:800;color:var(--text);margin-bottom:6px">${titleText}</div>
    <div style="font-size:12px;color:var(--text3);margin-bottom:20px">Chọn công việc bạn đang ${isIn?'bắt đầu':'kết thúc'}</div>
    <div style="display:flex;gap:12px">
      <button id="jpMain" style="flex:1;padding:16px 10px;border-radius:14px;border:2px solid var(--ac);background:linear-gradient(135deg,var(--ac),#40E0D0);color:white;font-size:14px;font-weight:800;cursor:pointer;font-family:Nunito,sans-serif;display:flex;flex-direction:column;align-items:center;gap:6px">
        <span style="font-size:28px">🏢</span>
        <span>${u('job.main')}</span>
      </button>
      <button id="jpSub" style="flex:1;padding:16px 10px;border-radius:14px;border:2px solid #7B5EA7;background:linear-gradient(135deg,#7B5EA7,#9B6FC0);color:white;font-size:14px;font-weight:800;cursor:pointer;font-family:Nunito,sans-serif;display:flex;flex-direction:column;align-items:center;gap:6px">
        <span style="font-size:28px">💼</span>
        <span>${subName}</span>
      </button>
    </div>
    <button onclick="document.getElementById('jobPickerOv').remove()" style="margin-top:14px;padding:10px;border:none;background:none;color:var(--text3);font-size:13px;cursor:pointer;font-family:Nunito,sans-serif">Hủy</button>
  `;
  ov.appendChild(box);
  document.body.appendChild(ov);

  // Wire button actions
  box.querySelector('#jpMain').onclick = () => {
    ov.remove();
    if(isIn) _doCheckinMain(); else _doCheckoutMain();
  };
  box.querySelector('#jpSub').onclick = () => {
    ov.remove();
    if(isIn) _doCheckinSub(); else _doCheckoutSub();
  };
}
function timeToMin(s){const[h,m]=s.split(':').map(Number);return h*60+m;}
/** Trả về chuỗi "Vào lúc HH:MM" theo ngôn ngữ hiện tại */
function _lbl_in(t){return u('home.in_at')+t;}
/** Trả về chuỗi "Ra lúc HH:MM" theo ngôn ngữ hiện tại */
function _lbl_out(t){return u('home.out_at')+t;}
/** Trả về chuỗi "✓ Vào ca HH:MM" theo ngôn ngữ hiện tại */
function _lbl_status_in(t){return u('home.status_in')+t;}
/** Trả về chuỗi "⏱ X.Xh làm việc" theo ngôn ngữ hiện tại */
function _lbl_hours(h){return '⏱ '+h+u('home.h_worked');}
/** Tạo hiệu ứng gợn sóng (ripple) khi bấm nút chấm công */
function addRipple(id){
  const el=document.getElementById(id);
  if(!el)return;
  const c=document.createElement('div');
  c.className='ripple-circle';
  el.appendChild(c);
  setTimeout(()=>c.remove(),700);
}

/* ===== THỐNG KÊ TRANG CHỦ ===== */
/** Khởi tạo màn Trang chủ: cập nhật tên, ảnh, theme, stats */
function initHome(){
  applyI18n();
  document.getElementById('homeUname').textContent=userData.name||u('user.default_name');
  document.getElementById('homeUjob').textContent=(userData.job||u('user.default_job'))+(userData.company?` · ${userData.company}`:'');
  if(apCfg.avtB64){
    document.getElementById('homeAvt').innerHTML=`<img src="${apCfg.avtB64}">`;
  }
  applyTheme(apCfg.color||0);
  applyCalColors();
  renderHomeStats();
  updateClock();
  // restore today status
  const k=todayKey();
  if(attData[k]){
    if(attData[k].in)document.getElementById('lastIn').textContent=_lbl_in(attData[k].in);
    if(attData[k].out)document.getElementById('lastOut').textContent=_lbl_out(attData[k].out);
  }
  if(typeof updateTodayStatusTime === 'function') updateTodayStatusTime();
  // salary
  if(userData.salary){
    document.getElementById('salaryInput').value=userData.salary;
    calcSalary();
  }
}

/** Tính và hiển thị thống kê tháng: giờ làm, có mặt/vắng/nghỉ phép, thang đo mức làm việc */
function renderHomeStats(){
  const _tl=getLang();
  const now=new Date();
  const y=now.getFullYear(),m=now.getMonth();
  let cm=0,v=0,np=0,totalH=0;
  const daysInMonth=new Date(y,m+1,0).getDate();
  for(let d=1;d<=daysInMonth;d++){
    const k=`${y}-${m}-${d}`;
    const rec=attData[k];
    if(!rec)continue;
    if(rec.type==='cm')cm++;
    else if(rec.type==='vang')v++;
    else if(rec.type==='np')np++;
    if(rec.in&&rec.out){
      const h=soGio(rec.in,rec.out)||0;
      totalH+=h;
    }else if(rec.type==='cm'){
      totalH+=userData.hoursPerShift||8;
    }
  }
  const ot=Math.max(0,totalH-176);
  document.getElementById('statCM').textContent=cm;
  document.getElementById('statV').textContent=v;
  document.getElementById('statNP').textContent=np;
  document.getElementById('statOT').textContent=ot>0?`${ot.toFixed(0)}h`:'0h';
  // meter
  document.getElementById('meterHours').textContent=`${totalH.toFixed(0)}h`;
  const maxH=260;
  const pct=Math.min(100,totalH/maxH*100);
  const fill=document.getElementById('meterFill');
  let fillColor='linear-gradient(90deg,#0D9E75,#40E0D0)';
  let badgeTxt=_tl.binhThuong||'Bình thường',badgeBg='#E0F5EE',badgeFg='#0a7d5c';
  if(totalH>220){fillColor='linear-gradient(90deg,#0D9E75,#F5A623,#E8433A)';badgeTxt=_tl.quaSuc||'Quá sức 🔥';badgeBg='#FFF0EF';badgeFg='#E8433A';}
  else if(totalH>176){fillColor='linear-gradient(90deg,#0D9E75,#F5A623)';badgeTxt=_tl.chamChi||'Chăm chỉ ⚡';badgeBg='#FFF8E8';badgeFg='#cc8800';}
  fill.style.width=`${Math.max(2,pct)}%`;
  fill.style.background=fillColor;
  const mb=document.getElementById('meterBadge');
  if(mb){mb.textContent=badgeTxt;mb.style.background=badgeBg;mb.style.color=badgeFg;}
  // salary
  calcSalary();
}

/* ===== TÍNH LƯƠNG ƯỚC TÍNH ===== */
/** Tính lương ước tính theo quốc gia: OT, ca đêm, ngày lễ, bảo hiểm, thuế TNCN
 *  Hỗ trợ 3 kiểu trả lương: theo tháng / theo ngày / theo giờ */
function calcSalary(){
  // Đọc từ input nếu panel đang mở, nếu không dùng giá trị đã lưu
  const _salInp = document.getElementById('salaryInput');
  const mode = _salaryMode || userData.salaryMode || 'month';
  const _savedSal = mode==='month' ? (userData.salary||0)
                  : mode==='day'   ? (userData.salaryDay||0)
                  :                   (userData.salaryHour||0);
  const inputVal = parseFloat(_salInp?.value)||_savedSal||0;
  const ngc = userData.ngc||26;
  const gioCA = userData.hoursPerShift||8;

  // Quy về lương tháng để dùng engine cũ
  let raw = 0;
  if(mode === 'month'){
    raw = inputVal || userData.salary || 0;
  } else if(mode === 'day'){
    // Lương ngày × số ngày công chuẩn = lương tháng
    raw = (inputVal || userData.salaryDay || 0) * ngc;
    userData.salaryDay = inputVal;
  } else if(mode === 'hour'){
    // Lương giờ × giờ/ngày × ngày công = lương tháng
    raw = (inputVal || userData.salaryHour || 0) * gioCA * ngc;
    userData.salaryHour = inputVal;
  }
  userData.salary = raw;
  userData.salaryMode = mode;
  saveUser();
  // Update cfg shim for v21 engine
  _cfg_shim={luong:raw,ngayCong:userData.ngc||26,gioNgay:userData.hoursPerShift||8,kieu:'thang',vung:5310000};
  syncLangCfg();
  const rule=getPayrollRule();
  const now=new Date();const y=now.getFullYear(),m=now.getMonth();
  const daysInMonth=new Date(y,m+1,0).getDate();
  const lN=ldN();const lG=lgN();
  let cm=0,np=0,v=0,ll=0,nightDays=0,tongGop=0,tongOT=0;
  for(let d=1;d<=daysInMonth;d++){
    const rec=attData[`${y}-${m}-${d}`];
    if(!rec)continue;
    const nl=gNL(y,m,d);
    const sg=rec.in&&rec.out?soGio(rec.in,rec.out):gioCA;
    const otGio=Math.max(0,(sg||gioCA)-gioCA);
    let nightGio=0;
    if(rec.in&&rec.out)nightGio=calcNightHours(rec.in,rec.out,rule.nightStart,rule.nightEnd);
    const nightPct=(rule.nightFactor||1.3)-1.0;
    const nightTien=rule.nightIsAdditive?nightGio*lG*rule.nightFactor:nightGio*lG*nightPct;
    let otTien=0;
    if(langCfg.payrollCountry==='TW'){
      const ot1=Math.min(otGio,rule.ot1Hours||2);
      const ot2=Math.min(Math.max(0,otGio-(rule.ot1Hours||2)),rule.ot2Hours||2);
      otTien=(ot1*lG*(rule.ot1Factor||1.33))+(ot2*lG*(rule.ot2Factor||1.67));
    }else{otTien=otGio*lG*(rule.otFactor||1.5);}
    if(rec.type==='cm'){cm++;tongGop+=lN+nightTien+otTien;tongOT+=otTien;if(nightGio>1)nightDays++;}
    else if(rec.type==='np'){np++;tongGop+=lN;}
    else if(rec.type==='vang'){v++;tongGop-=lN;}
    else if(rec.type==='ll'){ll++;tongGop+=lN*(rule.holidayFactor||4.0)+nightTien+otTien;}
  }
  const pr=PAYROLL_RULES[langCfg.payrollCountry]||PAYROLL_RULES.VN;
  const country = langCfg.payrollCountry || 'VN';

  // ===== TAX ENGINE — dùng quy tắc thực tế từng quốc gia =====
  // tongGop = gross tháng (đã cộng OT, ca đêm, lễ; đã trừ vắng)
  const taxResult = taxEngineCalculate(country, Math.max(0, tongGop), userData.dependents || 0);
  const bhTong   = taxResult.insurance;
  const thueTong = taxResult.tax;
  const net      = taxResult.net;
  const taxRule  = taxResult.rule;
  const cur=pr.currency||'₫';
  const fmtN=n=>{
    if(country==='VN') return Math.round(n).toLocaleString('vi-VN')+'₫';
    const sym=pr.currency||'';
    return sym+(Math.round(n)).toLocaleString();
  };
  const bd=document.getElementById('salaryBreakdown');
  if(bd){
    bd.innerHTML=
      // Translated salary labels
      (()=>{const L=userData.lang||'vi';const _b={vi:{coMat:'Có mặt',ngay:'ngày',caDem:'Ca đêm',tangCa:'Tăng ca',nghiPhep:'Nghỉ phép',vang:'Vắng',lamLe:'Làm ngày lễ'},en:{coMat:'Present',ngay:'days',caDem:'Night shift',tangCa:'Overtime',nghiPhep:'Leave',vang:'Absent',lamLe:'Holiday work'},ko:{coMat:'출근',ngay:'일',caDem:'야간 근무',tangCa:'초과근무',nghiPhep:'연차',vang:'결근',lamLe:'휴일 근무'},ja:{coMat:'出勤',ngay:'日',caDem:'夜勤',tangCa:'残業',nghiPhep:'有給',vang:'欠勤',lamLe:'休日出勤'},zh:{coMat:'出勤',ngay:'天',caDem:'夜班',tangCa:'加班',nghiPhep:'请假',vang:'缺勤',lamLe:'节假日'},my:{coMat:'တက်',ngay:'ရက်',caDem:'ညဆင်း',tangCa:'ချိန်ပို',nghiPhep:'ခွင့်',vang:'ပျက်',lamLe:'ရုံးပိတ်ရက်'},th:{coMat:'มาทำงาน',ngay:'วัน',caDem:'กะกลางคืน',tangCa:'ล่วงเวลา',nghiPhep:'ลา',vang:'ขาดงาน',lamLe:'ทำงานวันหยุด'},id:{coMat:'Hadir',ngay:'hari',caDem:'Shift malam',tangCa:'Lembur',nghiPhep:'Cuti',vang:'Absen',lamLe:'Kerja hari libur'},ph:{coMat:'Dumalo',ngay:'araw',caDem:'Night shift',tangCa:'Overtime',nghiPhep:'Leave',vang:'Absent',lamLe:'Holiday work'},ne:{coMat:'उपस्थित',ngay:'दिन',caDem:'रात पाली',tangCa:'ओभरटाइम',nghiPhep:'बिदा',vang:'अनुपस्थित',lamLe:'बिदा काम'},hi:{coMat:'उपस्थित',ngay:'दिन',caDem:'रात शिफ्ट',tangCa:'ओवरटाइम',nghiPhep:'छुट्टी',vang:'अनुपस्थित',lamLe:'छुट्टी काम'}}[L]||{coMat:'Có mặt',ngay:'ngày',caDem:'Ca đêm',tangCa:'Tăng ca',nghiPhep:'Nghỉ phép',vang:'Vắng',lamLe:'Làm ngày lễ'};return `<strong>${pr.flag} ${cLang(pr.name)}</strong> · ${cLang(pr.basis)}<br>`+
      `${_b.coMat}: ${cm} ${_b.ngay} × ${fmtN(lN)} = <strong>${fmtN(cm*lN)}</strong><br>`+
      (nightDays>0?`${_b.caDem} (${nightDays} ${_b.ngay}, +${Math.round((rule.nightFactor-1)*100)}%) = <strong style="color:#7B5EA7">+${fmtN(nightDays*lG*gioCA*(rule.nightFactor-1))}</strong><br>`:'')+ 
      (tongOT>0?`${_b.tangCa} (×${rule.otFactor||1.5}): <strong style="color:#F5A623">+${fmtN(tongOT)}</strong><br>`:'')+ 
      (np>0?`${_b.nghiPhep}: ${np} ${_b.ngay} = <strong>${fmtN(np*lN)}</strong><br>`:'')+
      (v>0?`${_b.vang}: -${v} ${_b.ngay} = <strong style="color:#E8433A">-${fmtN(v*lN)}</strong><br>`:'')+
      (ll>0?`${_b.lamLe}: ${ll} ${_b.ngay} × ${rule.holidayFactor||4} = <strong style="color:#2D7DD2">${fmtN(ll*lN*(rule.holidayFactor||4))}</strong><br>`:'')+
      '';})();
      // insurance/tax labels → u('salary.insurance'), u('salary.tax')
      // Hiển thị bảo hiểm + thuế — chỉ hiện nếu > 0 để tránh "-0₫"
      const _bhPct = bhTong>0&&tongGop>0 ? ' ('+(bhTong/tongGop*100).toFixed(1)+'%)' : '';
      let insTxt = '';
      if(bhTong>0) insTxt += `${u('salary.insurance')}${_bhPct}: <strong style="color:#E8433A">-${fmtN(bhTong)}</strong>`;
      if(thueTong>0) insTxt += (insTxt?'<br>':'')+`${u('salary.tax')}: <strong style="color:#E8433A">-${fmtN(thueTong)}</strong>`;
      if(insTxt) bd.innerHTML+=insTxt;
  }
  const netEl=document.getElementById('salaryNet');
  if(netEl)netEl.textContent=fmtN(net);
  const amtEl=document.getElementById('salaryAmount');
  if(amtEl)amtEl.textContent=fmtN(tongGop>0?tongGop:0);
  const detEl=document.getElementById('salaryDetail');
  if(detEl)detEl.textContent=raw?`${cm} ngày có mặt · ${cLang(pr.name)} · Thực nhận ≈ ${fmtN(net)}`:getLang().salaryDetail||'Nhập thông tin lương để tính tự động';
  saveUser();
}

