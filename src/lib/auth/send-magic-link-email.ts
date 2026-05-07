import MagicLinkEmail from "@/emails/MagicLinkEmail";
import { getResendClient } from "@/lib/resend";

export type SendMagicLinkEmailParams = {
  to: string;
  magicUrl: string;
  staySignedIn: boolean;
};

function magicLinkFromAddress(): string | null {
  const from =
    process.env.MAGIC_LINK_FROM_EMAIL?.trim() ||
    process.env.NEWSLETTER_FROM_EMAIL?.trim() ||
    process.env.RESEND_FROM_EMAIL?.trim();
  return from || null;
}

/**
 * Sends the magic link via Resend. Fails soft (logs, does not throw) so callers can keep
 * enumeration-safe responses.
 */
export async function sendMagicLinkEmail(
  params: SendMagicLinkEmailParams,
): Promise<{ sent: boolean }> {
  const from = magicLinkFromAddress();
  if (!from) {
    console.warn(
      "[auth] Magic link email skipped: set MAGIC_LINK_FROM_EMAIL, NEWSLETTER_FROM_EMAIL, or RESEND_FROM_EMAIL.",
    );
    return { sent: false };
  }

  try {
    const resend = getResendClient();
    const { error } = await resend.emails.send({
      from,
      to: params.to.trim(),
      subject: "Your TX*Spark sign-in link",
      react: MagicLinkEmail({
        magicUrl: params.magicUrl,
        staySignedIn: params.staySignedIn,
      }),
    });
    if (error) {
      console.error("[auth] Magic link email failed:", error.message);
      return { sent: false };
    }
    return { sent: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("RESEND_API_KEY")) {
      console.warn("[auth] Magic link email skipped:", msg);
    } else {
      console.error("[auth] Magic link email error:", msg);
    }
    return { sent: false };
  }
}
