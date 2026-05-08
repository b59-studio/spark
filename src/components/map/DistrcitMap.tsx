"use client";

import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DISTRICT_LAYERS } from "../../data/layers.config";
import { getMapModeConfig } from "../../data/map-modes.config";
import { useMapLayers } from "../../hooks/useMapLayers";
import { lookupDistrictsAtPoint } from "../../hooks/useDistrictLookup";
import type { DistrictLayer, DistrictLookupResult } from "../../types/district.types";
import { LayerPanel } from "@/components/map/LayerPanel";
import { Legend } from "@/components/map/Legend";
import { InfoPopup } from "@/components/map/InfoPopup";
import { MapApplicationShell } from "@/components/map/MapApplicationShell";
import { useMapFullscreen } from "@/hooks/useMapFullscreen";
import { AUSTIN_DEFAULT_CENTER, AUSTIN_DEFAULT_ZOOM } from "@/lib/map/initial-view";
import { resolveDistrictGeoJsonUrl } from "@/lib/map/geojson-cdn";

const mapboxToken =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
mapboxgl.accessToken = mapboxToken ?? "";

// Travis County center (geocoding proximity bias)
const TRAVIS_CENTER: [number, number] = [-97.7431, 30.1669];
const TRAVIS_BOUNDS: [number, number, number, number] = [-98.4, 29.8, -97.0, 30.7];
const ACTIVE_MODE = getMapModeConfig("explore");

const isValidPublicMapboxToken = (token?: string | null): token is string =>
  typeof token === "string" && token.trim().startsWith("pk.");

/** Avoid stacking duplicate layer listeners when visible-layer effects re-run. */
const districtLayerInteractionAttached = new WeakMap<mapboxgl.Map, Set<string>>();

function attachDistrictLayerInteractionOnce(mapInstance: mapboxgl.Map, layerId: string) {
  let attached = districtLayerInteractionAttached.get(mapInstance);
  if (!attached) {
    attached = new Set<string>();
    districtLayerInteractionAttached.set(mapInstance, attached);
  }
  if (attached.has(layerId)) return;
  attached.add(layerId);

  let hoveredId: string | number | null = null;
  mapInstance.on("mousemove", `${layerId}-fill`, (e) => {
    if (e.features?.length) {
      if (hoveredId !== null) {
        mapInstance.setFeatureState({ source: layerId, id: hoveredId }, { hover: false });
      }
      hoveredId = e.features[0].id ?? null;
      if (hoveredId !== null) {
        mapInstance.setFeatureState({ source: layerId, id: hoveredId }, { hover: true });
      }
      mapInstance.getCanvas().style.cursor = "pointer";
    }
  });

  mapInstance.on("mouseleave", `${layerId}-fill`, () => {
    if (hoveredId !== null) {
      mapInstance.setFeatureState({ source: layerId, id: hoveredId }, { hover: false });
    }
    hoveredId = null;
    mapInstance.getCanvas().style.cursor = "";
  });
}

