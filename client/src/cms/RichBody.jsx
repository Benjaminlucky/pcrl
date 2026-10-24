// src/cms/RichBody.jsx
// Renders blog/event body text written with a small, safe formatting syntax
// (never raw HTML):
//
//   ## Heading / ### Smaller heading
//   - bullet lines            1. numbered lines
//   > quote
//   ![alt text](image-url)    on its own line
//   **bold**  *italic*  [link text](https://… or /page)
//   blank line = new paragraph, single new line = line break
import React from "react";
import { Link } from "react-router-dom";

const SAFE_LINK = /^(\/|#|https?:\/\/|mailto:|tel:)/i;
const SAFE_IMAGE = /^(\/|https?:\/\/)/i;

function inline(text, keyPrefix) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|\*[^*\n]+\*|\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  let m;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyPrefix}-${i++}`;
    if (tok.startsWith("**")) {
      out.push(<strong key={key}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("*")) {
      out.push(<em key={key}>{tok.slice(1, -1)}</em>);
    } else {
      const [, label, url] = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(tok);
      if (!SAFE_LINK.test(url)) out.push(label);
      else if (url.startsWith("/"))
        out.push(
          <Link key={key} to={url} className="text-primary-500 underline hover:text-primary-700">
            {label}
          </Link>,
        );
      else
        out.push(
          <a
            key={key}
            href={url}
            target={/^https?:/i.test(url) ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="text-primary-500 underline hover:text-primary-700"
          >
            {label}
          </a>,
        );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function withBreaks(text, keyPrefix) {
  return text.split("\n").map((line, i) => (
    <React.Fragment key={`${keyPrefix}-l${i}`}>
      {i > 0 && <br />}
      {inline(line, `${keyPrefix}-l${i}`)}
    </React.Fragment>
  ));
}

export default function RichBody({ text, className = "" }) {
  const blocks = String(text || "")
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className={`space-y-5 text-gray-700 text-lg leading-relaxed ${className}`}>
      {blocks.map((block, i) => {
        const key = `b${i}`;
        const lines = block.split("\n");
        if (block.startsWith("### "))
          return (
            <h3 key={key} className="text-xl md:text-2xl font-semibold text-gray-900 pt-2">
              {inline(block.slice(4), key)}
            </h3>
          );
        if (block.startsWith("## "))
          return (
            <h2 key={key} className="text-2xl md:text-3xl font-bold text-gray-900 pt-4">
              {inline(block.slice(3), key)}
            </h2>
          );
        const img = /^!\[([^\]]*)\]\(([^)\s]+)\)$/.exec(block);
        if (img && SAFE_IMAGE.test(img[2]))
          return (
            <figure key={key}>
              <img src={img[2]} alt={img[1]} loading="lazy" className="w-full rounded-xl" />
              {img[1] && <figcaption className="text-sm text-gray-500 mt-2">{img[1]}</figcaption>}
            </figure>
          );
        if (lines.every((l) => /^[-*] /.test(l)))
          return (
            <ul key={key} className="list-disc pl-6 space-y-2">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.slice(2), `${key}-${j}`)}</li>
              ))}
            </ul>
          );
        if (lines.every((l) => /^\d+\. /.test(l)))
          return (
            <ol key={key} className="list-decimal pl-6 space-y-2">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\d+\. /, ""), `${key}-${j}`)}</li>
              ))}
            </ol>
          );
        if (lines.every((l) => l.startsWith(">")))
          return (
            <blockquote key={key} className="border-l-4 border-primary-500 pl-4 italic text-gray-600">
              {withBreaks(lines.map((l) => l.replace(/^>\s?/, "")).join("\n"), key)}
            </blockquote>
          );
        return <p key={key}>{withBreaks(block, key)}</p>;
      })}
    </div>
  );
}
