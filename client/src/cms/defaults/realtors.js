// src/cms/defaults/realtors.js
// Built-in content of the For Realtors page ("/for-realtors").

// for-realtors › hero
export const REALTOR_HERO = {
  title: "Join the Fastest-Growing Realtors Network in Nigeria",
  body: "At Platinum Cape Realtors Group (PCRG), we’re not just building a company — we’re building people. Here, realtors don’t just sell properties; **they build wealth, credibility, and a lasting career.**",
  button: { label: "Get Started", url: "/sign-up" },
  image: { url: "/images/realtorPageModel.png", alt: "Smiling Realtor" },
};

// for-realtors › why-join
export const REALTOR_WHY_JOIN = {
  title: "Why Join PCRG?",
  backgroundImage: "/images/realtorBg1.jpeg",
  features: [
    {
      icon: "gem",
      title: "Access Exclusive Listings",
      description:
        "Get direct access to verified, high-demand properties across Nigeria — all legally compliant and ready to market.",
    },
    {
      icon: "briefcase",
      title: "Learn, Learn & Grow",
      description:
        "From your first sale to scaling as a property consultant, PCRG provides tools, mentorship, and trainings that help you grow your income and your brand.",
    },
    {
      icon: "handshake",
      title: "Trusted Support System",
      description:
        "We guide you every step of the way — from client handling to closing deals. You’re never alone in the field.",
    },
    {
      icon: "graduation-cap",
      title: "Career Advancement Opportunities",
      description:
        "Stand out with certification programs, leadership roles, and recognition as part of our Top Realtors Network.",
    },
  ],
};

// for-realtors › what-you-get
export const REALTOR_WHAT_YOU_GET = {
  title: "What You Get",
  features: [
    { icon: "users-rectangle", title: "Free Realtor Registration" },
    { icon: "chalkboard-teacher", title: "Weekly training & mentorship sessions" },
    { icon: "verified-badge", title: "Access to verified property listings" },
    { icon: "chart-line", title: "Sales rewards & recognition programs" },
    { icon: "share-network", title: "Networking events & real estate summits" },
  ],
};

// for-realtors › who-can-join
export const REALTOR_WHO_CAN_JOIN = {
  title: "Who Can Join?",
  body: "Whether you’re a beginner, a freelance realtor, or a real estate professional, PCRG is your launchpad to success.\nIf you’re passionate about real estate, ready to learn, and driven to succeed — you belong here.",
  button: { label: "Get Started", url: "" },
  image: { url: "/images/RealtorPageJoinModel.png", alt: "Smiling realtor pointing" },
};

// for-realtors › reviews
export const REALTOR_REVIEWS = {
  title: "Real Stories. Real Growth.",
  intro: "Hear testimonies of impact, financial transformation, and sustainable growth.",
  reviews: [
    {
      designation: " Sarah, Realtor Partner",
      review:
        "Joining PCRG changed my life. I went from struggling for listings to closing my first 3 property deals in a month.",
      avatar: "/images/client.jpg",
    },
    {
      designation: "Chijioke, Senior Realtor",
      review:
        "The mentorship here is next-level. It’s not just about selling, it’s about becoming a true professional.",
      avatar: "/images/client.jpg",
    },
    {
      designation: " Sarah, Realtor Partner",
      review:
        "Joining PCRG changed my life. I went from struggling for listings to closing my first 3 property deals in a month.",
      avatar: "/images/client.jpg",
    },
    {
      designation: "Chijioke, Senior Realtor",
      review:
        "The mentorship here is next-level. It’s not just about selling, it’s about becoming a true professional.",
      avatar: "/images/client.jpg",
    },
  ],
};

// for-realtors › grow
export const REALTOR_GROW = {
  title: "Ready to Grow with **PCRG?**",
  body: "Take your real estate career global.\nJoin a network of 10,000+ Realtors making impact and income every day.",
  backgroundImage: "/images/burbleBg.jpg",
  primaryButton: { label: "Join as a Realtor", url: "" },
  chatButton: {
    label: "Chat Support",
    url: "https://wa.me/2348053642425?text=Hello%20PCRG!%20I%27d%20like%20to%20learn%20more%20about%20partnering%20as%20a%20Realtor.",
  },
};