const pointToXY = (point: mapboxgl.PointLike): { x: number; y: number } => {
  if (Array.isArray(point)) {
    return { x: point[0], y: point[1] };
  }
  return { x: point.x, y: point.y };
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
  const { visibleLayers, toggleLayer, selectExclusive, toggleCategory } = useMapLayers();
  const visibleLayersRef = useRef(visibleLayers);
  const isTouchDeviceRef = useRef(false);
  const isPopupPinnedRef = useRef(false);
  const [popupInfo, setPopupInfo] = React.useState<{
    map: mapboxgl.Map;
    lngLat: mapboxgl.LngLat;
    results: DistrictLookupResult[];
    isPinned: boolean;
    addressHeading: string | null;
    /** False when the anchor point projects outside the map canvas (panned away). */
    inViewport: boolean;
  } | null>(null);

  const dismissPopup = React.useCallback(() => {
    isPopupPinnedRef.current = false;
    setPopupInfo(null);
    addressMarkerRef.current?.remove();
    addressMarkerRef.current = null;
  }, []);

  /** Let desktop users leave pinned selection (Esc or explicit control) and use hover labels again. */
  React.useEffect(() => {
    if (!popupInfo) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const t = e.target;
      if (
        t instanceof Element &&
        t.closest('input, textarea, select, [contenteditable="true"]')
      ) {
        return;
      }
      e.preventDefault();
      dismissPopup();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [popupInfo, dismissPopup]);
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
  /** After Mapbox style loads; district GeoJSON is added lazily from visible layer toggles. */
  const [mapStyleLoaded, setMapStyleLoaded] = React.useState(false);
  /** Fine pointer + hover — map uses cursor-driven labels unless the user pins a click. */
  const [desktopHoverLabels, setDesktopHoverLabels] = React.useState(false);

  React.useEffect(() => {
    setDesktopHoverLabels(
      typeof window !== "undefined" &&
        !window.matchMedia("(hover: none), (pointer: coarse)").matches,
    );
  }, []);

  const { rootRef: mapRootRef, isFullscreen, toggleFullscreen: toggleMapFullscreen } =
    useMapFullscreen(() => map.current?.resize());

  useEffect(() => {
    visibleLayersRef.current = visibleLayers;
  }, [visibleLayers]);

  useEffect(() => {
    const query = addressQuery.trim();
    if (suppressSuggestions || query.length < 3) {
      const timeoutId = window.setTimeout(() => {
        setAddressSuggestions([]);
        setIsLoadingSuggestions(false);
        setActiveSuggestionIndex(-1);
      }, 0);
      return () => {
        window.clearTimeout(timeoutId);
      };
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
      } catch {
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

  const modeLayers = React.useMemo(
    () => DISTRICT_LAYERS.filter((layer) => ACTIVE_MODE.allowedCategories.includes(layer.category)),
    [],
  );

  const addDistrictLayer = React.useCallback((mapInstance: mapboxgl.Map, layer: DistrictLayer) => {
    if (!mapInstance.getSource(layer.id)) {
      mapInstance.addSource(layer.id, {
        type: "geojson",
        data: resolveDistrictGeoJsonUrl(layer.id, layer.sourceUrl),
        generateId: true,
      });
    }

    if (!mapInstance.getLayer(`${layer.id}-fill`)) {
      mapInstance.addLayer({
        id: `${layer.id}-fill`,
        type: "fill",
        source: layer.id,
        layout: { visibility: "none" },
        paint: {
          "fill-color": layer.color,
          "fill-opacity": 0.12,
          "fill-opacity-transition": { duration: 300 },
        },
        minzoom: layer.minZoom ?? 0,
        maxzoom: layer.maxZoom ?? 24,
      });
    }

    if (!mapInstance.getLayer(`${layer.id}-line`)) {
      mapInstance.addLayer({
        id: `${layer.id}-line`,
        type: "line",
        source: layer.id,
        layout: { visibility: "none" },
        paint: {
          "line-color": layer.color,
          "line-width": 1.5,
          "line-opacity": 0.8,
        },
        minzoom: layer.minZoom ?? 0,
      });
    }

    if (!mapInstance.getLayer(`${layer.id}-hover`)) {
      mapInstance.addLayer({
        id: `${layer.id}-hover`,
        type: "fill",
        source: layer.id,
        layout: { visibility: "none" },
        paint: {
          "fill-color": layer.color,
          "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.3, 0],
        },
      });
    }

    attachDistrictLayerInteractionOnce(mapInstance, layer.id);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isValidPublicMapboxToken(mapboxToken)) return;
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: AUSTIN_DEFAULT_CENTER,
      zoom: AUSTIN_DEFAULT_ZOOM,
      minZoom: 7,
      maxZoom: 18,
      renderWorldCopies: false,
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

    map.current.on("load", () => {
      setMapStyleLoaded(true);

      const lookupDetailsAtPoint = (point: mapboxgl.PointLike): DistrictLookupResult[] =>
        lookupDistrictsAtPoint(map.current!, point, modeLayers, visibleLayersRef.current);

      const snapToNearestDetails = (
        point: mapboxgl.PointLike,
        lngLat: mapboxgl.LngLat,
      ): { lngLat: mapboxgl.LngLat; results: DistrictLookupResult[] } | null => {
        const { x, y } = pointToXY(point);
        const checkedPoints = new Set<string>();
        const searchRadii = [0, 8, 16, 24, 32];

        for (const radius of searchRadii) {
          const offsets =
            radius === 0
              ? [[0, 0]]
              : [
                  [radius, 0],
                  [-radius, 0],
                  [0, radius],
                  [0, -radius],
                  [radius, radius],
                  [radius, -radius],
                  [-radius, radius],
                  [-radius, -radius],
                ];

          for (const [dx, dy] of offsets) {
            const snapPoint: [number, number] = [x + dx, y + dy];
            const key = `${snapPoint[0]},${snapPoint[1]}`;
            if (checkedPoints.has(key)) continue;
            checkedPoints.add(key);

            const results = lookupDetailsAtPoint(snapPoint);
            if (results.length > 0) {
              return {
                lngLat: radius === 0 ? lngLat : map.current!.unproject(snapPoint),
                results,
              };
            }
          }
        }

        return null;
      };

      const showDetailsAtPoint = (
        point: mapboxgl.PointLike,
        lngLat: mapboxgl.LngLat,
        options?: { snapToNearest?: boolean },
      ): boolean => {
        const mapInstance = map.current!;
        const details = options?.snapToNearest
          ? snapToNearestDetails(point, lngLat)
          : { lngLat, results: lookupDetailsAtPoint(point) };
        if (!details || details.results.length === 0) {
          if (options?.snapToNearest) {
            addressMarkerRef.current?.remove();
            addressMarkerRef.current = null;
          }
          setPopupInfo(null);
          mapInstance.getCanvas().style.cursor = "";
          return false;
        }
        if (options?.snapToNearest) {
          addressMarkerRef.current?.remove();
          addressMarkerRef.current = null;
        }
        setPopupInfo({
          map: mapInstance,
          lngLat: details.lngLat,
          results: details.results,
          isPinned: options?.snapToNearest === true,
          addressHeading: null,
          inViewport: true,
        });
        mapInstance.getCanvas().style.cursor = "pointer";
        return true;
      };

      /** Geographic bounds.contains(lngLat) was falsely hiding popups; use screen projection instead. */
      const syncPinnedPopupViewport = () => {
        const mapInst = map.current;
        if (!mapInst) return;
        setPopupInfo((prev) => {
          if (!prev?.isPinned) return prev;
          const pt = mapInst.project(prev.lngLat);
          const canvas = mapInst.getCanvas();
          const w = canvas.clientWidth;
          const h = canvas.clientHeight;
          const pad = 24;
          const inside = pt.x >= -pad && pt.x <= w + pad && pt.y >= -pad && pt.y <= h + pad;
          if (inside === prev.inViewport) return prev;
          return { ...prev, inViewport: inside };
        });
      };
      map.current!.on("moveend", syncPinnedPopupViewport);
      map.current!.on("resize", syncPinnedPopupViewport);

      if (isTouchDeviceRef.current) {
        map.current!.on("click", (event) => {
          const hasResults = showDetailsAtPoint(event.point, event.lngLat, { snapToNearest: true });
          isPopupPinnedRef.current = hasResults;
        });
      } else {
        map.current!.on("click", (event) => {
          const hasResults = showDetailsAtPoint(event.point, event.lngLat, { snapToNearest: true });
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
      setMapStyleLoaded(false);
      addressMarkerRef.current?.remove();
      addressMarkerRef.current = null;
      map.current?.remove();
      map.current = null;
    };
  }, [modeLayers]);

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
      isPopupPinnedRef.current = true;
      setPopupInfo({
        map: mapInstance,
        lngLat,
        results,
        isPinned: true,
        addressHeading: addressName,
        inViewport: true,
      });
    },
    [modeLayers],
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

  // Click-pinned popups capture their results at click time. When the user toggles
  // layer filters afterwards, recompute results at the same location so newly-enabled
  // layers contribute and disabled ones drop out.
  useEffect(() => {
    const mapInstance = map.current;
    if (!mapInstance || !mapStyleLoaded) return;

    let cancelled = false;

    const refreshClickPinnedResults = () => {
      if (cancelled) return;
      setPopupInfo((prev) => {
        if (!prev?.isPinned || prev.addressHeading !== null) return prev;
        const point = mapInstance.project(prev.lngLat);
        const next = lookupDistrictsAtPoint(mapInstance, point, modeLayers, visibleLayers);
        const sameAsPrev =
          prev.results.length === next.length &&
          prev.results.every(
            (result, index) =>
              result.layerId === next[index].layerId &&
              result.featureLabel === next[index].featureLabel,
          );
        if (sameAsPrev) return prev;
        return { ...prev, results: next };
      });
    };

    refreshClickPinnedResults();

    // Newly-enabled layer sources fetch GeoJSON asynchronously; refresh again once
    // each visible source finishes loading so its district appears in the popup.
    const handleSourceData = (event: mapboxgl.MapSourceDataEvent) => {
      if (!event.isSourceLoaded || !event.sourceId) return;
      if (!visibleLayers.has(event.sourceId)) return;
      refreshClickPinnedResults();
    };
    mapInstance.on("sourcedata", handleSourceData);

    return () => {
      cancelled = true;
      mapInstance.off("sourcedata", handleSourceData);
    };
  }, [visibleLayers, mapStyleLoaded, modeLayers]);

  // GeoJSON is fetched when addSource runs — only mount sources for layers that are turned on.
  useEffect(() => {
    if (!map.current || !mapStyleLoaded || !map.current.isStyleLoaded()) return;
    const mapInstance = map.current;
    for (const layer of modeLayers) {
      if (!visibleLayers.has(layer.id)) continue;
      try {
        addDistrictLayer(mapInstance, layer);
      } catch (error) {
        console.error(`Failed to initialize layer ${layer.id}`, error);
      }
    }
    for (const layer of modeLayers) {
      const isVisible = visibleLayers.has(layer.id);
      const vis = isVisible ? "visible" : "none";
      for (const lid of [`${layer.id}-fill`, `${layer.id}-line`, `${layer.id}-hover`] as const) {
        if (mapInstance.getLayer(lid)) {
          mapInstance.setLayoutProperty(lid, "visibility", vis);
        }
      }
    }
  }, [visibleLayers, modeLayers, mapStyleLoaded, addDistrictLayer]);

  return (
    <MapApplicationShell
      rootRef={mapRootRef}
      isFullscreen={isFullscreen}
      onToggleFullscreen={toggleMapFullscreen}
      showFullscreenControl={isValidPublicMapboxToken(mapboxToken)}
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
          </div>
        }
      />
      {ACTIVE_MODE.ui.showLegend ? (
        <Legend layers={modeLayers} visibleLayers={visibleLayers} title={`${ACTIVE_MODE.label} legend`} />
      ) : null}
      {popupInfo && (!popupInfo.isPinned || popupInfo.inViewport) ? (
        <InfoPopup
          map={popupInfo.map}
          lngLat={popupInfo.lngLat}
          results={popupInfo.results}
          isPinned={popupInfo.isPinned}
          addressHeading={popupInfo.addressHeading}
          resumeHoverAction={
            desktopHoverLabels &&
            popupInfo.isPinned &&
            popupInfo.addressHeading === null
          }
          onClose={dismissPopup}
        />
      ) : null}
    </MapApplicationShell>
  );
};