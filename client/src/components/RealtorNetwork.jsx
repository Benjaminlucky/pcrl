"use client";
import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { FaCheckCircle } from "react-icons/fa";

export default function RealtorNetwork() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // 🖼️ Array of images for Swiper carousel
  const realtorsImages = [
    "/images/academystudents1.jpeg",
    "/images/academystudent2.jpeg",
    "/images/academystudent3.jpeg",
    "/images/academystudent4.jpeg",
  ];

  const benefits = [
    "Network with High Performing Realtors for mentorship and Collaboration",
    "One on One Coaching with industry Experts",
    "Exclusive Access to our Digital Realtor App",
    "A PCRG Premium ID Card",
    "UK Certified Courses and many more benefits",
    "Networking opportunities with Africa’s fastest-growing realtor community",
  ];

  return (
    <motion.div
      ref={ref}
      className="w-full py-28 px-8 md:px-0 relative overflow-hidden bg-white"
      style={{ scale, y }}
    >
      {/* ✨ Subtle motion overlay */}
      <motion.div
        initial={{ x: "-120%" }}
        animate={isInView ? { x: "120%" } : { x: "-120%" }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-red-500/10 to-transparent blur-3xl"></div>
      </motion.div>

      {/* CONTENT */}
      <div className="container mx-auto px-6 md:px-0 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* LEFT IMAGE CAROUSEL */}
          <motion.div
            className="left md:w-1/2 w-full px-8 md:px-0 flex justify-center"
            initial={{ opacity: 0, x: -80, filter: "blur(12px)" }}
            animate={
              isInView
                ? { opacity: 1, x: 0, filter: "blur(0px)" }
                : { opacity: 0, x: -80, filter: "blur(12px)" }
            }
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative w-full md:w-[85%] max-w-[600px] rounded-2xl overflow-hidden shadow-lg shadow-red-500/10">
              <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop={true}
                slidesPerView={1}
                className="realtors-swiper"
              >
                {realtorsImages.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={img}
                      alt={`PCRG Realtors Slide ${i + 1}`}
                      className="w-full h-[380px] md:h-[550px] object-cover"
                      loading="lazy"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.div>

          {/* RIGHT TEXT CONTENT */}
          <motion.div
            className="right md:w-1/2 text-gray-800"
            initial={{ opacity: 0, x: 80, filter: "blur(12px)" }}
            animate={
              isInView
                ? { opacity: 1, x: 0, filter: "blur(0px)" }
                : { opacity: 0, x: 80, filter: "blur(12px)" }
            }
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug">
              <span className="text-red-600">Building 10,000+</span>
              <br /> Realtors Across Africa
            </h2>

            <p className="mt-4 text-gray-600 text-lg leading-relaxed">
              Join a thriving network of over 10,000 realtors who have chosen to
              unlearn, learn and relearn through our transformative training
              sessions led by world-class facilitators and mentors.
            </p>

            <h3 className="mt-6 font-semibold text-lg text-red-600">
              By enrolling in PCRG Training & Academy, you gain:
            </h3>

            <ul className="mt-4 flex flex-col gap-3">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-700 text-[1.05rem] leading-snug"
                >
                  <FaCheckCircle className="text-red-500 w-5 h-5 flex-shrink-0 mt-[2px]" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* ❤️ Pagination Styling */}
      <style jsx global>{`
        .realtors-swiper .swiper-pagination {
          position: absolute;
          bottom: 15px !important;
          text-align: center;
        }

        .realtors-swiper .swiper-pagination-bullet {
          background-color: #f87171; /* Tailwind red-400 */
          opacity: 0.4;
          width: 10px;
          height: 10px;
          transition: all 0.3s ease;
          margin: 0 6px !important;
        }

        .realtors-swiper .swiper-pagination-bullet-active {
          background-color: #ef4444; /* Tailwind red-500 */
          opacity: 1;
          width: 14px;
          height: 14px;
        }

        @media (max-width: 768px) {
          .realtors-swiper .swiper-pagination {
            bottom: 10px !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
