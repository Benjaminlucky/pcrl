"use client";
import React, { useRef } from "react";
import { motion, useInView, useTransform, useScroll } from "framer-motion";

function HomeConsultancy() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Camera pan / zoom effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const zoom = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ scale: zoom, y }}
      initial={{ opacity: 0, y: 100, scale: 0.95, filter: "blur(15px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, y: 100, scale: 0.95, filter: "blur(15px)" }
      }
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative joinWrapper w-full bg-gray-100 py-36 px-6 md:px-16 overflow-hidden"
    >
      {/* 🔥 Red Light Sweep */}
      <motion.div
        initial={{ x: "-120%" }}
        animate={isInView ? { x: "120%" } : {}}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EC1C24]/25 to-transparent pointer-events-none mix-blend-screen"
      />

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
        {/* 🟥 Clients Card */}
        <motion.div
          initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="relative rounded-2xl overflow-hidden group h-[500px] flex items-end"
          style={{
            backgroundImage: "url('/images/clientConsultancy.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent transition-all duration-500 group-hover:from-primary-900/80"></div>

          {/* Subtle Red Glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.25 } : {}}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="absolute inset-0 bg-gradient-to-tr from-[#EC1C24]/25 to-transparent"
          />

          {/* Content */}
          <div className="relative z-10 p-8 text-white bg-gradient-to-t from-black/80 via-black/60 to-transparent w-full rounded-b-2xl">
            <p className="text-lg md:text-xl leading-relaxed">
              <span className="font-bold">For Clients:</span> Looking for the
              right company to walk you through real estate investment
              opportunities and growth? PCRG should be top on your list.
            </p>
            <button className="mt-6 bg-[#EC1C24] hover:bg-[#d4141b] text-white font-semibold px-6 py-3 rounded-md transition-all duration-300">
              Contact Our Advisory Team
            </button>
          </div>
        </motion.div>

        {/* 🟥 Realtors Card */}
        <motion.div
          initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
          className="relative rounded-2xl overflow-hidden group h-[500px] flex items-end"
          style={{
            backgroundImage: "url('/images/realtorConsultancy.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-700/60 to-transparent transition-all duration-500 group-hover:from-black/80"></div>

          {/* Subtle Red Glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.25 } : {}}
            transition={{ duration: 1.2, delay: 1 }}
            className="absolute inset-0 bg-gradient-to-tr from-[#EC1C24]/25 to-transparent"
          />

          {/* Content */}
          <div className="relative z-10 p-8 text-white bg-gradient-to-t from-primary-900/90 via-primary-700/80 to-transparent w-full rounded-b-2xl">
            <p className="text-lg md:text-xl leading-relaxed">
              <span className="font-bold">For Realtors:</span> Join a thriving
              network of over 10,000 professionals where you can access
              listings, training, and opportunities to grow.
            </p>
            <button className="mt-6 bg-black/70 hover:bg-black text-white font-semibold px-6 py-3 rounded-md transition-all duration-300">
              Join as a Realtor
            </button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default HomeConsultancy;
