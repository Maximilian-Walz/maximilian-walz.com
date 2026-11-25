import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getPosts, site } from '../lib/posts'

export async function GET(context: APIContext) {
  const posts = await getPosts()
  return rss({
    title: site.title,
    description: site.description,
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.summary,
      pubDate: p.data.date,
      categories: p.data.tags,
      link: `/projects/${p.id}/`,
    })),
  })
}
