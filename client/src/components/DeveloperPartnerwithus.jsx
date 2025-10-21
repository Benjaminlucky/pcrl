"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)", scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 1.2, ease: "easeOut" },
  },
};

export default function PartnerWithUs() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [pulseIntensity, setPulseIntensity] = useState(0.25);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Pulse animation for the red light
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIntensity(
        (prev) => (prev === 0.25 ? 0.35 : 0.25) // gentle breathing effect
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-24 flex items-center justify-center text-center overflow-hidden bg-black">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/burbleBg.jpg')",
        }}
        initial={{ scale: 1.1 }}
        whileInView={{
          scale: 1,
          transition: { duration: 3, ease: "easeOut" },
        }}
        viewport={{ once: true }}
      ></motion.div>

      {/* Cinematic Red Spotlight following mouse + pulsing */}
      <motion.div
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        animate={{
          background: `radial-gradient(
            400px circle at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(255, 0, 0, ${pulseIntensity}),
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

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[20px]"></div>

      {/* Content */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative z-10 max-w-2xl mx-auto px-6"
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{
            opacity: 1,
            scale: 1,
            transition: { duration: 1, ease: "easeOut" },
          }}
          viewport={{ once: true }}
        >
          Partner with <span className="text-red-500">PCRG</span> Today
        </motion.h2>

        <motion.p
          className="text-gray-200 leading-relaxed mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.3, duration: 1 },
          }}
          viewport={{ once: true }}
        >
          Let’s connect your property to the market that’s waiting for it.
          Together, we’ll create visibility, credibility, and unstoppable sales
          momentum.
        </motion.p>

        <div className="flex flex-wrap justify-center gap-4">
          <motion.button
            whileHover={{
              boxShadow: "0 0 25px rgba(255,255,255,0.6)",
              scale: 1.05,
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-md border-2 border-white text-white font-semibold hover:bg-white hover:text-[var(--color-primary-500)] transition-all duration-300"
          >
            Book a Strategy Call
          </motion.button>

          <motion.button
            whileHover={{
              boxShadow: "0 0 25px rgba(255,0,0,0.6)",
              scale: 1.05,
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-md bg-white text-[var(--color-primary-500)] font-semibold hover:bg-[var(--color-primary-500)] hover:text-white transition-all duration-300"
          >
            Partner With Us
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
