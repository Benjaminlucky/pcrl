"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useSection } from "../cms/hooks";
import { ACADEMY_REVIEWS } from "../cms/defaults/academy";

function AcademyReview() {
  const c = useSection(ACADEMY_REVIEWS);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full py-36 bg-black overflow-hidden"
    >
      {/* Title Section */}
      <div className="container mx-auto px-6 md:px-0 flex flex-col items-center text-center mb-16 relative z-10">
        <div className="container">
          <div className="center mx-auto justify-center max-w-3xl">
            <SectionTitle
              text={c.title}
              textClass="!text-white !text-center text-3xl md:text-4xl font-bold"
              underlineClass="!bg-[#E53E3E] !w-[80px] h-[3px]"
            />
            <p className="text-gray-300 text-sm md:text-base mt-4 max-w-2xl">
              {c.intro}
            </p>
          </div>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          spaceBetween={40}
          loop={true}
          autoplay={{
            delay: 6000,
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
          className="w-full mt-24 pb-14"
        >
          {c.testimonials.map((item, i) => (
            <SwiperSlide key={i} className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.3 + i * 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="bg-white rounded-2xl p-8 md:p-6 max-w-xl shadow-lg hover:shadow-2xl 
              transition-all duration-300 flex flex-col md:flex-row items-center gap-6"
              >
                {/* Avatar */}
                <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border-4 border-gray-100">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="text-left">
                  <h3 className="text-[#E53E3E] text-lg font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                    {item.review}
                  </p>
                  <h4 className="text-gray-900 font-semibold">
                    {item.name},{" "}
                    <span className="text-gray-800 font-medium">
                      {item.designation}
                    </span>
                  </h4>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination Styling */}
        <style jsx global>{`
          .swiper-pagination {
            bottom: 0 !important;
            margin-top: 20px;
            position: relative;
          }

          .swiper-pagination-bullet {
            background: #e53e3e !important;
            opacity: 0.4;
            width: 10px;
            height: 10px;
            transition: all 0.3s ease;
          }

          .swiper-pagination-bullet-active {
            background: #e53e3e !important;
            opacity: 1;
            width: 14px;
            height: 14px;
          }
        `}</style>
      </div>
    </motion.section>
  );
}

export default AcademyReview;
