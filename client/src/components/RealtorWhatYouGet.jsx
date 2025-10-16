import React, { useEffect } from "react";
import {
  FaIdBadge,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaChartLine,
  FaNetworkWired,
} from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FaUsersRectangle } from "react-icons/fa6";
import { PiShareNetworkBold } from "react-icons/pi";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionTitle from "./SectionTitle";

const features = [
  {
    icon: <FaUsersRectangle className="w-16 h-16 text-white" />,
    title: "Free Realtor Registration",
  },
  {
    icon: <FaChalkboardTeacher className="w-16 h-16 text-white" />,
    title: "Weekly training & mentorship sessions",
  },
  {
    icon: <RiVerifiedBadgeFill className="w-16 h-16 text-white" />,
    title: "Access to verified property listings",
  },
  {
    icon: <FaChartLine className="w-16 h-16 text-white" />,
    title: "Sales rewards & recognition programs",
  },
  {
    icon: <PiShareNetworkBold className="w-16 h-16 text-white" />,
    title: "Networking events & real estate summits",
  },
];

const RealtorWhatYouGet = () => {
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
          text="What You Get"
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
        {features.map((feature, i) => (
          <motion.div
            key={i}
            variants={fadeBlur}
            className="flex items-center gap-4 p-6 bg-gradient-to-r from-[var(--color-primary-900)] to-red-800/90 text-white rounded-lg shadow-md transition-transform duration-300 hover:scale-[1.02]"
            whileHover={{
              boxShadow:
                "0 0 20px rgba(255,0,0,0.4), 0 0 40px rgba(255,0,0,0.2)",
            }}
          >
            <div className="flex-shrink-0">{feature.icon}</div>
            <p className="text-lg font-medium leading-snug">{feature.title}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default RealtorWhatYouGet;
