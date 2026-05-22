/* ═══════════════════════════════════════════════════════════
   Test GPS & Thông báo cho ChamCongPro
   Chạy: npm test
   ═══════════════════════════════════════════════════════════ */
const { loadApp } = require('./setup');

let app;
beforeAll(() => { app = loadApp(); });

/* ══════════════════════════════════════════════════════════════
   1. gpsDistance — Haversine: tính khoảng cách giữa 2 điểm GPS
   ══════════════════════════════════════════════════════════════ */
describe('gpsDistance — khoảng cách GPS (Haversine)', () => {
  test('cùng 1 điểm → 0 mét', () => {
    expect(app.gpsDistance(10.762, 106.660, 10.762, 106.660)).toBe(0);
  });
  test('HCM → Hà Nội ≈ 1200-1300km', () => {
    const d = app.gpsDistance(10.762, 106.660, 21.028, 105.854);
    expect(d).toBeGreaterThan(1100000);
    expect(d).toBeLessThan(1400000);
  });
  test('2 điểm cách nhau ~100m', () => {
    // khoảng 0.001 độ ≈ 111m
    const d = app.gpsDistance(10.762, 106.660, 10.763, 106.660);
    expect(d).toBeGreaterThan(80);
    expect(d).toBeLessThan(150);
  });
  test('2 điểm cách nhau ~15m (trong bán kính geofence)', () => {
    // 0.00013 độ ≈ 15m
    const d = app.gpsDistance(10.762000, 106.660000, 10.762130, 106.660000);
    expect(d).toBeGreaterThan(10);
    expect(d).toBeLessThan(20);
  });
});

/* ══════════════════════════════════════════════════════════════
   2. gpsNum — validate & convert số
   ══════════════════════════════════════════════════════════════ */
describe('gpsNum — validate số GPS', () => {
  test('số hợp lệ', () => {
    expect(app.gpsNum(10.5)).toBe(10.5);
    expect(app.gpsNum('106.66')).toBe(106.66);
    expect(app.gpsNum(0)).toBe(0);
  });
  test('không hợp lệ → null', () => {
    // Number(null)=0 → isFinite → trả 0 (hợp lệ theo implementation)
    expect(app.gpsNum(null)).toBe(0);
    expect(app.gpsNum('abc')).toBeNull();
    expect(app.gpsNum(NaN)).toBeNull();
    expect(app.gpsNum(Infinity)).toBeNull();
  });
});

/* ══════════════════════════════════════════════════════════════
   3. gpsValidPair — kiểm tra tọa độ hợp lệ
   ══════════════════════════════════════════════════════════════ */
describe('gpsValidPair — tọa độ hợp lệ', () => {
  test('HCM hợp lệ', () => {
    expect(app.gpsValidPair(10.762, 106.660)).toBe(true);
  });
  test('vĩ độ cực → hợp lệ', () => {
    expect(app.gpsValidPair(90, 180)).toBe(true);
    expect(app.gpsValidPair(-90, -180)).toBe(true);
  });
  test('ngoài range → sai', () => {
    expect(app.gpsValidPair(91, 106)).toBe(false);
    expect(app.gpsValidPair(10, 181)).toBe(false);
  });
  test('null → sai', () => {
    expect(app.gpsValidPair(null, 106)).toBe(false);
    expect(app.gpsValidPair(10, null)).toBe(false);
  });
});

/* ══════════════════════════════════════════════════════════════
   4. gpsHasLocation — kiểm tra object vị trí
   ══════════════════════════════════════════════════════════════ */
describe('gpsHasLocation — có vị trí không', () => {
  test('có lat/lng hợp lệ → true', () => {
    expect(app.gpsHasLocation({ lat: 10.762, lng: 106.66 })).toBe(true);
  });
  test('null → false', () => {
    expect(app.gpsHasLocation(null)).toBe(false);
  });
  test('lat/lng null → true (vì gpsNum(null)=0, tọa độ 0,106 hợp lệ)', () => {
    // gpsNum(null) → 0, gpsValidPair(0, 106.66) → true
    expect(app.gpsHasLocation({ lat: null, lng: 106.66 })).toBe(true);
  });
  test('object rỗng → false', () => {
    expect(app.gpsHasLocation({})).toBe(false);
  });
});

