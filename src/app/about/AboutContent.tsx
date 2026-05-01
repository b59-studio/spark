"use client";

import Image from "next/image";
import { useEffect } from "react";

const revealSelector = "[data-reveal]";

export default function AboutContent() {
  useEffect(() => {
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>(revealSelector)
    );

    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      }
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="space-y-14 sm:space-y-16 lg:space-y-20">
        <section
          className="rounded-3xl border border-spark-dark/15 spark-glass p-8 sm:p-12 shadow-sm scroll-reveal"
          data-reveal
        >
          <p className="inline-flex rounded-full border border-spark-dark/15 spark-glass px-4 py-1 text-xs tracking-[0.12em] text-spark-sage uppercase">
            Grassroots Tech for Texans
          </p>
          <h1 className="heading-xl mt-5 text-balance">About TX*Spark</h1>
          <p className="body-lg mt-5 max-w-3xl">
            We are a pro-democracy political action committee and organizer
            collective rooted in Austin, building practical tools and trusted
            support systems so local leaders can turn civic energy into
            year-round impact.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-spark-dark/12 spark-glass p-4">
              <p className="text-3xl font-bold text-spark-dark">Year-round</p>
              <p className="body-sm mt-1">Organizing support beyond elections.</p>
            </div>
            <div className="rounded-xl border border-spark-dark/12 spark-glass p-4">
              <p className="text-3xl font-bold text-spark-dark">Community-led</p>
              <p className="body-sm mt-1">Built with partners, never for them.</p>
            </div>
            <div className="rounded-xl border border-spark-dark/12 spark-glass p-4">
              <p className="text-3xl font-bold text-spark-dark">Action-ready</p>
              <p className="body-sm mt-1">Tools people can use immediately.</p>
            </div>
          </div>
        </section>

        <section className="scroll-reveal" data-reveal>
          <div className="rounded-2xl border border-spark-dark/15 spark-glass p-6 sm:p-8">
            <h2 className="heading-lg mb-5">Our mission</h2>
            <p className="body-lg mb-5">
              We offer free, people-centered, community-rooted resources that
              help neighbors learn, practice, and lead democratic engagement in
              ways that fit their realities.
            </p>
            <p className="body-md text-secondary">
              We exist to grow, strengthen, and supplement local coalition
              partners and campaigns, not supplant them.
            </p>
            <blockquote className="quote mt-7">
              Lasting civic power is built when local communities have the tools
              and confidence to organize on their own terms.
            </blockquote>
          </div>
        </section>

        <section className="scroll-reveal" data-reveal>
          <div className="rounded-2xl border border-spark-dark/15 spark-glass p-6 sm:p-8">
            <h2 className="heading-lg mb-6">How we work</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-xl border border-spark-dark/12 spark-glass p-5">
                <p className="heading-sm mb-2">1. Listen first</p>
                <p className="body-md">
                  We map local priorities, barriers, and capacity with coalition
                  partners before recommending any strategy.
                </p>
              </article>
              <article className="rounded-xl border border-spark-dark/12 spark-glass p-5">
                <p className="heading-sm mb-2">2. Co-design tools</p>
                <p className="body-md">
                  We build customizable resources for different experience levels,
                  political contexts, and community identities.
                </p>
              </article>
              <article className="rounded-xl border border-spark-dark/12 spark-glass p-5">
                <p className="heading-sm mb-2">3. Activate year-round</p>
                <p className="body-md">
                  We align campaigns with electoral and legislative calendars so
                  people can take meaningful action all year, not only in peak
                  election moments.
                </p>
              </article>
              <article className="rounded-xl border border-spark-dark/12 spark-glass p-5">
                <p className="heading-sm mb-2">4. Share ownership</p>
                <p className="body-md">
                  Our goal is durable local leadership and sustainable organizing
                  systems communities can continue running independently.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-spark-dark/15 spark-glass p-6 sm:p-8 scroll-reveal" data-reveal>
          <h2 className="heading-lg mb-4">Community story gallery</h2>
          <p className="body-md mb-6">
            This section is designed for visuals that show your impact in action.
            Recommended images are outlined below and can be replaced as photos
            become available.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <figure className="rounded-xl border border-dashed border-spark-dark/25 spark-glass p-4">
              <div className="relative h-40 rounded-lg spark-glass border border-spark-dark/10">
                <Image
                  src="/sparkv1.png"
                  alt="Illustrative TX*Spark spark icon"
                  fill
                  className="object-contain p-8 opacity-80"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
              <figcaption className="body-sm mt-3">
                Add photo: canvass launch or neighborhood walk.
              </figcaption>
            </figure>
            <figure className="rounded-xl border border-dashed border-spark-dark/25 spark-glass p-4">
              <div className="h-40 rounded-lg spark-glass border border-spark-dark/10" />
              <figcaption className="body-sm mt-3">
                Add photo: workshop facilitation or skill-building circle.
              </figcaption>
            </figure>
            <figure className="rounded-xl border border-dashed border-spark-dark/25 spark-glass p-4">
              <div className="h-40 rounded-lg spark-glass border border-spark-dark/10" />
              <figcaption className="body-sm mt-3">
                Add photo: community meetup, partner coalition, or celebration.
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="scroll-reveal" data-reveal>
          <div className="rounded-2xl border border-spark-dark/15 spark-glass p-6 sm:p-8">
            <h2 className="heading-lg mb-6">Get connected</h2>
            <p className="body-lg mb-6 text-center">
              Got a spark of inspiration? We have a place for it.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <a href="/resources" className="rounded-xl border border-spark-dark/12 spark-glass p-5 text-center transition hover:-translate-y-0.5 hover:border-spark-blue/40">
                <p className="heading-sm">Resources</p>
                <p className="body-sm mt-2">Toolkits, guides, and print-ready materials.</p>
              </a>
              <a href="/events" className="rounded-xl border border-spark-dark/12 spark-glass p-5 text-center transition hover:-translate-y-0.5 hover:border-spark-blue/40">
                <p className="heading-sm">Events</p>
                <p className="body-sm mt-2">Meet-ups, canvasses, and learning spaces.</p>
              </a>
              <a href="/contact" className="rounded-xl border border-spark-dark/12 spark-glass p-5 text-center transition hover:-translate-y-0.5 hover:border-spark-blue/40">
                <p className="heading-sm">Partner with us</p>
                <p className="body-sm mt-2">Let us build alongside your community goals.</p>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
