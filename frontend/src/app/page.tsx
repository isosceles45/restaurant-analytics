import Link from 'next/link';
import { BarChart3, Store, TrendingUp, Users } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Store,
      title: 'Restaurant Management',
      description: 'Browse, search, and filter restaurants by location, cuisine, and more.',
      href: '/restaurants',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'View comprehensive analytics and insights for top-performing restaurants.',
      href: '/analytics',
    },
    {
      icon: TrendingUp,
      title: 'Order Trends',
      description: 'Track daily orders, revenue trends, and peak dining hours.',
      href: '/restaurants',
    },
    {
      icon: Users,
      title: 'Performance Insights',
      description: 'Compare restaurant performance and identify growth opportunities.',
      href: '/analytics',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Restaurant Analytics
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/restaurants"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Restaurants
              </Link>
              <Link
                href="/analytics"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Analytics
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">
            Get Powerfull Insights
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to analyze restaurant performance and trends
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Platform Overview
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Real insights from our restaurant analytics platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">4</div>
              <div className="text-sm text-gray-600 mt-1">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">200+</div>
              <div className="text-sm text-gray-600 mt-1">Orders Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">7</div>
              <div className="text-sm text-gray-600 mt-1">Days of Data</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-600 mt-1">Real-time Insights</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 Restaurant Analytics Dashboard. Built with Laravel & Next.js.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}