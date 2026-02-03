export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="heading-xl mb-12 text-center">
        Terms of Use
      </h1>

      <div className="space-y-10">
        <p className="body-md text-secondary">
          Last updated: January 25, 2026
        </p>

        <p className="body-lg">
          By accessing or using this website, you agree to these Terms of Use.
        </p>

        <section className="space-y-4">
          <h2 className="heading-lg">
            Use of the Site
          </h2>
          <p className="body-md">
            This website is provided for informational purposes only. You may use it for lawful purposes and in accordance with these terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="heading-lg">
            Intellectual Property
          </h2>
          <p className="body-md">
            All content on this site, including text, graphics, logos, and software, is the property of B<span className="text-b59-blue">-</span>59 Studio LLC or its licensors and is protected by applicable laws. You may not reproduce or distribute content without permission.
            </p>
        </section>

        <section className="space-y-4">
          <h2 className="heading-lg">
            No Warranties
          </h2>
          <p className="body-md">
            This site is provided “as is.” We make no warranties regarding accuracy, completeness, or availability.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="heading-lg">
            Limitation of Liability
          </h2>
          <p className="body-md">
            B<span className="text-b59-blue">-</span>59 Studio is not liable for any damages arising from use of or inability to use this website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="heading-lg">
            External Links
          </h2>
          <p className="body-md">
            This site may contain links to third-party websites. We are not responsible for their content or practices.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="heading-lg">
            Changes
          </h2>
          <p className="body-md">
            We may update these Terms of Use at any time. Continued use of the site constitutes acceptance of the updated terms.          </p>
        </section>

        <section className="space-y-4">
          <h2 className="heading-lg">
            Governing Law
          </h2>
          <p className="body-md">
            These terms are governed by the laws of the United States and the State of Texas, without regard to conflict of law principles.
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