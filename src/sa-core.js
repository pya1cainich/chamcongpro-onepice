'use strict';


/* ═══════════════════════════════════════════════════════════════════════════════
   1. HẰNG SỐ & CẤU HÌNH
   ═══════════════════════════════════════════════════════════════════════════════ */

/** Các trạng thái của state machine */
var STATE = {
  HOME:                  'HOME',
  LEAVING_HOME:          'LEAVING_HOME',
  GOING_TO_WORK:         'GOING_TO_WORK',
  WAIT_CHECKIN_CONFIRM:  'WAIT_CHECKIN_CONFIRM',
  WORKING:               'WORKING',
  WAIT_CHECKOUT_CONFIRM: 'WAIT_CHECKOUT_CONFIRM',
  CHECKED_OUT:           'CHECKED_OUT',
  // Alias cũ để tương thích với state đã lưu trong localStorage
  WAIT_WORK_WIFI_5_MIN:  'WAIT_CHECKIN_CONFIRM',
  WORKING_WIFI:          'WORKING',
  WORKING_GPS_BACKUP:    'WORKING',
  WORK_WIFI_LOST:        'WORKING',
  POSSIBLE_CHECKOUT:     'WAIT_CHECKOUT_CONFIRM',
  CHECKOUT_WAIT_75_MIN:  'WAIT_CHECKOUT_CONFIRM'
};

/** Thời gian chờ (ms) */
var TIMING = {
  GPS_HOME_CHECK_MS:       120 * 1000,
  HOME_GPS_BEFORE_SHIFT_MS: 120 * 60 * 1000,
  HOME_GPS_AFTER_SHIFT_MS:  180 * 60 * 1000,
  WIFI_WAIT_MS:           20 * 60 * 1000,     // fallback 20p — thực tế đọc từ saCheckinMs()
  WIFI_LOST_WAIT_MS:      80 * 60 * 1000,     // fallback 80p — thực tế đọc từ saCheckoutMs()
  CHECKOUT_WAIT_MS:       80 * 60 * 1000,     // fallback 80p — thực tế đọc từ saCheckoutMs()
  GPS_POLL_TRAVEL_MS:     90 * 1000,          // 1.5 phút GPS poll khi đang di chuyển
  GPS_POLL_NEAR_SHIFT_MS: 30 * 1000,          // 30s GPS poll gần giờ ca
  GPS_POLL_BACKUP_MS:     120 * 1000,         // 2 phút GPS poll khi backup (trong ca)
  WIFI_SIGNAL_FRESH_MS:   90 * 1000,
  // BTS_SIGNAL_FRESH_MS đã bỏ — không còn dùng BTS
  GPS_SIGNAL_FRESH_MS:    5 * 60 * 1000,
  // FIX P0 #1: tăng từ 3p lên 15p để chịu được lúc app bị throttle background dài (JS interval
  // không chạy ổn định trên Android khi app ẩn) — tránh CHECK_IN_WAIT_RESET mỗi lần user mở app.
  CONFIRM_SIGNAL_GAP_MS:  15 * 60 * 1000,
  // Khi không có Wi-Fi, GPS có thể lệch 30-70m dù người dùng đứng yên.
  // Giữ phiên xác nhận nếu chỉ mất tín hiệu công ty ngắn hạn.
  WORK_SIGNAL_LOST_GRACE_MS: 90 * 1000,
  GPS_HOME_WORK_CLOSE_M:   180,
  GPS_WORK_HOME_MARGIN_M:  15,
  GPS_WORK_EXIT_BUFFER_MIN_M: 40,
  GPS_WORK_EXIT_BUFFER_MAX_M: 120,
  // FIX P1 #2: debounce 60s mới chuyển HOME → LEAVING_HOME để tránh dao động khi Wi-Fi rớt 1 nhịp.
  HOME_LEAVE_DEBOUNCE_MS: 60 * 1000,
  EVALUATE_DEBOUNCE_MS:   120,
  DEBUG_RENDER_MS:        1000,
  PROFILE_RENDER_MS:      2000,
  // BTS_POLL_MS đã bỏ — không còn poll BTS
  WIFI_POLL_MS:           15 * 1000,          // 15s poll Wi-Fi
  STATE_SAVE_MS:          5 * 1000,           // 5s debounce lưu state
  NEW_CYCLE_WAIT_MS:      8 * 60 * 60 * 1000, // 8 tiếng chờ chu kỳ mới
  GPS_WAKEUP_AFTER_OUT_MS: 8 * 60 * 60 * 1000  // 8h sau ra ca thì bật GPS lại (đồng bộ với NEW_CYCLE_WAIT_MS)
};

