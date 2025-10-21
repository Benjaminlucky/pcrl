import React from "react";
import DeveloperHero from "../../components/DeveloperHero";
import DeveloperTimeline from "../../components/DeveloperTimeline";
import WhatYouGet from "../../components/DeveloperWhatYouGet";
import WhoWeWorkWith from "../../components/DeveloperWhoweWorkwith";
import DeveloperReviews from "../../components/developerReviews";
import PartnerWithUs from "../../components/DeveloperPartnerwithus";

function Developers() {
  return (
    <>
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
