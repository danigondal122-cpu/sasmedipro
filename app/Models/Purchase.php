<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Purchase extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'purchase_no',
        'product_name',
        'price',
        'amount',
        'shipping',
        'total',
    ];

    protected $casts = [
        'product_name' => 'string',
        'price' => 'float',
        'amount' => 'integer',
        'shipping' => 'float',
        'total' => 'float',
    ];

    // Optional: auto-calculate total
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            $model->total = ($model->price * $model->amount) + $model->shipping;
        });

         static::creating(function ($model) {
            $model->purchase_no = 'PUR-' . time();
        });
    }
}