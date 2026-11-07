<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'parent_id' => [
                'bail',
                'nullable',
                'integer',
                Rule::exists('categories', 'id')->whereNull('deleted_at'),
            ],
            'image' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:active,hidden',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'tên danh mục',
            'parent_id' => 'danh mục cha',
            'image' => 'hình ảnh',
            'description' => 'mô tả',
            'status' => 'trạng thái',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Vui lòng nhập :attribute.',
            'name.string' => ':Attribute phải là chuỗi ký tự.',
            'name.max' => ':Attribute không được vượt quá :max ký tự.',
            'parent_id.integer' => ':Attribute phải là số nguyên.',
            'parent_id.exists' => ':Attribute được chọn không tồn tại hoặc đã bị xóa.',
            'image.string' => ':Attribute phải là chuỗi ký tự.',
            'image.max' => ':Attribute không được vượt quá :max ký tự.',
            'description.string' => ':Attribute phải là chuỗi ký tự.',
            'status.required' => 'Vui lòng chọn :attribute.',
            'status.in' => ':Attribute không hợp lệ, chỉ chấp nhận active hoặc hidden.',
        ];
    }
}
