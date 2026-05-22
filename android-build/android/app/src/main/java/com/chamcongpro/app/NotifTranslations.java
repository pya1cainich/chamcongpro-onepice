package com.chamcongpro.app;

import android.content.Context;
import android.content.SharedPreferences;
import java.util.HashMap;
import java.util.Map;

/**
 * Bản dịch cho tất cả notification của NativeGpsService.
 * Hỗ trợ 11 ngôn ngữ: vi, en, ko, ja, zh, my, th, id, ph, ne, hi.
 * Ngôn ngữ user lưu trong SharedPreferences "cc_gps_config" → key "userLang".
 * Dùng: NotifTranslations.tr(context, "key") hoặc tr(context, "key", arg1, arg2...)
 */
public class NotifTranslations {

    private static final Map<String, Map<String, String>> TR = new HashMap<>();

    private static void add(String key, String vi, String en, String ko, String ja, String zh,
                            String my, String th, String id, String ph, String ne, String hi) {
        Map<String, String> m = new HashMap<>();
        m.put("vi", vi); m.put("en", en); m.put("ko", ko); m.put("ja", ja); m.put("zh", zh);
        m.put("my", my); m.put("th", th); m.put("id", id); m.put("ph", ph); m.put("ne", ne); m.put("hi", hi);
        TR.put(key, m);
    }

