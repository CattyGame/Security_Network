# ĐỒ ÁN AN NINH MẠNG: TẤN CÔNG CHIẾM QUYỀN ĐIỀU KHIỂN PHIÊN (SESSION HIJACKING)
### Trường Đại học Giao thông vận tải TP.HCM (UTH) — Khoa Công nghệ Thông tin
### Học phần: An toàn thông tin / An ninh mạng
### Nhóm 22: Phan Nhật Hào — Đào Duy Quân — Nguyễn Quang Vinh
### Hotline liên hệ: 0833386443

---

## 🖥️ MÔ HÌNH THỰC HIỆN: MÔI TRƯỜNG ẢO VMWARE WORKSTATION PRO
Theo quy định tại mục 2 trong file `DeTai.pdf` của Khoa CNTT - UTH, toàn bộ bài thực nghiệm được triển khai 100% trên **phần mềm môi trường ảo VMware Workstation Pro** với hệ thống mạng ảo cô lập (Apache2 + PHP + Kali Linux):

```text
                       [ MẠNG ẢO VMWARE WORKSTATION (192.168.60.0/24) ]
                                             |
          +----------------------------------+----------------------------------+
          |                                  |                                  |
          v                                  v                                  v
+-----------------------------+  +-----------------------------+  +-----------------------------+
|  VM 1: TARGET-WEB-SERVER    |  |   HOST: VICTIM (NẠN NHÂN)   |  |  VM 2: KALI LINUX ATTACKER  |
| - HĐH: Kali/Debian Linux    |  | - HĐH: Windows 10/11        |  | - Image: kali-linux-2026.3  |
| - IP: 192.168.60.129        |  | - IP: 192.168.60.1          |  | - Công cụ: Wireshark (eth0),|
| - Dịch vụ: Apache2 + PHP    |  | - Trình duyệt: Google Chrome|  |   Firefox (F12 Storage /    |
| - Cổng: HTTP 80 / HTTPS 443 |  |   đăng nhập Cổng SV UTH     |  |   Cookie-Editor), Bettercap |
+-----------------------------+  +-----------------------------+  +-----------------------------+
```

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN (CHUẨN QUY ĐỊNH NỘP BÀI UTH)

```text
Security_Network/
├── HUONG_DAN_LAB_MOI_TRUONG_AO_VMWARE_CHI_TIET.md # Cẩm nang thực hành chi tiết trên máy ảo VMware
├── Nhom22_SessionHijacking/              # Gói nộp bài hoàn chỉnh theo quy chuẩn Khoa CNTT
│   ├── SETUP/                            # Hướng dẫn & script cài đặt máy chủ Web trên VMware
│   │   ├── vmware-lab-setup.md           # Chi tiết cấu hình mạng VMware & Snapshot
│   │   └── setup-target-server.sh        # Script cài đặt tự động Apache2 + PHP cho VM Server
│   ├── SOURCE/                           # Toàn bộ mã nguồn ứng dụng web PHP triển khai trên Web Server
│   │   ├── login.php                     # Trang đăng nhập mô phỏng Cổng sinh viên UTH
│   │   ├── dashboard.php                 # Trang cá nhân và số dư ví học phí
│   │   └── logout.php                    # Trang hủy phiên an toàn (session_destroy)
│   ├── THESIS/                           # Tài liệu báo cáo và slide thuyết trình
│   │   ├── BAO_CAO_DO_AN_SESSION_HIJACKING_UTH.md # Toàn văn báo cáo chuẩn form Mẫu 01-BCBTL
│   │   └── DAN_Y_SLIDE_POWERPOINT.md     # Dàn ý 28 slide PowerPoint chuẩn mẫu UTH
│   ├── SOFT/                             # Danh mục phần mềm và link tải
│   │   └── DANH_SACH_PHAN_MEM_VA_LINK_DOWNLOAD.md # VMware, Kali Linux, Wireshark, CEH Tools
│   └── HUONGDAN.md                       # Hướng dẫn vận hành chi tiết từ A - Z (xuất HUONGDAN.PDF)
│
├── KIEN_THUC_VA_KICH_BAN_DEMO_SESSION_HIJACKING.md # Cẩm nang lý thuyết & 4 bước demo chuyên sâu
├── KE_HOACH_DO_AN_SESSION_HIJACKING.md   # Kế hoạch phân công công việc & ma trận RACI
└── README.md                             # Tài liệu giới thiệu tổng quan repo
```

---

## 🎯 QUY TRÌNH 4 BƯỚC DEMO TRÊN MÁY ẢO (STEP-BY-STEP)

1. **Bước 1 (Nạn nhân đăng nhập):** Nạn nhân trên Host Windows (`192.168.60.1`) mở Chrome truy cập `http://192.168.60.129/login.php`, đăng nhập tài khoản `victim` / `uth123` $\rightarrow$ Nhận Session Cookie `PHPSESSID=...` qua giao thức HTTP không mã hóa (cổng 80).
2. **Bước 2 (Tin tặc cướp phiên):**
   * Trên VM Kali Linux Attacker, mở **Wireshark** bắt gói tin trên `eth0`, lọc `http.cookie contains "PHPSESSID"`, dùng **Follow $\rightarrow$ HTTP Stream** để trích xuất chuỗi Cookie dạng plaintext.
   * Mở Firefox trên Kali Linux truy cập `http://192.168.60.129/dashboard.php` (bị từ chối về trang đăng nhập). Nhấn `F12` $\rightarrow$ tab `Storage` (hoặc **Cookie-Editor**) dán `PHPSESSID` vào và truy cập lại `/dashboard.php`.
   * Chiếm quyền tài khoản thành công mà **KHÔNG CẦN PASSWORD**!
3. **Bước 3 (Triển khai phòng thủ trên `Target-Web-Server`):**
   * Kích hoạt HTTPS (Apache SSL cổng 443: `sudo a2enmod ssl && sudo a2ensite default-ssl.conf`).
   * Cấu hình cờ `session.cookie_httponly = 1`, `session.cookie_secure = 1`, `session.cookie_samesite = "Strict"` trong `/etc/php/*/apache2/php.ini` và `sudo systemctl restart apache2`.
   * Kết hợp hủy phiên triệt để khi đăng xuất trong `logout.php` (`session_destroy()`) và `session_regenerate_id(true)`.
4. **Bước 4 (Kiểm chứng hiệu quả):**
   * Wireshark trên Kali chỉ còn thấy gói tin mã hóa **`TLSv1.3 Application Data`** trên cổng 443.
   * Mở F12 Console trên máy Nạn nhân gõ `document.cookie` bị chặn (trả về `""`) sau khi đăng nhập lại qua HTTPS.
   * Nạn nhân bấm Đăng xuất $\rightarrow$ Server hủy phiên, Cookie trên máy Attacker lập tức mất tác dụng khi nhấn F5.
