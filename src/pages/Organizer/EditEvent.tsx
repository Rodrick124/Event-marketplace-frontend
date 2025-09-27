import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OrganizerApiService } from '../../services/organizerApi';
// @ts-expect-error: Organizer types may be missing during build
import type { OrganizerEvent, UpdateEventPayload } from '../../types/Organizer';

const EditEvent: React.FC = () => {
  const { eventId } = useParams<{ eventId?: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<UpdateEventPayload>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      navigate('/organizer/my-events');
      return;
    }

    const fetchEvent = async () => {
      try {
        const event = await OrganizerApiService.getEventDetails(eventId);
        const date = new Date(event.date).toISOString().substring(0, 16);
        setFormData({ ...event, date });
        if (event.image) {
          setImagePreview(event.image);
        }
      } catch (err: any) {
      setError(err.message || 'Failed to load event data.');
      toast.error(err.message || 'Failed to load event data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1] as keyof NonNullable<UpdateEventPayload['location']>;
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return;

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await OrganizerApiService.updateEvent(eventId, formData, imageFile);
      setSuccessMessage('Event updated and submitted for review successfully!');
      toast.success('Event updated and submitted for review successfully!');
      setTimeout(() => navigate('/organizer/my-events'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading event data...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Edit Event</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm space-y-6">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
        {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">{successMessage}</div>}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
          <input type="text" name="title" id="title" value={formData.title || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 py-2 px-4" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" id="description" rows={4} value={formData.description || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 py-2 px-4"></textarea>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Event Image</label>
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Event Preview" className="h-48 w-auto rounded-md object-cover shadow-sm" />
            </div>
          )}
          <div className="mt-2">
            <input
              type="file"
              name="image"
              id="image"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date and Time</label>
            <input type="datetime-local" name="date" id="date" value={formData.date || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 py-2 px-4" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input type="text" name="location.address" placeholder="Address" value={formData.location?.address || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 py-2 px-4" />
              <input type="text" name="location.city" placeholder="City" value={formData.location?.city || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 py-2 px-4" />
              <input type="text" name="location.country" placeholder="Country" value={formData.location?.country || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 py-2 px-4" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input type="number" name="price" id="price" value={formData.price || 0} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 py-2 px-4" />
          </div>
          <div>
            <label htmlFor="totalSeats" className="block text-sm font-medium text-gray-700">Total Seats</label>
            <input type="number" name="totalSeats" id="totalSeats" value={formData.totalSeats || 1} onChange={handleChange} required min="1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 py-2 px-4" />
          </div>
           <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <input type="text" name="category" id="category" value={formData.category || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 py-2 px-4" />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
           <button type="button" onClick={() => navigate('/organizer/my-events')} className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            {isSubmitting ? 'Submitting...' : 'Update & Submit for Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;