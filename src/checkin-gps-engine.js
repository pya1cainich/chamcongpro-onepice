/* ══════════════════════════════════════════════════════════════════════════════
   GPS ENGINE — Stub layer (Smart Attendance đã thay thế toàn bộ)
   Các hàm bên dưới chỉ delegate sang smart-attendance.js.
   Không có polling, không có debounce, không có trail logging.
   ══════════════════════════════════════════════════════════════════════════════ */

// Giữ lại để capacitor-integration.js không bị crash khi tham chiếu
var GPS_MAX_ACCURACY = 25;
var GPS_ACCURACY_TRUST = 15;
var GPS_ACCURACY_LOG = 200;
var GPS_BUFFER_ZONE = 20;
var GPS_DEBOUNCE_IN = 2;
var GPS_DEBOUNCE_OUT = 5;
var GPS_NEW_CYCLE_WAIT_MS = 8 * 60 * 60 * 1000;
var GPS_OPEN_SHIFT_CONFIRM_MS = 20 * 60 * 60 * 1000;
var GPS_OPEN_SHIFT_PROMPT_COOLDOWN_MS = 5 * 60 * 1000;
var GPS_POLL_SCHEDULE = {
  BUFFER_ZONE: 3000,
  NEAR: 5000,
  INSIDE: 30000,
  FAR_AWAY: 60000
};
var GPS_BATTERY_PROFILES = {
  NORMAL:    { name: 'Normal',    pollMultiplier: 1, enableHighAccuracy: true,  maxAccuracy: 80  },
  LOW_POWER: { name: 'Low Power', pollMultiplier: 3, enableHighAccuracy: false, maxAccuracy: 150 },
  CRITICAL:  { name: 'Critical',  pollMultiplier: 6, enableHighAccuracy: false, maxAccuracy: 200 }
};
var _gpsBatteryProfile = 'NORMAL';

// Biến state tối thiểu (giữ để không crash các hàm đọc chúng)
var _gpsLastPosition  = null;
var _gpsErrorCount    = 0;
var _gpsTrail         = [];
var _gpsLastOutsideAt = 0;
var _gpsBgWatchId     = null;
var _gpsOpenShiftPromptTs = { main: 0, sub: 0 };

function _addGpsTrail(entry){
  try{
    var e = Object.assign({ timestamp: Date.now() }, entry || {});
    _gpsTrail.push(e);
    if(_gpsTrail.length > 200) _gpsTrail.shift();
    return e;
  }catch(err){
    return null;
  }
}

function _classifyAccuracy(acc){
  var n = Number(acc);
  if(!Number.isFinite(n)) return 'REJECT';
  if(n <= GPS_ACCURACY_TRUST) return 'TRUSTED';
  if(n <= GPS_MAX_ACCURACY) return 'NORMAL';
  if(n <= GPS_ACCURACY_LOG) return 'LOG_ONLY';
  return 'REJECT';
}

function _calcSmoothedPosition(samples){
  if(!samples || !samples.length) return null;
  if(samples.length === 1) return samples[0];
  var lat = 0, lng = 0, weightSum = 0;
  samples.forEach(function(p){
    var acc = Math.max(1, Number(p.acc || p.accuracy || GPS_MAX_ACCURACY));
    var w = 1 / acc;
    lat += Number(p.lat) * w;
    lng += Number(p.lng) * w;
    weightSum += w;
  });
  if(!weightSum) return samples[samples.length - 1];
  return {
    lat: lat / weightSum,
    lng: lng / weightSum,
    acc: Math.min.apply(null, samples.map(function(p){ return Number(p.acc || p.accuracy || GPS_MAX_ACCURACY); }))
  };
}

