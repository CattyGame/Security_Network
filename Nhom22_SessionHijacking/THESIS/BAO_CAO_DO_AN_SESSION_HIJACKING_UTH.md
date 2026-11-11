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
* **Hình 2.1:** Sơ đồ kiến trúc mạng Lab ảo hóa trên VMware Workstation Pro / Docker.
* **Hình 3.1:** Giao diện đăng nhập Cổng thông tin sinh viên UTH ở chế độ HTTP Plaintext.
* **Hình 3.2:** Bắt gói tin chứa trường `Cookie: SESSION_TOKEN` trên Wireshark.
* **Hình 3.3:** Bơm Cookie thành công bằng tiện ích Cookie-Editor trên trình duyệt Attacker.
* **Hình 3.4:** Trang cá nhân và số dư tài khoản của nạn nhân bị chiếm đoạt.
* **Hình 4.1:** Kích hoạt chế độ bảo mật với cờ `HttpOnly` và `SameSite`.
* **Hình 4.2:** Kết quả kiểm chứng mã độc JavaScript không thể đọc cookie sau khi có phòng thủ.
* **Bảng 1.1:** Bảng so sánh thuộc tính các cờ bảo mật của Cookie.
* **Bảng 1.2:** Bảng so sánh bản chất Session Hijacking và Session Spoofing.
* **Bảng 4.1:** Bảng phân chia trách nhiệm và ma trận phân công công việc Nhóm 22.

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
  * 2.3. Cấu hình phân đoạn mạng ảo hóa (VMware Workstation / Docker)
  * 2.4. Triển khai ứng dụng Web mục tiêu (Target Web Application)
* **CHƯƠNG 3: KỊCH BẢN VÀ THỰC NGHIỆM TẤN CÔNG (EXPLOITATION PHASE)**
  * 3.1. Kịch bản tổng thể
  * 3.2. Pha 1: Nạn nhân đăng nhập hợp lệ qua HTTP
  * 3.3. Pha 2: Bắt gói tin và trích xuất Session Cookie (Wireshark & Hetty)
  * 3.4. Pha 3: Chiếm quyền phiên làm việc (Session Hijacking via Cookie Injection)
* **CHƯƠNG 4: GIẢI PHÁP PHÒNG THỦ VÀ KIỂM CHỨNG HIỆU QUẢ**
  * 4.1. Mã hóa toàn trình với HTTPS và kích hoạt HSTS
  * 4.2. Cấu hình cờ bảo mật `HttpOnly`, `Secure`, `SameSite`
  * 4.3. Tái tạo mã phiên sau đăng nhập (Session Regeneration)
  * 4.4. Quản lý thời gian sống và hủy phiên triệt để khi Logout
  * 4.5. Thực nghiệm kiểm chứng lại sau khi áp dụng phòng thủ
* **CHƯƠNG 5: KẾT LUẬN VÀ BÀI HỌC KINH NGHIỆM CHO DOANH NGHIỆP**
  * 5.1. Đánh giá kết quả đạt được của đề tài
  * 5.2. Bài học khuyến nghị an toàn cho các tổ chức giáo dục và doanh nghiệp
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
Theo đúng quy định tại mục 2 trong file `DeTai.pdf` của Khoa CNTT - UTH, nhóm thiết lập môi trường Lab ảo hóa cô lập (Isolated Network) để đảm bảo an toàn tuyệt đối.

## 2.2. Sơ đồ mạng Lab (Network Topology)
Mô hình mạng bao gồm 3 thực thể kết nối vào cùng dải mạng ảo `192.168.100.0/24`:
1. **Target Web Server (192.168.100.10):** Chạy ứng dụng Cổng thông tin sinh viên UTH tại cổng HTTP 3000 (`demo-lab/server.js`).
2. **Victim Client (192.168.100.20):** Máy nạn nhân sử dụng trình duyệt Google Chrome đăng nhập tài khoản sinh viên.
3. **Attacker Client (192.168.100.30):** Máy kẻ tấn công chạy Wireshark, Hetty và trình duyệt ẩn danh tích hợp Cookie-Editor.

## 2.3. Cấu hình phân đoạn mạng ảo hóa (VMware Workstation / Docker)
* **Phương án VMware Workstation Pro:** Sử dụng card mạng `VMnet2 (Host-only)`, cấu hình DHCP cấp dải IP `192.168.100.0/24`.
* **Phương án Docker:** Sử dụng `docker-compose.yml` tạo mạng ảo bridge `uth_session_lab_net` với IP tĩnh `192.168.100.10` cho container máy chủ.

## 2.4. Triển khai ứng dụng Web mục tiêu (Target Web Application)
Nhóm tự xây dựng ứng dụng web độc lập bằng Node.js thuần (không phụ thuộc thư viện ngoài), hỗ trợ 2 chế độ:
* Chế độ Lỗ hổng (Vulnerable Mode): HTTP Plaintext, Cookie không có cờ bảo mật.
* Chế độ An toàn (Secured Mode): Session ID ngẫu nhiên cao, có cờ `HttpOnly`, `SameSite=Strict`.

---

\newpage

# CHƯƠNG 3: KỊCH BẢN VÀ THỰC NGHIỆM TẤN CÔNG (EXPLOITATION PHASE)

