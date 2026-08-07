import React from "react";
import PageSEO from "../../components/PageSEO";
import AboutChoose from "@/components/AboutChoose";
import AboutHero from "@/components/AboutHero";
import AboutIntro from "@/components/AboutIntro";
import AboutTeam from "@/components/AboutTeam";
import WhoWeWorkWith from "@/components/DeveloperWhoweWorkwith";

function About() {
  return (
    <>
      <PageSEO
        title="About Us"
        description="Learn about Platinum Cape Realtors Group (PCRG) — Africa's fastest-growing real estate brokerage. Built on integrity, innovation and excellence with over 10,000 realtors across Nigeria."
        canonical="https://pcrginitiative.com/about-us"
        ogImage="https://pcrginitiative.com/images/PCRG-Team.jpg"
        schema={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "@id": "https://pcrginitiative.com/about-us#webpage",
          url: "https://pcrginitiative.com/about-us",
          name: "About PCRG | Platinum Cape Realtors Group",
          description:
            "Africa's fastest-growing real estate brokerage firm built on integrity, innovation and excellence.",
          isPartOf: { "@id": "https://pcrginitiative.com/#website" },
          about: {
            "@type": "Organization",
            name: "Platinum Cape Realtors Group",
            foundingDate: "2021",
            foundingLocation: "Lagos, Nigeria",
            numberOfEmployees: {
              "@type": "QuantitativeValue",
              minValue: 10000,
            },
            description:
              "A thriving real estate marketing company headquartered in Lagos, Nigeria with a network of over 10,000 realtors.",
          },
        }}
      />
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
