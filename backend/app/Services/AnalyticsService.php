<?php

namespace App\Services;

class AnalyticsService
{
    private $dataService;

    public function __construct(DataService $dataService)
    {
        $this->dataService = $dataService;
    }

    public function getRestaurantAnalytics($restaurantId, $startDate, $endDate)
    {
        $allOrders = $this->dataService->getOrders();
        
        $orders = array_filter($allOrders, function($order) use ($restaurantId, $startDate, $endDate) {
            $orderDate = date('Y-m-d', strtotime($order['order_time']));
            return $order['restaurant_id'] == $restaurantId && 
                   $orderDate >= $startDate && 
                   $orderDate <= $endDate;
        });

        $dailyStats = $this->calculateDailyStats($orders);
        
        $hourlyStats = $this->calculateHourlyStats($orders);
        
        $summary = $this->calculateSummary($orders);

        return [
            'restaurant_id' => $restaurantId,
            'date_range' => [
                'start_date' => $startDate,
                'end_date' => $endDate
            ],
            'daily_stats' => $dailyStats,
            'hourly_distribution' => $hourlyStats,
            'summary' => $summary
        ];
    }

    private function calculateDailyStats($orders)
    {
        $dailyData = [];
        
        foreach ($orders as $order) {
            $date = date('Y-m-d', strtotime($order['order_time']));
            
            if (!isset($dailyData[$date])) {
                $dailyData[$date] = [
                    'date' => $date,
                    'orders_count' => 0,
                    'revenue' => 0,
                    'orders' => []
                ];
            }
            
            $dailyData[$date]['orders_count']++;
            $dailyData[$date]['revenue'] += $order['order_amount'];
            $dailyData[$date]['orders'][] = $order;
        }
        
        foreach ($dailyData as $date => &$dayData) {
            $dayData['average_order_value'] = $dayData['orders_count'] > 0 
                ? round($dayData['revenue'] / $dayData['orders_count'], 2)
                : 0;
            
            unset($dayData['orders']);
        }
        
        ksort($dailyData);
        
        return array_values($dailyData);
    }

    private function calculateHourlyStats($orders)
    {
        $hourlyData = [];
        
        for ($hour = 0; $hour < 24; $hour++) {
            $hourlyData[$hour] = 0;
        }
        
        foreach ($orders as $order) {
            $hour = (int) date('H', strtotime($order['order_time']));
            $hourlyData[$hour]++;
        }
        
        $hourlyStats = [];
        $peakHour = 0;
        $maxOrders = 0;
        
        foreach ($hourlyData as $hour => $count) {
            $hourlyStats[] = [
                'hour' => $hour,
                'orders_count' => $count
            ];
            
            if ($count > $maxOrders) {
                $maxOrders = $count;
                $peakHour = $hour;
            }
        }
        
        return [
            'hourly_breakdown' => $hourlyStats,
            'peak_hour' => $peakHour,
            'peak_hour_orders' => $maxOrders
        ];
    }

    private function calculateSummary($orders)
    {
        $totalOrders = count($orders);
        $totalRevenue = array_sum(array_column($orders, 'order_amount'));
        $averageOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0;
        
        return [
            'total_orders' => $totalOrders,
            'total_revenue' => $totalRevenue,
            'average_order_value' => $averageOrderValue
        ];
    }

    public function getTopRestaurants($startDate, $endDate, $limit = 3)
    {
        $restaurants = $this->dataService->getRestaurants();
        $allOrders = $this->dataService->getOrders();
        
        $ordersInRange = array_filter($allOrders, function($order) use ($startDate, $endDate) {
            $orderDate = date('Y-m-d', strtotime($order['order_time']));
            return $orderDate >= $startDate && $orderDate <= $endDate;
        });
        
        $restaurantStats = [];
        
        foreach ($restaurants as $restaurant) {
            $restaurantId = $restaurant['id'];
            
            $restaurantOrders = array_filter($ordersInRange, function($order) use ($restaurantId) {
                return $order['restaurant_id'] == $restaurantId;
            });
            
            $totalOrders = count($restaurantOrders);
            $totalRevenue = array_sum(array_column($restaurantOrders, 'order_amount'));
            $averageOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0;
            
            $restaurantStats[] = [
                'id' => $restaurant['id'],
                'name' => $restaurant['name'],
                'location' => $restaurant['location'],
                'cuisine' => $restaurant['cuisine'],
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrders,
                'average_order_value' => $averageOrderValue
            ];
        }
        
        usort($restaurantStats, function($a, $b) {
            return $b['total_revenue'] <=> $a['total_revenue'];
        });
        
        $topRestaurants = array_slice($restaurantStats, 0, $limit);
        
        return [
            'date_range' => [
                'start_date' => $startDate,
                'end_date' => $endDate
            ],
            'top_restaurants' => $topRestaurants,
            'total_restaurants_analyzed' => count($restaurants)
        ];
    }
}