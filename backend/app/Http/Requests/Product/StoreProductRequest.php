<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('sale_price') && !$this->has('sale_rental_price')) {
            $this->merge([
                'sale_rental_price' => $this->input('sale_price'),
            ]);
        }

        if ($this->has('sale_rent_price') && !$this->has('sale_rental_price')) {
            $this->merge([
                'sale_rental_price' => $this->input('sale_rent_price'),
            ]);
        }

        if (!$this->filled('deposit_price') && $this->filled('original_value')) {
            $this->merge([
                'deposit_price' => (int) round(((int) $this->input('original_value')) * 0.70),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|integer|exists:categories,id',
            'brand_id' => 'nullable|integer|exists:brands,id',
            'name' => 'required|string|max:200|unique:products,name',
            'thumbnail' => 'required|string|max:255',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'rental_price_per_day' => 'required|integer|min:0',
            'sale_rental_price' => 'nullable|integer|min:0|lte:rental_price_per_day',
            'deposit_price' => 'nullable|integer|min:0',
            'original_value' => 'required|integer|min:0',
            'is_featured' => 'boolean',
            'is_sale' => 'nullable|boolean',
            'status' => [Rule::in(['active', 'hidden'])],
            'sizes' => 'required|array|min:1',
            'sizes.*.size' => [
                'required',
                'distinct',
                Rule::in(['XS', 'S', 'M', 'L', 'XL', '2XL', 'FreeSize']),
            ],
            'sizes.*.stock_quantity' => 'required|integer|min:0',
            'images' => 'nullable|array|min:1',
            'images.*.image_url' => 'required|string|max:255',
        ];
    }

    public function attributes(): array
    {
        return [
            'category_id' => 'danh mục',
            'brand_id' => 'thương hiệu',
            'name' => 'tên sản phẩm',
            'thumbnail' => 'ảnh đại diện sản phẩm',
            'short_description' => 'mô tả ngắn',
            'description' => 'mô tả chi tiết',
            'rental_price_per_day' => 'giá thuê theo ngày',
            'sale_rental_price' => 'giá thuê khuyến mãi',
            'sale_price' => 'giá khuyến mãi',
            'deposit_price' => 'tiền cọc',
            'original_value' => 'giá trị gốc',
            'is_featured' => 'sản phẩm nổi bật',
            'is_sale' => 'trạng thái giảm giá',
            'status' => 'trạng thái',
            'sizes' => 'danh sách kích cỡ',
            'sizes.*.size' => 'kích cỡ',
            'sizes.*.stock_quantity' => 'số lượng tồn kho',
            'images' => 'danh sách hình ảnh',
            'images.*.image_url' => 'đường dẫn hình ảnh',
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Vui lòng chọn :attribute.',
            'category_id.exists' => ':Attribute được chọn không tồn tại.',
            'brand_id.exists' => ':Attribute được chọn không tồn tại.',
            'name.required' => 'Vui lòng nhập :attribute.',
            'name.max' => ':Attribute không được vượt quá :max ký tự.',
            'name.unique' => ':Attribute đã tồn tại.',
            'thumbnail.required' => 'Vui lòng cung cấp :attribute.',
            'thumbnail.max' => ':Attribute không được vượt quá :max ký tự.',
            'short_description.max' => ':Attribute không được vượt quá :max ký tự.',
            'rental_price_per_day.required' => 'Vui lòng nhập :attribute.',
            'rental_price_per_day.integer' => ':Attribute phải là số nguyên (VND).',
            'rental_price_per_day.min' => ':Attribute không được nhỏ hơn :min.',
            'sale_rental_price.integer' => ':Attribute phải là số nguyên (VND).',
            'sale_rental_price.min' => ':Attribute không được nhỏ hơn :min.',
            'sale_rental_price.lte' => ':Attribute không được lớn hơn :other.',
            'original_value.required' => 'Vui lòng nhập :attribute.',
            'original_value.integer' => ':Attribute phải là số nguyên (VND).',
            'original_value.min' => ':Attribute không được nhỏ hơn :min.',
            'is_featured.boolean' => ':Attribute phải là true hoặc false.',
            'is_sale.boolean' => ':Attribute phải là true hoặc false.',
            'status.in' => ':Attribute không hợp lệ, chỉ chấp nhận active hoặc hidden.',
            'sizes.required' => 'Vui lòng chọn ít nhất một :attribute.',
            'sizes.array' => ':Attribute phải là dạng danh sách.',
            'sizes.min' => 'Vui lòng chọn ít nhất một :attribute.',
            'sizes.*.size.required' => 'Vui lòng chọn :attribute.',
            'sizes.*.size.distinct' => ':Attribute không được trùng lặp.',
            'sizes.*.size.in' => ':Attribute không hợp lệ.',
            'sizes.*.stock_quantity.required' => 'Vui lòng nhập :attribute.',
            'sizes.*.stock_quantity.integer' => ':Attribute phải là số nguyên.',
            'sizes.*.stock_quantity.min' => ':Attribute không được nhỏ hơn :min.',
            'images.array' => ':Attribute phải là dạng danh sách.',
            'images.min' => ':Attribute phải có ít nhất 1 ảnh.',
            'images.*.image_url.required' => 'Vui lòng nhập :attribute.',
            'images.*.image_url.max' => ':Attribute không được vượt quá :max ký tự.',
        ];
    }
}
