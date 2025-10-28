import React from "react";
import { Title, Meta, Link } from "react-head";

export default function GlobalSEO() {
  return (
    <>
      {/* 🌐 Default HTML Meta */}
      <Title>PCRG — Platinum Cape Realtors Group</Title>
      <Meta
        name="description"
        content="Platinum Cape Realtors Group (PCRG) is bridging local and international investors to legally compliant, profitable real estate opportunities across Nigeria."
      />
      <Meta name="author" content="PCRG" />
      <Meta
        name="keywords"
        content="real estate, PCRG, realtors, training, academy, Nigeria, property network"
      />
      <Meta name="theme-color" content="#B91C1C" />

      {/* 📱 Open Graph (Facebook, LinkedIn, WhatsApp) */}
      <Meta
        property="og:title"
        content="PCRG — Empowering Realtors and Developers"
      />
      <Meta
        property="og:description"
        content="Platinum Cape Realtors Group (PCRG) is bridging local and international investors to legally compliant, profitable real estate opportunities across Nigeria."
      />
      <Meta property="og:type" content="website" />
      <Meta property="og:url" content="https://pcrg.netlify.app" />
      <Meta
        property="og:image"
        content="https://pcrg.netlify.app/images/pcrgSiteLogo.png"
      />
      <Meta property="og:image:alt" content="PCRG logo" />

      {/* 🐦 Twitter Card */}
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta
        name="twitter:title"
        content="PCRG — Empowering Realtors and Developers"
      />
      <Meta
        name="twitter:description"
        content="Platinum Cape Realtors Group (PCRG) is bridging local and international investors to legally compliant, profitable real estate opportunities across Nigeria."
      />
      <Meta
        name="twitter:image"
        content="https://pcrg.netlify.app/images/pcrgSiteLogo.png"
      />
      <Meta name="twitter:image:alt" content="PCRG logo" />

      {/* ✅ Favicon + Canonical URL */}
      <Link rel="icon" href="/images/platinumFavicon.svg" />
      <Link rel="canonical" href="https://pcrg.netlify.app" />
    </>
  );
}
