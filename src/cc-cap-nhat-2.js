/* PATCH v2.2.5 — GPS permission guard, native attendance sync, professional permission fallback */
(function(){
  if(window.__gpsPermissionAndSyncPatchInstalled) return;
  window.__gpsPermissionAndSyncPatchInstalled = true;

  function isNativeRuntime(){
    try{
      return !!((window.Capacitor && (!Capacitor.isNativePlatform || Capacitor.isNativePlatform())) ||
        (window.ccNative && window.ccNative.isNative));
    }catch(e){ return false; }
  }

  function nativePlugin(){
    return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.ChamCongNative;
  }

  function showPermissionNotice(kind, openFail){
    const L = (window.userData && userData.lang) || 'vi';
    const all = {
      vi:{
        openFailTitle:'Không mở được cài đặt tự động', openFailBody:'Bạn vẫn có thể cấp quyền thủ công theo các bước bên dưới.', closeBtn:'Đã hiểu', openBtn:'Mở cài đặt',
        notification:{icon:'🔔',title:'Cần bật quyền thông báo',body:'Chấm Công Pro dùng thông báo để nhắc vào ca, xác nhận tan ca và báo khi GPS tự chấm công.',steps:['Mở Cài đặt > Ứng dụng > Chấm Công Pro.','Vào Thông báo.','Bật Cho phép thông báo và các kênh nhắc ca.']},
        location:{icon:'📍',title:'Cần bật quyền vị trí',body:'GPS tự động cần quyền Vị trí để lưu nơi làm việc và chấm vào/ra ca ổn định.',steps:['Mở Cài đặt > Ứng dụng > Chấm Công Pro.','Vào Quyền > Vị trí.','Chọn Luôn cho phép hoặc Cho phép mọi lúc, bật Vị trí chính xác nếu có.']},
        battery:{icon:'🔋',title:'Cần chỉnh quyền pin',body:'Để GPS chạy nền ổn định, hãy đặt pin của ứng dụng sang Không hạn chế.',steps:['Mở Cài đặt > Ứng dụng > Chấm Công Pro.','Vào Pin hoặc Sử dụng pin.','Chọn Không hạn chế / Unrestricted. Nếu app nằm trong Ngủ hoặc Ngủ sâu, hãy bỏ khỏi danh sách đó.']}
      },
      en:{
        openFailTitle:'Could not open settings automatically', openFailBody:'You can still grant permission manually by following the steps below.', closeBtn:'Got it', openBtn:'Open settings',
        notification:{icon:'🔔',title:'Enable notification permission',body:'Chấm Công Pro uses notifications for shift reminders and GPS attendance results.',steps:['Open Settings > Apps > Chấm Công Pro.','Open Notifications.','Allow notifications and shift reminder channels.']},
        location:{icon:'📍',title:'Enable location permission',body:'Automatic GPS needs Location permission to save your workplace and clock in/out reliably.',steps:['Open Settings > Apps > Chấm Công Pro.','Open Permissions > Location.','Choose Allow all the time and enable Precise location if available.']},
        battery:{icon:'🔋',title:'Adjust battery permission',body:'For reliable background GPS, set this app battery mode to Unrestricted.',steps:['Open Settings > Apps > Chấm Công Pro.','Open Battery or Battery usage.','Choose Unrestricted. Remove the app from Sleeping or Deep sleeping apps if present.']}
      },
      ko:{
        openFailTitle:'설정을 자동으로 열 수 없습니다', openFailBody:'아래 단계에 따라 수동으로 권한을 허용할 수 있습니다.', closeBtn:'확인', openBtn:'설정 열기',
        notification:{icon:'🔔',title:'알림 권한을 켜세요',body:'Chấm Công Pro는 출근 알림, 퇴근 확인, GPS 자동 기록 결과 알림에 사용됩니다.',steps:['설정 > 앱 > Chấm Công Pro를 엽니다.','알림을 엽니다.','알림 허용과 근무 알림 채널을 켭니다.']},
        location:{icon:'📍',title:'위치 권한을 켜세요',body:'GPS 자동 출퇴근은 근무지를 저장하고 안정적으로 출퇴근을 기록하기 위해 위치 권한이 필요합니다.',steps:['설정 > 앱 > Chấm Công Pro를 엽니다.','권한 > 위치를 엽니다.','항상 허용을 선택하고 가능한 경우 정확한 위치를 켭니다.']},
        battery:{icon:'🔋',title:'배터리 권한을 조정하세요',body:'백그라운드 GPS가 안정적으로 동작하려면 앱 배터리를 제한 없음으로 설정하세요.',steps:['설정 > 앱 > Chấm Công Pro를 엽니다.','배터리 또는 배터리 사용량을 엽니다.','제한 없음을 선택합니다. 절전/초절전 앱 목록에 있으면 제거합니다.']}
      },
      ja:{
        openFailTitle:'設定を自動で開けません', openFailBody:'下の手順で手動でも権限を許可できます。', closeBtn:'了解', openBtn:'設定を開く',
        notification:{icon:'🔔',title:'通知権限を有効にしてください',body:'Chấm Công Proはシフト通知、退勤確認、GPS自動打刻の結果通知に使います。',steps:['設定 > アプリ > Chấm Công Pro を開きます。','通知を開きます。','通知許可とシフト通知チャンネルを有効にします。']},
        location:{icon:'📍',title:'位置情報権限を有効にしてください',body:'GPS自動打刻には、勤務先の保存と安定した出退勤記録のため位置情報権限が必要です。',steps:['設定 > アプリ > Chấm Công Pro を開きます。','権限 > 位置情報を開きます。','常に許可を選び、可能なら正確な位置情報を有効にします。']},
        battery:{icon:'🔋',title:'バッテリー権限を調整してください',body:'バックグラウンドGPSを安定させるには、アプリのバッテリー設定を無制限にしてください。',steps:['設定 > アプリ > Chấm Công Pro を開きます。','バッテリーまたはバッテリー使用量を開きます。','無制限を選びます。スリープ中のアプリにある場合は削除してください。']}
      },
      zh:{
        openFailTitle:'无法自动打开设置', openFailBody:'你仍可按以下步骤手动授予权限。', closeBtn:'知道了', openBtn:'打开设置',
        notification:{icon:'🔔',title:'请开启通知权限',body:'Chấm Công Pro 使用通知来提醒上班、确认下班，并提示 GPS 自动打卡结果。',steps:['打开 设置 > 应用 > Chấm Công Pro。','进入 通知。','允许通知并开启班次提醒频道。']},
        location:{icon:'📍',title:'请开启位置权限',body:'GPS 自动打卡需要位置权限，以保存工作地点并稳定记录上下班。',steps:['打开 设置 > 应用 > Chấm Công Pro。','进入 权限 > 位置。','选择始终允许，并在可用时开启精确位置。']},
        battery:{icon:'🔋',title:'请调整电池权限',body:'为保证后台 GPS 稳定运行，请将应用电池设置为不受限制。',steps:['打开 设置 > 应用 > Chấm Công Pro。','进入 电池 或 电池使用情况。','选择不受限制。若应用在睡眠/深度睡眠列表中，请移除。']}
      },
      my:{
        openFailTitle:'Settings ကို အလိုအလျောက် မဖွင့်နိုင်ပါ', openFailBody:'အောက်ပါအဆင့်များအတိုင်း လက်ဖြင့် ခွင့်ပြုနိုင်ပါသည်။', closeBtn:'နားလည်ပါပြီ', openBtn:'Settings ဖွင့်ရန်',
        notification:{icon:'🔔',title:'အသိပေးချက် ခွင့်ပြုချက် ဖွင့်ပါ',body:'Chấm Công Pro သည် shift သတိပေးချက်၊ ဆင်းချိန်အတည်ပြုချက်နှင့် GPS auto attendance ရလဒ်များအတွက် notification ကို အသုံးပြုသည်။',steps:['Settings > Apps > Chấm Công Pro ကို ဖွင့်ပါ။','Notifications ကို ဖွင့်ပါ။','Notifications နှင့် shift reminder channels ကို ခွင့်ပြုပါ။']},
        location:{icon:'📍',title:'တည်နေရာ ခွင့်ပြုချက် ဖွင့်ပါ',body:'GPS auto attendance သည် အလုပ်နေရာ သိမ်းရန်နှင့် ဝင်/ထွက် မှတ်တမ်းတင်ရန် Location permission လိုအပ်သည်။',steps:['Settings > Apps > Chấm Công Pro ကို ဖွင့်ပါ။','Permissions > Location ကို ဖွင့်ပါ။','Allow all the time ကို ရွေးပြီး ရှိပါက Precise location ကို ဖွင့်ပါ။']},
        battery:{icon:'🔋',title:'Battery permission ပြင်ပါ',body:'Background GPS တည်ငြိမ်ရန် app battery mode ကို Unrestricted သို့ ပြောင်းပါ။',steps:['Settings > Apps > Chấm Công Pro ကို ဖွင့်ပါ။','Battery သို့မဟုတ် Battery usage ကို ဖွင့်ပါ။','Unrestricted ကို ရွေးပါ။ Sleeping/Deep sleeping apps ထဲရှိပါက ဖယ်ရှားပါ။']}
      },
      th:{
        openFailTitle:'เปิดการตั้งค่าอัตโนมัติไม่ได้', openFailBody:'คุณยังสามารถให้สิทธิ์ด้วยตนเองตามขั้นตอนด้านล่าง', closeBtn:'เข้าใจแล้ว', openBtn:'เปิดการตั้งค่า',
        notification:{icon:'🔔',title:'เปิดสิทธิ์การแจ้งเตือน',body:'Chấm Công Pro ใช้การแจ้งเตือนเพื่อเตือนกะ ยืนยันเวลาออก และแจ้งผล GPS อัตโนมัติ',steps:['เปิด ตั้งค่า > แอป > Chấm Công Pro','เข้า การแจ้งเตือน','อนุญาตการแจ้งเตือนและช่องเตือนกะ']},
        location:{icon:'📍',title:'เปิดสิทธิ์ตำแหน่ง',body:'GPS อัตโนมัติต้องใช้ตำแหน่งเพื่อบันทึกที่ทำงานและลงเวลาเข้า/ออกอย่างเสถียร',steps:['เปิด ตั้งค่า > แอป > Chấm Công Pro','เข้า สิทธิ์ > ตำแหน่ง','เลือก อนุญาตตลอดเวลา และเปิดตำแหน่งที่แม่นยำถ้ามี']},
        battery:{icon:'🔋',title:'ปรับสิทธิ์แบตเตอรี่',body:'เพื่อให้ GPS ทำงานเบื้องหลังได้เสถียร ให้ตั้งค่าแบตเตอรี่ของแอปเป็นไม่จำกัด',steps:['เปิด ตั้งค่า > แอป > Chấm Công Pro','เข้า แบตเตอรี่ หรือ การใช้แบตเตอรี่','เลือก ไม่จำกัด และนำแอปออกจากรายการพัก/หลับลึกถ้ามี']}
      },
      id:{
        openFailTitle:'Setelan tidak bisa dibuka otomatis', openFailBody:'Anda tetap bisa memberi izin manual dengan langkah berikut.', closeBtn:'Mengerti', openBtn:'Buka setelan',
        notification:{icon:'🔔',title:'Aktifkan izin notifikasi',body:'Chấm Công Pro memakai notifikasi untuk pengingat shift, konfirmasi pulang, dan hasil absensi GPS.',steps:['Buka Setelan > Aplikasi > Chấm Công Pro.','Buka Notifikasi.','Izinkan notifikasi dan kanal pengingat shift.']},
        location:{icon:'📍',title:'Aktifkan izin lokasi',body:'GPS otomatis membutuhkan izin Lokasi untuk menyimpan tempat kerja dan mencatat masuk/keluar dengan stabil.',steps:['Buka Setelan > Aplikasi > Chấm Công Pro.','Buka Izin > Lokasi.','Pilih Izinkan sepanjang waktu dan aktifkan lokasi presisi jika tersedia.']},
        battery:{icon:'🔋',title:'Sesuaikan izin baterai',body:'Agar GPS latar belakang stabil, atur baterai aplikasi ke Tidak dibatasi.',steps:['Buka Setelan > Aplikasi > Chấm Công Pro.','Buka Baterai atau Penggunaan baterai.','Pilih Tidak dibatasi. Jika ada di aplikasi tidur/tidur nyenyak, hapus dari daftar.']}
      },
      ph:{
        openFailTitle:'Hindi mabuksan ang settings nang awtomatiko', openFailBody:'Maaari mo pa ring payagan ito nang manual gamit ang mga hakbang sa ibaba.', closeBtn:'Nakuha ko', openBtn:'Buksan settings',
        notification:{icon:'🔔',title:'I-enable ang notification permission',body:'Ginagamit ng Chấm Công Pro ang notifications para sa shift reminders, checkout confirmation, at GPS attendance results.',steps:['Buksan Settings > Apps > Chấm Công Pro.','Buksan Notifications.','Payagan ang notifications at shift reminder channels.']},
        location:{icon:'📍',title:'I-enable ang location permission',body:'Kailangan ng automatic GPS ang Location permission para i-save ang workplace at mag-clock in/out nang maayos.',steps:['Buksan Settings > Apps > Chấm Công Pro.','Buksan Permissions > Location.','Piliin ang Allow all the time at i-on ang Precise location kung meron.']},
        battery:{icon:'🔋',title:'Ayusin ang battery permission',body:'Para sa maaasahang background GPS, gawing Unrestricted ang battery mode ng app.',steps:['Buksan Settings > Apps > Chấm Công Pro.','Buksan Battery o Battery usage.','Piliin ang Unrestricted. Alisin sa Sleeping/Deep sleeping apps kung naroon.']}
      },
      ne:{
        openFailTitle:'Settings आफैं खुल्न सकेन', openFailBody:'तलका चरण पालना गरेर अनुमति हातैले दिन सक्नुहुन्छ।', closeBtn:'बुझेँ', openBtn:'Settings खोल्नुहोस्',
        notification:{icon:'🔔',title:'सूचना अनुमति खोल्नुहोस्',body:'Chấm Công Pro ले shift reminder, बाहिर पुष्टि र GPS attendance नतिजाका लागि सूचना प्रयोग गर्छ।',steps:['Settings > Apps > Chấm Công Pro खोल्नुहोस्।','Notifications खोल्नुहोस्।','Notifications र shift reminder channels अनुमति दिनुहोस्।']},
        location:{icon:'📍',title:'स्थान अनुमति खोल्नुहोस्',body:'Automatic GPS लाई कार्यस्थल सुरक्षित गर्न र प्रवेश/बाहिर स्थिर रूपमा रेकर्ड गर्न Location permission चाहिन्छ।',steps:['Settings > Apps > Chấm Công Pro खोल्नुहोस्।','Permissions > Location खोल्नुहोस्।','Allow all the time छान्नुहोस् र उपलब्ध भए Precise location खोल्नुहोस्।']},
        battery:{icon:'🔋',title:'ब्याट्री अनुमति मिलाउनुहोस्',body:'Background GPS स्थिर राख्न app battery mode लाई Unrestricted राख्नुहोस्।',steps:['Settings > Apps > Chấm Công Pro खोल्नुहोस्।','Battery वा Battery usage खोल्नुहोस्।','Unrestricted छान्नुहोस्। Sleeping/Deep sleeping apps मा भए हटाउनुहोस्।']}
      },
      hi:{
        openFailTitle:'Settings अपने आप नहीं खुली', openFailBody:'आप नीचे दिए चरणों से अनुमति मैन्युअल रूप से दे सकते हैं।', closeBtn:'समझ गया', openBtn:'Settings खोलें',
        notification:{icon:'🔔',title:'Notification permission चालू करें',body:'Chấm Công Pro shift reminders, checkout confirmation और GPS attendance results के लिए notifications का उपयोग करता है।',steps:['Settings > Apps > Chấm Công Pro खोलें।','Notifications खोलें।','Notifications और shift reminder channels अनुमति दें।']},
        location:{icon:'📍',title:'Location permission चालू करें',body:'Automatic GPS को workplace save करने और clock in/out स्थिर रूप से रिकॉर्ड करने के लिए Location permission चाहिए।',steps:['Settings > Apps > Chấm Công Pro खोलें।','Permissions > Location खोलें।','Allow all the time चुनें और उपलब्ध हो तो Precise location चालू करें।']},
        battery:{icon:'🔋',title:'Battery permission समायोजित करें',body:'Background GPS स्थिर रखने के लिए app battery mode को Unrestricted करें।',steps:['Settings > Apps > Chấm Công Pro खोलें।','Battery या Battery usage खोलें।','Unrestricted चुनें। Sleeping/Deep sleeping apps में हो तो हटाएं।']}
      }
    };
    const pack = all[L] || all.en;
    const set = (pack[kind]) || all.vi.location;
    const esc = typeof permEscHtml === 'function' ? permEscHtml : function(s){
      return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
    };
    let ov = document.getElementById('permissionGuideOv');
    if(ov) ov.remove();
    ov = document.createElement('div');
    ov.id = 'permissionGuideOv';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(10,16,28,.62);z-index:32000;display:flex;align-items:center;justify-content:center;padding:18px;backdrop-filter:blur(6px)';
    ov.innerHTML =
      '<div style="width:100%;max-width:390px;background:white;border-radius:22px;padding:22px 18px;box-shadow:0 24px 80px rgba(0,0,0,.35);font-family:Nunito,sans-serif;color:var(--text)">'+
        '<div style="display:flex;gap:12px;align-items:center;margin-bottom:10px">'+
          '<div style="width:42px;height:42px;border-radius:14px;background:#EEF4FF;color:#2D7DD2;display:flex;align-items:center;justify-content:center;font-size:22px">'+esc(set.icon)+'</div>'+
          '<div style="font-size:18px;font-weight:900;line-height:1.2">'+esc(openFail ? pack.openFailTitle : set.title)+'</div>'+
        '</div>'+
        '<div style="font-size:13px;color:var(--text2);line-height:1.55;margin-bottom:12px">'+esc(openFail ? pack.openFailBody : set.body)+'</div>'+
        '<div style="display:flex;flex-direction:column;gap:8px;margin:12px 0 16px">'+
          set.steps.map(function(s,i){return '<div style="background:#F4F7F6;border-radius:12px;padding:10px 12px;font-size:13px;line-height:1.45"><b>'+(i+1)+'.</b> '+esc(s)+'</div>';}).join('')+
        '</div>'+
        '<div style="display:flex;gap:10px">'+
          '<button id="permissionGuideClose" style="flex:1;padding:13px;border-radius:12px;border:1.5px solid var(--border);background:white;color:var(--text2);font-size:13px;font-weight:800;font-family:Nunito,sans-serif">'+esc(pack.closeBtn)+'</button>'+
          '<button id="permissionGuideOpen" style="flex:1.45;padding:13px;border-radius:12px;border:none;background:var(--ac);color:white;font-size:13px;font-weight:900;font-family:Nunito,sans-serif">'+esc(pack.openBtn)+'</button>'+
        '</div>'+
      '</div>';
    document.body.appendChild(ov);
    document.getElementById('permissionGuideClose').onclick = function(){ ov.remove(); };
    document.getElementById('permissionGuideOpen').onclick = function(){
      ov.remove();
      window.openNativePermissionSetting(kind);
    };
  }

  async function ensureLocationPermissionForGps(){
    if(isNativeRuntime() && typeof gpsEnsureNativeLocationPermission === 'function'){
      return await gpsEnsureNativeLocationPermission();
    }
    const geo = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Geolocation;
    if(!geo || !isNativeRuntime()) return true;
    try{
      if(geo.checkPermissions){
        const cur = await geo.checkPermissions();
        if(cur && (cur.location === 'granted' || cur.coarseLocation === 'granted')) return true;
      }
      if(geo.requestPermissions){
        const res = await geo.requestPermissions();
        return !!(res && (res.location === 'granted' || res.coarseLocation === 'granted'));
      }
    }catch(e){ console.warn('[GPS Permission] request/check failed:', e); }
    return false;
  }

  /* [ATTENDANCE_NATIVE_QUEUE_MERGE]
     Ghi chu: day la cau noi dua record native ve so cham cong chinh attData.
     NativeGpsService chi ghi queue; app merge vao cp22_att roi moi hien tren UI.
  */
  async function mergeNativeAttendanceRecords(records){
    let merged = 0;
    if(!window.attData) window.attData = {};
    (records || []).forEach(function(rec){
      const key = rec && rec.date;
      const type = rec && rec.type;
      const time = rec && rec.time;
      if(!key || !time) return;
      if(!attData[key]) attData[key] = {type:'cm'};
      attData[key].type = attData[key].type || 'cm';
      if(type === 'IN' && !attData[key].in){
        attData[key].in = time;
        attData[key].auto = true;
        if(rec.ts) attData[key].gpsInTs = rec.ts;
        merged++;
      }else if(type === 'OUT' && !attData[key].out){
        attData[key].out = time;
        attData[key].auto = true;
        if(rec.ts) attData[key].gpsOutTs = rec.ts;
        merged++;
      }
    });
    if(merged > 0){
      if(typeof saveAtt === 'function') saveAtt();
      else if(typeof lsSet === 'function') lsSet('cp22_att', attData);
      if(typeof renderHomeStats === 'function') renderHomeStats();
      if(typeof updateTodayStatusTime === 'function') updateTodayStatusTime();
      if(typeof renderCalBig === 'function') renderCalBig();
      if(typeof renderExcelPreview === 'function') renderExcelPreview();
      if(typeof updateExcelPanel === 'function') updateExcelPanel();
    }
    return merged;
  }

  window.pullNativeAttendanceNow = async function(){
    const plugin = nativePlugin();
    if(!plugin || !plugin.getNativeAttendance) return {merged:0, skipped:true};
    try{
      const res = await plugin.getNativeAttendance();
      const records = (res && res.records) || [];
      const merged = await mergeNativeAttendanceRecords(records);
      if(records.length && plugin.clearNativeAttendance){
        if(window.ccNative && window.ccNative.syncNativeAttendanceState){
          try{ await window.ccNative.syncNativeAttendanceState(); }catch(e){}
        }
        try{ await plugin.clearNativeAttendance({clearAll:true}); }catch(e){ console.warn('[NativeAtt] clear failed:', e); }
      }
      return {merged, records:records.length};
    }catch(e){
      console.warn('[NativeAtt] pull failed:', e);
      return {merged:0, error:String(e && e.message || e)};
    }
  };

  const oldOpenNativePermissionSetting = window.openNativePermissionSetting;
  window.openNativePermissionSetting = async function(kind){
    const plugin = nativePlugin();
    const nativeOk = isNativeRuntime() || !!plugin;
    if(!nativeOk){
      showPermissionNotice(kind, true);
      return;
    }
    try{
      let result = null;
      if(kind === 'notification'){
        if(window.ccNative && window.ccNative.openNotificationSettings) result = await window.ccNative.openNotificationSettings();
        else if(plugin && plugin.openNotificationSettings) result = await plugin.openNotificationSettings();
        else throw new Error('notification settings bridge unavailable');
      }else if(kind === 'location'){
        if(window.ccNative && window.ccNative.openLocationSettings) result = await window.ccNative.openLocationSettings();
        else if(plugin && plugin.openLocationSettings) result = await plugin.openLocationSettings();
        else throw new Error('location settings bridge unavailable');
      }else if(kind === 'battery'){
        if(window.ccNative && window.ccNative.requestIgnoreBatteryOptimization) result = await window.ccNative.requestIgnoreBatteryOptimization();
        else if(plugin && plugin.requestIgnoreBatteryOptimization) result = await plugin.requestIgnoreBatteryOptimization();
        else throw new Error('battery settings bridge unavailable');
        if(typeof scheduleBatteryPermissionCheck === 'function') scheduleBatteryPermissionCheck(result);
        else if(!(result && (result.granted || result.ignoringBatteryOptimizations))) showPermissionNotice('battery', !(result && result.openedSettings));
        return;
      }
      if(!result || result.openedSettings === false) showPermissionNotice(kind, true);
    }catch(e){
      console.warn('[PermissionSettings] robust open failed:', kind, e);
      if(typeof oldOpenNativePermissionSetting === 'function' && kind === 'battery'){
        try{ return await oldOpenNativePermissionSetting(kind); }catch(_){}
      }
      showPermissionNotice(kind, true);
    }
  };

  const oldGpsRequestPermission = window.gpsRequestPermission;
  window.gpsRequestPermission = async function(){
    const permGuide = document.getElementById('gpsPermGuide');
    const manualBox = document.getElementById('gpsManualBox');
    const ok = await ensureLocationPermissionForGps();
    if(!ok){
      if(permGuide) permGuide.style.display = 'block';
      if(manualBox) manualBox.style.display = 'block';
      showPermissionNotice('location', false);
      return;
    }
    if(typeof gpsGetCurrentPos === 'function') return gpsGetCurrentPos();
    if(typeof oldGpsRequestPermission === 'function') return oldGpsRequestPermission.apply(this, arguments);
  };

  const oldTogGPS = window.togGPS;
  window.togGPS = async function(btn){
    const willEnable = btn && !btn.classList.contains('on');
    if(willEnable){
      const ok = await ensureLocationPermissionForGps();
      if(!ok){
        if(btn) btn.classList.remove('on');
        if(window._gpsData) _gpsData.enabled = false;
        if(window.notifCfg) notifCfg.n3 = false;
        try{ if(typeof saveNotif === 'function') saveNotif(); if(typeof saveGpsData === 'function') saveGpsData(); }catch(e){}
        const card = document.getElementById('gpsSetupCard');
        if(card) card.style.display = 'block';
        showPermissionNotice('location', false);
        return;
      }
    }
    if(typeof oldTogGPS === 'function') return oldTogGPS.apply(this, arguments);
  };

  setTimeout(window.pullNativeAttendanceNow, 1200);
  setInterval(window.pullNativeAttendanceNow, 10000);
  window.addEventListener('focus', function(){ setTimeout(window.pullNativeAttendanceNow, 300); });
  document.addEventListener('visibilitychange', function(){
    if(!document.hidden) setTimeout(window.pullNativeAttendanceNow, 300);
  });
})();

