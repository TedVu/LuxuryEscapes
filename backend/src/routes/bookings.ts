import { Router } from 'express';
import { createBooking, getAllBookings, getBookingsByRoom, getBookingById } from '../services/bookings.js';
import type { CreateBookingInput } from '../types.js';

const router = Router();

// GET /api/bookings - List all bookings (optionally filter by room)
router.get('/', (req, res) => {
  try {
    const roomId = req.query.room_id ? parseInt(req.query.room_id as string, 10) : null;

    if (roomId !== null && isNaN(roomId)) {
      return res.status(400).json({ error: 'Invalid room ID' });
    }

    const bookings = roomId ? getBookingsByRoom(roomId) : getAllBookings();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// GET /api/bookings/:id - Get single booking
router.get('/:id', (req, res) => {
  try {
    const bookingId = parseInt(req.params.id, 10);

    if (isNaN(bookingId)) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }

    const booking = getBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// POST /api/bookings - Create a new booking
router.post('/', (req, res) => {
  try {
    const input: CreateBookingInput = {
      room_id: req.body.room_id,
      guest_name: req.body.guest_name,
      guest_email: req.body.guest_email,
      check_in: req.body.check_in,
      check_out: req.body.check_out
    };

    const booking = createBooking(input);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);

    if (error instanceof Error) {
      // Return validation errors as 400 Bad Request
      if (
        error.message.includes('required') ||
        error.message.includes('not found') ||
        error.message.includes('Invalid')
      ) {
        return res.status(400).json({ error: error.message });
      }
    }

    res.status(500).json({ error: 'Failed to create booking' });
  }
});

export default router;
