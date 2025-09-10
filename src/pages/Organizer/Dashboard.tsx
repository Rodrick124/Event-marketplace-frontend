import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Route, Routes, useNavigate } from 'react-router-dom';
import OrganizerSidebar from './OrganizerSidebar';
import Profile from './Profile';
import MyEvents from './MyEvents';
import Settings from './Settings';
import Analytics from './Analytics';
import CreateEvent from './CreateEvent';
import EditEvent from './EditEvent'; // Assuming this component will be created
import { OrganizerApiService, OrganizerDashboardStats } from '../../services/organizerApi';

const OrganizerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated or not an organizer
  React.useEffect(() => {
  if (!isAuthenticated) {
    navigate('/login');
    return;
  }
  if (user && user.role !== 'organizer') {
    navigate('/unauthorized'); // or appropriate page
  }
}, [isAuthenticated, user?.role, navigate]);


if (!isAuthenticated || !user) {
  return <div>Loading...</div>;
}

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <OrganizerSidebar />
        <main className="flex-1 p-8">
          <Routes>
            <Route index element={<DashboardHome user={user} />} />
            <Route path="profile" element={<Profile />} />
            <Route path="my-events" element={<MyEvents />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="create-event" element={<CreateEvent />} />
            <Route path="edit-event/:eventId" element={<EditEvent />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const DashboardHome = ({ user }: { user: any }) => {
  const [stats, setStats] = useState<OrganizerDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await OrganizerApiService.getDashboardStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data.');
        console.error('Failed to fetch organizer dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <div>Loading dashboard stats...</div>;
  }

  if (error) {
    return <div className="text-red-500 bg-red-100 p-4 rounded-md">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Welcome, {user.name}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">Total Events</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalEvents ?? 0}</p>
          <p className="text-sm text-gray-500">Published events</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">Ticket Sales</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.ticketSales ?? 0}</p>
          <p className="text-sm text-gray-500">Total tickets sold</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">${stats?.revenue?.toLocaleString() ?? '0.00'}</p>
          <p className="text-sm text-gray-500">Total earnings</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">Active Events</h3>
          <p className="text-3xl font-bold text-orange-600">{stats?.activeEvents ?? 0}</p>
          <p className="text-sm text-gray-500">Currently live</p>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
