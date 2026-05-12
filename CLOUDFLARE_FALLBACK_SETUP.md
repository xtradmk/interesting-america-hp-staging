# GitHub Pages + Cloudflare OAuth (No Netlify) for INTERESTING AMERICA

## Goal
- Production stays on GitHub Pages: `https://xtradmk.github.io/interesting-america-hp/`
- CMS login works via Cloudflare Worker OAuth bridge
- Netlify not required

## 1) Create GitHub OAuth App
GitHub → Settings → Developer settings → OAuth Apps → New OAuth App

- Application name: `INTERESTING AMERICA CMS`
- Homepage URL: `https://xtradmk.github.io/interesting-america-hp/`
- Authorization callback URL: `https://ia-cms-oauth.<your-subdomain>.workers.dev/callback`

Save:
- Client ID
- Client Secret

## 2) Deploy Cloudflare Worker
Create Worker `ia-cms-oauth` and set env vars:
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `ALLOWED_ORIGIN=https://xtradmk.github.io`

Prepared files in this repo:
- `cloudflare/worker.js`
- `cloudflare/wrangler.toml.example`

## 3) Update Decap config
Use Worker auth bridge in `src/admin/config.yml`:

```yml
backend:
  name: github
  repo: xtradmk/interesting-america-hp
  branch: main
  base_url: https://ia-cms-oauth.<your-subdomain>.workers.dev
  auth_endpoint: auth
```

## 4) Push + test
- Push to `main`
- Open: `https://xtradmk.github.io/interesting-america-hp/admin/`
- Click GitHub login
- Edit + publish test change

If this works, you can stay on this setup permanently.

## 5) Contact form backend

The contact form in `src/contact.md` posts to the same Worker under `/contact-submit`.

Set these additional Worker secrets / vars before testing the form:

- `RESEND_API_KEY` (secret)
- `CONTACT_FROM_EMAIL` (verified sender, e.g. `website@interesting.global`)
- `CONTACT_TO_EMAIL=america@interesting.global`
- `ADDITIONAL_ALLOWED_ORIGINS` for any non-GitHub-Pages host you want to accept, e.g. `https://interestingamerica.com`

Behavior after deployment:

- valid inquiry -> email is sent to `america@interesting.global`
- browser is redirected to `/thank-you/`
- invalid or failed submissions return a fallback error page with a link back to the contact form
