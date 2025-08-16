import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { ActivityLog, AdminFilters } from '../../types/Admin';
import { 
  FaSearch, 
  FaDownload, 
  FaUserPlus,
  FaCalendarAlt,
  FaClipboardList,
  FaClock,
  FaUsers,
  FaEye,
  FaFilter
} from 'react-icons/fa';

const ActivityLogs = () => {
  const { 
    activityLogs, 
    isLoading, 
    error, 
    pagination,
    refetchActivityLogs 
  } = useAdmin();

  const [filters, setFilters] = useState<AdminFilters>({
    page: 1,
    limit: 20,
    search: '',
    sortBy: 'timestamp',
    sortOrder: 'desc'
  });

  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  useEffect(() => {
    refetchActivityLogs(filters);
  }, [filters, refetchActivityLogs]);

  const handleFilterChange = (key: keyof AdminFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value
    }));
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

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_registration':
        return 'bg-green-50 border-green-200';
      case 'event_created':
        return 'bg-blue-50 border-blue-200';
      case 'reservation_made':
        return 'bg-purple-50 border-purple-200';
      case 'event_cancelled':
        return 'bg-red-50 border-red-200';
      case 'user_banned':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatActivityType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading && activityLogs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Logs</h1>
        <p className="text-gray-600">Monitor all system activities and user actions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search activities..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Activity Type Filter */}
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Activities</option>
              <option value="user_registration">User Registration</option>
              <option value="event_created">Event Created</option>
              <option value="reservation_made">Reservation Made</option>
              <option value="event_cancelled">Event Cancelled</option>
              <option value="user_banned">User Banned</option>
            </select>

            {/* Sort */}
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            >
              <option value="timestamp-desc">Newest First</option>
              <option value="timestamp-asc">Oldest First</option>
              <option value="type-asc">Type A-Z</option>
              <option value="type-desc">Type Z-A</option>
            </select>
          </div>

          {/* Items per page */}
          <select
            value={filters.limit || 20}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
          
          {activityLogs.length > 0 ? (
            <div className="space-y-4">
              {activityLogs.map((log, index) => (
                <div
                  key={log._id}
                  className={`p-4 rounded-lg border ${getActivityColor(log.type)} hover:shadow-sm transition-shadow cursor-pointer`}
                  onClick={() => setSelectedLog(log)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(log.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {formatActivityType(log.type)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{log.description}</p>
                      
                      {/* Additional metadata */}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        {log.userId && (
                          <span>User ID: {log.userId.slice(-8)}</span>
                        )}
                        {log.eventId && (
                          <span>Event ID: {log.eventId.slice(-8)}</span>
                        )}
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <span className="text-blue-600 cursor-pointer hover:underline">
                            View Details
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaClock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activity logs found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more activities.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handleFilterChange('page', Math.max(1, (filters.page || 1) - 1))}
                disabled={!pagination.page || pagination.page <= 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handleFilterChange('page', Math.min(pagination.pages, (filters.page || 1) + 1))}
                disabled={!pagination.page || pagination.page >= pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((filters.page || 1) - 1) * (filters.limit || 20) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min((filters.page || 1) * (filters.limit || 20), pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handleFilterChange('page', Math.max(1, (filters.page || 1) - 1))}
                    disabled={!pagination.page || pagination.page <= 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handleFilterChange('page', Math.min(pagination.pages, (filters.page || 1) + 1))}
                    disabled={!pagination.page || pagination.page >= pagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Activity Details Modal */}
      {selectedLog && (
        <ActivityDetailsModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
};

interface ActivityDetailsModalProps {
  log: ActivityLog;
  onClose: () => void;
}

const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({ log, onClose }) => {
  const formatActivityType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Activity Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Activity Type</label>
              <p className="text-sm text-gray-900">{formatActivityType(log.type)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <p className="text-sm text-gray-900">{log.description}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Timestamp</label>
              <p className="text-sm text-gray-900">{new Date(log.timestamp).toLocaleString()}</p>
            </div>

            {log.userId && (
              <div>
                <label className="block text-sm font-medium text-gray-700">User ID</label>
                <p className="text-sm text-gray-900 font-mono">{log.userId}</p>
              </div>
            )}

            {log.eventId && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Event ID</label>
                <p className="text-sm text-gray-900 font-mono">{log.eventId}</p>
              </div>
            )}

            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Data</label>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <pre className="whitespace-pre-wrap text-gray-900">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;