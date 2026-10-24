import React from "react";
import CmsPageSEO from "../../cms/CmsPageSEO";
import PageSections from "../../cms/PageSections";
import EventsConnects from "@/components/EventsConnects";
import EventsHero from "@/components/EventsHero";
import EventsIntro from "@/components/EventsIntro";
import EventsNewsAlert from "@/components/EventsNewsAlert";
import EventsOverview from "@/components/EventsOverview";
import EventsSpotlightMoments from "@/components/EventsSpotlightMoments";
import EventsUpcoming from "@/components/EventsUpcoming";
import BlogLatest from "@/components/BlogLatest";

function Blog() {
  return (
    <>
      <CmsPageSEO
        pageKey="blog-and-events"
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
      <PageSections
        pageKey="blog-and-events"
        components={{
          EventsHero,
          EventsNewsAlert,
          EventsIntro,
          EventsOverview,
          EventsUpcoming,
          BlogLatest,
          EventsSpotlightMoments,
          EventsConnects,
        }}
      />
    </>
  );
}

export default Blog;
