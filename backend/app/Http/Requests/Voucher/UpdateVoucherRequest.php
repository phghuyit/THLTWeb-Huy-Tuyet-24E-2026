<?php

namespace App\Http\Requests\Voucher;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVoucherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('code')) {
            $this->merge([
                'code' => strtoupper(trim((string) $this->code)),
            ]);
        }
    }

    public function rules(): array
    {
        $voucherId = $this->route('voucher')?->id ?? $this->route('voucher') ?? $this->route('id');

        return [
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('vouchers', 'code')->ignore($voucherId),
            ],
            'name' => ['required', 'string', 'max:255'],
            'discount_amount' => ['required', 'integer', 'min:1000'],
            'min_order_amount' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }

    public function attributes(): array
    {
        return [
            'code' => 'mã giảm giá',
            'name' => 'tên chương trình',
            'discount_amount' => 'số tiền giảm',
            'min_order_amount' => 'giá trị đơn tối thiểu',
            'status' => 'trạng thái',
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Vui lòng nhập :attribute.',
            'code.unique' => ':Attribute này đã tồn tại trên hệ thống.',
            'name.required' => 'Vui lòng nhập :attribute.',
            'discount_amount.required' => 'Vui lòng nhập :attribute.',
            'discount_amount.min' => ':Attribute tối thiểu là 1.000đ.',
            'min_order_amount.required' => 'Vui lòng nhập :attribute.',
            'status.required' => 'Vui lòng chọn :attribute.',
            'status.in' => ':Attribute không hợp lệ.',
        ];
    }
}
