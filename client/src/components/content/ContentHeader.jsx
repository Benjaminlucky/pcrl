// Dark page header for the Blog/Events pages.
import React from "react";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

export default function ContentHeader({ eyebrow, title, subtitle, children }) {
  return (
    <section className="relative w-full bg-black text-white pt-20 pb-16 md:pt-28 md:pb-20 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 30% 20%, rgba(236,28,36,0.25) 0%, transparent 60%)",
        }}
      />
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative container mx-auto px-6 max-w-4xl"
      >
        {eyebrow && (
          <span className="block text-primary-500 font-semibold uppercase tracking-widest text-sm mb-3">
            {eyebrow}
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">{title}</h1>
        {subtitle && <p className="mt-4 text-gray-300 text-lg leading-relaxed">{subtitle}</p>}
        {children}
      </MotionDiv>
    </section>
  );
}
