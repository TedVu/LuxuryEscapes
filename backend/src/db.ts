import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use in-memory database for tests, file-based for development
const isTest = process.env.NODE_ENV === 'test';
const dbPath = isTest ? ':memory:' : path.join(__dirname, '../../data/bookings.db');

// Ensure data directory exists for file-based database
if (!isTest) {
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

const db = new Database(dbPath);

export function initializeDatabase() {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL REFERENCES properties(id),
      name TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      price_per_night DECIMAL(10,2) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL REFERENCES rooms(id),
      guest_name TEXT NOT NULL,
      guest_email TEXT NOT NULL,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Check if data already exists
  const propertyCount = db.prepare('SELECT COUNT(*) as count FROM properties').get() as { count: number };

  if (propertyCount.count === 0) {
    seedDatabase();
  }
}

function seedDatabase() {
  // Insert properties
  const insertProperty = db.prepare(`
    INSERT INTO properties (name, location, description, image)
    VALUES (?, ?, ?, ?)
  `);

  const grandHyattId = insertProperty.run(
    'Grand Hyatt Bali',
    'Nusa Dua, Bali',
    'A stunning beachfront resort featuring Balinese-inspired architecture, world-class dining, and luxurious spa facilities.',
    'grand-hyatt-bali.webp'
  ).lastInsertRowid;

  const starGrandId = insertProperty.run(
    'The Star Grand Hotel',
    'Sydney, New South Wales',
    'A premium hotel in the heart of Sydney with spectacular harbour views, fine dining, and proximity to major attractions.',
    'the-star-grand-hotel.webp'
  ).lastInsertRowid;

  const crownMetropolId = insertProperty.run(
    'Crown Metropol Perth',
    'Perth, Western Australia',
    'A contemporary luxury hotel offering sophisticated accommodation, exceptional dining experiences, and stunning Swan River views.',
    'crown-metropol-perth.webp'
  ).lastInsertRowid;

  // Insert rooms
  const insertRoom = db.prepare(`
    INSERT INTO rooms (property_id, name, capacity, price_per_night)
    VALUES (?, ?, ?, ?)
  `);

  // Grand Hyatt Bali rooms
  const poolVillaId = insertRoom.run(grandHyattId, 'Pool Villa', 4, 850.00).lastInsertRowid;
  const oceanViewSuiteId = insertRoom.run(grandHyattId, 'Ocean View Suite', 2, 650.00).lastInsertRowid;
  insertRoom.run(grandHyattId, 'Garden View Room', 2, 450.00);

  // The Star Grand Hotel rooms
  const harbourViewSuiteId = insertRoom.run(starGrandId, 'Harbour View Suite', 2, 750.00).lastInsertRowid;
  insertRoom.run(starGrandId, 'Executive Room', 2, 550.00);
  insertRoom.run(starGrandId, 'Deluxe Room', 2, 400.00);

  // Crown Metropol Perth rooms
  const riverViewSuiteId = insertRoom.run(crownMetropolId, 'River View Suite', 2, 680.00).lastInsertRowid;
  insertRoom.run(crownMetropolId, 'Club Room', 2, 520.00);
  insertRoom.run(crownMetropolId, 'Superior Room', 2, 380.00);

  // Insert bookings (mix of past, current, and future)
  const insertBooking = db.prepare(`
    INSERT INTO bookings (room_id, guest_name, guest_email, check_in, check_out)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Past booking (Pool Villa - Grand Hyatt Bali)
  insertBooking.run(poolVillaId, 'John Smith', 'john.smith@email.com', '2025-01-10', '2025-01-15');

  // Current/recent booking (Ocean View Suite - Grand Hyatt Bali)
  insertBooking.run(oceanViewSuiteId, 'Sarah Johnson', 'sarah.j@email.com', '2025-02-01', '2025-02-08');

  // Future booking (Harbour View Suite - The Star Grand Hotel)
  insertBooking.run(harbourViewSuiteId, 'Mike Wilson', 'mike.w@email.com', '2025-03-15', '2025-03-22');

  // Future booking (River View Suite - Crown Metropol Perth)
  insertBooking.run(riverViewSuiteId, 'Emily Brown', 'emily.b@email.com', '2025-04-01', '2025-04-05');
}

export function resetDatabase() {
  // Drop and recreate tables to reset auto-increment counters
  db.exec(`
    DROP TABLE IF EXISTS bookings;
    DROP TABLE IF EXISTS rooms;
    DROP TABLE IF EXISTS properties;
  `);

  // Recreate tables
  db.exec(`
    CREATE TABLE properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT,
      image TEXT
    );

    CREATE TABLE rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL REFERENCES properties(id),
      name TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      price_per_night DECIMAL(10,2) NOT NULL
    );

    CREATE TABLE bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL REFERENCES rooms(id),
      guest_name TEXT NOT NULL,
      guest_email TEXT NOT NULL,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedDatabase();
}

export default db;
