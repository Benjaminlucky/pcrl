import React from "react";
import PageSEO from "../../components/PageSEO";
import RealtorHero from "../../components/RealtorHero";
import RealtorWhyjoinpcrg from "../../components/RealtorWhyjoinpcrg";
import RealtorWhatYouGet from "../../components/RealtorWhatYouGet";
import RealtorWhocanjoin from "../../components/RealtorWhocanjoin";
import RealtorReviews from "../../components/RealtorReviews";
import RealtorGrowWithPCRG from "../../components/RealtorGrowWithPCRG";

function Realtor() {
  return (
    <>
      <PageSEO
        title="Join Our Realtors Network"
        description="Join Nigeria's fastest-growing realtors network with PCRG. Get access to UK-certified training, exclusive listings, mentorship, and earn competitive commissions as a professional realtor in Nigeria."
        canonical="https://pcrginitiative.com/for-realtors"
        ogImage="https://pcrginitiative.com/images/realtorPageModel.png"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://pcrginitiative.com/for-realtors#webpage",
          url: "https://pcrginitiative.com/for-realtors",
          name: "Join Our Realtors Network | PCRG",
          description:
            "Join Nigeria's fastest-growing realtors network. Get training, mentorship, exclusive listings and competitive commissions.",
          isPartOf: { "@id": "https://pcrginitiative.com/#website" },
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
                name: "For Realtors",
                item: "https://pcrginitiative.com/for-realtors",
              },
            ],
          },
        }}
      />
      <div className="heroSection">
        <RealtorHero />
      </div>
      <div className="whyJoinsection">
        <RealtorWhyjoinpcrg />
      </div>
      <div className="whatyougetSection">
        <RealtorWhatYouGet />
      </div>
      <div className="whocanjoinSection">
        <RealtorWhocanjoin />
      </div>
      <div className="realtorReviewsSection">
        <RealtorReviews />
      </div>
      <div className="growWithus">
        <RealtorGrowWithPCRG />
      </div>
    </>
  );
}

export default Realtor;
