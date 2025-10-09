import React from "react";
import { motion } from "framer-motion";

export default function SectionTitle({
  text,
  textClass = "",
  underlineClass = "",
}) {
  return (
    <motion.div
      className="title"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.4 }}
    >
      <motion.h2
        className={`base-title ${textClass}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {text}
      </motion.h2>

      {/* Animated underline */}
      <motion.div
        className={`base-underline ${underlineClass}`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      />
    </motion.div>
  );
}
