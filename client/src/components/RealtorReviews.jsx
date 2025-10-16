"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { Realtorreviews } from "../data/data.js";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

function RealtorReviews() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 100, scale: 0.96, filter: "blur(10px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, y: 100, scale: 0.96, filter: "blur(10px)" }
      }
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative homeReviewWrapper w-full py-24 bg-black-900 overflow-hidden"
    >
      {/* Light Sweep Overlay */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={isInView ? { x: "100%" } : {}}
        transition={{ duration: 1.6, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
      />

      <div className="reviewContent container mx-auto px-6 md:px-0 flex flex-col gap-12 relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="titleWrapper flex flex-col items-center text-center"
        >
          <div className="center">
            <SectionTitle
              text="Real Stories. Real Growth."
              textClass="!text-gray-100 tracking-wide"
              underlineClass="!bg-primary-500 !w-[15%] h-[3px]"
            />
          </div>
          <p className="text-gray-300 text-sm md:text-base mt-4 max-w-2xl">
            Hear testimonies of impact, financial transformation, and
            sustainable growth.
          </p>
        </motion.div>

        {/* Swiper Slider */}
        <Swiper
          spaceBetween={30}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[Autoplay, Pagination]}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="mySwiper w-full flex justify-center items-center pb-14"
        >
          {Realtorreviews.map((review, index) => (
            <SwiperSlide
              key={index}
              className="flex justify-center items-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 40, scale: 0.95 }
                }
                transition={{
                  duration: 0.8,
                  delay: 0.4 + index * 0.25,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="reviewCard bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl 
                transition-all duration-300 flex flex-col sm:flex-row justify-center 
                items-center gap-6 max-w-md mx-auto text-left relative overflow-hidden"
              >
                {/* Glow effect inside card */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.15 } : {}}
                  transition={{ duration: 1.2, delay: 0.6 + index * 0.2 }}
                  className="absolute inset-0 bg-gradient-to-tr from-primary-200/10 to-transparent"
                />

                {/* Avatar */}
                <div className="avatar w-24 h-24 flex-shrink-0 rounded-full overflow-hidden shadow-md">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Review Text */}
                <div className="flex flex-col justify-center items-start text-left relative z-10">
                  <p className="reviewText text-gray-600 italic mb-3 leading-relaxed">
                    {review.review}
                  </p>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {review.name}
                  </h4>
                  <span className="designation text-sm text-primary-500">
                    {review.designation}
                  </span>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          display: none !important;
        }

        .swiper-pagination {
          bottom: 0 !important;
          margin-top: 20px;
          position: relative;
        }

        .swiper-pagination-bullet {
          background: #f3c2c4ff;
          opacity: 0.6;
          width: 10px;
          height: 10px;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          background: #ffffff;
          width: 14px;
          height: 14px;
          opacity: 1;
        }
      `}</style>
    </motion.section>
  );
}

export default RealtorReviews;
