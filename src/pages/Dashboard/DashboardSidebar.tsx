import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaCalendar, FaCog, FaHome } from 'react-icons/fa';

const DashboardSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/dashboard/profile', label: 'Profile', icon: FaUser },
    { path: '/dashboard/my-events', label: 'My Events', icon: FaCalendar },
    { path: '/dashboard/settings', label: 'Settings', icon: FaCog },
  ];

  return (
    <aside className="w-64 bg-white h-screen shadow-md">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800">My Dashboard</h2>
      </div>
      <nav className="mt-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm ${
                isActive
                  ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
