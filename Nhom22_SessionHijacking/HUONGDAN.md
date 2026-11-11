# TÀI LIỆU HƯỚNG DẪN CÀI ĐẶT VÀ VẬN HÀNH LAB DEMO
# ĐỀ TÀI: TẤN CÔNG CHIẾM QUYỀN ĐIỀU KHIỂN PHIÊN (SESSION HIJACKING)
### Trường Đại học Giao thông vận tải TP.HCM (UTH) - Khoa Công nghệ Thông tin
### Nhóm thực hiện: Nhóm 22 (Phan Nhật Hào - Đào Duy Quân - Nguyễn Quang Vinh)

---

## 1. CẤU TRÚC GÓI TẬP TIN NỘP BÀI (THEO CHUẨN KHOA CNTT - UTH)

Thư mục nộp bài được tổ chức theo đúng quy định tại mục 1 trong file `QUY DINH TRINH BAY BAO CAO BAI TẬP LỚN.pdf`:

```text
Nhom22_SessionHijacking/
├── SETUP/                               # Chứa các file cài đặt và khởi chạy chương trình demo
│   ├── start-lab.bat                    # Script chạy 1-Click trên Windows (tự động bật server & web)
│   ├── start-lab.ps1                    # Script PowerShell khởi chạy tự động
│   ├── Dockerfile                       # File đóng gói container Target Web Server
│   ├── docker-compose.yml               # Cấu hình mạng ảo hóa cô lập an toàn bằng Docker
│   └── vmware-lab-setup.md              # Hướng dẫn chi tiết cấu hình mạng ảo trên VMware Workstation
├── SOURCE/                              # Chứa toàn bộ mã nguồn của ứng dụng web thử nghiệm
│   ├── server.js                        # Mã nguồn máy chủ Cổng thông tin UTH Portal (Node.js)
│   └── package.json                     # Thông tin gói và metadata dự án
├── THESIS/                              # Chứa tài liệu văn bản báo cáo và slide thuyết trình
│   ├── BAO_CAO_DO_AN_SESSION_HIJACKING_UTH.md  # Toàn văn báo cáo đồ án chuẩn format UTH (>25 trang)
│   └── DAN_Y_SLIDE_POWERPOINT.md        # Dàn ý 28 slide PowerPoint chuẩn mẫu UTH (size 32/26)
├── SOFT/                                # Danh mục phần mềm và link tải
│   └── DANH_SACH_PHAN_MEM_VA_LINK_DOWNLOAD.md # Danh sách VMware, Wireshark, Hetty, CAIDO, ZAP
└── HUONGDAN.md                          # Hướng dẫn sử dụng chi tiết (File này)
```

---

## 2. YÊU CẦU MÔI TRƯỜNG TỐI THIỂU
* **Hệ điều hành:** Windows 10/11, macOS hoặc Linux.
* **Môi trường chạy web:** Đã cài đặt **Node.js** (phiên bản v18, v20 hoặc v22 LTS). Kiểm tra bằng lệnh: `node -v`.
* **Trình duyệt web:** Google Chrome, Microsoft Edge hoặc Mozilla Firefox.
* **Tiện ích hỗ trợ:** Cài đặt tiện ích mở rộng **Cookie-Editor** trên trình duyệt của máy Attacker.
* **Công cụ bắt gói tin:** Wireshark hoặc Hetty (đã có sẵn trong thư mục `CEH v13 OCT 2024/MODULE 11/Hetty`).

---

## 3. CÁC CÁCH KHỞI CHẠY LAB DEMO

### CÁCH 1: KHỞI CHẠY NHANH 1-CLICK TRÊN WINDOWS (KHUYÊN DÙNG KHI BẢO VỆ TRỰC TIẾP)
1. Truy cập vào thư mục `Nhom22_SessionHijacking/SETUP/`.
2. **Nhấp đúp chuột vào file `start-lab.bat`**.
3. Cửa sổ Command Prompt sẽ tự động mở lên, khởi chạy Web Server tại cổng `3000` và tự động mở trình duyệt Chrome điều hướng đến:
   `http://localhost:3000/login`
4. Môi trường Lab đã sẵn sàng để demo!

---

### CÁCH 2: KHỞI CHẠY BẰNG MÔI TRƯỜNG ẢO HÓA DOCKER
Nếu muốn chứng minh môi trường Lab được cô lập hoàn toàn bằng Docker với Thầy/Cô:
1. Mở Terminal / PowerShell tại thư mục `Nhom22_SessionHijacking/SETUP/`.
2. Gõ lệnh:
   ```bash
   docker compose up --build
   ```
3. Docker sẽ tự động tạo mạng ảo riêng biệt `uth_session_lab_net` (`192.168.100.0/24`) và cấp IP `192.168.100.10` cho container máy chủ.
4. Truy cập web tại: `http://localhost:3000/login`.

---

### CÁCH 3: KHỞI CHẠY TRÊN HỆ THỐNG MÁY ẢO VMWARE WORKSTATION PRO
1. Cài đặt VMware Workstation Pro từ file:
   `CEH v13 OCT 2024/CEHv13 ISO/VMware Workstation Pro/VMware-workstation-full-17.5.2-23775571.exe`.
2. Đọc và làm theo từng bước trong file hướng dẫn:
   `Nhom22_SessionHijacking/SETUP/vmware-lab-setup.md`.
3. Gán card mạng `VMnet2 (Host-only)` với dải IP `192.168.100.0/24`.

---

## 4. QUY TRÌNH 4 BƯỚC THỰC HIỆN DEMO CHI TIẾT

