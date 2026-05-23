/* ===== GIAO DIỆN & CHỈNH SỬA THEME ===== */
/** Hiển thị grid các chấm màu theme để người dùng chọn */
function renderColorGrid(){
  const grid=document.getElementById('colorGrid');
  grid.innerHTML=THEMES.map((t,i)=>`
    <div class="color-dot${apCfg.color===i?' sel':''}" style="background:${t.bg}" onclick="selColor(${i})" title="${t.name}"></div>
  `).join('');
}
/** Chọn màu theme, lưu và apply ngay */
function selColor(i){
  apCfg.color=i;saveAp();applyTheme(i);renderColorGrid();
}
/** Inject CSS variables cho màu theme vào <head> */
function applyTheme(i){
  const t=THEMES[i]||THEMES[0];
  let st=document.getElementById('dynTheme');
  if(!st){st=document.createElement('style');st.id='dynTheme';document.head.appendChild(st);}
  st.textContent=`:root{--ac:${t.bg};--ac2:${t.bg};--ac-lt:${t.lt};}`;
}
async function uploadAvt(inp){
  if(!inp.files[0])return;
  const fr=new FileReader();
  fr.onload=e=>{
    apCfg.avtB64=e.target.result;saveAp();
    document.getElementById('apAvtPrev').innerHTML=`<img src="${e.target.result}">`;
    document.getElementById('homeAvt').innerHTML=`<img src="${e.target.result}">`;
  };
  fr.readAsDataURL(inp.files[0]);
}
const GRADIENTS=[
  {id:'none',label:'Không',css:'',preview:'#F4F7F6'},
  {id:'g1',label:'Bình minh',css:'linear-gradient(135deg,#f9a825,#e91e63)'},
  {id:'g2',label:'Biển',css:'linear-gradient(135deg,#0288d1,#26c6da)'},
  {id:'g3',label:'Rừng',css:'linear-gradient(135deg,#1b5e20,#66bb6a)'},
  {id:'g4',label:'Hoàng hôn',css:'linear-gradient(135deg,#ff6f00,#ad1457)'},
  {id:'g5',label:'Tím',css:'linear-gradient(135deg,#4a148c,#e91e63)'},
  {id:'g6',label:'Mint',css:'linear-gradient(135deg,#00695c,#80cbc4)'},
  {id:'g7',label:'Đêm',css:'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)'},
  {id:'g8',label:'Hồng',css:'linear-gradient(135deg,#f06292,#fff9c4)'},
];

/** Hiển thị các ô gradient preset để chọn nền lịch */
function renderGradientGrid(){
  const grid=document.getElementById('gradientGrid');
  if(!grid)return;
  grid.innerHTML=GRADIENTS.map(g=>{
    const isSel=(!apCfg.bgB64&&apCfg.bgGrad===g.css)||(g.id==='none'&&!apCfg.bgB64&&!apCfg.bgGrad);
    const preview=g.css||g.preview;
    return`<div onclick="selectGradient('${g.id}','${g.css.replace(/'/g,"\\'")}')" style="width:52px;height:40px;border-radius:10px;cursor:pointer;border:3px solid ${isSel?'var(--text)':'transparent'};background:${preview};transition:all .15s;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center" title="${g.label}">${g.id==='none'?'<span style="font-size:16px">✕</span>':''}</div>`;
  }).join('');
}

function selectGradient(id,css){
  apCfg.bgGrad=css;
  if(id==='none'){apCfg.bgGrad='';apCfg.bgB64='';}
  saveAp();applyCalBg();renderGradientGrid();updateBgPreview();
}

const _WRAP_BASE='margin:0 8px;margin-top:-60px;border-radius:20px;overflow:hidden;';

