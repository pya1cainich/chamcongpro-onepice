/* ═══════════════════════════════════════════════════════════════════════════════
   11. LOGGING — Ghi log cho debug/audit
   ═══════════════════════════════════════════════════════════════════════════════ */

var _saTrail = [];
var SA_TRAIL_MAX = 200;

function saLog(type, msg){
  var entry = {
    t: Date.now(),
    type: type,
    state: _sa.state,
    msg: msg || ''
  };
  _saTrail.push(entry);
  if(_saTrail.length > SA_TRAIL_MAX) _saTrail.shift();
  console.log('[SA]', type, msg || '', '| state=' + _sa.state);
}

/* ═══════════════════════════════════════════════════════════════════════════════
   12. PROFILE SETUP — Lưu hồ sơ nhà / công ty
   ═══════════════════════════════════════════════════════════════════════════════ */

/** Bảng thông báo profile dùng chung cho tất cả hàm save/clear */
var _SA_BANNER = {
  noWifi:      {vi:'⚠️ Chưa kết nối Wi-Fi.',en:'⚠️ Not connected to Wi-Fi.',ko:'⚠️ Wi-Fi 미연결.',ja:'⚠️ Wi-Fi未接続。',zh:'⚠️ 未连接Wi-Fi。',my:'⚠️ Wi-Fi မချိတ်ဆက်ရ။',th:'⚠️ ยังไม่เชื่อมต่อ Wi-Fi',id:'⚠️ Belum terhubung Wi-Fi.',ph:'⚠️ Hindi nakakonekta sa Wi-Fi.',ne:'⚠️ Wi-Fi कनेक्ट छैन।',hi:'⚠️ Wi-Fi कनेक्ट नहीं।'},
  // Đã bỏ noBts / btsAmbigH / btsAmbigW — không còn dùng BTS
  noGps:       {vi:'⚠️ Không lấy được GPS.',en:'⚠️ Cannot get GPS.',ko:'⚠️ GPS 없음.',ja:'⚠️ GPS取得失敗。',zh:'⚠️ 无法获取GPS。',my:'⚠️ GPS မရ။',th:'⚠️ ไม่สามารถรับ GPS',id:'⚠️ Tidak bisa dapat GPS.',ph:'⚠️ Hindi makuha ang GPS.',ne:'⚠️ GPS लिन सकिएन।',hi:'⚠️ GPS नहीं मिला।'},
  wifiDupH:    {vi:'ℹ️ Wi-Fi đã có trong hồ sơ nhà.',en:'ℹ️ Wi-Fi already in home profile.',ko:'ℹ️ Wi-Fi 이미 집 프로필에 있음.',ja:'ℹ️ Wi-Fiは自宅プロファイルに既存。',zh:'ℹ️ Wi-Fi已在家庭配置中。',my:'ℹ️ Wi-Fi အိမ်ပရိုဖိုင်တွင် ရှိပြီး။',th:'ℹ️ Wi-Fi มีในโปรไฟล์บ้านแล้ว',id:'ℹ️ Wi-Fi sudah di profil rumah.',ph:'ℹ️ Nasa home profile na ang Wi-Fi.',ne:'ℹ️ Wi-Fi घर प्रोफाइलमा छ।',hi:'ℹ️ Wi-Fi घर प्रोफाइल में पहले से है।'},
  wifiDupW:    {vi:'ℹ️ Wi-Fi đã có trong hồ sơ công ty.',en:'ℹ️ Wi-Fi already in work profile.',ko:'ℹ️ Wi-Fi 이미 회사 프로필에 있음.',ja:'ℹ️ Wi-Fiは会社プロファイルに既存。',zh:'ℹ️ Wi-Fi已在公司配置中。',my:'ℹ️ Wi-Fi ကုမ္ပဏီပရိုဖိုင်တွင် ရှိပြီး။',th:'ℹ️ Wi-Fi มีในโปรไฟล์บริษัทแล้ว',id:'ℹ️ Wi-Fi sudah di profil kantor.',ph:'ℹ️ Nasa work profile na ang Wi-Fi.',ne:'ℹ️ Wi-Fi कम्पनी प्रोफाइलमा छ।',hi:'ℹ️ Wi-Fi कंपनी प्रोफाइल में पहले से है।'},
  // Đã bỏ btsDupH / btsDupW — không còn dùng BTS
  savedWifiH:  {vi:'✅ Đã lưu Wi-Fi nhà: ',en:'✅ Home Wi-Fi saved: ',ko:'✅ 집 Wi-Fi 저장: ',ja:'✅ 自宅Wi-Fi保存: ',zh:'✅ 家Wi-Fi已保存: ',my:'✅ အိမ် Wi-Fi သိမ်းပြီး: ',th:'✅ บันทึก Wi-Fi บ้าน: ',id:'✅ Wi-Fi rumah disimpan: ',ph:'✅ Na-save ang Wi-Fi bahay: ',ne:'✅ घर Wi-Fi सेभ: ',hi:'✅ घर Wi-Fi सहेजा: '},
  savedWifiW:  {vi:'✅ Đã lưu Wi-Fi công ty: ',en:'✅ Work Wi-Fi saved: ',ko:'✅ 회사 Wi-Fi 저장: ',ja:'✅ 会社Wi-Fi保存: ',zh:'✅ 公司Wi-Fi已保存: ',my:'✅ ကုမ္ပဏီ Wi-Fi သိမ်းပြီး: ',th:'✅ บันทึก Wi-Fi บริษัท: ',id:'✅ Wi-Fi kantor disimpan: ',ph:'✅ Na-save ang Wi-Fi trabaho: ',ne:'✅ कम्पनी Wi-Fi सेभ: ',hi:'✅ कंपनी Wi-Fi सहेजा: '},
  // Đã bỏ savedBtsH / savedBtsW — không còn dùng BTS
  savedGpsH:   {vi:'✅ Đã lưu GPS nhà',en:'✅ Home GPS saved',ko:'✅ 집 GPS 저장됨',ja:'✅ 自宅GPS保存済',zh:'✅ 家GPS已保存',my:'✅ အိမ် GPS သိမ်းပြီ',th:'✅ บันทึก GPS บ้านแล้ว',id:'✅ GPS rumah disimpan',ph:'✅ Na-save ang GPS bahay',ne:'✅ घर GPS सेभ भयो',hi:'✅ घर GPS सहेजा'},
  savedGpsW:   {vi:'✅ Đã lưu GPS công ty',en:'✅ Work GPS saved',ko:'✅ 회사 GPS 저장됨',ja:'✅ 会社GPS保存済',zh:'✅ 公司GPS已保存',my:'✅ ကုမ္ပဏီ GPS သိမ်းပြီ',th:'✅ บันทึก GPS บริษัทแล้ว',id:'✅ GPS kantor disimpan',ph:'✅ Na-save ang GPS trabaho',ne:'✅ कम्पनी GPS सेभ भयो',hi:'✅ कंपनी GPS सहेजा'},
  clearedH:    {vi:'🗑️ Đã xóa hồ sơ nhà',en:'🗑️ Home profile cleared',ko:'🗑️ 집 프로필 초기화됨',ja:'🗑️ 自宅プロファイルを削除しました',zh:'🗑️ 家庭配置已清除',my:'🗑️ အိမ်ပရိုဖိုင်ဖျက်ပြီ',th:'🗑️ ลบโปรไฟล์บ้านแล้ว',id:'🗑️ Profil rumah dihapus',ph:'🗑️ Na-clear ang home profile',ne:'🗑️ घर प्रोफाइल मेटाइयो',hi:'🗑️ घर प्रोफाइल साफ किया'},
  clearedW:    {vi:'🗑️ Đã xóa Wi-Fi công ty',en:'🗑️ Work Wi-Fi cleared',ko:'🗑️ 회사 Wi-Fi 초기화됨',ja:'🗑️ 会社Wi-Fiを削除しました',zh:'🗑️ 公司Wi-Fi已清除',my:'🗑️ ကုမ္ပဏီ Wi-Fi ဖျက်ပြီ',th:'🗑️ ลบ Wi-Fi บริษัทแล้ว',id:'🗑️ Wi-Fi kantor dihapus',ph:'🗑️ Na-clear ang work Wi-Fi',ne:'🗑️ कम्पनी Wi-Fi मेटाइयो',hi:'🗑️ कंपनी Wi-Fi साफ किया'},
  noWifiSub:   {vi:'❌ Không tìm thấy Wi-Fi',en:'❌ No Wi-Fi found',ko:'❌ Wi-Fi 없음',ja:'❌ Wi-Fiが見つかりません',zh:'❌ 找不到Wi-Fi',my:'❌ Wi-Fi မတွေ့',th:'❌ ไม่พบ Wi-Fi',id:'❌ Wi-Fi tidak ditemukan',ph:'❌ Walang Wi-Fi',ne:'❌ Wi-Fi भेटिएन',hi:'❌ Wi-Fi नहीं मिला'},
  wifiDupSub:  {vi:'ℹ️ Wi-Fi việc phụ đã có',en:'ℹ️ Sub-job Wi-Fi already saved',ko:'ℹ️ 부업 Wi-Fi 이미 저장됨',ja:'ℹ️ 副業Wi-Fiは既存',zh:'ℹ️ 副业Wi-Fi已存在',my:'ℹ️ Sub-job Wi-Fi ရှိပြီး',th:'ℹ️ Wi-Fi งานเสริมมีแล้ว',id:'ℹ️ Wi-Fi sub-job sudah ada',ph:'ℹ️ Naroon na ang Wi-Fi ng sub-job',ne:'ℹ️ Sub-job Wi-Fi छ',hi:'ℹ️ Sub-job Wi-Fi पहले से है'},
  savedWifiSub:{vi:'✅ Đã lưu Wi-Fi việc phụ: ',en:'✅ Sub-job Wi-Fi saved: ',ko:'✅ 부업 Wi-Fi 저장: ',ja:'✅ 副業Wi-Fi保存: ',zh:'✅ 副业Wi-Fi已保存: ',my:'✅ Sub-job Wi-Fi သိမ်းပြီး: ',th:'✅ บันทึก Wi-Fi งานเสริม: ',id:'✅ Wi-Fi sub-job disimpan: ',ph:'✅ Na-save ang Wi-Fi ng sub-job: ',ne:'✅ Sub-job Wi-Fi सेभ: ',hi:'✅ Sub-job Wi-Fi सहेजा: '},
  // Đã bỏ noBtsSub / btsDupSub / savedBtsSub — không còn dùng BTS
  noGpsSub:    {vi:'❌ Không có GPS',en:'❌ No GPS',ko:'❌ GPS 없음',ja:'❌ GPSなし',zh:'❌ 无GPS',my:'❌ GPS မရှိ',th:'❌ ไม่มี GPS',id:'❌ Tidak ada GPS',ph:'❌ Walang GPS',ne:'❌ GPS छैन',hi:'❌ GPS नहीं'},
  savedGpsSub: {vi:'✅ Đã lưu GPS việc phụ',en:'✅ Sub-job GPS saved',ko:'✅ 부업 GPS 저장됨',ja:'✅ 副業GPS保存済',zh:'✅ 副业GPS已保存',my:'✅ Sub-job GPS သိမ်းပြီ',th:'✅ บันทึก GPS งานเสริมแล้ว',id:'✅ GPS sub-job disimpan',ph:'✅ Na-save ang GPS ng sub-job',ne:'✅ Sub-job GPS सेभ भयो',hi:'✅ Sub-job GPS सहेजा'},
  clearedSub:  {vi:'🗑️ Đã xóa hồ sơ việc phụ',en:'🗑️ Sub-job profile cleared',ko:'🗑️ 부업 프로필 초기화됨',ja:'🗑️ 副業プロファイル削除',zh:'🗑️ 副业配置已清除',my:'🗑️ Sub-job ပရိုဖိုင်ဖျက်ပြီ',th:'🗑️ ลบโปรไฟล์งานเสริมแล้ว',id:'🗑️ Profil sub-job dihapus',ph:'🗑️ Na-clear ang sub-job profile',ne:'🗑️ Sub-job प्रोफाइल मेटाइयो',hi:'🗑️ Sub-job प्रोफाइल साफ किया'},
};
function _saB(key){ var L=_saL(); return (_SA_BANNER[key]||{})[L] || (_SA_BANNER[key]||{}).vi || ''; }

