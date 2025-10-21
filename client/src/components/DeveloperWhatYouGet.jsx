"use client";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { motion, useInView, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

const WhatYouGet = () => {
  const benefits = [
    "Access to a vetted salesforce of 10,000+ trained realtors",
    "Dynamic project marketing campaigns (digital + field)",
    "Market insights & buyer trend analysis",
    "Seamless reporting, accountability & transparency",
    "Brand representation with class and credibility",
  ];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  // Variants
  const sectionVariants = {
    hidden: { opacity: 0, filter: "blur(12px)", scale: 1.05 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  const benefitVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.3, duration: 0.6, ease: "easeOut" },
    }),
  };

  const redSweepVariants = {
    hidden: { x: "-100%" },
    visible: {
      x: "100%",
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 5,
      },
    },
  };

  const cameraZoomVariants = {
    hidden: { scale: 1.1, y: 40 },
    visible: {
      scale: 1,
      y: 0,
      transition: { duration: 1.5, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
      className="relative bg-black text-white pt-36 overflow-hidden"
    >
      {/* Cinematic Red Sweep */}
      <motion.div
        variants={redSweepVariants}
        animate={controls}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/30 to-transparent blur-2xl"
      />

      {/* Background Stripes */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,_rgba(255,255,255,0.05)_0,_rgba(255,255,255,0.05)_1px,_transparent_1px,_transparent_120px)] pointer-events-none"></div>

      {/* Content Wrapper */}
      <motion.div
        variants={cameraZoomVariants}
        animate={controls}
        className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10"
      >
        {/* LEFT SIDE — Text Content */}
        <div className="w-full lg:w-1/2 pb-12 lg:pb-24">
          <motion.h2
            variants={sectionVariants}
            animate={controls}
            className="text-4xl md:text-5xl font-extrabold mb-8"
          >
            What <span className="text-red-500">You Get</span>
          </motion.h2>

          <ul className="space-y-5 mb-10">
            {benefits.map((benefit, index) => (
              <motion.li
                key={index}
                custom={index}
                variants={benefitVariants}
                initial="hidden"
                animate={controls}
                className="flex items-start gap-3"
              >
                <FaCheckCircle className="text-red-500 w-6 h-6 flex-shrink-0 mt-1" />
                <span className="text-gray-200 text-lg leading-relaxed">
                  {benefit}
                </span>
              </motion.li>
            ))}
          </ul>

          {/* Glowing Button */}
          <motion.button
            whileHover={{
              scale: 1.07,
              boxShadow: "0 0 25px rgba(255, 0, 0, 0.7)",
              textShadow: "0 0 8px rgba(255, 100, 100, 0.7)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 250, damping: 12 }}
            className="mt-6 px-8 py-3 rounded-md border-2 border-white text-lg font-semibold text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300 shadow-lg"
          >
            Get Started
          </motion.button>
        </div>

        {/* RIGHT SIDE — Image */}
        <motion.div
          variants={cameraZoomVariants}
          animate={controls}
          className="w-full lg:w-1/2 flex justify-center lg:justify-end"
        >
          <img
            src="/images/whatYouDeveloperModel.png"
            alt="Man pointing"
            className="w-[360px] md:w-[420px] lg:w-full object-contain transition-transform duration-700 hover:scale-105"
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default WhatYouGet;
