import type { Metadata } from "next";
import ContactForm from "@/app/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Grassroots Tech for Texans. Contact TX*Spark to share ideas, request resources, or connect around organizing tools and community-rooted civic action.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | TX*Spark",
    description:
      "Reach TX*Spark about tools, resources, events, and organizing support designed to help Texans take meaningful action year-round.",
    url: "/contact",
  },
};

export default function Contact() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <h1 className="heading-xl mb-6 text-center">
        Connect with TX*Spark.
      </h1>
      <p className="body-lg text-center mb-4 max-w-2xl">
        We are a community-rooted, pro-democracy organizer collective building practical tools and trusted support systems for Texans.
      </p>
      <p className="body-lg text-center mb-8 max-w-2xl">
        If you want to collaborate, request support, or share a civic organizing need, reach out<span className="text-spark-sage">—</span>we are here to help turn local energy into year-round action.
      </p>
      
      <ContactForm />
    </main>
  );
}