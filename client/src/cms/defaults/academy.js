// src/cms/defaults/academy.js
// Built-in content of the PCRG Academy page ("/pcrg-training-academy").
import { PHONES } from "./shared";

const ACADEMY_PHOTOS = [
  { url: "/images/academystudents1.jpeg" },
  { url: "/images/academystudent2.jpeg" },
  { url: "/images/academystudent3.jpeg" },
  { url: "/images/academystudent4.jpeg" },
];

// academy › hero
export const ACADEMY_HERO = {
  title: "Elevate Your Game With PCRG Academy",
  subtitle: "The Leading Professional Realtors Training Program in Africa",
  poster: "/images/academyPosterHero.jpg",
  // Empty = the built-in WebM + MP4 pair. Set a URL to use one uploaded video.
  video: "",
  primaryButton: { label: "Apply to Academy", url: "/sign-up" },
  secondaryButtonLabel: "View Faculty",
};

// academy › mailing-list
export const ACADEMY_MAILING_LIST = {
  title: "Get notified of upcoming trainings",
  buttonLabel: "Join our mailing list",
  successMessage: "You're on the list! We'll notify you of upcoming trainings.",
};

// academy › intro
export const ACADEMY_INTRO = {
  title: "Welcome to PCRG Training & Academy",
  body: "A citadel of learning for aspiring and established real estate professionals. At PCRG, we equip realtors with modern-day industry knowledge, practical skills and cutting-edge technology they need to develop their expertise as high-performing salespersons in the real estate industry.",
  images: ACADEMY_PHOTOS,
};

// academy › realtor-network
export const REALTOR_NETWORK = {
  title: "**Building 10,000+**\nRealtors Across Africa",
  body: "Join a thriving network of over 10,000 realtors who have chosen to unlearn, learn and relearn through our transformative training sessions led by world-class facilitators and mentors.",
  benefitsTitle: "By enrolling in PCRG Training & Academy, you gain:",
  benefits: [
    "Network with High Performing Realtors for mentorship and Collaboration",
    "One on One Coaching with industry Experts",
    "Exclusive Access to our Digital Realtor App",
    "A PCRG Premium ID Card",
    "UK Certified Courses and many more benefits",
    "Networking opportunities with Africa’s fastest-growing realtor community",
  ],
  images: ACADEMY_PHOTOS,
};

// academy › gallery
export const ACADEMY_GALLERY = {
  title: "PCRG **Event Moments**",
  subtitle: "Celebrating achievements, community and excellence",
  images: Array.from({ length: 15 }, (_, i) => ({ url: `/images/gallery/gallery${i + 1}.jpeg` })),
  button: { label: "See Events", url: "https://www.youtube.com/@platinumcaperealtorgroup3638" },
};

// academy › benefits
export const ACADEMY_BENEFITS = {
  title: "Enjoy Premium Benefits and Opportunities",
  intro:
    "At PCRG, training goes beyond classrooms—it’s an experience designed to position you for success.",
  backgroundImage: "/images/realtorBg1.jpeg",
  benefits: [
    {
      title: "Foreign Certification",
      description:
        "Earn globally recognized certifications from renowned Schools of Business and Management, guided by world-class facilitators.",
    },
    {
      title: "Digital Integration",
      description:
        "Get onboarded onto our exclusive Digital App Platform designed to connect you to opportunities, listings, and fellow realtors.",
    },
  ],
  button: { label: "Join PCRG Academy", url: "/sign-up" },
};

// academy › faculty
export const ACADEMY_FACULTY = {
  title: "Faculty",
  members: [
    {
      name: "Dr. Mrs. Vivian Okiche",
      role: "President, Pcrg",
      image: "/images/faculty/drOkichie1.jpg",
    },
    {
      name: "Mr Mark Iorliam",
      role: "Vice President, pcrg academy",
      image: "/images/MrMark.jpg",
    },
  ],
};

// academy › reviews
export const ACADEMY_REVIEWS = {
  title: "Hear What Our Graduands Have to Say",
  intro:
    "At PCRG, we understand the value of knowledge and this is exemplified through the PCRG Trainings & Academy. See what our trainees are saying.",
  testimonials: [
    {
      title: "Confidence Awakened",
      review:
        "Before joining PCRG Academy, I had zero knowledge about real estate. Today, I can confidently identify good property deals, handle clients professionally, and even close my first sale! The training was practical, detailed, and life-changing.",
      name: "Mary O.",
      designation: "Training Class of 2024",
      avatar: "/images/realtor.jpeg",
    },
    {
      title: "From Curiosity to Career",
      review:
        "Before joining PCRG Academy, I had zero knowledge about real estate. Today, I can confidently identify good property deals, handle clients professionally, and even close my first sale! The training was practical, detailed, and life-changing.",
      name: "Chinedu A.",
      designation: "Realtor, Lagos",
      avatar: "/images/realtor.jpeg",
    },
    {
      title: "Real Value for Money",
      review:
        "This wasn’t just another real estate course. PCRG Academy gave me real tools — negotiation scripts, client management systems, and access to developers. It’s the best investment I’ve made in my personal growth.",
      name: "Chika O",
      designation: "Training Class of 2023",
      avatar: "/images/realtor.jpeg",
    },
    {
      title: "From Student to Realtor",
      review:
        "I started the training with little confidence, but now I’m a certified realtor with listings and clients of my own. PCRG didn’t just train me—they transformed me.",
      name: "— Fatima A., ",
      designation: "Graduate Realtor",
      avatar: "/images/realtor.jpeg",
    },
    {
      title: "Game-Changer for My Career",
      review:
        "The course structure was easy to follow, yet very powerful. The sessions on property marketing, client relations, and sales closing techniques were absolute game changers for me.",
      name: "— Victor E, ",
      designation: "Delta",
      avatar: "/images/realtor.jpeg",
    },
  ],
};

// academy › inquiries
export const ACADEMY_INQUIRIES = {
  title: "Got inquiries, reach out **via**",
  contact: `${PHONES}\nplatinumcaperealtors@gmail.com`,
  backgroundImage: "/images/burbleBg.jpg",
};