/**
 * Helper kiểm tra Wi-Fi đã có trong danh sách chưa.
 * STRICT BSSID-FIRST:
 *   - Nếu cả 2 đều có BSSID → so BSSID (lowercase). Khác BSSID = entry MỚI (cho phép lưu).
 *   - Nếu thiếu BSSID 1 bên → fallback so SSID (backward compat / OS che BSSID).
 * Cho phép nhiều router cùng SSID (mesh, multi-AP) lưu thành nhiều entry riêng.
 */
function _saWifiIsDuplicate(list, info){
  if(!list || !list.length || !info) return false;
  var curBssid = info.bssid ? String(info.bssid).toLowerCase() : '';
  for(var i = 0; i < list.length; i++){
    var p = list[i];
    var pBssid = p.bssid ? String(p.bssid).toLowerCase() : '';
    if(pBssid && curBssid){
      if(pBssid === curBssid) return true; // cùng router vật lý
      continue; // khác BSSID → không tính trùng dù SSID có thể giống
    }
    // Thiếu BSSID 1 bên → fallback SSID
    if(p.ssid && info.ssid && p.ssid === info.ssid) return true;
  }
  return false;
}

/** Lưu Wi-Fi hiện tại vào hồ sơ nhà (ưu tiên BSSID làm khoá duy nhất) */
function saSaveHomeWifi(){
  saGetWifi(function(info){
    if(!info || !info.connected || !info.ssid){
      showGpsBanner(_saB('noWifi'), '#E8433A');
      return;
    }
    if(_saWifiIsDuplicate(_sa.home.wifi, info)){
      showGpsBanner(_saB('wifiDupH'), '#2D7DD2');
      return;
    }
    _sa.home.wifi.push({ssid: info.ssid, bssid: info.bssid || ''});
    saSave();
    saSyncNativeSmartState();
    saRenderHomeProfile();
    showGpsBanner(_saB('savedWifiH') + info.ssid, '#0D9E75');
  });
}

