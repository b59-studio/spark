import type { MailPoetConfig } from "@/lib/integrations/mailpoet/config";

export type MailPoetSubscribeInput = {
  email: string;
  source?: string;
  resourceLabel?: string;
  listId?: number;
};

type MailPoetSubscriberPayload = {
  email: string;
  status: "subscribed";
  source?: string;
  tags?: string[];
  lists?: number[];
};

/**
 * Adds a subscriber via MailPoet's WordPress REST API.
 * Requires MailPoet plugin on the WordPress host and an API key.
 *
 * @see https://kb.mailpoet.com/article/390-add-subscribers-with-mailpoets-api
 */
export async function addMailPoetSubscriber(
  config: MailPoetConfig,
  input: MailPoetSubscribeInput
): Promise<{ ok: boolean; subscriberId?: number; error?: string }> {
  const listId = input.listId ?? config.listId;
  const tags: string[] = [];
  if (input.source) tags.push(`source:${input.source}`);
  if (input.resourceLabel) tags.push(`resource:${input.resourceLabel}`);

  const body: MailPoetSubscriberPayload = {
    email: input.email,
    status: "subscribed",
    ...(input.source ? { source: input.source } : {}),
    ...(tags.length ? { tags } : {}),
    ...(listId ? { lists: [listId] } : {}),
  };

  const url = `${config.apiBaseUrl}/wp-json/mailpoet/v1/subscribers`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": config.apiKey,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const subscriberId = parseMailPoetSubscriberId(await res.json().catch(() => null));
      return { ok: true, subscriberId };
    }

    const text = await res.text();
    const duplicate =
      res.status === 409 ||
      /already exists|duplicate/i.test(text);

    if (duplicate) return { ok: true };

    return {
      ok: false,
      error: `MailPoet signup failed (${res.status}).`,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: message };
  }
}

function parseMailPoetSubscriberId(body: unknown): number | undefined {
  if (typeof body !== "object" || body === null) return undefined;

  const record = body as Record<string, unknown>;
  const data =
    typeof record.data === "object" && record.data !== null
      ? (record.data as Record<string, unknown>)
      : record;

  const id = Number(data.id);
  return Number.isFinite(id) && id > 0 ? id : undefined;
}
