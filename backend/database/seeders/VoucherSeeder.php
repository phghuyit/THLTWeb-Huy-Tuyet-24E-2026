<?php

namespace Database\Seeders;

use App\Models\Voucher;
use Illuminate\Database\Seeder;

class VoucherSeeder extends Seeder
{
    public function run(): void
    {
        $vouchers = [
            [
                'code' => 'GIAM50K',
                'name' => 'Ưu đãi thuê đồ tiệc (Đơn từ 300k)',
                'discount_amount' => 50000,
                'min_order_amount' => 300000,
                'status' => 'active',
            ],
            [
                'code' => 'GIAM100K',
                'name' => 'Ưu đãi khách hàng VIP (Đơn từ 500k)',
                'discount_amount' => 100000,
                'min_order_amount' => 500000,
                'status' => 'active',
            ],
            [
                'code' => 'WELCOME30K',
                'name' => 'Chào mừng thành viên mới (Đơn từ 150k)',
                'discount_amount' => 30000,
                'min_order_amount' => 150000,
                'status' => 'active',
            ],
        ];

        foreach ($vouchers as $v) {
            Voucher::updateOrCreate(['code' => $v['code']], $v);
        }
    }
}
