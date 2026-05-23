/* ===== ĐIỀU HƯỚNG MÀN HÌNH CHÍNH ===== */
/** Chuyển màn hình chính (home/cal/settings). Ẩn tất cả rồi hiện màn cần */
function goScreen(id){
  const target = document.getElementById(id);
  if(!target)return;
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  target.classList.add('active');
  if(id==='screenHome')renderHomeStats();
  if(id==='screenCal'){renderCalBig();setTimeout(applyCalBg,50);}
}

function getActiveScreenId(){
  const active = document.querySelector('.screen.active');
  return active ? active.id : '';
}

function closeTopOverlayOrPanel(){
  const openPanels = Array.from(document.querySelectorAll('.panel-overlay.open'));
  if(openPanels.length){
    openPanels[openPanels.length - 1].classList.remove('open');
    return true;
  }
  return false;
}

function appBackHome(ev){
  if(ev){
    ev.preventDefault();
    ev.stopPropagation();
  }
  if(closeTopOverlayOrPanel())return false;
  if(getActiveScreenId() !== 'screenHome')goScreen('screenHome');
  return false;
}

function appHandleAndroidBack(){
  if(closeTopOverlayOrPanel())return 'handled';
  const active = getActiveScreenId();
  if(active && active !== 'screenHome'){
    goScreen('screenHome');
    return 'handled';
  }
  return 'exit';
}

window.appBackHome = appBackHome;
window.appHandleAndroidBack = appHandleAndroidBack;

