import { useState, useEffect } from 'react';
import { Event } from '../../types/Events';
import axios from '../../services/axios';
import { extractData } from '../../services/response';
import { formatLocation } from '../../utils/format';

const MyEvents = () => {
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const response = await axios.get('/users/events');
        const { data } = extractData<Event[] | any>(response.data);
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.results)
              ? data.results
              : Array.isArray(data?.data)
                ? data.data
                : [];
        setRegisteredEvents(list);
        setError(null);
      } catch (err) {
        setError('Failed to fetch your registered events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (registeredEvents.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold mb-4">My Events</h2>
        <p className="text-gray-600">You haven't registered for any events yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-6">My Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {registeredEvents.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={event.image || '/assets/default-event.jpg'}
                alt={event.title}
                className="object-cover w-full h-48"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Time:</span> {event.time}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Location:</span> {formatLocation(event.location)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Category:</span> {event.category}
                </p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-blue-600 font-medium">${event.price}</span>
                <button
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                  onClick={() => {
                    // Implement view details logic
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyEvents;
