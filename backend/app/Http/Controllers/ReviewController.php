<?php

namespace App\Http\Controllers;

use App\Http\Requests\Review\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::with(['user', 'product:id,name,slug'])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            $query->whereIn('status', ['approved', 'pending']);
        }

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->filled('product_slug')) {
            $product = Product::where('slug', $request->product_slug)->first();
            if ($product) {
                $query->where('product_id', $product->id);
            }
        }

        $reviews = $query->paginate($request->integer('per_page', 20));

        return ReviewResource::collection($reviews);
    }

    public function store(StoreReviewRequest $request)
    {
        $user = $request->user('sanctum') ?? auth('sanctum')->user();
        $validated = $request->validated();

        if (empty($validated['product_id']) && !empty($validated['product_slug'])) {
            $product = Product::where('slug', $validated['product_slug'])->first();
            if ($product) {
                $validated['product_id'] = $product->id;
            }
        }

        $validated['user_id'] = $user?->id;
        $validated['author_name'] = $validated['author_name'] ?? $user?->fullname ?? 'Khách hàng';
        $validated['status'] = $validated['status'] ?? 'pending';

        $review = Review::create($validated);

        return (new ReviewResource($review->load('product')))
            ->response()
            ->setStatusCode(201);
    }

    public function adminIndex(Request $request)
    {
        $query = Review::with(['user', 'product:id,name,slug'])->latest();

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('rating') && $request->rating !== 'all') {
            $query->where('rating', $request->rating);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('author_name', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%")
                    ->orWhereHas('product', function ($pq) use ($search) {
                        $pq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $reviews = $query->paginate($request->integer('per_page', 50));

        return ReviewResource::collection($reviews);
    }

    public function updateStatus(Request $request, Review $review)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,hidden',
        ]);

        $review->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Cập nhật trạng thái đánh giá thành công',
            'data' => new ReviewResource($review),
        ]);
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return response()->json([
            'message' => 'Xóa đánh giá thành công',
            'code' => 200,
        ]);
    }

    public function trash()
    {
        $reviews = Review::onlyTrashed()->with(['product', 'user'])->latest('deleted_at')->get();
        return ReviewResource::collection($reviews);
    }

    public function restore($id)
    {
        $review = Review::onlyTrashed()->findOrFail($id);
        $review->restore();
        return response()->json(['message' => 'Khôi phục đánh giá thành công']);
    }

    public function forceDelete($id)
    {
        $review = Review::onlyTrashed()->findOrFail($id);
        $review->forceDelete();
        return response()->json(['message' => 'Xóa đánh giá vĩnh viễn thành công']);
    }
}
