# KẾ HOẠCH ĐỒ ÁN MÔN HỌC: AN NINH MẠNG
## ĐỀ TÀI: TẤN CÔNG CHIẾM QUYỀN ĐIỀU KHIỂN PHIÊN (SESSION HIJACKING)
**Trường Đại học Giao thông vận tải TP.HCM (UTH) - Khoa Công nghệ Thông tin**

---

## 1. THÔNG TIN CHUNG

* **Tên đề tài:** Tấn công chiếm quyền điều khiển phiên (Session Hijacking): Demo cách đánh cắp Cookie và chiếm phiên làm việc của người dùng trên các giao thức không bảo mật.
* **Nhóm thực hiện:** Nhóm 22
* **Số lượng thành viên:** 3 người
  1. **Phan Nhật Hào** (PH)
  2. **Đào Duy Quân** (ĐQ)
  3. **Nguyễn Quang Vinh** (NV)
* **Tài nguyên tham chiếu:**
  * Giáo trình chuẩn quốc tế: **EC-Council CEH v13 - Module 11: Session Hijacking**
  * Bộ công cụ CEH v13 đi kèm: **CAIDO**, **Hetty**, **OWASP ZAP** (trong thư mục `CEH v13 OCT 2024/MODULE 11`)

---

## 2. YÊU CẦU TỐI THIỂU CỦA ĐỀ TÀI (MINIMUM VIABLE PROJECT - MVP)

Để hoàn thành tốt đồ án môn An ninh mạng tại UTH và đạt điểm số tối đa từ giảng viên, nhóm cần đáp ứng các tiêu chuẩn tối thiểu sau:

### 2.1. Yêu cầu về Lý thuyết
* **Bản chất của Phiên làm việc (Session) & Cookie:** Giải thích được vì sao giao thức HTTP là *stateless* (phi trạng thái) và cần cơ chế Session/Cookie để duy trì trạng thái đăng nhập của người dùng.
* **Khái niệm Session Hijacking:** Trình bày được định nghĩa, phân loại (Passive vs. Active, Application-Level vs. Network-Level), sự khác biệt giữa *Spoofing* (mạo danh) và *Hijacking* (chiếm quyền phiên đang hoạt động).
* **Điểm yếu của giao thức không bảo mật:** Phân tích lý do vì sao các giao thức truyền thông plaintext như **HTTP (port 80)**, FTP, Telnet lại tạo điều kiện để tin tặc nghe lén và trích xuất Session ID/Cookie mà không cần biết mật khẩu gốc.

### 2.2. Yêu cầu về Môi trường Lab (Thử nghiệm an toàn)
* Xây dựng mô hình mạng nội bộ thử nghiệm (dùng VMware Workstation / VirtualBox hoặc các máy trong cùng mạng LAN):
  * **Máy Chủ (Server/Target App):** Triển khai ứng dụng web PHP/Apache2 trên máy ảo VMware (`Target-Web-Server`) chạy HTTP cổng 80.
  * **Máy Nạn nhân (Victim):** Đăng nhập vào ứng dụng web trên kênh HTTP bình thường.
  * **Máy Tấn công (Attacker):** Cùng dải mạng nội bộ hoặc đứng ở vị trí Man-in-the-Middle để nghe lén/can thiệp lưu lượng.

### 2.3. Yêu cầu về Kịch bản Demo thực nghiệm (Bắt buộc)
1. **Thu thập Cookie / Session ID:**
   * Attacker bắt gói tin HTTP chưa được mã hóa khi Victim gửi request lên máy chủ.
   * Định danh chính xác trường Session Cookie trong HTTP Header (ví dụ: `Cookie: PHPSESSID=...` hoặc `token=...`).
2. **Chiếm quyền phiên (Session Replay / Session Hijacking):**
   * Attacker mở một trình duyệt hoàn toàn mới (chưa từng đăng nhập).
   * Dùng công cụ (như extension **Cookie-Editor**, Web Developer Console, hoặc Intercepting Proxy) để bơm (inject) Cookie của nạn nhân vào trình duyệt của Attacker.
   * Refresh (F5) trang: Trình duyệt của Attacker lập tức nhận diện trạng thái đã đăng nhập của Nạn nhân mà **hoàn toàn không cần username hay password**.
   * Thực hiện một hành động nhạy cảm (đổi thông tin cá nhân, xem dữ liệu nội bộ) dưới danh nghĩa Nạn nhân.

