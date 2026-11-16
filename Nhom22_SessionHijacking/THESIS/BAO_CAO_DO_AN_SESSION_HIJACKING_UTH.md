# BỘ GIAO THÔNG VẬN TẢI
## TRƯỜNG ĐẠI HỌC GIAO THÔNG VẬN TẢI TP. HỒ CHÍ MINH
### KHOA CÔNG NGHỆ THÔNG TIN

---

<br><br><br>

# BÁO CÁO BÀI TẬP LỚN MÔN AN TOÀN THÔNG TIN

## ĐỀ TÀI:
# TẤN CÔNG CHIẾM QUYỀN ĐIỀU KHIỂN PHIÊN (SESSION HIJACKING): DEMO CÁCH ĐÁNH CẮP COOKIE VÀ CHIẾM PHIÊN LÀM VIỆC CỦA NGƯỜI DÙNG TRÊN CÁC GIAO THỨC KHÔNG BẢO MẬT

<br><br><br>

* **NGÀNH:** CÔNG NGHỆ THÔNG TIN
* **CHUYÊN NGÀNH:** AN TOÀN THÔNG TIN / MẠNG MÁY TÍNH
* **NHÓM THỰC HIỆN:** **NHÓM 22**
* **DANH SÁCH SINH VIÊN:**
  1. **Phan Nhật Hào** — MSSV: [Điền MSSV]
  2. **Đào Duy Quân** — MSSV: [Điền MSSV]
  3. **Nguyễn Quang Vinh** — MSSV: [Điền MSSV]
* **SỐ ĐIỆN THOẠI LIÊN HỆ:** 0833386443
* **GIẢNG VIÊN HƯỚNG DẪN:** [Điền tên Thầy/Cô bộ môn]

<br><br><br>

### TP. Hồ Chí Minh, Tháng 11 Năm 2026

---

\newpage

## LỜI CẢM ƠN

Lời đầu tiên, Nhóm 22 chúng em xin gửi lời cảm ơn chân thành và sâu sắc nhất đến Ban Giám hiệu Trường Đại học Giao thông vận tải TP.HCM (UTH), Ban Chủ nhiệm Khoa Công nghệ Thông tin, cùng toàn thể Quý Thầy/Cô bộ môn An ninh mạng / An toàn thông tin đã tận tình truyền đạt cho chúng em những nền tảng kiến thức quý báu và thực tiễn trong suốt quá trình học tập.

Đặc biệt, chúng em xin bày tỏ lòng biết ơn sâu sắc đến Thầy/Cô phụ trách học phần đã định hướng đề tài, tận tình hướng dẫn và tạo điều kiện thuận lợi nhất để nhóm có thể nghiên cứu, hoàn thiện mô hình phòng thí nghiệm thực nghiệm và báo cáo chuyên đề: *"Tấn công chiếm quyền điều khiển phiên (Session Hijacking): Demo cách đánh cắp Cookie và chiếm phiên làm việc của người dùng trên các giao thức không bảo mật"*.

Mặc dù cả nhóm đã nỗ lực hết mình để tìm hiểu giáo trình quốc tế CEH v13, xây dựng hệ thống Lab ảo hóa và thực hiện các kịch bản thực nghiệm, song do kiến thức và kinh nghiệm thực tế còn hạn chế nên báo cáo khó tránh khỏi những thiếu sót nhất định. Chúng em rất mong nhận được những ý kiến đóng góp, nhận xét quý báu từ Quý Thầy/Cô trong Hội đồng chấm đồ án để bài báo cáo của nhóm được hoàn thiện hơn nữa.

Chúng em xin kính chúc Quý Thầy/Cô dồi dào sức khỏe, hạnh phúc và gặt hái được nhiều thành công trong sự nghiệp trồng người cao quý!

*TP. Hồ Chí Minh, ngày 11 tháng 11 năm 2026*  
**Tập thể Nhóm 22**

---

\newpage

## DANH MỤC CÁC TỪ VIẾT TẮT

