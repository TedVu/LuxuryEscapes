import { describe, it, expect, beforeEach } from 'vitest';
import { createBooking, validateBooking } from '../src/services/bookings.js';
import { initializeDatabase, resetDatabase } from '../src/db.js';
import { format, addDays, subDays } from 'date-fns';

// Initialize database before tests
beforeEach(() => {
  initializeDatabase();
  resetDatabase();
});

// Helper to format dates
const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

// Get test dates relative to today
const today = new Date();
const tomorrow = addDays(today, 1);
const nextWeek = addDays(today, 7);
const yesterday = subDays(today, 1);
const lastWeek = subDays(today, 7);

describe('Booking Validation', () => {
  // This test should PASS - valid booking is created
  it('should create a valid booking successfully', () => {
    const booking = createBooking({
      room_id: 1,
      guest_name: 'Test Guest',
      guest_email: 'test@example.com',
      check_in: formatDate(tomorrow),
      check_out: formatDate(nextWeek)
    });

    expect(booking).toBeDefined();
    expect(booking.id).toBeDefined();
    expect(booking.guest_name).toBe('Test Guest');
    expect(booking.guest_email).toBe('test@example.com');
  });

  // This test should PASS - missing guest_name is rejected
  it('should reject booking with missing guest_name', () => {
    expect(() => {
      createBooking({
        room_id: 1,
        guest_name: '',
        guest_email: 'test@example.com',
        check_in: formatDate(tomorrow),
        check_out: formatDate(nextWeek)
      });
    }).toThrow('Guest name is required');
  });

  // This test should FAIL - exposes the bug
  // The validation should reject bookings where check_out is before check_in
  it('should reject booking where check_out is before check_in', () => {
    expect(() => {
      createBooking({
        room_id: 1,
        guest_name: 'Test Guest',
        guest_email: 'test@example.com',
        check_in: formatDate(nextWeek),
        check_out: formatDate(tomorrow) // check_out is BEFORE check_in!
      });
    }).toThrow(); // Should throw an error about invalid dates
  });

  // This test should FAIL - exposes the bug
  // The validation should reject bookings where check_out equals check_in (0-night stay)
  it('should reject booking where check_out equals check_in', () => {
    expect(() => {
      createBooking({
        room_id: 1,
        guest_name: 'Test Guest',
        guest_email: 'test@example.com',
        check_in: formatDate(tomorrow),
        check_out: formatDate(tomorrow) // Same date = 0-night stay
      });
    }).toThrow(); // Should throw an error about invalid dates
  });

  // This test should FAIL - exposes the bug
  // The validation should reject bookings where check_in is in the past
  it('should reject booking where check_in is in the past', () => {
    expect(() => {
      createBooking({
        room_id: 1,
        guest_name: 'Test Guest',
        guest_email: 'test@example.com',
        check_in: formatDate(lastWeek), // In the past!
        check_out: formatDate(yesterday)
      });
    }).toThrow(); // Should throw an error about past dates
  });

  // Additional passing tests for completeness
  it('should reject booking with missing guest_email', () => {
    expect(() => {
      createBooking({
        room_id: 1,
        guest_name: 'Test Guest',
        guest_email: '',
        check_in: formatDate(tomorrow),
        check_out: formatDate(nextWeek)
      });
    }).toThrow('Guest email is required');
  });

  it('should reject booking with missing check_in date', () => {
    expect(() => {
      createBooking({
        room_id: 1,
        guest_name: 'Test Guest',
        guest_email: 'test@example.com',
        check_in: '',
        check_out: formatDate(nextWeek)
      });
    }).toThrow('Check-in date is required');
  });

  it('should reject booking for non-existent room', () => {
    expect(() => {
      createBooking({
        room_id: 9999,
        guest_name: 'Test Guest',
        guest_email: 'test@example.com',
        check_in: formatDate(tomorrow),
        check_out: formatDate(nextWeek)
      });
    }).toThrow('Room not found');
  });
});

describe('Overlapping Booking Validation', () => {
  const checkIn = addDays(today, 3);
  const checkOut = addDays(today, 7);

  // Seed an existing booking before each test in this suite
  beforeEach(() => {
    createBooking({
      room_id: 1,
      guest_name: 'Existing Guest',
      guest_email: 'existing@example.com',
      check_in: formatDate(checkIn),
      check_out: formatDate(checkOut),
    });
  });

  it('should reject a booking that fully overlaps an existing booking', () => {
    expect(() => {
      createBooking({
        room_id: 1,
        guest_name: 'New Guest',
        guest_email: 'new@example.com',
        check_in: formatDate(checkIn),
        check_out: formatDate(checkOut),
      });
    }).toThrow('overlap');
  });

  it('should reject a booking that starts during an existing booking', () => {
    expect(() => {
      createBooking({
        room_id: 1,
        guest_name: 'New Guest',
        guest_email: 'new@example.com',
        check_in: formatDate(addDays(checkIn, 1)),
        check_out: formatDate(addDays(checkOut, 3)),
      });
    }).toThrow('overlap');
  });

  it('should reject a booking that ends during an existing booking', () => {
    expect(() => {
      createBooking({
        room_id: 1,
        guest_name: 'New Guest',
        guest_email: 'new@example.com',
        check_in: formatDate(addDays(checkIn, -2)),
        check_out: formatDate(addDays(checkIn, 2)),
      });
    }).toThrow('overlap');
  });

  it('should reject a booking that wraps around an existing booking', () => {
    expect(() => {
      createBooking({
        room_id: 1,
        guest_name: 'New Guest',
        guest_email: 'new@example.com',
        check_in: formatDate(addDays(checkIn, -1)),
        check_out: formatDate(addDays(checkOut, 1)),
      });
    }).toThrow('overlap');
  });

  it('should allow a booking that ends exactly on the existing check-in (no overlap)', () => {
    const booking = createBooking({
      room_id: 1,
      guest_name: 'New Guest',
      guest_email: 'new@example.com',
      check_in: formatDate(tomorrow),
      check_out: formatDate(checkIn), // ends when existing starts
    });

    expect(booking).toBeDefined();
    expect(booking.id).toBeDefined();
  });

  it('should allow a booking that starts exactly on the existing check-out (no overlap)', () => {
    const booking = createBooking({
      room_id: 1,
      guest_name: 'New Guest',
      guest_email: 'new@example.com',
      check_in: formatDate(checkOut), // starts when existing ends
      check_out: formatDate(addDays(checkOut, 3)),
    });

    expect(booking).toBeDefined();
    expect(booking.id).toBeDefined();
  });

  it('should allow overlapping dates on a different room', () => {
    const booking = createBooking({
      room_id: 2,
      guest_name: 'New Guest',
      guest_email: 'new@example.com',
      check_in: formatDate(checkIn),
      check_out: formatDate(checkOut),
    });

    expect(booking).toBeDefined();
    expect(booking.id).toBeDefined();
  });
});
