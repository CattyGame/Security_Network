# DÀN Ý CHI TIẾT SLIDE THUYẾT TRÌNH BẢO VỆ ĐỒ ÁN AN NINH MẠNG
### Trường Đại học Giao thông vận tải TP.HCM (UTH) - Khoa Công nghệ Thông tin
### Đề tài: Tấn công chiếm quyền điều khiển phiên (Session Hijacking)
### Nhóm thực hiện: Nhóm 22 (Phan Nhật Hào - Đào Duy Quân - Nguyễn Quang Vinh)

---

## 📌 QUY CHUẨN THIẾT KẾ SLIDE (THEO YÊU CẦU CỦA KHOA CNTT - UTH)
* **Số lượng slide:** 28 slide (Nằm trong khung quy định từ **25 đến 40 slide** của trường).
* **Mẫu giao diện:** Sử dụng Slide mẫu (Template PowerPoint) chính thức của UTH (màu chủ đạo: Xanh dương UTH `#0054A6`, trắng và vàng kim).
* **Quy chuẩn Font chữ:**
  * **Tiêu đề Slide (Slide Title):** Font Sans-serif (Arial / Calibri / Segoe UI), **Size 32**, In hoa, In đậm.
  * **Nội dung Slide (Body Content):** Font đồng nhất, **Size 26**, dãn dòng thoáng, trình bày dưới dạng gạch đầu dòng ngắn gọn (Bullet points), tránh viết thành đoạn văn dài.

---

## CHI TIẾT NỘI DUNG TỪNG SLIDE (SLIDE 1 ĐẾN SLIDE 28)

### SLIDE 1: TRANG TIÊU ĐỀ (TITLE SLIDE)
* **Tiêu đề (Size 32):** BÁO CÁO BÀI TẬP LỚN AN NINH MẠNG
* **Tên đề tài:** TẤN CÔNG CHIẾM QUYỀN ĐIỀU KHIỂN PHIÊN (SESSION HIJACKING)
* **Nội dung (Size 26):**
  * Đơn vị: Trường Đại học Giao thông vận tải TP.HCM (UTH) — Khoa CNTT
  * Nhóm thực hiện: **Nhóm 22**
  * Thành viên: Phan Nhật Hào, Đào Duy Quân, Nguyễn Quang Vinh
  * GVHD: [Tên Giảng viên bộ môn]

---

### SLIDE 2: MỤC LỤC & TÓM TẮT NỘI DUNG BÁO CÁO (AGENDA)
* **Tiêu đề (Size 32):** TỔNG QUAN NỘI DUNG BÁO CÁO
* **Nội dung (Size 26):**
  1. Lý thuyết tổng quan về Session, Cookie & Lỗ hổng HTTP
  2. Phân loại kỹ thuật Session Hijacking (Chuẩn CEH v13)
  3. Mô hình triển khai mạng Lab an toàn
  4. Thực nghiệm kịch bản tấn công (Live Demo)
  5. Đề xuất giải pháp phòng thủ & Kiểm chứng hiệu quả
  6. Kết luận & Bài học kinh nghiệm cho doanh nghiệp

---

### SLIDE 3: BẢN CHẤT STATELESS CỦA GIAO THỨC HTTP
* **Tiêu đề (Size 32):** TÍNH CHẤT PHI TRẠNG THÁI CỦA GIAO THỨC HTTP
* **Nội dung (Size 26):**
  * HTTP được thiết kế là giao thức **Stateless (Phi trạng thái)**
  * Mỗi Request/Response được xử lý hoàn toàn độc lập
  * Máy chủ không lưu nhớ danh tính người dùng giữa các kết nối
  * Đặt ra bài toán: Làm thế nào để duy trì trạng thái đăng nhập?

---

### SLIDE 4: GIẢI PHÁP DUY TRÌ PHIÊN: SESSION VÀ COOKIE
* **Tiêu đề (Size 32):** CƠ CHẾ DUY TRÌ PHIÊN: SESSION & COOKIE
* **Nội dung (Size 26):**
  * **Session (Phía Server):** Bộ nhớ lưu trữ dữ liệu cá nhân & quyền hạn
  * **Cookie (Phía Client):** Tệp tin nhỏ do Server cấp thông qua `Set-Cookie`
  * Trình duyệt tự động gửi Cookie kèm theo các Request tiếp theo
  * **Session ID/Token:** Chiếc chìa khóa định danh người dùng