| Từ viết tắt | Tên tiếng Anh đầy đủ | Ý nghĩa tiếng Việt |
| :--- | :--- | :--- |
| **HTTP** | Hypertext Transfer Protocol | Giao thức truyền tải siêu văn bản (không mã hóa) |
| **HTTPS** | Hypertext Transfer Protocol Secure | Giao thức truyền tải siêu văn bản an toàn (có mã hóa TLS/SSL) |
| **TLS/SSL** | Transport Layer Security / Secure Sockets Layer | Giao thức bảo mật tầng giao vận |
| **TCP** | Transmission Control Protocol | Giao thức điều khiển truyền vận |
| **IP** | Internet Protocol | Giao thức mạng Internet |
| **XSS** | Cross-Site Scripting | Lỗ hổng chèn mã kịch bản độc hại chéo trang |
| **CSRF** | Cross-Site Request Forgery | Tấn công giả mạo yêu cầu chéo trang |
| **MITM** | Man-in-the-Middle | Kỹ thuật tấn công kẻ đứng giữa |
| **CEH** | Certified Ethical Hacker | Chứng chỉ Chuyên gia kiểm thử xâm nhập đạo đức (EC-Council) |
| **UTH** | Ho Chi Minh City University of Transport | Trường Đại học Giao thông vận tải TP.HCM |
| **HSTS** | HTTP Strict Transport Security | Cơ chế ép buộc sử dụng HTTPS của trình duyệt |
| **ARP** | Address Resolution Protocol | Giao thức phân giải địa chỉ IP sang MAC |

---

\newpage

## DANH MỤC HÌNH ẢNH VÀ BẢNG BIỂU

* **Hình 1.1:** Sơ đồ bản chất Stateless của giao thức HTTP.
* **Hình 1.2:** Cơ chế trao đổi Session ID và Cookie giữa Client và Server.
* **Hình 1.3:** Phân loại các hình thức tấn công Session Hijacking theo CEH v13.
* **Hình 2.1:** Sơ đồ kiến trúc mạng Lab ảo hóa trên VMware Workstation Pro.
* **Hình 3.1:** Giao diện đăng nhập Cổng thông tin sinh viên UTH ở chế độ HTTP Plaintext (cổng 80).
* **Hình 3.2:** Bắt gói tin chứa trường `Cookie: PHPSESSID` dưới dạng bản rõ trên Wireshark.
* **Hình 3.3:** Bơm Cookie `PHPSESSID` vào trình duyệt Firefox trên máy ảo Kali Linux.
* **Hình 3.4:** Trang cá nhân và số dư ví học phí 25.000.000 VNĐ của nạn nhân bị chiếm đoạt không cần mật khẩu.
* **Hình 4.1:** Lưu lượng HTTPS (SSL/TLS cổng 443) bị mã hóa thành `TLSv1.3 Application Data` trên Wireshark.
* **Hình 4.2:** Thuộc tính cờ `HttpOnly`, `Secure`, `SameSite` trong DevTools và kết quả kiểm chứng `document.cookie` trả về `""`.
* **Hình 4.3:** Kiểm chứng hủy phiên sau khi Đăng xuất (`logout.php`) khiến trình duyệt kẻ tấn công bị đá về trang đăng nhập.
* **Bảng 1.1:** Bảng so sánh thuộc tính các cờ bảo mật của Cookie.
* **Bảng 1.2:** Bảng so sánh bản chất Session Hijacking và Session Spoofing.
* **Bảng 4.1:** Bảng phân chia trách nhiệm và kết quả thực nghiệm Nhóm 22.

---

\newpage

## MỤC LỤC BÁO CÁO

* **LỜI CẢM ƠN**
* **DANH MỤC CÁC TỪ VIẾT TẮT**
* **DANH MỤC HÌNH ẢNH VÀ BẢNG BIỂU**
* **PHẦN MỞ ĐẦU**
* **CHƯƠNG 1: CƠ SỞ LÝ THUYẾT VỀ PHIÊN LÀM VIỆC VÀ TẤN CÔNG SESSION HIJACKING**
  * 1.1. Bản chất Stateless của giao thức HTTP và sự ra đời của Session/Cookie
  * 1.2. Cơ chế hoạt động của Cookie và các thuộc tính bảo mật
  * 1.3. Tổng quan về tấn công chiếm quyền điều khiển phiên (Session Hijacking)
  * 1.4. Phân biệt cốt lõi: Session Hijacking vs. Session Spoofing
  * 1.5. Phân loại Session Hijacking (Network-Level vs. Application-Level)
  * 1.6. Vì sao giao thức không bảo mật (HTTP) là tử huyệt của phiên làm việc?
