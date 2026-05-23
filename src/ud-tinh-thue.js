/* ===== TAX ENGINE — 11 quốc gia (gần thực tế 2025) ===== */
const TAX_RULES = {
  VN: {
    period:'monthly', insuranceDeductible:true,
    insurance: { rate: 0.105, cap: 36000000 }, // NLĐ đóng 10.5%, trần 36M/tháng
    deduction: { personal: 11000000, dependent: 4400000 },
    brackets: [[5000000,0.05],[5000000,0.10],[8000000,0.15],[14000000,0.20],[20000000,0.25],[28000000,0.30],[Infinity,0.35]],
    rounding: 'floor', currency: '₫', flag: '🇻🇳', name: {vi:'Việt Nam',en:'Vietnam',ko:'베트남',ja:'ベトナム',zh:'越南',my:'ဗီယက်နမ်',th:'เวียดนาม',id:'Vietnam',ph:'Vietnam',ne:'भियतनाम',hi:'वियतनाम'},
    insNote: {
      vi:'BHXH 8% + BHYT 1.5% + BHTN 1% = 10.5% (trần 36 triệu/tháng)',
      en:'Social Insurance 8% + Health 1.5% + Unemployment 1% = 10.5% (cap 36M VND/month)',
      ko:'사회보험 8% + 건강보험 1.5% + 고용보험 1% = 10.5% (한도 3,600만₫/월)',
      ja:'社会保険 8% + 健康保険 1.5% + 雇用保険 1% = 10.5% (上限 3,600万₫/月)',
      zh:'社会保险 8% + 健康险 1.5% + 失业险 1% = 10.5% (上限3600万₫/月)',
      my:'လူမှုBH 8% + ကျန်းမာBH 1.5% + အလုပ်လက်မဲ့BH 1% = 10.5% (ကန့်သတ် 36M ₫/လ)',
      th:'ประกันสังคม 8% + ประกันสุขภาพ 1.5% + ประกันการว่างงาน 1% = 10.5% (เพดาน 36M ₫/เดือน)',
      id:'Jamsostek 8% + JKK 1.5% + JKm 1% = 10.5% (batas 36 juta ₫/bulan)',
      ph:'Social Insurance 8% + Health 1.5% + Unemployment 1% = 10.5% (cap 36M ₫/buwan)',
      ne:'सामाजिक बीमा 8% + स्वास्थ्य 1.5% + बेरोजगारी 1% = 10.5% (सीमा 36M ₫/महिना)',
      hi:'सामाजिक बीमा 8% + स्वास्थ्य 1.5% + बेरोजगारी 1% = 10.5% (सीमा 36M ₫/माह)'
    }
  },
  KR: {
    period:'annual', insuranceDeductible:true,
    insurance: { rate: 0.094, cap: 6170000 }, // NP 4.5% + BHYT 3.545% + LTC 0.491% + BHTN 0.9% ≈ 9.4%, trần 6.17M ₩/tháng (2025)
    localTax: 0.10, // 지방세 = 10% của thuế TNCN
    brackets: [[14000000,0.06],[36000000,0.15],[38000000,0.24],[62000000,0.35],[150000000,0.38],[200000000,0.40],[500000000,0.42],[Infinity,0.45]],
    rounding: 'floor', currency: '₩', flag: '🇰🇷', name: {vi:'Hàn Quốc',en:'Korea',ko:'한국',ja:'韓国',zh:'韩국',my:'တောင်ကိုရီးယား',th:'เกาหลีใต้',id:'Korea Selatan',ph:'South Korea',ne:'दक्षिण कोरिया',hi:'दक्षिण कोरिया'},
    insNote: {
      vi:'Lương hưu 4.5% + BHYT 3.545% + Điều dưỡng 0.491% + BHTN 0.9% ≈ 9.4% (trần 6,170,000 ₩/tháng)',
      en:'National Pension 4.5% + Health 3.545% + LTC 0.491% + Employment 0.9% ≈ 9.4% (cap 6,170,000 ₩/mo)',
      ko:'국민연금 4.5% + 건강보험 3.545% + 장기요양 0.491% + 고용보험 0.9% ≈ 9.4% (상한 6,170,000 ₩/월)',
      ja:'国民年金 4.5% + 健康保険 3.545% + 介護 0.491% + 雇用保険 0.9% ≈ 9.4% (上限 617万 ₩/月)',
      zh:'国民年金 4.5% + 健保 3.545% + 长期护理 0.491% + 就业保险 0.9% ≈ 9.4% (上限 617万 ₩/月)',
      my:'အမျိုးသားပင်စီမံချက် 4.5% + ကျန်းမာBH 3.545% + ရေရှည်ပြုစုမှု 0.491% + အလုပ် 0.9% ≈ 9.4%',
      th:'บำนาญแห่งชาติ 4.5% + ประกันสุขภาพ 3.545% + ดูแลระยะยาว 0.491% + ว่างงาน 0.9% ≈ 9.4% (เพดาน 6.17M ₩/เดือน)',
      id:'Pensiun Nasional 4.5% + Kesehatan 3.545% + Perawatan 0.491% + Ketenagakerjaan 0.9% ≈ 9.4% (batas 6,170,000 ₩/bln)',
      ph:'National Pension 4.5% + Health 3.545% + LTC 0.491% + Employment 0.9% ≈ 9.4% (cap 6,170,000 ₩/mo)',
      ne:'राष्ट्रिय पेन्सन 4.5% + स्वास्थ्य 3.545% + दीर्घकालीन हेरचाह 0.491% + रोजगार 0.9% ≈ 9.4% (सीमा 6.17M ₩/महिना)',
      hi:'राष्ट्रीय पेंशन 4.5% + स्वास्थ्य 3.545% + दीर्घकालीन देखभाल 0.491% + रोजगार 0.9% ≈ 9.4% (सीमा 6.17M ₩/माह)'
    }
  },
  JP: {
    period:'annual', insuranceDeductible:true, // JP: bảo hiểm CÓ trừ khỏi thu nhập chịu thuế (社会保険料控除)
    insurance: { rate: 0.155 }, // 厚生年金 9.15% + 健康保険 5.2% + 雇用保険 0.6% + 介護 0.55% ≈ 15.5%
    residentTax: 0.10, // 住民税 10% cộng thêm
    brackets: [[1950000,0.05],[1350000,0.10],[3650000,0.20],[2050000,0.23],[9000000,0.33],[22000000,0.40],[Infinity,0.45]],
    rounding: 'floor', currency: '¥', flag: '🇯🇵', name: {vi:'Nhật Bản',en:'Japan',ko:'일본',ja:'日本',zh:'日本',my:'ဂျပန်',th:'ญี่ปุ่น',id:'Jepang',ph:'Hapon',ne:'जापान',hi:'जापान'},
    insNote: {
      vi:'Hưu trí 9.15% + BHYT ~5.2% + Thất nghiệp 0.6% + Điều dưỡng 0.55% ≈ 15.5% (BH ĐƯỢC trừ khỏi thu nhập chịu thuế)',
      en:'Pension 9.15% + Health ~5.2% + Employment 0.6% + LTC 0.55% ≈ 15.5% (insurance IS deductible from taxable income)',
      ko:'후생연금 9.15% + 건강보험 ~5.2% + 고용보험 0.6% + 개호 0.55% ≈ 15.5% (보험료 세금공제 가능)',
      ja:'厚生年金 9.15% + 健康保険 ~5.2% + 雇用保険 0.6% + 介護 0.55% ≈ 15.5%（社会保険料控除あり）',
      zh:'厚生年金 9.15% + 健康保险 ~5.2% + 雇用保险 0.6% + 介护 0.55% ≈ 15.5%（社会保险费可从应税收入扣除）',
      my:'ပင်စီမံချက် 9.15% + ကျန်းမာ ~5.2% + အလုပ် 0.6% + ပြုစုမှု 0.55% ≈ 15.5% (BH ကို အခွန်ဝင်ငွေမှ နုတ်ရ)',
      th:'เงินบำนาญ 9.15% + ประกันสุขภาพ ~5.2% + ว่างงาน 0.6% + ดูแลระยะยาว 0.55% ≈ 15.5% (ประกันสังคมหักภาษีได้)',
      id:'Pensiun 9.15% + Kesehatan ~5.2% + Ketenagakerjaan 0.6% + Perawatan 0.55% ≈ 15.5% (asuransi dapat dikurangkan dari pajak)',
      ph:'Pension 9.15% + Health ~5.2% + Employment 0.6% + LTC 0.55% ≈ 15.5% (insurance IS deductible from taxable income)',
      ne:'पेन्सन 9.15% + स्वास्थ्य ~5.2% + रोजगार 0.6% + दीर्घकालीन हेरचाह 0.55% ≈ 15.5% (बीमा कर आयबाट काट्न मिल्छ)',
      hi:'पेंशन 9.15% + स्वास्थ्य ~5.2% + रोजगार 0.6% + दीर्घकालीन देखभाल 0.55% ≈ 15.5% (बीमा कर योग्य आय से काटा जाता है)'
    }
  },
  TW: {
    period:'annual', insuranceDeductible:true,
    insurance: { rate: 0.0481 }, // 勞工保險 2.35% + 健保 1.69% + 就業保險 0.42% ≈ 4.81% (2025)
    deduction: { personal: 97000, standard: 131000 }, // 免稅額 NT$97K + 標準扣除額 NT$131K/năm (2025)
    brackets: [[590000,0.05],[740000,0.12],[1330000,0.20],[2320000,0.30],[Infinity,0.40]],
    rounding: 'round', currency: 'NT$', flag: '🇹🇼', name: {vi:'Đài Loan',en:'Taiwan',ko:'대만',ja:'台湾',zh:'台湾',my:'တိုင်ဝမ်',th:'ไต้หวัน',id:'Taiwan',ph:'Taiwan',ne:'ताइवान',hi:'ताइवान'},
    insNote: {
      vi:'Lao bảo 2.35% + Kiện bảo 1.69% + Tựu bảo 0.42% ≈ 4.81% | Miễn thuế NT$97,000 + Khấu trừ NT$131,000/năm (2025)',
      en:'Labor Insurance 2.35% + NHI 1.69% + Employment 0.42% ≈ 4.81% | Exemption NT$97K + Standard NT$131K/yr (2025)',
      ko:'노동보험 2.35% + 건강보험 1.69% + 취업보험 0.42% ≈ 4.81% | 면세 NT$97K + 기본공제 NT$131K/년 (2025)',
      ja:'労働保険 2.35% + 健民保険 1.69% + 就業保険 0.42% ≈ 4.81% | 免税額 NT$97K + 標準控除 NT$131K/年（2025）',
      zh:'勞保 2.35% + 健保 1.69% + 就保 0.42% ≈ 4.81% | 免稅額 NT$97,000 + 標準扣除額 NT$131,000/年（2025）',
      my:'ပင်ဆောင်BH 2.35% + ကျန်းမာBH 1.69% + အလုပ်BH 0.42% ≈ 4.81% | ကင်းလွတ် NT$97K + ကိုယ်ထည့် NT$131K/နှစ်',
      th:'ประกันแรงงาน 2.35% + ประกันสุขภาพ 1.69% + ประกันว่างงาน 0.42% ≈ 4.81% | ยกเว้น NT$97K + หักมาตรฐาน NT$131K/ปี (2025)',
      id:'Asuransi Tenaga Kerja 2.35% + NHI 1.69% + Ketenagakerjaan 0.42% ≈ 4.81% | Bebas NT$97K + Standar NT$131K/thn (2025)',
      ph:'Labor Insurance 2.35% + NHI 1.69% + Employment 0.42% ≈ 4.81% | Exemption NT$97K + Standard NT$131K/yr (2025)',
      ne:'श्रम बीमा 2.35% + स्वास्थ्य 1.69% + रोजगार 0.42% ≈ 4.81% | कर छुट NT$97K + मानक NT$131K/वर्ष (2025)',
      hi:'श्रम बीमा 2.35% + स्वास्थ्य 1.69% + रोजगार 0.42% ≈ 4.81% | छूट NT$97K + मानक NT$131K/वर्ष (2025)'
    }
  },
  US: {
    period:'annual', insuranceDeductible:false, // SS/Medicare không trừ khỏi thuế liên bang
    insurance: { ssRate: 0.062, ssCap: 176100, medicareRate: 0.0145 }, // SS 6.2% (cap $176,100/năm, 2025) + Medicare 1.45%
    deduction: { standard: 15000 }, // Standard deduction 2025 (single): $15,000/năm
    brackets: [[11925,0.10],[36550,0.12],[54875,0.22],[93950,0.24],[53225,0.32],[375825,0.35],[Infinity,0.37]],
    rounding: 'round', currency: '$', flag: '🇺🇸', name: {vi:'Hoa Kỳ',en:'United States',ko:'미국',ja:'アメリカ',zh:'美国',my:'အမေရိကန်',th:'สหรัฐอเมริกา',id:'Amerika Serikat',ph:'Estados Unidos',ne:'संयुक्त राज्य',hi:'संयुक्त राज्य'},
    insNote: {
      vi:'Social Security 6.2% (giới hạn $176,100/năm, 2025) + Medicare 1.45% | Khấu trừ cơ bản $15,000/năm (độc thân)',
      en:'Social Security 6.2% (cap $176,100/yr, 2025) + Medicare 1.45% | Standard deduction $15,000/yr (single)',
      ko:'사회보장 6.2% (한도 $176,100/년, 2025) + 메디케어 1.45% | 표준공제 $15,000/년 (독신)',
      ja:'社会保障 6.2% (上限$176,100/年、2025) + メディケア 1.45% | 標準控除 $15,000/年（独身）',
      zh:'社会保障 6.2% (上限$176,100/年，2025) + 医疗保险 1.45% | 标准扣除额 $15,000/年（单身）',
      my:'Social Security 6.2% (ကန့်သတ် $176,100/နှစ်, 2025) + Medicare 1.45% | မြေပြင်နုတ် $15,000/နှစ် (တစ်ယောက်တည်း)',
      th:'Social Security 6.2% (เพดาน $176,100/ปี, 2025) + Medicare 1.45% | หักมาตรฐาน $15,000/ปี (โสด)',
      id:'Social Security 6.2% (batas $176,100/thn, 2025) + Medicare 1.45% | Potongan standar $15,000/thn (lajang)',
      ph:'Social Security 6.2% (cap $176,100/yr, 2025) + Medicare 1.45% | Standard deduction $15,000/yr (single)',
      ne:'Social Security 6.2% (सीमा $176,100/वर्ष, 2025) + Medicare 1.45% | मानक कटौती $15,000/वर्ष (एकल)',
      hi:'Social Security 6.2% (सीमा $176,100/वर्ष, 2025) + Medicare 1.45% | मानक कटौती $15,000/वर्ष (अकेला)'
    }
  },
  MY: {
    period:'annual', insuranceDeductible:true,
    insurance: { rate: 0.02 }, // SSB 2% (tỉ lệ nhân viên, chủ doanh nghiệp đóng thêm 3%)
    deduction: { personal: 4800000 }, // Personal relief MMK 4.8M/năm
    brackets: [[2000000,0],[8000000,0.05],[20000000,0.10],[20000000,0.15],[Infinity,0.25]],
    rounding: 'round', currency: 'K', flag: '🇲🇲', name: {vi:'Myanmar',en:'Myanmar',ko:'미얀마',ja:'ミャンマー',zh:'缅甸',my:'မြန်မာ',th:'เมียนมา',id:'Myanmar',ph:'Myanmar',ne:'म्यानमार',hi:'म्यांमार'},
    insNote: {
      vi:'Social Security Board (SSB): người lao động đóng 2% (chủ sử dụng 3%) | Giảm trừ bản thân: 4,800,000 MMK/năm',
      en:'Social Security Board (SSB): employee 2% (employer 3%) | Personal relief: 4,800,000 MMK/yr',
      ko:'사회보장위원회(SSB): 근로자 2% (고용주 3%) | 개인 공제: 480만 MMK/년',
      ja:'社会保障委員会(SSB): 従業員 2%（雇用主 3%）| 個人控除: 480万 MMK/年',
      zh:'社会保障委员会(SSB): 员工 2%（雇主 3%）| 个人减免: 480万 MMK/年',
      my:'Social Security Board (SSB): ဝန်ထမ်း 2% (အလုပ်ရှင် 3%) | ကိုယ်ရေးကင်းလွတ်: 4,800,000 MMK/နှစ်',
      th:'Social Security Board (SSB): ลูกจ้าง 2% (นายจ้าง 3%) | ลดหย่อนส่วนตัว: 4,800,000 MMK/ปี',
      id:'Social Security Board (SSB): karyawan 2% (pemberi kerja 3%) | Pengurangan pribadi: 4.800.000 MMK/thn',
      ph:'Social Security Board (SSB): empleyado 2% (employer 3%) | Personal relief: 4,800,000 MMK/yr',
      ne:'Social Security Board (SSB): कर्मचारी 2% (नियोक्ता 3%) | व्यक्तिगत छुट: 4,800,000 MMK/वर्ष',
      hi:'Social Security Board (SSB): कर्मचारी 2% (नियोक्ता 3%) | व्यक्तिगत छूट: 4,800,000 MMK/वर्ष'
    }
  },
  TH: {
    period:'annual', insuranceDeductible:true,
    insurance: { rate: 0.05, cap: 15000 }, // ประกันสังคม 5%, trần lương 15,000 ฿/tháng → đóng tối đa 750 ฿/tháng
    deduction: { personal: 60000 }, // ค่าลดหย่อนส่วนตัว 60,000 ฿/ปี
    brackets: [[150000,0],[150000,0.05],[200000,0.10],[250000,0.15],[250000,0.20],[3000000,0.25],[1000000,0.30],[Infinity,0.35]],
    rounding: 'round', currency: '฿', flag: '🇹🇭', name: {vi:'Thái Lan',en:'Thailand',ko:'태국',ja:'タイ',zh:'泰国',my:'ထိုင်းနိုင်ငံ',th:'ประเทศไทย',id:'Thailand',ph:'Thailand',ne:'थाइल्याण्ड',hi:'थाईลैंड'},
    insNote: {
      vi:'BHXH 5% (lương tối đa 15,000 ฿/tháng → đóng tối đa 750 ฿/tháng) | Giảm trừ 60,000 ฿/năm',
      en:'Social Security 5% (salary cap 15,000 ฿/mo → max 750 ฿/mo) | Personal deduction 60,000 ฿/yr',
      ko:'사회보험 5% (월 상한 15,000 ฿ → 최대 750 ฿/월) | 개인 공제 60,000 ฿/년',
      ja:'社会保険 5% (月上限 15,000 ฿ → 最大 750 ฿/月) | 個人控除 60,000 ฿/年',
      zh:'社会保险 5% (月工资上限 15,000 ฿ → 最多 750 ฿/月) | 个人减免 60,000 ฿/年',
      my:'လူမှုBH 5% (လစာ အများဆုံး 15,000 ฿/လ → အများဆုံး 750 ฿/လ) | ကိုယ်ရေးနုတ် 60,000 ฿/နှစ်',
      th:'ประกันสังคม 5% (เงินเดือนสูงสุด 15,000 ฿/เดือน → สูงสุด 750 ฿/เดือน) | ลดหย่อน 60,000 ฿/ปี',
      id:'Jaminan Sosial 5% (gaji maks 15,000 ฿/bln → maks 750 ฿/bln) | Pengurangan pribadi 60,000 ฿/thn',
      ph:'Social Security 5% (salary cap 15,000 ฿/mo → max 750 ฿/mo) | Personal deduction 60,000 ฿/yr',
      ne:'सामाजिक बीमा 5% (तलब सीमा 15,000 ฿/महिना → अधिकतम 750 ฿/महिना) | व्यक्तिगत छुट 60,000 ฿/वर्ष',
      hi:'सामाजिक बीमा 5% (वेतन सीमा 15,000 ฿/माह → अधिकतम 750 ฿/माह) | व्यक्तिगत कटौती 60,000 ฿/वर्ष'
    }
  },
  ID: {
    period:'annual', insuranceDeductible:true,
    insurance: { rate: 0.04 }, // BPJS Ketenagakerjaan 2% + BPJS Kesehatan 1% + JKK/JKm ≈ 1% ≈ 4% (phần NLĐ)
    deduction: { personal: 54000000 }, // PTKP (Penghasilan Tidak Kena Pajak) Rp54 juta/tahun
    brackets: [[60000000,0.05],[190000000,0.15],[250000000,0.25],[4500000000,0.30],[Infinity,0.35]],
    rounding: 'round', currency: 'Rp', flag: '🇮🇩', name: {vi:'Indonesia',en:'Indonesia',ko:'인도네시아',ja:'インドネシア',zh:'印度尼西亚',my:'အင်ဒိုနီးရှား',th:'อินโดนีเซีย',id:'Indonesia',ph:'Indonesia',ne:'इन्डोनेसिया',hi:'इंडोनेशिया'},
    insNote: {
      vi:'BPJS Ketenagakerjaan 2% + BPJS Kesehatan 1% + JKK/JKm ~1% ≈ 4% (phần NLĐ) | PTKP (lajang): Rp 54.000.000/năm',
      en:'BPJS TK 2% + BPJS Health 1% + JKK/JKm ~1% ≈ 4% (employee share) | PTKP (single): Rp 54,000,000/yr',
      ko:'BPJS TK 2% + BPJS 건강 1% + JKK/JKm ~1% ≈ 4% (근로자 부담) | PTKP (독신): Rp 54,000,000/년',
      ja:'BPJS TK 2% + BPJS 健康 1% + JKK/JKm ~1% ≈ 4% (従業員負担) | PTKP（独身）: Rp 54,000,000/年',
      zh:'BPJS TK 2% + BPJS 健康 1% + JKK/JKm ~1% ≈ 4% (员工部分) | PTKP (单身): Rp 54,000,000/年',
      my:'BPJS TK 2% + BPJS ကျန်းမာ 1% + JKK/JKm ~1% ≈ 4% (ဝန်ထမ်းပိုင်း) | PTKP (တစ်ယောက်): Rp 54,000,000/နှစ်',
      th:'BPJS TK 2% + BPJS สุขภาพ 1% + JKK/JKm ~1% ≈ 4% (ส่วนลูกจ้าง) | PTKP (โสด): Rp 54,000,000/ปี',
      id:'BPJS TK 2% + BPJS Kes. 1% + JKK/JKm ~1% ≈ 4% (porsi karyawan) | PTKP (TK/0): Rp 54.000.000/tahun',
      ph:'BPJS TK 2% + BPJS Health 1% + JKK/JKm ~1% ≈ 4% (employee share) | PTKP (single): Rp 54,000,000/yr',
      ne:'BPJS TK 2% + BPJS स्वास्थ्य 1% + JKK/JKm ~1% ≈ 4% (कर्मचारी अंश) | PTKP (एकल): Rp 54,000,000/वर्ष',
      hi:'BPJS TK 2% + BPJS स्वास्थ्य 1% + JKK/JKm ~1% ≈ 4% (कर्मचारी हिस्सा) | PTKP (अकेला): Rp 54,000,000/वर्ष'
    }
  },
  PH: {
    period:'annual', insuranceDeductible:true,
    insurance: { rate: 0.085 }, // SSS 4.5% + PhilHealth 2.5% + Pag-IBIG 1% + ECC ~0.5% ≈ 8.5% (2025)
    deduction: { personal: 250000 }, // Basic personal exemption ₱250,000/năm (TRAIN Law)
    brackets: [[250000,0],[150000,0.15],[400000,0.20],[1200000,0.25],[6000000,0.32],[Infinity,0.35]],
    rounding: 'round', currency: '₱', flag: '🇵🇭', name: {vi:'Philippines',en:'Philippines',ko:'필리핀',ja:'フィリピン',zh:'菲律宾',my:'ဖိလစ်ပိုင်',th:'ฟิลิปปินส์',id:'Filipina',ph:'Pilipinas',ne:'फिलिपिन्स',hi:'फ़िलीपींस'},
    insNote: {
      vi:'SSS 4.5% + PhilHealth 2.5% + Pag-IBIG 1% + ECC ~0.5% ≈ 8.5% | Miễn thuế: ₱250,000/năm (TRAIN Law)',
      en:'SSS 4.5% + PhilHealth 2.5% + Pag-IBIG 1% + ECC ~0.5% ≈ 8.5% | Basic exemption: ₱250,000/yr (TRAIN Law)',
      ko:'SSS 4.5% + PhilHealth 2.5% + Pag-IBIG 1% + ECC ~0.5% ≈ 8.5% | 기본 면세: ₱250,000/년 (TRAIN법)',
      ja:'SSS 4.5% + PhilHealth 2.5% + Pag-IBIG 1% + ECC ~0.5% ≈ 8.5% | 基本免除: ₱250,000/年 (TRAIN法)',
      zh:'SSS 4.5% + PhilHealth 2.5% + Pag-IBIG 1% + ECC ~0.5% ≈ 8.5% | 基本免税: ₱250,000/年 (TRAIN法)',
      my:'SSS 4.5% + PhilHealth 2.5% + Pag-IBIG 1% + ECC ~0.5% ≈ 8.5% | ကင်းလွတ်: ₱250,000/နှစ် (TRAIN ဥပဒေ)',
      th:'SSS 4.5% + PhilHealth 2.5% + Pag-IBIG 1% + ECC ~0.5% ≈ 8.5% | ยกเว้นพื้นฐาน: ₱250,000/ปี (TRAIN Law)',
      id:'SSS 4.5% + PhilHealth 2.5% + Pag-IBIG 1% + ECC ~0.5% ≈ 8.5% | Pembebasan dasar: ₱250,000/thn (TRAIN Law)',
      ph:'SSS 4.5% + PhilHealth 2.5% + Pag-IBIG 1% + ECC ~0.5% ≈ 8.5% | Basic exemption: ₱250,000/yr (TRAIN Law)',
      ne:'SSS 4.5% + PhilHealth 2.5% + Pag-IBIG 1% + ECC ~0.5% ≈ 8.5% | मूल कर छुट: ₱250,000/वर्ष (TRAIN Law)',
      hi:'SSS 4.5% + PhilHealth 2.5% + Pag-IBIG 1% + ECC ~0.5% ≈ 8.5% | मूल छूट: ₱250,000/वर्ष (TRAIN कानून)'
    }
  },
  NP: {
    period:'annual', insuranceDeductible:true,
    insurance: { rate: 0.11 }, // Quỹ hưu trí (CIT) 10% + bảo hiểm sức khỏe 1% = 11%
    deduction: { personal: 500000 }, // Rs.500,000/năm basic personal allowance
    brackets: [[500000,0.01],[4500000,0.10],[2500000,0.20],[2500000,0.30],[5000000,0.36],[Infinity,0.39]],
    rounding: 'round', currency: 'रु', flag: '🇳🇵', name: {vi:'Nepal',en:'Nepal',ko:'네팔',ja:'ネパール',zh:'尼泊尔',my:'နီပေါ',th:'เนปาล',id:'Nepal',ph:'Nepal',ne:'नेपाल',hi:'नेपाल'},
    insNote: {
      vi:'Quỹ hưu trí (CIT) 10% + Y tế 1% = 11% | Giảm trừ cá nhân: रु 500,000/năm',
      en:'Provident Fund (CIT) 10% + Health 1% = 11% | Personal allowance: रु 500,000/yr',
      ko:'적립금(CIT) 10% + 의료 1% = 11% | 개인 공제: रु 500,000/년',
      ja:'積立金(CIT) 10% + 医療 1% = 11% | 個人控除: रु 500,000/年',
      zh:'公积金(CIT) 10% + 医疗 1% = 11% | 个人免税额: रु 500,000/年',
      my:'ပြည်တွင်း CIT 10% + ကျန်းမာ 1% = 11% | ကိုယ်ရေးကင်းလွတ်: रु 500,000/နှစ်',
      th:'กองทุนสำรองเลี้ยงชีพ (CIT) 10% + สุขภาพ 1% = 11% | ลดหย่อนส่วนตัว: रु 500,000/ปี',
      id:'Dana Pensiun (CIT) 10% + Kesehatan 1% = 11% | Pengurangan pribadi: रु 500,000/thn',
      ph:'Provident Fund (CIT) 10% + Health 1% = 11% | Personal allowance: रु 500,000/yr',
      ne:'भविष्य कोष (CIT) 10% + स्वास्थ्य 1% = 11% | व्यक्तिगत भत्ता: रु 500,000/वर्ष',
      hi:'भविष्य निधि (CIT) 10% + स्वास्थ्य 1% = 11% | व्यक्तिगत भत्ता: रु 500,000/वर्ष'
    }
  },
  IN: {
    period:'annual', insuranceDeductible:true,
    insurance: { rate: 0.12 }, // EPF (Employees Provident Fund) 12%
    deduction: { personal: 300000 }, // Basic exemption: ₹3,00,000/năm (New Tax Regime 2024)
    brackets: [[300000,0],[300000,0.05],[300000,0.10],[300000,0.15],[300000,0.20],[Infinity,0.30]],
    rounding: 'round', currency: '₹', flag: '🇮🇳', name: {vi:'Ấn Độ',en:'India',ko:'인도',ja:'インド',zh:'印度',my:'အိန္ဒိယ',th:'อินเดีย',id:'India',ph:'India',ne:'भारत',hi:'भारत'},
    insNote: {
      vi:'EPF 12% (người lao động đóng) | Chế độ thuế mới FY2024-25: Miễn thuế ₹3,00,000',
      en:'EPF 12% (Employee contribution) | New Tax Regime FY2024-25: Exemption ₹3,00,000',
      ko:'EPF 12% (근로자 부담) | 신세제 FY2024-25: 면세 ₹3,00,000',
      ja:'EPF 12% (従業員負担) | 新税制 FY2024-25: 免除 ₹3,00,000',
      zh:'EPF 12% (员工缴纳) | 新税制 FY2024-25: 免除 ₹3,00,000',
      my:'EPF 12% (ဝန်ထမ်းပေးဆောင်) | အခွန်အသစ် FY2024-25: ကင်းလွတ် ₹3,00,000',
      th:'EPF 12% (ลูกจ้างจ่าย) | ระบบภาษีใหม่ FY2024-25: ยกเว้น ₹3,00,000',
      id:'EPF 12% (iuran karyawan) | Rezim Pajak Baru FY2024-25: Pengecualian ₹3,00,000',
      ph:'EPF 12% (Employee contribution) | New Tax Regime FY2024-25: Exemption ₹3,00,000',
      ne:'EPF 12% (कर्मचारी योगदान) | नयाँ कर व्यवस्था FY2024-25: छुट ₹3,00,000',
      hi:'EPF 12% (कर्मचारी योगदान) | नई कर व्यवस्था FY2024-25: छूट ₹3,00,000'
    }
  }
};

