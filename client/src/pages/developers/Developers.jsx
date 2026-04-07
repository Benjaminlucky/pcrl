import React from "react";
import PageSEO from "../../components/PageSEO";
import DeveloperHero from "../../components/DeveloperHero";
import DeveloperTimeline from "../../components/DeveloperTimeline";
import WhatYouGet from "../../components/DeveloperWhatYouGet";
import WhoWeWorkWith from "../../components/DeveloperWhoweWorkwith";
import DeveloperReviews from "../../components/developerReviews";
import PartnerWithUs from "../../components/DeveloperPartnerwithus";

function Developers() {
  return (
    <>
      <PageSEO
        title="For Property Developers"
        description="Partner with PCRG to sell your real estate developments faster. We provide Nigeria's top developers with a 10,000+ strong sales force, strategic marketing, and results-driven property sales support."
        canonical="https://yoursite.com/for-developers"
        ogImage="https://yoursite.com/images/developerHero.webp"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://yoursite.com/for-developers#webpage",
          url: "https://yoursite.com/for-developers",
          name: "For Property Developers | PCRG",
          description:
            "Partner with PCRG's 10,000+ sales force to sell your real estate developments faster across Nigeria.",
          isPartOf: { "@id": "https://yoursite.com/#website" },
          mainEntity: {
            "@type": "Service",
            name: "Real Estate Developer Sales Partnership",
            provider: {
              "@type": "Organization",
              name: "Platinum Cape Realtors Group",
            },
            areaServed: {
              "@type": "Country",
              name: "Nigeria",
            },
            serviceType: "Real Estate Marketing and Sales",
            description:
              "Strategic real estate marketing and sales force for property developers in Nigeria",
          },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://yoursite.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "For Developers",
                item: "https://yoursite.com/for-developers",
              },
            ],
          },
        }}
      />
      <div className="heroSection">
        <DeveloperHero />
      </div>
      <div className="timeLine">
        <DeveloperTimeline />
      </div>
      <div className="whatYouGet">
        <WhatYouGet />
      </div>
      <div className="whoweworkwith">
        <WhoWeWorkWith />
      </div>
      <div className="reviews">
        <DeveloperReviews />
      </div>
      <div className="partnerwithus">
        <PartnerWithUs />
      </div>
    </>
  );
}

export default Developers;
