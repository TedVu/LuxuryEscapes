import { useState } from 'react';
import type { Room } from '../types';
import { BookingForm } from './BookingForm';

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const [showBookingForm, setShowBookingForm] = useState(false);

  return (
    <div className="room-card">
      <div className="room-info">
        <h3>{room.name}</h3>
        <div className="room-details">
          <span className="capacity">Up to {room.capacity} guests</span>
          <span className="price">${room.price_per_night.toFixed(2)} / night</span>
        </div>
      </div>

      {!showBookingForm ? (
        <button
          className="book-button"
          onClick={() => setShowBookingForm(true)}
        >
          Book This Room
        </button>
      ) : (
        <div className="booking-section">
          <BookingForm
            room={room}
            onSuccess={() => setShowBookingForm(false)}
          />
          <button
            className="cancel-button"
            onClick={() => setShowBookingForm(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
