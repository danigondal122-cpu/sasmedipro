<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\API\SaleRepository;
use App\Http\Resources\SaleResource;
use App\Enums\SaleStatusEnum;
use App\Enums\PaymentStatusEnum;
use Illuminate\Validation\Rule;


class SaleController extends Controller
{
    protected $repo;

    public function __construct(SaleRepository $repo)
    {
        $this->repo = $repo;
    }

    public function index(Request $request)
    {
        $filters = [
        'search' => $request->query('search', ''),
        'per_page' => $request->query('per_page', 10),
        'no_delivery' => $request->query('no_delivery', false),
        'payment_type' => $request->query('payment_type', ''),
    ];

    $sales = $this->repo->all($filters);

        return response()->json([
            'success' => true,
            'data' => SaleResource::collection($sales),
            'meta' => [
                'current_page' => $sales->currentPage(),
                'per_page' => $sales->perPage(),
                'total' => $sales->total(),
                'last_page' => $sales->lastPage(),
            ]
        ]);
    }

    public function show($id)
    {
        try {
            $sale = $this->repo->find($id);

            return response()->json([
                'success' => true,
                'data' => new SaleResource($sale),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }



public function reports(Request $request)
{
    try {
        // Get month from query params, e.g., ?month=2026-03
        $month = $request->query('month');

        // Pass month to your repo method
        $data = $this->repo->reports($month);

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 400);
    }
}

    public function store(Request $request)
    {
        $validated = $request->validate([
             'customer_id' => 'required|exists:customers,id',
             'seller_id' => 'required|exists:users,id',
              'status' => ['required', 'string', Rule::in(array_column(SaleStatusEnum::cases(), 'value'))],
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.tax' => 'nullable|numeric|min:0',


            // Meta fields
    'meta' => 'nullable|array',
    'meta.sales_person' => 'nullable|string|max:255',
    'meta.payment_type' => ['nullable', 'string', Rule::in(['cash', 'card','bank_transfer', 'credit'])],
    'meta.whs' => 'nullable|string|max:50',
    'meta.uom' => 'nullable|string|max:50',
        ]);

        try {
            $sale = $this->repo->store($validated);

            return response()->json([
                'success' => true,
                'data' => new SaleResource($sale),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }






     public function destroy($id)
    {
        try {
            $sale = $this->repo->find($id); // get the sale
            $this->repo->delete($sale);     // delete via repository

            return response()->json([
                'success' => true,
                'message' => 'Sale deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }






    public function update(Request $request, $id)
{
    // 🔐 Validate ONLY status
    $validated = $request->validate([
          'customer_id' => 'required|exists:customers,id',
             'seller_id' => 'required|exists:users,id',
        'status' => [
            'required',
            'string',
            Rule::in(array_column(SaleStatusEnum::cases(), 'value')),
            
        ],
        'payment_amount' => 'nullable|numeric|min:0',
       
    'meta' => 'nullable|array',
    'meta.sales_person' => 'nullable|string|max:255',
    'meta.payment_type' => ['nullable', 'string', Rule::in(['cash', 'card', 'bank_transfer', 'credit'])],
    'meta.whs' => 'nullable|string|max:50',
    'meta.uom' => 'nullable|string|max:50',
        
    ]);

    try {
          \Log::info('Update Request Data', ['request_data' => $request->all()]);
        $sale = $this->repo->find($id);

         $updatedSale = $this->repo->update($sale, $validated);

        return response()->json([
            'success' => true,
            'data' => new SaleResource($updatedSale),
        ]);
    } catch (\Exception $e) {
        
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 400);
    }
}







    public function bulkUpdateStatus(Request $request)
{
    $validated = $request->validate([
        'ids' => 'required|array',
        'ids.*' => 'exists:sales,id',
        'status' => [
            'required',
            'string',
            Rule::in(array_column(SaleStatusEnum::cases(), 'value')),
        ],
        
    ]);

    $this->repo->bulkUpdateStatus(
        $validated['ids'],
        $validated['status']
    );

    return response()->json([
        'success' => true,
        'message' => 'Sale status updated successfully.',
    ]);
}





public function bulkDestroy(Request $request)
{
    $validated = $request->validate([
        'ids' => 'required|array',
        'ids.*' => 'exists:sales,id',
    ]);

    $this->repo->bulkDelete($validated['ids']);

    return response()->json([
        'success' => true,
        'message' => 'Selected sales deleted successfully.',
    ]);
}


}
