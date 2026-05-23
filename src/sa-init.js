/* ═══════════════════════════════════════════════════════════════════════════════
   14. ENABLE/DISABLE — Bật/tắt hệ thống
   ═══════════════════════════════════════════════════════════════════════════════ */

/** Bật hệ thống chấm công thông minh */
function saSyncNativeSmartState(){
  try {
    if(window._gpsData){
      if(_sa.enabled) _gpsData.enabled = true;
      _gpsData.smartAttendanceMode = !!_sa.enabled;
      _gpsData.insideScheduleOut = false;
    }
    if(typeof saveGpsData === 'function'){
      saveGpsData();
    } else if(window.ccNative && window.ccNative.syncNativeGps) {
      window.ccNative.syncNativeGps(window._gpsData).catch(function(){});
    }
  } catch(e){
    console.warn('[SA] sync native smart state failed:', e);
  }
}

function saEnable(){
  if(window.__SA_STARTED__) return;
  window.__SA_STARTED__ = true;
  _sa.enabled = true;
  saSyncLegacyAutoSwitch(true);
  saSyncWorkGpsFromLegacy();
  saResetStaleWorkState('bat lai khi khong co ca dang mo');
  saSave();
  saSyncNativeSmartState();
  _saRestoreGpsWakeup(); // Phục hồi wakeup timer nếu app bị kill giữa chừng
  saConfigurePolling();
  saEvaluate();
  saUpdateUI();
  showGpsBanner({vi:'✅ Chấm công thông minh đã bật',en:'✅ Smart attendance enabled',ko:'✅ 스마트 출퇴근 켜짐',ja:'✅ スマート勤怠オン',zh:'✅ 智能考勤已开启',my:'✅ အလိုအလျောက် တက်မှတ်ချိန် ဖွင့်ပြီ',th:'✅ เปิดการเช็คอินอัจฉริยะแล้ว',id:'✅ Absensi cerdas aktif',ph:'✅ Smart attendance naka-on',ne:'✅ स्मार्ट हाजिरी सक्रिय',hi:'✅ स्मार्ट उपस्थिति चालू'}[_saL()]||'✅ Chấm công thông minh đã bật', '#0D9E75');
  saLog('ENABLED', '');
}

/** Tắt hệ thống */
function saDisable(){
  window.__SA_STARTED__ = false;
  _sa.enabled = false;
  saSyncLegacyAutoSwitch(false);
  saStopGps();
  saStopWifiPoll();
  // saStopBtsPoll đã bỏ — không còn poll BTS
  saSave();
  saUpdateUI();
  showGpsBanner({vi:'⏸️ Chấm công thông minh đã tắt',en:'⏸️ Smart attendance disabled',ko:'⏸️ 스마트 출퇴근 꺼짐',ja:'⏸️ スマート勤怠オフ',zh:'⏸️ 智能考勤已关闭',my:'⏸️ အလိုအလျောက် တက်မှတ်ချိန် ပိတ်ပြီ',th:'⏸️ ปิดการเช็คอินอัจฉริยะแล้ว',id:'⏸️ Absensi cerdas nonaktif',ph:'⏸️ Smart attendance naka-off',ne:'⏸️ स्मार्ट हाजिरी बन्द',hi:'⏸️ स्मार्ट उपस्थिति बंद'}[_saL()]||'⏸️ Chấm công thông minh đã tắt', '#9CA3AF');
  saLog('DISABLED', '');
}

/** Toggle */
function saToggle(){
  if(_sa.enabled) saDisable(); else saEnable();
}

