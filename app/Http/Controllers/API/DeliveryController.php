<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Repositories\API\DeliveryRepository;
use Illuminate\Http\Request;
use App\Http\Resources\DeliveryResource;

class DeliveryController extends Controller
{
    protected $repository;

    public function __construct(DeliveryRepository $repository)
    {
        $this->repository = $repository;
    }


   public function index(Request $request)
{
    $perPage = $request->per_page ?? 10;

    $deliveries = Delivery::with(['sale.customer', 'sale.seller', 'deliveredBy'])->latest()
        ->paginate($perPage);

    return response()->json([
        'data' => DeliveryResource::collection($deliveries->items()),
        'meta' => [
            'current_page' => $deliveries->currentPage(),
            'per_page' => $deliveries->perPage(),
            'total' => $deliveries->total(),
            'last_page' => $deliveries->lastPage(),
        ],
    ]);
}

    // Get single delivery
    public function show(Delivery $delivery)
    {
        return response()->json(
            $delivery->load(['sale.customer', 'sale.seller'])
        );
    }


    public function store(Request $request)
    {

     $saleId = $request->sale_id;

    // Check if delivery already exists for this sale
    $existingDelivery = Delivery::where('sale_id', $saleId)->first();
    if ($existingDelivery) {
        return response()->json([
            'message' => 'Delivery already exists for this sale',
            'data' => $existingDelivery
        ], 400);
    }
            \Log::info('decrementd');

        $delivery = $this->repository->createForSale($request->all());


        
         $delivery->load('sale', 'deliveredBy');

        return new DeliveryResource($delivery);
    }

    public function updateStatus(Request $request, Delivery $delivery)
    {
        $delivery = $this->repository->updateStatus(
            $delivery,
            $request->status
        );
$delivery->load('sale', 'deliveredBy');

        return new DeliveryResource($delivery);
    }

    public function destroy(Delivery $delivery)
    {
        $this->repository->delete($delivery);

        return response()->json(['message' => 'Deleted successfully']);
    }




    public function bulkDelete(Request $request)
{
    $ids = $request->ids ?? [];
    if (!count($ids)) {
        return response()->json(['message' => 'No deliveries selected'], 400);
    }

    foreach ($ids as $id) {
        $delivery = Delivery::find($id);
        if ($delivery) {
            $this->repository->delete($delivery);
        }
    }

    return response()->json(['message' => 'Selected deliveries deleted successfully']);
}

public function bulkUpdateStatus(Request $request)
{
    $ids = $request->ids ?? [];
    $status = $request->status ?? null;

    if (!count($ids) || !$status) {
        return response()->json(['message' => 'Invalid request'], 400);
    }

    foreach ($ids as $id) {
        $delivery = Delivery::find($id);
        if ($delivery) {
            $this->repository->updateStatus($delivery, $status);
        }
    }

    return response()->json(['message' => 'Selected deliveries updated successfully']);
}

}