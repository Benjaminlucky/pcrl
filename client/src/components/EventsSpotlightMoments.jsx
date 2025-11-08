import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import spotlight1 from "/images/academystudents1.jpeg";
import spotlight2 from "/images/academystudent4.jpeg";

// ✨ Floating Star Component (infinite loop sparkles)
const FloatingStar = ({ delay, size, top, left, mouseX, mouseY }) => {
  const x = useTransform(mouseX, [0, window.innerWidth], [-10, 10]);
  const y = useTransform(mouseY, [0, window.innerHeight], [-10, 10]);

  return (
    <motion.div
      className="absolute text-yellow-400 opacity-80"
      style={{
        top,
        left,
        fontSize: size,
        filter: "drop-shadow(0 0 10px gold)",
        x,
        y,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1.2, 1],
        opacity: [0, 1, 0.8, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      ★
    </motion.div>
  );
};

export default function EventsSpotlightMoments() {
  const mouseX = useMotionValue(window.innerWidth / 2);
  const mouseY = useMotionValue(window.innerHeight / 2);
  const [isIdle, setIsIdle] = useState(false);

  // Track idle mouse
  useEffect(() => {
    let idleTimer;
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsIdle(true), 3000);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // 🌟 Stars configuration
  const stars = [
    { delay: 0, size: "1rem", top: "10%", left: "15%" },
    { delay: 1, size: "1.4rem", top: "25%", left: "70%" },
    { delay: 2, size: "1.2rem", top: "75%", left: "30%" },
    { delay: 3, size: "1.8rem", top: "60%", left: "85%" },
    { delay: 4, size: "1.3rem", top: "45%", left: "50%" },
    { delay: 5, size: "1.1rem", top: "20%", left: "40%" },
    { delay: 6, size: "1.6rem", top: "85%", left: "60%" },
  ];

  // 🎇 Dynamic gold glow (follows cursor or pulses if idle)
  const glowX = useTransform(mouseX, [0, window.innerWidth], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [0, window.innerHeight], ["0%", "100%"]);

  return (
    <section className="relative bg-black text-white py-24 overflow-hidden cursor-default">
      {/* 🌟 Floating Stars Layer */}
      {stars.map((star, i) => (
        <FloatingStar key={i} {...star} mouseX={mouseX} mouseY={mouseY} />
      ))}

      {/* 🌕 Moving Gold Glow */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: isIdle
            ? "radial-gradient(circle at center, rgba(255,215,0,0.12), rgba(0,0,0,0.9))"
            : `radial-gradient(
                circle at ${glowX.get()} ${glowY.get()},
                rgba(255,215,0,0.15),
                rgba(0,0,0,0.9)
              )`,
        }}
        animate={
          isIdle
            ? {
                scale: [1, 1.05, 1],
                opacity: [0.9, 1, 0.9],
              }
            : {}
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 💫 Soft base glow for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 via-transparent to-black/90"></div>

      {/* 🌙 Content Wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-0 flex flex-col lg:flex-row items-center gap-10">
        {/* LEFT TEXT */}
        <div className="flex-1 text-left space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight text-yellow-100 drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
            Spotlight <br /> Moments
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed max-w-md">
            Because at PCRG, we celebrate our people! Explore event highlights,
            graduation ceremonies, training sessions, and behind-the-scenes
            moments that showcase our growing family of realtors and developers.
          </p>
        </div>

        {/* RIGHT IMAGES */}
        <div className="flex-1 grid grid-cols-2 gap-4 md:gap-6">
          {[spotlight1, spotlight2].map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden rounded-2xl shadow-lg shadow-yellow-500/10"
            >
              <img
                src={img}
                alt={`PCRG Spotlight ${i + 1}`}
                className="object-cover w-full h-full rounded-2xl"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
