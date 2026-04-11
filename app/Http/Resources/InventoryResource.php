<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'item' => $this->item ? [
                'id' => $this->item->id,
                'item_no' => $this->item->item_no,
                'item_name' => $this->item->item_name,
                'batchNumber' => $this->item->batch_number,
                'expiryDate' => $this->item->expiry_date?->format('Y-m-d'),
                'price' => $this->item->price,
                'tax' => $this->item->tax,
            ] : null,
            'qty' => $this->qty,
            'gross_stock' => $this->item?->gross_stock ?? 0,
            'sold_qty' => $this->item?->sold_qty ?? 0,
            'total_value' => $this->total_value,
            'created_by' => $this->created_by_id ? [
                'id' => $this->creator?->id,
                'name' => $this->creator?->name,
                'email' => $this->creator?->email,
            ] : null,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
