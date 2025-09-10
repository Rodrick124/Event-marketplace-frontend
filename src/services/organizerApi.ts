import API from './axios';
import { extractData } from './response';
import { AdminFilters, AdminApiResponse } from '../types/Admin';
import { CreateEventPayload, UpdateEventPayload, OrganizerEvent } from '../types/Organizer';

export interface OrganizerDashboardStats {
  totalEvents: number;
  ticketSales: number;
  revenue: number;
  activeEvents: number;
}

export interface OrganizerAnalyticsData {
  date: string;
  revenue: number;
  reservations: number;
}

/**
 * API service for organizer-related actions.
 * Note: The API endpoints used here (e.g., /organizer/events) are assumed based on project structure
 * and may need to be adjusted to match the actual backend implementation.
 */
export class OrganizerApiService {
  /**
   * Get dashboard stats for the current organizer.
   */
  static async getDashboardStats(): Promise<OrganizerDashboardStats> {
    try {
      // Assuming the endpoint is /dashboard/organizer based on your request
      // and similar patterns in ADMIN_API_ENDPOINTS.md
      const response = await API.get<AdminApiResponse<OrganizerDashboardStats>>(`/dashboard/organizer`);
      const { data } = extractData<OrganizerDashboardStats>(response.data);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }

  /**
   * Get analytics data for the current organizer.
   * @param period - The time period for the analytics (e.g., '7d', '30d', '90d').
   */
  static async getAnalyticsData(period: string = '30d'): Promise<OrganizerAnalyticsData[]> {
    try {
      const response = await API.get<AdminApiResponse<OrganizerAnalyticsData[]>>(`/dashboard/organizer/analytics?period=${period}`);
      const { data } = extractData<OrganizerAnalyticsData[]>(response.data);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch analytics data');
    }
  }

  /**
   * Get events for the current organizer.
   * @param filters - Optional filters for pagination, searching, and sorting.
   */
  static async getEvents(filters: AdminFilters = {}): Promise<{ events: OrganizerEvent[], pagination?: any }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await API.get<AdminApiResponse<OrganizerEvent[]>>(`/dashboard/organizer/events?${params.toString()}`);
      const { data, pagination } = extractData<OrganizerEvent[] | { events: OrganizerEvent[]; data?: OrganizerEvent[] }>(response.data);

      const list = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.events)
          ? (data as any).events
          : Array.isArray((data as any)?.data)
            ? (data as any).data
            : [];

      return { events: list, pagination };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch events');
    }
  }

  /**
   * Get a single event by ID.
   * @param eventId - The ID of the event to retrieve.
   */
  static async getEventDetails(eventId: string): Promise<OrganizerEvent> {
    try {
      const response = await API.get<AdminApiResponse<OrganizerEvent>>(`/dashboard/organizer/events/${eventId}`);
      const { data } = extractData<OrganizerEvent | { event: OrganizerEvent }>(response.data);
      const event = (data as any)?.event ? (data as any).event : data;
      if ((event as any)?._id) {
        return event as OrganizerEvent;
      }
      throw new Error('Event not found in response');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch event details');
    }
  }

  /**
   * Create a new event.
   * @param eventData - The data for the new event.
   */
  static async createEvent(eventData: CreateEventPayload): Promise<OrganizerEvent> {
    try {
      const response = await API.post<AdminApiResponse<OrganizerEvent>>('/dashboard/organizer/events', eventData);
      const { data } = extractData<OrganizerEvent>(response.data);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create event');
    }
  }

  /**
   * Update an existing event.
   * @param eventId - The ID of the event to update.
   * @param eventData - The data to update.
   */
  static async updateEvent(eventId: string, eventData: UpdateEventPayload): Promise<OrganizerEvent> {
    try {
      const response = await API.put<AdminApiResponse<OrganizerEvent>>(`/dashboard/organizer/events/${eventId}`, eventData);
      const { data } = extractData<OrganizerEvent>(response.data);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update event');
    }
  }

  /**
   * Delete an event.
   * @param eventId - The ID of the event to delete.
   */
  static async deleteEvent(eventId: string): Promise<void> {
    try {
      await API.delete(`/dashboard/organizer/events/${eventId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete event');
    }
  }
}