/* ===== QUẢN LÝ PANEL (sheet trượt lên từ dưới) ===== */
/** Mở panel trượt lên từ dưới. Init nội dung panel trước khi hiện */
function openPanel(id){
  document.getElementById(id).classList.add('open');
  if(id==='panelAppearance'){renderColorGrid();renderGradientGrid();updateBgPreview();syncAppearancePickers();}
  if(id==='panelHelp'){renderHelpPanel();}
  if(id==='panelSalary'){
    _salaryPeriod='month';
    setSalaryPeriod('month',document.getElementById('pbMonth'));
    renderHoursTable();
    _syncSalaryModeButtons();
    const inp = document.getElementById('salaryInput');
    if(inp){
      const m = userData.salaryMode || 'month';
      const savedVal = m === 'month' ? (userData.salary||0)
                     : m === 'day'   ? (userData.salaryDay||0)
                     :                  (userData.salaryHour||0);
      // Hiển thị giá trị đã lưu (nếu có), không để trống gây nhầm placeholder
      inp.value = savedVal > 0 ? savedVal : '';
    }
    calcSalary();
    if(typeof renderSubJobSalary==='function') renderSubJobSalary();
  }
  if(id==='panelExcel'){renderExcelPreview();if(typeof updateExcelPanel==='function')updateExcelPanel();}
  if(id==='panelLang'){
    renderLangGrid('settingsLangGrid',userData.lang,selLangSetting);
  }
  if(id==='panelCountry'){
    renderCountryGrid('settingsCountryGrid',userData.country,selCountrySetting);
  }
  if(id==='panelSetup'){
    if(typeof renderSetupSubJob==='function') renderSetupSubJob();
    document.getElementById('setupName').value=userData.name||'';
    document.getElementById('setupJob').value=userData.job||'';
    document.getElementById('setupCo').value=userData.company||'';
    // Đồng bộ Số ca làm việc
    setupShifts = userData.shifts || 1;
    document.querySelectorAll('#setupShiftGrid .num-btn').forEach((b,i)=>{
      b.classList.toggle('sel', (i+1) === setupShifts);
    });
    // ═══ Render Shift Cards (giờ vào/ra) ═══
    if(typeof renderSetupShiftCards === 'function') renderSetupShiftCards();
    // Đồng bộ Tuần này làm ca nào
    setupCurShift = userData.currentShift || 1;
    renderSetupCurShift();
    // ═══ Đồng bộ Số giờ / ca (preset + custom input) ═══
    setupHours = userData.hoursPerShift || 8;
    const hoursGrid = document.getElementById('setupHoursGrid');
    if(hoursGrid){
      const presets = [6, 7, 8, 10, 12];
      hoursGrid.querySelectorAll('.num-btn').forEach((btn, idx) => {
        btn.classList.toggle('sel', presets[idx] === setupHours);
      });
    }
    const setupHoursInput = document.getElementById('setupHoursCustom');
    if(setupHoursInput) setupHoursInput.value = setupHours;
    // Đồng bộ label theo ngôn ngữ
    const lblCustom = document.getElementById('setupHoursCustomLbl');
    const lblUnit   = document.getElementById('setupHoursCustomUnit');
    const tr = (TRAN && TRAN[userData.lang||'vi']) || {};
    if(lblCustom) lblCustom.textContent = '⚙️ ' + (tr.obHoursCustom || 'Hoặc nhập:');
    if(lblUnit)   lblUnit.textContent   = tr.obHoursUnit || 'giờ/ca';
    // Đồng bộ label "Giờ vào & hết ca" theo ngôn ngữ
    const lblShiftTimes = document.getElementById('setupLblShiftTimes');
    if(lblShiftTimes){
      const L = userData.lang || 'vi';
      const shiftTimesLbl = {
        vi:'⏰ Giờ vào & hết ca', en:'⏰ Shift start & end times', ko:'⏰ 출퇴근 시간',
        ja:'⏰ シフトの始業・終業時間', zh:'⏰ 上下班时间', my:'⏰ ဆင်းချိန်',
        th:'⏰ เวลาเข้า-ออกกะ', id:'⏰ Jam masuk-keluar', ph:'⏰ Oras pasok-labas',
        ne:'⏰ शिफ्टको समय', hi:'⏰ शिफ्ट समय'
      }[L] || '⏰ Giờ vào & hết ca';
      lblShiftTimes.textContent = shiftTimesLbl;
    }
    // Đồng bộ nút Số tuần một vòng
    setupWeeks = userData.weeksPerCycle || 1;
    document.querySelectorAll('#setupWeeksGrid .num-btn').forEach((b,i)=>{
      b.classList.toggle('sel', (i+1) === setupWeeks);
    });
    // Render section "Lịch xoay ca tự động" (chỉ hiện khi >=2 ca)
    if(typeof renderShiftRotationSection === 'function') renderShiftRotationSection();
    // Đồng bộ nút Có/Không nghỉ giữa giờ
    setupHasBreak = userData.hasBreak ? 1 : 0;
    const brNo = document.getElementById('brBtnNo');
    const brYes = document.getElementById('brBtnYes');
    if(brNo)  brNo.classList.toggle('sel',  setupHasBreak === 0);
    if(brYes) brYes.classList.toggle('sel', setupHasBreak === 1);
    document.getElementById('breakMinutesBlock').style.display = setupHasBreak === 1 ? '' : 'none';
    // Đồng bộ nút số phút nghỉ
    setupBreakMin = userData.breakMinutes || 60;
    const brMins = [30,60,75,90,120];
    document.querySelectorAll('#setupBreakMinGrid .num-btn').forEach((b,i)=>{
      b.classList.toggle('sel', brMins[i] === setupBreakMin);
    });
  }
}

function getEntertainmentGameUrl(){
  const lang = (typeof userData !== 'undefined' && userData.lang) ? userData.lang : 'vi';
  return 'mini_game_zone_playable_test/index.html?lang=' + encodeURIComponent(lang);
}

function syncEntertainmentGameFrame(forceReload){
  const frame = document.getElementById('miniGameFrame');
  if(!frame) return;
  const nextSrc = getEntertainmentGameUrl();
  if(forceReload || frame.getAttribute('src') !== nextSrc){
    frame.setAttribute('src', nextSrc);
  }
}

/** Mở khu trò chơi giải trí trong panel tiện ích cũ. */
function openEntertainmentGames(){
  syncEntertainmentGameFrame(false);
  openPanel('panelUtil');
}

