import React, { useState } from 'react';
import API from '../services/axios';

const ChangePasswordForm: React.FC = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState<{
    isSubmitting: boolean;
    error: string | null;
    success: string | null;
  }>({ isSubmitting: false, error: null, success: null });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ isSubmitting: true, error: null, success: null });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setStatus({ isSubmitting: false, error: 'New passwords do not match.', success: null });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setStatus({ isSubmitting: false, error: 'New password must be at least 6 characters long.', success: null });
      return;
    }

    try {
      const response = await API.patch('/users/me/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setStatus({ isSubmitting: false, error: null, success: response.data.message || 'Password changed successfully.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setStatus(prev => ({ ...prev, success: null })), 5000); // Clear success message after 5s
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to change password.';
      setStatus({ isSubmitting: false, error: errorMessage, success: null });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {status.error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {status.error}
          </div>
        )}
        {status.success && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {status.success}
          </div>
        )}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
          <input type="password" id="currentPassword" name="currentPassword" value={passwordData.currentPassword} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
          <input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={passwordData.confirmPassword} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={status.isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed">
            {status.isSubmitting ? 'Saving...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;