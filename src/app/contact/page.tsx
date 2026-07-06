/* Contact page temporarily disabled — restore below.

import type { Metadata } from "next";
import ContactForm from "@/app/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Grassroots Tech for Texans. Contact TX*SPARK to share ideas, request resources, or connect around organizing tools and community-rooted civic action.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | TX*SPARK",
    description:
      "Reach TX*SPARK about tools, resources, events, and organizing support designed to help Texans take meaningful action year-round.",
    url: "/contact",
  },
};

export default function Contact() {
  return (
    <main className="spark-page-narrow min-h-screen flex flex-col items-center justify-center">
      <h1 className="heading-xl mb-6 text-center">
        Connect with TX*SPARK.
      </h1>
      <p className="body-lg text-center mb-4 max-w-2xl">
        We are a community-rooted, pro-democracy organizer collective building practical tools and trusted support systems for Texans.
      </p>
      <p className="body-lg text-center mb-8 max-w-2xl">
        If you want to collaborate, request support, or share a civic organizing need, reach out<span className="text-spark-paint">—</span>we are here to help turn local energy into year-round action.
      </p>

      <ContactForm />
    </main>
  );
}

*/

export default function Contact() {
  return null;
}