function syncRelaxSoundFrame(forceReload){
  const frame = document.getElementById('relaxSoundFrame');
  if(!frame) return;
  const lang = (typeof userData !== 'undefined' && userData.lang) ? userData.lang : 'vi';
  const baseSrc = frame.dataset.src || 'chamcongpro_sleep_sound.html';
  const join = baseSrc.includes('?') ? '&' : '?';
  const nextSrc = baseSrc + join + 'lang=' + encodeURIComponent(lang);
  if(forceReload || frame.getAttribute('src') !== nextSrc){
    frame.setAttribute('src', nextSrc);
  }
}

function openRelaxSounds(){
  syncRelaxSoundFrame(false);
  openPanel('panelRelax');
}

/** Đóng panel */
function closePanel(id){
  document.getElementById(id).classList.remove('open');
}
document.querySelectorAll('.panel-overlay').forEach(p=>{
  p.addEventListener('click',e=>{if(e.target===p)p.classList.remove('open');});
});

/** Đồng bộ giá trị các slider GPS theo _gpsData.
 *  QUAN TRỌNG: Re-load từ localStorage để chắc chắn không dùng stale reference */
function syncGpsSliders(){
  // Force re-load _gpsData từ localStorage để chắc chắn giá trị mới nhất
  if(typeof loadGpsData === 'function'){
    loadGpsData();
  }
  // Lấy giá trị đã save (fallback về mặc định nếu chưa có)
  const radius     = (_gpsData && typeof _gpsData.radius     === 'number' && _gpsData.radius     > 0) ? _gpsData.radius     : 15;
  const checkinMin = (_gpsData && typeof _gpsData.checkinMin === 'number' && _gpsData.checkinMin > 0) ? _gpsData.checkinMin : 5;
  const checkoutMin= (_gpsData && typeof _gpsData.checkoutMin=== 'number' && _gpsData.checkoutMin> 0) ? _gpsData.checkoutMin: 75;
  const tightCompanyGps = !!(_gpsData && _gpsData.tightCompanyGps);

  const r = document.getElementById('gpsRadius');
  const rv = document.getElementById('gpsRadiusVal');
  if(r && rv){ r.value = radius; rv.textContent = radius + 'm'; }

  const ci = document.getElementById('gpsCheckinDelay');
  const civ = document.getElementById('gpsCheckinDelayVal');
  if(ci && civ){ ci.value = checkinMin; civ.textContent = checkinMin + 'p'; }

  const co = document.getElementById('gpsCheckoutDelay');
  const cov = document.getElementById('gpsCheckoutDelayVal');
  if(co && cov){ co.value = checkoutMin; cov.textContent = checkoutMin + 'p'; }

  const tightBtn = document.getElementById('togGpsTightCompany');
  if(tightBtn){ tightBtn.className = 'toggle-sw' + (tightCompanyGps ? ' on' : ''); }

  // Đảm bảo _gpsData cũng có giá trị đúng (đề phòng đã bị reset đâu đó)
  _gpsData.radius      = radius;
  _gpsData.checkinMin  = checkinMin;
  _gpsData.checkoutMin = checkoutMin;
  _gpsData.tightCompanyGps = tightCompanyGps;
}

/** Mở panel GPS — dùng panelNotif (nơi đặt UI cấu hình GPS), tự mở rộng card GPS */
function openPanelGPS(){
  openPanel('panelGPS');
  setTimeout(()=>{
    const card = document.getElementById('gpsSetupCard');
    if(card && _gpsData.enabled) card.style.display = 'block';
    syncGpsSliders();
  }, 80);
}

/** Mở panel Thuế & Bảo hiểm — render nội dung theo quốc gia làm việc hiện tại */
function openPanelTax(){
  renderTaxPanel();
  openPanel('panelTax');
}

