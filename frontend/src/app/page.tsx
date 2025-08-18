import Link from 'next/link';
import { BarChart3, Store, TrendingUp, Users, Clock, ArrowRight, ShoppingCart, Filter } from 'lucide-react';

export default function HomePage() {

  const features = [
    {
      icon: Store,
      title: 'Restaurant Management',
      description: 'Browse, search, and filter restaurants by location, cuisine, and ratings with advanced filtering capabilities.',
      href: '/restaurants',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics and insights with real-time data visualization for performance tracking.',
      href: '/analytics',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
    },
    {
      icon: ShoppingCart,
      title: 'Order Analytics',
      description: 'Filter and analyze orders by date range, restaurant, amount, and hour range with advanced filtering tools.',
      href: '/orders',
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600',
    }
  ];

  const stats = [
    { number: '4', label: 'Active Restaurants', color: 'text-blue-600', icon: Store },
    { number: '200+', label: 'Orders Analyzed', color: 'text-green-600', icon: TrendingUp },
    { number: '7', label: 'Days of Data', color: 'text-purple-600', icon: Clock },
    { number: '24/7', label: 'Real-time Monitoring', color: 'text-orange-600', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl pb-2 font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
              Restaurant Analytics
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Analyze order trends, track revenue patterns, and discover peak dining hours across 4 restaurants with 200+ orders analyzed. 
              Filter orders by date, amount, hour range, and restaurant to make data-driven decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/analytics"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
              >
                <span>View Analytics</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/restaurants"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              >
                Browse Restaurants
              </Link>
              <Link
                href="/orders"
                className="border-2 border-indigo-300 text-indigo-700 px-8 py-4 rounded-xl font-semibold hover:border-indigo-500 hover:text-indigo-800 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              >
                Filter Orders
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful tools and insights to help you understand your restaurant performance and make data-driven decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 ${feature.color} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-200`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
              <div className="flex items-center mt-4 text-blue-600 group-hover:text-blue-700">
                <span className="text-sm font-medium">Learn more</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Section with Animation */}
      <div className="bg-white/70 backdrop-blur-sm border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Platform Overview
            </h2>
            <p className="text-lg text-gray-600">
              Real insights from our restaurant analytics platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={stat.label}
                  className="text-center p-6 rounded-2xl hover:bg-gray-50 bg-white shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Restaurant Analytics</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering restaurant owners with powerful analytics and insights to drive growth and optimize operations.
              </p>
              <p className="text-sm text-gray-500">
                &copy; 2025 Restaurant Analytics Dashboard. Built with Laravel & Next.js.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/restaurants" className="hover:text-white transition-colors">Restaurants</Link></li>
                <li><Link href="/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
                <li><Link href="/orders" className="hover:text-white transition-colors">Orders</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}