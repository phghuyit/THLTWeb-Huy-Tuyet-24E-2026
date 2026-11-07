<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    public function index(Request $request)
    {
        $query = Banner::where('status', 'active');

        if ($request->has('position')) {
            $query->where('position', $request->query('position'));
        }

        $banners = $query->orderBy('sort_order')->latest('id')->get();

        return response()->json([
            'status' => 'success',
            'data' => $banners,
        ]);
    }

    public function adminIndex()
    {
        $banners = Banner::orderBy('sort_order')->latest('id')->get();

        return response()->json([
            'status' => 'success',
            'data' => $banners,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:100',
            'image_url' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120',
            'link_url' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'status' => 'nullable|in:active,hidden',
        ]);

        $imageUrl = $validated['image_url'] ?? '';

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('banners', 'public');
            $imageUrl = 'storage/' . $path;
        }

        if (empty($imageUrl)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vui lòng cung cấp link ảnh hoặc tải file ảnh lên.',
            ], 422);
        }

        $banner = Banner::create([
            'title' => $validated['title'] ?? null,
            'image_url' => $imageUrl,
            'link_url' => $validated['link_url'] ?? '/products',
            'position' => $validated['position'] ?? 'home_middle',
            'sort_order' => $validated['sort_order'] ?? 0,
            'status' => $validated['status'] ?? 'active',
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $banner,
            'message' => 'Tạo banner thành công',
        ], 201);
    }

    public function show($id)
    {
        $banner = Banner::findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $banner,
        ]);
    }

    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);

        $validated = $request->validate([
            'title' => 'nullable|string|max:100',
            'image_url' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120',
            'link_url' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'status' => 'nullable|in:active,hidden',
        ]);

        $imageUrl = $validated['image_url'] ?? $banner->getRawOriginal('image_url');

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('banners', 'public');
            $imageUrl = 'storage/' . $path;
        }

        $banner->update([
            'title' => array_key_exists('title', $validated) ? $validated['title'] : $banner->title,
            'image_url' => $imageUrl,
            'link_url' => array_key_exists('link_url', $validated) ? $validated['link_url'] : $banner->link_url,
            'position' => $validated['position'] ?? $banner->position,
            'sort_order' => $validated['sort_order'] ?? $banner->sort_order,
            'status' => $validated['status'] ?? $banner->status,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $banner,
            'message' => 'Cập nhật banner thành công',
        ]);
    }

    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);
        $banner->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Xóa banner thành công',
        ]);
    }
}
