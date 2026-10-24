// src/cms/defaults/home.js
// Built-in content of the Home page sections ("/").
import { PHONES } from "./shared";

// home › hero
export const HOME_HERO = {
  backgroundImage: "/images/homeHero.jpg",
  title: "Excellence in Real Estate, Beyond Borders.",
  subtitle:
    "Platinum Cape Realtors Group (PCRG) is bridging local and international investors to legally compliant, profitable real estate opportunities across Nigeria.",
  primaryButton: { label: "Learn More About PCRG", url: "/about-us" },
  secondaryButton: { label: "Join Our Realtors Network", url: "/sign-up" },
};

// home › recognition
export const HOME_RECOGNITION = {
  title: "Recognized for",
  awards: [
    { icon: "user-group", title: "Growth", description: "Over 10,000 realtors in three Year" },
    { icon: "badge-check", title: "Licensed", description: "Licensed Real Estate Company" },
    { icon: "shield", title: "Trusted", description: "Trusted by Local & Foreign Investors" },
    { icon: "heart", title: "Empathy", description: "Client-Focused Approach" },
    { icon: "magnifier", title: "Transparency", description: "Transparent Transactions" },
  ],
};

// home › who-we-are
export const HOME_WHO_WE_ARE = {
  title: "Who We Are",
  body: "Platinum Cape Realtors Group (PCRG) is a thriving real estate marketing company with its headquarter in Lagos, Nigeria. In just three years, we have built a network of over 10,000 realtors, serving both local and international investors with excellence, integrity, and professionalism. Our dedication to redefining standards in real estate makes us a trusted partner for investors seeking value and growth.",
  visionTitle: "Our Vision",
  visionBody:
    "To redefine the standards of excellence in Nigeria’s real estate industry and create value that benefits clients, realtors, developers, and the economy at large. We aim to build a sustainable system where innovation, transparency, and partnership thrive.",
  impactTitle: "Our Impact",
  impactIntro: "In three years, PCRG has:",
  impact: [
    "Connected clients with secure and compliant real estate deals.",
    "Promoted sustainable investments that boost Nigeria’s economy locally and globally.",
    "Reinforced trust and transparency in every property transaction.",
    "Created business opportunities and jobs for thousands of Nigerians.",
    "Launched sensitisation and welfare programs that enrich the real estate journey for clients and realtors alike.",
  ],
};

// home › founders-note
export const HOME_FOUNDERS_NOTE = {
  title: "Founder's Note",
  body: "At PCRG, we see real estate as more than property—it’s about vision, transformation, and lasting impact. Under the leadership of **Dr Mrs Vivian Pollard Okiche**, our Founder and President, PCRG stands as a symbol of innovation, integrity, and growth in real estate marketing. Her passion for excellence and empowerment drives everything we do. To our investors, we offer confidence built on strategy and results. To our realtors, we provide a platform for success and shared prosperity. Together, we’re not just shaping the market — we’re building the future of real estate.",
  name: "Dr Mrs Vivian Pollard Okiche",
  role: "Founder & President, PCRG",
  image: { url: "/images/drOkichie1.jpg", alt: "Dr. Mrs. Vivian Okiche" },
};

// home › services
export const HOME_SERVICES = {
  title: "Our Services",
  intro:
    "PCRG delivers excellence through transparency, innovation, and a client-first approach in every service we provide.",
  services: [
    {
      title: "Property Marketing & Listings",
      description:
        "From Lagos to selected states across Nigeria, we market and list properties that meet strict legal and compliance checks to ensure buyer confidence and transparency.",
    },
    {
      title: "Client Investment Advisory",
      description:
        "Expert guidance for both local and international investors seeking secure and profitable real estate opportunities.",
    },
  ],
};

// home › reviews
export const HOME_REVIEWS = {
  title: "What Our Clients Say",
  intro:
    "Hear from some of our satisfied clients and partners who trust PCRG for their real estate success.",
  reviews: [
    {
      designation: "International Client",
      review:
        "PCRG walked me through my first property investment in Lagos, and it was seamless from start to finish.",
      avatar: "/images/client.jpg",
    },
    {
      designation: "International Client",
      review:
        "PCRG walked me through my first property investment in Lagos, and it was seamless from start to finish.",
      avatar: "/images/client.jpg",
    },
    {
      designation: "Realtor",
      review:
        "Becoming a PCRG realtor opened doors I never imagined. Today, I have financial independence.",
      avatar: "/images/realtor.jpeg",
    },
    {
      designation: "Realtor",
      review:
        "Becoming a PCRG realtor opened doors I never imagined. Today, I have financial independence.",
      avatar: "/images/realtor.jpeg",
    },
  ],
};

// home › consultancy (two fixed cards with their own colour treatments)
export const HOME_CONSULTANCY = {
  clients: {
    image: "/images/clientConsultancy.jpeg",
    text: "**For Clients:** Looking for the right company to walk you through real estate investment opportunities and growth? PCRG should be top on your list.",
    button: { label: "Contact Our Advisory Team", url: "" },
  },
  realtors: {
    image: "/images/realtorConsultancy.jpg",
    text: "**For Realtors:** Join a thriving network of over 10,000 professionals where you can access listings, training, and opportunities to grow.",
    button: { label: "Join as a Realtor", url: "" },
  },
};

// home › contact
export const HOME_CONTACT = {
  image: { url: "/images/homeContact.jpeg", alt: "Contact representative" },
  title: "Contact us",
  intro: "We are here to serve you better.\nReach out through any of the channels below:",
  email: "info@pcrginitiative.com",
  phones: PHONES,
  facebookUrl: "#",
  instagramUrl: "#",
  linkedinUrl: "#",
};
