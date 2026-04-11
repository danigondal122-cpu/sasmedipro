<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\API\ItemRepository;
use App\Models\Item;
use App\Http\Resources\ItemResource;
use Illuminate\Validation\ValidationException;

class ItemController extends Controller
{
    protected $repo;

    public function __construct(ItemRepository $repo)
    {
        $this->repo = $repo;
    }

    /**
     * GET /api/items
     * List all items with optional filters
     */
    public function index(Request $request)
    {
          $filters = $request->only([
        'search',
        // 'status',
        'page',
        'per_page'
    ]);

    $items = $this->repo->all($filters);

        return response()->json([
            'success' => true,
            'data' => ItemResource::collection($items),
             'meta' => [
            'current_page' => $items->currentPage(),
            'per_page'     => $items->perPage(),
            'total'        => $items->total(),
            'last_page'    => $items->lastPage(),
        ]
        ]);
    }

    /**
     * GET /api/items/{id}
     * Show single item
     */
    public function show($id)
    {
        try {
            $item = $this->repo->find($id);

            return response()->json([
                'success' => true,
                'data' => new ItemResource($item),
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
        'ids.*' => 'exists:items,id'
    ]);

    $this->repo->bulkDelete($validated['ids']);

    return response()->json([
        'success' => true,
        'message' => 'Selected items deleted successfully.',
    ]);
}
    /**
     * POST /api/items
     * Create new item
     */
    public function store(Request $request)
    {

    
        $validated = $request->validate([
           
            'item_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'qty' => 'required|numeric|min:0',
             'batch_number' => 'nullable|string|max:50',
        'expiry_date' => 'nullable|date',
            
            // 'status' => 'nullable|boolean',
        ]);

        $item = $this->repo->store($validated);

        return response()->json([
            'success' => true,
            'data' => new ItemResource($item),
        ], 201);
    }

    /**
     * PUT /api/items/{id}
     * Update existing item
     */
    public function update(Request $request, $id)
    {
        try {
              \Log::info('Item store request received', [
        'data' => $request->all(),
    ]);

            $item = $this->repo->find($id);

            $validated = $request->validate([
                
                'item_name' => 'sometimes|required|string|max:255',
                'price' => 'sometimes|required|numeric|min:0',
                'tax' => 'nullable|numeric|min:0',
                 'batch_number' => 'nullable|string|max:50',
        'expiry_date' => 'nullable|date',
                // 'qty'       => 'required|numeric|min:0',
                // 'status' => 'nullable|boolean',
            ]);

            $item = $this->repo->update($item, $validated);

            return response()->json([
                'success' => true,
                'data' => new ItemResource($item),
            ]);
        } catch (\Exception $e) {
            \Log::info($e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * DELETE /api/items/{id}
     * Soft delete an item
     */
    public function destroy($id)
    {
        try {
            $item = $this->repo->find($id);
            $this->repo->delete($item);

            return response()->json([
                'success' => true,
                'message' => 'Item deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }
}
