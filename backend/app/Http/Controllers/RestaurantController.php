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
            
            if ($request->has('page') || $request->has('per_page')) {
                $result = $this->dataService->getRestaurantsPaginated($page, $perPage);
                
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
}