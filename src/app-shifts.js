/* ═══════════════════════════════════════════════════════════════════════════════
   HELPERS XOAY CA — Label ca + Rotation pattern tự động chuyển ca theo tuần
   ═══════════════════════════════════════════════════════════════════════════════
   Data model mới (backward-compatible):
   - userData.shiftLabels:          ['Ngày', 'Chiều', 'Đêm']  (mảng, index = ca - 1)
   - userData.shiftRotationEnabled: true → tự đổi ca theo tuần dựa shiftRotation
   - userData.shiftRotation:        [1, 3, 2] = tuần 1 dùng ca 1, tuần 2 dùng ca 3, tuần 3 dùng ca 2
   - userData.rotationStartDate:    timestamp ms — tuần khởi đầu chu kỳ (default: thứ Hai gần nhất)

   Nếu rotation tắt → trả userData.currentShift (legacy behavior)
   ═══════════════════════════════════════════════════════════════════════════════ */

/** Gợi ý label tự động theo giờ vào ca (Sáng/Chiều/Đêm/Hành chính) */
function _suggestShiftLabel(inHm){
  const L = (userData && userData.lang) || 'vi';
  const dict = {
    morning:   {vi:'Ca sáng',  en:'Morning',  ko:'오전',     ja:'朝勤',  zh:'早班', my:'မနက်ဆင်း',  th:'กะเช้า',     id:'Pagi',     ph:'Umaga',     ne:'बिहान',     hi:'सुबह'},
    afternoon: {vi:'Ca chiều', en:'Afternoon',ko:'오후',     ja:'昼勤',  zh:'午班', my:'နေ့ဆင်း',     th:'กะบ่าย',     id:'Siang',    ph:'Tanghali',  ne:'दिउँसो',    hi:'दोपहर'},
    night:     {vi:'Ca đêm',   en:'Night',    ko:'야간',     ja:'夜勤',  zh:'夜班', my:'ညဆင်း',       th:'กะกลางคืน',  id:'Malam',    ph:'Gabi',      ne:'रात',       hi:'रात'},
    office:    {vi:'Hành chính',en:'Office',  ko:'사무직',   ja:'事務',  zh:'行政', my:'ရုံးချိန်',    th:'เวลาทำการ',  id:'Kantor',   ph:'Opisina',   ne:'कार्यालय',  hi:'कार्यालय'}
  };
  const m = String(inHm||'').match(/^(\d{1,2}):/);
  const h = m ? Number(m[1]) : 8;
  // Phân loại theo giờ vào ca:
  //  4-10h  → Ca sáng/ngày
  //  10-15h → Hành chính
  //  15-20h → Ca chiều
  //  20-3h  → Ca đêm
  if(h >= 4 && h < 10)  return (dict.morning[L]   || dict.morning.vi);
  if(h >= 10 && h < 15) return (dict.office[L]    || dict.office.vi);
  if(h >= 15 && h < 20) return (dict.afternoon[L] || dict.afternoon.vi);
  return (dict.night[L] || dict.night.vi);
}

/** Trả về label đã lưu của ca thứ idx (1-based). Nếu chưa có label → gợi ý theo giờ */
function getShiftLabel(idx1Based){
  const i = Math.max(1, Number(idx1Based)||1) - 1;
  const labels = (userData && Array.isArray(userData.shiftLabels)) ? userData.shiftLabels : [];
  if(labels[i] && String(labels[i]).trim()) return String(labels[i]).trim();
  const times = (userData && userData.shiftTimes) || [];
  return _suggestShiftLabel(times[i] && times[i].in);
}

/** Lấy thứ Hai (00:00) của tuần chứa timestamp `ts` (ms) — chuẩn hoá mốc rotation về đầu tuần */
function _mondayOfWeek(ts){
  const d = new Date(ts);
  d.setHours(0,0,0,0);
  // getDay(): 0=CN, 1=T2 ... 6=T7 → đẩy về T2
  const dow = d.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diff);
  return d.getTime();
}

/**
 * Tính ca hiệu lực hiện tại (1-based).
 *   - Rotation tắt → trả userData.currentShift (legacy)
 *   - Rotation bật → dựa số tuần đã trôi qua kể từ rotationStartDate
 *     và dãy shiftRotation [1,3,2] để chọn ca cho tuần hiện tại.
 * Hàm được expose qua window để checkin.js và capacitor-integration.js dùng chung.
 */