* **CHƯƠNG 2: THIẾT KẾ MÔ HÌNH LAB ẢO HÓA AN TOÀN**
  * 2.1. Yêu cầu kiến trúc và tính an toàn của môi trường Lab
  * 2.2. Sơ đồ mạng Lab (Network Topology)
  * 2.3. Cấu hình phân đoạn mạng ảo hóa trên VMware Workstation Pro
  * 2.4. Triển khai ứng dụng Web mục tiêu trên Apache2 và PHP
* **CHƯƠNG 3: KỊCH BẢN VÀ THỰC NGHIỆM TẤN CÔNG (EXPLOITATION PHASE)**
  * 3.1. Kịch bản tổng thể
  * 3.2. Pha 1: Nạn nhân đăng nhập hợp lệ qua HTTP (Cổng 80)
  * 3.3. Pha 2: Bắt gói tin và trích xuất `PHPSESSID` trên Wireshark
  * 3.4. Pha 3: Chiếm quyền phiên làm việc trên Kali Linux (Session Replay)
* **CHƯƠNG 4: GIẢI PHÁP PHÒNG THỦ VÀ KIỂM CHỨNG HIỆU QUẢ**
  * 4.1. Mã hóa toàn trình với HTTPS (SSL/TLS cổng 443) và HSTS
  * 4.2. Cấu hình cờ bảo mật `HttpOnly`, `Secure`, `SameSite` trong `php.ini`
  * 4.3. Tái tạo mã phiên sau đăng nhập (Session Regeneration)
  * 4.4. Quản lý thời gian sống và hủy phiên triệt để khi Logout
  * 4.5. Thực nghiệm kiểm chứng lại sau khi áp dụng phòng thủ
* **CHƯƠNG 5: KẾT LUẬN VÀ BÀI HỌC KINH NGHIỆM CHO DOANH NGHIỆP**
  * 5.1. Đánh giá kết quả đạt được của đề tài
  * 5.2. Bài học khuyến nghị an toàn cho các tổ chức giáo dục và doanh nghiệp
* **PHỤ LỤC**
* **TÀI LIỆU THAM KHẢO**

---

\newpage

# PHẦN MỞ ĐẦU

Trong kỷ nguyên chuyển đổi số hiện nay, các ứng dụng Web đã trở thành phương tiện kết nối chủ đạo cho mọi hoạt động đời sống: từ hệ thống ngân hàng trực tuyến (E-Banking), các sàn giao dịch thương mại điện tử, cho đến các cổng thông tin đào tạo của các trường Đại học. Người dùng chỉ cần đăng nhập một lần là có thể tự do thao tác, duyệt qua hàng loạt chức năng bảo mật mà không cần nhập lại mật khẩu. Cơ chế duy trì trạng thái đăng nhập tiện lợi này dựa hoàn toàn vào khái niệm **Phiên làm việc (Session)** và **Cookie**.

Tuy nhiên, nếu ứng dụng được triển khai trên các giao thức không bảo mật (như HTTP cổng 80) hoặc thiếu các chính sách phòng thủ nghiêm ngặt, Session Token sẽ trở thành miếng mồi ngon cho tin tặc. Chỉ bằng kỹ thuật nghe lén đường truyền (Sniffing), tin tặc có thể đánh cắp Cookie và tiếp quản toàn bộ tài khoản nạn nhân mà hoàn toàn không cần giải mã mật khẩu. Kỹ thuật này được gọi là **Tấn công chiếm quyền điều khiển phiên (Session Hijacking)**.

