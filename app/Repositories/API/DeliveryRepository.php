<?php

namespace App\Repositories\API;

use App\Models\Delivery;
use App\Models\Inventory;
use App\Enums\DeliveryStatusEnum;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class DeliveryRepository
{
    protected $model;

    public function __construct(Delivery $delivery)
    {
        $this->model = $delivery;
    }

   public function createForSale(array $data)
{  \Log::info('decrementd');
    return DB::transaction(function () use ($data) {

        $delivery = $this->model->create($data);

        if (
            $delivery->status === DeliveryStatusEnum::DELIVERED->value &&
            !$delivery->inventory_deducted
        ) {
               \Log::info('decrementd');
            foreach ($delivery->sale->saleItems as $saleItem) {

                $inventory = Inventory::where('item_id', $saleItem->item_id)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($inventory->qty < $saleItem->qty) {
                    throw new \Exception(
                        "Insufficient stock for item ID: {$saleItem->item_id}"
                    );
                }

                $inventory->decrement('qty', $saleItem->qty);
            }
             \Log::info('decrementd');
            $delivery->inventory_deducted = true;
            $delivery->delivered_at = now();
            $delivery->save();

        }

        return $delivery->load('sale.saleItems');
    });
}

    public function updateStatus(Delivery $delivery, string $status)
    {
          \Log::info('decrementd');
         
        return DB::transaction(function () use ($delivery, $status) {

            if (
                $status === DeliveryStatusEnum::DELIVERED->value &&
                !$delivery->inventory_deducted
            ) {

              \Log::info('decrementd');

                foreach ($delivery->sale->saleItems as $saleItem) {

                    $inventory = Inventory::where('item_id', $saleItem->item_id)
                        ->lockForUpdate()
                        ->firstOrFail();

                    if ($inventory->qty < $saleItem->qty) {
                        throw new \Exception("Insufficient stock for item ID: {$saleItem->item_id}");
                    }

                    \Log::info('decrementd');
                    $inventory->decrement('qty', $saleItem->qty);
                }

                $delivery->inventory_deducted = true;
                $delivery->delivered_at = now();
            }
          
            $delivery->status = $status;
            $delivery->save();

            return $delivery->load('sale.saleItems');
        });
    }

    public function delete(Delivery $delivery)
    {
        return DB::transaction(function () use ($delivery) {

            if ($delivery->inventory_deducted) {

                foreach ($delivery->sale->saleItems as $saleItem) {

                    $inventory = Inventory::where('item_id', $saleItem->item_id)->first();

                    if ($inventory) {
                        $inventory->increment('qty', $saleItem->qty);
                    }
                }
            }

            $delivery->delete();

            return true;
        });
    }
}