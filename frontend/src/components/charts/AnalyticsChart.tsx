import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DailyStat, HourlyBreakdown } from '@/lib/types';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';

interface DailyRevenueChartProps {
  data: DailyStat[];
}

export function DailyRevenueChart({ data }: DailyRevenueChartProps) {
  const chartData = data.map(stat => ({
    date: formatDate(stat.date),
    revenue: stat.revenue,
    orders: stat.orders_count,
    avgOrderValue: stat.average_order_value,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => formatCurrency(value)} />
          <Tooltip 
            formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
            labelStyle={{ color: '#374151' }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#3B82F6" 
            fill="#3B82F6" 
            fillOpacity={0.1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface DailyOrdersChartProps {
  data: DailyStat[];
}

export function DailyOrdersChart({ data }: DailyOrdersChartProps) {
  const chartData = data.map(stat => ({
    date: formatDate(stat.date),
    orders: stat.orders_count,
    avgOrderValue: stat.average_order_value,
    peakHour: stat.peak_hour ? formatTime(stat.peak_hour) : 'N/A',
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Orders Count</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [value, 'Orders']}
            labelStyle={{ color: '#374151' }}
          />
          <Bar dataKey="orders" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface PeakHoursChartProps {
  data: HourlyBreakdown[];
}

export function PeakHoursChart({ data }: PeakHoursChartProps) {
  const chartData = data.map(item => ({
    hour: formatTime(item.hour),
    orders: item.orders_count,
    hourNum: item.hour,
  }));

  const maxOrders = Math.max(...data.map(item => item.orders_count));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Order Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [value, 'Orders']}
            labelStyle={{ color: '#374151' }}
          />
          <Bar 
            dataKey="orders" 
            fill={(entry) => entry?.orders === maxOrders ? '#F59E0B' : '#8B5CF6'}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface AverageOrderValueChartProps {
  data: DailyStat[];
}

export function AverageOrderValueChart({ data }: AverageOrderValueChartProps) {
  const chartData = data.map(stat => ({
    date: formatDate(stat.date),
    avgOrderValue: stat.average_order_value,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Order Value Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => formatCurrency(value)} />
          <Tooltip 
            formatter={(value) => [formatCurrency(Number(value)), 'Avg Order Value']}
            labelStyle={{ color: '#374151' }}
          />
          <Line 
            type="monotone" 
            dataKey="avgOrderValue" 
            stroke="#F59E0B" 
            strokeWidth={3}
            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}