"use client";
import React from "react";
import { motion } from "framer-motion";
import { WhyChoose } from "../data/data.js";
import SectionTitle from "./SectionTitle";

function HomeChoose() {
  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.25 },
    },
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 50, filter: "blur(6px)", scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: { duration: 1.1, ease: "easeOut" },
    },
  };

  const fadeInVariant = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="chooseWrapper w-full bg-gray-100 flex justify-center items-center py-28 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="chooseContent container mx-auto flex flex-col justify-center items-center gap-10 py-20">
        <motion.div
          className="content w-full flex flex-col justify-center items-center gap-10"
          variants={containerVariants}
        >
          {/* Title */}
          <motion.div variants={fadeUpVariant} className="center">
            <SectionTitle
              text="Why Choose PCRG?"
              textClass="!text-gray-900 tracking-wide"
              underlineClass="!bg-primary-500 !w-[20%] h-[3px]"
            />
          </motion.div>

          {/* Perks Grid */}
          <motion.div
            variants={containerVariants}
            className="perks w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-12 lg:px-0 gap-10 py-16"
          >
            {WhyChoose.map((perk, index) => (
              <motion.div
                key={index}
                variants={fadeInVariant}
                className="perk group flex flex-col text-center bg-white min-h-[250px] shadow-lg rounded-lg py-12 px-8 justify-center items-center transition-all duration-300 hover:bg-primary-500 hover:shadow-2xl"
              >
                {/* Icon */}
                <div className="icon text-primary-500 text-6xl mb-4 transition-colors duration-300 group-hover:text-white">
                  {React.createElement(perk.icon)}
                </div>

                {/* Title */}
                <h3 className="title text-2xl text-center font-bold py-3 text-gray-700 transition-colors duration-300 group-hover:text-white">
                  {perk.title}
                </h3>

                {/* Description */}
                <p className="description text-md text-gray-600 transition-colors duration-300 group-hover:text-white">
                  {perk.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default HomeChoose;
