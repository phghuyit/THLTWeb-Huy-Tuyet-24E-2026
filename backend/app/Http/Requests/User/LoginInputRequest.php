<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class LoginInputRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email|max:255',
            'password' => ['required', Password::min(8)->max(256)],
        ];
    }

    public function attributes(): array
    {
        return [
            'email' => 'địa chỉ email',
            'password' => 'mật khẩu',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Vui lòng nhập :attribute.',
            'email.email' => ':Attribute không đúng định dạng email.',
            'email.max' => ':Attribute không được vượt quá :max ký tự.',
            'password.required' => 'Vui lòng nhập :attribute.',
            'password.min' => ':Attribute phải có ít nhất :min ký tự.',
            'password.max' => ':Attribute không được vượt quá :max ký tự.',
        ];
    }
}
