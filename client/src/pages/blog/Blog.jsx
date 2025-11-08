import EventsConnects from "@/components/EventsConnects";
import EventsHero from "@/components/EventsHero";
import EventsIntro from "@/components/EventsIntro";
import EventsNewsAlert from "@/components/EventsNewsAlert";
import EventsOverview from "@/components/EventsOverview";
import EventsSpotlightMoments from "@/components/EventsSpotlightMoments";
import React from "react";

function Blog() {
  return (
    <>
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
