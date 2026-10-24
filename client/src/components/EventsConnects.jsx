"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { BsTwitterX } from "react-icons/bs";
import { useSection } from "../cms/hooks";
import { EVENTS_CONNECTS } from "../cms/defaults/events";
import InlineText from "../cms/InlineText";

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

export default function EventsConnects() {
  const c = useSection(EVENTS_CONNECTS);
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

  // Subtle pulsing effect for spotlight
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIntensity((prev) => (prev === 0.25 ? 0.35 : 0.25));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Pulse animation for icons (gold shimmer)
  const iconPulse = {
    animate: {
      textShadow: [
        "0 0 10px rgba(255,215,0,0.3)",
        "0 0 20px rgba(255,215,0,0.6)",
        "0 0 10px rgba(255,215,0,0.3)",
      ],
      color: ["#FFD700", "#fff8dc", "#FFD700"],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative py-24 flex items-center justify-center text-center overflow-hidden bg-black">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("${encodeURI(c.backgroundImage)}")`,
        }}
        initial={{ scale: 1.1 }}
        whileInView={{
          scale: 1,
          transition: { duration: 3, ease: "easeOut" },
        }}
        viewport={{ once: true }}
      ></motion.div>

      {/* Cinematic spotlight following cursor */}
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

      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[20px]"></div>

      {/* Content */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative z-10 max-w-2xl mx-auto px-6"
      >
        {/* Title */}
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
          <InlineText text={c.title} strongClassName="text-red-500 font-extrabold" />
        </motion.h2>

        {/* Paragraph */}
        <motion.p
          className="text-gray-200 text-lg md:text-xl leading-relaxed mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.3, duration: 1 },
          }}
          viewport={{ once: true }}
        >
          {c.body}
        </motion.p>

        {/* Social Icons */}
        <div className="flex flex-col items-center gap-4 text-white">
          <h3 className="text-lg font-medium tracking-wide">
            <InlineText text={c.followText} strongClassName="text-red-500" />
          </h3>

          <div className="flex justify-center gap-6 mt-3 text-3xl">
            {/* Facebook */}
            <motion.a
              href={c.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              variants={iconPulse}
              animate="animate"
              whileHover={{
                scale: 1.3,
                color: "#1877F2",
                textShadow: "0 0 25px rgba(24,119,242,0.8)",
              }}
            >
              <FaFacebook />
            </motion.a>

            {/* Instagram */}
            <motion.a
              href={c.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              variants={iconPulse}
              animate="animate"
              whileHover={{
                scale: 1.3,
                color: "#E1306C",
                textShadow: "0 0 25px rgba(225,48,108,0.8)",
              }}
            >
              <RiInstagramFill />
            </motion.a>

            {/* Twitter (X) */}
            <motion.a
              href={c.xUrl}
              target="_blank"
              rel="noopener noreferrer"
              variants={iconPulse}
              animate="animate"
              whileHover={{
                scale: 1.3,
                color: "#1DA1F2",
                textShadow: "0 0 25px rgba(29,161,242,0.8)",
              }}
            >
              <BsTwitterX />
            </motion.a>

            {/* WhatsApp */}
            <motion.a
              href={c.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              variants={iconPulse}
              animate="animate"
              whileHover={{
                scale: 1.3,
                color: "#25D366",
                textShadow: "0 0 25px rgba(37,211,102,0.8)",
              }}
            >
              <FaWhatsapp />
            </motion.a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
