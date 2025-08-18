<?php

namespace App\Http\Controllers;

use App\Services\DataService;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    protected DataService $dataService;

    public function __construct(DataService $dataService)
    {
        $this->dataService = $dataService;
    }

    public function index(Request $request)
    {
        try {
            $page = (int) $request->get('page', 1);
            $perPage = min((int) $request->get('per_page', 10), 50);
            $sortBy = $request->get('sort_by', 'name'); // name, total_revenue, total_orders, average_order_value
            $sortOrder = $request->get('sort_order', 'asc'); // asc, desc
            
            if ($request->has('page') || $request->has('per_page')) {
                $result = $this->dataService->getRestaurantsPaginated($page, $perPage);
                
                // Add analytics to each restaurant
                $result['data'] = array_map([$this, 'addAnalyticsToRestaurant'], $result['data']);
                
                // Sort restaurants
                $result['data'] = $this->sortRestaurants($result['data'], $sortBy, $sortOrder);
                
                return response()->json([
                    'success' => true,
                    'data' => $result['data'],
                    'pagination' => [
                        'current_page' => $result['current_page'],
                        'per_page' => $result['per_page'],
                        'total' => $result['total'],
                        'last_page' => $result['last_page']
                    ],
                    'message' => 'Restaurants retrieved successfully'
                ]);
            }
            
            $restaurants = $this->dataService->getRestaurants();
            
            // Add analytics to each restaurant
            $restaurants = array_map([$this, 'addAnalyticsToRestaurant'], $restaurants);
            
            // Sort restaurants
            $restaurants = $this->sortRestaurants($restaurants, $sortBy, $sortOrder);
            
            return response()->json([
                'success' => true,
                'data' => $restaurants,
                'message' => 'Restaurants retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(int $id)
    {
        try {
            $restaurant = $this->dataService->findRestaurant($id);
            
            if (!$restaurant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Restaurant not found'
                ], 404);
            }

            // Add analytics to restaurant
            $restaurant = $this->addAnalyticsToRestaurant($restaurant);

            return response()->json([
                'success' => true,
                'data' => $restaurant,
                'message' => 'Restaurant retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    private function addAnalyticsToRestaurant($restaurant)
    {
        $orders = $this->dataService->getOrders();
        
        // Filter orders for this restaurant
        $restaurantOrders = array_filter($orders, function($order) use ($restaurant) {
            return $order['restaurant_id'] == $restaurant['id'];
        });

        $totalOrders = count($restaurantOrders);
        $totalRevenue = array_sum(array_column($restaurantOrders, 'order_amount'));
        $averageOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0;

        return array_merge($restaurant, [
            'total_orders' => $totalOrders,
            'total_revenue' => $totalRevenue,
            'average_order_value' => $averageOrderValue,
        ]);
    }

    private function sortRestaurants($restaurants, $sortBy, $sortOrder)
    {
        usort($restaurants, function($a, $b) use ($sortBy, $sortOrder) {
            $comparison = 0;
            
            switch ($sortBy) {
                case 'total_revenue':
                    $comparison = $a['total_revenue'] <=> $b['total_revenue'];
                    break;
                case 'total_orders':
                    $comparison = $a['total_orders'] <=> $b['total_orders'];
                    break;
                case 'average_order_value':
                    $comparison = $a['average_order_value'] <=> $b['average_order_value'];
                    break;
                case 'location':
                    $comparison = strcmp($a['location'], $b['location']);
                    break;
                case 'cuisine':
                    $comparison = strcmp($a['cuisine'], $b['cuisine']);
                    break;
                case 'name':
                default:
                    $comparison = strcmp($a['name'], $b['name']);
                    break;
            }
            
            return $sortOrder === 'desc' ? -$comparison : $comparison;
        });
        
        return $restaurants;
    }
}