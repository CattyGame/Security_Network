# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH LAB MÔI TRƯỜNG ẢO (VMWARE WORKSTATION)
# ĐỀ TÀI: TẤN CÔNG CHIẾM QUYỀN ĐIỀU KHIỂN PHIÊN (SESSION HIJACKING)
### Trường Đại học Giao thông vận tải TP.HCM (UTH) — Khoa Công nghệ Thông tin
### Nhóm 22: Phan Nhật Hào — Đào Duy Quân — Nguyễn Quang Vinh
### Chuẩn kiến thức: EC-Council Certified Ethical Hacker (CEH) v13 — Module 11

---

## 1. CẤU TRÚC GÓI TẬP TIN NỘP BÀI (THEO CHUẨN KHOA CNTT - UTH)

Thư mục nộp bài được tổ chức theo đúng quy định tại mục 1 trong file `QUY DINH TRINH BAY BAO CAO BAI TẬP LỚN.pdf`:

```text
Nhom22_SessionHijacking/
├── SETUP/                                      # Tài liệu & script cài đặt môi trường ảo VMware
│   ├── vmware-lab-setup.md                     # Hướng dẫn cấu hình VMware Workstation & Snapshot
│   └── setup-target-server.sh                  # Script cài đặt tự động Apache2 + PHP cho Server
├── SOURCE/                                     # Mã nguồn ứng dụng web thử nghiệm (Apache2 + PHP)
│   ├── login.php                               # Trang đăng nhập Cổng thông tin sinh viên UTH
│   ├── dashboard.php                           # Trang hồ sơ sinh viên & ví học phí sau đăng nhập
│   └── logout.php                              # Trang đăng xuất hủy phiên an toàn (session_destroy)
├── THESIS/                                     # Tài liệu báo cáo và slide thuyết trình
│   ├── BAO_CAO_DO_AN_SESSION_HIJACKING_UTH.md  # Toàn văn báo cáo đồ án chuẩn form Mẫu 01-BCBTL
│   └── DAN_Y_SLIDE_POWERPOINT.md               # Dàn ý 28 slide PowerPoint chuẩn mẫu UTH (size 32/26)
├── SOFT/                                       # Danh mục phần mềm & link tải
│   └── DANH_SACH_PHAN_MEM_VA_LINK_DOWNLOAD.md  # VMware Workstation, Kali Linux, Wireshark, CEH Tools
└── HUONGDAN.md                                 # Hướng dẫn vận hành Lab chi tiết (xuất ra HUONGDAN.PDF)
```

---

## 2. MÔI TRƯỜNG ẢO HÓA & PHÂN VAI HỆ THỐNG

Toàn bộ mô hình chạy trên **VMware Workstation Pro 17** (card mạng ảo `VMnet8 NAT`, dải mạng `192.168.60.0/24`):

1. **Máy chủ Mục tiêu (`Target-Web-Server`):** Máy ảo Kali/Debian Linux chạy **Apache2 + PHP**, lắng nghe HTTP cổng `80` và HTTPS cổng `443` — IP: **`192.168.60.129`**.
2. **Máy Nạn nhân (Victim — Host Windows):** Máy thật Windows (`192.168.60.1`) sử dụng trình duyệt **Google Chrome** đăng nhập tài khoản sinh viên.
3. **Máy Tấn công (`kali-linux-2026.3-vmware-amd64`):** Máy ảo Kali Linux sử dụng **Wireshark** (bắt gói tin trên card `eth0`) và trình duyệt **Firefox** (F12 Storage / Cookie-Editor).

---

## 3. CÁC BƯỚC THIẾT LẬP TRƯỚC KHI DEMO

1. **Khởi động 2 máy ảo trong VMware Workstation:**
   * Bật **`Target-Web-Server`** (`192.168.60.129`) và **`kali-linux-2026.3-vmware-amd64`**.
2. **Đảm bảo Web Server Apache2 & PHP đã được nạp code từ thư mục `SOURCE/`:**
   * Chạy script `SETUP/setup-target-server.sh` trên máy ảo `Target-Web-Server` (hoặc copy 3 file `login.php`, `dashboard.php`, `logout.php` vào `/var/www/html/` và chạy `sudo systemctl enable --now apache2`).
3. **Kiểm tra thông mạng từ Host Windows và Kali Attacker:**
   ```bash
   ping 192.168.60.129
   ```

---

## 4. QUY TRÌNH 4 BƯỚC DEMO TẤN CÔNG & PHÒNG THỦ

### BƯỚC 1: THIẾT LẬP MÔI TRƯỜNG TẤN CÔNG (WIRESHARK TRÊN KALI)
1. Trên máy ảo **Kali Attacker**, mở **Wireshark**:
   ```bash
   sudo wireshark
   ```
   *(Mật khẩu `sudo` là `kali`).*
2. Chọn bắt gói tin trên card mạng **`eth0`**.
3. Nhập bộ lọc Display Filter:
   ```wireshark
   http.cookie contains "PHPSESSID"
   ```

