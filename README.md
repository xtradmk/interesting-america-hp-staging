# INTERESTING AMERICA

Professional hotel brokerage website for sports events in the USA.

## About

Part of the INTERESTING SPORTS group. Operating since 2010 with offices in Berlin and Los Angeles.

## Tech Stack

- **Static Site Generator:** 11ty (Eleventy)
- **Templating:** Nunjucks
- **Styling:** Vanilla CSS
- **CMS UI:** Decap CMS (`/admin`)
- **Build:** Node.js/npm

## Development

```bash
npm install
npm run serve
npm run build
```

## Structure

```
src/
├── _data/              # Global data (site.json)
├── _includes/
│   ├── layouts/        # Page layouts
│   ├── modules/        # Reusable content modules
│   ├── header.njk
│   └── footer.njk
├── admin/              # Decap CMS (index.html + config.yml)
├── css/
├── js/
├── images/
├── index.md
├── about.md
├── services.md
└── contact.md
```

## Content Editing

### Option A, CMS UI
- Open: `/admin`
- Edit pages/modules and global settings from a backend-like UI

### Option B, Files
- Edit page frontmatter in `src/*.md`
- Edit global data in `src/_data/site.json`

Available modules: `hero`, `text-block`, `features`, `services-list`, `cta-banner`, `contact-form`

## GitHub Pages Deployment

Workflow is included in:
- `.github/workflows/deploy-pages.yml`

Important:
- GitHub Pages on **private repos** may require a paid plan.
- If Pages is blocked, either:
  1. make repo public, or
  2. use Netlify/Vercel free tier for hosting.

## License

Proprietary – INTERESTING AMERICA
