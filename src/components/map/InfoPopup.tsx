"use client";

import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import type { DistrictLookupResult } from "@/types/district.types";

interface InfoPopupProps {
  map: mapboxgl.Map;
  lngLat: mapboxgl.LngLatLike;
  results: DistrictLookupResult[];
  isPinned?: boolean;
  /** When set (e.g. address search), shown above layer sections. */
  addressHeading?: string | null;
  /**
   * Desktop map explore mode: pinned click popup shows a top-right dismiss control so the pointer
   * can return to hover-based labels.
   */
  resumeHoverAction?: boolean;
  onClose: () => void;
}

const PROPERTY_ORDER = [
  "U.S. Representative",
  "State Senator",
  "State Representative",
  "Commissioner",
  "Council Member",
  "Mayor",
  "Council members",
  "Trustee",
  "Trustees",
  "School district",
  "District",
  "Population",
  "Registered Voters",
  "District Name",
  "Precinct",
  "County",
  "Tract",
  "Flood Zone",
  "Subtype",
  "SFHA",
  "Source",
];

function orderedPropertyKeys(properties: Record<string, string>): string[] {
  const keys = Object.keys(properties);
  const rank = (k: string) => {
    const index = PROPERTY_ORDER.indexOf(k);
    return index === -1 ? PROPERTY_ORDER.length + k.charCodeAt(0) : index;
  };
  return [...keys].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
}

/**
 * Layer labels are often plural categories ("Congressional Districts") while the
 * feature line is the specific instance ("Congressional District 50"). Showing both is redundant.
 *
 * TX legislative layers use titles like "TX State Senate" while enrichment sets the feature line to
 * "Senate District N" / "House District N", which repeats the same idea as the section heading.
 */
function isCategoryHeadingRedundant(layerId: string, layerLabel: string, featureLabel: string): boolean {
  const fl = featureLabel.trim().toLowerCase();
  const ll = layerLabel.trim();
  if (!fl || !ll) return false;

  if (layerId === "tx-state-senate" && fl.startsWith("senate district ")) return true;
  if (layerId === "tx-state-house" && fl.startsWith("house district ")) return true;

  const words = ll.split(/\s+/);
  const last = words[words.length - 1];
  // Cheap English plural → singular for headings ending in "s" (Districts, Precincts, …).
  if (last.length > 1 && last.endsWith("s") && !last.endsWith("ss")) {
    const singularLast = last.slice(0, -1);
    const singularHeading = [...words.slice(0, -1), singularLast].join(" ").toLowerCase();
    if (fl === singularHeading || fl.startsWith(`${singularHeading} `)) return true;
  }

  return false;
}

export function InfoPopup({
  map,
  lngLat,
  results,
  isPinned = false,
  addressHeading = null,
  resumeHoverAction = false,
  onClose,
}: InfoPopupProps) {
  useEffect(() => {
    const root = document.createElement("div");
    root.style.position = "relative";
    root.style.minWidth = "220px";
    root.style.maxWidth = "320px";
    root.style.maxHeight = "260px";
    root.style.display = "flex";
    root.style.flexDirection = "column";

    const content = document.createElement("div");
    content.style.flex = "1";
    content.style.minHeight = "0";
    content.style.overflowY = "auto";
    content.style.color = "var(--color-map-ui-text-primary)";
    content.style.lineHeight = "1.35";
    if (resumeHoverAction) {
      content.style.paddingRight = "22px";
    }

    if (resumeHoverAction) {
      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.textContent = "×";
      closeBtn.setAttribute(
        "aria-label",
        "Stop showing this selection and show area details when you move the pointer over the map",
      );
      closeBtn.style.position = "absolute";
      closeBtn.style.top = "2px";
      closeBtn.style.right = "4px";
      closeBtn.style.zIndex = "1";
      closeBtn.style.fontSize = "18px";
      closeBtn.style.lineHeight = "1";
      closeBtn.style.fontWeight = "400";
      closeBtn.style.color = "#6b7280";
      closeBtn.style.background = "transparent";
      closeBtn.style.border = "none";
      closeBtn.style.padding = "2px 4px";
      closeBtn.style.margin = "0";
      closeBtn.style.cursor = "pointer";
      closeBtn.addEventListener("click", () => {
        onClose();
      });
      root.appendChild(closeBtn);
    }

    root.appendChild(content);

    const heading = document.createElement("div");
    heading.style.fontSize = "12px";
    heading.style.fontWeight = "700";
    heading.style.textTransform = "uppercase";
    heading.style.letterSpacing = "0.04em";
    heading.style.color = "#6b7280";
    heading.style.marginBottom = "8px";
    heading.textContent = addressHeading
      ? "Selected location"
      : isPinned
        ? "Selected area"
        : "Area details";
    content.appendChild(heading);

    if (addressHeading) {
      const addressLine = document.createElement("div");
      addressLine.style.fontWeight = "700";
      addressLine.style.color = "#111827";
      addressLine.style.marginBottom = "10px";
      addressLine.style.fontSize = "13px";
      addressLine.textContent = addressHeading;
      content.appendChild(addressLine);
    }

    if (results.length === 0) {
      const empty = document.createElement("div");
      empty.style.fontSize = "12px";
      empty.style.color = "#6b7280";
      empty.textContent = "No district or zone data found at this location for the layers currently visible.";
      content.appendChild(empty);
    } else {
      results.forEach((result, index) => {
        if (index > 0) {
          const divider = document.createElement("div");
          divider.style.height = "1px";
          divider.style.background = "#e5e7eb";
          divider.style.margin = "8px 0";
          content.appendChild(divider);
        }

        const hideCategoryTitle = isCategoryHeadingRedundant(
          result.layerId,
          result.layerLabel,
          result.featureLabel,
        );

        if (!hideCategoryTitle) {
          const title = document.createElement("div");
          title.style.fontWeight = "700";
          title.style.marginBottom = "2px";
          title.textContent = result.layerLabel;
          content.appendChild(title);
        }

        const label = document.createElement("div");
        label.style.fontSize = "12px";
        label.style.fontWeight = hideCategoryTitle ? "700" : "600";
        label.style.color = "#111827";
        label.style.marginBottom = "6px";
        label.textContent = result.featureLabel;
        content.appendChild(label);

        const keys = orderedPropertyKeys(result.properties);
        keys.forEach((key) => {
          const row = document.createElement("div");
          row.style.fontSize = "12px";
          row.style.marginBottom = "4px";
          if (key === "Trustees") {
            row.style.whiteSpace = "pre-wrap";
          }
          const keyText = document.createElement("strong");
          keyText.textContent = `${key}: `;
          row.appendChild(keyText);
          row.appendChild(document.createTextNode(result.properties[key]));
          content.appendChild(row);
        });
      });
    }

    const popup = new mapboxgl.Popup({
      closeButton: (isPinned || Boolean(addressHeading)) && !resumeHoverAction,
      closeOnClick: false,
      maxWidth: "340px",
      offset: 12,
    })
      .setLngLat(lngLat)
      .setDOMContent(root)
      .addTo(map);

    let isCleaningUp = false;
    popup.on("close", () => {
      if (!isCleaningUp) onClose();
    });

    return () => {
      isCleaningUp = true;
      popup.remove();
    };
  }, [addressHeading, isPinned, lngLat, map, onClose, results, resumeHoverAction]);

  return null;
}
