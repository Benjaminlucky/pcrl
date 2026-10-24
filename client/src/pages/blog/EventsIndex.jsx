// /events — upcoming events, then past events.
import React from "react";
import PageSEO from "../../components/PageSEO";
import ContentHeader from "../../components/content/ContentHeader";
import EventCard from "../../components/content/EventCard";
import { useContentList } from "../../cms/content";

export default function EventsIndex() {
  const upcoming = useContentList("events", { when: "upcoming", limit: 24 });
  const past = useContentList("events", { when: "past", limit: 12 });
  const loading = upcoming.status === "loading" || past.status === "loading";
  const failed = upcoming.status === "error" && past.status === "error";

  return (
    <>
      <PageSEO
        title="Events"
        description="Masterclasses, realtor hangouts, investment summits and award nights from Platinum Cape Realtors Group."
        canonical="https://pcrginitiative.com/events"
      />
      <ContentHeader
        eyebrow="PCRG Events"
        title="Learn. Connect. Grow."
        subtitle="Masterclasses, hangouts, summits and celebrations across the PCRG network."
      />

      <section className="bg-gray-50 py-16 md:py-24 px-6 min-h-[40vh]">
        <div className="container mx-auto space-y-20">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
            </div>
          )}
          {!loading && failed && (
            <p className="text-center text-gray-600">We couldn't load events right now. Please try again shortly.</p>
          )}

          {!loading && !failed && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Upcoming events</h2>
              {upcoming.items.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {upcoming.items.map((e, i) => (
                    <EventCard key={e._id} event={e} index={i} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No upcoming events right now — check back soon.</p>
              )}
            </div>
          )}

          {!loading && past.items.length > 0 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Past events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {past.items.map((e, i) => (
                  <EventCard key={e._id} event={e} index={i} past />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