### 2.4. Yêu cầu về Giải pháp Phòng chống & Minh chứng (Countermeasures)
* Không chỉ dừng lại ở demo tấn công, nhóm phải trình bày và demo được giải pháp khắc phục:
  * **Triển khai HTTPS (TLS/SSL):** Mã hóa toàn bộ dữ liệu trên đường truyền, chứng minh Attacker bắt gói tin chỉ thấy ciphertext, không đọc được Cookie.
  * **Cấu hình cờ bảo mật cho Cookie:**
    * `HttpOnly`: Ngăn chặn JavaScript đọc Cookie (chống XSS đánh cắp cookie).
    * `Secure`: Chỉ cho phép Cookie được gửi qua kênh HTTPS.
    * `SameSite=Strict/Lax`: Chống tấn công CSRF.
  * **Tái tạo Session ID (Session Regeneration):** Cấp Session ID mới ngay sau khi đăng nhập thành công để chống Session Fixation.
  * **Session Timeout & Invalidation:** Thiết lập thời gian hết hạn phiên và hủy phiên cả trên Server lẫn Client khi người dùng nhấn Logout.

### 2.5. Yêu cầu về Sản phẩm nộp
* **Báo cáo đồ án (Report Word/PDF):** Trình bày chuẩn format UTH, có đầy đủ mục lục, sơ đồ mạng, hình ảnh chụp từng bước cấu hình và tấn công, phân tích kết quả và kết luận.
* **Slide báo cáo (PowerPoint/Canva):** Thiết kế trực quan, súc tích, làm nổi bật sơ đồ tấn công và so sánh trước - sau khi áp dụng biện pháp phòng vệ.
* **Video Demo kịch bản (Backup):** Quay video màn hình chất lượng cao rõ nét các bước demo, có thuyết minh hoặc chú thích, phòng trường hợp demo trực tiếp gặp sự cố mạng trong buổi bảo vệ.

---

## 3. GIẢI THÍCH CHI TIẾT CÁC CÔNG CỤ CEH TRONG MODULE 11

Trong thư mục `CEH v13 OCT 2024/MODULE 11`, EC-Council đã tích hợp 3 công cụ intercepting proxy và toolkit bảo mật tiêu biểu, kết hợp cùng các công cụ kinh điển của CEH:

```
MODULE 11/
└── CEHv13 Module 11 Session Hijacking/
    ├── CAIDO/             (caido-desktop-v0.36.1-win-x86_64.msi)
    ├── Hetty/             (hetty.exe)
    └── OWASP ZAP/         (ZAP_2_14_0_windows.exe)
```

### 3.1. OWASP ZAP (Zed Attack Proxy)
* **Bản chất:** Là một trong những công cụ kiểm thử bảo mật ứng dụng web nguồn mở (open-source) phổ biến và mạnh mẽ nhất thế giới, được duy trì bởi tổ chức bảo mật OWASP.
* **Chức năng chính trong Session Hijacking:**
  * **Intercepting Proxy (Chặn bắt & Can thiệp):** Đứng giữa trình duyệt và Web Server, chặn từng gói tin HTTP Request/Response để xem trực tiếp cấu trúc Cookie, Header `Set-Cookie` và Session Token.
  * **Session ID Analysis / Token Analysis:** ZAP có module phân tích độ ngẫu nhiên (entropy) của Session Token để kiểm tra xem thuật toán sinh session ID của ứng dụng có dễ bị đoán trước (Predictable Session Token) hay không.
  * **Active Scanner / Fuzzer:** Tự động dò quét các lỗ hổng liên quan đến phiên làm việc như Session Fixation, Cross-Site Scripting (XSS dẫn đến rò rỉ cookie), thiếu cờ bảo mật `HttpOnly`/`Secure`.
