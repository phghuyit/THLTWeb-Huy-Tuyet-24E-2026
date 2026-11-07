<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $headerMenus = [
            [
                'name' => 'Trang chủ',
                'link' => '/',
                'sort_order' => 1,
                'position' => 'header',
                'status' => 'active',
            ],
            [
                'name' => 'Sản phẩm',
                'link' => '/products',
                'sort_order' => 2,
                'position' => 'header',
                'status' => 'active',
                'children' => [
                    ['name' => 'Áo dài', 'link' => '/products?category=ao-dai', 'sort_order' => 1],
                    ['name' => 'Váy đầm', 'link' => '/products?category=vay-dam', 'sort_order' => 2],
                    ['name' => 'Vest nam', 'link' => '/products?category=vest-nam', 'sort_order' => 3],
                    ['name' => 'Váy cưới', 'link' => '/products?category=vay-cuoi', 'sort_order' => 4],
                    ['name' => 'Phụ kiện', 'link' => '/products?category=phu-kien', 'sort_order' => 5],
                ],
            ],
            [
                'name' => 'Bài viết & Xu hướng',
                'link' => '/news',
                'sort_order' => 3,
                'position' => 'header',
                'status' => 'active',
            ],
            [
                'name' => 'Bảng giá & Quy định',
                'link' => '/pricing',
                'sort_order' => 4,
                'position' => 'header',
                'status' => 'active',
            ],
            [
                'name' => 'Về chúng tôi',
                'link' => '/about',
                'sort_order' => 5,
                'position' => 'header',
                'status' => 'active',
            ],
            [
                'name' => 'Liên hệ',
                'link' => '/contact',
                'sort_order' => 6,
                'position' => 'header',
                'status' => 'active',
            ],
        ];

        foreach ($headerMenus as $item) {
            $children = $item['children'] ?? [];
            unset($item['children']);

            $menu = Menu::updateOrCreate(
                ['name' => $item['name'], 'position' => $item['position']],
                $item
            );

            foreach ($children as $sub) {
                Menu::updateOrCreate(
                    ['name' => $sub['name'], 'parent_id' => $menu->id],
                    [
                        'link' => $sub['link'],
                        'sort_order' => $sub['sort_order'],
                        'position' => 'header',
                        'status' => 'active',
                    ]
                );
            }
        }

        $footerMenus = [
            ['name' => 'Toàn bộ bộ sưu tập', 'link' => '/products', 'sort_order' => 1, 'position' => 'footer', 'status' => 'active'],
            ['name' => 'Váy cưới thiết kế', 'link' => '/products?category=vay-cuoi', 'sort_order' => 2, 'position' => 'footer', 'status' => 'active'],
            ['name' => 'Vest & Tuxedo cao cấp', 'link' => '/products?category=vest-nam', 'sort_order' => 3, 'position' => 'footer', 'status' => 'active'],
            ['name' => 'Tin tức & Cẩm nang', 'link' => '/news', 'sort_order' => 4, 'position' => 'footer', 'status' => 'active'],
            ['name' => 'Bảng giá & Quy định', 'link' => '/pricing', 'sort_order' => 5, 'position' => 'footer', 'status' => 'active'],
        ];

        foreach ($footerMenus as $fItem) {
            Menu::updateOrCreate(
                ['name' => $fItem['name'], 'position' => 'footer'],
                $fItem
            );
        }
    }
}
