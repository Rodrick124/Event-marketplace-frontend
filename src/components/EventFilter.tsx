import { useState } from 'react';

interface EventFilterProps {
  onFilterChange: (filters: {
    location: string;
    category: string;
    sortBy: string;
  }) => void;
}

const EventFilter = ({ onFilterChange }: EventFilterProps) => {
  const [filters, setFilters] = useState({
    location: '',
    category: '',
    sortBy: 'date-asc',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Events</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Location Filter */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Enter city or venue"
            className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={filters.category}
            onChange={handleChange}
            placeholder="Enter event category"
            className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
          />
        </div>

        {/* Sort by Date */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
            Sort by
          </label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value="date-asc">Date (Soonest)</option>
            <option value="date-desc">Date (Latest)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EventFilter;