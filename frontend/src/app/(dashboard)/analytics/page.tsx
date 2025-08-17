'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Crown, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import { analyticsApi } from '@/lib/api';
import { DateRange, ApiResponse, TopRestaurantsResponse } from '@/lib/types';
import { formatCurrency, getDefaultDateRange } from '@/lib/utils';
import DateRangePicker from '@/components/ui/DateRangePicker';
import { LoadingPage } from '@/components/ui/LoadingSpinner';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());

  const {
    data: topRestaurantsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['topRestaurants', dateRange],
    queryFn: async () => {
      const response = await analyticsApi.getTopRestaurants(
        dateRange.start,
        dateRange.end,
        3
      );
      return response.data as ApiResponse<any>;
    },
  });

  if (isLoading) return <LoadingPage />;

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <h2 className="text-xl font-semibold">Error loading analytics</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  // Fix: Extract the actual restaurants array from the response
  const topRestaurants = topRestaurantsData?.data?.top_restaurants || topRestaurantsData?.data || [];
  
  // Add safety check to ensure it's an array
  const restaurantsArray = Array.isArray(topRestaurants) ? topRestaurants : [];
  
  const totalRevenue = restaurantsArray.reduce((sum, r) => sum + (r.total_revenue || 0), 0);
  const totalOrders = restaurantsArray.reduce((sum, r) => sum + (r.total_orders || 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Restaurant performance insights and trends</p>
      </div>

      {/* Date Range Picker */}
      <DateRangePicker 
        dateRange={dateRange} 
        onDateRangeChange={setDateRange} 
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Revenue</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalRevenue)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Orders</div>
              <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Avg Order Value</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(avgOrderValue)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Crown className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Top Restaurants</div>
              <div className="text-2xl font-bold text-gray-900">{topRestaurants.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Restaurants */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Top 3 Restaurants by Revenue</h2>
          <p className="text-sm text-gray-600 mt-1">
            For period: {dateRange.start} to {dateRange.end}
          </p>
        </div>
        
        <div className="p-6">
          {restaurantsArray.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No data available for the selected date range
            </div>
          ) : (
            <div className="space-y-4">
              {restaurantsArray.map((restaurant, index) => (
                <div
                  key={restaurant.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      <span className="font-bold">#{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{restaurant.location}</span>
                        <span>•</span>
                        <span>{restaurant.cuisine}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(restaurant.total_revenue || 0)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {restaurant.total_orders || 0} orders • {formatCurrency(restaurant.average_order_value || 0)} avg
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Revenue Comparison Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {restaurantsArray.map((restaurant, index) => {
            const percentage = totalRevenue > 0 ? ((restaurant.total_revenue || 0) / totalRevenue) * 100 : 0;
            return (
              <div key={restaurant.id} className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{restaurant.name}</h4>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(restaurant.total_revenue || 0)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}