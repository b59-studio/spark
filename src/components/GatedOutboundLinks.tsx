"use client";

import { useEffect, useId, useRef, useState } from "react";
import { isValidNewsletterEmail } from "@/lib/newsletter-email-validation";

export type OutboundLinkSpec = {
  label: string;
  /** Empty until the live URL exists */
  href: string;
};

type GatedOutboundLinksProps = {
  heading?: string;
  intro?: string;
  links: OutboundLinkSpec[];
  className?: string;
  linksClassName?: string;
  /** Override default heading-sm (e.g. heading-lg for page sections). */
  headingClassName?: string;
  /** Override default body-sm intro styling. */
  introClassName?: string;
  /** Override default body-sm loading line. */
  loadingClassName?: string;
};

function readyHref(href: string) {
  const h = href.trim();
  return Boolean(h) && h !== "#" && /^https?:\/\//i.test(h);
}

export default function GatedOutboundLinks({
  heading = "Solutions",
  intro,
  links,
  className = "",
  linksClassName = "",
  headingClassName = "heading-sm mb-3",
  introClassName = "body-sm text-secondary mb-5 max-w-prose",
  loadingClassName = "body-sm text-secondary",
}: GatedOutboundLinksProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const emailInputId = useId();
  const [subscribed, setSubscribed] = useState<boolean | null>(null);
  const [pending, setPending] = useState<OutboundLinkSpec | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    function onDialogClose() {
      setPending(null);
      setModalError(null);
      setModalLoading(false);
    }
    el.addEventListener("close", onDialogClose);
    return () => el.removeEventListener("close", onDialogClose);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/newsletter/status")
      .then((r) => r.json())
      .then((data: { subscribed?: boolean }) => {
        if (!cancelled) setSubscribed(Boolean(data.subscribed));
      })
      .catch(() => {
        if (!cancelled) setSubscribed(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function closeModal() {
    dialogRef.current?.close();
    setPending(null);
    setModalError(null);
    setModalLoading(false);
  }

  function openGate(link: OutboundLinkSpec) {
    setPending(link);
    setModalError(null);
    setModalLoading(false);
    dialogRef.current?.showModal();
  }

  function handleResourceActivate(link: OutboundLinkSpec) {
    if (subscribed === null) return;
    if (subscribed) {
      if (readyHref(link.href)) {
        window.open(link.href.trim(), "_blank", "noopener,noreferrer");
      }
      return;
    }
    openGate(link);
  }

  async function handleModalSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pending) return;
    const form = e.currentTarget;
    if (!form.reportValidity()) return;

    const raw = (
      form.elements.namedItem("email") as HTMLInputElement | null
    )?.value;
    const email = raw ?? "";
    if (!isValidNewsletterEmail(email)) {
      setModalError("Please enter a valid email address.");
      return;
    }

    const urlAfter = pending.href.trim();
    setModalLoading(true);
    setModalError(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setModalError(data.error ?? "Something went wrong. Try again shortly.");
        setModalLoading(false);
        return;
      }
      setSubscribed(true);
      dialogRef.current?.close();
      setPending(null);
      setModalLoading(false);
      if (readyHref(urlAfter)) {
        window.open(urlAfter, "_blank", "noopener,noreferrer");
      }
    } catch {
      setModalError("Network error. Check your connection and try again.");
      setModalLoading(false);
    }
  }

  return (
    <>
      <section
        className={[
          "rounded-2xl p-6 sm:p-7 mb-10",
          className,
        ].join(" ")}
        aria-label={heading}
      >
        <h2 className={headingClassName}>{heading}</h2>
        {intro ? <p className={introClassName}>{intro}</p> : null}

        {subscribed === null ? (
          <p className={loadingClassName}>Loading…</p>
        ) : (
          <div
            className={["flex flex-wrap gap-3", linksClassName]
              .filter(Boolean)
              .join(" ")}
          >
            {links.map((link) => {
              const hasUrl = readyHref(link.href);
              const waitingForUrl = subscribed === true && !hasUrl;
              const loadingLock = subscribed === null;

              if (waitingForUrl) {
                return (
                  <span
                    key={link.label}
                    className="btn-primary opacity-55 cursor-not-allowed pointer-events-none inline-flex"
                    aria-disabled="true"
                  >
                    {link.label}
                    <span className="sr-only"> (link coming soon)</span>
                  </span>
                );
              }

              return (
                <button
                  key={link.label}
                  type="button"
                  disabled={loadingLock}
                  className="btn-primary disabled:opacity-60"
                  onClick={() => handleResourceActivate(link)}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <dialog
        ref={dialogRef}
        className="resource-gate-dialog w-[min(26rem,calc(100vw-2rem))] text-spark-dark"
        aria-labelledby={titleId}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeModal();
        }}
      >
        <div className="spark-sky-panel rounded-2xl p-6 sm:p-7">
          <h3 id={titleId} className="heading-md mb-2">
            You&apos;re almost there!
          </h3>
          <p className="body-sm text-secondary mb-5">
            Enter your email to receive access to this free resource. We&apos;ll
            add you to our list and send a quick welcome note—you can unsubscribe
            anytime.
          </p>
          <form
            onSubmit={handleModalSubmit}
            className="flex flex-col items-center gap-4"
          >
            <div className="mx-auto flex w-full max-w-sm flex-col gap-1.5">
              <label
                htmlFor={emailInputId}
                className="body-sm font-medium text-center"
              >
                Email
              </label>
              <input
                id={emailInputId}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                placeholder="you@example.com"
                disabled={modalLoading}
                className="rounded-xl border border-spark-blue/35 bg-white px-4 py-3 text-spark-dark placeholder:text-secondary focus:border-spark-blue focus:outline-none focus:ring-2 focus:ring-spark-blue/25 invalid:border-red-300"
              />
            </div>
            {modalError ? (
              <p className="body-sm text-center text-red-800" role="alert">
                {modalError}
              </p>
            ) : null}
            <div className="mx-auto flex w-full max-w-sm flex-wrap justify-center gap-3 pt-1">
              <button
                type="submit"
                disabled={modalLoading}
                className="btn-primary disabled:opacity-60"
              >
                {modalLoading ? "Signing up…" : "Continue"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                disabled={modalLoading}
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