/** Thời gian chờ VÀO ca (ms) — đọc từ slider checkinMin của user, fallback 20p */
function saCheckinMs()  { return ((window._gpsData && _gpsData.checkinMin  > 0) ? _gpsData.checkinMin  : 20) * 60 * 1000; }
/** Thời gian chờ RA ca (ms) — đọc từ slider checkoutMin của user, fallback 80p */
function saCheckoutMs() { return ((window._gpsData && _gpsData.checkoutMin > 0) ? _gpsData.checkoutMin : 80) * 60 * 1000; }

/** Storage key */
var STORAGE_KEY = 'cp22_smart_att';

/** Lấy ngôn ngữ hiện tại của user (fallback 'vi') */
function _saL(){ return (window.userData && window.userData.lang) || 'vi'; }

/* ═══════════════════════════════════════════════════════════════════════════════
   2. DỮ LIỆU STATE MACHINE
   ═══════════════════════════════════════════════════════════════════════════════ */

/** Dữ liệu chính của hệ thống */
var _sa = {
  /** Trạng thái hiện tại */
  state: STATE.HOME,

  /** Hồ sơ nhà */
  home: {
    wifi: [],       // [{ssid:'...', bssid:'...'}]
    gps:  null      // {lat, lng, radius} hoặc null
  },

  /** Hồ sơ công ty (kế thừa từ _gpsData) */
  work: {
    wifi: [],       // [{ssid:'...', bssid:'...'}]
    gps:  null      // {lat, lng, radius} — đồng bộ từ _gpsData
  },

  /** Hồ sơ việc phụ (Wi-Fi/GPS riêng biệt) */
  subWork: {
    wifi: [],
    gps:  null
  },

  /** Timestamps quan trọng */
  stateChangedAt: 0,
  homeSignalLostAt: 0,

  /** Cửa sổ vào ca (WAIT_CHECKIN_CONFIRM) — tích lũy thời gian có/mất tín hiệu */
  checkinWindowStart: 0,       // thời điểm mở cửa sổ check-in
  checkinSignalOnMs: 0,        // tổng ms có tín hiệu công ty (đã hoàn thành)
  checkinSignalOffMs: 0,       // tổng ms mất tín hiệu công ty (đã hoàn thành)
  checkinLastSignalState: false, // trạng thái tín hiệu tại lần eval trước
  checkinLastFlipAt: 0,        // timestamp lần cuối tín hiệu đổi trạng thái

  /** Cửa sổ tan ca (WAIT_CHECKOUT_CONFIRM) — tích lũy thời gian mất/có tín hiệu */
  checkoutWindowStart: 0,
  checkoutSignalOnMs: 0,
  checkoutSignalOffMs: 0,
  checkoutLastSignalState: true,
  checkoutLastFlipAt: 0,

  /** Field cũ — giữ để tương thích ngược với localStorage đã lưu */
  checkoutWaitStart: 0,
  wifiLostAt: 0,
  wifiWaitStart: 0,
  checkinConfirmMethod: '',
  checkinConfirmLastSeen: 0,
  checkoutConfirmMethod: '',
  checkoutConfirmLastSeen: 0,

  /** Tín hiệu hiện tại (cập nhật mỗi poll) */
  signals: {
    wifi:     null,  // {ssid, bssid, connected} hoặc null
    gps:      null,  // {lat, lng, accuracy} hoặc null
    gpsInside:null,  // true/false/null
    ts: {wifi:0, gps:0}
  },

  /** GPS có đang bật không */
  gpsActive: false,

  /** Đã enabled chưa (user bật tính năng) */
  enabled: false,

  /** Đã checkin hôm nay chưa (để tránh checkin trùng) */
  todayCheckedIn: false,
  todayCheckedOut: false,
  /** Riêng cho job phụ */
  todayCheckedInSub: false,
  todayCheckedOutSub: false
};

