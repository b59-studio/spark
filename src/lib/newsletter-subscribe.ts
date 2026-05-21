import { Resend } from "resend";
import { addMailPoetSubscriber } from "@/lib/integrations/mailpoet/subscribe";
import { getMailPoetConfig } from "@/lib/integrations/mailpoet/config";
import { isValidNewsletterEmail } from "@/lib/newsletter-email-validation";

export { isValidNewsletterEmail } from "@/lib/newsletter-email-validation";

export type NewsletterSubscribeOptions = {
  source?: string;
  resourceLabel?: string;
};

/**
 * Syncs a subscriber to MailPoet (preferred when configured), Resend Contacts,
 * and/or an optional webhook for CRM automation.
 */
export async function syncNewsletterSubscriber(
  email: string,
  options: NewsletterSubscribeOptions = {}
): Promise<{ ok: boolean; error?: string }> {
  const normalized = email.trim().toLowerCase();
  if (!isValidNewsletterEmail(normalized)) {
    return { ok: false, error: "Invalid email address." };
  }

  const mailpoet = getMailPoetConfig();
  const apiKey = process.env.RESEND_API_KEY;
  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL?.trim();

  if (
    process.env.NODE_ENV === "production" &&
    !mailpoet &&
    !apiKey &&
    !webhookUrl
  ) {
    return {
      ok: false,
      error:
        "Newsletter signup is not configured. Set MAILPOET_* and/or RESEND_API_KEY and/or NEWSLETTER_WEBHOOK_URL.",
    };
  }

  try {
    if (mailpoet) {
      const mp = await addMailPoetSubscriber(mailpoet, {
        email: normalized,
        source: options.source,
        resourceLabel: options.resourceLabel,
      });
      if (!mp.ok) return mp;
    }

    if (apiKey) {
      const resend = new Resend(apiKey);
      const { error } = await resend.contacts.create({
        email: normalized,
        unsubscribed: false,
      });
      if (error) {
        const duplicate = /already exists|duplicate contact/i.test(
          error.message
        );
        if (!duplicate) {
          return { ok: false, error: error.message };
        }
      }
    }

    if (webhookUrl) {
      const secret = process.env.NEWSLETTER_WEBHOOK_SECRET;
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (secret) {
        headers["X-Webhook-Secret"] = secret;
      }
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          email: normalized,
          source: options.source ?? "txspark-site",
          resourceLabel: options.resourceLabel,
          subscribedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        return {
          ok: false,
          error: "Could not complete signup. Please try again later.",
        };
      }
    }

    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: message };
  }
}
