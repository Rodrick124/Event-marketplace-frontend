import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import API from '../services/axios';
import { Event } from '../types/Events';

const EventDetail: React.FC = () => {
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

  const { eventId } = useParams<{ eventId: string }>();
  const event = events.find((event) => event._id === String(eventId));

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Event not found</h1>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-blue-600 hover:text-blue-800 mb-8 inline-block">
          ← Back to Events
        </Link>

        {loading ? (
        <p>Loading events...</p>
          ) : (
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Event Image */}
          <div className="relative h-96">
            <img
              className="w-full h-full object-cover"
              src={event.image}
              alt={event.title}
            />
          </div>

          {/* Event Content */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
              {/* Main Content */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {event.category}
                  </span>
                  <span className="text-gray-500">{event.date}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                <p className="text-gray-600 text-lg mb-6">{event.description}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-700">Organized by {event.organizer?.name}</span>
                  </div>
                </div>
              </div>

              {/* Booking Section */}
              <div className="md:w-80 bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-blue-600">${event.price}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {event.availableSeats} tickets available
                    </p>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300">
                    Book Now
                  </button>
                  <div className="text-center text-sm text-gray-500">
                    <p>Secure checkout</p>
                    <p>Instant confirmation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>)}
      </div>
    </div>
  );
};

export default EventDetail;