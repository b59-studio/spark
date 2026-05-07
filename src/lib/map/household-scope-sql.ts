import { Prisma } from "@prisma/client";
import type { UserWithRoles } from "@/lib/permissions";
import {
  parseVolunteerPermissions,
  ROLE_NAMES,
} from "@/lib/permissions";

/**
 * SQL predicate for households the user may see on the map when `MAP_API_ACCESS=scoped`.
 * Mirrors `canAccessHousehold` (precinct chair / block captain / volunteer canView).
 */
export function householdScopePredicate(user: UserWithRoles): Prisma.Sql {
  const parts: Prisma.Sql[] = [];

  for (const ur of user.roles) {
    const name = ur.role.name;
    const pid = ur.precinctId;

    if (name === ROLE_NAMES.precinct_chair && pid != null) {
      parts.push(Prisma.sql`h."precinctId" = ${pid}`);
      continue;
    }

    if (
      name === ROLE_NAMES.block_captain &&
      pid != null &&
      ur.blockId != null
    ) {
      parts.push(
        Prisma.sql`(h."precinctId" = ${pid} AND h."blockId" = ${ur.blockId})`,
      );
      continue;
    }

    if (name === ROLE_NAMES.volunteer && pid != null) {
      const permissions = parseVolunteerPermissions(ur.permissions);
      if (permissions.canView === true) {
        parts.push(Prisma.sql`h."precinctId" = ${pid}`);
      }
    }
  }

  if (parts.length === 0) {
    return Prisma.sql`FALSE`;
  }

  let acc = parts[0]!;
  for (let i = 1; i < parts.length; i++) {
    const p = parts[i]!;
    acc = Prisma.sql`${acc} OR ${p}`;
  }
  return acc;
}
