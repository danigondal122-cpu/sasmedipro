<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Sale;
use App\Models\Customer;
use App\Models\User;

class CustomerPayment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'sale_id',
        'customer_id',
        'amount_paid',
        'paid_at',
       
    ];

    protected $casts = [
        'amount_paid'    => 'float',
        'paid_at'        => 'datetime',
        'sale_id'        => 'integer',
        'customer_id'    => 'integer',
       
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Set created_by_id if not provided
          

            // Auto-set customer_id if sale_id is provided
            if (!empty($model->sale_id) && empty($model->customer_id)) {
                $sale = Sale::find($model->sale_id);
                if ($sale) {
                    $model->customer_id = $sale->customer_id;
                }
            }
        });
    }

    /**
     * Payment belongs to a sale
     */
    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    /**
     * Payment belongs to a customer
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Payment created by a user
     */
   
}
