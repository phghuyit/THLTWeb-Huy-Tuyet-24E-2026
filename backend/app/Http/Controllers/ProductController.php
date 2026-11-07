<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSize;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{


    public function index(Request $request)
    {
        $request->validate([
            'is_featured' => 'sometimes|boolean',
            'is_sale' => 'sometimes|boolean',
            'category' => 'nullable|string|max:120',
            'per_page' => 'sometimes|integer|min:1|max:100',
        ]);

        $query = Product::with(['category', 'brand', 'images', 'sizes'])
            ->active()
            ->whereHas('category', fn($category) => $category->where('status', 'active'));

        if ($request->has('is_featured')) {
            $query->where('is_featured', $request->boolean('is_featured'));
        }

        if ($request->has('is_sale')) {
            if ($request->boolean('is_sale')) {

                $query->where('is_sale', true)
                    ->where('sale_rental_price', '>', 0)
                    ->whereColumn('sale_rental_price', '<', 'rental_price_per_day');
            } else {
                $query->where('is_sale', false);
            }
        }

        if ($request->filled('category')) {
            $category = (string) $request->input('category');

            $categories = Category::where('slug', $category);

            if (ctype_digit($category)) {
                $categories->orWhere('id', (int) $category);
            }

            $categoryIds = [];

            foreach ($categories->get() as $item) {
                $categoryIds[] = $item->id;
            }

            $query->whereIn('category_id', $categoryIds);
        }
        $products = $query->latest()->orderByDesc('id')
            ->paginate($request->integer('per_page', 12))->withQueryString();

        return ProductResource::collection($products);
    }



    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();
        if (empty($validated['deposit_price'])) {
            $validated['deposit_price'] = (int) round(((int) ($validated['original_value'] ?? 0)) * 0.70);
        }
        $sizes = Arr::pull($validated, 'sizes', []);
        $image = Arr::pull($validated, 'images', []);
        $validated['slug'] = Str::slug($validated['name']);
        $product = DB::transaction(function () use ($validated, $sizes, $image) {
            $product = Product::create($validated);
            $product->sizes()->createMany($sizes);
            $product->images()->createMany($image);
            return $product;
        });
        $product->load(['sizes', 'images', 'brand', 'category']);
        return response()->json(new ProductResource($product), 201);
    }



    public function show(string $slug)
    {

        $product = Product::with(['category', 'brand', 'images', 'sizes'])->where('slug', $slug)->where('status', 'active')->firstOrFail();
        return response()->json(new ProductResource($product));
    }



    public function update(UpdateProductRequest $request, Product $product)
    {

        $validated = $request->validated();
        $images = Arr::pull($validated, 'images', []);
        $sizes = Arr::pull($validated, 'sizes', []);
        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }
        ;
        $product = DB::transaction(function () use ($validated, $images, $sizes, $product) {
            $product->update($validated);
            $now = now();

            if (!empty($images)) {
                $product->images()->forceDelete();

                $imagePayload = [];
                foreach ($images as $index => $image) {
                    $imagePayload[] = [
                        'product_id' => $product->id,
                        'image_url' => $image['image_url'],
                        'sort_order' => $image['sort_order'] ?? $index,
                    ];
                }
                $product->images()->createMany($imagePayload);
            }

            if (!empty($sizes)) {
                $activeSize = [];
                $payLoadSize = [];
                foreach ($sizes as $size) {
                    $payLoadSize[] = [
                        'product_id' => $product->id,
                        'size' => $size['size'],
                        'stock_quantity' => $size['stock_quantity'],
                        'deleted_at' => null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                    $activeSize[] = $size['size'];
                }

                ProductSize::upsert(
                    $payLoadSize,
                    ['product_id', 'size'],
                    ['stock_quantity', 'deleted_at', 'updated_at']
                );

                $product->sizes()->whereNotIn('size', $activeSize)->delete();
            }

            return $product;
        });
        $product->refresh()->load(['sizes', 'images', 'brand', 'category']);
        return response()->json(new ProductResource($product));
    }



    public function destroy(Product $product)
    {

        $product->delete();
        return response()->json([
            'message' => 'Chuyển sản phẩm vào thùng rác thành công',
            'code' => 200
        ]);
    }
    public function forceDelete(string $id)
    {
        $product = Product::onlyTrashed()->findOrFail($id);
        $product->sizes()->forceDelete();
        $product->images()->forceDelete();
        $product->forceDelete();
        return response()->json([
            'message' => 'Xóa sản phẩm vĩnh viễn thành công',
            'code' => 200
        ]);
    }

    public function trash()
    {
        $products = Product::onlyTrashed()->latest()->paginate(12);
        return ProductResource::collection($products);
    }

    public function restore(string $id)
    {
        $product = Product::onlyTrashed()->findOrFail($id);
        $product->restore();
        return response()->json([
            'message' => 'Hoàn tác sản phẩm thành công',
            'code' => 200
        ]);
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
        ]);

        $path = Storage::disk('public')->putFile('products', $request->file('image'));

        return response()->json([
            'message' => 'Tải ảnh sản phẩm thành công',
            'relative_path' => $path,
            'url' => asset('storage/' . $path),
        ]);
    }

    public function updateStock(Request $request, Product $product)
    {
        $validated = $request->validate([
            'sizes' => 'required|array|min:1',
            'sizes.*.size' => 'required|string|max:50',
            'sizes.*.stock_quantity' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($validated, $product) {
            $now = now();
            $payload = [];
            foreach ($validated['sizes'] as $item) {
                $payload[] = [
                    'product_id' => $product->id,
                    'size' => $item['size'],
                    'stock_quantity' => (int) $item['stock_quantity'],
                    'deleted_at' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            ProductSize::upsert(
                $payload,
                ['product_id', 'size'],
                ['stock_quantity', 'deleted_at', 'updated_at']
            );
        });

        $product->refresh()->load(['sizes', 'images', 'brand', 'category']);
        return response()->json(new ProductResource($product));
    }

    public function importStock(Request $request, Product $product)
    {
        $validated = $request->validate([
            'size' => 'required|string|max:50',
            'quantity' => 'required|integer|min:1',
            'note' => 'nullable|string|max:500',
        ]);

        $productSize = $product->sizes()->where('size', $validated['size'])->first();
        if (!$productSize) {
            $productSize = $product->sizes()->create([
                'size' => $validated['size'],
                'stock_quantity' => (int) $validated['quantity'],
            ]);
        } else {
            $productSize->increment('stock_quantity', (int) $validated['quantity']);
        }

        $product->refresh()->load(['sizes', 'images', 'brand', 'category']);
        return response()->json([
            'message' => 'Nhập kho thành công',
            'product' => new ProductResource($product),
        ]);
    }

    public function exportStock(Request $request, Product $product)
    {
        $validated = $request->validate([
            'size' => 'required|string|max:50',
            'quantity' => 'required|integer|min:1',
            'reason' => 'nullable|string|max:255',
            'note' => 'nullable|string|max:500',
        ]);

        $productSize = $product->sizes()->where('size', $validated['size'])->first();
        if (!$productSize) {
            return response()->json([
                'message' => 'Không tìm thấy kích cỡ này trong kho.',
            ], 422);
        }

        if ($productSize->stock_quantity < (int) $validated['quantity']) {
            return response()->json([
                'message' => 'Số lượng tồn kho không đủ để xuất (' . $productSize->stock_quantity . ' khả dụng).',
            ], 422);
        }

        $productSize->decrement('stock_quantity', (int) $validated['quantity']);

        $product->refresh()->load(['sizes', 'images', 'brand', 'category']);
        return response()->json([
            'message' => 'Xuất kho thành công',
            'product' => new ProductResource($product),
        ]);
    }
}
