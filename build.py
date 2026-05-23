#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
═══════════════════════════════════════════════════════════════════════════════
build.py — SCRIPT GỘP FILE CHO CHẤM CÔNG PRO
═══════════════════════════════════════════════════════════════════════════════

📌 CÁCH SỬ DỤNG:
   $ python build.py
   → Tạo file dist/ChamCongPro.html (file đơn lẻ để mở browser test / deploy)

📌 CẤU TRÚC FILE NGUỒN (33 module trong src/ + utils + debug):
   index.html / style.css / utils.js / debug-monitor.js

   src/app-*  (14 module):
     app-holidays.js           — Dữ liệu ngày lễ quốc gia
     app-payroll-rules.js      — PAYROLL_RULES + time helpers
     app-payroll-tax.js        — TAX_RULES + tax engine + shim
     app-store.js              — State globals + localStorage
     app-onboarding.js         — Onboarding core
     app-shifts.js             — Quản lý ca + rotation
     app-onboarding-step4.js   — Onboarding step 4 (break time)
     app-navigation.js         — Điều hướng màn hình + panels
     app-ui-time.js            — Đồng hồ + kiểu trả lương
     app-ui-panel.js           — Panel chi tiết ngày + morning popup
     app-i18n-data.js          — UI_STR + TRAN data
     app-i18n-apply.js         — applyTranslations function
     app-i18n-sync.js          — syncGpsV3I18n + syncBgStatusI18n
     app-init.js               — Khởi động app

   src/checkin-*  (11 module):
     checkin-manual.js         — Chấm công thủ công
     checkin-calendar.js       — Lịch + export Excel
     checkin-theme.js          — Theme UI + màu lịch
     checkin-notif.js          — Thông báo
     checkin-gps-helpers.js    — GPS helpers + native + position
     checkin-gps-engine.js     — GPS constants + polygon + cycle guard
     checkin-gps-control.js    — Banner + start/stop GPS + UI
     checkin-subjob.js         — Job phụ
     checkin-pdf.js            — PDF export
     checkin-patches-1.js      — Patches v2.2.2 + v2.2.3 + v2.2.4
     checkin-patches-2.js      — Patches v2.2.5 + v2.2.7

   src/sa-*  (7 module):
     sa-core.js                — Hằng số + state machine data + persistence
     sa-signals.js             — Tín hiệu WiFi/GPS + matching
     sa-actions.js             — Actions (auto check-in/out)
     sa-machine.js             — GPS control + polling + state machine
     sa-ui.js                  — UI evaluation + render
     sa-profile.js             — Log + profile setup + render
     sa-init.js                — Enable/disable + init + expose global

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
    # app modules
    SRC / 'app-holidays.js',
    SRC / 'app-payroll-rules.js',
    SRC / 'app-payroll-tax.js',
    SRC / 'app-store.js',
    SRC / 'app-onboarding.js',
    SRC / 'app-shifts.js',
    SRC / 'app-onboarding-step4.js',
    SRC / 'app-navigation.js',
    SRC / 'app-ui-time.js',
    SRC / 'app-ui-panel.js',
    SRC / 'app-i18n-data.js',
    SRC / 'app-i18n-apply.js',
    SRC / 'app-i18n-sync.js',
    SRC / 'app-init.js',
    # checkin modules
    SRC / 'checkin-manual.js',
    SRC / 'checkin-calendar.js',
    SRC / 'checkin-theme.js',
    SRC / 'checkin-notif.js',
    SRC / 'checkin-gps-helpers.js',
    SRC / 'checkin-gps-engine.js',
    SRC / 'checkin-gps-control.js',
    SRC / 'checkin-subjob.js',
    SRC / 'checkin-pdf.js',
    SRC / 'checkin-patches-1.js',
    SRC / 'checkin-patches-2.js',
    # capacitor-integration.js: bỏ qua trong dist (chỉ dùng trong APK)
    # smart-attendance modules
    SRC / 'sa-core.js',
    SRC / 'sa-signals.js',
    SRC / 'sa-actions.js',
    SRC / 'sa-machine.js',
    SRC / 'sa-ui.js',
    SRC / 'sa-profile.js',
    SRC / 'sa-init.js',
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
        'app-holidays.js',
        'app-payroll-rules.js', 'app-payroll-tax.js',
        'app-store.js',
        'app-onboarding.js', 'app-shifts.js', 'app-onboarding-step4.js',
        'app-navigation.js',
        'app-ui-time.js', 'app-ui-panel.js',
        'app-i18n-data.js', 'app-i18n-apply.js', 'app-i18n-sync.js',
        'app-init.js',
    ]]
    checkin_modules = [SRC / f for f in [
        'checkin-manual.js', 'checkin-calendar.js', 'checkin-theme.js',
        'checkin-notif.js',
        'checkin-gps-helpers.js', 'checkin-gps-engine.js', 'checkin-gps-control.js',
        'checkin-subjob.js', 'checkin-pdf.js',
        'checkin-patches-1.js', 'checkin-patches-2.js',
    ]]
    sa_modules = [SRC / f for f in [
        'sa-core.js', 'sa-signals.js',
        'sa-actions.js', 'sa-machine.js',
        'sa-ui.js', 'sa-profile.js',
        'sa-init.js',
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

    # 3) Inline app modules (thay toàn bộ block comment + script tags)
    app_js = concat_modules(app_modules)
    app_block_start = '<!-- app.js modules -->'
    app_block_end   = '<!-- checkin.js modules -->'
    if app_block_start in html and app_block_end in html:
        before = html[:html.index(app_block_start)]
        after  = html[html.index(app_block_end):]
        html = before + f'<script>\n{app_js}\n</script>\n' + after
        print(f'   ✓ Inline {len(app_modules)} app modules')

    # 4) Inline checkin modules
    checkin_js = concat_modules(checkin_modules)
    checkin_block_start = '<!-- checkin.js modules -->'
    checkin_block_end   = '<!-- capacitor native bridge -->'
    if checkin_block_start in html and checkin_block_end in html:
        before = html[:html.index(checkin_block_start)]
        after  = html[html.index(checkin_block_end):]
        html = before + f'<script>\n{checkin_js}\n</script>\n' + after
        print(f'   ✓ Inline {len(checkin_modules)} checkin modules')

    # 5) Bỏ qua capacitor (chỉ dùng trong APK)
    cap_tag = '<script src="capacitor-integration.js"></script>'
    if cap_tag in html:
        html = html.replace(f'<!-- capacitor native bridge -->\n{cap_tag}\n', '')
        print('   ✓ Bỏ qua capacitor-integration.js (APK only)')

    # 6) Inline smart-attendance modules
    sa_js = concat_modules(sa_modules)
    sa_block_start = '<!-- smart-attendance modules -->'
    sa_block_end   = '<!-- debug (dev only) -->'
    if sa_block_start in html and sa_block_end in html:
        before = html[:html.index(sa_block_start)]
        after  = html[html.index(sa_block_end):]
        html = before + f'<script>\n{sa_js}\n</script>\n' + after
        print(f'   ✓ Inline {len(sa_modules)} smart-attendance modules')

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
