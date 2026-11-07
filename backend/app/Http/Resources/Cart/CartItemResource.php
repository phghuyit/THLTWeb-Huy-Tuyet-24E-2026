<?php

namespace App\Http\Resources\Cart;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $rentalDays = 1;
        if ($this->rent_start_date && $this->rent_end_date) {
            $start = Carbon::parse($this->rent_start_date);
            $end = Carbon::parse($this->rent_end_date);
            $rentalDays = max(1, (int) $start->diffInDays($end));
        }

        $pricePerDay = $this->product ? (int) $this->product->effective_price : 0;
        $depositPerItem = $this->product ? (int) $this->product->deposit_price : 0;

        $stockAvailable = 0;
        if ($this->productSize) {
            $stockAvailable = (int) $this->productSize->stock_quantity;
        } elseif ($this->product) {
            $stockAvailable = (int) $this->product->total_stock;
        }
        $isInStock = ($stockAvailable >= (int) $this->quantity && $stockAvailable > 0);

        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product_size_id' => $this->product_size_id,
            'name' => $this->product?->name ?? 'Trang phục thuê',
            'slug' => $this->product?->slug ?? ('product-' . $this->product_id),
            'thumbnail' => $this->product?->thumbnail,
            'size' => $this->productSize?->size ?? 'FreeSize',
            'color' => 'Tiêu chuẩn',
            'quantity' => (int) $this->quantity,
            'stock_available' => $stockAvailable,
            'is_in_stock' => $isInStock,
            'pickup_date' => $this->rent_start_date ? Carbon::parse($this->rent_start_date)->format('Y-m-d') : null,
            'return_date' => $this->rent_end_date ? Carbon::parse($this->rent_end_date)->format('Y-m-d') : null,
            'days' => $rentalDays,
            'rental_price_per_day' => $pricePerDay,
            'deposit_per_item' => $depositPerItem,
            'rental_total' => (int) ($pricePerDay * $this->quantity * $rentalDays),
            'deposit_total' => (int) ($depositPerItem * $this->quantity),
            'subtotal' => (int) (($pricePerDay * $rentalDays + $depositPerItem) * $this->quantity),
        ];
    }
}