Nhận thức được mức độ nghiêm trọng của mối đe dọa này, **Nhóm 22** đã lựa chọn đề tài: *"Tấn công chiếm quyền điều khiển phiên (Session Hijacking): Demo cách đánh cắp Cookie và chiếm phiên làm việc của người dùng trên các giao thức không bảo mật"* nhằm phân tích sâu bản chất kỹ thuật theo chuẩn giáo trình quốc tế **CEH v13 - Module 11**, đồng thời xây dựng một môi trường Lab ảo hóa hoàn chỉnh để thực nghiệm kịch bản tấn công và đề xuất các giải pháp phòng thủ vững chắc.

---

\newpage

# CHƯƠNG 1: CƠ SỞ LÝ THUYẾT VỀ PHIÊN LÀM VIỆC VÀ TẤN CÔNG SESSION HIJACKING

## 1.1. Bản chất Stateless của giao thức HTTP và sự ra đời của Session/Cookie
Giao thức HTTP (Hypertext Transfer Protocol) là một giao thức phi trạng thái (Stateless). Máy chủ web sau khi nhận và phản hồi một yêu cầu từ trình duyệt sẽ không lưu giữ bất kỳ thông tin nào về danh tính của kết nối đó. Để khắc phục nhược điểm này:
* **Session (Phía Máy chủ):** Là cấu trúc dữ liệu lưu trong bộ nhớ máy chủ (RAM, Redis, Database), đại diện cho phiên tương tác của một người dùng cụ thể.
* **Cookie (Phía Trình duyệt):** Là một tập tin văn bản nhỏ do máy chủ tạo ra và gửi về lưu trữ tại trình duyệt người dùng thông qua Header phản hồi `Set-Cookie`. Trong mỗi yêu cầu tiếp theo, trình duyệt sẽ tự động đính kèm Cookie này vào Header `Cookie` để máy chủ nhận diện phiên làm việc hợp lệ.

## 1.2. Cơ chế hoạt động của Cookie và các thuộc tính bảo mật
Một Cookie bảo mật chuẩn cần mang các cờ thuộc tính sau:
* `HttpOnly`: Ngăn chặn mã độc JavaScript (XSS) truy cập vào thuộc tính `document.cookie`.
* `Secure`: Ép buộc Cookie chỉ được gửi qua kết nối HTTPS đã mã hóa TLS/SSL.
* `SameSite=Strict/Lax`: Chống tấn công giả mạo yêu cầu chéo trang (CSRF).
* `Expires/Max-Age`: Xác định thời gian tồn tại của Cookie.

## 1.3. Tổng quan về tấn công chiếm quyền điều khiển phiên (Session Hijacking)
Theo giáo trình **EC-Council CEH v13 - Module 11**, Session Hijacking là kỹ thuật tấn công trong đó kẻ xâm nhập khai thác một phiên làm việc đang có hiệu lực của nạn nhân để chiếm quyền truy cập trái phép. Kẻ tấn công không cần bẻ khóa mật khẩu gốc, mà chỉ cần đánh cắp Session ID hợp lệ.

## 1.4. Phân biệt cốt lõi: Session Hijacking vs. Session Spoofing
* **Session Spoofing:** Kẻ tấn công giả mạo địa chỉ IP/MAC để tự tạo một kết nối mới với Server dưới danh nghĩa nạn nhân (nạn nhân chưa hề có phiên làm việc đang hoạt động).
* **Session Hijacking:** Nạn nhân đã đăng nhập hợp pháp và đang có một phiên làm việc tích cực (Active Session). Kẻ tấn công cướp lấy Session ID này và tiếp quản trực tiếp phiên đó.

## 1.5. Phân loại Session Hijacking (Network-Level vs. Application-Level)
* **Network-Level Hijacking (Tầng 3 & 4):** Tấn công vào các gói tin TCP/IP, dự đoán số thứ tự tuần tự (TCP Sequence Number - SEQ/ACK), bơm gói RST để ngắt phiên nạn nhân và bơm gói tin giả mạo.
* **Application-Level Hijacking (Tầng 7):** Đánh cắp chuỗi Session Token/Cookie thông qua nghe lén HTTP Cleartext, tấn công XSS, Session Fixation hoặc đoán Session ID. Đây chính là trọng tâm nghiên cứu của nhóm.

