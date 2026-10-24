// src/cms/defaults/events.js
// Built-in content of the Blog and Events page ("/blog-and-events").

const EVENTS_TAGLINE =
  "Whether it’s a power-packed masterclass, networking brunch, or real estate bootcamp, our events are designed to elevate your career and expand your network.";

// blog-and-events › hero
export const EVENTS_HERO = {
  title: "Learn. Connect. Grow.",
  subtitle: EVENTS_TAGLINE,
  image: { url: "/images/EventsPosterHero.jpg", alt: "Event audience" },
  primaryButton: {
    label: "Explore Events",
    url: "https://www.youtube.com/@platinumcaperealtorgroup3638",
  },
  secondaryButton: { label: "Learn More", url: "/about" },
};

// blog-and-events › news-alert
export const EVENTS_NEWS_ALERT = {
  title: "Subscribe to the PCRG Event Alerts",
  buttonLabel: "Join our mailing list",
};

// blog-and-events › intro
export const EVENTS_INTRO = {
  image: "/images/eventImg1.jpeg",
  title: "Where Knowledge Meets Lifestyle",
  paragraphs: [
    "Welcome to the heartbeat of the PCRG community — where realtors, investors, and enthusiasts come together to learn, network, and stay inspired. At PCRG, we believe real estate is more than business — it’s a lifestyle, a mindset, and a movement.",
    "Our Events Hub keeps you connected to the trends, trainings, and transformational moments shaping the future of real estate across Africa.",
  ],
  reverse: false,
};

// blog-and-events › overview
export const EVENTS_OVERVIEW = {
  title: "Be part of the most vibrant realtor ecosystem in Africa",
  body: EVENTS_TAGLINE,
  events: [
    { icon: "users", title: "Quarterly Realtor Hangouts" },
    { icon: "check-circle", title: "Real Estate Investment Summits" },
    { icon: "chalkboard-teacher", title: "Developer Partnership Exhibitions" },
    { icon: "network", title: "Networking & Mentorship Mixers" },
    { icon: "medal", title: "PCRG Awards & Recognition Nights" },
  ],
  primaryButton: { label: "View Upcoming Events", url: "" },
  secondaryButton: { label: "Get Notified", url: "" },
};

// blog-and-events › spotlight
export const EVENTS_SPOTLIGHT = {
  title: "Spotlight\nMoments",
  body: "Because at PCRG, we celebrate our people! Explore event highlights, graduation ceremonies, training sessions, and behind-the-scenes moments that showcase our growing family of realtors and developers.",
  images: [{ url: "/images/academystudents1.jpeg" }, { url: "/images/academystudent4.jpeg" }],
};

// blog-and-events › connect
export const EVENTS_CONNECTS = {
  title: "Stay **Connected**",
  body: "Don’t miss out on the next big opportunity — Follow us across all social media platforms for updates, event invites, and insider tips straight from the PCRG network.",
  followText: "Follow **@platinumcaperealtors** on",
  backgroundImage: "/images/burbleBg.jpg",
  facebookUrl:
    "https://web.facebook.com/profile.php?id=100075965786400&mibextid=wwXIfr&rdid=hv6TCdFZc35gfl0Z&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F1AQexbxrE2%2F%3Fmibextid%3DwwXIfr%26_rdc%3D1%26_rdr#",
  instagramUrl: "https://www.instagram.com/platinumcaperealtors/?igsh=MTJtMXBodjlmOGRnaw%3D%3D#",
  xUrl: "https://x.com/platinumcaperealtors",
  whatsappUrl:
    "https://wa.me/2349123212589?text=Hello%20PCRG!%20I%27d%20love%20to%20learn%20more%20about%20partnering%20as%20a%20Realtor.",
};

// blog-and-events › upcoming-events (list from the Events collection)
export const EVENTS_UPCOMING = {
  title: "Upcoming **Events**",
  intro: "Join us at our next masterclass, hangout or summit.",
  limit: 3,
  viewAllLabel: "See all events",
};

// blog-and-events › latest-posts (list from the Blog collection)
export const BLOG_LATEST = {
  title: "Latest from the **Blog**",
  intro: "News, insights and stories from the PCRG community.",
  limit: 3,
  viewAllLabel: "Read all posts",
};
