<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;
use App\Enums\CustomerRoleEnum;
use App\Enums\RoleEnum;


class Customer extends Model
{
    use SoftDeletes;

    protected $fillable = ['customer_no', 'name', 'address', 'phone','mobile','vat', 'brn', 'email', 'role', 'created_by_id', 'status'];

    protected $casts = [
        'customer_no'   => 'string',
        'name'          => 'string',
        'address'       => 'string',
        'phone'         => 'string',
        'email'         => 'string',
        'mobile'        => 'string',
        'vat'           => 'string',
        'brn'           => 'string',
        'role'          => CustomerRoleEnum::class,
        'created_by_id' => 'integer',
       
    ];

    protected $attributes = [
       
    ];

    protected $appends = ['display_name'];

    /**
     * Boot method to auto-set created_by_id and customer_no
     */
    protected static function boot()
    {
        parent::boot();

        
        static::creating(function ($model) {
            if (empty($model->role)) {
                $model->role = CustomerRoleEnum::CUSTOMER; // default
            }

              if (empty($model->created_by_id)) {
                $model->created_by_id = auth()->id() 
                    ?? User::role(RoleEnum::ADMIN)->value('id');
            }

            // Generate customer_no if empty
            if (empty($model->customer_no)) {
                $model->customer_no = self::generateCustomerNo();
            }
        });


        static::saving(function ($model) {
            // Set created_by_id if not set
          
        });
    }

    /**
     * Generate a unique 8-character customer number
     */
  protected static function generateCustomerNo(): string
{
    $year = date('Y'); // current year
    $randomDigits = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT); // 6-digit random number

    return "SAS-{$year}-{$randomDigits}";
}

    /**
     * Example appended attribute: full display name
     */
    public function getDisplayNameAttribute(): string
    {
        return "{$this->customer_no} - {$this->name}";
    }

    /**
     * One-to-many relationship: Customer has many sales
     */
    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class, 'customer_id');
    }

    /**
     * One-to-many relationship: Customer has many payments
     */
    public function payments(): HasMany
    {
        return $this->hasMany(CustomerPayment::class, 'customer_id');
    }

    /**
     * Optional: created by user
     */
    public function creator(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'created_by_id');
    }
}
