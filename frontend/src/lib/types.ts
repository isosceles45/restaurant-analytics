export interface Restaurant {
  id: number;
  name: string;
  location: string;
  cuisine: string;
  total_orders?: number;
  total_revenue?: number;
  average_order_value?: number;
}

export interface Order {
  id: number;
  restaurant_id: number;
  order_amount: number;
  order_time: string;
  order_date?: string;
  order_hour?: number;
}

export interface DailyStat {
  date: string;
  orders_count: number;
  revenue: number;
  average_order_value: number;
  peak_hour?: number;
}

export interface HourlyBreakdown {
  hour: number;
  orders_count: number;
}

export interface HourlyDistribution {
  hourly_breakdown: HourlyBreakdown[];
  peak_hour: number;
  peak_hour_orders: number;
}

export interface AnalyticsSummary {
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
}

export interface RestaurantAnalytics {
  restaurant_id: number;
  date_range: {
    start_date: string;
    end_date: string;
  };
  daily_stats: DailyStat[];
  hourly_distribution: HourlyDistribution;
  summary: AnalyticsSummary;
}

export interface TopRestaurantsResponse {
  date_range: {
    start_date: string;
    end_date: string;
  };
  top_restaurants: Restaurant[];
  total_restaurants_analyzed: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  count?: number;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface FilterOptions {
  search?: string;
  location?: string;
  cuisine?: string;
  dateRange?: DateRange;
  amountRange?: {
    min?: number;
    max?: number;
  };
}

export interface FilterOptions {
  search?: string;
  location?: string;
  cuisine?: string;
  startDate?: string;
  endDate?: string;
  startHour?: string;
  endHour?: string;
  minAmount?: string;
  maxAmount?: string;
  sortBy?: 'name' | 'total_revenue' | 'total_orders' | 'average_order_value' | 'location' | 'cuisine';
  sortOrder?: 'asc' | 'desc';
}