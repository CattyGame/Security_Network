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
├── SETUP/                               # Chứa tài liệu cấu hình môi trường mạng ảo
│   └── vmware-lab-setup.md              # Hướng dẫn chi tiết cấu hình mạng ảo trên VMware Workstation
├── SOURCE/                              # Chứa mã nguồn ứng dụng web thử nghiệm (PHP/Apache)
│   ├── login.php                        # Trang đăng nhập thử nghiệm trên Web Server
│   ├── dashboard.php                    # Trang hồ sơ sinh viên UTH sau khi đăng nhập
│   └── secure_dashboard.php             # Phiên bản có cờ bảo mật HttpOnly & Secure
├── THESIS/                              # Chứa tài liệu văn bản báo cáo và slide thuyết trình
│   ├── BAO_CAO_DO_AN_SESSION_HIJACKING_UTH.md  # Toàn văn báo cáo đồ án chuẩn format UTH (>25 trang)
│   └── DAN_Y_SLIDE_POWERPOINT.md        # Dàn ý 28 slide PowerPoint chuẩn mẫu UTH (size 32/26)
├── SOFT/                                # Danh mục phần mềm và link tải
│   └── DANH_SACH_PHAN_MEM_VA_LINK_DOWNLOAD.md # Danh sách VMware, Wireshark, Hetty, CAIDO, ZAP
└── HUONGDAN.md                          # Hướng dẫn thực hành Lab chi tiết (File này)
```

---

## 2. YÊU CẦU MÔI TRƯỜNG MÁY ẢO
* **Phần mềm ảo hóa:** VMware Workstation Pro (hoặc Oracle VirtualBox).
* **Các máy ảo tham gia mô hình Lab:**
  1. **VM 1 (Target Web Server):** Ubuntu Server / Linux / Windows Server chạy Apache HTTP (Cổng 80) — IP: `192.168.100.10`.
  2. **VM 2 (Nạn nhân - Victim):** Windows 10/11 có trình duyệt Chrome / Edge — IP: `192.168.100.20`.
  3. **VM 3 (Kẻ tấn công - Attacker):** Kali Linux có cài sẵn Wireshark, Bettercap/arpspoof và Firefox — IP: `192.168.100.30`.
* **Card mạng ảo:** `VMnet2 (Host-only)`, dải mạng nội bộ: `192.168.100.0/24`.

---

## 3. CÁC BƯỚC THIẾT LẬP MẠNG LAB TRÊN VMWARE WORKSTATION

1. **Tạo card mạng `VMnet2`:**
   * Mở VMware $\rightarrow$ chọn menu **Edit** $\rightarrow$ **Virtual Network Editor...** $\rightarrow$ **Change Settings**.
   * Nhấn **Add Network...** $\rightarrow$ chọn **VMnet2** $\rightarrow$ Chọn chế độ **Host-only**.
   * Cấu hình Subnet IP: `192.168.100.0`, Subnet mask: `255.255.255.0`.
   * Bấm **Apply** $\rightarrow$ **OK**.
2. **Gán card mạng cho 3 máy ảo:**
   * Với mỗi máy ảo (Server, Victim, Kali Linux): Chuột phải $\rightarrow$ **Settings...** $\rightarrow$ **Network Adapter** $\rightarrow$ Chọn **Custom: Specific virtual network** $\rightarrow$ Chọn **VMnet2 (Host-only)**.
3. **Kiểm tra thông mạng:**
   * Từ máy Kali Linux (`192.168.100.30`), mở terminal gõ:
     ```bash
     ping 192.168.100.10   # Ping Server
     ping 192.168.100.20   # Ping Victim
     ```

---

## 4. QUY TRÌNH 4 BƯỚC DEMO TẤN CÔNG & PHÒNG THỦ

### BƯỚC 1: NẠN NHÂN ĐĂNG NHẬP TRÊN VM WINDOWS
1. Trên máy ảo **Windows Victim (`192.168.100.20`)**, mở trình duyệt.
2. Truy cập: `http://192.168.100.10/login.php` (hoặc `/dvwa/login.php`).
3. Đăng nhập tài khoản: `victim` / `uth123`.
4. Xem thông tin cá nhân và số dư ví tại `dashboard.php`.
5. Server cấp Cookie phiên: `PHPSESSID=...` trên giao thức HTTP không mã hóa.

---

### BƯỚC 2: TIN TẶC BẮT GÓI TIN TRÊN VM KALI LINUX
1. Mở Terminal Kali Linux, thực hiện chuyển hướng lưu lượng bằng ARP Spoofing:
   ```bash
   sudo sysctl -w net.ipv4.ip_forward=1
   sudo arpspoof -i eth0 -t 192.168.100.20 192.168.100.10
   ```
2. Khởi động **Wireshark** trên Kali Linux, lắng nghe trên card `eth0`.
3. Nhập bộ lọc:
   ```wireshark
   http.cookie contains "PHPSESSID"
   ```
4. Khi Nạn nhân lướt web, gói tin HTTP lộ diện. Chuột phải chọn **Follow $\rightarrow$ HTTP Stream**.
5. Đọc trực tiếp chuỗi: `Cookie: PHPSESSID=xxxxxx`.

---

### BƯỚC 3: TIN TẶC CHIẾM QUYỀN PHIÊN (SESSION HIJACKING)
1. Mở trình duyệt Firefox trên máy **Kali Linux (`192.168.100.30`)**.
2. Truy cập: `http://192.168.100.10/dashboard.php` $\rightarrow$ Bị chặn do chưa đăng nhập.
3. Nhấn `F12` $\rightarrow$ chọn tab **Storage** $\rightarrow$ **Cookies** (hoặc dùng tiện ích **Cookie-Editor**):
   * Thêm Cookie mới:
     * **Name:** `PHPSESSID`
     * **Value:** `xxxxxx` (Giá trị bắt được từ Wireshark)
     * **Path:** `/`
4. Nhấn **F5 (Refresh)** $\rightarrow$ **Đăng nhập tức thì vào tài khoản của Nạn nhân mà KHÔNG CẦN PASSWORD!**

---

### BƯỚC 4: TRIỂN KHAI PHÒNG THỦ & KIỂM CHỨNG
1. **Bật mã hóa HTTPS trên Server:**
   * Kích hoạt SSL: `sudo a2enmod ssl && sudo a2ensite default-ssl.conf && sudo systemctl restart apache2`.
   * Nạn nhân chuyển sang truy cập: `https://192.168.100.10/dashboard.php`.
   * Wireshark trên Kali chỉ còn thấy gói tin **TLS Encrypted Application Data**, hoàn toàn không đọc được Cookie.
2. **Cấu hình cờ bảo mật Cookie trong `php.ini`:**
   * `session.cookie_httponly = 1`
   * `session.cookie_secure = 1`
   * `session.cookie_samesite = "Strict"`
3. **Kiểm chứng:** Mở Console trên máy Nạn nhân gõ `document.cookie` $\rightarrow$ Trả về `""` (chống XSS đánh cắp Cookie).
