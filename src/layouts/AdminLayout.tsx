import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="text-xl font-bold text-gray-800">
              Admin Dashboard
            </Link>
            <nav className="flex space-x-4">
              <Link to="/admin/users" className="text-gray-600 hover:text-gray-900">
                Users
              </Link>
              <Link to="/admin/events" className="text-gray-600 hover:text-gray-900">
                Events
              </Link>
              <Link to="/admin/settings" className="text-gray-600 hover:text-gray-900">
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Admin Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link to="/admin/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/events" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  Manage Events
                </Link>
              </li>
              <li>
                <Link to="/admin/users" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  Manage Users
                </Link>
              </li>
              <li>
                <Link to="/admin/organizers" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  Manage Organizers
                </Link>
              </li>
              <li>
                <Link to="/admin/reports" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  Reports
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;