---

### SLIDE 5: VÒNG ĐỜI CỦA MỘT PHIÊN LÀM VIỆC (SESSION LIFECYCLE)
* **Tiêu đề (Size 32):** VÒNG ĐỜI CỦA PHIÊN LÀM VIỆC
* **Nội dung (Size 26):**
  * **1. Khởi tạo (Creation):** Sinh mã phiên khi người dùng đăng nhập đúng
  * **2. Duy trì (Maintenance):** Đối chiếu Session ID trong mỗi request
  * **3. Tái sinh (Regeneration):** Đổi ID mới khi nâng cấp đặc quyền
  * **4. Hủy phiên (Termination):** Xóa session khi Logout hoặc Timeout

---

### SLIDE 6: ĐỊNH NGHĨA TẤN CÔNG SESSION HIJACKING (CEH V13)
* **Tiêu đề (Size 32):** TẤN CÔNG CHIẾM QUYỀN PHIÊN (SESSION HIJACKING)
* **Nội dung (Size 26):**
  * Định nghĩa theo chuẩn EC-Council CEH v13 - Module 11
  * Khai thác một phiên làm việc hợp lệ đang hoạt động của nạn nhân
  * Chiếm đoạt quyền truy cập trái phép mà **KHÔNG CẦN BIẾT MẬT KHẨU**
  * Bỏ qua các bước xác thực ban đầu (Username, Password, CAPTCHA)

---

### SLIDE 7: PHÂN BIỆT CỐT LÕI: HIJACKING VS. SPOOFING
* **Tiêu đề (Size 32):** PHÂN BIỆT SESSION HIJACKING VÀ SPOOFING
* **Nội dung (Size 26):**
  * **Session Hijacking:** Cướp một phiên **đang tồn tại (Active Session)**
  * **Session Spoofing:** Giả mạo IP/MAC để **tự tạo một phiên mới**
  * Giảng viên phản biện thường xoáy sâu vào sự khác biệt này!

---

### SLIDE 8: PHÂN LOẠI: NETWORK-LEVEL SESSION HIJACKING
* **Tiêu đề (Size 32):** HIJACKING Ở TẦNG MẠNG (NETWORK-LEVEL)
* **Nội dung (Size 26):**
  * Diễn ra tại Tầng 3 (Network) & Tầng 4 (Transport) của mô hình OSI
  * Kỹ thuật: Dự đoán số thứ tự tuần tự gói tin (**TCP Sequence Number**)
  * Gửi gói tin RST (Reset) để ngắt kết nối của nạn nhân
  * Chèn gói tin giả mạo (Packet Injection) vào luồng TCP

---

### SLIDE 9: PHÂN LOẠI: APPLICATION-LEVEL SESSION HIJACKING
* **Tiêu đề (Size 32):** HIJACKING Ở TẦNG ỨNG DỤNG (APPLICATION-LEVEL)
* **Nội dung (Size 26):**
  * Diễn ra tại Tầng 7 (Application Layer) trên các giao thức Web
  * Mục tiêu đánh cắp: **Session ID / Cookie / Token**
  * Các con đường khai thác:
    * Nghe lén đường truyền không mã hóa (HTTP Sniffing)
    * Tấn công Cross-Site Scripting (XSS cướp Cookie)
    * Cố định phiên (Session Fixation) & Đoán trước phiên (Prediction)

---

### SLIDE 10: TỬ HUYỆT CỦA GIAO THỨC KHÔNG BẢO MẬT (HTTP)
* **Tiêu đề (Size 32):** VÌ SAO GIAO THỨC HTTP LÀ "TỬ HUYỆT"?
* **Nội dung (Size 26):**
  * Giao thức HTTP (port 80) truyền dữ liệu dạng **Bản rõ (Plaintext)**
  * Không có mã hóa (No Encryption)
  * Không có kiểm tra tính toàn vẹn (No Data Integrity)
  * Bất kỳ ai trong cùng mạng LAN/Wi-Fi đều bắt và đọc được Cookie!

