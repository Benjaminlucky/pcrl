import React from "react";
import RealtorHero from "../../components/RealtorHero";
import RealtorWhyjoinpcrg from "../../components/RealtorWhyjoinpcrg";
import RealtorWhatYouGet from "../../components/RealtorWhatYouGet";
import RealtorWhocanjoin from "../../components/RealtorWhocanjoin";
import RealtorReviews from "../../components/RealtorReviews";

function Realtor() {
  return (
    <>
      <div className="heroSection">
        <RealtorHero />
      </div>
      <div className="whyJoinsection">
        <RealtorWhyjoinpcrg />
      </div>
      <div className="whatyougetSection">
        <RealtorWhatYouGet />
      </div>
      <div className="whocanjoinSection ">
        <RealtorWhocanjoin />
      </div>
      <div className="realtorReviewsSection">
        <RealtorReviews />
      </div>
    </>
  );
}

export default Realtor;
