<?php

namespace App\Http\Resources\Cart;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $items = $this->whenLoaded('items', function () {
            return CartItemResource::collection($this->items);
        });

        $totalQuantity = 0;
        $totalRentalFee = 0;
        $totalDepositFee = 0;

        if ($this->relationLoaded('items') && $this->items) {
            foreach ($this->items as $item) {
                $rentalDays = 1;
                if ($item->rent_start_date && $item->rent_end_date) {
                    $start = Carbon::parse($item->rent_start_date);
                    $end = Carbon::parse($item->rent_end_date);
                    $rentalDays = max(1, (int) $start->diffInDays($end));
                }

                $pricePerDay = $item->product ? (int) $item->product->effective_price : 0;
                $depositPerItem = $item->product ? (int) $item->product->deposit_price : 0;

                $totalQuantity += (int) $item->quantity;
                $totalRentalFee += $pricePerDay * $item->quantity * $rentalDays;
                $totalDepositFee += $depositPerItem * $item->quantity;
            }
        }

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'items' => $items,
            'total_quantity' => $totalQuantity,
            'total_rental_fee' => $totalRentalFee,
            'total_deposit_fee' => $totalDepositFee,
            'grand_total' => $totalRentalFee + $totalDepositFee,
        ];
    }
}
