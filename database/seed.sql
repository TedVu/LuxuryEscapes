-- Schema for Hotel Booking System

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  image TEXT
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL REFERENCES properties(id),
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL REFERENCES rooms(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Properties
INSERT INTO properties (name, location, description, image) VALUES
  ('Grand Hyatt Bali', 'Nusa Dua, Bali', 'A stunning beachfront resort featuring Balinese-inspired architecture, world-class dining, and luxurious spa facilities.', 'grand-hyatt-bali.webp'),
  ('The Star Grand Hotel', 'Sydney, New South Wales', 'A premium hotel in the heart of Sydney with spectacular harbour views, fine dining, and proximity to major attractions.', 'the-star-grand-hotel.webp'),
  ('Crown Metropol Perth', 'Perth, Western Australia', 'A contemporary luxury hotel offering sophisticated accommodation, exceptional dining experiences, and stunning Swan River views.', 'crown-metropol-perth.webp');

-- Seed Rooms
-- Grand Hyatt Bali (property_id = 1)
INSERT INTO rooms (property_id, name, capacity, price_per_night) VALUES
  (1, 'Pool Villa', 4, 850.00),
  (1, 'Ocean View Suite', 2, 650.00),
  (1, 'Garden View Room', 2, 450.00);

-- The Star Grand Hotel (property_id = 2)
INSERT INTO rooms (property_id, name, capacity, price_per_night) VALUES
  (2, 'Harbour View Suite', 2, 750.00),
  (2, 'Executive Room', 2, 550.00),
  (2, 'Deluxe Room', 2, 400.00);

-- Crown Metropol Perth (property_id = 3)
INSERT INTO rooms (property_id, name, capacity, price_per_night) VALUES
  (3, 'River View Suite', 2, 680.00),
  (3, 'Club Room', 2, 520.00),
  (3, 'Superior Room', 2, 380.00);

-- Seed Bookings (mix of past, current, and future)
INSERT INTO bookings (room_id, guest_name, guest_email, check_in, check_out) VALUES
  -- Past booking (Pool Villa - Grand Hyatt Bali)
  (1, 'John Smith', 'john.smith@email.com', '2025-01-10', '2025-01-15'),
  -- Current/recent booking (Ocean View Suite - Grand Hyatt Bali)
  (2, 'Sarah Johnson', 'sarah.j@email.com', '2025-02-01', '2025-02-08'),
  -- Future booking (Harbour View Suite - The Star Grand Hotel)
  (4, 'Mike Wilson', 'mike.w@email.com', '2025-03-15', '2025-03-22'),
  -- Future booking (River View Suite - Crown Metropol Perth)
  (6, 'Emily Brown', 'emily.b@email.com', '2025-04-01', '2025-04-05');
