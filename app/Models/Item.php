<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User; // for created_by reference
use App\Enums\RoleEnum;
use Illuminate\Database\Eloquent\SoftDeletes;
use Cviebrock\EloquentSluggable\Sluggable;
use App\Enums\SaleStatusEnum;

class Item extends Model
{
   use SoftDeletes, Sluggable;

    protected $fillable = ['item_no', 'item_name', 'price', 'tax', 'batch_number',   'expiry_date',  'created_by_id', 'status'];

     
    protected $casts = [
        'item_no' => 'string',
        'item_name' => 'string',
        'price' => 'float',
        'tax' => 'float',
        'batch_number' => 'string',
    'expiry_date' => 'date',
        'created_by_id' => 'integer',
        'status' => 'boolean', // active/inactive
    ];

    protected $attributes = [
    'status' => true, // default to active
];

     protected $appends = ['total_value', 'sold_qty','gross_stock'];

    // Auto-set created_by_id on saving
   public static function boot()
{
    parent::boot();

    static::saving(function ($model) {
        // Set created_by_id if not already set
      if (empty($model->created_by_id)) {
        $model->created_by_id =
            auth()->id()
            ?? User::role(RoleEnum::ADMIN)->value('id');
    }


        // Generate item_no if empty
        if (empty($model->item_no)) {
            $model->item_no = self::generateItemNo();
        }
    });
}



public function getSoldQtyAttribute()
{
    return $this->saleItems()
        ->whereHas('sale.delivery', function ($q) {
            $q->where('status', \App\Enums\DeliveryStatusEnum::DELIVERED->value);
        })
        ->sum('qty');
}

 public function getTotalValueAttribute(): float
    {
        $price = $this->price ?? 0;
        $tax   = $this->tax ?? 0;

        return round($price + ($price * $tax / 100), 2);
    }


public function getGrossStockAttribute()
{
    $remaining = $this->inventory?->qty ?? 0;
    return $remaining + $this->sold_qty;
}
    
    /**
     * Generate a 10-character item number with a space or hyphen somewhere
     */
    protected static function generateItemNo()
    {
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $length = 10;

        // Random string
        $itemNo = '';
        for ($i = 0; $i < $length; $i++) {
            $itemNo .= $chars[random_int(0, strlen($chars) - 1)];
        }

        // Insert a space or hyphen at a random position (not at start or end)
        $pos = random_int(1, $length - 2);
        $symbol = random_int(0, 1) ? ' ' : '-';
        $itemNo = substr_replace($itemNo, $symbol, $pos, 0);

        return $itemNo;
    }


    // One-to-one relationship
    public function inventory(): HasOne
    {
        return $this->hasOne(Inventory::class, 'item_id');
    }


    public function saleItems(): HasMany
{
    return $this->hasMany(\App\Models\SaleItem::class, 'item_id');
}


     public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'item_name'
            ]
        ];
    }

    // Or if multiple inventories per item
    // public function inventories(): HasMany
    // {
    //     return $this->hasMany(Inventory::class, 'item_id');
    // }
}