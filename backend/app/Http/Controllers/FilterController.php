<?php

namespace App\Http\Controllers;

use App\Services\FilterService;
use Illuminate\Http\Request;

class FilterController extends Controller
{
    private $filterService;

    public function __construct(FilterService $filterService)
    {
        $this->filterService = $filterService;
    }

    public function searchRestaurants(Request $request)
    {
        try {
            $query = $request->get('query');
            $location = $request->get('location');
            $cuisine = $request->get('cuisine');
            
            $restaurants = $this->filterService->searchRestaurants($query, $location, $cuisine);
            
            return response()->json([
                'success' => true,
                'data' => $restaurants,
                'count' => count($restaurants),
                'message' => 'Restaurants search completed'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function filterOrders(Request $request)
    {
        try {
            $startDate = $request->get('start_date');
            $endDate = $request->get('end_date');
            $restaurantId = $request->get('restaurant_id');
            $minAmount = $request->get('min_amount');
            $maxAmount = $request->get('max_amount');
            
            $orders = $this->filterService->filterOrdersByDateRange(
                $startDate, 
                $endDate, 
                $restaurantId, 
                $minAmount, 
                $maxAmount
            );
            
            return response()->json([
                'success' => true,
                'data' => $orders,
                'count' => count($orders),
                'message' => 'Orders filtered successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
}