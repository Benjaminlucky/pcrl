// src/cms/blocks.jsx
// Generic building blocks editors can add to any page from the CMS, in
// addition to the page's built-in sections. All text is rendered as plain
// text (never as HTML); blank lines in `body` become paragraphs.
import React from "react";
import { Link } from "react-router-dom";

const str = (v) => (typeof v === "string" ? v : "");
const list = (v) => (Array.isArray(v) ? v : []);

const ALIGN = { left: "text-left", center: "text-center mx-auto", right: "text-right ml-auto" };

function Paragraphs({ text, className = "" }) {
  return str(text)
    .split(/\n\s*\n/)
    .filter((p) => p.trim())
    .map((p, i) => (
      <p key={i} className={`whitespace-pre-line leading-relaxed ${className}`}>
        {p}
      </p>
    ));
}

export function CmsButton({ button, className = "" }) {
  const label = str(button?.label);
  const url = str(button?.url);
  if (!label || !url) return null;
  const style =
    button.variant === "outline"
      ? "border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white"
      : "bg-primary-500 text-white hover:opacity-90";
  const cls = `inline-block px-8 py-3 rounded-sm font-semibold transition duration-300 ${style} ${className}`;
  return url.startsWith("/") ? (
    <Link to={url} className={cls}>
      {label}
    </Link>
  ) : (
    <a href={url} className={cls} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}

function Heading({ content }) {
  return (
    <>
      {str(content.eyebrow) && (
        <span className="block text-primary-500 font-semibold uppercase tracking-wide text-sm mb-2">
          {content.eyebrow}
        </span>
      )}
      {str(content.heading) && (
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{content.heading}</h2>
      )}
    </>
  );
}

// { eyebrow, heading, body, align: left|center|right, buttons: [] }
export function RichText({ content }) {
  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div className={`container mx-auto px-6 max-w-4xl flex flex-col gap-4 ${ALIGN[content.align] || ""}`}>
        <Heading content={content} />
        <Paragraphs text={content.body} className="text-gray-600 text-lg" />
        {list(content.buttons).length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4">
            {list(content.buttons).map((b, i) => (
              <CmsButton key={i} button={b} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// { heading, body, image: {url, alt}, imagePosition: left|right, button }
export function ImageText({ content }) {
  const img = content.image || {};
  const imageLeft = content.imagePosition === "left";
  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div
        className={`container mx-auto px-6 flex flex-col md:flex-row items-center gap-10 ${
          imageLeft ? "md:flex-row-reverse" : ""
        }`}
      >
        <div className="md:w-1/2 flex flex-col gap-4">
          <Heading content={content} />
          <Paragraphs text={content.body} className="text-gray-600 text-lg" />
          {content.button && (
            <div className="mt-2">
              <CmsButton button={content.button} />
            </div>
          )}
        </div>
        {str(img.url) && (
          <div className="md:w-1/2">
            <img
              src={img.url}
              alt={str(img.alt)}
              loading="lazy"
              className="w-full h-auto rounded-md object-cover shadow-md"
            />
          </div>
        )}
      </div>
    </section>
  );
}

// { heading, body, buttons: [], backgroundImage: {url} }
export function CallToAction({ content }) {
  const bg = str(content.backgroundImage?.url);
  return (
    <section
      className="relative w-full py-16 md:py-24 bg-primary-900 bg-cover bg-center"
      style={bg ? { backgroundImage: `url("${encodeURI(bg)}")` } : undefined}
    >
      {bg && <div className="absolute inset-0 bg-black/50" />}
      <div className="relative z-10 container mx-auto px-6 max-w-3xl text-center flex flex-col gap-4 text-white">
        {str(content.heading) && <h2 className="text-3xl md:text-5xl font-extrabold">{content.heading}</h2>}
        <Paragraphs text={content.body} className="text-gray-200 text-lg" />
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {list(content.buttons).map((b, i) => (
            <CmsButton key={i} button={b} />
          ))}
        </div>
      </div>
    </section>
  );
}

// { heading, images: [{url, alt, caption}], columns: 2|3|4 }
export function Gallery({ content }) {
  const cols = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" }[content.columns] || "md:grid-cols-3";
  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <Heading content={content} />
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols} gap-4 mt-6`}>
          {list(content.images)
            .filter((im) => str(im?.url))
            .map((im, i) => (
              <figure key={i} className="overflow-hidden rounded-md">
                <img src={im.url} alt={str(im.alt)} loading="lazy" className="w-full h-64 object-cover" />
                {str(im.caption) && (
                  <figcaption className="text-sm text-gray-500 mt-2">{im.caption}</figcaption>
                )}
              </figure>
            ))}
        </div>
      </div>
    </section>
  );
}

// { heading, url (mp4/webm), poster }
export function Video({ content }) {
  if (!str(content.url)) return null;
  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div className="container mx-auto px-6 max-w-5xl text-center">
        <Heading content={content} />
        <video
          src={content.url}
          poster={str(content.poster) || undefined}
          controls
          playsInline
          preload="metadata"
          className="w-full rounded-md shadow-md mt-4"
        />
      </div>
    </section>
  );
}

// { height: px number }
export function Spacer({ content }) {
  const h = Math.min(Math.max(Number(content.height) || 48, 0), 400);
  return <div aria-hidden="true" style={{ height: h }} />;
}

