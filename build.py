#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
═══════════════════════════════════════════════════════════════════════════════
build.py — SCRIPT GỘP FILE CHO CHẤM CÔNG PRO
═══════════════════════════════════════════════════════════════════════════════

📌 CÁCH SỬ DỤNG:
   $ python build.py
   → Tạo file dist/ChamCongPro.html (file đơn lẻ để mở browser test / deploy)

📌 CẤU TRÚC FILE NGUỒN (32 module — tên tiếng Việt theo 3 nhóm):
   index.html / style.css / utils.js / debug-monitor.js

   ud-* (ứng dụng — 14 module):
     ud-ngay-le.js       — Dữ liệu ngày lễ quốc gia 2025-2026
     ud-quy-luong.js     — PAYROLL_RULES + time helpers (pGio, soGio…)
     ud-tinh-thue.js     — TAX_RULES + tax engine 11 quốc gia + shim
     ud-luu-tru.js       — State globals + đọc/ghi localStorage
     ud-cai-dat.js       — Onboarding core (hướng dẫn ban đầu)
     ud-ca-lam.js        — Quản lý ca + rotation + drag-drop
     ud-nghi-gio.js      — Onboarding step 4 (nghỉ giữa giờ)
     ud-dieu-huong.js    — Điều hướng màn hình + quản lý panels
     ud-dong-ho.js       — Đồng hồ realtime + kiểu trả lương
     ud-panel-ngay.js    — Panel chi tiết ngày + popup chào buổi sáng
     ud-ban-dich.js      — Dữ liệu bản dịch (UI_STR + TRAN 11 ngôn ngữ)
     ud-ap-ngon-ngu.js   — Áp dụng ngôn ngữ vào UI (applyTranslations)
     ud-dong-bo.js       — Đồng bộ ngôn ngữ GPS + background status
     ud-khoi-dong.js     — Khởi động app

   cc-* (chấm công — 11 module):
     cc-thu-cong.js      — Chấm công thủ công + thống kê + tính lương
     cc-lich.js          — Lịch tháng + xuất Excel
     cc-giao-dien.js     — Giao diện theme + màu lịch
     cc-thong-bao.js     — Quản lý thông báo
     cc-gps-tien-ich.js  — GPS helpers + native config + position
     cc-gps-engine.js    — GPS constants + polygon + cycle guard
     cc-gps-dieu-khien.js— Banner + start/stop GPS + panel UI
     cc-viec-phu.js      — Job phụ (sub job)
     cc-xuat-pdf.js      — Xuất file PDF
     cc-cap-nhat-1.js    — Cập nhật v2.2.2, v2.2.3, v2.2.4
     cc-cap-nhat-2.js    — Cập nhật v2.2.5, v2.2.7

   td-* (tự động — 7 module):
     td-cot-loi.js       — Hằng số + state machine data + persistence
     td-tin-hieu.js      — Đọc tín hiệu WiFi/GPS + so khớp hồ sơ
     td-hanh-dong.js     — Auto check-in/check-out actions
     td-trang-thai.js    — GPS control + polling + state machine
     td-giao-dien.js     — Cập nhật giao diện + render UI
     td-ho-so.js         — Logging + hồ sơ nhà/công ty + render
     td-khoi-tao.js      — Enable/disable + khởi tạo + expose global

   - KHÔNG sửa dist/ChamCongPro.html (sẽ bị overwrite mỗi lần build)

