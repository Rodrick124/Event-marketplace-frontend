import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import API from '../services/axios';
import { AttendeeReservation } from './Dashboard/MyEvents';

const CheckoutPage: React.FC = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // The reservation object is passed via state to avoid another fetch
  const [reservation, setReservation] = useState<AttendeeReservation | null>(location.state?.reservation);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  useEffect(() => {
    if (!reservation) {
      // If the page is reloaded, the state will be lost.
      setError("Reservation details not found. Please go back to 'My Events' and try again.");
    }
  }, [reservation]);

  const handleLocalPayment = async () => {
    if (!reservationId) return;
    setIsLoading(true);
    setError(null);
    setPaymentStatus('processing');

    try {
      // 1. Initiate checkout to get a paymentId
      const checkoutResponse = await API.post('/payments/checkout', {
        reservationId,
        method: 'local',
      });
      const { paymentId } = checkoutResponse.data;

      if (!paymentId) {
        throw new Error('Failed to initiate payment process.');
      }

      // 2. Confirm the payment
      await API.post(`/payments/${paymentId}/confirm`);

      setPaymentStatus('success');
      setTimeout(() => navigate('/dashboard/my-events'), 3000);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setPaymentStatus('failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!reservation) {
    return (
      <div className="container mx-auto my-12 text-center p-4">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="text-gray-600 mt-2">{error || "Could not load reservation details."}</p>
        <Link to="/dashboard/my-events" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Go to My Events
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-12 p-4 sm:p-6 lg:p-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
      <p className="text-gray-500 mb-8">Complete your payment for the event.</p>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-3 border-b pb-4 mb-4">
          <div className="flex justify-between">
            <p className="text-gray-600">Event:</p>
            <p className="font-semibold">{reservation.eventId?.title}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Quantity:</p>
            <p className="font-semibold">{reservation.ticketQuantity}</p>
          </div>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <p>Total Amount</p>
          <p>${reservation.totalPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
        
        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

        {paymentStatus === 'success' ? (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded text-center">
            <p className="font-bold">Payment Successful!</p>
            <p>Your reservation is confirmed. Redirecting you to your events...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <button onClick={handleLocalPayment} disabled={isLoading} className="w-full bg-gray-800 text-white py-3 rounded-md font-semibold hover:bg-gray-900 transition-colors disabled:bg-gray-400">
              {isLoading ? 'Processing...' : 'Pay with Local Method (Test)'}
            </button>
            <p className="text-center text-sm text-gray-500">More payment options coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;