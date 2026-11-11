<?php
/**
 * UTH STUDENT PORTAL - MÔ PHỎNG HỆ THỐNG ĐĂNG NHẬP (HTTP CỔNG 80)
 * Đề tài: Tấn công chiếm quyền điều khiển phiên (Session Hijacking)
 * Nhóm 22: Phan Nhật Hào - Đào Duy Quân - Nguyễn Quang Vinh
 */

// Bắt đầu phiên làm việc
session_start();

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    // Tài khoản thử nghiệm: victim / uth123
    if ($username === 'victim' && $password === 'uth123') {
        $_SESSION['authenticated'] = true;
        $_SESSION['username'] = 'victim';
        $_SESSION['fullName'] = 'Nguyễn Văn Nạn Nhân (Sinh viên UTH)';
        $_SESSION['studentId'] = '2251120000';
        $_SESSION['bankAccount'] = '0833386443';
        $_SESSION['balance'] = '25.000.000 VNĐ';
        $_SESSION['loginTime'] = date('Y-m-d H:i:s');

        header('Location: dashboard.php');
        exit;
    } else {
        $error = 'Sai tên đăng nhập hoặc mật khẩu!';
    }
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Đăng nhập - Cổng thông tin sinh viên UTH</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .login-card { width: 100%; max-width: 420px; background: #1e293b; padding: 35px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #334155; }
        h2 { color: #38bdf8; text-align: center; margin-top: 0; }
        .alert-error { background: #7f1d1d; color: #fca5a5; padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 14px; text-align: center; }
        .badge { background: #dc2626; color: white; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 15px; }
        label { display: block; margin-bottom: 6px; font-size: 14px; color: #94a3b8; }
        input[type="text"], input[type="password"] { width: 100%; box-sizing: border-box; padding: 12px; background: #0f172a; border: 1px solid #475569; border-radius: 6px; color: white; margin-bottom: 16px; font-size: 14px; }
        button { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 15px; }
        button:hover { background: #1d4ed8; }
        .demo-info { margin-top: 25px; padding: 15px; background: #020617; border-radius: 8px; border-left: 3px solid #f59e0b; font-size: 13px; color: #cbd5e1; }
    </style>
</head>
<body>
    <div class="login-card">
        <div style="text-align: center;">
            <span class="badge">⚠️ GIAO THỨC KHÔNG BẢO MẬT: HTTP (Port 80)</span>
        </div>
        <h2>CỔNG SINH VIÊN UTH</h2>
        <p style="text-align: center; font-size: 13px; color: #64748b; margin-top: -10px;">Lab Session Hijacking - Nhóm 22</p>

        <?php if ($error): ?>
            <div class="alert-error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <form method="POST" action="login.php">
            <label>Tên đăng nhập (Username):</label>
            <input type="text" name="username" value="victim" required>

            <label>Mật khẩu (Password):</label>
            <input type="password" name="password" value="uth123" required>

            <button type="submit">Đăng nhập</button>
        </form>

        <div class="demo-info">
            <strong>🔑 Tài khoản thử nghiệm:</strong><br>
            - User: <code>victim</code> | Pass: <code>uth123</code><br>
            - Phiên quản lý qua Cookie: <code>PHPSESSID</code>
        </div>
    </div>
</body>
</html>
