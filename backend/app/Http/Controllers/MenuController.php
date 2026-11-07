<?php

namespace App\Http\Controllers;

use App\Http\Requests\Menu\StoreMenuRequest;
use App\Http\Requests\Menu\UpdateMenuRequest;
use App\Http\Resources\Menu\MenuResource;
use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $position = $request->input('position', 'header');

        $menus = Menu::with(['children' => function ($query) {
            $query->active()->orderBy('sort_order');
        }])
            ->active()
            ->root()
            ->where('position', $position)
            ->orderBy('sort_order')
            ->get();

        return MenuResource::collection($menus);
    }

    public function adminIndex(Request $request)
    {
        $query = Menu::with('children');

        if ($request->filled('position') && $request->position !== 'all') {
            $query->where('position', $request->position);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('link', 'like', "%{$search}%");
            });
        }

        $menus = $query->root()
            ->orderBy('position')
            ->orderBy('sort_order')
            ->get();

        return MenuResource::collection($menus);
    }

    public function show($id)
    {
        $menu = Menu::with('children')->findOrFail($id);

        return new MenuResource($menu);
    }

    public function store(StoreMenuRequest $request)
    {
        $validated = $request->validated();
        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['position'] = $validated['position'] ?? 'header';
        $validated['status'] = $validated['status'] ?? 'active';

        $menu = Menu::create($validated);

        return (new MenuResource($menu->load('children')))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateMenuRequest $request, Menu $menu)
    {
        $validated = $request->validated();

        if (isset($validated['parent_id']) && $validated['parent_id'] == $menu->id) {
            return response()->json([
                'message' => 'Menu không thể tự làm menu cha của chính nó',
            ], 422);
        }

        $menu->update($validated);

        return response()->json([
            'message' => 'Cập nhật menu thành công',
            'data' => new MenuResource($menu->load('children')),
        ]);
    }

    public function destroy(Menu $menu)
    {
        $menu->delete();

        return response()->json([
            'message' => 'Xóa menu thành công',
            'code' => 200,
        ]);
    }

    public function updateOrder(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|integer|exists:menus,id',
            'orders.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->orders as $item) {
            Menu::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json([
            'message' => 'Cập nhật thứ tự menu thành công',
        ]);
    }

    public function trash()
    {
        $menus = Menu::onlyTrashed()->with('parent')->latest('deleted_at')->get();
        return MenuResource::collection($menus);
    }

    public function restore($id)
    {
        $menu = Menu::onlyTrashed()->findOrFail($id);
        $menu->restore();
        return response()->json(['message' => 'Khôi phục menu thành công']);
    }

    public function forceDelete($id)
    {
        $menu = Menu::onlyTrashed()->findOrFail($id);
        $menu->forceDelete();
        return response()->json(['message' => 'Xóa menu vĩnh viễn thành công']);
    }
}
