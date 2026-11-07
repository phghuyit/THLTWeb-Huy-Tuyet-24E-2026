<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product_name' => $this->product?->name,
            'user_id' => $this->user_id,
            'author' => $this->author_name,
            'rating' => (int) $this->rating,
            'content' => $this->content,
            'size_worn' => $this->size_worn,
            'sizeWorn' => $this->size_worn,
            'height_cm' => $this->height_cm ? (int) $this->height_cm : null,
            'heightCm' => $this->height_cm ? (int) $this->height_cm : null,
            'status' => $this->status,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'createdAt' => $this->created_at?->toISOString() ?? $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
