"use server";

import { resend } from "@/lib/resend";
import ContactEmail from "@/emails/ContactEmail";

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  await resend.emails.send({
    from: "Your Site <hello@yourdomain.com>",
    to: "you@yourdomain.com",
    subject: "New Contact Submission",
    react: ContactEmail({ name, email, message }),
  });
}
