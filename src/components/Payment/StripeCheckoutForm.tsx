import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import API from '../../services/axios';

interface StripeCheckoutFormProps {
  paymentId: string;
  onSuccess: () => void;
}

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({ paymentId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // This will trigger form validation and catch any immediate errors
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message || 'An unexpected error occurred.');
      setIsProcessing(false);
      return;
    }

    // Confirm the payment with Stripe
    const { error } = await stripe.confirmPayment({
      elements,
      // We handle the redirect manually after confirming with our backend
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred during payment.');
      setIsProcessing(false);
    } else {
      // Payment succeeded on Stripe's end. Now confirm with our backend.
      try {
        await API.post(`/payments/${paymentId}/confirm`);
        onSuccess(); // Trigger success state in parent component
      } catch (backendError: any) {
        setErrorMessage(backendError.response?.data?.message || 'Payment was processed by Stripe, but failed to confirm on our server. Please contact support.');
        setIsProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {errorMessage && <div className="p-3 my-4 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>}
      <button disabled={!stripe || isProcessing} className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300">
        {isProcessing ? 'Processing...' : `Pay Now`}
      </button>
    </form>
  );
};

export default StripeCheckoutForm;
