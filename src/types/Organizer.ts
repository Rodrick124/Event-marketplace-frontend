export interface EventLocation {
  address: string;
  city: string;
  country: string;
}

export interface OrganizerEvent {
  _id: string;
  title: string;
  description: string;
  image: string;
  imageUrl: string;
  date: string;
  time: string;
  location: EventLocation | string; // string for backward compatibility in MyEvents
  price: number;
  capacity: number;
  totalSeats: number;
  availableSeats: number;
  category: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed' | 'pending' | 'rejected';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  organizer: {
    _id: string;
    name: string;
  };
  totalReservations?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  date: string;
  location: EventLocation;
  price: number;
  totalSeats: number;
  category: string;
  status: 'draft' | 'pending';
}

export type UpdateEventPayload = Partial<
  Omit<
    OrganizerEvent,
    | 'location'
    | '_id'
    | 'organizer'
    | 'createdAt'
    | 'updatedAt'
  > & { location: Partial<EventLocation> }
>;

