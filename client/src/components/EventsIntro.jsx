"use client";
import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import SectionTitle from "./SectionTitle";

export default function EventsIntro({
  image = "/images/eventImg1.jpeg",
  title = "Where Knowledge Meets Lifestyle",
  paragraphs = [
    "Welcome to the heartbeat of the PCRG community — where realtors, investors, and enthusiasts come together to learn, network, and stay inspired. At PCRG, we believe real estate is more than business — it’s a lifestyle, a mindset, and a movement.",
    "Our Events Hub keeps you connected to the trends, trainings, and transformational moments shaping the future of real estate across Africa.",
  ],
  reverse = false, // 🔁 Flip layout automatically
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // 🔁 Animate direction based on reverse
  const imageInitialX = reverse ? 80 : -80;
  const textInitialX = reverse ? -80 : 80;

  // 🩶 Alternate background color based on layout
  const bgColor = reverse ? "bg-gray-50" : "bg-white";

  return (
    <motion.section
      ref={ref}
      style={{ scale, y }}
      className={`relative w-full py-36 md:py-36 px-6 md:px-0 overflow-hidden transition-colors duration-700 ${bgColor}`}
    >
      {/* 🔴 Red sweep overlay */}
      <motion.div
        initial={{ x: "-120%" }}
        animate={isInView ? { x: "120%" } : { x: "-120%" }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-red-500/10 to-transparent blur-3xl"></div>
      </motion.div>

      {/* 🌐 Content */}
      <div className="container mx-auto relative z-10">
        <div
          className={`flex flex-col md:flex-row items-center justify-between gap-16 ${
            reverse ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* LEFT / RIGHT IMAGE */}
          <motion.div
            className="md:w-1/2 w-full flex justify-center md:justify-start"
            initial={{ opacity: 0, x: imageInitialX, filter: "blur(12px)" }}
            animate={
              isInView
                ? { opacity: 1, x: 0, filter: "blur(0px)" }
                : { opacity: 0, x: imageInitialX, filter: "blur(12px)" }
            }
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <img
              src={image}
              alt={title}
              className="rounded-2xl shadow-lg shadow-red-500/10 object-cover w-full max-w-auto"
            />
          </motion.div>

          {/* TEXT CONTENT */}
          <motion.div
            className="md:w-1/2 w-full text-gray-800 flex flex-col justify-center"
            initial={{ opacity: 0, x: textInitialX, filter: "blur(12px)" }}
            animate={
              isInView
                ? { opacity: 1, x: 0, filter: "blur(0px)" }
                : { opacity: 0, x: textInitialX, filter: "blur(12px)" }
            }
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
          >
            <SectionTitle
              text={title}
              textClass="!text-gray-900 tracking-wide"
              underlineClass="!bg-red-500 !w-[14%] h-[3px]"
            />

            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={`mt-${
                  i === 0 ? "6" : "4"
                } leading-[1.8] text-[1.125rem] md:text-[1.25rem] text-gray-600 text-justify`}
              >
                {p}
              </p>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
