import AcademyBenefits from "@/components/AcademyBenefits";
import AcademyFaculty from "@/components/AcademyFaculty";
import AcademyGallery from "@/components/AcademyGallery";
import AcademyHero from "@/components/AcademyHero";
import AcademyInquiries from "@/components/AcademyInquiries";
import AcademyIntro from "@/components/AcademyIntro";
import AcademyMailingList from "@/components/AcademyMailingList";
import AcademyReview from "@/components/AcademyReview";

import RealtorNetwork from "@/components/RealtorNetwork";
import React from "react";

function Academy() {
  return (
    <>
      <div className="heroSection">
        <AcademyHero />
      </div>
      <div className="mailingList">
        <AcademyMailingList />
      </div>
      <div className="academyIntro">
        <AcademyIntro />
      </div>
      <div className="realtorNetwork">
        <RealtorNetwork />
      </div>
      <div className="gallery">
        <AcademyGallery />
      </div>
      <div className="benefits">
        <AcademyBenefits />
      </div>
      <div className="faculty">
        <AcademyFaculty />
      </div>
      <div className="review">
        <AcademyReview />
      </div>
      <div className="inquiries">
        <AcademyInquiries />
      </div>
    </>
  );
}

export default Academy;