// (Đã bỏ saSaveHomeBts — không còn lưu BTS cho hồ sơ nhà)

/** Lưu GPS hiện tại vào hồ sơ nhà */
function saSaveHomeGps(){
  saGetGps(function(gps){
    if(!gps){
      showGpsBanner(_saB('noGps'), '#E8433A');
      return;
    }
    _sa.home.gps = {lat: gps.lat, lng: gps.lng, radius: 200};
    saSave();
    saSyncNativeSmartState();
    saRenderHomeProfile();
    showGpsBanner(_saB('savedGpsH'), '#0D9E75');
  });
}

/** Lưu Wi-Fi hiện tại vào hồ sơ công ty (ưu tiên BSSID làm khoá duy nhất) */
function saSaveWorkWifi(){
  saGetWifi(function(info){
    if(!info || !info.connected || !info.ssid){
      showGpsBanner(_saB('noWifi'), '#E8433A');
      return;
    }
    if(_saWifiIsDuplicate(_sa.work.wifi, info)){
      showGpsBanner(_saB('wifiDupW'), '#2D7DD2');
      return;
    }
    _sa.work.wifi.push({ssid: info.ssid, bssid: info.bssid || ''});
    saSave();
    saSyncNativeSmartState();
    saRenderWorkProfile();
    showGpsBanner(_saB('savedWifiW') + info.ssid, '#0D9E75');
  });
}

