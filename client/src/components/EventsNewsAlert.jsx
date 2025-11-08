import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * SubscribeSection - responsive email subscription banner
 * Matches brand red theme and modern layout from screenshot.
 * Includes subtle animations and validation handling.
 */
export default function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    // TODO: integrate actual subscription logic (API call)
    setTimeout(() => setSubmitted(false), 3000);
  };

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
          Subscribe to the PCRG Event Alerts
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
            className="bg-black text-white px-6 py-3 font-semibold hover:bg-gray-900 transition duration-300"
          >
            {submitted ? "Subscribed!" : "Join our mailing list"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
