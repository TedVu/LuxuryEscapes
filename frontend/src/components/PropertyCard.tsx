import { Link } from 'react-router-dom';
import type { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link to={`/properties/${property.id}`} className="property-card">
      {property.image && (
        <img 
          src={`/images/${property.image}`} 
          alt={property.name}
          className="property-card-image"
        />
      )}
      <div className="property-card-content">
        <h2>{property.name}</h2>
        <p className="location">{property.location}</p>
        {property.description && (
          <p className="description">{property.description}</p>
        )}
      </div>
    </Link>
  );
}
