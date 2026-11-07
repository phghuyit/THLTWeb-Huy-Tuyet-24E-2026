<?php

namespace App\Http\Resources\Order;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{


    public function toArray(Request $request): array
    {
        $firstItem = $this->items?->first();
        $totalRental = (float) $this->items?->sum('total_item_rental');
        $totalDeposit = (float) $this->items?->sum('total_item_deposit');
        $grandTotal = $totalRental + $totalDeposit;

        return [
            'id' => $this->id,
            'code' => $this->order_code,
            'status' => $this->status ?? 'confirmed',
            'channel' => 'online',
            'createdAt' => $this->created_at?->toIso8601String() ?? now()->toIso8601String(),
            'receiverName' => $this->receiver_name ?? $this->user?->fullname ?? 'Khách vãng lai',
            'receiverPhone' => $this->receiver_phone ?? $this->user?->phone ?? '',
            'address' => $this->address ?? $this->user?->address ?? '',
            'paymentMethod' => $this->payment_method ?? 'cod',
            'note' => $this->note ?? '',
            'voucherCode' => $this->voucher_code,
            'discountAmount' => (float) ($this->discount_amount ?? 0),
            'pickupDate' => $firstItem?->rent_start_date,
            'returnDate' => $firstItem?->rent_end_date,
            'subtotalRental' => $totalRental,
            'totalDeposit' => $totalDeposit,
            'grandTotal' => $this->total_amount > 0 ? (float) $this->total_amount : $grandTotal,
            'paidAmount' => $this->total_amount > 0 ? (float) $this->total_amount : $grandTotal,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
