
/* ── utils.js ── */
/* ════════════════════════════════════════════════════════════════════
   utils.js — TIỆN ÍCH THUẦN TÚY
   Không phụ thuộc vào data (TRAN, userData, attData)
   Load TRƯỚC app.js

   📌 Chỉnh sửa:
     - Đổi định dạng tiền tệ → fmtMoney()
     - Đổi công thức thuế   → taxEngineCalculate()
     - Thêm utility mới     → thêm function vào cuối file
   ════════════════════════════════════════════════════════════════════ */

/* ── LocalStorage helpers ─────────────────────────────────────────── */
function lsGet(k){ try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch(e){return null;} }
function lsSet(k,v){ try{localStorage.setItem(k,JSON.stringify(v));}catch(e){} }
function lsRemove(k){ try{localStorage.removeItem(k);}catch(e){} }

/* ── Định dạng tiền tệ theo quốc gia ─────────────────────────────── */
function fmtMoney(n,country){
  const sym={VN:'₫',KR:'₩',JP:'¥',TW:'NT$',US:'$',MY:'K',TH:'฿',ID:'Rp',PH:'₱',NP:'रु',IN:'₹'}[country]||'₫';
  if(country==='VN')return Math.round(n).toLocaleString('vi-VN')+'₫';
  if(country==='ID')return 'Rp'+Math.round(n).toLocaleString();
  return sym+Math.round(n).toLocaleString();
}

/* ── Chuyển "HH:MM" → phút ─────────────────────────────────────── */
function timeToMin(s){ const[h,m]=s.split(':').map(Number); return h*60+m; }

/* ── Làm tròn theo rule quốc gia ─────────────────────────────────── */
function _roundTax(val,mode){ return mode==='floor'?Math.floor(val):Math.round(val*100)/100; }

/* ── Áp dụng bậc thuế lũy tiến ──────────────────────────────────── */
function _applyBrackets(income,brackets){
  let tax=0,remaining=income;
  for(const[limit,rate] of brackets){
    if(remaining<=0)break;
    const amount=Math.min(remaining,limit);
    tax+=amount*rate;
    remaining-=amount;
  }
  return tax;
}

/* ── Tính bảo hiểm hàng tháng ───────────────────────────────────── */
function _calcInsurance(rule,monthlyGross){
  if(rule.insurance.ssRate){
    const annualG=monthlyGross*12;
    const ssBase=Math.min(annualG,rule.insurance.ssCap);
    return (ssBase*rule.insurance.ssRate+annualG*rule.insurance.medicareRate)/12;
  }
  if(rule.insurance.cap) return Math.min(monthlyGross,rule.insurance.cap)*rule.insurance.rate;
  return monthlyGross*rule.insurance.rate;
}

/* ── Engine tính lương net — 11 quốc gia ────────────────────────────
   📌 TAX_RULES được định nghĩa trong app.js
   Hàm này gọi sau khi app.js đã load
   ─────────────────────────────────────────────────────────────────── */
function taxEngineCalculate(country,monthlyGross,dependents=0){
  const rule=(typeof TAX_RULES!=='undefined'&&TAX_RULES[country])?TAX_RULES[country]:TAX_RULES.VN;
  if(monthlyGross<=0)return{gross:0,insurance:0,tax:0,net:0,country,rule};
  const isAnnual=rule.period==='annual';
  const monthlyIns=_calcInsurance(rule,monthlyGross);
  const workGross=isAnnual?monthlyGross*12:monthlyGross;
  const workIns=isAnnual?monthlyIns*12:monthlyIns;
  let taxable=workGross;
  if(rule.insuranceDeductible!==false)taxable-=workIns;
  if(rule.deduction?.personal)taxable-=rule.deduction.personal;
  if(rule.deduction?.dependent)taxable-=dependents*rule.deduction.dependent;
  if(rule.deduction?.standard)taxable-=rule.deduction.standard;
  taxable=Math.max(0,taxable);
  let periodTax=_applyBrackets(taxable,rule.brackets);
  if(rule.residentTax)periodTax+=taxable*rule.residentTax;
  if(rule.localTax)periodTax+=periodTax*rule.localTax;
  const monthlyTax=isAnnual?periodTax/12:periodTax;
  return{
    gross:_roundTax(monthlyGross,rule.rounding),
    insurance:_roundTax(monthlyIns,rule.rounding),
    tax:_roundTax(monthlyTax,rule.rounding),
    net:_roundTax(monthlyGross-monthlyIns-monthlyTax,rule.rounding),
    country,rule
  };
}

/* ── Backward compat (VN cũ) ────────────────────────────────────── */
const TRAN_BH=46800000;
function tinhBH(b,v){const bb=Math.min(b,TRAN_BH);const bt=Math.min(b,20*v);return{bhxh:bb*.08,bhyt:bb*.015,bhtn:bt*.01,tong:bb*.08+bb*.015+bt*.01};}



