// /events/:slug — one published event.
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaRegClock } from "react-icons/fa";
import PageSEO from "../../components/PageSEO";
import NotFound from "../../components/NotFound";
import ContentHeader from "../../components/content/ContentHeader";
import RichBody from "../../cms/RichBody";
import { fetchContent, formatEventWhen } from "../../cms/content";

const SITE_URL = "https://pcrginitiative.com";

export default function EventDetail() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: "loading", event: null });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", event: null });
    fetchContent(`/events/${encodeURIComponent(slug)}`).then(({ status, data }) => {
      if (!cancelled) setState({ status, event: data });
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.status === "loading") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }
  if (state.status === "notfound") return <NotFound />;
  if (state.status === "error") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-gray-700 text-lg">We couldn't load this event right now. Please try again shortly.</p>
        <Link to="/events" className="text-primary-500 underline">
          Back to events
        </Link>
      </div>
    );
  }

  const event = state.event;
  const url = `${SITE_URL}/events/${event.slug}`;
  const description = event.seo?.description || event.description || event.title;
  const image = event.seo?.ogImage || event.coverImage?.url;
  const isPast = new Date(event.endAt || event.startAt || 0).getTime() < Date.now();

  return (
    <>
      <PageSEO
        title={event.seo?.title || event.title}
        description={description}
        canonical={event.seo?.canonical || url}
        ogImage={image || undefined}
        schema={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.title,
          description,
          image: image || undefined,
          startDate: event.startAt || undefined,
          endDate: event.endAt || undefined,
          eventStatus: "https://schema.org/EventScheduled",
          location: event.venue
            ? { "@type": "Place", name: event.venue, address: event.venue }
            : undefined,
          organizer: { "@type": "Organization", name: "Platinum Cape Realtors Group", url: SITE_URL },
          url,
        }}
      />
      <ContentHeader eyebrow={isPast ? "Past event" : "Upcoming event"} title={event.title} subtitle={event.description}>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-8 text-gray-200">
          {event.startAt && (
            <span className="flex items-center gap-2">
              <FaRegClock className="text-primary-500" /> {formatEventWhen(event.startAt, event.endAt)}
            </span>
          )}
          {event.venue && (
            <span className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary-500" /> {event.venue}
            </span>
          )}
        </div>
        {!isPast && event.registrationLink && (
          <a
            href={event.registrationLink}
            target={/^https?:/i.test(event.registrationLink) ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="inline-block mt-8 px-8 py-3 rounded-md bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
          >
            Register now
          </a>
        )}
      </ContentHeader>

      <article className="bg-white py-12 md:py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          {event.coverImage?.url && (
            <img
              src={event.coverImage.url}
              alt={event.coverImage.alt || event.title}
              className="w-full rounded-2xl shadow-lg mb-10"
            />
          )}
          {event.body && <RichBody text={event.body} />}
          <div className="mt-14 pt-8 border-t border-gray-200">
            <Link to="/events" className="inline-flex items-center gap-2 font-semibold text-primary-500 hover:text-primary-700">
              <FaArrowLeft /> All events
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