/** Timer IDs */
var _saTimers = {
  wifi: null,
  gps: null,
  gpsIntervalMs: 0,
  evaluate: null,
  stateSave: null,
  wifiWait: null,
  wifiLost: null,
  checkoutWait: null
};

var _saPerf = {
  lastDebugRenderAt: 0,
  lastProfileRenderAt: 0
};

/* ═══════════════════════════════════════════════════════════════════════════════
   3. PERSISTENCE — Lưu/đọc trạng thái
   ═══════════════════════════════════════════════════════════════════════════════ */

/** Đọc dữ liệu từ localStorage */
function saLoad(){
  try {
    var raw = (typeof lsGet === 'function') ? lsGet(STORAGE_KEY) : null;
    if(!raw) return;
    // Chỉ restore các field cần thiết, giữ nguyên signals
    // Normalize state cũ → tên mới (tương thích localStorage đã lưu)
    var _rawState = raw.state;
    if(_rawState === 'WAIT_WORK_WIFI_5_MIN') _rawState = 'WAIT_CHECKIN_CONFIRM';
    if(_rawState === 'WORKING_WIFI' || _rawState === 'WORKING_GPS_BACKUP' || _rawState === 'WORK_WIFI_LOST') _rawState = 'WORKING';
    if(_rawState === 'POSSIBLE_CHECKOUT' || _rawState === 'CHECKOUT_WAIT_75_MIN') _rawState = 'WAIT_CHECKOUT_CONFIRM';
    if(_rawState) _sa.state = _rawState;

    if(raw.home)    _sa.home    = raw.home;
    if(raw.work)    _sa.work    = raw.work;
    if(raw.subWork) _sa.subWork = raw.subWork;
    if(raw.stateChangedAt) _sa.stateChangedAt = raw.stateChangedAt;
    if(raw.homeSignalLostAt) _sa.homeSignalLostAt = raw.homeSignalLostAt;

    // Cửa sổ check-in
    if(raw.checkinWindowStart) _sa.checkinWindowStart = raw.checkinWindowStart;
    if(raw.checkinSignalOnMs)  _sa.checkinSignalOnMs  = raw.checkinSignalOnMs;
    if(raw.checkinSignalOffMs) _sa.checkinSignalOffMs = raw.checkinSignalOffMs;
    _sa.checkinLastSignalState = !!raw.checkinLastSignalState;
    if(raw.checkinLastFlipAt)  _sa.checkinLastFlipAt  = raw.checkinLastFlipAt;

    // Cửa sổ tan ca
    if(raw.checkoutWindowStart) _sa.checkoutWindowStart = raw.checkoutWindowStart;
    if(raw.checkoutSignalOnMs)  _sa.checkoutSignalOnMs  = raw.checkoutSignalOnMs;
    if(raw.checkoutSignalOffMs) _sa.checkoutSignalOffMs = raw.checkoutSignalOffMs;
    _sa.checkoutLastSignalState = (raw.checkoutLastSignalState !== false);
    if(raw.checkoutLastFlipAt)  _sa.checkoutLastFlipAt  = raw.checkoutLastFlipAt;

    // Migrate từ wifiWaitStart cũ nếu đang restore WAIT_CHECKIN_CONFIRM
    if(!_sa.checkinWindowStart && raw.wifiWaitStart && _sa.state === STATE.WAIT_CHECKIN_CONFIRM){
      _sa.checkinWindowStart = raw.wifiWaitStart;
      _sa.checkinLastFlipAt  = raw.wifiWaitStart;
    }
    // Migrate checkoutWaitStart cũ
    if(!_sa.checkoutWindowStart && raw.checkoutWaitStart && _sa.state === STATE.WAIT_CHECKOUT_CONFIRM){
      _sa.checkoutWindowStart = raw.checkoutWaitStart;
      _sa.checkoutLastFlipAt  = raw.checkoutWaitStart;
    }

    _sa.enabled = !!raw.enabled;
    _sa.todayCheckedIn = !!raw.todayCheckedIn;
    _sa.todayCheckedOut = !!raw.todayCheckedOut;
    _sa.todayCheckedInSub = !!raw.todayCheckedInSub;
    _sa.todayCheckedOutSub = !!raw.todayCheckedOutSub;
  } catch(e){ console.warn('[SA] saLoad error:', e); }
}