function getEffectiveCurrentShift(){
  if(!userData) return 1;
  const shifts = Math.max(1, Number(userData.shifts) || 1);
  const manual = Math.max(1, Math.min(shifts, Number(userData.currentShift) || 1));
  if(!userData.shiftRotationEnabled) return manual;
  const seq = Array.isArray(userData.shiftRotation) ? userData.shiftRotation.filter(n => Number.isFinite(Number(n))) : [];
  if(!seq.length) return manual;
  const startTs = Number(userData.rotationStartDate) || _mondayOfWeek(Date.now());
  const nowMonday = _mondayOfWeek(Date.now());
  const weeksSince = Math.max(0, Math.round((nowMonday - _mondayOfWeek(startTs)) / (7*24*3600*1000)));
  const idx = ((weeksSince % seq.length) + seq.length) % seq.length;
  const rotShift = Number(seq[idx]) || 1;
  return Math.max(1, Math.min(shifts, rotShift));
}
window.getEffectiveCurrentShift = getEffectiveCurrentShift;
window.getShiftLabel = getShiftLabel;

/** ═══ Render Shift Cards (giờ vào / hết ca) trong panel Setup ═══
 *  Mỗi card có:
 *    - Drag handle ⋮⋮ (đầu card) — kéo thả để đổi thứ tự ca
 *    - Input label tên ca (Ngày/Chiều/Đêm/...) — tự gợi ý theo giờ vào
 *    - Input giờ vào / giờ ra (như cũ)
 */
function renderSetupShiftCards(){
  const container = document.getElementById('setupShiftCards');
  if(!container) return;

  const shifts = setupShifts || userData.shifts || 1;
  const defaultTimes = [
    {in:'06:00', out:'14:00'},
    {in:'14:00', out:'22:00'},
    {in:'22:00', out:'06:00'},
    {in:'00:00', out:'08:00'}
  ];
  const savedTimes = userData.shiftTimes || [];
  const savedLabels = (userData && Array.isArray(userData.shiftLabels)) ? userData.shiftLabels : [];
  const L = userData.lang || 'vi';
  const tr = (TRAN && TRAN[L]) || {};
  const shiftLbl = {vi:'Ca',en:'Shift',ko:'교대',ja:'シフト',zh:'班',my:'ဆင်း',th:'กะ',id:'Shift',ph:'Shift',ne:'सिफ्ट',hi:'शिफ्ट'}[L] || 'Ca';
  const inLbl  = tr.dpInTime  || 'Vào ca';
  const outLbl = tr.dpOutTime || 'Hết ca';
  const labelPlaceholder = {vi:'Tên ca (vd: Sáng, Chiều, Đêm)',en:'Shift name (e.g., Morning, Evening, Night)',ko:'교대 이름',ja:'シフト名',zh:'班次名称',my:'အလုပ်အမည်',th:'ชื่อกะ',id:'Nama shift',ph:'Pangalan ng shift',ne:'सिफ्टको नाम',hi:'शिफ्ट का नाम'}[L] || 'Tên ca';
  const dragHint = {vi:'Kéo để đổi thứ tự',en:'Drag to reorder',ko:'끌어서 순서 변경',ja:'ドラッグで並べ替え',zh:'拖动重新排序',my:'ဆွဲ၍ ပြန်စီရန်',th:'ลากเพื่อจัดเรียง',id:'Tarik untuk ubah urutan',ph:'I-drag para baguhin ang ayos',ne:'क्रम परिवर्तन गर्न तान्नुहोस्',hi:'क्रम बदलने के लिए खींचें'}[L] || 'Kéo để đổi thứ tự';

  let html = '';
  for(let i = 0; i < shifts; i++){
    const ti = savedTimes[i] || defaultTimes[i] || {in:'08:00', out:'17:00'};
    const labelVal = (savedLabels[i] && String(savedLabels[i]).trim()) ? String(savedLabels[i]).trim() : '';
    const labelSuggestion = _suggestShiftLabel(ti.in);
    html += `
      <div class="shift-card" draggable="true"
           data-shift-idx="${i}"
           ondragstart="onShiftDragStart(event, ${i})"
           ondragover="onShiftDragOver(event)"
           ondragleave="onShiftDragLeave(event)"
           ondrop="onShiftDrop(event, ${i})"
           ondragend="onShiftDragEnd(event)"
           style="cursor:move">
        <div class="shift-card-head" style="display:flex;align-items:center;gap:8px">
          <span class="shift-drag-handle" title="${dragHint}" style="font-size:18px;color:#9aa3b2;cursor:grab;user-select:none;line-height:1">⋮⋮</span>
          <div class="shift-label" style="flex:0 0 auto">${shiftLbl} ${i+1}</div>
          <input type="text" class="shift-name-inp" id="setupSLabel${i}"
                 value="${labelVal.replace(/"/g,'&quot;')}"
                 placeholder="${labelSuggestion}"
                 oninput="onSetupShiftLabelChange()"
                 style="flex:1;min-width:0;border:1.5px solid var(--border);border-radius:8px;padding:6px 10px;font-size:13px;font-weight:600;font-family:Nunito,sans-serif;color:var(--text);background:white;outline:none">
        </div>
        <div class="time-row">
          <div><div class="field-label">${inLbl}</div><input class="time-inp" id="setupSIn${i}" type="time" value="${ti.in}" onchange="onSetupShiftTimeChange()"></div>
          <div class="time-sep">→</div>
          <div><div class="field-label">${outLbl}</div><input class="time-inp" id="setupSOut${i}" type="time" value="${ti.out}" onchange="onSetupShiftTimeChange()"></div>
        </div>
      </div>`;
  }
  container.innerHTML = html;
}

