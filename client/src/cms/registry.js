// src/cms/registry.js
// The built-in layout of every CMS-managed page: which sections exist, in
// what order, and the wrapper markup each one had before the CMS existed.
// MUST stay in sync with server/scripts/siteBlueprint.js (same ids/types).
//
// Metadata only — no component imports here, so per-page code splitting is
// preserved. Each page passes its own { type: Component } map to
// <PageSections>.

export const PAGE_KEY_BY_PATH = {
  "/": "home",
  "/for-realtors": "for-realtors",
  "/for-developers": "for-developers",
  "/pcrg-training-academy": "academy",
  "/blog-and-events": "blog-and-events",
  "/about-us": "about-us",
};

const s = (id, type, className, wrapperId) => ({ id, type, className, wrapperId });

export const PAGE_SECTIONS = {
  home: [
    s("hero", "Hero", "heroSection"),
    s("recognition", "HomeRecognition", "recognitionSection"),
    s("who-we-are", "HomeWhoWeAre", "whoWeAre"),
    s("founders-note", "HomeFoundersNote", "foundersNoteSection"),
    s("services", "HomeServices", "homeServicesSection"),
    s("why-choose", "HomeChoose", "homeChooseSection"),
    s("reviews", "HomeReviews", "homeReviewSection"),
    s("consultancy", "HomeConsultancy", "homeConsultancySection"),
    s("contact", "HomeContact", "homeContactSection"),
  ],
  "for-realtors": [
    s("hero", "RealtorHero", "heroSection"),
    s("why-join", "RealtorWhyJoin", "whyJoinsection"),
    s("what-you-get", "RealtorWhatYouGet", "whatyougetSection"),
    s("who-can-join", "RealtorWhoCanJoin", "whocanjoinSection"),
    s("reviews", "RealtorReviews", "realtorReviewsSection"),
    s("grow", "RealtorGrowWithPCRG", "growWithus"),
  ],
  "for-developers": [
    s("hero", "DeveloperHero", "heroSection"),
    s("timeline", "DeveloperTimeline", "timeLine"),
    s("what-you-get", "DeveloperWhatYouGet", "whatYouGet"),
    s("who-we-work-with", "DeveloperWhoWeWorkWith", "whoweworkwith"),
    s("reviews", "DeveloperReviews", "reviews"),
    s("partner", "DeveloperPartnerWithUs", "partnerwithus"),
  ],
  academy: [
    s("hero", "AcademyHero", "heroSection"),
    s("mailing-list", "AcademyMailingList", "mailingList"),
    s("intro", "AcademyIntro", "academyIntro"),
    s("realtor-network", "RealtorNetwork", "realtorNetwork"),
    s("gallery", "AcademyGallery", "gallery"),
    s("benefits", "AcademyBenefits", "benefits"),
    s("faculty", "AcademyFaculty", "faculty", "faculty"),
    s("reviews", "AcademyReview", "review"),
    s("inquiries", "AcademyInquiries", "inquiries"),
  ],
  "blog-and-events": [
    s("hero", "EventsHero", "heroSection"),
    s("news-alert", "EventsNewsAlert", "newsAlertSection"),
    s("intro", "EventsIntro", "IntroSection"),
    s("overview", "EventsOverview", "overviewSection"),
    // Lists from the Blog/Events collections; render nothing until something
    // is published, so the page looks unchanged until then.
    s("upcoming-events", "EventsUpcoming", "upcomingEventsSection"),
    s("latest-posts", "BlogLatest", "latestPostsSection"),
    s("spotlight", "EventsSpotlightMoments", "spotlightSection"),
    s("connect", "EventsConnects", "ConnectSection"),
  ],
  "about-us": [
    s("hero", "AboutHero", "heroSection"),
    s("intro", "AboutIntro", "introSection"),
    s("why-choose", "AboutChoose", "choose"),
    s("team", "AboutTeam", "team"),
    s("partners", "DeveloperWhoWeWorkWith", "partners"),
  ],
};
