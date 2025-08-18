import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaChartBar, 
  FaHistory, 
  FaCog,
  FaShieldAlt
} from 'react-icons/fa';

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: FaHome },
    { path: '/admin/users', label: 'User Management', icon: FaUsers },
    { path: '/admin/events', label: 'Event Management', icon: FaCalendarAlt },
    { path: '/admin/reservations', label: 'Reservations', icon: FaClipboardList },
    { path: '/admin/analytics', label: 'Analytics', icon: FaChartBar },
    { path: '/admin/activity-logs', label: 'Activity Logs', icon: FaHistory },
    { path: '/admin/settings', label: 'Settings', icon: FaCog },
  ];

  return (
    <aside className="w-64 bg-white h-screen shadow-md border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <FaShieldAlt className="h-8 w-8 text-red-600 mr-3" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
            <p className="text-sm text-gray-500">Event Marketplace</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm transition-colors duration-200 ${
                isActive
                  ? 'text-red-600 bg-red-50 border-r-4 border-red-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Admin Dashboard v1.0</p>
          <p>© 2024 Event Marketplace</p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;