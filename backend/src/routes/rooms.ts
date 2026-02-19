import { Router } from 'express';
import db from '../db.js';
import type { RoomWithProperty } from '../types.js';

const router = Router();

// GET /api/rooms/:id - Get single room with property info
router.get('/:id', (req, res) => {
  try {
    const roomId = parseInt(req.params.id, 10);

    if (isNaN(roomId)) {
      return res.status(400).json({ error: 'Invalid room ID' });
    }

    const stmt = db.prepare(`
      SELECT
        r.*,
        p.name as property_name,
        p.location as property_location
      FROM rooms r
      JOIN properties p ON r.property_id = p.id
      WHERE r.id = ?
    `);

    const room = stmt.get(roomId) as RoomWithProperty | undefined;

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

export default router;
