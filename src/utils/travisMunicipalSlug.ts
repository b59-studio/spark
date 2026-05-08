/**
 * Maps Travis County GIS municipal `NAME` values (e.g. "City of Rollingwood")
 * to stable roster keys used with Open States `place:*` slugs.
 */
export function travisMunicipalSlugFromGisName(gisName: string): string {
  const trimmed = String(gisName ?? "").trim();
  const core = trimmed.replace(/^(City|Village|Town)\s+of\s+/i, "").trim();
  return core.toLowerCase().replace(/\s+/g, "_");
}
