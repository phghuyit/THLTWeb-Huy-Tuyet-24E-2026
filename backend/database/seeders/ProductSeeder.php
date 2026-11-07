<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categorySlugs = [
            'ao-dai-truyen-thong',
            'ao-dai-cach-tan',
            'vay-du-tiec',
            'vay-cuoi',
            'vest-nam',
            'tui-xach',
        ];

        $categoryIds = DB::table('categories')
            ->whereIn('slug', $categorySlugs)
            ->pluck('id', 'slug');

        if ($categoryIds->isEmpty()) {
            throw new RuntimeException('Hãy chạy CategorySeeder trước khi chạy ProductSeeder.');
        }

        $brandIds = DB::table('brands')->pluck('id', 'slug');

        $now = now();

        $products = [
            [
                'category_id' => $categoryIds['ao-dai-truyen-thong'],
                'brand_id' => $brandIds['linh-bui-haute-couture'] ?? null,
                'name' => 'Áo dài truyền thống lụa tơ tằm thêu hoa sen',
                'slug' => 'ao-dai-truyen-thong-hoa-sen',
                'thumbnail' => 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
                'short_description' => 'Áo dài lụa tơ tằm thủ công thêu hoa sen tỉ mỉ, tôn vinh nét duyên dáng người phụ nữ Việt.',
                'description' => 'Chất liệu lụa tơ tằm cao cấp mềm mại, thoáng mát và co giãn nhẹ. Tà áo 2 lớp bay bổng, đường may sắc nét chuẩn phom dáng truyền thống. Phù hợp cho dịp lễ Tết, kỷ yếu và sự kiện trang trọng.',
                'rental_price_per_day' => 350000,
                'sale_rental_price' => 280000,
                'original_value' => 2500000,
                'is_featured' => true,
                'is_sale' => true,
                'view_count' => 128,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => $categoryIds['ao-dai-cach-tan'],
                'brand_id' => $brandIds['linh-bui-haute-couture'] ?? null,
                'name' => 'Áo dài cách tân gấm đỏ hoa văn quý phái',
                'slug' => 'ao-dai-cach-tan-gam-do',
                'thumbnail' => 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
                'short_description' => 'Áo dài cách tân chất liệu gấm dệt nổi họa tiết may mắn, kết hợp tay bồng hiện đại.',
                'description' => 'Thiết kế cách tân trẻ trung với cổ tròn đính viền ngọc trai, phối cùng chân váy xòe xếp ly nhẹ nhàng mang lại vẻ đẹp thanh lịch cho tiệc cưới và dạ hội.',
                'rental_price_per_day' => 280000,
                'sale_rental_price' => null,
                'original_value' => 1800000,
                'is_featured' => false,
                'is_sale' => false,
                'view_count' => 64,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => $categoryIds['vay-du-tiec'],
                'brand_id' => $brandIds['chung-thanh-phong-bridal'] ?? null,
                'name' => 'Đầm dạ hội đỏ Ruby xẻ tà đính pha lê',
                'slug' => 'vay-du-tiec-do-xe-ta-sang-trong',
                'thumbnail' => 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
                'short_description' => 'Đầm dạ hội màu đỏ Ruby xẻ tà quyến rũ, cúp ngực ôm sát tôn trọn đường cong cơ thể.',
                'description' => 'Mẫu đầm làm từ satin lụa bóng sang trọng, cúp ngực đính kết pha lê thủ công lấp lánh dưới ánh đèn tiệc. Đường xẻ tà cao tinh tế giúp tôn đôi chân thon dài.',
                'rental_price_per_day' => 450000,
                'sale_rental_price' => 380000,
                'original_value' => 3600000,
                'is_featured' => true,
                'is_sale' => true,
                'view_count' => 215,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => $categoryIds['vay-du-tiec'],
                'brand_id' => $brandIds['elise-fashion'] ?? null,
                'name' => 'Váy dạ hội đuôi cá ánh kim sa vàng Gold',
                'slug' => 'vay-da-hoi-anh-kim-sa-vang',
                'thumbnail' => 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
                'short_description' => 'Váy dạ hội form đuôi cá phủ sequin ánh vàng lộng lẫy, hoàn hảo cho đêm tiệc thảm đỏ.',
                'description' => 'Chất liệu kim sa cao cấp có lớp lót lụa êm ái chống ngứa, ôm trọn vóc dáng và bung nhẹ từ đầu gối. Giúp bạn trở thành tâm điểm của mọi ánh nhìn trong các đêm gala sang trọng.',
                'rental_price_per_day' => 500000,
                'sale_rental_price' => null,
                'original_value' => 4200000,
                'is_featured' => false,
                'is_sale' => false,
                'view_count' => 92,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => $categoryIds['vay-cuoi'],
                'brand_id' => $brandIds['juliette-bridal'] ?? null,
                'name' => 'Váy cưới công chúa ren Pháp hoàng gia',
                'slug' => 'vay-cuoi-cong-chua-ren-phap',
                'thumbnail' => 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80',
                'short_description' => 'Váy cưới bồng bềnh phong cách công chúa với ren thêu nổi Pháp và hàng ngàn hạt cườm ngọc trai.',
                'description' => 'Tùng váy xòe rộng 8 lớp voan vi tính tạo độ bồng tự nhiên. Thân áo corset nâng đỡ form dáng chuẩn mực, siết eo thon gọn giúp cô dâu tỏa sáng trong ngày trọng đại.',
                'rental_price_per_day' => 1200000,
                'sale_rental_price' => 990000,
                'original_value' => 9500000,
                'is_featured' => true,
                'is_sale' => true,
                'view_count' => 340,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => $categoryIds['vest-nam'],
                'brand_id' => $brandIds['adam-store'] ?? null,
                'name' => 'Bộ vest nam Classic đen Tuxedo lịch lãm',
                'slug' => 'vest-nam-classic-den-lich-lam',
                'thumbnail' => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
                'short_description' => 'Bộ Tuxedo nam màu đen cổ sam bóng sang trọng, chuẩn phong cách quý ông tiệc cưới.',
                'description' => 'Trọn bộ bao gồm áo vest, quần âu và nơ cổ. Vải tuýtsi pha len cao cấp đứng form, hạn chế nhăn. Cầu vai đệm vừa vặn tạo phom người nam tính, đĩnh đạc.',
                'rental_price_per_day' => 400000,
                'sale_rental_price' => null,
                'original_value' => 3200000,
                'is_featured' => true,
                'is_sale' => false,
                'view_count' => 180,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => $categoryIds['vest-nam'],
                'brand_id' => $brandIds['adam-store'] ?? null,
                'name' => 'Bộ vest nam phong cách Hàn Quốc ghi xám sáng',
                'slug' => 'vest-nam-han-quoc-ghi-sang',
                'thumbnail' => 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
                'short_description' => 'Bộ vest nam màu ghi sáng trẻ trung, form slimfit hiện đại tôn dáng người mặc.',
                'description' => 'Thiết kế 2 nút trẻ trung, gam màu ghi xám thanh lịch phù hợp cho chụp ảnh ngoại cảnh, tiệc đính hôn hoặc làm rể phụ. Chất liệu co giãn nhẹ tạo sự thoải mái khi di chuyển.',
                'rental_price_per_day' => 350000,
                'sale_rental_price' => 299000,
                'original_value' => 2800000,
                'is_featured' => false,
                'is_sale' => true,
                'view_count' => 75,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => $categoryIds['tui-xach'],
                'brand_id' => $brandIds['charles-keith'] ?? null,
                'name' => 'Clutch cầm tay dạ tiệc đính ngọc trai quý phái',
                'slug' => 'tui-xach-du-tiec-dinh-ngoc-trai',
                'thumbnail' => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
                'short_description' => 'Ví clutch cầm tay đính hạt ngọc trai nhân tạo sang trọng, kèm dây xích đeo vai ánh kim.',
                'description' => 'Phụ kiện hoàn hảo phối cùng áo dài và váy dạ hội. Kích thước vừa vặn đựng điện thoại và vật dụng cá nhân. Khóa bấm kim loại mạ vàng sáng bóng và chắc chắn.',
                'rental_price_per_day' => 80000,
                'sale_rental_price' => null,
                'original_value' => 750000,
                'is_featured' => false,
                'is_sale' => false,
                'view_count' => 45,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        foreach ($products as &$product) {
            $product['deposit_price'] = (int) round($product['original_value'] * 0.70);
        }
        unset($product);

        DB::table('products')->upsert(
            $products,
            ['slug'],
            [
                'category_id',
                'brand_id',
                'name',
                'thumbnail',
                'short_description',
                'description',
                'rental_price_per_day',
                'sale_rental_price',
                'deposit_price',
                'original_value',
                'is_featured',
                'is_sale',
                'view_count',
                'status',
                'updated_at',
            ]
        );
    }
}