/** Lưu dữ liệu vào localStorage (debounced) */
function saSave(){
  clearTimeout(_saTimers.stateSave);
  _saTimers.stateSave = setTimeout(function(){
    try {
      if(typeof lsSet === 'function'){
        lsSet(STORAGE_KEY, {
          state: _sa.state,
          home: _sa.home,
          work: _sa.work,
          subWork: _sa.subWork,
          stateChangedAt: _sa.stateChangedAt,
          homeSignalLostAt: _sa.homeSignalLostAt,
          checkinWindowStart: _sa.checkinWindowStart,
          checkinSignalOnMs: _sa.checkinSignalOnMs,
          checkinSignalOffMs: _sa.checkinSignalOffMs,
          checkinLastSignalState: _sa.checkinLastSignalState,
          checkinLastFlipAt: _sa.checkinLastFlipAt,
          checkoutWindowStart: _sa.checkoutWindowStart,
          checkoutSignalOnMs: _sa.checkoutSignalOnMs,
          checkoutSignalOffMs: _sa.checkoutSignalOffMs,
          checkoutLastSignalState: _sa.checkoutLastSignalState,
          checkoutLastFlipAt: _sa.checkoutLastFlipAt,
          enabled: _sa.enabled,
          todayCheckedIn: _sa.todayCheckedIn,
          todayCheckedOut: _sa.todayCheckedOut,
          todayCheckedInSub: _sa.todayCheckedInSub,
          todayCheckedOutSub: _sa.todayCheckedOutSub
        });
      }
    } catch(e){ console.warn('[SA] saSave error:', e); }
  }, TIMING.STATE_SAVE_MS);
}

/** Đồng bộ GPS công ty từ _gpsData hiện có */
function saSyncWorkGpsFromLegacy(){
  try {
    var g = window._gpsData;
    if(!g) return;
    var job = (typeof saActiveJob === 'function') ? saActiveJob() : (g.activeJob === 'sub' ? 'sub' : 'main');
    var loc = null;
    if(typeof window.gpsGetStoredCompanyLocation === 'function'){
      loc = window.gpsGetStoredCompanyLocation(job);
    }
    if(!loc && g.locations && g.locations[job]){
      loc = g.locations[job];
    }
    if(!loc) loc = g;
    var lat = Number(loc.lat), lng = Number(loc.lng);
    if(Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 && lng !== 0){
      var profile = job === 'sub' ? (_sa.subWork || (_sa.subWork = {wifi:[], gps:null})) : _sa.work;
      profile.gps = {
        lat: lat,
        lng: lng,
        radius: Number(loc.radius || g.radius) || 100
      };
    }
  } catch(e){}
}

