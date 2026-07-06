"use client";

import { useId, useMemo, useState } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  DONATION_PRESETS_USD,
  dollarsToCents,
  isValidDonationEmail,
} from "@/lib/donations";

type DonationFormProps = {
  publishableKey: string;
};

// Cache the Stripe.js promise across renders (one per publishable key).
let stripePromise: Promise<Stripe | null> | null = null;
function getStripePromise(publishableKey: string): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}

type Phase = "amount" | "payment" | "thanks";

export default function DonationForm({ publishableKey }: DonationFormProps) {
  const stripeJs = useMemo(
    () => getStripePromise(publishableKey),
    [publishableKey]
  );

  const emailFieldId = useId();
  const customFieldId = useId();
  const errorId = useId();

  const [phase, setPhase] = useState<Phase>("amount");
  const [presetUsd, setPresetUsd] = useState<number | null>(
    DONATION_PRESETS_USD[1]
  );
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedCents = useMemo(() => {
    if (customAmount.trim() !== "") return dollarsToCents(customAmount);
    return presetUsd !== null ? presetUsd * 100 : null;
  }, [customAmount, presetUsd]);

  function choosePreset(amount: number) {
    setPresetUsd(amount);
    setCustomAmount("");
    if (error) setError(null);
  }

  async function startDonation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (selectedCents === null || selectedCents < 100) {
      setError("Choose or enter a donation amount of at least $1.");
      return;
    }
    if (!isValidDonationEmail(email)) {
      setError("Enter a valid email for your receipt.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountCents: selectedCents, email: email.trim() }),
      });
      const data = (await res.json()) as {
        clientSecret?: string;
        error?: string;
      };
      if (!res.ok || !data.clientSecret) {
        setError(data.error ?? "Could not start the donation. Please try again.");
        setSubmitting(false);
        return;
      }
      setClientSecret(data.clientSecret);
      setPhase("payment");
      setSubmitting(false);
    } catch {
      setError("Network error. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  if (phase === "thanks") {
    return (
      <div className="spark-panel spark-framed rounded-2xl p-6 sm:p-8" role="status">
        <h2 className="heading-md mb-3">Thank you for your support</h2>
        <p className="body-md">
          Your donation went through. A receipt is on its way to{" "}
          <span className="text-spark-green">{email.trim()}</span>.
        </p>
      </div>
    );
  }

  if (phase === "payment" && clientSecret) {
    return (
      <div className="spark-panel spark-framed rounded-2xl p-6 sm:p-8">
        <h2 className="heading-md mb-1">Complete your donation</h2>
        <p className="body-sm mb-5">
          Donating{" "}
          <span className="text-spark-green">
            ${((selectedCents ?? 0) / 100).toFixed(2)}
          </span>
          . Your card details stay on this page.
        </p>
        <Elements
          stripe={stripeJs}
          options={{
            clientSecret,
            appearance: { theme: "night", labels: "floating" },
          }}
        >
          <PaymentStep
            onSuccess={() => setPhase("thanks")}
            onBack={() => {
              setPhase("amount");
              setClientSecret(null);
            }}
          />
        </Elements>
      </div>
    );
  }

  return (
    <form
      onSubmit={startDonation}
      className="spark-panel spark-framed rounded-2xl p-6 sm:p-8"
      noValidate
    >
      <fieldset className="mb-6">
        <legend className="form-label mb-3">Choose an amount</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DONATION_PRESETS_USD.map((amount) => {
            const active = customAmount.trim() === "" && presetUsd === amount;
            return (
              <button
                key={amount}
                type="button"
                onClick={() => choosePreset(amount)}
                aria-pressed={active}
                className={[
                  "rounded-xl border-2 px-4 py-3 text-lg font-semibold transition-colors",
                  active
                    ? "border-spark-green bg-[color-mix(in_srgb,var(--color-spark-green)_18%,transparent)] text-spark-ink"
                    : "border-[color-mix(in_srgb,var(--color-spark-green)_35%,transparent)] text-spark-ink hover:border-spark-green",
                ].join(" ")}
              >
                ${amount}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mb-6">
        <label htmlFor={customFieldId} className="form-label mb-2 block">
          Or enter a custom amount
        </label>
        <div className="relative">
          <span
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-spark-ink"
            aria-hidden
          >
            $
          </span>
          <input
            id={customFieldId}
            name="customAmount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="Custom amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              if (e.target.value.trim() !== "") setPresetUsd(null);
              if (error) setError(null);
            }}
            className="spark-text-input pl-8"
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor={emailFieldId} className="form-label mb-2 block">
          Email for your receipt
        </label>
        <input
          id={emailFieldId}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          className="spark-text-input"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
      </div>

      {error ? (
        <p id={errorId} className="body-sm mb-4 text-spark-paint" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full disabled:opacity-60"
      >
        {submitting ? "Starting…" : "Continue to payment"}
      </button>
    </form>
  );
}

function PaymentStep({
  onSuccess,
  onBack,
}: {
  onSuccess: () => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  async function confirm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setConfirming(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (confirmError) {
      setError(
        confirmError.message ?? "Payment could not be completed. Please try again."
      );
      setConfirming(false);
      return;
    }

    setConfirming(false);
    onSuccess();
  }

  return (
    <form onSubmit={confirm} className="flex flex-col gap-5">
      <PaymentElement />
      {error ? (
        <p className="body-sm text-spark-paint" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row-reverse">
        <button
          type="submit"
          disabled={!stripe || confirming}
          className="btn-primary w-full disabled:opacity-60 sm:w-auto"
        >
          {confirming ? "Processing…" : "Donate now"}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={confirming}
          className="btn-secondary w-full disabled:opacity-60 sm:w-auto"
        >
          Back
        </button>
      </div>
    </form>
  );
}
