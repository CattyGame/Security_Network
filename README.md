# ĐỒ ÁN AN NINH MẠNG: TẤN CÔNG CHIẾM QUYỀN ĐIỀU KHIỂN PHIÊN (SESSION HIJACKING)
### Trường Đại học Giao thông vận tải TP.HCM (UTH) — Khoa Công nghệ Thông tin
### Học phần: An toàn thông tin / An ninh mạng

---

## 👥 THÔNG TIN NHÓM THỰC HIỆN: NHÓM 22

| STT | Họ và Tên | Vai trò chính | Trách nhiệm |
| :---: | :--- | :--- | :--- |
| 1 | **Phan Nhật Hào** | Trưởng nhóm & Kỹ thuật Mạng | Thiết lập mô hình Lab ảo hóa, bắt gói tin Wireshark |
| 2 | **Đào Duy Quân** | Kỹ thuật Ứng dụng & Khai thác | Công cụ CEH v13 (Hetty/CAIDO), demo Cookie-Editor |
| 3 | **Nguyễn Quang Vinh** | Giải pháp Phòng thủ & Tài liệu | Cấu hình bảo mật (HTTPS, cờ Cookie), Báo cáo Word/PDF & Slide |

* **Đề tài:** Tấn công chiếm quyền điều khiển phiên (Session Hijacking): Demo cách đánh cắp Cookie và chiếm phiên làm việc của người dùng trên các giao thức không bảo mật.
* **Số điện thoại liên hệ:** 0833386443
* **Tài liệu tham chiếu chuẩn:** Giáo trình EC-Council Certified Ethical Hacker (CEH) v13 — Module 11: *Session Hijacking*.

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN (CHUẨN QUY ĐỊNH NỘP BÀI UTH)

```text
Security_Network/
├── Nhom22_SessionHijacking/              # Gói nộp bài hoàn chỉnh theo quy chuẩn Khoa CNTT
│   ├── SETUP/                            # Script khởi chạy và cấu hình ảo hóa
│   │   ├── start-lab.bat                 # Script chạy 1-Click trên Windows
│   │   ├── start-lab.ps1                 # Script PowerShell tự động
│   │   ├── Dockerfile                    # Container Target Web Server
│   │   ├── docker-compose.yml            # Mạng ảo hóa an toàn Docker (192.168.100.0/24)
│   │   └── vmware-lab-setup.md           # Hướng dẫn cấu hình VMware Workstation Pro
│   ├── SOURCE/                           # Toàn bộ mã nguồn ứng dụng web thử nghiệm
│   │   ├── server.js                     # Máy chủ Cổng sinh viên UTH (HTTP/Secure)
│   │   └── package.json                  # Thông tin gói dự án
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

## ⚡ HƯỚNG DẪN CHẠY NHANH DEMO (QUICK START)

### Cách 1: Chạy 1-Click trên Windows
1. Mở thư mục `Nhom22_SessionHijacking/SETUP/`.
2. Nhấp đúp chuột vào file **`start-lab.bat`**.
3. Trình duyệt tự động mở đến địa chỉ: `http://localhost:3000/login`.

### Cách 2: Chạy bằng dòng lệnh (Node.js)
```bash
cd "Nhom22_SessionHijacking/SOURCE"
node server.js
```

---

## 🎯 QUY TRÌNH 4 BƯỚC DEMO THỰC THI

1. **Bước 1 (Nạn nhân đăng nhập):** Nạn nhân mở Chrome vào `http://localhost:3000/login`, đăng nhập với tài khoản `victim` / `uth123` $\rightarrow$ Nhận Session Cookie `SESSION_TOKEN=UTH_SESSION_VICTIM_998877`.
2. **Bước 2 (Tin tặc cướp phiên):**
   * Bắt gói tin qua Wireshark (`http.cookie contains "SESSION_TOKEN"`), trích xuất Cookie dạng plaintext.
   * Mở trình duyệt ẩn danh (chưa đăng nhập), dùng tiện ích **Cookie-Editor** dán Cookie vào và nhấn **F5**.
   * Chiếm quyền tài khoản thành công mà **KHÔNG CẦN PASSWORD**!
3. **Bước 3 (Triển khai phòng thủ):** Bấm nút `🔄 Đổi chế độ bảo mật` $\rightarrow$ Kích hoạt Session Regeneration (token ngẫu nhiên cao) và gắn cờ `HttpOnly; SameSite=Strict`.
4. **Bước 4 (Kiểm chứng hiệu quả):** Mở F12 Console gõ `document.cookie` bị chặn (trả về `""`), Nạn nhân Logout làm vô hiệu hóa token trên máy chủ.
