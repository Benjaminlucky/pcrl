import React from "react";
import { useMenu, useSiteSettings } from "../cms/hooks";

const SITE_URL = "https://pcrginitiative.com";

// Built-in quicklinks, used whenever the CMS has no published "footer" menu.
const DEFAULT_LINKS = [
  { label: "Home", url: "/" },
  { label: "For Realtors", url: "/for-realtors" },
  { label: "For Developers", url: "/for-developers" },
  { label: "PCRG Training Academy", url: "/pcrg-training-academy" },
  { label: "Blog and Events", url: "/blog-and-events" },
  { label: "About Us", url: "/about-us" },
  { label: "Signup", url: "/sign-up" },
  { label: "Login", url: "/login" },
];

const DEFAULT_TEXT = {
  logoWhite: "/images/pcrgLogowhite.svg",
  tagline: "PCRG is licensed to sell Lands and Houses in Nigeria.",
  quicklinksTitle: "Quicklinks",
  copyright: "All Rights Reserved, Platinum Cape Realtor Group 2025",
  creditPrefix: "Developed by",
  creditName: "InspireMe Media Networks",
};

export default function Footer() {
  const settings = useSiteSettings();
  const links = (useMenu("footer") || DEFAULT_LINKS).filter((l) => l.visible !== false);
  const text = {
    ...DEFAULT_TEXT,
    ...(settings?.brand?.logoWhite ? { logoWhite: settings.brand.logoWhite } : {}),
    ...Object.fromEntries(
      Object.entries(settings?.footer || {}).filter(([, v]) => typeof v === "string" && v),
    ),
  };

  return (
    <footer className="relative bg-[#010909] text-gray-300 pt-16 pb-6 px-6 md:px-16 z-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        {/* Left Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src={text.logoWhite}
              alt="PCRG Logo"
              className="w-64 text-white object-contain"
            />
          </div>
          <p className="text-md max-w-md mt-2 text-gray-400">
            {text.tagline}
          </p>
        </div>

        {/* Right Section */}
        <div className="md:text-left">
          <h3 className="text-lg font-semibold text-white mb-4">
            {text.quicklinksTitle}
          </h3>
          <ul className="space-y-2 text-gray-400">
            {links.map((link) => (
              <li key={link.id || link.url} className="relative z-10">
                <a
                  href={link.url.startsWith("/") ? `${SITE_URL}${link.url}` : link.url}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="hover:text-red-500 transition inline-block py-1 cursor-pointer touch-manipulation"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-red-600 my-6"></div>

      {/* Bottom Text */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <p>{text.copyright}</p>
        <p className="mt-3 md:mt-0">
          {text.creditPrefix}{" "}
          <span className="text-red-500 font-medium">{text.creditName}</span>
        </p>
      </div>
    </footer>
  );
}
