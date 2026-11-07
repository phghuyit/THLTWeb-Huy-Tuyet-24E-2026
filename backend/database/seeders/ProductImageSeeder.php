<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ProductImageSeeder extends Seeder
{
    public function run(): void
    {
        $products = DB::table('products')->get(['id', 'slug']);

        if ($products->isEmpty()) {
            throw new RuntimeException('Hãy chạy ProductSeeder trước khi chạy ProductImageSeeder.');
        }

        $imagePresets = [
            'ao-dai-truyen-thong-hoa-sen' => [
                ['image_url' => 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', 'sort_order' => 1],
                ['image_url' => 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', 'sort_order' => 2],
                ['image_url' => 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', 'sort_order' => 3],
            ],
            'ao-dai-cach-tan-gam-do' => [
                ['image_url' => 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80', 'sort_order' => 1],
                ['image_url' => 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80', 'sort_order' => 2],
            ],
            'vay-du-tiec-do-xe-ta-sang-trong' => [
                ['image_url' => 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80', 'sort_order' => 1],
                ['image_url' => 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80', 'sort_order' => 2],
                ['image_url' => 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80', 'sort_order' => 3],
            ],
            'vay-da-hoi-anh-kim-sa-vang' => [
                ['image_url' => 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80', 'sort_order' => 1],
                ['image_url' => 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80', 'sort_order' => 2],
            ],
            'vay-cuoi-cong-chua-ren-phap' => [
                ['image_url' => 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80', 'sort_order' => 1],
                ['image_url' => 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', 'sort_order' => 2],
                ['image_url' => 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80', 'sort_order' => 3],
            ],
            'vest-nam-classic-den-lich-lam' => [
                ['image_url' => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', 'sort_order' => 1],
                ['image_url' => 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=800&q=80', 'sort_order' => 2],
                ['image_url' => 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80', 'sort_order' => 3],
            ],
            'vest-nam-han-quoc-ghi-sang' => [
                ['image_url' => 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80', 'sort_order' => 1],
                ['image_url' => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', 'sort_order' => 2],
            ],
            'tui-xach-du-tiec-dinh-ngoc-trai' => [
                ['image_url' => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', 'sort_order' => 1],
                ['image_url' => 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80', 'sort_order' => 2],
            ],
        ];

        foreach ($products as $product) {
            DB::table('product_images')->where('product_id', $product->id)->delete();

            $images = $imagePresets[$product->slug] ?? [
                ['image_url' => 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', 'sort_order' => 1],
                ['image_url' => 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80', 'sort_order' => 2],
            ];

            $insertData = array_map(function ($img) use ($product) {
                return [
                    'product_id' => $product->id,
                    'image_url' => $img['image_url'],
                    'sort_order' => $img['sort_order'],
                ];
            }, $images);

            DB::table('product_images')->insert($insertData);
        }
    }
}
