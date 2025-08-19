# Restaurant Analytics Dashboard

Full-stack analytics dashboard built with **Laravel/PHP** backend and **Next.js/React** frontend for restaurant performance tracking and order analysis.

**Live Demo:** [https://restaurant-analytics-seven.vercel.app/](https://restaurant-analytics-seven.vercel.app/)

## Features

- **Restaurant Management** - Search, filter, sort restaurants by location, cuisine, revenue  
- **Order Trends Analysis** - Daily orders, revenue, average order value, peak hours  
- **Top 3 Restaurants** by revenue for any date range  
- **Advanced Filtering** - Date range, amount range, hour range, restaurant-specific  
- **Interactive Charts** - Revenue trends, hourly distribution, market share  
- **Responsive Design** - Mobile-friendly with smooth animations  
- **Performance Optimized** - Caching, pagination, efficient data processing  

## Tech Stack

**Backend:** Laravel, PHP, Caching, Service Architecture  
**Frontend:** Next.js, TypeScript, Tailwind CSS, React Query, Recharts  
**Deployment:** Backend on Railway, Frontend on Vercel  

## Quick Setup

### Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Place restaurants.json & orders.json in /data folder
php artisan serve  # http://localhost:8000
```

### Frontend (Next.js)
```bash
cd frontend
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm run dev  # http://localhost:3000
```

## Key APIs

```http
GET /api/restaurants                    # List with pagination & sorting
GET /api/restaurants/{id}/analytics     # Individual restaurant trends
GET /api/top-restaurants               # Top 3 by revenue
GET /api/filter/orders                 # Advanced order filtering
GET /api/search/restaurants            # Search & filter restaurants
```

## Assignment Requirements Met

- **Restaurant List** with search/sort/filter  
- **Individual Restaurant Analytics** - Daily orders, revenue, AOV, peak hours  
- **Top 3 Restaurants** by revenue  
- **All Filters** - Restaurant, date range, amount range, hour range  
- **Efficient Data Handling** - Caching, pagination, aggregation  
- **Interactive Dashboard** - Charts, responsive design, real-time updates  

## Enhanced Features

- **15-minute caching** for analytics performance
- **Real-time charts** with Recharts integration
- **Multi-criteria filtering** with visual indicators
- **Complete restaurant ranking** system
- **Mobile-responsive** design with touch controls
- **Loading states** and error handling

## Data Source

Uses provided JSON files:
- `restaurants.json` - 4 restaurants data
- `orders.json` - 200+ orders over 7 days

---

**Built for Kitchen Spurs Technical Assessment**
