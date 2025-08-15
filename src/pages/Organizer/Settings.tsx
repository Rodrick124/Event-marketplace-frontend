import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    emailNotifications: true,
    smsNotifications: false,
    language: 'en',
    timezone: 'UTC',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle settings update logic here
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>

        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Notification Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="emailNotifications"
                    type="checkbox"
                    checked={formData.emailNotifications}
                    onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-3">
                    <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                    <p className="text-sm text-gray-500">Receive email updates about your events</p>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="smsNotifications"
                    type="checkbox"
                    checked={formData.smsNotifications}
                    onChange={(e) => setFormData({ ...formData, smsNotifications: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="smsNotifications" className="ml-3">
                    <span className="text-sm font-medium text-gray-700">SMS Notifications</span>
                    <p className="text-sm text-gray-500">Receive text message updates about your events</p>
                  </label>
                </div>
              </div>
            </div>

            {/* Language and Timezone */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Regional Settings</h3>
              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                    Language
                  </label>
                  <select
                    id="language"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="CST">Central Time</option>
                    <option value="PST">Pacific Time</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
