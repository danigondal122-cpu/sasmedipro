<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\API\InventoryRepository;
use App\Models\Inventory;
use App\Http\Resources\InventoryResource;

class InventoryController extends Controller
{
    protected $repo;

    public function __construct(InventoryRepository $repo)
    {
        $this->repo = $repo;
    }

    /**
     * GET /api/inventories
     * List inventories with optional filters
     */
    public function index(Request $request)
    {
        $filters = $request->only([
            'search',   // search by item name or item_no
            'page',
            'per_page'
        ]);

        $inventories = $this->repo->all($filters);

        return response()->json([
            'success' => true,
            'data' => InventoryResource::collection($inventories),
            'meta' => [
                'current_page' => $inventories->currentPage(),
                'per_page'     => $inventories->perPage(),
                'total'        => $inventories->total(),
                'last_page'    => $inventories->lastPage(),
            ]
        ]);
    }



    /**
     * GET /api/inventories/{id}
     * Show single inventory
     */
    public function show($id)
    {
        try {
            $inventory = $this->repo->find($id);

            return response()->json([
                'success' => true,
                'data' => new InventoryResource($inventory),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * POST /api/inventories
     * Create new inventory
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // 'item_id' => 'required|exists:items,id',
            'qty' => 'required|integer|min:0',
        ]);

        $inventory = $this->repo->store($validated);

        return response()->json([
            'success' => true,
            'data' => new InventoryResource($inventory),
        ], 201);
    }

    /**
     * PUT /api/inventories/{id}
     * Update inventory
     */
    public function update(Request $request, $id)
    {
        try {
            $inventory = $this->repo->find($id);

            $validated = $request->validate([
                // 'item_id' => 'sometimes|required|exists:items,id',
                'qty' => 'sometimes|required|integer|min:0',
            ]);

            $inventory = $this->repo->update($inventory, $validated);

            return response()->json([
                'success' => true,
                'data' => new InventoryResource($inventory),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * DELETE /api/inventories/{id}
     * Soft delete inventory
     */
    public function destroy($id)
    {
        try {
            $inventory = $this->repo->find($id);
            $this->repo->delete($inventory);

            return response()->json([
                'success' => true,
                'message' => 'Inventory deleted successfully.',
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
        'ids.*' => 'exists:inventories,id',
    ]);

    $this->repo->bulkDelete($validated['ids']);

    return response()->json([
        'success' => true,
        'message' => 'Selected inventories deleted successfully.',
    ]);
}
}
