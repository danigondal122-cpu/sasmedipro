<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;
use App\Models\SaleMeta;
use App\Models\CustomerPayment;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Enums\SaleStatusEnum;
use App\Enums\PaymentStatusEnum;

class Sale extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'invoice_no',
         'customer_id',
          'seller_id',
        'total_amount',
        'created_by_id',
        'inventory_deducted',
        'status',
        'payment_status',
    ];

      protected $casts = [
        'status' => SaleStatusEnum::class, // cast status to enum
        'payment_status' => PaymentStatusEnum::class,
    ];
    

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->created_by_id = auth()->id() ?? 1;
            $model->invoice_no = 'INV-' . time(); // simple unique invoice


             if (!$model->status) {
                $model->status = SaleStatusEnum::CONFIRMED;
            }
        });



           static::deleting(function ($sale) {
        if (!$sale->isForceDeleting()) {
            $sale->saleItems()->delete();
            $sale->meta()->delete();
            $sale->customerPayment()?->delete();
        }
    });


    }

    // Sale items relationship
    public function saleItems(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }



      public function meta()
{
    return $this->hasOne(SaleMeta::class, 'sale_id');
}




    /**
     * Sale belongs to a customer
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }


       public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    // Customer payments
   // In Sale model
public function customerPayment()
{
    return $this->hasOne(CustomerPayment::class);
}


    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }


    public function delivery()
{
    return $this->hasOne(Delivery::class);
}
}
