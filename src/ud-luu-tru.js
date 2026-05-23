/* ===== DỮ LIỆU TRẠNG THÁI APP ===== */
var userData={name:'',job:'',company:'',shifts:1,hoursPerShift:8,lang:'vi',country:'VN',salary:0,ngc:26};

/* ════════════════════════════════════════════════════════════════════
   GPS GLOBAL STATE — khai báo ở đây để app.js và checkin.js đều dùng được
   📌 Thay đổi giá trị mặc định:
     checkinMin  = 5  (phút xác nhận VÀO ca)
     checkoutMin = 75 (phút xác nhận HẾT ca)
     radius      = 15  (bán kính mặc định, mét)
   ════════════════════════════════════════════════════════════════════ */
// GPS globals — dùng var (không phải let) để tránh TDZ khi merge nhiều file
var _gpsInterval    = null;   // setInterval polling ID
var _gpsData        = {lat:null, lng:null, radius:15, enabled:false, checkinMin:5, checkoutMin:75, tightCompanyGps:false};
var _gpsWasInside   = null;   // trạng thái trong/ngoài lần poll trước (compat)
var _gpsPollMs      = 60000;  // poll mỗi 60 giây
var _gpsCheckinTimer  = null; // setTimeout chờ xác nhận vào ca
var _gpsCheckoutTimer = null; // setTimeout chờ xác nhận ra ca
// GPS v2 filter state (moved to checkin.js as var — declared here for TDZ safety)
var _gpsPositionHistory = [];
var _gpsDebounceCount   = 0;
var _gpsLastConfirmed   = null;

// Helper: lấy ms/phút từ _gpsData (người dùng điều chỉnh được qua slider)
function _gpsCheckinDelayMs()  { return ((_gpsData.checkinMin|0)||5)  * 60 * 1000; }
function _gpsCheckoutDelayMs() { return ((_gpsData.checkoutMin|0)||75)* 60 * 1000; }
function _gpsCheckinMinus()    { return (_gpsData.checkinMin|0)||5;  }
function _gpsCheckoutMinus()   { return (_gpsData.checkoutMin|0)||75; }

var attData={};// key: 'YYYY-M-D' → {type:'cm'|'vang'|'np'|'ll', in:'HH:MM', out:'HH:MM'}
let apCfg={color:0,avtB64:'',bgB64:'',bgGrad:'',calSun:'#E8433A',calSat:'#2D7DD2',calNorm:'#1A2332'};
var notifCfg={n1:true,n2:true,n3:false,n4:false};
var calView={y:new Date().getFullYear(),m:new Date().getMonth()};
var setupShifts=1,setupHours=8,ngcVal=22;
let obPage=1;
var obLang='vi',obCountry='VN';

