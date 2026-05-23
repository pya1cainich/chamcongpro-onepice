/* ===== LỊCH CHẤM CÔNG ===== */
/** Vẽ lịch tháng: header, các ô ngày với màu trạng thái chấm công */
function renderCalBig(){
  const {y,m}=calView;
  const _cm = MONTHS[m] || (()=>{const L=userData.lang||'vi';return ['zh','ja'].includes(L)?`${m+1}月`:L==='ko'?`${m+1}월`:`Tháng ${m+1}`;})();
  document.getElementById('calBigMonth').textContent=`${_cm} ${y}`;
  document.getElementById('calScreenSub').textContent=`${_cm}, ${y}`;
  const grid=document.getElementById('calBigDays');
  grid.innerHTML='';
  const fd=new Date(y,m,1).getDay();
  const nd=new Date(y,m+1,0).getDate();
  const hn=new Date();
  for(let i=0;i<fd;i++){const d=document.createElement('div');d.className='cal-day empty';grid.appendChild(d);}
  for(let g=1;g<=nd;g++){
    const thu=(fd+g-1)%7;
    const k=`${y}-${m}-${g}`;
    const rec=attData[k];
    const isToday=g===hn.getDate()&&m===hn.getMonth()&&y===hn.getFullYear();
    const nl=gNL(y,m,g);
    let cls='cal-day';
    if(thu===0)cls+=' sun';if(thu===6)cls+=' sat';
    if(isToday)cls+=' today';
    else if(rec){
      if(rec.type==='cm')cls+=' cm';
      else if(rec.type==='vang')cls+=' vang';
      else if(rec.type==='np')cls+=' np';
      else if(rec.type==='ll')cls+=' ll';
    }else if(nl&&!rec){cls+=' le';}
    else if(thu===0||thu===6){cls+=' ct';}
    const d=document.createElement('div');
    d.className=cls;


    // === Nội dung ô lịch: DUAL JOB support ===
    const hasMain = rec && rec.type === 'cm' && rec.in;
    const hasSub  = rec && rec.sub && rec.sub.in;
    const hasBoth = hasMain && hasSub;

    const statusIcon={cm:'\u2713',vang:'\u2715',np:'\u2600',ll:'\u2605'}[rec?.type]||'';
    let timeStr='';
    if(rec?.in&&rec?.out) timeStr=rec.in+'\u2013'+rec.out;
    else if(rec?.in)      timeStr='\u2192'+rec.in;
    else if(rec?.out)     timeStr=rec.out+'\u2190';

    let subTimeStr = '';
    if(hasSub){
      if(rec.sub.in && rec.sub.out) subTimeStr = rec.sub.in+'\u2013'+rec.sub.out;
      else if(rec.sub.in) subTimeStr = '\u2192'+rec.sub.in;
    }

    // GPS badge
    const gpsCoord = (_gpsData && _gpsData.lat && _gpsData.lng);
    const gpsIcon = (rec && (rec.in||rec.out) && gpsCoord) ? '<div style="font-size:7px;color:#2D7DD2;line-height:1">\ud83d\udccd</div>' : '';

    let inner = '';

    if(hasBoth){
      // CẢ 2 JOB: chia ô 3 phần: ngày / giờ chính / giờ phụ
      d.classList.add('dual-job-day');
      const mainLabel = u('job.main');
      const subLabelRaw = (userData?.subJob?.name || u('job.sub'));
      const mainTime = timeStr || ((rec.in||'') + (rec.out ? '–'+rec.out : ''));
      const subTime = subTimeStr || ((rec.sub.in||'') + (rec.sub.out ? '–'+rec.sub.out : ''));
      // Dùng nhãn thật ngắn để toàn bộ nội dung vừa trong ô lịch.
      const mainShort = 'CHÍNH';
      const subShort = 'PHỤ';
      inner = `<div class="dual-job-box" title="${mainLabel}: ${mainTime} | ${subLabelRaw}: ${subTime}">` +
        `<div class="dual-job-date-row">` +
          `<span class="dual-job-daynum">${g}</span>` +
          `<span class="dual-job-status">✓</span>` +
        `</div>` +
        `<div class="dual-job-work dual-job-main">` +
          `<span class="dual-job-icon">✓</span>` +
          `<div class="dual-job-lines">` +
            `<div class="dual-job-title">${mainShort}</div>` +
            `<div class="dual-job-time">${mainTime}</div>` +
          `</div>` +
        `</div>` +
        `<div class="dual-job-work dual-job-sub">` +
          `<span class="dual-job-icon">💼</span>` +
          `<div class="dual-job-lines">` +
            `<div class="dual-job-title">${subShort}</div>` +
            `<div class="dual-job-time">${subTime}</div>` +
          `</div>` +
        `</div>` +
      `</div>`;
    } else if(hasSub && !hasMain){
      // CHỈ JOB PHỤ: nền tím
      d.style.background = '#f0ebff';
      d.style.borderLeft = '3px solid #7B5EA7';
      inner = `<div class="d-num" style="color:#7B5EA7">${g}</div>`;
      inner += `<div class="d-icon" style="color:#7B5EA7">\ud83d\udcbc</div>`;
      if(subTimeStr) inner += `<div class="d-time" style="color:#7B5EA7;font-size:10px">${subTimeStr}</div>`;
    } else if(rec){
      // JOB CHÍNH hoặc trạng thái khác (giữ nguyên)
      inner = `<div class="d-num">${g}</div>`;
      if(statusIcon) inner+=`<div class="d-icon">${statusIcon}</div>`;
      if(timeStr)    inner+=`<div class="d-time">${timeStr}</div>`;
      if(gpsIcon)    inner+=gpsIcon;
    } else if(nl){
      inner = `<div class="d-num">${g}</div>`;
      inner+=`<div class="d-holiday">${nl.substring(0,8)}</div>`;
    } else {
      inner = `<div class="d-num">${g}</div>`;
    }

    d.innerHTML=inner;
    d.onclick=()=>dayTap(g);
    grid.appendChild(d);
  }
  // Day list
  renderCalDayList();
  // Re-apply background after days rendered
  requestAnimationFrame(()=>requestAnimationFrame(applyCalBg));
}
/** Chuyển tháng trên lịch (dir: -1=trước, +1=sau) */
function calChange(dir){calView.m+=dir;if(calView.m>11){calView.m=0;calView.y++;}if(calView.m<0){calView.m=11;calView.y--;}renderCalBig();}
/** Hiển thị danh sách các ngày có chấm công trong tháng */
function renderCalDayList(){
  const {y,m}=calView;
  const nd=new Date(y,m+1,0).getDate();
  const list=document.getElementById('calDayList');
  list.innerHTML='';
  const hasSub = userData.subJob && userData.subJob.active;
  const subName = (userData.subJob?.name || u('job.sub')).substring(0,8);
  let count=0;

  for(let g=nd;g>=1&&count<15;g--){
    const k=`${y}-${m}-${g}`;
    const rec=attData[k];
    if(!rec)continue;
    count++;

    const dayName = DAYS[(new Date(y,m,g).getDay())];
    const hasMainTime = rec.in || rec.out;
    const hasSubTime  = rec.sub && (rec.sub.in || rec.sub.out);
    const mainTime = rec.in && rec.out ? `${rec.in} – ${rec.out}` : rec.in ? `→ ${rec.in}` : '';
    const subTime  = hasSubTime ? (rec.sub.in && rec.sub.out ? `${rec.sub.in} – ${rec.sub.out}` : `→ ${rec.sub.in||''}`) : '';

    const el=document.createElement('div');
    el.style.cssText='display:flex;background:white;border-radius:14px;margin-bottom:8px;box-shadow:0 2px 8px rgba(0,0,0,.06);overflow:hidden;min-height:56px';
    el.onclick=()=>dayTap(g);

    // === CỘT 1: Ngày tháng (nền xám nhạt, bên trái) ===
    const colDate = `<div style="width:60px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f5f5f5;padding:8px 4px">
      <div style="font-size:18px;font-weight:900;color:var(--text);line-height:1">${g}</div>
      <div style="font-size:10px;color:var(--text3);font-weight:600;margin-top:2px">${dayName}</div>
    </div>`;

    // === CỘT 2: Job chính (nền xanh nhạt) ===
    let colMain = '';
    if(hasMainTime || rec.type){
      const statusIcon = {cm:'✓',vang:'✕',np:'☀',ll:'★'}[rec.type]||'';
      colMain = `<div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:8px 10px;background:#f0faf5;border-left:3px solid var(--ac)">
        <div style="font-size:10px;font-weight:800;color:var(--ac);margin-bottom:2px">${statusIcon} ${u('job.main')}</div>
        <div style="font-size:13px;font-weight:700;color:#0a6644">${mainTime || '—'}</div>
      </div>`;
    } else {
      colMain = `<div style="flex:1;display:flex;align-items:center;justify-content:center;padding:8px;color:#ccc;font-size:11px">—</div>`;
    }

    // === CỘT 3: Job phụ (nền tím nhạt) — chỉ hiện khi có sub job active ===
    let colSub = '';
    if(hasSub){
      if(hasSubTime){
        colSub = `<div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:8px 10px;background:#f0ebff;border-left:3px solid #7B5EA7">
          <div style="font-size:10px;font-weight:800;color:#7B5EA7;margin-bottom:2px">💼 ${subName}</div>
          <div style="font-size:13px;font-weight:700;color:#5a3e8e">${subTime}</div>
        </div>`;
      } else {
        colSub = `<div style="flex:1;display:flex;align-items:center;justify-content:center;padding:8px;background:#faf8ff;color:#c8b4f0;font-size:11px">—</div>`;
      }
    }

    el.innerHTML = colDate + colMain + colSub;
    list.appendChild(el);
  }

  const _emptyTxt=(TRAN[userData.lang||'vi']||TRAN.vi).calEmpty||'Chưa có dữ liệu tháng này';
  if(count===0){list.innerHTML='<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-txt">'+_emptyTxt+'</div></div>';}
}
function dayTap(g){const {y,m}=calView;openDayPanel(g,y,m);}