/** Apply ảnh nền hoặc gradient lên calendar wrap, đổi màu text cho dễ đọc */
function applyCalBg(){
  const wrap=document.getElementById('calBigWrap');
  if(!wrap) return; // not on calendar screen yet

  if(apCfg.bgB64){
    // Photo background
    wrap.setAttribute('style',
      _WRAP_BASE +
      `box-shadow:var(--shadow);position:relative;z-index:2;` +
      `background-image:url(${apCfg.bgB64});` +
      `background-size:cover;background-position:center top;` +
      `background-color:#333`
    );
    _applyCalTextWhite(true);
  } else if(apCfg.bgGrad){
    // Gradient background
    wrap.setAttribute('style',
      _WRAP_BASE +
      `box-shadow:var(--shadow);position:relative;z-index:2;` +
      `background:${apCfg.bgGrad}`
    );
    _applyCalTextWhite(true);
  } else {
    // Default white
    wrap.setAttribute('style',
      _WRAP_BASE +
      `box-shadow:var(--shadow);position:relative;z-index:2;background:white`
    );
    _applyCalTextWhite(false);
  }
}

/** Đổi màu chữ/nút trong lịch sang trắng (khi có ảnh nền) hoặc về mặc định */
function _applyCalTextWhite(white){
  const month=document.getElementById('calBigMonth');
  const dow=document.getElementById('calDow');
  const prev=document.getElementById('calNavPrev');
  const next=document.getElementById('calNavNext');
  if(!month&&!dow)return; // calendar not rendered yet, skip
  if(white){
    if(month) month.style.cssText='color:white;text-shadow:0 1px 6px rgba(0,0,0,.5)';
    if(dow) dow.querySelectorAll('span').forEach(s=>{
      s.style.color='rgba(255,255,255,.9)';s.style.textShadow='0 1px 4px rgba(0,0,0,.6)';
    });
    if(prev) prev.style.cssText='width:32px;height:32px;border-radius:50%;border:1.5px solid rgba(255,255,255,.5);background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;font-weight:700;color:white;backdrop-filter:blur(4px)';
    if(next) next.style.cssText='width:32px;height:32px;border-radius:50%;border:1.5px solid rgba(255,255,255,.5);background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;font-weight:700;color:white;backdrop-filter:blur(4px)';
    document.querySelectorAll('#calBigDays .cal-day').forEach(d=>{
      if(!d.classList.contains('today')&&!d.classList.contains('cm')&&
         !d.classList.contains('vang')&&!d.classList.contains('np')&&
         !d.classList.contains('ll')&&!d.classList.contains('empty')){
        d.style.background='rgba(255,255,255,.2)';
        d.style.color='white';
        d.style.textShadow='0 1px 3px rgba(0,0,0,.5)';
      }
    });
  } else {
    if(month) month.style.cssText='';
    if(dow) dow.querySelectorAll('span').forEach(s=>{s.style.cssText='';});
    if(prev) prev.style.cssText='';
    if(next) next.style.cssText='';
    document.querySelectorAll('#calBigDays .cal-day').forEach(d=>{
      d.style.background='';d.style.color='';d.style.textShadow='';
    });
  }
}

/** Cập nhật preview ảnh nền trong panel Giao diện */
function updateBgPreview(){
  const prev=document.getElementById('apBgPreview');
  const txt=document.getElementById('apBgPreviewTxt');
  if(!prev)return;
  if(apCfg.bgB64){
    prev.style.backgroundImage=`url(${apCfg.bgB64})`;
    prev.style.backgroundSize='cover';prev.style.backgroundPosition='center';
    if(txt)txt.style.display='none';
  }else if(apCfg.bgGrad){
    prev.style.backgroundImage='';prev.style.background=apCfg.bgGrad;
    const _gradTxt={vi:'Màu gradient',en:'Gradient color',ko:'그라데이션',ja:'グラデーション',zh:'渐变色',my:'Gradient',th:'สีไล่โทน',id:'Warna gradasi',ph:'Gradient na kulay',ne:'ग्रेडियन्ट रंग',hi:'ग्रेडिएंट रंग'}[userData.lang||'vi']||'Màu gradient';
    if(txt){txt.style.display='';txt.textContent=_gradTxt;txt.style.color='white';}
  }else{
    prev.style.backgroundImage='';prev.style.background='#F4F7F6';
    const _noBgTxt={vi:'Chưa có ảnh nền',en:'No background image',ko:'배경 이미지 없음',ja:'背景画像なし',zh:'无背景图片',my:'နောက်ခံပုံမရှိ',th:'ไม่มีภาพพื้นหลัง',id:'Tidak ada gambar latar',ph:'Walang background',ne:'पृष्ठभूमि छैन',hi:'कोई पृष्ठभूमि नहीं'}[userData.lang||'vi']||'Chưa có ảnh nền';
    if(txt){txt.style.display='';txt.textContent=_noBgTxt;txt.style.color='var(--text3)';}
  }
}

