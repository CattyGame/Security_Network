#!/bin/bash
# ==============================================================================
# SCRIPT CÀI ĐẶT MÁY CHỦ TARGET WEB SERVER (APACHE2 + PHP) TRÊN VMWARE
# Đồ án An ninh mạng - Nhóm 22 (UTH)
# Đề tài: Tấn công chiếm quyền điều khiển phiên (Session Hijacking)
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$(cd "$SCRIPT_DIR/../SOURCE" && pwd)"

echo "=============================================================================="
echo "  CAI DAT TARGET WEB SERVER (APACHE2 + PHP) - NHOM 22 (UTH)"
echo "=============================================================================="

echo "[1/4] Cập nhật danh sách gói và cài đặt Apache2 + PHP..."
sudo apt update
sudo apt install -y apache2 php libapache2-mod-php

echo "[2/4] Triển khai mã nguồn PHP (login.php, dashboard.php, logout.php)..."
sudo cp "$SOURCE_DIR/login.php" /var/www/html/
sudo cp "$SOURCE_DIR/dashboard.php" /var/www/html/
sudo cp "$SOURCE_DIR/logout.php" /var/www/html/
sudo chown www-data:www-data /var/www/html/*.php
sudo chmod 644 /var/www/html/*.php

echo "[3/4] Khởi động và bật tự chạy dịch vụ Apache2..."
sudo systemctl enable apache2
sudo systemctl restart apache2

echo "[4/4] Kiểm tra địa chỉ IP của máy chủ Target-Web-Server..."
IP_ADDR=$(hostname -I | awk '{print $1}')
echo "=============================================================================="
echo "  [OK] TARGET WEB SERVER DA SAN SANG (CHE DO HTTP PORT 80 - LO HONG)!"
echo "  - Địa chỉ truy cập: http://$IP_ADDR/login.php"
echo "  - Tài khoản thử nghiệm: victim / uth123"
echo "------------------------------------------------------------------------------"
echo "  Khi chuyển sang PHA PHÒNG THỦ (HTTPS + HttpOnly), chạy thêm các lệnh sau:"
echo "    sudo a2enmod ssl"
echo "    sudo a2ensite default-ssl.conf"
echo "    sudo sed -i 's/^;*session.cookie_httponly =.*/session.cookie_httponly = 1/' /etc/php/*/apache2/php.ini"
echo "    sudo sed -i 's/^;*session.cookie_secure =.*/session.cookie_secure = 1/' /etc/php/*/apache2/php.ini"
echo "    sudo sed -i 's/^;*session.cookie_samesite =.*/session.cookie_samesite = \"Strict\"/' /etc/php/*/apache2/php.ini"
echo "    sudo systemctl restart apache2"
echo "=============================================================================="
