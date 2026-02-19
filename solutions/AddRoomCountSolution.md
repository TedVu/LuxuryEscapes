# Add Room Count to Property Cards

**Maps to:** Optional Warm-up Task

## Overview

Add a room count display to each property card on the homepage.

## Backend Changes

### Option 1: Modify the properties query (Recommended)

In `backend/src/routes/properties.ts`, update the GET `/api/properties` endpoint:

```typescript
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT
        p.*,
        COUNT(r.id) as room_count
      FROM properties p
      LEFT JOIN rooms r ON r.property_id = p.id
      GROUP BY p.id
      ORDER BY p.name
    `);
    const properties = stmt.all();
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});
```

### Option 2: Use a subquery

```typescript
const stmt = db.prepare(`
  SELECT
    p.*,
    (SELECT COUNT(*) FROM rooms WHERE property_id = p.id) as room_count
  FROM properties p
  ORDER BY p.name
`);
```

## Frontend Changes

### Update the Property type

In `frontend/src/types.ts`:

```typescript
export interface Property {
  id: number;
  name: string;
  location: string;
  description: string | null;
  room_count?: number;  // Add this line
}
```

### Update PropertyCard component

In `frontend/src/components/PropertyCard.tsx`:

```typescript
import { Link } from 'react-router-dom';
import type { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link to={`/properties/${property.id}`} className="property-card">
      <h2>{property.name}</h2>
      <p className="location">{property.location}</p>
      {property.room_count !== undefined && (
        <p className="room-count">
          {property.room_count} {property.room_count === 1 ? 'room' : 'rooms'}
        </p>
      )}
      {property.description && (
        <p className="description">{property.description}</p>
      )}
    </Link>
  );
}
```

### Add styling (optional)

In `frontend/src/index.css`:

```css
.property-card .room-count {
  color: #3498db;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}
```

## Key Learning Points

1. **SQL JOINs**: The `LEFT JOIN` ensures properties with no rooms still appear (with count 0)
2. **GROUP BY**: Required when using aggregate functions like `COUNT()`
3. **Optional chaining**: The `room_count?` in TypeScript marks it as optional for backwards compatibility
4. **Pluralization**: Simple conditional to show "1 room" vs "2 rooms"
