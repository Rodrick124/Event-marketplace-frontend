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

export interface OrganizerReservation {
  _id: string;
  event: {
    _id: string;
    title: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  quantity: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'pending';
  createdAt: string;
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
    } catch (error) {
      throw new Error((error as any).response?.data?.message || 'Failed to fetch dashboard stats');
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
    } catch (error) {
      throw new Error((error as any).response?.data?.message || 'Failed to fetch analytics data');
    }
  }

  /**
   * Cancel a reservation.
   * @param reservationId - The ID of the reservation to cancel.
   */
  static async cancelReservation(reservationId: string): Promise<OrganizerReservation> {
    try {
      // Using PATCH as we are updating the status of the reservation.
      const response = await API.patch<AdminApiResponse<OrganizerReservation>>(`/dashboard/organizer/reservations/${reservationId}/cancel`);
      const { data } = extractData<OrganizerReservation>(response.data);
      return data;
    } catch (error) {
      throw new Error((error as any).response?.data?.message || 'Failed to cancel reservation');
    }
  }

  /**
   * Get reservations for the current organizer's events.
   * @param filters - Optional filters for pagination, searching, and sorting.
   */
  static async getReservations(filters: AdminFilters = {}): Promise<{ reservations: OrganizerReservation[], pagination?: any }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await API.get<AdminApiResponse<OrganizerReservation[]>>(`/dashboard/organizer/reservations?${params.toString()}`);
      const { data, pagination } = extractData<OrganizerReservation[] | { reservations: OrganizerReservation[]; data?: OrganizerReservation[] }>(response.data);

      const list = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.reservations)
          ? (data as any).reservations
          : Array.isArray((data as any)?.data)
            ? (data as any).data
            : [];

      return { reservations: list, pagination };
    } catch (error) {
      throw new Error((error as any).response?.data?.message || 'Failed to fetch reservations');
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
    } catch (error) {
      throw new Error((error as any).response?.data?.message || 'Failed to fetch events');
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
    } catch (error) {
      throw new Error((error as any).response?.data?.message || 'Failed to fetch event details');
    }
  }

  /**
   * Create a new event.
   * @param eventData - The data for the new event.
   * @param imageFile - The image file for the event.
   */
  static async createEvent(eventData: CreateEventPayload, imageFile?: File | null): Promise<OrganizerEvent> {
    try {
      const payload = new FormData();

      // Append text fields to FormData
      for (const key in eventData) {
        if (Object.prototype.hasOwnProperty.call(eventData, key)) {
          const value = (eventData as any)[key];
          if (value !== null && value !== undefined) {
            if (key === 'location' && typeof value === 'object' && value !== null) {
              // Handle nested location object for FormData
              payload.append('location[address]', value.address || '');
              payload.append('location[city]', value.city || '');
              payload.append('location[country]', value.country || '');
            } else if (key === 'date' && typeof value === 'string') {
              // Convert local datetime string to ISO string for the backend
              payload.append(key, new Date(value).toISOString());
            } else {
              payload.append(key, String(value));
            }
          }
        }
      }

      // Append the new image file if it exists
      if (imageFile) {
        payload.append('image', imageFile);
      }

      const response = await API.post<AdminApiResponse<OrganizerEvent>>('/dashboard/organizer/create-event', payload);
      const { data } = extractData<OrganizerEvent>(response.data);
      return data;
    } catch (error) {
      throw new Error((error as any).response?.data?.message || 'Failed to create event');
    }
  }

  /**
   * Update an existing event.
   * @param eventId - The ID of the event to update.
   * @param eventData - The data to update.
   */
  static async updateEvent(eventId: string, eventData: UpdateEventPayload, imageFile?: File | null): Promise<OrganizerEvent> {
    try {
      const payload = new FormData();

      // Append text fields to FormData
      for (const key in eventData) {
        if (Object.prototype.hasOwnProperty.call(eventData, key)) {
          const value = (eventData as any)[key];
          // Exclude fields that should not be sent or are handled differently
          if (key !== '_id' && key !== 'organizer' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'imageUrl' && key !== '__v' && value !== null && value !== undefined) {
            if (key === 'date' && typeof value === 'string') {
              // Convert local datetime string to ISO string for the backend
              payload.append(key, new Date(value).toISOString());
            } else {
              payload.append(key, String(value));
            }
          }
        }
      }

      // Append the new image file if it exists
      if (imageFile) {
        payload.append('image', imageFile);
      }

      const response = await API.put<AdminApiResponse<OrganizerEvent>>(`/dashboard/organizer/events/${eventId}`, payload);
      const { data } = extractData<OrganizerEvent>(response.data);
      return data;
    } catch (error) {
      throw new Error((error as any).response?.data?.message || 'Failed to update event');
    }
  }

  /**
   * Delete an event.
   * @param eventId - The ID of the event to delete.
   */
  static async deleteEvent(eventId: string): Promise<void> {
    try {
      await API.delete(`/dashboard/organizer/events/${eventId}`);
    } catch (error) {
      throw new Error((error as any).response?.data?.message || 'Failed to delete event');
    }
  }
}
