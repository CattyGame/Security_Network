@echo off
chcp 65001 >nul
title KHỞI CHẠY LAB SESSION HIJACKING - NHÓM 22 UTH

echo ==============================================================================
echo   ĐỒ ÁN AN NINH MẠNG - TRƯỜNG ĐẠI HỌC GIAO THÔNG VẬN TẢI TP.HCM (UTH)
echo   ĐỀ TÀI: TẤN CÔNG CHIẾM QUYỀN ĐIỀU KHIỂN PHIÊN (SESSION HIJACKING)
echo   NHÓM THỰC HIỆN: NHÓM 22 (HÀO - QUÂN - VINH)
echo ==============================================================================
echo.

:: Kiểm tra cài đặt Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Không tìm thấy Node.js trên máy tính!
    echo Vui lòng cài đặt Node.js từ thư mục SOFT hoặc trang chủ https://nodejs.org
    pause
    exit /b
)

echo [*] Đang khởi động Web Server giả lập Cổng thông tin UTH...
cd /d "%~dp0..\SOURCE"

start "" cmd /k "title UTH Target Server (HTTP:3000) && node server.js"

timeout /t 2 >nul

echo [*] Đang tự động mở Trình duyệt Nạn nhân (Victim)...
start http://localhost:3000/login

echo.
echo ==============================================================================
echo   [OK] LAB ĐÃ SẴN SÀNG ĐỂ DEMO!
echo   - Web Server: http://localhost:3000
echo   - Tài khoản mẫu: victim / uth123
echo   - Để mô phỏng Attacker: Mở thêm 1 cửa sổ Ẩn danh (Incognito) hoặc Edge/Firefox!
echo ==============================================================================
echo.
pause
