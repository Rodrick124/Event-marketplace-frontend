import React from 'react';
import { FaTicketAlt, FaDollarSign, FaUsers, FaChartLine } from 'react-icons/fa';

const Analytics = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-6">Analytics</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">$0</p>
            </div>
            <FaDollarSign className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-xs text-gray-400 mt-2">+0% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tickets Sold</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <FaTicketAlt className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-xs text-gray-400 mt-2">+0% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Attendees</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <FaUsers className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-xs text-gray-400 mt-2">+0% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Event Growth</p>
              <p className="text-2xl font-bold">0%</p>
            </div>
            <FaChartLine className="h-8 w-8 text-orange-500" />
          </div>
          <p className="text-xs text-gray-400 mt-2">+0% from last month</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Revenue Over Time</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart placeholder - Revenue trend
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Ticket Sales by Event</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart placeholder - Event performance
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Popular Event Categories</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart placeholder - Category distribution
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Attendee Demographics</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart placeholder - Demographics data
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