/** Reset trạng thái hàng ngày (gọi lúc 00:00 hoặc khi mở app ngày mới) */
function saDailyReset(){
  var today = todayKey();
  var lastDate = _sa.stateChangedAt ? new Date(_sa.stateChangedAt) : null;
  if(lastDate){
    var lastKey = lastDate.getFullYear() + '-' + lastDate.getMonth() + '-' + lastDate.getDate();
    if(lastKey !== today){
      _sa.todayCheckedIn = false;
      _sa.todayCheckedOut = false;
      saResetCheckinConfirm();
      saResetCheckoutConfirm();
      if(_sa.state === STATE.CHECKED_OUT){
        saTransition(STATE.HOME, 'ngày mới — reset');
      }
      saSave();
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════════════
   15. INIT — Khởi tạo
   ═══════════════════════════════════════════════════════════════════════════════ */

function saInit(){
  if(window.__SA_BOOTING__) return;
  window.__SA_BOOTING__ = true;
  saLoad();
  saSyncWorkGpsFromLegacy();
  saDailyReset();
  saResetStaleWorkState('khoi dong khi khong co ca dang mo');
  saRenderProfiles(true);

  if(_sa.enabled){
    saSyncLegacyAutoSwitch(true);
    // Kiểm tra quyền GPS trước khi khôi phục polling
    var _saInitIsCapNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
    if(_saInitIsCapNative && window.ccNative && window.ccNative.checkLocationPermission){
      // ccNative đã sẵn sàng → check quyền async
      window.ccNative.checkLocationPermission().then(function(perm){
        var granted = !!(perm && (perm.location === 'granted'
          || perm.fineLocation === 'granted'
          || perm.coarseLocation === 'granted'));
        if(granted){
          saConfigurePolling();
          setTimeout(function(){ saEvaluate(); saUpdateUI(); }, 2000);
        }
        // Nếu denied → không start, ensureGpsAutoRunning('ccNative-ready') sẽ xử lý
      }).catch(function(){
        saConfigurePolling();
        setTimeout(function(){ saEvaluate(); saUpdateUI(); }, 2000);
      });
    } else if(!_saInitIsCapNative){
      // Browser/non-native → chạy thẳng
      saConfigurePolling();
      setTimeout(function(){ saEvaluate(); saUpdateUI(); }, 2000);
    }
    // _saInitIsCapNative && !window.ccNative → ccNative chưa sẵn sàng,
    // ensureGpsAutoRunning('ccNative-ready') từ capacitor-integration.js sẽ xử lý
  }

  window.__SA_BOOTING__ = false;
  saLog('INIT', 'state=' + _sa.state + ' enabled=' + _sa.enabled);
}

/* ═══════════════════════════════════════════════════════════════════════════════
   16. EXPOSE GLOBAL — Cho HTML/UI truy cập
   ═══════════════════════════════════════════════════════════════════════════════ */

// State machine data (read-only access)
window._sa = _sa;
window._saTrail = _saTrail;

// Profile setup
window.saSaveHomeWifi = saSaveHomeWifi;
window.saSaveHomeGps = saSaveHomeGps;
window.saSaveWorkWifi = saSaveWorkWifi;
window.saSaveWorkGps = saSaveWorkGps;
window.saClearHome = saClearHome;
window.saClearWorkSignals = saClearWorkSignals;
window.saSaveSubWorkWifi = saSaveSubWorkWifi;
window.saSaveSubWorkGps = saSaveSubWorkGps;
window.saClearSubWorkSignals = saClearSubWorkSignals;
// Đã bỏ saSaveHomeBts / saSaveWorkBts / saSaveSubWorkBts — không còn BTS

// Control
window.saEnable = saEnable;
window.saDisable = saDisable;
window.saToggle = saToggle;

// Render
window.saRenderHomeProfile = saRenderHomeProfile;
window.saRenderWorkProfile = saRenderWorkProfile;
window.saRenderSubWorkProfile = saRenderSubWorkProfile;
window.saUpdateUI = saUpdateUI;
window.saEvaluate = saEvaluate;
window.saRefreshDebug = saRefreshDebug;

// Constants
window.SA_STATE = STATE;

// Init khi DOM sẵn sàng
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(saInit, 500); });
} else {
  setTimeout(saInit, 500);
}