// (Đã bỏ saSaveWorkBts — không còn lưu BTS cho hồ sơ công ty)

/** Lưu GPS hiện tại vào hồ sơ công ty */
function saSaveWorkGps(){
  saGetGps(function(gps){
    if(!gps){
      showGpsBanner(_saB('noGps'), '#E8433A');
      return;
    }
    _sa.work.gps = {lat:gps.lat, lng:gps.lng, radius:100};
    try{
      if(window._gpsData && typeof gpsPersistCompanyLocation === 'function'){
        gpsPersistCompanyLocation(gps.lat, gps.lng, 100, 'main');
      }
      if(window._gpsData){
        _gpsData.activeJob = 'main';
        _gpsData.lat = gps.lat;
        _gpsData.lng = gps.lng;
        _gpsData.radius = 100;
      }
    }catch(e){}
    saSave();
    saSyncNativeSmartState();
    saRenderWorkProfile();
    showGpsBanner(_saB('savedGpsW'), '#0D9E75');
  });
}

/** Xóa hồ sơ nhà */
function saClearHome(){
  _sa.home = {wifi:[], gps:null};
  saSave();
  saSyncNativeSmartState();
  saRenderHomeProfile();
  showGpsBanner(_saB('clearedH'), '#9CA3AF');
}

/** Xóa Wi-Fi công ty (giữ GPS) */
function saClearWorkSignals(){
  _sa.work.wifi = [];
  // _sa.work.bts đã bỏ — không còn dùng BTS
  saSave();
  saSyncNativeSmartState();
  saRenderWorkProfile();
  showGpsBanner(_saB('clearedW'), '#9CA3AF');
}

/* ── Hồ sơ việc phụ ── */

function saSaveSubWorkWifi(){
  saGetWifi(function(info){
    if(!info || !info.connected || !info.ssid){ showGpsBanner(_saB('noWifiSub'), '#E8433A'); return; }
    if(!_sa.subWork) _sa.subWork = {wifi:[], gps:null};
    if(_saWifiIsDuplicate(_sa.subWork.wifi, info)){
      showGpsBanner(_saB('wifiDupSub'), '#2D7DD2'); return;
    }
    _sa.subWork.wifi.push({ssid:info.ssid, bssid:info.bssid||''});
    saSave(); saRenderSubWorkProfile();
    showGpsBanner(_saB('savedWifiSub')+info.ssid, '#7B5EA7');
  });
}

// (Đã bỏ saSaveSubWorkBts — không còn lưu BTS cho việc phụ)

function saSaveSubWorkGps(){
  saGetGps(function(gps){
    if(!gps){ showGpsBanner(_saB('noGpsSub'), '#E8433A'); return; }
    if(!_sa.subWork) _sa.subWork = {wifi:[], gps:null};
    _sa.subWork.gps = {lat:gps.lat, lng:gps.lng, radius:100};
    saSave(); saRenderSubWorkProfile();
    showGpsBanner(_saB('savedGpsSub'), '#7B5EA7');
  });
}

