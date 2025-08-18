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
            $startHour = $request->get('start_hour');
            $endHour = $request->get('end_hour');
            $page = (int) $request->get('page', 1);
            $perPage = min((int) $request->get('per_page', 20), 100);
            
            // Validate hour range
            if ($startHour !== null && $endHour !== null) {
                $startHour = (int) $startHour;
                $endHour = (int) $endHour;
                
                if ($startHour < 0 || $startHour > 23 || $endHour < 0 || $endHour > 23) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Hour values must be between 0 and 23'
                    ], 400);
                }
                
                if ($startHour > $endHour) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Start hour must be less than or equal to end hour'
                    ], 400);
                }
            }
            
            $orders = $this->filterService->filterOrdersByDateRange(
                $startDate, 
                $endDate, 
                $restaurantId, 
                $minAmount, 
                $maxAmount,
                $startHour,
                $endHour
            );
            
            $total = count($orders);
            $offset = ($page - 1) * $perPage;
            $paginatedOrders = array_slice($orders, $offset, $perPage);
            
            return response()->json([
                'success' => true,
                'data' => $paginatedOrders,
                'pagination' => [
                    'current_page' => $page,
                    'per_page' => $perPage,
                    'total' => $total,
                    'last_page' => ceil($total / $perPage)
                ],
                'filters_applied' => [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'restaurant_id' => $restaurantId,
                    'min_amount' => $minAmount,
                    'max_amount' => $maxAmount,
                    'start_hour' => $startHour,
                    'end_hour' => $endHour
                ],
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