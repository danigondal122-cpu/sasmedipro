<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\API\PurchaseRepository;
use App\Http\Resources\PurchaseResource;

class PurchaseController extends Controller
{
    protected $repo;

    public function __construct(PurchaseRepository $repo)
    {
        $this->repo = $repo;
    }

    /**
     * GET /api/purchases
     */
    public function index(Request $request)
    {
        $filters = $request->only([
            'search',
            'page',
            'per_page'
        ]);

        $purchases = $this->repo->all($filters);

        return response()->json([
            'success' => true,
            'data' => PurchaseResource::collection($purchases),
            'meta' => [
                'current_page' => $purchases->currentPage(),
                'per_page'     => $purchases->perPage(),
                'total'        => $purchases->total(),
                'last_page'    => $purchases->lastPage(),
            ]
        ]);
    }

    /**
     * GET /api/purchases/{id}
     */
    public function show($id)
    {
        try {
            $purchase = $this->repo->find($id);

            return response()->json([
                'success' => true,
                'data' => new PurchaseResource($purchase),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * POST /api/purchases
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'amount' => 'required|integer|min:1',
            'shipping' => 'nullable|numeric|min:0',
        ]);

        $purchase = $this->repo->store($validated);

        return response()->json([
            'success' => true,
            'data' => new PurchaseResource($purchase),
        ], 201);
    }

    /**
     * PUT /api/purchases/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $purchase = $this->repo->find($id);

            $validated = $request->validate([
                'product_name' => 'sometimes|required|string|max:255',
                'price' => 'sometimes|required|numeric|min:0',
                'amount' => 'sometimes|required|integer|min:1',
                'shipping' => 'nullable|numeric|min:0',
            ]);

            $purchase = $this->repo->update($purchase, $validated);

            return response()->json([
                'success' => true,
                'data' => new PurchaseResource($purchase),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * DELETE /api/purchases/{id}
     */
    public function destroy($id)
    {
        try {
            $purchase = $this->repo->find($id);
            $this->repo->delete($purchase);

            return response()->json([
                'success' => true,
                'message' => 'Purchase deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }

    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:purchases,id'
        ]);

        $this->repo->bulkDelete($validated['ids']);

        return response()->json([
            'success' => true,
            'message' => 'Selected purchases deleted successfully.',
        ]);
    }
}