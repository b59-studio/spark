"use client";

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
  function handleResourceActivate(link: OutboundLinkSpec) {
    if (readyHref(link.href)) {
      window.open(link.href.trim(), "_blank", "noopener,noreferrer");
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

        <div
          className={["flex flex-wrap gap-3", linksClassName]
            .filter(Boolean)
            .join(" ")}
        >
          {links.map((link) => {
            const hasUrl = readyHref(link.href);
            if (!hasUrl) {
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
                className="btn-primary"
                onClick={() => handleResourceActivate(link)}
              >
                {link.label}
              </button>
            );
          })}
        </div>
        {!links.some((link) => readyHref(link.href)) ? (
          <p className={loadingClassName}>Resources are coming soon.</p>
        ) : null}
      </section>

      {/* Email gate is temporarily disabled for launch.
      <dialog
        ref={dialogRef}
        className="resource-gate-dialog w-[min(26rem,calc(100vw-2rem))] text-spark-bone"
        aria-labelledby={titleId}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeModal();
        }}
      >
        <div className="spark-panel rounded-2xl p-6 sm:p-7">
          <h3 id={titleId} className="heading-md mb-2 text-spark-gold">
            You&apos;re almost there!
          </h3>
          <p className="body-md mb-5">
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
                className="rounded-xl border border-spark-gold/35 bg-[color-mix(in_srgb,var(--color-spark-bone)_8%,var(--color-spark-bg))] px-4 py-3 text-spark-bone placeholder:text-secondary focus:border-spark-gold focus:outline-none focus:ring-2 focus:ring-spark-gold/25 invalid:border-spark-red"
              />
            </div>
            {modalError ? (
              <p className="body-sm text-center text-spark-red" role="alert">
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
      */}
    </>
  );
}
