<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'purchase_no' => $this->purchase_no,
            'product_name' => $this->product_name,
            'price' => $this->price,
            'amount' => $this->amount,
            'shipping' => $this->shipping,
            'total' => $this->total, // accessor from model

            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}