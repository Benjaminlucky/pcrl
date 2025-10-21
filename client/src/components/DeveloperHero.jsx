import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "./RealtorHero.css";

const DeveloperHero = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const fadeBlur = {
    hidden: { opacity: 0, filter: "blur(20px)", y: 30 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  const container = {
    visible: {
      transition: { staggerChildren: 0.3 },
    },
  };

  return (
    <section className="w-full realtor-hero overflow-hidden relative">
      {/* Background swirl with soft zoom/pan breathing effect */}
      <motion.div
        className="swirl-bg absolute inset-0"
        animate={{ scale: [1, 1.05, 1], x: [0, 10, 0], y: [0, -10, 0] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>

      {/* Cinematic red sweep overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ x: "-100%" }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 6,
        }}
        style={{
          background:
            "linear-gradient(90deg, rgba(255,0,0,0.15) 0%, rgba(255,0,0,0.25) 50%, rgba(255,0,0,0) 100%)",
        }}
      />

      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={controls}
        className="relative z-10 w-11/12 md:w-10/12 flex flex-col md:flex-row items-center justify-between"
      >
        {/* LEFT — Text Content */}
        <div className="text-center md:text-left md:w-1/2 space-y-6">
          <motion.h1
            variants={fadeBlur}
            className="text-4xl sm:text-4xl md:text-5xl font-bold mt-24 md:mt-0 leading-tight text-white"
          >
            Your Project. Our Sales Power. Unstoppable Results{" "}
            <span>Together</span>
          </motion.h1>

          <motion.p
            variants={fadeBlur}
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
          >
            At Platinum Cape Realtors Group (PCRG), we don’t just sell your
            projects — we elevate them with{" "}
            <span className="font-bold">
              strategy, storytelling, and serious sales power.
            </span>
          </motion.p>

          <motion.button
            variants={fadeBlur}
            whileHover={{
              boxShadow: "0 0 20px var(--color-primary-400)",
              scale: 1.05,
            }}
            className="mt-6 px-8 py-3 rounded-md border-2 border-white text-lg font-semibold text-white hover:bg-white hover:text-[var(--color-primary-700)] transition-all duration-300 shadow-lg"
          >
            Engage us Today
          </motion.button>
        </div>

        {/* RIGHT — Image with modern scale + glow effect */}
        <motion.div
          variants={fadeBlur}
          className="md:w-1/2 flex justify-center items-center md:justify-end py-16"
        >
          <motion.img
            src="/images/developerHero.webp"
            alt="Smiling Realtor"
            className="w-72 sm:w-full md:w-10/12 border-8 border-gray-200  rounded-3xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: [0.9, 1, 1.05, 1],
              opacity: 1,
            }}
            transition={{
              duration: 1.8,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 10px 30px rgba(255,255,255,0.2)",
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default DeveloperHero;
