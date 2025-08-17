'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { restaurantApi } from '@/lib/api';
import { Restaurant, FilterOptions, ApiResponse } from '@/lib/types';
import SearchFilters from '@/components/ui/SearchFilters';
import { LoadingCard } from '@/components/ui/LoadingSpinner';
import RestaurantCard from '@/components/ui/RestaurantCard';

export default function RestaurantsPage() {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [page, setPage] = useState(1);
  const perPage = 8;

  const {
    data: restaurantsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['restaurants', filters, page],
    queryFn: async () => {
      if (filters.search || filters.location || filters.cuisine) {
        const response = await restaurantApi.search(
          filters.search,
          filters.location,
          filters.cuisine
        );
        return response.data as ApiResponse<Restaurant[]>;
      } else {
        const response = await restaurantApi.getAll({ page, per_page: perPage });
        return response.data as ApiResponse<Restaurant[]>;
      }
    },
  });

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurants</h1>
          <p className="text-gray-600">Browse and search restaurants</p>
        </div>
        <SearchFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClear={handleClearFilters}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <h2 className="text-xl font-semibold">Error loading restaurants</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
        <button
          onClick={() => refetch()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  const restaurants = restaurantsData?.data || [];
  const pagination = restaurantsData?.pagination;
  const isFiltered = filters.search || filters.location || filters.cuisine;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurants</h1>
        <p className="text-gray-600">
          {restaurants.length === 0 && isFiltered
            ? 'No restaurants found matching your criteria'
            : `Browse and search restaurants ${restaurants.length > 0 ? `(${restaurants.length} found)` : ''}`}
        </p>
      </div>

      <SearchFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClear={handleClearFilters}
      />

      {restaurants.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {isFiltered ? (
              <>
                <h3 className="text-lg font-medium">No restaurants found</h3>
                <p>Try adjusting your search criteria</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium">No restaurants available</h3>
                <p>Check back later for updates</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>

          {pagination && pagination.last_page > 1 && !isFiltered && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {pagination.from} to {pagination.to} of {pagination.total} restaurants
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md">
                  Page {page} of {pagination.last_page}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.last_page}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}