═══════════════════════════════════════════════════════════════════════════════
"""

import os
import sys
from pathlib import Path

ROOT = Path(__file__).parent.resolve()
DIST = ROOT / 'dist'
OUTPUT = DIST / 'ChamCongPro.html'
SRC = ROOT / 'src'

# File đơn lẻ
SINGLE_FILES = {
    'html'  : ROOT / 'index.html',
    'css'   : ROOT / 'style.css',
    'utils' : ROOT / 'utils.js',
    'debug' : ROOT / 'debug-monitor.js',
}

# Modules theo thứ tự load — phải đúng thứ tự dependency
JS_MODULES = [
    # utils phải load trước (lsGet/lsSet/fmtMoney)
    ROOT / 'utils.js',
    # ud- (ứng dụng) — app core modules
    SRC / 'ud-ngay-le.js',
    SRC / 'ud-quy-luong.js',
    SRC / 'ud-tinh-thue.js',
    SRC / 'ud-luu-tru.js',
    SRC / 'ud-cai-dat.js',
    SRC / 'ud-ca-lam.js',
    SRC / 'ud-nghi-gio.js',
    SRC / 'ud-dieu-huong.js',
    SRC / 'ud-dong-ho.js',
    SRC / 'ud-panel-ngay.js',
    SRC / 'ud-ban-dich.js',
    SRC / 'ud-ap-ngon-ngu.js',
    SRC / 'ud-dong-bo.js',
    SRC / 'ud-khoi-dong.js',
    # cc- (chấm công) — attendance modules
    SRC / 'cc-thu-cong.js',
    SRC / 'cc-lich.js',
    SRC / 'cc-giao-dien.js',
    SRC / 'cc-thong-bao.js',
    SRC / 'cc-gps-tien-ich.js',
    SRC / 'cc-gps-engine.js',
    SRC / 'cc-gps-dieu-khien.js',
    SRC / 'cc-viec-phu.js',
    SRC / 'cc-xuat-pdf.js',
    SRC / 'cc-cap-nhat-1.js',
    SRC / 'cc-cap-nhat-2.js',
    # capacitor-integration.js: bỏ qua trong dist (chỉ dùng trong APK)
    # td- (tự động) — smart attendance modules
    SRC / 'td-cot-loi.js',
    SRC / 'td-tin-hieu.js',
    SRC / 'td-hanh-dong.js',
    SRC / 'td-trang-thai.js',
    SRC / 'td-giao-dien.js',
    SRC / 'td-ho-so.js',
    SRC / 'td-khoi-tao.js',
    # debug
    ROOT / 'debug-monitor.js',
]

# Script tags trong index.html cần được thay thế bằng nội dung inline
SCRIPT_TAGS_TO_INLINE = [
    ('<!-- app.js modules -->', SRC / 'app-holidays.js', 'app-holidays.js'),
    # Các script tags module được xử lý theo nhóm bên dưới
]


def read_file(path: Path) -> str:
    if not path.exists():
        print(f'❌ KHÔNG TÌM THẤY: {path}')
        sys.exit(1)
    return path.read_text(encoding='utf-8')


def concat_modules(paths: list) -> str:
    parts = []
    for p in paths:
        content = read_file(p)
        parts.append(f'/* ── {p.name} ── */\n{content}')
    return '\n'.join(parts)


def build():
    print('═' * 70)
    print('📦 CHẤM CÔNG PRO — BUILD SCRIPT (Modular)')
    print('═' * 70)

    print('\n📖 Đọc file nguồn:')
    html = read_file(SINGLE_FILES['html'])
    css  = read_file(SINGLE_FILES['css'])

    # Đọc + thống kê các module (đã chia nhỏ tiếp ở cấp 2)
    app_modules = [SRC / f for f in [
        'ud-ngay-le.js',
        'ud-quy-luong.js', 'ud-tinh-thue.js',
        'ud-luu-tru.js',
        'ud-cai-dat.js', 'ud-ca-lam.js', 'ud-nghi-gio.js',
        'ud-dieu-huong.js',
        'ud-dong-ho.js', 'ud-panel-ngay.js',
        'ud-ban-dich.js', 'ud-ap-ngon-ngu.js', 'ud-dong-bo.js',
        'ud-khoi-dong.js',
    ]]
    checkin_modules = [SRC / f for f in [
        'cc-thu-cong.js', 'cc-lich.js', 'cc-giao-dien.js',
        'cc-thong-bao.js',
        'cc-gps-tien-ich.js', 'cc-gps-engine.js', 'cc-gps-dieu-khien.js',
        'cc-viec-phu.js', 'cc-xuat-pdf.js',
        'cc-cap-nhat-1.js', 'cc-cap-nhat-2.js',
    ]]
    sa_modules = [SRC / f for f in [
        'td-cot-loi.js', 'td-tin-hieu.js',
        'td-hanh-dong.js', 'td-trang-thai.js',
        'td-giao-dien.js', 'td-ho-so.js',
        'td-khoi-tao.js',
    ]]

    all_modules = app_modules + checkin_modules + sa_modules
    total_lines = 0
    for m in all_modules:
        content = read_file(m)
        lines = content.count('\n')
        total_lines += lines
        print(f'   ✓ {m.name:28s}  {lines:5d} dòng')

    utils_content = read_file(SINGLE_FILES['utils'])
    debug_content = read_file(SINGLE_FILES['debug'])
    print(f'   ✓ {"utils.js":28s}  {utils_content.count(chr(10)):5d} dòng')
    print(f'   ✓ {"debug-monitor.js":28s}  {debug_content.count(chr(10)):5d} dòng')

    print('\n🔧 Gộp file:')

    # 1) Inline CSS
    css_block = f'<style>\n{css}\n</style>'
    if '<link rel="stylesheet" href="style.css">' in html:
        html = html.replace('<link rel="stylesheet" href="style.css">', css_block)
        print('   ✓ Inline style.css')

    # 2) Inline utils.js
    html = html.replace(
        '<script src="utils.js"></script>',
        f'<script>\n{utils_content}\n</script>'
    )
    print('   ✓ Inline utils.js')

    # 3) Inline ud- modules (ứng dụng)
    app_js = concat_modules(app_modules)
    app_block_start = '<!-- ud- (ứng dụng) modules -->'
    app_block_end   = '<!-- cc- (chấm công) modules -->'
    if app_block_start in html and app_block_end in html:
        before = html[:html.index(app_block_start)]
        after  = html[html.index(app_block_end):]
        html = before + f'<script>\n{app_js}\n</script>\n' + after
        print(f'   ✓ Inline {len(app_modules)} ud- modules (ứng dụng)')

    # 4) Inline cc- modules (chấm công)
    checkin_js = concat_modules(checkin_modules)
    checkin_block_start = '<!-- cc- (chấm công) modules -->'
    checkin_block_end   = '<!-- capacitor native bridge -->'
    if checkin_block_start in html and checkin_block_end in html:
        before = html[:html.index(checkin_block_start)]
        after  = html[html.index(checkin_block_end):]
        html = before + f'<script>\n{checkin_js}\n</script>\n' + after
        print(f'   ✓ Inline {len(checkin_modules)} cc- modules (chấm công)')

    # 5) Bỏ qua capacitor (chỉ dùng trong APK)
    cap_tag = '<script src="capacitor-integration.js"></script>'
    if cap_tag in html:
        html = html.replace(f'<!-- capacitor native bridge -->\n{cap_tag}\n', '')
        print('   ✓ Bỏ qua capacitor-integration.js (APK only)')

    # 6) Inline td- modules (tự động)
    sa_js = concat_modules(sa_modules)
    sa_block_start = '<!-- td- (tự động) modules -->'
    sa_block_end   = '<!-- debug (dev only) -->'
    if sa_block_start in html and sa_block_end in html:
        before = html[:html.index(sa_block_start)]
        after  = html[html.index(sa_block_end):]
        html = before + f'<script>\n{sa_js}\n</script>\n' + after
        print(f'   ✓ Inline {len(sa_modules)} td- modules (tự động)')

    # 7) Inline debug-monitor.js
    html = html.replace(
        '<!-- debug (dev only) -->\n<script src="debug-monitor.js"></script>',
        f'<script>\n{debug_content}\n</script>'
    )
    print('   ✓ Inline debug-monitor.js')

    DIST.mkdir(exist_ok=True)
    OUTPUT.write_text(html, encoding='utf-8')
    out_kb = OUTPUT.stat().st_size / 1024
    out_lines = html.count('\n')

    print(f'\n✅ HOÀN TẤT!')
    print(f'   📄 {OUTPUT}')
    print(f'   📊 {out_lines:,} dòng  ({out_kb:,.1f} KB)')
    print(f'\n💡 Mở trong browser:')
    print(f'   file://{OUTPUT}\n')


if __name__ == '__main__':
    build()
