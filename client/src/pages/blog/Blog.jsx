import React from "react";
import PageSEO from "../../components/PageSEO";
import EventsConnects from "@/components/EventsConnects";
import EventsHero from "@/components/EventsHero";
import EventsIntro from "@/components/EventsIntro";
import EventsNewsAlert from "@/components/EventsNewsAlert";
import EventsOverview from "@/components/EventsOverview";
import EventsSpotlightMoments from "@/components/EventsSpotlightMoments";

function Blog() {
  return (
    <>
      <PageSEO
        title="Blog & Events"
        description="Stay updated with PCRG's latest real estate events, masterclasses, networking brunches and industry news. Learn, connect and grow with Nigeria's leading realtor community."
        canonical="https://pcrginitiative.com/blog-and-events"
        ogImage="https://pcrginitiative.com/images/EventsPosterHero.jpg"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": "https://pcrginitiative.com/blog-and-events#webpage",
          url: "https://pcrginitiative.com/blog-and-events",
          name: "Blog & Events | PCRG",
          description:
            "Latest real estate events, masterclasses, and industry news from Platinum Cape Realtors Group.",
          isPartOf: { "@id": "https://pcrginitiative.com/#website" },
          about: {
            "@type": "Thing",
            name: "Real Estate Events and Training in Nigeria",
          },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://pcrginitiative.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog & Events",
                item: "https://pcrginitiative.com/blog-and-events",
              },
            ],
          },
        }}
      />
      <div className="heroSection">
        <EventsHero />
      </div>
      <div className="newsAlertSection">
        <EventsNewsAlert />
      </div>
      <div className="IntroSection">
        <EventsIntro />
      </div>
      <div className="overviewSection">
        <EventsOverview />
      </div>
      <div className="spotlightSection">
        <EventsSpotlightMoments />
      </div>
      <div className="ConnectSection">
        <EventsConnects />
      </div>
    </>
  );
}

export default Blog;
