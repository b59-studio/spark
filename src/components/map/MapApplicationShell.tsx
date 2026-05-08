"use client";

import type { ReactNode, RefObject } from "react";

export type MapApplicationShellProps = {
  /** Attach to the element that receives browser fullscreen (same ref as {@link useMapFullscreen}). */
  rootRef: RefObject<HTMLDivElement | null>;
  isFullscreen: boolean;
  /** Left column (filters, layer toggles). Omit for map-only layouts with floating overlays. */
  sidebar?: ReactNode;
  sidebarAriaLabel?: string;
  onToggleFullscreen?: () => void;
  /** When false, the fullscreen control is hidden (e.g. invalid Mapbox token). */
  showFullscreenControl?: boolean;
  /** Map container and any in-map overlays (floating panels, legends, popups). */
  children: ReactNode;
};

/**
 * Shared layout for Mapbox embeds: optional fixed-width left sidebar, map pane with
 * consistent chrome (border, height, fullscreen). Use this for new maps so sizing and
 * filter placement stay consistent.
 */
export function MapApplicationShell({
  rootRef,
  isFullscreen,
  sidebar,
  sidebarAriaLabel = "Map filters and layers",
  onToggleFullscreen,
  showFullscreenControl = Boolean(onToggleFullscreen),
  children,
}: MapApplicationShellProps) {
  const frameHeightClass = isFullscreen
    ? "min-h-0 flex-1"
    : "h-[min(70vh,560px)] min-h-[320px]";

  const hasSidebar = sidebar != null;

  return (
    <div
      ref={rootRef}
      className={`flex flex-col ${isFullscreen ? "h-full min-h-0" : ""}`}
    >
      <div
        className={`flex min-h-0 flex-col overflow-hidden rounded-lg border border-neutral-200 shadow md:flex-row ${frameHeightClass}`}
      >
        {hasSidebar ? (
          <aside
            className="flex max-h-[min(50vh,360px)] w-full shrink-0 flex-col gap-4 overflow-y-auto border-neutral-200 bg-white p-4 text-gray-800 md:max-h-none md:w-[min(100%,280px)] md:border-r"
            aria-label={sidebarAriaLabel}
          >
            {sidebar}
          </aside>
        ) : null}

        <div className="relative flex-1 min-h-[240px] md:min-h-0">
          {showFullscreenControl && onToggleFullscreen ? (
            <button
              type="button"
              onClick={onToggleFullscreen}
              aria-pressed={isFullscreen}
              className="absolute right-12 top-3 z-10 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 shadow-md hover:bg-neutral-50"
            >
              {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            </button>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
