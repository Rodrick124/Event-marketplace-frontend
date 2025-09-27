import React, { useEffect, useState } from 'react';
import { Event } from '../types/Events'; 
import API from '../services/axios';
import { extractData } from '../services/response';
import { formatLocation } from '../utils/format';
import EventFilter from './EventFilter';
import EventCard from './EventCard';

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6); // Show 6 events per page

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get('/events');
        const { data } = extractData<Event[] | any>(response.data);
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.results)
              ? data.results
              : Array.isArray(data?.data)
                ? data.data
                : [];

        setEvents(list);
        setFilteredEvents(list);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleFilterChange = (filters: { location: string; category: string; sortBy: string }) => {
    let filtered = events;
    if (filters.location) {
      filtered = filtered.filter(e =>
        formatLocation(e.location).toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.category) {
      filtered = filtered.filter(e => e.category.toLowerCase().includes(filters.category.toLowerCase()));
    }

    // Sort events
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (filters.sortBy === 'date-asc') {
        return dateA - dateB;
      }
      return dateB - dateA;
    });

    setFilteredEvents(filtered);
  };

  // Pagination Logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) return <div className="text-gray-500">Loading events...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Upcoming Events</h1>
      <EventFilter onFilterChange={handleFilterChange} />
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {currentEvents.map(event => <EventCard key={event._id} event={event} />)}
      </div>

      {/* Pagination Controls */}
      <div className="mt-8 flex justify-center">
        <nav>
          <ul className="flex items-center -space-x-px h-10 text-base">
            <li>
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50">
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i}>
                <button onClick={() => paginate(i + 1)} className={`flex items-center justify-center px-4 h-10 leading-tight ${currentPage === i + 1 ? 'text-blue-600 border border-blue-300 bg-blue-50' : 'text-gray-500 bg-white border border-gray-300'} hover:bg-gray-100 hover:text-gray-700`}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li>
              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50">
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default EventList;