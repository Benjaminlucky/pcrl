"use client";
import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import SectionTitle from "./SectionTitle";

export default function HomeAcademyIntro() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // 🖼️ Array of images for Swiper carousel
  const academyImages = [
    "/images/academystudents1.jpeg",
    "/images/academystudent2.jpeg",
    "/images/academystudent3.jpeg",
    "/images/academystudent4.jpeg",
  ];

  return (
    <motion.div
      ref={ref}
      className="academyIntroWrapper w-full py-36 px-8 md:px-0 relative overflow-hidden bg-white"
      style={{ scale, y }}
    >
      {/* 🔴 Subtle red sweep animation */}
      <motion.div
        initial={{ x: "-120%" }}
        animate={isInView ? { x: "120%" } : { x: "-120%" }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-red-500/10 to-transparent blur-3xl"></div>
      </motion.div>

      <div className="NoteContent container mx-auto px-6 md:px-0 relative z-10">
        {/* 🧭 Flex layout for text + carousel */}
        <div className="content flex flex-col md:flex-row items-center md:items-center justify-between gap-12">
          {/* LEFT TEXT CONTENT */}
          <motion.div
            className="left md:w-1/2 text-gray-800 flex flex-col justify-center"
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
                text="Welcome to PCRG Training & Academy"
                textClass="!text-gray-900  tracking-wide"
                underlineClass="!bg-red-500 !w-[14%] h-[3px]"
              />

              <p className="text-justify leading-[1.8] text-[1.125rem] md:text-[1.25rem] text-gray-600 hyphens-auto">
                A citadel of learning for aspiring and established real estate
                professionals. At PCRG, we equip realtors with modern-day
                industry knowledge, practical skills and cutting-edge technology
                they need to develop their expertise as high-performing
                salespersons in the real estate industry.
              </p>
            </div>
          </motion.div>

          {/* RIGHT IMAGE CAROUSEL */}
          <motion.div
            className="right md:w-1/2 py-8 flex justify-center md:justify-end items-center"
            initial={{ opacity: 0, x: 80, scale: 0.95, filter: "blur(12px)" }}
            animate={
              isInView
                ? { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }
                : { opacity: 0, x: 80, scale: 0.95, filter: "blur(12px)" }
            }
            transition={{
              duration: 0.9,
              ease: "easeOut",
              delay: 0.5,
            }}
          >
            <div className="rightContent relative w-full md:w-[85%] max-w-[600px] mx-auto md:mx-0 px-8 md:px-0 rounded-2xl overflow-hidden shadow-lg shadow-red-500/10">
              <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                spaceBetween={10}
                slidesPerView={1}
                className="academy-swiper"
              >
                {academyImages.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={img}
                      alt={`PCRG Academy Slide ${i + 1}`}
                      className="w-full h-[380px] md:h-[600px] object-cover"
                      loading="lazy"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ❤️ Pagination Styling */}
      <style jsx global>{`
        .academy-swiper .swiper-pagination {
          position: absolute;
          bottom: 15px !important;
          text-align: center;
        }

        .academy-swiper .swiper-pagination-bullet {
          background-color: #f87171; /* Tailwind red-400 */
          opacity: 0.4;
          width: 10px;
          height: 10px;
          transition: all 0.3s ease;
          margin: 0 6px !important;
        }

        .academy-swiper .swiper-pagination-bullet-active {
          background-color: #ef4444; /* Tailwind red-500 */
          opacity: 1;
          width: 14px;
          height: 14px;
        }

        @media (max-width: 768px) {
          .academy-swiper .swiper-pagination {
            bottom: 10px !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
