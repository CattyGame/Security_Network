# DANH MỤC PHẦN MỀM VÀ ĐƯỜNG DẪN TẢI (SOFT)
### Đề tài: Tấn công chiếm quyền điều khiển phiên (Session Hijacking)
### Nhóm 22 - Đại học Giao thông vận tải TP.HCM (UTH)

---

Theo quy định tại mục 1 trong file `QUY DINH TRINH BAY BAO CAO BAI TẬP LỚN.pdf`:
> *"Thư mục SOFT: chứa các phần mềm liên quan trong quá trình thực hiện báo cáo. Nếu dung lượng lớn có thể nạp dưới dạng Link shared hoặc download."*

Dưới đây là danh sách toàn bộ các phần mềm được sử dụng trong đồ án, bao gồm vị trí các file cài đặt sẵn có trong thư mục đề tài và link tải trực tiếp từ nhà phát hành chính thức:

---

## 1. PHẦN MỀM ẢO HÓA (VIRTUALIZATION)
* **Tên phần mềm:** **VMware Workstation Pro 17.5.2**
* **Vị trí file cài đặt có sẵn trong thư mục đề tài:**
  `CEH v13 OCT 2024/CEHv13 ISO/VMware Workstation Pro/VMware-workstation-full-17.5.2-23775571.exe`
* **Dung lượng:** ~648 MB
* **Link tải chính thức từ Broadcom/VMware:** [https://www.vmware.com/products/workstation-pro.html](https://www.vmware.com/products/workstation-pro.html)

---

## 2. BỘ CÔNG CỤ CEH V13 MODULE 11: SESSION HIJACKING
Các công cụ tiêu chuẩn quốc tế được EC-Council tích hợp cho Module 11 đã được lưu trữ sẵn trong dự án:

### a. Hetty (Lightweight HTTP Toolkit & MITM Proxy)
* **Vị trí file chạy trực tiếp:** `CEH v13 OCT 2024/MODULE 11/CEHv13 Module 11 Session Hijacking/Hetty/hetty.exe`
* **Bản quyền / Mã nguồn:** Open-source (viết bằng Go, không cần cài đặt, nhấp đúp chạy ngay)
* **GitHub Repository:** [https://github.com/dstotijn/hetty](https://github.com/dstotijn/hetty)

### b. CAIDO Desktop (Modern Web Security Toolkit)
* **Vị trí file cài đặt:** `CEH v13 OCT 2024/MODULE 11/CEHv13 Module 11 Session Hijacking/CAIDO/caido-desktop-v0.36.1-win-x86_64.msi`
* **Dung lượng:** ~47 MB
* **Trang chủ chính thức:** [https://caido.io/](https://caido.io/)

### c. OWASP ZAP (Zed Attack Proxy 2.14.0)
* **Vị trí file cài đặt:** `CEH v13 OCT 2024/MODULE 11/CEHv13 Module 11 Session Hijacking/OWASP ZAP/ZAP_2_14_0_windows.exe`
* **Dung lượng:** ~221 MB
* **Trang chủ chính thức:** [https://www.zaproxy.org/download/](https://www.zaproxy.org/download/)

---

## 3. CÔNG CỤ BẮT GÓI TIN & KIỂM THỬ THỰC NGHIỆM

### a. Wireshark (Network Protocol Analyzer)
* **Công dụng:** Bắt và phân tích gói tin HTTP/TCP, trích xuất Cookie plaintext trên đường truyền mạng.
* **Link tải chính thức:** [https://www.wireshark.org/download.html](https://www.wireshark.org/download.html)

### b. Extension Cookie-Editor
* **Công dụng:** Quản lý, trích xuất và bơm (inject) Cookie trực tiếp trên trình duyệt máy Attacker để thực hiện tấn công cướp quyền phiên.
* **Link cài đặt Chrome / Edge Web Store:** [https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm](https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm)
* **Link cài đặt Firefox Add-ons:** [https://addons.mozilla.org/en-US/firefox/addon/cookie-editor/](https://addons.mozilla.org/en-US/firefox/addon/cookie-editor/)

### c. Môi trường Node.js (Cho Target Web Server)
* **Phiên bản khuyến nghị:** Node.js v20.x hoặc v22.x LTS
* **Link tải chính thức:** [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
