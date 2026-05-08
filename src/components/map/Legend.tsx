"use client";

import type { DistrictLayer } from "@/types/district.types";

interface LegendProps {
  layers: DistrictLayer[];
  visibleLayers: Set<string>;
  title?: string;
}

const getLegendDisplayColor = (layerColor: string): string => {
  const color = layerColor.toLowerCase();
  // Avoid low-contrast warm yellows on white legend backgrounds.
  if (color === "#e9c46a") return "#b45309";
  if (color === "#f4a261") return "#c2410c";
  return layerColor;
};

export function Legend({ layers, visibleLayers, title = "Legend" }: LegendProps) {
  const active = layers.filter((layer) => visibleLayers.has(layer.id));
  if (active.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        right: 12,
        bottom: 12,
        zIndex: 10,
        background: "white",
        color: "var(--color-map-ui-text-primary)",
        borderRadius: 8,
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        padding: "10px 12px",
        minWidth: 180,
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: 12,
          marginBottom: 6,
          color: "var(--color-map-ui-text-muted)",
        }}
      >
        {title}
      </div>
      {active.map((layer) => {
        const displayColor = getLegendDisplayColor(layer.color);
        return (
          <div
            key={layer.id}
            style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: `${displayColor}55`,
                border: `1px solid ${displayColor}`,
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 12, color: "var(--color-map-ui-text-primary)" }}>
              {layer.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
