# ĐỒ ÁN AN NINH MẠNG: TẤN CÔNG CHIẾM QUYỀN ĐIỀU KHIỂN PHIÊN (SESSION HIJACKING)
### Trường Đại học Giao thông vận tải TP.HCM (UTH) — Khoa Công nghệ Thông tin
### Học phần: An toàn thông tin / An ninh mạng
### Nhóm 22: Phan Nhật Hào — Đào Duy Quân — Nguyễn Quang Vinh
### Hotline liên hệ: 0833386443

---

## 🖥️ MÔ HÌNH THỰC HIỆN: MÔI TRƯỜNG MÁY ẢO CÔ LẬP (VMWARE WORKSTATION PRO)
Theo quy định tại mục 2 trong file `DeTai.pdf` của Khoa CNTT - UTH, toàn bộ bài thực nghiệm được triển khai trên hệ thống mạng ảo cô lập với 3 máy ảo độc lập:

```
                            [ CARD MẠNG ẢO VMWARE: VMnet2 (Host-Only) ]
                                   Dải IP ảo: 192.168.100.0/24
                                                |
            +-----------------------------------+-----------------------------------+
            |                                   |                                   |
            v                                   v                                   v
+-------------------------+         +-------------------------+         +-------------------------+
|    MÁY CHỦ TARGET WEB   |         |    MÁY NẠN NHÂN VICTIM  |         |   MÁY TẤN CÔNG ATTACKER |
| - HĐH: Linux / Windows  |         | - HĐH: Windows 10 / 11  |         | - HĐH: Kali Linux       |
| - IP: 192.168.100.10    |         | - IP: 192.168.100.20    |         | - IP: 192.168.100.30    |
| - Dịch vụ: Apache HTTP  |         | - Trình duyệt: Chrome/  |         | - Công cụ: Wireshark,   |
|   (Cổng 80 - Plaintext) |         |   Edge đăng nhập phiên  |         |   Bettercap, Cookie-Edit|
+-------------------------+         +-------------------------+         +-------------------------+
```

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN (CHUẨN QUY ĐỊNH NỘP BÀI UTH)

```text
Security_Network/
├── HUONG_DAN_LAB_MOI_TRUONG_AO_VMWARE_CHI_TIET.md # Cẩm nang thực hành chi tiết trên máy ảo VMware
├── Nhom22_SessionHijacking/              # Gói nộp bài hoàn chỉnh theo quy chuẩn Khoa CNTT
│   ├── SETUP/                            # Hướng dẫn cấu hình mạng ảo trên VMware
│   │   └── vmware-lab-setup.md           # Chi tiết các bước tạo card VMnet2 dải 192.168.100.0/24
│   ├── SOURCE/                           # Toàn bộ mã nguồn ứng dụng web PHP triển khai trên Web Server
│   │   ├── login.php                     # Trang đăng nhập mô phỏng Cổng sinh viên UTH
│   │   ├── dashboard.php                 # Trang cá nhân và số dư ví học phí
│   │   └── logout.php                    # Trang hủy phiên an toàn
│   ├── THESIS/                           # Tài liệu báo cáo và slide thuyết trình
│   │   ├── BAO_CAO_DO_AN_SESSION_HIJACKING_UTH.md # Toàn văn báo cáo chuẩn form Mẫu 01-BCBTL
│   │   └── DAN_Y_SLIDE_POWERPOINT.md     # Dàn ý 28 slide PowerPoint chuẩn mẫu UTH
│   ├── SOFT/                             # Danh mục phần mềm và link tải
│   │   └── DANH_SACH_PHAN_MEM_VA_LINK_DOWNLOAD.md # VMware, Wireshark, Hetty, ZAP...
│   └── HUONGDAN.md                       # Hướng dẫn vận hành chi tiết từ A - Z
│
├── KIEN_THUC_VA_KICH_BAN_DEMO_SESSION_HIJACKING.md # Cẩm nang lý thuyết & 4 bước demo chuyên sâu
├── KE_HOACH_DO_AN_SESSION_HIJACKING.md   # Kế hoạch phân công công việc & ma trận RACI
└── README.md                             # Tài liệu giới thiệu tổng quan repo
```

---

## 🎯 QUY TRÌNH 4 BƯỚC DEMO TRÊN MÁY ẢO (STEP-BY-STEP)

1. **Bước 1 (Nạn nhân đăng nhập):** Nạn nhân trên VM Windows (`192.168.100.20`) mở Chrome truy cập `http://192.168.100.10/login.php`, đăng nhập tài khoản `victim` / `uth123` $\rightarrow$ Nhận Session Cookie `PHPSESSID=...` qua giao thức HTTP không mã hóa.
2. **Bước 2 (Tin tặc cướp phiên):**
   * Trên VM Kali Linux (`192.168.100.30`), chạy ARP Spoofing bằng `bettercap` hoặc `arpspoof`.
   * Mở **Wireshark** lọc `http.cookie contains "PHPSESSID"`, trích xuất chuỗi Cookie dạng plaintext.
   * Mở Firefox trên Kali Linux truy cập `http://192.168.100.10/dashboard.php` (bị từ chối). Dùng tiện ích **Cookie-Editor** dán `PHPSESSID` vào và nhấn **F5**.
   * Chiếm quyền tài khoản thành công mà **KHÔNG CẦN PASSWORD**!
3. **Bước 3 (Triển khai phòng thủ):**
   * Kích hoạt HTTPS (Apache SSL cổng 443) trên máy ảo Server.
   * Cấu hình cờ `session.cookie_httponly = 1`, `session.cookie_secure = 1`, `session.cookie_samesite = "Strict"` trong `php.ini`.
   * Thêm hàm `session_regenerate_id(true)` chống Session Fixation.
4. **Bước 4 (Kiểm chứng hiệu quả):**
   * Wireshark trên Kali chỉ còn thấy gói tin mã hóa `TLS Encrypted Application Data`.
   * Mở F12 Console trên máy Nạn nhân gõ `document.cookie` bị chặn (trả về `""`).
   * Nạn nhân bấm Đăng xuất $\rightarrow$ Server hủy phiên, Cookie trên máy Attacker lập tức mất tác dụng.
