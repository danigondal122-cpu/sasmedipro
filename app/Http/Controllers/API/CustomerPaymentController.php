<?php
// app/Http/Controllers/API/CustomerPaymentController.php
namespace App\Http\Controllers\API;

use App\Models\CustomerPayment;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CustomerPaymentController extends Controller
{
   public function index(Request $request)
{
    $perPage = $request->get('per_page', 10);

    $paginatedPayments = CustomerPayment::with('sale')->latest()->paginate($perPage);

    return response()->json([
        'data' => $paginatedPayments->items(),
        'meta' => [
            'current_page' => $paginatedPayments->currentPage(),
            'last_page'    => $paginatedPayments->lastPage(),
            'per_page'     => $paginatedPayments->perPage(),
            'total'        => $paginatedPayments->total(),
        ]
    ]);
}

}


    // public function show($id)
    // {
    //     $payment = CustomerPayment::with(['sale', 'sale.customer'])->find($id);

    //     if (!$payment) {
    //         return response()->json(['message' => 'Payment not found'], 404);
    //     }

    //     return response()->json(['data' => $payment]);
    // }

