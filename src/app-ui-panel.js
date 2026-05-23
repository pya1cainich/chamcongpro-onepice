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

