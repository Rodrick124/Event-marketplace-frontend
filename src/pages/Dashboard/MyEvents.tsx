import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/axios';
import { extractData } from '../../services/response';

// Based on OrganizerReservation and what an attendee might need
interface AttendeeReservation {
  _id: string;
  event: {
    _id: string;
    title: string;
    date: string;
    location: string; // Assuming simple string for now
  } | null;
  quantity: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

const MyEvents: React.FC = () => {
  const [reservations, setReservations] = useState<AttendeeReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyReservations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Assuming an endpoint to get reservations for the logged-in attendee
        const response = await API.get('/reservations/my');
        const { data } = extractData<{ reservations: AttendeeReservation[] }>(response.data);
        setReservations(data.reservations);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load your reservations.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyReservations();
  }, []);

  const getStatusPill = (status: AttendeeReservation['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Confirmed</span>;
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'cancelled':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Events & Tickets</h1>
      {reservations.length > 0 ? (
        <div className="space-y-6">
          {reservations.map(reservation => (
            <div key={reservation._id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {reservation.event ? (
                <>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{reservation.event.title}</h3>
                    <p className="text-gray-600">
                      {new Date(reservation.event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-sm text-gray-500">{reservation.event.location}</p>
                    <div className="mt-2 flex items-center gap-4">
                      <p className="text-sm text-gray-500">Quantity: {reservation.quantity}</p>
                      {getStatusPill(reservation.status)}
                    </div>
                  </div>
                  <Link to={`/events/${reservation.event._id}`} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center">
                    View Event
                  </Link>
                </>
              ) : (
                <div className="w-full">
                  <h3 className="font-semibold text-lg text-gray-500 italic">Event has been removed</h3>
                  <p className="text-sm text-gray-400">Reservation made on {new Date(reservation.createdAt).toLocaleDateString()}</p>
                  {getStatusPill(reservation.status)}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">You have no event reservations.</p>
          <Link to="/events" className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Explore Events
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyEvents;