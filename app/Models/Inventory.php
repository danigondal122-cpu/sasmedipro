<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Item;
use App\Models\User;

class Inventory extends Model
{
      use SoftDeletes;

    protected $table = 'inventories';

    protected $fillable = [
        'item_id',
        'qty',
      
        'created_by_id',
    ];

    protected $casts = [
        'item_id' => 'integer',
        'qty' => 'integer',
        
        'created_by_id' => 'integer',
       
    ];











    // Relationship to Item
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    // Relationship to User who created the inventory
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    // Computed value (like React totalValue)
    public function getTotalValueAttribute()
    {
        if ($this->item) {
            $subtotal = $this->qty * $this->item->price;
            return $subtotal + ($subtotal * $this->item->tax / 100);
        }

        return 0;
    }

    // Automatically set created_by_id on save
    protected static function boot()
    {
        parent::boot();

       static::creating(function ($model) {
  if (self::where('item_id', $model->item_id)->whereNull('deleted_at')->exists()) {
    throw new \Exception('Inventory already exists for this item.');
}
    $model->created_by_id = auth()->id() ?? 1;
    $model->status = $model->status ?? 1;
});
        
    }

    
}
