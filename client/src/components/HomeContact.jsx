"use client";
import React, { useRef } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { motion, useInView, useTransform, useScroll } from "framer-motion";

export default function HomeContact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // 🎥 Camera pan & zoom motion
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const zoom = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ scale: zoom, y }}
      initial={{ opacity: 0, y: 100, filter: "blur(15px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 100, filter: "blur(15px)" }
      }
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full bg-[#e8f0f0] py-36 px-6 md:px-16 overflow-hidden"
    >
      {/* 🔥 Red Light Sweep Overlay */}
      <motion.div
        initial={{ x: "-130%" }}
        animate={isInView ? { x: "130%" } : {}}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EC1C24]/25 to-transparent pointer-events-none mix-blend-screen"
      />

      {/* 💫 Subtle Red Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.25 } : {}}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute inset-0 bg-gradient-to-tr from-[#EC1C24]/10 to-transparent"
      />

      {/* Content */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
        {/* 🖼️ Left Image */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="w-full flex justify-center"
        >
          <img
            loading="lazy"
            src="/images/homeContact.jpeg"
            alt="Contact representative"
            className="rounded-xl w-full max-w-md object-cover shadow-lg"
          />
        </motion.div>

        {/* 📝 Right Content */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="text-gray-900 flex flex-col gap-6"
        >
          <h2 className="text-3xl font-bold">Contact us</h2>
          <div className="w-16 h-[3px] bg-[#EC1C24] mb-2"></div>

          <p className="text-base text-gray-700 leading-relaxed">
            We are here to serve you better. <br />
            Reach out through any of the channels below:
          </p>

          {/* Contact Info */}
          <div className="flex flex-col gap-5 mt-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.9 }}
              className="flex items-center gap-4"
            >
              <div className="bg-[#EC1C24] p-3 rounded-md text-white text-lg">
                <FaEnvelope />
              </div>
              <p className="text-base font-medium">info@pcrl.com</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.2 }}
              className="flex items-center gap-4"
            >
              <div className="bg-[#EC1C24] p-3 rounded-md text-white text-lg">
                <FaPhoneAlt />
              </div>
              <p className="text-base font-medium">+234 (0)805 364 2425</p>
            </motion.div>
          </div>

          {/* 🌐 Social Icons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex gap-4 mt-6"
          >
            <a
              href="#"
              className="bg-[#EC1C24] hover:bg-[#b51419] text-white p-3 rounded-full transition-all duration-300"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="bg-[#EC1C24] hover:bg-[#b51419] text-white p-3 rounded-full transition-all duration-300"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="bg-[#EC1C24] hover:bg-[#b51419] text-white p-3 rounded-full transition-all duration-300"
            >
              <FaLinkedinIn />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
