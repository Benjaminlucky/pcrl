import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { topNavLinks } from "../data/data.js";
import { motion, AnimatePresence } from "motion/react";
import { useMenu, useSiteSettings } from "../cms/hooks";

// Built-in links, used whenever the CMS has no published "main" menu.
const DEFAULT_LINKS = topNavLinks.map((link) => ({
  ...link,
  variant:
    link.label === "Sign up"
      ? "primary"
      : link.label === "Login"
      ? "outline"
      : "link",
}));

// Internal routes use the router; external URLs open as normal links.
function MenuLink({ link, ...props }) {
  return link.external || !link.url.startsWith("/") ? (
    <a href={link.url} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} {...props} />
  ) : (
    <Link to={link.url} {...props} />
  );
}

export default function TopNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const cmsLinks = useMenu("main");
  const brand = useSiteSettings()?.brand;
  const settingsFooter = useSiteSettings()?.mobileMenuFooter;
  const links = (cmsLinks || DEFAULT_LINKS).filter((l) => l.visible !== false);

  // Close mobile menu on resize if screen becomes large to prevent UI glitches
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const navVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-gray-100"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20 lg:h-24">
        {/* Logo Section */}
        <Link
          to="/"
          className="flex-shrink-0 transition-transform hover:scale-105"
        >
          <img
            src={brand?.logo || "/images/pcrgLogo.svg"}
            alt={brand?.logoAlt || "PCRG Logo"}
            className="w-40 sm:w-48 xl:w-56 object-contain"
          />
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="text-2xl xl:hidden cursor-pointer text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Navigation (Visible from XL screens upwards) */}
        <ul className="hidden xl:flex items-center gap-1 2xl:gap-4">
          {links.map((link) => {
            const isActive = location.pathname === link.url;

            if (link.variant === "primary") {
              return (
                <li key={link.url} className="ml-2">
                  <MenuLink
                    link={link}
                    className="px-4 py-3 rounded-lg bg-[#E31E24] text-white font-bold hover:bg-red-700 transition-all shadow-md active:scale-95"
                  >
                    {link.label}
                  </MenuLink>
                </li>
              );
            }

            if (link.variant === "outline") {
              return (
                <li key={link.url} className="ml-1">
                  <MenuLink
                    link={link}
                    className="px-4 py-3 rounded-lg border-2 border-[#E31E24] text-[#E31E24] font-bold hover:bg-[#E31E24] hover:text-white transition-all active:scale-95"
                  >
                    {link.label}
                  </MenuLink>
                </li>
              );
            }

            return (
              <li key={link.url}>
                <MenuLink
                  link={link}
                  className={`px-3 py-2 text-sm 2xl:text-[16px] font-semibold transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-[#E31E24]"
                      : "text-gray-600 hover:text-[#E31E24]"
                  }`}
                >
                  {link.label}
                </MenuLink>
              </li>
            );
          })}
        </ul>

        {/* Mobile Overlay & Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Background Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm xl:hidden"
                style={{ top: "40px" }} // Starts below the header
              />

              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed top-20 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl xl:hidden flex flex-col z-50 overflow-y-auto"
              >
                <ul className="flex flex-col p-6 gap-2">
                  {links.map((link) => {
                    const isActive = location.pathname === link.url;

                    return (
                      <li key={link.url}>
                        <MenuLink
                          link={link}
                          onClick={() => setIsOpen(false)}
                          className={`block p-4 text-lg font-bold rounded-xl transition-all ${
                            link.variant === "primary"
                              ? "mt-4 bg-[#E31E24] text-white text-center shadow-lg"
                              : link.variant === "outline"
                              ? "mt-2 border-2 border-[#E31E24] text-[#E31E24] text-center"
                              : isActive
                              ? "text-[#E31E24] bg-red-50"
                              : "text-gray-800 hover:bg-gray-50"
                          }`}
                        >
                          {link.label}
                        </MenuLink>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-auto p-8 text-center text-gray-400 text-sm italic">
                  {settingsFooter || "Platinum Cape Realtor Group"}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
