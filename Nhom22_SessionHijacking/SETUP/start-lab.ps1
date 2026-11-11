# Script PowerShell khởi chạy Lab Session Hijacking - Nhóm 22 UTH
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "  ĐỒ ÁN AN NINH MẠNG - ĐẠI HỌC GIAO THÔNG VẬN TẢI TP.HCM (UTH)" -ForegroundColor Yellow
Write-Host "  DEMO: TẤN CÔNG CHIẾM QUYỀN ĐIỀU KHIỂN PHIÊN (SESSION HIJACKING)" -ForegroundColor Green
Write-Host "  NHÓM 22: Phan Nhật Hào - Đào Duy Quân - Nguyễn Quang Vinh" -ForegroundColor White
Write-Host "==============================================================================" -ForegroundColor Cyan

# Kiểm tra Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[LỖI] Chưa cài đặt Node.js! Vui lòng cài Node.js để chạy server." -ForegroundColor Red
    pause
    exit
}

$sourceDir = Join-Path $PSScriptRoot "..\SOURCE"

Write-Host "[*] Đang khởi động Server tại cổng 3000..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k title UTH Target Server && cd /d `"$sourceDir`" && node server.js"

Start-Sleep -Seconds 2

Write-Host "[*] Đang mở trình duyệt kết nối cổng sinh viên UTH..." -ForegroundColor Green
Start-Process "http://localhost:3000/login"

Write-Host "`n[THÀNH CÔNG] Môi trường Lab đã khởi động hoàn tất!" -ForegroundColor Cyan