async function uploadBg(inp){
  if(!inp.files[0])return;
  const fr=new FileReader();
  fr.onload=e=>{
    apCfg.bgB64=e.target.result;apCfg.bgGrad='';
    saveAp();applyCalBg();updateBgPreview();renderGradientGrid();
  };
  fr.readAsDataURL(inp.files[0]);
}
function clearBg(){apCfg.bgB64='';apCfg.bgGrad='';saveAp();applyCalBg();updateBgPreview();renderGradientGrid();}

/* ========== CALENDAR TEXT COLORS ========== */
function onCalColorChange(){
  const sun=document.getElementById('sunColorPick')?.value||'#E8433A';
  const sat=document.getElementById('satColorPick')?.value||'#2D7DD2';
  const norm=document.getElementById('normColorPick')?.value||'#1A2332';
  const sd=document.getElementById('sunColorShow');if(sd)sd.style.background=sun;
  const satd=document.getElementById('satColorShow');if(satd)satd.style.background=sat;
  const nd=document.getElementById('normColorShow');if(nd)nd.style.background=norm;
  const she=document.getElementById('sunColorHex');if(she)she.textContent=sun;
  const sathe=document.getElementById('satColorHex');if(sathe)sathe.textContent=sat;
  const nhe=document.getElementById('normColorHex');if(nhe)nhe.textContent=norm;
  const ps=document.getElementById('previewSun');if(ps)ps.style.color=sun;
  const psat=document.getElementById('previewSat');if(psat)psat.style.color=sat;
}
function resetCalColors(){
  const sp=document.getElementById('sunColorPick');if(sp)sp.value='#E8433A';
  const satp=document.getElementById('satColorPick');if(satp)satp.value='#2D7DD2';
  const np=document.getElementById('normColorPick');if(np)np.value='#1A2332';
  onCalColorChange();
}
/** Lưu tất cả cài đặt giao diện và apply ngay */
function saveAppearance(){
  apCfg.calSun=document.getElementById('sunColorPick')?.value||'#E8433A';
  apCfg.calSat=document.getElementById('satColorPick')?.value||'#2D7DD2';
  apCfg.calNorm=document.getElementById('normColorPick')?.value||'#1A2332';
  saveAp();applyCalColors();renderCalBig();closePanel('panelAppearance');
}
/** Inject CSS động cho màu chữ ngày CN/T7/thường trong lịch */
function applyCalColors(){
  let st=document.getElementById('dynCalColors');
  if(!st){st=document.createElement('style');st.id='dynCalColors';document.head.appendChild(st);}
  const sun=apCfg.calSun||'#E8433A';
  const sat=apCfg.calSat||'#2D7DD2';
  const norm=apCfg.calNorm||'#1A2332';
  st.textContent=`
    .cal-dow .sun{color:${sun}!important}
    .cal-dow .sat{color:${sat}!important}
    .cal-day.sun:not(.today):not(.cm):not(.vang):not(.np):not(.ll):not(.le){color:${sun}!important}
    .cal-day.sat:not(.today):not(.cm):not(.vang):not(.np):not(.ll):not(.le){color:${sat}!important}
    .cal-day:not(.sun):not(.sat):not(.today):not(.cm):not(.vang):not(.np):not(.ll):not(.empty):not(.ct):not(.le){color:${norm}!important}
  `;
}
function syncAppearancePickers(){
  const sp=document.getElementById('sunColorPick');if(sp)sp.value=apCfg.calSun||'#E8433A';
  const satp=document.getElementById('satColorPick');if(satp)satp.value=apCfg.calSat||'#2D7DD2';
  const np=document.getElementById('normColorPick');if(np)np.value=apCfg.calNorm||'#1A2332';
  onCalColorChange();
}

