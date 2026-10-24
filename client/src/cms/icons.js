// src/cms/icons.js
// Icon name → component, for CMS-editable cards. Names match iconOptions.js.
import { HiUserGroup } from "react-icons/hi2";
import { HiBadgeCheck } from "react-icons/hi";
import { RiShieldLine, RiVerifiedBadgeFill } from "react-icons/ri";
import { IoHeartSharp, IoRocketSharp } from "react-icons/io5";
import { PiMagnifyingGlassBold, PiShareNetworkBold } from "react-icons/pi";
import {
  FaGlobeAmericas,
  FaChalkboardTeacher,
  FaChartLine,
  FaUsers,
  FaCheckCircle,
  FaNetworkWired,
  FaMedal,
} from "react-icons/fa";
import {
  FaGem,
  FaBriefcase,
  FaHandshake,
  FaGraduationCap,
  FaUsersRectangle,
} from "react-icons/fa6";
import { GiStarFormation } from "react-icons/gi";

export const ICONS = {
  "user-group": HiUserGroup,
  users: FaUsers,
  "users-rectangle": FaUsersRectangle,
  "badge-check": HiBadgeCheck,
  "verified-badge": RiVerifiedBadgeFill,
  shield: RiShieldLine,
  heart: IoHeartSharp,
  magnifier: PiMagnifyingGlassBold,
  globe: FaGlobeAmericas,
  rocket: IoRocketSharp,
  stars: GiStarFormation,
  gem: FaGem,
  briefcase: FaBriefcase,
  handshake: FaHandshake,
  "graduation-cap": FaGraduationCap,
  "chalkboard-teacher": FaChalkboardTeacher,
  "chart-line": FaChartLine,
  "share-network": PiShareNetworkBold,
  network: FaNetworkWired,
  "check-circle": FaCheckCircle,
  medal: FaMedal,
};

// Unknown/missing names fall back to a neutral icon instead of crashing.
export const iconFor = (name) => ICONS[name] || FaCheckCircle;
