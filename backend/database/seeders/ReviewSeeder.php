<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $products = DB::table('products')->pluck('id', 'slug');
        if ($products->isEmpty()) {
            return;
        }

        $userId = DB::table('users')->first()?->id;

        $reviews = [
            [
                'product_id' => $products['ao-dai-truyen-thong-hoa-sen'] ?? $products->first(),
                'user_id' => $userId,
                'author_name' => 'Trần Mỹ Duyên',
                'rating' => 5,
                'content' => 'Lụa tơ tằm thêu sen thủ công rất tinh xảo, màu sắc nhã nhặn. Đồ được giặt ủi thơm tho và đóng gói cẩn thận khi giao tới.',
                'size_worn' => 'S',
                'height_cm' => 160,
                'status' => 'approved',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'product_id' => $products['vay-du-tiec-do-xe-ta-sang-trong'] ?? $products->first(),
                'user_id' => $userId,
                'author_name' => 'Vũ Hà My',
                'rating' => 5,
                'content' => 'Váy satin lụa bóng sang trọng, cúp ngực ôm chắc chắn nên di chuyển rất thoải mái trong đêm tiệc gala.',
                'size_worn' => 'M',
                'height_cm' => 166,
                'status' => 'approved',
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
            [
                'product_id' => $products['vay-cuoi-cong-chua-ren-phap'] ?? $products->first(),
                'user_id' => $userId,
                'author_name' => 'Nguyễn Thanh Vân',
                'rating' => 5,
                'content' => 'Ren Pháp đính ngọc trai bên ngoài nhìn sang hơn ảnh chụp nhiều. Váy xòe bồng công chúa tôn dáng cô dâu trong ngày cưới.',
                'size_worn' => 'S',
                'height_cm' => 162,
                'status' => 'approved',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'product_id' => $products['vest-nam-classic-den-lich-lam'] ?? $products->first(),
                'user_id' => $userId,
                'author_name' => 'Đỗ Trung Kiên',
                'rating' => 5,
                'content' => 'Vest tuxedo đứng form, vải không nhăn. Rất tiện lợi cho ai cần vest dự tiệc cưới mà không muốn mua mới.',
                'size_worn' => 'L',
                'height_cm' => 175,
                'status' => 'approved',
                'created_at' => now()->subDay(),
                'updated_at' => now()->subDay(),
            ],
        ];

        DB::table('reviews')->insert($reviews);
    }
}