function saClearSubWorkSignals(){
  if(!_sa.subWork) _sa.subWork = {wifi:[], gps:null};
  _sa.subWork.wifi = []; _sa.subWork.gps = null;
  saSave(); saRenderSubWorkProfile();
  showGpsBanner(_saB('clearedSub'), '#9CA3AF');
}

/* ═══════════════════════════════════════════════════════════════════════════════
   13. RENDER PROFILE UI — Hiển thị hồ sơ trong panel GPS
   ═══════════════════════════════════════════════════════════════════════════════ */

function saEscHtml(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
  });
}

/** Render phần hồ sơ nhà */
function saRenderHomeProfile(){
  var box = document.getElementById('saHomeProfile');
  if(!box) return;
  var L = _saL();
  var _notSaved  = {vi:'Chưa lưu',en:'Not saved',ko:'저장 안됨',ja:'未保存',zh:'未保存',my:'မသိမ်း',th:'ยังไม่บันทึก',id:'Belum disimpan',ph:'Hindi pa naka-save',ne:'सेभ भएको छैन',hi:'सहेजा नहीं'}[L]||'Chưa lưu';
  var _wifiHome  = {vi:'📶 Wi-Fi nhà',en:'📶 Home Wi-Fi',ko:'📶 집 Wi-Fi',ja:'📶 自宅Wi-Fi',zh:'📶 家庭Wi-Fi',my:'📶 အိမ် Wi-Fi',th:'📶 Wi-Fi บ้าน',id:'📶 Wi-Fi rumah',ph:'📶 Wi-Fi bahay',ne:'📶 घर Wi-Fi',hi:'📶 घर Wi-Fi'}[L]||'📶 Wi-Fi nhà';
  var _saveWifi  = {vi:'📶 Lưu Wi-Fi hiện tại',en:'📶 Save current Wi-Fi',ko:'📶 현재 Wi-Fi 저장',ja:'📶 現在のWi-Fiを保存',zh:'📶 保存当前Wi-Fi',my:'📶 လက်ရှိ Wi-Fi သိမ်း',th:'📶 บันทึก Wi-Fi ปัจจุบัน',id:'📶 Simpan Wi-Fi saat ini',ph:'📶 I-save ang Wi-Fi ngayon',ne:'📶 हालको Wi-Fi सेभ गर्नुस्',hi:'📶 वर्तमान Wi-Fi सहेजें'}[L]||'📶 Lưu Wi-Fi hiện tại';
  // Đã bỏ _btsHome / _saveBts — không còn BTS
  var _gpsHome   = {vi:'📍 GPS nhà (dự phòng)',en:'📍 Home GPS (backup)',ko:'📍 집 GPS (백업)',ja:'📍 自宅GPS（バックアップ）',zh:'📍 家庭GPS（备用）',my:'📍 အိမ် GPS (backup)',th:'📍 GPS บ้าน (สำรอง)',id:'📍 GPS rumah (cadangan)',ph:'📍 GPS bahay (backup)',ne:'📍 घर GPS (ब्याकअप)',hi:'📍 घर GPS (बैकअप)'}[L]||'📍 GPS nhà (dự phòng)';
  var _saveGps   = {vi:'📍 Lưu GPS nhà',en:'📍 Save home GPS',ko:'📍 집 GPS 저장',ja:'📍 自宅GPSを保存',zh:'📍 保存家庭GPS',my:'📍 အိမ် GPS သိမ်း',th:'📍 บันทึก GPS บ้าน',id:'📍 Simpan GPS rumah',ph:'📍 I-save ang GPS bahay',ne:'📍 घर GPS सेभ गर्नुस्',hi:'📍 घर GPS सहेजें'}[L]||'📍 Lưu GPS nhà';
  var _clearHome = {vi:'🗑️ Xóa hồ sơ nhà',en:'🗑️ Clear home profile',ko:'🗑️ 집 프로필 초기화',ja:'🗑️ 自宅プロファイルを削除',zh:'🗑️ 清除家庭配置',my:'🗑️ အိမ်ပရိုဖိုင်ဖျက်',th:'🗑️ ลบโปรไฟล์บ้าน',id:'🗑️ Hapus profil rumah',ph:'🗑️ Burahin ang profile ng bahay',ne:'🗑️ घर प्रोफाइल मेटाउनुस्',hi:'🗑️ घर प्रोफाइल हटाएं'}[L]||'🗑️ Xóa hồ sơ nhà';

  var html = '';
  html += '<div style="font-size:11px;font-weight:900;color:var(--text3);margin-bottom:6px">' + _wifiHome + '</div>';
  if(_sa.home.wifi.length === 0){
    html += '<div style="font-size:12px;color:var(--text3);margin-bottom:8px">' + _notSaved + '</div>';
  } else {
    for(var i = 0; i < _sa.home.wifi.length; i++){
      var w = _sa.home.wifi[i];
      html += '<div style="font-size:12px;color:var(--text);margin-bottom:4px">• ' + saEscHtml(w.ssid) +
              ' <span onclick="_saRemoveHomeWifi('+i+')" style="color:#E8433A;cursor:pointer;font-size:11px">✕</span></div>';
    }
  }
  html += '<button onclick="saSaveHomeWifi()" style="margin:6px 0 12px;padding:8px 14px;border-radius:8px;border:1.5px solid var(--ac);background:white;color:var(--ac);font-size:11px;font-weight:800;font-family:Nunito,sans-serif">' + _saveWifi + '</button>';

  // Đã bỏ section BTS nhà — không còn dùng BTS

  html += '<div style="font-size:11px;font-weight:900;color:var(--text3);margin-bottom:6px">' + _gpsHome + '</div>';
  if(!_sa.home.gps){
    html += '<div style="font-size:12px;color:var(--text3);margin-bottom:8px">' + _notSaved + '</div>';
  } else {
    html += '<div style="font-size:12px;color:var(--text);margin-bottom:8px">' +
            _sa.home.gps.lat.toFixed(5) + ', ' + _sa.home.gps.lng.toFixed(5) + '</div>';
  }
  html += '<button onclick="saSaveHomeGps()" style="margin:6px 0 8px;padding:8px 14px;border-radius:8px;border:1.5px solid var(--border);background:white;color:var(--text2);font-size:11px;font-weight:800;font-family:Nunito,sans-serif">' + _saveGps + '</button>';

  html += '<div style="margin-top:8px"><button onclick="saClearHome()" style="padding:6px 12px;border-radius:8px;border:1px solid #E8433A;background:white;color:#E8433A;font-size:11px;font-weight:800;font-family:Nunito,sans-serif">' + _clearHome + '</button></div>';

  box.innerHTML = html;
}

