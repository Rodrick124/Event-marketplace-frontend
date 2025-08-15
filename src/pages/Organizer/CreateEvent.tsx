import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    location: '',
    venue: '',
    capacity: '',
    ticketPrice: '',
    currency: 'USD',
    tags: '',
    imageUrl: '',
    isPublic: true,
    allowRegistration: true,
  });

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // await createEvent(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to my events page after successful creation
      navigate('/organizer/my-events');
    } catch (err) {
      setError('Failed to create event. Please try again.');
      console.error('Event creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/organizer');
  };

  const categories = [
    'Conference',
    'Workshop',
    'Seminar',
    'Networking',
    'Social',
    'Sports',
    'Entertainment',
    'Education',
    'Business',
    'Technology',
    'Arts & Culture',
    'Other'
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Create New Event</h1>
          <p className="text-gray-600 mt-2">Fill in the details below to create your event</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    disabled={isLoading}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    disabled={isLoading}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                    placeholder="Describe your event"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      disabled={isLoading}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      disabled={isLoading}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="e.g. networking, tech, startup (comma separated)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Date & Time</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    disabled={isLoading}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Time *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    disabled={isLoading}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location/Address *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={isLoading}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                    placeholder="Enter event location or address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Venue Name</label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    disabled={isLoading}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g. Conference Center, Hotel Name"
                  />
                </div>
              </div>
            </div>

            {/* Capacity & Pricing */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Capacity & Pricing</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Capacity *</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    disabled={isLoading}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                    min="1"
                    placeholder="Max attendees"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Ticket Price</label>
                  <input
                    type="number"
                    value={formData.ticketPrice}
                    onChange={(e) => handleInputChange('ticketPrice', e.target.value)}
                    disabled={isLoading}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    min="0"
                    step="0.01"
                    placeholder="0.00 (Free event)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    disabled={isLoading}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    disabled={isLoading}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="isPublic"
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                      disabled={isLoading}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublic" className="ml-3">
                      <span className="text-sm font-medium text-gray-700">Public Event</span>
                      <p className="text-sm text-gray-500">Make this event visible to everyone</p>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="allowRegistration"
                      type="checkbox"
                      checked={formData.allowRegistration}
                      onChange={(e) => handleInputChange('allowRegistration', e.target.checked)}
                      disabled={isLoading}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allowRegistration" className="ml-3">
                      <span className="text-sm font-medium text-gray-700">Allow Registration</span>
                      <p className="text-sm text-gray-500">Enable attendee registration for this event</p>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Event...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;