const LANGS=[
  {id:'vi',flag:'🇻🇳',name:'Tiếng Việt'},
  {id:'en',flag:'🇺🇸',name:'English'},
  {id:'ko',flag:'🇰🇷',name:'한국어'},
  {id:'ja',flag:'🇯🇵',name:'日本語'},
  {id:'zh',flag:'🇨🇳',name:'中文'},
  {id:'my',flag:'🇲🇲',name:'မြန်မာ'},
  {id:'th',flag:'🇹🇭',name:'ภาษาไทย'},
  {id:'id',flag:'🇮🇩',name:'Bahasa Indonesia'},
  {id:'ph',flag:'🇵🇭',name:'Filipino'},
  {id:'ne',flag:'🇳🇵',name:'नेपाली'},
  {id:'hi',flag:'🇮🇳',name:'हिन्दी'},
];
const COUNTRIES=[
  {id:'VN',flag:'🇻🇳',
   name:{vi:'Việt Nam',en:'Vietnam',ko:'베트남',ja:'ベトナム',zh:'越南',my:'ဗီယက်နမ်',th:'เวียดนาม',id:'Vietnam',ph:'Vietnam',ne:'भियतनाम',hi:'वियतनाम'},
   rule:{vi:'Tăng ca ×1.5, Đêm +30%',en:'OT ×1.5, Night +30%',ko:'초과근무 ×1.5, 야간 +30%',ja:'残業 ×1.5, 深夜 +30%',zh:'加班 ×1.5, 夜班 +30%',my:'OT ×1.5, ည +30%',th:'OT ×1.5, กลางคืน +30%',id:'OT ×1.5, Malam +30%',ph:'OT ×1.5, Gabi +30%',ne:'OT ×1.5, रात +30%',hi:'OT ×1.5, रात +30%'}},
  {id:'KR',flag:'🇰🇷',
   name:{vi:'Hàn Quốc',en:'South Korea',ko:'한국',ja:'韓国',zh:'韩国',my:'တောင်ကိုရီးယား',th:'เกาหลีใต้',id:'Korea Selatan',ph:'South Korea',ne:'दक्षिण कोरिया',hi:'दक्षिण कोरिया'},
   rule:{vi:'Tăng ca ×1.5, Đêm +50%',en:'OT ×1.5, Night +50%',ko:'초과근무 ×1.5, 야간 +50%',ja:'残業 ×1.5, 深夜 +50%',zh:'加班 ×1.5, 夜班 +50%',my:'OT ×1.5, ည +50%',th:'OT ×1.5, กลางคืน +50%',id:'OT ×1.5, Malam +50%',ph:'OT ×1.5, Gabi +50%',ne:'OT ×1.5, रात +50%',hi:'OT ×1.5, रात +50%'}},
  {id:'JP',flag:'🇯🇵',
   name:{vi:'Nhật Bản',en:'Japan',ko:'일본',ja:'日本',zh:'日本',my:'ဂျပန်',th:'ญี่ปุ่น',id:'Jepang',ph:'Hapon',ne:'जापान',hi:'जापान'},
   rule:{vi:'Tăng ca ×1.25, Đêm +25%',en:'OT ×1.25, Night +25%',ko:'초과근무 ×1.25, 심야 +25%',ja:'残業 ×1.25, 深夜 +25%',zh:'加班 ×1.25, 深夜 +25%',my:'OT ×1.25, ည +25%',th:'OT ×1.25, กลางดึก +25%',id:'OT ×1.25, Malam +25%',ph:'OT ×1.25, Gabi +25%',ne:'OT ×1.25, रात +25%',hi:'OT ×1.25, रात +25%'}},
  {id:'TW',flag:'🇹🇼',
   name:{vi:'Đài Loan',en:'Taiwan',ko:'대만',ja:'台湾',zh:'台湾',my:'တိုင်ဝမ်',th:'ไต้หวัน',id:'Taiwan',ph:'Taiwan',ne:'ताइवान',hi:'ताइवान'},
   rule:{vi:'Tăng ca ×1.33→×1.67',en:'OT ×1.33→×1.67',ko:'초과근무 ×1.33→×1.67',ja:'残業 ×1.33→×1.67',zh:'加班 ×1.33→×1.67',my:'OT ×1.33→×1.67',th:'OT ×1.33→×1.67',id:'OT ×1.33→×1.67',ph:'OT ×1.33→×1.67',ne:'OT ×1.33→×1.67',hi:'OT ×1.33→×1.67'}},
  {id:'US',flag:'🇺🇸',
   name:{vi:'Hoa Kỳ',en:'United States',ko:'미국',ja:'アメリカ',zh:'美国',my:'အမေရိကန်',th:'สหรัฐอเมริกา',id:'Amerika Serikat',ph:'Estados Unidos',ne:'संयुक्त राज्य अमेरिका',hi:'संयुक्त राज्य अमेरिका'},
   rule:{vi:'Tăng ca ×1.5 (FLSA)',en:'OT ×1.5 (FLSA)',ko:'초과근무 ×1.5 (FLSA)',ja:'残業 ×1.5 (FLSA)',zh:'加班 ×1.5 (FLSA)',my:'OT ×1.5 (FLSA)',th:'OT ×1.5 (FLSA)',id:'OT ×1.5 (FLSA)',ph:'OT ×1.5 (FLSA)',ne:'OT ×1.5 (FLSA)',hi:'OT ×1.5 (FLSA)'}},
  {id:'MY',flag:'🇲🇲',
   name:{vi:'Myanmar',en:'Myanmar',ko:'미얀마',ja:'ミャンマー',zh:'缅甸',my:'မြန်မာ',th:'เมียนมา',id:'Myanmar',ph:'Myanmar',ne:'म्यानमार',hi:'म्यांमार'},
   rule:{vi:'Tăng ca ×2.0',en:'OT ×2.0',ko:'초과근무 ×2.0',ja:'残業 ×2.0',zh:'加班 ×2.0',my:'OT ×2.0',th:'OT ×2.0',id:'OT ×2.0',ph:'OT ×2.0',ne:'OT ×2.0',hi:'OT ×2.0'}},
  {id:'TH',flag:'🇹🇭',
   name:{vi:'Thái Lan',en:'Thailand',ko:'태국',ja:'タイ',zh:'泰国',my:'ထိုင်းနိုင်ငံ',th:'ประเทศไทย',id:'Thailand',ph:'Thailand',ne:'थाइल्याण्ड',hi:'थाईलैंड'},
   rule:{vi:'Tăng ca ×1.5, Lễ ×3.0',en:'OT ×1.5, Holiday ×3.0',ko:'초과근무 ×1.5, 공휴일 ×3.0',ja:'残業 ×1.5, 休日 ×3.0',zh:'加班 ×1.5, 假日 ×3.0',my:'OT ×1.5, ရုံးပိတ် ×3.0',th:'OT ×1.5, วันหยุด ×3.0',id:'OT ×1.5, Libur ×3.0',ph:'OT ×1.5, Holiday ×3.0',ne:'OT ×1.5, बिदा ×3.0',hi:'OT ×1.5, छुट्टी ×3.0'}},
  {id:'ID',flag:'🇮🇩',
   name:{vi:'Indonesia',en:'Indonesia',ko:'인도네시아',ja:'インドネシア',zh:'印度尼西亚',my:'အင်ဒိုနီးရှား',th:'อินโดนีเซีย',id:'Indonesia',ph:'Indonesia',ne:'इन्डोनेसिया',hi:'इंडोनेशिया'},
   rule:{vi:'Tăng ca ×1.5→×2.0',en:'OT ×1.5→×2.0',ko:'초과근무 ×1.5→×2.0',ja:'残業 ×1.5→×2.0',zh:'加班 ×1.5→×2.0',my:'OT ×1.5→×2.0',th:'OT ×1.5→×2.0',id:'OT ×1.5→×2.0',ph:'OT ×1.5→×2.0',ne:'OT ×1.5→×2.0',hi:'OT ×1.5→×2.0'}},
  {id:'PH',flag:'🇵🇭',
   name:{vi:'Philippines',en:'Philippines',ko:'필리핀',ja:'フィリピン',zh:'菲律宾',my:'ဖိလစ်ပိုင်',th:'ฟิลิปปินส์',id:'Filipina',ph:'Pilipinas',ne:'फिलिपिन्स',hi:'फ़िलीपींस'},
   rule:{vi:'Tăng ca ×1.25, Đêm +10%',en:'OT ×1.25, Night +10%',ko:'초과근무 ×1.25, 야간 +10%',ja:'残業 ×1.25, 深夜 +10%',zh:'加班 ×1.25, 夜班 +10%',my:'OT ×1.25, ည +10%',th:'OT ×1.25, กลางคืน +10%',id:'OT ×1.25, Malam +10%',ph:'OT ×1.25, Gabi +10%',ne:'OT ×1.25, रात +10%',hi:'OT ×1.25, रात +10%'}},
  {id:'NP',flag:'🇳🇵',
   name:{vi:'Nepal',en:'Nepal',ko:'네팔',ja:'ネパール',zh:'尼泊尔',my:'နီပေါ',th:'เนปาล',id:'Nepal',ph:'Nepal',ne:'नेपाल',hi:'नेपाल'},
   rule:{vi:'Tăng ca ×1.5, Đêm +50%',en:'OT ×1.5, Night +50%',ko:'초과근무 ×1.5, 야간 +50%',ja:'残業 ×1.5, 深夜 +50%',zh:'加班 ×1.5, 深夜 +50%',my:'OT ×1.5, ည +50%',th:'OT ×1.5, กลางคืน +50%',id:'OT ×1.5, Malam +50%',ph:'OT ×1.5, Gabi +50%',ne:'OT ×1.5, रात +50%',hi:'OT ×1.5, रात +50%'}},
  {id:'IN',flag:'🇮🇳',
   name:{vi:'Ấn Độ',en:'India',ko:'인도',ja:'インド',zh:'印度',my:'အိန္ဒိယ',th:'อินเดีย',id:'India',ph:'India',ne:'भारत',hi:'भारत'},
   rule:{vi:'Tăng ca ×2.0 (Factories Act)',en:'OT ×2.0 (Factories Act)',ko:'초과근무 ×2.0',ja:'残業 ×2.0',zh:'加班 ×2.0',my:'OT ×2.0',th:'OT ×2.0',id:'OT ×2.0',ph:'OT ×2.0',ne:'OT ×2.0',hi:'OT ×2.0'}},
];
/** Giải ngôn ngữ cho trường name/rule của COUNTRIES/PAYROLL_RULES/TAX_RULES
 *  Nhận string hoặc object {vi,en,ko,ja,zh,my} → trả về string đúng ngôn ngữ */