/** Render phần Wi-Fi công ty */
function saRenderWorkProfile(){
  var box = document.getElementById('saWorkProfile');
  if(!box) return;
  var L = _saL();
  var _notSaved  = {vi:'Chưa lưu',en:'Not saved',ko:'저장 안됨',ja:'未保存',zh:'未保存',my:'မသိမ်း',th:'ยังไม่บันทึก',id:'Belum disimpan',ph:'Hindi pa naka-save',ne:'सेभ भएको छैन',hi:'सहेजा नहीं'}[L]||'Chưa lưu';
  var _wifiWork  = {vi:'📶 Wi-Fi công ty',en:'📶 Work Wi-Fi',ko:'📶 회사 Wi-Fi',ja:'📶 会社Wi-Fi',zh:'📶 公司Wi-Fi',my:'📶 ကုမ္ပဏီ Wi-Fi',th:'📶 Wi-Fi บริษัท',id:'📶 Wi-Fi kantor',ph:'📶 Wi-Fi trabaho',ne:'📶 कम्पनी Wi-Fi',hi:'📶 कंपनी Wi-Fi'}[L]||'📶 Wi-Fi công ty';
  var _saveWifi  = {vi:'📶 Lưu Wi-Fi hiện tại',en:'📶 Save current Wi-Fi',ko:'📶 현재 Wi-Fi 저장',ja:'📶 現在のWi-Fiを保存',zh:'📶 保存当前Wi-Fi',my:'📶 လက်ရှိ Wi-Fi သိမ်း',th:'📶 บันทึก Wi-Fi ปัจจุบัน',id:'📶 Simpan Wi-Fi saat ini',ph:'📶 I-save ang Wi-Fi ngayon',ne:'📶 हालको Wi-Fi सेभ गर्नुस्',hi:'📶 वर्तमान Wi-Fi सहेजें'}[L]||'📶 Lưu Wi-Fi hiện tại';
  var _gpsWork   = {vi:'📍 GPS công ty',en:'📍 Work GPS',ko:'📍 회사 GPS',ja:'📍 会社GPS',zh:'📍 公司GPS',my:'📍 ကုမ္ပဏီ GPS',th:'📍 GPS บริษัท',id:'📍 GPS kantor',ph:'📍 GPS trabaho',ne:'📍 कम्पनी GPS',hi:'📍 कंपनी GPS'}[L]||'📍 GPS công ty';
  var _saveGps   = {vi:'📍 Lưu GPS công ty',en:'📍 Save work GPS',ko:'📍 회사 GPS 저장',ja:'📍 会社GPSを保存',zh:'📍 保存公司GPS',my:'📍 ကုမ္ပဏီ GPS သိမ်း',th:'📍 บันทึก GPS บริษัท',id:'📍 Simpan GPS kantor',ph:'📍 I-save ang GPS trabaho',ne:'📍 कम्पनी GPS सेभ गर्नुस्',hi:'📍 कंपनी GPS सहेजें'}[L]||'📍 Lưu GPS công ty';
  // Đã bỏ _btsWork / _saveBts — không còn BTS
  var _clearWork = {vi:'🗑️ Xóa Wi-Fi công ty',en:'🗑️ Clear work Wi-Fi',ko:'🗑️ 회사 Wi-Fi 초기화',ja:'🗑️ 会社Wi-Fiを削除',zh:'🗑️ 清除公司Wi-Fi',my:'🗑️ ကုမ္ပဏီ Wi-Fi ဖျက်',th:'🗑️ ลบ Wi-Fi บริษัท',id:'🗑️ Hapus Wi-Fi kantor',ph:'🗑️ Burahin ang Wi-Fi trabaho',ne:'🗑️ कम्पनी Wi-Fi मेटाउनुस्',hi:'🗑️ कंपनी Wi-Fi हटाएं'}[L]||'🗑️ Xóa Wi-Fi công ty';

  var html = '';
  html += '<div style="font-size:11px;font-weight:900;color:var(--text3);margin-bottom:6px">' + _wifiWork + '</div>';
  if(_sa.work.wifi.length === 0){
    html += '<div style="font-size:12px;color:var(--text3);margin-bottom:8px">' + _notSaved + '</div>';
  } else {
    for(var i = 0; i < _sa.work.wifi.length; i++){
      var w = _sa.work.wifi[i];
      html += '<div style="font-size:12px;color:var(--text);margin-bottom:4px">• ' + saEscHtml(w.ssid) +
              ' <span onclick="_saRemoveWorkWifi('+i+')" style="color:#E8433A;cursor:pointer;font-size:11px">✕</span></div>';
    }
  }
  html += '<button onclick="saSaveWorkWifi()" style="margin:6px 0 12px;padding:8px 14px;border-radius:8px;border:1.5px solid var(--ac);background:white;color:var(--ac);font-size:11px;font-weight:800;font-family:Nunito,sans-serif">' + _saveWifi + '</button>';

  // Đã bỏ section BTS công ty — không còn dùng BTS

  html += '<div style="font-size:11px;font-weight:900;color:var(--text3);margin:8px 0 6px">' + _gpsWork + '</div>';
  if(!_sa.work.gps){
    html += '<div style="font-size:12px;color:var(--text3);margin-bottom:4px">' + _notSaved + '</div>';
  } else {
    html += '<div style="font-size:12px;color:var(--text);margin-bottom:4px">' +
            _sa.work.gps.lat.toFixed(5) + ', ' + _sa.work.gps.lng.toFixed(5) +
            ' <span onclick="saClearWorkGps&&saClearWorkGps()" style="color:#E8433A;cursor:pointer;font-size:11px">✕</span></div>';
  }
  html += '<button onclick="saSaveWorkGps()" style="margin:4px 0 8px;padding:8px 14px;border-radius:8px;border:1.5px solid var(--border);background:white;color:var(--text2);font-size:11px;font-weight:800;font-family:Nunito,sans-serif">' + _saveGps + '</button>';

  html += '<div style="margin-top:8px"><button onclick="saClearWorkSignals()" style="padding:6px 12px;border-radius:8px;border:1px solid #E8433A;background:white;color:#E8433A;font-size:11px;font-weight:800;font-family:Nunito,sans-serif">' + _clearWork + '</button></div>';

  box.innerHTML = html;
}

