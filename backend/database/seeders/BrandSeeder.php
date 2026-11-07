<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $brands = [
            [
                'name' => 'Elise Fashion',
                'slug' => 'elise-fashion',
                'logo' => 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80',
                'description' => 'Thương hiệu thời trang thiết kế hàng đầu với các dòng đầm dạ hội, trang phục sự kiện cao cấp.',
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Chung Thanh Phong Bridal',
                'slug' => 'chung-thanh-phong-bridal',
                'logo' => 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
                'description' => 'Thương hiệu váy cưới và đầm dạ tiệc cao cấp của NTK Chung Thanh Phong, tôn vinh nét quyến rũ và lộng lẫy.',
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Adam Store',
                'slug' => 'adam-store',
                'logo' => 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80',
                'description' => 'Thương hiệu âu phục và veston nam may sẵn hàng đầu Việt Nam, phong cách lịch lãm và chuẩn phom dáng quý ông.',
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Linh Bùi Haute Couture',
                'slug' => 'linh-bui-haute-couture',
                'logo' => 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80',
                'description' => 'Chuyên các dòng áo dài lụa tơ tằm thêu tay thủ công tinh xảo, áo dài cưới truyền thống và cách tân quý phái.',
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Juliette Bridal',
                'slug' => 'juliette-bridal',
                'logo' => 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
                'description' => 'Thương hiệu váy cưới công chúa hoàng gia nhập khẩu với chất liệu ren Pháp và cườm đá lấp lánh.',
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Charles & Keith',
                'slug' => 'charles-keith',
                'logo' => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
                'description' => 'Thương hiệu phụ kiện túi xách, clutch dạ tiệc thời thượng được phái đẹp yêu thích.',
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('brands')->upsert(
            $brands,
            ['slug'],
            ['name', 'logo', 'description', 'status', 'updated_at']
        );
    }
}