---

### SLIDE 11: CÁC CÔNG CỤ CEH V13 DÙNG TRONG NGHIÊN CỨU
* **Tiêu đề (Size 32):** BỘ CÔNG CỤ CHUẨN EC-COUNCIL CEH V13
* **Nội dung (Size 26):**
  * **CAIDO Desktop:** Modern Web Proxy viết bằng Rust, siêu nhẹ và nhanh
  * **Hetty:** MITM Proxy viết bằng Go tích hợp sẵn Web UI tối giản
  * **OWASP ZAP:** Công cụ quét lỗ hổng và phân tích độ ngẫu nhiên Session
  * **Wireshark:** Bắt và phân tích gói tin mạng tầng sâu
  * **Cookie-Editor:** Tiện ích nạp Cookie trực tiếp trên trình duyệt

---

### SLIDE 12: MÔ HÌNH KIẾN TRÚC PHÒNG LAB ẢO HÓA AN TOÀN
* **Tiêu đề (Size 32):** MÔ HÌNH LAB ẢO HÓA AN TOÀN (TOPOLOGY)
* **Nội dung (Size 26):**
  * Đáp ứng tiêu chuẩn mục 2 trong file `DeTai.pdf` của UTH
  * Chạy hoàn toàn trên **VMware Workstation Pro 17** (dải mạng `192.168.60.0/24`)
  * Sử dụng 2 máy ảo Linux + máy Host Windows trong mạng nội bộ tách biệt
  * Quản lý từng pha thử nghiệm bằng **VMware Snapshot**

---

### SLIDE 13: CÁC THỰC THỂ TRONG MÔ HÌNH LAB
* **Tiêu đề (Size 32):** PHÂN VAI CÁC THỰC THỂ TRONG HỆ THỐNG LAB
* **Nội dung (Size 26):**
  * **1. `Target-Web-Server` (`192.168.60.129`):** Máy ảo Linux chạy Apache2 + PHP (Cổng 80/443)
  * **2. Nạn nhân — Victim (`192.168.60.1`):** Máy Windows mở Chrome đăng nhập UTH Portal
  * **3. Tin tặc — Attacker (`kali-linux`):** VM Kali chạy Wireshark (`eth0`) & Firefox

---

### SLIDE 14: KỊCH BẢN TỔNG THỂ 4 BƯỚC DEMO
* **Tiêu đề (Size 32):** KỊCH BẢN THỰC NGHIỆM 4 BƯỚC DEMO
* **Nội dung (Size 26):**
  * **Bước 1:** Thiết lập môi trường Lab ảo hóa VMware (Apache2 + PHP)
  * **Bước 2:** Thực hiện tấn công nghe lén & chiếm phiên trên HTTP (Cổng 80)
  * **Bước 3:** Triển khai phòng thủ (HTTPS 443 + `HttpOnly`/`Secure` + Logout)
  * **Bước 4:** Kiểm chứng hiệu quả trên Wireshark, F12 Console và Firefox Attacker

---

### SLIDE 15: BƯỚC 1 - THIẾT LẬP MÔI TRƯỜNG LAB
* **Tiêu đề (Size 32):** BƯỚC 1: THIẾT LẬP MÔI TRƯỜNG LAB
* **Nội dung (Size 26):**
  * Khởi động 2 máy ảo `Target-Web-Server` & `kali-linux` trên VMware
  * `Target-Web-Server` chạy Apache2 + PHP (`login.php`, `dashboard.php`, `logout.php`)
  * Trạng thái ban đầu (Snapshot `Http`): Mở cổng HTTP 80, tắt cờ `HttpOnly`
  * Máy Kali Attacker bật **Wireshark** bắt gói tin trên card `eth0`

---

### SLIDE 16: BƯỚC 2 (PHA 1) - NẠN NHÂN ĐĂNG NHẬP HỢP PHÁP
* **Tiêu đề (Size 32):** NẠN NHÂN ĐĂNG NHẬP CỔNG THÔNG TIN UTH
* **Nội dung (Size 26):**
  * Nạn nhân truy cập `http://192.168.60.129/login.php`
  * Đăng nhập thành công với tài khoản: `victim` / `uth123`
  * Xem hồ sơ cá nhân và số dư ví học phí: **25.000.000 VNĐ**
  * Server cấp Session Cookie mặc định PHP: `PHPSESSID=...` (không có cờ bảo mật)

