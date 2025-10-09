import React from "react";
import { awards } from "../data/data.js";
import SectionTitle from "./SectionTitle.jsx";

function HomeRecognition() {
  // Define base and hover background colors
  const bgColors = [
    { base: "bg-black-800", hover: "hover:bg-black-700" },
    { base: "bg-black-700", hover: "hover:bg-black-600" },
    { base: "bg-black-600", hover: "hover:bg-black-500" },
    { base: "bg-black-500", hover: "hover:bg-black-400" },
    { base: "bg-black-400", hover: "hover:bg-black-300" },
  ];

  return (
    <div className="recognitionWrapper w-full bg-white flex justify-center items-center py-28">
      <div className="recognition container mx-auto flex flex-col md:flex-row justify-center items-center gap-10">
        <div className="recognitionContent w-full flex flex-col justify-center items-center gap-10">
          <SectionTitle text="Recognized for" />
          <div className="awards w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 py-8">
            {awards.map((award, index) => {
              // Cycle through colors
              const { base, hover } = bgColors[index % bgColors.length];

              return (
                <div
                  key={index}
                  className={`awardItem flex flex-col justify-center items-center text-center p-8  shadow-sm hover:shadow-xl transition-all duration-500 ease-in-out transform hover:-translate-y-2 ${base} ${hover}`}
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeRecognition;
