<?php

namespace App\Http\Requests\Contact;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('name')) {
            $this->merge(['name' => trim((string) $this->name)]);
        }
        if ($this->has('phone')) {
            $this->merge(['phone' => trim((string) $this->phone)]);
        }
        if ($this->has('email') && empty($this->email)) {
            $this->merge(['email' => null]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:150'],
            'subject' => ['nullable', 'string', 'max:200'],
            'message' => ['required', 'string', 'max:3000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'họ và tên',
            'phone' => 'số điện thoại',
            'email' => 'địa chỉ email',
            'subject' => 'chủ đề liên hệ',
            'message' => 'nội dung yêu cầu',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Vui lòng nhập :attribute.',
            'phone.required' => 'Vui lòng nhập :attribute.',
            'email.email' => ':Attribute không đúng định dạng.',
            'message.required' => 'Vui lòng nhập :attribute.',
        ];
    }
}
