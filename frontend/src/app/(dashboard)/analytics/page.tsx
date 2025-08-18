"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Crown, TrendingUp, DollarSign, ShoppingCart, Activity, BarChart3, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { analyticsApi, ordersApi, restaurantApi } from '@/lib/api';
import { DateRange, ApiResponse } from '@/lib/types';
import { formatCurrency, getDefaultDateRange } from '@/lib/utils';
import DateRangePicker from '@/components/ui/DateRangePicker';
import { LoadingPage } from '@/components/ui/LoadingSpinner';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());

  const { data: topRestaurantsData, isLoading, error } = useQuery({
    queryKey: ['topRestaurants', dateRange],
    queryFn: async () => {
      const response = await analyticsApi.getTopRestaurants(dateRange.start, dateRange.end, 3);
      return response.data as ApiResponse<any>;
    },
  });

  // Get all restaurants for ranking
  const { data: allRestaurantsData } = useQuery({
    queryKey: ['allRestaurants'],
    queryFn: async () => {
      const response = await restaurantApi.getAll({ sort_by: 'total_revenue', sort_order: 'desc' });
      return response.data;
    },
  });

  const { data: orderTrendsData } = useQuery({
    queryKey: ['orderTrends', dateRange],
    queryFn: async () => {
      const response = await ordersApi.filter({
        start_date: dateRange.start,
        end_date: dateRange.end,
        per_page: 1000,
      });
      return response.data;
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

  const topRestaurants = topRestaurantsData?.data?.top_restaurants || topRestaurantsData?.data || [];
  const restaurantsArray = Array.isArray(topRestaurants) ? topRestaurants : [];
  
  // All restaurants ranked by revenue
  const allRestaurants = allRestaurantsData?.data || [];
  const allRestaurantsArray = Array.isArray(allRestaurants) ? allRestaurants : [];
  
  const totalRevenue = restaurantsArray.reduce((sum: number, r: any) => sum + (r.total_revenue || 0), 0);
  const totalOrders = restaurantsArray.reduce((sum: number, r: any) => sum + (r.total_orders || 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Process order trends data
  const orders = orderTrendsData?.data || [];
  const dailyTrends = orders.reduce((acc: { [key: string]: { date: string, orders: number, revenue: number } }, order: any) => {
    const date = new Date(order.order_time).toLocaleDateString();
    if (!acc[date]) acc[date] = { date, orders: 0, revenue: 0 };
    acc[date].orders += 1;
    acc[date].revenue += order.order_amount;
    return acc;
  }, {});

  const dailyTrendsArray = Object.values(dailyTrends).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const hourlyData = Array.from({ length: 24 }, (_, hour) => ({ hour: `${hour.toString().padStart(2, '0')}:00`, orders: 0 }));
  orders.forEach((order: any) => {
    const hour = new Date(order.order_time).getHours();
    hourlyData[hour].orders += 1;
  });

  // Prepare pie chart data
  const pieChartData = restaurantsArray.slice(0, 5).map((restaurant: any, index: number) => ({
    name: restaurant.name,
    value: restaurant.total_revenue || 0,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Restaurant performance insights and trends</p>
      </div>

      <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Revenue</div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</div>
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
              <div className="text-2xl font-bold text-gray-900">{totalOrders.toLocaleString()}</div>
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
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(avgOrderValue)}</div>
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
              <div className="text-2xl font-bold text-gray-900">{restaurantsArray.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
            <Activity className="w-6 h-6 mr-2 text-blue-600" />
            Daily Revenue Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrendsArray}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
            <BarChart3 className="w-6 h-6 mr-2 text-purple-600" />
            Hourly Order Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip formatter={(value: number) => [value, 'Orders']} />
                <Bar dataKey="orders" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
            <PieChart className="w-6 h-6 mr-2 text-green-600" />
            Revenue Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieChartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {pieChartData.slice(0, 3).map((entry: any, index: number) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
                  <span className="text-gray-700">{entry.name}</span>
                </div>
                <span className="font-medium text-gray-900">
                  {totalRevenue > 0 ? ((entry.value / totalRevenue) * 100).toFixed(1) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Restaurants & All Restaurants Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Top 3 Restaurants by Revenue</h2>
            <p className="text-sm text-gray-600 mt-1">For period: {dateRange.start} to {dateRange.end}</p>
          </div>
          
          <div className="p-6">
            {restaurantsArray.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No data available for the selected date range</div>
            ) : (
              <div className="space-y-4">
                {restaurantsArray.map((restaurant: any, index: number) => (
                  <div key={restaurant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
                      <div className="text-lg font-bold text-gray-900">{formatCurrency(restaurant.total_revenue || 0)}</div>
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Restaurants by Revenue</h2>
            <p className="text-sm text-gray-600 mt-1">Complete ranking across all restaurants</p>
          </div>
          
          <div className="p-6 max-h-96 overflow-y-auto">
            {allRestaurantsArray.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No restaurants data available</div>
            ) : (
              <div className="space-y-3">
                {allRestaurantsArray.map((restaurant: any, index: number) => (
                  <div key={restaurant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700">
                        <span className="font-bold text-sm">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{restaurant.name}</h4>
                        <div className="text-xs text-gray-500">{restaurant.location} • {restaurant.cuisine}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{formatCurrency(restaurant.total_revenue || 0)}</div>
                      <div className="text-xs text-gray-600">{restaurant.total_orders || 0} orders</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Comparison */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {restaurantsArray.map((restaurant: any, index: number) => {
            const percentage = totalRevenue > 0 ? ((restaurant.total_revenue || 0) / totalRevenue) * 100 : 0;
            return (
              <div key={restaurant.id} className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{restaurant.name}</h4>
                <div className="text-2xl font-bold text-blue-600 mb-1">{percentage.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">{formatCurrency(restaurant.total_revenue || 0)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}