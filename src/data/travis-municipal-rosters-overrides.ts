import type { TravisMunicipalRoster } from "@/data/generated/municipal/travis-municipal-rosters";

/**
 * Manual overrides merged on top of generated Open States rosters (and seed JSON).
 * Use when Open States slug coverage is incomplete or names need correction.
 */
export const TRAVIS_MUNICIPAL_ROSTER_OVERRIDES: Record<string, Partial<TravisMunicipalRoster>> = {};
