<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\API\LoanRepository;
use App\Http\Resources\LoanResource;

class LoanController extends Controller
{
    protected $repo;

    public function __construct(LoanRepository $repo)
    {
        $this->repo = $repo;
    }

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->query('search'),
            'per_page' => $request->query('per_page', 10),
        ];
        $loans = $this->repo->all($filters);

        return response()->json([
            'success' => true,
            'data' => LoanResource::collection($loans),
        ]);
    }

    public function show($id)
    {
        $loan = $this->repo->find($id);
        return response()->json(['success' => true, 'data' => new LoanResource($loan)]);
    }

  public function store(Request $request)
{
    $validated = $request->validate([
        'lender_name' => 'required|string|max:255',
        'borrower_name' => 'required|string|max:255',
        'principal_amount' => 'required|numeric|min:0',
        'interest_rate' => 'required|numeric|min:0',
        'start_date' => 'required|date',
    ]);

    $loan = $this->repo->store($validated);

    return response()->json([
        'success' => true,
        'data' => new LoanResource($loan)
    ], 201);
}

   public function update(Request $request, $id)
{
    $loan = $this->repo->find($id);

    $validated = $request->validate([
        'lender_name' => 'sometimes|string|max:255',
        'borrower_name' => 'sometimes|string|max:255',
        'principal_amount' => 'sometimes|numeric|min:0',
        'interest_rate' => 'sometimes|numeric|min:0',
        'start_date' => 'sometimes|date',
        'status' => 'sometimes|string',
    ]);

    $updatedLoan = $this->repo->update($loan, $validated);

    return response()->json([
        'success' => true,
        'data' => new LoanResource($updatedLoan)
    ]);
}

    public function addRepayment(Request $request, $id)
    {
        $loan = $this->repo->find($id);
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
        ]);

        $repayment = $this->repo->addRepayment($loan, $validated['amount']);
        return response()->json(['success' => true, 'data' => $repayment]);
    }

    public function destroy($id)
    {
        $loan = $this->repo->find($id);
        $this->repo->delete($loan);
        return response()->json(['success' => true, 'message' => 'Loan deleted']);
    }


    public function bulkDestroy(Request $request)
{
    $validated = $request->validate([
        'ids' => 'required|array',
        'ids.*' => 'exists:loans,id'
    ]);

    $this->repo->bulkDelete($validated['ids']);

    return response()->json([
        'success' => true,
        'message' => 'Selected loans deleted successfully.'
    ]);
}
}