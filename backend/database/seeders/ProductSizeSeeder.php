<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ProductSizeSeeder extends Seeder
{
    public function run(): void
    {
        $products = DB::table('products')->get(['id', 'slug']);

        if ($products->isEmpty()) {
            throw new RuntimeException('Hãy chạy ProductSeeder trước khi chạy ProductSizeSeeder.');
        }

        $now = now();

        $sizePresets = [
            'ao-dai-truyen-thong-hoa-sen' => [
                ['size' => 'S', 'stock_quantity' => 5],
                ['size' => 'M', 'stock_quantity' => 8],
                ['size' => 'L', 'stock_quantity' => 6],
                ['size' => 'XL', 'stock_quantity' => 3],
            ],
            'ao-dai-cach-tan-gam-do' => [
                ['size' => 'S', 'stock_quantity' => 4],
                ['size' => 'M', 'stock_quantity' => 6],
                ['size' => 'L', 'stock_quantity' => 4],
            ],
            'vay-du-tiec-do-xe-ta-sang-trong' => [
                ['size' => 'XL', 'stock_quantity' => 2],
                ['size' => 'S', 'stock_quantity' => 5],
                ['size' => 'M', 'stock_quantity' => 6],
                ['size' => 'L', 'stock_quantity' => 3],
            ],
            'vay-da-hoi-anh-kim-sa-vang' => [
                ['size' => 'S', 'stock_quantity' => 3],
                ['size' => 'M', 'stock_quantity' => 4],
                ['size' => 'L', 'stock_quantity' => 2],
            ],
            'vay-cuoi-cong-chua-ren-phap' => [
                ['size' => 'S', 'stock_quantity' => 2],
                ['size' => 'M', 'stock_quantity' => 4],
                ['size' => 'L', 'stock_quantity' => 3],
                ['size' => 'FreeSize', 'stock_quantity' => 2],
            ],
            'vest-nam-classic-den-lich-lam' => [
                ['size' => 'M', 'stock_quantity' => 6],
                ['size' => 'L', 'stock_quantity' => 8],
                ['size' => 'XL', 'stock_quantity' => 5],
                ['size' => '2XL', 'stock_quantity' => 2],
            ],
            'vest-nam-han-quoc-ghi-sang' => [
                ['size' => 'S', 'stock_quantity' => 3],
                ['size' => 'M', 'stock_quantity' => 5],
                ['size' => 'L', 'stock_quantity' => 5],
                ['size' => 'XL', 'stock_quantity' => 2],
            ],
            'tui-xach-du-tiec-dinh-ngoc-trai' => [
                ['size' => 'FreeSize', 'stock_quantity' => 15],
            ],
        ];

        foreach ($products as $product) {
            $sizes = $sizePresets[$product->slug] ?? [
                ['size' => 'S', 'stock_quantity' => 4],
                ['size' => 'M', 'stock_quantity' => 5],
                ['size' => 'L', 'stock_quantity' => 4],
                ['size' => 'FreeSize', 'stock_quantity' => 10],
            ];

            foreach ($sizes as $item) {
                DB::table('product_sizes')->updateOrInsert(
                    [
                        'product_id' => $product->id,
                        'size' => $item['size'],
                    ],
                    [
                        'stock_quantity' => $item['stock_quantity'],
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]
                );
            }
        }
    }
}
