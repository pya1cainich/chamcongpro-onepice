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
  ['utils.js',                   ROOT],
  // app modules
  ['app-holidays.js',            SRC],
  ['app-payroll-rules.js',       SRC],
  ['app-payroll-tax.js',         SRC],
  ['app-store.js',               SRC],
  ['app-onboarding.js',          SRC],
  ['app-shifts.js',              SRC],
  ['app-onboarding-step4.js',    SRC],
  ['app-navigation.js',          SRC],
  ['app-ui-time.js',             SRC],
  ['app-ui-panel.js',            SRC],
  ['app-i18n-data.js',           SRC],
  ['app-i18n-apply.js',          SRC],
  ['app-i18n-sync.js',           SRC],
  ['app-init.js',                SRC],
  // checkin modules
  ['checkin-manual.js',          SRC],
  ['checkin-calendar.js',        SRC],
  ['checkin-theme.js',           SRC],
  ['checkin-notif.js',           SRC],
  ['checkin-gps-helpers.js',     SRC],
  ['checkin-gps-engine.js',      SRC],
  ['checkin-gps-control.js',     SRC],
  ['checkin-subjob.js',          SRC],
  ['checkin-pdf.js',             SRC],
  ['checkin-patches-1.js',       SRC],
  ['checkin-patches-2.js',       SRC],
  // smart-attendance modules (no IIFE wrapper)
  ['sa-core.js',                 SRC],
  ['sa-signals.js',              SRC],
  ['sa-actions.js',              SRC],
  ['sa-machine.js',              SRC],
  ['sa-ui.js',                   SRC],
  ['sa-profile.js',              SRC],
  ['sa-init.js',                 SRC],
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
