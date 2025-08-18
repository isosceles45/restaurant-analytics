'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { restaurantApi } from '@/lib/api';
import { Restaurant, RestaurantAnalytics, ApiResponse, DateRange } from '@/lib/types';
import { formatCurrency, getDefaultDateRange } from '@/lib/utils';
import DateRangePicker from '@/components/ui/DateRangePicker';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { AverageOrderValueChart, DailyOrdersChart, DailyRevenueChart, PeakHoursChart } from '@/components/charts/AnalyticsChart';
import { useParams } from 'next/navigation';


export default function RestaurantDetailPage() {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const { id } = useParams<{ id: string }>();
  const restaurantId = parseInt(id);

  const {
    data: restaurantData,
    isLoading: isLoadingRestaurant,
  } = useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: async () => {
      const response = await restaurantApi.getById(restaurantId);
      return response.data as ApiResponse<Restaurant>;
    },
  });

  const {
    data: analyticsData,
    isLoading: isLoadingAnalytics,
  } = useQuery({
    queryKey: ['restaurantAnalytics', restaurantId, dateRange],
    queryFn: async () => {
      const response = await restaurantApi.getAnalytics(
        restaurantId,
        dateRange.start,
        dateRange.end
      );
      return response.data as ApiResponse<RestaurantAnalytics>;
    },
  });

  if (isLoadingRestaurant) return <LoadingPage />;

  if (!restaurantData?.data) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <h2 className="text-xl font-semibold">Restaurant not found</h2>
          <Link href="/restaurants" className="text-blue-600 hover:underline">
            Back to restaurants
          </Link>
        </div>
      </div>
    );
  }

  const restaurant = restaurantData.data;
  const analytics = analyticsData?.data;

  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <Link
        href="/restaurants"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Restaurants
      </Link>

      {/* Restaurant Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {restaurant.location}
              </div>
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                {restaurant.cuisine}
              </div>
            </div>
          </div>
          
          {restaurant.total_orders !== undefined && (
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {restaurant.total_orders}
                </div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(restaurant.total_revenue || 0)}
                </div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(restaurant.average_order_value || 0)}
                </div>
                <div className="text-sm text-gray-600">Avg Order Value</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Date Range Picker */}
      <DateRangePicker 
        dateRange={dateRange} 
        onDateRangeChange={setDateRange} 
      />

      {/* Analytics Loading */}
      {isLoadingAnalytics && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      )}

      {/* Analytics Dashboard */}
      {analytics && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Period Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders:</span>
                  <span className="font-semibold">{analytics.summary.total_orders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue:</span>
                  <span className="font-semibold">{formatCurrency(analytics.summary.total_revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Order Value:</span>
                  <span className="font-semibold">{formatCurrency(analytics.summary.average_order_value)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Peak Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Peak Hour:</span>
                  <span className="font-semibold">
                    {analytics.hourly_distribution.peak_hour}:00
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Peak Hour Orders:</span>
                  <span className="font-semibold">
                    {analytics.hourly_distribution.peak_hour_orders}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Busiest Day:</span>
                  <span className="font-semibold">
                    {analytics.daily_stats.reduce((max, day) => 
                      day.orders_count > max.orders_count ? day : max
                    ).date}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Averages</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Orders/Day:</span>
                  <span className="font-semibold">
                    {Math.round(analytics.summary.total_orders / analytics.daily_stats.length)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Revenue/Day:</span>
                  <span className="font-semibold">
                    {formatCurrency(analytics.summary.total_revenue / analytics.daily_stats.length)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Days:</span>
                  <span className="font-semibold">{analytics.daily_stats.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DailyRevenueChart data={analytics.daily_stats} />
            <DailyOrdersChart data={analytics.daily_stats} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AverageOrderValueChart data={analytics.daily_stats} />
            <PeakHoursChart data={analytics.hourly_distribution.hourly_breakdown} />
          </div>
        </>
      )}

      {/* No Data Message */}
      {!isLoadingAnalytics && !analytics && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center text-gray-500">
            <h3 className="text-lg font-medium mb-2">No analytics data available</h3>
            <p>Try selecting a different date range</p>
          </div>
        </div>
      )}
    </div>
  );
}