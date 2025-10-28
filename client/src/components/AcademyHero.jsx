// File: src/components/Hero.jsx

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * Hero component using framer-motion with ambient and button glow.
 * - Autoplays background video only when in viewport.
 * - Ambient glow uses brand primary color.
 * - Smooth motion for text and CTA reveal.
 * - Glow + pulse button animations using Framer Motion.
 */
export default function AcademyHero() {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            controls.start({
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: "easeOut" },
            });
            const playPromise = node.play && node.play();
            if (playPromise && typeof playPromise.then === "function") {
              playPromise.catch(() => setVideoError(true));
            }
          } else {
            if (!node.paused) node.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, [controls]);

  const handleVideoError = () => setVideoError(true);

  return (
    <section className="relative w-full h-screen min-h-[560px] flex items-center justify-center text-white overflow-hidden">
      {/* Ambient Glow Layer using brand color */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(236,28,36,0.25) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {!videoError ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
          loop
          preload="metadata"
          poster="/images/academyPosterHero.jpg"
          onError={handleVideoError}
          aria-hidden="true"
        >
          <source src="/videos/academyHero.webm" type="video/webm" />
          <source src="/videos/academyHero.mp4" type="video/mp4" />
        </video>
      ) : (
        <img
          src="/images/academyPosterHero.jpg"
          alt="Training session background"
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 pointer-events-none"></div>

      <motion.div
        className="relative z-10 text-center px-6 sm:px-10 lg:px-16 max-w-5xl"
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
      >
        <motion.h1
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Elevate Your Game With PCRG Academy
        </motion.h1>

        <motion.p
          className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
        >
          The Leading Professional Realtors Training Program in Africa
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-5 justify-center items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        >
          {/* 🔥 Primary Button with Dynamic Red Glow */}
          <motion.div
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 30px 10px var(--color-primary-500)",
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }}
            className="rounded-md py-3 overflow-hidden"
          >
            <Link
              to="/sign-up"
              className="px-8 py-3 bg-[var(--color-primary-500)] text-white font-semibold rounded-md transition duration-300 shadow-[0_0_15px_var(--color-primary-400)] hover:shadow-[0_0_40px_var(--color-primary-500)]"
            >
              Apply to Academy
            </Link>
          </motion.div>

          {/* 🌟 Outline Button with Infinite Pulse Glow using Brand Primary */}
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
              boxShadow: "0 0 40px 10px rgb(255,255,255",
            }}
            className="rounded-md overflow-hidden"
          >
            <Link
              to="/services"
              className="px-8 py-3 border border-white text-white rounded-md font-semibold hover:bg-white hover:text-[var(--color-primary-500)] transition duration-300 block"
            >
              View Faculty
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
