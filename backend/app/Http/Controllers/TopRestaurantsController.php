<?php

namespace App\Http\Controllers;

use App\Services\AnalyticsService;
use Illuminate\Http\Request;

class TopRestaurantsController extends Controller
{
    private $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function index(Request $request)
    {
        try {
            $startDate = $request->get('start_date', '2025-06-22');
            $endDate = $request->get('end_date', '2025-06-28');
            $limit = (int) $request->get('limit', 3);
            
            if ($limit < 1 || $limit > 10) {
                return response()->json([
                    'success' => false,
                    'message' => 'Limit must be between 1 and 10'
                ], 400);
            }
            
            $topRestaurants = $this->analyticsService->getTopRestaurants(
                $startDate, 
                $endDate, 
                $limit
            );
            
            return response()->json([
                'success' => true,
                'data' => [
                    'date_range' => [
                        'start_date' => $startDate,
                        'end_date' => $endDate
                    ],
                    'top_restaurants' => $topRestaurants,
                    'total_restaurants_analyzed' => 4
                ],
                'message' => 'Top restaurants retrieved successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
}