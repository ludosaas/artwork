import { defineConfig } from 'astro/config';

// Replace `site` with the final custom domain once it's live
// (used for canonical URLs, RSS, and sitemap generation if added later).
export default defineConfig({
  site: 'https://example.com',
  output: 'static',
  // Bind dev/preview to 0.0.0.0 instead of just localhost, so the site is
  // reachable from other devices on the same LAN (e.g. testing on a phone).
  // Astro prints the LAN URL to use when the server starts.
  server: {
    host: true,
  },
});
