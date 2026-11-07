<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Brand;
use App\Http\Resources\BrandResource;
use App\Http\Requests\StoreBrandRequest;
use Illuminate\Support\Str;
use App\Http\Requests\UpdateBrandRequest;
use Illuminate\Validation\Rule;
class BrandController extends Controller
{


    public function index(Request $request)
    {
        $brands = Brand::where('status', 'active')
            ->orderByDesc('id')
            ->paginate($request->integer('per_page', 12));

        return BrandResource::collection($brands);
    }



    public function store(StoreBrandRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name']);
        validator($data, [
            'slug' => 'required|string|max:120|unique:brands,slug',
        ])->validate();
        $brand = Brand::create($data);
        $brand->refresh();
        return (new BrandResource($brand))
            ->response()
            ->setStatusCode(201);
    }



    public function show(string $slug)
    {
        $brand = Brand::where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();

        return new BrandResource($brand);
    }



    public function update(UpdateBrandRequest $request, Brand $brand)
    {
        $data = $request->validated();
        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);

            validator($data, [
                'slug' => [
                    'required',
                    'string',
                    'max:120',
                    Rule::unique('brands', 'slug')->ignore($brand->id),
                ],
            ])->validate();
        }
        $brand->update($data);
        return new BrandResource($brand);
    }



    public function softDelete(Brand $brand)
    {
        $brand->delete();

        return response()->noContent();
    }

    public function forceDelete(string $id){
        $brand = Brand::onlyTrashed()->findOrFail($id);
        $brand->forceDelete();
        return response()->noContent();
    }

    public function trash()
    {
        $brands = Brand::onlyTrashed()
            ->orderByDesc('deleted_at')
            ->paginate(12);

        return BrandResource::collection($brands);
    }

    public function restore(string $id)
    {
        $brand = Brand::onlyTrashed()->findOrFail($id);
        $brand->restore();

        return response()->json([
            'message' => 'Khôi phục thương hiệu thành công',
            'code' => 200,
        ], 200);
    }
}