* **Ứng dụng trong đồ án:** Dùng ZAP làm proxy trung gian để chặn bắt request đăng nhập của Victim, trích xuất cookie và dùng tính năng *Manual Request Editor* hoặc *Fuzzer* để thử nghiệm gửi request với session token giả lập.

### 3.2. CAIDO (Modern Web Security Toolkit)
* **Bản chất:** Caido là một bộ công cụ kiểm thử web thế hệ mới được viết hoàn toàn bằng ngôn ngữ **Rust**, hướng tới trở thành giải pháp thay thế gọn nhẹ, tốc độ cực nhanh và tiêu tốn rất ít RAM so với Burp Suite hay ZAP.
* **Chức năng chính trong Session Hijacking:**
  * **Interception & Tampering siêu mượt:** Cho phép hacker/pentester tạm dừng HTTP traffic giữa chừng, chỉnh sửa Session Cookie trên header trước khi chuyển tiếp (forward) đến Web Server.
  * **HTTP History & Cookie Filter:** Tự động phân loại, lọc và hiển thị tất cả các Session Cookies xuất hiện trong quá trình tương tác của người dùng.
  * **Replay Engine:** Cho phép Attacker nhân bản các request trước đó, thay đổi giá trị Cookie hoặc User-Agent để tái tạo lại phiên làm việc (Replay Attack) mà không cần thao tác thủ công trên giao diện web.
* **Ứng dụng trong đồ án:** Cực kỳ thích hợp để cài trên máy Attacker làm proxy kiểm soát phiên hoặc dùng tính năng Replay để minh họa cách Attacker dùng lại Session Cookie đã đánh cắp để truy vấn tài nguyên nhạy cảm.

### 3.3. Hetty (Lightweight Go-based HTTP Toolkit)
* **Bản chất:** Hetty là một công cụ HTTP toolkit và MITM proxy mã nguồn mở viết bằng ngôn ngữ **Go**, được đóng gói thành một file thực thi duy nhất (`hetty.exe`) tích hợp sẵn giao diện Web Admin cực kỳ tối giản và nhanh gọn.
* **Chức năng chính trong Session Hijacking:**
  * **MITM Proxy tích hợp sẵn:** Lắng nghe trên cổng (mặc định `:8080`), hỗ trợ cờ `--chrome` để tự động khởi chạy trình duyệt Google Chrome với proxy được định cấu hình sẵn.
  * **Request Interception & Log Viewer:** Hiển thị trực tiếp toàn bộ log HTTP trên nền web, cho phép tìm kiếm nhanh các giá trị Cookie, Token xác thực.
  * **Request Sender / Editor:** Chỉnh sửa request và gửi lại để kiểm tra phản hồi của server khi phiên làm việc bị thay đổi.
* **Ứng dụng trong đồ án:** Dành cho thành viên muốn một công cụ gọn nhẹ, chỉ cần chạy trực tiếp `hetty.exe` là có ngay web UI để chặn bắt và quan sát cấu trúc Cookie của phiên làm việc mà không cần cài đặt môi trường Java phức tạp.

### 3.4. Các công cụ phối hợp kinh điển trong CEH v13 (Khuyên dùng kết hợp)
Để kịch bản demo đạt điểm xuất sắc, CEH v13 hướng dẫn phối hợp các công cụ sau:
1. **Wireshark (Network Sniffing):**
   * Do đề tài nhắm vào **giao thức không bảo mật (HTTP)**, Wireshark là công cụ trực quan nhất để chứng minh: Bất kỳ ai trong cùng mạng LAN cũng có thể bắt được gói tin `GET /dashboard HTTP/1.1` và đọc được giá trị `Cookie: session_id=abcxyz` bằng mắt thường (Filter: `http.cookie` hoặc `http.request.method == "POST"`).
2. **Bettercap / Ettercap (ARP Spoofing / MITM):**
   * Thực hiện đầu độc bảng ARP trong mạng LAN để chuyển hướng toàn bộ lưu lượng của Victim đi qua máy Attacker trước khi ra router/web server.
