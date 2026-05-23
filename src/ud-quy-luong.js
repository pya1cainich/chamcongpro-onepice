/* ===== QUY TẮC TÍNH LƯƠNG THEO LUẬT TỪNG QUỐC GIA ===== */
const PAYROLL_RULES = {
  VN:{
    name:{vi:'Việt Nam',en:'Vietnam',ko:'베트남',ja:'ベトナム',zh:'越南',my:'ဗီယက်နမ်',th:'เวียดนาม',id:'Vietnam',ph:'Vietnam',ne:'भियतनाम',hi:'वियतनाम'}, flag:'🇻🇳', currency:'₫', currencyCode:'VND',
    normalFactor:1.0,
    otFactor:1.5, weekendOtFactor:2.0,
    nightFactor:1.3, nightOtExtra:0.2, nightIsAdditive:false,
    nightStart:22, nightEnd:6,
    holidayFactor:4.0,
    weeklyHours:48, dailyOtThreshold:8,
    basis:{vi:'Điều 98–112 BLLĐ 2019',en:'Labor Code Art.98–112 (2019)',ko:'근로기준법 제98–112조 (2019)',ja:'労働法第98–112条 (2019)',zh:'劳动法第98–112条 (2019)',my:'အလုပ်သမားဥပဒေ Art.98–112 (2019)',th:'กฎหมายแรงงาน มาตรา 98–112 (2562)',id:'UU Ketenagakerjaan Ps.98–112 (2019)',ph:'Labor Code Art.98–112 (2019)',ne:'श्रम ऐन धारा 98–112 (2019)',hi:'श्रम संहिता अनु. 98–112 (2019)'},
    tags:{
      vi:['×1.5 tăng ca ngày thường','×2.0 tăng ca Chủ nhật','×4.0 làm ngày lễ','+30% ca đêm (22h–6h)','+50% tăng ca đêm'],
      en:['×1.5 weekday OT','×2.0 Sunday OT','×4.0 public holiday','+30% night shift (10PM–6AM)','+50% night OT'],
      ko:['×1.5 평일 초과근무','×2.0 일요일 초과근무','×4.0 공휴일 근무','+30% 야간 (22h–6h)','+50% 야간 초과근무'],
      ja:['×1.5 平日残業','×2.0 日曜日出勤','×4.0 法定休日','+30% 深夜 (22h–6h)','+50% 深夜残業'],
      zh:['×1.5 平日加班','×2.0 周日加班','×4.0 法定假日','+30% 夜班 (22h–6h)','+50% 夜班加班'],
      my:['×1.5 ချိန်ကျော်','×2.0 တနင်္ဂနွေ','×4.0 ရုံးပိတ်ရက်','+30% ည (22h–6h)','+50% ည ချိန်ကျော်'],
      th:['×1.5 ล่วงเวลาวันธรรมดา','×2.0 วันอาทิตย์','×4.0 วันหยุดนักขัตฤกษ์','+30% กะกลางคืน (22h–6h)','+50% OT กลางคืน'],
      id:['×1.5 lembur hari biasa','×2.0 lembur hari Minggu','×4.0 hari libur nasional','+30% shift malam (22h–6h)','+50% lembur malam'],
      ph:['×1.5 weekday OT','×2.0 Linggo','×4.0 pista opisyal','+30% gabi (22h–6h)','+50% gabi OT'],
      ne:['×1.5 साधारण ओभरटाइम','×2.0 आइतबार','×4.0 सार्वजनिक बिदा','+30% रात पाली (22h–6h)','+50% रात ओभरटाइम'],
      hi:['×1.5 सामान्य ओवरटाइम','×2.0 रविवार','×4.0 सार्वजनिक छुट्टी','+30% रात शिफ्ट (22h–6h)','+50% रात OT'],
    },
  },
  KR:{
    name:{vi:'Hàn Quốc',en:'Korea',ko:'한국',ja:'韓国',zh:'韩国',my:'တောင်ကိုရီးယား',th:'เกาหลีใต้',id:'Korea Selatan',ph:'South Korea',ne:'दक्षिण कोरिया',hi:'दक्षिण कोरिया'}, flag:'🇰🇷', currency:'₩', currencyCode:'KRW',
    normalFactor:1.0,
    otFactor:1.5, nightFactor:0.5, nightIsAdditive:true,
    nightStart:22, nightEnd:6,
    holidayFactor:1.5, holidayOtFactor:2.0,
    weeklyHours:40, dailyOtThreshold:8, maxWeeklyHours:52,
    basis:{vi:'Luật tiêu chuẩn lao động Điều 56',en:'Labor Standards Act Art.56',ko:'근로기준법 제56조',ja:'労働基準法 第56条',zh:'劳动基准法 第56条',my:'အလုပ်သမားဥပဒေ Art.56',th:'พ.ร.บ.มาตรฐานแรงงาน มาตรา 56',id:'UU Standar Ketenagakerjaan Ps.56',ph:'Labor Standards Act Art.56',ne:'श्रम मापदण्ड ऐन धारा 56',hi:'श्रम मानक अधिनियम अनु. 56'},
    tags:{
      vi:['×1.5 초과근무 (>40h/주)','+50% 야간 가산 (22h–6h)','×1.5 휴일 ≤8h','×2.0 휴일 >8h','최대 52h/주'],
      en:['×1.5 OT (>40h/week)','+50% night premium (10PM–6AM)','×1.5 holiday ≤8h','×2.0 holiday >8h','Max 52h/week'],
      ko:['×1.5 초과근무 (>40h/주)','야간 +50% 가산 (22h–6h)','×1.5 휴일근무 ≤8h','×2.0 휴일근무 >8h','최대 52h/주'],
      ja:['×1.5 時間外 (>40h/週)','夜間 +50% 加算 (22h–6h)','×1.5 休日 ≤8h','×2.0 休日 >8h','最大 52h/週'],
      zh:['×1.5 加班 (>40h/周)','夜间 +50% 加给 (22h–6h)','×1.5 假日 ≤8h','×2.0 假日 >8h','每周最多52h'],
      my:['×1.5 ချိန်ကျော် (>40h/wk)','+50% ည (22h–6h)','×1.5 ရုံးပိတ် ≤8h','×2.0 ရုံးပိတ် >8h','Max 52h/wk'],
      th:['×1.5 ล่วงเวลา (>40h/สัปดาห์)','ค่ากลางคืน +50% (22h–6h)','×1.5 วันหยุด ≤8h','×2.0 วันหยุด >8h','สูงสุด 52h/สัปดาห์'],
      id:['×1.5 lembur (>40j/minggu)','malam +50% (22j–6j)','×1.5 libur ≤8j','×2.0 libur >8j','Maks 52j/minggu'],
      ph:['×1.5 OT (>40h/linggo)','+50% gabi (22h–6h)','×1.5 holiday ≤8h','×2.0 holiday >8h','Max 52h/linggo'],
      ne:['×1.5 ओभरटाइम (>40h/हप्ता)','+50% रात (22h–6h)','×1.5 बिदा ≤8h','×2.0 बिदा >8h','अधिकतम 52h/हप्ता'],
      hi:['×1.5 ओवरटाइम (>40h/सप्ताह)','+50% रात (22h–6h)','×1.5 छुट्टी ≤8h','×2.0 छुट्टी >8h','अधिकतम 52h/सप्ताह'],
    },
  },
  JP:{
    name:{vi:'Nhật Bản',en:'Japan',ko:'일본',ja:'日本',zh:'日本',my:'ဂျပန်',th:'ญี่ปุ่น',id:'Jepang',ph:'Hapon',ne:'जापान',hi:'जापान'}, flag:'🇯🇵', currency:'¥', currencyCode:'JPY',
    normalFactor:1.0,
    otFactor:1.25, otOver60Factor:1.5,
    nightFactor:0.25, nightIsAdditive:true,
    nightStart:22, nightEnd:5,
    holidayFactor:1.35, holidayNightFactor:1.60,
    weeklyHours:40, dailyOtThreshold:8,
    monthlyOtLimit:45, monthlyOtSpecialLimit:100,
    basis:{vi:'Luật tiêu chuẩn lao động Điều 37',en:'Labor Standards Act Art.37',ko:'근로기준법 제37조',ja:'労働基準法 第37条',zh:'劳动基准法 第37条',my:'အလုပ်သမားဥပဒေ Art.37',th:'พ.ร.บ.มาตรฐานแรงงาน มาตรา 37',id:'UU Standar Ketenagakerjaan Ps.37',ph:'Labor Standards Act Art.37',ne:'श्रम मापदण्ड ऐन धारा 37',hi:'श्रम मानक अधिनियम अनु. 37'},
    tags:{
      vi:['×1.25 残業 (>40h/週 or >8h/日)','×1.5 残業 >60h/月','+25% 深夜 22h–5h','×1.35 法定休日','×1.5 深夜残業'],
      en:['×1.25 OT (>40h/week or >8h/day)','×1.5 OT >60h/month','+25% late night (10PM–5AM)','×1.35 statutory holiday','×1.5 night OT'],
      ko:['×1.25 초과근무 (>40h/주)','×1.5 초과근무 >60h/월','+25% 심야 (22h–5h)','×1.35 법정 공휴일','×1.5 심야 초과근무'],
      ja:['×1.25 時間外 (>40h/週 or >8h/日)','×1.5 時間外 >60h/月','+25% 深夜 22h–5h','×1.35 法定休日','×1.5 深夜残業'],
      zh:['×1.25 加班 (>40h/周 or >8h/天)','×1.5 加班 >60h/月','+25% 深夜 (22h–5h)','×1.35 法定假日','×1.5 深夜加班'],
      my:['×1.25 ချိန်ကျော် (>40h/wk)','×1.5 ချိန်ကျော် >60h/လ','+25% နက်ရှိုင်း (22h–5h)','×1.35 ဥပဒေ ရုံးပိတ်','×1.5 ည OT'],
      th:['×1.25 ล่วงเวลา (>40h/wk)','×1.5 ล่วงเวลา >60h/เดือน','+25% กลางดึก (22h–5h)','×1.35 วันหยุดราชการ','×1.5 กลางดึก OT'],
      id:['×1.25 lembur (>40j/minggu)','×1.5 lembur >60j/bulan','+25% malam (22j–5j)','×1.35 libur nasional','×1.5 lembur malam'],
      ph:['×1.25 OT (>40h/linggo)','×1.5 OT >60h/buwan','+25% gabi (22h–5h)','×1.35 pista opisyal','×1.5 gabi OT'],
      ne:['×1.25 ओभरटाइम (>40h/हप्ता)','×1.5 ओभरटाइम >60h/महिना','+25% रात (22h–5h)','×1.35 सार्वजनिक बिदा','×1.5 रात OT'],
      hi:['×1.25 ओवरटाइम (>40h/सप्ताह)','×1.5 ओवरटाइम >60h/माह','+25% रात (22h–5h)','×1.35 राष्ट्रीय छुट्टी','×1.5 रात OT'],
    },
  },
  TW:{
    name:{vi:'Đài Loan',en:'Taiwan',ko:'대만',ja:'台湾',zh:'台湾',my:'တိုင်ဝမ်',th:'ไต้หวัน',id:'Taiwan',ph:'Taiwan',ne:'ताइवान',hi:'ताइवान'}, flag:'🇹🇼', currency:'NT$', currencyCode:'TWD',
    normalFactor:1.0,
    ot1Factor:1.33, ot1Hours:2,
    ot2Factor:1.67, ot2Hours:2,
    ot3Factor:2.0,
    flexRestFactor1:1.33, flexRestFactor2:1.67,
    fixedRestFactor:2.66,
    nightFactor:1.0, nightStart:22, nightEnd:6,
    weeklyHours:40, dailyOtThreshold:8,
    basis:{vi:'Luật lao động Điều 24',en:'Labor Standards Act Art.24',ko:'근로기준법 제24조',ja:'労働基準法 第24条',zh:'勞動基準法 第24條',my:'အလုပ်သမားဥပဒေ Art.24',th:'กฎหมายมาตรฐานแรงงาน มาตรา 24',id:'UU Standar Ketenagakerjaan Ps.24',ph:'Labor Standards Act Art.24',ne:'श्रम मापदण्ड ऐन धारा 24',hi:'श्रम मानक अधिनियम अनु. 24'},
    tags:{
      vi:['×1.33 加班前2h','×1.67 加班後2h','×2.66 固定/國定假日','×1.33/1.67 彈性休假日','夜間無法定加給'],
      en:['×1.33 OT first 2h','×1.67 OT next 2h','×2.66 fixed/national holidays','×1.33/1.67 flex rest day','No mandatory night premium'],
      ko:['×1.33 초과근무 첫 2h','×1.67 초과근무 다음 2h','×2.66 고정/국정 공휴일','×1.33/1.67 탄력 휴무일','야간 법정 가산 없음'],
      ja:['×1.33 時間外 最初2h','×1.67 時間外 次の2h','×2.66 固定/法定休日','×1.33/1.67 柔軟休日','深夜法定割増なし'],
      zh:['×1.33 加班前2h','×1.67 加班后2h','×2.66 固定/国定假日','×1.33/1.67 弹性休假日','无法定夜班加给'],
      my:['×1.33 ချိန်ကျော် ပထမ 2h','×1.67 ချိန်ကျော် နောက် 2h','×2.66 တည်ငြိမ်/နိုင်ငံ ရုံးပိတ်','×1.33/1.67 ပြောင်းလွယ် ရုံးပိတ်','ည ဥပဒေ မရ'],
      th:['×1.33 OT 2 ชั่วโมงแรก','×1.67 OT ถัดไป 2 ชั่วโมง','×2.66 วันหยุดราชการ','×1.33/1.67 วันหยุดยืดหยุ่น','ไม่มีค่าตอบแทนกลางคืนบังคับ'],
      id:['×1.33 OT 2 jam pertama','×1.67 OT 2 jam berikutnya','×2.66 libur nasional','×1.33/1.67 libur fleksibel','Tanpa premi malam wajib'],
      ph:['×1.33 OT unang 2h','×1.67 OT susunod 2h','×2.66 pista opisyal','×1.33/1.67 flex day','Walang night premium'],
      ne:['×1.33 ओभरटाइम पहिलो 2h','×1.67 ओभरटाइम अर्को 2h','×2.66 राष्ट्रिय बिदा','×1.33/1.67 लचिलो बिदा','रात भत्ता अनिवार्य छैन'],
      hi:['×1.33 OT पहले 2h','×1.67 OT अगले 2h','×2.66 राष्ट्रीय छुट्टी','×1.33/1.67 लचीली छुट्टी','रात भत्ता अनिवार्य नहीं'],
    },
  },
  US:{
    name:{vi:'Hoa Kỳ',en:'United States',ko:'미국',ja:'アメリカ',zh:'美国',my:'အမေရိကန်',th:'สหรัฐอเมริกา',id:'Amerika Serikat',ph:'Estados Unidos',ne:'संयुक्त राज्य',hi:'संयुक्त राज्य'}, flag:'🇺🇸', currency:'$', currencyCode:'USD',
    normalFactor:1.0,
    otFactor:1.5,
    nightFactor:1.0, nightStart:23, nightEnd:6,
    holidayFactor:1.0,
    weeklyHours:40, dailyOtThreshold:999,
    basis:{vi:'Đạo luật tiêu chuẩn lao động công bằng (FLSA)',en:'FLSA (Fair Labor Standards Act)',ko:'FLSA (공정근로기준법)',ja:'FLSA（公正労働基準法）',zh:'FLSA（公平劳工标准法）',my:'FLSA (Fair Labor Standards Act)',th:'FLSA (กฎหมายมาตรฐานแรงงานที่เป็นธรรม)',id:'FLSA (Fair Labor Standards Act)',ph:'FLSA (Fair Labor Standards Act)',ne:'FLSA (उचित श्रम मापदण्ड ऐन)',hi:'FLSA (उचित श्रम मानक अधिनियम)'},
    tags:{
      vi:['×1.5 OT (>40h/tuần)','Không có phụ cấp đêm liên bang','Không có phụ cấp lễ liên bang','Tùy theo tiểu bang/hợp đồng'],
      en:['×1.5 OT (>40h/week)','No federal night premium','No federal holiday rate','Varies by state/contract'],
      ko:['×1.5 초과근무 (>40h/주)','연방 야간 할증 없음','연방 공휴일 가산 없음','주/계약별 상이'],
      ja:['×1.5 時間外 (>40h/週)','連邦夜間割増なし','連邦休日割増なし','州・契約により異なる'],
      zh:['×1.5 加班 (>40h/周)','无联邦夜班加给','无联邦假日加给','因州/合同而异'],
      my:['×1.5 ချိန်ကျော် (>40h/wk)','ဖက်ဒရယ် ည မရ','ဖက်ဒရယ် ရုံးပိတ် မရ','ပြည်နယ်/စာချုပ် မူတည်'],
      th:['×1.5 ล่วงเวลา (>40h/สัปดาห์)','ไม่มีค่ากลางคืน','ไม่มีค่าวันหยุดของรัฐบาลกลาง','ขึ้นอยู่กับรัฐ/สัญญา'],
      id:['×1.5 lembur (>40j/minggu)','Tanpa premi malam federal','Tanpa premi libur federal','Tergantung negara bagian'],
      ph:['×1.5 OT (>40h/linggo)','Walang federal night premium','Walang federal holiday rate','Depende sa estado/kontrata'],
      ne:['×1.5 ओभरटाइम (>40h/हप्ता)','संघीय रात भत्ता छैन','संघीय बिदा भत्ता छैन','राज्य/सम्झौतामा निर्भर'],
      hi:['×1.5 ओवरटाइम (>40h/सप्ताह)','कोई संघीय रात भत्ता नहीं','कोई संघीय छुट्टी दर नहीं','राज्य/अनुबंध पर निर्भर'],
    },
  },
  MY:{
    name:{vi:'Myanmar',en:'Myanmar',ko:'미얀마',ja:'ミャンマー',zh:'缅甸',my:'မြန်မာ',th:'เมียนมา',id:'Myanmar',ph:'Myanmar',ne:'म्यानमार',hi:'म्यांमार'}, flag:'🇲🇲', currency:'K', currencyCode:'MMK',
    normalFactor:1.0,
    otFactor:2.0, nightFactor:1.0,
    nightStart:22, nightEnd:6,
    holidayFactor:2.0,
    weeklyHours:44, dailyOtThreshold:8,
    basis:{vi:'Luật Nhà máy 1951 / Luật Cửa hàng 1989',en:'Factories Act 1951 / Shops & Establishments Act 1989',ko:'공장법 1951 / 상점설립법 1989',ja:'工場法 1951 / 商店設立法 1989',zh:'工厂法1951/店铺法1989',my:'စက်ရုံဥပဒေ 1951 / ဆိုင်နှင့်လုပ်ငန်းဥပဒေ 1989',th:'พ.ร.บ.โรงงาน 2494 / พ.ร.บ.สถานประกอบการ 2532',id:'UU Pabrik 1951 / UU Toko 1989',ph:'Factories Act 1951 / Shops Act 1989',ne:'कारखाना ऐन 1951 / पसल ऐन 1989',hi:'कारखाना अधिनियम 1951 / दुकान अधिनियम 1989'},
    tags:{
      vi:['×2.0 tăng ca (OT)','Chuẩn 44h/tuần','×2.0 làm ngày lễ','Ca đêm: theo hợp đồng'],
      en:['×2.0 OT','44h/week standard','×2.0 public holiday','Night: by contract'],
      ko:['×2.0 초과근무','44h/주 기준','×2.0 공휴일','야간: 계약별'],
      ja:['×2.0 残業','44h/週 標準','×2.0 休日出勤','深夜: 契約による'],
      zh:['×2.0 加班','44h/周标准','×2.0 公众假期','夜班: 按合同'],
      my:['×2.0 ကျော်ချိန် (OT)','44h/week ပုံမှန်','×2.0 ရုံးပိတ်ကြားနေ့','ည: စာချုပ်မူတည်'],
      th:['×2.0 ล่วงเวลา (OT)','มาตรฐาน 44h/สัปดาห์','×2.0 วันหยุดนักขัตฤกษ์','กะกลางคืน: ตามสัญญา'],
      id:['×2.0 lembur (OT)','Standar 44j/minggu','×2.0 hari libur nasional','Malam: per kontrak'],
      ph:['×2.0 OT','44h/linggo standard','×2.0 pista opisyal','Gabi: ayon sa kontrata'],
      ne:['×2.0 ओभरटाइम (OT)','मानक 44h/हप्ता','×2.0 सार्वजनिक बिदा','रात: सम्झौता अनुसार'],
      hi:['×2.0 ओवरटाइम (OT)','मानक 44h/सप्ताह','×2.0 सार्वजनिक छुट्टी','रात: अनुबंध के अनुसार'],
    },
  },
  TH:{
    name:{vi:'Thái Lan',en:'Thailand',ko:'태국',ja:'タイ',zh:'泰国',my:'ထိုင်းနိုင်ငံ',th:'ประเทศไทย',id:'Thailand',ph:'Thailand',ne:'थाइल्याण्ड',hi:'थाईलैंड'}, flag:'🇹🇭', currency:'฿', currencyCode:'THB',
    normalFactor:1.0,
    otFactor:1.5, weekendOtFactor:3.0,
    nightFactor:1.0, nightStart:22, nightEnd:6,
    holidayFactor:3.0,
    weeklyHours:48, dailyOtThreshold:8,
    basis:{vi:'Luật bảo hộ lao động B.E.2541, Điều 61–63',en:'Labour Protection Act B.E.2541, Art.61–63',ko:'노동보호법 B.E.2541 제61–63조',ja:'労働保護法 B.E.2541 第61–63条',zh:'劳动保护法 B.E.2541 第61–63条',my:'အလုပ်သမားကာကွယ်ရေးဥပဒေ B.E.2541 Art.61–63',th:'พ.ร.บ.คุ้มครองแรงงาน พ.ศ.2541 มาตรา 61–63',id:'UU Perlindungan Tenaga Kerja B.E.2541 Ps.61–63',ph:'Labour Protection Act B.E.2541, Art.61–63',ne:'श्रम संरक्षण ऐन B.E.2541 धारा 61–63',hi:'श्रम संरक्षण अधिनियम B.E.2541 अनु.61–63'},
    tags:{
      vi:['×1.5 tăng ca (>8h/ngày)','×3.0 làm ngày lễ','×3.0 tăng ca ngày lễ','Ca đêm: theo hợp đồng','Chuẩn 48h/tuần'],
      en:['×1.5 OT (>8h/day)','×3.0 holiday work','×3.0 OT on holiday','Night: by contract','48h/week'],
      ko:['×1.5 초과근무 (>8h/일)','×3.0 공휴일 근무','×3.0 공휴일 초과근무','야간: 계약별','48h/주'],
      ja:['×1.5 時間外 (>8h/日)','×3.0 休日出勤','×3.0 休日残業','深夜: 契約による','48h/週'],
      zh:['×1.5 加班 (>8h/天)','×3.0 假日出勤','×3.0 假日加班','夜班: 按合同','48h/周'],
      my:['×1.5 ချိန်ကျော် (>8h/day)','×3.0 ရုံးပိတ် တက်','×3.0 ရုံးပိတ် ချိန်ကျော်','ည: စာချုပ်','48h/week'],
      th:['×1.5 ล่วงเวลา (>8h/วัน)','×3.0 ทำงานวันหยุด','×3.0 OT วันหยุด','กะกลางคืน: ตามสัญญา','48h/สัปดาห์'],
      id:['×1.5 lembur (>8j/hari)','×3.0 hari libur','×3.0 lembur hari libur','Malam: per kontrak','48j/minggu'],
      ph:['×1.5 OT (>8h/araw)','×3.0 holiday','×3.0 OT sa holiday','Gabi: per kontrata','48h/linggo'],
      ne:['×1.5 ओभरटाइम (>8h/दिन)','×3.0 बिदाको काम','×3.0 बिदा ओभरटाइम','रात: सम्झौता','48h/हप्ता'],
      hi:['×1.5 ओवरटाइम (>8h/दिन)','×3.0 छुट्टी पर काम','×3.0 छुट्टी OT','रात: अनुबंध','48h/सप्ताह'],
    },
  },
  ID:{
    name:{vi:'Indonesia',en:'Indonesia',ko:'인도네시아',ja:'インドネシア',zh:'印度尼西亚',my:'အင်ဒိုနီးရှား',th:'อินโดนีเซีย',id:'Indonesia',ph:'Indonesia',ne:'इन्डोनेसिया',hi:'इंडोनेशिया'}, flag:'🇮🇩', currency:'Rp', currencyCode:'IDR',
    normalFactor:1.0,
    otFactor:1.5, otFactor2:2.0,
    nightFactor:1.0, nightStart:23, nightEnd:6,
    holidayFactor:2.0, holidayOtFactor:3.0,
    weeklyHours:40, dailyOtThreshold:8,
    basis:{vi:'UU 13/2003 & PP 35/2021 (Cipta Kerja)',en:'UU No.13/2003 & PP No.35/2021 (Job Creation)',ko:'법률 제13/2003호 & 시행령 제35/2021호',ja:'法律 No.13/2003 & 政令 No.35/2021',zh:'法律13/2003号和政令35/2021号',my:'ဥပဒေ 13/2003 & PP 35/2021',th:'กฎหมาย 13/2003 & PP 35/2021 (Cipta Kerja)',id:'UU No.13/2003 & PP No.35/2021 (Cipta Kerja)',ph:'UU No.13/2003 & PP No.35/2021',ne:'UU 13/2003 & PP 35/2021',hi:'UU 13/2003 & PP 35/2021'},
    tags:{
      vi:['×1.5 lembur giờ đầu','×2.0 lembur giờ 2+','×2.0 ngày lễ ≤8h','×3.0 ngày lễ >8h','Chuẩn 40h/tuần'],
      en:['×1.5 OT 1st hour','×2.0 OT 2nd hour+','×2.0 holiday ≤8h','×3.0 holiday >8h','40h/week'],
      ko:['×1.5 초과근무 첫 1시간','×2.0 초과근무 2시간+','×2.0 공휴일 ≤8h','×3.0 공휴일 >8h','40h/주'],
      ja:['×1.5 残業 1時間目','×2.0 残業 2時間目以降','×2.0 休日 ≤8h','×3.0 休日 >8h','40h/週'],
      zh:['×1.5 加班第1小时','×2.0 加班第2小时+','×2.0 假日 ≤8h','×3.0 假日 >8h','40h/周'],
      my:['×1.5 ချိန်ကျော် ပထမ 1h','×2.0 ချိန်ကျော် 2h+','×2.0 ရုံးပိတ် ≤8h','×3.0 ရုံးပိတ် >8h','40h/week'],
      th:['×1.5 ล่วงเวลาชั่วโมงแรก','×2.0 ล่วงเวลาชั่วโมงที่ 2+','×2.0 วันหยุด ≤8h','×3.0 วันหยุด >8h','40h/สัปดาห์'],
      id:['×1.5 lembur jam pertama','×2.0 lembur jam ke-2+','×2.0 hari libur ≤8j','×3.0 hari libur >8j','40j/minggu'],
      ph:['×1.5 OT unang oras','×2.0 OT ika-2 oras+','×2.0 holiday ≤8h','×3.0 holiday >8h','40h/linggo'],
      ne:['×1.5 ओभरटाइम पहिलो घण्टा','×2.0 ओभरटाइम 2+ घण्टा','×2.0 बिदा ≤8h','×3.0 बिदा >8h','40h/हप्ता'],
      hi:['×1.5 OT पहला घंटा','×2.0 OT 2+ घंटे','×2.0 छुट्टी ≤8h','×3.0 छुट्टी >8h','40h/सप्ताह'],
    },
  },
  PH:{
    name:{vi:'Philippines',en:'Philippines',ko:'필리핀',ja:'フィリピン',zh:'菲律宾',my:'ဖိလစ်ပိုင်',th:'ฟิลิปปินส์',id:'Filipina',ph:'Pilipinas',ne:'फिलिपिन्स',hi:'फ़िलीपींस'}, flag:'🇵🇭', currency:'₱', currencyCode:'PHP',
    normalFactor:1.0,
    otFactor:1.25,
    nightFactor:1.1, nightIsAdditive:true,
    nightStart:22, nightEnd:6,
    holidayFactor:2.0, holidayOtFactor:2.6,
    weeklyHours:48, dailyOtThreshold:8,
    basis:{vi:'Bộ luật lao động Philippines (PD 442), Điều 86–94',en:'Labor Code of the Philippines (PD 442), Art.86–94',ko:'필리핀 노동법(PD 442) 제86–94조',ja:'フィリピン労働法(PD 442) 第86–94条',zh:'菲律宾劳动法(PD 442)第86–94条',my:'ဖိလစ်ပိုင်အလုပ်သမားဥပဒေ (PD 442) Art.86–94',th:'ประมวลกฎหมายแรงงานฟิลิปปินส์ (PD 442) มาตรา 86–94',id:'Kitab UU Ketenagakerjaan Filipina (PD 442) Ps.86–94',ph:'Labor Code (PD 442), Art.86–94',ne:'फिलिपिन्स श्रम संहिता (PD 442) धारा 86–94',hi:'फ़िलीपींस श्रम संहिता (PD 442) अनु. 86–94'},
    tags:{
      vi:['×1.25 tăng ca (>8h/ngày)','×2.0 ngày lễ thông thường','×2.6 ngày lễ + tăng ca','+10% ca đêm (22h–6h)','Chuẩn 48h/tuần'],
      en:['×1.25 OT (>8h/day)','×2.0 regular holiday','×2.6 holiday + OT','+10% night (10PM–6AM)','48h/week'],
      ko:['×1.25 초과근무 (>8h/일)','×2.0 정규 공휴일','×2.6 공휴일 + 초과근무','+10% 야간 (10PM–6AM)','48h/주'],
      ja:['×1.25 時間外 (>8h/日)','×2.0 法定祝日','×2.6 祝日+残業','+10% 深夜 (22h–6h)','48h/週'],
      zh:['×1.25 加班 (>8h/天)','×2.0 法定假日','×2.6 假日+加班','+10% 夜班 (22h–6h)','48h/周'],
      my:['×1.25 ချိန်ကျော် (>8h/day)','×2.0 ရုံးပိတ်ရက်','×2.6 ရုံးပိတ် + ချိန်ကျော်','+10% ည (10PM–6AM)','48h/week'],
      th:['×1.25 ล่วงเวลา (>8h/วัน)','×2.0 วันหยุดนักขัตฤกษ์','×2.6 วันหยุด + OT','+10% กะกลางคืน (10PM–6AM)','48h/สัปดาห์'],
      id:['×1.25 lembur (>8j/hari)','×2.0 hari libur nasional','×2.6 libur + lembur','+10% malam (22j–6j)','48j/minggu'],
      ph:['×1.25 OT (>8h/araw)','×2.0 regular holiday','×2.6 holiday + OT','+10% gabi (10PM–6AM)','48h/linggo'],
      ne:['×1.25 ओभरटाइम (>8h/दिन)','×2.0 सार्वजनिक बिदा','×2.6 बिदा + ओभरटाइम','+10% रात (10PM–6AM)','48h/हप्ता'],
      hi:['×1.25 ओवरटाइम (>8h/दिन)','×2.0 सार्वजनिक छुट्टी','×2.6 छुट्टी + OT','+10% रात (10PM–6AM)','48h/सप्ताह'],
    },
  },
  NP:{
    name:{vi:'Nepal',en:'Nepal',ko:'네팔',ja:'ネパール',zh:'尼泊尔',my:'နီပေါ',th:'เนปาล',id:'Nepal',ph:'Nepal',ne:'नेपाल',hi:'नेपाल'}, flag:'🇳🇵', currency:'रु', currencyCode:'NPR',
    normalFactor:1.0,
    otFactor:1.5,
    nightFactor:1.5, nightIsAdditive:true,
    nightStart:22, nightEnd:6,
    holidayFactor:2.0,
    weeklyHours:48, dailyOtThreshold:8,
    basis:{vi:'Luật lao động Nepal 2017, Điều 30 & 34',en:'Labour Act 2017 (Nepal), Sec.30 & 34',ko:'네팔 노동법 2017, 제30·34조',ja:'ネパール労働法 2017, 第30·34条',zh:'尼泊尔劳动法2017, 第30·34条',my:'နီပေါအလုပ်သမားဥပဒေ 2017, Sec.30&34',th:'พ.ร.บ.แรงงานเนปาล 2560 มาตรา 30 & 34',id:'UU Ketenagakerjaan Nepal 2017, Ps.30 & 34',ph:'Labour Act 2017 (Nepal), Sec.30 & 34',ne:'श्रम ऐन 2074 (नेपाल), दफा 30 र 34',hi:'नेपाल श्रम अधिनियम 2017, धारा 30 & 34'},
    tags:{
      vi:['×1.5 tăng ca (>8h/ngày)','×2.0 ngày lễ công cộng','+50% ca đêm (22h–6h)','Chuẩn 48h/tuần'],
      en:['×1.5 OT (>8h/day)','×2.0 public holiday','+50% night premium (10PM–6AM)','48h/week'],
      ko:['×1.5 초과근무 (>8h/일)','×2.0 공휴일','+50% 야간 (10PM–6AM)','48h/주'],
      ja:['×1.5 時間外 (>8h/日)','×2.0 祝日','+50% 深夜 (22h–6h)','48h/週'],
      zh:['×1.5 加班 (>8h/天)','×2.0 公共假日','+50% 夜班 (22h–6h)','48h/周'],
      my:['×1.5 ချိန်ကျော် (>8h/day)','×2.0 ရုံးပိတ်ရက်','+50% ည (10PM–6AM)','48h/week'],
      th:['×1.5 ล่วงเวลา (>8h/วัน)','×2.0 วันหยุดนักขัตฤกษ์','+50% กะกลางคืน (22h–6h)','48h/สัปดาห์'],
      id:['×1.5 lembur (>8j/hari)','×2.0 hari libur nasional','+50% malam (22h–6h)','48j/minggu'],
      ph:['×1.5 OT (>8h/araw)','×2.0 pista opisyal','+50% gabi (22h–6h)','48h/linggo'],
      ne:['×1.5 ओभरटाइम (>8h/दिन)','×2.0 सार्वजनिक बिदा','+50% रात (22h–6h)','48h/हप्ता'],
      hi:['×1.5 ओवरटाइम (>8h/दिन)','×2.0 सार्वजनिक छुट्टी','+50% रात (22h–6h)','48h/सप्ताह'],
    },
  },
  IN:{
    name:{vi:'Ấn Độ',en:'India',ko:'인도',ja:'インド',zh:'印度',my:'အိန္ဒိယ',th:'อินเดีย',id:'India',ph:'India',ne:'भारत',hi:'भारत'}, flag:'🇮🇳', currency:'₹', currencyCode:'INR',
    normalFactor:1.0,
    otFactor:2.0,
    nightFactor:1.0, nightStart:22, nightEnd:6,
    holidayFactor:2.0,
    weeklyHours:48, dailyOtThreshold:8,
    basis:{vi:'Luật Nhà máy 1948, Điều 59 / Bộ luật tiền lương 2019',en:'Factories Act 1948, Sec.59 / Code on Wages 2019',ko:'공장법 1948 제59조 / 임금법 2019',ja:'工場法 1948 第59条 / 賃金法 2019',zh:'工厂法1948第59条/工资法2019',my:'ကုမ္ပဏီဥပဒေ 1948 Sec.59 / လုပ်ခဥပဒေ 2019',th:'พ.ร.บ.โรงงาน 2491 มาตรา 59 / กฎหมายค่าจ้าง 2562',id:'UU Pabrik 1948 Ps.59 / UU Upah 2019',ph:'Factories Act 1948, Sec.59 / Code on Wages 2019',ne:'कारखाना ऐन 1948 दफा 59 / ज्याला संहिता 2019',hi:'कारखाना अधिनियम 1948 धारा 59 / मजदूरी संहिता 2019'},
    tags:{
      vi:['×2.0 tăng ca (>9h/ngày or >48h/tuần)','×2.0 ngày lễ công cộng','Ca đêm: theo tiểu bang/HĐ','Chuẩn 48h/tuần'],
      en:['×2.0 OT (>9h/day or >48h/week)','×2.0 public holiday','Night: by state/contract','48h/week'],
      ko:['×2.0 초과근무 (>9h/일 or >48h/주)','×2.0 공휴일','야간: 주/계약별','48h/주'],
      ja:['×2.0 時間外 (>9h/日 or >48h/週)','×2.0 法定祝日','深夜: 州・契約による','48h/週'],
      zh:['×2.0 加班 (>9h/天 or >48h/周)','×2.0 法定假日','夜班: 因州/合同而异','48h/周'],
      my:['×2.0 ချိန်ကျော် (>9h/day or >48h/wk)','×2.0 ရုံးပိတ်ရက်','ည: ပြည်နယ်/စာချုပ်','48h/week'],
      th:['×2.0 ล่วงเวลา (>9h/วัน or >48h/wk)','×2.0 วันหยุดนักขัตฤกษ์','กะกลางคืน: ตามรัฐ/สัญญา','48h/สัปดาห์'],
      id:['×2.0 lembur (>9j/hari or >48j/minggu)','×2.0 hari libur nasional','Malam: per negara bagian/kontrak','48j/minggu'],
      ph:['×2.0 OT (>9h/araw or >48h/linggo)','×2.0 pista opisyal','Gabi: ayon sa estado/kontrata','48h/linggo'],
      ne:['×2.0 ओभरटाइम (>9h/दिन or >48h/हप्ता)','×2.0 सार्वजनिक बिदा','रात: राज्य/सम्झौता','48h/हप्ता'],
      hi:['×2.0 ओवरटाइम (>9h/दिन or >48h/सप्ताह)','×2.0 सार्वजनिक छुट्टी','रात: राज्य/अनुबंध','48h/सप्ताह'],
    },
  },
  CUSTOM:{
    name:{vi:'Tùy chỉnh',en:'Custom',ko:'사용자 정의',ja:'カスタム',zh:'自定义',my:'စိတ်ကြိုက်',th:'กำหนดเอง',id:'Kustom',ph:'Custom',ne:'अनुकूलन',hi:'कस्टम'}, flag:'⚙️', currency:'', currencyCode:'',
    normalFactor:1.0, otFactor:1.5,
    nightFactor:1.3, nightStart:22, nightEnd:6,
    holidayFactor:2.0, weeklyHours:40, dailyOtThreshold:8,
    basis:{vi:'Tùy chỉnh theo hợp đồng',en:'Custom per contract',ko:'계약별 사용자 정의',ja:'契約に応じてカスタマイズ',zh:'按合同自定义',my:'စာချုပ်အတိုင်း',th:'กำหนดเองตามสัญญา',id:'Kustom sesuai kontrak',ph:'Custom ayon sa kontrata',ne:'सम्झौता अनुसार',hi:'अनुबंध के अनुसार'},
    tags:{
      vi:['Tùy chỉnh tất cả hệ số','Nhập theo thực tế công ty'],
      en:['Customize all factors','Set per your company contract'],
      ko:['모든 계수 사용자 정의','실제 계약 기준으로 입력'],
      ja:['すべての係数をカスタマイズ','実際の契約に基づいて入力'],
      zh:['自定义所有系数','按实际公司合同填写'],
      my:['အားလုံး စိတ်ကြိုက်ပြင်','ကုမ္ပဏီ စာချုပ်အတိုင်း'],
      th:['ปรับแต่งค่าตอบแทนทั้งหมด','ตั้งตามสัญญาบริษัท'],
      id:['Sesuaikan semua koefisien','Sesuai kontrak perusahaan'],
      ph:['I-customize ang lahat','Ayon sa kontrata ng kumpanya'],
      ne:['सबै गुणांक अनुकूलन गर्नुस्','कम्पनी सम्झौता अनुसार'],
      hi:['सभी कोएफिशिएंट अनुकूलित करें','कंपनी अनुबंध के अनुसार'],
    },
  }
};

