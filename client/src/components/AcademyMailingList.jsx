import React, { useState } from "react";
import { motion } from "framer-motion";

export default function AcademyMailingList() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | duplicate | error
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");

    try {
      const res = await fetch(`${API_URL}/api/mailing-list/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

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
    idle: "Join our mailing list",
    loading: "Subscribing...",
    success: "Subscribed! 🎉",
    duplicate: "Already subscribed",
    error: "Try again",
  }[status];

  const buttonColor = {
    idle: "bg-[var(--color-primary-500)] hover:bg-gray-900",
    loading: "bg-gray-500 cursor-not-allowed",
    success: "bg-green-600 cursor-default",
    duplicate: "bg-yellow-600 cursor-default",
    error: "bg-red-700 hover:bg-red-800",
  }[status];

  return (
    <section className="bg-black py-16 px-4 text-white text-center">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-5 sm:gap-8">
        {/* Heading */}
        <motion.h2
          className="text-lg sm:text-xl md:text-2xl font-semibold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Get notified of upcoming trainings
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
            disabled={status === "loading" || status === "success"}
            className="flex-grow px-4 py-3 text-gray-800 placeholder-gray-500 outline-none bg-gray-200 sm:min-w-[250px] disabled:opacity-60"
            required
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className={`${buttonColor} text-white px-6 py-3 font-semibold transition duration-300 whitespace-nowrap`}
          >
            {buttonLabel}
          </button>
        </motion.form>
      </div>

      {/* Status message below form */}
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-sm"
      >
        {status === "success" && (
          <p className="text-green-400">
            You're on the list! We'll notify you of upcoming trainings.
          </p>
        )}
        {status === "duplicate" && (
          <p className="text-yellow-400">This email is already subscribed.</p>
        )}
        {status === "error" && (
          <p className="text-red-400">
            Something went wrong. Please try again.
          </p>
        )}
      </motion.div>
    </section>
  );
}
