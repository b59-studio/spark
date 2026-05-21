"use client";

import { useId, useState } from "react";
import { isValidNewsletterEmail } from "@/lib/newsletter-email-validation";

type NewsletterSignupProps = {
  variant?: "panel" | "compact";
  className?: string;
  /** Shown above the email field */
  description?: string;
  /** Submit button label */
  submitLabel?: string;
  /** Passed to POST /api/newsletter (MailPoet segmentation). */
  signupSource?: string;
};

export default function NewsletterSignup({
  variant = "panel",
  className = "",
  description,
  submitLabel = "Join mailing list",
  signupSource = "newsletter-form",
}: NewsletterSignupProps) {
  const emailInputId = useId();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isCompact = variant === "compact";
  const desc =
    description ??
    (isCompact
      ? "Get toolkit drops, PAL tracker updates, and event announcements."
      : "Get toolkit drops, PAL tracker updates, and event announcements.");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;

    const raw = (
      form.elements.namedItem("email") as HTMLInputElement | null
    )?.value;
    const email = raw ?? "";
    if (!isValidNewsletterEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: signupSource }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again shortly.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setLoading(false);
    } catch {
      setError("Network error. Check your connection and try again.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <p
        className={[
          isCompact ? "body-sm" : "body-md",
          "text-spark-gold",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        role="status"
      >
        You&apos;re on the list. Check your inbox for a quick welcome note.
      </p>
    );
  }

  return (
    <div
      className={["mx-auto flex w-full flex-col", className]
        .filter(Boolean)
        .join(" ")}
    >
      <p
        className={[
          isCompact ? "body-sm mb-3" : "body-md mb-4",
          "w-full text-left",
        ].join(" ")}
      >
        {desc}
      </p>
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-md flex-col gap-3"
      >
        <label htmlFor={emailInputId} className="sr-only">
          Email address
        </label>
        <input
          id={emailInputId}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="you@example.com"
          disabled={loading}
          className="rounded-xl border border-spark-gold/35 bg-[color-mix(in_srgb,var(--color-spark-bone)_8%,var(--color-spark-bg))] px-4 py-3 text-spark-bone placeholder:text-secondary focus:border-spark-gold focus:outline-none focus:ring-2 focus:ring-spark-gold/25 invalid:border-spark-red"
        />
        {error ? (
          <p className="body-sm text-spark-red" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-60"
        >
          {loading ? "Signing up…" : submitLabel}
        </button>
      </form>
    </div>
  );
}
