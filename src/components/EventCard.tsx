import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types/Events';

interface EventCardProps {
  event: Event;
}
const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { _id, title, description, price, availableSeats, imageUrl, date, time } = event;

  const isEventPast = new Date(date) < new Date();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/events/${_id}`}>
        <div className="relative h-48">
          <img
            className="w-full h-full object-cover"
            src={imageUrl || '/default-event.jpg'} // Use imageUrl and provide a fallback
            alt={title}
            onError={(e) => {
              e.currentTarget.src = '/default-event.jpg';
            }}
          />
        </div>
      </Link>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="text-sm text-gray-500 mb-4">
          <p>
            {new Date(date).toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric'
            })}
          </p>
          <p>at {time}</p>
        </div>

        {/* Price and Tickets */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">${price}</p>
            <p className="text-sm text-gray-500">{availableSeats} tickets left</p>
          </div>
          {isEventPast ? (
            <span className="bg-gray-200 text-gray-500 px-4 py-2 rounded-md text-sm font-medium">
              Event has ended
            </span>
          ) : (
            <Link to={`/events/${_id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300">
              Book Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;