/** Áp thuế lũy tiến từng phần theo bậc */
// → function _applyBrackets(income, brackets){ (moved to utils.js)

/** Tính bảo hiểm hàng tháng (mọi nước đều tính từ monthly gross) */
// → function _calcInsurance(rule, monthlyGross){ (moved to utils.js)

/** Làm tròn theo quy định từng nước */
// → function _roundTax(val, mode){ (moved to utils.js)

/** Engine chính: tính lương net từ monthly gross — hỗ trợ 11 quốc gia
 * @param country 'VN'|'KR'|'JP'|'TW'|'US'|'MY'|'TH'|'ID'|'PH'|'NP'|'IN'
 * @param monthlyGross  Thu nhập tháng (gross)
 * @param dependents    Số người phụ thuộc (dùng cho VN)
// taxEngineCalculate() → moved to utils.js

/* ===== Backward compat: code cũ dùng tinhBH/tinhTNCN cho VN ===== */
// → function tinhBH(b,v){const bb=Math.min(b,TRAN_BH);const bt=M (moved to utils.js)

// === tinhTNCN ===
function tinhTNCN(t){if(t<=0)return 0;return _applyBrackets(t, TAX_RULES.VN.brackets);}


// Sync langCfg with userData country selection
function syncLangCfg(){
  langCfg.payrollCountry = userData.country || 'VN';
  langCfg.lang = userData.lang || 'vi';
  lsSet('cp22_lang',langCfg);
}

/* ===== SHIM TƯƠNG THÍCH CHO ENGINE TÍNH LƯƠNG ===== */
function buildCfgShim(){
  return {
    luong: userData.salary || 0,
    luongNgay: 0,
    kieu: 'thang',
    ngayCong: userData.ngc || 26,
    gioNgay: userData.hoursPerShift || 8,
    npt: 0,
    vung: 5310000,
    dsCa: [],
  };
}

// Shims so calcDaySalaryFull can call ldN/lgN/cfg
let _cfg_shim = {luong:0,ngayCong:26,gioNgay:8,kieu:'thang'};
function ldN(){return (_cfg_shim.luong||0)/(_cfg_shim.ngayCong||26);}
function lgN(){return ldN()/(_cfg_shim.gioNgay||8);}
function fmtFull(n){return Math.round(n).toLocaleString('vi-VN')+' ₫';}
