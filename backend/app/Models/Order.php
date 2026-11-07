<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'order_code',
        'user_id',
        'status',
        'receiver_name',
        'receiver_phone',
        'address',
        'payment_method',
        'total_amount',
        'note',
        'voucher_code',
        'discount_amount',
        'email_sent_at',
    ];

    protected $casts = [
        'email_sent_at' => 'datetime',
        'total_amount' => 'decimal:2',
        'discount_amount' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
