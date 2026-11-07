<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;



class Banner extends Model
{
    protected $table = 'banners';

    protected $fillable = [
        'title',
        'image_url',
        'link_url',
        'position',
        'sort_order',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'created_at' => 'datetime',
        ];
    }

    const UPDATED_AT = null;

    public function getImageUrlAttribute($value): ?string
    {
        if ($value && !str_starts_with($value, 'http://') && !str_starts_with($value, 'https://')) {
            return asset('storage/' . ltrim($value, '/'));
        }

        return $value;
    }
}
