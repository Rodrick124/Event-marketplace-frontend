import { Outlet, Link } from 'react-router-dom';

const OrganizerLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Organizer Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/organizer" className="text-xl font-bold text-gray-800">
              Organizer Dashboard
            </Link>
            <nav className="flex space-x-4">
              <Link to="/organizer/events" className="text-gray-600 hover:text-gray-900">
                My Events
              </Link>
              <Link to="/organizer/tickets" className="text-gray-600 hover:text-gray-900">
                Tickets
              </Link>
              <Link to="/organizer/settings" className="text-gray-600 hover:text-gray-900">
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Organizer Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <nav className="space-y-2">
                <Link
                  to="/organizer/dashboard"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Dashboard
                </Link>
                <Link
                  to="/organizer/events"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  My Events
                </Link>
                <Link
                  to="/organizer/tickets"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Ticket Management
                </Link>
                <Link
                  to="/organizer/analytics"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Analytics
                </Link>
                <Link
                  to="/organizer/reports"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Reports
                </Link>
                <Link
                  to="/organizer/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Settings
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-span-9">
            <div className="bg-white rounded-lg shadow p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default OrganizerLayout;