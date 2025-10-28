"use client";
import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AcademyGallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedIndex, setSelectedIndex] = useState(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const images = [
    "/images/gallery/gallery1.jpeg",
    "/images/gallery/gallery2.jpeg",
    "/images/gallery/gallery3.jpeg",
    "/images/gallery/gallery4.jpeg",
    "/images/gallery/gallery5.jpeg",
    "/images/gallery/gallery6.jpeg",
    "/images/gallery/gallery7.jpeg",
    "/images/gallery/gallery8.jpeg",
    "/images/gallery/gallery9.jpeg",
    "/images/gallery/gallery10.jpeg",
    "/images/gallery/gallery11.jpeg",
    "/images/gallery/gallery12.jpeg",
    "/images/gallery/gallery13.jpeg",
    "/images/gallery/gallery14.jpeg",
    "/images/gallery/gallery15.jpeg",
  ];

  const handlePrev = () =>
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () =>
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const closeModal = () => setSelectedIndex(null);

  const fadeBlur = {
    hidden: { opacity: 0, filter: "blur(10px)", y: 40 },
    visible: (i) => ({
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { delay: i * 0.3, duration: 0.8, ease: "easeOut" },
    }),
  };

  return (
    <motion.section
      ref={ref}
      className="relative w-full py-36 bg-black text-white overflow-hidden"
      style={{ y, scale }}
    >
      {/* Background cinematic effects */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={
          isInView
            ? {
                x: ["-130%", "130%", "-130%"],
                background:
                  "linear-gradient(90deg, rgba(255,0,0,0) 0%, rgba(255,0,0,0.25) 50%, rgba(255,0,0,0) 100%)",
              }
            : { x: "-130%" }
        }
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 5,
        }}
        style={{ mixBlendMode: "screen", filter: "blur(14px)" }}
      />

      <motion.div
        initial={{ opacity: 0, filter: "blur(20px)", y: 50 }}
        animate={isInView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
        className="container mx-auto px-6 md:px-0 relative z-10"
      >
        {/* Header */}
        <motion.div
          variants={fadeBlur}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
          className="text-center mb-24"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            PCRG <span className="text-red-500">Event Moments</span>
          </h2>
          <p className="mt-3 text-gray-400 text-lg">
            Celebrating achievements, community and excellence
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {images.map((img, index) => (
            <motion.div
              key={index}
              variants={fadeBlur}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={index + 1}
              className="relative cursor-pointer overflow-hidden group rounded-lg"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 35px rgba(255,50,0,0.25)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              onClick={() => setSelectedIndex(index)}
            >
              <motion.img
                src={img}
                alt={`PCRG Event ${index + 1}`}
                className="w-full h-[200px] md:h-[250px] object-cover transition-all duration-700 group-hover:scale-110"
                loading="lazy"
              />

              {/* 🔥 Glassy Light Sweep Overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ x: "-150%" }}
                whileHover={{
                  x: ["-150%", "150%"],
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeInOut",
                }}
                style={{
                  background:
                    "linear-gradient(120deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 80%)",
                  mixBlendMode: "screen",
                  filter: "blur(6px)",
                }}
              />

              {/* Subtle black overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          ))}
        </div>

        {/* Button */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 0px rgba(255,255,255,0.3)",
              "0 0 25px rgba(255,255,255,0.7)",
              "0 0 0px rgba(255,255,255,0.3)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{
            scale: 1.1,
            boxShadow: "0 0 40px 10px rgb(255,255,255)",
          }}
          className="rounded-md !w-fit mx-auto mt-16 overflow-hidden"
        >
          <Link
            to="/services"
            className="px-8 py-3 border border-white text-white rounded-md font-semibold hover:bg-white hover:text-[var(--color-primary-500)] transition duration-300 block"
          >
            See Events
          </Link>
        </motion.div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-white text-3xl hover:text-red-500 transition"
            >
              <FaTimes />
            </button>
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-10 text-white text-4xl hover:text-red-500 transition"
            >
              <FaChevronLeft />
            </button>
            <motion.img
              key={selectedIndex}
              src={images[selectedIndex]}
              alt="Expanded event"
              className="max-h-[90vh] max-w-[95vw] rounded-2xl object-contain shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            />
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-10 text-white text-4xl hover:text-red-500 transition"
            >
              <FaChevronRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
