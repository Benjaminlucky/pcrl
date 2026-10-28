# PCRG API — Deploying to go54 DirectAdmin + Website CMS reference

The API (this `server/` folder) runs on go54 DirectAdmin. The React site stays
on Netlify and calls the API over HTTPS.

```
 Netlify (pcrginitiative.com)  ──HTTPS──▶  go54 DirectAdmin (api.pcrginitiative.com)
   React site, built-in content             Node.js app (Passenger) ──▶ MongoDB Atlas
   + CMS overrides when available                                    ──▶ Cloudinary (media)
```

---

## 1. One-time setup on DirectAdmin

1. **Subdomain** — DirectAdmin → *Subdomain Management* → create `api`
   (→ `api.pcrginitiative.com`). Point DNS at the go54 server if DNS is not
   managed there.
2. **SSL** — DirectAdmin → *SSL Certificates* → Let's Encrypt for
   `api.pcrginitiative.com`. The Netlify site is HTTPS, so the API **must** be
   HTTPS or browsers block the calls.
3. **Node.js app** — DirectAdmin → *Setup Node.js App* → *Create Application*:
   | Field | Value |
   |---|---|
   | Node.js version | 20 or newer (22 recommended) |
   | Application mode | Production |
   | Application root | `pcrg-api` (folder in your home dir) |
   | Application URL | `api.pcrginitiative.com` |
   | Application startup file | `app.cjs` |
4. **Upload the code** — upload the contents of `server/` into `~/pcrg-api`
   (File Manager zip upload, or `git clone` over SSH).
   **Do not upload** `node_modules/` or `.env`.
5. **Environment variables** — either add them in the Node.js app screen, or
   create `~/pcrg-api/.env` from `.env.example`. **Copy the exact values the
   app uses today** (Railway → *Variables*) — no keys need to change for this
   move. In particular `MONGODB_URI`, `JWT_SECRET` (a different value would log
   every user out) and `RESEND_API_KEY`. Add
   `CORS_ORIGINS=https://pcrginitiative.com,https://www.pcrginitiative.com`.
   Leave the `CLOUDINARY_*` variables empty unless they are set on Railway;
   empty means the app keeps using its current built-in Cloudinary account.
6. **Install dependencies** — click *Run NPM Install* in the app screen.
7. **MongoDB Atlas network access** — Atlas → *Network Access* → add the go54
   server's outbound IP (ask go54 support, or check DirectAdmin's server info).
   Without this the API starts but logs `MongoDB connection error`.
8. **Restart** the app, then open `https://api.pcrginitiative.com/` — expect
   `{"status":"ok", "db":"connected"}`.
9. **Seed the website CMS** (once). In the Node.js app screen, open the
   terminal / "Enter to virtual environment" command over SSH, then:
   ```bash
   cd ~/pcrg-api
   npm run seed:site -- --dry-run   # preview
   npm run seed:site                # create pages/menus/settings (published)
   ```
   Seeding copies today's structure, so the live site looks identical.
   It never modifies documents that already exist.
10. **Point Netlify at the new API** — Netlify → *Site configuration* →
    *Environment variables* → `VITE_API_BASE_URL=https://api.pcrginitiative.com`
    → *Deploys* → *Trigger deploy*. (Vite bakes env vars in at build time, so a
    redeploy is required. `client/.env.production` currently points at Railway —
    update it too so local production builds match.)

### Updating later
Upload changed files → *Restart* in the Node.js app screen. Run *NPM Install*
again only if `package.json` changed.

### Troubleshooting
| Symptom | Fix |
|---|---|
| 503 / "Incomplete response" | Startup crashed — check `~/pcrg-api/stderr.log` (or the app's log in DirectAdmin). Usually a missing env var or `npm install` not run. |
| `ERR_REQUIRE_ESM` | Startup file must be `app.cjs`, not `index.js`. |
| `db: "disconnected"` | Atlas IP allow-list (step 7) or wrong `MONGODB_URI`. |
| Browser shows CORS error | Add the exact site origin (scheme + host, no trailing slash) to `CORS_ORIGINS`. |
| Media upload fails | If you set `CLOUDINARY_*` in `.env`, make sure they match Railway's — or remove them to use the built-in account. |

> The website keeps working if the API is down: every section falls back to
> the content built into the React components.

---

## 2. Team, roles & permissions (RBAC)

Access is controlled by **permissions** (e.g. `site.publish`,
`realtors.view`). A **role** is a named set of permissions, and every staff
member has one role. The full permission list is in
`server/config/permissions.js`.

Built-in roles (created automatically on start-up):

| Role | Starts with |
|---|---|
| **Administrator** (`admin`) | Everything, always — can't be edited or deleted |
| **Publisher** (`publisher`) | Edit + publish website, blog, events; upload/delete media |
| **Editor** (`editor`) | Edit drafts of website, blog, events; upload media |

Publisher and Editor can be adjusted, and you can create your own roles
(e.g. "Realtor Support" with only realtors + mailing list) in the dashboard
under **Roles**. Existing admin accounts keep full access automatically.

**Team** (dashboard → Team) — add people by email: they receive an invitation
to set their own password (72-hour link), or you can set a password for them.
You can change someone's role, deactivate them (they're signed out on their
next action), send a password reset, or remove them.

