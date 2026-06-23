import { NextResponse } from "next/server";
import { getStripeServerClient } from "@/lib/integrations/stripe/server";
import {
  DONATION_CURRENCY,
  isValidDonationEmail,
  validateAmountCents,
} from "@/lib/donations";

type DonateBody = {
  amountCents?: unknown;
  email?: unknown;
};

export async function POST(req: Request) {
  const stripe = getStripeServerClient();
  if (!stripe) {
    return NextResponse.json(
      { error: "Donations are not available right now." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { amountCents, email } = (body ?? {}) as DonateBody;

  const amount = validateAmountCents(amountCents);
  if (!amount.ok) {
    return NextResponse.json({ error: amount.error }, { status: 400 });
  }

  const receiptEmail =
    typeof email === "string" && isValidDonationEmail(email)
      ? email.trim()
      : null;
  if (!receiptEmail) {
    return NextResponse.json(
      { error: "Enter a valid email for your receipt." },
      { status: 400 }
    );
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount: amount.amountCents,
      currency: DONATION_CURRENCY,
      receipt_email: receiptEmail,
      // Embedded Payment Element drives the available methods.
      automatic_payment_methods: { enabled: true },
      metadata: { source: "donation" },
    });

    if (!intent.client_secret) {
      return NextResponse.json(
        { error: "Could not start the donation. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (e) {
    // Log only the error message — never the request body, email, or keys.
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[donate] PaymentIntent create failed:", message);
    return NextResponse.json(
      { error: "Could not start the donation. Please try again." },
      { status: 502 }
    );
  }
}
