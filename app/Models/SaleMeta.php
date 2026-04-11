<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleMeta extends Model
{

 protected $table = 'sale_meta';

 
    protected $fillable = [
        'sale_id',
        'sales_person',
        'payment_type',
        'due_amount',
        'due_date',
        'whs',
        'uom',
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
}
