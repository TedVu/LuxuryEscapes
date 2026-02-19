import type { Property, PropertyWithRooms, RoomWithProperty, Booking, CreateBookingInput, ApiError } from './types';

const API_BASE = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || 'An error occurred');
  }
  return response.json();
}

export async function fetchProperties(): Promise<Property[]> {
  const response = await fetch(`${API_BASE}/properties`);
  return handleResponse<Property[]>(response);
}

export async function fetchProperty(id: number): Promise<PropertyWithRooms> {
  const response = await fetch(`${API_BASE}/properties/${id}`);
  return handleResponse<PropertyWithRooms>(response);
}

export async function fetchRoom(id: number): Promise<RoomWithProperty> {
  const response = await fetch(`${API_BASE}/rooms/${id}`);
  return handleResponse<RoomWithProperty>(response);
}

export async function fetchBookings(roomId?: number): Promise<Booking[]> {
  const url = roomId
    ? `${API_BASE}/bookings?room_id=${roomId}`
    : `${API_BASE}/bookings`;
  const response = await fetch(url);
  return handleResponse<Booking[]>(response);
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const response = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  });
  return handleResponse<Booking>(response);
}
