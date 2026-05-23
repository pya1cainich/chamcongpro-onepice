/* ── app.js ── */
/* ════════════════════════════════════════════════════════════════════
   app.js — ỨNG DỤNG CHÍNH
   Load SAU utils.js, TRƯỚC checkin.js

   📌 HƯỚNG DẪN CHỈNH SỬA NHANH:
   ┌─────────────────────────────────────────────────────────────┐
   │ Đổi text nút/nhãn bất kỳ:                                  │
   │   → Tìm UI_STR{} bên dưới, sửa theo key tương ứng         │
   │   → Mỗi key có đủ 11 ngôn ngữ                              │
   │                                                             │
   │ Thêm ngôn ngữ mới:                                         │
   │   1. Thêm vào LANGS[]                                       │
   │   2. Thêm block mới vào TRAN{}                              │
   │   3. Thêm key mới vào MỌI entry trong UI_STR{}             │
   │                                                             │
   │ Đổi tên quốc gia/hệ số lương:                              │
   │   → PAYROLL_RULES{} — hệ số OT/đêm/lễ                     │
   │   → TAX_RULES{} — thuế + bảo hiểm                         │
   │   → COUNTRIES[] — danh sách quốc gia chọn được             │
   │                                                             │
   │ Đổi ngày lễ quốc gia:                                      │
   │   → HOLIDAYS_BY_COUNTRY{}                                   │
   └─────────────────────────────────────────────────────────────┘
   ════════════════════════════════════════════════════════════════════ */

/* ================================================
   CHẤM CÔNG PRO v2.2 | Single-file PWA
   Đa ngôn ngữ: VN, EN, KR, JP, CN, MM
   Tính lương theo luật 6 quốc gia
   Lưu trữ: localStorage | GPS Geofencing
   ================================================ */

/* ===== TIỆN ÍCH DÙNG CHUNG ===== */

/** Chọn một nút trong nhóm .num-btn (xóa sel cũ, thêm sel mới) */
function selNumBtn(el){
  el.parentElement.querySelectorAll('.num-btn').forEach(b=>b.classList.remove('sel'));
  el.classList.add('sel');
}

/** Lưu dữ liệu vào localStorage (có bắt lỗi tránh crash khi bộ nhớ đầy) */
// → function lsSet(key,data){try{localStorage.setItem(key,JSON.s (moved to utils.js)

/** Đọc dữ liệu từ localStorage (trả null nếu lỗi) */
// → function lsGet(key){try{const v=localStorage.getItem(key);re (moved to utils.js)

/** Lấy object bản dịch theo ngôn ngữ hiện tại của người dùng */
function getLang(){return TRAN[userData.lang||'vi']||TRAN.vi;}

/** Định dạng số tiền theo quốc gia */
// → function fmtMoney(n,country){ (moved to utils.js)

