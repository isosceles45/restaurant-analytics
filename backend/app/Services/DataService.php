<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class DataService
{
    public function getRestaurants()
    {
        return Cache::remember('restaurants', 3600, function () {
            $filePath = base_path('data/restaurants.json');
            $jsonContent = file_get_contents($filePath);
            return json_decode($jsonContent, true);
        });
    }

    public function getOrders()
    {
        return Cache::remember('orders', 3600, function () {
            $filePath = base_path('data/orders.json');
            $jsonContent = file_get_contents($filePath);
            return json_decode($jsonContent, true);
        });
    }

    public function getRestaurantsPaginated($page = 1, $perPage = 10)
    {
        $restaurants = $this->getRestaurants();
        $total = count($restaurants);
        $offset = ($page - 1) * $perPage;
        
        return [
            'data' => array_slice($restaurants, $offset, $perPage),
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => $total,
            'last_page' => ceil($total / $perPage)
        ];
    }

    public function findRestaurant($id)
    {
        $restaurants = $this->getRestaurants();
        
        foreach ($restaurants as $restaurant) {
            if ($restaurant['id'] == $id) {
                return $restaurant;
            }
        }
        
        return null;
    }
}