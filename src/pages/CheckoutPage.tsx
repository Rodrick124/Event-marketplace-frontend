import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import API from '../services/axios';
import { AttendeeReservation } from './Dashboard/MyEvents';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PayPalButtons, OnApproveData, OnApproveActions } from '@paypal/react-paypal-js';
import StripeCheckoutForm from '../components/Payment/StripeCheckoutForm';

// Make sure to put your publishable key in your .env file
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const CheckoutPage: React.FC = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // The reservation object is passed via state to avoid another fetch
  const [reservation, setReservation] = useState<AttendeeReservation | null>(location.state?.reservation);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'paypal' | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  useEffect(() => {
    if (!reservation) {
      // If the page is reloaded, the state will be lost.
      setError("Reservation details not found. Please go back to 'My Events' and try again.");
    }
  }, [reservation]);

  const handlePaymentMethodSelection = async (method: 'stripe' | 'paypal') => {
    if (!reservationId) return;
    setIsLoading(true);
    setError(null);
    setClientSecret(null);
    setPaymentStatus('processing');
    setSelectedMethod(method);

    try {
      // 1. Initiate checkout to get a paymentId and clientSecret for Stripe
      const checkoutResponse = await API.post('/payments/checkout', {
        reservationId,
        method,
      });
      const { paymentId: newPaymentId, clientSecret: newClientSecret, orderId: newPaypalOrderId } = checkoutResponse.data;

      if (!newPaymentId) {
        throw new Error('Failed to initiate payment process.');
      }

      setPaymentId(newPaymentId);

      if (method === 'stripe' && newClientSecret) {
        setClientSecret(newClientSecret);
      } else if (method === 'paypal' && newPaypalOrderId) {
        setPaypalOrderId(newPaypalOrderId);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setPaymentStatus('failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onPaymentSuccess = () => {
    setPaymentStatus('success');
    setTimeout(() => navigate('/dashboard/my-events'), 3000);
  };

  const onPayPalApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    if (!paymentId) {
      setError('Internal payment ID is missing. Cannot confirm payment.');
      return;
    }
    try {
      // No need to capture on client, backend will do it on confirm
      await API.post(`/payments/${paymentId}/confirm`);
      onPaymentSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'PayPal payment was approved, but failed to confirm on our server. Please contact support.');
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

  const stripeOptions: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance: { theme: 'stripe' },
  };

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
        ) : clientSecret && paymentId && selectedMethod === 'stripe' ? (
          // Render the Stripe form
          <Elements options={stripeOptions} stripe={stripePromise}>
            <StripeCheckoutForm paymentId={paymentId} onSuccess={onPaymentSuccess} />
          </Elements>
        ) : paypalOrderId && paymentId && selectedMethod === 'paypal' ? (
          // Render PayPal buttons
          <PayPalButtons
            style={{ layout: 'vertical' }}
            createOrder={(data, actions) => {
              return paypalOrderId;
            }}
            onApprove={onPayPalApprove}
            onError={(err) => {
              setError('An error occurred with the PayPal transaction. Please try again.');
              console.error('PayPal Error:', err);
            }}
          />
        ) : (
          // Otherwise, show payment method selection
          <div className="space-y-4">
            <button
              onClick={() => handlePaymentMethodSelection('stripe')}
              disabled={isLoading && selectedMethod === 'stripe'}
              className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isLoading && selectedMethod === 'stripe' ? 'Initializing...' : 'Pay with Card'}
            </button>
            <button onClick={() => handlePaymentMethodSelection('paypal')} disabled={isLoading && selectedMethod === 'paypal'} className="w-full bg-yellow-400 text-black py-3 rounded-md font-semibold hover:bg-yellow-500 transition-colors disabled:bg-gray-300">
              {isLoading && selectedMethod === 'paypal' ? 'Initializing...' : 'Pay with PayPal'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;