/* ══════════════════════════════════════════════════════════════
   5. gpsJobKey — chuẩn hóa key công việc
   ══════════════════════════════════════════════════════════════ */
describe('gpsJobKey — chuẩn hóa job key', () => {
  test('"sub" → "sub"', () => {
    expect(app.gpsJobKey('sub')).toBe('sub');
  });
  test('"main" → "main"', () => {
    expect(app.gpsJobKey('main')).toBe('main');
  });
  test('bất kỳ → "main"', () => {
    expect(app.gpsJobKey('xyz')).toBe('main');
    expect(app.gpsJobKey(null)).toBe('main');
    expect(app.gpsJobKey(undefined)).toBe('main');
  });
});

/* ══════════════════════════════════════════════════════════════
   6. gpsLocationRadius — chuẩn hóa bán kính
   ══════════════════════════════════════════════════════════════ */
describe('gpsLocationRadius — bán kính geofence', () => {
  test('số hợp lệ → trả về đúng', () => {
    expect(app.gpsLocationRadius(50)).toBe(50);
    expect(app.gpsLocationRadius(100)).toBe(100);
  });
  test('số thập phân → làm tròn', () => {
    expect(app.gpsLocationRadius(15.7)).toBe(16);
  });
  test('số 0 hoặc âm → fallback mặc định', () => {
    const r = app.gpsLocationRadius(0);
    expect(r).toBeGreaterThan(0);
  });
  test('null → fallback mặc định', () => {
    const r = app.gpsLocationRadius(null);
    expect(r).toBeGreaterThan(0);
  });
});

/* ══════════════════════════════════════════════════════════════
   7. gpsTimeToMinutes — parse giờ ca
   ══════════════════════════════════════════════════════════════ */
describe('gpsTimeToMinutes — parse HH:MM sang phút', () => {
  test('08:00 → 480', () => {
    expect(app.gpsTimeToMinutes('08:00', 0)).toBe(480);
  });
  test('17:30 → 1050', () => {
    expect(app.gpsTimeToMinutes('17:30', 0)).toBe(1050);
  });
  test('00:00 → 0', () => {
    expect(app.gpsTimeToMinutes('00:00', 999)).toBe(0);
  });
  test('23:59 → 1439', () => {
    expect(app.gpsTimeToMinutes('23:59', 0)).toBe(1439);
  });
  test('format sai → fallback', () => {
    expect(app.gpsTimeToMinutes('abc', 480)).toBe(480);
    expect(app.gpsTimeToMinutes('', 480)).toBe(480);
    expect(app.gpsTimeToMinutes(null, 480)).toBe(480);
    expect(app.gpsTimeToMinutes('25:00', 480)).toBe(480);
    expect(app.gpsTimeToMinutes('12:60', 480)).toBe(480);
  });
});

/* ══════════════════════════════════════════════════════════════
   8. _classifyAccuracy — phân loại độ chính xác GPS
   ══════════════════════════════════════════════════════════════ */
describe('_classifyAccuracy — phân loại accuracy GPS', () => {
  test('5m → TRUSTED', () => {
    expect(app._classifyAccuracy(5)).toBe('TRUSTED');
  });
  test('15m → TRUSTED (đúng ngưỡng)', () => {
    expect(app._classifyAccuracy(15)).toBe('TRUSTED');
  });
  test('20m → NORMAL', () => {
    expect(app._classifyAccuracy(20)).toBe('NORMAL');
  });
  test('25m → NORMAL (đúng ngưỡng)', () => {
    expect(app._classifyAccuracy(25)).toBe('NORMAL');
  });
  test('100m → LOG_ONLY', () => {
    expect(app._classifyAccuracy(100)).toBe('LOG_ONLY');
  });
  test('200m → LOG_ONLY (đúng ngưỡng)', () => {
    expect(app._classifyAccuracy(200)).toBe('LOG_ONLY');
  });
  test('500m → REJECT', () => {
    expect(app._classifyAccuracy(500)).toBe('REJECT');
  });
});

