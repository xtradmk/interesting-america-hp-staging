# CMS Staging Setup

## Frontend stack

- Eleventy 2
- Nunjucks templates
- vanilla CSS / JS
- static frontend build for staging

## Architecture

- `cms/`: separate Payload CMS app on Next.js
- `cms/` persists content in SQLite
- the Eleventy frontend reads published Payload content via the local Payload API when a CMS database is available
- if no local Payload database is available, the frontend falls back to the seeded content model so the staging frontend still builds
- no production deployment changes are included here

## Main paths

- CMS app: `cms/`
- Payload config: `cms/src/payload.config.mjs`
- collections: `cms/src/collections/`
- globals: `cms/src/globals/`
- shared page renderer: `cms/src/shared/siteRenderer.mjs`
- seeded content model: `cms/src/lib/seedContent.mjs`
- Eleventy CMS loader: `src/_data/cms.js`

## Environment

Copy:

```bash
cp cms/.env.example cms/.env
```

Required in `cms/.env`:

```env
PAYLOAD_SECRET=replace-with-a-long-random-secret
PAYLOAD_PREVIEW_SECRET=replace-with-a-separate-preview-secret
DATABASE_URL=file:./data/website.sqlite
CMS_PUBLIC_SERVER_URL=http://127.0.0.1:3000
NEXT_PUBLIC_FRONTEND_URL=http://127.0.0.1:8080
PAYLOAD_ADMIN_EMAIL=admin@example.com
PAYLOAD_ADMIN_PASSWORD=ChangeMe123!
PAYLOAD_ADMIN_NAME=Interesting America Admin
```

## Important limitation

- the public staging website is hosted on **GitHub Pages**
- GitHub Pages is **static only**
- Payload CMS needs a **server runtime**
- therefore the public staging path `/admin/` is only an info page right now, not the actual Payload admin app
- the working Payload admin currently runs **locally**
- a real public CMS staging URL requires a separate deployment target for the `cms/` app

## First local bootstrap

Run once:

```bash
npm run cms:bootstrap
```

Then start the CMS:

```bash
npm run cms:dev
```

In a second terminal start the frontend:

```bash
npm start
```

## Local URLs

- CMS admin: `http://127.0.0.1:3000/admin`
- draft preview: `http://127.0.0.1:3000/preview/<slug>?secret=<PAYLOAD_PREVIEW_SECRET>`
- frontend: `http://127.0.0.1:8080`
- public staging `/admin/`: info page only

## Login

Use:

- email: `PAYLOAD_ADMIN_EMAIL`
- password: `PAYLOAD_ADMIN_PASSWORD`

## Roles

- `admin`: full access, user management, delete access
- `editor`: content and global editing, no user management escalation

## Editor guide

### Edit a page

1. Log in to `/admin`
2. Open `Pages`
3. Select the page
4. Edit title, SEO, or blocks
5. Save draft or publish

### Add / sort / delete blocks

1. In a page open `Page Blocks`
2. Add a block from the block list
3. Drag to reorder
4. Duplicate or remove as needed
5. Publish when ready

### Replace an image

1. Open `Media`
2. Upload or replace the image
3. Go back to the page or global setting using that media item
4. Select the new media asset
5. Publish

### Edit navigation / footer / SEO

Open the global entries:

- `Header`
- `Footer`
- `SEO Settings`
- `Company Info`
- `Social Links`

## Build commands

- CMS production build:

```bash
npm --prefix cms run build
```

- frontend build:

```bash
npm run build
```

## Test checklist

- [ ] `npm run cms:bootstrap` succeeds
- [ ] `npm run cms:seed` succeeds
- [ ] `npm --prefix cms run build` succeeds
- [ ] `npm run build` succeeds
- [ ] `/admin` loads and redirects to login when logged out
- [ ] `/preview/home?secret=...` returns 200
- [ ] home, about, services, contact, privacy, terms, thank-you render from CMS content
- [ ] footer newsletter still posts to the Worker
- [ ] contact form still posts to the Worker
- [ ] Telegram / Discord notification flow remains server-side
