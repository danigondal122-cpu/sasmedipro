<?php

namespace App\Repositories\API;

use App\Models\Sale;
use Illuminate\Support\Facades\DB;
use App\Enums\SaleStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Models\Delivery;
use App\Enums\DeliveryStatusEnum;

class SaleRepository
{
    protected $model;

    public function __construct(Sale $sale)
    {
        $this->model = $sale;
    }

    public function all(array $filters = [])
{
    $query = Sale::with('saleItems.item', 'customer', 'seller', 'meta', 'delivery');

    // Filter by search term (invoice number or customer name)
    if (!empty($filters['search'])) {
        $search = $filters['search'];
        $query->where(function($q) use ($search) {
            $q->where('invoice_no', 'like', "%{$search}%")
              ->orWhereHas('customer', function($q2) use ($search) {
                  $q2->where('name', 'like', "%{$search}%");
              });
        });
    }

     if (!empty($filters['payment_type'])) {
        $query->whereHas('meta', function($q) use ($filters) {
            $q->where('payment_type', $filters['payment_type']);
        });
    }

    // Optional: filter only sales without delivery
    if (!empty($filters['no_delivery'])) {
        $query->doesntHave('delivery');
    }

    $perPage = $filters['per_page'] ?? 10;

    return $query->latest()->paginate($perPage);
}


public function reports($month = null)
{
    // ----------------------------
    // Daily last 7 days
    // ----------------------------
    $daily = collect();
    for ($i = 6; $i >= 0; $i--) {
        $date = now()->subDays($i)->format('Y-m-d');
        $daily->push([
            'day' => now()->subDays($i)->format('d'),
            'sales' => \DB::table('sales')->whereNull('deleted_at')->whereNull('deleted_at')->whereDate('created_at', $date)->sum('total_amount')
        ]);
    }

    // ----------------------------
    // Weekly last 7 weeks
    // ----------------------------
    $weekly = collect();
    for ($i = 6; $i >= 0; $i--) {
        $start = now()->startOfWeek()->subWeeks($i);
        $end = now()->startOfWeek()->subWeeks($i)->endOfWeek();

        $weekly->push([
            'week' => now()->subWeeks($i)->weekOfYear,
            'sales' => \DB::table('sales')->whereNull('deleted_at')->whereBetween('created_at', [$start, $end])->sum('total_amount')
        ]);
    }

    // ----------------------------
    // Monthly last 12 months totals
    // ----------------------------
    $monthly = collect();
    $current = now()->startOfMonth(); // start from first day of current month

    for ($i = 11; $i >= 0; $i--) {
        $date = $current->copy()->subMonths($i);

        $monthly->push([
            'month' => $date->format('F'),
            'year' => $date->year,
            'value' => $date->format('Y-m'),
            'sales' => \DB::table('sales')
             ->whereNull('deleted_at')
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->sum('total_amount')
        ]);
    }

    // Ensure uniqueness just in case
    $monthly = $monthly->unique(fn($m) => $m['value'])->values();

    // ----------------------------
    // Daily matrix for selected month
    // ----------------------------
    $selectedMonth = $month ? \Carbon\Carbon::parse($month) : now();
    $startOfMonth = $selectedMonth->copy()->startOfMonth();
    $daysInMonth = $selectedMonth->daysInMonth;

    $dailyMatrix = collect();
    for ($i = 1; $i <= $daysInMonth; $i++) {
        $date = $startOfMonth->copy()->day($i);
        $dailyMatrix->push([
            'day' => $date->format('d'),
            'date' => $date->format('Y-m-d'),
            'sales' => \DB::table('sales') ->whereNull('deleted_at')->whereDate('created_at', $date)->sum('total_amount')
        ]);
    }

    // ----------------------------
    // Month options for dropdown
    // ----------------------------
    $monthOptions = $monthly->map(fn($m) => [
        'label' => $m['month'] . ' ' . $m['year'],
        'value' => $m['value']
    ]);

    // ----------------------------
    // Return report
    // ----------------------------
    return [
        'daily' => $daily,
        'weekly' => $weekly,
        'monthly' => $monthly,
        'daily_matrix' => $dailyMatrix,
        'month_options' => $monthOptions
    ];
}


