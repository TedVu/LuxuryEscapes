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
