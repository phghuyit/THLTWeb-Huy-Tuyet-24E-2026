# StyleRent – Hướng dẫn cài đặt & sử dụng

> Đồ án THLTWeb – Nhóm Huy & Tuyết
> Website cho thuê trang phục cao cấp: áo dài, váy dạ hội, váy cưới, vest, phụ kiện.

| Thành phần | Công nghệ | Địa chỉ khi chạy |
|---|---|---|
| Backend (API) | Laravel 12 · PHP 8.2 · Sanctum | http://localhost:8000/api |
| Frontend | Next.js 16 · React 19 · Tailwind CSS 4 | http://localhost:3000 |
| Trang quản trị | Next.js (cùng frontend) | http://localhost:3000/admin |
| Cơ sở dữ liệu | MySQL / MariaDB (XAMPP) | `127.0.0.1:3306` |
| Thanh toán online | VNPay **Sandbox** (môi trường test) | sandbox.vnpayment.vn |

---

## 1. Hướng dẫn cài đặt

### 1.1. Phần mềm cần có

| Phần mềm | Phiên bản | Ghi chú |
|---|---|---|
| XAMPP | có PHP **8.2** trở lên | Dùng MySQL + phpMyAdmin, PHP của XAMPP dùng luôn cho Laravel |
| Composer | 2.x | Cài thư viện PHP |
| Node.js | **20.9** trở lên (khuyên dùng 22 LTS) | Next.js 16 yêu cầu Node ≥ 20.9 |


Kiểm tra nhanh trong terminal:

```bash
php -v
composer -V
node -v
```

> Nếu `php -v` báo không tìm thấy lệnh: thêm `C:\xampp\php` vào biến môi trường **Path** của Windows.

### 1.2. Tên cơ sở dữ liệu

| Thông số | Giá trị |
|---|---|
| Tên CSDL | **`thltweb_huy_tuyet`** |
| Bảng mã | `utf8mb4` / `utf8mb4_unicode_ci` |
| Host / Port | `127.0.0.1` / `3306` |
| Tài khoản MySQL (XAMPP mặc định) | user `root`, mật khẩu **để trống** |

### 1.3. Tạo CSDL bằng XAMPP (chọn 1 trong 2 cách)

Mở **XAMPP Control Panel** → bấm **Start** ở dòng **Apache** và **MySQL** (Apache cần để mở phpMyAdmin).

**Cách A – Import file SQL (nhanh nhất)**

1. Mở http://localhost/phpmyadmin
2. Chọn tab **Import** (không cần tạo CSDL trước, file đã có sẵn lệnh `CREATE DATABASE`).
3. Bấm **Choose File** → chọn `docs/thltweb_huy_tuyet.sql` → bấm **Import / Go** ở cuối trang.
4. Bên trái xuất hiện CSDL `thltweb_huy_tuyet` với 23 bảng là thành công.

**Cách B – Dùng migration của Laravel**

1. Mở http://localhost/phpmyadmin → **New** → nhập tên `thltweb_huy_tuyet`, chọn `utf8mb4_unicode_ci` → **Create**.
2. Làm xong bước 1.4 (cài backend), rồi chạy:

```bash
php artisan migrate --seed
```

> Muốn xoá sạch dữ liệu và tạo lại từ đầu: `php artisan migrate:fresh --seed`
> (Cách A và Cách B cho ra cùng một bộ dữ liệu mẫu.)

### 1.4. Cài và chạy Backend (Laravel)

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
```

Mở file `backend/.env`, kiểm tra các dòng sau:

```env
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=thltweb_huy_tuyet
DB_USERNAME=root
DB_PASSWORD=            # XAMPP mặc định để TRỐNG (nếu ghi "root" sẽ lỗi Access denied)

# Gửi mail (OTP quên mật khẩu, mail xác nhận đơn) – xem mục 5.1
MAIL_MAILER=log         # hoặc smtp nếu muốn gửi mail thật

