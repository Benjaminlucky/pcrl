import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SectionTitle from "./SectionTitle";
import { useSection } from "../cms/hooks";
import { ACADEMY_BENEFITS } from "../cms/defaults/academy";

const RealtorPremiumBenefits = () => {
  const c = useSection(ACADEMY_BENEFITS);
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-20 md:py-28"
      style={{
        backgroundImage: `url("${encodeURI(c.backgroundImage)}")`,
      }}
    >
      {/* Soft white overlay for text clarity */}
      <div className="absolute inset-0 bg-white/90 md:bg-white/70"></div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left side space for background composition */}
        <div className="hidden md:block md:w-1/2"></div>

        {/* Right content area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 text-center md:text-left"
        >
          {/* Title using SectionTitle */}
          <SectionTitle
            text={c.title}
            textClass="!text-gray-900 !font-extrabold text-3xl md:text-4xl leading-snug"
            underlineClass="!bg-[var(--color-primary-500)] !w-[20%] !h-[3px]"
          />

          <p className="text-gray-700 mt-6 mb-10 max-w-lg mx-auto md:mx-0">
            {c.intro}
          </p>

          {/* Feature blocks */}
          <div className="space-y-8 mb-12">
            {c.benefits.map((benefit, i) => (
              <div key={i}>
                <h3 className="text-xl font-semibold text-[var(--color-primary-500)] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Animated Red Glowing Button */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0px rgba(255,0,0,0.3)",
                "0 0 25px rgba(255,0,0,0.7)",
                "0 0 0px rgba(255,0,0,0.3)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 40px 10px rgba(255,0,0,0.7)",
            }}
            className="rounded-md !w-fit mx-auto md:mx-0 mt-8 overflow-hidden"
          >
            <Link
              to={c.button?.url || "/sign-up"}
              className="px-8 py-3 border border-[var(--color-primary-500)] text-[var(--color-primary-500)] rounded-md font-semibold hover:bg-[var(--color-primary-500)] hover:text-white transition duration-300 block"
            >
              {c.button?.label}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default RealtorPremiumBenefits;
