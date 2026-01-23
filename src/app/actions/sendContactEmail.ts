"use server";

import { resend } from "@/lib/resend";
import ContactEmail from "@/emails/ContactEmail";

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  await resend.emails.send({
    from: "B-59 Studio <contact@b-59.com>",
    to: "contact@b-59.com",
    subject: "Welcome Email Test",
    react: "You got a new submission!" + ContactEmail({ name, email, message }),
  });
}

/** 
 
// Send confirmation to the customer
await resend.emails.send({
  from: "contact@b-59.com",
  to: email, // The email they submitted
  subject: "Thanks for contacting us!",
  react: ConfirmationEmail({ name }),
});

// Send notification to yourself
await resend.emails.send({
  from: "contact@b-59.com",
  to: "contact@b-59.com",
  subject: "New Contact Submission",
  react: ContactEmail({ name, email, message }),
});

*/