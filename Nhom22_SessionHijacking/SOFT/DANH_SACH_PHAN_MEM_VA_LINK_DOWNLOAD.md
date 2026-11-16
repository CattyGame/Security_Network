# DANH MỤC PHẦN MỀM VÀ ĐƯỜNG DẪN TẢI (SOFT)
### Đề tài: Tấn công chiếm quyền điều khiển phiên (Session Hijacking)
### Nhóm 22 - Đại học Giao thông vận tải TP.HCM (UTH)

---

Theo quy định tại mục 1 trong file `QUY DINH TRINH BAY BAO CAO BAI TẬP LỚN.pdf`:
> *"Thư mục SOFT: chứa các phần mềm liên quan trong quá trình thực hiện báo cáo. Nếu dung lượng lớn có thể nạp dưới dạng Link shared hoặc download."*

Dưới đây là danh sách toàn bộ các phần mềm và môi trường ảo hóa được sử dụng trong đồ án:

---

## 1. PHẦN MỀM MÔI TRƯỜNG ẢO HÓA (VIRTUALIZATION)

### a. VMware Workstation Pro 17.5.2
* **Công dụng:** Tạo và vận hành các máy ảo cô lập (`Target-Web-Server` và `Kali Linux Attacker`), quản lý card mạng ảo (`VMnet8 NAT` / `VMnet2 Host-only`) và tạo **Snapshot** chuyển pha demo.
* **Vị trí file cài đặt có sẵn trong kho dự án:**  
  `CEH v13 OCT 2024/CEHv13 ISO/VMware Workstation Pro/VMware-workstation-full-17.5.2-23775571.exe`
* **Dung lượng:** ~648 MB
* **Link tải chính thức từ Broadcom/VMware:** [https://www.vmware.com/products/workstation-pro.html](https://www.vmware.com/products/workstation-pro.html)

### b. Máy ảo Kali Linux (VMware Pre-built Image)
* **Phiên bản sử dụng trong Lab:** `kali-linux-2026.3-vmware-amd64` (đóng vai máy Attacker và Clone làm máy chủ `Target-Web-Server`).
* **Link tải chính thức từ Offensive Security:** [https://www.kali.org/get-kali/#kali-virtual-machines](https://www.kali.org/get-kali/#kali-virtual-machines)

---

## 2. DỊCH VỤ WEB SERVER & PHÒNG THỦ TRÊN MÁY ẢO SERVER
* **Apache HTTP Server (`apache2`) & PHP (`php`, `libapache2-mod-php`):** Cài đặt trực tiếp trong máy ảo `Target-Web-Server` qua `apt` để chạy ứng dụng Cổng thông tin sinh viên UTH (`login.php`, `dashboard.php`, `logout.php`), bật mô-đun SSL/TLS (`a2enmod ssl`) và cấu hình cờ bảo mật Cookie (`php.ini`).
* **OpenSSL:** Tích hợp sẵn trên Linux để tạo chứng chỉ SSL/TLS cho cổng 443.

---

## 3. CÔNG CỤ BẮT GÓI TIN & KHAI THÁC PHIÊN (TRONG LAB)

### a. Wireshark (Network Protocol Analyzer)
* **Công dụng:** Cài sẵn trong Kali Linux để bắt và phân tích gói tin mạng (`eth0`), trích xuất `Cookie: PHPSESSID=...` ở chế độ HTTP (cổng 80) và kiểm chứng mã hóa `TLSv1.3 Application Data` ở chế độ HTTPS (cổng 443).
* **Link tải chính thức:** [https://www.wireshark.org/download.html](https://www.wireshark.org/download.html)

### b. Trình duyệt Firefox / Google Chrome & Extension Cookie-Editor
* **Công dụng:** Dùng trình duyệt (Chrome trên máy Nạn nhân, Firefox trên Kali Linux Attacker) kết hợp F12 Developer Tools (`Storage` / `Application` / `Console`) và tiện ích **Cookie-Editor** để nạp Cookie đánh cắp và kiểm tra `document.cookie`.
* **Link cài đặt Cookie-Editor cho Chrome / Edge:** [https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm](https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm)
* **Link cài đặt Cookie-Editor cho Firefox:** [https://addons.mozilla.org/en-US/firefox/addon/cookie-editor/](https://addons.mozilla.org/en-US/firefox/addon/cookie-editor/)

---

## 4. BỘ CÔNG CỤ THAM CHIẾU CHUẨN CEH V13 — MODULE 11
Các công cụ bổ trợ chính khóa đi kèm giáo trình **CEH v13** (lưu trữ sẵn trong thư mục giáo trình phục vụ nghiên cứu lý thuyết và so sánh công cụ):

### a. Hetty (Lightweight HTTP Toolkit & MITM Proxy)
* **Vị trí file chạy:** `CEH v13 OCT 2024/MODULE 11/CEHv13 Module 11 Session Hijacking/Hetty/hetty.exe`
* **GitHub Repository:** [https://github.com/dstotijn/hetty](https://github.com/dstotijn/hetty)

### b. CAIDO Desktop (Modern Web Security Toolkit)
* **Vị trí file cài đặt:** `CEH v13 OCT 2024/MODULE 11/CEHv13 Module 11 Session Hijacking/CAIDO/caido-desktop-v0.36.1-win-x86_64.msi`
* **Trang chủ chính thức:** [https://caido.io/](https://caido.io/)

### c. OWASP ZAP (Zed Attack Proxy 2.14.0)
* **Vị trí file cài đặt:** `CEH v13 OCT 2024/MODULE 11/CEHv13 Module 11 Session Hijacking/OWASP ZAP/ZAP_2_14_0_windows.exe`
* **Trang chủ chính thức:** [https://www.zaproxy.org/download/](https://www.zaproxy.org/download/)