### BƯỚC 1: ĐĂNG NHẬP HỢP LỆ TRÊN MÁY NẠN NHÂN (VICTIM)
1. Mở trình duyệt Google Chrome thông thường.
2. Truy cập: `http://localhost:3000/login`.
3. Nhập tài khoản thử nghiệm:
   * **Username:** `victim`
   * **Password:** `uth123`
4. Bấm **Đăng nhập** $\rightarrow$ Hệ thống chuyển sang trang `/dashboard`.
5. Quan sát thấy thông tin cá nhân của Nạn nhân: Họ tên, Mã sinh viên, Số tài khoản `0833386443` và Số dư `25,000,000 VNĐ`.

---

### BƯỚC 2: BẮT GÓI TIN VÀ CHIẾM QUYỀN PHIÊN (ATTACKER)

#### 1. Bắt gói tin (Sniffing):
* Mở phần mềm **Wireshark**, chọn card mạng `Loopback` (hoặc card mạng ảo `VMnet2`).
* Gõ bộ lọc (Display Filter):
  ```wireshark
  http.cookie contains "SESSION_TOKEN"
  ```
* Bấm chuột phải vào gói tin `GET /dashboard` $\rightarrow$ Chọn **Follow** $\rightarrow$ **HTTP Stream**.
* Nhìn thấy chuỗi Header dạng văn bản rõ (plaintext):
  `Cookie: SESSION_TOKEN=UTH_SESSION_VICTIM_998877`
* **Copy giá trị token:** `UTH_SESSION_VICTIM_998877`.

#### 2. Chiếm đoạt phiên làm việc (Session Hijacking):
* Mở một **cửa sổ Ẩn danh (Incognito Window)** hoặc mở trình duyệt Microsoft Edge.
* Thử truy cập thẳng `http://localhost:3000/dashboard` $\rightarrow$ Server từ chối và đẩy về trang đăng nhập.
* Nhấp vào biểu tượng tiện ích **Cookie-Editor** trên thanh công cụ trình duyệt:
  * Nhấn nút **Add Cookie (+)**.
  * Nhập:
    * **Name:** `SESSION_TOKEN`
    * **Value:** `UTH_SESSION_VICTIM_998877`
    * **Path:** `/`
  * Nhấn biểu tượng **Lưu (Save)**.
* Trên trình duyệt Attacker, nhấn phím **F5 (Refresh)**.
* 💥 **KẾT QUẢ:** Trình duyệt lập tức hiển thị toàn bộ trang cá nhân của Nạn nhân mà **hoàn toàn không cần username hay password**!

---

### BƯỚC 3: KÍCH HOẠT VÀ MINH HỌA GIẢI PHÁP PHÒNG THỦ
1. Trên giao diện web, nhấp chuột vào liên kết:
   **"🔄 Bấm vào đây để chuyển đổi Chế độ Bảo mật"** (hoặc truy cập `http://localhost:3000/toggle-security`).
2. Huy hiệu chuyển sang màu xanh lục: `🛡️ CHẾ ĐỘ AN TOÀN (HTTPS/Secure / HttpOnly)`.
3. Khi Nạn nhân đăng nhập lại:
   * Server cấp Session Token ngẫu nhiên cao (High Entropy).
   * Server tự động gắn các cờ bảo mật: `HttpOnly; SameSite=Strict`.

---

### BƯỚC 4: KIỂM CHỨNG HIỆU QUẢ SAU PHÒNG VỆ
1. **Kiểm tra chống XSS đánh cắp Cookie:**
   * Tại máy Nạn nhân, nhấn phím `F12` $\rightarrow$ chọn tab **Console**.
   * Gõ lệnh: `document.cookie`.
   * Kết quả: Trả về chuỗi rỗng `""` $\rightarrow$ Chứng minh cờ `HttpOnly` đã chặn hoàn toàn mã kịch bản độc hại.
2. **Kiểm tra chống Replay Attack sau khi Logout:**
   * Nạn nhân bấm nút **"Đăng xuất (Hủy phiên)"**.
   * Trên máy Attacker (vẫn đang giữ cookie cũ), nhấn phím **F5 (Refresh)**.
   * Kết quả: Bị văng ngay ra màn hình đăng nhập vì Server đã xóa phiên trong bộ nhớ RAM (`delete sessions[token]`).

---

## 5. HƯỚNG DẪN XUẤT TÀI LIỆU NỘP BÀI (SANG WORD/PDF)
* File báo cáo toàn văn đã được biên soạn sẵn tại [BAO_CAO_DO_AN_SESSION_HIJACKING_UTH.md](file:///c:/Code/An%20ninh%20m%E1%BA%A1ng/Nhom22_SessionHijacking/THESIS/BAO_CAO_DO_AN_SESSION_HIJACKING_UTH.md).
* Thành viên **Nguyễn Quang Vinh** có thể:
  1. Mở file `.md` bằng phần mềm **Typora**, **VS Code** hoặc công cụ chuyển đổi Pandoc.
  2. Xuất sang định dạng **Microsoft Word (`.docx`)** hoặc **Adobe PDF (`.pdf`)**.
  3. Căn chỉnh lề theo đúng quy định: Lề trên 2cm, lề dưới 2cm, lề trái 3cm, lề phải 2cm, Font Times New Roman cỡ 13, giãn dòng 1.3 - 1.5 lines.
* Sao chép file hoàn thiện vào thư mục `THESIS/` trước khi nén thành file `Nhom22_SessionHijacking.zip` để nộp cho Giảng viên.
