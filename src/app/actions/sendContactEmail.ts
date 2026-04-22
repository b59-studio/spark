"use server";
import { getResendClient } from "@/lib/resend";
import { getAirtableBase } from "@/lib/airtable";
import ConfirmationEmail from "@/emails/ConfirmationEmail";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function sendContactEmail(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const fname = formData.get("fname") as string;
  const lname = formData.get("lname") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;

  console.log('📝 Form data received:', { fname, lname, email, phone, message });

  try {
    const resend = getResendClient();
    const base = getAirtableBase();

    // Save to Airtable
    console.log('💾 Attempting to save to Airtable...');
    await base('Submissions').create([
      {
        fields: {
          FName: fname,
          LName: lname,
          Email: email,
          Phone: phone,
          Message: message,
          'Submission Date': new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ''),
          Status: 'New',
        },
      },  
    ]);
    console.log('✅ Airtable save successful');

    // Send confirmation to the customer
    await resend.emails.send({
      from: "contact@b-59.com",
      to: email,
      subject: "Thanks for contacting B-59.",
      react: ConfirmationEmail({ fname, lname, email, phone, message }),
    });
    console.log('✅ Email sent successfully');
    return {
      status: "success",
      message: "Thanks for reaching out. We got your message and will follow up soon.",
    };
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : "";
    const isConfigurationError =
      errorMessage.includes("not configured") ||
      errorMessage.includes("Missing AIRTABLE") ||
      errorMessage.includes("RESEND_API_KEY");

    if (isConfigurationError) {
      return {
        status: "error",
        message:
          "Looks like you helped us find a bug. We are going to fix this soon - thanks for breaking it!",
      };
    }

    return {
      status: "error",
      message: "Something went wrong while sending your message. Please try again shortly.",
    };
  }
}