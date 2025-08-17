<?php

namespace App\Services;

class FilterService
{
    private $dataService;

    public function __construct(DataService $dataService)
    {
        $this->dataService = $dataService;
    }

    public function searchRestaurants($query = null, $location = null, $cuisine = null)
    {
        $restaurants = $this->dataService->getRestaurants();
        
        if ($query) {
            $restaurants = array_filter($restaurants, function($restaurant) use ($query) {
                return stripos($restaurant['name'], $query) !== false ||
                       stripos($restaurant['location'], $query) !== false ||
                       stripos($restaurant['cuisine'], $query) !== false;
            });
        }
        
        if ($location) {
            $restaurants = array_filter($restaurants, function($restaurant) use ($location) {
                return stripos($restaurant['location'], $location) !== false;
            });
        }
        
        if ($cuisine) {
            $restaurants = array_filter($restaurants, function($restaurant) use ($cuisine) {
                return stripos($restaurant['cuisine'], $cuisine) !== false;
            });
        }
        
        return array_values($restaurants);
    }

    public function filterOrdersByDateRange($startDate = null, $endDate = null, $restaurantId = null, $minAmount = null, $maxAmount = null)
    {
        $orders = $this->dataService->getOrders();
        
        if ($startDate && $endDate) {
            $orders = array_filter($orders, function($order) use ($startDate, $endDate) {
                $orderDate = date('Y-m-d', strtotime($order['order_time']));
                return $orderDate >= $startDate && $orderDate <= $endDate;
            });
        }
        
        if ($restaurantId) {
            $orders = array_filter($orders, function($order) use ($restaurantId) {
                return $order['restaurant_id'] == $restaurantId;
            });
        }
        
        if ($minAmount !== null) {
            $orders = array_filter($orders, function($order) use ($minAmount) {
                return $order['order_amount'] >= $minAmount;
            });
        }
        
        if ($maxAmount !== null) {
            $orders = array_filter($orders, function($order) use ($maxAmount) {
                return $order['order_amount'] <= $maxAmount;
            });
        }
        
        return array_values($orders);
    }
}