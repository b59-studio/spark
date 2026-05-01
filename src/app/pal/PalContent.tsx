"use client";

import { useEffect } from "react";

export default function PalContent() {
  useEffect(() => {
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
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
    <>
      <section className="pal-hero mb-10">
        <p className="pal-kicker">People&apos;s Advocacy Lobby</p>
        <h1 className="heading-xl pal-hero-title">
          Texas Legislature Online is hard to navigate.
          <span className="pal-hero-highlight">PAL makes it clear.</span>
        </h1>
        <p className="body-lg pal-hero-subtitle">
          We turn complicated bill activity into plain-language tracking for
          organizers, advocates, and communities taking action.
        </p>
      </section>

      <section className="scroll-reveal" data-reveal>
        <h2 className="heading-lg mb-4">What is the People&apos;s Advocacy Lobby?</h2>
        <p className="body-md mb-4">
          Our PAL Bill Tracker provides simplified bill summaries, real-time
          status tracking, and filtering tools focused on legislation of concern
          to progressive advocates.
        </p>
        <p className="body-md mb-8">
          Due to the success of this project, we are planning an expansion for
          the upcoming 2027 Legislative Session.
        </p>
      </section>

      <section className="scroll-reveal" data-reveal>
        <h2 className="heading-lg mb-4">How does it work?</h2>
        <div className="mb-8 rounded-lg border border-spark-dark/15 spark-glass p-5">
          <ul className="body-md list-disc space-y-3 pl-6">
            <li>
              <strong>Daily data pulls:</strong> Our automated system pulls fresh
              bill data from Texas Legislature Online (TLO).
            </li>
            <li>
              <strong>Human analysis:</strong> We review, label, and analyze bills
              to identify legislation that is dangerous, misleading, or poorly
              constructed.
            </li>
            <li>
              <strong>Clear public summaries:</strong> We compile everything into
              easy-to-scan breakdowns so you can quickly understand bill content,
              status, and likely social and economic impact.
            </li>
          </ul>
        </div>
      </section>

      <section className="scroll-reveal" data-reveal>
        <h2 className="heading-lg mb-4">How far does this tracker go back?</h2>
        <p className="body-md mb-8">
          Our PAL Bill Tracker was launched in August 2025 as a way of helping
          people stay informed about the Bills that were passing during the
          Special Session. It is an open-source legislative tracking tool for the
          Texas Legislature designed to empower everyday citizens to be informed
          and organize against harmful legislation.
        </p>
      </section>

      <div className="scroll-reveal text-center" data-reveal>
        <a
          href="https://docs.google.com/spreadsheets/d/1PNDImDDrnODRe87DVWCigsDuso01KszCNWKyWKAl5-M/edit?gid=1925380918#gid=1925380918"
          className="btn-primary"
          target="_blank"
          rel="noreferrer"
        >
          2025 Special Session Tracker
        </a>
      </div>
    </>
  );
}
