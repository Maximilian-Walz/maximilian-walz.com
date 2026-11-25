import { getCollection, type CollectionEntry } from 'astro:content'
import type { ImageMetadata } from 'astro'

export type Post = CollectionEntry<'posts'> & { cover: ImageMetadata }

const conventionCovers = import.meta.glob<ImageMetadata>(
  '/src/content/posts/*/cover.{jpg,jpeg,png,webp}',
  { eager: true, import: 'default' },
)

function coverFor(entry: CollectionEntry<'posts'>): ImageMetadata {
  if (entry.data.cover) return entry.data.cover
  const hit = Object.entries(conventionCovers).find(([path]) =>
    path.startsWith(`/src/content/posts/${entry.id}/cover.`),
  )
  if (!hit) throw new Error(`Post "${entry.id}" has no cover: add cover.jpg or set "cover" in the frontmatter.`)
  return hit[1]
}

/** All published posts, newest first. Drafts are visible in dev only. */
export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection('posts', (e) => import.meta.env.DEV || !e.data.draft)
  return entries
    .map((e) => ({ ...e, cover: coverFor(e) }))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export const tagSlug = (tag: string) => tag.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')

export type TagInfo = { name: string; slug: string; count: number; cover: ImageMetadata }

/** Tags with post counts, most used first. Each tag gets a cover image no other tag uses, where possible. */
export function getTags(posts: Post[]): TagInfo[] {
  const map = new Map<string, TagInfo & { posts: Post[] }>()
  for (const post of posts)
    for (const name of post.data.tags) {
      const slug = tagSlug(name)
      const info = map.get(slug)
      if (info) info.posts.push(post)
      else map.set(slug, { name, slug, count: 0, cover: post.cover, posts: [post] })
    }
  const used = new Set<string>()
  // Tags with the fewest posts choose first, since they have the fewest covers to pick from.
  for (const info of [...map.values()].sort((a, b) => a.posts.length - b.posts.length)) {
    info.count = info.posts.length
    const pick = info.posts.find((p) => !used.has(p.id)) ?? info.posts[0]
    used.add(pick.id)
    info.cover = pick.cover
  }
  return [...map.values()]
    .map(({ posts: _, ...tag }) => tag)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })

export const site = {
  title: 'Maximilian Walz',
  description: 'Things I make in my free time: woodworking, metalwork and jewelry, stone carving, analog photography and digital art.',
  email: 'contact@maximilian-walz.com',
  github: 'https://github.com/Maximilian-Walz',
  reddit: 'https://www.reddit.com/user/maximilian-walz',
}