## 1.6. Vì sao giao thức không bảo mật (HTTP) là tử huyệt của phiên làm việc?
Giao thức HTTP truyền toàn bộ dữ liệu (URL, tham số POST, Header `Cookie`) dưới dạng bản rõ (plaintext). Bất kỳ ai trong cùng mạng LAN, mạng Wi-Fi công cộng hoặc thiết bị định tuyến trung gian đều có thể bắt gói tin bằng card mạng ở chế độ Promiscuous Mode và đọc được Session Cookie mà không gặp bất kỳ rào cản mật mã nào.

---

\newpage

# CHƯƠNG 2: THIẾT KẾ MÔ HÌNH LAB ẢO HÓA AN TOÀN

## 2.1. Yêu cầu kiến trúc và tính an toàn của môi trường Lab
Theo đúng quy định tại mục 2 trong file `DeTai.pdf` của Khoa CNTT - UTH, nhóm triển khai toàn bộ bài thực nghiệm trên **phần mềm ảo hóa VMware Workstation Pro** tạo thành một mạng nội bộ ảo cô lập (Isolated Virtual Network), đảm bảo các thao tác nghe lén gói tin và chiếm quyền phiên diễn ra an toàn, không ảnh hưởng đến hệ thống mạng thật bên ngoài.

## 2.2. Sơ đồ mạng Lab (Network Topology)
Mô hình mạng ảo gồm 3 thực thể kết nối chung dải mạng nội bộ VMware `192.168.60.0/24`:
1. **Máy chủ Mục tiêu — `Target-Web-Server` (`192.168.60.129`):** Máy ảo Linux (Clone từ Kali/Debian VMware) cài đặt **Apache2 + PHP**, chạy ứng dụng Cổng thông tin sinh viên UTH (`login.php`, `dashboard.php`, `logout.php`) trên cổng HTTP 80 (giai đoạn tấn công) và HTTPS 443 (giai đoạn phòng thủ).
2. **Máy Nạn nhân — Victim Host (`192.168.60.1`):** Máy Windows sử dụng trình duyệt Google Chrome truy cập và đăng nhập tài khoản sinh viên UTH.
3. **Máy Tấn công — `kali-linux-2026.3-vmware-amd64` (Attacker VM):** Máy ảo Kali Linux chạy **Wireshark** lắng nghe trên card mạng `eth0` và trình duyệt **Firefox** (F12 Storage / Cookie-Editor) để thực hiện phát lại phiên (Session Replay).

## 2.3. Cấu hình phân đoạn mạng ảo hóa trên VMware Workstation Pro
* **Card mạng ảo:** Sử dụng mạng ảo VMware `VMnet8 (NAT)` dải `192.168.60.0/24` (hoặc `VMnet2 Host-only` dải `192.168.100.0/24` nếu bổ sung thêm máy ảo Windows Victim tách biệt hoàn toàn với máy thật).
* **Quản lý trạng thái thử nghiệm bằng Snapshot:** Trên máy ảo `Target-Web-Server`, nhóm thiết lập cây **Snapshot** gồm 3 mốc (`Http` $\rightarrow$ `https (SSL/TLS port 443)` $\rightarrow$ `HttpOnly Flag`) để đối chứng chính xác kết quả trước và sau khi áp dụng từng lớp phòng vệ.

## 2.4. Triển khai ứng dụng Web mục tiêu trên Apache2 và PHP
Nhóm tự xây dựng ứng dụng web PHP thuần triển khai tại thư mục `/var/www/html/` của máy chủ Apache2 (`login.php`, `dashboard.php`, `logout.php`), mô phỏng hệ thống quản lý hồ sơ và ví học phí sinh viên UTH sử dụng cookie phiên mặc định **`PHPSESSID`**:
* **Giai đoạn Tấn công (Chế độ lỗ hổng):** Máy chủ chỉ mở HTTP (cổng 80), trong `/etc/php/*/apache2/php.ini` các cờ `session.cookie_httponly` và `session.cookie_secure` đều chưa kích hoạt (trống/tắt).
* **Giai đoạn Phòng thủ (Chế độ bảo mật):** Kích hoạt mô-đun SSL/TLS của Apache2 (`a2enmod ssl`, cổng 443), cấu hình `session.cookie_httponly = 1`, `session.cookie_secure = 1`, `session.cookie_samesite = "Strict"` và áp dụng hủy phiên triệt để trên máy chủ trong `logout.php`.

