<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductImageResource extends JsonResource
{


    public function toArray(Request $request): array
    {
        $url = $this->image_url;
        if ($url && !str_starts_with($url, 'http://') && !str_starts_with($url, 'https://')) {
            $url = asset('storage/' . ltrim($url, '/'));
        }

        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'image_url' => $url,
            'sort_order' => $this->sort_order
        ];
    }
}
