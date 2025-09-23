import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/axios';

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<{
    isSubmitting: boolean;
    error: string | null;
    success: string | null;
  }>({ isSubmitting: false, error: null, success: null });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ isSubmitting: true, error: null, success: null });

    if (password !== confirmPassword) {
      setStatus({ isSubmitting: false, error: 'Passwords do not match.', success: null });
      return;
    }

    if (password.length < 6) {
      setStatus({ isSubmitting: false, error: 'Password must be at least 6 characters long.', success: null });
      return;
    }

    if (!token) {
      setStatus({ isSubmitting: false, error: 'Reset token is missing.', success: null });
      return;
    }

    try {
      const response = await API.post(`/auth/reset-password/${token}`, { newPassword: password });
      setStatus({ isSubmitting: false, error: null, success: response.data.message });
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.';
      setStatus({ isSubmitting: false, error: errorMessage, success: null });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Reset Your Password</h2>
        
        {status.error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {status.error}
          </div>
        )}
        {status.success ? (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded text-center">
            <p>{status.success}</p>
            <p className="mt-2">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
              <input type="password" id="newPassword" name="newPassword" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={status.isSubmitting} />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={status.isSubmitting} />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 disabled:opacity-50" disabled={status.isSubmitting}>
              {status.isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:text-blue-800">
            Remember your password? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;