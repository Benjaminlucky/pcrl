// src/cms/builtInSchemas.js
// Editable fields for every built-in section of the website (see
// schemas.js for the field kinds). `defaults` is the content built into the
// component; only fields an editor changes are stored.
import { ICON_OPTIONS } from "./iconOptions";
import { WHY_CHOOSE, PARTNERS } from "./defaults/shared";
import * as home from "./defaults/home";
import * as realtors from "./defaults/realtors";
import * as developers from "./defaults/developers";
import * as academy from "./defaults/academy";
import * as events from "./defaults/events";
import * as about from "./defaults/about";

// ---- field helpers ----------------------------------------------------------
const HIGHLIGHT = "Wrap words in **double stars** to highlight them.";
const NEW_LINE = "Press Enter to start a new line.";

const text = (name, label, extra = {}) => ({ name, label, kind: "text", ...extra });
const area = (name, label, extra = {}) => ({ name, label, kind: "textarea", ...extra });
const img = (name, label) => ({ name, label, kind: "image" });
const imgUrl = (name, label) => ({ name, label, kind: "imageUrl" });
const link = (name, label) => ({ name, label, kind: "link" });
const button = (name, label, hint) => ({ name, label, kind: "button", hint });
const strings = (name, label, itemLabel) => ({ name, label, kind: "stringList", itemLabel });
const list = (name, label, itemLabel, fields, newItem) => ({
  name,
  label,
  kind: "list",
  itemLabel,
  fields,
  newItem,
});
const icon = { name: "icon", label: "Icon", kind: "select", options: ICON_OPTIONS };
const OPTIONAL_LINK =
  "Leave the link empty to keep it as a plain button (no link).";

const photoList = (name, label, itemLabel = "Photo") =>
  list(name, label, itemLabel, [imgUrl("url", "Image"), text("alt", "Alt text (describe the image)")], {
    url: "",
    alt: "",
  });

const reviewList = (withAvatar) =>
  list(
    "reviews",
    "Reviews",
    "Review",
    [
      ...(withAvatar ? [imgUrl("avatar", "Photo")] : []),
      area("review", "Review text"),
      text("name", "Name (optional)"),
      text("designation", "Role / company"),
    ],
    { review: "", name: "", designation: "", ...(withAvatar ? { avatar: "" } : {}) },
  );

const whyChoose = {
  defaults: WHY_CHOOSE,
  fields: [
    text("title", "Heading"),
    list("perks", "Reasons", "Reason", [icon, text("title", "Title"), area("description", "Description", { rows: 3 })], {
      icon: "shield",
      title: "",
      description: "",
    }),
  ],
};