/* PATCH v2.2.7 - net worked hours after break for sub salary and exports */
(function(){
  if(window.__netWorkedHoursEverywherePatchInstalled) return;
  window.__netWorkedHoursEverywherePatchInstalled = true;

  function breakHours(){
    var mins = (window.userData && userData.hasBreak && userData.breakMinutes) ? Number(userData.breakMinutes) : 0;
    return isFinite(mins) && mins > 0 ? mins / 60 : 0;
  }

  function parseHM(value){
    var m = String(value || '').trim().match(/^(\d{1,2}):(\d{2})/);
    if(!m) return null;
    var h = Number(m[1]), min = Number(m[2]);
    if(!isFinite(h) || !isFinite(min) || h < 0 || h > 47 || min < 0 || min > 59) return null;
    return h * 60 + min;
  }

  function rawHoursBetween(ins, outs){
    var a = parseHM(ins), b = parseHM(outs);
    if(a == null || b == null) return null;
    return ((b - a + 1440) % 1440) / 60;
  }

  function netHoursBetween(ins, outs){
    var h = rawHoursBetween(ins, outs);
    if(h == null || !isFinite(h)) return null;
    return Math.max(0, h - breakHours());
  }

  function netHoursFromRec(rec){
    if(!rec || !rec.in || !rec.out) return null;
    return netHoursBetween(rec.in, rec.out);
  }

  function oneDecimal(value){
    return Math.round((Number(value) || 0) * 10) / 10;
  }

  function fmtHoursNumber(value){
    if(value == null || !isFinite(value)) return '';
    return oneDecimal(value).toFixed(1);
  }

  function fmtHoursText(value){
    var n = fmtHoursNumber(value);
    return n ? n + 'h' : '';
  }

  window.ccBreakHours = breakHours;
  window.ccRawHoursBetween = rawHoursBetween;
  window.ccNetHoursBetween = netHoursBetween;
  window.ccNetWorkedHours = netHoursFromRec;

  function calcSubJobSalaryNet(){
    var sj = window.userData && userData.subJob;
    if(!sj || !sj.active) return {gross:0, net:0, days:0, hours:0};
    var now = new Date();
    var y = now.getFullYear(), m = now.getMonth();
    var nd = new Date(y, m + 1, 0).getDate();
    var ngc = userData.ngc || 26;
    var subDays = 0, subHours = 0;

    for(var d = 1; d <= nd; d++){
      var rec = window.attData && attData[y + '-' + m + '-' + d];
      var h = rec && rec.sub ? netHoursFromRec(rec.sub) : null;
      if(h == null) continue;
      subDays++;
      subHours += h;
    }

    var mode = sj.salaryMode || 'hour';
    var gross = 0;
    if(mode === 'hour') gross = (Number(sj.salaryHour) || 0) * subHours;
    else if(mode === 'day') gross = (Number(sj.salaryDay) || 0) * subDays;
    else gross = subDays > 0 ? ((Number(sj.salary) || 0) * subDays / ngc) : 0;

    return {gross:Math.round(gross), net:Math.round(gross), days:subDays, hours:oneDecimal(subHours)};
  }

  window.calcSubJobSalary = calcSubJobSalaryNet;
  try{ calcSubJobSalary = calcSubJobSalaryNet; }catch(e){}

  function currentLang(){
    try{ return (window.userData && userData.lang) || 'vi'; }catch(e){ return 'vi'; }
  }

  function labels(){
    var packs = {
      vi:{date:'Ng\u00e0y',day:'Th\u1ee9',job:'C\u00f4ng vi\u1ec7c',status:'Tr\u1ea1ng th\u00e1i',inn:'V\u00e0o',out:'Ra',hours:'Gi\u1edd',type:'Lo\u1ea1i',note:'Ghi ch\u00fa',gps:'GPS',report:'Ch\u1ea5m C\u00f4ng Pro - B\u00e1o c\u00e1o ch\u1ea5m c\u00f4ng',rows:'d\u00f2ng d\u1eef li\u1ec7u',print:'In / L\u01b0u PDF',manual:'Th\u1ee7 c\u00f4ng',auto:'Tự động',popupBlocked:'Không thể mở cửa sổ PDF. Hãy cho phép pop-up để xuất PDF.'},
      en:{date:'Date',day:'Day',job:'Job',status:'Status',inn:'In',out:'Out',hours:'Hours',type:'Type',note:'Note',gps:'GPS',report:'Work Tracker Pro - Attendance report',rows:'data rows',print:'Print / Save PDF',manual:'Manual',auto:'Auto',popupBlocked:'Could not open the PDF window. Please allow pop-ups to export PDF.'},
      ko:{date:'날짜',day:'요일',job:'업무',status:'상태',inn:'출근',out:'퇴근',hours:'시간',type:'유형',note:'메모',gps:'GPS',report:'근태 Pro - 근태 보고서',rows:'개 데이터',print:'인쇄 / PDF 저장',manual:'수동',auto:'자동',popupBlocked:'PDF 창을 열 수 없습니다. PDF 내보내기를 위해 팝업을 허용하세요.'},
      ja:{date:'日付',day:'曜日',job:'ジョブ',status:'状態',inn:'出勤',out:'退勤',hours:'時間',type:'種類',note:'メモ',gps:'GPS',report:'勤怠Pro - 勤怠レポート',rows:'行のデータ',print:'印刷 / PDF保存',manual:'手動',auto:'自動',popupBlocked:'PDFウィンドウを開けません。PDF出力のためポップアップを許可してください。'},
      zh:{date:'日期',day:'星期',job:'工作',status:'状态',inn:'上班',out:'下班',hours:'小时',type:'类型',note:'备注',gps:'GPS',report:'考勤Pro - 考勤报告',rows:'行数据',print:'打印 / 保存 PDF',manual:'手动',auto:'自动',popupBlocked:'无法打开 PDF 窗口。请允许弹窗以导出 PDF。'},
      my:{date:'ရက်စွဲ',day:'နေ့',job:'အလုပ်',status:'အခြေအနေ',inn:'ဝင်',out:'ထွက်',hours:'နာရီ',type:'အမျိုးအစား',note:'မှတ်စု',gps:'GPS',report:'Chấm Công Pro - Attendance report',rows:'ကြောင်း ဒေတာ',print:'Print / PDF သိမ်း',manual:'လက်ဖြင့်',auto:'အလိုအလျောက်',popupBlocked:'PDF window ကို မဖွင့်နိုင်ပါ။ PDF ထုတ်ရန် pop-up ခွင့်ပြုပါ။'},
      th:{date:'วันที่',day:'วัน',job:'งาน',status:'สถานะ',inn:'เข้า',out:'ออก',hours:'ชั่วโมง',type:'ประเภท',note:'หมายเหตุ',gps:'GPS',report:'Work Tracker Pro - รายงานการลงเวลา',rows:'แถวข้อมูล',print:'พิมพ์ / บันทึก PDF',manual:'ด้วยตนเอง',auto:'อัตโนมัติ',popupBlocked:'เปิดหน้าต่าง PDF ไม่ได้ กรุณาอนุญาต pop-up เพื่อส่งออก PDF'},
      id:{date:'Tanggal',day:'Hari',job:'Pekerjaan',status:'Status',inn:'Masuk',out:'Keluar',hours:'Jam',type:'Jenis',note:'Catatan',gps:'GPS',report:'Work Tracker Pro - Laporan absensi',rows:'baris data',print:'Cetak / Simpan PDF',manual:'Manual',auto:'Otomatis',popupBlocked:'Tidak dapat membuka jendela PDF. Izinkan pop-up untuk mengekspor PDF.'},
      ph:{date:'Petsa',day:'Araw',job:'Trabaho',status:'Katayuan',inn:'Pasok',out:'Labas',hours:'Oras',type:'Uri',note:'Tala',gps:'GPS',report:'Work Tracker Pro - Ulat ng attendance',rows:'hanay ng data',print:'I-print / I-save PDF',manual:'Manual',auto:'Awtomatiko',popupBlocked:'Hindi mabuksan ang PDF window. Payagan ang pop-up para makapag-export ng PDF.'},
      ne:{date:'मिति',day:'बार',job:'काम',status:'अवस्था',inn:'प्रवेश',out:'बाहिर',hours:'घण्टा',type:'प्रकार',note:'नोट',gps:'GPS',report:'Chấm Công Pro - हाजिरी रिपोर्ट',rows:'डाटा पङ्क्ति',print:'प्रिन्ट / PDF सुरक्षित',manual:'म्यानुअल',auto:'स्वचालित',popupBlocked:'PDF window खोल्न सकिएन। PDF निर्यात गर्न pop-up अनुमति दिनुहोस्।'},
      hi:{date:'तारीख',day:'दिन',job:'नौकरी',status:'स्थिति',inn:'प्रवेश',out:'प्रस्थान',hours:'घंटे',type:'प्रकार',note:'नोट',gps:'GPS',report:'Chấm Công Pro - उपस्थिति रिपोर्ट',rows:'डेटा पंक्तियां',print:'प्रिंट / PDF सहेजें',manual:'मैनुअल',auto:'स्वचालित',popupBlocked:'PDF window नहीं खुली। PDF export करने के लिए pop-up की अनुमति दें।'}
    };
    return packs[currentLang()] || packs.en;
  }

  function statusLabels(){
    var t = {};
    try{ if(typeof getLang === 'function') t = getLang() || {}; }catch(e){}
    return {
      cm:t.coMat || 'Present',
      vang:t.vang || 'Absent',
      np:t.nghiPhep || 'Leave',
      ll:t.lamLe || t.chipLL || 'Holiday work'
    };
  }

  function dayName(y, m, g){
    try{
      if(typeof DAYS !== 'undefined' && DAYS[new Date(y, m, g).getDay()]) return DAYS[new Date(y, m, g).getDay()];
    }catch(e){}
    return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(y, m, g).getDay()];
  }

  function mainJobLabel(){
    try{ if(typeof u === 'function') return u('job.main'); }catch(e){}
    return 'Main job';
  }

  function subJobLabel(){
    try{ return (window.userData && userData.subJob && userData.subJob.name) || (typeof u === 'function' ? u('job.sub') : 'Sub job'); }catch(e){}
    return 'Sub job';
  }

  function gpsText(rec){
    function point(label, p){
      var lat = p && Number(p.lat), lng = p && Number(p.lng);
      if(!isFinite(lat) || !isFinite(lng)) return '';
      var extra = '';
      if(isFinite(Number(p.acc))) extra += ' +' + Math.round(Number(p.acc)) + 'm';
      if(isFinite(Number(p.dist))) extra += ' / ' + Math.round(Number(p.dist)) + 'm';
      return label + ' ' + lat.toFixed(5) + ',' + lng.toFixed(5) + extra;
    }
    var a = point('IN', rec && rec.gpsIn);
    var b = point('OUT', rec && rec.gpsOut);
    return a && b ? a + ' | ' + b : (a || b || '');
  }

  function exportBaseName(){
    var raw = '';
    try{ raw = (document.getElementById('excelFilename') && document.getElementById('excelFilename').value) || ''; }catch(e){}
    raw = String(raw || 'ChamCong').trim().replace(/[\\/:*?"<>|]+/g, '_');
    return raw || 'ChamCong';
  }

  function buildExportRows(){
    var y = calView.y, m = calView.m;
    var nd = new Date(y, m + 1, 0).getDate();
    var filter = (typeof _exportFilter !== 'undefined' && _exportFilter) || window._exportFilter || 'all';
    var st = statusLabels();
    var rows = [];

    function add(g, rec, label){
      var h = netHoursFromRec(rec);
      rows.push({
        date:g + '/' + (m + 1) + '/' + y,
        day:dayName(y, m, g),
        job:label,
        status:st[(rec && rec.type) || 'cm'] || '',
        inTime:(rec && rec.in) || '',
        outTime:(rec && rec.out) || '',
        hoursNumber:fmtHoursNumber(h),
        hoursText:fmtHoursText(h),
        type:(rec && rec.auto) ? labels().auto : labels().manual,
        note:(rec && rec.note) || '',
        gps:gpsText(rec)
      });
    }

    for(var g = 1; g <= nd; g++){
      var rec = window.attData && attData[y + '-' + m + '-' + g];
      if(!rec) continue;
      if(filter !== 'sub') add(g, rec, mainJobLabel());
      if(rec.sub && filter !== 'main') add(g, rec.sub, subJobLabel());
    }
    return rows;
  }

  function csvCell(value){
    var s = String(value == null ? '' : value);
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function exportCsv(rows){
    var L = labels();
    var header = [L.date, L.day, L.job, L.status, L.inn, L.out, L.hours, L.type, L.note, L.gps];
    var csv = header.map(csvCell).join(',') + '\n' + rows.map(function(r){
      return [r.date, r.day, r.job, r.status, r.inTime, r.outTime, r.hoursNumber, r.type, r.note, r.gps].map(csvCell).join(',');
    }).join('\n');
    var blob = new Blob(['\uFEFF' + csv], {type:'text/csv;charset=utf-8'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = exportBaseName() + '.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){
      if(a.parentNode) a.parentNode.removeChild(a);
      URL.revokeObjectURL(url);
    }, 300);
    if(typeof closePanel === 'function') closePanel('panelExcel');
  }

  function escHtml(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function exportPdf(rows){
    var L = labels();
    var monthTitle = '';
    try{ monthTitle = (typeof MONTHS !== 'undefined' && MONTHS[calView.m]) ? MONTHS[calView.m] : ('T' + (calView.m + 1)); }catch(e){ monthTitle = 'T' + (calView.m + 1); }
    var th = [L.date, L.day, L.job, L.status, L.inn, L.out, L.hours, L.type, L.note, L.gps];
    var html = '<!doctype html><html><head><meta charset="utf-8"><title>' + escHtml(exportBaseName()) + '</title>' +
      '<style>body{font-family:Arial,sans-serif;padding:24px;color:#1A2332}h1{font-size:20px;margin:0 0 6px}p{color:#667;margin:0 0 16px}table{width:100%;border-collapse:collapse;font-size:11px}th{background:#0D9E75;color:white}th,td{border:1px solid #ddd;padding:6px;text-align:left;vertical-align:top}.sub{color:#7B5EA7;font-weight:bold}@media print{button{display:none}}</style>' +
      '</head><body><button onclick="window.print()" style="padding:10px 16px;border-radius:10px;border:0;background:#0D9E75;color:white;font-weight:bold;margin-bottom:14px">' + escHtml(L.print) + '</button>' +
      '<h1>' + escHtml(L.report) + '</h1><p>' + escHtml(monthTitle) + ' ' + escHtml(calView.y) + ' - ' + rows.length + ' ' + escHtml(L.rows) + '</p>' +
      '<table><thead><tr>' + th.map(function(x){ return '<th>' + escHtml(x) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function(r){
        return '<tr><td>' + escHtml(r.date) + '</td><td>' + escHtml(r.day) + '</td><td class="' + (r.job === mainJobLabel() ? '' : 'sub') + '">' + escHtml(r.job) + '</td><td>' + escHtml(r.status) + '</td><td>' + escHtml(r.inTime) + '</td><td>' + escHtml(r.outTime) + '</td><td>' + escHtml(r.hoursText) + '</td><td>' + escHtml(r.type) + '</td><td>' + escHtml(r.note) + '</td><td>' + escHtml(r.gps) + '</td></tr>';
      }).join('') +
      '</tbody></table><script>setTimeout(function(){window.print()},500)<\/script></body></html>';
    var w = window.open('', '_blank');
    if(w){
      w.document.open();
      w.document.write(html);
      w.document.close();
    }else if(typeof showGpsBanner === 'function'){
      showGpsBanner(L.popupBlocked, '#E8433A');
    }
  }

  function doExportNet(){
    var rows = buildExportRows();
    if((window._exportFormat || (typeof _exportFormat !== 'undefined' ? _exportFormat : 'csv')) === 'pdf') return exportPdf(rows);
    return exportCsv(rows);
  }

  window.doExport = doExportNet;
  try{ doExport = doExportNet; }catch(e){}
  window.downloadPdf = function(){
    window._exportFormat = 'pdf';
    try{ _exportFormat = 'pdf'; }catch(e){}
    return doExportNet();
  };
  try{ downloadPdf = window.downloadPdf; }catch(e){}

  setTimeout(function(){
    try{ if(typeof renderSubJobSalary === 'function') renderSubJobSalary(); }catch(e){}
    try{ if(typeof renderHomeStats === 'function') renderHomeStats(); }catch(e){}
    try{ if(typeof renderHoursTable === 'function') renderHoursTable(); }catch(e){}
  }, 0);
})();
