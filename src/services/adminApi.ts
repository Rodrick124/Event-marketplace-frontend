import API from './axios';
import { extractData } from './response';
import { 
  AdminStats, 
  AdminUser, 
  AdminEvent, 
  AdminReservation, 
  ActivityLog,
  RevenueData,
  UserGrowthData,
  AdminApiResponse,
  AdminFilters
} from '../types/Admin';

export class AdminApiService {
  /**
   * Get admin dashboard statistics
   */
  static async getDashboardStats(): Promise<AdminStats> {
    try {
      const response = await API.get<AdminApiResponse<AdminStats>>('/dashboard/admin');
      const { data } = extractData<AdminStats | { stats: AdminStats }>(response.data);
      if ((data as any)?.totalUsers !== undefined) {
        return data as AdminStats;
      }
      if ((data as any)?.stats) {
        return (data as any).stats as AdminStats;
      }
      throw new Error('Invalid response structure');
    } catch (error: any) {
      console.error('Error fetching admin stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard statistics');
    }
  }

  /**
   * Get all users with admin details
   */
  static async getUsers(filters: AdminFilters = {}): Promise<{ users: AdminUser[], pagination?: any }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await API.get<AdminApiResponse<AdminUser[]>>(`/dashboard/admin/users?${params}`);
      const { data, pagination } = extractData<AdminUser[] | { users: AdminUser[]; data?: AdminUser[] }>(response.data);
      const list = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.users)
          ? (data as any).users
          : Array.isArray((data as any)?.data)
            ? (data as any).data
            : [];
      return { users: list, pagination };
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  }

  /**
   * Get all events with admin details
   */
  static async getEvents(filters: AdminFilters = {}): Promise<{ events: AdminEvent[], pagination?: any }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await API.get<AdminApiResponse<AdminEvent[]>>(`/dashboard/admin/events?${params}`);
      const { data, pagination } = extractData<AdminEvent[] | { events: AdminEvent[]; data?: AdminEvent[] }>(response.data);
      const list = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.events)
          ? (data as any).events
          : Array.isArray((data as any)?.data)
            ? (data as any).data
            : [];
      return { events: list, pagination };
    } catch (error: any) {
      console.error('Error fetching events:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch events');
    }
  }

  /**
   * Get all reservations with admin details
   */
  static async getReservations(filters: AdminFilters = {}): Promise<{ reservations: AdminReservation[], pagination?: any }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await API.get<AdminApiResponse<AdminReservation[]>>(`/dashboard/admin/reservations?${params}`);
      const { data, pagination } = extractData<AdminReservation[] | { reservations: AdminReservation[]; data?: AdminReservation[] }>(response.data);
      const list = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.reservations)
          ? (data as any).reservations
          : Array.isArray((data as any)?.data)
            ? (data as any).data
            : [];
      return { reservations: list, pagination };
    } catch (error: any) {
      console.error('Error fetching reservations:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch reservations');
    }
  }

  /**
   * Get activity logs
   */
  static async getActivityLogs(filters: AdminFilters = {}): Promise<{ logs: ActivityLog[], pagination?: any }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await API.get<AdminApiResponse<ActivityLog[]>>(`/dashboard/admin/activity-logs?${params}`);
      const { data, pagination } = extractData<ActivityLog[] | { logs: ActivityLog[]; data?: ActivityLog[] }>(response.data);
      const list = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.logs)
          ? (data as any).logs
          : Array.isArray((data as any)?.data)
            ? (data as any).data
            : [];
      return { logs: list, pagination };
    } catch (error: any) {
      console.error('Error fetching activity logs:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch activity logs');
    }
  }

  /**
   * Get revenue analytics data
   */
  static async getRevenueAnalytics(period: 'week' | 'month' | 'year' = 'month'): Promise<RevenueData[]> {
    try {
      const response = await API.get<AdminApiResponse<RevenueData[]>>(`/dashboard/admin/analytics/revenue?period=${period}`);
      const { data } = extractData<RevenueData[] | { data: RevenueData[] }>(response.data);
      const list = Array.isArray(data) ? data : Array.isArray((data as any)?.data) ? (data as any).data : [];
      return list;
    } catch (error: any) {
      console.error('Error fetching revenue analytics:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch revenue analytics');
    }
  }

  /**
   * Get user growth analytics data
   */
  static async getUserGrowthAnalytics(period: 'week' | 'month' | 'year' = 'month'): Promise<UserGrowthData[]> {
    try {
      const response = await API.get<AdminApiResponse<UserGrowthData[]>>(`/dashboard/admin/analytics/users?period=${period}`);
      const { data } = extractData<UserGrowthData[] | { data: UserGrowthData[] }>(response.data);
      const list = Array.isArray(data) ? data : Array.isArray((data as any)?.data) ? (data as any).data : [];
      return list;
    } catch (error: any) {
      console.error('Error fetching user growth analytics:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user growth analytics');
    }
  }

  /**
   * Ban/Unban a user
   */
  static async toggleUserBan(userId: string, banned: boolean): Promise<void> {
    try {
      await API.patch(`/dashboard/admin/users/${userId}/ban`, { banned });
    } catch (error: any) {
      console.error('Error toggling user ban:', error);
      throw new Error(error.response?.data?.message || 'Failed to update user status');
    }
  }

  /**
   * Updates the approval status of an event.
   * @param eventId The ID of the event to update.
   * @param status The new status for the event.
   */
  static async updateEventStatus(
    eventId: string,
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<{ _id: string; status: string }> {
    try {
      const response = await API.patch<AdminApiResponse<{ _id: string; status: string }>>(`/dashboard/admin/events/${eventId}/status`, { status });
      const { data } = extractData<{ _id: string; status: string }>(response.data);
      return data;
    } catch (error: any) {
      console.error('Error updating event status:', error);
      throw new Error(error.response?.data?.message || 'Failed to update event status');
    }
  }

  /**
   * Delete an event
   */
  static async deleteEvent(eventId: string): Promise<void> {
    try {
      await API.delete(`/dashboard/admin/events/${eventId}`);
    } catch (error: any) {
      console.error('Error deleting event:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete event');
    }
  }

  /**
   * Update user verification status
   */
  static async updateUserVerification(userId: string, status: 'verified' | 'rejected', reason?: string): Promise<void> {
    try {
      await API.patch(`/dashboard/admin/users/${userId}/verification`, { status, reason });
    } catch (error: any) {
      console.error('Error updating user verification:', error);
      throw new Error(error.response?.data?.message || 'Failed to update user verification');
    }
  }

  /**
   * Get detailed user information
   */
  static async getUserDetails(userId: string): Promise<AdminUser> {
    try {
      const response = await API.get<AdminApiResponse<AdminUser>>(`/dashboard/admin/users/${userId}`);
      const { data } = extractData<AdminUser | { user: AdminUser }>(response.data);
      const user = (data as any)?.user ? (data as any).user : data;
      if ((user as any)?.id || (user as any)?._id) {
        return user as AdminUser;
      }
      throw new Error('User not found');
    } catch (error: any) {
      console.error('Error fetching user details:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user details');
    }
  }

  /**
   * Get detailed event information
   */
  static async getEventDetails(eventId: string): Promise<AdminEvent> {
    try {
      const response = await API.get<AdminApiResponse<AdminEvent>>(`/admin/events/${eventId}`);
      const { data } = extractData<AdminEvent | { event: AdminEvent }>(response.data);
      const event = (data as any)?.event ? (data as any).event : data;
      if ((event as any)?._id) {
        return event as AdminEvent;
      }
      throw new Error('Event not found');
    } catch (error: any) {
      console.error('Error fetching event details:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch event details');
    }
  }

  /**
   * Export data to CSV
   */
  static async exportData(type: 'users' | 'events' | 'reservations', filters: AdminFilters = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await API.get(`/admin/export/${type}?${params}`, {
        responseType: 'blob'
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error exporting data:', error);
      throw new Error(error.response?.data?.message || 'Failed to export data');
    }
  }
}