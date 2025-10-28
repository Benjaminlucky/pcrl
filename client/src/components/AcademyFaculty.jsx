"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionTitle from "./SectionTitle";

const facultyMembers = [
  {
    name: "Dr. Mrs. Vivian Okiche",
    role: "President, Pcrg",
    image: "/images/faculty/drOkichie1.jpg",
  },
  {
    name: "Dr. Mrs. Vivian Okiche",
    role: "Head trainer, pcrg academy",
    image: "/images/faculty/faculty1.jpg",
  },
  {
    name: "Dr. Mrs. Vivian Okiche",
    role: "Vice President, Pcrg",
    image: "/images/faculty/faculty2.jpg",
  },
  {
    name: "Dr. Mrs. Vivian Okiche",
    role: "Chaplain, Pcrg",
    image: "/images/faculty/faculty3.jpg",
  },
];

const AcademyFaculty = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={sectionRef}
      className="relative py-20 md:py-28 bg-white overflow-hidden"
      initial={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
      animate={
        isInView
          ? { opacity: 1, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, scale: 1.05, filter: "blur(12px)" }
      }
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 🔴 Continuous Red Lens Flare Sweep */}
      <motion.div
        initial={{ x: "-150%" }}
        animate={isInView ? { x: ["-150%", "150%"] } : { x: "-150%" }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff0000]/10 to-transparent pointer-events-none"
      />

      {/* Soft Camera Pan + Zoom */}
      <motion.div
        className="relative container mx-auto px-6 md:px-12"
        initial={{ scale: 1, y: 0 }}
        animate={isInView ? { scale: 1.02, y: -10 } : { scale: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        {/* Section Title */}
        <div className="flex justify-center mb-16">
          <div>
            <SectionTitle
              text="Faculty"
              textClass="text-gray-900 text-3xl md:text-4xl font-extrabold tracking-tight text-center"
              underlineClass="!bg-[var(--color-primary-500)] !w-[60px] !h-[3px]"
            />
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {facultyMembers.map((member, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{
                opacity: 0,
                y: 50,
                filter: "blur(10px)",
                boxShadow: "0 0 0 rgba(255,0,0,0)",
              }}
              animate={
                isInView
                  ? {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      boxShadow: "0 0 25px rgba(255,0,0,0.08)",
                    }
                  : {}
              }
              transition={{
                duration: 1,
                delay: 0.4 + i * 0.3, // ✅ staggered reveal timing
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Card with subtle red glow */}
              <motion.div
                className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white relative"
                whileHover={{
                  boxShadow: "0 0 35px rgba(255,0,0,0.25)",
                  scale: 1.03,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-[350px] object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </motion.div>

              <div className="mt-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  {member.name}
                </h3>
                <p className="text-[var(--color-primary-500)] font-medium text-sm capitalize mt-1">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default AcademyFaculty;
