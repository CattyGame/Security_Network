# HƯỚNG DẪN THIẾT LẬP MÔ HÌNH LAB ẢO HÓA TRÊN VMWARE WORKSTATION PRO
### Đồ án môn học: An ninh mạng — Nhóm 22 (Đại học Giao thông vận tải TP.HCM - UTH)
### Đề tài: Tấn công chiếm quyền điều khiển phiên (Session Hijacking)

---

## 1. MỤC TIÊU CỦA MÔ HÌNH LAB ẢO HÓA
Theo yêu cầu tại mục **2. Mô hình triển khai** trong file `DeTai.pdf` của Khoa CNTT - UTH:
* Tạo một môi trường mạng nội bộ hoàn toàn cô lập (Isolated Virtual Network), đảm bảo các hành động thử nghiệm tấn công (bắt gói tin, nghe lén HTTP, chèn cookie) diễn ra an toàn, không ảnh hưởng đến hệ thống mạng thực tế.
* Đáp ứng đầy đủ tiêu chí đánh giá về kiến trúc mạng và kỹ năng ảo hóa của sinh viên.

---

## 2. SƠ ĐỒ MẠNG LAB (NETWORK TOPOLOGY)

```
                            [ MẠNG ẢO NỘI BỘ (Host-Only: VMnet2) ]
                                   Dải IP: 192.168.100.0/24
                                              |
            +---------------------------------+--------------------------------+
            |                                 |                                |
            v                                 v                                v
+-------------------------+       +------------------------+       +------------------------+
|    MÁY CHỦ WEB TARGET   |       |    MÁY NẠN NHÂN VICTIM |       |   MÁY TẤN CÔNG ATTACKER|
| - HĐH: Ubuntu / Windows |       | - HĐH: Windows 10/11   |       | - HĐH: Kali Linux hoặc |
| - IP: 192.168.100.10    |       | - IP: 192.168.100.20   |       |   Windows              |
| - Chạy demo-lab HTTP    |       | - Đăng nhập tài khoản  |       | - IP: 192.168.100.30   |
|   tại cổng: 3000        |       |   sinh viên UTH Portal |       | - Chạy Wireshark,      |
|                         |       |                        |       |   Hetty & Cookie-Editor|
+-------------------------+       +------------------------+       +------------------------+
```

---

## 3. CÁC BƯỚC CẤU HÌNH CHI TIẾT TRÊN VMWARE WORKSTATION PRO

### Bước 1: Cài đặt VMware Workstation Pro
* Bộ cài đặt chính thức đã có sẵn trong thư mục dự án:
  `CEH v13 OCT 2024/CEHv13 ISO/VMware Workstation Pro/VMware-workstation-full-17.5.2-23775571.exe`
* Nhấp đúp chuột để tiến hành cài đặt theo mặc định (Next -> Next -> Finish).

### Bước 2: Tạo Card mạng ảo cô lập (Virtual Network Editor)
1. Mở phần mềm **VMware Workstation Pro**.
2. Trên thanh menu, chọn **Edit** -> **Virtual Network Editor...**
3. Nhấn vào nút **Change Settings** (yêu cầu quyền Administrator).
4. Nhấn **Add Network...** -> Chọn tên card mạng: **VMnet2**.
5. Cấu hình các thông số:
   * Loại mạng: Chọn **Host-only (connect VMs internally in a private network)**.
   * Bỏ tích mục *Connect a host virtual adapter to this network* (nếu muốn cô lập 100%) hoặc tích chọn nếu muốn máy thật (Host) giao tiếp được với Lab.
   * Tích chọn: **Use local DHCP service to distribute IP address to VMs**.
   * **Subnet IP:** `192.168.100.0`
   * **Subnet mask:** `255.255.255.0`
6. Nhấn **Apply** -> **OK**.

### Bước 3: Gán Card mạng cho từng Máy ảo (VM Settings)
Với mỗi máy ảo tham gia Lab:
1. Nhấp chuột phải vào tên máy ảo trong danh sách bên trái -> chọn **Settings...**
2. Chọn mục **Network Adapter**.
3. Chọn tùy chọn: **Custom: Specific virtual network** -> chọn **VMnet2 (Host-only)**.
4. Nhấn **OK**.

### Bước 4: Thiết lập địa chỉ IP tĩnh (Static IP) hoặc nhận DHCP
Để kịch bản demo và viết báo cáo được đồng nhất:

| Máy | Tên máy | Địa chỉ IP khuyến nghị | Dịch vụ chạy |
| :--- | :--- | :--- | :--- |
| **Server** | `UTH-Web-Server` | `192.168.100.10` | Chạy Node.js Server cổng 3000 (`node server.js`) |
| **Victim** | `Victim-Student` | `192.168.100.20` | Trình duyệt Chrome truy cập `http://192.168.100.10:3000` |
| **Attacker** | `Attacker-Kali` | `192.168.100.30` | Wireshark lắng nghe trên interface `eth0`/card mạng ảo, trình duyệt nạp cookie |

---

## 4. KIỂM TRA THÔNG MẠNG (CONNECTIVITY TEST)
Trên máy Victim và Attacker, mở Terminal/CMD gõ lệnh:
```bash
ping 192.168.100.10
```
Nếu nhận được phản hồi `Reply from 192.168.100.10: bytes=32 time<1ms TTL=64` $\rightarrow$ Môi trường mạng ảo đã hoàn toàn thông suốt và sẵn sàng cho bài thử nghiệm tấn công Session Hijacking!
