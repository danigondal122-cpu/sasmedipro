<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'invoice_no' => $this->invoice_no,

            'customer' => $this->whenLoaded('customer', function () {
                return [
                    'id' => $this->customer->id,
                    'customer_no' => $this->customer->customer_no,
                    'name' => $this->customer->name,
                    'address' => $this->customer->address,
                    'phone' => $this->customer->phone,
                    'email' => $this->customer->email,
                    'mobile' => $this->customer->mobile,
                    'brn' => $this->customer->brn,
                    'vat' => $this->customer->vat,
                ];
            }),

            'seller' => $this->whenLoaded('seller', function () {
                return [
                    'id' => $this->seller->id,
                    'name' => $this->seller->name,
                    'email' => $this->seller->email,
                ];
            }),

            // ✅ Commercial Status
            'status' => $this->status?->value,
            'payment_status' => $this->payment_status?->value,

            'total_amount' => $this->total_amount,

            'items' => $this->whenLoaded('saleItems', function () {
                return $this->saleItems->map(function ($item) {
                    return [
                        'item_id' => $item->item_id,
                        'item_name' => $item->item?->item_name,
                        'item_no' => $item->item?->item_no,
                        'qty' => $item->qty,
                        'price' => $item->price,
                        'tax' => $item->tax,
                        'subtotal' => $item->subtotal,
                    ];
                });
            }),

            'meta' => $this->whenLoaded('meta', function () {
                return [
                    'sales_person' => $this->meta->sales_person,
                    'payment_type' => $this->meta->payment_type,
                    'whs' => $this->meta->whs,
                    'uom' => $this->meta->uom,
                    'due_amount' => $this->meta->due_amount,
                ];
            }),

            // ✅ NEW: Delivery info (separate)
            'delivery' => $this->whenLoaded('delivery', function () {
                return new DeliveryResource($this->delivery);
            }),

            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}









































































































































