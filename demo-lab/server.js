/**
 * DEMO LAB: SESSION HIJACKING - AN NINH MẠNG UTH (NHÓM 22)
 * Server thuần Node.js (KHÔNG CẦN npm install, chạy trực tiếp bằng: node server.js)
 */

const http = require('http');
const url = require('url');

const PORT = 3000;

// Trạng thái bảo mật mô phỏng (Mặc định: Lỗ hổng - Vulnerable trên HTTP)
let isSecuredMode = false;

// Cơ sở dữ liệu phiên giả lập trên Server (In-Memory Session Store)
const sessions = {
    'UTH_SESSION_VICTIM_998877': {
        username: 'victim_student',
        fullName: 'Nguyễn Văn Nạn Nhân (Sinh viên UTH)',
        studentId: '2251120000',
        bankAccount: '0833386443',
        balance: '25,000,000 VNĐ',
        role: 'VIP User',
        createdAt: new Date().toLocaleString('vi-VN')
    }
};

// Hàm phân tích Cookie từ Header
function parseCookies(request) {
    const list = {};
    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) return list;

    cookieHeader.split(';').forEach(cookie => {
        let [name, ...rest] = cookie.split('=');
        name = name.trim();
        if (!name) return;
        list[name] = decodeURIComponent(rest.join('=').trim());
    });
    return list;
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const cookies = parseCookies(req);

    // 1. Chuyển đổi chế độ Bảo mật / Lỗ hổng
    if (parsedUrl.pathname === '/toggle-security') {
        isSecuredMode = !isSecuredMode;
        res.writeHead(302, { 'Location': '/login' });
        return res.end();
    }

    // 2. Trang Đăng xuất (Logout)
    if (parsedUrl.pathname === '/logout') {
        const sessionToken = cookies['SESSION_TOKEN'];
        if (sessionToken && sessions[sessionToken]) {
            delete sessions[sessionToken];
        }
        res.writeHead(302, {
            'Set-Cookie': 'SESSION_TOKEN=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
            'Location': '/login'
        });
        return res.end();
    }

    // 3. Xử lý Đăng nhập (POST /login)
    if (parsedUrl.pathname === '/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const params = new URLSearchParams(body);
            const user = params.get('username');
            const pass = params.get('password');

            // Tài khoản mẫu: victim / uth123
            if (user === 'victim' && pass === 'uth123') {
                const token = isSecuredMode 
                    ? 'UTH_SECURED_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
                    : 'UTH_SESSION_VICTIM_998877';

                sessions[token] = {
                    username: 'victim',
                    fullName: 'Nguyễn Văn Nạn Nhân (Sinh viên UTH)',
                    studentId: '2251120000',
                    bankAccount: '0833386443',
                    balance: '25,000,000 VNĐ',
                    role: 'Sinh viên UTH',
                    createdAt: new Date().toLocaleString('vi-VN')
                };

                // Thiết lập Cookie tùy theo chế độ
                let cookieHeaderValue = `SESSION_TOKEN=${token}; Path=/`;
                if (isSecuredMode) {
                    // Chế độ bảo mật: Có HttpOnly và SameSite
                    cookieHeaderValue += '; HttpOnly; SameSite=Strict';
                }

                res.writeHead(302, {
                    'Set-Cookie': cookieHeaderValue,
                    'Location': '/dashboard'
                });
                return res.end();
            } else {
                res.writeHead(302, { 'Location': '/login?error=invalid' });
                return res.end();
            }
        });
        return;
    }

    // 4. Trang Dashboard sau khi Đăng nhập (Yêu cầu Cookie hợp lệ)
    if (parsedUrl.pathname === '/dashboard') {
        const sessionToken = cookies['SESSION_TOKEN'];
        const sessionData = sessions[sessionToken];

        if (!sessionData) {
            // Không có Cookie hoặc Cookie không hợp lệ -> Chặn truy cập
            res.writeHead(302, { 'Location': '/login?error=unauthorized' });
            return res.end();
        }

        // Đã có Cookie hợp lệ (Có thể do chính chủ đăng nhập HOẶC HACKER ĐÃ CƯỚP ĐƯỢC COOKIE)
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(`
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Hệ thống Cổng Thông Tin Sinh Viên - UTH</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 40px auto; background: #1e293b; border-radius: 12px; padding: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #334155; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 25px; }
        h1 { margin: 0; font-size: 24px; color: #38bdf8; }
        .badge { background: #e11d48; color: white; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: bold; }
        .badge-secure { background: #10b981; }
        .info-card { background: #0f172a; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #38bdf8; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #334155; }
        .cookie-box { background: #020617; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; word-break: break-all; margin: 20px 0; font-family: monospace; color: #fbbf24; }
        .btn { padding: 10px 18px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold; text-decoration: none; display: inline-block; }
        .btn-danger { background: #ef4444; color: white; }
        .btn-outline { background: transparent; border: 1px solid #64748b; color: #cbd5e1; margin-left: 10px; }
        .alert { padding: 12px; border-radius: 6px; margin-bottom: 20px; background: rgba(59, 130, 246, 0.1); border: 1px solid #3b82f6; color: #93c5fd; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <h1>CỔNG THÔNG TIN SINH VIÊN UTH</h1>
                <small style="color: #94a3b8;">Đề tài Session Hijacking - Nhóm 22</small>
            </div>
            <span class="badge ${isSecuredMode ? 'badge-secure' : ''}">${isSecuredMode ? '🛡️ CHẾ ĐỘ AN TOÀN (HTTPS/Secure)' : '⚠️ CHẾ ĐỘ LỖ HỔNG (HTTP Cleartext)'}</span>
        </div>

        <div class="alert">
            🎉 <strong>ĐĂNG NHẬP THÀNH CÔNG!</strong> Phiên làm việc (Session) đang hoạt động.
        </div>

        <div class="info-card">
            <h3 style="margin-top:0; color:#38bdf8;">👤 Dữ Liệu Hồ Sơ Cá Nhân (Bảo mật)</h3>
            <div class="info-row"><span>Họ và Tên:</span><strong>${sessionData.fullName}</strong></div>
            <div class="info-row"><span>Mã Sinh Viên:</span><strong>${sessionData.studentId}</strong></div>
            <div class="info-row"><span>Tài Khoản Liên Kết:</span><strong>${sessionData.bankAccount}</strong></div>
            <div class="info-row"><span>Số Dư Ví Học Phí:</span><strong style="color: #4ade80;">${sessionData.balance}</strong></div>
            <div class="info-row"><span>Thời điểm cấp phiên:</span><span>${sessionData.createdAt}</span></div>
        </div>

        <h4>🔑 Session Cookie đang duy trì phiên (Client-side):</h4>
        <div class="cookie-box">
            <strong>Cookie Header:</strong> SESSION_TOKEN=${sessionToken}
        </div>
        <p style="font-size: 13px; color: #94a3b8;">
            * Nếu kẻ tấn công (Attacker) đánh cắp được chuỗi token trên và dán vào trình duyệt của họ, họ sẽ truy cập ngay trang này mà <strong>KHÔNG CẦN MẬT KHẨU</strong>!
        </p>

        <div style="margin-top: 30px;">
            <a href="/logout" class="btn btn-danger">Đăng xuất (Hủy phiên)</a>
            <a href="/toggle-security" class="btn btn-outline">Đổi chế độ bảo mật</a>
        </div>
    </div>
</body>
</html>
        `);
    }

    // 5. Trang Đăng nhập (Mặc định hoặc khi chưa có Session)
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(`
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Đăng nhập - Lab Session Hijacking UTH</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .login-box { width: 100%; max-width: 440px; background: #1e293b; padding: 35px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); border: 1px solid #334155; }
        h2 { margin-top: 0; color: #38bdf8; text-align: center; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 12px; margin-bottom: 20px; font-weight: bold; }
        .badge-vuln { background: #b91c1c; color: white; }
        .badge-sec { background: #059669; color: white; }
        label { display: block; margin-bottom: 6px; font-size: 14px; color: #cbd5e1; }
        input[type="text"], input[type="password"] { width: 100%; box-sizing: border-box; padding: 12px; background: #0f172a; border: 1px solid #475569; border-radius: 6px; color: white; margin-bottom: 18px; }
        button { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 15px; }
        button:hover { background: #1d4ed8; }
        .guide { margin-top: 25px; padding: 15px; background: #020617; border-radius: 8px; font-size: 13px; color: #94a3b8; border-left: 3px solid #f59e0b; }
        .btn-toggle { display: block; text-align: center; margin-top: 15px; color: #38bdf8; text-decoration: none; font-size: 13px; }
        .error { background: #7f1d1d; color: #fca5a5; padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 14px; text-align: center; }
    </style>
</head>
<body>
    <div class="login-box">
        <div style="text-align: center;">
            <span class="badge ${isSecuredMode ? 'badge-sec' : 'badge-vuln'}">
                ${isSecuredMode ? '🛡️ Chế độ: ĐÃ BẢO VỆ (HttpOnly)' : '⚠️ Chế độ: LỖ HỔNG (Giao thức HTTP thô)'}
            </span>
        </div>
        <h2>HỆ THỐNG UTH PORTAL</h2>
        <p style="text-align: center; font-size: 13px; color: #64748b; margin-top: -10px;">Đồ án An ninh mạng: Session Hijacking</p>

        ${parsedUrl.query.error === 'invalid' ? '<div class="error">Sai tài khoản hoặc mật khẩu!</div>' : ''}
        ${parsedUrl.query.error === 'unauthorized' ? '<div class="error">Phiên làm việc không tồn tại hoặc đã hết hạn! Vui lòng đăng nhập.</div>' : ''}

        <form action="/login" method="POST">
            <label>Tên đăng nhập (Username):</label>
            <input type="text" name="username" value="victim" required>

            <label>Mật khẩu (Password):</label>
            <input type="password" name="password" value="uth123" required>

            <button type="submit">Đăng nhập</button>
        </form>

        <a href="/toggle-security" class="btn-toggle">🔄 Bấm vào đây để chuyển đổi Chế độ Bảo mật</a>

        <div class="guide">
            <strong>💡 Tài khoản thử nghiệm:</strong><br>
            - Username: <code>victim</code><br>
            - Password: <code>uth123</code><br>
            - Giao thức: <code>HTTP (Cổng 3000)</code>
        </div>
    </div>
</body>
</html>
    `);
});

server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 DEMO WEB SERVER ĐANG CHẠY TẠI: http://localhost:${PORT}`);
    console.log(`📌 Giao thức: HTTP (Không bảo mật - Plaintext)`);
    console.log(`👉 Mở trình duyệt và truy cập: http://localhost:${PORT}`);
    console.log(`=======================================================`);
});

