// Article body editor: textarea + formatting help + live preview, plus a
// button to insert an image from the media library.
import React, { useRef, useState } from "react";
import { FaImage } from "react-icons/fa";
import RichBody from "../../../cms/RichBody";
import MediaPicker from "./MediaPicker";
import { Btn, TextArea } from "./ui";

const HELP = [
  ["## Heading", "section heading"],
  ["**bold**", "bold text"],
  ["*italic*", "italic text"],
  ["[text](https://…)", "link"],
  ["- item", "bullet list"],
  ["1. item", "numbered list"],
  ["> quote", "quote"],
  ["blank line", "new paragraph"],
];

export default function RichBodyInput({ value, onChange, rows = 16 }) {
  const [tab, setTab] = useState("write");
  const [picking, setPicking] = useState(false);
  const ref = useRef(null);

  const insertAtCursor = (snippet) => {
    const el = ref.current;
    const start = el ? el.selectionStart : value.length;
    const end = el ? el.selectionEnd : value.length;
    const next = `${value.slice(0, start)}${snippet}${value.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      el.selectionStart = el.selectionEnd = start + snippet.length;
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        {["write", "preview"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize cursor-pointer ${
              tab === t ? "bg-white/15 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
        <Btn size="sm" variant="ghost" className="ml-auto" onClick={() => setPicking(true)}>
          <FaImage /> Insert image
        </Btn>
      </div>

      {tab === "write" ? (
        <TextArea ref={ref} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className="font-mono text-[13px]" />
      ) : (
        <div className="rounded-lg bg-white p-6 max-h-[600px] overflow-y-auto">
          {value.trim() ? <RichBody text={value} /> : <p className="text-gray-400">Nothing to preview yet.</p>}
        </div>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500">
        {HELP.map(([code, label]) => (
          <span key={code}>
            <code className="text-gray-300">{code}</code> {label}
          </span>
        ))}
      </div>

      <MediaPicker
        open={picking}
        onClose={() => setPicking(false)}
        onPick={(m) => insertAtCursor(`\n\n![${m.alt || ""}](${m.url})\n\n`)}
      />
    </div>
  );
}
