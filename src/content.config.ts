import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const posts = defineCollection({
  // One folder per post: src/content/posts/<slug>/index.md (or .mdx) plus its images.
  loader: glob({
    pattern: '*/index.{md,mdx}',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      summary: z.string().default(''),
      // Optional: defaults to cover.{jpg,png,webp} in the post folder.
      cover: image().optional(),
      favorite: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
})

export const collections = { posts }
