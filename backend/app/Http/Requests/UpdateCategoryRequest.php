<?php

namespace App\Http\Requests;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:100',
            'parent_id' => [
                'bail',
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('categories', 'id')->whereNull('deleted_at'),
                Rule::notIn([$this->route('category')?->id ?? $this->route('category')]),
                function ($attribute, $value, $fail) {
                    $checkedID = [$this->route('category')?->id ?? $this->route('category')];
                    while ($value !== null) {
                        if (in_array($value, $checkedID)) {
                            $fail('Không thể chọn danh mục này làm cha.');
                            return;
                        }
                        $checkedID[] = $value;
                        $value = Category::find($value)?->parent_id;
                    }
                },
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
            'parent_id.not_in' => 'Không thể chọn chính danh mục này làm danh mục cha.',
            'image.string' => ':Attribute phải là chuỗi ký tự.',
            'image.max' => ':Attribute không được vượt quá :max ký tự.',
            'description.string' => ':Attribute phải là chuỗi ký tự.',
            'status.required' => 'Vui lòng chọn :attribute.',
            'status.in' => ':Attribute không hợp lệ, chỉ chấp nhận active hoặc hidden.',
        ];
    }
}
