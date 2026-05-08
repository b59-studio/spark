import { useState, useCallback } from 'react';
import { DISTRICT_LAYERS } from '../data/layers.config';
import type { DistrictLayer } from '../types/district.types';

export function useMapLayers() {
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(
    new Set(DISTRICT_LAYERS.filter(l => l.defaultVisible).map(l => l.id))
  );
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  const toggleLayer = useCallback((layerId: string) => {
    setVisibleLayers(prev => {
      const next = new Set(prev);
      if (next.has(layerId)) {
        next.delete(layerId);
      } else {
        next.add(layerId);
      }
      return next;
    });
  }, []);

  // Exclusive mode: show only one layer at a time (radio button behavior)
  const selectExclusive = useCallback((layerId: string) => {
    setVisibleLayers(new Set([layerId]));
    setActiveLayer(layerId);
  }, []);

  // Show all layers in a category
  const toggleCategory = useCallback((category: string, layers: DistrictLayer[]) => {
    const categoryIds = layers
      .filter(l => l.category === category)
      .map(l => l.id);
    setVisibleLayers(prev => {
      const allVisible = categoryIds.every(id => prev.has(id));
      const next = new Set(prev);
      categoryIds.forEach(id => allVisible ? next.delete(id) : next.add(id));
      return next;
    });
  }, []);

  return { visibleLayers, activeLayer, toggleLayer, selectExclusive, toggleCategory };
}