3. **Cookie-Editor (Browser Extension):**
   * Extension trên Chrome/Firefox giúp import, sửa đổi, dán Cookie trực tiếp vào trình duyệt một cách trực quan nhất trong video demo.

---

## 4. BẢNG PHÂN CHIA NHIỆM VỤ CHI TIẾT (CHO 3 THÀNH VIÊN)

Để đảm bảo khối lượng công việc được phân bổ đồng đều và phát huy tối đa thế mạnh của từng thành viên, kế hoạch chia việc như sau:

| Thành viên | Vai trò chính | Trách nhiệm cụ thể | Sản phẩm bàn giao |
| :--- | :--- | :--- | :--- |
| **Phan Nhật Hào** (PH) | **Trưởng nhóm & Kỹ thuật Hạ tầng Lab (Lab & Network)** | - Thiết lập mô hình mạng Lab (Server, Victim, Attacker) trên VMware/VirtualBox.<br>- Dựng Web Server chạy giao thức không bảo mật HTTP (DVWA / bWAPP / Custom Web PHP).<br>- Thực hiện kỹ thuật bắt gói tin trên tầng mạng (Wireshark / ARP Spoofing) để bắt Cookie chưa mã hóa.<br>- Quản lý tiến độ chung của nhóm. | - Môi trường Lab hoàn chỉnh chạy mượt mà.<br>- File cấu hình Web Server & kịch bản mạng.<br>- File bắt gói tin `.pcapng` chứa bằng chứng Cookie bị lộ. |
| **Đào Duy Quân** (ĐQ) | **Kỹ thuật Ứng dụng & Demo Hijacking (Application & Tools)** | - Nghiên cứu và cài đặt các công cụ CEH: **OWASP ZAP**, **CAIDO**, **Hetty**.<br>- Thực hiện kịch bản Application-Level Session Hijacking: Lấy Cookie bắt được chèn vào trình duyệt Attacker (Cookie-Editor / Replay) để chiếm quyền điều khiển phiên.<br>- So sánh tính năng, ưu nhược điểm giữa CAIDO, Hetty và OWASP ZAP.<br>- Trực tiếp thực hiện demo hoặc phụ trách quay video demo. | - Kịch bản demo từng bước (Step-by-step).<br>- Video quay màn hình demo full HD có thuyết minh/chú thích.<br>- Bảng so sánh 3 công cụ CEH. |
| **Nguyễn Quang Vinh** (NV) | **Giải pháp Bảo mật, Báo cáo & Thuyết trình (Defense & Docs)** | - Nghiên cứu và triển khai giải pháp phòng chống: Cấu hình HTTPS (SSL/TLS), thiết lập cờ `HttpOnly`, `Secure`, `SameSite`, cơ chế làm mới session ID.<br>- Chạy lại kịch bản tấn công trên môi trường đã bảo mật để chứng minh giải pháp phòng vệ hiệu quả.<br>- Soạn thảo toàn bộ **Báo cáo đồ án (Word/PDF)** chuẩn form UTH.<br>- Thiết kế bộ **Slide thuyết trình (PowerPoint/Canva)** chuyên nghiệp. | - Báo cáo Word/PDF hoàn chỉnh (> 30 trang, chuẩn form UTH).<br>- Slide thuyết trình ấn tượng, logic.<br>- Phần cấu hình code/server minh chứng giải pháp phòng thủ. |

---

## 5. MA TRẬN TRÁCH NHIỆM RACI (RACI MATRIX)

* **R (Responsible):** Người trực tiếp thực hiện công việc.
* **A (Accountable):** Người chịu trách nhiệm nghiệm thu kết quả cuối cùng.
* **C (Consulted):** Người được tham vấn, hỗ trợ ý kiến chuyên môn.
* **I (Informed):** Người được thông báo tiến độ.

