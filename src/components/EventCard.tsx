import React, { useEffect, useState } from 'react';
import API from '../services/axios';
import { Event } from '../types/Events';

const EventCard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get('/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (!events || !Array.isArray(events)) {
    return <p>No events available.</p>;
  }


  return (
    <>
      {loading ? (
        <p>Loading events...</p>
      )  : ( 
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {events.map((event) => (
          <><div className="relative h-48">
          <img
            className="w-full h-full object-cover"
            src={event.image}
            alt={event.title} />
        </div><div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

            {/* Price and Tickets */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">XFA{event.price}</p>
                <p className="text-sm text-gray-500">
                  {event.availableSeats} tickets left
                </p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300">
                Book Now
              </button>
            </div>
          </div></>
      ))}
      
    </div>
  )}
    </>
    
  );
};

export default EventCard;