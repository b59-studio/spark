"use client";

import Link from "next/link";
import { useEffect } from "react";

const revealSelector = "[data-reveal]";

export default function HomeContent() {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20">
      <section
        className="rounded-3xl border border-spark-dark/15 spark-glass shadow-sm p-8 sm:p-12 scroll-reveal"
        data-reveal
      >
        <div className="max-w-4xl mx-auto text-center lg:text-left">
          <p className="inline-flex rounded-full border border-spark-dark/15 spark-glass px-4 py-1 text-xs tracking-[0.14em] uppercase text-spark-sage">
            Grassroots Tech for Texans
          </p>

          <div className="mt-6 rounded-2xl border border-spark-dark/15 spark-glass p-5 sm:p-6 text-center">
            <p className="body-md max-w-4xl mx-auto">
              People already have the motivation to act. What they need is
              trusted structure. TX*Spark turns civic energy into durable local
              power by giving communities the tools, strategy, and support to
              organize together all year.
            </p>
          </div>

          <p className="body-md max-w-4xl mx-auto mt-6">
            TX*Spark gives organizers, volunteers, and coalition partners free,
            practical tools to move from civic frustration to coordinated
            action. From precinct organizing to bill tracking, we help Texans
            organize with clarity, consistency, and confidence.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3 text-left">
          <article className="rounded-xl border border-spark-dark/12 spark-glass p-4">
            <p className="heading-sm mb-2">Free and practical</p>
            <p className="body-sm">
              Ready-to-use templates, scripts, and field tools for real-world
              organizing conditions.
            </p>
          </article>
          <article className="rounded-xl border border-spark-dark/12 spark-glass p-4">
            <p className="heading-sm mb-2">Built for Texas timing</p>
            <p className="body-sm">
              Aligned to election and legislative calendars so teams can act
              early, not just react late.
            </p>
          </article>
          <article className="rounded-xl border border-spark-dark/12 spark-glass p-4">
            <p className="heading-sm mb-2">Community-rooted approach</p>
            <p className="body-sm">
              Co-designed with local partners to strengthen existing coalitions,
              not replace them.
            </p>
          </article>
        </div>
      </section>

      <section
        className="mt-12 grid gap-6 lg:grid-cols-2 scroll-reveal"
        data-reveal
      >
        <article className="rounded-2xl border border-spark-dark/15 spark-glass p-6 sm:p-7">
          <h2 className="heading-md mb-4">Value for people taking action</h2>
          <ul className="body-md list-disc pl-6 space-y-2">
            <li>Know where to start, even if you are new to organizing.</li>
            <li>
              Use guided toolkits to build relationships, recruit volunteers,
              and move neighbors to action.
            </li>
            <li>
              Access plain-language civic resources that reduce overwhelm and
              speed up impact.
            </li>
          </ul>
          <div className="mt-6">
            <Link href="/resources" className="btn-secondary">
              Explore Free Tools
            </Link>
          </div>
        </article>

        <article className="rounded-2xl border border-spark-dark/15 spark-glass p-6 sm:p-7">
          <h2 className="heading-md mb-4">
            Building coalition through partnerships
          </h2>
          <ul className="body-md list-disc pl-6 space-y-2">
            <li>
              Expand organizing capacity with shared infrastructure and
              customizable tools.
            </li>
            <li>
              Coordinate faster with resources built around campaign and
              legislative rhythms.
            </li>
            <li>
              Strengthen long-term local leadership through a community-led,
              support-first model.
            </li>
          </ul>
          <div className="mt-6">
            <Link href="/contact" className="btn-primary">
              Partner with TX*Spark
            </Link>
          </div>
        </article>
      </section>

      <section
        className="mt-8 rounded-2xl border border-dashed border-spark-dark/20 spark-glass p-5 sm:p-6 scroll-reveal"
        data-reveal
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="aspect-[5/4] rounded-xl border border-spark-dark/12 spark-glass p-3 flex items-center justify-center text-center">
            <p className="body-sm">Image idea: neighborhood canvass team photo.</p>
          </div>
          <div className="aspect-[5/4] rounded-xl border border-spark-dark/12 spark-glass p-3 flex items-center justify-center text-center">
            <p className="body-sm">Image idea: workshop/training in progress.</p>
          </div>
          <div className="aspect-[5/4] rounded-xl border border-spark-dark/12 spark-glass p-3 flex items-center justify-center text-center">
            <p className="body-sm">Image idea: coalition partner gathering.</p>
          </div>
        </div>
        <p className="body-sm mt-3 text-center text-secondary">
          Story strip placeholder: swap these with real photos to show people,
          process, and partnership.
        </p>
      </section>

      <section
        className="mt-10 rounded-2xl border border-spark-dark/15 spark-glass p-7 sm:p-8 text-center scroll-reveal"
        data-reveal
      >
        <h2 className="heading-lg mb-3">See us in action</h2>
        <p className="body-md max-w-4xl mx-auto">
          Meet-ups, canvasses, and hands-on trainings are where strategy turns
          into momentum. Join TX*Spark events to build skills, connect with
          neighbors, and put organizing plans into motion.
        </p>
        <div className="mt-6 mx-auto max-w-4xl rounded-2xl border border-dashed border-spark-dark/20 spark-glass p-4">
          <div className="aspect-[16/7] rounded-xl spark-glass flex items-center justify-center px-4 border border-spark-dark/10">
            <p className="body-sm">
              Closing image placeholder: event photo with movement and energy
              (group huddle, door knock launch, or training circle).
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/events" className="btn-secondary">
            Join an Event
          </Link>
        </div>
      </section>
    </div>
  );
}