/* ===== CẤU HÌNH NGÔN NGỮ & QUỐC GIA (langCfg) ===== */
var langCfg={lang:"vi",payrollCountry:"VN",overrides:{}};
try{const _lc=JSON.parse(localStorage.getItem("cp22_lang")||"null");if(_lc)langCfg=Object.assign(langCfg,_lc);}catch(e){}

// === pGio ===
function pGio(s){if(!s)return 0;const[h,m]=s.split(':').map(Number);return h*60+m;}

// === soGio ===
function soGio(v,r){if(!v||!r)return null;const d=(pGio(r)-pGio(v)+1440)%1440;return d/60;}

// === calcNightHours ===
function calcNightHours(vao, ra, nightStart, nightEnd){
  const v = pGio(vao), r = pGio(ra);
  const dur = ((r - v + 1440) % 1440);
  const ns = nightStart * 60, ne = (nightEnd + 24) * 60; // normalize
  // Simple approximation: count overlap with night window
  let nightMin = 0;
  for(let m = 0; m < dur; m++){
    const cur = (v + m) % 1440;
    const inNight = (cur >= ns) || (cur < nightEnd*60);
    if(inNight) nightMin++;
  }
  return Math.min(nightMin / 60, dur / 60);
}

// === getPayrollRule ===
function getPayrollRule(){
  const base = PAYROLL_RULES[langCfg.payrollCountry] || PAYROLL_RULES.VN;
  const ov = langCfg.overrides || {};
  return {
    ...base,
    normalFactor: parseFloat(ov.normal)||base.normalFactor,
    otFactor: parseFloat(ov.ot)||base.otFactor,
    nightFactor: parseFloat(ov.night)||base.nightFactor,
    nightStart: parseInt(ov.nightStart)||base.nightStart,
  };
}

// === calcDaySalaryFull ===
function calcDaySalaryFull(tt,ca,gd,rule,otGio,nightGio){
const isDem=ca&&ca.laDem;
const lN=ldN(),lG=lgN(),gioCA=(_cfg_shim&&_cfg_shim.gioNgay)||8;
const nightPct=(rule.nightFactor||1.3)-1.0;
let nightTien=0;
if(rule.nightIsAdditive){nightTien=nightGio*lG*rule.nightFactor;}
else{nightTien=nightGio*lG*nightPct;}
let otTien=0;
if(langCfg.payrollCountry==='TW'){
  const ot1=Math.min(otGio,rule.ot1Hours||2);
  const ot2=Math.min(Math.max(0,otGio-(rule.ot1Hours||2)),rule.ot2Hours||2);
  otTien=(ot1*lG*(rule.ot1Factor||1.33))+(ot2*lG*(rule.ot2Factor||1.67));
}else{
  otTien=otGio*lG*(rule.otFactor||1.5);
}
if(tt==='ll') return lN*(rule.holidayFactor||4.0)+nightTien+otTien;
if(tt==='vang') return -lN;
return lN+nightTien+otTien;
}

// === tinhBH ===
// → const TRAN_BH = 46800000; (moved to utils.js)

