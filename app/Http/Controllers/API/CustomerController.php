<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\API\CustomerRepository;
use App\Http\Resources\CustomerResource;

class CustomerController extends Controller
{
    protected $repo;

    public function __construct(CustomerRepository $repo)
    {
        $this->repo = $repo;
    }

    /**
     * GET /api/customers
     */
    public function index(Request $request)
    {
        $filters = $request->only([
            'search',
            'page',
            'per_page',
            'role'
        ]);

        $customers = $this->repo->all($filters);

        return response()->json([
            'success' => true,
            'data' => CustomerResource::collection($customers),
            'meta' => [
                'current_page' => $customers->currentPage(),
                'per_page'     => $customers->perPage(),
                'total'        => $customers->total(),
                'last_page'    => $customers->lastPage(),
            ]
        ]);
    }

    /**
     * GET /api/customers/{id}
     */
    public function show($id)
    {
        try {
            $customer = $this->repo->find($id);

            return response()->json([
                'success' => true,
                'data' => new CustomerResource($customer),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * POST /api/customers
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone'   => 'nullable|string|max:20',
            'email'   => 'nullable|email|max:255',
            'mobile'  => 'nullable|string|max:20',
            'vat'     => 'nullable|string|max:50',
            'brn'     => 'nullable|string|max:50',
             'role'    => 'required|in:customer,seller',
        ]);

        $customer = $this->repo->store($validated);

        return response()->json([
            'success' => true,
            'message' => 'Customer created successfully',
            'data' => new CustomerResource($customer),
        ], 201);
    }

    /**
     * PUT /api/customers/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $customer = $this->repo->find($id);

            $validated = $request->validate([
                'name'    => 'sometimes|required|string|max:255',
                'address' => 'nullable|string|max:255',
                'phone'   => 'nullable|string|max:20',
                'email'   => 'nullable|email|max:255',
                'mobile'  => 'nullable|string|max:20',
                'vat'     => 'nullable|string|max:50',
                'brn'     => 'nullable|string|max:50',
            ]);

            $customer = $this->repo->update($customer, $validated);

            return response()->json([
                'success' => true,
                'data' => new CustomerResource($customer),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * DELETE /api/customers/{id}
     */
    public function destroy($id)
    {
        try {
            $customer = $this->repo->find($id);
            $this->repo->delete($customer);

            return response()->json([
                'success' => true,
                'message' => 'Customer deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }
}
