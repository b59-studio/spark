import Airtable from 'airtable';

export function getAirtableBase() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    throw new Error("Airtable is not configured. Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID.");
  }

  const airtable = new Airtable({ apiKey });
  return airtable.base(baseId);
}