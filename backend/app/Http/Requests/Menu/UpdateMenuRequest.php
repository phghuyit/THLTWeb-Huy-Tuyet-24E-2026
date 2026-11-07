<?php

namespace App\Http\Requests\Menu;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'link' => ['sometimes', 'required', 'string', 'max:255'],
            'parent_id' => ['nullable', 'integer', 'exists:menus,id'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'position' => ['sometimes', 'nullable', 'in:header,footer'],
            'status' => ['sometimes', 'nullable', 'in:active,hidden'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'tên menu',
            'link' => 'đường dẫn liên kết',
            'parent_id' => 'menu cha',
            'sort_order' => 'thứ tự hiển thị',
            'position' => 'vị trí menu',
            'status' => 'trạng thái',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Vui lòng nhập :attribute.',
            'link.required' => 'Vui lòng nhập :attribute.',
            'parent_id.exists' => ':Attribute không tồn tại.',
            'position.in' => ':Attribute không hợp lệ.',
            'status.in' => ':Attribute không hợp lệ.',
        ];
    }
}
