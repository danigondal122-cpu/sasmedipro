<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DeliveryResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'sale' =>$this->sale ? [
                'id' => $this->sale->id,
                'invoice_no' => $this->sale->invoice_no,
                'customer' => $this->sale->customer ? [
                    'id' => $this->sale->customer->id,
                    'name' => $this->sale->customer->name,
                    'customer_no' => $this->sale->customer->customer_no,
                ] : null,
                'seller' => $this->sale->seller ? [
                    'id' => $this->sale->seller->id,
                    'name' => $this->sale->seller->name,
                ] : null,
                'total_amount' => $this->sale->total_amount,
                'status' => $this->sale->status,
            ]:null,
            'inventory_deducted' =>$this->inventory_deducted,
            'status' => $this->status,
            'delivered_by' => $this->deliveredBy ? [
                'id' => $this->deliveredBy->id,
                'name' => $this->deliveredBy->name,
            ] : null,
            'delivered_at' => $this->delivered_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}