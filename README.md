# INTERESTING AMERICA Website

Modular 11ty website for INTERESTING AMERICA - Sports Accommodation Solutions.

## Structure

```
src/
├── _data/              # JSON content files (your "CMS backend")
│   ├── navigation.json
│   ├── homepage.json
│   ├── about.json
│   ├── services.json
│   └── contact.json
├── _includes/
│   ├── layouts/        # Base layouts
│   ├── modules/        # Reusable module templates
│   ├── nav.njk
│   └── footer.njk
├── assets/
│   ├── styles.css
│   └── scripts.js
├── images/
├── index.md            # Home (renders modules from homepage.json)
├── about.md            # About (renders modules from about.json)
├── services.md         # Services (renders modules from services.json)
└── contact.md          # Contact (renders modules from contact.json)
```

## Module System

Each page pulls modules from `_data/*.json`. Modules are rendered in order.

**Available modules:**
- `hero` - Full-width hero with headline, text, CTAs
- `features` - 3-column feature grid
- `text-block` - Rich text content block
- `logos` - Client logo grid
- `cta-banner` - Call-to-action banner
- `services-list` - Service cards grid
- `contact-info` - Office locations + contact form

## Adding/Editing Content

1. **Edit JSON data** in `src/_data/*.json`
2. **Add new modules** by creating entries in the JSON arrays
3. **Reorder modules** by changing the `order` value
4. **Create new module types** by adding templates to `src/_includes/modules/`

## Development

```bash
npm install
npm start          # Dev server on http://localhost:8080
npm run build      # Build to _site/
```

## Deployment

Push to GitHub Pages, Netlify, Vercel, or any static host.

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

---

Built with [11ty](https://www.11ty.dev/)
