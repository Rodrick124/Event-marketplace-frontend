import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import API from '../services/axios';
import { Event } from '../types/Events';
import { extractData } from '../services/response';
import { formatLocation } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import EventCard from './EventCard';

const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [similarEvents, setSimilarEvents] = useState<Event[]>([]);

  const { addToCart, isLoading: isCartLoading, refetchCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const [addStatus, setAddStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      setLoading(true);
      setError(null);
      try {
        const eventResponse = await API.get(`/events/${eventId}`);
        const { data: mainEvent } = extractData<Event>(eventResponse.data);
        setEvent(mainEvent);

        if (mainEvent?.category) {
          try {
            const similarResponse = await API.get<Event[]>(`/events/search?category=${mainEvent.category}`);
            const similar = similarResponse.data || [];
            // Filter out the current event and limit to 3
            setSimilarEvents(
              similar.filter(e => e._id !== eventId).slice(0, 3)
            );
          } catch (similarError) {
            // Log error but don't block the page from rendering
            console.error("Failed to fetch similar events:", similarError);
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching event details.');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleAddToCart = async () => {
    if (!event) return;
    setAddStatus('idle');
    setStatusMessage('');
    try {
      await addToCart(event._id, quantity);
      setAddStatus('success');
      setStatusMessage('Added to cart!');
      setTimeout(() => setAddStatus('idle'), 3000); // Reset message after 3 seconds
    } catch (err: any) {
      setAddStatus('error');
      setStatusMessage(err.message || 'Could not add to cart. Please try again.');
    }
  };

  const handleBuyNow = async () => {
    if (!event) return;
    setIsProcessingPurchase(true);
    setAddStatus('idle');
    setStatusMessage('');
    try {
      await API.post('/reservations', {
        eventId: event._id,
        ticketQuantity: quantity,
      });

      // If the user buys an item that might be in their cart, the cart should be updated.
      refetchCart();

      setAddStatus('success');
      setStatusMessage('Reservation successful! Redirecting to your tickets...');

      setTimeout(() => {
        navigate('/dashboard/my-events');
      }, 2000);
    } catch (err: any) {
      setAddStatus('error');
      setStatusMessage(err.response?.data?.message || 'Could not complete reservation. Please try again.');
      setIsProcessingPurchase(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      </div>
    );
  }

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

  const isEventPast = new Date(event.date) < new Date();

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-blue-600 hover:text-blue-800 mb-8 inline-block">
          ← Back to Events
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Event Image */}
          <div className="relative h-96">
            <img
              className="w-full h-full object-cover"
              src={event.imageUrl}
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
                    <span className="text-gray-700">{formatLocation(event.location)}</span>
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
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center justify-between">
                        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity</label>
                        <input
                          type="number"
                          id="quantity"
                          name="quantity"
                          min="1"
                          max={event.availableSeats > 0 ? event.availableSeats : 1}
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
                          disabled={event.availableSeats === 0 || isEventPast}
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      {isEventPast ? (
                        <div className="text-center bg-gray-200 text-gray-600 p-3 rounded-md font-medium">
                          This event has ended.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <button
                            onClick={handleAddToCart}
                            disabled={isCartLoading || isProcessingPurchase || event.availableSeats === 0}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
                          >
                            {isCartLoading ? 'Adding...' : event.availableSeats === 0 ? 'Sold Out' : 'Add to Cart'}
                          </button>
                          <button
                            onClick={handleBuyNow}
                            disabled={isCartLoading || isProcessingPurchase || event.availableSeats === 0}
                            className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-300 disabled:bg-green-300 disabled:cursor-not-allowed"
                          >
                            {isProcessingPurchase ? 'Reserving...' : 'Buy Now'}
                          </button>
                        </div>
                      )}
                      {addStatus === 'success' && <p className="text-green-600 text-sm text-center">{statusMessage}</p>}
                      {addStatus === 'error' && <p className="text-red-600 text-sm text-center">{statusMessage}</p>}
                    </>
                  ) : (
                    <Link to="/login" state={{ from: location.pathname }} className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium">
                      Login to Book Tickets
                    </Link>
                  )}
                  <div className="text-center text-sm text-gray-500">
                    <p>Secure checkout</p>
                    <p>Instant confirmation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {similarEvents.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarEvents.map(similarEvent => (
                <EventCard key={similarEvent._id} event={similarEvent} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;