function legacyHolidayLabel(langPack){
  if(langPack && (langPack.lamLe || langPack.chipLL)) return langPack.lamLe || langPack.chipLL;
  try{ if(typeof u === 'function') return u('salary.holiday'); }catch(e){}
  return 'Holiday work';
}

/* ===== XUẤT FILE EXCEL ===== */
/** Hiển thị bảng xem trước dữ liệu Excel trước khi xuất */
function renderExcelPreview(){
  const {y,m}=calView;
  const nd=new Date(y,m+1,0).getDate();
  const _t2=getLang();
  const STATUS={cm:_t2.coMat||'Có mặt',vang:_t2.vang||'Vắng',np:_t2.nghiPhep||'Nghỉ phép',ll:legacyHolidayLabel(_t2)};
  const CLS={cm:'cm',vang:'vg',np:'',ll:''};
  const _hdr={vi:['Ngày','Thứ','Trạng thái','Vào','Ra'],en:['Date','Day','Status','In','Out'],ko:['날짜','요일','상태','출근','퇴근'],ja:['日付','曜日','状態','出勤','退勤'],zh:['日期','星期','状态','上班','下班'],my:['ရက်','နေ့','အခြေ','တက်','ဆင်'],th:['วันที่','วัน','สถานะ','เข้า','ออก'],id:['Tanggal','Hari','Status','Masuk','Keluar'],ph:['Petsa','Araw','Katayuan','Pasok','Labas'],ne:['मिति','बार','अवस्था','प्रवेश','निस्किने'],hi:['तारीख','दिन','स्थिति','प्रवेश','प्रस्थान']}[userData.lang||'vi']||['Ngày','Thứ','Trạng thái','Vào','Ra'];
  let rows=`<div class="excel-row head">${_hdr.map(h=>'<div class="excel-cell">'+h+'</div>').join('')}</div>`;
  let count=0;
  for(let g=1;g<=nd&&count<8;g++){
    const k=`${y}-${m}-${g}`;const rec=attData[k];if(!rec)continue;count++;
    const thu=DAYS[new Date(y,m,g).getDay()];
    const lbl=STATUS[rec.type]||rec.type;
    const cls=CLS[rec.type]||'';
    rows+=`<div class="excel-row"><div class="excel-cell">${g}/${m+1}</div><div class="excel-cell">${thu}</div><div class="excel-cell ${cls}">${lbl}</div><div class="excel-cell">${rec.in||''}</div><div class="excel-cell">${rec.out||''}</div></div>`;
  }
  const _noData=(TRAN[userData.lang||'vi']||TRAN.vi).noData||'Chưa có dữ liệu';
  if(count===0)rows+='<div style="padding:16px;text-align:center;color:var(--text3);font-size:13px">'+_noData+'</div>';
  document.getElementById('excelPreview').innerHTML=rows;
}
/** Xuất file CSV (mở được bằng Excel). Thêm BOM để Excel đọc được tiếng Việt */
function doExport(){
  const {y,m}=calView;const nd=new Date(y,m+1,0).getDate();
  const _t3=getLang();
  const STATUS={cm:_t3.coMat||'Có mặt',vang:_t3.vang||'Vắng',np:_t3.nghiPhep||'Nghỉ phép',ll:legacyHolidayLabel(_t3)};
  // CSV header với cột Vị trí GPS
  const _csvHdr={
    vi:'Ngày,Thứ,Trạng thái,Giờ vào,Giờ ra,Số giờ,Vị trí GPS',
    en:'Date,Day,Status,In,Out,Hours,GPS Location',
    ko:'날짜,요일,상태,출근,퇴근,시간,GPS 위치',
    ja:'日付,曜日,状態,出勤,退勤,時間,GPS位置',
    zh:'日期,星期,状态,上班,下班,时长,GPS位置',
    my:'ရက်,နေ့,အခြေ,တက်,ဆင်,ချိန်,GPS တည်နေရာ',th:'วันที่,วัน,สถานะ,เข้า,ออก,ชั่วโมง,GPS',id:'Tanggal,Hari,Status,Masuk,Keluar,Jam,GPS',ph:'Petsa,Araw,Katayuan,Pasok,Labas,Oras,GPS',ne:'मिति,बार,अवस्था,प्रवेश,निस्किने,घण्टा,GPS',hi:'तारीख,दिन,स्थिति,प्रवेश,प्रस्थान,घंटे,GPS'
  }[userData.lang||'vi']||'Ngày,Thứ,Trạng thái,Giờ vào,Giờ ra,Số giờ,Vị trí GPS';
  let csv=_csvHdr+'\n';
  // Lấy tọa độ GPS đã lưu (nếu có)
  const gpsCoord = (_gpsData && _gpsData.lat && _gpsData.lng)
    ? `${_gpsData.lat.toFixed(6)}, ${_gpsData.lng.toFixed(6)}`
    : '';
  for(let g=1;g<=nd;g++){
    const k=`${y}-${m}-${g}`;const rec=attData[k];
    const thu=DAYS[new Date(y,m,g).getDay()];
    const lbl=rec?STATUS[rec.type]||'':'';
    const ins=rec?.in||'',outs=rec?.out||'';
    let dur='';
    if(ins&&outs)dur=(((timeToMin(outs)-timeToMin(ins)+1440)%1440)/60).toFixed(1);
    // Cột vị trí: chỉ ghi tọa độ nếu ngày đó có chấm công
    const loc = (ins || outs) ? `"${gpsCoord}"` : '';
    csv+=`${g}/${m+1}/${y},${thu},${lbl},${ins},${outs},${dur},${loc}\n`;
  }
  const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;
  a.download='ChamCong.csv';
  document.body.appendChild(a);a.click();
  setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);},300);
  closePanel('panelExcel');
}