Safety rules enforced by the server:
- You can only give out roles/permissions you have yourself.
- You can't change your own role, deactivate or delete yourself.
- The last active administrator can't be removed, deactivated or demoted.
- Changes to a role apply instantly to everyone who has it.
- `POST /api/admin/signup` only works to create the **first** account (or with
  the `ADMIN_SIGNUP_SECRET` header); everyone else is added from Team.

**Activity** (dashboard → Activity) — sign-ins, failed sign-ins, and every
team/role change, with who did it and when (kept for one year).

Command-line fallback (from `server/`):
```bash
node scripts/seedCmsRoles.js roles                                   # list role keys
node scripts/seedCmsRoles.js create jane@pcrginitiative.com 'S3cure!pass' editor
node scripts/seedCmsRoles.js set    jane@pcrginitiative.com publisher
```

### Using the dashboard

Log in at `/admin/login`. Staff see **Website** and **Media** in the sidebar.

- **Website** — every page, the navbar, footer links and site settings, each
  marked *Live*, *Draft differs from live* or *Not published*. **New page**
  creates a page at any free address (e.g. `/careers`); add it to the navbar
  in *Main navigation*.
- **Page editor** — the left column is the page top-to-bottom: move ↑↓, show/hide
  (eye), duplicate, delete (only added sections; built-in ones can be hidden),
  **Add section**. The right column edits the selected section or the page's
  SEO. Built-in content is shown as the starting value; edited fields are
  marked *Edited* with **Reset to original**.
- **Save draft** stores work without changing the site. **Preview** opens the
  real site showing your draft (banner at the bottom, *Exit preview*).
  **Publish** (publishers/admins) makes it live immediately. **Discard changes**
  returns the draft to what is live. **History** restores any earlier version
  into the draft.
- **Blog** / **Events** — write posts and events as drafts, then **Publish**
  or **Schedule** them for a future time (publishers/admins). Live items
  appear automatically at `/blog`, `/blog/<address>`, `/events`,
  `/events/<address>` and in the "Upcoming events" / "Latest posts"
  sections of the Blog & Events page (those sections stay invisible until
  something is published). Article text supports `## headings`, `**bold**`,
  `*italic*`, `- lists`, `> quotes`, `[links](https://…)` and images from
  the media library. An item's web address never changes when its title is
  edited — only if you change it yourself. Events disappear from "upcoming"
  once they end and move to "Past events".
- **Media** — drag & drop uploads, alt text, copy URL. Files still used on the
  site can't be deleted by accident.
- Editors and publishers only see the website screens; realtor data stays
  admin-only on the server.

---

## 3. How the website CMS works

Everything editable is a **document** identified by `kind` + `key`:

| kind | key | Controls |
|---|---|---|
| `settings` | `global` | logo, white logo, footer text, mobile-menu text |
| `menu` | `main` | navbar links (`variant`: `link` / `primary` / `outline`) |
| `menu` | `footer` | footer quicklinks |
| `page` | `home`, `for-realtors`, `for-developers`, `academy`, `blog-and-events`, `about-us` | sections + SEO |

**Draft → publish.** Edits always go to the draft. The public site only ever
sees `published`. Every save/publish is kept in revision history (last 100)
and any revision can be restored into the draft.

**Version check.** Every draft write must send the `version` you loaded. If
someone else saved in between you get **409** with `currentVersion` instead of
silently overwriting their work.

**Sections.** A page is an ordered list of sections:
```json
{ "id": "hero", "type": "Hero", "label": "Hero banner", "visible": true,
  "content": { "title": "New headline" }, "style": { "backgroundColor": "#fff" } }
```
- `content` holds **only overrides**. Anything not set keeps the text/image
  built into the React component. Lists (arrays) are replaced as a whole.
