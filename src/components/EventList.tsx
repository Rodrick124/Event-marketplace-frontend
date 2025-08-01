import React, { useEffect, useState } from 'react';
import { Event, EventApiResponse } from '../types/Events'; 
import API from '../services/axios';
import EventFilter from './EventFilter';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get<EventApiResponse>('/events');

        if (response.data.success && Array.isArray(response.data.data)) {
          setEvents(response.data.data);
          setFilteredEvents(response.data.data);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleFilterChange = (filters: { location: string; category: string }) => {
    let filtered = events;
    if (filters.location) {
      filtered = filtered.filter(e => e.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.category) {
      filtered = filtered.filter(e => e.category.toLowerCase().includes(filters.category.toLowerCase()));
    }
    setFilteredEvents(filtered);
  };

  const handleBuyTicket = (eventId: string) => {
    if (!isAuthenticated || !localStorage.getItem('auth_token')) {
      navigate('/signup');
      return;
    }
    // Example: redirect to event detail or checkout page
    navigate(`/event/${eventId}`);
  };

  const handleAddToList = (eventId: string) => {
    if (!isAuthenticated || !localStorage.getItem('auth_token')) {
      navigate('/signup');
      return;
    }
    // Example: add to cart logic (could be API call or local state)
    alert('Added event to your list: ' + eventId);
  };

  if (loading) return <div className="text-gray-500">Loading events...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Upcoming Events</h1>
      <EventFilter onFilterChange={handleFilterChange} />
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map(event => (
          <div
            key={event._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.src = "/default-event.jpg";
              }}
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
              <p className="text-gray-600 text-sm mb-2 line-clamp-3">{event.description}</p>
              <div className="text-sm text-gray-700 mb-1">📅 {event.date} at 🕒 {event.time}</div>
              <div className="text-sm text-gray-700 mb-1">📍 {event.location}</div>
              <div className="text-sm text-gray-700 mb-1">💰 ${event.price}</div>
              {event.organizer && (
                <div className="text-sm text-gray-500 mt-2 italic">
                  Organized by: {event.organizer.name}
                </div>
              )}
              <div className="mt-4 flex gap-3">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
                  onClick={() => handleBuyTicket(event._id)}
                >
                  Buy Your Ticket
                </button>
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-sm text-gray-800 px-4 py-2 rounded"
                  onClick={() => handleAddToList(event._id)}
                >
                  Add to My List
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;