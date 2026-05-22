# 📁 CHẤM CÔNG PRO — CẤU TRÚC 5 FILE

```
📁 ChamCongPro/                ← BẠN EDIT Ở ĐÂY (5 file riêng)
├── index.html                 ← Chỉ HTML
├── style.css                  ← Chỉ CSS
├── app.js                     ← Logic chính
├── checkin.js                 ← GPS + chấm công  ⭐ ĐÃ NÂNG CẤP V3
├── utils.js                   ← Tiện ích
├── build.py                   ← Script gộp file
└── dist/
    └── ChamCongPro.html       ← File GỘP để mở browser test (KHÔNG edit)
```

## 🚀 CÁCH SỬ DỤNG

### 1. Edit code
Chỉ edit 5 file nguồn (`index.html`, `style.css`, `app.js`, `checkin.js`, `utils.js`).

### 2. Build
```bash
python3 build.py
```

### 3. Test
Mở file `dist/ChamCongPro.html` trong browser.

---

## ⭐ GPS v3.0 — NÂNG CẤP TOÀN DIỆN

### ✨ 10 cải tiến chính:

| # | Tính năng | Vị trí trong checkin.js |
|---|-----------|------------------------|
| 1 | **Adaptive Polling** (3-60s tùy vị trí) | `_calcAdaptivePollMs()` |
| 2 | **GPS Trail Logging** (audit & debug) | `_addGpsTrail()`, `getGpsTrail()` |
| 3 | **Direction Detection** (vector di chuyển) | `_detectDirection()` |
| 4 | **Graceful Degradation** (4 mức accuracy) | `_classifyAccuracy()` |
| 5 | **Multi-Job GPS** (main/sub riêng biệt) | `setActiveGpsJob()`, `saveGpsLocationForJob()` |
| 6 | **Battery Optimization** (3 profiles) | `setGpsBatteryProfile()` |
| 7 | **Background Service** (Capacitor) | `startBackgroundGps()` |
| 8 | **Polygon Boundary** (Ray Casting) | `isInsidePolygon()` |
| 9 | **Error Recovery** (auto retry) | `_handleGpsError()` |
| 10 | **Velocity-based Confirm** (giảm debounce) | trong `_processGpsPosition()` |

### 📊 Chế độ pin (Battery Profiles)

| Profile | Poll Multiplier | High Accuracy | Max Acc |
|---------|----------------|---------------|---------|
| `NORMAL` | 1× | ✅ | 80m |
| `LOW_POWER` | 3× | ❌ | 150m |
| `CRITICAL` | 6× | ❌ | 200m |

### 🎯 Adaptive Polling Schedule

| Trạng thái | Poll interval |
|-----------|---------------|
| Vùng đệm (R - R+25m) | **3 giây** ⚡ CRITICAL |
| Gần boundary (±100m) | 5 giây |
| Bên trong stable | 20 giây |
| Ngoài < 500m | 15 giây |
| Xa > 500m | 60 giây |

### 🔍 Phân loại Accuracy

| Loại | Range | Hành vi |
|------|-------|---------|
| `TRUSTED` | ≤ 30m | Giảm debounce nếu hướng đúng |
| `NORMAL` | 31-80m | Dùng bình thường |
| `LOG_ONLY` | 81-200m | Lưu trail nhưng không decide |
| `REJECT` | > 200m | Bỏ qua hoàn toàn |

---

## 🛠️ Public API (window.gpsV3)

```javascript
// Multi-location
window.gpsV3.setActiveJob('main');           // hoặc 'sub'
window.gpsV3.saveLocationForJob('sub', lat, lng, radius);
window.gpsV3.getActiveLocation();

// Battery
window.gpsV3.setBatteryProfile('LOW_POWER'); // NORMAL/LOW_POWER/CRITICAL

// Trail / Audit
window.gpsV3.getTrail();                     // hôm nay
window.gpsV3.getTrail(new Date('2026-04-29')); // ngày khác

// Polygon
window.gpsV3.isInsidePolygon(lat, lng, [{lat, lng}, ...]);

// Background
window.gpsV3.startBackground();
window.gpsV3.stopBackground();

// Stats & Restart
window.gpsV3.getStats();                     // {enabled, pollMs, errors, ...}
window.gpsV3.restart();
```

---

## 📋 GPS Trail Format

Mỗi entry trong trail có cấu trúc:

```javascript
{
  timestamp: '2026-04-30T14:23:45.123Z',
  type: 'POLL' | 'STATE_CHANGE' | 'AUTO_CHECKIN' | 'AUTO_CHECKOUT' | 'ERROR',
  lat, lng, acc,
  accClass: 'TRUSTED' | 'NORMAL' | 'LOG_ONLY' | 'REJECT',
  distance: 145.2,                  // mét
  speed: 1.4,                       // m/s
  direction: 'IN' | 'OUT' | 'STILL',
  pollMs: 5000,
  battery: 'NORMAL',
  action: 'CONFIRMED_IN' | 'DEBOUNCE_PENDING' | 'STABLE' | 'BUFFER_ZONE' | 'REJECTED' | 'LOG_ONLY',
  shortcut: 'DIRECTION_IN'          // nếu được giảm debounce do hướng đi
}
```

---

## 🐛 Debug

Trong panel GPS settings có 3 thẻ mới:

1. **🔋 Chế độ pin** — Chuyển giữa Normal/Tiết kiệm/Tối thiểu
2. **📊 Trạng thái GPS** — Xem stats real-time (poll interval, errors, history...)
3. **📍 GPS Trail** — Xem 20 entry gần nhất hôm nay

---

## ⚠️ Lưu ý

- **Background Service** yêu cầu cài `@capacitor-community/background-geolocation` — nếu chưa cài sẽ tự fallback về foreground polling.
- **Battery API** chỉ có trên Chrome/Edge — Safari/Firefox sẽ giữ profile NORMAL.

## 🐛 Bug Fixes (so với file gốc)

### Fix 1: PDF Export Function bị cắt cụt
File gốc `preview__1_.html` có lỗi nghiêm trọng tại function `window.doExport` (PDF mode) trong PATCH v2.2.3:
- Template HTML literal **không có dấu nháy đóng** `'`
- Thiếu logic mở popup window và write document
- Function không có `}` đóng → IIFE không hoàn chỉnh

**Đã sửa**: Đóng đúng cú pháp + thêm `window.open()` + `document.write()` + tách `<script>` thành `<sc'+'ript>` để tránh xung đột với script bao ngoài.

### Fix 2: `init()` được gọi trước khi `loadGpsData` được define
Khi tách thành 5 file riêng, `init()` ở cuối `app.js` cố gắng gọi `loadGpsData` (ở `checkin.js`) nhưng `checkin.js` chưa load.

**Đã sửa**: `init()` được defer đến `DOMContentLoaded` để đảm bảo tất cả scripts đã load.

### ✅ Test results
- 0 errors, 0 warnings khi load file
- Tất cả 5 script blocks pass syntax check
- GPS v3 API: `setActiveJob`, `setBatteryProfile`, `getTrail`, `isInsidePolygon`, `getStats` đều hoạt động
- Adaptive polling, accuracy classification, polygon detection, Haversine distance đều cho kết quả đúng
- Multi-job GPS, trail save/load roundtrip OK
