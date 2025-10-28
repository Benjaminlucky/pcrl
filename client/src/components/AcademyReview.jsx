"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    title: "Confidence Awakened",
    review:
      "Before joining PCRG Academy, I had zero knowledge about real estate. Today, I can confidently identify good property deals, handle clients professionally, and even close my first sale! The training was practical, detailed, and life-changing.",
    name: "Mary O.",
    designation: "Training Class of 2024",
    avatar: "/images/realtor.jpeg",
  },
  {
    title: "From Curiosity to Career",
    review:
      "Before joining PCRG Academy, I had zero knowledge about real estate. Today, I can confidently identify good property deals, handle clients professionally, and even close my first sale! The training was practical, detailed, and life-changing.",
    name: "Chinedu A.",
    designation: "Realtor, Lagos",
    avatar: "/images/realtor.jpeg",
  },
  {
    title: "Real Value for Money",
    review:
      "This wasn’t just another real estate course. PCRG Academy gave me real tools — negotiation scripts, client management systems, and access to developers. It’s the best investment I’ve made in my personal growth.",
    name: "Chika O",
    designation: "Training Class of 2023",
    avatar: "/images/realtor.jpeg",
  },
  // Add more testimonials as needed
  {
    title: "From Student to Realtor",
    review:
      "I started the training with little confidence, but now I’m a certified realtor with listings and clients of my own. PCRG didn’t just train me—they transformed me.",
    name: "— Fatima A., ",
    designation: "Graduate Realtor",
    avatar: "/images/realtor.jpeg",
  },
  {
    title: "Game-Changer for My Career",
    review:
      "The course structure was easy to follow, yet very powerful. The sessions on property marketing, client relations, and sales closing techniques were absolute game changers for me.",
    name: "— Victor E, ",
    designation: "Delta",
    avatar: "/images/realtor.jpeg",
  },
];

function AcademyReview() {
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
              text="Hear What Our Graduands Have to Say"
              textClass="!text-white !text-center text-3xl md:text-4xl font-bold"
              underlineClass="!bg-[#E53E3E] !w-[80px] h-[3px]"
            />
            <p className="text-gray-300 text-sm md:text-base mt-4 max-w-2xl">
              At PCRG, we understand the value of knowledge and this is
              exemplified through the PCRG Trainings & Academy. See what our
              trainees are saying.
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
          {testimonials.map((item, i) => (
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
