<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $userIds = DB::table('users')->pluck('id', 'email');

        if ($userIds->isEmpty()) {
            throw new RuntimeException('Hãy chạy UserSeeder trước khi chạy OrderSeeder.');
        }

        $memberId = $userIds['member@gmail.com'] ?? $userIds->first();
        $adminId = $userIds['admin@gmail.com'] ?? $userIds->first();

        $orders = [
            [
                'order_code' => 'ORD-20261001-0001',
                'user_id' => $memberId,
            ],
            [
                'order_code' => 'ORD-20261005-0002',
                'user_id' => $memberId,
            ],
            [
                'order_code' => 'ORD-20261010-0003',
                'user_id' => $adminId,
            ],
        ];

        DB::table('orders')->upsert(
            $orders,
            ['order_code'],
            ['user_id']
        );
    }
}
