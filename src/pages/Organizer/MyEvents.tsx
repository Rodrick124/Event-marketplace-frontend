import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { OrganizerApiService } from '../../services/organizerApi';
import { OrganizerEvent } from '../../types/Organizer';
import { FaEdit, FaTrash, FaPlus, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../components/ConfirmationModal';

const MyEvents: React.FC = () => {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isConfirming: boolean;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {}, isConfirming: false });
  const navigate = useNavigate();

  const fetchEvents = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const { events: fetchedEvents, pagination: fetchedPagination } = await OrganizerApiService.getEvents({ page, limit: 10 });
      setEvents(fetchedEvents);
      setPagination(fetchedPagination);
    } catch (err: any) {
      setError(err.message || 'Failed to load events.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(currentPage);
  }, [fetchEvents, currentPage]);

  const handleConfirmAction = async (action: () => Promise<void>) => {
    setModalState(prev => ({ ...prev, isConfirming: true }));
    try {
      await action();
    } finally {
      setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {}, isConfirming: false });
    }
  };

  const openConfirmationModal = (
    actionType: 'delete' | 'cancel',
    eventId: string,
    eventTitle: string
  ) => {
    const onConfirm = () => {
      if (actionType === 'delete') {
        handleConfirmAction(async () => {
          try {
            await OrganizerApiService.deleteEvent(eventId);
            toast.success('Event deleted successfully.');
            fetchEvents(currentPage);
          } catch (err: any) {
            toast.error(err.message || 'Failed to delete event.');
          }
        });
      } else {
        handleConfirmAction(async () => {
          try {
            await OrganizerApiService.cancelEvent(eventId);
            toast.success('Event cancelled successfully.');
            fetchEvents(currentPage);
          } catch (err: any) {
            toast.error(err.message || 'Failed to cancel event.');
          }
        });
      }
    };

    setModalState({
      isOpen: true,
      title: `Confirm ${actionType === 'delete' ? 'Deletion' : 'Cancellation'}`,
      message: `Are you sure you want to ${actionType} the event "${eventTitle}"? This action cannot be undone.`,
      onConfirm,
      isConfirming: false,
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && (!pagination || newPage <= pagination.pages)) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) {
    return <div>Loading your events...</div>;
  }

  if (error) {
    return <div className="text-red-500 bg-red-100 p-4 rounded-md">Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Events</h1>
        <Link
          to="../create-event"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <FaPlus className="mr-2" /> Create Event
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservations/Capacity</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.length > 0 ? (
              events.map((event) => (
                console.log(event),
                <tr key={event._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-500">{event.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      event.status === 'published' ? 'bg-green-100 text-green-800' :
                      event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.totalReservations ?? 0} / {event.availableSeats}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => navigate(`../edit-event/${event._id}`)} className="text-blue-600 hover:text-blue-900 mr-4" title="Edit">
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openConfirmationModal('cancel', event._id, event.title)}
                      className="text-yellow-600 hover:text-yellow-900 mr-4 disabled:text-gray-400"
                      title="Cancel Event"
                      disabled={event.status === 'cancelled' || event.status === 'rejected'}
                    >
                      <FaTimesCircle />
                    </button>
                    <button 
                      onClick={() => openConfirmationModal('delete', event._id, event.title)} 
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  You haven't created any events yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <span className="text-sm text-gray-700">
            Page {pagination.page} of {pagination.pages}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.pages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        isConfirming={modalState.isConfirming}
        confirmText={modalState.title.split(' ')[1]}
      />
    </div>
  );
};

export default MyEvents;