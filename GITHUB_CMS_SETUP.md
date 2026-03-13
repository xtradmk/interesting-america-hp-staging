# GitHub-first Decap CMS Setup

Decap is now configured to use GitHub directly (`backend.name = github`) and GitHub Pages is the primary deployment target.

## 1) Create GitHub OAuth App (one-time)

GitHub → Settings → Developer settings → OAuth Apps → New OAuth App

Use:
- **Application name**: INTERESTING AMERICA CMS
- **Homepage URL**: `https://xtradmk.github.io/interesting-america-hp/`
- **Authorization callback URL**: `https://xtradmk.github.io/interesting-america-hp/admin/`

After creating, copy the **Client ID**.

## 2) Add Client ID to Decap config

Edit `src/admin/config.yml`:

```yml
backend:
  name: github
  repo: xtradmk/interesting-america-hp
  branch: main
  auth_type: pkce
  app_id: "YOUR_GITHUB_OAUTH_APP_CLIENT_ID"
```

Replace with your actual Client ID, commit, and push.

## 3) Use CMS

Open:
- `https://xtradmk.github.io/interesting-america-hp/admin/`

Sign in with GitHub and edit content.

## Notes

- Source of truth remains GitHub repo.
- GitHub Actions deploys each push to GitHub Pages.
- Netlify can be reattached later as secondary host without changing source workflow.
