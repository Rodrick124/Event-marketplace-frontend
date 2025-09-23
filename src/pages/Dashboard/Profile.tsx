import React, { useState, useEffect } from 'react';
import API from '../../services/axios';
import { extractData } from '../../services/response';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  profile: {
    avatar?: string;
    phone?: string;
    bio?: string;
    organization?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    organization: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await API.get('/auth/me');
        const { data } = extractData<UserProfile>(response.data);
        setProfile(data);
        setFormData({
          name: data.name,
          phone: data.profile.phone || '',
          bio: data.profile.bio || '',
          organization: data.profile.organization || '',
        });
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to load profile data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdateError(null);
    if (profile) {
      setFormData({
        name: profile.name,
        phone: profile.profile.phone || '',
        bio: profile.profile.bio || '',
        organization: profile.profile.organization || '',
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUpdateError(null);
    try {
      const payload = {
        name: formData.name,
        profile: {
          phone: formData.phone,
          bio: formData.bio,
          organization: formData.organization,
        },
      };
      const response = await API.patch('/dashboard/profile', payload);
      const { data: updatedProfile } = extractData<UserProfile>(response.data);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (err: any) {
      setUpdateError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center p-8">Could not load profile.</div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center mb-8 pb-8 border-b border-gray-200">
        <img
          src={profile.profile.avatar || `https://i.pravatar.cc/150?u=${profile.email}`}
          alt="User Avatar"
          className="w-24 h-24 rounded-full mr-0 sm:mr-6 mb-4 sm:mb-0 object-cover"
        />
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold text-gray-800">{profile.name}</h2>
          <p className="text-md text-gray-500">{profile.email}</p>
          <div className="mt-2 flex items-center justify-center sm:justify-start space-x-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize">
              {profile.role}
            </span>
            <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
              profile.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {profile.status}
            </span>
          </div>
        </div>
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSave}>
          <h3 className="text-xl font-semibold text-gray-700 mb-6">Edit Profile</h3>
          {updateError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {updateError}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="text" name="phone" id="phone" value={formData.phone} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700">Organization</label>
              <input type="text" name="organization" id="organization" value={formData.organization} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea name="bio" id="bio" rows={4} value={formData.bio} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Profile Details</h3>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Profile
            </button>
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
              <dd className="mt-1 text-md text-gray-900">{profile.profile.phone || 'Not provided'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Organization</dt>
              <dd className="mt-1 text-md text-gray-900">{profile.profile.organization || 'Not provided'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Bio</dt>
              <dd className="mt-1 text-md text-gray-900 whitespace-pre-wrap">{profile.profile.bio || 'Not provided'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Member Since</dt>
              <dd className="mt-1 text-md text-gray-900">{new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-md text-gray-900">{new Date(profile.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
};

export default Profile;