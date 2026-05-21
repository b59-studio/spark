export type MailPoetConfig = {
  /** WordPress origin where MailPoet is installed (no trailing slash). */
  apiBaseUrl: string;
  /** MailPoet → Settings → Advanced → API key */
  apiKey: string;
  /** Optional default list ID for new subscribers. */
  listId?: number;
};

export function getMailPoetConfig(): MailPoetConfig | null {
  const apiBaseUrl = process.env.MAILPOET_API_BASE_URL?.trim().replace(/\/$/, "");
  const apiKey = process.env.MAILPOET_API_KEY?.trim();
  if (!apiBaseUrl || !apiKey) return null;

  const listRaw = process.env.MAILPOET_LIST_ID?.trim();
  const listId = listRaw ? Number.parseInt(listRaw, 10) : undefined;

  return {
    apiBaseUrl,
    apiKey,
    listId: listId && !Number.isNaN(listId) ? listId : undefined,
  };
}
