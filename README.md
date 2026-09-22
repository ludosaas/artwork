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
- `public/admin/` — Sveltia CMS, set up so you can test the editing form
  locally right now (see below). Publishing from the *live* site still
  needs one more piece (an OAuth login Worker) — see "Next step" below.

## Local setup

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

## Testing the admin locally

Sveltia CMS (the `/admin` form) can be tried out right now, against your
own local copy of this repo, with no GitHub login and no deployment at all:

1. Use a Chromium-based browser — **Chrome, Edge, or Brave**. This relies on
   the File System Access API, which Firefox and Safari don't support.
2. Make sure this folder is a git repo (it already is, if you unzipped the
   project I sent — `git status` should work).
3. Run the dev server: `npm run dev`.
4. Open `http://localhost:4321/admin/index.html`.
5. Click **Work with Local Repository** and, when the browser asks, select
   this project's root folder (the one containing `.git`).
6. You'll see the "Artworks" collection with the same 6 sample entries,
   editable through the form defined in `public/admin/config.yml`. Add,
   edit, or delete one — it writes straight to the Markdown files in
   `src/content/artworks/` on disk.
7. Refresh `http://localhost:4321/` (or check `git status` in another
   terminal) to see the change land. Nothing is committed automatically —
   review and `git commit` the change yourself, same as any other edit.

This is genuinely how the owner will work later too, just swapped from
"pick a local folder" to "log in with GitHub" once the OAuth Worker is
deployed (next section) — the form, fields, and file output are identical.

## Before you push real content

- Site name (Claire Art) and artist name (Claire Taibi) are already set in
  `src/layouts/Layout.astro` and `src/pages/about.astro`.
- Replace the 6 sample entries in `src/content/artworks/` with real work,
  or edit them in place — same fields, real images in
  `public/images/artworks/`.
- Set `STUDIO_EMAIL` in `src/pages/contact.astro` to the real inbox
  (currently a placeholder: `hello@claire-art.example.com`).
- Set `site:` in `astro.config.mjs` to the final domain.

## Push to GitHub

```bash
git remote add origin https://github.com/ludosaas/artwork.git
git branch -M master
git push -u origin master
```

Run this from the project's folder, once the empty `artwork` repo exists
on GitHub (ideally under the owner's account, not yours — see the ownership
note from our conversation).

## Deploy on Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → pick the repo.
2. Framework preset: **Astro** (build command `npm run build`, output
   directory `dist`). Add an environment variable `NODE_VERSION` (e.g. `20`)
   if the dashboard doesn't detect it.
3. Deploy. Every push to `master` will rebuild and redeploy automatically.
4. **Custom domain:** in the Pages project → **Custom domains**, add both
   the bare domain and `www`, and set one to redirect to the other so
   there's a single canonical address.

## Next step: connect the CMS (owner self-editing)

The admin form itself is already in the repo (`public/admin/index.html` +
`config.yml`, pointed at `ludosaas/artwork`) and works locally today — see
"Testing the admin locally" above. What's still missing is letting the
*owner* log in from the live site, since GitHub's login flow needs a small
server-side step a static site can't do on its own:

1. Deploy Sveltia CMS's ready-made OAuth Worker (a free Cloudflare Worker).
2. Uncomment and fill in `base_url:` in `public/admin/config.yml` with that
   Worker's URL.
3. Give the owner's GitHub account write access to the `ludosaas/artwork`
   repo.

Once that's done, the owner logs in at `yourdomain.com/admin` with their
GitHub account instead of picking a local folder — same form, same fields,
same files — and publishing an artwork becomes a form submission.

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
