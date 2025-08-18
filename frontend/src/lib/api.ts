import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const restaurantApi = {
  getAll: (params?: { 
    page?: number; 
    per_page?: number; 
    sort_by?: string; 
    sort_order?: string; 
  }) => 
    api.get('/restaurants', { params }),
  
  getById: (id: number) => 
    api.get(`/restaurants/${id}`),
  
  getAnalytics: (id: number, startDate: string, endDate: string) => 
    api.get(`/restaurants/${id}/analytics`, {
      params: { start_date: startDate, end_date: endDate }
    }),
  
  search: (query?: string, location?: string, cuisine?: string) => 
    api.get('/search/restaurants', {
      params: { query, location, cuisine }
    })
};

export const analyticsApi = {
  getTopRestaurants: (startDate: string, endDate: string, limit: number = 3) =>
    api.get('/top-restaurants', {
      params: { start_date: startDate, end_date: endDate, limit }
    })
};

export const ordersApi = {
  filter: (params: {
    start_date?: string;
    end_date?: string;
    restaurant_id?: number;
    min_amount?: number;
    max_amount?: number;
    start_hour?: number;
    end_hour?: number;
    page?: number;
    per_page?: number;
  }) => api.get('/filter/orders', { params })
};