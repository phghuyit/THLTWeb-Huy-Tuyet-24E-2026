<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{


    public function run(): void
    {
        $now = now();

        $parentCategories = [
            [
                'name' => 'Áo dài',
                'slug' => 'ao-dai',
                'description' => 'Các mẫu áo dài truyền thống và hiện đại.',
                'image' => '/images/categories/ao-dai.jpg',
                'status' => 'active',
            ],
            [
                'name' => 'Váy đầm',
                'slug' => 'vay-dam',
                'description' => 'Váy đầm dành cho dự tiệc và sự kiện.',
                'image' => '/images/categories/vay-dam.jpg',
                'status' => 'active',
            ],
            [
                'name' => 'Trang phục nam',
                'slug' => 'trang-phuc-nam',
                'description' => 'Trang phục nam lịch sự cho nhiều dịp.',
                'image' => '/images/categories/trang-phuc-nam.jpg',
                'status' => 'active',
            ],
            [
                'name' => 'Phụ kiện',
                'slug' => 'phu-kien',
                'description' => 'Phụ kiện phối cùng trang phục.',
                'image' => '/images/categories/phu-kien.jpg',
                'status' => 'active',
            ],
        ];

        foreach ($parentCategories as $category) {
            DB::table('categories')->updateOrInsert(
                ['slug' => $category['slug']],
                [...$category, 'parent_id' => null, 'updated_at' => $now, 'created_at' => $now],
            );
        }

        $parentIds = DB::table('categories')
            ->whereIn('slug', array_column($parentCategories, 'slug'))
            ->pluck('id', 'slug');

        $childCategories = [
            ['name' => 'Áo dài truyền thống', 'slug' => 'ao-dai-truyen-thong', 'parent_slug' => 'ao-dai'],
            ['name' => 'Áo dài cách tân', 'slug' => 'ao-dai-cach-tan', 'parent_slug' => 'ao-dai'],
            ['name' => 'Váy dự tiệc', 'slug' => 'vay-du-tiec', 'parent_slug' => 'vay-dam'],
            ['name' => 'Váy cưới', 'slug' => 'vay-cuoi', 'parent_slug' => 'vay-dam'],
            ['name' => 'Vest nam', 'slug' => 'vest-nam', 'parent_slug' => 'trang-phuc-nam'],
            ['name' => 'Túi xách', 'slug' => 'tui-xach', 'parent_slug' => 'phu-kien'],
        ];

        foreach ($childCategories as $category) {
            DB::table('categories')->updateOrInsert(
                ['slug' => $category['slug']],
                [
                    'name' => $category['name'],
                    'parent_id' => $parentIds[$category['parent_slug']],
                    'description' => "Danh mục {$category['name']} cho thuê.",
                    'image' => "/images/categories/{$category['slug']}.jpg",
                    'status' => 'active',
                    'updated_at' => $now,
                    'created_at' => $now,
                ],
            );
        }
    }
}
