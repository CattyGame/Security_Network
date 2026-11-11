<?php
/**
 * UTH STUDENT PORTAL - TRANG CÁ NHÂN DASHBOARD
 * Trang yêu cầu Session Cookie hợp lệ để truy cập
 */
session_start();

// Nếu chưa xác thực -> Chặn truy cập
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    header('Location: login.php?error=unauthorized');
    exit;
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Hồ sơ sinh viên - UTH Portal</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 40px auto; background: #1e293b; border-radius: 12px; padding: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #334155; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #38bdf8; padding-bottom: 15px; margin-bottom: 25px; }
        h1 { margin: 0; font-size: 24px; color: #38bdf8; }
        .card { background: #0f172a; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #38bdf8; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #334155; }
        .cookie-box { background: #020617; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; font-family: monospace; color: #fbbf24; word-break: break-all; margin: 20px 0; }
        .btn-danger { background: #ef4444; color: white; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <h1>CỔNG THÔNG TIN SINH VIÊN UTH</h1>
                <small style="color: #94a3b8;">Đề tài: Tấn công Session Hijacking (Nhóm 22)</small>
            </div>
            <span style="background: #e11d48; color: white; padding: 5px 12px; border-radius: 6px; font-weight: bold; font-size: 13px;">
                ⚠️ HTTP CLEARTEXT (CỔNG 80)
            </span>
        </div>

        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; padding: 12px; border-radius: 6px; margin-bottom: 20px; color: #6ee7b7;">
            🎉 <strong>PHIÊN LÀM VIỆC ĐANG HOẠT ĐỘNG!</strong> Bạn đang đăng nhập với tư cách sinh viên UTH.
        </div>

        <div class="card">
            <h3 style="margin-top:0; color:#38bdf8;">👤 Dữ liệu cá nhân nhạy cảm</h3>
            <div class="row"><span>Họ và Tên:</span><strong><?= htmlspecialchars($_SESSION['fullName']) ?></strong></div>
            <div class="row"><span>Mã Sinh Viên:</span><strong><?= htmlspecialchars($_SESSION['studentId']) ?></strong></div>
            <div class="row"><span>Tài khoản ngân hàng:</span><strong><?= htmlspecialchars($_SESSION['bankAccount']) ?></strong></div>
            <div class="row"><span>Số dư ví học phí:</span><strong style="color: #4ade80; font-size: 17px;"><?= htmlspecialchars($_SESSION['balance']) ?></strong></div>
            <div class="row"><span>Thời điểm đăng nhập:</span><span><?= htmlspecialchars($_SESSION['loginTime']) ?></span></div>
        </div>

        <h4>🔑 Cookie định danh phiên (Session Cookie):</h4>
        <div class="cookie-box">
            <strong>Cookie Header:</strong> PHPSESSID=<?= session_id() ?>
        </div>
        <p style="font-size: 13px; color: #94a3b8;">
            * Nếu kẻ tấn công (Attacker) trên máy ảo Kali Linux bắt được chuỗi <code><?= session_id() ?></code> này qua Wireshark và dán vào trình duyệt của họ, họ sẽ truy cập ngay trang này mà <strong>KHÔNG CẦN PASSWORD</strong>!
        </p>

        <div style="margin-top: 25px;">
            <a href="logout.php" class="btn-danger">Đăng xuất (Hủy phiên)</a>
        </div>
    </div>
</body>
</html>
