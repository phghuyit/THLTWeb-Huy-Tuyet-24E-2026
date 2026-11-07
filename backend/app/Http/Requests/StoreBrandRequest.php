<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBrandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'logo' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:active,hidden',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'tên thương hiệu',
            'logo' => 'logo',
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
            'logo.string' => ':Attribute phải là chuỗi ký tự.',
            'logo.max' => ':Attribute không được vượt quá :max ký tự.',
            'description.string' => ':Attribute phải là chuỗi ký tự.',
            'status.in' => ':Attribute không hợp lệ, chỉ chấp nhận active hoặc hidden.',
        ];
    }
}