/** Render quy định thuế & bảo hiểm theo quốc gia làm việc hiện tại */
function renderTaxPanel(){
  const c = (typeof userData!=='undefined' && userData.country) ? userData.country : 'VN';
  const rule = (typeof TAX_RULES!=='undefined' && TAX_RULES[c]) ? TAX_RULES[c] : null;
  const payroll = (typeof PAYROLL_RULES!=='undefined' && PAYROLL_RULES[c]) ? PAYROLL_RULES[c] : null;
  const box = document.getElementById('taxContent');
  if(!box) return;
  const T = getLang(); // bản dịch theo ngôn ngữ hiện tại
  if(!rule){
    box.innerHTML = '<div style="background:#F4F7F6;border-radius:14px;padding:24px;text-align:center;color:var(--text2)">N/A</div>';
    return;
  }
  const sym = rule.currency || '';
  const isAnnual = rule.period === 'annual';
  const periodLabel = isAnnual ? (T.taxPeriodAnnual||'năm (quy về tháng)') : (T.taxPeriodMonthly||'tháng');
  const perLabel    = isAnnual ? (T.taxPerYear||'năm') : (T.taxPerMonth||'tháng');
  const fmt = (n)=> n===Infinity?'∞' : n>=1e9?(n/1e9).toFixed(1)+'B' : n>=1e6?(n/1e6).toFixed(2)+'M' : n>=1e3?n.toLocaleString('en-US'):String(n);

  // 1. Bảo hiểm
  let insRows = '';
  if(rule.insurance.ssRate){
    insRows = `<div class="tx-row"><span>${T.taxSS||'Social Security'}</span><b>${(rule.insurance.ssRate*100).toFixed(2)}%</b></div>`
            + `<div class="tx-row"><span>${T.taxSsCap||'SS cap/năm'}</span><b>${sym}${fmt(rule.insurance.ssCap)}</b></div>`
            + `<div class="tx-row"><span>${T.taxMedicare||'Medicare'}</span><b>${(rule.insurance.medicareRate*100).toFixed(2)}%</b></div>`;
  } else if(rule.insurance.cap){
    insRows = `<div class="tx-row"><span>${T.taxInsRate||'Tỷ lệ đóng'}</span><b>${(rule.insurance.rate*100).toFixed(2)}%</b></div>`
            + `<div class="tx-row"><span>${T.taxInsCap||'Trần lương/tháng'}</span><b>${sym}${fmt(rule.insurance.cap)}</b></div>`
            + `<div class="tx-row"><span>${T.taxInsMax||'Đóng tối đa/tháng'}</span><b>${sym}${fmt(Math.round(rule.insurance.cap*rule.insurance.rate))}</b></div>`;
  } else {
    insRows = `<div class="tx-row"><span>${T.taxInsFlat||'Tỷ lệ phẳng'}</span><b>${(rule.insurance.rate*100).toFixed(2)}%</b></div>`;
  }
  if(rule.insNote){
    const insNoteText = (typeof rule.insNote === 'object') ? cLang(rule.insNote) : rule.insNote;
    insRows += `<div style="margin-top:8px;font-size:11px;color:var(--text3);line-height:1.5;background:white;padding:8px 10px;border-radius:8px">${insNoteText}</div>`;
  }
  const insDeductLabel = rule.insuranceDeductible===false
    ? `<span style="color:#E8433A;font-size:11px;font-weight:700">${T.taxInsDeductN||'⚠️ BH không trừ khỏi thu nhập chịu thuế'}</span>`
    : `<span style="color:#0D9E75;font-size:11px;font-weight:700">${T.taxInsDeductY||'✓ BH được trừ trước khi tính thuế'}</span>`;

  // 2. Giảm trừ
  let deductRows = `<div style="color:var(--text3);font-size:13px">—</div>`;
  if(rule.deduction){
    const dr = [];
    if(rule.deduction.personal!=null)  dr.push(`<div class="tx-row"><span>${T.taxPersonal||'Bản thân'}</span><b>${sym}${fmt(rule.deduction.personal)}/${perLabel}</b></div>`);
    if(rule.deduction.dependent!=null) dr.push(`<div class="tx-row"><span>${T.taxDependent||'Người phụ thuộc'}</span><b>${sym}${fmt(rule.deduction.dependent)}/${perLabel}</b></div>`);
    if(rule.deduction.standard!=null)  dr.push(`<div class="tx-row"><span>${T.taxStandard||'Khấu trừ cơ bản'}</span><b>${sym}${fmt(rule.deduction.standard)}/${perLabel}</b></div>`);
    if(dr.length) deductRows = dr.join('');
  }

  // 3. Bậc thuế
  const bNo   = T.taxBandNo   || 'Bậc';
  const bInc  = T.taxBandIncome || 'Thu nhập chịu thuế';
  const bRate = T.taxBandRate  || 'Thuế suất';
  const bAbove = T.taxAbove    || 'Trên';
  const bExempt = T.taxExempt  || '0% (miễn)';
  let bHtml = `<div style="display:grid;grid-template-columns:auto 1fr auto;gap:5px 10px;font-size:12px;align-items:center">
    <div style="font-weight:800;color:var(--text2);padding-bottom:4px">${bNo}</div>
    <div style="font-weight:800;color:var(--text2);padding-bottom:4px">${bInc} (${perLabel})</div>
    <div style="font-weight:800;color:var(--text2);text-align:right;padding-bottom:4px">${bRate}</div>`;
  let acc = 0;
  rule.brackets.forEach((b,i)=>{
    const [limit, rate] = b;
    let range = limit===Infinity ? `${bAbove} ${sym}${fmt(acc)}` : `${sym}${fmt(acc)} – ${sym}${fmt(acc+limit)}`;
    if(limit!==Infinity) acc+=limit;
    const rs = rate===0 ? `<span style="color:#0D9E75;font-weight:800">${bExempt}</span>` : `<b style="color:var(--ac)">${(rate*100).toFixed(0)}%</b>`;
    bHtml += `<div style="color:var(--text3)">${i+1}</div><div>${range}</div><div style="text-align:right">${rs}</div>`;
  });
  bHtml += '</div>';
  const localTaxLbl    = T.taxLocalTax    || 'Thuế địa phương';
  const residentTaxLbl = T.taxResidentTax || 'Thuế cư trú';
  if(rule.localTax)    bHtml += `<div class="tx-row" style="margin-top:8px;border-top:1px dashed var(--border);padding-top:8px"><span>${localTaxLbl}</span><b>+${(rule.localTax*100).toFixed(0)}%</b></div>`;
  if(rule.residentTax) bHtml += `<div class="tx-row" style="margin-top:8px;border-top:1px dashed var(--border);padding-top:8px"><span>${residentTaxLbl}</span><b>+${(rule.residentTax*100).toFixed(0)}%</b></div>`;

  // 4. Hệ số lương
  let payrollHtml = '';
  if(payroll && payroll.tags){
    const lang = userData.lang || 'vi';
    // tags là object {vi:[...], en:[...], ...} hoặc array cũ
    const tagsArr = Array.isArray(payroll.tags)
      ? payroll.tags
      : (payroll.tags[lang] || payroll.tags.en || payroll.tags.vi || []);
    payrollHtml = `<div style="background:#F4F7F6;border-radius:14px;padding:14px;margin-bottom:12px">
      <div style="font-size:12px;font-weight:800;color:var(--text2);margin-bottom:8px">${T.taxSecPayroll||'⏱️ HỆ SỐ LƯƠNG THEO LUẬT'}</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">${tagsArr.map(tag=>`<span style="background:#E0F5EE;color:#0a7d5c;font-size:11px;font-weight:700;padding:4px 10px;border-radius:12px">${tag}</span>`).join('')}</div>
      ${payroll.basis ? `<div style="font-size:11px;color:var(--text3);margin-top:8px;line-height:1.5">📜 ${cLang(payroll.basis)||payroll.basis}</div>` : ''}
    </div>`;
  }

  const noteText = T.taxNote || 'Số liệu tham khảo theo luật 2025.';
  const calcByTxt = `${T.taxCalcBy||'Tính theo'} ${periodLabel}`;

  box.innerHTML = `
    <style>.tx-row{display:flex;justify-content:space-between;align-items:center;font-size:13px;padding:5px 0;border-bottom:1px solid #f0f0f0}.tx-row:last-of-type{border-bottom:none}</style>
    <div style="background:linear-gradient(135deg,var(--ac),#0a7d5c);color:white;border-radius:14px;padding:14px 16px;margin-bottom:14px">
      <div style="font-size:20px;font-weight:900">${rule.flag||''} ${cLang(rule.name)||''}</div>
      <div style="font-size:12px;opacity:.85;margin-top:3px">${sym} · ${calcByTxt}</div>
    </div>
    <div style="background:#F4F7F6;border-radius:14px;padding:14px;margin-bottom:12px">
      <div style="font-size:12px;font-weight:800;color:var(--text2);margin-bottom:8px">${T.taxSecIns||'🛡️ BẢO HIỂM XÃ HỘI / AN SINH'}</div>
      ${insRows}
      <div style="margin-top:8px">${insDeductLabel}</div>
    </div>
    <div style="background:#F4F7F6;border-radius:14px;padding:14px;margin-bottom:12px">
      <div style="font-size:12px;font-weight:800;color:var(--text2);margin-bottom:8px">${T.taxSecDeduct||'💰 GIẢM TRỪ GIA CẢNH / MIỄN THUẾ'}</div>
      ${deductRows}
    </div>
    <div style="background:#F4F7F6;border-radius:14px;padding:14px;margin-bottom:12px">
      <div style="font-size:12px;font-weight:800;color:var(--text2);margin-bottom:8px">${T.taxSecBrackets||'📊 BIỂU THUẾ THU NHẬP CÁ NHÂN (LŨY TIẾN)'}</div>
      ${bHtml}
    </div>
    ${payrollHtml}
    <div style="background:#FFF8E8;border:1.5px solid #F5A623;border-radius:14px;padding:12px 14px;font-size:12px;color:#854F0B;line-height:1.6">
      ⚠️ <b>${T.taxNote?'':''}</b>${noteText}
    </div>
  `;
}

