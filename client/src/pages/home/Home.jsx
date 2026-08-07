import React from "react";
import PageSEO from "../../components/PageSEO";
import Hero from "../../components/Hero";
import HomeRecognition from "../../components/HomeRecognition";
import HomeWhoWeAre from "../../components/HomeWhoWeAre";
import HomefoundersNote from "../../components/HomefoundersNote";
import HomeServices from "../../components/HomeServices";
import HomeChoose from "../../components/HomeChoose";
import Homereviews from "../../components/Homereviews";
import HomeConsultancy from "../../components/Homeconsultancy";
import HomeContact from "../../components/HomeContact";

function Home() {
  return (
    <div className="home">
      <PageSEO
        title="Home"
        description="Platinum Cape Realtors Group (PCRG) is Nigeria's premier real estate marketing company — connecting buyers, developers and 10,000+ realtors to profitable property opportunities across Nigeria."
        canonical="https://pcrginitiative.com"
        ogImage="https://pcrginitiative.com/images/homeHero.jpg"
        schema={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://pcrginitiative.com/#organization",
              name: "Platinum Cape Realtors Group",
              alternateName: "PCRG",
              url: "https://pcrginitiative.com",
              logo: {
                "@type": "ImageObject",
                url: "https://pcrginitiative.com/images/pcrgLogo.svg",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+234-812-632-6511",
                contactType: "customer service",
                areaServed: "NG",
                availableLanguage: "English",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Lagos",
                addressCountry: "NG",
              },
            },
            {
              "@type": "WebSite",
              "@id": "https://pcrginitiative.com/#website",
              name: "Platinum Cape Realtors Group",
              url: "https://pcrginitiative.com",
            },
            {
              "@type": "WebPage",
              "@id": "https://pcrginitiative.com/#webpage",
              url: "https://pcrginitiative.com",
              name: "Platinum Cape Realtors Group | Excellence in Real Estate, Beyond Borders",
              description:
                "Nigeria's premier real estate marketing company connecting buyers, developers and realtors to profitable property opportunities.",
              isPartOf: { "@id": "https://pcrginitiative.com/#website" },
              about: { "@id": "https://pcrginitiative.com/#organization" },
            },
          ],
        }}
      />
      <div className="homewrapper">
        <div className="heroSection">
          <Hero />
        </div>
        <div className="recognitionSection">
          <HomeRecognition />
        </div>
        <div className="whoWeAre">
          <HomeWhoWeAre />
        </div>
        <div className="foundersNoteSection">
          <HomefoundersNote />
        </div>
        <div className="homeServicesSection">
          <HomeServices />
        </div>
        <div className="homeChooseSection">
          <HomeChoose />
        </div>
        <div className="homeReviewSection">
          <Homereviews />
        </div>
        <div className="homeConsultancySection">
          <HomeConsultancy />
        </div>
        <div className="homeContactSection">
          <HomeContact />
        </div>
      </div>
    </div>
  );
}

export default Home;
