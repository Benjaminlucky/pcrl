"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  FaUsers,
  FaCheckCircle,
  FaChalkboardTeacher,
  FaNetworkWired,
  FaMedal,
} from "react-icons/fa";

export default function EventsOverview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // 🎥 Smooth zoom/pan (parallax feel)
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // ✨ Spotlight cursor glow
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [pulseIntensity, setPulseIntensity] = useState(0.25);

  useEffect(() => {
    const handleMouseMove = (e) =>
      setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIntensity((prev) => (prev === 0.25 ? 0.35 : 0.25));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const events = [
    {
      icon: <FaUsers className="text-red-500 text-7xl mb-4" />,
      title: "Quarterly Realtor Hangouts",
      bg: "bg-neutral-900 text-white",
    },
    {
      icon: <FaCheckCircle className="text-red-500 text-7xl mb-4" />,
      title: "Real Estate Investment Summits",
      bg: "bg-neutral-800 text-white",
    },
    {
      icon: <FaChalkboardTeacher className="text-red-500 text-7xl mb-4" />,
      title: "Developer Partnership Exhibitions",
      bg: "bg-neutral-700 text-white",
    },
    {
      icon: <FaNetworkWired className="text-red-500 text-7xl mb-4" />,
      title: "Networking & Mentorship Mixers",
      bg: "bg-neutral-600 text-white",
    },
    {
      icon: <FaMedal className="text-red-500 text-7xl mb-4" />,
      title: "PCRG Awards & Recognition Nights",
      bg: "bg-neutral-500 text-white",
    },
  ];

  return (
    <motion.section
      ref={ref}
      style={{ scale, y }}
      className="relative w-full py-24 px-6 md:px-0 overflow-hidden flex flex-col items-center text-center bg-white"
    >
      {/* 🎬 Cinematic spotlight overlay (above content) */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        animate={{
          background: `radial-gradient(
            400px circle at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(239, 68, 68, ${pulseIntensity}),
            transparent 80%
          )`,
        }}
        transition={{
          ease: "easeInOut",
          duration: 1.5,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      ></motion.div>

      {/* 🔴 Subtle red sweep (idle background motion) */}
      <motion.div
        initial={{ x: "-120%" }}
        animate={isInView ? { x: "120%" } : { x: "-120%" }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-red-500/10 to-transparent blur-3xl"></div>
      </motion.div>

      {/* 🧭 Headline & Paragraph */}
      <motion.div
        initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-3xl mx-auto relative z-10"
      >
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 leading-tight">
          Be part of the most vibrant realtor ecosystem in Africa
        </h2>
        <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
          Whether it’s a power-packed masterclass, networking brunch, or real
          estate bootcamp, our events are designed to elevate your career and
          expand your network.
        </p>
      </motion.div>

      {/* 🧱 Event Icons Grid */}
      <motion.div
        initial={{ opacity: 0, y: 80, filter: "blur(14px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-0 w-full max-w-7xl overflow-hidden rounded-2xl shadow-sm relative z-10"
      >
        {events.map((event, i) => (
          <motion.div
            key={i}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 25px rgba(239,68,68,0.4)",
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`${event.bg} flex flex-col items-center justify-center py-10 px-6 rounded-lg md:rounded-none`}
          >
            {event.icon}
            <h3 className="text-lg font-semibold leading-snug">
              {event.title}
            </h3>
          </motion.div>
        ))}
      </motion.div>

      {/* 🎟️ Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        className="mt-12 flex flex-col sm:flex-row gap-4 justify-center relative z-10"
      >
        <motion.button
          whileHover={{
            scale: 1.07,
            boxShadow: "0 0 25px rgba(239,68,68,0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-md transition-all duration-300"
        >
          View Upcoming Events
        </motion.button>
        <motion.button
          whileHover={{
            scale: 1.07,
            boxShadow: "0 0 25px rgba(239,68,68,0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          className="border border-red-500 text-red-600 hover:bg-red-500 hover:text-white font-semibold py-3 px-6 rounded-md transition-all duration-300"
        >
          Get Notified
        </motion.button>
      </motion.div>
    </motion.section>
  );
}
