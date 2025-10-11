import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#010909] text-gray-300 pt-16 pb-6 px-6 md:px-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        {/* Left Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/images/pcrgLogowhite.svg"
              alt="PCRG Logo"
              className="w-64 text-white object-contain"
            />
          </div>
          <p className="text-md max-w-md mt-2 text-gray-400">
            PCRG is licensed to sell Lands and Houses in Nigeria.
          </p>
        </div>

        {/* Right Section */}
        <div className="md:text-left">
          <h3 className="text-lg font-semibold text-white mb-4">Quicklinks</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#" className="hover:text-red-500 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500 transition">
                For Realtors
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500 transition">
                For Developers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500 transition">
                PCRG Training Academy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500 transition">
                Blog and Events
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500 transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500 transition">
                Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500 transition">
                Signup
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500 transition">
                Login
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-red-600 my-6"></div>

      {/* Bottom Text */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <p>All Rights Reserved, Platinum Cape Realtor Group 2025</p>
        <p className="mt-3 md:mt-0">
          Developed by{" "}
          <span className="text-red-500 font-medium">
            InspireMe Media Networks
          </span>
        </p>
      </div>
    </footer>
  );
}