---

### SLIDE 17: BƯỚC 2 (PHA 2) - BẮT GÓI TIN TRÊN WIRESHARK
* **Tiêu đề (Size 32):** TIN TẶC BẮT GÓI TIN CHỨA COOKIE
* **Nội dung (Size 26):**
  * Bộ lọc Wireshark: `http.cookie contains "PHPSESSID"`
  * Dữ liệu truyền dạng plaintext lộ rõ 100% qua `Follow -> HTTP Stream`
  * Attacker trích xuất nguyên giá trị `PHPSESSID` mà không cần bẻ khóa mật khẩu!

---

### SLIDE 18: BƯỚC 2 (PHA 3) - CHIẾM QUYỀN PHIÊN (SESSION HIJACKING)
* **Tiêu đề (Size 32):** CHIẾM QUYỀN PHIÊN TRÊN FIREFOX (KALI LINUX)
* **Nội dung (Size 26):**
  * Attacker mở Firefox trên Kali (chưa đăng nhập, truy cập `/dashboard.php` bị chặn)
  * Mở F12 $\rightarrow$ tab `Storage` (hoặc Cookie-Editor) thêm Cookie `PHPSESSID` vừa bắt được
  * Truy cập lại `http://192.168.60.129/dashboard.php` $\rightarrow$ Vào thẳng trang nạn nhân!
  * **Chiếm quyền thành công 100% mà KHÔNG CẦN USERNAME/PASSWORD!**

---

### SLIDE 19: BƯỚC 3 - TRIỂN KHAI PHÒNG THỦ MÃ HÓA HTTPS
* **Tiêu đề (Size 32):** PHÒNG THỦ: MÃ HÓA TOÀN TRÌNH VỚI HTTPS
* **Nội dung (Size 26):**
  * Bật SSL/TLS cổng 443 trên Apache2: `a2enmod ssl && a2ensite default-ssl.conf`
  * Toàn bộ HTTP Header (kể cả `PHPSESSID`) bị mã hóa bằng TLS 1.3
  * Bộ lọc `http.cookie contains "PHPSESSID"` trên Wireshark trả về **trống**
  * Lọc `tcp.port == 443` chỉ thấy các gói tin `TLSv1.3 Application Data` vô nghĩa

---

### SLIDE 20: BƯỚC 3 - CẤU HÌNH CÁC CỜ COOKIE BẢO MẬT
* **Tiêu đề (Size 32):** THIẾT LẬP CỜ BẢO MẬT TRONG `php.ini`
* **Nội dung (Size 26):**
  * **`session.cookie_httponly = 1`:** Ngăn JavaScript (`document.cookie`) đọc Cookie (chống XSS)
  * **`session.cookie_secure = 1`:** Bắt buộc Cookie chỉ truyền qua HTTPS (chống Wireshark)
  * **`session.cookie_samesite = "Strict"`:** Ngăn chặn tấn công giả mạo yêu cầu CSRF

---

### SLIDE 21: BƯỚC 3 - TÁI TẠO PHIÊN & HỦY PHIÊN KHI ĐĂNG XUẤT
* **Tiêu đề (Size 32):** TÁI TẠO MÃ PHIÊN & HỦY PHIÊN KHI LOGOUT
* **Nội dung (Size 26):**
  * **Session Regeneration:** Dùng `session_regenerate_id(true)` sau khi đăng nhập (chống Fixation)
  * **Session Timeout:** Giới hạn thời gian sống `session.gc_maxlifetime`
  * **Logout an toàn (`logout.php`):** Xóa `$_SESSION`, hết hạn Cookie và gọi `session_destroy()`

---