export const BUILT_IN_SCHEMAS = {
  // =========================================================== Home
  Hero: {
    defaults: home.HOME_HERO,
    fields: [
      text("title", "Headline"),
      area("subtitle", "Sub-headline"),
      imgUrl("backgroundImage", "Background image"),
      button("primaryButton", "Primary button"),
      button("secondaryButton", "Secondary button"),
    ],
  },
  HomeRecognition: {
    defaults: home.HOME_RECOGNITION,
    fields: [
      text("title", "Heading"),
      list("awards", "Recognition cards", "Card", [icon, text("title", "Title"), text("description", "Description")], {
        icon: "badge-check",
        title: "",
        description: "",
      }),
    ],
  },
  HomeWhoWeAre: {
    defaults: home.HOME_WHO_WE_ARE,
    fields: [
      text("title", "Left panel title"),
      area("body", "Left panel text", { rows: 7 }),
      text("visionTitle", "Vision title"),
      area("visionBody", "Vision text", { rows: 5 }),
      text("impactTitle", "Impact title"),
      text("impactIntro", "Impact intro line"),
      strings("impact", "Impact points", "Point"),
    ],
  },
  HomeFoundersNote: {
    defaults: home.HOME_FOUNDERS_NOTE,
    fields: [
      text("title", "Heading"),
      area("body", "Note", { rows: 9, hint: HIGHLIGHT }),
      text("name", "Name"),
      text("role", "Title / role"),
      img("image", "Photo"),
    ],
  },
  HomeServices: {
    defaults: home.HOME_SERVICES,
    fields: [
      text("title", "Heading"),
      area("intro", "Intro text"),
      list("services", "Services", "Service", [text("title", "Title"), area("description", "Description")], {
        title: "",
        description: "",
      }),
    ],
  },
  HomeChoose: whyChoose,
  HomeReviews: {
    defaults: home.HOME_REVIEWS,
    fields: [text("title", "Heading"), area("intro", "Intro text"), reviewList(true)],
  },
  HomeConsultancy: {
    defaults: home.HOME_CONSULTANCY,
    fields: [
      {
        name: "clients",
        label: "Left card (clients)",
        kind: "group",
        fields: [imgUrl("image", "Background image"), area("text", "Text", { hint: HIGHLIGHT }), button("button", "Button", OPTIONAL_LINK)],
      },
      {
        name: "realtors",
        label: "Right card (realtors)",
        kind: "group",
        fields: [imgUrl("image", "Background image"), area("text", "Text", { hint: HIGHLIGHT }), button("button", "Button", OPTIONAL_LINK)],
      },
    ],
  },
  HomeContact: {
    defaults: home.HOME_CONTACT,
    fields: [
      text("title", "Heading"),
      area("intro", "Intro text", { rows: 3, hint: NEW_LINE }),
      text("email", "Email"),
      area("phones", "Phone numbers", { rows: 2 }),
      img("image", "Photo"),
      link("facebookUrl", "Facebook link"),
      link("instagramUrl", "Instagram link"),
      link("linkedinUrl", "LinkedIn link"),
    ],
  },

  // =========================================================== For Realtors
  RealtorHero: {
    defaults: realtors.REALTOR_HERO,
    fields: [
      text("title", "Headline"),
      area("body", "Text", { hint: HIGHLIGHT }),
      button("button", "Button"),
      img("image", "Image"),
    ],
  },
  RealtorWhyJoin: {
    defaults: realtors.REALTOR_WHY_JOIN,
    fields: [
      text("title", "Heading"),
      imgUrl("backgroundImage", "Background image"),
      list("features", "Reasons", "Reason", [icon, text("title", "Title"), area("description", "Description", { rows: 3 })], {
        icon: "gem",
        title: "",
        description: "",
      }),
    ],
  },
  RealtorWhatYouGet: {
    defaults: realtors.REALTOR_WHAT_YOU_GET,
    fields: [
      text("title", "Heading"),
      list("features", "Benefits", "Benefit", [icon, text("title", "Text")], { icon: "check-circle", title: "" }),
    ],
  },
  RealtorWhoCanJoin: {
    defaults: realtors.REALTOR_WHO_CAN_JOIN,
    fields: [
      text("title", "Heading"),
      area("body", "Text", { rows: 5, hint: NEW_LINE }),
      button("button", "Button", OPTIONAL_LINK),
      img("image", "Image"),
    ],
  },
  RealtorReviews: {
    defaults: realtors.REALTOR_REVIEWS,
    fields: [text("title", "Heading"), area("intro", "Intro text"), reviewList(true)],
  },
  RealtorGrowWithPCRG: {
    defaults: realtors.REALTOR_GROW,
    fields: [
      text("title", "Heading", { hint: HIGHLIGHT }),
      area("body", "Text", { hint: NEW_LINE }),
      imgUrl("backgroundImage", "Background image"),
      button("primaryButton", "First button", OPTIONAL_LINK),
      button("chatButton", "WhatsApp button"),
    ],
  },

  // =========================================================== For Developers
  DeveloperHero: {
    defaults: developers.DEVELOPER_HERO,
    fields: [
      text("title", "Headline", { hint: HIGHLIGHT }),
      area("body", "Text", { hint: HIGHLIGHT }),
      text("buttonLabel", "Button text", { hint: "The button opens the developer enquiry form." }),
      img("image", "Image"),
    ],
  },
  DeveloperTimeline: {
    defaults: developers.DEVELOPER_TIMELINE,
    fields: [
      text("title", "Heading", { hint: HIGHLIGHT }),
      imgUrl("backgroundImage", "Background image"),
      list("items", "Timeline points", "Point", [text("title", "Title"), area("text", "Text")], { title: "", text: "" }),
    ],
  },
  DeveloperWhatYouGet: {
    defaults: developers.DEVELOPER_WHAT_YOU_GET,
    fields: [
      text("title", "Heading", { hint: HIGHLIGHT }),
      strings("benefits", "Benefits", "Benefit"),
      text("buttonLabel", "Button text", { hint: "The button opens the developer enquiry form." }),
      img("image", "Image"),
    ],
  },
  DeveloperWhoWeWorkWith: {
    defaults: PARTNERS,
    fields: [
      text("title", "Heading", { hint: HIGHLIGHT }),
      list("partners", "Partner logos", "Logo", [imgUrl("url", "Logo"), text("alt", "Company name")], { url: "", alt: "" }),
    ],
  },
  DeveloperReviews: {
    defaults: developers.DEVELOPER_REVIEWS,
    fields: [text("title", "Heading"), area("intro", "Intro text"), reviewList(false)],
  },
  DeveloperPartnerWithUs: {
    defaults: developers.DEVELOPER_PARTNER,
    fields: [
      text("title", "Heading", { hint: HIGHLIGHT }),
      area("body", "Text"),
      imgUrl("backgroundImage", "Background image"),
      text("callButtonLabel", "Strategy-call button text"),
      text("partnerButtonLabel", "Partner button text"),
    ],
  },

  // =========================================================== Academy
  AcademyHero: {
    defaults: academy.ACADEMY_HERO,
    fields: [
      text("title", "Headline"),
      area("subtitle", "Sub-headline"),
      { name: "video", label: "Background video", kind: "video", hint: "Leave empty to keep the original video." },
      imgUrl("poster", "Image shown while the video loads"),
      button("primaryButton", "Primary button"),
      text("secondaryButtonLabel", "Second button text", { hint: "This button scrolls to the Faculty section." }),
    ],
  },
  AcademyMailingList: {
    defaults: academy.ACADEMY_MAILING_LIST,
    fields: [text("title", "Heading"), text("buttonLabel", "Button text"), text("successMessage", "Message after subscribing")],
  },
  AcademyIntro: {
    defaults: academy.ACADEMY_INTRO,
    fields: [text("title", "Heading"), area("body", "Text", { rows: 6 }), photoList("images", "Slideshow photos")],
  },
  RealtorNetwork: {
    defaults: academy.REALTOR_NETWORK,
    fields: [
      area("title", "Heading", { rows: 2, hint: `${HIGHLIGHT} ${NEW_LINE}` }),
      area("body", "Text"),
      text("benefitsTitle", "Benefits heading"),
      strings("benefits", "Benefits", "Benefit"),
      photoList("images", "Slideshow photos"),
    ],
  },
  AcademyGallery: {
    defaults: academy.ACADEMY_GALLERY,
    fields: [
      text("title", "Heading", { hint: HIGHLIGHT }),
      text("subtitle", "Sub-heading"),
      photoList("images", "Gallery photos"),
      button("button", "Button"),
    ],
  },
  AcademyBenefits: {
    defaults: academy.ACADEMY_BENEFITS,
    fields: [
      text("title", "Heading"),
      area("intro", "Intro text"),
      imgUrl("backgroundImage", "Background image"),
      list("benefits", "Benefits", "Benefit", [text("title", "Title"), area("description", "Description")], {
        title: "",
        description: "",
      }),
      button("button", "Button"),
    ],
  },
  AcademyFaculty: {
    defaults: academy.ACADEMY_FACULTY,
    fields: [
      text("title", "Heading"),
      list("members", "Faculty members", "Member", [imgUrl("image", "Photo"), text("name", "Name"), text("role", "Role")], {
        image: "",
        name: "",
        role: "",
      }),
    ],
  },
  AcademyReview: {
    defaults: academy.ACADEMY_REVIEWS,
    fields: [
      text("title", "Heading"),
      area("intro", "Intro text"),
      list(
        "testimonials",
        "Testimonials",
        "Testimonial",
        [
          imgUrl("avatar", "Photo"),
          text("title", "Title"),
          area("review", "Testimonial"),
          text("name", "Name"),
          text("designation", "Class / location"),
        ],
        { avatar: "", title: "", review: "", name: "", designation: "" },
      ),
    ],
  },
  AcademyInquiries: {
    defaults: academy.ACADEMY_INQUIRIES,
    fields: [
      text("title", "Heading", { hint: HIGHLIGHT }),
      area("contact", "Contact details", { rows: 3, hint: NEW_LINE }),
      imgUrl("backgroundImage", "Background image"),
    ],
  },

  // =========================================================== Blog & Events
  EventsHero: {
    defaults: events.EVENTS_HERO,
    fields: [
      text("title", "Headline"),
      area("subtitle", "Sub-headline"),
      img("image", "Background image"),
      button("primaryButton", "Primary button"),
      button("secondaryButton", "Secondary button"),
    ],
  },
  EventsNewsAlert: {
    defaults: events.EVENTS_NEWS_ALERT,
    fields: [text("title", "Heading"), text("buttonLabel", "Button text")],
  },
  EventsIntro: {
    defaults: events.EVENTS_INTRO,
    fields: [
      text("title", "Heading"),
      strings("paragraphs", "Paragraphs", "Paragraph"),
      imgUrl("image", "Image"),
      {
        name: "reverse",
        label: "Layout",
        kind: "select",
        options: [
          { value: false, label: "Image on the left" },
          { value: true, label: "Image on the right" },
        ],
      },
    ],
  },
  EventsOverview: {
    defaults: events.EVENTS_OVERVIEW,
    fields: [
      text("title", "Heading"),
      area("body", "Text"),
      list("events", "Event types", "Event type", [icon, text("title", "Title")], { icon: "users", title: "" }),
      button("primaryButton", "First button", OPTIONAL_LINK),
      button("secondaryButton", "Second button", OPTIONAL_LINK),
    ],
  },
  EventsUpcoming: {
    defaults: events.EVENTS_UPCOMING,
    fields: [
      text("title", "Heading", { hint: HIGHLIGHT }),
      area("intro", "Intro text"),
      { name: "limit", label: "How many events to show (1-12)", kind: "number" },
      text("viewAllLabel", "'See all' button text"),
    ],
  },
  BlogLatest: {
    defaults: events.BLOG_LATEST,
    fields: [
      text("title", "Heading", { hint: HIGHLIGHT }),
      area("intro", "Intro text"),
      { name: "limit", label: "How many posts to show (1-12)", kind: "number" },
      text("viewAllLabel", "'See all' button text"),
    ],
  },
  EventsSpotlightMoments: {
    defaults: events.EVENTS_SPOTLIGHT,
    fields: [
      area("title", "Heading", { rows: 2, hint: NEW_LINE }),
      area("body", "Text"),
      photoList("images", "Photos"),
    ],
  },
  EventsConnects: {
    defaults: events.EVENTS_CONNECTS,
    fields: [
      text("title", "Heading", { hint: HIGHLIGHT }),
      area("body", "Text"),
      text("followText", "Follow line", { hint: HIGHLIGHT }),
      imgUrl("backgroundImage", "Background image"),
      link("facebookUrl", "Facebook link"),
      link("instagramUrl", "Instagram link"),
      link("xUrl", "X (Twitter) link"),
      link("whatsappUrl", "WhatsApp link"),
    ],
  },

  // =========================================================== About Us
  AboutHero: {
    defaults: about.ABOUT_HERO,
    fields: [text("title", "Headline"), area("body", "Text"), photoList("slides", "Slideshow photos")],
  },
  AboutIntro: {
    defaults: about.ABOUT_INTRO,
    fields: [
      text("block1Title", "Block 1 heading"),
      strings("block1Paragraphs", "Block 1 paragraphs", "Paragraph"),
      text("block2Title", "Block 2 heading"),
      strings("block2Paragraphs", "Block 2 paragraphs", "Paragraph"),
      text("block3Title", "Block 3 heading"),
      area("block3Text", "Block 3 text"),
      list("features", "Feature cards", "Card", [icon, text("title", "Text")], { icon: "check-circle", title: "" }),
      text("visionTitle", "Vision heading"),
      area("visionText", "Vision text"),
      text("missionTitle", "Mission heading"),
      area("missionText", "Mission text"),
    ],
  },
  AboutChoose: whyChoose,
  AboutTeam: {
    defaults: about.ABOUT_TEAM,
    fields: [
      text("title", "Heading"),
      area("intro", "Intro text"),
      list("members", "Team members", "Member", [imgUrl("image", "Photo"), text("name", "Name"), text("role", "Role")], {
        image: "",
        name: "",
        role: "",
      }),
    ],
  },
};