function saRenderSubWorkProfile(){
  var section = document.getElementById('saSubWorkSection');
  var box = document.getElementById('saSubWorkProfile');
  if(!box) return;
  var active = !!(window.userData && userData.subJob && userData.subJob.active);
  if(section) section.style.display = active ? 'block' : 'none';
  if(!active){ box.innerHTML = ''; return; }
  if(!_sa.subWork) _sa.subWork = {wifi:[], gps:null};
  var html = '';
  html += '<div style="font-size:11px;font-weight:900;color:#5a3e8e;margin-bottom:6px">📶 Wi-Fi việc phụ</div>';
  if(!_sa.subWork.wifi.length){
    html += '<div style="font-size:12px;color:var(--text3);margin-bottom:8px">Chưa lưu</div>';
  } else {
    for(var i=0; i<_sa.subWork.wifi.length; i++){
      var w=_sa.subWork.wifi[i];
      html += '<div style="font-size:12px;color:var(--text);margin-bottom:4px">• '+saEscHtml(w.ssid)+
              ' <span onclick="_saRemoveSubWorkWifi('+i+')" style="color:#E8433A;cursor:pointer;font-size:11px">✕</span></div>';
    }
  }
  html += '<button onclick="saSaveSubWorkWifi()" style="margin:6px 0 12px;padding:8px 14px;border-radius:8px;border:1.5px solid #7B5EA7;background:white;color:#7B5EA7;font-size:11px;font-weight:800;font-family:Nunito,sans-serif">📶 Lưu Wi-Fi việc phụ</button>';
  // Đã bỏ section BTS việc phụ — không còn dùng BTS
  html += '<div style="font-size:11px;font-weight:900;color:#5a3e8e;margin:8px 0 6px">📍 GPS việc phụ</div>';
  if(_sa.subWork.gps){
    html += '<div style="font-size:12px;color:var(--text);margin-bottom:4px">'+
            _sa.subWork.gps.lat.toFixed(5)+', '+_sa.subWork.gps.lng.toFixed(5)+
            ' <span onclick="saClearSubWorkGps&&saClearSubWorkGps()" style="color:#E8433A;cursor:pointer;font-size:11px">✕</span></div>';
  } else {
    html += '<div style="font-size:12px;color:var(--text3);margin-bottom:4px">Chưa lưu</div>';
  }
  html += '<button onclick="saSaveSubWorkGps()" style="margin:4px 0 8px;padding:8px 14px;border-radius:8px;border:1.5px solid var(--border);background:white;color:var(--text2);font-size:11px;font-weight:800;font-family:Nunito,sans-serif">📍 Lưu GPS việc phụ</button>';
  html += '<div style="margin-top:8px"><button onclick="saClearSubWorkSignals()" style="padding:6px 12px;border-radius:8px;border:1px solid #E8433A;background:white;color:#E8433A;font-size:11px;font-weight:800;font-family:Nunito,sans-serif">🗑️ Xóa hồ sơ việc phụ</button></div>';
  box.innerHTML = html;
}

