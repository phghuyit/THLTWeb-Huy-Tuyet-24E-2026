<?php

namespace Database\Seeders;

use App\Models\Banner;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        $banners = [
            [
                'title' => 'Bộ Sưu Tập Dạ Hội & Tiệc Cưới 2026',
                'image_url' => 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
                'link_url' => '/products',
                'position' => 'home_main_slider',
                'sort_order' => 1,
                'status' => 'active',
            ],
            [
                'title' => 'Áo Dài Lụa Tơ Tằm & Gấm Hoa Truyền Thống',
                'image_url' => 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80',
                'link_url' => '/products?category=ao-dai-truyen-thong',
                'position' => 'home_main_slider',
                'sort_order' => 2,
                'status' => 'active',
            ],
            [
                'title' => 'Vest Nam Lịch Lãm Cho Mọi Sự Kiện & Hội Nghị',
                'image_url' => 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1600&q=80',
                'link_url' => '/products?category=vest-nam',
                'position' => 'home_main_slider',
                'sort_order' => 3,
                'status' => 'active',
            ],
        ];

        foreach ($banners as $banner) {
            Banner::firstOrCreate(
                ['title' => $banner['title']],
                $banner
            );
        }
    }
}
