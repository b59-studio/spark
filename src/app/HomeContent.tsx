"use client";

import Link from "next/link";
import { useEffect } from "react";
import NewsletterSignup from "@/components/NewsletterSignup";

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
    <div className="spark-page-home">
      <section
        className="rounded-3xl p-8 sm:p-12 scroll-reveal"
        data-reveal
      >
        <div className="max-w-4xl mx-auto text-center lg:text-left">
          <p className="body-md max-w-4xl mx-auto">
            People already have the motivation to act. What they need is
            trusted structure. TX*Spark turns civic energy into durable local
            power by giving communities the tools, strategy, and support to
            organize together all year.
          </p>

          <p className="body-md max-w-4xl mx-auto mt-6">
            TX*Spark gives organizers, volunteers, and coalition partners free,
            practical tools to move from civic frustration to coordinated
            action. From precinct organizing to bill tracking, we help Texans
            organize with clarity, consistency, and confidence.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6 text-left">
          <article>
            <p className="heading-sm mb-2">Free and practical</p>
            <p className="body-sm">
              Ready-to-use templates, scripts, and field tools for real-world
              organizing conditions.
            </p>
          </article>
          <article>
            <p className="heading-sm mb-2">Built for Texas timing</p>
            <p className="body-sm">
              Aligned to election and legislative calendars so teams can act
              early, not just react late.
            </p>
          </article>
          <article>
            <p className="heading-sm mb-2">Community-rooted approach</p>
            <p className="body-sm">
              Co-designed with local partners to strengthen existing coalitions,
              not replace them.
            </p>
          </article>
        </div>
      </section>

      <section
        className="mt-14 grid gap-6 lg:grid-cols-2 scroll-reveal"
        data-reveal
      >
        <article className="p-6 sm:p-7">
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
            <Link href="/solutions" className="btn-secondary">
              Explore Free Tools
            </Link>
          </div>
        </article>

        <article className="p-6 sm:p-7">
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
            <Link href="/about/partners" className="btn-primary">
              Partner with TX*Spark
            </Link>
          </div>
        </article>
      </section>

      <section className="mt-14 scroll-reveal" data-reveal>
        <h2 className="heading-lg mb-3 text-center">Stay in the loop</h2>
        <p className="body-md mx-auto max-w-4xl text-left">
          Subscribe for occasional emails from TX*Spark—new Grow resources,
          advocacy signals worth watching, and ways to show up locally. No
          clutter; unsubscribe anytime.
        </p>
        <NewsletterSignup
          variant="panel"
          className="mt-6 max-w-4xl"
          description="We’ll send toolkit releases, PAL tracker updates, and event news as they go live."
        />
      </section>
    </div>
  );
}
