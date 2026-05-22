/* ═══════════════════════════════════════════════════════════
   Test tự động cho ChamCongPro
   Chạy: npm test
   Mỗi lần sửa code xong → chạy lệnh trên → biết ngay lỗi
   ═══════════════════════════════════════════════════════════ */
const { loadApp } = require('./setup');

let app;
beforeAll(() => { app = loadApp(); });

/* ──────────────── pGio: đổi "HH:MM" → phút ──────────────── */
describe('pGio — đổi giờ sang phút', () => {
  test('08:00 → 480 phút', () => {
    expect(app.pGio('08:00')).toBe(480);
  });
  test('17:30 → 1050 phút', () => {
    expect(app.pGio('17:30')).toBe(1050);
  });
  test('00:00 → 0 phút', () => {
    expect(app.pGio('00:00')).toBe(0);
  });
  test('23:59 → 1439 phút', () => {
    expect(app.pGio('23:59')).toBe(1439);
  });
  test('chuỗi rỗng → 0', () => {
    expect(app.pGio('')).toBe(0);
  });
  test('null → 0', () => {
    expect(app.pGio(null)).toBe(0);
  });
});

/* ──────────────── soGio: tính số giờ làm ──────────────── */
describe('soGio — tính số giờ giữa 2 mốc', () => {
  test('08:00 → 17:00 = 9 giờ', () => {
    expect(app.soGio('08:00', '17:00')).toBe(9);
  });
  test('08:00 → 12:00 = 4 giờ', () => {
    expect(app.soGio('08:00', '12:00')).toBe(4);
  });
  test('22:00 → 06:00 = 8 giờ (ca đêm qua ngày)', () => {
    expect(app.soGio('22:00', '06:00')).toBe(8);
  });
  test('thiếu giờ vào → null', () => {
    expect(app.soGio('', '17:00')).toBeNull();
  });
  test('thiếu giờ ra → null', () => {
    expect(app.soGio('08:00', '')).toBeNull();
  });
});

/* ──────────────── timeToMin (utils.js) ──────────────── */
describe('timeToMin — đổi giờ sang phút (utils)', () => {
  test('08:30 → 510', () => {
    expect(app.timeToMin('08:30')).toBe(510);
  });
  test('00:00 → 0', () => {
    expect(app.timeToMin('00:00')).toBe(0);
  });
});

/* ──────────────── fmtMoney: định dạng tiền ──────────────── */
describe('fmtMoney — hiển thị tiền tệ', () => {
  test('VN: 5000000 → có ký hiệu ₫', () => {
    const result = app.fmtMoney(5000000, 'VN');
    expect(result).toContain('₫');
    expect(result).toContain('5');
  });
  test('KR: 3000000 → có ký hiệu ₩', () => {
    const result = app.fmtMoney(3000000, 'KR');
    expect(result).toContain('₩');
  });
  test('JP: 250000 → có ký hiệu ¥', () => {
    const result = app.fmtMoney(250000, 'JP');
    expect(result).toContain('¥');
  });
  test('số 0 → không lỗi', () => {
    expect(() => app.fmtMoney(0, 'VN')).not.toThrow();
  });
});

/* ──────────────── _applyBrackets: thuế lũy tiến ──────────────── */
describe('_applyBrackets — tính thuế theo bậc', () => {
  const brackets = [[5000000, 0.05], [5000000, 0.10], [8000000, 0.15]];

  test('thu nhập 0 → thuế 0', () => {
    expect(app._applyBrackets(0, brackets)).toBe(0);
  });
  test('thu nhập 3 triệu → 3M × 5% = 150k', () => {
    expect(app._applyBrackets(3000000, brackets)).toBe(150000);
  });
  test('thu nhập 8 triệu → 5M×5% + 3M×10% = 550k', () => {
    expect(app._applyBrackets(8000000, brackets)).toBe(550000);
  });
  test('thu nhập 15 triệu → 5M×5% + 5M×10% + 5M×15% = 1.5M', () => {
    expect(app._applyBrackets(15000000, brackets)).toBe(1500000);
  });
});

/* ──────────────── tinhBH: bảo hiểm VN ──────────────── */
describe('tinhBH — tính bảo hiểm xã hội VN', () => {
  test('lương 10 triệu → BHXH=800k, BHYT=150k, BHTN=100k', () => {
    const r = app.tinhBH(10000000, 5310000);
    expect(r.bhxh).toBe(800000);
    expect(r.bhyt).toBe(150000);
    expect(r.bhtn).toBe(100000);
  });
  test('lương trên trần 46.8M → BHXH bị giới hạn', () => {
    const r = app.tinhBH(50000000, 5310000);
    expect(r.bhxh).toBe(46800000 * 0.08);
  });
  test('lương 0 → tất cả = 0', () => {
    const r = app.tinhBH(0, 5310000);
    expect(r.bhxh).toBe(0);
    expect(r.bhyt).toBe(0);
    expect(r.bhtn).toBe(0);
  });
});

