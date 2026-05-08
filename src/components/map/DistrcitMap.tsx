"use client";

import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DISTRICT_LAYERS } from "../../data/layers.config";
import { getMapModeConfig } from "../../data/map-modes.config";
import { useMapLayers } from "../../hooks/useMapLayers";
import { useDistrictLookup } from "../../hooks/useDistrictLookup";
import type { DistrictLayer, DistrictLookupResult } from "../../types/district.types";
import { LayerPanel } from "@/components/map/LayerPanel";
import { Legend } from "@/components/map/Legend";
import { InfoPopup } from "@/components/map/InfoPopup";

const mapboxToken =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
mapboxgl.accessToken = mapboxToken ?? "";

// Travis County center
const TRAVIS_CENTER: [number, number] = [-97.7431, 30.1669];
const TRAVIS_BOUNDS: [number, number, number, number] = [-98.4, 29.8, -97.0, 30.7];
const ACTIVE_MODE = getMapModeConfig("explore");

const isValidPublicMapboxToken = (token?: string | null): token is string =>
  typeof token === "string" && token.trim().startsWith("pk.");

const labelTextColorForLayer = (layerColor: string): string => {
  const color = layerColor.toLowerCase();
  if (color === "#e9c46a" || color === "#f4a261") {
    return "#374151";
  }
  return layerColor;
};

const buildLabelFieldExpression = (layer: DistrictLayer): mapboxgl.Expression => {
  const baseFields = [layer.labelProperty, ...(layer.labelPropertyFallbacks ?? [])];
  const candidates = Array.from(
    new Set(baseFields.flatMap((field) => [field, field.toUpperCase(), field.toLowerCase()])),
  ).map((field) => ["get", field] as unknown as mapboxgl.Expression);

  return [
    "to-string",
    ["coalesce", ...candidates, ""],
  ] as unknown as mapboxgl.Expression;
};

