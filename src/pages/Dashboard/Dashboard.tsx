import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Route, Routes, useNavigate, Link } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import Profile from './Profile';
import MyEvents from './MyEvents';
import MyPayments from './MyPayments';
import Settings from './Settings';
import API from '../../services/axios';

interface ReservationInfo {
  _id: string;
  eventId: { // This can be null if the event was deleted
    _id: string;
    name: string;
  } | null;
}

interface User {
  name: string;
}

interface AttendeeDashboardStats {
  upcoming: ReservationInfo[];
  past: ReservationInfo[];
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
            <Route path="payments" element={<MyPayments />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const DashboardHome = ({ user }: { user: User }) => {
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

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upcoming Events List */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Upcoming Events</h2>
          <div className="bg-white rounded-lg shadow-sm">
            {stats?.upcoming && stats.upcoming.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {stats.upcoming.map((reservation) =>
                  // Add a check to ensure eventId is not null to prevent crashes
                  reservation.eventId && (
                    <li key={reservation._id} className="px-6 py-4 flex justify-between items-center">
                      <span className="font-medium text-gray-800">{reservation.eventId.name}</span>
                      <Link to={`/event/${reservation.eventId._id}`} className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
                        View Details
                      </Link>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-500 p-6">You have no upcoming events.</p>
            )}
          </div>
        </div>

        {/* Past Events List */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Past Events</h2>
          <div className="bg-white rounded-lg shadow-sm">
            {stats?.past && stats.past.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {stats.past.map((reservation) =>
                  // Add a check to ensure eventId is not null to prevent crashes
                  reservation.eventId && (
                    <li key={reservation._id} className="px-6 py-4 flex justify-between items-center">
                      <span className="font-medium text-gray-800">{reservation.eventId.name}</span>
                      <Link to={`/event/${reservation.eventId._id}`} className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
                        View Details
                      </Link>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-500 p-6">You have no past events on record.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