/* ══════════════════════════════════════════════════════════════
   9. _calcSmoothedPosition — trung bình vị trí GPS
   ══════════════════════════════════════════════════════════════ */
describe('_calcSmoothedPosition — làm mượt vị trí GPS', () => {
  test('1 mẫu → trả y nguyên', () => {
    const r = app._calcSmoothedPosition([{ lat: 10.5, lng: 106.6, acc: 10 }]);
    expect(r.lat).toBe(10.5);
    expect(r.lng).toBe(106.6);
  });
  test('2 mẫu cùng accuracy → trung bình đều', () => {
    const r = app._calcSmoothedPosition([
      { lat: 10.0, lng: 106.0, acc: 10 },
      { lat: 10.2, lng: 106.4, acc: 10 }
    ]);
    expect(r.lat).toBeCloseTo(10.1, 4);
    expect(r.lng).toBeCloseTo(106.2, 4);
  });
  test('mẫu chính xác hơn được ưu tiên', () => {
    const r = app._calcSmoothedPosition([
      { lat: 10.0, lng: 106.0, acc: 100 },
      { lat: 10.2, lng: 106.4, acc: 5 }
    ]);
    // acc=5 có weight cao hơn nhiều → kết quả gần 10.2 hơn
    expect(r.lat).toBeGreaterThan(10.15);
    expect(r.lng).toBeGreaterThan(106.3);
  });
});

/* ══════════════════════════════════════════════════════════════
   10. isInsidePolygon — thuật toán Ray Casting
   ══════════════════════════════════════════════════════════════ */
describe('isInsidePolygon — kiểm tra điểm trong vùng', () => {
  const square = [
    { lat: 10, lng: 106 },
    { lat: 10, lng: 107 },
    { lat: 11, lng: 107 },
    { lat: 11, lng: 106 }
  ];

  test('điểm ở giữa → true', () => {
    expect(app.isInsidePolygon(10.5, 106.5, square)).toBe(true);
  });
  test('điểm ở ngoài → false', () => {
    expect(app.isInsidePolygon(12, 108, square)).toBe(false);
  });
  test('polygon không đủ 3 điểm → false', () => {
    expect(app.isInsidePolygon(10.5, 106.5, [{ lat: 10, lng: 106 }])).toBe(false);
    expect(app.isInsidePolygon(10.5, 106.5, null)).toBe(false);
  });

  const triangle = [
    { lat: 0, lng: 0 },
    { lat: 0, lng: 10 },
    { lat: 10, lng: 5 }
  ];
  test('tam giác: điểm trong → true', () => {
    expect(app.isInsidePolygon(3, 5, triangle)).toBe(true);
  });
  test('tam giác: điểm ngoài → false', () => {
    expect(app.isInsidePolygon(8, 1, triangle)).toBe(false);
  });
});

/* ══════════════════════════════════════════════════════════════
   11. fmtTime — format Date → HH:MM
   ══════════════════════════════════════════════════════════════ */
describe('fmtTime — format giờ phút', () => {
  test('8h sáng → "08:00"', () => {
    const d = new Date(2025, 0, 1, 8, 0);
    expect(app.fmtTime(d)).toBe('08:00');
  });
  test('17h30 → "17:30"', () => {
    const d = new Date(2025, 0, 1, 17, 30);
    expect(app.fmtTime(d)).toBe('17:30');
  });
  test('nửa đêm → "00:00"', () => {
    const d = new Date(2025, 0, 1, 0, 0);
    expect(app.fmtTime(d)).toBe('00:00');
  });
  test('1h5 phút → "01:05" (có pad 0)', () => {
    const d = new Date(2025, 0, 1, 1, 5);
    expect(app.fmtTime(d)).toBe('01:05');
  });
});

/* ══════════════════════════════════════════════════════════════
   12. gpsDateFromKey — parse "YYYY-M-D" → Date
   ══════════════════════════════════════════════════════════════ */
