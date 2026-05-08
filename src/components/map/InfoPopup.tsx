"use client";

import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import type { DistrictLookupResult } from "@/types/district.types";

interface InfoPopupProps {
  map: mapboxgl.Map;
  lngLat: mapboxgl.LngLatLike;
  results: DistrictLookupResult[];
  onClose: () => void;
}

export function InfoPopup({ map, lngLat, results, onClose }: InfoPopupProps) {
  useEffect(() => {
    const content = document.createElement("div");
    content.style.minWidth = "180px";
    content.style.color = "var(--color-map-ui-text-primary)";
    results.forEach((result, index) => {
      if (index > 0) {
        const divider = document.createElement("div");
        divider.style.height = "1px";
        divider.style.background = "#e5e7eb";
        divider.style.margin = "8px 0";
        content.appendChild(divider);
      }

      const title = document.createElement("div");
      title.style.fontWeight = "700";
      title.style.marginBottom = "2px";
      title.textContent = result.layerLabel;
      content.appendChild(title);

      const label = document.createElement("div");
      label.style.fontSize = "12px";
      label.style.fontWeight = "600";
      label.style.color = "#111827";
      label.style.marginBottom = "6px";
      label.textContent = result.featureLabel;
      content.appendChild(label);

      const keys = Object.keys(result.properties);
      if (keys.length === 0) {
        const empty = document.createElement("div");
        empty.style.fontSize = "12px";
        empty.style.color = "#666";
        empty.textContent = "No details available for this feature.";
        content.appendChild(empty);
      } else {
        keys.forEach((key) => {
          const row = document.createElement("div");
          row.style.fontSize = "12px";
          row.style.marginBottom = "4px";
          const keyText = document.createElement("strong");
          keyText.textContent = `${key}: `;
          row.appendChild(keyText);
          row.appendChild(document.createTextNode(result.properties[key]));
          content.appendChild(row);
        });
      }
    });

    const popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(lngLat)
      .setDOMContent(content)
      .addTo(map);

    popup.on("close", onClose);
    return () => {
      popup.remove();
    };
  }, [lngLat, map, onClose, results]);

  return null;
}