function cLang(field){
  if(!field) return '';
  if(typeof field === 'string') return field;
  const L = (typeof userData!=='undefined' && userData.lang) || 'vi';
  return field[L] || field.en || field.vi || Object.values(field)[0] || '';
}
const THEMES=[
  {bg:'#0D9E75',lt:'#E0F5EE',name:'Xanh lá'},
  {bg:'#2D7DD2',lt:'#EEF4FF',name:'Xanh dương'},
  {bg:'#7B5EA7',lt:'#F5F0FF',name:'Tím'},
  {bg:'#E8433A',lt:'#FFF0EF',name:'Đỏ'},
  {bg:'#F5A623',lt:'#FFF8E8',name:'Vàng'},
  {bg:'#1A2332',lt:'#F0F2F5',name:'Đen'},
];
var DAYS=window._DAYS_SHORT||['CN','T2','T3','T4','T5','T6','T7'];
var MONTHS=window._MONTHS||['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];

/* ===== ĐỌC/GHI DỮ LIỆU localStorage ===== */
/** Tải toàn bộ dữ liệu từ localStorage khi khởi động app */
function isSetupUserData(data){
  return !!(data && typeof data.name === 'string' && data.name.trim());
}
function loadStoredUserData(){
  const primary = lsGet('cp22_user');
  if(isSetupUserData(primary)) return primary;

  const backup = lsGet('cp22_user_backup');
  if(isSetupUserData(backup)){
    lsSet('cp22_user', backup);
    return backup;
  }

  return primary || backup || null;
}
function backupUserDataIfReady(){
  if(isSetupUserData(userData)) lsSet('cp22_user_backup', userData);
}
function loadData(){
  const u=loadStoredUserData();
  if(u){ userData=Object.assign(userData,u); }
  backupUserDataIfReady();
  // ── Migration: đảm bảo subJob luôn tồn tại (backward compat) ──
  if(!userData.subJob) userData.subJob = {active:false,name:'',salaryMode:'hour',salary:0,salaryDay:0,salaryHour:0};
  if(userData.subJob.active === undefined) userData.subJob.active = false;
  const a=lsGet('cp22_att');if(a)attData=a;
  const ap=lsGet('cp22_ap');if(ap)apCfg=Object.assign(apCfg,ap);
  const n=lsGet('cp22_notif');if(n)notifCfg=Object.assign(notifCfg,n);
  if(notifCfg.n3 && notifCfg.n1 === false && !notifCfg._gpsN1Migrated){
    notifCfg.n1 = true;
    notifCfg._gpsN1Migrated = true;
    saveNotif();
  }
  if(notifCfg.n1 !== true || notifCfg.n2 !== true){
    notifCfg.n1 = true;
    notifCfg.n2 = true;
    saveNotif();
  }
}
/** Lưu thông tin người dùng (tên, chức vụ, cài đặt lương) */
function saveUser(){
  lsSet('cp22_user',userData);
  backupUserDataIfReady();
}
/** Lưu dữ liệu chấm công (trạng thái từng ngày) */
/* [LEGACY_ATTENDANCE_STORE]
   Ghi chu: cp22_att/attData la so cham cong chinh dang duoc cac luong cu
   va luong GPS/native cung ghi ve. Khong xoa neu chua doi schema luu tru.
*/
function saveAtt(){lsSet('cp22_att',attData);}
/** Lưu cài đặt giao diện (màu, ảnh nền, ảnh đại diện) */
function saveAp(){lsSet('cp22_ap',apCfg);}
/** Lưu cài đặt thông báo (bật/tắt từng loại) */
function saveNotif(){lsSet('cp22_notif',notifCfg);}

