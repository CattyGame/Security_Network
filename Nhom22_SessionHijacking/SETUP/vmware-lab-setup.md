# HƯỚNG DẪN THIẾT LẬP MÔ HÌNH LAB MÔI TRƯỜNG ẢO (VMWARE WORKSTATION PRO)
### Đồ án môn học: An ninh mạng — Nhóm 22 (Đại học Giao thông vận tải TP.HCM - UTH)
### Đề tài: Tấn công chiếm quyền điều khiển phiên (Session Hijacking)

---

## 1. MỤC TIÊU CỦA MÔ HÌNH LAB MÔI TRƯỜNG ẢO
Theo yêu cầu tại mục **2. Mô hình triển khai** trong file `DeTai.pdf` của Khoa CNTT - UTH:
* Toàn bộ thực nghiệm chạy hoàn toàn trên **phần mềm môi trường ảo (VMware Workstation Pro)**, tạo mạng ảo tách biệt (Isolated Virtual Network), đảm bảo an toàn và không ảnh hưởng tới mạng Internet thật.
* Triển khai ứng dụng Web chuẩn **Apache2 + PHP** trực tiếp trên máy ảo Linux trong VMware, gọn nhẹ và sát với thực tế quản trị máy chủ mạng.

---

## 2. SƠ ĐỒ MẠNG LAB (NETWORK TOPOLOGY)

Nhóm triển khai mô hình trên **VMware Workstation Pro** gồm 2 máy ảo (Linux) kết nối cùng máy thật Windows qua card mạng ảo NAT `VMnet8` (dải IP `192.168.60.0/24`):

```text
                       [ MẠNG ẢO VMWARE WORKSTATION (192.168.60.0/24) ]
                                             |
          +----------------------------------+----------------------------------+
          |                                  |                                  |
          v                                  v                                  v
+-----------------------------+  +-----------------------------+  +-----------------------------+
|  VM 1: TARGET-WEB-SERVER    |  |   HOST: VICTIM (NẠN NHÂN)   |  |  VM 2: KALI LINUX ATTACKER  |
| - Hệ điều hành: Kali/Debian |  | - Hệ điều hành: Windows 11  |  | - Image: kali-linux-2026.3  |
| - IP: 192.168.60.129        |  | - IP: 192.168.60.1          |  | - Giao diện: Wireshark      |
| - Dịch vụ: Apache2 + PHP    |  | - Trình duyệt: Google Chrome|  |   (eth0), Firefox + F12     |
| - Giao thức:                |  | - Đăng nhập Cổng SV UTH     |  |   Storage / Cookie-Editor   |
|   + Tấn công: HTTP (80)     |  | - Kiểm chứng document.cookie|  | - Bắt & replay PHPSESSID    |
|   + Phòng thủ: HTTPS (443)  |  |   và Logout                 |  |                             |
+-----------------------------+  +-----------------------------+  +-----------------------------+
```

> *(Ghi chú: Nếu triển khai với 3 máy ảo độc lập trên mạng cô lập hoàn toàn không thông ra Host, nhóm có thể gán cả 3 máy ảo — gồm `Target-Web-Server`, `Windows Victim VM`, và `Kali Attacker` — vào card `VMnet2 Host-only` dải `192.168.100.0/24` trong Virtual Network Editor).*

---

## 3. CÁC BƯỚC CẤU HÌNH CHI TIẾT TRÊN VMWARE WORKSTATION PRO

### Bước 1: Cài đặt VMware Workstation Pro
* Bộ cài đặt có sẵn trong thư mục giáo trình:  
  `CEH v13 OCT 2024/CEHv13 ISO/VMware Workstation Pro/VMware-workstation-full-17.5.2-23775571.exe`
* Giải nén image máy ảo Kali Linux: `kali-linux-2026.3-vmware-amd64.7z` và mở bằng VMware Workstation.

### Bước 2: Tạo 2 máy ảo (Attacker & Target Web Server)
1. **Máy ảo Attacker (`kali-linux-2026.3-vmware-amd64`):** Giữ nguyên dùng làm máy tấn công (có sẵn Wireshark, Firefox, Bettercap, Arpspoof).
2. **Máy ảo Server (`Target-Web-Server`):** Trong VMware, chuột phải vào máy ảo Kali gốc $\rightarrow$ **Manage** $\rightarrow$ **Clone...** $\rightarrow$ **Create a full clone** $\rightarrow$ đặt tên `Target-Web-Server`.
3. Đảm bảo cả 2 máy ảo đều dùng chung **Network Adapter: NAT (VMnet8)** (hoặc cùng card `VMnet2 Host-only`) để cùng dải mạng.

### Bước 3: Cài đặt Web Server Apache2 + PHP trên `Target-Web-Server`
1. Bật máy ảo `Target-Web-Server` (user/pass mặc định: `kali` / `kali`).
2. Xem địa chỉ IP bằng lệnh:
   ```bash
   ip a
   ```
   *(Ví dụ trong Lab thực nghiệm của nhóm là `192.168.60.129`).*
3. Copy thư mục `Nhom22_SessionHijacking` (hoặc clone repo) vào máy ảo và chạy script tự động [setup-target-server.sh](file:///c:/Code/An%20ninh%20m%E1%BA%A1ng/Nhom22_SessionHijacking/SETUP/setup-target-server.sh), hoặc chạy thủ công:
   ```bash
   sudo apt update && sudo apt install -y apache2 php libapache2-mod-php
   sudo cp login.php dashboard.php logout.php /var/www/html/
   sudo systemctl enable --now apache2
   ```

### Bước 4: Thiết lập cây Snapshot để Demo mượt mà
Trên máy ảo **`Target-Web-Server`**, tạo 3 Snapshot theo thứ tự (`VM` $\rightarrow$ `Snapshot` $\rightarrow$ `Take Snapshot...`):
1. **`Http`:** Trạng thái ban đầu chỉ mở HTTP cổng 80 (`php.ini` chưa bật `HttpOnly`/`Secure`).
2. **`https (SSL/TLS port 443)`:** Đã bật `sudo a2enmod ssl && sudo a2ensite default-ssl.conf && sudo systemctl restart apache2`.
3. **`HttpOnly Flag`:** Đã cấu hình `session.cookie_httponly = 1`, `session.cookie_secure = 1`, `session.cookie_samesite = "Strict"` trong `/etc/php/*/apache2/php.ini` và restart Apache.

---

## 4. KIỂM TRA THÔNG MẠNG (CONNECTIVITY TEST)
Từ máy thật Windows (CMD/PowerShell) và máy ảo Kali Attacker, chạy lệnh kiểm tra kết nối tới Target Web Server (`192.168.60.129`):
```bash
ping 192.168.60.129
```
Khi nhận được phản hồi TTL từ `192.168.60.129` $\rightarrow$ Môi trường Lab VMware đã thông suốt và sẵn sàng trình diễn Demo.
