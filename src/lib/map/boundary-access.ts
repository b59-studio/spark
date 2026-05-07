import type { MapApiAccessMode } from "@/lib/map/access-mode";
import {
  parseVolunteerPermissions,
  type UserWithRoles,
} from "@/lib/permissions";

export type BoundarySlugGate =
  | { kind: "all" }
  | { kind: "some"; slugs: ReadonlySet<string> };

/**
 * Which district overlay slugs a user may load (metadata + geometry).
 *
 * - Anonymous callers (`user === null`): **all** layers if map API is `open`; otherwise
 *   callers never reach layer routes unsigned (`assertMapApiAccess` denies first).
 * - Signed-in: union of `boundaryLayerSlugs` on each `UserRole.permissions`; if any
 *   assignment has `allBoundaryLayers === true`, returns **all**. If no boundary keys
 *   are set on any assignment, returns **all** (backward compatible until you tighten JSON).
 */
export function getBoundarySlugGate(
  user: UserWithRoles | null,
  mode: MapApiAccessMode,
): BoundarySlugGate {
  if (!user) {
    return mode === "open" ? { kind: "all" } : { kind: "some", slugs: new Set() };
  }

  let hasAnyBoundaryConfig = false;
  let allowAll = false;
  const union = new Set<string>();

  for (const ur of user.roles) {
    const p = parseVolunteerPermissions(ur.permissions);
    if (p.allBoundaryLayers === true) {
      allowAll = true;
      hasAnyBoundaryConfig = true;
    }
    const list = p.boundaryLayerSlugs;
    if (list !== undefined && list.length > 0) {
      hasAnyBoundaryConfig = true;
      for (const s of list) {
        if (typeof s === "string" && s.length > 0) {
          union.add(s);
        }
      }
    }
  }

  if (allowAll) {
    return { kind: "all" };
  }

  if (!hasAnyBoundaryConfig) {
    return { kind: "all" };
  }

  return { kind: "some", slugs: union };
}

/** Filters requested slugs to those allowed; drops forbidden slugs silently. */
export function intersectBoundarySlugs(
  gate: BoundarySlugGate,
  requested: string[],
): string[] {
  if (gate.kind === "all") {
    return [...requested];
  }
  return requested.filter((s) => gate.slugs.has(s));
}
