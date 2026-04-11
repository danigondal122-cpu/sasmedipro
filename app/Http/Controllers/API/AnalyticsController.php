<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\API\AnalyticsRepository;

class AnalyticsController extends Controller
{
    protected $repo;

    public function __construct(AnalyticsRepository $repo)
    {
        $this->repo = $repo;
    }

    // Total revenue, cost, profit
    public function totals()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'revenue' => $this->repo->totalRevenue(),
                'cost' => $this->repo->totalCost(),
                'profit' => $this->repo->totalProfit(),
            ]
        ]);
    }


 

    // Profit/loss reports (weekly/monthly/daily)
    public function reports(Request $request)
    {
        $month = $request->query('month'); // optional
        return response()->json([
            'success' => true,
            'data' => $this->repo->profitReport($month)
        ]);
    }
}