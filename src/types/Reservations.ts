import { Event } from './Events';

export interface Reservation {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  event: Event;
  reservationDate: string;
  ticketQuantity: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'refunded';
  paymentStatus: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
}

export interface Ticket {
  _id: string;
  reservationId: string;
  eventId: string;
  userId: string;
  ticketNumber: string;
  status: 'valid' | 'used' | 'cancelled';
  issuedAt: string;
  usedAt?: string;
}
