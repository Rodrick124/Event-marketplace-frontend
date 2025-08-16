import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { AdminEvent, AdminFilters } from '../../types/Admin';
import { 
  FaSearch, 
  FaDownload, 
  FaEye, 
  FaCheck, 
  FaTimes,
  FaTrash,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaDollarSign
} from 'react-icons/fa';

const EventManagement = () => {
  const { 
    events, 
    isLoading, 
    error, 
    pagination,
    refetchEvents, 
    updateEventApproval,
    deleteEvent,
    exportData 
  } = useAdmin();

  const [filters, setFilters] = useState<AdminFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    category: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    refetchEvents(filters);
  }, [filters, refetchEvents]);

  const handleFilterChange = (key: keyof AdminFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value
    }));
  };

  const handleEventAction = async (eventId: string, action: string, reason?: string) => {
    try {
      setActionLoading(`${action}-${eventId}`);
      
      switch (action) {
        case 'approve':
          await updateEventApproval(eventId, 'approved');
          break;
        case 'reject':
          await updateEventApproval(eventId, 'rejected', reason);
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            await deleteEvent(eventId);
          }
          break;
      }
    } catch (error: any) {
      alert(error.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleExport = async () => {
    try {
      await exportData('events', filters);
    } catch (error: any) {
      alert(error.message || 'Export failed');
    }
  };

  const getStatusBadge = (event: AdminEvent) => {
    switch (event.status) {
      case 'published':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Published</span>;
      case 'draft':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Draft</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Cancelled</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Completed</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Approved</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  if (isLoading && events.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Management</h1>
        <p className="text-gray-600">Review, approve, and manage all platform events</p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>

            {/* Category Filter */}
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Categories</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Arts">Arts</option>
              <option value="Food">Food</option>
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
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="date-asc">Event Date (Earliest)</option>
              <option value="date-desc">Event Date (Latest)</option>
              <option value="totalRevenue-desc">Highest Revenue</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FaDownload className="mr-2 h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={event.image || '/assets/default-event.jpg'}
                alt={event.title}
                className="object-cover w-full h-48"
              />
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{event.title}</h3>
                <div className="flex flex-col gap-1 ml-2">
                  {getStatusBadge(event)}
                  {getApprovalBadge(event.approvalStatus)}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-500 text-sm">
                  <FaCalendarAlt className="mr-2 h-3 w-3" />
                  <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <FaMapMarkerAlt className="mr-2 h-3 w-3" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <FaUsers className="mr-2 h-3 w-3" />
                  <span>{event.totalReservations} / {event.capacity} attendees</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <FaDollarSign className="mr-2 h-3 w-3" />
                  <span>${event.price} • Revenue: ${event.totalRevenue?.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              <div className="text-xs text-gray-400 mb-3">
                <p>Organizer: {event.organizer.name}</p>
                <p>Created: {new Date(event.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FaEye className="mr-1 h-3 w-3" />
                  View
                </button>

                <div className="flex space-x-1">
                  {event.approvalStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => handleEventAction(event._id, 'approve')}
                        disabled={actionLoading === `approve-${event._id}`}
                        className="p-1 text-green-600 hover:text-green-900 disabled:opacity-50"
                        title="Approve Event"
                      >
                        <FaCheck className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEventAction(event._id, 'reject', 'Rejected by admin')}
                        disabled={actionLoading === `reject-${event._id}`}
                        className="p-1 text-red-600 hover:text-red-900 disabled:opacity-50"
                        title="Reject Event"
                      >
                        <FaTimes className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => handleEventAction(event._id, 'delete')}
                    disabled={actionLoading === `delete-${event._id}`}
                    className="p-1 text-red-600 hover:text-red-900 disabled:opacity-50"
                    title="Delete Event"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-500">Try adjusting your filters to see more events.</p>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-8 bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
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
                Showing <span className="font-medium">{((filters.page || 1) - 1) * (filters.limit || 10) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min((filters.page || 1) * (filters.limit || 10), pagination.total)}
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

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onAction={handleEventAction}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
};

interface EventDetailsModalProps {
  event: AdminEvent;
  onClose: () => void;
  onAction: (eventId: string, action: string, reason?: string) => void;
  actionLoading: string | null;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose, onAction, actionLoading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold">Event Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <img
                src={event.image || '/assets/default-event.jpg'}
                alt={event.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-gray-600">{event.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                  <p className="text-sm text-gray-900">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="text-sm text-gray-900">{event.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <p className="text-sm text-gray-900">${event.price}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Capacity</label>
                  <p className="text-sm text-gray-900">{event.capacity}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="text-sm text-gray-900">{event.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm text-gray-900">{event.status}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Approval Status</label>
                  <p className="text-sm text-gray-900">{event.approvalStatus}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{event.totalReservations}</p>
              <p className="text-sm text-blue-800">Total Reservations</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">${event.totalRevenue?.toFixed(2) || '0.00'}</p>
              <p className="text-sm text-green-800">Total Revenue</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{event.availableSeats}</p>
              <p className="text-sm text-purple-800">Available Seats</p>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Organizer Information</label>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">{event.organizer.name}</p>
              <p className="text-sm text-gray-600">{event.organizer.email}</p>
            </div>
          </div>

          {event.approvalStatus === 'pending' && (
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => onAction(event._id, 'reject', 'Rejected by admin')}
                disabled={actionLoading === `reject-${event._id}`}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === `reject-${event._id}` ? 'Rejecting...' : 'Reject'}
              </button>
              <button
                onClick={() => onAction(event._id, 'approve')}
                disabled={actionLoading === `approve-${event._id}`}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading === `approve-${event._id}` ? 'Approving...' : 'Approve'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventManagement;