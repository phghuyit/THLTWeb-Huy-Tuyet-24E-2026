<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fullname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:256', 'confirmed'],
            'phone' => ['nullable', 'string', 'digits_between:10,11'],
            'address' => ['nullable', 'string', 'max:255'],
            'avatar' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'in:admin,member,customer'],
            'status' => ['nullable', 'string', 'in:active,locked,inactive,banned'],
        ];
    }

    public function attributes(): array
    {
        return [
            'fullname' => 'họ và tên',
            'email' => 'địa chỉ email',
            'password' => 'mật khẩu',
            'phone' => 'số điện thoại',
            'address' => 'địa chỉ',
            'avatar' => 'ảnh đại diện',
        ];
    }

    public function messages(): array
    {
        return [
            'fullname.required' => 'Vui lòng nhập :attribute.',
            'fullname.string' => ':Attribute phải là chuỗi ký tự.',
            'fullname.max' => ':Attribute không được vượt quá :max ký tự.',
            'email.required' => 'Vui lòng nhập :attribute.',
            'email.email' => ':Attribute không đúng định dạng email.',
            'email.max' => ':Attribute không được vượt quá :max ký tự.',
            'email.unique' => ':Attribute đã tồn tại trên hệ thống.',
            'password.required' => 'Vui lòng nhập :attribute.',
            'password.string' => ':Attribute phải là chuỗi ký tự.',
            'password.min' => ':Attribute phải có ít nhất :min ký tự.',
            'password.max' => ':Attribute không được vượt quá :max ký tự.',
            'password.confirmed' => 'Xác nhận :attribute không khớp.',
            'phone.string' => ':Attribute phải là chuỗi ký tự.',
            'phone.digits_between' => ':Attribute phải gồm 10 hoặc 11 chữ số.',
            'address.string' => ':Attribute phải là chuỗi ký tự.',
            'address.max' => ':Attribute không được vượt quá :max ký tự.',
            'avatar.string' => ':Attribute phải là chuỗi ký tự.',
            'avatar.max' => ':Attribute không được vượt quá :max ký tự.',
        ];
    }
}