---

### BƯỚC 2: NẠN NHÂN ĐĂNG NHẬP & TIN TẶC ĐÁNH CẮP COOKIE + CHIẾM PHIÊN (HTTP CỔNG 80)
1. **Nạn nhân đăng nhập (trên Chrome Windows):**
   * Truy cập giao thức không mã hóa: **`http://192.168.60.129/login.php`**
   * Đăng nhập tài khoản: **`victim`** / **`uth123`** $\rightarrow$ Chuyển hướng vào **`dashboard.php`** hiển thị họ tên *Nguyễn Văn Nạn Nhân* và ví học phí *25.000.000 VNĐ*.
2. **Tin tặc bắt gói tin (trên Wireshark máy Kali):**
   * Quan sát gói tin `GET /dashboard.php HTTP/1.1` hiện lên ở chế độ bản rõ (plaintext).
   * Nhấp chuột phải $\rightarrow$ **Follow** $\rightarrow$ **HTTP Stream** $\rightarrow$ Đọc và copy nguyên giá trị Cookie:  
     `Cookie: PHPSESSID=xxxxxxxxxxxxxxxxxxxxxxxxxx`
3. **Tin tặc chiếm quyền phiên (trên Firefox máy Kali):**
   * Mở Firefox trên Kali, thử truy cập thẳng **`http://192.168.60.129/dashboard.php`** $\rightarrow$ Bị chặn và đá về **`login.php?error=unauthorized`**.
   * Nhấn **`F12`** $\rightarrow$ tab **Storage** $\rightarrow$ **Cookies** $\rightarrow$ `http://192.168.60.129` (hoặc dùng extension **Cookie-Editor**):
     * Bấm dấu **(+)** thêm Cookie mới: **Name:** `PHPSESSID` | **Value:** *(dán chuỗi vừa bắt)* | **Path:** `/`.
   * Đổi lại thanh địa chỉ thành **`http://192.168.60.129/dashboard.php`** và nhấn **Enter**:
   * **Kết quả:** Toàn bộ hồ sơ sinh viên và số dư 25.000.000 VNĐ của nạn nhân hiện ra ngay lập tức mà **HOÀN TOÀN KHÔNG CẦN MẬT KHẨU!**

---

### BƯỚC 3: TRIỂN KHAI 3 LỚP GIẢI PHÁP PHÒNG THỦ (TRÊN `TARGET-WEB-SERVER`)

1. **Lớp 1 — Bật mã hóa toàn trình HTTPS (SSL/TLS cổng 443):**
   ```bash
   sudo a2enmod ssl
   sudo a2ensite default-ssl.conf
   sudo systemctl restart apache2
   ```
2. **Lớp 2 — Bật cờ bảo mật Cookie (`HttpOnly`, `Secure`, `SameSite`):**
   Mở `/etc/php/*/apache2/php.ini`:
   ```bash
   sudo nano /etc/php/*/apache2/php.ini
   ```
   Tìm cụm `session.cookie_httponly` (`Ctrl + W`) và sửa thành:
   ```ini
   session.cookie_httponly = 1
   session.cookie_secure = 1
   session.cookie_samesite = "Strict"
   ```
   Lưu lại (`Ctrl + O` $\rightarrow$ `Enter` $\rightarrow$ `Ctrl + X`) và khởi động lại Apache:
   ```bash
   sudo systemctl restart apache2
   ```
3. **Lớp 3 — Hủy phiên triệt để khi Đăng xuất (`logout.php`):**
   * `logout.php` xóa sạch mảng `$_SESSION`, đặt thời gian hết hạn Cookie về quá khứ và gọi `session_destroy()`.

---

### BƯỚC 4: KIỂM CHỨNG HIỆU QUẢ SAU KHI PHÒNG THỦ

1. **Chống nghe lén mạng (HTTPS Port 443):**
   * Nạn nhân mở tab mới truy cập **`https://192.168.60.129/login.php`** và đăng nhập lại.
   * Trên **Wireshark (Kali)**, lọc `http.cookie contains "PHPSESSID"` **không bắt được bất kỳ gói tin nào**; lọc `tcp.port == 443` chỉ thấy **`TLSv1.3 Application Data`** đã bị mã hóa hoàn toàn.
2. **Chống XSS đọc trộm Cookie (`HttpOnly`):**
   * Sau khi đăng nhập lại qua HTTPS, trên Chrome Windows nhấn **`F12` $\rightarrow$ Console**, gõ **`document.cookie`** $\rightarrow$ Kết quả trả về chuỗi rỗng **`""`** (JavaScript bị chặn hoàn toàn).
3. **Chống Replay Attack khi Đăng xuất (`session_destroy()`):**
   * Nạn nhân bấm nút **"Đăng xuất (Hủy phiên)"** $\rightarrow$ Attacker trên Kali bấm **F5** lập tức bị văng về `login.php?error=unauthorized`, Cookie cũ bị vô hiệu hóa vĩnh viễn.
