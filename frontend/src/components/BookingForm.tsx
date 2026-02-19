import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { createBooking } from '../api';
import type { Room } from '../types';

interface BookingFormProps {
  room: Room;
  onSuccess?: () => void;
}

export function BookingForm({ room, onSuccess }: BookingFormProps) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    try {
      await createBooking({
        room_id: room.id,
        guest_name: guestName,
        guest_email: guestEmail,
        check_in: checkIn,
        check_out: checkOut
      });
      setSuccess(true);
      setGuestName('');
      setGuestEmail('');
      setCheckIn(today);
      setCheckOut(tomorrow);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h3>Book this Room</h3>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">Booking created successfully!</div>}

      <div className="form-group">
        <label htmlFor="guestName">Guest Name</label>
        <input
          type="text"
          id="guestName"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
          disabled={submitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="guestEmail">Guest Email</label>
        <input
          type="email"
          id="guestEmail"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          required
          disabled={submitting}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="checkIn">Check-in Date</label>
          <input
            type="date"
            id="checkIn"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="checkOut">Check-out Date</label>
          <input
            type="date"
            id="checkOut"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
            disabled={submitting}
          />
        </div>
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Booking...' : 'Book Now'}
      </button>
    </form>
  );
}
