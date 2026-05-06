import type { Household, Prisma } from "@prisma/client";

/** Known role name strings (must match `Role.name` rows in the database). */
export const ROLE_NAMES = {
  precinct_chair: "precinct_chair",
  block_captain: "block_captain",
  volunteer: "volunteer",
} as const;

export type KnownRoleName = (typeof ROLE_NAMES)[keyof typeof ROLE_NAMES];

export type VolunteerPermissions = {
  canView?: boolean;
};

export class ForbiddenError extends Error {
  readonly statusCode = 403;

  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/** User loaded with `roles` including nested `role` (see Prisma `include`). */
export type UserWithRoles = Prisma.UserGetPayload<{
  include: { roles: { include: { role: true } } };
}>;

function parseVolunteerPermissions(
  json: Prisma.JsonValue | null
): VolunteerPermissions {
  if (json === null || typeof json !== "object" || Array.isArray(json)) {
    return {};
  }
  const o = json as Record<string, unknown>;
  const canView = o.canView;
  return {
    canView: typeof canView === "boolean" ? canView : undefined,
  };
}

export function hasRole(
  user: Pick<UserWithRoles, "roles">,
  allowedRoleNames: readonly string[]
): boolean {
  return user.roles.some((r) => allowedRoleNames.includes(r.role.name));
}

export function requireRole(
  user: Pick<UserWithRoles, "roles">,
  allowedRoleNames: readonly string[]
): void {
  if (!hasRole(user, allowedRoleNames)) {
    throw new ForbiddenError();
  }
}

export type HouseholdScope = Pick<Household, "precinctId" | "blockId">;

/**
 * Whether `user` may access data for `household` based on precinct-scoped roles.
 *
 * - **precinct_chair**: same precinct as the household.
 * - **block_captain**: same precinct and same `blockId` as the household.
 * - **volunteer**: same precinct and `permissions.canView === true` on the assignment.
 */
export function canAccessHousehold(
  user: Pick<UserWithRoles, "roles">,
  household: HouseholdScope
): boolean {
  return user.roles.some((userRole) => {
    if (userRole.precinctId !== household.precinctId) {
      return false;
    }

    const name = userRole.role.name;

    if (name === ROLE_NAMES.precinct_chair) {
      return true;
    }

    if (name === ROLE_NAMES.block_captain) {
      return userRole.blockId === household.blockId;
    }

    if (name === ROLE_NAMES.volunteer) {
      const permissions = parseVolunteerPermissions(userRole.permissions);
      return permissions.canView === true;
    }

    return false;
  });
}

export function requireHouseholdAccess(
  user: Pick<UserWithRoles, "roles">,
  household: HouseholdScope
): void {
  if (!canAccessHousehold(user, household)) {
    throw new ForbiddenError();
  }
}
