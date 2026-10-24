// src/cms/schemas.js
// Editable fields per section type, used by the dashboard's section editor.
//
// Field kinds:
//   text, textarea, number, select (options), link (URL string),
//   imageUrl (URL string + media picker), image ({url, alt}),
//   video (URL string + media picker), button ({label, url, variant}),
//   stringList (array of strings), list (array of objects; `fields` inside),
//   group (one object; `fields` inside), color
//
// Any field may have a `hint` shown under it in the editor.
//
// Built-in sections: `defaults` are the component's built-in content and
// only changed fields are stored. Generic blocks: everything is stored.
// A section type without a schema can be moved/hidden but its text is still
// in the component code.
import { BUILT_IN_SCHEMAS } from "./builtInSchemas";

const button = (name, label) => ({ name, label, kind: "button" });
const ALIGN = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
];
const BUTTON_LIST = {
  kind: "list",
  itemLabel: "Button",
  newItem: { label: "Learn more", url: "/", variant: "primary" },
  fields: [
    { name: "label", label: "Label", kind: "text" },
    { name: "url", label: "Link (/page or https://…)", kind: "link" },
    {
      name: "variant",
      label: "Style",
      kind: "select",
      options: [
        { value: "primary", label: "Solid red" },
        { value: "outline", label: "Outline" },
      ],
    },
  ],
};

export const SECTION_SCHEMAS = {
  // ---- Built-in sections (see builtInSchemas.js) ----------------------
  ...BUILT_IN_SCHEMAS,

  // ---- Generic blocks (can be added to any page) --------------------------
  RichText: {
    generic: true,
    title: "Text",
    description: "Heading, paragraphs and buttons",
    defaults: {},
    template: { heading: "New section", body: "Write your text here.", align: "left", buttons: [] },
    fields: [
      { name: "eyebrow", label: "Small label above heading", kind: "text" },
      { name: "heading", label: "Heading", kind: "text" },
      { name: "body", label: "Text (blank line = new paragraph)", kind: "textarea", rows: 8 },
      { name: "align", label: "Alignment", kind: "select", options: ALIGN },
      { name: "buttons", label: "Buttons", ...BUTTON_LIST },
    ],
  },
  ImageText: {
    generic: true,
    title: "Image + text",
    description: "Picture beside a heading and text",
    defaults: {},
    template: {
      heading: "New section",
      body: "Write your text here.",
      image: { url: "", alt: "" },
      imagePosition: "right",
    },
    fields: [
      { name: "eyebrow", label: "Small label above heading", kind: "text" },
      { name: "heading", label: "Heading", kind: "text" },
      { name: "body", label: "Text", kind: "textarea", rows: 7 },
      { name: "image", label: "Image", kind: "image" },
      {
        name: "imagePosition",
        label: "Image side",
        kind: "select",
        options: [
          { value: "right", label: "Right" },
          { value: "left", label: "Left" },
        ],
      },
      button("button", "Button"),
    ],
  },
  CallToAction: {
    generic: true,
    title: "Call to action",
    description: "Bold banner with buttons",
    defaults: {},
    template: {
      heading: "Ready to get started?",
      body: "",
      buttons: [{ label: "Join now", url: "/sign-up", variant: "primary" }],
    },
    fields: [
      { name: "heading", label: "Heading", kind: "text" },
      { name: "body", label: "Text", kind: "textarea" },
      { name: "backgroundImage", label: "Background image (optional)", kind: "image" },
      { name: "buttons", label: "Buttons", ...BUTTON_LIST },
    ],
  },
  Gallery: {
    generic: true,
    title: "Gallery",
    description: "Grid of images",
    defaults: {},
    template: { heading: "Gallery", columns: 3, images: [] },
    fields: [
      { name: "eyebrow", label: "Small label above heading", kind: "text" },
      { name: "heading", label: "Heading", kind: "text" },
      {
        name: "columns",
        label: "Columns",
        kind: "select",
        options: [
          { value: 2, label: "2" },
          { value: 3, label: "3" },
          { value: 4, label: "4" },
        ],
      },
      {
        name: "images",
        label: "Images",
        kind: "list",
        itemLabel: "Image",
        newItem: { url: "", alt: "", caption: "" },
        fields: [
          { name: "url", label: "Image", kind: "imageUrl" },
          { name: "alt", label: "Alt text (describe the image)", kind: "text" },
          { name: "caption", label: "Caption", kind: "text" },
        ],
      },
    ],
  },
  Video: {
    generic: true,
    title: "Video",
    description: "Uploaded MP4/WebM video",
    defaults: {},
    template: { heading: "", url: "", poster: "" },
    fields: [
      { name: "heading", label: "Heading", kind: "text" },
      { name: "url", label: "Video", kind: "video" },
      { name: "poster", label: "Cover image", kind: "imageUrl" },
    ],
  },
  Spacer: {
    generic: true,
    title: "Spacer",
    description: "Empty vertical space",
    defaults: {},
    template: { height: 48 },
    fields: [{ name: "height", label: "Height (px, max 400)", kind: "number" }],
  },
};

export const GENERIC_TYPES = Object.entries(SECTION_SCHEMAS)
  .filter(([, s]) => s.generic)
  .map(([type, s]) => ({ type, title: s.title, description: s.description }));

export const STYLE_FIELDS = [
  { name: "backgroundColor", label: "Background colour", kind: "color" },
  { name: "color", label: "Text colour", kind: "color" },
  { name: "paddingTop", label: "Space above (e.g. 40px)", kind: "text" },
  { name: "paddingBottom", label: "Space below (e.g. 40px)", kind: "text" },
];
