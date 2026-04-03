# ZeptoDB Documentation Site

Astro + Starlight documentation site for [ZeptoDB](https://github.com/ZeptoDB/ZeptoDB).

## How It Works

Documentation lives in the main `ZeptoDB/ZeptoDB` repo under `docs/`. This site pulls those docs at build time and renders them with Astro Starlight.

**Auto-deploy flow:**
1. Push docs changes to `ZeptoDB/ZeptoDB` → `docs/**`
2. GitHub Actions triggers `ZeptoDB-site` rebuild via `repository_dispatch`
3. `sync-docs.mjs` copies & transforms docs (adds frontmatter, lowercases filenames)
4. Astro builds static site → deployed to GitHub Pages

## Local Development

```bash
# Sync docs from local ZeptoDB repo
node scripts/sync-docs.mjs ~/zeptodb/docs

# Dev server
pnpm dev

# Build
pnpm build

# Preview
pnpm preview
```

## Setup (one-time)

### 1. GitHub Pages
Enable GitHub Pages in repo settings → Source: GitHub Actions.

### 2. Deploy Token
Create a Personal Access Token (PAT) with `repo` scope.
Add it as `SITE_DEPLOY_TOKEN` secret in the `ZeptoDB/ZeptoDB` repo.

### 3. Trigger Workflow
Copy `trigger-site-build.yml.example` to `ZeptoDB/ZeptoDB/.github/workflows/trigger-site-build.yml`.

## Project Structure

```
├── src/
│   ├── content/
│   │   └── docs/          # Synced from ZeptoDB/docs (generated, don't edit)
│   │       ├── index.mdx  # Custom landing page (edit this)
│   │       └── ko/        # Korean translations
│   ├── content.config.ts  # Starlight content collection config
│   ├── assets/            # Logo SVGs
│   └── styles/brand.css   # ZeptoDB brand colors
├── scripts/
│   └── sync-docs.mjs      # Docs sync script
├── astro.config.mjs        # Starlight config + sidebar
└── .github/workflows/
    └── build-deploy.yml    # CI/CD pipeline
```

## Tech Stack

- [Astro](https://astro.build) v6
- [Starlight](https://starlight.astro.build) v0.38
- [Pagefind](https://pagefind.app) (static search)
- GitHub Pages (hosting)
