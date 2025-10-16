"use client";
import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { MdOutlineCheckCircle } from "react-icons/md";
import { impact } from "../data/data.js";

export default function HomeWhoWeAre() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Soft camera pan & zoom effect (Apple-style)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <motion.div
      ref={ref}
      className="aboutWrapper w-full bg-white py-12 md:py-20 relative overflow-hidden"
      style={{ scale, y }}
    >
      {/* 🔥 Red Light Sweep (Lens Flare) */}
      <motion.div
        initial={{ x: "-120%" }}
        animate={isInView ? { x: "120%" } : { x: "-120%" }}
        transition={{ duration: 2.8, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-red-500/25 to-transparent blur-3xl"></div>
      </motion.div>

      {/* 💫 Subtle Red Glow Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.2 } : { opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute inset-0 bg-red-500/5 blur-2xl pointer-events-none"
      ></motion.div>

      <div className="aboutContent container mx-auto px-6 md:px-0 relative z-10">
        <div className="about flex flex-col md:flex-row justify-between items-start gap-12">
          {/* LEFT SECTION */}
          <motion.div
            className="left bg-primary-900 rounded-md p-8 md:p-16 min-h-[600px] md:w-1/2"
            initial={{ opacity: 0, x: -80, filter: "blur(12px)" }}
            animate={
              isInView
                ? { opacity: 1, x: 0, filter: "blur(0px)" }
                : { opacity: 0, x: -80, filter: "blur(12px)" }
            }
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="leftContent flex flex-col gap-6">
              <SectionTitle
                text="Who We Are"
                textClass="!text-white tracking-wide"
                underlineClass="!bg-gray-400 !w-[12%] h-[3px]"
              />
              <p className="text-gray-300 leading-[1.988] text-justify text-[1.125rem] md:text-[1.25rem] hyphens-auto">
                Platinum Cape Realtors Group (PCRG) is a thriving real estate
                marketing company with its headquarter in Lagos, Nigeria. In
                just three years, we have built a network of over 10,000
                realtors, serving both local and international investors with
                excellence, integrity, and professionalism. Our dedication to
                redefining standards in real estate makes us a trusted partner
                for investors seeking value and growth.
              </p>
            </div>
          </motion.div>

          {/* RIGHT SECTION */}
          <motion.div
            className="right md:w-1/2 flex flex-col gap-10"
            initial={{ opacity: 0, x: 80, filter: "blur(12px)" }}
            animate={
              isInView
                ? { opacity: 1, x: 0, filter: "blur(0px)" }
                : { opacity: 0, x: 80, filter: "blur(12px)" }
            }
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
          >
            {/* Vision Section */}
            <div className="top">
              <SectionTitle
                text="Our Vision"
                textClass="text-gray-900 tracking-wide"
                underlineClass="!bg-primary-500 !w-[12%] h-[3px]"
              />
              <p className="text-gray-500 leading-relaxed text-justify text-[1rem] md:text-[1.1rem] mt-6 hyphens-auto">
                To redefine the standards of excellence in Nigeria’s real estate
                industry and create value that benefits clients, realtors,
                developers, and the economy at large. We aim to build a
                sustainable system where innovation, transparency, and
                partnership thrive.
              </p>
            </div>

            {/* Impact Section */}
            <div className="bottom">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Our Impact
              </h3>
              <span className="text-gray-600 block mb-5">
                In three years, PCRG has:
              </span>

              <div className="impacts flex flex-col gap-4">
                {impact.map((item, index) => (
                  <motion.div
                    key={index}
                    className="impact flex items-center gap-3 text-gray-500"
                    initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                    animate={
                      isInView
                        ? { opacity: 1, y: 0, filter: "blur(0px)" }
                        : { opacity: 0, y: 40, filter: "blur(12px)" }
                    }
                    transition={{
                      duration: 0.6,
                      delay: 0.5 + index * 0.3, // ⏱ staggered timing
                      ease: "easeOut",
                    }}
                  >
                    <MdOutlineCheckCircle className="icon text-red-600 text-[1.5rem] md:text-[1.75rem] flex-shrink-0" />
                    <p className="text-[1rem] md:text-[1.05rem] leading-relaxed text-justify">
                      {item.item}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
