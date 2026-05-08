"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { exitElFullscreen, getFullscreenElement, requestElFullscreen } from "@/lib/map/fullscreen";

/**
 * Fullscreen target for map pages: attach {@link rootRef} to the wrapper that should
 * go fullscreen. Optionally notify when fullscreen state changes so the Mapbox map can
 * {@link mapboxgl.Map#resize}.
 */
export function useMapFullscreen(onAfterFullscreenChange?: () => void) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const afterChangeRef = useRef(onAfterFullscreenChange);
  afterChangeRef.current = onAfterFullscreenChange;

  useEffect(() => {
    const syncFullscreen = () => {
      const root = rootRef.current;
      const active = root != null && getFullscreenElement() === root;
      setIsFullscreen(active);
      requestAnimationFrame(() => {
        afterChangeRef.current?.();
      });
    };
    document.addEventListener("fullscreenchange", syncFullscreen);
    document.addEventListener("webkitfullscreenchange", syncFullscreen);
    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreen);
      document.removeEventListener("webkitfullscreenchange", syncFullscreen);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const entering = getFullscreenElement() !== root;
    void (entering ? requestElFullscreen(root) : exitElFullscreen()).catch(() => {
      /* user denied or API unavailable */
    });
  }, []);

  return { rootRef, isFullscreen, toggleFullscreen };
}
