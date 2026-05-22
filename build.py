#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
═══════════════════════════════════════════════════════════════════════════════
build.py — SCRIPT GỘP FILE CHO CHẤM CÔNG PRO
═══════════════════════════════════════════════════════════════════════════════

📌 CÁCH SỬ DỤNG:
   $ python build.py
   → Tạo file dist/ChamCongPro.html (file đơn lẻ để mở browser test / deploy)

📌 QUY TẮC:
   - BẠN CHỈ EDIT các file nguồn:
     • index.html        — Cấu trúc HTML
     • style.css         — Giao diện
     • utils.js          — Tiện ích
     • app.js            — Logic chính
     • checkin.js        — GPS + chấm công
     • smart-attendance.js — Hệ thống chấm công thông minh
     • debug-monitor.js  — Màn hình debug (chỉ dùng khi test)
   - KHÔNG sửa dist/ChamCongPro.html (sẽ bị overwrite mỗi lần build)

═══════════════════════════════════════════════════════════════════════════════
"""

import os
import sys
from pathlib import Path

# Thư mục chứa script này
ROOT = Path(__file__).parent.resolve()
DIST = ROOT / 'dist'
OUTPUT = DIST / 'ChamCongPro.html'

# Đường dẫn các file nguồn
FILES = {
    'html'    : ROOT / 'index.html',
    'css'     : ROOT / 'style.css',
    'utils'   : ROOT / 'utils.js',
    'app'     : ROOT / 'app.js',
    'checkin' : ROOT / 'checkin.js',
    'sa'      : ROOT / 'smart-attendance.js',
    'debug'   : ROOT / 'debug-monitor.js',
}


def read_file(path: Path) -> str:
    """Đọc file UTF-8, raise lỗi rõ ràng nếu thiếu."""
    if not path.exists():
        print(f'❌ KHÔNG TÌM THẤY: {path}')
        sys.exit(1)
    return path.read_text(encoding='utf-8')


def build():
    print('═' * 70)
    print('📦 CHẤM CÔNG PRO — BUILD SCRIPT')
    print('═' * 70)

    # Đọc 5 file nguồn
    print('\n📖 Đọc file nguồn:')
    sources = {}
    for key, path in FILES.items():
        sources[key] = read_file(path)
        size_kb = len(sources[key]) / 1024
        lines = sources[key].count('\n')
        print(f'   ✓ {path.name:15s}  {lines:5d} dòng  ({size_kb:6.1f} KB)')

    # Gộp CSS vào trong <link rel="stylesheet" href="style.css"> → <style>...</style>
    print('\n🔧 Gộp file:')
    html = sources['html']

    # 1) Thay <link rel="stylesheet" href="style.css"> bằng <style>{css}</style>
    css_block = f'<style>\n{sources["css"]}\n</style>'
    if '<link rel="stylesheet" href="style.css">' in html:
        html = html.replace(
            '<link rel="stylesheet" href="style.css">',
            css_block
        )
        print('   ✓ Inline style.css')
    else:
        print('   ⚠️ Không tìm thấy <link href="style.css"> — bỏ qua CSS')

    # 2) Thay các thẻ <script src="..."> bằng inline <script>...</script>
    js_replacements = [
        ('<script src="utils.js"></script>',
         f'<script>\n{sources["utils"]}\n</script>'),
        ('<script src="app.js"></script>',
         f'<script>\n{sources["app"]}\n</script>'),
        ('<script src="checkin.js"></script>',
         f'<script>\n{sources["checkin"]}\n</script>'),
        # capacitor-integration.js: bỏ qua trong dist (chỉ dùng trong APK)
        ('<script src="capacitor-integration.js"></script>', ''),
        ('<script src="smart-attendance.js"></script>',
         f'<script>\n{sources["sa"]}\n</script>'),
        ('<script src="debug-monitor.js"></script>',
         f'<script>\n{sources["debug"]}\n</script>'),
    ]
    for old, new in js_replacements:
        if old in html:
            html = html.replace(old, new)
            label = old.split('"')[1]
            print(f'   ✓ Inline {label}')
        else:
            print(f'   ⚠️ Không tìm thấy: {old}')

    # Tạo thư mục dist nếu chưa có
    DIST.mkdir(exist_ok=True)

    # Ghi file output
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
