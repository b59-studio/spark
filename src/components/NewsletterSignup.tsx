"use client";

import { useState } from "react";
import { isValidNewsletterEmail } from "@/lib/newsletter-email-validation";

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
    setMessage(null);
    const trimmed = email.trim();
    if (!isValidNewsletterEmail(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
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
          "mx-auto flex w-full flex-col items-center text-center",
          isCompact ? "spark-sky-panel rounded-xl p-4" : "",
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
      <div className="flex w-full justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col gap-3"
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
            className="w-full rounded-xl border border-spark-blue/35 bg-white px-4 py-3 text-spark-dark placeholder:text-secondary focus:border-spark-blue focus:outline-none focus:ring-2 focus:ring-spark-blue/25"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary w-full whitespace-nowrap disabled:opacity-60"
          >
            {status === "loading" ? "Signing up…" : submitLabel}
          </button>
        </form>
      </div>
      {status === "error" && message ? (
        <p
          className="body-sm mx-auto mt-3 max-w-md text-center text-red-800"
          role="alert"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
