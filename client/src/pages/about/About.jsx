import AboutChoose from "@/components/AboutChoose";
import AboutHero from "@/components/AboutHero";
import AboutIntro from "@/components/AboutIntro";
import AboutTeam from "@/components/AboutTeam";
import WhoWeWorkWith from "@/components/DeveloperWhoweWorkwith";
import React from "react";

function About() {
  return (
    <>
      <div className="heroSection">
        <AboutHero />
      </div>
      <div className="introSection">
        <AboutIntro />
      </div>
      <div className="choose">
        <AboutChoose />
      </div>
      <div className="team">
        <AboutTeam />
      </div>
      <div className="partners">
        <WhoWeWorkWith />
      </div>
    </>
  );
}

export default About;