## 3.1. Kịch bản tổng thể
Kịch bản mô phỏng tình huống một sinh viên UTH kết nối vào mạng Wi-Fi trường học (hoặc quán cà phê) và đăng nhập vào cổng thông tin đào tạo chạy giao thức HTTP không mã hóa. Một kẻ tấn công cùng kết nối mạng này sẽ bắt gói tin, trích xuất Cookie và chiếm đoạt tài khoản.

## 3.2. Pha 1: Nạn nhân đăng nhập hợp lệ qua HTTP
* Nạn nhân truy cập `http://localhost:3000/login` và nhập tài khoản: `victim` / `uth123`.
* Đăng nhập thành công, màn hình hiển thị hồ sơ sinh viên:
  * Họ tên: *Nguyễn Văn Nạn Nhân*
  * Mã sinh viên: *2251120000*
  * Số tài khoản: *0833386443*
  * Số dư ví học phí: *25,000,000 VNĐ*
* Server cấp Cookie: `SESSION_TOKEN=UTH_SESSION_VICTIM_998877`.

## 3.3. Pha 2: Bắt gói tin và trích xuất Session Cookie (Wireshark & Hetty)
* Attacker khởi động Wireshark trên card mạng chung, lọc cú pháp:
  `http.cookie contains "SESSION_TOKEN"`
* Attacker phân tích gói tin `GET /dashboard HTTP/1.1` và trích xuất được nguyên vẹn chuỗi:
  `Cookie: SESSION_TOKEN=UTH_SESSION_VICTIM_998877`

## 3.4. Pha 3: Chiếm quyền phiên làm việc (Session Hijacking via Cookie Injection)
* Attacker mở một trình duyệt hoàn toàn mới (cửa sổ ẩn danh). Khi truy cập thẳng `/dashboard`, Server từ chối và đẩy về trang đăng nhập.
* Attacker mở tiện ích **Cookie-Editor**, thêm cookie mới:
  * Name: `SESSION_TOKEN`
  * Value: `UTH_SESSION_VICTIM_998877`
  * Path: `/`
* Attacker nhấn **F5 (Refresh)** $\rightarrow$ Giao diện lập tức hiển thị toàn bộ hồ sơ cá nhân và số dư 25 triệu VNĐ của nạn nhân mà **hoàn toàn không cần nhập mật khẩu**!

---

\newpage

# CHƯƠNG 4: GIẢI PHÁP PHÒNG THỦ VÀ KIỂM CHỨNG HIỆU QUẢ

## 4.1. Mã hóa toàn trình với HTTPS và kích hoạt HSTS
Mã hóa lớp giao vận TLS 1.3 biến toàn bộ Header `Cookie` thành chuỗi ciphertext ngẫu nhiên. Kẻ tấn công bắt gói tin trên Wireshark chỉ nhìn thấy các gói tin `TLS Application Data`.

## 4.2. Cấu hình cờ bảo mật `HttpOnly`, `Secure`, `SameSite`
* `HttpOnly`: Triệt tiêu nguy cơ mã độc JavaScript đọc trộm Cookie khi web có lỗ hổng XSS.
* `Secure`: Chỉ cho phép gửi Cookie qua kênh mã hóa HTTPS.
* `SameSite=Strict`: Ngăn chặn tấn công CSRF.

## 4.3. Tái tạo mã phiên sau đăng nhập (Session Regeneration)
Mỗi khi người dùng đăng nhập thành công, máy chủ lập tức hủy Session ID cũ và phát hành một Session ID ngẫu nhiên mới với độ dài tối thiểu 128-bit (High Entropy), triệt tiêu lỗ hổng Session Fixation.

## 4.4. Quản lý thời gian sống và hủy phiên triệt để khi Logout
* Thiết lập thời gian chờ không thao tác (Idle Timeout - 15 phút) và thời gian sống tối đa (Absolute Timeout - 8 tiếng).
* Khi người dùng nhấn "Đăng xuất", máy chủ thực thi lệnh xóa bản ghi phiên trong bộ nhớ RAM (`delete sessions[token]`) và gửi yêu cầu xóa cookie trên trình duyệt.

## 4.5. Thực nghiệm kiểm chứng lại sau khi áp dụng phòng thủ
1. **Kiểm chứng cờ `HttpOnly`:** Mở tab Console trên trình duyệt nạn nhân gõ `document.cookie` $\rightarrow$ Trình duyệt trả về chuỗi rỗng `""`.
2. **Kiểm chứng hủy phiên sau Logout:** Sau khi nạn nhân bấm Đăng xuất, Attacker bấm F5 $\rightarrow$ Ngay lập tức bị văng ra trang đăng nhập vì Session ID cũ đã bị hủy hoàn toàn trên máy chủ.

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

# TÀI LIỆU THAM KHẢO

1. **EC-Council (2024)**, *Certified Ethical Hacker (CEH) v13 Courseware - Module 11: Session Hijacking*, EC-Council Press.
2. **OWASP Foundation (2023)**, *Session Management Cheat Sheet*, [https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
3. **Mozilla Developer Network (MDN Web Docs)**, *Using HTTP cookies & Cookie security flags*, [https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
4. **RFC 6265**, *HTTP State Management Mechanism*, Internet Engineering Task Force (IETF).
5. **Khoa Công nghệ Thông tin - Trường ĐH Giao thông vận tải TP.HCM (UTH)**, *Quy định hình thức trình bày Báo cáo bài tập lớn môn An toàn thông tin* và *Danh mục đề tài BTL An ninh mạng*.
