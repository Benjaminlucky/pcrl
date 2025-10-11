"use client";
import React from "react";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";

function HomeServices() {
  // Cinematic animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.25,
      },
    },
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40, filter: "blur(6px)", scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  const fadeLeftVariant = {
    hidden: { opacity: 0, x: 100, filter: "blur(8px)", scale: 0.97 },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: { duration: 1.4, ease: "easeOut" },
    },
  };

  const fadeRightVariant = {
    hidden: { opacity: 0, x: -100, filter: "blur(8px)", scale: 0.97 },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: { duration: 1.4, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      className="serviceWrapper w-full py-36 bg-primary-900 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="max-w-[90%] mx-auto px-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch"
          variants={containerVariants}
        >
          {/* Title Section */}
          <motion.div
            variants={fadeUpVariant}
            className="titleWrapper flex flex-col justify-center min-h-[320px] transition-all duration-300"
          >
            <SectionTitle
              text="Our Services"
              textClass="!text-white tracking-wide text-3xl md:text-4xl font-semibold"
              underlineClass="!bg-primary-500 !w-[20%] h-[3px] mt-2"
            />
            <p className="text-gray-300 mt-4 text-sm md:text-base leading-relaxed">
              PCRG delivers excellence through transparency, innovation, and a
              client-first approach in every service we provide.
            </p>
          </motion.div>

          {/* Service 1 */}
          <motion.div
            variants={fadeLeftVariant}
            className="investorWrapper bg-primary-800 p-8 rounded-2xl shadow-lg flex flex-col justify-center min-h-[320px] hover:shadow-xl hover:bg-primary-500/50 transition-all duration-300"
          >
            <div className="investorContent">
              <h3 className="text-white text-xl font-semibold mb-3">
                Property Marketing & Listings
              </h3>
              <p className="text-gray-300 leading-relaxed">
                From Lagos to selected states across Nigeria, we market and list
                properties that meet strict legal and compliance checks to
                ensure buyer confidence and transparency.
              </p>
            </div>
          </motion.div>

          {/* Service 2 */}
          <motion.div
            variants={fadeRightVariant}
            className="clientWrapper bg-primary-800 p-8 rounded-2xl shadow-lg flex flex-col justify-center min-h-[320px] hover:shadow-xl hover:bg-primary-500/50 transition-all duration-300"
          >
            <div className="clientContent">
              <h3 className="text-white text-xl font-semibold mb-3">
                Client Investment Advisory
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Expert guidance for both local and international investors
                seeking secure and profitable real estate opportunities.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default HomeServices;
