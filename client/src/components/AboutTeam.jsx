"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionTitle from "./SectionTitle";

const teamMembers = [
  {
    name: "Dr Mrs Vivian Pollard Okiche",
    role: "Madam President, Pcrg",
    image: "/images/faculty/drOkichie1.jpg",
  },
  {
    name: "Mr Mark Iorliam",
    role: "Vice President & Chief Operations Officer",
    image: "/images/MrMark.jpg",
  },
  {
    name: "Mr. Ifeanyichukwu Ogbenna",
    role: "Chief Logistics Officer",
    image: "/images/pcrgLogistics.jpg",
  },
];

export default function AboutTeam() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <motion.section
      ref={ref}
      className="relative py-20 md:py-28 bg-white overflow-hidden"
      initial={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
      animate={
        isInView
          ? { opacity: 1, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, scale: 1.05, filter: "blur(12px)" }
      }
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 🔴 Lens flare cinematic sweep */}
      <motion.div
        initial={{ x: "-150%" }}
        animate={isInView ? { x: ["-150%", "150%"] } : { x: "-150%" }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#ff0000]/10 to-transparent"
      />

      {/* 💫 Camera pan */}
      <motion.div
        className="relative flex flex-col justify-center container mx-auto px-6 md:px-12"
        initial={{ scale: 1, y: 0 }}
        animate={isInView ? { scale: 1.02, y: -10 } : { scale: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <div className="w-full flex justify-center mb-4">
          <div className="text-center">
            <SectionTitle
              text="Meet the Team"
              textClass="text-gray-900 text-3xl md:text-4xl font-extrabold tracking-tight text-center"
              underlineClass="!bg-[var(--color-primary-500)] text-center !w-[60px] !h-[3px]"
            />
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-center  max-w-3xl mx-auto text-gray-600 mb-16 leading-relaxed">
          The Platinum Cape Realtors’ Group leadership team brings together
          experience, vision, and passion – committed to helping clients and
          agents achieve their real estate goals.
        </p>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {teamMembers.map((member, i) => (
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
                delay: 0.4 + i * 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Card */}
              <motion.div
                className="relative overflow-hidden rounded-xl shadow-md bg-white transition-all duration-300"
                whileHover={{
                  boxShadow: "0 0 40px rgba(255,0,0,0.2)",
                  scale: 1.03,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-[420px] object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </motion.div>

              {/* Name & Role */}
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
}