    static {
        // ───── Notification chính (foreground service) ─────
        add("ongoingTracking",
            "Chấm Công Pro đang theo dõi vị trí",
            "ChamCongPro is tracking location",
            "ChamCongPro 위치 추적 중",
            "ChamCongPro 位置追跡中",
            "ChamCongPro 正在追踪位置",
            "ChamCongPro တည်နေရာ ခြေရာခံနေပါသည်",
            "ChamCongPro กำลังติดตามตำแหน่ง",
            "ChamCongPro melacak lokasi",
            "Sinusubaybayan ng ChamCongPro ang lokasyon",
            "ChamCongPro स्थान ट्र्याक गर्दै",
            "ChamCongPro स्थान ट्रैक कर रहा है");

        // ───── GPS gián đoạn ─────
        add("gpsInterrupted",
            "⚠️ GPS bị gián đoạn — nhấn để kích hoạt lại",
            "⚠️ GPS interrupted — tap to reactivate",
            "⚠️ GPS 중단됨 — 다시 활성화하려면 탭",
            "⚠️ GPS中断 — タップして再起動",
            "⚠️ GPS中断 — 点击重新激活",
            "⚠️ GPS ပြတ်တောက် — ပြန်ဖွင့်ရန် နှိပ်ပါ",
            "⚠️ GPS ขัดข้อง — แตะเพื่อเปิดใหม่",
            "⚠️ GPS terganggu — ketuk untuk aktifkan lagi",
            "⚠️ Naputol ang GPS — pindutin para muling i-activate",
            "⚠️ GPS अवरुद्ध — पुन: सक्रिय गर्न ट्याप गर्नुस्",
            "⚠️ GPS रुकावट — फिर सक्रिय करने के लिए टैप करें");

        // ───── GPS không có / không có quyền ─────
        add("noGpsTitle",
            "Không có GPS", "No GPS", "GPS 없음", "GPSなし", "无GPS",
            "GPS မရှိ", "ไม่มี GPS", "Tidak ada GPS", "Walang GPS", "GPS छैन", "GPS नहीं");

        add("noGpsBodyDisabled",
            "GPS hoặc định vị mạng đang tắt. Hãy bật Vị trí để chấm công tự động hoạt động trước/sau giờ làm.",
            "GPS or network location is off. Enable Location for auto-attendance to work before/after shift.",
            "GPS 또는 네트워크 위치가 꺼져 있습니다. 자동 출퇴근을 위해 위치를 켜십시오.",
            "GPSまたはネットワーク位置がオフです。自動勤怠のため位置情報をオンにしてください。",
            "GPS或网络定位已关闭。请开启位置以便自动考勤工作。",
            "GPS သို့မဟုတ် ကွန်ရက်တည်နေရာ ပိတ်ထား။ Location ဖွင့်ပါ။",
            "GPS หรือเครือข่ายตำแหน่งปิดอยู่ เปิด Location เพื่อให้เช็คอินอัตโนมัติทำงาน",
            "GPS atau lokasi jaringan mati. Aktifkan Lokasi untuk absensi otomatis.",
            "Naka-off ang GPS o network location. I-on ang Location para gumana ang auto-attendance.",
            "GPS वा नेटवर्क स्थान बन्द छ। स्वत: हाजिरीका लागि स्थान खोल्नुस्।",
            "GPS या नेटवर्क लोकेशन बंद है। ऑटो-हाजिरी के लिए लोकेशन चालू करें।");

        add("noGpsBodyOff",
            "Chưa bật Vị trí trên điện thoại. Chấm công tự động sẽ tiếp tục khi GPS hoạt động lại.",
            "Location not enabled on phone. Auto-attendance will resume when GPS is on.",
            "전화기에 위치가 켜져 있지 않습니다. GPS가 다시 켜지면 재개됩니다.",
            "電話の位置情報がオフです。GPSが復帰すると自動勤怠が再開されます。",
            "手机未开启位置。GPS恢复后自动考勤将继续。",
            "ဖုန်းတွင် Location မဖွင့်ထား။ GPS ပြန်ဖွင့်ပါက အလိုအလျောက် ဆက်လုပ်ပါမည်။",
            "ยังไม่เปิด Location บนมือถือ เช็คอินอัตโนมัติจะกลับมาเมื่อ GPS เปิด",
            "Lokasi ponsel belum aktif. Absensi otomatis akan lanjut saat GPS hidup.",
            "Hindi naka-on ang Location sa telepono. Magpapatuloy ang auto kapag bumalik ang GPS.",
            "फोनमा स्थान खुलेको छैन। GPS आउनेबित्तिकै स्वत: हाजिरी जारी रहनेछ।",
            "फोन पर लोकेशन चालू नहीं। GPS आने पर ऑटो-हाजिरी जारी रहेगी।");

        add("noPermTitle",
            "Thiếu quyền GPS", "Missing GPS permission", "GPS 권한 없음", "GPS権限不足",
            "缺少GPS权限", "GPS ခွင့်ပြုချက် မရှိ", "ไม่มีสิทธิ์ GPS", "Tidak ada izin GPS",
            "Walang GPS permission", "GPS अनुमति छैन", "GPS अनुमति नहीं");

        add("noPermBody",
            "Ứng dụng chưa có quyền Vị trí luôn cho phép. Hãy cấp quyền để GPS chạy nền.",
            "App doesn't have Always-Allow Location permission. Grant it so GPS runs in background.",
            "앱에 항상 허용 위치 권한이 없습니다. 백그라운드 GPS를 위해 권한을 부여하십시오.",
            "アプリに常に許可の位置権限がありません。バックグラウンドGPSのため許可してください。",
            "应用没有始终允许位置权限。请授予权限以便后台GPS运行。",
            "အက်ပ်တွင် Always-Allow Location ခွင့်ပြုချက် မရှိ။ နောက်ခံ GPS အတွက် ပေးပါ။",
            "แอปไม่มีสิทธิ์ Location แบบอนุญาตเสมอ ให้สิทธิ์เพื่อให้ GPS ทำงานพื้นหลัง",
            "Aplikasi tidak punya izin Lokasi Selalu Izinkan. Berikan izin agar GPS jalan di latar.",
            "Walang Always-Allow Location ang app. Bigyan ng pahintulot para tumakbo sa background.",
            "एपलाई सधैं स्थान अनुमति छैन। पृष्ठभूमि GPS का लागि अनुमति दिनुस्।",
            "ऐप को हमेशा-स्थान अनुमति नहीं। बैकग्राउंड GPS के लिए अनुमति दें।");

        // ───── Smart attendance states ─────
        add("smartFallbackGps",
            "Smart fallback (native): GPS theo dõi vùng công ty",
            "Smart fallback (native): GPS tracking work zone",
            "Smart fallback (native): GPS로 회사 추적",
            "Smartフォールバック (native): GPSで会社追跡",
            "Smart 后备 (native): GPS追踪工作区",
            "Smart fallback (native): GPS ဖြင့် အလုပ်နေရာ ခြေရာခံ",
            "Smart fallback (native): GPS ติดตามที่ทำงาน",
            "Smart fallback (native): GPS lacak kantor",
            "Smart fallback (native): GPS sinusundan ang trabaho",
            "Smart fallback (native): GPS ले कार्यालय ट्र्याक",
            "Smart fallback (native): GPS कार्यालय ट्रैक");

        add("smartJsGpsActive",
            "Smart Attendance (JS): GPS + Wi-Fi/BTS",
            "Smart Attendance (JS): GPS + Wi-Fi/BTS",
            "Smart Attendance (JS): GPS + Wi-Fi/BTS",
            "Smart Attendance (JS): GPS + Wi-Fi/BTS",
            "智能考勤 (JS): GPS + Wi-Fi/BTS",
            "Smart Attendance (JS): GPS + Wi-Fi/BTS",
            "Smart Attendance (JS): GPS + Wi-Fi/BTS",
            "Smart Attendance (JS): GPS + Wi-Fi/BTS",
            "Smart Attendance (JS): GPS + Wi-Fi/BTS",
            "Smart Attendance (JS): GPS + Wi-Fi/BTS",
            "Smart Attendance (JS): GPS + Wi-Fi/BTS");

        add("smartFallbackWorkWifi",
            "Smart fallback: Wi-Fi công ty → tự chấm vào ca",
            "Smart fallback: Work Wi-Fi → auto check-in",
            "Smart fallback: 회사 Wi-Fi → 자동 출근",
            "Smartフォールバック: 会社Wi-Fi → 自動出勤",
            "Smart 后备: 公司Wi-Fi → 自动签到",
            "Smart fallback: ကုမ္ပဏီ Wi-Fi → အလိုအလျောက် ဝင်",
            "Smart fallback: Wi-Fi บริษัท → เช็คอินอัตโนมัติ",
            "Smart fallback: Wi-Fi kantor → masuk otomatis",
            "Smart fallback: Wi-Fi trabaho → auto time-in",
            "Smart fallback: कम्पनी Wi-Fi → स्वत: भित्र",
            "Smart fallback: कंपनी Wi-Fi → स्वत: चेक-इन");

        add("smartFallbackHomeWifi",
            "Smart fallback: Wi-Fi nhà → tự chấm ra ca",
            "Smart fallback: Home Wi-Fi → auto check-out",
            "Smart fallback: 집 Wi-Fi → 자동 퇴근",
            "Smartフォールバック: 自宅Wi-Fi → 自動退勤",
            "Smart 后备: 家Wi-Fi → 自动签退",
            "Smart fallback: အိမ် Wi-Fi → အလိုအလျောက် ထွက်",
            "Smart fallback: Wi-Fi บ้าน → เช็คเอาท์อัตโนมัติ",
            "Smart fallback: Wi-Fi rumah → keluar otomatis",
            "Smart fallback: Wi-Fi bahay → auto time-out",
            "Smart fallback: घर Wi-Fi → स्वत: बाहिर",
            "Smart fallback: घर Wi-Fi → स्वत: चेक-आउट");

        add("smartFallbackWaiting",
            "Smart fallback: chờ tín hiệu Wi-Fi hoặc GPS",
            "Smart fallback: waiting for Wi-Fi or GPS signal",
            "Smart fallback: Wi-Fi 또는 GPS 신호 대기 중",
            "Smartフォールバック: Wi-FiまたはGPS信号待機中",
            "Smart 后备: 等待Wi-Fi或GPS信号",
            "Smart fallback: Wi-Fi သို့မဟုတ် GPS အချက်ပြ စောင့်",
            "Smart fallback: รอสัญญาณ Wi-Fi หรือ GPS",
            "Smart fallback: menunggu sinyal Wi-Fi atau GPS",
            "Smart fallback: naghihintay ng Wi-Fi o GPS signal",
            "Smart fallback: Wi-Fi वा GPS संकेत प्रतीक्षा",
            "Smart fallback: Wi-Fi या GPS संकेत प्रतीक्षा");

        add("jsHandling",
            "Smart Attendance (JS) đang quyết định IN/OUT",
            "Smart Attendance (JS) is deciding IN/OUT",
            "Smart Attendance (JS)가 IN/OUT 결정 중",
            "Smart Attendance (JS) がIN/OUTを判定中",
            "智能考勤 (JS) 正在决定签到/签退",
            "Smart Attendance (JS) သည် IN/OUT ဆုံးဖြတ်နေသည်",
            "Smart Attendance (JS) กำลังตัดสิน IN/OUT",
            "Smart Attendance (JS) sedang memutuskan IN/OUT",
            "Smart Attendance (JS) nagpapasya ng IN/OUT",
            "Smart Attendance (JS) ले IN/OUT निर्णय गर्दै",
            "Smart Attendance (JS) IN/OUT तय कर रहा है");

        add("pausedWorkWifi",
            "Smart Attendance: Wi-Fi công ty đang hoạt động - GPS tạm dừng",
            "Smart Attendance: work Wi-Fi active - GPS paused",
            "Smart Attendance: 회사 Wi-Fi 활성 - GPS 일시정지",
            "Smart Attendance: 会社Wi-Fi有効 - GPS一時停止",
            "智能考勤: 公司Wi-Fi活动 - GPS暂停",
            "Smart Attendance: ကုမ္ပဏီ Wi-Fi သုံးနေ - GPS ရပ်ထား",
            "Smart Attendance: Wi-Fi บริษัททำงาน - GPS หยุดชั่วคราว",
            "Smart Attendance: Wi-Fi kantor aktif - GPS dijeda",
            "Smart Attendance: aktibo ang work Wi-Fi - GPS naka-pause",
            "Smart Attendance: कम्पनी Wi-Fi सक्रिय - GPS रोकिएको",
            "Smart Attendance: कंपनी Wi-Fi सक्रिय - GPS रुका");

        add("pausedHomeSignal",
            "Smart Attendance: tín hiệu nhà đang hoạt động - GPS tạm dừng",
            "Smart Attendance: home signal active - GPS paused",
            "Smart Attendance: 집 신호 활성 - GPS 일시정지",
            "Smart Attendance: 自宅信号有効 - GPS一時停止",
            "智能考勤: 家庭信号活动 - GPS暂停",
            "Smart Attendance: အိမ်အချက်ပြ သုံးနေ - GPS ရပ်ထား",
            "Smart Attendance: สัญญาณบ้านทำงาน - GPS หยุดชั่วคราว",
            "Smart Attendance: sinyal rumah aktif - GPS dijeda",
            "Smart Attendance: aktibo ang home signal - GPS naka-pause",
            "Smart Attendance: घर संकेत सक्रिय - GPS रोकिएको",
            "Smart Attendance: घर संकेत सक्रिय - GPS रुका");

        add("pausedWifiBts",
            "Smart Attendance: Wi-Fi/BTS đang hoạt động - GPS tạm dừng",
            "Smart Attendance: Wi-Fi/BTS active - GPS paused",
            "Smart Attendance: Wi-Fi/BTS 활성 - GPS 일시정지",
            "Smart Attendance: Wi-Fi/BTS有効 - GPS一時停止",
            "智能考勤: Wi-Fi/BTS活动 - GPS暂停",
            "Smart Attendance: Wi-Fi/BTS သုံးနေ - GPS ရပ်ထား",
            "Smart Attendance: Wi-Fi/BTS ทำงาน - GPS หยุดชั่วคราว",
            "Smart Attendance: Wi-Fi/BTS aktif - GPS dijeda",
            "Smart Attendance: aktibo ang Wi-Fi/BTS - GPS naka-pause",
            "Smart Attendance: Wi-Fi/BTS सक्रिय - GPS रोकिएको",
            "Smart Attendance: Wi-Fi/BTS सक्रिय - GPS रुका");

        // ───── Auto check-in / check-out ─────
        add("checkinNotifTitle",
            "✅ Đã vào ca", "✅ Clocked In", "✅ 출근", "✅ 出勤", "✅ 上班",
            "✅ ဝင်", "✅ เข้างาน", "✅ Masuk", "✅ Time In", "✅ भित्रियो", "✅ प्रवेश");

        add("checkoutNotifTitle",
            "🏁 Đã ra ca", "🏁 Clocked Out", "🏁 퇴근", "🏁 退勤", "🏁 下班",
            "🏁 ထွက်", "🏁 ออกงาน", "🏁 Keluar", "🏁 Time Out", "🏁 बाहिरियो", "🏁 बाहर");

        // {0} = timeStr, {1} = method label
        add("checkinBodyWifi",
            "Chấm vào ca lúc {0} (Wi-Fi công ty tự động)",
            "Clocked in at {0} (auto work Wi-Fi)",
            "{0} 출근 (자동 회사 Wi-Fi)",
            "{0} に出勤 (自動会社Wi-Fi)",
            "{0} 上班打卡 (自动公司Wi-Fi)",
            "{0} တွင် ဝင် (ကုမ္ပဏီ Wi-Fi အလိုအလျောက်)",
            "เข้างาน {0} (Wi-Fi บริษัทอัตโนมัติ)",
            "Masuk pukul {0} (Wi-Fi kantor otomatis)",
            "Nag-time in {0} (auto work Wi-Fi)",
            "{0} मा भित्रिनुभयो (कम्पनी Wi-Fi स्वत:)",
            "{0} पर प्रवेश (कंपनी Wi-Fi स्वत:)");

        add("checkinBodyGps",
            "Chấm công vào ca lúc {0} (GPS tự động)",
            "Clocked in at {0} (auto GPS)",
            "{0} 출근 (자동 GPS)",
            "{0} に出勤 (自動GPS)",
            "{0} 上班打卡 (自动GPS)",
            "{0} တွင် ဝင် (GPS အလိုအလျောက်)",
            "เข้างาน {0} (GPS อัตโนมัติ)",
            "Masuk pukul {0} (GPS otomatis)",
            "Nag-time in {0} (auto GPS)",
            "{0} मा भित्रिनुभयो (GPS स्वत:)",
            "{0} पर प्रवेश (GPS स्वत:)");

        add("checkoutBodyWifi",
            "Chấm ra ca lúc {0} (Wi-Fi nhà tự động)",
            "Clocked out at {0} (auto home Wi-Fi)",
            "{0} 퇴근 (자동 집 Wi-Fi)",
            "{0} に退勤 (自動自宅Wi-Fi)",
            "{0} 下班打卡 (自动家Wi-Fi)",
            "{0} တွင် ထွက် (အိမ် Wi-Fi အလိုအလျောက်)",
            "ออกงาน {0} (Wi-Fi บ้านอัตโนมัติ)",
            "Keluar pukul {0} (Wi-Fi rumah otomatis)",
            "Nag-time out {0} (auto home Wi-Fi)",
            "{0} मा बाहिर (घर Wi-Fi स्वत:)",
            "{0} पर बाहर (घर Wi-Fi स्वत:)");

        add("checkoutBodyGps",
            "Chấm công ra ca lúc {0} (GPS tự động)",
            "Clocked out at {0} (auto GPS)",
            "{0} 퇴근 (자동 GPS)",
            "{0} に退勤 (自動GPS)",
            "{0} 下班打卡 (自动GPS)",
            "{0} တွင် ထွက် (GPS အလိုအလျောက်)",
            "ออกงาน {0} (GPS อัตโนมัติ)",
            "Keluar pukul {0} (GPS otomatis)",
            "Nag-time out {0} (auto GPS)",
            "{0} मा बाहिर (GPS स्वत:)",
            "{0} पर बाहर (GPS स्वत:)");

        // Update notif sau khi đã chấm: ✅ Đã vào ca HH:MM (Wi-Fi)
        add("notifAfterCheckin",
            "✅ Đã vào ca {0} ({1})",
            "✅ Clocked in {0} ({1})",
            "✅ 출근 {0} ({1})",
            "✅ 出勤 {0} ({1})",
            "✅ 上班 {0} ({1})",
            "✅ ဝင် {0} ({1})",
            "✅ เข้างาน {0} ({1})",
            "✅ Masuk {0} ({1})",
            "✅ Time In {0} ({1})",
            "✅ भित्रियो {0} ({1})",
            "✅ प्रवेश {0} ({1})");

        add("notifAfterCheckout",
            "🏁 Đã ra ca {0} ({1})",
            "🏁 Clocked out {0} ({1})",
            "🏁 퇴근 {0} ({1})",
            "🏁 退勤 {0} ({1})",
            "🏁 下班 {0} ({1})",
            "🏁 ထွက် {0} ({1})",
            "🏁 ออกงาน {0} ({1})",
            "🏁 Keluar {0} ({1})",
            "🏁 Time Out {0} ({1})",
            "🏁 बाहिरियो {0} ({1})",
            "🏁 बाहर {0} ({1})");

        // ───── Skip messages (GPS-only mode) ─────
        add("skipMidCycle",
            "Hôm nay đã vào ca - GPS không chấm vào lại",
            "Already clocked in today - GPS won't re-check-in",
            "오늘 이미 출근 - GPS 재출근 안 함",
            "本日出勤済 - GPSは再打刻しません",
            "今日已签到 - GPS不再签到",
            "ယနေ့ ဝင်ပြီး - GPS မထပ်ဝင်",
            "วันนี้เข้างานแล้ว - GPS ไม่เช็คซ้ำ",
            "Sudah masuk hari ini - GPS tidak ulang",
            "Naka-time in na ngayon - hindi uulit ang GPS",
            "आज भित्रिएको - GPS पुन: नगर्ने",
            "आज प्रवेश हो चुका - GPS दोबारा नहीं");

        add("skipFinishedCycle",
            "Hôm nay đã vào/ra ca - chờ đủ 8 tiếng để vào ca mới",
            "Already done IN/OUT today - wait 8h for new cycle",
            "오늘 출퇴근 완료 - 새 사이클 8시간 대기",
            "本日IN/OUT完了 - 新サイクルまで8時間待機",
            "今日已完成签到/签退 - 等待8小时新周期",
            "ယနေ့ IN/OUT ပြီး - စက်ဝန်းသစ်အတွက် 8 နာရီ စောင့်",
            "เข้า/ออกแล้ววันนี้ - รอ 8 ชม. รอบใหม่",
            "Sudah IN/OUT hari ini - tunggu 8 jam siklus baru",
            "Tapos na ang IN/OUT - hintayin ang 8h bagong cycle",
            "आज IN/OUT पूरा - 8 घण्टा प्रतीक्षा",
            "आज IN/OUT पूरा - 8 घंटे प्रतीक्षा");

        add("skipUnder8h",
            "Chưa đủ 8 tiếng từ lần ra ca gần nhất - bỏ qua vào ca GPS",
            "Less than 8h since last clock-out - skip GPS check-in",
            "마지막 퇴근부터 8시간 미만 - GPS 출근 건너뜀",
            "前回退勤から8時間未満 - GPS出勤スキップ",
            "距上次签退不足8小时 - 跳过GPS签到",
            "နောက်ဆုံးထွက်ပြီးနောက် 8 နာရီ မပြည့်သေး - GPS ဝင်ကို ကျော်",
            "ผ่านไปไม่ถึง 8 ชม. หลังออก - ข้าม GPS เข้างาน",
            "Kurang 8 jam sejak keluar terakhir - lewati GPS masuk",
            "Wala pang 8h mula sa huling time out - laktawan ang GPS time-in",
            "अन्तिम बाहिरबाट 8 घण्टा भएको छैन - GPS भित्र छाड्",
            "अंतिम बाहर से 8 घंटे नहीं - GPS प्रवेश छोड़");

        // {0} = phút
        add("scheduleCheckinNow",
            "Đã vào vùng công ty - đang tự vào ca GPS",
            "Entered work zone - auto GPS check-in now",
            "회사 구역 진입 - GPS 자동 출근 진행 중",
            "会社エリア進入 - GPSで自動出勤中",
            "进入公司区域 - GPS自动签到中",
            "ကုမ္ပဏီနယ်ပယ်သို့ ဝင် - GPS အလိုအလျောက် ဝင်",
            "เข้าเขตบริษัท - GPS เช็คอินอัตโนมัติ",
            "Masuk area kantor - GPS auto masuk",
            "Pumasok sa work zone - auto GPS time-in",
            "कम्पनी क्षेत्रमा प्रवेश - GPS स्वत: भित्र",
            "कंपनी क्षेत्र में प्रवेश - GPS स्वत: चेक-इन");

        add("scheduleCheckinWait",
            "Đã vào vùng công ty - chờ {0} phút để tự vào ca GPS",
            "Entered work zone - waiting {0} min for auto GPS check-in",
            "회사 구역 진입 - {0}분 후 GPS 자동 출근",
            "会社エリア進入 - GPS自動出勤まで{0}分",
            "进入公司区域 - 等待{0}分钟自动GPS签到",
            "ကုမ္ပဏီနယ်ပယ်သို့ ဝင် - GPS အလိုအလျောက် ဝင်ရန် {0} မိနစ် စောင့်",
            "เข้าเขตบริษัท - รอ {0} นาที เพื่อ GPS เช็คอิน",
            "Masuk area kantor - tunggu {0} mnt untuk GPS masuk",
            "Pumasok sa work zone - hintayin {0} min para GPS time-in",
            "कम्पनी क्षेत्रमा प्रवेश - GPS स्वत: भित्र {0} मिनेट",
            "कंपनी क्षेत्र में प्रवेश - {0} मिनट GPS चेक-इन");

        add("skipGpsOnlyIn",
            "Bỏ qua GPS-only IN; JS Smart Attendance đang xử lý",
            "Skip GPS-only IN; JS Smart Attendance handling",
            "GPS-only IN 건너뜀; JS Smart Attendance가 처리 중",
            "GPS-only INをスキップ; JS Smart Attendance が処理",
            "跳过仅GPS签到; JS Smart Attendance处理中",
            "GPS-only IN ကို ကျော် - JS Smart Attendance ကိုင်ထား",
            "ข้าม GPS-only IN; JS Smart Attendance จัดการ",
            "Lewati GPS-only IN; ditangani JS Smart Attendance",
            "Laktawan ang GPS-only IN; JS Smart Attendance ang humahawak",
            "GPS-only IN छाड्; JS Smart Attendance ले गर्दै",
            "GPS-only IN छोड़; JS Smart Attendance संभाल रहा");

        add("skipGpsOnlyOut",
            "Bỏ qua GPS-only OUT; JS Smart Attendance đang xử lý",
            "Skip GPS-only OUT; JS Smart Attendance handling",
            "GPS-only OUT 건너뜀; JS Smart Attendance가 처리 중",
            "GPS-only OUTをスキップ; JS Smart Attendance が処理",
            "跳过仅GPS签退; JS Smart Attendance处理中",
            "GPS-only OUT ကို ကျော် - JS Smart Attendance ကိုင်ထား",
            "ข้าม GPS-only OUT; JS Smart Attendance จัดการ",
            "Lewati GPS-only OUT; ditangani JS Smart Attendance",
            "Laktawan ang GPS-only OUT; JS Smart Attendance ang humahawak",
            "GPS-only OUT छाड्; JS Smart Attendance ले गर्दै",
            "GPS-only OUT छोड़; JS Smart Attendance संभाल रहा");

        add("skipOutGps",
            "GPS vẫn trong vùng hoặc chưa đủ chắc chắn — bỏ qua ra ca",
            "GPS still inside zone or not confident — skip check-out",
            "GPS가 아직 구역 내부이거나 불확실 — 퇴근 건너뜀",
            "GPSがまだエリア内か不確実 — 退勤スキップ",
            "GPS仍在区域内或不确定 — 跳过签退",
            "GPS သည် နယ်ပယ်အတွင်း သို့မဟုတ် မသေချာ — ထွက်ကို ကျော်",
            "GPS ยังอยู่ในเขตหรือไม่แน่ใจ — ข้ามออกงาน",
            "GPS masih dalam zona atau belum yakin — lewati keluar",
            "Nasa loob pa ang GPS o di sigurado — laktawan ang time-out",
            "GPS अझै क्षेत्रभित्र वा अनिश्चित — बाहिर छाड्",
            "GPS अभी क्षेत्र में या अनिश्चित — बाहर छोड़");

        add("skipScheduleOut",
            "GPS chưa xác nhận vẫn ở công ty - chưa ra ca theo lịch",
            "GPS hasn't confirmed still at work - schedule OUT skipped",
            "GPS가 회사에 있음을 아직 확인 못함 - 일정 OUT 건너뜀",
            "GPSがまだ会社にいることを確認できず - 予定退勤スキップ",
            "GPS未确认仍在公司 - 跳过定时签退",
            "GPS က ကုမ္ပဏီတွင် ရှိနေသေးကြောင်း မအတည်ပြုနိုင် - ထွက်ကို ကျော်",
            "GPS ยังไม่ยืนยันยังอยู่บริษัท - ข้ามออกตามตาราง",
            "GPS belum konfirmasi masih di kantor - lewati keluar terjadwal",
            "Hindi pa nakukumpirma ng GPS na nasa trabaho - laktawan ang sched OUT",
            "GPS ले कार्यालयमा छ भनी पुष्टि गरेन - तालिका OUT छाड्",
            "GPS ने अभी कार्यालय की पुष्टि नहीं की - तय OUT छोड़");

        add("scheduleOutDone",
            "🏁 Đã ra ca theo lịch {0}",
            "🏁 Schedule clocked out at {0}",
            "🏁 일정 퇴근 {0}",
            "🏁 予定退勤 {0}",
            "🏁 按计划签退 {0}",
            "🏁 အချိန်ဇယားအတိုင်း ထွက် {0}",
            "🏁 ออกตามตาราง {0}",
            "🏁 Keluar terjadwal {0}",
            "🏁 Naka-time out sa schedule {0}",
            "🏁 तालिकाअनुसार बाहिर {0}",
            "🏁 तय बाहर {0}");

        // ───── Kill notification (khi service bị tắt) ─────
        add("killNotifTitle",
            "⚠️ GPS Chấm Công Đã Tắt", "⚠️ Attendance GPS Stopped", "⚠️ 출퇴근 GPS 중지됨",
            "⚠️ 勤怠GPS停止", "⚠️ 考勤GPS已停止", "⚠️ Attendance GPS ရပ်ပြီး",
            "⚠️ GPS เช็คอินหยุด", "⚠️ GPS absensi berhenti", "⚠️ Naka-stop ang GPS",
            "⚠️ हाजिरी GPS रोकियो", "⚠️ हाजिरी GPS रुक गया");

        add("killNotifBody",
            "GPS chấm công đã tắt. Nhấn để mở lại app và kích hoạt GPS.",
            "Attendance GPS is off. Tap to open the app and re-enable GPS.",
            "출퇴근 GPS가 꺼졌습니다. 앱을 열어 GPS를 다시 활성화하려면 탭하세요.",
            "勤怠GPSがオフです。アプリを開いてGPSを再開するにはタップ。",
            "考勤GPS已关闭。点击打开应用并重新启用GPS。",
            "Attendance GPS ပိတ်ထား။ အက်ပ်ဖွင့်ပြီး GPS ပြန်ဖွင့်ရန် နှိပ်ပါ။",
            "GPS เช็คอินปิดอยู่ แตะเพื่อเปิดแอปและเปิด GPS อีก",
            "GPS absensi mati. Ketuk untuk buka aplikasi dan aktifkan GPS.",
            "Naka-off ang GPS. Pindutin para buksan ang app at i-on muli ang GPS.",
            "हाजिरी GPS बन्द। एप खोल्न र GPS पुनः सक्रिय गर्न ट्याप गर्नुस्।",
            "हाजिरी GPS बंद। ऐप खोलें और GPS फिर चालू करने के लिए टैप करें।");

        // Notification channel name + description
        add("channelAlert",
            "Cảnh báo GPS", "GPS Alert", "GPS 경보", "GPSアラート", "GPS警报",
            "GPS သတိပေး", "เตือน GPS", "Peringatan GPS", "GPS Alert",
            "GPS चेतावनी", "GPS अलर्ट");

        add("channelAlertDesc",
            "Cảnh báo khi GPS chấm công bị gián đoạn",
            "Alert when attendance GPS is interrupted",
            "출퇴근 GPS 중단 시 경보",
            "勤怠GPSが中断された際のアラート",
            "考勤GPS中断时的警报",
            "Attendance GPS ပြတ်တောက်လျှင် သတိပေး",
            "เตือนเมื่อ GPS เช็คอินขัดข้อง",
            "Peringatan saat GPS absensi terganggu",
            "Alerto kapag naputol ang GPS",
            "हाजिरी GPS अवरुद्ध हुँदा चेतावनी",
            "हाजिरी GPS रुकने पर अलर्ट");

        // Foreground notif title (always visible)
        add("fgNotifTitle",
            "Chấm Công Pro - GPS", "ChamCongPro - GPS", "ChamCongPro - GPS",
            "ChamCongPro - GPS", "ChamCongPro - GPS", "ChamCongPro - GPS",
            "ChamCongPro - GPS", "ChamCongPro - GPS", "ChamCongPro - GPS",
            "ChamCongPro - GPS", "ChamCongPro - GPS");
    }

    /** Đọc ngôn ngữ user (default vi) */
    public static String getLang(Context ctx) {
        try {
            SharedPreferences p = ctx.getSharedPreferences(NativeGpsService.GPS_PREFS, Context.MODE_PRIVATE);
            String l = p.getString("userLang", "vi");
            return (l != null && l.length() > 0) ? l : "vi";
        } catch (Exception e) { return "vi"; }
    }

    /** Lấy text đã dịch theo ngôn ngữ user, fallback về vi */
    public static String tr(Context ctx, String key) {
        Map<String, String> m = TR.get(key);
        if (m == null) return key;
        String lang = getLang(ctx);
        String v = m.get(lang);
        if (v != null) return v;
        v = m.get("vi");
        return v != null ? v : key;
    }

    /** Lấy text đã dịch + thay placeholder {0}, {1}... */
    public static String tr(Context ctx, String key, Object... args) {
        String s = tr(ctx, key);
        if (args == null || args.length == 0) return s;
        for (int i = 0; i < args.length; i++) {
            s = s.replace("{" + i + "}", String.valueOf(args[i]));
        }
        return s;
    }
}
