import type { Metadata } from "next";

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="heading-xl mb-6">Events</h1>
      <p className="body-md mb-10">
        TX*SPARK events bring neighbors together for practical, year-round civic
        action aligned with electoral and legislative calendars. From skill
        sharing to direct outreach, each event is designed to help local teams
        organize with confidence and care.
      </p>

      <section className="rounded-2xl border border-spark-dark/15 spark-glass shadow-sm p-6 sm:p-7 mb-8">
        <h2 className="heading-md mb-4">What to expect</h2>
        <ul className="space-y-3 body-md list-disc pl-5">
          <li>
            <strong>Community meet-ups:</strong> connect with organizers,
            partners, and neighbors building local momentum.
          </li>
          <li>
            <strong>Canvasses and outreach:</strong> support direct voter and
            community engagement efforts.
          </li>
          <li>
            <strong>Workshops:</strong> hands-on trainings and practical tools
            for teams doing grassroots work.
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border border-spark-dark/15 spark-glass shadow-sm p-6 sm:p-7">
        <h2 className="heading-md mb-3">Organization Calendar</h2>
        {isCalendarReady ? (
          <>
            <p className="body-md mb-5">
              Stay up to date with upcoming TX*SPARK meet-ups, canvasses, and
              workshops. You can view events here and add them to your personal
              calendar.
            </p>
            {hasEmbedCalendar ? (
              <div className="overflow-hidden rounded-xl border border-spark-dark/15 spark-glass mb-5">
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
          <div className="rounded-xl border border-dashed border-spark-dark/25 spark-glass px-4 py-5">
            <p className="body-md text-secondary">
              Calendar coming soon. We are working on publishing our
              organization event calendar so you can subscribe and stay updated.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
