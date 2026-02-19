export interface Property {
  id: number;
  name: string;
  location: string;
  description: string | null;
  image: string | null;
}

export interface Room {
  id: number;
  property_id: number;
  name: string;
  capacity: number;
  price_per_night: number;
}

export interface Booking {
  id: number;
  room_id: number;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  created_at: string;
}

export interface CreateBookingInput {
  room_id: number;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
}

export interface PropertyWithRooms extends Property {
  rooms: Room[];
}

export interface RoomWithProperty extends Room {
  property_name: string;
  property_location: string;
}
