<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\LoanRepaymentResource;

class LoanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'loan_no' => $this->loan_no,

            'lender_name' => $this->lender_name,
            'borrower_name' => $this->borrower_name,

            'principal_amount' => $this->principal_amount,
            'interest_rate' => $this->interest_rate,
            'total_amount_due' => $this->total_amount_due,
            'remaining_balance' => $this->remaining_balance,
            'total_repayment' => $this->repayments_sum_amount_paid ?? 0,

            'status' => $this->status,
            'start_date' => $this->start_date?->format('Y-m-d'),

          'repayments' => LoanRepaymentResource::collection($this->whenLoaded('repayments')),

            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}