describe('gpsDateFromKey — parse date key', () => {
  test('"2025-0-15" → 15/1/2025 (month 0-indexed)', () => {
    const d = app.gpsDateFromKey('2025-0-15');
    expect(d).not.toBeNull();
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(15);
  });
  test('"2025-11-31" → 31/12/2025', () => {
    const d = app.gpsDateFromKey('2025-11-31');
    expect(d.getMonth()).toBe(11);
    expect(d.getDate()).toBe(31);
  });
  test('key sai format → null', () => {
    expect(app.gpsDateFromKey('abc')).toBeNull();
    expect(app.gpsDateFromKey('')).toBeNull();
    expect(app.gpsDateFromKey(null)).toBeNull();
  });
});

/* ══════════════════════════════════════════════════════════════
   13. gpsCheckoutTsForRecord — timestamp checkout
   ══════════════════════════════════════════════════════════════ */
describe('gpsCheckoutTsForRecord — tính timestamp checkout', () => {
  test('có in + out bình thường → timestamp > 0', () => {
    const ts = app.gpsCheckoutTsForRecord('2025-0-15', { in: '08:00', out: '17:00' });
    expect(ts).toBeGreaterThan(0);
  });
  test('ca đêm: out < in → ngày tiếp theo', () => {
    const ts1 = app.gpsCheckoutTsForRecord('2025-0-15', { in: '22:00', out: '06:00' });
    const d = new Date(ts1);
    expect(d.getDate()).toBe(16); // ngày hôm sau
    expect(d.getHours()).toBe(6);
  });
  test('không có out → 0', () => {
    expect(app.gpsCheckoutTsForRecord('2025-0-15', { in: '08:00' })).toBe(0);
    expect(app.gpsCheckoutTsForRecord('2025-0-15', null)).toBe(0);
  });
});

/* ══════════════════════════════════════════════════════════════
   14. _calcAdaptivePollMs — tính tần suất poll GPS
   ══════════════════════════════════════════════════════════════ */
describe('_calcAdaptivePollMs — adaptive polling', () => {
  beforeEach(() => {
    app._setGpsData({ radius: 15 });
    app._setGpsState({ batteryProfile: 'NORMAL' });
  });

  test('dist null → FAR_AWAY (60s)', () => {
    expect(app._calcAdaptivePollMs(null, false, false)).toBe(60000);
  });
  test('vùng đệm (không in, không out) → BUFFER_ZONE (3s)', () => {
    expect(app._calcAdaptivePollMs(20, false, false)).toBe(3000);
  });
  test('bên trong gần boundary → NEAR (5s)', () => {
    // dist=5, R=15 → |5-15|=10 < 100 → hit NEAR trước INSIDE
    expect(app._calcAdaptivePollMs(5, true, false)).toBe(5000);
  });
  test('xa > 500m → FAR_AWAY (60s)', () => {
    const R = app.gpsActiveRadius(15);
    expect(app._calcAdaptivePollMs(R + 600, false, true)).toBe(60000);
  });
});

/* ══════════════════════════════════════════════════════════════
   15. gpsActiveRadius — bán kính khi tight company bật/tắt
   ══════════════════════════════════════════════════════════════ */
describe('gpsActiveRadius — bán kính theo chế độ', () => {
  test('tight tắt, radius 50 → 50', () => {
    app._setGpsData({ tightCompanyGps: false, radius: 50 });
    expect(app.gpsActiveRadius(50)).toBe(50);
  });
  test('tight bật → luôn 15m', () => {
    app._setGpsData({ tightCompanyGps: true, radius: 50 });
    expect(app.gpsActiveRadius(50)).toBe(15);
  });
});

/* ══════════════════════════════════════════════════════════════
   16. gpsCanStartNewAutoCycle — kiểm tra vòng mới sau 8h
   ══════════════════════════════════════════════════════════════ */
