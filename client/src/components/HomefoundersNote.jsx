"use client";
import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import SectionTitle from "./SectionTitle";

export default function HomeFoundersNote() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax-style camera pan/zoom
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <motion.div
      ref={ref}
      className="foundersNoteWrapper w-full py-20 relative overflow-hidden"
      style={{ scale, y }}
    >
      {/* 🔥 Red Light Sweep Overlay */}
      <motion.div
        initial={{ x: "-120%" }}
        animate={isInView ? { x: "120%" } : { x: "-120%" }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent blur-3xl"></div>
      </motion.div>

      {/* 💫 Subtle Glow Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.25 } : { opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute inset-0 bg-red-500/5 blur-2xl pointer-events-none"
      ></motion.div>

      <div className="NoteContent container mx-auto px-6 md:px-0 relative z-10">
        <div className="content flex flex-col md:flex-row items-center justify-between gap-12">
          {/* LEFT CONTENT */}
          <motion.div
            className="left md:w-1/2 text-gray-200"
            initial={{ opacity: 0, x: -80, filter: "blur(12px)" }}
            animate={
              isInView
                ? { opacity: 1, x: 0, filter: "blur(0px)" }
                : { opacity: 0, x: -80, filter: "blur(12px)" }
            }
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          >
            <div className="leftContent flex flex-col gap-6">
              <SectionTitle
                text="Founder's Note"
                textClass="!text-gray-900 tracking-wide"
                underlineClass="!bg-primary-500 !w-[12%] h-[3px]"
              />

              <p className="text-justify leading-[1.8] text-[1.125rem] md:text-[1.25rem] text-gray-600 hyphens-auto">
                At PCRG, we see real estate as more than property—it’s about
                vision, transformation, and lasting impact. Under the leadership
                of{" "}
                <span className="text-primary-400 font-semibold">
                  Dr. Mrs. Vivian Okiche
                </span>
                , our Founder and President, PCRG stands as a symbol of
                innovation, integrity, and growth in real estate marketing. Her
                passion for excellence and empowerment drives everything we do.
                To our investors, we offer confidence built on strategy and
                results. To our realtors, we provide a platform for success and
                shared prosperity. Together, we’re not just shaping the market —
                we’re building the future of real estate.
              </p>

              <div className="mt-4">
                <span className="block font-semibold text-lg text-primary-500">
                  Dr. Mrs. Vivian Okiche
                </span>
                <p className="text-gray-600 text-sm uppercase tracking-wide">
                  Founder & President, PCRG
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            className="right md:w-1/2 flex justify-center md:justify-end"
            initial={{ opacity: 0, x: 80, scale: 0.95, filter: "blur(12px)" }}
            animate={
              isInView
                ? { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }
                : { opacity: 0, x: 80, scale: 0.95, filter: "blur(12px)" }
            }
            transition={{
              duration: 0.9,
              ease: "easeOut",
              delay: 0.5, // staggered timing
            }}
          >
            <div className="rightContent relative w-[100%] md:w-[80%] max-w-[800px] rounded-2xl overflow-hidden shadow-lg shadow-red-500/10">
              <img
                loading="lazy"
                src="/images/drOkichie1.jpg"
                alt="Dr. Mrs. Vivian Okiche"
                className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-[3000ms] ease-out"
              />

              {/* Subtle Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-red-500/10 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.3 } : { opacity: 0 }}
                transition={{ duration: 1.5, delay: 0.6 }}
              ></motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
