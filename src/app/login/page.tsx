"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState, type FormEvent } from "react";
import {
  evaluatePasswordRules,
  passwordMeetsAllRules,
} from "@/lib/password-rules";

function LoginForm() {
  const params = useSearchParams();
  const error = params.get("error");
  const [email, setEmail] = useState("");
  const [staySignedIn, setStaySignedIn] = useState(true);
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const [debugLink, setDebugLink] = useState<string | null>(null);

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPassword2, setSignupPassword2] = useState("");
  const [signupStatus, setSignupStatus] = useState<"idle" | "thanks">("idle");
  const [signupClientError, setSignupClientError] = useState<string | null>(
    null
  );

  const ruleChecks = useMemo(
    () => evaluatePasswordRules(signupPassword),
    [signupPassword]
  );

  async function onMagicSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setDebugLink(null);
    try {
      const res = await fetch("/api/auth/magic-link/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, staySignedIn }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        debug?: { magicUrl?: string };
      };
      if (data.debug?.magicUrl) {
        setDebugLink(data.debug.magicUrl);
      }
      setStatus("sent");
    } catch {
      setStatus("idle");
    }
  }

  function onSignupSubmit(e: FormEvent) {
    e.preventDefault();
    setSignupClientError(null);

    const em = signupEmail.trim().toLowerCase();
    if (!em || !em.includes("@")) {
      setSignupClientError("Enter a valid email address.");
      return;
    }

    if (!passwordMeetsAllRules(signupPassword)) {
      setSignupClientError(
        "Your password does not meet all of the requirements below."
      );
      return;
    }

    if (signupPassword !== signupPassword2) {
      setSignupClientError("Passwords do not match.");
      return;
    }

    setSignupStatus("thanks");
  }

  const errorMessage =
    error === "invalid_token"
      ? "This sign-in link is invalid or has already been used."
      : error === "missing_token"
        ? "Sign-in link was incomplete."
        : error === "server_config"
          ? "Sign-in is not configured (missing AUTH_SECRET on the server)."
          : null;

  return (
    <div className="mx-auto max-w-md px-4 pb-16 pt-12 md:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-spark-bone">
        Sign in
      </h1>
      <p className="mt-2 text-base leading-relaxed text-spark-bone/80">
        Enter the email address on your account. We will send you a one-time link to
        open organizer tools and the map at your assigned role level.
      </p>

      {errorMessage ? (
        <p
          className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}

      {status === "sent" ? (
        <p className="mt-8 rounded-lg border border-spark-bone/20 bg-spark-bone/5 px-4 py-3 text-sm text-spark-bone/90">
          If that email matches an account, a sign-in link was created. Check your inbox
          (and spam) for the message from TX*Spark.
        </p>
      ) : (
        <form onSubmit={onMagicSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-spark-bone/90">
              Email
            </span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-spark-bone/20 bg-spark-bone/5 px-3 py-2 text-spark-bone placeholder:text-spark-bone/40 focus:border-spark-bone/40 focus:outline-none focus:ring-1 focus:ring-spark-bone/30"
              placeholder="you@example.com"
            />
          </label>
          <label className="flex cursor-pointer items-start gap-3 py-1">
            <input
              type="checkbox"
              checked={staySignedIn}
              onChange={(e) => setStaySignedIn(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-spark-bone/30 text-spark-bone focus:ring-spark-bone/40"
            />
            <span className="text-sm leading-snug text-spark-bone/85">
              Stay signed in on this device (longer session until you sign out).
            </span>
          </label>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-lg bg-spark-bone px-4 py-2.5 text-sm font-medium text-spark-void transition hover:bg-spark-bone/90 disabled:opacity-60"
          >
            {status === "submitting" ? "Sending…" : "Email me a link"}
          </button>
        </form>
      )}

      {debugLink ? (
        <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-100">
          <p className="font-medium">Local debug (MAGIC_LINK_DEBUG=1)</p>
          <a href={debugLink} className="mt-2 block break-all underline">
            {debugLink}
          </a>
        </div>
      ) : null}

      <div className="mt-12 border-t border-spark-bone/15 pt-10">
        <h2 className="text-lg font-semibold text-spark-bone">
          Request access
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-spark-bone/75">
          We are not accepting new accounts through this form yet. If you would like
          to get on the list, leave your email and a password that meets the rules
          below—we will use this pattern when accounts open up.
        </p>

        {signupStatus === "thanks" ? (
          <p
            className="mt-6 rounded-lg border border-spark-purple/25 bg-spark-purple/10 px-4 py-3 text-sm text-spark-bone"
            role="status"
          >
            Thanks for being so eager! You&apos;ll be able to log in soon.
          </p>
        ) : (
          <form onSubmit={onSignupSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-spark-bone/90">
                Email
              </span>
              <input
                type="email"
                autoComplete="email"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full rounded-lg border border-spark-bone/20 bg-spark-bone/5 px-3 py-2 text-spark-bone placeholder:text-spark-bone/40 focus:border-spark-bone/40 focus:outline-none focus:ring-1 focus:ring-spark-bone/30"
                placeholder="you@example.com"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-spark-bone/90">
                Password (for future use)
              </span>
              <input
                type="password"
                autoComplete="new-password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full rounded-lg border border-spark-bone/20 bg-spark-bone/5 px-3 py-2 text-spark-bone placeholder:text-spark-bone/40 focus:border-spark-bone/40 focus:outline-none focus:ring-1 focus:ring-spark-bone/30"
                placeholder="Choose a strong password"
              />
            </label>
            <ul className="space-y-1.5 rounded-lg border border-spark-bone/15 bg-spark-bone/[0.03] px-3 py-2 text-xs text-spark-bone/80">
              {ruleChecks.map((r) => (
                <li
                  key={r.id}
                  className={
                    r.satisfied ? "text-emerald-600/90" : "text-spark-bone/65"
                  }
                >
                  {r.satisfied ? "✓ " : "○ "}
                  {r.label}
                </li>
              ))}
            </ul>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-spark-bone/90">
                Confirm password
              </span>
              <input
                type="password"
                autoComplete="new-password"
                value={signupPassword2}
                onChange={(e) => setSignupPassword2(e.target.value)}
                className="w-full rounded-lg border border-spark-bone/20 bg-spark-bone/5 px-3 py-2 text-spark-bone placeholder:text-spark-bone/40 focus:border-spark-bone/40 focus:outline-none focus:ring-1 focus:ring-spark-bone/30"
                placeholder="Repeat password"
              />
            </label>
            {signupClientError ? (
              <p className="text-sm text-red-300" role="alert">
                {signupClientError}
              </p>
            ) : null}
            <button
              type="submit"
              className="rounded-lg border border-spark-bone/25 bg-transparent px-4 py-2.5 text-sm font-medium text-spark-bone transition hover:bg-spark-bone/10"
            >
              Join the waitlist
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-16 text-spark-bone/70">Loading…</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
