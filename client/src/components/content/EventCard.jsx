// Card for one event (used on /events and the "Upcoming events" section).
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaRegClock } from "react-icons/fa";
import { dateBadge, formatEventWhen } from "../../cms/content";

const MotionArticle = motion.article;

export default function EventCard({ event, index = 0, past = false }) {
  const badge = dateBadge(event.startAt);
  return (
    <MotionArticle
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col ${
        past ? "opacity-80" : ""
      }`}
    >
      <Link to={`/events/${event.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-gray-100">
        {event.coverImage?.url ? (
          <img
            src={event.coverImage.url}
            alt={event.coverImage.alt || event.title}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
              past ? "grayscale" : ""
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-900 to-black" />
        )}
        {event.startAt && (
          <span className="absolute top-4 left-4 bg-primary-500 text-white rounded-lg px-3 py-2 text-center shadow-lg leading-none">
            <span className="block text-2xl font-extrabold">{badge.day}</span>
            <span className="block text-xs font-semibold tracking-wider mt-1">{badge.month}</span>
          </span>
        )}
      </Link>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <h3 className="text-xl font-bold text-gray-900 leading-snug">
          <Link to={`/events/${event.slug}`} className="hover:text-primary-500 transition-colors">
            {event.title}
          </Link>
        </h3>
        {event.startAt && (
          <p className="flex items-start gap-2 text-sm text-gray-600">
            <FaRegClock className="mt-0.5 shrink-0 text-primary-500" />
            {formatEventWhen(event.startAt, event.endAt)}
          </p>
        )}
        {event.venue && (
          <p className="flex items-start gap-2 text-sm text-gray-600">
            <FaMapMarkerAlt className="mt-0.5 shrink-0 text-primary-500" />
            {event.venue}
          </p>
        )}
        {event.description && <p className="text-gray-600 leading-relaxed line-clamp-3">{event.description}</p>}
        <div className="mt-auto pt-2 flex flex-wrap gap-3">
          {!past && event.registrationLink && (
            <a
              href={event.registrationLink}
              target={/^https?:/i.test(event.registrationLink) ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-md bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
            >
              Register
            </a>
          )}
          <Link
            to={`/events/${event.slug}`}
            className="px-5 py-2 rounded-md border border-primary-500 text-primary-500 font-semibold hover:bg-primary-500 hover:text-white transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </MotionArticle>
  );
}
