// src/components/GlobalSeo.jsx
import React from "react";
import { Title, Meta, Link } from "react-head";

export default function GlobalSEO() {
  return (
    <>
      {/* 🌐 Default Fallback Title — overridden by PageSEO on each page */}
      <Title>
        PCRG | Platinum Cape Realtors Group — Excellence in Real Estate, Beyond
        Borders
      </Title>

      {/* Core Meta */}
      <Meta name="author" content="Platinum Cape Realtors Group" />
      <Meta name="robots" content="index, follow" />
      <Meta name="theme-color" content="#7a0c0c" />
      <Meta
        name="keywords"
        content="real estate Nigeria, realtors Lagos, property investment Nigeria, PCRG, Platinum Cape Realtors Group, real estate training Nigeria, buy property Lagos, real estate academy Nigeria, property developers Nigeria"
      />
      <Meta
        name="google-site-verification"
        content="google-site-verification=Gw9t4E-Epj5PifcZNQvAnQodDp6Oqao2TMGSUip8cB8"
      />

      {/* Geo Targeting */}
      <Meta name="geo.region" content="NG-LA" />
      <Meta name="geo.placename" content="Lagos, Nigeria" />
      <Meta name="geo.position" content="6.5244;3.3792" />
      <Meta name="ICBM" content="6.5244, 3.3792" />

      {/* Fallback Open Graph — overridden per page by PageSEO */}
      <Meta property="og:site_name" content="Platinum Cape Realtors Group" />
      <Meta property="og:type" content="website" />
      <Meta property="og:locale" content="en_NG" />
      <Meta
        property="og:title"
        content="PCRG | Platinum Cape Realtors Group — Excellence in Real Estate, Beyond Borders"
      />
      <Meta
        property="og:description"
        content="Platinum Cape Realtors Group (PCRG) is bridging local and international investors to legally compliant, profitable real estate opportunities across Nigeria."
      />
      <Meta property="og:url" content="https://pcrginitiative.com" />
      <Meta
        property="og:image"
        content="https://pcrginitiative.com/images/og-default.jpg"
      />
      <Meta property="og:image:width" content="1200" />
      <Meta property="og:image:height" content="630" />
      <Meta property="og:image:alt" content="Platinum Cape Realtors Group" />

      {/* Fallback Twitter Card — overridden per page by PageSEO */}
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta
        name="twitter:title"
        content="PCRG | Platinum Cape Realtors Group — Excellence in Real Estate, Beyond Borders"
      />
      <Meta
        name="twitter:description"
        content="Platinum Cape Realtors Group (PCRG) is bridging local and international investors to legally compliant, profitable real estate opportunities across Nigeria."
      />
      <Meta
        name="twitter:image"
        content="https://pcrginitiative.com/images/og-default.jpg"
      />
      <Meta name="twitter:image:alt" content="Platinum Cape Realtors Group" />

      {/* Favicon */}
      <Link rel="icon" href="/images/platinumFavicon.svg" />
      <Link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
      <Link rel="manifest" href="/manifest.json" />

      {/* Canonical fallback — overridden per page by PageSEO */}
      <Link rel="canonical" href="https://pcrginitiative.com" />
    </>
  );
}
