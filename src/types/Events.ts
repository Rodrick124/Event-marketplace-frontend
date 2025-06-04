export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  price: number;
  category: string;
  image?: string;
  availableSeats: number;
  organizer?: {
    name: string;
    email: string;
  };
}

export interface EventApiResponse {
  success: boolean;
  message: string;
  data: Event[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

