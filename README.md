# Art Gallery — first iteration

A static Astro site for showcasing artworks with descriptions. Each artwork
is one Markdown file with frontmatter (title, year, medium, price, image,
description...) under `src/content/artworks/`. This structure is deliberate:
it's exactly the shape a git-based CMS form writes to, so wiring up owner
self-editing later (see "Next step" below) is a small addition, not a
rebuild.

**Note on this build:** this sandbox's network policy blocks
`registry.npmjs.org`, so `npm install` / `npm run build` can't be run or
verified from here — the code is written and reviewed by hand, but you are
the first real build. Pinned to Astro 7 (`package.json` requires Node
>=22.12.0, per Astro 7's requirement); the content collection already uses
the Content Layer API (`src/content.config.ts` + `glob()` loader, `.id` not
`.slug`) introduced in v5 and required from v6 onward, so no further
migration should be needed there. If you hit a build error, paste it back
and it'll get fixed directly — this is normal for a first run.

## What's included

- Home page: responsive grid gallery (`src/pages/index.astro`)
- Artwork detail page with a click-to-zoom lightbox and left/right-arrow
  keyboard navigation between pieces (`src/pages/artworks/[slug].astro`)
- About, Contact (mailto-based enquiry form), and a placeholder Legal
  notice / privacy page
- 6 sample artworks with generated placeholder images, so you can see the
  design before adding real work
- `public/admin/config.yml` — the intended editing form for a future
  git-based CMS (Decap/Sveltia). It is **not active yet**; see below.

## Local setup

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

## Before you push real content

- Replace "Studio Name" in `src/layouts/Layout.astro` (site title, page
  title template) and `src/pages/legal.astro`.
- Replace the 6 sample entries in `src/content/artworks/` with real work,
  or edit them in place — same fields, real images in
  `public/images/artworks/`.
- Set `STUDIO_EMAIL` in `src/pages/contact.astro` to the real inbox.
- Set `site:` in `astro.config.mjs` to the final domain.

## Push to GitHub

```bash
git remote add origin https://github.com/ludosaas/REPLACE_WITH_REPO_NAME.git
git branch -M main
git push -u origin main
```

Create the empty repo on GitHub first (ideally under the owner's account,
not yours — see the ownership note from our conversation), then run the
above from this project's folder.

## Deploy on Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → pick the repo.
2. Framework preset: **Astro** (build command `npm run build`, output
   directory `dist`). Add an environment variable `NODE_VERSION` (e.g. `20`)
   if the dashboard doesn't detect it.
3. Deploy. Every push to `main` will rebuild and redeploy automatically.
4. **Custom domain:** in the Pages project → **Custom domains**, add both
   the bare domain and `www`, and set one to redirect to the other so
   there's a single canonical address.

## Next step: connect the CMS (owner self-editing)

Not done in this iteration — the site works standalone, but adding an
artwork still means editing a Markdown file and pushing. To give the owner
a real `/admin` form:

1. Pick Decap CMS or Sveltia CMS (Sveltia is a faster, actively developed
   drop-in for Decap; either reads `public/admin/config.yml`).
2. Deploy the small OAuth login Worker (Sveltia has a ready-made one) so
   GitHub login works without Netlify. Fill in the `backend:` block at the
   top of `public/admin/config.yml` with the real repo and Worker URL.
3. Add `public/admin/index.html` per that CMS's install instructions.
4. Give the owner's GitHub account write access to the repo.

Once that's wired up, the owner logs in at `yourdomain.com/admin`, fills
in the same fields as the sample files above, and publishing an artwork is
a form submission — no code, no GitHub knowledge needed day-to-day.

## Known placeholders to swap out later

- **Images** are procedurally generated abstractions, not real art —
  replace with actual photos of the work (see `public/images/artworks/`).
- **Contact form** opens the visitor's own email client (zero backend, but
  depends on them having one configured). For a commercial site, swap in a
  form service like Formspree or Web3Forms (free tiers) so submissions post
  directly — see the comment in `src/pages/contact.astro`.
- **Legal notice page** is a placeholder checklist, not actual legal text —
  confirm requirements with an accountant/lawyer before going live.
- **Selling mechanism:** this iteration is enquiry-only (a "Enquire about
  this piece" button). Direct checkout (Stripe Payment Links, etc.) can be
  added per-artwork later if wanted.
