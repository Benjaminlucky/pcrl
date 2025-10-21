"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import SectionTitle from "../components/SectionTitle";

const partners = [
  { src: "/images/partners/mkh.png", alt: "MKH Properties" },
  { src: "/images/partners/veritasi.png", alt: "Veritasi Homes" },
  { src: "/images/partners/gracias.png", alt: "Gracias" },
  { src: "/images/partners/lcr.png", alt: "LCR" },
  { src: "/images/partners/oceanGrowth.svg", alt: "Ocean Growth Homes" },
  { src: "/images/partners/efficacy.jpg", alt: "Efficacy" },
  { src: "/images/partners/highbridge.png", alt: "Highbridge Homes" },
  { src: "/images/partners/vopnucity.jpg", alt: "Vopnucity" },
  { src: "/images/partners/evermark.png", alt: "Evermark" },
  { src: "/images/partners/spl.png", alt: "SPL" },
  { src: "/images/partners/zylus.png", alt: "Zylus" },
  { src: "/images/partners/lexshield.webp", alt: "Lexshield" },
  { src: "/images/partners/bluedutch.png", alt: "BlueDutch" },
  { src: "/images/partners/onyx.png", alt: "Onyx" },
  { src: "/images/partners/cruxstone.png", alt: "Cruxstone" },
  { src: "/images/partners/ayhomes.png", alt: "AyHomes" },
  { src: "/images/partners/hazibian.png", alt: "Hazibian" },
];

// Motion variants
const sectionVariants = {
  hidden: { opacity: 0, filter: "blur(10px)", scale: 1.05 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 1.2, ease: "easeOut" },
  },
};

const redSweepVariants = {
  hidden: { x: "-100%" },
  visible: {
    x: "100%",
    transition: { duration: 2.5, ease: "easeInOut" },
  },
};

const zoomPanVariants = {
  hidden: { scale: 1.1, y: 60 },
  visible: {
    scale: 1,
    y: 0,
    transition: { duration: 1.8, ease: "easeOut" },
  },
};

const cardContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Spotlight Card Component
const SpotlightCard = ({ partner }) => {
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, active: false });

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        scale: 1.08,
        boxShadow: "0 0 30px rgba(255,0,0,0.3)",
        borderColor: "var(--color-primary-600)",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setSpotlight({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
        });
      }}
      onMouseLeave={() => setSpotlight({ ...spotlight, active: false })}
      className="relative flex justify-center items-center bg-white/60 backdrop-blur-sm rounded-xl border border-transparent p-3 overflow-hidden transition-all duration-300"
    >
      {/* Dynamic Spotlight Effect */}
      {spotlight.active && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(200px at ${spotlight.x}px ${spotlight.y}px, rgba(255,0,0,0.25), transparent 70%)`,
          }}
          transition={{ duration: 0.3 }}
        />
      )}

      <img
        src={partner.src}
        alt={partner.alt}
        className="w-28 sm:w-32 md:w-36 object-contain grayscale hover:grayscale-0 transition-all duration-300 relative z-10"
      />
    </motion.div>
  );
};

const WhoWeWorkWith = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  return (
    <motion.section
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
      className="relative py-36 bg-white overflow-hidden"
    >
      {/* Cinematic Red Sweep */}
      <motion.div
        variants={redSweepVariants}
        animate={controls}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/25 to-transparent blur-3xl"
      ></motion.div>

      {/* Background Image with Zoom/Pan */}
      <motion.div
        variants={zoomPanVariants}
        animate={controls}
        className="absolute inset-0 bg-[url('/images/architectural.png')] bg-cover bg-center opacity-15"
        style={{
          backgroundAttachment: "fixed",
          transformOrigin: "center",
        }}
      ></motion.div>

      {/* Subtle Overlay Stripes */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,_rgba(0,0,0,0.04)_0,_rgba(0,0,0,0.04)_1px,_transparent_1px,_transparent_120px)] pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="center mx-auto">
          <SectionTitle
            text={
              <>
                Who We Work{" "}
                <span className="text-[var(--color-primary-600)] mx-auto">
                  With
                </span>
              </>
            }
            textClass="text-3xl md:text-4xl font-bold text-gray-800 text-center"
            underlineClass="h-[3px] !w-20"
          />
        </div>

        {/* Partner Grid */}
        <motion.div
          variants={cardContainerVariants}
          initial="hidden"
          animate={controls}
          className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 place-items-center"
        >
          {partners.map((partner, index) => (
            <SpotlightCard key={index} partner={partner} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WhoWeWorkWith;
