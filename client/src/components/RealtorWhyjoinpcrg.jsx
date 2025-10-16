import React, { useEffect } from "react";
import {
  FaGem,
  FaBriefcase,
  FaHandshake,
  FaGraduationCap,
} from "react-icons/fa6";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionTitle from "./SectionTitle";

const features = [
  {
    icon: <FaGem className="w-10 h-10 text-[var(--color-primary-500)]" />,
    title: "Access Exclusive Listings",
    desc: "Get direct access to verified, high-demand properties across Nigeria — all legally compliant and ready to market.",
  },
  {
    icon: <FaBriefcase className="w-10 h-10 text-[var(--color-primary-500)]" />,
    title: "Learn, Learn & Grow",
    desc: "From your first sale to scaling as a property consultant, PCRG provides tools, mentorship, and trainings that help you grow your income and your brand.",
  },
  {
    icon: <FaHandshake className="w-10 h-10 text-[var(--color-primary-500)]" />,
    title: "Trusted Support System",
    desc: "We guide you every step of the way — from client handling to closing deals. You’re never alone in the field.",
  },
  {
    icon: (
      <FaGraduationCap className="w-10 h-10 text-[var(--color-primary-500)]" />
    ),
    title: "Career Advancement Opportunities",
    desc: "Stand out with certification programs, leadership roles, and recognition as part of our Top Realtors Network.",
  },
];

const RealtorWhyJoinPCRG = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  const fadeBlur = {
    hidden: { opacity: 0, filter: "blur(15px)", y: 30 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  const container = {
    visible: { transition: { staggerChildren: 0.3 } },
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-20 md:py-28 bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/realtorBg1.jpeg')",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Soft zoom/pan background breathe effect */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1, 1.05, 1], x: [0, 10, 0], y: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          backgroundImage: "url('/images/realtorBg1.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(1.05)",
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
            "linear-gradient(90deg, rgba(255,0,0,0.1) 0%, rgba(255,0,0,0.2) 50%, rgba(255,0,0,0) 100%)",
        }}
      />

      {/* Overlays (kept from your config) */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.35)_0_80px,rgba(255,255,255,0.6)_80px,rgba(255,255,255,0.6)_160px)]"></div>
      <div className="absolute inset-0 bg-white/35 backdrop-blur-[2px]"></div>

      {/* Main Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate={controls}
        className="relative z-10 flex justify-center md:justify-end container mx-auto px-6 md:px-12"
      >
        <div className="w-full md:w-1/2 lg:w-[45%]">
          {/* Section Title */}
          <motion.div
            variants={fadeBlur}
            className="mb-14 text-center md:text-left"
          >
            <SectionTitle
              text="Why Join PCRG?"
              textClass="!text-gray-900 tracking-wide"
              underlineClass="!bg-[var(--color-primary-500)] !w-[20%] !h-[3px]"
            />
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={container}
            className="grid grid-cols-1 sm:grid-cols-2 gap-12 md:gap-14"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeBlur}
                className="flex flex-col items-center md:items-start text-center md:text-left gap-3 transition-transform hover:scale-[1.03] duration-300"
              >
                <div className="flex items-center !text-4xl justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default RealtorWhyJoinPCRG;