# VNPay Sandbox – xem mục 4
VNP_TMN_CODE=
VNP_HASH_SECRET=
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:3000/checkout/result
```

Tạo liên kết thư mục ảnh upload (ảnh sản phẩm, avatar…) rồi chạy server:

```bash
php artisan storage:link
php artisan serve
```

Backend chạy tại **http://localhost:8000**. Thử mở http://localhost:8000/api/products – thấy dữ liệu JSON là được.

### 1.5. Cài và chạy Frontend (Next.js)

Mở **một terminal khác** (giữ nguyên terminal backend):

```bash
cd frontend
npm install
```

Tạo file `frontend/.env.local` với nội dung:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

> Nếu không tạo file này, frontend vẫn tự dùng `http://localhost:8000/api`.

```bash
npm run dev
```

Mở trình duyệt: **http://localhost:3000**

### 1.6. Tóm tắt – các lần chạy sau

1. XAMPP: Start **MySQL** (và Apache nếu cần phpMyAdmin)
2. Terminal 1: `cd backend` → `php artisan serve`
3. Terminal 2: `cd frontend` → `npm run dev`
4. Truy cập http://localhost:3000 (người dùng) và http://localhost:3000/admin (quản trị)

### 1.7. Lỗi thường gặp

| Lỗi | Nguyên nhân / Cách sửa |
|---|---|
| `SQLSTATE[HY000] [1045] Access denied for user 'root'` | Sai `DB_PASSWORD` trong `backend/.env`. XAMPP mặc định để trống. |
| `SQLSTATE[HY000] [2002] No connection could be made` | Chưa Start MySQL trong XAMPP. |
| `Unknown database 'thltweb_huy_tuyet'` | Chưa tạo/import CSDL (mục 1.3). |
| `Table '...' already exists` khi `migrate` | Đã import file SQL rồi thì **không** cần chạy `migrate` nữa. |
| Frontend báo lỗi mạng / không có sản phẩm | Backend chưa chạy hoặc sai `NEXT_PUBLIC_API_URL`. |
| `Too Many Attempts` khi đăng nhập | Giới hạn 5 lần/phút, chờ 1 phút rồi thử lại. |
| Ảnh upload không hiển thị | Chưa chạy `php artisan storage:link`. |

---

## 2. File SQL

| File | Mô tả |
|---|---|
| `docs/thltweb_huy_tuyet.sql` | **Dùng file này.** Cấu trúc + dữ liệu mẫu đầy đủ, khớp với migration hiện tại (23 bảng). Tự tạo CSDL `thltweb_huy_tuyet`.|
| `docs/THLTW_Postman_Collection.json` | Bộ request Postman để test API. |
| `docs/DATABASE_SPECIFICATION.md` | Đặc tả CSDL. |

Dữ liệu mẫu có sẵn: 3 tài khoản, 10 danh mục, 6 thương hiệu, 8 sản phẩm (27 size/biến thể), 3 đơn hàng, 15 bài viết, 3 voucher, banner, menu, liên hệ.

---

## 3. Thông tin tài khoản

### 3.1. Tài khoản quản trị (Admin)

| Vai trò | Email | Mật khẩu | Đăng nhập tại |
|---|---|---|---|
| Quản trị viên | `admin@gmail.com` | `admin123456` | http://localhost:3000/admin/login |

### 3.2. Tài khoản khách hàng (Shop)

| Vai trò | Email | Mật khẩu | Ghi chú |
|---|---|---|---|
| Thành viên | `member@gmail.com` | `member123456` | Đã có sẵn 2 đơn hàng mẫu |
| Thành viên bị khoá | `locked@gmail.com` | `password123` | Dùng để demo: **không đăng nhập được** và không lấy lại mật khẩu được |
| | | | |