- To remove a built-in section, set `visible: false` (built-in sections missing
  from the list are re-added automatically so nothing disappears by accident).
- `style` supports `backgroundColor`, `color`, `paddingTop`, `paddingBottom`.
- Generic section types you can add anywhere:

| type | content fields |
|---|---|
| `RichText` | `eyebrow`, `heading`, `body` (blank line = new paragraph), `align`, `buttons[]` |
| `ImageText` | `heading`, `body`, `image {url, alt}`, `imagePosition` (`left`/`right`), `button` |
| `CallToAction` | `heading`, `body`, `buttons[]`, `backgroundImage {url}` |
| `Gallery` | `heading`, `images[] {url, alt, caption}`, `columns` (2/3/4) |
| `Video` | `heading`, `url`, `poster` |
| `Spacer` | `height` (px) |

  A button is `{ "label": "...", "url": "/sign-up", "variant": "outline" }`.

**Editable content:** every built-in section on all six pages — text,
images, buttons, links, icons and lists (reviews, team members, gallery
photos, partner logos, …). The dashboard shows each section's current
content as the starting value. Field names per section are defined in
`client/src/cms/builtInSchemas.js`; the built-in values live in
`client/src/cms/defaults/`. Two text conventions:
- `**words**` → highlighted (bold or brand red, depending on the spot)
- a new line in a text box → line break

To make a new component editable: put its content in a defaults file, read
it with `useSection(DEFAULTS)` (see `client/src/components/Hero.jsx`), and
add a schema entry in `builtInSchemas.js`.

**Safety nets on the site:** if the API is down or slow (>1.2s on first
visit), built-in content is shown; if a section crashes on bad CMS data it
re-renders with built-in content only. Published changes appear on the next page
load.

---

## 4. API reference

Public (no auth, published content only, cached):
```
GET /api/site/bootstrap            settings + all menus + page list
GET /api/site/pages/:key           one published page (404 = use built-in)
GET /api/site/menus/:key
GET /api/content/blog | /blog/:slug | /events | /events/:slug | /team | /testimonials
GET /sitemap.xml   GET /robots.txt
```

Staff (`Authorization: Bearer <token>`), all under `/api/cms`:
```
GET    /site/documents?kind=page                     list (no content)
POST   /site/documents                               {kind,key,title,path,data}      editor
GET    /site/documents/:kind/:key                    draft + published + version     editor
PUT    /site/documents/:kind/:key                    {version, data?, title?, path?} editor
POST   /site/documents/:kind/:key/discard            {version}  draft := published  editor
POST   /site/documents/:kind/:key/publish            {version?}                      publisher
POST   /site/documents/:kind/:key/unpublish          site falls back to built-in     publisher
DELETE /site/documents/:kind/:key                                                     admin

GET    /site/documents/:kind/:key/revisions
GET    /site/revisions/:revisionId
POST   /site/revisions/:revisionId/restore           {version}  into draft          editor

POST   /site/pages/:key/sections                     {version, section, index?}
PUT    /site/pages/:key/sections/:id                 {version, label?, type?, visible?, content?, style?, mergeContent?}
DELETE /site/pages/:key/sections/:id                 {version}
POST   /site/pages/:key/sections/reorder             {version, order:[ids]}
POST   /site/pages/:key/sections/:id/duplicate       {version, newId?}
GET    /site/preview/:kind/:key                      draft as the site would see it

GET    /media?search=&type=image|video&page=         list
POST   /media   multipart: file, alt?, tags?         images ≤15MB, video ≤100MB     editor
PATCH  /media/:id                                    {alt?, tags?}
DELETE /media/:id[?force=true]                       refuses if still used on site  publisher

/blog, /events, /team, /testimonials                 CRUD + publish/unpublish/schedule
```

Example — change the home hero headline and publish:
```bash
API=https://api.pcrginitiative.com; T=<token>
V=$(curl -s -H "Authorization: Bearer $T" $API/api/cms/site/documents/page/home | jq .version)
curl -X PUT -H "Authorization: Bearer $T" -H "Content-Type: application/json" \
  -d "{\"version\":$V,\"content\":{\"title\":\"New headline\"},\"mergeContent\":true}" \
  $API/api/cms/site/pages/home/sections/hero
curl -X POST -H "Authorization: Bearer $T" $API/api/cms/site/documents/page/home/publish
```