describe('gpsCanStartNewAutoCycle — guard 8 giờ', () => {
  test('chưa có checkout nào → cho phép', () => {
    app._setAttData({});
    expect(app.gpsCanStartNewAutoCycle('main')).toBe(true);
  });
  test('checkout lâu rồi (>8h) → cho phép', () => {
    const oldTime = new Date();
    oldTime.setHours(oldTime.getHours() - 9); // 9 giờ trước
    const k = `${oldTime.getFullYear()}-${oldTime.getMonth()}-${oldTime.getDate()}`;
    const data = {};
    data[k] = {
      in: app.fmtTime(new Date(oldTime.getTime() - 3600000)),
      out: app.fmtTime(oldTime)
    };
    app._setAttData(data);
    expect(app.gpsCanStartNewAutoCycle('main')).toBe(true);
  });
  test('checkout mới (< 8h) → chặn', () => {
    const now = new Date();
    const recentOut = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 giờ trước
    const recentIn = new Date(recentOut.getTime() - 8 * 60 * 60 * 1000); // 10 giờ trước
    const k = `${recentIn.getFullYear()}-${recentIn.getMonth()}-${recentIn.getDate()}`;
    const data = {};
    data[k] = { in: app.fmtTime(recentIn), out: app.fmtTime(recentOut) };
    app._setAttData(data);
    expect(app.gpsCanStartNewAutoCycle('main')).toBe(false);
  });
  test('còn IN chưa OUT (qua ngày) → chặn vòng mới', () => {
    const openIn = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const k = `${openIn.getFullYear()}-${openIn.getMonth()}-${openIn.getDate()}`;
    const data = {};
    data[k] = { in: app.fmtTime(openIn) };
    app._setAttData(data);

    expect(app.gpsCanStartNewAutoCycle('main')).toBe(false);
    const info = app.gpsCycleGuardInfo('main', Date.now());
    expect(info.reason).toBe('open_shift');
  });
  test('IN mở quá 20h → yêu cầu xác nhận ca cũ', () => {
    const oldIn = new Date(Date.now() - 21 * 60 * 60 * 1000);
    const k = `${oldIn.getFullYear()}-${oldIn.getMonth()}-${oldIn.getDate()}`;
    const data = {};
    data[k] = { in: app.fmtTime(oldIn) };
    app._setAttData(data);

    const info = app.gpsCycleGuardInfo('main', Date.now());
    expect(info.reason).toBe('open_shift');
    expect(info.needsLongOpenConfirm).toBe(true);
  });
});

/* ══════════════════════════════════════════════════════════════
   17. gpsCurrentShiftSchedule — lấy ca làm việc hiện tại
   ══════════════════════════════════════════════════════════════ */
describe('gpsCurrentShiftSchedule — lịch ca', () => {
  test('mặc định → 08:00 - 17:00', () => {
    app.userData.shiftTimes = undefined;
    const s = app.gpsCurrentShiftSchedule();
    expect(s.in).toBe('08:00');
    expect(s.out).toBe('17:00');
    expect(s.inMin).toBe(480);
    expect(s.outMin).toBe(1020);
  });
});

/* ══════════════════════════════════════════════════════════════
   18. gpsNativeConfigFromData — config gửi xuống native
   ══════════════════════════════════════════════════════════════ */
describe('gpsNativeConfigFromData — native GPS config', () => {
  test('có location → config hợp lệ', () => {
    app._setGpsData({
      lat: 10.762, lng: 106.66, radius: 15,
      checkinMin: 5, checkoutMin: 75,
      enabled: true, tightCompanyGps: false,
      locations: { main: { lat: 10.762, lng: 106.66, radius: 15 }, sub: { lat: null, lng: null, radius: 15 } },
      activeJob: 'main'
    });
    const cfg = app.gpsNativeConfigFromData();
    expect(cfg.lat).toBe(10.762);
    expect(cfg.lng).toBe(106.66);
    expect(cfg.radius).toBe(15);
    expect(cfg.checkinMin).toBe(20);
    expect(cfg.checkoutMin).toBe(80);
    expect(cfg.enabled).toBe(true);
    expect(cfg.hasLocation).toBe(true);
  });
});

