import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionTitle from "./SectionTitle"; // your existing title component

const timelineData = [
  {
    title: "We Move Properties Fast.",
    text: "From launch to sold-out, our realtors are trained to turn listings into results.",
  },
  {
    title: "Targeted Marketing That Works.",
    text: "We know what sells — and we’ll position your development right in front of the buyers who matter.",
  },
  {
    title: "We Speak Developer’s Language Fluently.",
    text: "We also offer advisory services to help boost the sales of your properties. ROI. Conversion. Value. Appreciation. Partner with us to turn your projects into thriving, high-performing investments.",
  },
  {
    title: "Your Sales Extension.",
    text: "Think of us as your in-house sales team — minus the overhead, plus the firepower.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: "easeOut" },
  },
};

const DeveloperTimeline = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // 🎥 Cinematic parallax effect (deeper + slower)
  // Background moves slower than scroll to create layered depth
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-36 bg-gray-50"
    >
      {/* Parallax Background */}
      <motion.div
        style={{
          y,
          backgroundImage: "url('/images/developerPageTimelineBg.jpeg')",
        }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 scale-110"
      ></motion.div>

      {/* Cinematic Overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-black/30 to-black/80 mix-blend-multiply"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center center mx-auto mb-20">
          <div className="text-center center mb-20">
            <SectionTitle
              text={
                <>
                  Why Partner with <span className="text-red-600">PCRG?</span>
                </>
              }
              textClass="text-3xl md:text-4xl font-bold text-white tracking-tight"
              underlineClass="!bg-red-600 h-[3px] !w-15 rounded-full"
            />
          </div>
        </div>

        {/* Timeline Section */}
        <div className="relative">
          {/* Animated vertical line */}
          <motion.div
            className="absolute left-1/2 top-0 w-[3px] bg-gradient-to-b from-red-500 via-red-400 to-transparent h-full rounded-full"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />

          <div className="flex flex-col space-y-28">
            {timelineData.map((item, i) => {
              const [ref, inView] = useInView({
                triggerOnce: true,
                threshold: 0.2,
              });
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  ref={ref}
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isLeft ? "md:justify-start" : "md:justify-end"
                  }`}
                >
                  {/* Connector Dot */}
                  <motion.div
                    className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-red-600 rounded-full z-10 shadow-md"
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
                  />

                  {/* Timeline Card */}
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      rotateX: 2,
                      rotateY: -2,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`bg-white/90 backdrop-blur-md rounded-2xl shadow-md p-8 w-full md:w-5/12 relative z-20 border border-white/30 ${
                      isLeft
                        ? "md:ml-[calc(50%-1.5rem)]"
                        : "md:mr-[calc(50%-1.5rem)]"
                    }`}
                  >
                    <h3 className="text-xl font-semibold text-red-600 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-800 leading-relaxed">{item.text}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperTimeline;
