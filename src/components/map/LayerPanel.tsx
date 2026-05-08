"use client";

import React, { useState } from "react";
import { CATEGORY_LABELS } from "../../data/layers.config";
import type { DistrictLayer, LayerCategory } from "../../types/district.types";
import { LayerToggle } from "./LayerToggle";

interface Props {
  title?: string;
  subtitle?: string;
  layers: DistrictLayer[];
  visibleLayers: Set<string>;
  onToggle: (id: string) => void;
  onToggleCategory: (category: string, layers: DistrictLayer[]) => void;
  onSelectExclusive: (id: string) => void;
  showSearch?: boolean;
  allowSoloLayer?: boolean;
  defaultCollapsed?: boolean;
  extraContent?: React.ReactNode;
}

export const LayerPanel: React.FC<Props> = ({
  title = "Map Layers",
  subtitle,
  layers,
  visibleLayers,
  onToggle,
  onToggleCategory,
  onSelectExclusive,
  showSearch = true,
  allowSoloLayer = true,
  defaultCollapsed = false,
  extraContent,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const categories = Object.keys(CATEGORY_LABELS) as LayerCategory[];

  const filteredLayers = layers.filter(l =>
    l.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleCategoryCollapsed = (category: string) => {
    setCollapsedCategories((previous) => ({
      ...previous,
      [category]: !previous[category],
    }));
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 10,
        background: "white",
        color: "var(--color-map-ui-text-primary)",
        borderRadius: 8,
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        width: 280,
        maxHeight: "calc(100% - 24px)",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>{title}</strong>
        <button onClick={() => setCollapsed((c) => !c)}>{collapsed ? "▼" : "▲"}</button>
      </div>

      {!collapsed && (
        <>
          {subtitle ? (
            <div
              style={{
                padding: "8px 16px 2px",
                fontSize: 12,
                color: "var(--color-map-ui-text-muted)",
              }}
            >
              {subtitle}
            </div>
          ) : null}
          {extraContent ? (
            <div style={{ padding: "6px 16px 10px", borderBottom: "1px solid #f3f4f6" }}>{extraContent}</div>
          ) : null}
          {showSearch ? (
            <div style={{ padding: "8px 16px" }}>
              <input
                type="text"
                placeholder="Search layers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 4,
                  border: "1px solid #ddd",
                  boxSizing: "border-box",
                }}
              />
            </div>
          ) : null}

          {categories.map(category => {
            const categoryLayers = filteredLayers.filter(l => l.category === category);
            if (categoryLayers.length === 0) return null;
            const allVisible = categoryLayers.every(l => visibleLayers.has(l.id));
            const isCategoryCollapsed = collapsedCategories[category] ?? false;

            return (
              <div key={category} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <div
                  style={{
                    padding: "8px 16px",
                    fontWeight: 600,
                    fontSize: 12,
                    color: "var(--color-map-ui-text-muted)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#fafafa",
                  }}
                >
                  <span>{CATEGORY_LABELS[category]}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => onToggleCategory(category, layers)}
                      style={{
                        fontSize: 10,
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        cursor: "pointer",
                        color: allVisible
                          ? "var(--color-map-ui-emphasis)"
                          : "var(--color-map-ui-text-subtle)",
                      }}
                    >
                      {allVisible ? "Hide all" : "Show all"}
                    </button>
                    <button
                      type="button"
                      aria-label={`${isCategoryCollapsed ? "Expand" : "Collapse"} ${CATEGORY_LABELS[category]}`}
                      onClick={() => toggleCategoryCollapsed(category)}
                      style={{
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        fontSize: 12,
                        cursor: "pointer",
                        color: "var(--color-map-ui-text-muted)",
                      }}
                    >
                      {isCategoryCollapsed ? "▼" : "▲"}
                    </button>
                  </div>
                </div>

                {!isCategoryCollapsed &&
                  categoryLayers.map((layer) => (
                    <LayerToggle
                      key={layer.id}
                      layer={layer}
                      checked={visibleLayers.has(layer.id)}
                      onToggle={onToggle}
                      onSelectExclusive={allowSoloLayer ? onSelectExclusive : undefined}
                    />
                  ))}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};