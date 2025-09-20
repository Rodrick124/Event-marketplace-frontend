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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await API.get('/dashboard/profile');
        const { data } = extractData<UserProfile>(response.data);
        setProfile(data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to load profile data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
      
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Profile Details</h3>
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
    </div>
  );
};

export default Profile;