### SLIDE 22: BƯỚC 4 - KIỂM CHỨNG HIỆU QUẢ SAU PHÒNG VỆ
* **Tiêu đề (Size 32):** BƯỚC 4: KIỂM CHỨNG LẠI HIỆU QUẢ PHÒNG THỦ
* **Nội dung (Size 26):**
  * **1. Chống Sniffing:** Wireshark cổng 443 chỉ thấy `TLSv1.3 Application Data`
  * **2. Chống XSS:** Gõ `document.cookie` trên F12 Console $\rightarrow$ Trả về rỗng `""`
  * **3. Chống Replay:** Nạn nhân bấm Đăng xuất $\rightarrow$ Attacker F5 bị văng ra trang Login!

---

### SLIDE 23: SO SÁNH TRƯỚC VÀ SAU KHI ÁP DỤNG PHÒNG THỦ
* **Tiêu đề (Size 32):** BẢNG SO SÁNH TRƯỚC VÀ SAU BẢO MẬT
* **Nội dung (Size 26):**
  * *Trước bảo vệ:* HTTP Plaintext, Cookie không cờ, dễ dàng bị cướp phiên
  * *Sau bảo vệ:* HTTPS mã hóa, có cờ `HttpOnly`, `SameSite`, Token ngẫu nhiên cao
  * Hệ thống đạt tiêu chuẩn an toàn thông tin cơ bản

---

### SLIDE 24: PHÂN CÔNG NHIỆM VỤ THỰC HIỆN TRONG NHÓM 22
* **Tiêu đề (Size 32):** PHÂN CÔNG TRÁCH NHIỆM THÀNH VIÊN
* **Nội dung (Size 26):**
  * **Phan Nhật Hào:** Trưởng nhóm, thiết lập mạng Lab & Bắt gói tin Wireshark
  * **Đào Duy Quân:** Công cụ CEH, kỹ thuật khai thác & Demo Cookie-Editor
  * **Nguyễn Quang Vinh:** Giải pháp phòng thủ, soạn thảo Báo cáo & Slide

---

### SLIDE 25: BÀI HỌC KINH NGHIỆM CHO DOANH NGHIỆP
* **Tiêu đề (Size 32):** BÀI HỌC KINH NGHIỆM CHO DOANH NGHIỆP
* **Nội dung (Size 26):**
  * Khai tử hoàn toàn giao thức HTTP trên môi trường production
  * Tuân thủ khuyến nghị OWASP Session Management Cheat Sheet
  * Áp dụng kiến trúc bảo mật nhiều lớp: Defense-in-Depth
  * Tích hợp xác thực hai yếu tố (2FA / OTP) cho các giao dịch nhạy cảm

---

### SLIDE 26: ĐÁNH GIÁ TÍNH KHẢ THI VÀ HẠN CHẾ CỦA ĐỒ ÁN
* **Tiêu đề (Size 32):** ĐÁNH GIÁ KẾT QUẢ & HẠN CHẾ
* **Nội dung (Size 26):**
  * **Đạt được:** Hoàn thành 100% mục tiêu lý thuyết và kịch bản thực nghiệm
  * **Hạn chế:** Mới thử nghiệm trên môi trường Lab cục bộ
  * **Hướng phát triển:** Nghiên cứu kỹ thuật Fingerprinting nâng cao (TLS/Canvas)

---

### SLIDE 27: KẾT LUẬN TỔNG THỂ
* **Tiêu đề (Size 32):** KẾT LUẬN ĐỒ ÁN
* **Nội dung (Size 26):**
  * Session Hijacking là mối đe dọa thực tế, mức độ rủi ro rất cao
  * Giao thức không bảo mật là nguyên nhân trực tiếp dẫn đến lộ lọt Cookie
  * Biện pháp phòng thủ hiệu quả nhất là kết hợp: HTTPS + Cờ Cookie + Quản lý vòng đời phiên chuẩn mực

---

### SLIDE 28: LỜI CẢM ƠN VÀ HỎI ĐÁP (Q&A)
* **Tiêu đề (Size 32):** XIN CHÂN THÀNH CẢM ƠN!
* **Nội dung (Size 26):**
  * Cảm ơn Quý Thầy/Cô và các bạn sinh viên đã chú ý lắng nghe!
  * **NHÓM 22 SẴN SÀNG LẮNG NGHE CÂU HỎI VÀ GÓP Ý TỪ HỘI ĐỒNG.**
  * *Q & A Session*
