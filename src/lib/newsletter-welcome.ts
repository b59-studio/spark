import { Resend } from "resend";
import NewsletterWelcomeEmail from "@/emails/NewsletterWelcomeEmail";

/**
 * Sends a one-time welcome message after a successful newsletter signup.
 * Requires RESEND_API_KEY; uses NEWSLETTER_FROM_EMAIL when set (verified sender in Resend).
 */
export async function sendNewsletterWelcomeEmail(toEmail: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from =
    process.env.NEWSLETTER_FROM_EMAIL?.trim() ||
    process.env.RESEND_FROM_EMAIL?.trim();
  if (!from) {
    console.warn(
      "[newsletter] Set NEWSLETTER_FROM_EMAIL or RESEND_FROM_EMAIL to send welcome emails."
    );
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: toEmail.trim(),
    subject: "Welcome to TX*SPARK",
    react: NewsletterWelcomeEmail(),
  });

  if (error) {
    console.error("[newsletter] Welcome email failed:", error.message);
  }
}
