<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Sale;
use App\Models\Item;
use Illuminate\Database\Eloquent\SoftDeletes; // ✅ Correct import

class SaleItem extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'sale_id', 'item_id', 'qty', 'price', 'tax', 'subtotal'
    ];



    

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
