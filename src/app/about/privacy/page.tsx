export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center">
        Privacy Policy
      </h1>

      <div className="space-y-8 text-lg">
        <p className="font-semibold">
          Last updated: January 25, 2026
        </p>

        <p>
          B<span className="text-b59-blue">-</span>59 Studio LLC ("B<span className="text-b59-blue">-</span>59," "we," "us," or "our") respects your privacy. This Privacy Policy explains how we collect, use, and protect information when you visit our website.
        </p>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            Information We Collect
          </h2>
          <p className="mb-4">
            We may collect limited personal information that you voluntarily provide, such as your name, email address, or organization when you contact us.
          </p>
          <p>
            We may also collect non-personal information automatically, including browser type, device information, and usage data, to help us understand how the site is used.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            How We Use Information
          </h2>
          <p className="mb-4">We use information to:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Respond to inquiries</li>
            <li>Improve our website and services</li>
            <li>Maintain the security and integrity of our systems</li>
          </ul>
          <p className="font-bold">
            We do not sell personal information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            Cookies and Analytics
          </h2>
          <p>
            We may use cookies or similar technologies to understand site usage and improve performance. You can control cookies through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            Data Sharing
          </h2>
          <p>
            We do not share personal information with third parties except as required by law or to operate the website (for example, hosting or analytics providers).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            Data Security
          </h2>
          <p>
            We take reasonable measures to protect information from unauthorized access, disclosure, or misuse.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            Your Choices
          </h2>
          <p>
            You may contact us to request access to, correction of, or deletion of your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            Changes to this Policy
          </h2>
          <p>
            We may update this policy from time to time. Updates will be posted on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            Contact
          </h2>
          <p className="mb-8">
            Questions about this policy can be directed to: <a href="mailto:contact@b-59.com" className="text-b59-blue hover:underline">contact@b-59.com</a>
          </p>
        </section>

        <div className="flex gap-4 justify-center flex-wrap pt-8">
          <a href="/contact" className="btn-primary">
            Talk to Us
          </a>
          <a href="/about" className="btn-secondary">
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}