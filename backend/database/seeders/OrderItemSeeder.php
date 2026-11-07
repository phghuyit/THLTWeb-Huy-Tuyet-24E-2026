<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class OrderItemSeeder extends Seeder
{
    public function run(): void
    {
        $orderIds = DB::table('orders')->pluck('id', 'order_code');

        if ($orderIds->isEmpty()) {
            throw new RuntimeException('Hãy chạy OrderSeeder trước khi chạy OrderItemSeeder.');
        }

        $productSizes = DB::table('product_sizes')
            ->join('products', 'product_sizes.product_id', '=', 'products.id')
            ->select(
                'product_sizes.id as size_id',
                'products.name',
                'products.rental_price_per_day',
                'products.deposit_price',
                'products.original_value'
            )
            ->get();

        if ($productSizes->isEmpty()) {
            throw new RuntimeException('Hãy chạy ProductSizeSeeder trước khi chạy OrderItemSeeder.');
        }

        $size1 = $productSizes[0];
        $size2 = $productSizes[1] ?? $productSizes[0];
        $size3 = $productSizes[2] ?? $productSizes[0];

        $order1 = $orderIds['ORD-20261001-0001'] ?? $orderIds->first();
        $order2 = $orderIds['ORD-20261005-0002'] ?? $orderIds->first();
        $order3 = $orderIds['ORD-20261010-0003'] ?? $orderIds->first();

        $now = now();

        $deposit1 = (float) ($size1->deposit_price ?? ($size1->original_value * 0.70));
        $deposit2 = (float) ($size2->deposit_price ?? ($size2->original_value * 0.70));
        $deposit3 = (float) ($size3->deposit_price ?? ($size3->original_value * 0.70));

        $items = [
            [
                'order_id' => $order1,
                'product_size_id' => $size1->size_id,
                'quantity' => 1,
                'rent_start_date' => '2026-10-15',
                'rent_end_date' => '2026-10-18',
                'rental_days' => 3,
                'price_per_day' => $size1->rental_price_per_day,
                'deposit_per_item' => $deposit1,
                'total_item_rental' => $size1->rental_price_per_day * 3,
                'total_item_deposit' => $deposit1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'order_id' => $order1,
                'product_size_id' => $size2->size_id,
                'quantity' => 1,
                'rent_start_date' => '2026-10-15',
                'rent_end_date' => '2026-10-18',
                'rental_days' => 3,
                'price_per_day' => $size2->rental_price_per_day,
                'deposit_per_item' => $deposit2,
                'total_item_rental' => $size2->rental_price_per_day * 3,
                'total_item_deposit' => $deposit2,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'order_id' => $order2,
                'product_size_id' => $size3->size_id,
                'quantity' => 2,
                'rent_start_date' => '2026-10-20',
                'rent_end_date' => '2026-10-22',
                'rental_days' => 2,
                'price_per_day' => $size3->rental_price_per_day,
                'deposit_per_item' => $deposit3,
                'total_item_rental' => $size3->rental_price_per_day * 2 * 2,
                'total_item_deposit' => $deposit3 * 2,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('order_items')->upsert(
            $items,
            ['id'],
            [
                'order_id',
                'product_size_id',
                'quantity',
                'rent_start_date',
                'rent_end_date',
                'rental_days',
                'price_per_day',
                'deposit_per_item',
                'total_item_rental',
                'total_item_deposit',
                'updated_at',
            ]
        );
    }
}