---

\newpage

# CHƯƠNG 3: KỊCH BẢN VÀ THỰC NGHIỆM TẤN CÔNG (EXPLOITATION PHASE)

## 3.1. Kịch bản tổng thể
Kịch bản mô phỏng tình huống một sinh viên UTH kết nối vào mạng LAN/Wi-Fi dùng chung và đăng nhập vào cổng thông tin đào tạo chạy giao thức HTTP không mã hóa (cổng 80). Một kẻ tấn công sử dụng máy ảo Kali Linux trong cùng phân đoạn mạng sẽ bắt gói tin, trích xuất mã phiên `PHPSESSID` và chiếm đoạt tài khoản mà không cần biết mật khẩu.

## 3.2. Pha 1: Nạn nhân đăng nhập hợp lệ qua HTTP (Cổng 80)
* Nạn nhân mở trình duyệt Chrome truy cập địa chỉ: `http://192.168.60.129/login.php`.
* Nhập thông tin tài khoản thử nghiệm: `victim` / `uth123` và nhấn **Đăng nhập**.
* Trình duyệt chuyển hướng đến `http://192.168.60.129/dashboard.php`, hiển thị thông tin nhạy cảm:
  * Họ tên: *Nguyễn Văn Nạn Nhân (Sinh viên UTH)*
  * Mã sinh viên: *2251120000*
  * Số tài khoản: *0833386443*
  * Số dư ví học phí: *25.000.000 VNĐ*
* Server cấp Session Cookie mặc định của PHP dưới dạng bản rõ: `PHPSESSID=b02e9600847bccc441c369f21ba6d8ad` (cả `HttpOnly` và `Secure` đều là `false`).

## 3.3. Pha 2: Bắt gói tin và trích xuất `PHPSESSID` trên Wireshark
* Trên máy ảo **Kali Linux**, Attacker mở **Wireshark** (`sudo wireshark`), bắt gói tin trên interface **`eth0`** và áp dụng bộ lọc Display Filter:
  `http.cookie contains "PHPSESSID"`
* Khi Nạn nhân gửi yêu cầu truy cập `dashboard.php`, Wireshark lập tức bắt được gói tin `GET /dashboard.php HTTP/1.1`.
* Attacker nhấp chuột phải $\rightarrow$ chọn **Follow $\rightarrow$ HTTP Stream** và đọc được nguyên văn HTTP Header truyền dạng **plaintext**:
  `Cookie: PHPSESSID=b02e9600847bccc441c369f21ba6d8ad`

## 3.4. Pha 3: Chiếm quyền phiên làm việc trên Kali Linux (Session Replay)
* Attacker mở trình duyệt **Firefox** trên máy ảo Kali Linux (chưa từng đăng nhập) và thử truy cập thẳng vào `http://192.168.60.129/dashboard.php`.
* Do chưa có Cookie hợp lệ, Web Server từ chối và chuyển hướng về `http://192.168.60.129/login.php?error=unauthorized`.
* Attacker nhấn `F12` mở Developer Tools $\rightarrow$ chọn tab **Storage $\rightarrow$ Cookies $\rightarrow$ `http://192.168.60.129`** (hoặc dùng tiện ích **Cookie-Editor**), thêm Cookie mới:
  * **Name:** `PHPSESSID`
  * **Value:** `b02e9600847bccc441c369f21ba6d8ad`
  * **Path:** `/`
* Attacker truy cập lại địa chỉ `http://192.168.60.129/dashboard.php` $\rightarrow$ Giao diện lập tức hiển thị toàn bộ hồ sơ cá nhân và số dư ví học phí 25.000.000 VNĐ của nạn nhân mà **hoàn toàn không cần biết username hay password**!

