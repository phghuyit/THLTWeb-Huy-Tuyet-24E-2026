<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Voucher extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'discount_amount',
        'min_order_amount',
        'used_count',
        'status',
    ];

    protected $casts = [
        'discount_amount' => 'integer',
        'min_order_amount' => 'integer',
        'used_count' => 'integer',
    ];

    public function isValidForAmount(int|float $amount): bool
    {
        return $this->status === 'active' && $amount >= $this->min_order_amount;
    }
}