/** Cập nhật userData.shiftLabels khi user gõ tên ca */
function onSetupShiftLabelChange(){
  const shifts = setupShifts || userData.shifts || 1;
  const labels = [];
  for(let i = 0; i < shifts; i++){
    const el = document.getElementById('setupSLabel'+i);
    labels.push(el ? String(el.value || '').trim() : '');
  }
  userData.shiftLabels = labels;
  saveUser();
}
window.onSetupShiftLabelChange = onSetupShiftLabelChange;

/* ═══════════════════════════════════════════════════════════════════════════════
   DRAG-DROP SHIFT CARDS — kéo thả để đổi thứ tự ca
   Đồng thời swap shiftTimes + shiftLabels + cập nhật currentShift để giữ
   "ca thực tế user đang làm" (vd: đang làm ca số 3, kéo ca 3 lên đầu → currentShift=1)
   ═══════════════════════════════════════════════════════════════════════════════ */
var _shiftDragSrcIdx = -1;

function onShiftDragStart(e, idx){
  _shiftDragSrcIdx = idx;
  if(e.dataTransfer){
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', String(idx)); } catch(err){}
  }
  // Mờ card đang kéo
  if(e.currentTarget && e.currentTarget.style) e.currentTarget.style.opacity = '0.4';
}

function onShiftDragOver(e){
  e.preventDefault();
  if(e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  // Viền card target để user thấy drop zone
  if(e.currentTarget && e.currentTarget.style){
    e.currentTarget.style.outline = '2px dashed var(--ac)';
    e.currentTarget.style.outlineOffset = '-2px';
  }
  return false;
}

function onShiftDragLeave(e){
  if(e.currentTarget && e.currentTarget.style){
    e.currentTarget.style.outline = '';
    e.currentTarget.style.outlineOffset = '';
  }
}

function onShiftDrop(e, dstIdx){
  e.preventDefault();
  if(e.stopPropagation) e.stopPropagation();
  if(e.currentTarget && e.currentTarget.style){
    e.currentTarget.style.outline = '';
    e.currentTarget.style.outlineOffset = '';
  }
  const src = _shiftDragSrcIdx;
  _shiftDragSrcIdx = -1;
  if(src < 0 || src === dstIdx) return false;
  const shifts = setupShifts || userData.shifts || 1;
  if(src >= shifts || dstIdx >= shifts) return false;

  // Đọc state hiện tại từ DOM (vì user có thể đã sửa label/time mà chưa save)
  const times = [];
  const labels = [];
  for(let i = 0; i < shifts; i++){
    const inEl  = document.getElementById('setupSIn'+i);
    const outEl = document.getElementById('setupSOut'+i);
    const lbEl  = document.getElementById('setupSLabel'+i);
    times.push({ in: inEl?inEl.value:'08:00', out: outEl?outEl.value:'17:00' });
    labels.push(lbEl ? String(lbEl.value||'').trim() : '');
  }
  // Move src → dstIdx (insertion semantics)
  const movedTime = times.splice(src, 1)[0];
  const movedLabel = labels.splice(src, 1)[0];
  times.splice(dstIdx, 0, movedTime);
  labels.splice(dstIdx, 0, movedLabel);

  // Cập nhật currentShift để giữ "ca thực tế" mà user đang làm
  let cur = Number(userData.currentShift) || 1;
  cur = cur - 1; // → 0-based
  if(cur === src) cur = dstIdx;
  else if(src < cur && dstIdx >= cur) cur -= 1;
  else if(src > cur && dstIdx <= cur) cur += 1;
  cur = Math.max(0, Math.min(shifts - 1, cur)) + 1; // → 1-based

  // Cập nhật shiftRotation nếu có (map các index cũ → mới)
  let rotation = Array.isArray(userData.shiftRotation) ? userData.shiftRotation.slice() : null;
  if(rotation){
    const mapOldToNew = function(old1){
      let o = (Number(old1) || 1) - 1;  // → 0-based
      if(o === src) return dstIdx + 1;
      if(src < o && dstIdx >= o) return o; // shift xuống
      if(src > o && dstIdx <= o) return o + 2;
      return o + 1;
    };
    rotation = rotation.map(mapOldToNew);
    userData.shiftRotation = rotation;
  }

  userData.shiftTimes = times;
  userData.shiftLabels = labels;
  userData.currentShift = cur;
  setupCurShift = cur;
  saveUser();
  renderSetupShiftCards();
  if(typeof renderSetupCurShift === 'function') renderSetupCurShift();
  if(typeof renderShiftRotationSection === 'function') renderShiftRotationSection();
  if(typeof updateClock === 'function') updateClock();
  if(typeof renderHomeStats === 'function') renderHomeStats();
  if(typeof window.rescheduleNativeNotifications === 'function') window.rescheduleNativeNotifications();
  if(typeof gpsSyncNativeNow === 'function') gpsSyncNativeNow();
  return false;
}

function onShiftDragEnd(e){
  if(e.currentTarget && e.currentTarget.style) e.currentTarget.style.opacity = '';
  // Xoá outline ở mọi card phòng trường hợp dragleave không bắn
  document.querySelectorAll('.shift-card').forEach(function(c){
    c.style.outline = '';
    c.style.outlineOffset = '';
  });
}
window.onShiftDragStart = onShiftDragStart;
window.onShiftDragOver  = onShiftDragOver;
window.onShiftDragLeave = onShiftDragLeave;
window.onShiftDrop      = onShiftDrop;
window.onShiftDragEnd   = onShiftDragEnd;

/* ═══════════════════════════════════════════════════════════════════════════════
   ROTATION PATTERN — UI và logic xoay ca tự động theo tuần
   User định nghĩa shiftRotation = [1, 3, 2] có nghĩa:
     tuần 1 (của chu kỳ) → làm ca số 1
     tuần 2 (của chu kỳ) → làm ca số 3
     tuần 3 (của chu kỳ) → làm ca số 2
   App tự tính ca hiện tại dựa số tuần đã trôi qua kể từ rotationStartDate.
   ═══════════════════════════════════════════════════════════════════════════════ */

/** Render section "Lịch xoay ca tự động" trong panel Setup */
function renderShiftRotationSection(){
  const block = document.getElementById('setupRotationBlock');
  if(!block) return;
  const shifts = setupShifts || userData.shifts || 1;
  if(shifts < 2){ block.style.display = 'none'; return; }
  block.style.display = '';

  const L = (userData && userData.lang) || 'vi';
  const enabled = !!userData.shiftRotationEnabled;
  // Số tuần 1 chu kỳ — dùng chung weeksPerCycle nếu có, default = số ca
  const cycleWeeks = Math.max(1, Math.min(8, Number(userData.weeksPerCycle) || shifts));
  // Đảm bảo shiftRotation đúng length: [1,2,3,...,shifts] truncate/pad tới cycleWeeks
  let rotation = Array.isArray(userData.shiftRotation) ? userData.shiftRotation.slice() : [];
  while(rotation.length < cycleWeeks) rotation.push(((rotation.length) % shifts) + 1);
  if(rotation.length > cycleWeeks) rotation = rotation.slice(0, cycleWeeks);
  rotation = rotation.map(n => Math.max(1, Math.min(shifts, Number(n) || 1)));

  const titleTxt = {vi:'🔄 Lịch xoay ca tự động',en:'🔄 Auto shift rotation',ko:'🔄 자동 교대 순환',ja:'🔄 自動シフトローテーション',zh:'🔄 自动轮班',my:'🔄 အလိုအလျောက် ဆင်းအလှည့်',th:'🔄 หมุนกะอัตโนมัติ',id:'🔄 Rotasi shift otomatis',ph:'🔄 Auto shift rotation',ne:'🔄 स्वतः सिफ्ट परिवर्तन',hi:'🔄 स्वतः शिफ्ट रोटेशन'}[L] || '🔄 Lịch xoay ca tự động';
  const hintTxt  = {vi:'App tự đổi ca theo lịch tuần. Tắt nếu muốn chọn ca thủ công.',en:'App auto-switches shift every week. Turn off to choose manually.',ko:'매주 자동으로 교대를 변경합니다. 수동 선택을 원하면 끄세요.',ja:'毎週シフトを自動切替。手動選択はオフに。',zh:'每周自动切换班次。手动选择请关闭。',my:'အပတ်တိုင်း အလိုအလျောက် ဆင်းပြောင်းသည်။',th:'แอปเปลี่ยนกะอัตโนมัติทุกสัปดาห์',id:'Aplikasi otomatis ganti shift tiap minggu',ph:'Awtomatikong magpapalit ng shift kada linggo',ne:'हरेक हप्ता सिफ्ट स्वतः परिवर्तन हुन्छ',hi:'हर सप्ताह शिफ्ट स्वतः बदलेगी'}[L] || '';
  const weekLbl  = {vi:'Tuần',en:'Week',ko:'주',ja:'週',zh:'第',my:'အပတ်',th:'สัปดาห์',id:'Minggu',ph:'Linggo',ne:'हप्ता',hi:'सप्ताह'}[L] || 'Tuần';
  const shiftLbl = {vi:'Ca',en:'Shift',ko:'교대',ja:'シフト',zh:'班',my:'ဆင်း',th:'กะ',id:'Shift',ph:'Shift',ne:'सिफ्ट',hi:'शिफ्ट'}[L] || 'Ca';
  const currentTxt = {vi:'Tuần này → Ca',en:'This week → Shift',ko:'이번 주 → 교대',ja:'今週 → シフト',zh:'本周 → 班次',my:'ဒီအပတ် → ဆင်း',th:'สัปดาห์นี้ → กะ',id:'Minggu ini → Shift',ph:'Ngayong linggo → Shift',ne:'यो हप्ता → सिफ्ट',hi:'इस सप्ताह → शिफ्ट'}[L] || 'Tuần này → Ca';

  // Render grid: mỗi row = 1 tuần, có dropdown chọn ca
  let weeksHtml = '';
  for(let w = 0; w < cycleWeeks; w++){
    let opts = '';
    for(let s = 1; s <= shifts; s++){
      const lbl = getShiftLabel(s);
      const sel = (rotation[w] === s) ? ' selected' : '';
      opts += `<option value="${s}"${sel}>${shiftLbl} ${s} — ${lbl}</option>`;
    }
    weeksHtml += `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <span style="flex:0 0 70px;font-size:13px;font-weight:700;color:var(--text2)">${weekLbl} ${w+1}</span>
        <select onchange="onRotationWeekChange(${w}, this.value)"
                ${enabled?'':'disabled'}
                style="flex:1;border:1.5px solid var(--border);border-radius:8px;padding:8px 10px;font-size:13px;font-weight:600;font-family:Nunito,sans-serif;color:var(--text);background:white;outline:none;${enabled?'':'opacity:.5'}">${opts}</select>
      </div>`;
  }

  // Hiển thị ca hiệu lực hôm nay (preview)
  const effShift = getEffectiveCurrentShift();
  const effLabel = getShiftLabel(effShift);

  block.innerHTML = `
    <div style="background:#F4FBFF;border-radius:12px;padding:12px;border:1px solid #C7DBF8">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        <div style="font-size:13px;font-weight:800;color:#1F4F8F">${titleTxt}</div>
        <button class="toggle-sw${enabled?' on':''}" onclick="onToggleShiftRotation(this)"></button>
      </div>
      <div style="font-size:11px;color:var(--text3);line-height:1.4;margin-bottom:10px">${hintTxt}</div>
      ${enabled ? `<div style="background:white;border-radius:8px;padding:8px 10px;margin-bottom:10px;font-size:12px;font-weight:700;color:#0D6E3F">${currentTxt} ${effShift} — ${effLabel}</div>` : ''}
      ${weeksHtml}
    </div>`;
}
window.renderShiftRotationSection = renderShiftRotationSection;

/** Bật/tắt rotation tự động */
function onToggleShiftRotation(btn){
  const next = !userData.shiftRotationEnabled;
  userData.shiftRotationEnabled = next;
  if(next){
    // Lần đầu bật: đặt mốc rotation = đầu tuần này
    if(!userData.rotationStartDate) userData.rotationStartDate = _mondayOfWeek(Date.now());
    // Khởi tạo shiftRotation mặc định = thứ tự tăng dần [1,2,3,...]
    const shifts = setupShifts || userData.shifts || 1;
    const cycleWeeks = Math.max(1, Math.min(8, Number(userData.weeksPerCycle) || shifts));
    if(!Array.isArray(userData.shiftRotation) || !userData.shiftRotation.length){
      const seq = [];
      for(let i = 0; i < cycleWeeks; i++) seq.push((i % shifts) + 1);
      userData.shiftRotation = seq;
    }
  }
  saveUser();
  renderShiftRotationSection();
  // Đồng bộ currentShift hiển thị + native
  if(typeof renderSetupCurShift === 'function') renderSetupCurShift();
  if(typeof updateClock === 'function') updateClock();
  if(typeof window.rescheduleNativeNotifications === 'function') window.rescheduleNativeNotifications();
  if(typeof gpsSyncNativeNow === 'function') gpsSyncNativeNow();
}
window.onToggleShiftRotation = onToggleShiftRotation;

/** User chọn ca cho tuần thứ w (0-based) trong chu kỳ */
function onRotationWeekChange(w, val){
  const shifts = setupShifts || userData.shifts || 1;
  const cycleWeeks = Math.max(1, Math.min(8, Number(userData.weeksPerCycle) || shifts));
  let rotation = Array.isArray(userData.shiftRotation) ? userData.shiftRotation.slice() : [];
  while(rotation.length < cycleWeeks) rotation.push(((rotation.length) % shifts) + 1);
  rotation[w] = Math.max(1, Math.min(shifts, Number(val) || 1));
  userData.shiftRotation = rotation.slice(0, cycleWeeks);
  saveUser();
  renderShiftRotationSection();
  if(typeof updateClock === 'function') updateClock();
  if(typeof window.rescheduleNativeNotifications === 'function') window.rescheduleNativeNotifications();
  if(typeof gpsSyncNativeNow === 'function') gpsSyncNativeNow();
}
window.onRotationWeekChange = onRotationWeekChange;

/** Cập nhật userData.shiftTimes khi user đổi giờ vào/ra trong panel Setup */
function onSetupShiftTimeChange(){
  const shifts = setupShifts || userData.shifts || 1;
  const shiftTimes = [];
  for(let i = 0; i < shifts; i++){
    const inEl  = document.getElementById('setupSIn'+i);
    const outEl = document.getElementById('setupSOut'+i);
    shiftTimes.push({
      in:  inEl  ? inEl.value  : '08:00',
      out: outEl ? outEl.value : '17:00'
    });
  }
  userData.shifts = shifts;
  if(!userData.currentShift || userData.currentShift > shifts){
    userData.currentShift = 1;
    setupCurShift = 1;
  }
  userData.shiftTimes = shiftTimes;
  saveUser();
  updateClock();
  if(typeof renderHomeStats === 'function') renderHomeStats();
  // Re-schedule native notifications khi shift times thay đổi
  if(typeof window.rescheduleNativeNotifications === 'function'){
    window.rescheduleNativeNotifications();
  }
  if(typeof gpsSyncNativeNow === 'function') gpsSyncNativeNow();
}

/** Người dùng chọn tuần này làm ca nào (trong panel Setup) */
let setupCurShift = 1;
function selCurShift(n, el){
  setupCurShift = n;
  userData.currentShift = n;
  selNumBtn(el);
  saveUser();
  updateClock();
  // Re-schedule notifications vì giờ vào/ra ca có thể đổi
  if(typeof window.rescheduleNativeNotifications === 'function'){
    window.rescheduleNativeNotifications();
  }
  if(typeof gpsSyncNativeNow === 'function') gpsSyncNativeNow();
}

/** Render ô "Tuần này làm ca nào" trong panel Setup theo số ca đã chọn */
function renderSetupCurShift(){
  const block = document.getElementById('setupCurShiftBlock');
  const grid  = document.getElementById('setupCurShiftGrid');
  if(!block || !grid) return;
  if(setupShifts < 2){
    block.style.display = 'none';
    return;
  }
  block.style.display = '';
  // Layout: 2 nút thì 2 cột, 3 nút thì 3 cột, 4 nút thì 4 cột
  grid.style.gridTemplateColumns = `repeat(${setupShifts},1fr)`;
  const L = userData.lang || 'vi';
  const shiftLbl = {vi:'Ca',en:'Shift',ko:'교대',ja:'シフト',zh:'班',my:'ဆင်း',th:'กะ',id:'Shift',ph:'Shift',ne:'सिफ्ट',hi:'शिफ्ट'}[L] || 'Ca';
  let btns = '';
  for(let i = 1; i <= setupShifts; i++){
    btns += `<div class="num-btn${i===setupCurShift?' sel':''}" onclick="selCurShift(${i},this)">${shiftLbl} ${i}</div>`;
  }
  grid.innerHTML = btns;
}

/** Chọn số giờ mỗi ca */
function selHours(h,el){
  setupHours=h;
  userData.hoursPerShift=h;
  selNumBtn(el);
  // Cập nhật cả 2 input custom (onboarding + settings)
  const customInput = document.getElementById('ob3HoursCustom');
  if(customInput) customInput.value = h;
  const setupInput = document.getElementById('setupHoursCustom');
  if(setupInput) setupInput.value = h;
  // Lưu nếu đang ở panel Setup (sửa từ Settings)
  const setupPanel = document.getElementById('panelSetup');
  if(setupPanel && setupPanel.classList.contains('open')){
    saveUser();
    if(typeof renderHomeStats === 'function') renderHomeStats();
  }
}

/** Nhập số giờ tùy chỉnh (vd: 8.5, 9, 11 giờ...) */
function selHoursCustom(val){
  const h = parseFloat(val);
  if(isNaN(h) || h <= 0 || h > 24) return;
  setupHours = h;
  userData.hoursPerShift = h;
  // Bỏ chọn các nút preset nếu giá trị custom không khớp
  const grid = document.getElementById('ob3HoursGrid');
  if(grid){
    const presets = [6, 7, 8, 10, 12];
    grid.querySelectorAll('.num-btn').forEach((btn, idx) => {
      if(presets[idx] === h) btn.classList.add('sel');
      else btn.classList.remove('sel');
    });
  }
}

/** Nhập giờ tùy chỉnh ở panel Cài đặt (Settings) */
function selHoursCustomSetup(val){
  const h = parseFloat(val);
  if(isNaN(h) || h <= 0 || h > 24) return;
  setupHours = h;
  userData.hoursPerShift = h;
  saveUser();
  // Bỏ chọn nút preset nếu không khớp
  const grid = document.getElementById('setupHoursGrid');
  if(grid){
    const presets = [6, 7, 8, 10, 12];
    grid.querySelectorAll('.num-btn').forEach((btn, idx) => {
      if(presets[idx] === h) btn.classList.add('sel');
      else btn.classList.remove('sel');
    });
  }
  // Cập nhật stats nếu home đang mở
  if(typeof renderHomeStats === 'function') renderHomeStats();
}

