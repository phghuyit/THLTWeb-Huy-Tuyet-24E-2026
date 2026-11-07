<?php

namespace App\Http\Controllers;

use App\Http\Resources\Order\OrderResource;
use App\Http\Resources\ProductResource;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Order;
use App\Models\Post;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $totalOrders = Order::count();
        $totalRevenue = (int) Order::whereNotIn('status', ['cancelled', 'pending_payment'])->sum('total_amount');
        $monthlyRevenue = (int) Order::whereNotIn('status', ['cancelled', 'pending_payment'])
            ->where('created_at', '>=', now()->subDays(30))
            ->sum('total_amount');

        $pendingOrders = Order::whereIn('status', ['pending_payment', 'confirmed'])->count();
        $activeRentals = Order::whereIn('status', ['in_use', 'ready', 'preparing'])->count();

        $totalProducts = Product::count();
        $totalUsers = User::where('role', '!=', 'admin')->count();
        $totalReviews = Review::count();
        $pendingReviews = Review::where('status', 'pending')->count();
        $totalPosts = Post::count();
        $totalCategories = Category::count();
        $totalBrands = Brand::count();

        $rawStatus = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $allStatuses = [
            'pending_payment' => 0,
            'confirmed' => 0,
            'preparing' => 0,
            'ready' => 0,
            'in_use' => 0,
            'inspecting' => 0,
            'completed' => 0,
            'cancelled' => 0,
        ];

        foreach ($rawStatus as $status => $count) {
            $allStatuses[$status] = (int) $count;
        }

        $recentOrders = Order::with(['user', 'items.productSize.product'])
            ->latest('id')
            ->take(6)
            ->get();

        $topProducts = Product::with(['category', 'brand'])
            ->orderByDesc('view_count')
            ->latest('id')
            ->take(5)
            ->get();

        return response()->json([
            'counters' => [
                'total_revenue' => $totalRevenue,
                'monthly_revenue' => $monthlyRevenue,
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'active_rentals' => $activeRentals,
                'total_products' => $totalProducts,
                'total_users' => $totalUsers,
                'total_reviews' => $totalReviews,
                'pending_reviews' => $pendingReviews,
                'total_posts' => $totalPosts,
                'total_categories' => $totalCategories,
                'total_brands' => $totalBrands,
            ],
            'status_distribution' => $allStatuses,
            'recent_orders' => OrderResource::collection($recentOrders),
            'top_products' => ProductResource::collection($topProducts),
        ]);
    }
}
