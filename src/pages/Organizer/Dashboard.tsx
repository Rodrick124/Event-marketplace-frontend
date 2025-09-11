import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Route, Routes, useNavigate } from 'react-router-dom';
import OrganizerSidebar from './OrganizerSidebar';
import Profile from './Profile';
import MyEvents from './MyEvents';
import Settings from './Settings';
import Reservations from './Reservations';
import CreateEvent from './CreateEvent';
import EditEvent from './EditEvent'; // Assuming this component will be created
import { OrganizerApiService, OrganizerDashboardStats, OrganizerAnalyticsData, OrganizerEvent } from '../../services/organizerApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaEye, FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaDollarSign, FaTag } from 'react-icons/fa';

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
            <Route path="reservations" element={<Reservations />} />
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
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [analyticsData, setAnalyticsData] = useState<OrganizerAnalyticsData[]>([]);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [period, setPeriod] = useState('30d'); // '7d', '30d', '90d'

  const [recentEvents, setRecentEvents] = useState<OrganizerEvent[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  const [viewingEvent, setViewingEvent] = useState<OrganizerEvent | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsStatsLoading(true);
        setStatsError(null);
        const data = await OrganizerApiService.getDashboardStats();
        setStats(data);
      } catch (err: any) {
        setStatsError(err.message || 'Failed to load dashboard data.');
        console.error('Failed to fetch organizer dashboard stats:', err);
      } finally {
        setIsStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsAnalyticsLoading(true);
        setAnalyticsError(null);
        const data = await OrganizerApiService.getAnalyticsData(period);
        setAnalyticsData(data);
      } catch (err: any) {
        setAnalyticsError(err.message || 'Failed to load analytics data.');
      } finally {
        setIsAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        setIsEventsLoading(true);
        setEventsError(null);
        // Fetch top 5 recent events
        const { events } = await OrganizerApiService.getEvents({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' });
        setRecentEvents(events);
      } catch (err: any) {
        setEventsError(err.message || 'Failed to load recent events.');
        console.error('Failed to fetch recent events:', err);
      } finally {
        setIsEventsLoading(false);
      }
    };
    fetchRecentEvents();
  }, []);

  const totalRevenue = analyticsData.reduce((sum, item) => sum + item.revenue, 0);
  const totalReservations = analyticsData.reduce((sum, item) => sum + item.reservations, 0);

  const formatXAxis = (tickItem: string) => {
    return new Date(tickItem).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleViewDetails = async (eventId: string) => {
    try {
      const eventDetails = await OrganizerApiService.getEventDetails(eventId);
      setViewingEvent(eventDetails);
    } catch (error) {
      console.error("Failed to fetch event details for modal:", error);
      // Optionally, show an error to the user
    }
  };

  if (isStatsLoading || isEventsLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (statsError || eventsError) {
    return <div className="text-red-500 bg-red-100 p-4 rounded-md">Error: {statsError || eventsError}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Welcome, {user.name}!</h1>
      
      {/* Quick Stats */}
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Overall Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <hr className="my-8 border-t border-gray-200" />

      {/* Analytics Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Performance Analytics</h2>
          <div className="flex space-x-2">
            {['7d', '30d', '90d'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  period === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Last {p.replace('d', '')} days
              </button>
            ))}
          </div>
        </div>

        {isAnalyticsLoading ? (
          <div>Loading analytics...</div>
        ) : analyticsError ? (
          <div className="text-red-500 bg-red-100 p-4 rounded-md">Error: {analyticsError}</div>
        ) : (
          <>
            {/* Stat Cards for period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-600">Total Revenue ({period.replace('d', ' days')})</h3>
                <p className="text-3xl font-bold text-green-600">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-600">Total Reservations ({period.replace('d', ' days')})</h3>
                <p className="text-3xl font-bold text-blue-600">{totalReservations.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Revenue Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h3 className="text-lg font-medium mb-4">Revenue Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatXAxis} />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} name="Revenue" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Reservations Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-4">Reservations Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatXAxis} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="reservations" stroke="#2563eb" strokeWidth={2} name="Reservations" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>

      <hr className="my-8 border-t border-gray-200" />

      {/* Recent Events Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Recent Events</h2>
        {isEventsLoading ? (
          <div>Loading recent events...</div>
        ) : eventsError ? (
          <div className="text-red-500 bg-red-100 p-4 rounded-md">Error: {eventsError}</div>
        ) : recentEvents.length > 0 ? (
          <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales/Capacity</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentEvents.map((event) => (
                  <tr key={event._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-500">{event.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        event.status === 'published' ? 'bg-green-100 text-green-800' :
                        event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.totalReservations ?? 0} / {event.capacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleViewDetails(event._id)} className="text-blue-600 hover:text-blue-900">
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No recent events to display.</p>
        )}
      </div>

      {viewingEvent && (
        <EventDetailsModal event={viewingEvent} onClose={() => setViewingEvent(null)} />
      )}
    </div>
  );
};

interface EventDetailsModalProps {
  event: OrganizerEvent;
  onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose }) => {
  // Modal to display event details.
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FaTimes className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4">
            <img src={event.imageUrl} alt={event.title} className="w-full h-64 object-cover rounded-lg shadow-sm" />
          </div>

          <p className="text-gray-600 mb-6">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Date & Time</p>
                <p className="text-gray-800">{new Date(event.date).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-gray-800">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaDollarSign className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Price</p>
                <p className="text-gray-800">${event.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaUsers className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Capacity</p>
                <p className="text-gray-800">{event.capacity}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaTag className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-gray-800">{event.category}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${event.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-gray-800 capitalize">{event.status}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
            <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
