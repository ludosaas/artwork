import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// This schema is the contract between the site and the future CMS form.
// Each field here becomes one field in the owner's editing form once the
// git-based CMS (Decap/Sveltia) is wired up — see public/admin/config.yml.
const artworks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artworks' }),
  schema: z.object({
    title: z.string(),
    year: z.string(), // string, not number, so "c. 1998" or "2024" both work
    medium: z.string(), // e.g. "Oil on canvas"
    dimensions: z.string().optional(), // e.g. "80 x 100 cm"
    // Freeform so the owner can write "Inquire", "Sold", or an actual price.
    price: z.string().optional(),
    image: z.string(), // path under /public, e.g. /images/artworks/piece-1.jpg
    imageAlt: z.string().optional(),
    description: z.string(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    // Controls sort order on the gallery grid (lower = earlier). Falls back
    // to file order if omitted.
    order: z.number().optional(),
  }),
});

export const collections = { artworks };
