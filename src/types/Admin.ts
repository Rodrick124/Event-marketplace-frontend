import { User } from '../context/types';
import { Event } from './Events';
import { Reservation, Ticket } from './Reservations';

export interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalReservations: number;
  totalRevenue: number;
  activeEvents: number;
  pendingReservations: number;
  newUsersThisMonth: number;
  revenueThisMonth: number;
  topCategories: CategoryStats[];
  recentActivity: ActivityLog[];
}

export interface CategoryStats {
  category: string;
  eventCount: number;
  revenue: number;
  reservationCount: number;
}

export interface ActivityLog {
  _id: string;
  type: 'user_registration' | 'event_created' | 'reservation_made' | 'event_cancelled' | 'user_banned';
  description: string;
  userId?: string;
  eventId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AdminUser extends User {
  registrationDate: string;
  lastLoginDate?: string;
  isActive: boolean;
  isBanned: boolean;
  totalReservations: number;
  totalSpent: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface AdminEvent extends Event {
  organizer: {
    _id: string;
    name: string;
    email: string;
  };
  totalReservations: number;
  totalRevenue: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
  isApproved: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
}

export interface AdminReservation extends Reservation {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RevenueData {
  date: string;
  revenue: number;
  reservations: number;
}

export interface UserGrowthData {
  date: string;
  newUsers: number;
  totalUsers: number;
}

export interface AdminApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AdminFilters {
  search?: string;
  status?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}