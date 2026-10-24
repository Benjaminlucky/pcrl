import React from "react";
import CmsPageSEO from "../../cms/CmsPageSEO";
import PageSections from "../../cms/PageSections";
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
      <CmsPageSEO
        pageKey="home"
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
        <PageSections
          pageKey="home"
          components={{
            Hero,
            HomeRecognition,
            HomeWhoWeAre,
            HomeFoundersNote: HomefoundersNote,
            HomeServices,
            HomeChoose,
            HomeReviews: Homereviews,
            HomeConsultancy,
            HomeContact,
          }}
        />
      </div>
    </div>
  );
}

export default Home;
