import type { TravisMunicipalRoster } from "@/data/generated/municipal/travis-municipal-rosters";
import { TRAVIS_MUNICIPAL_ROSTER_BY_SLUG } from "@/data/generated/municipal/travis-municipal-rosters";
import { TRAVIS_MUNICIPAL_ROSTER_OVERRIDES } from "@/data/travis-municipal-rosters-overrides";

export function mergedTravisMunicipalRoster(slug: string): TravisMunicipalRoster | undefined {
  const base = TRAVIS_MUNICIPAL_ROSTER_BY_SLUG[slug];
  const override = TRAVIS_MUNICIPAL_ROSTER_OVERRIDES[slug];
  if (!base && !override) return undefined;
  const mayor =
    override?.mayor !== undefined ? override.mayor : base?.mayor ?? null;
  const councilMembers =
    override?.councilMembers !== undefined
      ? override.councilMembers
      : base?.councilMembers ?? [];
  return { mayor, councilMembers };
}
