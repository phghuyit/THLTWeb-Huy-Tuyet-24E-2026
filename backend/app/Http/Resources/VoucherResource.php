<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VoucherResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'discount_amount' => (int) $this->discount_amount,
            'formatted_discount_amount' => number_format((int) $this->discount_amount, 0, ',', '.') . '₫',
            'min_order_amount' => (int) $this->min_order_amount,
            'formatted_min_order_amount' => number_format((int) $this->min_order_amount, 0, ',', '.') . '₫',
            'used_count' => (int) $this->used_count,
            'status' => $this->status,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
