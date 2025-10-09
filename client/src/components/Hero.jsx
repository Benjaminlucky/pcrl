"use client";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  // Animation variants for staggering
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // delay between each element
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
  };

  return (
    <section className="relative w-full h-[90vh] overflow-hidden border-b-6 border-primary-500">
      {/* Animated Background Image */}
      <motion.div
        className="absolute inset-0 bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/PCRG-Team.jpg')",
          backgroundSize: "cover",
        }}
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

      {/* Hero Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4"
      >
        {/* Title */}
        <motion.h1
          variants={item}
          className="text-4xl  md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg"
        >
          Excellence in Real Estate, Beyond Borders.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={item}
          className="max-w-2xl mx-auto text-lg md:text-xl mb-10 text-gray-200"
        >
          Platinum Cape Realtors Group (PCRG) is bridging local and
          international investors to legally compliant, profitable real estate
          opportunities across Nigeria.
        </motion.p>

        {/* Buttons */}
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-5">
          {/* Filled Button with Blue Glow */}
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 25px 6px rgba(235, 37, 37, 0.6)",
              backgroundColor: "rgba(235, 37, 37, 1)",
            }}
            transition={{ type: "spring", stiffness: 260, damping: 15 }}
            className="rounded-sm overflow-hidden"
          >
            <Link
              to="/sign-up"
              className="px-8 py-3 bg-primary-500 text-white rounded-sm font-semibold transition duration-300 block"
              style={{ backfaceVisibility: "hidden" }}
            >
              Explore Properties
            </Link>
          </motion.div>

          {/* Outline Button with Infinite Pulse Effect */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0px rgba(255,255,255,0.3)",
                "0 0 20px rgba(255,255,255,0.6)",
                "0 0 0px rgba(255,255,255,0.3)",
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 30px 8px rgba(255,255,255,0.8)",
            }}
            className="rounded-sm overflow-hidden"
          >
            <Link
              to="/services"
              className="px-8 py-3 border border-white text-white rounded-sm font-semibold hover:bg-white hover:text-primary-500 transition duration-300 block"
              style={{ backfaceVisibility: "hidden" }}
            >
              Join Our Realtors Network
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