/* ===== DỮ LIỆU NGÀY LỄ QUỐC GIA 2025-2026 ===== */
/* ===== LỊCH NGÀY LỄ THEO QUỐC GIA 2025-2026 ===== */
const HOLIDAYS_BY_COUNTRY = {
  VN: { // Việt Nam
    '2025-0-1':'Tết Dương lịch','2025-1-25':'25 Chạp','2025-1-26':'26 Chạp','2025-1-27':'27 Chạp',
    '2025-1-28':'Giao thừa','2025-1-29':'Mùng 1 Tết','2025-1-30':'Mùng 2 Tết',
    '2025-1-31':'Mùng 3 Tết','2025-2-1':'Mùng 4 Tết','2025-2-2':'Mùng 5 Tết',
    '2025-3-18':'Giỗ Tổ Hùng Vương','2025-4-30':'30/4 Giải phóng',
    '2025-4-1':'1/5 Lao động','2025-8-1':'Nghỉ bù 2/9','2025-8-2':'2/9 Quốc khánh',
    '2026-0-1':'Tết Dương lịch','2026-1-14':'27 Chạp','2026-1-15':'28 Chạp',
    '2026-1-16':'Mùng 1 Tết','2026-1-17':'Mùng 2 Tết','2026-1-18':'Mùng 3 Tết',
    '2026-1-19':'Mùng 4 Tết','2026-1-20':'Mùng 5 Tết',
    '2026-3-26':'Giỗ Tổ Hùng Vương','2026-3-30':'Bù 30/4','2026-4-1':'30/4',
    '2026-4-2':'1/5 Lao động','2026-4-3':'Bù 1/5','2026-7-31':'Bù 2/9',
    '2026-8-1':'Nghỉ 2/9','2026-8-2':'2/9 Quốc khánh'
  },
  KR: { // 한국 공휴일
    '2025-0-1':'신정','2025-0-28':'설날 연휴','2025-0-29':'설날','2025-0-30':'설날 연휴',
    '2025-2-1':'삼일절','2025-4-5':'어린이날','2025-4-6':'어린이날 대체',
    '2025-5-6':'부처님오신날','2025-5-6':'현충일','2025-7-15':'광복절',
    '2025-9-5':'추석 연휴','2025-9-6':'추석','2025-9-7':'추석 연휴','2025-9-3':'개천절',
    '2025-9-9':'한글날','2025-11-25':'크리스마스',
    '2026-0-1':'신정','2026-1-16':'설날 연휴','2026-1-17':'설날','2026-1-18':'설날 연휴',
    '2026-2-1':'삼일절','2026-4-5':'어린이날','2026-5-24':'부처님오신날',
    '2026-5-6':'현충일','2026-7-15':'광복절','2026-9-24':'추석 연휴',
    '2026-9-25':'추석','2026-9-26':'추석 연휴','2026-9-3':'개천절',
    '2026-9-9':'한글날','2026-11-25':'크리스마스'
  },
  JP: { // 日本の祝日
    '2025-0-1':'元日','2025-0-13':'成人の日','2025-1-11':'建国記念の日',
    '2025-2-20':'春分の日','2025-3-29':'昭和の日','2025-4-3':'憲法記念日',
    '2025-4-4':'みどりの日','2025-4-5':'こどもの日','2025-6-21':'海の日',
    '2025-7-11':'山の日','2025-8-15':'敬老の日','2025-8-23':'秋分の日',
    '2025-9-13':'スポーツの日','2025-10-3':'文化の日','2025-10-24':'勤労感謝の日',
    '2026-0-1':'元日','2026-0-12':'成人の日','2026-1-11':'建国記念の日',
    '2026-2-20':'春分の日','2026-3-29':'昭和の日','2026-4-3':'憲法記念日',
    '2026-4-4':'みどりの日','2026-4-5':'こどもの日','2026-6-20':'海の日',
    '2026-7-11':'山の日','2026-8-21':'敬老の日','2026-8-23':'秋分の日',
    '2026-9-12':'スポーツの日','2026-10-3':'文化の日','2026-10-23':'勤労感謝の日'
  },
  TW: { // 台灣國定假日
    '2025-0-1':'元旦','2025-0-27':'除夕','2025-0-28':'春節','2025-0-29':'春節',
    '2025-0-30':'春節','2025-1-28':'和平紀念日','2025-3-4':'兒童節',
    '2025-3-5':'清明節','2025-5-1':'端午節','2025-9-6':'中秋節',
    '2025-9-10':'國慶日','2026-0-1':'元旦','2026-1-16':'除夕',
    '2026-1-17':'春節','2026-1-18':'春節','2026-1-19':'春節',
    '2026-1-28':'和平紀念日','2026-3-4':'兒童節','2026-3-5':'清明節',
    '2026-5-20':'端午節','2026-9-25':'中秋節','2026-9-10':'國慶日'
  },
  US: { // US Federal Holidays
    '2025-0-1':'New Year Day','2025-0-20':'MLK Day','2025-1-17':'Presidents Day',
    '2025-4-26':'Memorial Day','2025-5-19':'Juneteenth','2025-6-4':'Independence Day',
    '2025-8-1':'Labor Day','2025-9-13':'Columbus Day','2025-10-11':'Veterans Day',
    '2025-10-27':'Thanksgiving','2025-11-25':'Christmas Day',
    '2026-0-1':'New Year Day','2026-0-19':'MLK Day','2026-1-16':'Presidents Day',
    '2026-4-25':'Memorial Day','2026-5-19':'Juneteenth','2026-6-4':'Independence Day',
    '2026-8-7':'Labor Day','2026-9-12':'Columbus Day','2026-10-11':'Veterans Day',
    '2026-10-26':'Thanksgiving','2026-11-25':'Christmas Day'
  },
  MY: { // မြန်မာနိုင်ငံ အများပြည်သူ ရုံးပိတ်ရက်
    '2025-0-1':'နှစ်သစ်ကူး','2025-0-4':'လွတ်လပ်ရေးနေ့',
    '2025-2-2':'တပ်မတော်နေ့','2025-3-13':'မြန်မာနှစ်ဆန်း',
    '2025-3-14':'မြန်မာနှစ်ဆန်း','2025-3-15':'မြန်မာနှစ်ဆန်း',
    '2025-4-1':'May Day','2025-6-19':'မာတာနေ့',
    '2025-7-19':'အာဇာနည်နေ့','2025-9-20':'မီးထွန်းပွဲ',
    '2025-11-25':'ခရစ္စမတ်',
    '2026-0-1':'နှစ်သစ်ကူး','2026-0-4':'လွတ်လပ်ရေးနေ့',
    '2026-2-2':'တပ်မတော်နေ့','2026-3-13':'မြန်မာနှစ်ဆန်း',
    '2026-3-14':'မြန်မာနှစ်ဆန်း','2026-3-15':'မြန်မာနှစ်ဆန်း',
    '2026-4-1':'May Day','2026-7-19':'အာဇာနည်နေ့','2026-11-25':'ခရစ္စမတ်'
  },
  TH: { // วันหยุดราชการไทย 2025–2026
    '2025-0-1':'วันขึ้นปีใหม่','2025-1-12':'มาฆบูชา','2025-3-6':'จักรีวันสี',
    '2025-3-13':'สงกรานต์','2025-3-14':'สงกรานต์','2025-3-15':'สงกรานต์',
    '2025-4-1':'วันแรงงาน','2025-4-4':'วันฉัตรมงคล','2025-4-5':'วันฉัตรมงคล',
    '2025-5-2':'วันวิสาขบูชา','2025-5-3':'ชดเชย','2025-6-1':'อาสาฬหบูชา',
    '2025-6-28':'วันเฉลิมพระชนมพรรษา ร.10','2025-7-11':'วันแม่แห่งชาติ',
    '2025-9-23':'วันปิยะมหาราช','2025-11-5':'วันพ่อแห่งชาติ',
    '2025-11-10':'วันรัฐธรรมนูญ','2025-11-31':'วันสิ้นปี',
    '2026-0-1':'วันขึ้นปีใหม่','2026-1-1':'มาฆบูชา','2026-3-6':'จักรีวันสี',
    '2026-3-13':'สงกรานต์','2026-3-14':'สงกรานต์','2026-3-15':'สงกรานต์',
    '2026-4-1':'วันแรงงาน','2026-4-4':'วันฉัตรมงคล','2026-6-28':'วันเฉลิมพระชนมพรรษา ร.10',
    '2026-7-11':'วันแม่แห่งชาติ','2026-9-23':'วันปิยะมหาราช',
    '2026-11-5':'วันพ่อแห่งชาติ','2026-11-10':'วันรัฐธรรมนูญ'
  },
  ID: { // Hari Libur Nasional Indonesia 2025–2026
    '2025-0-1':'Tahun Baru','2025-0-27':'Isra Mi\'raj','2025-0-28':'Cuti Bersama',
    '2025-0-29':'Imlek','2025-2-29':'Nyepi','2025-2-31':'Cuti Nyepi',
    '2025-3-3':'Cuti Bersama','2025-3-17':'Cuti Bersama','2025-3-18':'Idul Fitri',
    '2025-3-19':'Idul Fitri','2025-3-7':'Wafat Isa Al Masih',
    '2025-4-1':'Hari Buruh','2025-4-12':'Waisak','2025-4-13':'Cuti Bersama',
    '2025-4-29':'Kenaikan Isa','2025-5-1':'Pancasila','2025-5-6':'Idul Adha',
    '2025-5-27':'Tahun Baru Hijriyah','2025-7-17':'HUT Kemerdekaan',
    '2025-8-5':'Maulid Nabi','2025-11-25':'Natal','2025-11-26':'Cuti Natal',
    '2026-0-1':'Tahun Baru','2026-1-17':'Imlek','2026-1-26':'Isra Mi\'raj',
    '2026-2-19':'Nyepi','2026-3-27':'Wafat Isa Al Masih','2026-4-1':'Hari Buruh',
    '2026-4-6':'Idul Fitri','2026-4-7':'Idul Fitri','2026-4-8':'Cuti Bersama',
    '2026-5-1':'Waisak','2026-5-1':'Pancasila','2026-5-14':'Kenaikan Isa',
    '2026-5-26':'Idul Adha','2026-7-17':'HUT Kemerdekaan','2026-8-16':'Maulid Nabi',
    '2026-11-25':'Natal'
  },
  PH: { // Philippine Public Holidays 2025–2026
    '2025-0-1':'New Year\'s Day','2025-1-25':'EDSA Revolution',
    '2025-3-9':'Maundy Thursday','2025-3-10':'Good Friday',
    '2025-3-31':'Eid\'l Fitr','2025-3-9':'Araw ng Kagitingan',
    '2025-4-1':'Labor Day','2025-5-6':'Eid\'l Adha',
    '2025-5-12':'Independence Day','2025-7-25':'Ninoy Aquino Day',
    '2025-7-25':'National Heroes Day','2025-10-1':'All Saints Day',
    '2025-10-30':'Bonifacio Day','2025-11-7':'Immaculate Conception',
    '2025-11-25':'Christmas Day','2025-11-30':'Rizal Day',
    '2026-0-1':'New Year\'s Day','2026-1-25':'EDSA Revolution',
    '2026-2-19':'Maundy Thursday','2026-2-20':'Good Friday',
    '2026-3-9':'Araw ng Kagitingan','2026-4-1':'Labor Day',
    '2026-5-12':'Independence Day','2026-7-21':'Ninoy Aquino Day',
    '2026-7-25':'National Heroes Day','2026-10-1':'All Saints Day',
    '2026-10-30':'Bonifacio Day','2026-11-25':'Christmas Day','2026-11-30':'Rizal Day'
  },
  NP: { // Nepal Public Holidays 2025–2026 (Gregorian approx)
    '2025-0-11':'Prithvi Jayanti','2025-1-26':'Maha Shivaratri',
    '2025-2-14':'Holi','2025-3-6':'Ram Navami','2025-3-14':'Chaitra Ashtami',
    '2025-4-29':'Buddha Purnima','2025-7-11':'Gaura Parva',
    '2025-8-19':'Teej','2025-9-2':'Indra Jatra','2025-9-16':'Ghatasthapana',
    '2025-9-20':'Dashain (Phulpati)','2025-9-21':'Maha Ashtami',
    '2025-9-22':'Maha Nawami','2025-9-23':'Vijaya Dashami','2025-10-9':'Tihar Start',
    '2025-10-10':'Laxmi Puja','2025-10-11':'Gobardhan Puja','2025-10-12':'Bhai Tika',
    '2025-10-30':'Chhath Puja','2025-11-25':'Christmas',
    '2026-0-11':'Prithvi Jayanti','2026-1-15':'Maha Shivaratri','2026-2-3':'Holi',
    '2026-3-25':'Ram Navami','2026-4-19':'Buddha Purnima',
    '2026-9-12':'Dashain (Vijaya)','2026-9-29':'Tihar/Laxmi Puja','2026-11-25':'Christmas'
  },
  IN: { // Indian National Holidays 2025–2026
    '2025-0-14':'Makar Sankranti','2025-0-26':'Republic Day',
    '2025-2-14':'Holi','2025-3-6':'Ram Navami','2025-3-10':'Mahavir Jayanti',
    '2025-3-14':'Dr. Ambedkar Jayanti','2025-3-18':'Good Friday',
    '2025-4-12':'Buddha Purnima','2025-5-6':'Eid ul-Adha',
    '2025-7-15':'Independence Day','2025-7-27':'Janmashtami',
    '2025-9-2':'Gandhi Jayanti','2025-9-20':'Dussehra',
    '2025-10-10':'Diwali (Laxmi Puja)','2025-10-11':'Diwali','2025-10-13':'Bhai Dooj',
    '2025-10-5':'Guru Nanak Jayanti','2025-11-25':'Christmas',
    '2026-0-26':'Republic Day','2026-2-3':'Holi','2026-3-25':'Ram Navami',
    '2026-3-3':'Good Friday','2026-7-15':'Independence Day',
    '2026-9-2':'Gandhi Jayanti','2026-11-25':'Christmas'
  }
};
/** Lấy tên ngày lễ theo quốc gia của người dùng (an toàn khi userData chưa load) */
function gNL(n,t,g){
  const country = (typeof userData !== 'undefined' && userData.country) ? userData.country : 'VN';
  const db = HOLIDAYS_BY_COUNTRY[country] || HOLIDAYS_BY_COUNTRY.VN;
  return db[n+'-'+t+'-'+g] || null;
}
// Alias cho code cũ dùng NL trực tiếp
const NL = HOLIDAYS_BY_COUNTRY.VN;

