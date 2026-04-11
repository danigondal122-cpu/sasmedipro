<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoanRepayment extends Model
{
    protected $fillable = ['loan_id', 'amount_paid', 'paid_at'];

    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }

    protected static function boot()
    {
        parent::boot();

        // static::created(function ($repayment) {
        //     $loan = $repayment->loan;
        //     $loan->remaining_balance -= $repayment->amount_paid;
        //     if ($loan->remaining_balance <= 0) {
        //         $loan->remaining_balance = 0;
        //         $loan->status = 'paid';
        //     }
        //     $loan->save();
        // });
    }
}