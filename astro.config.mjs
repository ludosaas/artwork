import { defineConfig } from 'astro/config';

// Replace `site` with the final custom domain once it's live
// (used for canonical URLs, RSS, and sitemap generation if added later).
export default defineConfig({
  site: 'https://example.com',
  output: 'static',
});