    public function find($id)
    {
        return $this->model
            ->with('saleItems.item','customer','seller','meta','delivery')
            ->findOrFail($id);
    }










    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {

            $itemsData = $data['items'] ?? [];
            $metaData  = $data['meta'] ?? [];

            unset($data['items'], $data['meta']);

            $totalAmount = 0;

            // 1️⃣ Validate stock before creating sale
           foreach ($itemsData as $itemData) {
            $item = \App\Models\Item::with('inventory')->find($itemData['item_id']);
            if (!$item) {
                throw new \Exception("Item with ID {$itemData['item_id']} not found.");
            }

            $availableQty = $item->inventory?->qty ?? 0;

            if ($itemData['qty'] > $availableQty) {
                throw new \Exception(
                    "Cannot sell {$itemData['qty']} units of {$item->item_name}. Only {$availableQty} in stock."
                );
            }
        }


            // Always default to CONFIRMED
            $data['status'] = $data['status'] ?? SaleStatusEnum::CONFIRMED->value;
            $paymentType = $metaData['payment_type'] ?? 'cash';

                $data['payment_status'] = $paymentType === 'credit'
            ? PaymentStatusEnum::UNPAID->value
            : PaymentStatusEnum::PAID->value;


            $sale = $this->model->create($data);

            foreach ($itemsData as $item) {

                $subtotal = $item['qty'] * $item['price'];
                $subtotal += $subtotal * ($item['tax'] ?? 0) / 100;

                $totalAmount += $subtotal;

                $sale->saleItems()->create([
                    'item_id' => $item['item_id'],
                    'qty'     => $item['qty'],
                    'price'   => $item['price'],
                    'tax'     => $item['tax'] ?? 0,
                    'subtotal'=> $subtotal,
                ]);
            }

            $sale->update(['total_amount' => $totalAmount]);

            // Meta
            $dueAmount = ($metaData['payment_type'] ?? 'cash') === 'credit'
                ? $totalAmount
                : 0;


            $dueDate = null;
        if ($paymentType === 'credit') {
            $dueDate = now()->addDays(7); // default due date for credit sales
        }

            

            $sale->meta()->create([
                'sales_person' => $metaData['sales_person'] ?? null,
                'payment_type' => $metaData['payment_type'] ?? 'cash',
                'due_amount'   => $dueAmount,
                'due_date'     => $dueDate,
                'whs'          => $metaData['whs'] ?? null,
                'uom'          => $metaData['uom'] ?? null,
            ]);

            // Payment
            $customerId = $sale->customer_id;

            \App\Models\CustomerPayment::create([
                'sale_id'     => $sale->id,
                'customer_id' => $customerId,
                'amount_paid' => $dueAmount > 0 ? 0 : $totalAmount,
                'paid_at'     => $dueAmount > 0 ? null : now(),
            ]);



            $sale->delivery()->create([
    'status' => DeliveryStatusEnum::PENDING,
    'inventory_deducted' => false,
]);


            return $sale->load('saleItems.item','meta','customer','seller');
        });
    }









    public function update(Sale $sale, array $data)
    {
        return DB::transaction(function () use ($sale, $data) {
          

            $metaData = $data['meta'] ?? null;
          $paymentAmount = isset($data['payment_amount']) 
    ? round($data['payment_amount'], 2) 
    : 0;

            \Log::info(['payment'=> $paymentAmount]);

            $payment = $sale->customerPayment()->first();


            


            $sale->update([
                'customer_id' => $data['customer_id'],
                'seller_id'   => $data['seller_id'],
                'status'      => $data['status'],
            //    'payment_status' => $data['payment_status'] ,
            ]);



            if ($paymentAmount > 0) {

    

    $previousPaid = $payment->amount_paid ?? 0;
    $newPaid = $previousPaid + $paymentAmount;
     
      $due_amount = $sale->meta->due_amount;


    if ($newPaid > $due_amount) {
        throw new \Exception(
            "Payment amount ({$newPaid}) exceeds the remaining balance ({$due_amount}) for this sale."
        );
    }


    // Prevent overpayment
    if ($newPaid > $sale->total_amount) {
        $newPaid = $sale->total_amount;
    }

  
     $remaining = $sale->total_amount - $newPaid;

    $payment->update([
        'amount_paid' => $newPaid,
        'paid_at' => now(),
    ]);

    // Update due amount in meta
   $sale->meta()->updateOrCreate(
    ['sale_id' => $sale->id],
    ['due_amount' => $remaining]
);

    // Update payment status
    if ($newPaid === 0) {
        $paymentStatus = PaymentStatusEnum::UNPAID->value;
    } elseif ($remaining > 0) {
        $paymentStatus = PaymentStatusEnum::PARTIALLY_PAID->value;
    } else {
        $paymentStatus = PaymentStatusEnum::PAID->value;
    }

    $sale->update([
        'payment_status' => $paymentStatus
    ]);
}

            if ($metaData) {


              $paymentType = $metaData['payment_type'] ?? 'credit';

           

     $meta = $sale->meta()->first();

   $dueDate = $meta?->due_date; // get existing due_date


   // Log current state before checking

if (
    !$meta?->due_date &&
    $paymentType === 'credit' &&
    $sale->payment_status !== PaymentStatusEnum::PAID->value
) {
    $dueDate = now()->addDays(7); // set default only for credit
    
    // Log that we are setting a new due date

}




                $sale->meta()->updateOrCreate(
                    ['sale_id' => $sale->id],
                    [
                        'sales_person' => $metaData['sales_person'] ?? null,
                        'payment_type' => $paymentType,
                        'whs'          => $metaData['whs'] ?? null,
                        'uom'          => $metaData['uom'] ?? null,
                        'due_date'     => $dueDate,
                        
                    ]
                );

              

//                $sale->customerPayment()->firstOrCreate(
//     ['sale_id' => $sale->id],
//     [
//         'customer_id' => $sale->customer_id,
//         'amount_paid' => $paymentType === 'credit' ? 0 : $sale->total_amount,
//         'paid_at'     => $paymentType === 'credit' ? null : now(),
//     ]
// );
            }

            return $sale->load('saleItems.item','meta','customerPayment','customer','seller');
        });
    }




    public function delete(Sale $sale)
    {
        return DB::transaction(function () use ($sale) {

            // ❌ NO INVENTORY RESTORE HERE ANYMORE

         
            $sale->delete();

            return true;
        });
    }


public function bulkUpdateStatus(array $ids, string $status)
{
    return DB::transaction(function () use ($ids, $status) {

        $sales = $this->model->whereIn('id', $ids)->get();

        foreach ($sales as $sale) {
            $sale->update(['status' => $status]);
        }

        return true;
    });
}






public function bulkDelete(array $ids)
{
    return DB::transaction(function () use ($ids) {

        $sales = $this->model->whereIn('id', $ids)->get();

        foreach ($sales as $sale) {
            $sale->saleItems()->delete();
            $sale->delete();
        }

        return true;
    });
}






}