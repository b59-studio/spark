"use server";
import { resend } from "@/lib/resend";
import { base } from "@/lib/airtable";
import ConfirmationEmail from "@/emails/ConfirmationEmail";

export async function sendContactEmail(formData: FormData): Promise<void> {
  const fname = formData.get("fname") as string;
  const lname = formData.get("lname") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;

  console.log('📝 Form data received:', { fname, lname, email, phone, message });

  try {
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
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to submit form.');
  }
}