import React from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaDollarSign,
  FaUserPlus,
  FaClock,
  FaChartLine,
  FaEye,
  FaHistory
} from 'react-icons/fa';

const AdminHome = () => {
  const { stats, isLoading, error, activityLogs, refetchActivityLogs } = useAdmin();

  React.useEffect(() => {
    refetchActivityLogs({ limit: 10 });
  }, [refetchActivityLogs]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <FaUserPlus className="h-4 w-4 text-green-600" />;
      case 'event_created':
        return <FaCalendarAlt className="h-4 w-4 text-blue-600" />;
      case 'reservation_made':
        return <FaClipboardList className="h-4 w-4 text-purple-600" />;
      case 'event_cancelled':
        return <FaClock className="h-4 w-4 text-red-600" />;
      case 'user_banned':
        return <FaUsers className="h-4 w-4 text-red-600" />;
      default:
        return <FaEye className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the Event Marketplace admin panel</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FaUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.totalUsers?.toLocaleString() || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">
              +{stats?.newUsersThisMonth || 0} this month
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <FaCalendarAlt className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Events</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.totalEvents?.toLocaleString() || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-blue-600 font-medium">
              {stats?.activeEvents || 0} active
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <FaClipboardList className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Reservations</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.totalReservations?.toLocaleString() || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-yellow-600 font-medium">
              {stats?.pendingReservations || 0} pending
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <FaDollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats?.totalRevenue || 0)}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">
              {formatCurrency(stats?.revenueThisMonth || 0)} this month
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Event Categories</h3>
          {stats?.topCategories && stats.topCategories.length > 0 ? (
            <div className="space-y-4">
              {stats.topCategories.slice(0, 5).map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category.category}</p>
                      <p className="text-sm text-gray-500">{category.eventCount} events</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(category.revenue)}</p>
                    <p className="text-sm text-gray-500">{category.reservationCount} bookings</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No category data available</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          {activityLogs && activityLogs.length > 0 ? (
            <div className="space-y-4">
              {activityLogs.slice(0, 8).map((log) => (
                <div key={log._id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{log.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/users"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FaUsers className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-blue-900">Manage Users</p>
              <p className="text-sm text-blue-600">View and manage all users</p>
            </div>
          </a>

          <a
            href="/admin/events"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <FaCalendarAlt className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-green-900">Manage Events</p>
              <p className="text-sm text-green-600">Review and approve events</p>
            </div>
          </a>

          <a
            href="/admin/analytics"
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <FaChartLine className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <p className="font-medium text-purple-900">View Analytics</p>
              <p className="text-sm text-purple-600">Detailed reports and insights</p>
            </div>
          </a>

          <a
            href="/admin/activity-logs"
            className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <FaHistory className="h-6 w-6 text-yellow-600 mr-3" />
            <div>
              <p className="font-medium text-yellow-900">Activity Logs</p>
              <p className="text-sm text-yellow-600">Monitor system activity</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;