> Đăng nhập khách hàng tại http://localhost:3000/login. Có thể tự tạo tài khoản mới ở `/register` (mật khẩu tối thiểu 8 ký tự, SĐT 10–11 số).

---

## 4. Thanh toán online (VNPay Sandbox)

Dự án tích hợp cổng **VNPay ở chế độ Sandbox** – mọi giao dịch đều là giả lập, **không trừ tiền thật**.

### 4.1. Cấu hình

Điền trong `backend/.env` (lấy từ tài khoản merchant test tại https://sandbox.vnpayment.vn/devreg/):

| Biến | Giá trị |
|---|---|
| `VNP_TMN_CODE` | _(điền mã website/Terminal ID)_ |
| `VNP_HASH_SECRET` | _(điền chuỗi bí mật – không đưa lên GitHub)_ |
| `VNP_URL` | `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html` |
| `VNP_RETURN_URL` | `http://localhost:3000/checkout/result` |

### 4.2. Thẻ ngân hàng test

Khi trang VNPay hiện ra, chọn **Thẻ nội địa và tài khoản ngân hàng** → chọn ngân hàng **NCB**, nhập:

| Thông tin | Giá trị |
|---|---|
| Ngân hàng | **NCB** |
| Số thẻ | `9704198526191432198` |
| Tên chủ thẻ | `NGUYEN VAN A` |
| Ngày phát hành | `07/15` |
| Mật khẩu OTP | `123456` |

### 4.3. Các bước thanh toán

1. Đăng nhập tài khoản khách hàng → chọn sản phẩm → chọn **ngày thuê**, **size**, **số lượng** → bấm **Thêm vào giỏ thuê** hoặc **Thuê ngay**.
2. Vào **Giỏ thuê** → **Tiến hành đặt thuê**.
3. Trang thanh toán: kiểm tra thông tin người nhận (tự điền từ hồ sơ), nhập mã giảm giá nếu có.
4. Chọn **Cổng thanh toán VNPay** → bấm **Xác nhận & Thanh toán** → hệ thống chuyển sang trang VNPay.
5. Chọn **Thẻ nội địa và tài khoản ngân hàng** → **NCB** → nhập thông tin thẻ test ở mục 4.2 → **Tiếp tục** → **Đồng ý & Tiếp tục**.
6. Nhập OTP `123456` → **Thanh toán**.
7. VNPay chuyển về trang **/checkout/result** → hiện "Đặt đơn thuê thành công!", đơn chuyển sang trạng thái **Đã xác nhận**.

Nếu bấm **Huỷ thanh toán** trên trang VNPay → đơn chuyển sang **Đã huỷ**.

### 4.4. Thanh toán bằng quét mã QR

Trên trang VNPay chọn **App Ngân hàng và Ví điện tử (VNPAY-QR)** → trang hiện mã QR.



### 4.5. Thanh toán khi nhận đồ (COD)

Ở bước 4 chọn **Thanh toán khi nhận đồ (COD / Tiền mặt)** → đơn được tạo ngay với trạng thái **Đã xác nhận** và gửi mail xác nhận đơn cho khách.

---

## 5. Mã OTP & khuyến mãi

### 5.1. Quên mật khẩu bằng mã OTP

1. Trang đăng nhập → bấm **Quên mật khẩu?** (http://localhost:3000/forgot-password).
2. Nhập email tài khoản (ví dụ `member@gmail.com`) → hệ thống gửi **mã OTP 6 chữ số** về email.
3. Nhập mã OTP → hệ thống tạo **mật khẩu mới ngẫu nhiên 8 ký tự** và hiển thị ngay trên màn hình → sao chép để đăng nhập, sau đó vào **Tài khoản** để đổi lại mật khẩu.

Quy định:
- Mã OTP có hiệu lực **10 phút**, dùng 1 lần.
- Tài khoản **bị khoá** không lấy lại được mật khẩu.
- Gửi mã tối đa 5 lần/phút.

**Cách xem mã OTP khi demo** (tuỳ cấu hình mail trong `backend/.env`):

| Cấu hình | Mã OTP nằm ở đâu |
|---|---|
| `MAIL_MAILER=smtp` (Gmail, đúng mật khẩu ứng dụng) | Hộp thư của email đó (kiểm tra cả mục **Spam**) |
| `MAIL_MAILER=smtp` nhưng sai thông tin, `APP_DEBUG=true` | Hiện thẳng trong thông báo lỗi trên màn hình: "Chế độ thử nghiệm: mã OTP là: ……" |
| `MAIL_MAILER=log` | phpMyAdmin → CSDL `thltweb_huy_tuyet` → bảng **`password_reset_tokens`** → cột `token` (hoặc cuối file `backend/storage/logs/laravel.log`) |

Cấu hình gửi mail thật qua Gmail:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_ENCRYPTION=tls
MAIL_USERNAME=            # (điền) địa chỉ Gmail gửi
MAIL_PASSWORD=            # (điền) Mật khẩu ứng dụng 16 ký tự của Google, KHÔNG phải mật khẩu Gmail
MAIL_FROM_ADDRESS=        # (điền) trùng MAIL_USERNAME
MAIL_FROM_NAME="StyleRent - Tuyet Huy"
```

### 5.2. Mã khuyến mãi (Voucher)

Voucher có sẵn trong dữ liệu mẫu:

| Mã | Giảm | Áp dụng cho đơn có tiền thuê từ | Ghi chú |
|---|---|---|---|
| `WELCOME30K` | 30.000₫ | 150.000₫ | Chào mừng thành viên mới |
| `GIAM50K` | 50.000₫ | 300.000₫ | Ưu đãi thuê đồ tiệc |
| `GIAM100K` | 100.000₫ | 500.000₫ | Ưu đãi khách hàng VIP |
| | | | |

Cách dùng:
1. Ở trang **Thanh toán**, ô **Mã giảm giá**: gõ mã (không phân biệt hoa thường) → **Áp dụng**,
   hoặc bấm **Chọn mã ưu đãi** để xem danh sách và chọn mã đủ điều kiện.
2. Điều kiện tính trên **tổng tiền thuê** (không tính tiền cọc). Nếu chưa đủ, hệ thống báo "còn thiếu …đ".
3. Mã hợp lệ → dòng "Giảm giá voucher" hiện ra và trừ vào số tiền cần thanh toán. Bấm **Gỡ** để bỏ mã.

Admin tạo / sửa / tắt voucher tại **Quản trị → Khuyến mãi / Voucher**.

---

## 6. Chức năng chính & hướng dẫn sử dụng

### 6.1. Phía khách hàng – http://localhost:3000

| Chức năng | Đường dẫn | Cách dùng |
|---|---|---|
| Trang chủ | `/` | Banner, sản phẩm nổi bật, danh mục, bài viết mới |
| Danh sách sản phẩm | `/products` | Lọc theo danh mục, thương hiệu, tìm kiếm |
| Chi tiết sản phẩm | `/products/{slug}` | Chọn **ngày thuê**, **gói thuê** (1 ngày / 3 ngày / 7 ngày…), **size**, **số lượng**; xem tiền thuê, tiền cọc, tồn kho |
| Giỏ thuê | `/cart` | Sửa số lượng, xoá món, xem tổng tiền thuê + cọc (cần đăng nhập) |
| Thanh toán | `/checkout` | Thông tin người nhận, mã giảm giá, chọn VNPay hoặc COD |
| Kết quả thanh toán | `/checkout/result` | Thông báo đặt đơn thành công / thất bại |
| Đơn thuê của tôi | `/orders` | Xem các đơn đã đặt và trạng thái |
| Tài khoản | `/account` | Sửa hồ sơ, đổi ảnh đại diện, đổi mật khẩu |
| Đăng ký / Đăng nhập | `/register`, `/login` | |
| Quên mật khẩu | `/forgot-password` | Lấy lại mật khẩu bằng OTP (mục 5.1) |
| Đánh giá sản phẩm | trong trang chi tiết | Bấm **Viết đánh giá của bạn** → đánh giá ở trạng thái **Chờ duyệt**, admin duyệt mới hiển thị |
| Bài viết | `/news`, `/posts` | Tin tức, xu hướng thời trang |
| Bảng giá & Quy định | `/pricing` | Chính sách thuê, cọc, huỷ đơn |
| Liên hệ | `/contact` | Gửi liên hệ → admin xem ở mục **Liên hệ & Hỗ trợ** |

**Cách tính tiền thuê:**
- Tiền thuê = giá theo ngày × số ngày; nếu có **gói thuê** (3 ngày, 7 ngày…) hệ thống tự chọn cách tính rẻ nhất.
- **Tiền cọc** được hoàn lại 100% khi trả đồ nguyên vẹn.
- Tổng cần thanh toán = tiền thuê − voucher + tiền cọc.

### 6.2. Phía quản trị – http://localhost:3000/admin

Đăng nhập bằng tài khoản admin (mục 3.1).

| Menu | Chức năng |
|---|---|
| **Dashboard** | Doanh thu 30 ngày, tổng đơn, đơn cần xử lý, sản phẩm xem nhiều, đơn gần đây |
| **Sản phẩm** | Thêm / sửa / xoá sản phẩm, giá thuê theo ngày, giá sale, tiền cọc, size, ảnh |
| **Quản lý tồn kho** | **Nhập kho / Xuất kho** theo từng size, xem số lượng còn |
| **Đơn hàng** | Lọc theo trạng thái, xem chi tiết, **đổi trạng thái đơn**: Chờ thanh toán → Đã xác nhận → Đang soạn đồ → Sẵn sàng bàn giao → Đang thuê → Đang kiểm tra khi trả → Hoàn tất (hoặc Đã huỷ / Quá hạn trả) |
| **Danh mục** / **Thương hiệu** | Quản lý danh mục, thương hiệu sản phẩm |
| **Người dùng** | Thêm / sửa tài khoản, phân quyền admin/member, **khoá / mở khoá** tài khoản |
| **Quản lý bài viết** | Bài viết và danh mục bài viết |
| **Đánh giá** | **Duyệt / Ẩn** đánh giá của khách |
| **Menu điều hướng** | Thêm / sửa menu trên thanh điều hướng, sắp xếp thứ tự hiển thị |
| **Banner & Quảng cáo** | Banner trang chủ |
| **Khuyến mãi / Voucher** | Tạo mã giảm giá, số tiền giảm, đơn tối thiểu, bật/tắt |
| **Liên hệ & Hỗ trợ** | Xem và xử lý liên hệ từ khách |
| **Thùng rác** | Dữ liệu đã xoá (xoá mềm) – **khôi phục** hoặc **xoá vĩnh viễn** |



---

## 7. Cấu trúc thư mục

```
THLTW-NHOM-HUY-TUYET-24E/
├── backend/                 # Laravel API
│   ├── app/Http/Controllers # Xử lý API (Order, VNPay, Voucher, ForgotPassword…)
│   ├── database/migrations  # Cấu trúc bảng
│   ├── database/seeders     # Dữ liệu mẫu (tài khoản, sản phẩm, voucher…)
│   ├── routes/api.php       # Danh sách API
│   └── .env                 # Cấu hình (DB, mail, VNPay) – không đưa lên GitHub
├── frontend/                # Next.js
│   ├── src/app/(user)       # Trang khách hàng
│   ├── src/app/admin        # Trang quản trị
│   ├── src/services         # Gọi API
│   └── .env.local           # NEXT_PUBLIC_API_URL
└── docs/                    # Tài liệu, file SQL, Postman
```

---

