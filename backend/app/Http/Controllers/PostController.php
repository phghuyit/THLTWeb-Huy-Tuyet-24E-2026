<?php

namespace App\Http\Controllers;

use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Http\Resources\Post\PostCategoryResource;
use App\Http\Resources\Post\PostResource;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with(['category', 'author:id,fullname,avatar'])
            ->published()
            ->latest();

        if ($request->filled('category_slug')) {
            $category = PostCategory::where('slug', $request->category_slug)->first();
            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('summary', 'like', "%{$search}%");
            });
        }

        if ($request->boolean('is_hot')) {
            $query->hot();
        }

        $posts = $query->paginate($request->integer('per_page', 9));

        return PostResource::collection($posts);
    }

    public function show($slug)
    {
        $post = Post::with(['category', 'author:id,fullname,avatar'])
            ->published()
            ->where(function ($query) use ($slug) {
                $query->where('slug', $slug);
                if (is_numeric($slug)) {
                    $query->orWhere('id', (int) $slug);
                }
            })
            ->firstOrFail();

        $post->increment('views');

        return new PostResource($post);
    }

    public function hot()
    {
        $posts = Post::with(['category', 'author:id,fullname,avatar'])
            ->published()
            ->hot()
            ->latest()
            ->take(6)
            ->get();

        return PostResource::collection($posts);
    }

    public function categories()
    {
        $categories = PostCategory::active()
            ->withCount(['posts' => function ($query) {
                $query->published();
            }])
            ->get();

        return PostCategoryResource::collection($categories);
    }

    public function adminIndex(Request $request)
    {
        $query = Post::with(['category', 'author:id,fullname,avatar'])->latest();

        if ($request->filled('category_id') && $request->category_id !== 'all') {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('summary', 'like', "%{$search}%");
            });
        }

        $posts = $query->paginate($request->integer('per_page', 12));

        return PostResource::collection($posts);
    }

    public function adminShow($id)
    {
        $post = Post::with(['category', 'author:id,fullname,avatar'])->findOrFail($id);

        return new PostResource($post);
    }

    public function store(StorePostRequest $request)
    {
        $validated = $request->validated();

        if (empty($validated['slug'])) {
            $baseSlug = Str::slug($validated['title']);
            $slug = $baseSlug;
            $count = 1;
            while (Post::where('slug', $slug)->exists()) {
                $slug = "{$baseSlug}-{$count}";
                $count++;
            }
            $validated['slug'] = $slug;
        }

        $validated['user_id'] = $request->user()?->id;

        $post = Post::create($validated);

        return (new PostResource($post->load(['category', 'author'])))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $validated = $request->validated();

        if (!empty($validated['title']) && empty($validated['slug']) && $post->title !== $validated['title']) {
            $baseSlug = Str::slug($validated['title']);
            $slug = $baseSlug;
            $count = 1;
            while (Post::where('slug', $slug)->where('id', '!=', $post->id)->exists()) {
                $slug = "{$baseSlug}-{$count}";
                $count++;
            }
            $validated['slug'] = $slug;
        }

        $post->update($validated);

        return response()->json([
            'message' => 'Cập nhật bài viết thành công',
            'data' => new PostResource($post->load(['category', 'author'])),
        ]);
    }

    public function destroy(Post $post)
    {
        $post->delete();

        return response()->json([
            'message' => 'Xóa bài viết thành công',
            'code' => 200,
        ]);
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'nullable|string|max:120|unique:post_categories,slug',
            'description' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,hidden',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category = PostCategory::create($validated);

        return response()->json([
            'message' => 'Tạo danh mục bài viết thành công',
            'data' => new PostCategoryResource($category),
        ], 201);
    }

    public function updateCategory(Request $request, PostCategory $postCategory)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'slug' => 'sometimes|nullable|string|max:120|unique:post_categories,slug,' . $postCategory->id,
            'description' => 'sometimes|nullable|string|max:255',
            'status' => 'sometimes|nullable|in:active,hidden',
        ]);

        $postCategory->update($validated);

        return response()->json([
            'message' => 'Cập nhật danh mục bài viết thành công',
            'data' => new PostCategoryResource($postCategory),
        ]);
    }

    public function destroyCategory(PostCategory $postCategory)
    {
        if ($postCategory->posts()->exists()) {
            return response()->json([
                'message' => 'Không thể xóa danh mục đang có bài viết',
            ], 422);
        }

        $postCategory->delete();

        return response()->json([
            'message' => 'Xóa danh mục bài viết thành công',
            'code' => 200,
        ]);
    }

    public function trash()
    {
        $posts = Post::onlyTrashed()->with(['category', 'author'])->latest('deleted_at')->get();
        return PostResource::collection($posts);
    }

    public function restore($id)
    {
        $post = Post::onlyTrashed()->findOrFail($id);
        $post->restore();
        return response()->json(['message' => 'Khôi phục bài viết thành công']);
    }

    public function forceDelete($id)
    {
        $post = Post::onlyTrashed()->findOrFail($id);
        $post->forceDelete();
        return response()->json(['message' => 'Xóa bài viết vĩnh viễn thành công']);
    }

    public function trashCategories()
    {
        $categories = PostCategory::onlyTrashed()->withCount('posts')->latest('deleted_at')->get();
        return PostCategoryResource::collection($categories);
    }

    public function restoreCategory($id)
    {
        $category = PostCategory::onlyTrashed()->findOrFail($id);
        $category->restore();
        return response()->json(['message' => 'Khôi phục danh mục bài viết thành công']);
    }

    public function forceDeleteCategory($id)
    {
        $category = PostCategory::onlyTrashed()->findOrFail($id);
        $category->forceDelete();
        return response()->json(['message' => 'Xóa danh mục bài viết vĩnh viễn thành công']);
    }
}
