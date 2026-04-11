<?php

namespace App\Repositories\API;

use App\Models\Loan;
use Illuminate\Support\Facades\DB;

class LoanRepository
{
    protected $model;

    public function __construct(Loan $loan)
    {
        $this->model = $loan;
    }

    public function all(array $filters = [])
    {
        $query = Loan::with('repayments') ->withSum('repayments', 'amount_paid');

        if (!empty($filters['search'])) {
            $search = $filters['search'];

            $query->where(function ($q) use ($search) {
                $q->where('loan_no', 'like', "%{$search}%")
                  ->orWhere('borrower_name', 'like', "%{$search}%")
                  ->orWhere('lender_name', 'like', "%{$search}%");
            });
        }

        $perPage = $filters['per_page'] ?? 10;

        return $query->latest()->paginate($perPage);
    }

    public function find($id)
    {
        return $this->model->with('repayments')->findOrFail($id);
    }

    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {
            return $this->model->create($data);
        });
    }



 public function update(Loan $loan, array $data)
{
    return DB::transaction(function () use ($loan, $data) {
        // Check if principal_amount or interest_rate is being updated
        $principalChanged = isset($data['principal_amount']);
        $interestChanged = isset($data['interest_rate']);

        if ($principalChanged || $interestChanged) {
            $newPrincipal = $principalChanged ? (float) $data['principal_amount'] : $loan->principal_amount;
            $newInterestRate = $interestChanged ? (float) $data['interest_rate'] : $loan->interest_rate;

            // Recalculate total due
            $totalDue = $newPrincipal + ($newPrincipal * $newInterestRate / 100);
            $data['total_amount_due'] = $totalDue;

            // Calculate total repayments already made
            $totalPaid = $loan->repayments()->sum('amount_paid');

            // Recalculate remaining balance
            $data['remaining_balance'] = max(0, $totalDue - $totalPaid);

            // Update status if fully paid
            if ($data['remaining_balance'] <= 0) {
                $data['remaining_balance'] = 0;
                $data['status'] = 'paid';
            } else {
                // Keep status active if not fully paid
                $data['status'] = $loan->status === 'paid' ? 'active' : $loan->status;
            }
        }

        // Update the loan with recalculated fields
        $loan->update($data);

        return $loan;
    });
}

 public function addRepayment(Loan $loan, float $amount)
{
    return DB::transaction(function () use ($loan, $amount) {

        $loan = Loan::lockForUpdate()->find($loan->id);

        if ($amount > $loan->remaining_balance) {
            throw new \Exception("Repayment exceeds remaining loan balance.");
        }

        $repayment = $loan->repayments()->create([
            'amount_paid' => $amount,
            'paid_at' => now(),
        ]);

        $loan->remaining_balance -= $amount;

        if ($loan->remaining_balance <= 0) {
            $loan->remaining_balance = 0;
            $loan->status = 'paid';
        }

        $loan->save();

        return $repayment->load('loan');
    });
}

    public function delete(Loan $loan)
    {
        return DB::transaction(function () use ($loan) {
            $loan->repayments()->delete();
            $loan->delete();
            return true;
        });
    }


    public function bulkDelete(array $ids)
{
    return DB::transaction(function () use ($ids) {
        // Fetch loans with repayments
        $loans = $this->model->with('repayments')->whereIn('id', $ids)->get();

        foreach ($loans as $loan) {
            // Delete all repayments first
            $loan->repayments()->delete();

            // Delete the loan
            $loan->delete();
        }

        return true;
    });
}
}