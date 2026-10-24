import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionTitle from "./SectionTitle";
import { useSection } from "../cms/hooks";
import { REALTOR_WHAT_YOU_GET } from "../cms/defaults/realtors";
import { iconFor } from "../cms/icons";

const RealtorWhatYouGet = () => {
  const c = useSection(REALTOR_WHAT_YOU_GET);
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  // Fade + blur reveal
  const fadeBlur = {
    hidden: { opacity: 0, filter: "blur(15px)", y: 30 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { duration: 0.9, ease: "easeOut" },
    },
  };

  // Container for stagger effect
  const container = {
    visible: { transition: { staggerChildren: 0.25 } },
  };

  return (
    <section
      ref={ref}
      className="relative flex justify-center overflow-hidden py-20 md:py-28 bg-blue-50"
    >
      {/* Soft background zoom/pan (breathe effect) */}
      <motion.div
        className="absolute inset-0 bg-blue-50"
        animate={{ scale: [1, 1.05, 1], y: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>

      {/* Cinematic red sweep overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ x: "-100%" }}
        animate={inView ? { x: ["-100%", "100%"] } : {}}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 8,
        }}
        style={{
          background:
            "linear-gradient(90deg, rgba(255,0,0,0.1) 0%, rgba(255,0,0,0.2) 50%, rgba(255,0,0,0) 100%)",
        }}
      ></motion.div>

      {/* Section Title */}
      <motion.div
        variants={fadeBlur}
        initial="hidden"
        animate={controls}
        className="absolute mb-14"
      >
        <SectionTitle
          text={c.title}
          textClass="!text-gray-900 tracking-wide"
          underlineClass="!bg-[var(--color-primary-500)] !w-[20%] !h-[3px]"
        />
      </motion.div>

      {/* Features Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate={controls}
        className="max-w-5xl mt-36 mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 px-6 md:px-0 relative z-10"
      >
        {c.features.map((feature, i) => {
          const Icon = iconFor(feature.icon);
          return (
          <motion.div
            key={i}
            variants={fadeBlur}
            className="flex items-center gap-4 p-6 bg-gradient-to-r from-[var(--color-primary-900)] to-red-800/90 text-white rounded-lg shadow-md transition-transform duration-300 hover:scale-[1.02]"
            whileHover={{
              boxShadow:
                "0 0 20px rgba(255,0,0,0.4), 0 0 40px rgba(255,0,0,0.2)",
            }}
          >
            <div className="flex-shrink-0">
              <Icon className="w-16 h-16 text-white" />
            </div>
            <p className="text-lg font-medium leading-snug">{feature.title}</p>
          </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default RealtorWhatYouGet;