function selLangSetting(id){
  userData.lang=id;saveUser();syncLangCfg();
  document.getElementById('siLangSub').textContent=LANGS.find(l=>l.id===id)?.name||id;
  renderLangGrid('settingsLangGrid',id,selLangSetting);
  applyI18n();
  syncEntertainmentGameFrame(true);
  closePanel('panelLang');
}
/** Đổi quốc gia làm việc: cập nhật luật lương và tính lại ngay */
function selCountrySetting(id){
  userData.country=id;saveUser();syncLangCfg();
  document.getElementById('siCountrySub').textContent=cLang(COUNTRIES.find(c=>c.id===id)?.name)||id;
  renderCountryGrid('settingsCountryGrid',id,selCountrySetting);
  renderHomeStats();
  // Đóng panel sau khi chọn (giống selLangSetting)
  closePanel('panelCountry');
}

function saveSetup(){
  userData.name=document.getElementById('setupName').value.trim()||userData.name;
  userData.job=document.getElementById('setupJob').value.trim()||userData.job;
  userData.company=document.getElementById('setupCo').value.trim()||userData.company;
  userData.shifts = setupShifts || userData.shifts || 1;
  userData.hoursPerShift = setupHours || userData.hoursPerShift || 8;
  userData.currentShift = Math.min(setupCurShift || userData.currentShift || 1, userData.shifts);
  // ═══ Lưu shift times từ panel Setup ═══
  if(typeof onSetupShiftTimeChange === 'function') onSetupShiftTimeChange();
  if(typeof saveSubJob==='function') saveSubJob(); // TRƯỚC saveUser!
  saveUser();initHome();
  closePanel('panelSetup');
  // Re-schedule notifications sau khi user lưu thông tin
  if(typeof window.rescheduleNativeNotifications === 'function'){
    window.rescheduleNativeNotifications();
  }
  if(typeof gpsSyncNativeNow === 'function') gpsSyncNativeNow();
}

