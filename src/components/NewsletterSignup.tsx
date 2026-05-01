"use client";

import { useState } from "react";

type NewsletterSignupProps = {
  variant?: "panel" | "compact";
  className?: string;
  /** Shown above the email field */
  description?: string;
  /** Submit button label */
  submitLabel?: string;
  /** Called after a successful API response (cookie is set server-side) */
  onSuccess?: () => void;
};

export default function NewsletterSignup({
  variant = "panel",
  className = "",
  description,
  submitLabel = "Join mailing list",
  onSuccess,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Try again shortly.");
        return;
      }
      setStatus("success");
      setMessage("You’re on the list. Thanks for signing up!");
      onSuccess?.();
    } catch {
      setStatus("error");
      setMessage("Network error. Check your connection and try again.");
    }
  }

  const isCompact = variant === "compact";
  const desc =
    description ??
    (isCompact
      ? "Enter your email to unlock resource links and get occasional updates from TX*Spark."
      : "Get toolkit drops, PAL tracker updates, and event announcements.");

  if (status === "success") {
    return (
      <div
        className={[
          isCompact ? "rounded-xl border border-spark-dark/15 spark-glass p-4" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        role="status"
      >
        <p className="body-sm text-spark-sage">{message}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <p className={[isCompact ? "body-sm mb-3" : "body-md mb-4"].join(" ")}>
        {desc}
      </p>
      <form
        onSubmit={handleSubmit}
        className={[
          "flex flex-col gap-3",
          !isCompact ? "sm:flex-row sm:items-stretch sm:gap-3" : "",
        ].join(" ")}
      >
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className={[
            "rounded-xl border border-spark-dark/20 bg-white/80 px-4 py-3 text-spark-dark placeholder:text-secondary focus:border-spark-blue focus:outline-none focus:ring-2 focus:ring-spark-blue/25",
            !isCompact ? "sm:flex-1" : "w-full",
          ].join(" ")}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={[
            "btn-primary whitespace-nowrap disabled:opacity-60",
            !isCompact ? "sm:self-auto" : "",
          ].join(" ")}
        >
          {status === "loading" ? "Signing up…" : submitLabel}
        </button>
      </form>
      {status === "error" && message ? (
        <p className="body-sm mt-3 text-red-800" role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}