function _calcAdaptivePollMs(dist, wasInside, wasOutside){
  if(dist == null || !Number.isFinite(Number(dist))) return GPS_POLL_SCHEDULE.FAR_AWAY;
  var d = Number(dist);
  var r = gpsActiveRadius(_gpsData && _gpsData.radius);
  if(!wasInside && !wasOutside && d <= r + GPS_BUFFER_ZONE) return GPS_POLL_SCHEDULE.BUFFER_ZONE;
  if(Math.abs(d - r) <= 100) return GPS_POLL_SCHEDULE.NEAR;
  if(d > r + 500) return GPS_POLL_SCHEDULE.FAR_AWAY;
  return wasInside ? GPS_POLL_SCHEDULE.INSIDE : GPS_POLL_SCHEDULE.NEAR;
}

function _distanceToPolygonCenter(lat, lng, polygon){
  if(!polygon || polygon.length < 3) return null;
  var center = polygon.reduce(function(acc, p){
    acc.lat += Number(p.lat);
    acc.lng += Number(p.lng);
    return acc;
  }, {lat:0, lng:0});
  center.lat /= polygon.length;
  center.lng /= polygon.length;
  return gpsDistance(lat, lng, center.lat, center.lng);
}

// ── Migration data sang format multi-location ─────────────────────────────────
function _migrateGpsData(){
  if(_gpsData.locations){ return; }
  _gpsData.locations = {
    main: { lat: _gpsData.lat || null, lng: _gpsData.lng || null, radius: gpsActiveRadius(_gpsData.radius) },
    sub:  { lat: null, lng: null, radius: 15 }
  };
  _gpsData.activeJob = _gpsData.activeJob || 'main';
  saveGpsData();
}

function getActiveGpsLocation(jobKey){
  _migrateGpsData();
  var j = jobKey || _gpsData.activeJob || 'main';
  return (_gpsData.locations && _gpsData.locations[j]) || null;
}

function setActiveGpsJob(jobKey){
  _migrateGpsData();
  if(jobKey !== 'main' && jobKey !== 'sub') return;
  _gpsData.activeJob = jobKey;
  var loc = _gpsData.locations[jobKey];
  if(loc && loc.lat && loc.lng){
    _gpsData.lat = loc.lat;
    _gpsData.lng = loc.lng;
    _gpsData.radius = loc.radius || 15;
  }
  saveGpsData();
  if(_gpsData.enabled && typeof saStopGps === 'function'){
    try{ saStopGps(); }catch(e){}
    if(typeof saEnable === 'function') setTimeout(function(){ saEnable(); }, 300);
  }
  if(typeof updateGpsStatus === 'function') updateGpsStatus();
}

function saveGpsLocationForJob(jobKey, lat, lng, radius){
  _migrateGpsData();
  if(jobKey !== 'main' && jobKey !== 'sub') return;
  if(typeof gpsPersistCompanyLocation === 'function') gpsPersistCompanyLocation(lat, lng, radius, jobKey);
  saveGpsData();
}

