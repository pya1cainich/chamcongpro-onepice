/* ===== KHỞI ĐỘNG APP ===== */
/** Khởi động app: load data → kiểm tra onboarding → vào Home hoặc Onboarding */
function init(){
  loadData();
  loadGpsData();
  // Restore GPS toggle
  if(_gpsData.enabled){
    const btn=document.getElementById('togN3');
    if(btn)btn.classList.add('on');
    const card=document.getElementById('gpsSetupCard');
    if(card)card.style.display='block';
    notifCfg.n3 = true;
    if(typeof gpsScheduleAutoStart === 'function'){
      gpsScheduleAutoStart('app-init');
    } else if(typeof ensureGpsAutoRunning === 'function'){
      ensureGpsAutoRunning('app-init');
    } else if(_gpsData.lat && typeof startGeofencing === 'function'){
      startGeofencing();
    }
  }
  // Check if first time
  if(!userData.name){
    goScreen('screenOB');
    renderOB();
  }else{
    goScreen('screenHome');
    initHome();
    setTimeout(moSplash, 600);
  }
  // notif toggles
  ['n1','n2','n3','n4'].forEach((k,i)=>{
    const el=document.getElementById(`togN${i+1}`);
    if(el){el.className='toggle-sw'+(notifCfg[k]?' on':'');}
  });
  // settings subs
  document.getElementById('siLangSub').textContent=LANGS.find(l=>l.id===userData.lang)?.name||'Tiếng Việt';
  document.getElementById('siCountrySub').textContent=cLang(COUNTRIES.find(c=>c.id===userData.country)?.name)||'Việt Nam';
}

// Defer init() đến khi DOM + tất cả scripts (utils.js, app.js, checkin.js) đã load xong
// → đảm bảo loadGpsData (defined in checkin.js) đã sẵn sàng
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM đã sẵn sàng → defer 1 tick để chắc chắn checkin.js đã load
  setTimeout(init, 0);
}

/* PATCH v2.2.8 - keep shift reminder notifications after setup changes */
(function(){
  if(window.__setupNotificationReschedulePatchInstalled) return;
  window.__setupNotificationReschedulePatchInstalled = true;

  var retryTimer = null;
  var debounceTimer = null;

  function requestSetupNotificationReschedule(reason){
    window.__ccPendingNotificationReschedule = true;
    window.__ccPendingNotificationReason = reason || 'setup';
    if(debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function(){
      tryRunReschedule(0);
    }, 300);
  }

  function tryRunReschedule(attempt){
    if(retryTimer) clearTimeout(retryTimer);
    if(typeof window.rescheduleNativeNotifications === 'function'){
      window.__ccPendingNotificationReschedule = false;
      Promise.resolve(window.rescheduleNativeNotifications()).then(function(){
        if(typeof refreshBgStatus === 'function') setTimeout(refreshBgStatus, 800);
      }).catch(function(e){
        console.warn('[SetupNotif] reschedule failed:', e);
      });
      return;
    }
    if(attempt < 30){
      retryTimer = setTimeout(function(){ tryRunReschedule(attempt + 1); }, 500);
    }
  }

  function wrap(name, reason){
    var oldFn = window[name];
    if(typeof oldFn !== 'function' || oldFn.__setupNotifWrapped) return;
    var wrapped = function(){
      var result = oldFn.apply(this, arguments);
      requestSetupNotificationReschedule(reason || name);
      return result;
    };
    wrapped.__setupNotifWrapped = true;
    window[name] = wrapped;
    try{ eval(name + ' = window[name]'); }catch(e){}
  }

  window.ccRequestNotificationReschedule = requestSetupNotificationReschedule;

  ['saveSetup','onSetupShiftTimeChange','selCurShift','selShift','selHours','selHoursCustomSetup','selBreak','selBreakMin','selLangSetting','selCountrySetting'].forEach(function(name){
    wrap(name, name);
  });

  document.addEventListener('DOMContentLoaded', function(){
    setTimeout(function(){ requestSetupNotificationReschedule('boot'); }, 2200);
  });
})();