/* ── Helpers xóa từng mục ── */
window._saRemoveHomeWifi = function(i){ _sa.home.wifi.splice(i,1); saSave(); saSyncNativeSmartState(); saRenderHomeProfile(); };
window._saRemoveWorkWifi = function(i){ _sa.work.wifi.splice(i,1); saSave(); saSyncNativeSmartState(); saRenderWorkProfile(); };
window._saRemoveSubWorkWifi = function(i){ if(_sa.subWork) _sa.subWork.wifi.splice(i,1); saSave(); saRenderSubWorkProfile(); };
window.saClearWorkGps      = function(){ _sa.work.gps=null; saSave(); saSyncNativeSmartState(); saRenderWorkProfile(); };
window.saClearSubWorkGps    = function(){ if(_sa.subWork) _sa.subWork.gps=null; saSave(); saRenderSubWorkProfile(); };
// Đã bỏ _saRemoveHomeBts / _saRemoveWorkBts / _saRemoveSubWorkBts — không còn BTS

var _saProfileRenderSig = '';
function saProfileRenderSignature(){
  try {
    return JSON.stringify({
      homeWifi: _sa.home.wifi || [],
      homeGps: _sa.home.gps || null,
      workWifi: _sa.work.wifi || [],
      workGps: _sa.work.gps || null,
      // homeBts/workBts/subWorkBts đã bỏ — không còn BTS
      subWorkWifi: (_sa.subWork && _sa.subWork.wifi) || [],
      subWorkGps:  (_sa.subWork && _sa.subWork.gps)  || null
    });
  } catch(e){
    return String(Date.now());
  }
}

function saRenderProfiles(force){
  var sig = saProfileRenderSignature();
  if(!force && sig === _saProfileRenderSig) return;
  _saProfileRenderSig = sig;
  saRenderHomeProfile();
  saRenderWorkProfile();
  saRenderSubWorkProfile();
}

function saSyncLegacyAutoSwitch(enabled){
  var on = !!enabled;
  try {
    if(window._gpsData){
      _gpsData.enabled = on;
      _gpsData.smartAttendanceMode = on;
      _gpsData.insideScheduleOut = false;
    }
    if(window.notifCfg) notifCfg.n3 = on;
    var gpsBtn = document.getElementById('togN3');
    if(gpsBtn) gpsBtn.classList.toggle('on', on);
    var saBtn = document.getElementById('togSA');
    if(saBtn) saBtn.classList.toggle('on', on);
    var card = document.getElementById('gpsSetupCard');
    if(card) card.style.display = on ? 'block' : 'none';
    if(typeof saveNotif === 'function') saveNotif();
    if(typeof saveGpsData === 'function') saveGpsData();
    if(!on && typeof stopGeofencing === 'function') stopGeofencing();
  } catch(e){
    console.warn('[SA] sync legacy switch failed:', e);
  }
}

