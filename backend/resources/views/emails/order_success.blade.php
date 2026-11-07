<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận đơn thuê #{{ $order->order_code }}</title>
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
            max-width: 620px;
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
            opacity: 0.9;
        }
        .content {
            padding: 30px 26px;
        }
        .greeting {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #1a1614;
        }
        .intro-text {
            font-size: 14px;
            color: #4a3e35;
            margin-bottom: 22px;
        }
        .due-date-card {
            background: #fff8f0;
            border: 2px solid #8b2500;
            border-radius: 10px;
            padding: 18px 20px;
            margin-bottom: 24px;
            text-align: center;
        }
        .due-date-title {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #8b2500;
            font-weight: 700;
            margin-bottom: 6px;
        }
        .due-date-highlight {
            font-size: 26px;
            font-weight: 800;
            color: #8b2500;
            margin: 4px 0 8px 0;
        }
        .due-date-note {
            font-size: 13px;
            color: #6a4e3a;
            margin: 0;
        }
        .section-title {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 700;
            color: #8b2500;
            border-bottom: 1px solid #ebd9c8;
            padding-bottom: 8px;
            margin-top: 24px;
            margin-bottom: 14px;
        }
        .info-grid {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            margin-bottom: 18px;
        }
        .info-grid td {
            padding: 6px 0;
            vertical-align: top;
        }
        .info-label {
            width: 36%;
            color: #796656;
            font-weight: 500;
        }
        .info-value {
            color: #2b2520;
            font-weight: 600;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            margin-bottom: 20px;
        }
        .items-table th {
            background-color: #faf7f2;
            color: #5c4a3d;
            font-weight: 600;
            text-align: left;
            padding: 10px 12px;
            border-bottom: 1px solid #ebd9c8;
        }
        .items-table td {
            padding: 12px;
            border-bottom: 1px solid #f2eae2;
            vertical-align: middle;
        }
        .item-name {
            font-weight: 600;
            color: #2b2520;
        }
        .item-meta {
            font-size: 12px;
            color: #796656;
            margin-top: 3px;
        }
        .summary-card {
            background-color: #faf7f2;
            border-radius: 8px;
            padding: 16px 18px;
            margin-top: 14px;
            border: 1px solid #ebd9c8;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            color: #4a3e35;
            margin-bottom: 8px;
        }
        .summary-row.total {
            font-size: 16px;
            font-weight: 700;
            color: #8b2500;
            border-top: 1px solid #ebd9c8;
            padding-top: 10px;
            margin-top: 10px;
            margin-bottom: 0;
        }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .badge-vnpay {
            background-color: #e0f2fe;
            color: #0369a1;
        }
        .badge-cod {
            background-color: #fef3c7;
            color: #92400e;
        }
        .footer {
            background-color: #faf7f2;
            padding: 22px 24px;
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
@php
    $totalRental = 0;
    $totalDeposit = 0;
    $maxReturnDate = null;
    foreach ($order->items as $item) {
        $totalRental += (float) ($item->total_item_rental ?? 0);
        $totalDeposit += (float) ($item->total_item_deposit ?? 0);
        $endDate = $item->rent_end_date ? \Carbon\Carbon::parse($item->rent_end_date) : null;
        if ($endDate && (!$maxReturnDate || $endDate->gt($maxReturnDate))) {
            $maxReturnDate = $endDate;
        }
    }
    $calculatedTotal = $totalRental + $totalDeposit - (float) ($order->discount_amount ?? 0);
    $finalTotal = $order->total_amount > 0 ? (float) $order->total_amount : max(0, $calculatedTotal);
    $receiverName = $order->receiver_name ?: ($order->user->fullname ?? 'Quý khách');
    $receiverPhone = $order->receiver_phone ?: ($order->user->phone ?? 'Chưa cập nhật');
    $deliveryAddress = $order->address ?: ($order->user->address ?? 'Nhận tại cửa hàng');
@endphp
<div class="container">
    <div class="header">
        <h1>STYLERENT</h1>
        <p>Xác nhận đơn thuê trang phục cao cấp</p>
    </div>

    <div class="content">
        <div class="greeting">
            Xin chào {{ $receiverName }},
        </div>
        <p class="intro-text">
            Cảm ơn bạn đã tin tưởng dịch vụ thuê trang phục tại <strong>StyleRent</strong>. Đơn hàng của bạn đã được xác nhận thành công. Dưới đây là thông tin chi tiết về đơn thuê và lịch trình hoàn trả.
        </p>

        @if($maxReturnDate)
        <div class="due-date-card">
            <div class="due-date-title">Ngày đến hạn hoàn trả trang phục</div>
            <div class="due-date-highlight">{{ $maxReturnDate->format('d/m/Y') }}</div>
            <p class="due-date-note">
                Quý khách vui lòng hoàn trả trang phục trước hoặc đúng ngày <strong>{{ $maxReturnDate->format('d/m/Y') }}</strong> để được hoàn lại <strong>100%</strong> tiền cọc (<strong>{{ number_format($totalDeposit, 0, ',', '.') }} đ</strong>) theo chính sách của StyleRent.
            </p>
        </div>
        @endif

        <div class="section-title">Thông tin đơn hàng #{{ $order->order_code }}</div>
        <table class="info-grid">
            <tr>
                <td class="info-label">Mã đơn hàng:</td>
                <td class="info-value">#{{ $order->order_code }}</td>
            </tr>
            <tr>
                <td class="info-label">Thời gian tạo:</td>
                <td class="info-value">{{ $order->created_at ? $order->created_at->format('d/m/Y H:i') : now()->format('d/m/Y H:i') }}</td>
            </tr>
            <tr>
                <td class="info-label">Phương thức thanh toán:</td>
                <td class="info-value">
                    @if($order->payment_method === 'vnpay')
                        <span class="badge badge-vnpay">VNPay (Đã thanh toán)</span>
                    @else
                        <span class="badge badge-cod">COD (Thanh toán khi nhận hàng)</span>
                    @endif
                </td>
            </tr>
            <tr>
                <td class="info-label">Người nhận:</td>
                <td class="info-value">{{ $receiverName }} ({{ $receiverPhone }})</td>
            </tr>
            <tr>
                <td class="info-label">Địa chỉ nhận đồ:</td>
                <td class="info-value">{{ $deliveryAddress }}</td>
            </tr>
            @if($order->note)
            <tr>
                <td class="info-label">Ghi chú:</td>
                <td class="info-value">{{ $order->note }}</td>
            </tr>
            @endif
        </table>

        <div class="section-title">Danh sách sản phẩm thuê</div>
        <table class="items-table">
            <thead>
                <tr>
                    <th>Sản phẩm</th>
                    <th style="text-align: center;">SL</th>
                    <th style="text-align: right;">Tiền thuê</th>
                    <th style="text-align: right;">Tiền cọc</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>
                        <div class="item-name">{{ $item->productSize->product->name ?? 'Sản phẩm' }}</div>
                        <div class="item-meta">
                            Size: <strong>{{ $item->productSize->size ?? 'Free size' }}</strong> | 
                            {{ $item->rental_days }} ngày 
                            ({{ \Carbon\Carbon::parse($item->rent_start_date)->format('d/m') }} - {{ \Carbon\Carbon::parse($item->rent_end_date)->format('d/m/Y') }})
                        </div>
                    </td>
                    <td style="text-align: center; font-weight: 600;">{{ $item->quantity }}</td>
                    <td style="text-align: right; color: #4a3e35;">{{ number_format($item->total_item_rental, 0, ',', '.') }} đ</td>
                    <td style="text-align: right; color: #796656;">{{ number_format($item->total_item_deposit, 0, ',', '.') }} đ</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="summary-card">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                    <td style="padding: 4px 0; color: #6a5749;">Tổng tiền thuê trang phục:</td>
                    <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #2b2520;">{{ number_format($totalRental, 0, ',', '.') }} đ</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #6a5749;">Tổng tiền cọc (hoàn lại khi trả đồ):</td>
                    <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #2b2520;">{{ number_format($totalDeposit, 0, ',', '.') }} đ</td>
                </tr>
                @if($order->discount_amount > 0)
                <tr>
                    <td style="padding: 4px 0; color: #15803d;">
                        Giảm giá voucher {{ $order->voucher_code ? "({$order->voucher_code})" : '' }}:
                    </td>
                    <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #15803d;">
                        - {{ number_format($order->discount_amount, 0, ',', '.') }} đ
                    </td>
                </tr>
                @endif
                <tr style="border-top: 1px solid #ebd9c8;">
                    <td style="padding: 10px 0 4px 0; font-size: 15px; font-weight: 700; color: #8b2500;">Tổng thanh toán:</td>
                    <td style="padding: 10px 0 4px 0; text-align: right; font-size: 17px; font-weight: 800; color: #8b2500;">
                        {{ number_format($finalTotal, 0, ',', '.') }} đ
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <div class="footer">
        <p><strong>StyleRent - Thời Trang Thiết Kế Cho Thuê Cao Cấp</strong></p>
        <p>Hotline: 0909 123 456 | Email: support@stylerent.vn | Giờ làm việc: 08:30 - 21:30</p>
        <p style="margin-top: 10px; font-size: 11px; color: #a4968a;">
            Nếu bạn có bất kỳ thắc mắc nào về đơn hàng, vui lòng phản hồi trực tiếp email này hoặc liên hệ hotline để được hỗ trợ.
        </p>
    </div>
</div>
</body>
</html>
