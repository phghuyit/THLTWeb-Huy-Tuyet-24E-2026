<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;



class Product extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'category_id',
        'brand_id',
        'name',
        'slug',
        'thumbnail',
        'short_description',
        'description',
        'rental_price_per_day',
        'sale_rental_price',
        'deposit_price',
        'original_value',
        'is_featured',
        'is_sale',
        'view_count',
        'status',
    ];

    protected $casts = [
        'rental_price_per_day' => 'integer',
        'sale_rental_price' => 'integer',
        'deposit_price' => 'integer',
        'original_value' => 'integer',
        'is_featured' => 'boolean',
        'is_sale' => 'boolean',
        'view_count' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function sizes(): HasMany
    {
        return $this->hasMany(ProductSize::class);
    }
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class)->approved()->latest();
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeOnSale(Builder $query): Builder
    {
        return $query->where('is_sale', true);
    }



    public function saleRentalPrice(): ?int
    {
        return ($this->is_sale && $this->sale_rental_price !== null) ? (int) $this->sale_rental_price : null;
    }



    public function salePrice(): ?int
    {
        return $this->saleRentalPrice();
    }



    public function getSalePrice(): ?int
    {
        return $this->saleRentalPrice();
    }



    public function getSalePriceAttribute(): ?int
    {
        return $this->sale_rental_price !== null ? (int) $this->sale_rental_price : null;
    }

    public function getSaleRentPriceAttribute(): ?int
    {
        return $this->sale_rental_price !== null ? (int) $this->sale_rental_price : null;
    }

    public function getDepositPriceAttribute($value): int
    {
        if (!is_null($value) && (int) $value > 0) {
            return (int) $value;
        }

        return (int) round(((int) $this->original_value) * 0.70);
    }



    public function getEffectivePriceAttribute(): int
    {
        if ($this->is_sale && !is_null($this->sale_rental_price) && (int) $this->sale_rental_price > 0) {
            return (int) $this->sale_rental_price;
        }

        return (int) $this->rental_price_per_day;
    }



    public function isOnSale(): bool
    {
        return (bool) $this->is_sale
            && !is_null($this->sale_rental_price)
            && (int) $this->sale_rental_price <= (int) $this->rental_price_per_day;
    }



    public function getDiscountPercentAttribute(): int
    {
        if ($this->isOnSale() && (int) $this->rental_price_per_day > 0) {
            $discount = (((int) $this->rental_price_per_day - (int) $this->sale_rental_price) / (int) $this->rental_price_per_day) * 100;
            return (int) round($discount);
        }

        return 0;
    }



    public function getFormattedEffectivePriceAttribute(): string
    {
        return number_format($this->effective_price, 0, ',', '.') . '₫';
    }

    public function getFormattedRentalPriceAttribute(): string
    {
        return number_format((int) $this->rental_price_per_day, 0, ',', '.') . '₫';
    }

    public function getFormattedSaleRentalPriceAttribute(): ?string
    {
        return $this->sale_rental_price !== null ? number_format((int) $this->sale_rental_price, 0, ',', '.') . '₫' : null;
    }

    public function getFormattedDepositPriceAttribute(): string
    {
        return number_format((int) $this->deposit_price, 0, ',', '.') . '₫';
    }

    public function getTotalStockAttribute(): int
    {
        if ($this->relationLoaded('sizes')) {
            return (int) $this->sizes->sum('stock_quantity');
        }
        return (int) ($this->sizes()->sum('stock_quantity') ?? 0);
    }

    public function getIsInStockAttribute(): bool
    {
        return $this->total_stock > 0;
    }
}
