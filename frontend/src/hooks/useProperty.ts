import { useState, useEffect } from 'react';
import { fetchProperty } from '../api';
import type { PropertyWithRooms } from '../types';

export function useProperty(id: number) {
  const [property, setProperty] = useState<PropertyWithRooms | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProperty() {
      try {
        setLoading(true);
        const data = await fetchProperty(id);
        setProperty(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load property');
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [id]);

  return { property, loading, error };
}
