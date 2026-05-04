"use client";

type NewsletterSignupProps = {
  variant?: "panel" | "compact";
  className?: string;
  /** Shown above the email field */
  description?: string;
  /** Submit button label */
  submitLabel?: string;
};

const TX_SPARK_MAILING_LIST_FORM_URL =
  "https://docs.google.com/forms/d/1Z1pjQqqeyiMqvkOwZFsMHucvGAbInkmq5uziDbj-gTo/viewform";

export default function NewsletterSignup({
  variant = "panel",
  className = "",
  description,
  submitLabel = "Join mailing list",
}: NewsletterSignupProps) {
  const isCompact = variant === "compact";
  const desc =
    description ??
    (isCompact
      ? "Sign up on our Google Form for occasional updates from TX*Spark."
      : "Get toolkit drops, PAL tracker updates, and event announcements.");

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
        <a
          href={TX_SPARK_MAILING_LIST_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex w-full max-w-md items-center justify-center"
        >
          {submitLabel}
        </a>
      </div>
    </div>
  );
}
