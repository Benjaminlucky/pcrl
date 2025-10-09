import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { topNavLinks } from "../data/data.js";
import { motion, AnimatePresence } from "motion/react";

export default function TopNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 bg-white py-1 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-white/90 shadow-md"
          : "bg-transparent backdrop-blur-none"
      }`}
    >
      <div className="max-w-10/12 mx-auto px-4  lg:px-2 flex justify-between items-center h-24">
        {/* Logo */}
        <Link to="/" className="flex items-center  gap-2">
          <img
            src="/images/pcrgLogo.svg"
            alt="PCRG Logo"
            className="w-44 sm:w-48 lg:w-50  object-contain"
          />
        </Link>

        {/* Mobile Menu Icon */}
        <button
          className="text-2xl lg:hidden cursor-pointer text-primary-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center space-x-4 xl:space-x-8">
          {topNavLinks.map((link) => {
            const isActive = location.pathname === link.url;

            if (link.label === "Sign up") {
              return (
                <li key={link.url}>
                  <Link
                    to={link.url}
                    className="px-5 py-2 rounded-md bg-primary-500 text-white font-medium hover:bg-primary-600 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              );
            }

            if (link.label === "Login") {
              return (
                <li key={link.url}>
                  <Link
                    to={link.url}
                    className="px-5 py-2 rounded-md border border-primary-500 text-primary-500 font-medium hover:bg-primary-500 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              );
            }

            return (
              <li key={link.url}>
                <Link
                  to={link.url}
                  className={`text-gray-800 hover:text-primary-500 transition font-medium ${
                    isActive ? "text-primary-500 font-semibold" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              key="mobile-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: "easeOut" },
              }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
              className="absolute top-20 left-0 w-full bg-white shadow-xl flex flex-col text-center overflow-hidden border-t border-gray-200"
            >
              {topNavLinks.map((link, index) => {
                const isActive = location.pathname === link.url;

                let baseClass =
                  "block py-4 border-b border-gray-100 text-gray-800 transition hover:bg-primary-200";

                if (link.label === "Sign up") {
                  baseClass =
                    "block py-4 bg-primary-500 text-white font-semibold hover:bg-primary-600 transition";
                } else if (link.label === "Login") {
                  baseClass =
                    "block py-4 border border-primary-500 text-primary-500 font-medium hover:bg-primary-50 transition";
                }

                return (
                  <motion.li
                    key={link.url}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.05 * index, duration: 0.3 },
                    }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={() => setIsOpen(false)}
                  >
                    <Link
                      to={link.url}
                      className={`${baseClass} ${
                        isActive ? "bg-gray-50 text-primary-600" : ""
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
