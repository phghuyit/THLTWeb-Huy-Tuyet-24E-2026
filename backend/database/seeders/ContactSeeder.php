<?php

namespace Database\Seeders;

use App\Models\Contact;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    public function run(): void
    {
        $samples = [
            [
                'name' => 'Nguyễn Thị Thu Hà',
                'phone' => '0912345678',
                'email' => 'thuha.nguyen@gmail.com',
                'subject' => 'Tư vấn thuê trang phục',
                'message' => 'Mình cần thuê 1 bộ áo dài cưới cho ngày 15 tháng này, showroom có sẵn mẫu size M tại chi nhánh không ạ?',
                'reply_note' => null,
                'status' => 'pending',
                'created_at' => now()->subHours(2),
            ],
            [
                'name' => 'Trần Văn Hoàng',
                'phone' => '0987654321',
                'email' => 'hoang.tran@outlook.com',
                'subject' => 'Hỗ trợ đơn hàng',
                'message' => 'Đơn hàng SR-20261101 của mình muốn dời ngày nhận sang sáng ngày mai có được không?',
                'reply_note' => 'Đã gọi điện xác nhận dời lịch nhận đồ thành công.',
                'status' => 'replied',
                'created_at' => now()->subDay(),
            ],
            [
                'name' => 'Lê Minh Anh',
                'phone' => '0909123456',
                'email' => 'minhanh.le@gmail.com',
                'subject' => 'Đặt lịch thử đồ tại showroom',
                'message' => 'Mình muốn hẹn lịch thử 3 mẫu váy dạ hội vào 14h chiều thứ 7 tuần này cho 2 người.',
                'reply_note' => 'Đã xem qua yêu cầu, chờ showroom chuẩn bị trang phục.',
                'status' => 'read',
                'created_at' => now()->subDays(2),
            ],
        ];

        foreach ($samples as $sample) {
            Contact::firstOrCreate(
                ['phone' => $sample['phone'], 'subject' => $sample['subject']],
                $sample
            );
        }
    }
}
