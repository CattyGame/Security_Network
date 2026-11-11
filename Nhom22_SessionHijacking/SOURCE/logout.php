<?php
/**
 * UTH STUDENT PORTAL - XỬ LÝ ĐĂNG XUẤT (HỦY PHIÊN TOÀN DIỆN)
 */
session_start();

// 1. Xóa toàn bộ biến phiên trong bộ nhớ Server
$_SESSION = array();

// 2. Nếu có cookie phiên, gửi yêu cầu trình duyệt xóa Cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// 3. Hủy bỏ session trên Server
session_destroy();

// 4. Chuyển hướng về trang đăng nhập
header('Location: login.php');
exit;
