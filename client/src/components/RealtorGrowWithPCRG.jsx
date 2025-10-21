"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

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

export default function RealtorGrowWithPCRG() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [pulseIntensity, setPulseIntensity] = useState(0.25);

  // Track mouse position for spotlight
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Create subtle pulsing glow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIntensity((prev) => (prev === 0.25 ? 0.35 : 0.25));
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

      {/* Cinematic red spotlight following cursor */}
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

      {/* Overlay for contrast and depth */}
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
          Ready to Grow with{" "}
          <span className="text-[var(--color-primary-500)]">PCRG?</span>
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
          Take your real estate career global. <br />
          Join a network of 10,000+ Realtors making impact and income every day.
        </motion.p>

        <div className="flex flex-wrap justify-center gap-4">
          {/* Primary CTA */}
          <motion.button
            whileHover={{
              boxShadow: "0 0 25px rgba(255,255,255,0.6)",
              scale: 1.05,
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-md border-2 border-white text-white font-semibold hover:bg-white hover:text-[var(--color-primary-700)] transition-all duration-300"
          >
            Join as a Realtor
          </motion.button>

          {/* WhatsApp Chat Button */}
          <motion.a
            href="https://wa.me/2348053642425?text=Hello%20PCRG!%20I%27d%20like%20to%20learn%20more%20about%20partnering%20as%20a%20Realtor."
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              boxShadow: "0 0 25px rgba(255, 0, 0, 0.6)",
              scale: 1.05,
            }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-8 py-3 rounded-md bg-white text-gray-800 font-semibold hover:bg-[var(--color-primary-700)] hover:text-white transition-all duration-300"
          >
            <FaWhatsapp className="text-white text-2xl" />
            Chat Support
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
