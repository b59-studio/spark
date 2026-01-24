"use server";

import { resend } from "@/lib/resend";
import ContactEmail from "@/emails/ContactEmail";
import ConfirmationEmail from "@/emails/ConfirmationEmail";

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  // Send confirmation to the customer
  await resend.emails.send({
    from: "contact@b-59.com",
    to: email, // The email they submitted
    subject: "Thanks for contacting us!",
    react: ConfirmationEmail({ name, email, message }),
  });
}