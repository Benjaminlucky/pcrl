// Renders one schema field (see src/cms/schemas.js) as a form control.
import React, { useState } from "react";
import { FaArrowUp, FaArrowDown, FaTrash, FaPlus, FaImage, FaTimes } from "react-icons/fa";
import MediaPicker from "./MediaPicker";
import RichBodyInput from "./RichBodyInput";
import { Btn, IconBtn, Select, TextArea, TextInput } from "./ui";

const asString = (v) => (typeof v === "string" ? v : v == null ? "" : String(v));

function move(arr, i, dir) {
  const next = [...arr];
  const j = i + dir;
  if (j < 0 || j >= next.length) return next;
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function MediaUrlInput({ value, onChange, accept = "image" }) {
  const [open, setOpen] = useState(false);
  const url = asString(value);
  return (
    <div className="flex gap-3 items-start">
      <div className="w-20 h-20 shrink-0 rounded-lg bg-black/50 border border-white/10 overflow-hidden flex items-center justify-center text-gray-600">
        {url ? (
          accept === "video" ? (
            <video src={url} className="w-full h-full object-cover" muted />
          ) : (
            <img src={url} alt="" className="w-full h-full object-contain" />
          )
        ) : (
          <FaImage />
        )}
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <TextInput
          value={url}
          placeholder={accept === "video" ? "Video URL" : "Image URL or /images/…"}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="flex gap-2">
          <Btn size="sm" onClick={() => setOpen(true)}>
            <FaImage /> {url ? "Change" : "Choose"}…
          </Btn>
          {url && (
            <Btn size="sm" variant="ghost" onClick={() => onChange("")}>
              <FaTimes /> Remove
            </Btn>
          )}
        </div>
      </div>
      <MediaPicker
        open={open}
        accept={accept}
        onClose={() => setOpen(false)}
        onPick={(m) => onChange(m.url, m)}
      />
    </div>
  );
}

function ListControls({ index, length, onMove, onRemove }) {
  return (
    <div className="flex gap-0.5 shrink-0">
      <IconBtn title="Move up" disabled={index === 0} onClick={() => onMove(index, -1)}>
        <FaArrowUp className="text-xs" />
      </IconBtn>
      <IconBtn title="Move down" disabled={index === length - 1} onClick={() => onMove(index, 1)}>
        <FaArrowDown className="text-xs" />
      </IconBtn>
      <IconBtn title="Remove" onClick={() => onRemove(index)} className="hover:!text-red-300">
        <FaTrash className="text-xs" />
      </IconBtn>
    </div>
  );
}

// Comma-separated tags, kept as an array.
function TagsInput({ tags, onChange }) {
  const [draft, setDraft] = useState(tags.join(", "));
  return (
    <TextInput
      value={draft}
      placeholder="e.g. market update, lagos, training"
      onChange={(e) => {
        setDraft(e.target.value);
        onChange(
          e.target.value
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean)
            .slice(0, 20),
        );
      }}
    />
  );
}

// A labelled field nested inside a list item or group.
function SubField({ field, value, onChange }) {
  return (
    <div>
      <span className="block text-xs text-gray-400 mb-1">{field.label}</span>
      <FieldInput field={field} value={value} onChange={onChange} />
      {field.hint && <span className="block text-xs text-gray-500 mt-1">{field.hint}</span>}
    </div>
  );
}

