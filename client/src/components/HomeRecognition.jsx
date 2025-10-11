"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { awards } from "../data/data.js";
import SectionTitle from "./SectionTitle.jsx";

function HomeRecognition() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Define base and hover background colors
  const bgColors = [
    { base: "bg-black-800", hover: "hover:bg-black-700" },
    { base: "bg-black-700", hover: "hover:bg-black-600" },
    { base: "bg-black-600", hover: "hover:bg-black-500" },
    { base: "bg-black-500", hover: "hover:bg-black-400" },
    { base: "bg-black-400", hover: "hover:bg-black-300" },
  ];

  return (
    <div
      ref={ref}
      className="recognitionWrapper w-full bg-white flex justify-center items-center py-28"
    >
      <div className="recognition container mx-auto flex flex-col md:flex-row justify-center items-center gap-10">
        <div className="recognitionContent text-center w-full flex flex-col justify-center items-center gap-10">
          <div className="center">
            <SectionTitle
              text="Recognized for"
              textClass="!text-gray-900 tracking-wide "
              underlineClass="!bg-primary-500 !w-[20%] !h-[3px]"
            />
          </div>

          <div className="awards w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 py-8">
            {awards.map((award, index) => {
              const { base, hover } = bgColors[index % bgColors.length];
              return (
                <motion.div
                  key={index}
                  className={`awardItem flex flex-col justify-center items-center text-center p-8 shadow-sm hover:shadow-xl transition-all duration-500 ease-in-out transform hover:-translate-y-2 ${base} ${hover}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2,
                    ease: "easeOut",
                  }}
                >
                  <div className="awardContent flex flex-col justify-center items-center gap-2">
                    <div className="icon text-7xl text-primary-500 mb-2">
                      {React.createElement(award.icon)}
                    </div>
                    <p className="font-semibold text-2xl text-white">
                      {award.title}
                    </p>
                    <span className="text-lg text-gray-300">
                      {award.description}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeRecognition;