// ── Polygon helper (dùng bởi UI / saIsAtWorkGps) ─────────────────────────────
function isInsidePolygon(lat, lng, polygon){
  if(!polygon || polygon.length < 3) return false;
  var inside = false;
  for(var i = 0, j = polygon.length - 1; i < polygon.length; j = i++){
    var xi = polygon[i].lat, yi = polygon[i].lng;
    var xj = polygon[j].lat, yj = polygon[j].lng;
    var intersect = ((yi > lng) !== (yj > lng)) &&
      (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
    if(intersect) inside = !inside;
  }
  return inside;
}

// ── Cycle guard — dùng bởi smart-attendance.js ───────────────────────────────
function gpsDateFromKey(dateKey){
  var p = String(dateKey || '').split('-').map(Number);
  if(p.length !== 3 || p.some(function(n){ return !Number.isFinite(n); })) return null;
  return new Date(p[0], p[1], p[2], 0, 0, 0, 0);
}

function gpsCheckoutTsForRecord(dateKey, rec){
  if(!rec || !rec.out) return 0;
  var base = gpsDateFromKey(dateKey);
  if(!base) return 0;
  var outMin = gpsTimeToMinutes(rec.out, null);
  if(outMin == null) return 0;
  base.setHours(Math.floor(outMin / 60), outMin % 60, 0, 0);
  var inMin = rec.in ? gpsTimeToMinutes(rec.in, null) : null;
  if(inMin != null && outMin <= inMin) base.setDate(base.getDate() + 1);
  return base.getTime();
}

function gpsCheckinTsForRecord(dateKey, rec){
  if(!rec || !rec.in) return 0;
  var base = gpsDateFromKey(dateKey);
  if(!base) return 0;
  var inMin = gpsTimeToMinutes(rec.in, null);
  if(inMin == null) return 0;
  base.setHours(Math.floor(inMin / 60), inMin % 60, 0, 0);
  return base.getTime();
}

function gpsFindLastCheckoutInfo(jobKey){
  var best = null;
  var useSub = jobKey === 'sub';
  if(!attData) return null;
  Object.keys(attData).forEach(function(k){
    var day = attData[k];
    var rec = useSub ? (day && day.sub) : day;
    var ts = gpsCheckoutTsForRecord(k, rec);
    if(ts > 0 && (!best || ts > best.ts))
      best = { ts: ts, dateKey: k, time: rec.out, job: useSub ? 'sub' : 'main' };
  });
  return best;
}

function gpsFindOpenShiftInfo(jobKey){
  var best = null;
  var useSub = jobKey === 'sub';
  if(!attData) return null;
  Object.keys(attData).forEach(function(k){
    var day = attData[k];
    var rec = useSub ? (day && day.sub) : day;
    if(!rec || !rec.in || rec.out) return;
    var ts = gpsCheckinTsForRecord(k, rec);
    if(ts > 0 && (!best || ts > best.ts)){
      best = { ts: ts, dateKey: k, time: rec.in, job: useSub ? 'sub' : 'main' };
    }
  });
  return best;
}

function gpsCycleGuardInfo(jobKey, nowMs){
  var job = (jobKey === 'sub') ? 'sub' : 'main';
  var now = Number(nowMs);
  if(!Number.isFinite(now) || now <= 0) now = Date.now();

  var open = gpsFindOpenShiftInfo(job);
  if(open){
    var elapsed = Math.max(0, now - open.ts);
    return {
      allow: false,
      reason: 'open_shift',
      job: job,
      open: open,
      elapsedMs: elapsed,
      elapsedMin: Math.floor(elapsed / 60000),
      needsLongOpenConfirm: elapsed >= GPS_OPEN_SHIFT_CONFIRM_MS
    };
  }

  var last = gpsFindLastCheckoutInfo(job);
  if(!last){
    return { allow: true, reason: 'ok', job: job, minutesLeft: 0 };
  }
  var left = GPS_NEW_CYCLE_WAIT_MS - (now - last.ts);
  if(left > 0){
    return {
      allow: false,
      reason: 'wait_8h',
      job: job,
      lastCheckout: last,
      leftMs: left,
      minutesLeft: Math.max(0, Math.ceil(left / 60000))
    };
  }
  return { allow: true, reason: 'ok', job: job, minutesLeft: 0, lastCheckout: last };
}

function gpsCanStartNewAutoCycle(jobKey){
  return !!gpsCycleGuardInfo(jobKey).allow;
}

function gpsMinutesUntilNewCycle(jobKey){
  var info = gpsCycleGuardInfo(jobKey);
  return info.reason === 'wait_8h' ? (info.minutesLeft || 0) : 0;
}

function gpsOpenShiftBlockText(info){
  var jobLabel = (info && info.job === 'sub') ? 'Job phụ' : 'Job chính';
  if(!info || !info.open){
    return jobLabel + ': ca trước chưa checkout, chưa thể vào ca mới.';
  }
  return jobLabel + ': ca trước chưa checkout (' + info.open.dateKey + ' ' + info.open.time + ').';
}

function gpsOpenShiftConfirmText(info){
  var hours = Math.max(20, Math.floor((info.elapsedMs || 0) / 3600000));
  var jobLabel = (info && info.job === 'sub') ? 'job phụ' : 'job chính';
  var start = info && info.open ? (info.open.dateKey + ' ' + info.open.time) : 'ca trước';
  return 'Bạn chưa checkout ' + jobLabel + ' từ ' + start + '.\n\n'
    + 'Đã quá ' + hours + ' giờ. Xác nhận checkout ca cũ ngay bây giờ để mở ca mới?';
}

function gpsShouldPromptOpenShift(job, nowMs){
  var key = job === 'sub' ? 'sub' : 'main';
  var now = Number(nowMs);
  if(!Number.isFinite(now) || now <= 0) now = Date.now();
  var last = Number(_gpsOpenShiftPromptTs[key] || 0);
  if(last > 0 && (now - last) < GPS_OPEN_SHIFT_PROMPT_COOLDOWN_MS) return false;
  _gpsOpenShiftPromptTs[key] = now;
  return true;
}

function gpsCloseOpenShift(openInfo, closeMs){
  if(!openInfo || !openInfo.dateKey || !attData) return false;
  var day = attData[openInfo.dateKey];
  if(!day) return false;
  var rec;
  if(openInfo.job === 'sub'){
    if(!day.sub) day.sub = { type: 'cm' };
    rec = day.sub;
  } else {
    rec = day;
  }
  if(!rec || !rec.in || rec.out) return false;
  var t = new Date(Number(closeMs) > 0 ? Number(closeMs) : Date.now());
  rec.out = fmtTime(t);
  rec.type = rec.type || 'cm';
  rec.auto = true;
  rec.autoMethod = 'recover_open_shift';
  saveAtt();
  if(typeof updateTodayStatusTime === 'function') updateTodayStatusTime();
  if(typeof renderHomeStats === 'function') renderHomeStats();
  return true;
}

function gpsEnsureCycleForCheckin(jobKey, opts){
  opts = opts || {};
  var info = gpsCycleGuardInfo(jobKey, opts.nowMs);
  if(info.allow) return { allowed: true, reason: 'ok', info: info };

  if(info.reason === 'wait_8h'){
    if(opts.showBanner !== false && typeof showGpsBanner === 'function'){
      showGpsBanner(u('gps.cycle_wait', { m: info.minutesLeft || 0 }), '#F5A623');
    }
    return { allowed: false, reason: 'wait_8h', minutesLeft: info.minutesLeft || 0, info: info };
  }

  var blockText = gpsOpenShiftBlockText(info);
  if(opts.showBanner !== false && typeof showGpsBanner === 'function'){
    showGpsBanner(blockText, '#F5A623');
  }
  if(!info.needsLongOpenConfirm){
    return { allowed: false, reason: 'open_shift', info: info };
  }

  if(opts.allowConfirm === false){
    return { allowed: false, reason: 'open_shift_confirm_required', info: info };
  }
  if(!gpsShouldPromptOpenShift(info.job, opts.nowMs)){
    return { allowed: false, reason: 'open_shift_prompt_cooldown', info: info };
  }

  var ok = false;
  try{
    ok = window.confirm ? !!window.confirm(gpsOpenShiftConfirmText(info)) : true;
  }catch(e){
    ok = false;
  }
  if(!ok) return { allowed: false, reason: 'open_shift_user_declined', info: info };

  var closeTs = Number(opts.closeMs);
  if(!Number.isFinite(closeTs) || closeTs <= 0) closeTs = Date.now();
  if(!gpsCloseOpenShift(info.open, closeTs)){
    if(opts.showBanner !== false && typeof showGpsBanner === 'function'){
      showGpsBanner('Không thể đóng ca cũ tự động. Vui lòng checkout thủ công trước.', '#E8433A');
    }
    return { allowed: false, reason: 'open_shift_close_failed', info: info };
  }

  if(opts.showBanner !== false && typeof showGpsBanner === 'function'){
    showGpsBanner('✅ Đã checkout ca cũ. Tiếp tục vào ca mới.', '#0D9E75');
  }
  return { allowed: true, reason: 'open_shift_closed', info: info };
}

