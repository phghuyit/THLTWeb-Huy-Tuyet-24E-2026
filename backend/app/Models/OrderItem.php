<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_size_id',
        'quantity',
        'rent_start_date',
        'rent_end_date',
        'rental_days',
        'price_per_day',
        'deposit_per_item',
        'total_item_rental',
        'total_item_deposit',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'rental_days' => 'integer',
        'rent_start_date' => 'date',
        'rent_end_date' => 'date',
        'price_per_day' => 'decimal:2',
        'deposit_per_item' => 'decimal:2',
        'total_item_rental' => 'decimal:2',
        'total_item_deposit' => 'decimal:2',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function productSize(): BelongsTo
    {
        return $this->belongsTo(ProductSize::class);
    }
}
