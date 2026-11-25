import { defineConfig } from 'astro/config'
import { satteri } from '@astrojs/markdown-satteri'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import figures from './src/plugins/figures.mjs'

export default defineConfig({
  site: 'https://maximilian-walz.com',
  trailingSlash: 'always',
  // HTML whitespace rules: a line break before an inline element stays a space (the 'jsx' default drops it).
  compressHTML: true,
  integrations: [sitemap({ filter: (page) => !page.includes('/variants/') })],
  vite: { plugins: [tailwindcss()] },
  image: { layout: 'constrained' },
  markdown: {
    processor: satteri({ hastPlugins: [figures] }),
    shikiConfig: { theme: 'github-dark-default' },
  },
})