---

\newpage

# CHƯƠNG 4: GIẢI PHÁP PHÒNG THỦ VÀ KIỂM CHỨNG HIỆU QUẢ

## 4.1. Mã hóa toàn trình với HTTPS (SSL/TLS cổng 443) và HSTS
Trên máy ảo `Target-Web-Server`, nhóm kích hoạt giao thức HTTPS cho Apache2 (`sudo a2enmod ssl`, `sudo a2ensite default-ssl.conf`, `sudo systemctl restart apache2`). Mã hóa lớp giao vận TLS biến toàn bộ HTTP Header (bao gồm `Cookie: PHPSESSID=...`) và dữ liệu trang web thành chuỗi bản mã ngẫu nhiên. Kết hợp với chính sách **HSTS (HTTP Strict Transport Security)**, trình duyệt được ép buộc chỉ giao tiếp qua HTTPS nhằm chống lại tấn công hạ cấp giao thức (SSL Stripping).

## 4.2. Cấu hình cờ bảo mật `HttpOnly`, `Secure`, `SameSite` trong `php.ini`
Nhóm cấu hình trong tệp `/etc/php/*/apache2/php.ini` của máy chủ Apache:
* `session.cookie_httponly = 1` (**`HttpOnly`**): Cấm JavaScript (F12 Console hoặc mã độc XSS) truy cập `document.cookie` (áp dụng cho cả HTTP và HTTPS).
* `session.cookie_secure = 1` (**`Secure`**): Chỉ cho phép trình duyệt gửi Cookie qua kết nối đã mã hóa HTTPS (cổng 443), tuyệt đối không gửi qua HTTP cổng 80.
* `session.cookie_samesite = "Strict"` (**`SameSite=Strict`**): Ngăn chặn tấn công giả mạo yêu cầu chéo trang CSRF.

## 4.3. Tái tạo mã phiên sau đăng nhập (Session Regeneration)
Khi người dùng đăng nhập thành công trong `login.php`, ứng dụng gọi hàm `session_regenerate_id(true)` để hủy Session ID cũ và cấp phát một Session ID ngẫu nhiên mới với độ dài và độ ngẫu nhiên cao (High Entropy), triệt tiêu lỗ hổng Session Fixation.

## 4.4. Quản lý thời gian sống và hủy phiên triệt để khi Logout
* Thiết lập thời gian hết hạn phiên trên máy chủ (`session.gc_maxlifetime`) phù hợp với mức độ nhạy cảm của ứng dụng.
* Trong tệp `logout.php`, khi người dùng nhấn **"Đăng xuất (Hủy phiên)"**, máy chủ đồng thời thực thi 3 thao tác: xóa sạch mảng `$_SESSION = array()`, gửi lệnh hết hạn Cookie về quá khứ qua `setcookie(..., time() - 42000)`, và gọi **`session_destroy()`** để hủy vĩnh viễn tập tin phiên trên Server.

## 4.5. Thực nghiệm kiểm chứng lại sau khi áp dụng phòng thủ
1. **Kiểm chứng chống nghe lén qua HTTPS (Port 443):** Khi nạn nhân đăng nhập qua `https://192.168.60.129/login.php`, bộ lọc `http.cookie contains "PHPSESSID"` trên Wireshark của Kali trả về **0 gói tin**. Lọc `tcp.port == 443` chỉ hiển thị **`TLSv1.3 Application Data`** đã bị mã hóa hoàn toàn.
2. **Kiểm chứng cờ `HttpOnly` (Chống XSS):** Sau khi bật `session.cookie_httponly = 1`, khởi động lại Apache và đăng nhập lại, gõ `document.cookie` trên tab Console (F12) của Chrome trả về chuỗi rỗng **`""`**; kiểm tra tab **Application $\rightarrow$ Cookies** thấy đã kích hoạt đầy đủ dấu tích ở cột `HttpOnly`, `Secure` và `SameSite = Strict`.
3. **Kiểm chứng hủy phiên sau Logout (Chống Replay Attack):** Ngay khi nạn nhân bấm nút **"Đăng xuất (Hủy phiên)"**, kẻ tấn công trên Kali Linux nhấn `F5` trên trang `dashboard.php` lập tức bị từ chối và đẩy văng về `login.php?error=unauthorized`, chứng minh mã `PHPSESSID` cũ đã bị vô hiệu hóa hoàn toàn trên máy chủ.

