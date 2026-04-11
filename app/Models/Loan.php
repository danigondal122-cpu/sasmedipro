<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Loan extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'loan_no', 'lender_name',
        'borrower_name',
         'principal_amount', 
        'interest_rate',
         'start_date',
          'total_amount_due',
           'remaining_balance', 
        'status', 'created_by_id'
    ];

    protected $casts = [
    'start_date' => 'date',
];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($loan) {
            $loan->loan_no = 'LN-' . time();
            $loan->created_by_id = auth()->id() ?? 1;
            $loan->status = $loan->status ?? 'active';
            $loan->total_amount_due = $loan->principal_amount * (1 + $loan->interest_rate/100);
            $loan->remaining_balance = $loan->total_amount_due;
        });
    }

    // Relationships
    // public function lender()
    // {
    //     return $this->belongsTo(User::class, 'lender_id');
    // }

    // public function borrower()
    // {
    //     return $this->belongsTo(User::class, 'borrower_id');
    // }

    public function repayments()
    {
        return $this->hasMany(LoanRepayment::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }
}