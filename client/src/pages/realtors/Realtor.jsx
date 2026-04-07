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
        canonical="https://yoursite.com/for-realtors"
        ogImage="https://yoursite.com/images/realtorPageModel.png"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://yoursite.com/for-realtors#webpage",
          url: "https://yoursite.com/for-realtors",
          name: "Join Our Realtors Network | PCRG",
          description:
            "Join Nigeria's fastest-growing realtors network. Get training, mentorship, exclusive listings and competitive commissions.",
          isPartOf: { "@id": "https://yoursite.com/#website" },
          mainEntity: {
            "@type": "EmployerAggregateRating",
            itemReviewed: {
              "@type": "Organization",
              name: "Platinum Cape Realtors Group",
            },
            ratingValue: "4.8",
            bestRating: "5",
            ratingCount: "500",
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
                name: "For Realtors",
                item: "https://yoursite.com/for-realtors",
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