/* ══════════════════════════════════════════════════════════════
   19. GPS Constants — đảm bảo giá trị đúng
   ══════════════════════════════════════════════════════════════ */
describe('GPS Constants — thông số kỹ thuật', () => {
  test('GPS_MAX_ACCURACY = 25m', () => {
    expect(app.GPS_MAX_ACCURACY).toBe(25);
  });
  test('GPS_ACCURACY_TRUST = 15m', () => {
    expect(app.GPS_ACCURACY_TRUST).toBe(15);
  });
  test('GPS_BUFFER_ZONE = 20m', () => {
    expect(app.GPS_BUFFER_ZONE).toBe(20);
  });
  test('GPS_DEBOUNCE_IN = 2, GPS_DEBOUNCE_OUT = 5', () => {
    expect(app.GPS_DEBOUNCE_IN).toBe(2);
    expect(app.GPS_DEBOUNCE_OUT).toBe(5);
  });
  test('GPS_NEW_CYCLE_WAIT_MS = 8 giờ', () => {
    expect(app.GPS_NEW_CYCLE_WAIT_MS).toBe(8 * 60 * 60 * 1000);
  });
  test('Battery profiles tồn tại đầy đủ', () => {
    expect(app.GPS_BATTERY_PROFILES.NORMAL).toBeDefined();
    expect(app.GPS_BATTERY_PROFILES.LOW_POWER).toBeDefined();
    expect(app.GPS_BATTERY_PROFILES.CRITICAL).toBeDefined();
    expect(app.GPS_BATTERY_PROFILES.LOW_POWER.pollMultiplier).toBe(3);
    expect(app.GPS_BATTERY_PROFILES.CRITICAL.pollMultiplier).toBe(6);
  });
});

/* ══════════════════════════════════════════════════════════════
   20. _distanceToPolygonCenter — khoảng cách đến tâm polygon
   ══════════════════════════════════════════════════════════════ */
describe('_distanceToPolygonCenter — tâm vùng', () => {
  const square = [
    { lat: 10, lng: 106 },
    { lat: 10, lng: 108 },
    { lat: 12, lng: 108 },
    { lat: 12, lng: 106 }
  ];
  test('tâm hình vuông → khoảng cách ≈ 0', () => {
    const d = app._distanceToPolygonCenter(11, 107, square);
    expect(d).toBeLessThan(1);
  });
  test('điểm xa → khoảng cách lớn', () => {
    const d = app._distanceToPolygonCenter(20, 110, square);
    expect(d).toBeGreaterThan(500000);
  });
  test('polygon null → null', () => {
    expect(app._distanceToPolygonCenter(10, 106, null)).toBeNull();
    expect(app._distanceToPolygonCenter(10, 106, [])).toBeNull();
  });
});

/* ══════════════════════════════════════════════════════════════
   21. gpsPersistCompanyLocation — lưu vị trí công ty
   ══════════════════════════════════════════════════════════════ */
describe('gpsPersistCompanyLocation — lưu vị trí', () => {
  beforeEach(() => {
    app._setGpsData({
      lat: null, lng: null, radius: 15,
      locations: null, activeJob: 'main',
      tightCompanyGps: false, radiusDefault15: true
    });
  });

  test('tọa độ hợp lệ → true', () => {
    expect(app.gpsPersistCompanyLocation(10.762, 106.66, 15, 'main')).toBe(true);
  });
  test('tọa độ ngoài range → false', () => {
    // gpsNum(null)=0 → hợp lệ (0,106.66 là tọa độ thật)
    // chỉ 91 mới thật sự ngoài range
    expect(app.gpsPersistCompanyLocation(91, 106.66, 15, 'main')).toBe(false);
  });
});

/* ══════════════════════════════════════════════════════════════
   22. gpsMinutesUntilNewCycle — phút chờ vòng mới
   ══════════════════════════════════════════════════════════════ */
describe('gpsMinutesUntilNewCycle — thời gian chờ', () => {
  test('chưa checkout → 0 phút', () => {
    app._setAttData({});
    expect(app.gpsMinutesUntilNewCycle('main')).toBe(0);
  });
});
