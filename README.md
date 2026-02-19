# Hotel Booking System - Technical Interview

Welcome! This is a simple hotel booking system that you'll be working with during your interview. You'll be fixing a bug and building features to demonstrate your fullstack development skills.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Setup

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Start the development servers
npm run dev

# The app will be available at:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:3000
```

### Running Tests

```bash
# Run backend tests
cd backend && npm test
```

## Project Structure

```
booking-interview/
├── frontend/                # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── api.ts           # API fetch functions
│   │   └── types.ts         # TypeScript types
│   └── ...
├── backend/                 # Express + TypeScript + SQLite
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic
│   │   ├── db.ts            # Database setup
│   │   └── types.ts         # TypeScript types
│   └── tests/               # Backend tests
├── database/
│   └── seed.sql             # Database schema and seed data
└── solutions/               # Reference solutions (don't peek!)
```

## The Application

This is a hotel booking system with:

- **Properties**: Hotels/resorts with different locations
- **Rooms**: Each property has multiple rooms with different capacities and prices. Important simplification: in real life, properties have different "room types", with many physical rooms of each type (eg - 100 "Standard Rooms", 10 "Deluxe Rooms, and 3 "Suites"). In the simplified world of this codebase, each property has just a few rooms - and these represent physical rooms, not "room types". This will become obvious once you start the application - but to be concrete, the Crown Metropol, in this interview world, has only 3 physical rooms, each of different types. It could handle only 3 parties staying on any one night.
- **Bookings**: Guests can book rooms for specific date ranges

Currently, you can:
- View all properties on the homepage
- Click a property to see its rooms
- Book a room using the booking form

---

## Before we start

Please initialise a git repository for this project, and commit the existing codebase, without any of your changes.

This makes it easy for both you and us to see what's changed as we go through the interview, and also roll back if needed.

## Optional Warm-up Task

> **Not assessed** - This is just to help you get familiar with the codebase.

The property list page shows properties but doesn't show how many rooms each property has.

**Task**: Add a room count to each property card, displaying something like "5 rooms".

This will help you understand how data flows from the backend to the frontend. A sample solution is in `solutions/AddRoomCountSolution.md` if you get stuck.

---

## A Note About Tools

You're welcome to use AI assistants, documentation, Google, or any other resources—just as you would in your normal work. We're interested in seeing how you approach problems, not whether you have everything memorized.

---

## Useful Commands

```bash
# Start development servers
npm run dev

# Run backend tests
cd backend && npm test

# Run tests in watch mode
cd backend && npm run test:watch
```

Good luck! We're excited to see your approach.
