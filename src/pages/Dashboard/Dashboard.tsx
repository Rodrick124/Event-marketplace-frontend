import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Route, Routes, useNavigate } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import Profile from './Profile';
import MyEvents from './MyEvents';
import Settings from './Settings';
import API from '../../services/axios';

interface AttendeeDashboardStats {
  upcoming: any[];
  past: any[];
  spending: number;
}

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <Routes>
            <Route index element={<DashboardHome user={user} />} />
            <Route path="profile" element={<Profile />} />
            <Route path="my-events" element={<MyEvents />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const DashboardHome = ({ user }: { user: any }) => {
  const [stats, setStats] = useState<AttendeeDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get<AttendeeDashboardStats>('/dashboard/attendee');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Welcome, {user.name}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">Upcoming Events</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.upcoming?.length || 0}</p>
          <p className="text-sm text-gray-500">Events you've registered for</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">Past Events</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.past?.length || 0}</p>
          <p className="text-sm text-gray-500">Events you've attended</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">Total Spending</h3>
          <p className="text-3xl font-bold text-purple-600">
            {formatCurrency(stats?.spending || 0)}
          </p>
          <p className="text-sm text-gray-500">On event tickets</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
