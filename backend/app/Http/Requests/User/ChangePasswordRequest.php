<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class ChangePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'current_password' => ['required', 'string', 'current_password'],
            'new_password' => ['required', 'string', 'min:8', 'confirmed', 'different:current_password'],
        ];
    }

    public function attributes(): array
    {
        return [
            'current_password' => 'mật khẩu hiện tại',
            'new_password' => 'mật khẩu mới',
        ];
    }

    public function messages(): array
    {
        return [
            'current_password.required' => 'Vui lòng nhập :attribute.',
            'current_password.current_password' => ':Attribute không chính xác.',
            'new_password.required' => 'Vui lòng nhập :attribute.',
            'new_password.min' => ':Attribute phải có ít nhất :min ký tự.',
            'new_password.confirmed' => 'Xác nhận :attribute không khớp.',
            'new_password.different' => ':Attribute không được trùng với mật khẩu cũ.',
        ];
    }
}
