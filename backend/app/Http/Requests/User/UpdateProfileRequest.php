<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fullname' => ['sometimes', 'required', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'address' => ['sometimes', 'nullable', 'string', 'max:255'],
            'avatar' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }

    public function attributes(): array
    {
        return [
            'fullname' => 'họ và tên',
            'phone' => 'số điện thoại',
            'address' => 'địa chỉ',
            'avatar' => 'ảnh đại diện',
        ];
    }

    public function messages(): array
    {
        return [
            'fullname.required' => 'Vui lòng nhập :attribute.',
            'fullname.max' => ':Attribute không được vượt quá :max ký tự.',
            'phone.max' => ':Attribute không được vượt quá :max ký tự.',
            'address.max' => ':Attribute không được vượt quá :max ký tự.',
            'avatar.max' => ':Attribute không được vượt quá :max ký tự.',
        ];
    }
}
