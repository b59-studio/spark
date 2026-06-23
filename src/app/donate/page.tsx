import type { Metadata } from "next";
import DonationForm from "@/components/DonationForm";
import { getStripeConfig } from "@/lib/integrations/stripe/config";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Grassroots Tech for Texans. Make a one-time donation to TX*SPARK and help fund free, plain-language civic tools and year-round organizing support.",
  alternates: { canonical: "/donate" },
  openGraph: {
    title: "Donate | TX*SPARK",
    description:
      "Your one-time gift keeps TX*SPARK's tools free and community-rooted. Secure, on-site card donations — no inside baseball required.",
    url: "/donate",
  },
};

export default function DonatePage() {
  const stripe = getStripeConfig();

  return (
    <main className="spark-page-narrow min-h-screen">
      <div className="mx-auto max-w-2xl px-3 py-12 sm:px-4 sm:py-16 lg:py-20">
        <h1 className="heading-xl mb-4 text-center">Support TX*SPARK</h1>
        <p className="body-md mb-10 text-center">
          Your one-time gift keeps our tools free, plain-language, and
          community-rooted. Every dollar funds practical civic infrastructure
          built to outlast any single campaign cycle.
        </p>

        {stripe ? (
          <DonationForm publishableKey={stripe.publishableKey} />
        ) : (
          <DonationsComingSoon />
        )}
      </div>
    </main>
  );
}

function DonationsComingSoon() {
  return (
    <div className="spark-panel spark-framed rounded-2xl p-6 text-center sm:p-8">
      <h2 className="heading-md mb-3">Donations are coming soon</h2>
      <p className="body-md">
        On-site giving isn&apos;t live just yet. Check back shortly — in the
        meantime, reach out if you&apos;d like to support TX*SPARK directly.
      </p>
    </div>
  );
}
