import db from '../db.js';
import type { Booking, CreateBookingInput } from '../types.js';

export function validateBooking(input: CreateBookingInput): void {
  // Validate required fields
  if (!input.guest_name || input.guest_name.trim() === '') {
    throw new Error('Guest name is required');
  }

  if (!input.guest_email || input.guest_email.trim() === '') {
    throw new Error('Guest email is required');
  }

  if (!input.check_in) {
    throw new Error('Check-in date is required');
  }

  if (!input.check_out) {
    throw new Error('Check-out date is required');
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(input.check_in)) {
    throw new Error('Check-in date must be in YYYY-MM-DD format');
  }

  if (!dateRegex.test(input.check_out)) {
    throw new Error('Check-out date must be in YYYY-MM-DD format');
  }

  const checkInDate = new Date(input.check_in + 'T00:00:00');
  if (isNaN(checkInDate.getTime())) {
    throw new Error('Check-in date is not a valid date');
  }

  const checkOutDate = new Date(input.check_out + 'T00:00:00');
  if (isNaN(checkOutDate.getTime())) {
    throw new Error('Check-out date is not a valid date');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkInDate < today) {
    throw new Error('Check-in date must be today or later');
  }

  if (checkOutDate <= checkInDate) {
    throw new Error('Check-out date must be after the check-in date');
  }

  if (!input.room_id) {
    throw new Error('Room ID is required');
  }
}

export function createBooking(input: CreateBookingInput): Booking {
  // Validate the booking input
  validateBooking(input);

  // Verify room exists
  const room = db.prepare('SELECT id FROM rooms WHERE id = ?').get(input.room_id);
  if (!room) {
    throw new Error('Room not found');
  }

  // Insert the booking
  const stmt = db.prepare(`
    INSERT INTO bookings (room_id, guest_name, guest_email, check_in, check_out)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    input.room_id,
    input.guest_name.trim(),
    input.guest_email.trim(),
    input.check_in,
    input.check_out
  );

  // Return the created booking
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid) as Booking;
  return booking;
}

export function getBookingsByRoom(roomId: number): Booking[] {
  const stmt = db.prepare('SELECT * FROM bookings WHERE room_id = ? ORDER BY check_in');
  return stmt.all(roomId) as Booking[];
}

export function getAllBookings(): Booking[] {
  const stmt = db.prepare('SELECT * FROM bookings ORDER BY check_in');
  return stmt.all() as Booking[];
}

export function getBookingById(id: number): Booking | undefined {
  const stmt = db.prepare('SELECT * FROM bookings WHERE id = ?');
  return stmt.get(id) as Booking | undefined;
}
