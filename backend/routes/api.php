<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Resources\User\LoginUserResource;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\VNPayController;
use App\Http\Controllers\VoucherController;
use App\Http\Middleware\CheckAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::prefix('products')->as('products.')->group(function () {
    Route::get('/', [ProductController::class, 'index'])->name('index');
    Route::get('/{slug}', [ProductController::class, 'show'])->name('show');
});

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/forgot-password/send-code', [ForgotPasswordController::class, 'sendResetCode'])->middleware('throttle:5,1');
Route::post('/forgot-password/verify-code', [ForgotPasswordController::class, 'verifyCodeAndResetPassword'])->middleware('throttle:10,1');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [UserController::class, 'profile']);
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    Route::post('/profile/avatar', [UserController::class, 'uploadAvatar']);
    Route::delete('/profile/avatar', [UserController::class, 'deleteAvatar']);
    Route::put('/profile/password', [UserController::class, 'changePassword']);
    Route::get('/my-orders', [OrderController::class, 'myOrders']);

    Route::prefix('cart')->as('cart.')->group(function () {
        Route::get('/', [CartController::class, 'index'])->name('index');
        Route::post('/', [CartController::class, 'store'])->name('store');
        Route::post('/add', [CartController::class, 'store'])->name('add');
        Route::put('/{id}', [CartController::class, 'update'])->name('update');
        Route::delete('/clear', [CartController::class, 'clear'])->name('clear');
        Route::delete('/{id}', [CartController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('orders')->as('orders.')->group(function () {
        Route::post('/', [OrderController::class, 'store'])->name('store');
        Route::get('/{code}', [OrderController::class, 'show'])->name('show');
    });
});
Route::prefix('categories')->as('categories.')->group(function () {
    Route::get('/', [CategoryController::class, 'index'])->name('index');
    Route::get('/{slug}', [CategoryController::class, 'show'])->name('show');
});

Route::prefix('brands')->as('brands.')->group(function () {
    Route::get('/', [BrandController::class, 'index'])->name('index');
    Route::get('/{slug}', [BrandController::class, 'show'])->name('show');
});

Route::get('/banners', [BannerController::class, 'index'])->name('banners.index');

Route::prefix('reviews')->as('reviews.')->group(function () {
    Route::get('/', [ReviewController::class, 'index'])->name('index');
    Route::post('/', [ReviewController::class, 'store'])->name('store');
});

Route::prefix('posts')->as('posts.')->group(function () {
    Route::get('/', [PostController::class, 'index'])->name('index');
    Route::get('/hot', [PostController::class, 'hot'])->name('hot');
    Route::get('/categories', [PostController::class, 'categories'])->name('categories');
    Route::get('/{slug}', [PostController::class, 'show'])->name('show');
});

Route::prefix('menus')->as('menus.')->group(function () {
    Route::get('/', [MenuController::class, 'index'])->name('index');
});

Route::prefix('vouchers')->as('vouchers.')->group(function () {
    Route::get('/', [VoucherController::class, 'indexClient'])->name('index');
    Route::post('/validate', [VoucherController::class, 'validateVoucher'])->name('validate');
});

Route::prefix('payment')->as('payment.')->group(function () {
    Route::post('/vnpay/create', [VNPayController::class, 'createPaymentUrl'])->name('vnpay.create');
    Route::get('/vnpay/ipn', [VNPayController::class, 'handleIPN'])->name('vnpay.ipn');
    Route::get('/vnpay/return', [VNPayController::class, 'handleReturn'])->name('vnpay.return');
});

Route::post('/contacts', [ContactController::class, 'store'])->name('contacts.store');

Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:5,1')
    ->name('register');


Route::prefix('admin')->as('admin.')->group(function () {
    Route::post('login', [AuthController::class, 'adminLogin'])->middleware('throttle:5,1');

    Route::middleware(['auth:sanctum', CheckAdmin::class])->group(function () {
        Route::get('me', function (Request $request) {
            return new LoginUserResource($request->user());
        });

        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::prefix('orders')->as('orders.')->group(function () {
            Route::get('/trash', [OrderController::class, 'trash'])->name('trash');
            Route::patch('/{id}/restore', [OrderController::class, 'restore'])->name('restore');
            Route::delete('/{id}/force', [OrderController::class, 'forceDelete'])->name('force-delete');
            Route::delete('/{id}', [OrderController::class, 'destroy'])->name('destroy');
            Route::get('/', [OrderController::class, 'index'])->name('index');
            Route::patch('/{code}', [OrderController::class, 'updateStatus'])->name('update-status');
            Route::get('/{code}', [OrderController::class, 'show'])->name('show');
        });

        Route::prefix('categories')->as('categories.')->group(function () {
            Route::get('trash', [CategoryController::class, 'trash'])->name('trash');
            Route::patch('{id}/restore', [CategoryController::class, 'restore'])->name('restore');
            Route::post('/', [CategoryController::class, 'store'])->name('store');
            Route::patch('/{category}', [CategoryController::class, 'update'])->name('update');
            Route::delete('/{category}', [CategoryController::class, 'softDelete'])->name('destroy');
            Route::delete('/{id}/force', [CategoryController::class, 'forceDelete'])->name('force-delete');
        });

        Route::prefix('brands')->as('brands.')->group(function () {
            Route::get('trash', [BrandController::class, 'trash'])->name('trash');
            Route::patch('{id}/restore', [BrandController::class, 'restore'])->name('restore');
            Route::post('/', [BrandController::class, 'store'])->name('store');
            Route::patch('/{brand}', [BrandController::class, 'update'])->name('update');
            Route::delete('/{brand}', [BrandController::class, 'softDelete'])->name('destroy');
            Route::delete('/{id}/force', [BrandController::class, 'forceDelete'])->name('force-delete');
        });

        Route::get('products/trash', [ProductController::class, 'trash'])->name('products.trash');
        Route::patch('products/{id}/restore', [ProductController::class, 'restore'])->name('products.restore');
        Route::delete('products/{id}/force', [ProductController::class, 'forceDelete'])->name('products.force-delete');
        Route::post('products/upload-image', [ProductController::class, 'uploadImage'])->name('products.upload-image');
        Route::patch('products/{product}/stock', [ProductController::class, 'updateStock'])->name('products.stock.update');
        Route::post('products/{product}/stock/import', [ProductController::class, 'importStock'])->name('products.stock.import');
        Route::post('products/{product}/stock/export', [ProductController::class, 'exportStock'])->name('products.stock.export');
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);

        Route::prefix('reviews')->as('reviews.')->group(function () {
            Route::get('trash', [ReviewController::class, 'trash'])->name('trash');
            Route::patch('{id}/restore', [ReviewController::class, 'restore'])->name('restore');
            Route::delete('{id}/force', [ReviewController::class, 'forceDelete'])->name('force-delete');
            Route::get('/', [ReviewController::class, 'adminIndex'])->name('index');
            Route::patch('/{review}/status', [ReviewController::class, 'updateStatus'])->name('update-status');
            Route::delete('/{review}', [ReviewController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('posts')->as('posts.')->group(function () {
            Route::get('trash', [PostController::class, 'trash'])->name('trash');
            Route::patch('{id}/restore', [PostController::class, 'restore'])->name('restore');
            Route::delete('{id}/force', [PostController::class, 'forceDelete'])->name('force-delete');
            Route::get('categories/trash', [PostController::class, 'trashCategories'])->name('categories.trash');
            Route::patch('categories/{id}/restore', [PostController::class, 'restoreCategory'])->name('categories.restore');
            Route::delete('categories/{id}/force', [PostController::class, 'forceDeleteCategory'])->name('categories.force-delete');
            Route::get('/', [PostController::class, 'adminIndex'])->name('index');
            Route::post('/', [PostController::class, 'store'])->name('store');
            Route::get('/{id}', [PostController::class, 'adminShow'])->name('show');
            Route::put('/{post}', [PostController::class, 'update'])->name('update');
            Route::delete('/{post}', [PostController::class, 'destroy'])->name('destroy');
            Route::post('/categories', [PostController::class, 'storeCategory'])->name('categories.store');
            Route::put('/categories/{postCategory}', [PostController::class, 'updateCategory'])->name('categories.update');
            Route::delete('/categories/{postCategory}', [PostController::class, 'destroyCategory'])->name('categories.destroy');
        });

        Route::prefix('menus')->as('menus.')->group(function () {
            Route::get('trash', [MenuController::class, 'trash'])->name('trash');
            Route::patch('{id}/restore', [MenuController::class, 'restore'])->name('restore');
            Route::delete('{id}/force', [MenuController::class, 'forceDelete'])->name('force-delete');
            Route::get('/', [MenuController::class, 'adminIndex'])->name('index');
            Route::post('/', [MenuController::class, 'store'])->name('store');
            Route::post('/order', [MenuController::class, 'updateOrder'])->name('order');
            Route::get('/{id}', [MenuController::class, 'show'])->name('show');
            Route::put('/{menu}', [MenuController::class, 'update'])->name('update');
            Route::delete('/{menu}', [MenuController::class, 'destroy'])->name('destroy');
        });

        Route::post('logout', [AuthController::class, 'logout']);

        Route::prefix('users')->as('users.')->group(function () {
            Route::get('trash', [UserController::class, 'trash'])->name('trash');
            Route::patch('{id}/restore', [UserController::class, 'restore'])->name('restore');
            Route::delete('{id}/force', [UserController::class, 'forceDelete'])->name('force-delete');
            Route::get('/', [UserController::class, 'index'])->name('index');
            Route::post('/', [UserController::class, 'store'])->name('store');
            Route::get('/{id}', [UserController::class, 'show'])->name('show');
            Route::patch('/{user}', [UserController::class, 'update'])->name('update');
            Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('vouchers')->as('vouchers.')->group(function () {
            Route::get('/', [VoucherController::class, 'indexAdmin'])->name('index');
            Route::post('/', [VoucherController::class, 'store'])->name('store');
            Route::get('/{id}', [VoucherController::class, 'show'])->name('show');
            Route::put('/{id}', [VoucherController::class, 'update'])->name('update');
            Route::delete('/{id}', [VoucherController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('contacts')->as('contacts.')->group(function () {
            Route::get('trash', [ContactController::class, 'trash'])->name('trash');
            Route::patch('{id}/restore', [ContactController::class, 'restore'])->name('restore');
            Route::delete('{id}/force', [ContactController::class, 'forceDelete'])->name('force-delete');
            Route::get('/', [ContactController::class, 'index'])->name('index');
            Route::get('/{id}', [ContactController::class, 'show'])->name('show');
            Route::put('/{id}', [ContactController::class, 'update'])->name('update');
            Route::delete('/{id}', [ContactController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('banners')->as('banners.')->group(function () {
            Route::get('/', [BannerController::class, 'adminIndex'])->name('index');
            Route::post('/', [BannerController::class, 'store'])->name('store');
            Route::get('/{id}', [BannerController::class, 'show'])->name('show');
            Route::put('/{id}', [BannerController::class, 'update'])->name('update');
            Route::post('/{id}', [BannerController::class, 'update'])->name('update-post');
            Route::delete('/{id}', [BannerController::class, 'destroy'])->name('destroy');
        });
    });
});
