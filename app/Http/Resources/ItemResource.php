<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'item_no' => $this->item_no,
            'item_name' => $this->item_name,
            'price' => $this->price,
            'tax' => $this->tax,
            'qty' => $this->inventory?->qty ?? 0,
             'batch_number' => $this->batch_number,
        'expiry_date' => $this->expiry_date?->format('Y-m-d'),
            // 'status' => $this->status ? 'Active' : 'Inactive',
            'created_by' => $this->created_by_id ? [
                'id' => $this->createdBy?->id,
                'name' => $this->createdBy?->name,
                'email' => $this->createdBy?->email,
            ] : null,
            // 'inventory' => $this->whenLoaded('inventory', function () {
            //     return [
            //         'qty' => $this->inventory?->qty ?? 0,
            //         'total_value' => $this->inventory?->total_value ?? 0,
            //     ];
            // }),
            'total_value' => $this->inventory?->total_value ?? 0,
            'qty' => $this->inventory?->qty ?? 0,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