---

\newpage

# CHƯƠNG 5: KẾT LUẬN VÀ BÀI HỌC KINH NGHIỆM CHO DOANH NGHIỆP

## 5.1. Đánh giá kết quả đạt được của đề tài
* Nhóm 22 đã hoàn thành 100% mục tiêu đề ra:
  * Nắm vững cơ sở lý thuyết chuẩn quốc tế theo giáo trình EC-Council CEH v13 Module 11.
  * Dựng thành công mô hình mạng Lab ảo hóa an toàn đáp ứng đúng quy định của Khoa CNTT - UTH.
  * Thực hiện thành công kịch bản tấn công chiếm quyền phiên trên giao thức HTTP không bảo mật và chứng minh giải pháp phòng vệ vững chắc.

## 5.2. Bài học khuyến nghị an toàn cho các tổ chức giáo dục và doanh nghiệp
1. Tuyệt đối **khai tử các giao thức truyền tin plaintext** (HTTP, Telnet, FTP), áp dụng HTTPS 100% trên toàn bộ các trang nội bộ và công cộng.
2. Áp dụng nghiêm ngặt các cờ bảo mật `HttpOnly`, `Secure`, `SameSite` cho mọi Cookie xác thực.
3. Luôn thực hiện tái tạo phiên (Session Regeneration) sau xác thực và thu hồi phiên triệt để khi người dùng đăng xuất.
4. Triển khai kiến trúc phòng thủ chiều sâu (Defense-in-Depth) kết hợp xác thực đa yếu tố (MFA/2FA) và giám sát bất thường (Anomaly Detection).

---

\newpage

# PHỤ LỤC

## Phụ lục A: Các lệnh cấu hình Web Server và Bảo mật trên `Target-Web-Server`
1. **Cài đặt Apache2 và PHP:**
   ```bash
   sudo apt update && sudo apt install -y apache2 php libapache2-mod-php
   sudo cp login.php dashboard.php logout.php /var/www/html/
   sudo systemctl enable --now apache2
   ```
2. **Kích hoạt HTTPS (SSL/TLS cổng 443):**
   ```bash
   sudo a2enmod ssl
   sudo a2ensite default-ssl.conf
   sudo systemctl restart apache2
   ```
3. **Cấu hình cờ bảo mật Cookie trong `/etc/php/*/apache2/php.ini`:**
   ```ini
   session.cookie_httponly = 1
   session.cookie_secure = 1
   session.cookie_samesite = "Strict"
   ```

## Phụ lục B: Trích đoạn mã nguồn xử lý phiên (`logout.php` & tăng cường `login.php`)
```php
// Trích đoạn logout.php — Hủy phiên toàn diện trên Server và Client
session_start();
$_SESSION = array();
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}
session_destroy();
header('Location: login.php');
exit;
```

```php
// Khuyến nghị bổ sung trong login.php ngay sau khi xác thực thành công
session_regenerate_id(true);
```

---

\newpage

# TÀI LIỆU THAM KHẢO

1. **EC-Council (2024)**, *Certified Ethical Hacker (CEH) v13 Courseware - Module 11: Session Hijacking*, EC-Council Press.
2. **OWASP Foundation (2023)**, *Session Management Cheat Sheet*, [https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
3. **Mozilla Developer Network (MDN Web Docs)**, *Using HTTP cookies & Cookie security flags*, [https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
4. **RFC 6265**, *HTTP State Management Mechanism*, Internet Engineering Task Force (IETF).
5. **Khoa Công nghệ Thông tin - Trường ĐH Giao thông vận tải TP.HCM (UTH)**, *Quy định hình thức trình bày Báo cáo bài tập lớn môn An toàn thông tin* và *Danh mục đề tài BTL An ninh mạng*.
