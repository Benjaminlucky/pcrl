import React from "react";
import SectionTitle from "./SectionTitle";
import { MdOutlineCheckCircle } from "react-icons/md";
import { impact } from "../data/data.js";

function HomeWhoWeAre() {
  return (
    <div className="aboutWrapper w-full bg-white py-12 md:py-20">
      <div className="aboutContent container mx-auto px-6 md:px-0">
        <div className="about flex flex-col md:flex-row justify-between items-start gap-12">
          {/* LEFT SECTION */}
          <div className="left bg-primary-900 rounded-md p-8 md:p-16 min-h-[600px] md:w-1/2">
            <div className="leftContent flex flex-col gap-6">
              <SectionTitle
                text="Who We Are"
                textClass="!text-white tracking-wide"
                underlineClass="!bg-gray-400 !w-[12%] h-[3px]"
              />
              <p className="text-gray-300 leading-[1.988] text-justify text-[1.125rem] md:text-[1.25rem] hyphens-auto">
                Platinum Cape Realtors Group (PCRG) is a thriving real estate
                marketing company headquartered in Lagos, Nigeria. In just three
                years, we have built a network of over 10,000 realtors, serving
                both local and international investors with excellence,
                integrity, and professionalism. Our dedication to redefining
                standards in real estate makes us a trusted partner for
                investors seeking value and growth.
              </p>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="right md:w-1/2 flex flex-col gap-10">
            <div className="top">
              <SectionTitle
                text="Our Vision"
                textClass="text-gray-900 tracking-wide"
                underlineClass="bg-primary-500 !w-[12%] h-[3px]"
              />
              <p className="text-gray-700 leading-relaxed text-justify text-[1rem] md:text-[1.1rem] mt-6 hyphens-auto">
                To redefine the standards of excellence in Nigeria’s real estate
                industry and create value that benefits clients, realtors,
                developers, and the economy at large. We aim to build a
                sustainable system where innovation, transparency, and
                partnership thrive.
              </p>
            </div>

            <div className="bottom">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Our Impact
              </h3>
              <span className="text-gray-600 block mb-5">
                In three years, PCRG has:
              </span>
              <div className="impacts flex flex-col gap-4">
                {impact.map((item, index) => (
                  <div
                    className="impact flex items-center gap-3 text-gray-700"
                    key={index}
                  >
                    <MdOutlineCheckCircle className="icon text-red-600 text-[1.5rem] md:text-[1.75rem] flex-shrink-0" />
                    <p className="text-[1rem] md:text-[1.05rem] leading-relaxed text-justify">
                      {item.item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeWhoWeAre;
