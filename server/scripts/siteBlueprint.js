// scripts/siteBlueprint.js
// The starting structure of the public website, mirroring what the React
// frontend renders today. Section ids/types MUST match the registry in
// client/src/cms/registry.js.
//
// Section `content` holds only OVERRIDES on top of each component's built-in
// content, so it starts empty: seeding changes nothing visually.

const page = (key, path, title, sections) => ({
  kind: "page",
  key,
  path,
  title,
  data: {
    seo: {},
    sections: sections.map(([id, type, label]) => ({
      id,
      type,
      label,
      visible: true,
      content: {},
      style: {},
    })),
  },
});

export const pages = [
  page("home", "/", "Home", [
    ["hero", "Hero", "Hero banner"],
    ["recognition", "HomeRecognition", "Recognition / awards"],
    ["who-we-are", "HomeWhoWeAre", "Who we are"],
    ["founders-note", "HomeFoundersNote", "Founder's note"],
    ["services", "HomeServices", "Services"],
    ["why-choose", "HomeChoose", "Why choose PCRG"],
    ["reviews", "HomeReviews", "Reviews"],
    ["consultancy", "HomeConsultancy", "Consultancy"],
    ["contact", "HomeContact", "Contact"],
  ]),
  page("for-realtors", "/for-realtors", "For Realtors", [
    ["hero", "RealtorHero", "Hero banner"],
    ["why-join", "RealtorWhyJoin", "Why join PCRG"],
    ["what-you-get", "RealtorWhatYouGet", "What you get"],
    ["who-can-join", "RealtorWhoCanJoin", "Who can join"],
    ["reviews", "RealtorReviews", "Reviews"],
    ["grow", "RealtorGrowWithPCRG", "Grow with PCRG"],
  ]),
  page("for-developers", "/for-developers", "For Developers", [
    ["hero", "DeveloperHero", "Hero banner"],
    ["timeline", "DeveloperTimeline", "Timeline"],
    ["what-you-get", "DeveloperWhatYouGet", "What you get"],
    ["who-we-work-with", "DeveloperWhoWeWorkWith", "Who we work with"],
    ["reviews", "DeveloperReviews", "Reviews"],
    ["partner", "DeveloperPartnerWithUs", "Partner with us"],
  ]),
  page("academy", "/pcrg-training-academy", "PCRG Academy", [
    ["hero", "AcademyHero", "Hero banner"],
    ["mailing-list", "AcademyMailingList", "Mailing list"],
    ["intro", "AcademyIntro", "Intro"],
    ["realtor-network", "RealtorNetwork", "Realtor network"],
    ["gallery", "AcademyGallery", "Gallery"],
    ["benefits", "AcademyBenefits", "Benefits"],
    ["faculty", "AcademyFaculty", "Faculty"],
    ["reviews", "AcademyReview", "Reviews"],
    ["inquiries", "AcademyInquiries", "Inquiries"],
  ]),
  page("blog-and-events", "/blog-and-events", "Blog and Events", [
    ["hero", "EventsHero", "Hero banner"],
    ["news-alert", "EventsNewsAlert", "News alert"],
    ["intro", "EventsIntro", "Intro"],
    ["overview", "EventsOverview", "Overview"],
    ["upcoming-events", "EventsUpcoming", "Upcoming events (from Events)"],
    ["latest-posts", "BlogLatest", "Latest posts (from Blog)"],
    ["spotlight", "EventsSpotlightMoments", "Spotlight moments"],
    ["connect", "EventsConnects", "Connect"],
  ]),
  page("about-us", "/about-us", "About Us", [
    ["hero", "AboutHero", "Hero banner"],
    ["intro", "AboutIntro", "Intro"],
    ["why-choose", "AboutChoose", "Why choose us"],
    ["team", "AboutTeam", "Team"],
    ["partners", "DeveloperWhoWeWorkWith", "Partners"],
  ]),
];

const link = (label, url, variant = "link") => ({
  id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  label,
  url,
  variant,
  visible: true,
  children: [],
});

export const menus = [
  {
    kind: "menu",
    key: "main",
    title: "Main navigation",
    data: {
      items: [
        link("Home", "/"),
        link("For Realtors", "/for-realtors"),
        link("For Developers", "/for-developers"),
        link("PCRG  Academy", "/pcrg-training-academy"),
        link("Blog and Events", "/blog-and-events"),
        link("About us", "/about-us"),
        link("Sign up", "/sign-up", "primary"),
        link("Login", "/login", "outline"),
      ],
    },
  },
  {
    kind: "menu",
    key: "footer",
    title: "Footer quicklinks",
    data: {
      items: [
        link("Home", "/"),
        link("For Realtors", "/for-realtors"),
        link("For Developers", "/for-developers"),
        link("PCRG Training Academy", "/pcrg-training-academy"),
        link("Blog and Events", "/blog-and-events"),
        link("About Us", "/about-us"),
        link("Signup", "/sign-up"),
        link("Login", "/login"),
      ],
    },
  },
];

export const settings = [
  {
    kind: "settings",
    key: "global",
    title: "Global site settings",
    data: {
      brand: {
        name: "Platinum Cape Realtor Group",
        logo: "/images/pcrgLogo.svg",
        logoAlt: "PCRG Logo",
        logoWhite: "/images/pcrgLogowhite.svg",
      },
      footer: {
        tagline: "PCRG is licensed to sell Lands and Houses in Nigeria.",
        quicklinksTitle: "Quicklinks",
        copyright: "All Rights Reserved, Platinum Cape Realtor Group 2025",
        creditPrefix: "Developed by",
        creditName: "InspireMe Media Networks",
      },
      mobileMenuFooter: "Platinum Cape Realtor Group",
    },
  },
];

export const blueprint = [...settings, ...menus, ...pages];
