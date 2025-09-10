import React, { useState, useEffect, useCallback } from 'react';
import { OrganizerApiService, OrganizerReservation } from '../../services/organizerApi';
import { AdminFilters } from '../../types/Admin';
import { FaSearch, FaTimesCircle } from 'react-icons/fa';

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<OrganizerReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [filters, setFilters] = useState<AdminFilters>({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const fetchReservations = useCallback(async (currentFilters: AdminFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const { reservations: fetchedReservations, pagination: fetchedPagination } = await OrganizerApiService.getReservations(currentFilters);
      setReservations(fetchedReservations);
      setPagination(fetchedPagination);
    } catch (err: any) {
      setError(err.message || 'Failed to load reservations.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations(filters);
  }, [filters, fetchReservations]);

  const handleFilterChange = (key: keyof AdminFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value,
    }));
  };

  const handleCancelReservation = async (reservationId: string) => {
    if (window.confirm('Are you sure you want to cancel this reservation? This action cannot be undone.')) {
      try {
        const updatedReservation = await OrganizerApiService.cancelReservation(reservationId);
        setReservations(prev =>
          prev.map(res =>
            res._id === reservationId ? updatedReservation : res
          )
        );
      } catch (err: any) {
        alert('Failed to cancel reservation: ' + err.message);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading && reservations.length === 0) {
    return <div>Loading reservations...</div>;
  }

  if (error) {
    return <div className="text-red-500 bg-red-100 p-4 rounded-md">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Reservations</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by event or user..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.length > 0 ? (
              reservations.map((res) => (
                <tr key={res._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{res.event?.title || 'Event not found'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{res.user?.name || 'User not found'}</div>
                    <div className="text-sm text-gray-500">{res.user?.email || ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(res.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{res.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(res.totalPrice ?? 0).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(res.status)}`}>
                      {res.status ? res.status.charAt(0).toUpperCase() + res.status.slice(1) : 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {res.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelReservation(res._id)}
                        className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-end"
                        title="Cancel Reservation"
                      >
                        <FaTimesCircle className="mr-1" /> Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500">No reservations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <span className="text-sm text-gray-700">Page {pagination.page} of {pagination.pages}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleFilterChange('page', (filters.page || 1) - 1)}
              disabled={(filters.page || 1) === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
              disabled={(filters.page || 1) === pagination.pages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;