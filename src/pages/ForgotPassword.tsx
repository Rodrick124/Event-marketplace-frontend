import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{
    isSubmitting: boolean;
    error: string | null;
    success: string | null;
  }>({ isSubmitting: false, error: null, success: null });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ isSubmitting: true, error: null, success: null });

    try {
      const response = await API.post('/auth/forgot-password', { email });
      setStatus({ isSubmitting: false, error: null, success: response.data.message });
    } catch (err: any) {
      // Per API spec, we show a generic success message even on error to prevent email enumeration.
      // But we can show a specific client-side error if the input is invalid.
      const errorMessage = err.response?.data?.errors?.[0]?.msg || 'An unexpected error occurred.';
      if (err.response?.status === 400 && err.response?.data?.errors) {
         setStatus({ isSubmitting: false, error: errorMessage, success: null });
      } else {
         // Generic success message for security
         setStatus({ isSubmitting: false, error: null, success: "If an account with that email exists, a password reset link has been sent." });
         console.error(err); // Log the actual error for debugging
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Forgot Password</h2>
        
        {status.error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {status.error}
          </div>
        )}
        {status.success ? (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded text-center">
            <p>{status.success}</p>
            <Link to="/login" className="mt-4 inline-block font-semibold text-blue-600 hover:text-blue-800">
              &larr; Back to Login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-600 mb-6">
              Enter your email address and we will send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={status.isSubmitting}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 disabled:opacity-50"
                disabled={status.isSubmitting}
              >
                {status.isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;