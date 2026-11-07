<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoginUserResource extends JsonResource
{


    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->fullname,
            'fullname' => $this->fullname,
            'phone' => $this->phone,
            'address' => $this->address,
            'avatar' => $this->avatar ? asset('storage/' . $this->avatar) : null,
            'role' => $this->role,
            'email' => $this->email
        ];
    }
}
