// Upcoming events from the Events collection. Renders nothing until at least
// one upcoming event is published (so the page is unchanged before that).
import React from "react";
import { Link } from "react-router-dom";
import { useSection } from "../cms/hooks";
import { EVENTS_UPCOMING } from "../cms/defaults/events";
import { useContentList } from "../cms/content";
import InlineText from "../cms/InlineText";
import EventCard from "./content/EventCard";

export default function EventsUpcoming() {
  const c = useSection(EVENTS_UPCOMING);
  const limit = Math.min(Math.max(Number(c.limit) || 3, 1), 12);
  const { items, total } = useContentList("events", { when: "upcoming", limit });

  if (!items.length) return null;

  return (
    <section className="w-full bg-gray-50 py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            <InlineText text={c.title} strongClassName="text-primary-500" />
          </h2>
          {c.intro && <p className="mt-4 text-gray-600 text-lg">{c.intro}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((event, i) => (
            <EventCard key={event._id} event={event} index={i} />
          ))}
        </div>
        {total > items.length && c.viewAllLabel && (
          <div className="text-center mt-12">
            <Link
              to="/events"
              className="inline-block px-8 py-3 rounded-md border-2 border-primary-500 text-primary-500 font-semibold hover:bg-primary-500 hover:text-white transition-colors"
            >
              {c.viewAllLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
