<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mã xác thực đặt lại mật khẩu</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f7f4ee;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #2b2520;
            line-height: 1.6;
        }
        .container {
            max-width: 580px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            border: 1px solid #ebd9c8;
        }
        .header {
            background-color: #8b2500;
            color: #ffffff;
            padding: 28px 24px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .header p {
            margin: 6px 0 0 0;
            font-size: 13px;
            opacity: 0.85;
        }
        .content {
            padding: 32px 28px;
        }
        .greeting {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
        }
        .text {
            font-size: 14px;
            color: #4a3e35;
            margin-bottom: 20px;
        }
        .code-box {
            text-align: center;
            margin: 28px 0;
            padding: 20px;
            background: #fcf8f3;
            border: 2px dashed #c05832;
            border-radius: 10px;
        }
        .code-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #8b2500;
            font-weight: 700;
            margin-bottom: 8px;
        }
        .code {
            font-family: 'Courier New', Courier, monospace;
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 8px;
            color: #8b2500;
            display: inline-block;
        }
        .expiry {
            font-size: 12px;
            color: #796656;
            margin-top: 8px;
        }
        .warning-box {
            background: #fff8eb;
            border-left: 4px solid #d97706;
            padding: 12px 16px;
            border-radius: 4px;
            font-size: 13px;
            color: #854d0e;
            margin-bottom: 24px;
        }
        .footer {
            background-color: #faf7f2;
            padding: 20px 24px;
            text-align: center;
            font-size: 12px;
            color: #8c7d70;
            border-top: 1px solid #ebd9c8;
        }
        .footer p {
            margin: 4px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>StyleRent</h1>
            <p>Tiệm Cho Thuê Trang Phục Tuyết Huy</p>
        </div>
        <div class="content">
            <div class="greeting">
                Xin chào {{ $userName ?: 'Quý khách' }},
            </div>
            <div class="text">
                Chúng tôi nhận được yêu cầu cấp lại mật khẩu cho tài khoản liên kết với địa chỉ email này.
                Vui lòng sử dụng mã xác thực dưới đây để tiếp tục quá trình đặt lại mật khẩu:
            </div>

            <div class="code-box">
                <div class="code-label">MÃ XÁC THỰC CỦA BẠN</div>
                <div class="code">{{ $code }}</div>
                <div class="expiry">Mã có hiệu lực trong {{ $expiresInMinutes }} phút</div>
            </div>

            <div class="warning-box">
                <strong>Lưu ý bảo mật:</strong> Tuyệt đối không chia sẻ mã này cho bất kỳ ai. Nhân viên StyleRent không bao giờ yêu cầu cung cấp mã xác thực này. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.
            </div>

            <div class="text" style="margin-bottom: 0;">
                Sau khi nhập mã thành công, hệ thống sẽ cấp cho bạn một mật khẩu tạm thời ngẫu nhiên để đăng nhập ngay lập tức.
            </div>
        </div>

        <div class="footer">
            <p>Email này được gửi tự động từ hệ thống dịch vụ <strong>StyleRent</strong>.</p>
            <p>&copy; {{ date('Y') }} StyleRent. Mọi quyền được bảo lưu.</p>
        </div>
    </div>
</body>
</html>
