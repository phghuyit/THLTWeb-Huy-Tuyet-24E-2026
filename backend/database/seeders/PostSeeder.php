<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first() ?? User::first();
        $adminId = $admin?->id;

        $categories = [
            [
                'name' => 'Xu hướng thời trang',
                'slug' => 'xu-huong-thoi-trang',
                'description' => 'Cập nhật những xu hướng thời trang, phong cách và màu sắc thịnh hành nhất.',
                'status' => 'active',
            ],
            [
                'name' => 'Bí quyết phối đồ',
                'slug' => 'bi-quyet-phoi-do',
                'description' => 'Mẹo phối đồ dạ hội, công sở và chọn trang phục che khuyết điểm cực tôn dáng.',
                'status' => 'active',
            ],
            [
                'name' => 'Cẩm nang cưới & Dạ hội',
                'slug' => 'cam-nang-cuoi-da-hoi',
                'description' => 'Kinh nghiệm chọn váy cưới lộng lẫy, vest chú rể chuẩn phom và áo dài cưới sang trọng.',
                'status' => 'active',
            ],
            [
                'name' => 'Kinh nghiệm & Hướng dẫn thuê',
                'slug' => 'kinh-nghiem-huong-dan-thue',
                'description' => 'Cẩm nang quy trình thuê, mẹo lấy số đo và chính sách đổi size, giữ gìn trang phục.',
                'status' => 'active',
            ],
            [
                'name' => 'Phong cách sống & Sự kiện',
                'slug' => 'phong-cach-song-su-kien',
                'description' => 'Ý tưởng chụp ảnh kỷ yếu, dress code tiệc gala, prom dạ hội và sự kiện ngoại cảnh.',
                'status' => 'active',
            ],
            [
                'name' => 'Tin tức & Ưu đãi',
                'slug' => 'tin-tuc-uu-dai',
                'description' => 'Các sự kiện đặc biệt, bộ sưu tập mới cập bến và mã ưu đãi độc quyền tại StyleRent.',
                'status' => 'active',
            ],
        ];

        $createdCategories = [];
        foreach ($categories as $cat) {
            $createdCategories[$cat['slug']] = PostCategory::updateOrCreate(
                ['slug' => $cat['slug']],
                $cat
            );
        }

        $posts = [
            [
                'category_id' => $createdCategories['xu-huong-thoi-trang']->id,
                'user_id' => $adminId,
                'title' => 'Xu Hướng Thời Trang 2026: Tối Giản Nhưng Đầy Quyến Rũ',
                'slug' => 'xu-huong-thoi-trang-2026-toi-gian-quyen-ru',
                'thumbnail' => 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
                'summary' => 'Khám phá các tông màu trung tính sang trọng và phom dáng cut-out tinh tế đang thống trị sàn diễn thời trang năm nay.',
                'content' => '<p>Thời trang năm 2026 chứng kiến sự trở lại mạnh mẽ của phong cách Quiet Luxury kết hợp cùng đường nét hiện đại. Những chiếc đầm lụa trơn, blazer dáng suông mềm mại hay chân váy xẻ tà tinh tế trở thành sự lựa chọn hàng đầu cho các quý cô khi tham dự sự kiện.</p><p>Tại StyleRent, chúng tôi luôn tuyển chọn những bộ sưu tập đón đầu xu hướng để bạn luôn tự tin tỏa sáng mà không cần đầu tư tủ đồ đắt đỏ.</p>',
                'is_hot' => true,
                'views' => 1420,
                'status' => 'published',
            ],
            [
                'category_id' => $createdCategories['xu-huong-thoi-trang']->id,
                'user_id' => $adminId,
                'title' => 'Những Tông Màu Đầm Dạ Hội Tôn Da Được Ưa Chuộng Nhất',
                'slug' => 'nhung-tong-mau-dam-du-tiec-ton-da-hot-nhat',
                'thumbnail' => 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80',
                'summary' => 'Bí quyết chọn màu sắc đầm dạ hội tôn sắc da: từ đỏ rượu vang quyền lực, xanh rêu cổ điển đến ánh bạc ánh kim kiêu kỳ.',
                'content' => '<p>Màu sắc trang phục đóng vai trò quyết định đến 70% ấn tượng thị giác trong những buổi tiệc tối ánh đèn vàng lung linh. Chọn đúng sắc độ sẽ giúp làn da của bạn bật tông rạng rỡ và thu hút mọi ánh nhìn.</p><p>Các gam màu bất hủ luôn nằm trong top cháy hàng tại StyleRent bao gồm: Đỏ Burgundy quý phái, Xanh Navy hoàng gia, Emerald huyền bí và tone Vàng Champagne thanh lịch.</p>',
                'is_hot' => false,
                'views' => 1120,
                'status' => 'published',
            ],

            [
                'category_id' => $createdCategories['bi-quyet-phoi-do']->id,
                'user_id' => $adminId,
                'title' => 'Top 5 Chiếc Đầm Dạ Hội Được Yêu Thích Nhất Mùa Tiệc Tùng',
                'slug' => 'top-5-chiec-dam-da-hoi-duoc-yeu-thich-nhat',
                'thumbnail' => 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80',
                'summary' => 'Điểm danh 5 mẫu thiết kế dạ hội sang trọng, tôn dáng hoàn hảo giúp bạn trở thành tâm điểm của mọi ánh nhìn.',
                'content' => '<p>Chọn đầm dự tiệc luôn đòi hỏi sự cân nhắc kỹ lưỡng về vóc dáng và tính chất của bữa tiệc. Dưới đây là top 5 thiết kế dạ hội đắt khách nhất tại showroom StyleRent:</p><ul><li>Đầm dạ hội đuôi cá cúp ngực sang trọng</li><li>Đầm lụa satin lệch vai quý phái</li><li>Váy xòe công chúa đính kết pha lê</li><li>Set vest dạ hội cách điệu cá tính</li><li>Đầm đen body cổ yếm thanh lịch</li></ul>',
                'is_hot' => true,
                'views' => 2680,
                'status' => 'published',
            ],
            [
                'category_id' => $createdCategories['bi-quyet-phoi-do']->id,
                'user_id' => $adminId,
                'title' => 'Bí Quyết Chọn Áo Dài Truyền Thống Tôn Dáng Cho Mọi Vóc Dáng',
                'slug' => 'bi-quyet-chon-ao-dai-truyen-thong-ton-dang',
                'thumbnail' => 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
                'summary' => 'Hướng dẫn chọn cổ áo, độ dài tà và họa tiết thêu giúp các nàng tự tin diện áo dài đẹp chuẩn mực trong các dịp lễ Tết, kỷ yếu.',
                'content' => '<p>Tà áo dài thướt tha luôn là biểu tượng nét đẹp dịu dàng của người phụ nữ Việt Nam. Để diện áo dài thật tôn dáng, bạn cần nắm rõ tỉ lệ cơ thể:</p><p>Với dáng người tròn trịa, hãy ưu tiên chất liệu lụa rũ mềm và cổ thuyền nhẹ nhàng. Ngược lại, nàng mảnh mai sẽ rất phù hợp với áo dài 4 tà bồng bềnh cùng họa tiết thêu nổi đính ngọc trai.</p>',
                'is_hot' => true,
                'views' => 3150,
                'status' => 'published',
            ],
            [
                'category_id' => $createdCategories['bi-quyet-phoi-do']->id,
                'user_id' => $adminId,
                'title' => 'Mẹo Phối Túi Xách & Trang Sức Cực Hút Mắt Cùng Đầm Dạ Hội',
                'slug' => 'meo-phoi-phu-kien-tui-xach-giay-cao-got-khi-du-tiec',
                'thumbnail' => 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80',
                'summary' => 'Công thức phối phụ kiện Clutch ánh kim, khuyên tai đính đá và giày cao gót giúp nâng tầm bộ cánh dự tiệc của bạn.',
                'content' => '<p>Một bộ đầm dạ hội đắt giá sẽ chưa thể hoàn hảo nếu thiếu đi những món phụ kiện ăn ý. Nguyên tắc vàng khi phối đồ dự tiệc là sự cân bằng: Nếu váy đã có nhiều hạt cườm lấp lánh, hãy chọn túi ví và trang sức tối giản để tránh gây rối mắt.</p><p>StyleRent cung cấp miễn phí dịch vụ tư vấn mix & match phụ kiện đi kèm khi quý khách thuê váy tại cửa hàng.</p>',
                'is_hot' => false,
                'views' => 840,
                'status' => 'published',
            ],

            [
                'category_id' => $createdCategories['cam-nang-cuoi-da-hoi']->id,
                'user_id' => $adminId,
                'title' => 'Xu Hướng Váy Cưới Minimalism: Vẻ Đẹp Thuần Khiết Lên Ngôi',
                'slug' => 'xu-huong-vay-cuoi-minimalism-ve-dep-thuan-khiet',
                'thumbnail' => 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&auto=format&fit=crop&q=80',
                'summary' => 'Làn sóng váy cưới lụa satin tối giản, đường cắt cúp thanh thoát đang trở thành niềm mơ ước của những cô dâu hiện đại.',
                'content' => '<p>Không còn đính kết quá nhiều ren và kim sa cầu kỳ, váy cưới tối giản (Minimalist Wedding Dress) tôn vinh trọn vẹn vẻ đẹp tự nhiên và thần thái của cô dâu. Chất liệu Mikado hay lụa Satin cao cấp mang đến phom dáng đứng form và nét sang trọng vượt thời gian.</p><p>Bộ sưu tập váy cưới mới của StyleRent mang đến đa dạng kiểu dáng từ dáng A nhẹ nhàng đến cúp ngực đuôi cá quyến rũ.</p>',
                'is_hot' => true,
                'views' => 2410,
                'status' => 'published',
            ],
            [
                'category_id' => $createdCategories['cam-nang-cuoi-da-hoi']->id,
                'user_id' => $adminId,
                'title' => 'Top 4 Mẫu Vest Nam Lịch Lãm Cho Chú Rể Và Phù Rể',
                'slug' => 'top-4-mau-vest-nam-lich-lam-cho-chu-re-va-phu-re',
                'thumbnail' => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
                'summary' => 'Từ tuxedo đen trang trọng cổ điển đến suit màu kem hiện đại, bí quyết để các quý ông xuất hiện phong độ trong ngày trọng đại.',
                'content' => '<p>Chọn âu phục cho ngày cưới quan trọng không kém gì chiếc váy của cô dâu. Sự đồng điệu về phong cách và màu sắc giữa vest chú rể và váy cô dâu sẽ tạo nên những khung hình kỷ niệm hoàn hảo nhất.</p><p>Các mẫu Tuxedo cổ sam bóng và Suit 2 hàng khuy chất liệu wool nhập khẩu tại StyleRent cam kết mang đến sự vừa vặn tôn dáng tuyệt đối.</p>',
                'is_hot' => false,
                'views' => 1650,
                'status' => 'published',
            ],

            [
                'category_id' => $createdCategories['kinh-nghiem-huong-dan-thue']->id,
                'user_id' => $adminId,
                'title' => 'Kinh Nghiệm Thuê Đồ Dự Tiệc: Đẹp Chuẩn Gu, Tiết Kiệm Đến 80%',
                'slug' => 'kinh-nghiem-thue-do-du-tiec-tiet-kiem-chi-phi',
                'thumbnail' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80',
                'summary' => 'Bí quyết chọn size chuẩn xác, bảo quản trang phục thuê và lên kế hoạch đặt lịch trước ngày tiệc.',
                'content' => '<p>Thuê đồ sự kiện ngày nay đã trở thành phong cách sống hiện đại và thông minh của giới trẻ. Bạn có thể xuất hiện trong một chiếc đầm hàng hiệu giá 20 triệu chỉ với chi phí thuê vài trăm nghìn đồng. Hãy lưu ý chọn size dựa trên bảng số đo 3 vòng và đặt đồ trước ngày tiệc 1-2 ngày để thử đồ vừa vặn nhất.</p>',
                'is_hot' => false,
                'views' => 950,
                'status' => 'published',
            ],
            [
                'category_id' => $createdCategories['kinh-nghiem-huong-dan-thue']->id,
                'user_id' => $adminId,
                'title' => 'Hướng Dẫn Lấy Số Đo 3 Vòng Chuẩn Xác Khi Thuê Đồ Online',
                'slug' => 'huong-dan-lay-so-do-3-vong-chuan-xac-khi-thue-online',
                'thumbnail' => 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
                'summary' => 'Thước dây chuẩn, cách xác định vòng ngực, vòng eo nhỏ nhất và vòng mông để nhân viên hỗ trợ chọn size vừa in không cần chỉnh sửa.',
                'content' => '<p>Để thuê được trang phục vừa khít người khi đặt online, việc tự đo số đo tại nhà rất quan trọng. Bạn chỉ cần một chiếc thước dây mềm và làm theo các bước hướng dẫn chi tiết:</p><ol><li>Vòng ngực: Đo quanh điểm nở nang nhất của ngực khi mặc áo ngực vừa vặn.</li><li>Vòng eo: Đo quanh vị trí nhỏ nhất của eo, cách rốn khoảng 3cm phía trên.</li><li>Vòng mông: Đứng thẳng hai chân khép và đo ngang điểm đầy đặn nhất.</li></ol>',
                'is_hot' => false,
                'views' => 1340,
                'status' => 'published',
            ],
            [
                'category_id' => $createdCategories['kinh-nghiem-huong-dan-thue']->id,
                'user_id' => $adminId,
                'title' => 'Chính Sách Bảo Quản & Đổi Size Trang Phục Tiện Lợi Tại StyleRent',
                'slug' => 'chinh-sach-bao-quan-va-doi-size-trang-phuc-stylerent',
                'thumbnail' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
                'summary' => 'Giải đáp chi tiết về dịch vụ giặt hấp chuyên nghiệp miễn phí, quy trình hỗ trợ đổi size khẩn cấp trong 24h và bảo hiểm trang phục.',
                'content' => '<p>Tại StyleRent, mọi trang phục sau khi nhận lại đều được xử lý qua quy trình giặt hấp tiệt trùng và bảo dưỡng sợi vải nghiêm ngặt. Khách hàng hoàn toàn không cần giặt trước khi hoàn trả.</p><p>Trường hợp thử đồ bị chật hoặc rộng, bạn được hỗ trợ đổi size ngay trong ngày hoàn toàn miễn phí tại nội thành.</p>',
                'is_hot' => false,
                'views' => 880,
                'status' => 'published',
            ],

            [
                'category_id' => $createdCategories['phong-cach-song-su-kien']->id,
                'user_id' => $adminId,
                'title' => 'Gợi Ý Concept Chụp Ảnh Kỷ Yếu Phong Cách Cổ Điển & Hiện Đại',
                'slug' => 'goi-y-concept-chup-anh-ky-yeu-thanh-xuan-cuc-chat',
                'thumbnail' => 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
                'summary' => 'Tổng hợp các concept chụp kỷ yếu hot trend: Áo dài retro Sài Gòn thập niên 90, Dạ hội hoàng gia Âu Mỹ và Bohemian lãng mạn.',
                'content' => '<p>Kỷ yếu là khoảnh khắc thanh xuân đáng nhớ nhất của thời học sinh, sinh viên. Để bộ ảnh tập thể trở nên đồng bộ và ấn tượng, việc lựa chọn trang phục theo một concept thống nhất là chìa khóa then chốt.</p><p>StyleRent có sẵn hơn 200 bộ áo dài đồng phục và set vest phù hợp cho các lớp chụp ảnh kỷ yếu nhóm đông với mức chiết khấu cực kỳ ưu đãi.</p>',
                'is_hot' => true,
                'views' => 2920,
                'status' => 'published',
            ],
            [
                'category_id' => $createdCategories['phong-cach-song-su-kien']->id,
                'user_id' => $adminId,
                'title' => 'Bí Quyết Tỏa Sáng Trong Đêm Tiệc Cuối Năm Year-End Party',
                'slug' => 'bi-quyet-toa-sang-trong-dem-tiec-cuoi-nam-year-end-party',
                'thumbnail' => 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
                'summary' => 'Chọn đồ tiệc công ty vừa thanh lịch, chỉn chu nhưng vẫn nổi bật và thu hút ánh nhìn cho giải thưởng Best Dressed.',
                'content' => '<p>Year-End Party là cơ hội tuyệt vời để bạn rũ bỏ trang phục công sở quen thuộc thường ngày và biến hóa thành một phiên bản kiêu sa, quyến rũ hơn.</p><p>Một chiếc đầm cúp ngực ánh kim phối cùng áo khoác blazer lửng hoặc đầm dạ hội nhung đen xẻ tà sẽ giúp bạn cân bằng hoàn hảo giữa tính trang trọng của sự kiện công ty và vẻ đẹp cuốn hút của đêm tiệc.</p>',
                'is_hot' => false,
                'views' => 1760,
                'status' => 'published',
            ],

            [
                'category_id' => $createdCategories['tin-tuc-uu-dai']->id,
                'user_id' => $adminId,
                'title' => 'StyleRent Ra Mắt Gói Thuê Đồng Hành Cho Mùa Kỷ Yếu & Sự Kiện',
                'slug' => 'stylerent-ra-mat-goi-thue-dong-hanh-ky-yeu',
                'thumbnail' => 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
                'summary' => 'Ưu đãi nhóm lên đến 25% kèm dịch vụ miễn phí giặt là và giao nhận tận nơi cho các bạn sinh viên.',
                'content' => '<p>Đồng hành cùng các bạn học sinh - sinh viên trong các dịp prom, kỷ yếu và thuyết trình tốt nghiệp, StyleRent chính thức triển khai chương trình ưu đãi đặc biệt: Giảm 20% khi thuê từ 3 bộ và tặng voucher phụ kiện đi kèm.</p>',
                'is_hot' => true,
                'views' => 1890,
                'status' => 'published',
            ],
            [
                'category_id' => $createdCategories['tin-tuc-uu-dai']->id,
                'user_id' => $adminId,
                'title' => 'Ưu Đãi Mùa Cưới 2026: Trọn Gói Váy Cưới & Vest Cao Cấp Tiết Kiệm 30%',
                'slug' => 'uu-dai-mua-cuoi-2026-tron-goi-vay-cuoi-va-vest-nam',
                'thumbnail' => 'https://images.unsplash.com/photo-1546804784-896d0dca3805?w=800&auto=format&fit=crop&q=80',
                'summary' => 'Chương trình tri ân mùa cưới: Đặt combo váy cưới và vest chú rể tặng ngay gói thuê áo dài lễ vu quy và phụ kiện voan cài tóc.',
                'content' => '<p>Mùa cưới 2026 rộn ràng với chương trình quà tặng đặc biệt nhất trong năm từ StyleRent. Khi các cặp đôi thuê trọn gói trang phục cưới chính, bạn sẽ được tặng kèm voucher phụ kiện và miễn phí ngày giữ đồ thêm 2 ngày.</p><p>Hãy đặt lịch hẹn thử váy tại showroom để được đội ngũ chuyên viên tạo mẫu tư vấn chuyên sâu.</p>',
                'is_hot' => true,
                'views' => 2200,
                'status' => 'published',
            ],
            [
                'category_id' => $createdCategories['tin-tuc-uu-dai']->id,
                'user_id' => $adminId,
                'title' => 'Khai Trương Showroom Mới: Nhận Quà Tặng Voucher Thuê Đồ 500.000đ',
                'slug' => 'khai-truong-showroom-moi-nhan-voucher-500k',
                'thumbnail' => 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&auto=format&fit=crop&q=80',
                'summary' => 'Chào đón không gian thử đồ sang trọng mới cùng hơn 500 mẫu váy thiết kế mới nhất vừa được bổ sung vào bộ sưu tập.',
                'content' => '<p>Nhằm mang đến trải nghiệm thử đồ rộng rãi và chuyên nghiệp nhất cho khách hàng, StyleRent hân hoan khai trương chi nhánh showroom mới với không gian phòng thử chuẩn studio ánh sáng cao cấp.</p><p>100 khách hàng đầu tiên ghé check-in sẽ nhận ngay voucher giảm 500.000đ áp dụng cho mọi hóa đơn thuê trang phục.</p>',
                'is_hot' => false,
                'views' => 1530,
                'status' => 'published',
            ],
        ];

        foreach ($posts as $post) {
            Post::updateOrCreate(
                ['slug' => $post['slug']],
                $post
            );
        }
    }
}
