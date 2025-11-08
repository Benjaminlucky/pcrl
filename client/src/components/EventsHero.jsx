import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * Hero component with static image + parallax scroll effect
 * Inspired by "Learn. Connect. Grow." layout
 * Clean centered text, ambient glow, and smooth animations.
 */
export default function EventsHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax zoom effect
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={ref}
      className="relative w-full h-[90vh] min-h-[560px] flex items-center justify-center overflow-hidden text-white"
    >
      {/* Parallax Background Image */}
      <motion.img
        src="/images/EventsPosterHero.jpg" // Replace with your actual image path
        alt="Event audience"
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ scale, y }}
        aria-hidden="true"
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Overlay gradient for contrast */}
      <div className="absolute inset-0 bg-black/60 mix-blend-multiply"></div>

      {/* Ambient red glow (brand color) */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(236,28,36,0.25) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Text & CTA Content */}
      <motion.div
        className="relative z-10 text-center px-6 sm:px-10 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h1
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Learn. Connect. Grow.
        </motion.h1>

        <motion.p
          className="mt-4 text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
        >
          Whether it’s a power-packed masterclass, networking brunch, or real
          estate bootcamp, our events are designed to elevate your career and
          expand your network.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-5 justify-center items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        >
          {/* Primary CTA */}
          <motion.div
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 25px 5px var(--color-primary-500)",
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }}
            className="rounded-md py-3 overflow-hidden"
          >
            <Link
              to="/events"
              className="px-8 py-3 bg-[var(--color-primary-500)] text-white font-semibold rounded-md transition duration-300 shadow-[0_0_15px_var(--color-primary-400)] hover:shadow-[0_0_40px_var(--color-primary-500)]"
            >
              Explore Events
            </Link>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0px rgba(255,255,255,0.3)",
                "0 0 25px rgba(255,255,255,0.7)",
                "0 0 0px rgba(255,255,255,0.3)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 40px 10px rgba(255,255,255,0.8)",
            }}
            className="rounded-md overflow-hidden"
          >
            <Link
              to="/about"
              className="px-8 py-3 border border-white text-white rounded-md font-semibold hover:bg-white hover:text-[var(--color-primary-500)] transition duration-300 block"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
