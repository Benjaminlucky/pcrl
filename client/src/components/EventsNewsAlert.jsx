import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSection } from "../cms/hooks";
import { EVENTS_NEWS_ALERT } from "../cms/defaults/events";

/**
 * SubscribeSection - responsive email subscription banner
 * Matches brand red theme and modern layout from screenshot.
 * Includes subtle animations and validation handling.
 */
export default function SubscribeSection() {
  const c = useSection(EVENTS_NEWS_ALERT);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | duplicate | error
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");

    try {
      const res = await fetch(`${API_URL}/api/mailing-list/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.status === 409) {
        setStatus("duplicate");
      } else if (!res.ok) {
        setStatus("error");
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      // Reset back to idle after 4 seconds
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const buttonLabel = {
    idle: c.buttonLabel,
    loading: "Subscribing...",
    success: "Subscribed!",
    duplicate: "Already subscribed",
    error: "Try again",
  }[status];

  return (
    <section className="bg-primary-500 py-16 px-4 text-white text-center">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-5 sm:gap-8">
        {/* Heading */}
        <motion.h2
          className="text-lg sm:text-xl md:text-2xl font-semibold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {c.title}
        </motion.h2>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="flex w-full sm:w-auto max-w-md sm:max-w-xl bg-white rounded-md overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow px-4 py-3 text-gray-800 placeholder-gray-500 outline-none bg-gray-200 sm:min-w-[250px]"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-black text-white px-6 py-3 font-semibold hover:bg-gray-900 transition duration-300 disabled:opacity-70"
          >
            {buttonLabel}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
