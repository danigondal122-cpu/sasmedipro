<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Enums\DeliveryStatusEnum;

class Delivery extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'sale_id',
        'delivered_by',
        'status',
        'inventory_deducted',
        'delivered_at',
        'notes',
    ];

    protected $casts = [
        'status' => DeliveryStatusEnum::class,
        'inventory_deducted' => 'boolean',
        'delivered_at' => 'datetime',
    ];


    protected static function boot()
{
    parent::boot();

    static::creating(function ($delivery) {
        $delivery->delivered_by = auth()->id();
        if (($delivery->status ?? 'pending') === DeliveryStatusEnum::DELIVERED->value) {
            
            $delivery->delivered_at = now();
        }
    });
}

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function deliveredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'delivered_by');
    }
}