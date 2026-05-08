"use client";

import type { DistrictLayer } from "@/types/district.types";

interface LayerToggleProps {
  layer: DistrictLayer;
  checked: boolean;
  onToggle: (id: string) => void;
  onSelectExclusive?: (id: string) => void;
}

export function LayerToggle({
  layer,
  checked,
  onToggle,
  onSelectExclusive,
}: LayerToggleProps) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
        cursor: "pointer",
        gap: 10,
        background: checked ? `${layer.color}11` : "transparent",
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: 3,
          background: checked ? layer.color : "transparent",
          border: `2px solid ${layer.color}`,
          flexShrink: 0,
        }}
      />
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(layer.id)}
        style={{ display: "none" }}
      />
      <span style={{ fontSize: 13, flex: 1, color: "var(--color-map-ui-text-primary)" }}>
        {layer.label}
      </span>
      {onSelectExclusive ? (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            onSelectExclusive(layer.id);
          }}
          style={{
            border: "1px solid #ddd",
            background: "#fff",
            color: "var(--color-map-ui-text-primary)",
            borderRadius: 4,
            fontSize: 11,
            padding: "2px 6px",
            cursor: "pointer",
          }}
        >
          Solo
        </button>
      ) : null}
    </label>
  );
}
