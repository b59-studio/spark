import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "TX*Spark website terms of use. Use of the site, intellectual property, limitations of liability, and governing law. By using this site you agree to these terms.",
  alternates: { canonical: "/about/terms" },
  openGraph: {
    title: "Terms of Use | TX*Spark",
    description:
      "Terms of use for the TX*Spark website. Informational use, intellectual property, and contact information.",
    url: "/about/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Terms() {
  return (
    <div className="spark-page-narrow">
      <h1 className="heading-xl mb-6 text-center">
        Terms of Use
      </h1>

      <div className="space-y-10">
        <p className="body-md text-secondary">
          Last updated: April 23, 2026
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
            All content on this site, including text, graphics, logos, and software, is the property of TX*Spark PAC or its licensors and is protected by applicable laws. You may not reproduce or distribute content without permission.
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
            TX*Spark is not liable for any damages arising from use of or inability to use this website.
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
          <p className="body-md">
            Questions about this policy can be directed to: <a href="mailto:info@txspark.com" className="text-link">info@txspark.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}