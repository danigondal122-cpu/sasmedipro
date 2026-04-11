<?php

namespace App\Repositories\API;

use App\Models\Sale;
use App\Models\Purchase;
use Carbon\Carbon;

use App\Enums\PaymentStatusEnum;

class AnalyticsRepository
{
    // Total revenue from confirmed sales
    public function totalRevenue()
    {
        return Sale::where('status', ['confirmed', 'delivered'])->whereNull('deleted_at')->get()
    ->sum(function ($sale) {
        $due = $sale->meta?->due_amount ?? 0;
        return $sale->payment_status === PaymentStatusEnum::PAID ? $sale->total_amount : $sale->total_amount - $due;
    });
    }




    protected function loanAmount($startDate = null, $endDate = null)
{
    $query = \App\Models\Loan::query()->whereNull('deleted_at');

    if ($startDate && $endDate) {
        $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    return $query->sum('remaining_balance');
}




       public function totalLoan()
{
    // Sum of remaining balances of all active loans (or adjust as needed)
    return \App\Models\Loan::whereNull('deleted_at')
        ->sum('remaining_balance');
}

   


     public function totalCreditSales()
    {
        return Sale::where('status',  ['confirmed', 'delivered'])
            ->whereHas('meta', function ($q) {
                $q->where('payment_type', 'credit');
            })
            ->whereNull('deleted_at')
            ->sum('total_amount');
    }

    // Total purchase cost
    public function totalCost()
    {
        return Purchase::whereNull('deleted_at')->sum('total');
    }

    // Total profit/loss
    public function totalProfit()
    {
        return $this->totalRevenue() - $this->totalCost();
    }

    public function profitReport($month = null)
    {
        /*
        |---------------------------------------
        | Daily (last 7 days)
        |---------------------------------------
        */
        $daily = collect();

        for ($i = 6; $i >= 0; $i--) {

            $date = now()->subDays($i);

             $startOfDay = $date->copy()->startOfDay();
    $endOfDay = $date->copy()->endOfDay();

            $loan = $this->loanAmount($startOfDay, $endOfDay);

            $revenue = Sale::whereDate('created_at', $date)->whereNull('deleted_at') ->get()
    ->sum(function ($sale) {
        $due = $sale->meta?->due_amount ?? 0;
        return $sale->payment_status === PaymentStatusEnum::PAID ? $sale->total_amount : $sale->total_amount - $due;
    });
            
            $cost = Purchase::whereDate('created_at', $date)->whereNull('deleted_at')->sum('total');
            $credit = Sale::whereDate('created_at', $date)
              ->whereHas('meta', fn($q) => $q->where('payment_type', 'credit'))
              ->whereNull('deleted_at')
              ->sum('total_amount');

            $daily->push([
                'day' => now()->subDays($i)->format('d'),
                'revenue' => $revenue,
                'credit_sales' => $credit,
                'cost' => $cost,
                'profit' => $revenue - $cost  - $loan,
                'loan' => $loan,
            ]);
        }

        /*
        |---------------------------------------
        | Weekly (last 7 weeks)
        |---------------------------------------
        */
        $weekly = collect();

        for ($i = 6; $i >= 0; $i--) {

            $start = now()->startOfWeek()->subWeeks($i);
            $end = now()->startOfWeek()->subWeeks($i)->endOfWeek();

            $loan = $this->loanAmount($start, $end);

            $revenue = Sale::whereBetween('created_at', [$start, $end])->whereNull('deleted_at')->get()
    ->sum(function ($sale) {
        $due = $sale->meta?->due_amount ?? 0;
        return $sale->payment_status === PaymentStatusEnum::PAID ? $sale->total_amount : $sale->total_amount - $due;
    });
            $cost = Purchase::whereBetween('created_at', [$start, $end])->whereNull('deleted_at')->sum('total');
            $credit = Sale::whereDate('created_at', [$start, $end])
               ->whereHas('meta', fn($q) => $q->where('payment_type', 'credit'))
              ->whereNull('deleted_at')
              ->sum('total_amount');


            $weekly->push([
                'week' => now()->subWeeks($i)->weekOfYear,
                'revenue' => $revenue,
                'cost' => $cost,
                'credit_sales' => $credit,
                'profit' => $revenue - $cost  - $loan,
                 'loan' => $loan,
            ]);
        }

        /*
        |---------------------------------------
        | Monthly (last 12 months)
        |---------------------------------------
        */
        $monthly = collect();

        $current = now()->startOfMonth();
        

        for ($i = 11; $i >= 0; $i--) {

            $date = $current->copy()->subMonths($i);
            $startOfMonth = $date->copy()->startOfMonth();
$endOfMonth = $date->copy()->endOfMonth();

            $loan = $this->loanAmount($startOfMonth, $endOfMonth);

            $revenue = Sale::whereYear('created_at', $date->year)
            ->whereNull('deleted_at')
                ->whereMonth('created_at', $date->month)
                ->get()
    ->sum(function ($sale) {
        $due = $sale->meta?->due_amount ?? 0;
        return $sale->payment_status === PaymentStatusEnum::PAID ? $sale->total_amount : $sale->total_amount - $due;
    });

            $cost = Purchase::whereYear('created_at', $date->year)
            ->whereNull('deleted_at')
                ->whereMonth('created_at', $date->month)
                ->sum('total');

                 $credit = Sale::whereDate('created_at',$date->year)
               ->whereHas('meta', fn($q) => $q->where('payment_type', 'credit'))
              ->whereNull('deleted_at')
              ->sum('total_amount');


            $monthly->push([
                'month' => $date->format('F'),
                'year' => $date->year,
                'value' => $date->format('Y-m'),
                'loan' => $loan,

                'revenue' => $revenue,
                'credit_sales' => $credit,
                'cost' => $cost,
                'profit' => $revenue - $cost - $loan
            ]);
        }

        /*
        |---------------------------------------
        | Daily Matrix (selected month)
        |---------------------------------------
        */
        $selectedMonth = $month ? Carbon::parse($month) : now();

        $startOfMonth = $selectedMonth->copy()->startOfMonth();
        $daysInMonth = $selectedMonth->daysInMonth;

        $dailyMatrix = collect();

        for ($i = 1; $i <= $daysInMonth; $i++) {

            $date = $startOfMonth->copy()->day($i);

            $startOfDay = $date->copy()->startOfDay(); 
$endOfDay = $date->copy()->endOfDay(); 

            $loan = $this->loanAmount($startOfDay, $endOfDay);

            $revenue = Sale::whereDate('created_at', $date)->whereNull('deleted_at')->get()
    ->sum(function ($sale) {
        $due = $sale->meta?->due_amount ?? 0;
        return $sale->payment_status === PaymentStatusEnum::PAID ? $sale->total_amount : $sale->total_amount - $due;
    });
            $cost = Purchase::whereDate('created_at', $date)->whereNull('deleted_at')->sum('total');
              $credit = Sale::whereDate('created_at',$date)
               ->whereHas('meta', fn($q) => $q->where('payment_type', 'credit'))
              ->whereNull('deleted_at')
              ->sum('total_amount');


            $dailyMatrix->push([
                'day' => $date->format('d'),
                'date' => $date->format('Y-m-d'),
                'loan' => $loan,

                'revenue' => $revenue,
                'credit_sales' => $credit,
                'cost' => $cost,
                'profit' => $revenue - $cost  - $loan
            ]);
        }

        /*
        |---------------------------------------
        | Month Options (for dropdown)
        |---------------------------------------
        */
        $monthOptions = $monthly->map(fn($m) => [
            'label' => $m['month'].' '.$m['year'],
            'value' => $m['value']
        ]);

        return [
            'daily' => $daily,
            'weekly' => $weekly,
            'monthly' => $monthly,
            'daily_matrix' => $dailyMatrix,
            'month_options' => $monthOptions,

            // totals
            'totals' => [
                'revenue' => $this->totalRevenue(),
                'cost' => $this->totalCost(),
                'credit_sales' =>$this->totalCreditSales(),
                'profit' => $this->totalProfit(),
                'loan' => $this->totalLoan(),
            ]
        ];
    }
}