/* Tạo môi trường giả lập trình duyệt để load code vanilla JS */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function createBrowserMock() {
  const storage = {};
  const timers = [];
  return {
    _timers: timers,
    localStorage: {
      _data: storage,
      getItem(k) { return storage[k] !== undefined ? storage[k] : null; },
      setItem(k, v) { storage[k] = String(v); },
      removeItem(k) { delete storage[k]; },
      clear() { Object.keys(storage).forEach(k => delete storage[k]); }
    },
    document: {
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      createElement: () => ({ style: {}, classList: { add(){}, remove(){} }, appendChild(){}, setAttribute(){} }),
      body: { appendChild(){}, classList: { add(){}, remove(){} } },
      addEventListener() {}
    },
    window: {},
    navigator: { language: 'vi', geolocation: null },
    console,
    setTimeout(fn, ms) { const id = global.setTimeout(() => {}, 0); timers.push(id); return id; },
    setInterval(fn, ms) { const id = global.setInterval(() => {}, 999999); timers.push(id); return id; },
    clearTimeout: global.clearTimeout,
    clearInterval: global.clearInterval,
    requestAnimationFrame: () => {},
    alert: () => {},
    confirm: () => true,
    Math, JSON, Number, String, Array, Object, Date, RegExp, Error,
    Infinity, NaN, undefined,
    parseFloat, parseInt, isNaN, isFinite,
    encodeURIComponent, decodeURIComponent,
    Map, Set, Promise, Symbol, Proxy, Reflect, WeakMap, WeakSet
  };
}

const SRC = path.join(ROOT, 'src');

// Thứ tự load module khớp với index.html
const MODULE_FILES = [
  // utils
  ['utils.js',              ROOT],
  // ud- (ứng dụng)
  ['ud-ngay-le.js',         SRC],
  ['ud-quy-luong.js',       SRC],
  ['ud-tinh-thue.js',       SRC],
  ['ud-luu-tru.js',         SRC],
  ['ud-cai-dat.js',         SRC],
  ['ud-ca-lam.js',          SRC],
  ['ud-nghi-gio.js',        SRC],
  ['ud-dieu-huong.js',      SRC],
  ['ud-dong-ho.js',         SRC],
  ['ud-panel-ngay.js',      SRC],
  ['ud-ban-dich.js',        SRC],
  ['ud-ap-ngon-ngu.js',     SRC],
  ['ud-dong-bo.js',         SRC],
  ['ud-khoi-dong.js',       SRC],
  // cc- (chấm công)
  ['cc-thu-cong.js',        SRC],
  ['cc-lich.js',            SRC],
  ['cc-giao-dien.js',       SRC],
  ['cc-thong-bao.js',       SRC],
  ['cc-gps-tien-ich.js',    SRC],
  ['cc-gps-engine.js',      SRC],
  ['cc-gps-dieu-khien.js',  SRC],
  ['cc-viec-phu.js',        SRC],
  ['cc-xuat-pdf.js',        SRC],
  ['cc-cap-nhat-1.js',      SRC],
  ['cc-cap-nhat-2.js',      SRC],
  // td- (tự động)
  ['td-cot-loi.js',         SRC],
  ['td-tin-hieu.js',        SRC],
  ['td-hanh-dong.js',       SRC],
  ['td-trang-thai.js',      SRC],
  ['td-giao-dien.js',       SRC],
  ['td-ho-so.js',           SRC],
  ['td-khoi-tao.js',        SRC],
];

function loadApp() {
  const mock = createBrowserMock();
  const ctx = vm.createContext(mock);

  for (const [filename, dir] of MODULE_FILES) {
    const code = fs.readFileSync(path.join(dir, filename), 'utf8');
    try { vm.runInContext(code, ctx); } catch (e) { /* bỏ qua lỗi DOM khi init */ }
  }

  // const/let trong vm không tự gắn vào context object — phải copy thủ công
  vm.runInContext(`
    this.PAYROLL_RULES = typeof PAYROLL_RULES !== 'undefined' ? PAYROLL_RULES : undefined;
    this.TAX_RULES = typeof TAX_RULES !== 'undefined' ? TAX_RULES : undefined;
    this.HOLIDAYS_BY_COUNTRY = typeof HOLIDAYS_BY_COUNTRY !== 'undefined' ? HOLIDAYS_BY_COUNTRY : undefined;
    this.NL = typeof NL !== 'undefined' ? NL : undefined;
    this.TRAN = typeof TRAN !== 'undefined' ? TRAN : undefined;
    this.LANGS = typeof LANGS !== 'undefined' ? LANGS : undefined;
    this.COUNTRIES = typeof COUNTRIES !== 'undefined' ? COUNTRIES : undefined;
    // GPS constants
    this.GPS_MAX_ACCURACY = typeof GPS_MAX_ACCURACY !== 'undefined' ? GPS_MAX_ACCURACY : undefined;
    this.GPS_ACCURACY_LOG = typeof GPS_ACCURACY_LOG !== 'undefined' ? GPS_ACCURACY_LOG : undefined;
    this.GPS_ACCURACY_TRUST = typeof GPS_ACCURACY_TRUST !== 'undefined' ? GPS_ACCURACY_TRUST : undefined;
    this.GPS_BUFFER_ZONE = typeof GPS_BUFFER_ZONE !== 'undefined' ? GPS_BUFFER_ZONE : undefined;
    this.GPS_DEBOUNCE_IN = typeof GPS_DEBOUNCE_IN !== 'undefined' ? GPS_DEBOUNCE_IN : undefined;
    this.GPS_DEBOUNCE_OUT = typeof GPS_DEBOUNCE_OUT !== 'undefined' ? GPS_DEBOUNCE_OUT : undefined;
    this.GPS_POLL_SCHEDULE = typeof GPS_POLL_SCHEDULE !== 'undefined' ? GPS_POLL_SCHEDULE : undefined;
    this.GPS_BATTERY_PROFILES = typeof GPS_BATTERY_PROFILES !== 'undefined' ? GPS_BATTERY_PROFILES : undefined;
    this.GPS_NEW_CYCLE_WAIT_MS = typeof GPS_NEW_CYCLE_WAIT_MS !== 'undefined' ? GPS_NEW_CYCLE_WAIT_MS : undefined;
    // helpers để test set được biến nội bộ vm
    this._setCfgShim = function(obj) { _cfg_shim = obj; };
    this._setCfgShimAndLangCfg = function(shim, lc) { _cfg_shim = shim; langCfg = lc; };
    this._setGpsData = function(obj) { _gpsData = Object.assign(_gpsData, obj); };
    this._setAttData = function(obj) { attData = obj; };
    this._setGpsState = function(obj) {
      if('wasInside' in obj) _gpsWasInside = obj.wasInside;
      if('lastConfirmed' in obj) _gpsLastConfirmed = obj.lastConfirmed;
      if('lastPosition' in obj) _gpsLastPosition = obj.lastPosition;
      if('lastOutsideAt' in obj) _gpsLastOutsideAt = obj.lastOutsideAt;
      if('debounceCount' in obj) _gpsDebounceCount = obj.debounceCount;
      if('positionHistory' in obj) _gpsPositionHistory = obj.positionHistory;
      if('batteryProfile' in obj) _gpsBatteryProfile = obj.batteryProfile;
    };
  `, ctx);

  // Dọn timer để tránh lỗi loadGpsData
  (mock._timers || []).forEach(id => { global.clearTimeout(id); global.clearInterval(id); });

  return ctx;
}

module.exports = { loadApp, createBrowserMock };
