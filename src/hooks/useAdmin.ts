import { useState, useEffect, useCallback } from 'react';
import { AdminStats, AdminUser, AdminEvent, AdminReservation, ActivityLog, AdminFilters } from '../types/Admin';
import { AdminApiService } from '../services/adminApi';

interface UseAdminReturn {
  stats: AdminStats | null;
  users: AdminUser[];
  events: AdminEvent[];
  reservations: AdminReservation[];
  activityLogs: ActivityLog[];
  isLoading: boolean;
  error: string | null;
  pagination: any;
  refetchStats: () => Promise<void>;
  refetchUsers: (filters?: AdminFilters) => Promise<void>;
  refetchEvents: (filters?: AdminFilters) => Promise<void>;
  refetchReservations: (filters?: AdminFilters) => Promise<void>;
  refetchActivityLogs: (filters?: AdminFilters) => Promise<void>;
  toggleUserBan: (userId: string, banned: boolean) => Promise<void>;
  updateEventApproval: (eventId: string, status: 'approved' | 'rejected', reason?: string) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  updateUserVerification: (userId: string, status: 'verified' | 'rejected', reason?: string) => Promise<void>;
  exportData: (type: 'users' | 'events' | 'reservations', filters?: AdminFilters) => Promise<void>;
}

export const useAdmin = (): UseAdminReturn => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const refetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const statsData = await AdminApiService.getDashboardStats();
      setStats(statsData);
    } catch (err: any) {
      console.error('Error fetching admin stats:', err);
      setError(err.message || 'Failed to fetch statistics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetchUsers = useCallback(async (filters: AdminFilters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const { users: usersData, pagination: paginationData } = await AdminApiService.getUsers(filters);
      setUsers(usersData);
      setPagination(paginationData);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetchEvents = useCallback(async (filters: AdminFilters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const { events: eventsData, pagination: paginationData } = await AdminApiService.getEvents(filters);
      setEvents(eventsData);
      setPagination(paginationData);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetchReservations = useCallback(async (filters: AdminFilters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const { reservations: reservationsData, pagination: paginationData } = await AdminApiService.getReservations(filters);
      setReservations(reservationsData);
      setPagination(paginationData);
    } catch (err: any) {
      console.error('Error fetching reservations:', err);
      setError(err.message || 'Failed to fetch reservations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetchActivityLogs = useCallback(async (filters: AdminFilters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const { logs: logsData, pagination: paginationData } = await AdminApiService.getActivityLogs(filters);
      setActivityLogs(logsData);
      setPagination(paginationData);
    } catch (err: any) {
      console.error('Error fetching activity logs:', err);
      setError(err.message || 'Failed to fetch activity logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleUserBan = useCallback(async (userId: string, banned: boolean) => {
    try {
      await AdminApiService.toggleUserBan(userId, banned);
      
      // Update local state
      setUsers(prev => 
        prev.map(user => 
          user.id === userId || user._id === userId
            ? { ...user, isBanned: banned, isActive: !banned }
            : user
        )
      );

      // Refetch stats to get updated counts
      await refetchStats();
    } catch (err: any) {
      console.error('Error toggling user ban:', err);
      throw new Error(err.message || 'Failed to update user status');
    }
  }, [refetchStats]);

  const updateEventApproval = useCallback(async (eventId: string, status: 'approved' | 'rejected', reason?: string) => {
    try {
      await AdminApiService.updateEventApproval(eventId, status, reason);
      
      // Update local state
      setEvents(prev => 
        prev.map(event => 
          event._id === eventId
            ? { ...event, approvalStatus: status, isApproved: status === 'approved' }
            : event
        )
      );

      // Refetch stats to get updated counts
      await refetchStats();
    } catch (err: any) {
      console.error('Error updating event approval:', err);
      throw new Error(err.message || 'Failed to update event approval');
    }
  }, [refetchStats]);

  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      await AdminApiService.deleteEvent(eventId);
      
      // Remove from local state
      setEvents(prev => prev.filter(event => event._id !== eventId));

      // Refetch stats to get updated counts
      await refetchStats();
    } catch (err: any) {
      console.error('Error deleting event:', err);
      throw new Error(err.message || 'Failed to delete event');
    }
  }, [refetchStats]);

  const updateUserVerification = useCallback(async (userId: string, status: 'verified' | 'rejected', reason?: string) => {
    try {
      await AdminApiService.updateUserVerification(userId, status, reason);
      
      // Update local state
      setUsers(prev => 
        prev.map(user => 
          user.id === userId || user._id === userId
            ? { ...user, verificationStatus: status }
            : user
        )
      );

      // Refetch stats to get updated counts
      await refetchStats();
    } catch (err: any) {
      console.error('Error updating user verification:', err);
      throw new Error(err.message || 'Failed to update user verification');
    }
  }, [refetchStats]);

  const exportData = useCallback(async (type: 'users' | 'events' | 'reservations', filters: AdminFilters = {}) => {
    try {
      const blob = await AdminApiService.exportData(type, filters);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error exporting data:', err);
      throw new Error(err.message || 'Failed to export data');
    }
  }, []);

  // Initial load of stats
  useEffect(() => {
    refetchStats();
  }, [refetchStats]);

  return {
    stats,
    users,
    events,
    reservations,
    activityLogs,
    isLoading,
    error,
    pagination,
    refetchStats,
    refetchUsers,
    refetchEvents,
    refetchReservations,
    refetchActivityLogs,
    toggleUserBan,
    updateEventApproval,
    deleteEvent,
    updateUserVerification,
    exportData
  };
};