/* ──────────────── taxEngineCalculate: tính lương net ──────────────── */
describe('taxEngineCalculate — tính thuế & lương net', () => {
  test('VN: lương 0 → net 0', () => {
    const r = app.taxEngineCalculate('VN', 0);
    expect(r.net).toBe(0);
    expect(r.tax).toBe(0);
  });
  test('VN: lương 15 triệu → net > 0 và < gross', () => {
    const r = app.taxEngineCalculate('VN', 15000000);
    expect(r.net).toBeGreaterThan(0);
    expect(r.net).toBeLessThan(15000000);
    expect(r.insurance).toBeGreaterThan(0);
  });
  test('VN: lương 10 triệu (dưới ngưỡng chịu thuế) → thuế = 0', () => {
    const r = app.taxEngineCalculate('VN', 10000000, 0);
    expect(r.tax).toBe(0);
  });
  test('KR: lương 3 triệu ₩ → có insurance', () => {
    const r = app.taxEngineCalculate('KR', 3000000);
    expect(r.insurance).toBeGreaterThan(0);
    expect(r.country).toBe('KR');
  });
  test('quốc gia không hợp lệ → fallback VN', () => {
    const r = app.taxEngineCalculate('XX', 15000000);
    expect(r.country).toBe('XX');
    expect(r.net).toBeGreaterThan(0);
  });
});

/* ──────────────── gNL: tra ngày lễ ──────────────── */
describe('gNL — tra cứu ngày lễ', () => {
  test('1/1/2025 VN → Tết Dương lịch', () => {
    app.userData.country = 'VN';
    const r = app.gNL(2025, 0, 1);
    expect(r).toBe('Tết Dương lịch');
  });
  test('ngày thường → null', () => {
    app.userData.country = 'VN';
    const r = app.gNL(2025, 5, 15);
    expect(r).toBeNull();
  });
  test('KR: 1/1/2025 → 신정', () => {
    app.userData.country = 'KR';
    const r = app.gNL(2025, 0, 1);
    expect(r).toBe('신정');
  });
});

/* ──────────────── ldN / lgN: lương ngày & giờ ──────────────── */
describe('ldN / lgN — lương ngày và lương giờ', () => {
  test('lương 7.8M, 26 ngày → ~300k/ngày', () => {
    app._setCfgShim({ luong: 7800000, ngayCong: 26, gioNgay: 8 });
    expect(app.ldN()).toBe(300000);
  });
  test('lương giờ = lương ngày / 8', () => {
    app._setCfgShim({ luong: 7800000, ngayCong: 26, gioNgay: 8 });
    expect(app.lgN()).toBe(300000 / 8);
  });
  test('lương 0 → 0/ngày, 0/giờ', () => {
    app._setCfgShim({ luong: 0, ngayCong: 26, gioNgay: 8 });
    expect(app.ldN()).toBe(0);
    expect(app.lgN()).toBe(0);
  });
});

/* ──────────────── calcDaySalaryFull: tính lương 1 ngày ──────────────── */
describe('calcDaySalaryFull — tính lương ngày đầy đủ', () => {
  beforeEach(() => {
    app._setCfgShimAndLangCfg(
      { luong: 7800000, ngayCong: 26, gioNgay: 8 },
      { lang: 'vi', payrollCountry: 'VN', overrides: {} }
    );
  });

  const vnRule = {
    normalFactor: 1.0, otFactor: 1.5, nightFactor: 1.3,
    nightIsAdditive: false, holidayFactor: 4.0
  };

  test('ngày thường, không OT → đúng 1 ngày lương', () => {
    const result = app.calcDaySalaryFull('cm', null, null, vnRule, 0, 0);
    expect(result).toBe(300000);
  });
  test('ngày lễ → lương × 4', () => {
    const result = app.calcDaySalaryFull('ll', null, null, vnRule, 0, 0);
    expect(result).toBe(300000 * 4);
  });
  test('vắng → trừ 1 ngày lương', () => {
    const result = app.calcDaySalaryFull('vang', null, null, vnRule, 0, 0);
    expect(result).toBe(-300000);
  });
  test('có 2 giờ OT → cộng thêm tiền OT', () => {
    const result = app.calcDaySalaryFull('cm', null, null, vnRule, 2, 0);
    const luongGio = 300000 / 8;
    const expectedOT = 2 * luongGio * 1.5;
    expect(result).toBe(300000 + expectedOT);
  });
  test('có giờ đêm → cộng thêm phụ cấp đêm', () => {
    const result = app.calcDaySalaryFull('cm', null, null, vnRule, 0, 3);
    const luongGio = 300000 / 8;
    const nightPct = 0.3;
    const expectedNight = 3 * luongGio * nightPct;
    expect(result).toBe(300000 + expectedNight);
  });
});

