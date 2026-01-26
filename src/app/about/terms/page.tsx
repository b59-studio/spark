export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center">
        Terms of Use
      </h1>

      <div className="space-y-8 text-lg">
        <p className="font-semibold">
          Last updated: January 25, 2026
        </p>

        <p>
          By accessing or using this website, you agree to these Terms of Use.
        </p>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            Use of the Site
          </h2>
          <p className="mb-4">
            This website is provided for informational purposes only. You may use it for lawful purposes and in accordance with these terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            Intellectual Property
          </h2>
            <p className="mb-4">
            All content on this site, including text, graphics, logos, and software, is the property of B<span className="text-b59-blue">-</span>59 Studio LLC or its licensors and is protected by applicable laws. You may not reproduce or distribute content without permission.
            </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            No Warranties
          </h2>
          <p>
            This site is provided “as is.” We make no warranties regarding accuracy, completeness, or availability.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            Limitation of Liability
          </h2>
          <p>
            B<span className="text-b59-blue">-</span>59 Studio is not liable for any damages arising from use of or inability to use this website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            External Links
          </h2>
          <p>
            This site may contain links to third-party websites. We are not responsible for their content or practices.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            Changes
          </h2>
          <p>
            We may update these Terms of Use at any time. Continued use of the site constitutes acceptance of the updated terms.          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            Governing Law
          </h2>
          <p>
            These terms are governed by the laws of the United States and the State of Texas, without regard to conflict of law principles.
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