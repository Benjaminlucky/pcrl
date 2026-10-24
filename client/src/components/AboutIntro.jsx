"use client";
import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { useSection } from "../cms/hooks";
import { ABOUT_INTRO } from "../cms/defaults/about";
import { iconFor } from "../cms/icons";

export default function AboutIntro() {
  const c = useSection(ABOUT_INTRO);
  const ref = useRef(null);

  // Parallax motion
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const isInView = useInView(ref, {
    once: true,
    margin: "-120px",
  });

  const fadeBlur = {
    hidden: { opacity: 0, y: 30, filter: "blur(15px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      ref={ref}
      style={{ scale, y }}
      className="w-full py-28 md:py-36 px-6 md:px-0 bg-white relative overflow-hidden"
    >
      {/* 🔥 Cinematic Red Sweep */}
      <motion.div
        initial={{ x: "-120%" }}
        animate={isInView ? { x: "120%" } : {}}
        transition={{ duration: 2.6, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-red-500/10 to-transparent blur-[95px]" />
      </motion.div>

      <div className="container mx-auto relative z-10 max-w-5xl">
        {/* ================================
            SECTION 1 — FASTEST GROWING
        ================================= */}
        <motion.div
          variants={fadeBlur}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="text-center max-w-3xl mx-auto"
        >
          <SectionTitle
            text={c.block1Title}
            textClass="text-center text-gray-900"
            underlineClass="!bg-red-500 !w-[14%] mx-auto h-[3px]"
          />

          {c.block1Paragraphs.map((text, i) => (
            <p
              key={i}
              className={`${i === 0 ? "mt-3" : "mt-2"} text-gray-600 leading-relaxed text-md md:text-lg text-justify`}
            >
              {text}
            </p>
          ))}
        </motion.div>

        {/* ================================
            SECTION 2 — SOLUTION DRIVEN
        ================================= */}
        <motion.div
          variants={fadeBlur}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="text-center max-w-3xl mx-auto mt-20"
        >
          <SectionTitle
            text={c.block2Title}
            textClass="text-center text-gray-900"
            underlineClass="!bg-red-500 !w-[14%] mx-auto h-[3px]"
          />

          {c.block2Paragraphs.map((text, i) => (
            <p
              key={i}
              className={`${i === 0 ? "mt-6" : "mt-4"} text-gray-600 leading-[1.9] text-lg md:text-xl text-justify`}
            >
              {text}
            </p>
          ))}
        </motion.div>

        {/* ================================
            SECTION 3 — CAREER GROWTH
        ================================= */}
        <motion.div
          variants={fadeBlur}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="text-center max-w-3xl mx-auto mt-24"
        >
          <SectionTitle
            text={c.block3Title}
            textClass="text-center text-gray-900"
            underlineClass="!bg-red-500 !w-[14%] mx-auto h-[3px]"
          />

          <p className="mt-6 text-gray-600 leading-[1.9] text-lg md:text-xl">
            {c.block3Text}
          </p>
        </motion.div>

        {/* ================================
            FEATURE GRID
        ================================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, filter: "blur(12px)" }}
          animate={
            isInView
              ? { opacity: 1, scale: 1, filter: "blur(0px)" }
              : { opacity: 0 }
          }
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 mt-14 gap-6"
        >
          {c.features.map((feature, i) => {
            const Icon = iconFor(feature.icon);
            return (
              <FeatureCard
                key={i}
                icon={<Icon className="text-red-500 text-5xl" />}
                title={feature.title}
              />
            );
          })}
        </motion.div>

        {/* ================================
            SECTION 4 — VISION & MISSION
        ================================= */}
        <motion.div
          variants={fadeBlur}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-28"
        >
          {/* Vision Card */}
          <VisionMissionCard title={c.visionTitle} text={c.visionText} />

          {/* Mission Card */}
          <VisionMissionCard title={c.missionTitle} text={c.missionText} />
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ======================================================
   FEATURE CARD
====================================================== */
function FeatureCard({ icon, title }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.04,
        boxShadow: "0 0 30px rgba(255,0,0,0.18)",
      }}
      className="bg-black-900 text-white px-8 py-12 rounded-md min-h-[200px] flex flex-col items-center text-center shadow-lg"
    >
      {icon}
      <h4 className="mt-4 text-lg font-medium leading-snug">{title}</h4>
    </motion.div>
  );
}

/* ======================================================
   VISION / MISSION CARD (new design)
====================================================== */
function VisionMissionCard({ title, text }) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
        boxShadow: "0 0 35px rgba(255,0,0,0.12)",
      }}
      className="bg-white/70 backdrop-blur-lg border border-gray-200 
                 rounded-xl p-8 shadow-sm transition-all"
    >
      <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>

      <div className="w-14 h-[3px] bg-red-500 rounded-full mt-3 mb-4" />

      <p className="text-gray-700 leading-relaxed text-lg">{text}</p>
    </motion.div>
  );
}
