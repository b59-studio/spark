import type { Metadata } from "next";
import Image from "next/image";
import NewsletterSignup from "@/components/NewsletterSignup";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Grassroots Tech for Texans. Join TX*Spark meet-ups, canvasses, and workshops that connect Texans to practical organizing support.",
  openGraph: {
    title: "Events | TX*Spark",
    description:
      "Explore TX*Spark events that offer peer support, outreach materials, and hands-on opportunities for community-rooted action.",
    url: "/events",
  },
  alternates: { canonical: "/events" },
};

const ORG_CALENDAR_EMBED_URL = "";
const ORG_CALENDAR_ADD_URL = "";

export default function EventsPage() {
  const hasEmbedCalendar = ORG_CALENDAR_EMBED_URL.trim().length > 0;
  const hasAddCalendarLink = ORG_CALENDAR_ADD_URL.trim().length > 0;
  const isCalendarReady = hasEmbedCalendar || hasAddCalendarLink;

  return (
    <div className="mx-auto max-w-6xl px-3 py-12 sm:px-4 sm:py-16 lg:px-6 lg:py-20">
      <h1 className="heading-xl mb-6">Events</h1>
      <p className="body-md mb-6">
        TX*SPARK events bring neighbors together for practical, year-round civic action aligned with electoral and legislative calendars. From skill sharing to direct outreach, each event is designed to help local teams organize with confidence and care.
      </p>

      <section className="mb-8 grid gap-8 lg:grid-cols-[minmax(0,27rem)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <figure className="min-w-0">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/francescateaching.jpg"
              alt="Founder Francesa Leahy leading a workshop with precinct chairs from Pflugerville."
              width={2048}
              height={1536}
              className="h-auto w-full object-cover"
              sizes="(max-width: 1023px) 100vw, 432px"
              priority
            />
          </div>
          <figcaption className="spark-figure-caption">
            Founder Francesca Leahy working with precinct chairs from Pflugerville.
          </figcaption>
        </figure>

        <div className="min-w-0 spark-panel rounded-2xl p-6 sm:p-8">
          <h2 className="heading-md mb-4">What to expect</h2>
          <ul className="space-y-3 body-md list-disc pl-5">
            <li>
              <strong>Community meet-ups:</strong> connect with organizers, partners, and neighbors building local momentum.
            </li>
            <li>
              <strong>Canvasses and outreach:</strong> support direct voter and community engagement efforts.
            </li>
            <li>
              <strong>Workshops:</strong> hands-on trainings and practical tools for teams doing grassroots work.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-14 spark-panel rounded-2xl p-6 sm:p-8">
        <h2 className="heading-md mb-3">Organization Calendar</h2>
        {isCalendarReady ? (
          <>
            <p className="body-md mb-5">
              Stay up to date with upcoming TX*SPARK meet-ups, canvasses, and workshops. You can view events here and add them to your personal calendar.
            </p>
            {hasEmbedCalendar ? (
              <div className="overflow-hidden rounded-xl border border-spark-gold/30 bg-[color-mix(in_srgb,var(--color-spark-bone)_6%,var(--color-spark-bg))] mb-5">
                <iframe
                  title="TX*SPARK organization calendar"
                  src={ORG_CALENDAR_EMBED_URL}
                  className="w-full min-h-[540px]"
                  loading="lazy"
                />
              </div>
            ) : null}
            {hasAddCalendarLink ? (
              <a
                href={ORG_CALENDAR_ADD_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-primary inline-flex"
              >
                Add this calendar to Google Calendar
              </a>
            ) : null}
          </>
        ) : (
          <p className="body-md text-secondary">
            Calendar coming soon. We are working on publishing our organization event calendar so you can subscribe and stay updated.
          </p>
        )}
      </section>

      <section className="mt-14">
        <h2 className="heading-md mb-3 text-center">Join our mailing list</h2>
        <p className="body-md mb-6">
          Hear about new trainings, toolkit releases, and advocacy updates—no spam, unsubscribe anytime.
        </p>
        <NewsletterSignup variant="panel" />
      </section>
    </div>
  );
}
