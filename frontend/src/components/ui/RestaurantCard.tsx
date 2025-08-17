import Link from 'next/link';
import { MapPin, Tag, BarChart3 } from 'lucide-react';
import { Restaurant } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {restaurant.name}
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <Tag className="w-4 h-4 mr-1" />
            {restaurant.cuisine}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          {restaurant.location}
        </div>

        {restaurant.total_orders !== undefined && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="text-xl font-bold text-blue-700">
                {restaurant.total_orders}
              </div>
              <div className="text-xs text-blue-600">Total Orders</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="text-xl font-bold text-green-700">
                {formatCurrency(restaurant.total_revenue || 0)}
              </div>
              <div className="text-xs text-green-600">Revenue</div>
            </div>
          </div>
        )}

        {restaurant.average_order_value !== undefined && (
          <div className="text-center p-2 bg-purple-50 rounded mb-4">
            <div className="text-lg font-semibold text-purple-700">
              {formatCurrency(restaurant.average_order_value)}
            </div>
            <div className="text-xs text-purple-600">Avg Order Value</div>
          </div>
        )}

        <div className="flex space-x-3">
          <Link
            href={`/restaurants/${restaurant.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md text-center transition-colors duration-200"
          >
            View Details
          </Link>
          <Link
            href={`/restaurants/${restaurant.id}/analytics`}
            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            <BarChart3 className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}