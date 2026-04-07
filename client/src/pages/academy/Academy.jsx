import React from "react";
import PageSEO from "../../components/PageSEO";
import AcademyBenefits from "@/components/AcademyBenefits";
import AcademyFaculty from "@/components/AcademyFaculty";
import AcademyGallery from "@/components/AcademyGallery";
import AcademyHero from "@/components/AcademyHero";
import AcademyInquiries from "@/components/AcademyInquiries";
import AcademyIntro from "@/components/AcademyIntro";
import AcademyMailingList from "@/components/AcademyMailingList";
import AcademyReview from "@/components/AcademyReview";
import RealtorNetwork from "@/components/RealtorNetwork";

function Academy() {
  return (
    <>
      <PageSEO
        title="PCRG Training & Academy"
        description="Join Africa's leading professional real estate training program. PCRG Academy offers UK-certified courses, mentorship from industry experts, and access to a network of 10,000+ realtors across Nigeria."
        canonical="https://yoursite.com/pcrg-training-academy"
        ogImage="https://yoursite.com/images/academyPosterHero.jpg"
        schema={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "@id": "https://yoursite.com/pcrg-training-academy#organization",
          name: "PCRG Training & Academy",
          url: "https://yoursite.com/pcrg-training-academy",
          description:
            "Africa's leading professional real estate training program offering UK-certified courses and mentorship.",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Lagos",
            addressCountry: "NG",
          },
          parentOrganization: {
            "@type": "Organization",
            name: "Platinum Cape Realtors Group",
            url: "https://yoursite.com",
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Real Estate Training Programs",
            itemListElement: [
              {
                "@type": "Course",
                name: "Professional Realtor Certification",
                description:
                  "Comprehensive real estate training covering property sales, client management, digital marketing and Nigerian real estate law.",
                provider: {
                  "@type": "Organization",
                  name: "PCRG Training & Academy",
                },
                courseMode: "blended",
                inLanguage: "en",
                offers: {
                  "@type": "Offer",
                  category: "Real Estate Training",
                },
              },
            ],
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
                name: "PCRG Academy",
                item: "https://yoursite.com/pcrg-training-academy",
              },
            ],
          },
        }}
      />
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
      <div id="faculty" className="faculty">
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
