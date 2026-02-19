import { useParams, Link } from 'react-router-dom';
import { useProperty } from '../hooks/useProperty';
import { RoomCard } from './RoomCard';

export function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const propertyId = parseInt(id || '0', 10);
  const { property, loading, error } = useProperty(propertyId);

  if (loading) {
    return <div className="loading">Loading property...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!property) {
    return <div className="error">Property not found</div>;
  }

  return (
    <div className="property-detail">
      <Link to="/" className="back-link">&larr; Back to Properties</Link>

      {property.image && (
        <img 
          src={`/images/${property.image}`} 
          alt={property.name}
          className="property-detail-image"
        />
      )}

      <div className="property-header">
        <h1>{property.name}</h1>
        <p className="location">{property.location}</p>
        {property.description && (
          <p className="description">{property.description}</p>
        )}
      </div>

      <div className="rooms-section">
        <h2>Available Rooms</h2>
        {property.rooms.length === 0 ? (
          <p>No rooms available at this property.</p>
        ) : (
          <div className="rooms-list">
            {property.rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