const fetchGeocodingPayload = async (
  params: URLSearchParams,
  options?: { signal?: AbortSignal },
): Promise<{ features?: Array<{ id?: string; place_name?: string; center?: [number, number] }> }> => {
  const apiResponse = await fetch(`/api/mapbox/geocoding?${params.toString()}`, {
    signal: options?.signal,
  });

  if (apiResponse.ok) {
    return (await apiResponse.json()) as {
      features?: Array<{ id?: string; place_name?: string; center?: [number, number] }>;
    };
  }

  // Fallback when the API route has no token but the browser bundle has a public token.
  if (apiResponse.status === 503 && isValidPublicMapboxToken(mapboxToken)) {
    const directUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      params.get("q") ?? "",
    )}.json?${params.toString()}&access_token=${encodeURIComponent(mapboxToken)}`;
    const directResponse = await fetch(directUrl, { signal: options?.signal });
    if (directResponse.ok) {
      return (await directResponse.json()) as {
        features?: Array<{ id?: string; place_name?: string; center?: [number, number] }>;
      };
    }
    throw new Error(`Address lookup failed (${directResponse.status}).`);
  }

  throw new Error(`Address lookup failed (${apiResponse.status}).`);
};

export const TravisCountyMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const addressMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const addressPopupRef = useRef<mapboxgl.Popup | null>(null);
  const { visibleLayers, toggleLayer, selectExclusive, toggleCategory } = useMapLayers();
  const visibleLayersRef = useRef(visibleLayers);
  const { lookupDistrictsAtPoint } = useDistrictLookup();
  const isTouchDeviceRef = useRef(false);
  const isPopupPinnedRef = useRef(false);
  const [popupInfo, setPopupInfo] = React.useState<{
    lngLat: mapboxgl.LngLat;
    results: DistrictLookupResult[];
  } | null>(null);
  const [addressQuery, setAddressQuery] = React.useState("");
  const [addressSuggestions, setAddressSuggestions] = React.useState<
    Array<{ id: string; label: string; center: [number, number] }>
  >([]);
  const [suppressSuggestions, setSuppressSuggestions] = React.useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = React.useState(-1);
  const [isLookingUpAddress, setIsLookingUpAddress] = React.useState(false);
  const [lookupError, setLookupError] = React.useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = React.useState<{
    label: string;
    center: [number, number];
  } | null>(null);
  const lastAddressLookupVisibleSignatureRef = React.useRef("");
  const [addressLookupResults, setAddressLookupResults] = React.useState<{
    addressLabel: string;
    results: DistrictLookupResult[];
  } | null>(null);

  const escapeHtml = React.useCallback((value: string) => {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }, []);

  useEffect(() => {
    visibleLayersRef.current = visibleLayers;
  }, [visibleLayers]);

  useEffect(() => {
    const query = addressQuery.trim();
    if (suppressSuggestions || query.length < 3) {
      setAddressSuggestions([]);
      setIsLoadingSuggestions(false);
      setActiveSuggestionIndex(-1);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const params = new URLSearchParams({
          q: query,
          limit: "6",
          autocomplete: "true",
          country: "us",
          bbox: TRAVIS_BOUNDS.join(","),
          proximity: `${TRAVIS_CENTER[0]},${TRAVIS_CENTER[1]}`,
        });
        const payload = await fetchGeocodingPayload(params, { signal: controller.signal });
        const suggestions = (payload.features ?? [])
          .filter(
            (feature): feature is { id?: string; place_name: string; center: [number, number] } =>
              Boolean(feature.place_name) &&
              Array.isArray(feature.center) &&
              feature.center.length === 2,
          )
          .map((feature, index) => ({
            id: feature.id ?? `${feature.place_name}-${index}`,
            label: feature.place_name,
            center: feature.center,
          }));
        setAddressSuggestions(suggestions);
        setActiveSuggestionIndex(suggestions.length > 0 ? 0 : -1);
      } catch (error) {
        if (!controller.signal.aborted) {
          setAddressSuggestions([]);
          setActiveSuggestionIndex(-1);
          setLookupError("Address suggestions are temporarily unavailable.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSuggestions(false);
        }
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [addressQuery, suppressSuggestions]);

  const modeLayers = DISTRICT_LAYERS.filter((layer) =>
    ACTIVE_MODE.allowedCategories.includes(layer.category),
  );

  // Initialize map
  useEffect(() => {
    if (!isValidPublicMapboxToken(mapboxToken)) return;
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: TRAVIS_CENTER,
      zoom: 9.5,
      minZoom: 7,
      maxZoom: 18,
      // Constrain to Travis County bounds
      maxBounds: [
        [TRAVIS_BOUNDS[0], TRAVIS_BOUNDS[1]],
        [TRAVIS_BOUNDS[2], TRAVIS_BOUNDS[3]],
      ],
    });
    isTouchDeviceRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches;

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(
      new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true } }),
      "top-right",
    );

    map.current.on('load', () => {
      // Load all district layers; never let one failed source block others.
      modeLayers.forEach((layer) => {
        try {
          addDistrictLayer(map.current!, layer);
        } catch (error) {
          // Keep map usable even if one layer definition/source is unavailable.
          console.error(`Failed to initialize layer ${layer.id}`, error);
        }
      });

      const showDetailsAtPoint = (point: mapboxgl.PointLike, lngLat: mapboxgl.LngLat): boolean => {
        const results = lookupDistrictsAtPoint(
          map.current!,
          point,
          modeLayers,
          visibleLayersRef.current,
        );
        if (results.length === 0) {
          setPopupInfo(null);
          map.current!.getCanvas().style.cursor = "";
          return false;
        }
        setPopupInfo({ lngLat, results });
        map.current!.getCanvas().style.cursor = "pointer";
        return true;
      };

      if (isTouchDeviceRef.current) {
        map.current!.on("click", (event) => {
          isPopupPinnedRef.current = true;
          showDetailsAtPoint(event.point, event.lngLat);
        });
      } else {
        map.current!.on("click", (event) => {
          const hasResults = showDetailsAtPoint(event.point, event.lngLat);
          isPopupPinnedRef.current = hasResults;
        });
        map.current!.on("mousemove", (event) => {
          if (isPopupPinnedRef.current) return;
          showDetailsAtPoint(event.point, event.lngLat);
        });
        map.current!.on("mouseleave", () => {
          if (isPopupPinnedRef.current) return;
          setPopupInfo(null);
          map.current!.getCanvas().style.cursor = "";
        });
      }
    });

    return () => {
      addressPopupRef.current?.remove();
      addressPopupRef.current = null;
      addressMarkerRef.current?.remove();
      addressMarkerRef.current = null;
      map.current?.remove();
      map.current = null;
    };
  }, []);

  const runDistrictLookupForAddress = React.useCallback(
    async (
      mapInstance: mapboxgl.Map,
      center: [number, number],
      addressLabel: string,
      fallbackLabel: string,
      lookupLayerIds: Set<string>,
      shouldFlyToAddress = true,
    ) => {
      if (shouldFlyToAddress) {
        mapInstance.flyTo({ center, zoom: 14, essential: true });
        await new Promise<void>((resolve) => {
          let settled = false;
          const finish = () => {
            if (settled) return;
            settled = true;
            resolve();
          };
          mapInstance.once("moveend", finish);
          window.setTimeout(finish, 1200);
        });
      }
      addressPopupRef.current?.remove();
      addressPopupRef.current = null;
      addressMarkerRef.current?.remove();
      const markerNode = document.createElement("button");
      markerNode.type = "button";
      markerNode.setAttribute("aria-label", `Selected address: ${addressLabel || fallbackLabel}`);
      markerNode.style.position = "absolute";
      markerNode.style.top = "0";
      markerNode.style.left = "0";
      markerNode.style.margin = "0";
      markerNode.style.appearance = "none";
      markerNode.style.width = "14px";
      markerNode.style.height = "14px";
      markerNode.style.borderRadius = "50%";
      markerNode.style.border = "2px solid #ffffff";
      markerNode.style.background = "#dc2626";
      markerNode.style.boxShadow = "0 0 0 2px rgba(220,38,38,0.25)";
      markerNode.style.cursor = "pointer";
      markerNode.style.padding = "0";

      addressMarkerRef.current = new mapboxgl.Marker({ element: markerNode, anchor: "center" })
        .setLngLat(center)
        .addTo(mapInstance);
      const lngLat = new mapboxgl.LngLat(center[0], center[1]);
      let results: DistrictLookupResult[] = [];
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const point = mapInstance.project(lngLat);
        results = lookupDistrictsAtPoint(mapInstance, point, modeLayers, lookupLayerIds);
        if (results.length > 0 || attempt === 2) break;
        await new Promise((resolve) => window.setTimeout(resolve, 220));
      }
      const addressName = addressLabel || fallbackLabel;
      const details =
        results.length === 0
          ? "<div style='margin-top:6px;color:#6b7280;'>No district or zone data found at this location.</div>"
          : `<div style='margin-top:6px;display:grid;gap:6px;'>${results
              .map((result) => {
                const propertyText =
                  Object.keys(result.properties).length === 0
                    ? "<div style='color:#6b7280;'>No details available.</div>"
                    : `<div style='color:#6b7280;'>${Object.entries(result.properties)
                        .map(([key, value]) => `${escapeHtml(key)}: ${escapeHtml(value)}`)
                        .join(" • ")}</div>`;
                return `<div>
                  <div style='font-weight:700;'>${escapeHtml(result.layerLabel)}</div>
                  <div style='font-size:12px;color:#111827;font-weight:600;margin-bottom:2px;'>${escapeHtml(result.featureLabel)}</div>
                  ${propertyText}
                </div>`;
              })
              .join("")}</div>`;
      const popupHtml = `<div style='min-width:240px;max-width:320px;font-size:12px;line-height:1.35;color:var(--color-map-ui-text-primary);'>
        <div style='font-weight:700;color:#111827;'>${escapeHtml(addressName)}</div>
        ${details}
      </div>`;
      addressPopupRef.current = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
        maxWidth: "340px",
        offset: 16,
      })
        .setLngLat(lngLat)
        .setHTML(popupHtml);
      addressMarkerRef.current.setPopup(addressPopupRef.current);
      addressPopupRef.current.addTo(mapInstance);
      isPopupPinnedRef.current = true;
      setPopupInfo(results.length > 0 ? { lngLat, results } : null);
      setAddressLookupResults({
        addressLabel: addressName,
        results,
      });
    },
    [escapeHtml, lookupDistrictsAtPoint, modeLayers],
  );

  const lookupAddress = React.useCallback(async () => {
    const mapInstance = map.current;
    const query = addressQuery.trim();
    if (!mapInstance || query.length === 0) return;
    if (!isValidPublicMapboxToken(mapboxToken)) {
      setLookupError("A valid Mapbox public token is required for address lookup.");
      return;
    }

    setIsLookingUpAddress(true);
    setLookupError(null);
    try {
      const params = new URLSearchParams({
        q: query,
        limit: "1",
        autocomplete: "true",
        country: "us",
        bbox: TRAVIS_BOUNDS.join(","),
        proximity: `${TRAVIS_CENTER[0]},${TRAVIS_CENTER[1]}`,
      });
      const payload = await fetchGeocodingPayload(params);
      const feature = payload.features?.[0];
      const center = feature?.center;
      if (!center || center.length !== 2) {
        setLookupError("No matching address found in the Travis County area.");
        setAddressLookupResults(null);
        return;
      }
      setSuppressSuggestions(true);
      setAddressSuggestions([]);
      setActiveSuggestionIndex(-1);
      const addressName = feature.place_name ?? query;
      const visibleSignature = Array.from(visibleLayersRef.current).sort().join("|");
      lastAddressLookupVisibleSignatureRef.current = visibleSignature;
      await runDistrictLookupForAddress(
        mapInstance,
        center,
        addressName,
        query,
        new Set(visibleLayersRef.current),
      );
      setSelectedAddress({ label: addressName, center });
    } catch (error) {
      setSuppressSuggestions(false);
      setLookupError(error instanceof Error ? error.message : "Address lookup failed.");
      setAddressLookupResults(null);
    } finally {
      setIsLookingUpAddress(false);
    }
  }, [addressQuery, runDistrictLookupForAddress]);

  const chooseSuggestion = React.useCallback(
    async (suggestion: { id: string; label: string; center: [number, number] }) => {
      const mapInstance = map.current;
      if (!mapInstance) return;
      setSuppressSuggestions(true);
      setAddressQuery(suggestion.label);
      setLookupError(null);
      setAddressSuggestions([]);
      setActiveSuggestionIndex(-1);
      setIsLookingUpAddress(true);
      try {
        const visibleSignature = Array.from(visibleLayersRef.current).sort().join("|");
        lastAddressLookupVisibleSignatureRef.current = visibleSignature;
        await runDistrictLookupForAddress(
          mapInstance,
          suggestion.center,
          suggestion.label,
          suggestion.label,
          new Set(visibleLayersRef.current),
        );
        setSelectedAddress({ label: suggestion.label, center: suggestion.center });
      } catch (error) {
        setSuppressSuggestions(false);
        setLookupError(error instanceof Error ? error.message : "Address lookup failed.");
        setAddressLookupResults(null);
      } finally {
        setIsLookingUpAddress(false);
      }
    },
    [runDistrictLookupForAddress],
  );

  useEffect(() => {
    const mapInstance = map.current;
    if (!mapInstance || !selectedAddress) return;
    const visibleSignature = Array.from(visibleLayers).sort().join("|");
    if (visibleSignature === lastAddressLookupVisibleSignatureRef.current) return;
    lastAddressLookupVisibleSignatureRef.current = visibleSignature;

    void runDistrictLookupForAddress(
      mapInstance,
      selectedAddress.center,
      selectedAddress.label,
      selectedAddress.label,
      new Set(visibleLayers),
      false,
    );
  }, [runDistrictLookupForAddress, selectedAddress, visibleLayers]);

  const addDistrictLayer = (mapInstance: mapboxgl.Map, layer: DistrictLayer) => {
    const labelFieldExpression = buildLabelFieldExpression(layer);
    if (!mapInstance.getSource(layer.id)) {
      mapInstance.addSource(layer.id, {
        type: "geojson",
        data: layer.sourceUrl,
      });
    }

    if (!mapInstance.getLayer(`${layer.id}-fill`)) {
      // Fill layer
      mapInstance.addLayer({
        id: `${layer.id}-fill`,
        type: "fill",
        source: layer.id,
        layout: { visibility: layer.defaultVisible ? "visible" : "none" },
        paint: {
          "fill-color": layer.color,
          "fill-opacity": 0.12,
          "fill-opacity-transition": { duration: 300 },
        },
        minzoom: layer.minZoom ?? 0,
        maxzoom: layer.maxZoom ?? 24,
      });
    }

    // Stroke/border layer
    if (!mapInstance.getLayer(`${layer.id}-line`)) {
      mapInstance.addLayer({
        id: `${layer.id}-line`,
        type: "line",
        source: layer.id,
        layout: { visibility: layer.defaultVisible ? "visible" : "none" },
        paint: {
          "line-color": layer.color,
          "line-width": 1.5,
          "line-opacity": 0.8,
        },
        minzoom: layer.minZoom ?? 0,
      });
    }

    if (!mapInstance.getLayer(`${layer.id}-label`)) {
      mapInstance.addLayer({
        id: `${layer.id}-label`,
        type: "symbol",
        source: layer.id,
        layout: {
          visibility: layer.defaultVisible ? "visible" : "none",
          "text-field": labelFieldExpression,
          "text-size": 11,
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-anchor": "center",
          "text-variable-anchor": ["center", "top", "bottom", "left", "right"],
          "text-radial-offset": 0.3,
          "text-justify": "auto",
          "text-allow-overlap": true,
          "text-ignore-placement": true,
          "text-optional": true,
        },
        paint: {
          "text-color": labelTextColorForLayer(layer.color),
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
        },
        minzoom: layer.minZoom ?? 0,
      });
    }

    // Hover highlight
    let hoveredId: string | number | null = null;
    if (!mapInstance.getLayer(`${layer.id}-hover`)) {
      mapInstance.addLayer({
        id: `${layer.id}-hover`,
        type: "fill",
        source: layer.id,
        layout: { visibility: layer.defaultVisible ? "visible" : "none" },
        paint: {
          "fill-color": layer.color,
          "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.3, 0],
        },
      });
    }

    mapInstance.on("mousemove", `${layer.id}-fill`, (e) => {
      if (e.features?.length) {
        if (hoveredId !== null) {
          mapInstance.setFeatureState({ source: layer.id, id: hoveredId }, { hover: false });
        }
        hoveredId = e.features[0].id ?? null;
        if (hoveredId !== null) {
          mapInstance.setFeatureState({ source: layer.id, id: hoveredId }, { hover: true });
        }
        mapInstance.getCanvas().style.cursor = "pointer";
      }
    });

    mapInstance.on("mouseleave", `${layer.id}-fill`, () => {
      if (hoveredId !== null) {
        mapInstance.setFeatureState({ source: layer.id, id: hoveredId }, { hover: false });
      }
      hoveredId = null;
      mapInstance.getCanvas().style.cursor = "";
    });
  };

  // Sync visibility when toggles change
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    modeLayers.forEach(layer => {
      const isVisible = visibleLayers.has(layer.id);
      const vis = isVisible ? "visible" : "none";
      [`${layer.id}-fill`, `${layer.id}-line`, `${layer.id}-label`, `${layer.id}-hover`].forEach((lid) => {
        if (map.current!.getLayer(lid)) {
          map.current!.setLayoutProperty(lid, "visibility", vis);
        }
      });
    });
  }, [visibleLayers, modeLayers]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "min(70vh, 560px)",
        minHeight: 320,
      }}
    >
      {!isValidPublicMapboxToken(mapboxToken) ? (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 2,
            background: "#fef3c7",
            color: "#78350f",
            border: "1px solid #fde68a",
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 13,
          }}
        >
          Add a valid <code>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> (public token starting with{" "}
          <code>pk.</code>) to enable the map.
        </div>
      ) : null}
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      <LayerPanel
        title={ACTIVE_MODE.label}
        subtitle={ACTIVE_MODE.goal}
        showSearch={ACTIVE_MODE.ui.showSearch}
        allowSoloLayer={ACTIVE_MODE.ui.allowSoloLayer}
        defaultCollapsed={ACTIVE_MODE.ui.defaultPanelCollapsed}
        layers={modeLayers}
        visibleLayers={visibleLayers}
        onToggle={toggleLayer}
        onToggleCategory={toggleCategory}
        onSelectExclusive={selectExclusive}
        extraContent={
          <div>
            <div style={{ fontSize: 12, marginBottom: 6, color: "var(--color-map-ui-text-muted)" }}>
              Address lookup
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                type="text"
                placeholder="Enter an address..."
                value={addressQuery}
                onChange={(event) => {
                  setAddressQuery(event.target.value);
                  setSuppressSuggestions(false);
                  setLookupError(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setActiveSuggestionIndex((previous) =>
                      Math.min(previous + 1, Math.max(addressSuggestions.length - 1, 0)),
                    );
                    return;
                  }
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setActiveSuggestionIndex((previous) => Math.max(previous - 1, 0));
                    return;
                  }
                  if (
                    event.key === "Enter" &&
                    !isLookingUpAddress &&
                    addressSuggestions[activeSuggestionIndex]
                  ) {
                    event.preventDefault();
                    void chooseSuggestion(addressSuggestions[activeSuggestionIndex]);
                    return;
                  }
                  if (event.key === "Enter" && !isLookingUpAddress) {
                    void lookupAddress();
                  }
                }}
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  borderRadius: 4,
                  border: "1px solid #ddd",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => void lookupAddress()}
                disabled={isLookingUpAddress || addressQuery.trim().length === 0}
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                  padding: "6px 10px",
                  background: "white",
                  cursor:
                    isLookingUpAddress || addressQuery.trim().length === 0 ? "not-allowed" : "pointer",
                  opacity: isLookingUpAddress || addressQuery.trim().length === 0 ? 0.6 : 1,
                }}
              >
                {isLookingUpAddress ? "..." : "Go"}
              </button>
            </div>
            {isLoadingSuggestions ? (
              <div style={{ marginTop: 6, fontSize: 12, color: "var(--color-map-ui-text-muted)" }}>
                Looking up addresses...
              </div>
            ) : null}
            {addressSuggestions.length > 0 ? (
              <div
                style={{
                  marginTop: 6,
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  background: "white",
                  maxHeight: 180,
                  overflowY: "auto",
                }}
              >
                {addressSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => void chooseSuggestion(suggestion)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      border: "none",
                      background: index === activeSuggestionIndex ? "#f3f4f6" : "transparent",
                      padding: "7px 9px",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            ) : null}
            {lookupError ? (
              <div style={{ marginTop: 6, fontSize: 12, color: "#991b1b" }}>{lookupError}</div>
            ) : null}
            {addressLookupResults ? (
              <div style={{ marginTop: 8, fontSize: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>{addressLookupResults.addressLabel}</div>
                {addressLookupResults.results.length === 0 ? (
                  <div style={{ color: "var(--color-map-ui-text-muted)" }}>
                    No district or zone data found at this location.
                  </div>
                ) : (
                  <div style={{ maxHeight: 180, overflowY: "auto", paddingRight: 4 }}>
                    {addressLookupResults.results.map((result) => (
                      <div key={result.layerId} style={{ marginBottom: 8 }}>
                        <div style={{ fontWeight: 600 }}>{result.layerLabel}</div>
                        {Object.keys(result.properties).length === 0 ? (
                          <div style={{ color: "var(--color-map-ui-text-muted)" }}>No details available.</div>
                        ) : (
                          <div style={{ color: "var(--color-map-ui-text-muted)" }}>
                            {Object.entries(result.properties)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(" • ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        }
      />
      {ACTIVE_MODE.ui.showLegend ? (
        <Legend layers={modeLayers} visibleLayers={visibleLayers} title={`${ACTIVE_MODE.label} legend`} />
      ) : null}
      {popupInfo && (
        <InfoPopup
          map={map.current!}
          lngLat={popupInfo.lngLat}
          results={popupInfo.results}
          onClose={() => {
            isPopupPinnedRef.current = false;
            setPopupInfo(null);
          }}
        />
      )}
    </div>
  );
};