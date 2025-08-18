import { useState, useEffect } from 'react';
import { AdminApiService } from '../../services/adminApi';
import { RevenueData, UserGrowthData } from '../../types/Admin';
import { useAdmin } from '../../hooks/useAdmin';
import { 
  FaDollarSign, 
  FaUsers, 
  FaCalendarAlt, 
  FaTicketAlt,
  FaArrowUp,
  FaArrowDown,
  FaChartLine
} from 'react-icons/fa';

const Analytics = () => {
  const { stats, isLoading: statsLoading, error: statsError } = useAdmin();
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [revenue, userGrowth] = await Promise.all([
        AdminApiService.getRevenueAnalytics(selectedPeriod),
        AdminApiService.getUserGrowthAnalytics(selectedPeriod)
      ]);
      
      setRevenueData(revenue);
      setUserGrowthData(userGrowth);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'Failed to fetch analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const getGrowthIcon = (percentage: number) => {
    if (percentage > 0) {
      return <FaArrowUp className="h-4 w-4 text-green-500" />;
    } else if (percentage < 0) {
      return <FaArrowDown className="h-4 w-4 text-red-500" />;
    }
    return <FaChartLine className="h-4 w-4 text-gray-500" />;
  };

  const getGrowthColor = (percentage: number) => {
    if (percentage > 0) return 'text-green-600';
    if (percentage < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (statsLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (statsError || error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600 mb-4">{statsError || error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Calculate growth percentages (mock data for demonstration)
  const revenueGrowth = revenueData.length >= 2 ? 
    calculateGrowthPercentage(
      revenueData[revenueData.length - 1]?.revenue || 0,
      revenueData[revenueData.length - 2]?.revenue || 0
    ) : 0;

  const userGrowth = userGrowthData.length >= 2 ?
    calculateGrowthPercentage(
      userGrowthData[userGrowthData.length - 1]?.newUsers || 0,
      userGrowthData[userGrowthData.length - 2]?.newUsers || 0
    ) : 0;

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Detailed insights and performance metrics</p>
          </div>
          
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year')}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last 12 Months</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats?.totalRevenue || 0)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <FaDollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getGrowthIcon(revenueGrowth)}
            <span className={`ml-2 text-sm font-medium ${getGrowthColor(revenueGrowth)}`}>
              {revenueGrowth > 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
            </span>
            <span className="ml-2 text-sm text-gray-500">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.totalUsers?.toLocaleString() || 0}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <FaUsers className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getGrowthIcon(userGrowth)}
            <span className={`ml-2 text-sm font-medium ${getGrowthColor(userGrowth)}`}>
              {userGrowth > 0 ? '+' : ''}{userGrowth.toFixed(1)}%
            </span>
            <span className="ml-2 text-sm text-gray-500">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Events</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.totalEvents?.toLocaleString() || 0}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <FaCalendarAlt className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              {stats?.activeEvents || 0} active events
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Reservations</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.totalReservations?.toLocaleString() || 0}
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <FaTicketAlt className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              {stats?.pendingReservations || 0} pending
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          {revenueData.length > 0 ? (
            <div className="space-y-4">
              <div className="h-64 flex items-end justify-between space-x-2">
                {revenueData.slice(-10).map((data, index) => {
                  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
                  const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 200 : 0;
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="bg-green-500 rounded-t w-full min-h-[4px] transition-all duration-300 hover:bg-green-600"
                        style={{ height: `${height}px` }}
                        title={`${new Date(data.date).toLocaleDateString()}: ${formatCurrency(data.revenue)}`}
                      />
                      <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                        {new Date(data.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Total Revenue: {formatCurrency(revenueData.reduce((sum, d) => sum + d.revenue, 0))}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No revenue data available
            </div>
          )}
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          {userGrowthData.length > 0 ? (
            <div className="space-y-4">
              <div className="h-64 flex items-end justify-between space-x-2">
                {userGrowthData.slice(-10).map((data, index) => {
                  const maxUsers = Math.max(...userGrowthData.map(d => d.newUsers));
                  const height = maxUsers > 0 ? (data.newUsers / maxUsers) * 200 : 0;
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="bg-blue-500 rounded-t w-full min-h-[4px] transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${height}px` }}
                        title={`${new Date(data.date).toLocaleDateString()}: ${data.newUsers} new users`}
                      />
                      <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                        {new Date(data.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  New Users: {userGrowthData.reduce((sum, d) => sum + d.newUsers, 0)}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No user growth data available
            </div>
          )}
        </div>
      </div>

      {/* Top Categories */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Event Categories</h3>
        {stats?.topCategories && stats.topCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.topCategories.map((category, index) => (
              <div key={category.category} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{category.category}</h4>
                  <span className="text-sm text-gray-500">#{index + 1}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Events:</span>
                    <span className="font-medium">{category.eventCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium">{formatCurrency(category.revenue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bookings:</span>
                    <span className="font-medium">{category.reservationCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No category data available</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;