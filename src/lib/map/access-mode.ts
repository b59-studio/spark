/**
 * Server-only map API policy. Defaults to `open` so local/dev keeps working.
 *
 * - `open` — no login required; all rows (current behavior).
 * - `authenticated` — must be signed in; row filters still off (until you tighten policy).
 * - `scoped` — signed in; household points filtered by `UserRole` (see `household-scope-sql.ts`).
 *
 * District overlays (`/api/map/boundary-layers`, `/api/map/boundaries`) additionally consult
 * `UserRole.permissions.boundaryLayerSlugs` and `allBoundaryLayers` (see `boundary-access.ts`).
 *
 * Set `MAP_API_ACCESS=authenticated` or `MAP_API_ACCESS=scoped`.
 */
export type MapApiAccessMode = "open" | "authenticated" | "scoped";

export function getMapApiAccessMode(): MapApiAccessMode {
  const raw = process.env.MAP_API_ACCESS?.trim().toLowerCase();
  if (raw === "authenticated" || raw === "auth") {
    return "authenticated";
  }
  if (raw === "scoped") {
    return "scoped";
  }
  return "open";
}
