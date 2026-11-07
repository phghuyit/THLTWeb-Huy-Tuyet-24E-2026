<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user')?->id ?? $this->route('user') ?? $this->route('id');

        return [
            'fullname' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'address' => ['sometimes', 'nullable', 'string', 'max:255'],
            'avatar' => ['sometimes', 'nullable', 'string', 'max:255'],
            'role' => ['sometimes', 'required', Rule::in(['admin', 'member', 'customer'])],
            'status' => ['sometimes', 'required', Rule::in(['active', 'locked', 'inactive', 'banned'])],
        ];
    }

    public function attributes(): array
    {
        return [
            'fullname' => 'họ và tên',
            'email' => 'địa chỉ email',
            'phone' => 'số điện thoại',
            'address' => 'địa chỉ',
            'avatar' => 'ảnh đại diện',
            'role' => 'vai trò',
            'status' => 'trạng thái',
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
            'phone.string' => ':Attribute phải là chuỗi ký tự.',
            'phone.max' => ':Attribute không được vượt quá :max ký tự.',
            'address.string' => ':Attribute phải là chuỗi ký tự.',
            'address.max' => ':Attribute không được vượt quá :max ký tự.',
            'avatar.string' => ':Attribute phải là chuỗi ký tự.',
            'avatar.max' => ':Attribute không được vượt quá :max ký tự.',
            'role.required' => 'Vui lòng chọn :attribute.',
            'role.in' => ':Attribute không hợp lệ.',
            'status.required' => 'Vui lòng chọn :attribute.',
            'status.in' => ':Attribute không hợp lệ.',
        ];
    }
}
