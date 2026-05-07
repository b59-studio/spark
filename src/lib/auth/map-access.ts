import type { UserWithRoles } from "@/lib/permissions";

/**
 * Serializable description of map-related entitlements derived from `UserRole`
 * rows (precinct/block scoping matches `canAccessHousehold` in permissions.ts).
 */
export type MapRoleAssignment = {
  roleName: string;
  precinctId: number | null;
  blockId: number | null;
};

export type MapAccessDescriptor = {
  assignments: MapRoleAssignment[];
  /** One line per assignment for compact UI (map banner, tooltips). */
  labels: string[];
};

function labelForAssignment(a: MapRoleAssignment): string {
  const parts = [a.roleName.replace(/_/g, " ")];
  if (a.precinctId != null) {
    parts.push(`precinct ${a.precinctId}`);
  }
  if (a.blockId != null) {
    parts.push(`block ${a.blockId}`);
  }
  return parts.join(" · ");
}

export function deriveMapAccess(user: Pick<UserWithRoles, "roles">): MapAccessDescriptor {
  const assignments: MapRoleAssignment[] = user.roles.map((ur) => ({
    roleName: ur.role.name,
    precinctId: ur.precinctId,
    blockId: ur.blockId,
  }));
  const labels = assignments.map(labelForAssignment);
  return { assignments, labels };
}
