import React, { useEffect, useState } from 'react';
import { Event, EventApiResponse } from '../types/Events'; 
import API from '../services/axios';



const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get<EventApiResponse>('/events');

        if (response.data.success && Array.isArray(response.data.data)) {
          setEvents(response.data.data);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (err: any) {
        console.error('Axios Error:', err);
        setError(err.response?.data?.message || err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="text-gray-500">Loading events...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
  <h1 className="text-2xl font-bold mb-6">Upcoming Events</h1>
  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {events.map(event => (
      <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
          <p className="text-gray-600 text-sm mb-2 line-clamp-3">{event.description}</p>

          <div className="text-sm text-gray-700 mb-1">
            📅 {event.date} at 🕒 {event.time}
          </div>
          <div className="text-sm text-gray-700 mb-1">
            📍 {event.location}
          </div>
          <div className="text-sm text-gray-700 mb-1">
            💰 ${event.price}
          </div>

          {event.organizer && (
            <div className="text-sm text-gray-500 mt-2 italic">
              Organized by: {event.organizer.name}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default EventList;