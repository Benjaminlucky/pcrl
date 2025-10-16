import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import joinImg from "/images/RealtorPageJoinModel.png";

export default function RealtorWhocanjoin() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  return (
    <section
      ref={ref}
      className="relative w-11/12 mx-auto overflow-hidden flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-24"
    >
      {/* Soft Background Zoom/Pan (Breathe Effect) */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ scale: 1 }}
        animate={inView ? { scale: [1, 1.03, 1], x: [0, -15, 0] } : {}}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Cinematic Red Sweep Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[rgba(255,0,0,0.15)] via-transparent to-transparent pointer-events-none"
        initial={{ x: "-100%" }}
        animate={inView ? { x: ["-100%", "100%"] } : {}}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
      />

      {/* Left Text Content */}
      <motion.div
        className="relative z-10 max-w-xl text-center lg:text-left py-18 lg:py-0"
        variants={{
          hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
          visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.8, ease: "easeOut" },
          },
        }}
        initial="hidden"
        animate={controls}
      >
        <h2 className="text-4xl lg:text-5xl font-extrabold text-[var(--color-primary-600)] mb-4">
          Who Can Join?
        </h2>
        <p className="text-base lg:text-2xl text-gray-700 leading-relaxed mb-6">
          Whether you’re a beginner, a freelance realtor, or a real estate
          professional, PCRG is your launchpad to success.
          <br />
          If you’re passionate about real estate, ready to learn, and driven to
          succeed — you belong here.
        </p>

        <motion.button
          className="mt-6 px-8 py-3 rounded-md border-2 border-primary-500 text-lg font-semibold text-primary-500 hover:bg-primary-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_var(--color-primary-400)]"
          whileHover={{
            boxShadow: "0 0 25px var(--color-primary-400)",
            scale: 1.05,
            transition: { duration: 0.3 },
          }}
        >
          Get Started
        </motion.button>
      </motion.div>

      {/* Right Image */}
      <motion.div
        className="relative z-10 lg:w-1/2 flex justify-center"
        variants={{
          hidden: { opacity: 0, x: 60, filter: "blur(8px)" },
          visible: {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            transition: { duration: 1, delay: 0.3 },
          },
        }}
        initial="hidden"
        animate={controls}
      >
        <img
          src={joinImg}
          alt="Smiling realtor pointing"
          className="object-contain relative"
        />
      </motion.div>

      {/* Optional Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/10 pointer-events-none"></div>
    </section>
  );
}
