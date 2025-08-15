<?php

namespace App\Services;

class DataService
{
    public function getRestaurants()
    {
        $jsonData = file_get_contents(base_path('data/restaurants.json'));
        
        return json_decode($jsonData, true);
    }

    public function getOrders()
    {
        $jsonData = file_get_contents(base_path('data/orders.json'));
        return json_decode($jsonData, true);
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