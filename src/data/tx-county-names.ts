/** Last three digits of Texas county FIPS (state 48). Extend as needed for rural lookups. */
export const TX_COUNTY_CODE_LABEL: Record<string, string> = {
  "015": "Austin County",
  "021": "Bastrop County",
  "027": "Bell County",
  "031": "Blanco County",
  "053": "Burnet County",
  "055": "Caldwell County",
  "099": "Coryell County",
  "105": "Hays County",
  "161": "Gillespie County",
  "221": "Hood County",
  "453": "Travis County",
  "491": "Williamson County",
};

export function labelTexasCountyCode(code: string | number | undefined | null): string | null {
  if (code === undefined || code === null) return null;
  const key = String(code).trim().padStart(3, "0");
  return TX_COUNTY_CODE_LABEL[key] ?? null;
}
