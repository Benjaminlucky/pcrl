import React from "react";
import { motion } from "framer-motion";

export default function SectionTitle({
  text,
  textClass = "",
  underlineClass = "",
}) {
  return (
    <motion.div
      className="title text-left w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h2
        className={`base-title ${textClass}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {text}
      </motion.h2>

      {/* Underline animates left to right always */}
      <motion.div
        className="flex justify-start mt-2"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
      >
        <div className={`base-underline ${underlineClass}`} />
      </motion.div>
    </motion.div>
  );
}
