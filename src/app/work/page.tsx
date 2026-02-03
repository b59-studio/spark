import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "B-59's work in civic technology—voting registration platforms, strategic design, and products that serve the public. See what we build and how to work with us.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work | B-59",
    description:
      "We've built voting registration platforms and designed for complex systems. Explore our work in civic technology and learn how to work with us.",
    url: "/work",
  },
};

export default function Work() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="heading-xl mb-6">Work</h1>
      <p className="body-lg max-w-2xl mb-6">
        We've built voting registration platforms and designed shoes. We'll tell you more about it here soon.
      </p>
      <a href="/about" className="btn-primary">
            Work with Us
        </a>
    </div>
  );
}