| STT | Hạng mục công việc | Phan Nhật Hào (PH) | Đào Duy Quân (ĐQ) | Nguyễn Quang Vinh (NV) |
| :---: | :--- | :---: | :---: | :---: |
| 1 | Nghiên cứu tài liệu CEH v13 Module 11 | **A / R** | **R** | **R** |
| 2 | Cài đặt môi trường Lab & Web Server HTTP | **A / R** | **C** | **I** |
| 3 | Bắt gói tin Cookie trên giao thức HTTP (Wireshark) | **A / R** | **C** | **I** |
| 4 | Cài đặt và thử nghiệm CAIDO, Hetty, OWASP ZAP | **C** | **A / R** | **I** |
| 5 | Thực hiện kịch bản chiếm quyền phiên (Session Hijacking) | **C** | **A / R** | **C** |
| 6 | Quay video demo chi tiết các bước | **C** | **A / R** | **C** |
| 7 | Nghiên cứu & cấu hình giải pháp phòng chống (HTTPS, cờ Cookie) | **C** | **C** | **A / R** |
| 8 | Viết nội dung Báo cáo Đồ án (Word/PDF) | **C** | **C** | **A / R** |
| 9 | Thiết kế Slide thuyết trình | **I** | **I** | **A / R** |
| 10 | Tổng duyệt, chạy thử và chuẩn bị phản biện câu hỏi | **A / R** | **R** | **R** |

---

## 6. LỘ TRÌNH THỰC HIỆN DỰ KIẾN (TIMELINE 4 TUẦN)

### Tuần 1: Nghiên cứu lý thuyết & Dựng môi trường Lab
* **Mục tiêu:** Cả nhóm nắm chắc lý thuyết CEH v13 Module 11; dựng xong lab mạng.
* **Công việc:**
  * Cả nhóm: Đọc kỹ tài liệu PDF CEH v13 Module 11 (Session Hijacking).
  * PH: Cài đặt máy ảo Target Web Server (chạy HTTP port 80) và tạo 2 tài khoản test (ví dụ: `admin` và `user_victim`).
  * ĐQ: Cài đặt và mở thử 3 công cụ: Caido, Hetty, OWASP ZAP trên máy tính Attacker.
  * NV: Lập đề cương chi tiết cho cuốn báo cáo đồ án, thu thập tài liệu về cơ chế phòng thủ (HTTPS, Cookie flags).

### Tuần 2: Thực nghiệm Tấn công & Khai thác công cụ CEH
* **Mục tiêu:** Thực hiện thành công kịch bản chiếm quyền phiên làm việc trên giao thức không bảo mật.
* **Công việc:**
  * PH & ĐQ: Cho Victim đăng nhập vào Web qua HTTP. Dùng Wireshark bắt gói tin và dùng CAIDO/Hetty/ZAP intercept lưu lượng để lấy `PHPSESSID`.
  * ĐQ: Mở trình duyệt máy Attacker, nạp Cookie vừa bắt được qua Cookie-Editor -> Chứng minh chiếm tài khoản thành công mà không cần mật khẩu.
  * ĐQ: So sánh trực quan cách Hetty, Caido, ZAP hiển thị và xử lý Cookie.
  * NV: Ghi chép lại toàn bộ các bước, chụp ảnh màn hình (screenshot) sắc nét từng giai đoạn để đưa vào báo cáo.

### Tuần 3: Triển khai Phòng thủ & Quay Video Demo
* **Mục tiêu:** Cấu hình biện pháp khắc phục thành công và hoàn thiện video demo.
* **Công việc:**
  * NV & PH: Cấu hình SSL/TLS (HTTPS) cho web server, thêm các cờ `HttpOnly`, `Secure`, `SameSite=Strict` vào header `Set-Cookie`.
  * ĐQ: Thử nghiệm tấn công lại trên môi trường đã bảo mật -> Chứng minh Wireshark không đọc được cookie, JavaScript không trích xuất được cookie qua XSS.
  * ĐQ: Quay video clip demo hoàn chỉnh (Phần 1: Tấn công trên HTTP; Phần 2: Thử lại trên HTTPS và biện pháp phòng thủ).
  * NV: Viết 80% nội dung cuốn báo cáo, chèn đầy đủ hình ảnh minh chứng.

