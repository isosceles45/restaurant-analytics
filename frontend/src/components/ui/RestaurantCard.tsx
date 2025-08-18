import Link from 'next/link';
import { MapPin, Tag, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { Restaurant } from '@/lib/types';
import { formatCurrency, getDefaultDateRange } from '@/lib/utils';
import { restaurantApi } from '@/lib/api';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  // Calculate useful metrics for comparison
  const avgOrdersPerDay = restaurant.total_orders ? Math.round(restaurant.total_orders / 7) : null;
  const revenuePerOrder = restaurant.total_revenue && restaurant.total_orders 
    ? restaurant.total_revenue / restaurant.total_orders 
    : restaurant.average_order_value || 0;

  // Fetch real analytics data for the mini chart
  const { start, end } = getDefaultDateRange();
  const { data: analyticsData } = useQuery({
    queryKey: ['restaurantAnalytics', restaurant.id, start, end],
    queryFn: async () => {
      const response = await restaurantApi.getAnalytics(restaurant.id, start, end);
      return response.data;
    },
    enabled: !!restaurant.total_orders, // Only fetch if we have order data
  });

  // Create chart data from real API data
  const chartData = analyticsData?.data?.daily_stats?.map(stat => ({
    date: new Date(stat.date).toLocaleDateString('en', { weekday: 'short' }),
    orders: stat.orders_count,
    revenue: stat.revenue,
  })) || null;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Header Section - Fixed Height */}
        <div className="flex items-start justify-between mb-4 min-h-[48px]">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight pr-4">
            {restaurant.name}
          </h3>
          <div className="flex items-center text-sm text-gray-500 whitespace-nowrap">
            <Tag className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{restaurant.cuisine}</span>
          </div>
        </div>
        
        {/* Location Section - Fixed Height */}
        <div className="flex items-center text-sm text-gray-600 mb-4 min-h-[20px]">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{restaurant.location}</span>
        </div>

        {/* Real Analytics Data - If available */}
        {restaurant.total_orders !== undefined && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-700">
                {restaurant.total_orders}
              </div>
              <div className="text-xs text-blue-600">Total Orders</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-700">
                {formatCurrency(revenuePerOrder)}
              </div>
              <div className="text-xs text-green-600">Avg Value</div>
            </div>
          </div>
        )}

        {/* Real Daily Trend Chart from API */}
        {chartData && chartData.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-700 mb-2">Daily Order Trend</div>
            <div className="h-16 bg-gray-50 rounded-lg p-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6B7280' }}
                  />
                  <YAxis hide />
                  <Bar 
                    dataKey="orders" 
                    fill="#3B82F6" 
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Performance Indicators */}
        <div className="flex items-center justify-between mb-4">
          {avgOrdersPerDay && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1 text-blue-500" />
              <span>{avgOrdersPerDay} orders/day</span>
            </div>
          )}
          {restaurant.total_revenue && (
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              <span className="font-medium text-green-700">
                {formatCurrency(restaurant.total_revenue)}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons - Fixed Layout */}
        <div className="flex gap-3">
          <Link
            href={`/restaurants/${restaurant.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg text-center transition-colors duration-200 min-h-[40px] flex items-center justify-center"
          >
            View Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}