import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const slides = [
    "/images/gallery/gallery1.jpeg",
    "/images/gallery/gallery2.jpeg",
    "/images/gallery/gallery3.jpeg",
  ];

  return (
    <section className="relative w-full bg-black text-white py-16 md:py-20 overflow-hidden">
      {/* CINEMATIC FILM GRAIN OVERLAY */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-soft-light grain"></div>

      {/* FLOATING PARTICLES */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="particles"></div>
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
        {/* TEXT BLOCK */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 80, filter: "blur(18px)" }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 1.4, ease: "easeOut" },
                }
              : {}
          }
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            West Africa’s Fastest-Growing Real Estate Brokerage Network.
          </h1>

          <p className="mt-6 text-lg text-gray-300 leading-relaxed">
            At PCRG, we’re more than a brokerage — we’re a movement redefining
            how real estate is marketed, sold, and experienced across Nigeria
            and beyond.
          </p>
        </motion.div>

        {/* IMAGE CAROUSEL */}
        <motion.div
          className="relative group rounded-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.92, filter: "blur(14px)" }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: { duration: 1.5, ease: "easeOut" },
                }
              : {}
          }
        >
          {/* SPOTLIGHT FOLLOW CURSOR */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="spotlight absolute inset-0"></div>
          </div>

          {/* INFINITE LIGHT SWEEP */}
          <div className="light-sweep"></div>

          {/* VIGNETTE */}
          <div className="vignette"></div>

          {/* AMBIENT PULSE */}
          <div className="absolute -inset-2 rounded-2xl blur-2xl opacity-25 bg-golden-500 animate-pulse"></div>

          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet custom-bullet",
              bulletActiveClass:
                "swiper-pagination-bullet-active custom-bullet-active",
            }}
            autoplay={{ delay: 3000 }}
            loop={true}
            className="w-full h-[420px] sm:h-[480px] md:h-[680px] rounded-2xl relative z-20"
          >
            {slides.map((src, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-full">
                  <img
                    src={src}
                    alt={`slide-${index}`}
                    className="w-full h-full object-cover transition-transform duration-[1600ms] group-hover:scale-[1.08]"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>

      {/* CINEMATIC CSS */}
      <style>
        {`
        /* Spotlight */
        .spotlight {
          background: radial-gradient(circle at var(--x) var(--y),
            rgba(255,255,255,0.25),
            transparent 40%);
          transition: background 0.12s ease;
        }

        /* Light Sweep */
        .light-sweep {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255,255,255,0.2) 50%,
            transparent 100%
          );
          transform: translateX(-100%);
          animation: sweep 3.5s infinite linear;
          pointer-events: none;
          z-index: 15;
        }

        @keyframes sweep {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }

        /* Film Grain */
        .grain {
          background-image: url("https://i.imgur.com/8Km9tLL.png");
          background-size: 300px;
          animation: grainMove 1.2s steps(6) infinite;
        }

        @keyframes grainMove {
          0%, 100% { transform: translate(0,0); }
          50% { transform: translate(-20px, 20px); }
        }

        /* Floating Particles */
        .particles {
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 2px, transparent 2px);
          background-size: 40px 40px;
          animation: floatParticles 18s linear infinite;
          opacity: 0.25;
        }

        @keyframes floatParticles {
          from { transform: translateY(0); }
          to { transform: translateY(-300px); }
        }

        /* Vignette */
        .vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 14;
          background: radial-gradient(circle, transparent 55%, rgba(0,0,0,0.6));
        }

        /* Pagination Bullets */
        .custom-bullet {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          opacity: 0.35;
          margin: 0 6px !important;
          transition: 0.3s ease;
        }

        .custom-bullet-active {
          background: #C99E75;
          opacity: 1;
          transform: scale(1.35);
        }

        /* Mobile Optimization */
        @media (max-width: 480px) {
          .light-sweep { animation-duration: 4.5s; opacity: 0.4; }
          .particles { opacity: 0.15; }
          .grain { opacity: 0.1; }
        }
        `}
      </style>

      {/* CURSOR SPOTLIGHT JS */}
      <script>
        {`
        document.addEventListener("mousemove", (e) => {
          const spotlight = document.querySelector(".spotlight");
          if (spotlight) {
            spotlight.style.setProperty("--x", e.clientX + "px");
            spotlight.style.setProperty("--y", e.clientY + "px");
          }
        });
        `}
      </script>
    </section>
  );
}
