import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "B-59 Studio LLC privacy policy. How we collect, use, and protect your information when you visit our website or contact us. We do not sell personal information.",
  alternates: { canonical: "/about/privacy" },
  openGraph: {
    title: "Privacy Policy | B-59",
    description:
      "How B-59 collects, uses, and protects your information. We respect your privacy and do not sell personal data.",
    url: "/about/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="heading-xl mb-12 text-center">
        Privacy Policy
      </h1>

      <div className="space-y-10">
        <p className="body-md text-secondary">
          Last updated: January 25, 2026
        </p>

        <p className="body-lg">
          B<span className="text-b59-blue">-</span>59 Studio LLC ("B<span className="text-b59-blue">-</span>59," "we," "us," or "our") respects your privacy. This Privacy Policy explains how we collect, use, and protect information when you visit our website.
        </p>

        <section className="space-y-4">
          <h2 className="heading-lg">
            Information We Collect
          </h2>
          <p className="body-md">
            We may collect limited personal information that you voluntarily provide, such as your name, email address, or organization when you contact us.
          </p>
          <p className="body-md">
            We may also collect non-personal information automatically, including browser type, device information, and usage data, to help us understand how the site is used.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="heading-lg">
            How We Use Information
          </h2>
          <p className="body-md">We use information to:</p>
          <ul className="list-disc pl-6 space-y-2 body-md">
            <li>Respond to inquiries</li>
            <li>Improve our website and services</li>
            <li>Maintain the security and integrity of our systems</li>
          </ul>
          <p className="body-md heading-sm">
            We do not sell personal information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="heading-lg">
            Cookies and Analytics
          </h2>
          <p className="body-md">
            We may use cookies or similar technologies to understand site usage and improve performance. You can control cookies through your browser settings.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="heading-lg">
            Data Sharing
          </h2>
          <p className="body-md">
            We do not share personal information with third parties except as required by law or to operate the website (for example, hosting or analytics providers).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="heading-lg">
            Data Security
          </h2>
          <p className="body-md">
            We take reasonable measures to protect information from unauthorized access, disclosure, or misuse.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="heading-lg">
            Your Choices
          </h2>
          <p className="body-md">
            You may contact us to request access to, correction of, or deletion of your personal information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="heading-lg">
            Changes to this Policy
          </h2>
          <p className="body-md">
            We may update this policy from time to time. Updates will be posted on this page.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="heading-lg">
            Contact
          </h2>
          <p className="body-md mb-8">
            Questions about this policy can be directed to: <a href="mailto:contact@b-59.com" className="text-link">contact@b-59.com</a>
          </p>
        </section>

        <div className="flex gap-4 justify-center flex-wrap pt-8">
          <a href="/contact" className="btn-secondary">
            Talk to Us
          </a>
          <a href="/about" className="btn-primary">
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}