### Tuần 4: Hoàn thiện Báo cáo, Slide & Luyện tập Báo cáo
* **Mục tiêu:** Sẵn sàng nộp bài và bảo vệ trước hội đồng giảng viên UTH.
* **Công việc:**
  * NV: Hoàn thiện 100% cuốn Báo cáo đồ án (format chỉn chu, căn lề, tài liệu tham khảo), hoàn thành slide PowerPoint/Canva.
  * PH & ĐQ: Rà soát lại nội dung kỹ thuật, kiểm tra tính chính xác của thuật ngữ.
  * Cả nhóm: Họp nhóm tổng duyệt (Rehearsal), phân chia người nói từng phần trong slide, chuẩn bị trước các câu hỏi phản biện của giảng viên.

---

## 7. CÁC CÂU HỎI PHẢN BIỆN GIẢNG VIÊN THƯỜNG HỎI & HƯỚNG TRẢ LỜI

Khi bảo vệ đồ án tại UTH, giảng viên bộ môn An ninh mạng thường xoáy sâu vào bản chất kỹ thuật:

1. **Câu hỏi:** *Tại sao khi dùng HTTP thì kẻ tấn công lại dễ dàng lấy được Cookie, còn HTTPS thì không?*
   * **Trả lời:** HTTP truyền thông dưới dạng bản rõ (plaintext). Dữ liệu tầng ứng dụng (Application Layer) bao gồm cả HTTP Headers (`Cookie: ...`) không hề được mã hóa, bất kỳ ai cùng nằm trên đường truyền (sniffing, ARP spoofing, router trung gian) đều đọc được. Trong khi đó, HTTPS bọc thêm lớp bảo mật TLS/SSL. Dữ liệu HTTP được mã hóa hoàn toàn trước khi gửi đi, kẻ tấn công bắt được gói tin chỉ thấy ciphertext vô nghĩa.
2. **Câu hỏi:** *Cờ `HttpOnly` có ngăn chặn được kẻ tấn công dùng Wireshark bắt gói tin trên mạng LAN không?*
   * **Trả lời:** **KHÔNG**. Cờ `HttpOnly` chỉ ngăn chặn mã độc JavaScript chạy trên trình duyệt đọc thuộc tính `document.cookie` (phòng chống tấn công XSS). Khi truyền tin trên giao thức không bảo mật HTTP, gói tin đi qua card mạng vẫn chứa Cookie dạng plaintext, do đó Wireshark vẫn bắt được bình thường. Để chặn Wireshark bắt gói tin, bắt buộc phải dùng **HTTPS**.
3. **Câu hỏi:** *Sự khác nhau giữa Session Hijacking và Session Spoofing là gì?*
   * **Trả lời:**
     * *Session Spoofing:* Kẻ tấn công giả mạo danh tính để khởi tạo một phiên kết nối mới với Server trước khi người dùng thực sự kết nối, hoặc gửi các gói tin có IP nguồn giả mạo mà không cần phiên đó đang hoạt động.
     * *Session Hijacking:* Nạn nhân đã đăng nhập và đang có một phiên làm việc đang hoạt động (active session). Kẻ tấn công can thiệp, cướp lấy định danh phiên (Session ID) và tiếp quản trực tiếp phiên làm việc hợp lệ đó.
4. **Câu hỏi:** *Ngoài việc mã hóa bằng HTTPS, lập trình viên cần làm gì để bảo vệ phiên làm việc của ứng dụng web?*
   * **Trả lời:** Cần áp dụng chiến lược phòng thủ theo chiều sâu (Defense-in-Depth):
     * Cấp phát Session ID có độ ngẫu nhiên và độ dài đủ lớn (high entropy).
     * Tái tạo Session ID mới ngay sau khi người dùng xác thực thành công (Regenerate Session ID on Login).
     * Thiết lập cờ `HttpOnly`, `Secure`, `SameSite`.
     * Giới hạn thời gian sống của phiên (Idle timeout và Absolute timeout).
     * Xóa sạch Session trên Server khi người dùng bấm Đăng xuất (Logout).
     * Ràng buộc phiên làm việc với User-Agent hoặc IP (nếu phù hợp).

---
*Kế hoạch được lập tự động dựa trên đề cương môn An ninh mạng UTH và tài liệu chính khóa EC-Council CEH v13 Module 11.*
