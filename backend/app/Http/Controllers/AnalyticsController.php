<?php

namespace App\Http\Controllers;

use App\Services\AnalyticsService;
use App\Services\DataService;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    private $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function getRestaurantAnalytics(Request $request, $restaurantId)
    {
        try {
            $startDate = $request->get('start_date', '2025-06-22');
            $endDate = $request->get('end_date', '2025-06-28');
            
            $dataService = app(DataService::class);
            $restaurant = $dataService->findRestaurant($restaurantId);
            
            if (!$restaurant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Restaurant not found'
                ], 404);
            }
            
            $analytics = $this->analyticsService->getRestaurantAnalytics(
                $restaurantId, 
                $startDate, 
                $endDate
            );
            
            return response()->json([
                'success' => true,
                'data' => $analytics,
                'message' => 'Restaurant analytics retrieved successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
}