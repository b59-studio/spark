import type { DistrictLayer, DistrictLookupResult } from "@/types/district.types";
import { ATX_MAYOR_NAME } from "@/data/atx-mayor";
import { ATX_COUNCIL_MEMBER_BY_DISTRICT } from "@/data/atx-council-members";
import { MUNICIPAL_COUNCIL_MEMBER_BY_CITY_AND_DISTRICT } from "@/data/travis-municipal-council-by-district";
import {
  trusteeNameForIsdDistrict,
  trusteeRollcallForIsdSlug,
} from "@/data/travis-isd-trustee-rosters";
import { TX_STATE_REP_BY_HOUSE_DISTRICT } from "@/data/tx-state-house";
import { TX_STATE_SENATOR_BY_DISTRICT } from "@/data/tx-state-senate";
import { TX_US_REP_BY_CONGRESSIONAL_DISTRICT } from "@/data/tx-us-house";
import { travisMunicipalSlugFromGisName } from "@/utils/travisMunicipalSlug";
import { mergedTravisMunicipalRoster } from "@/utils/travisMunicipalRosterMerge";

type Raw = Record<string, string | number | boolean | null | undefined>;

function normStr(v: unknown): string {
  return String(v ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

function parseIntFlexible(v: unknown): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = Number.parseInt(String(v).trim(), 10);
  return Number.isFinite(n) ? n : null;
}

/** Strip redundant rows where the value repeats the primary label or duplicates another row. */
function pruneRedundantRows(featureLabel: string, props: Record<string, string>): Record<string, string> {
  const fl = normStr(featureLabel).toLowerCase();
  const out: Record<string, string> = {};
  const seenVals = new Set<string>();

  for (const [key, rawVal] of Object.entries(props)) {
    const val = normStr(rawVal);
    if (!val) continue;
    const vl = val.toLowerCase();

    if (seenVals.has(vl)) continue;
    seenVals.add(vl);

    const combinedLabelVal = normStr(`${key} ${rawVal}`).toLowerCase();
    if (combinedLabelVal === fl) continue;

    if (vl === fl) continue;
    if (key === "Name" && (vl.includes(fl) || fl.includes(vl))) continue;
    if ((key === "District" || key === "Precinct" || key === "VTD") && vl === fl) continue;

    out[key] = val;
  }
  return out;
}

export function enrichDistrictLookupResult(
  layer: DistrictLayer,
  raw: Raw | undefined,
  base: DistrictLookupResult,
): DistrictLookupResult {
  let featureLabel = normStr(base.featureLabel);
  const props = { ...base.properties };

  switch (layer.id) {
    case "congressional": {
      const cd =
        parseIntFlexible(raw?.CD119) ??
        parseIntFlexible(raw?.DISTRICT) ??
        parseIntFlexible(raw?.district);
      if (cd !== null) {
        featureLabel = `Congressional District ${cd}`;
        const rep = TX_US_REP_BY_CONGRESSIONAL_DISTRICT[cd];
        if (rep) props["U.S. Representative"] = rep;
      }
      delete props.District;
      delete props.Name;
      delete props.GEOID;
      break;
    }
    case "tx-state-senate": {
      const sd =
        parseIntFlexible(raw?.SLDU) ??
        parseIntFlexible(raw?.DISTRICT) ??
        parseIntFlexible(raw?.district);
      if (sd !== null) {
        featureLabel = `Senate District ${sd}`;
        const sen = TX_STATE_SENATOR_BY_DISTRICT[sd];
        if (sen) props["State Senator"] = sen;
      }
      delete props.District;
      delete props.Name;
      delete props.GEOID;
      break;
    }
    case "tx-state-house": {
      const hd =
        parseIntFlexible(raw?.SLDL) ??
        parseIntFlexible(raw?.DISTRICT) ??
        parseIntFlexible(raw?.district);
      if (hd !== null) {
        featureLabel = `House District ${hd}`;
        const rep = TX_STATE_REP_BY_HOUSE_DISTRICT[hd];
        if (rep) props["State Representative"] = rep;
      }
      delete props.District;
      delete props.Name;
      delete props.GEOID;
      break;
    }
    case "travis-census-vtd-and-tracts": {
      const kind = normStr(raw?._CENSUS_KIND);
      if (kind === "VTD") {
        const vtdRaw = raw?.VTD ?? raw?.BASENAME ?? props.VTD ?? props.Name;
        const vtd = normStr(vtdRaw);
        if (vtd) featureLabel = `Voting Tabulation District: ${vtd}`;
      } else if (kind === "CENSUS_TRACT") {
        const basename = normStr(raw?.BASENAME ?? "");
        const tractRaw = raw?.TRACT;
        const tractDisplay =
          basename ||
          (tractRaw !== undefined && tractRaw !== null
            ? normStr(String(tractRaw).replace(/^0+/, "") || String(tractRaw))
            : "");
        if (tractDisplay) featureLabel = `Census Tract ${tractDisplay}`;
      }
      for (const k of Object.keys(props)) delete props[k];
      delete props.VTD;
      delete props.Name;
      delete props.County;
      delete props.GEOID;
      delete props._CENSUS_KIND;
      break;
    }
    case "atx-council": {
      const dn =
        parseIntFlexible(raw?.district_number) ??
        parseIntFlexible(raw?.DISTRICT_NUMBER) ??
        parseIntFlexible(raw?.COUNCIL_DISTRICT);
      const dname = normStr(raw?.district_name ?? raw?.DISTRICT_NAME);
      if (dn !== null) {
        featureLabel = dname || `District ${dn}`;
        const member = ATX_COUNCIL_MEMBER_BY_DISTRICT[dn];
        if (member) props["Council Member"] = member;
        props.District = dname || `District ${dn}`;
      }
      props.Mayor = ATX_MAYOR_NAME;
      break;
    }
    case "travis-city-government": {
      const kind = normStr(raw?._REGION_KIND);
      if (kind === "municipal_ward") {
        const slug = normStr(raw?.CITY_SLUG);
        const cityName = normStr(raw?.CITY_NAME);
        const dn =
          parseIntFlexible(raw?.DISTRICT_NUM) ?? parseIntFlexible(raw?.DISTRICT);
        if (cityName && dn !== null) {
          featureLabel = `${cityName} · District ${dn}`;
          const member = slug ? MUNICIPAL_COUNCIL_MEMBER_BY_CITY_AND_DISTRICT[slug]?.[dn] : undefined;
          if (member) props["Council Member"] = member;
          props.District = String(dn);
        }
        delete props.CITY_SLUG;
        delete props.CITY_NAME;
        delete props.DISTRICT_NUM;
      } else if (kind === "municipal_limits") {
        const slug =
          normStr(raw?.CITY_SLUG) || travisMunicipalSlugFromGisName(normStr(raw?.NAME));
        const shortName = normStr(raw?.NAME).replace(/^(City|Village|Town)\s+of\s+/i, "").trim();
        if (shortName) featureLabel = shortName;
        const roster = slug ? mergedTravisMunicipalRoster(slug) : undefined;
        if (roster?.mayor) props.Mayor = roster.mayor;
        if (roster?.councilMembers?.length) {
          props["Council members"] = roster.councilMembers.join("; ");
        }
        delete props.NAME;
        delete props.CITY_SLUG;
        delete props.OBJECTID;
      }
      delete props._REGION_KIND;
      break;
    }
    case "travis-school-districts": {
      const fk = normStr(raw?._FEATURE_KIND);
      if (fk === "trustee_district") {
        const slug = normStr(raw?.ISD_SLUG);
        const isdName = normStr(raw?.ISD_NAME);
        const dn =
          parseIntFlexible(raw?.DISTRICT_NUM) ?? parseIntFlexible(raw?.DISTRICT);
        if (dn !== null) {
          featureLabel = isdName ? `${isdName} · District ${dn}` : `Trustee District ${dn}`;
          const trustee = slug ? trusteeNameForIsdDistrict(slug, dn) : undefined;
          if (trustee) props.Trustee = trustee;
          props.District = String(dn);
          if (isdName) props["School district"] = isdName;
        }
        delete props.ISD_SLUG;
        delete props.ISD_NAME;
        delete props.DISTRICT_NUM;
      } else if (fk === "isd_boundary") {
        const slug = normStr(raw?.ISD_SLUG);
        const isdName = normStr(raw?.ISD_NAME ?? raw?.NAME);
        featureLabel = isdName || featureLabel;
        if (isdName) props["School district"] = isdName;
        const roll = slug ? trusteeRollcallForIsdSlug(slug) : undefined;
        if (roll) props.Trustees = roll;
        delete props.NAME;
        delete props.NAME2;
        delete props.SDLEA;
        delete props.NCES_DISTR;
        delete props.DISTRICT;
        delete props.ISD_SLUG;
      }
      delete props._FEATURE_KIND;
      break;
    }
    default:
      break;
  }

  const pruned = pruneRedundantRows(featureLabel, props);

  return {
    ...base,
    featureLabel,
    properties: pruned,
  };
}
