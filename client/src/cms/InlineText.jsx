// src/cms/InlineText.jsx
// Renders editable text with two lightweight formatting rules:
//   **words**  → highlighted (<span className={strongClassName}>)
//   new line   → <br />
// Everything is rendered as text (never as HTML).
import React from "react";

function renderLine(line, strongClassName, keyPrefix) {
  return line.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (!part) return null;
    const m = /^\*\*([^*]+)\*\*$/.exec(part);
    if (m) {
      return (
        <span key={`${keyPrefix}-${i}`} className={strongClassName || undefined}>
          {m[1]}
        </span>
      );
    }
    return <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>;
  });
}

export default function InlineText({ text, strongClassName = "font-bold" }) {
  const lines = String(text ?? "").split("\n");
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {renderLine(line, strongClassName, i)}
    </React.Fragment>
  ));
}