/* ──────────────── calcNightHours: giờ làm đêm ──────────────── */
describe('calcNightHours — tính giờ làm đêm', () => {
  test('ca ngày 08:00-17:00 → 0 giờ đêm', () => {
    const r = app.calcNightHours('08:00', '17:00', 22, 6);
    expect(r).toBe(0);
  });
  test('ca đêm 22:00-06:00 → 8 giờ đêm', () => {
    const r = app.calcNightHours('22:00', '06:00', 22, 6);
    expect(r).toBe(8);
  });
  test('ca chiều tối 18:00-23:00 → 1 giờ đêm (22h-23h)', () => {
    const r = app.calcNightHours('18:00', '23:00', 22, 6);
    expect(r).toBe(1);
  });
});

/* ──────────────── PAYROLL_RULES: dữ liệu tồn tại ──────────────── */
describe('PAYROLL_RULES — dữ liệu lương các quốc gia', () => {
  test('VN tồn tại', () => {
    expect(app.PAYROLL_RULES.VN).toBeDefined();
    expect(app.PAYROLL_RULES.VN.otFactor).toBe(1.5);
  });
  test('KR tồn tại', () => {
    expect(app.PAYROLL_RULES.KR).toBeDefined();
    expect(app.PAYROLL_RULES.KR.nightIsAdditive).toBe(true);
  });
  test('JP tồn tại', () => {
    expect(app.PAYROLL_RULES.JP).toBeDefined();
    expect(app.PAYROLL_RULES.JP.otFactor).toBe(1.25);
  });
  test('TW tồn tại và có ot1/ot2', () => {
    expect(app.PAYROLL_RULES.TW).toBeDefined();
    expect(app.PAYROLL_RULES.TW.ot1Factor).toBeDefined();
    expect(app.PAYROLL_RULES.TW.ot2Factor).toBeDefined();
  });
});

/* ──────────────── TAX_RULES: dữ liệu thuế ──────────────── */
describe('TAX_RULES — dữ liệu thuế các quốc gia', () => {
  test('VN: có brackets, insurance, deduction', () => {
    const vn = app.TAX_RULES.VN;
    expect(vn.brackets.length).toBeGreaterThan(0);
    expect(vn.insurance.rate).toBe(0.105);
    expect(vn.deduction.personal).toBe(11000000);
  });
  test('KR: là annual, có localTax', () => {
    expect(app.TAX_RULES.KR.period).toBe('annual');
    expect(app.TAX_RULES.KR.localTax).toBe(0.10);
  });
});

/* ──────────────── HOLIDAYS_BY_COUNTRY: ngày lễ ──────────────── */
describe('HOLIDAYS_BY_COUNTRY — dữ liệu ngày lễ', () => {
  test('VN có ngày 1/1/2025', () => {
    expect(app.HOLIDAYS_BY_COUNTRY.VN['2025-0-1']).toBe('Tết Dương lịch');
  });
  test('VN có ngày 30/4/2025', () => {
    expect(app.HOLIDAYS_BY_COUNTRY.VN['2025-4-30']).toBeDefined();
  });
  test('KR, JP, TW đều có dữ liệu', () => {
    expect(Object.keys(app.HOLIDAYS_BY_COUNTRY.KR).length).toBeGreaterThan(0);
    expect(Object.keys(app.HOLIDAYS_BY_COUNTRY.JP).length).toBeGreaterThan(0);
    expect(Object.keys(app.HOLIDAYS_BY_COUNTRY.TW).length).toBeGreaterThan(0);
  });
});

/* ──────────────── getLang: lấy bản dịch ──────────────── */
describe('getLang — lấy bản dịch theo ngôn ngữ', () => {
  test('mặc định vi → trả object', () => {
    app.userData.lang = 'vi';
    const t = app.getLang();
    expect(t).toBeDefined();
    expect(typeof t).toBe('object');
  });
  test('ngôn ngữ không tồn tại → fallback vi', () => {
    app.userData.lang = 'zz';
    const t = app.getLang();
    expect(t).toBeDefined();
  });
});
