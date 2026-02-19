import { useProperties } from '../hooks/useProperties';
import { PropertyCard } from './PropertyCard';

export function PropertyList() {
  const { properties, loading, error } = useProperties();

  if (loading) {
    return <div className="loading">Loading properties...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="property-list">
      <h1>Available Properties</h1>
      <div className="properties-grid">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
