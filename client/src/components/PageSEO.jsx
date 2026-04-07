// src/components/PageSEO.jsx
import React from "react";
import { Title, Meta, Link } from "react-head";

export default function PageSEO({
  title,
  description,
  canonical,
  ogImage = "https://pcrginitiative.com/images/og-default.jpg",
  schema = null,
}) {
  const siteName = "PCRG | Platinum Cape Realtors Group";
  const fullTitle = title === "Home" ? siteName : `${title} | ${siteName}`;

  return (
    <>
      <Title>{fullTitle}</Title>
      <Meta name="description" content={description} />
      <Link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <Meta property="og:title" content={fullTitle} />
      <Meta property="og:description" content={description} />
      <Meta property="og:image" content={ogImage} />
      <Meta property="og:url" content={canonical} />
      <Meta property="og:type" content="website" />
      <Meta property="og:site_name" content={siteName} />
      <Meta property="og:locale" content="en_NG" />

      {/* Twitter Card */}
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content={fullTitle} />
      <Meta name="twitter:description" content={description} />
      <Meta name="twitter:image" content={ogImage} />

      {/* Geo targeting — Nigerian site */}
      <Meta name="geo.region" content="NG-LA" />
      <Meta name="geo.placename" content="Lagos, Nigeria" />

      {/* JSON-LD Schema */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </>
  );
}
