import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/axios'; // Assuming you have an api service set up

// Define types based on the API documentation
interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const ContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });
      if (statusFilter) {
        params.append('status', statusFilter);
      }

      // Assuming your api service is configured to hit `/api`
      const response = await api.get(`/dashboard/admin/contact-messages?${params.toString()}`);
      
      setMessages(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch contact messages.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, sortOrder, statusFilter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleStatusChange = async (id: string, newStatus: ContactMessage['status']) => {
    try {
      await api.patch(`/dashboard/admin/contact-messages/${id}`, { status: newStatus });
      toast.success('Message status updated successfully!');
      // Refresh the list to show the updated status
      fetchMessages();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update message status.';
      toast.error(errorMessage);
    }
  };

  const handleSort = (field: string) => {
    const newSortOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newSortOrder);
  };

  if (loading && messages.length === 0) {
    return <div className="text-center p-8">Loading messages...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Contact Messages</h1>
      
      <div className="mb-4">
        <label htmlFor="status-filter" className="mr-2 font-semibold">Filter by status:</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="p-2 border rounded-md"
        >
          <option value="">All</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th onClick={() => handleSort('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Name</th>
              <th onClick={() => handleSort('email')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th onClick={() => handleSort('createdAt')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Received</th>
              <th onClick={() => handleSort('status')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.map((message) => (
              <tr key={message._id}>
                <td className="px-6 py-4 whitespace-nowrap">{message.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{message.email}</td>
                <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate" title={message.subject}>{message.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(message.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{message.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select 
                    value={message.status} 
                    onChange={(e) => handleStatusChange(message._id, e.target.value as ContactMessage['status'])}
                    className="p-1 border rounded-md"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.total > 0 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-700">
            Showing page {pagination.page} of {pagination.pages} ({pagination.total} total messages)
          </p>
          <div>
            <button 
              onClick={() => setPage(p => p - 1)} 
              disabled={page === 1}
              className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              onClick={() => setPage(p => p + 1)} 
              disabled={page === pagination.pages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;