export default function FieldInput({ field, value, onChange }) {
  switch (field.kind) {
    case "textarea":
      return <TextArea rows={field.rows || 4} value={asString(value)} onChange={(e) => onChange(e.target.value)} />;

    case "number":
      return (
        <TextInput
          type="number"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        />
      );

    case "select": {
      const current = field.options.find((o) => String(o.value) === String(value)) ?? field.options[0];
      return (
        <Select
          options={field.options}
          value={current.value}
          onChange={(e) => onChange(field.options.find((o) => String(o.value) === e.target.value)?.value)}
        />
      );
    }

    case "link":
      return (
        <TextInput
          list="cms-site-paths"
          placeholder="/about-us or https://…"
          value={asString(value)}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "color":
      return (
        <div className="flex gap-2">
          <input
            type="color"
            value={/^#[0-9a-f]{6}$/i.test(asString(value)) ? value : "#ffffff"}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-12 rounded border border-white/15 bg-transparent cursor-pointer"
          />
          <TextInput placeholder="e.g. #ffffff (empty = default)" value={asString(value)} onChange={(e) => onChange(e.target.value)} />
        </div>
      );

    case "imageUrl":
      return <MediaUrlInput value={value} onChange={(url) => onChange(url)} />;

    case "video":
      return <MediaUrlInput accept="video" value={value} onChange={(url) => onChange(url)} />;

    case "image": {
      const img = value && typeof value === "object" ? value : { url: "", alt: "" };
      return (
        <div className="space-y-2">
          <MediaUrlInput
            value={img.url}
            onChange={(url, media) =>
              onChange({ ...img, url, alt: media?.alt && !img.alt ? media.alt : img.alt })
            }
          />
          <TextInput
            placeholder="Alt text — describe the image"
            value={asString(img.alt)}
            onChange={(e) => onChange({ ...img, alt: e.target.value })}
          />
        </div>
      );
    }

    case "button": {
      const b = value && typeof value === "object" ? value : { label: "", url: "" };
      return (
        <div className="grid sm:grid-cols-2 gap-2">
          <TextInput placeholder="Button text" value={asString(b.label)} onChange={(e) => onChange({ ...b, label: e.target.value })} />
          <TextInput
            list="cms-site-paths"
            placeholder="/sign-up or https://…"
            value={asString(b.url)}
            onChange={(e) => onChange({ ...b, url: e.target.value })}
          />
        </div>
      );
    }

    case "stringList": {
      const items = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2 items-start">
              <TextArea rows={2} value={asString(item)} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} />
              <ListControls
                index={i}
                length={items.length}
                onMove={(idx, dir) => onChange(move(items, idx, dir))}
                onRemove={(idx) => onChange(items.filter((_, j) => j !== idx))}
              />
            </div>
          ))}
          <Btn size="sm" onClick={() => onChange([...items, ""])}>
            <FaPlus /> Add {field.itemLabel?.toLowerCase() || "item"}
          </Btn>
        </div>
      );
    }

    case "list": {
      const items = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  {field.itemLabel || "Item"} {i + 1}
                </span>
                <ListControls
                  index={i}
                  length={items.length}
                  onMove={(idx, dir) => onChange(move(items, idx, dir))}
                  onRemove={(idx) => onChange(items.filter((_, j) => j !== idx))}
                />
              </div>
              {field.fields.map((sub) => (
                <SubField
                  key={sub.name}
                  field={sub}
                  value={item?.[sub.name]}
                  onChange={(v) => onChange(items.map((x, j) => (j === i ? { ...x, [sub.name]: v } : x)))}
                />
              ))}
            </div>
          ))}
          <Btn size="sm" onClick={() => onChange([...items, structuredClone(field.newItem || {})])}>
            <FaPlus /> Add {field.itemLabel?.toLowerCase() || "item"}
          </Btn>
        </div>
      );
    }

    case "datetime": {
      // <input type=datetime-local> works in the editor's local time zone.
      const d = value ? new Date(value) : null;
      const local =
        d && !Number.isNaN(d.getTime())
          ? new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
          : "";
      return (
        <TextInput
          type="datetime-local"
          value={local}
          onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
          className="[color-scheme:dark]"
        />
      );
    }

    case "tags": {
      const tags = Array.isArray(value) ? value : [];
      return (
        <TagsInput tags={tags} onChange={onChange} />
      );
    }

    case "richBody":
      return <RichBodyInput value={asString(value)} onChange={onChange} rows={field.rows || 16} />;

    case "group": {
      const obj = value && typeof value === "object" && !Array.isArray(value) ? value : {};
      return (
        <div className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-3">
          {field.fields.map((sub) => (
            <SubField
              key={sub.name}
              field={sub}
              value={obj[sub.name]}
              onChange={(v) => onChange({ ...obj, [sub.name]: v })}
            />
          ))}
        </div>
      );
    }

    case "text":
    default:
      return <TextInput value={asString(value)} onChange={(e) => onChange(e.target.value)} />;
  }
}
