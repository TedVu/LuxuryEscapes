import { Router } from 'express';
import db from '../db.js';
import type { Property, PropertyWithRooms, Room } from '../types.js';

const router = Router();

// GET /api/properties - List all properties
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM properties ORDER BY name');
    const properties = stmt.all() as Property[];
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// GET /api/properties/:id - Get single property with its rooms
router.get('/:id', (req, res) => {
  try {
    const propertyId = parseInt(req.params.id, 10);

    if (isNaN(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(propertyId) as Property | undefined;

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const rooms = db.prepare('SELECT * FROM rooms WHERE property_id = ? ORDER BY price_per_night').all(propertyId) as Room[];

    const result: PropertyWithRooms = {
      ...property,
      rooms
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

export default router;
