// config/permissions.js
// The permission catalogue for staff (the Admin collection). Every protected
// staff route checks one of these keys; roles are just named sets of them.
//
// "*" means "every permission, including ones added in future" and is used
// only by the built-in Administrator role.

export const PERMISSION_GROUPS = [
  {
    key: "website",
    label: "Website",
    permissions: [
      { key: "site.view", label: "View pages, menus, settings and drafts" },
      { key: "site.edit", label: "Edit drafts (sections, menus, settings, SEO)" },
      { key: "site.publish", label: "Publish / unpublish website changes" },
      { key: "site.delete", label: "Delete pages" },
    ],
  },
  {
    key: "media",
    label: "Media library",
    permissions: [
      { key: "media.upload", label: "View, upload and edit images & videos" },
      { key: "media.delete", label: "Delete images & videos" },
    ],
  },
  {
    key: "blog",
    label: "Blog",
    permissions: [
      { key: "blog.edit", label: "Write and edit posts" },
      { key: "blog.publish", label: "Publish, schedule and unpublish posts" },
      { key: "blog.delete", label: "Delete posts" },
    ],
  },
  {
    key: "events",
    label: "Events",
    permissions: [
      { key: "events.edit", label: "Create and edit events" },
      { key: "events.publish", label: "Publish, schedule and unpublish events" },
      { key: "events.delete", label: "Delete events" },
    ],
  },
  {
    key: "realtors",
    label: "Realtors",
    permissions: [
      { key: "realtors.view", label: "View realtors (including bank details)" },
      { key: "realtors.edit", label: "Edit realtor records" },
      { key: "realtors.delete", label: "Delete realtors" },
    ],
  },
  {
    key: "mailing",
    label: "Mailing list",
    permissions: [
      { key: "mailing.view", label: "View and export subscribers" },
      { key: "mailing.delete", label: "Remove subscribers" },
    ],
  },
  {
    key: "notifications",
    label: "Birthdays & emails",
    permissions: [
      { key: "birthdays.view", label: "View birthday notifications" },
      { key: "birthdays.run", label: "Trigger birthday emails manually" },
      { key: "emailLogs.view", label: "View the email log" },
    ],
  },
  {
    key: "staff",
    label: "Team & security",
    permissions: [
      { key: "staff.view", label: "View team members and roles" },
      { key: "staff.manage", label: "Add, edit, deactivate and remove team members" },
      { key: "roles.manage", label: "Create and edit roles and their permissions" },
      { key: "audit.view", label: "View the activity log" },
    ],
  },
];

export const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((g) => g.permissions.map((p) => p.key));
export const WILDCARD = "*";

// Built-in roles. "admin" is locked (always everything). "publisher" and
// "editor" start with these permissions — they reproduce the access those
// roles had before RBAC — and can be adjusted in the dashboard afterwards.
export const SYSTEM_ROLES = {
  admin: {
    name: "Administrator",
    description: "Full access to everything, including team and role management.",
    permissions: [WILDCARD],
    locked: true,
  },
  publisher: {
    name: "Publisher",
    description: "Edits and publishes website content, blog posts and events.",
    permissions: [
      "site.view",
      "site.edit",
      "site.publish",
      "media.upload",
      "media.delete",
      "blog.edit",
      "blog.publish",
      "events.edit",
      "events.publish",
    ],
    locked: false,
  },
  editor: {
    name: "Editor",
    description: "Edits website content, posts and events as drafts; cannot publish.",
    permissions: ["site.view", "site.edit", "media.upload", "blog.edit", "events.edit"],
    locked: false,
  },
};

export const isKnownPermission = (p) => p === WILDCARD || ALL_PERMISSIONS.includes(p);
