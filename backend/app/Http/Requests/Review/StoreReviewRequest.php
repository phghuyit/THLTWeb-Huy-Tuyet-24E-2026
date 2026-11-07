<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => 'nullable|integer|exists:products,id',
            'product_slug' => 'nullable|string|exists:products,slug',
            'author_name' => 'nullable|string|max:100',
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'required|string|min:3|max:1000',
            'size_worn' => 'nullable|string|max:20',
            'height_cm' => 'nullable|integer|min:80|max:250',
            'status' => 'nullable|string|in:pending,approved,hidden',
        ];
    }

    public function attributes(): array
    {
        return [
            'product_id' => 'sản phẩm',
            'author_name' => 'tên người đánh giá',
            'rating' => 'số sao đánh giá',
            'content' => 'nội dung đánh giá',
            'size_worn' => 'kích cỡ đã mặc',
            'height_cm' => 'chiều cao (cm)',
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Vui lòng chọn :attribute.',
            'product_id.exists' => ':Attribute không tồn tại trong hệ thống.',
            'rating.required' => 'Vui lòng chọn :attribute từ 1 đến 5 sao.',
            'rating.min' => ':Attribute tối thiểu là 1 sao.',
            'rating.max' => ':Attribute tối đa là 5 sao.',
            'content.required' => 'Vui lòng nhập :attribute.',
            'content.min' => ':Attribute phải có ít nhất :min ký tự.',
        ];
    }
}
