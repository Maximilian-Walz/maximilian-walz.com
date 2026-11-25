#!/usr/bin/env node
// Scaffolds a new post:  npm run new "Wooden Mallet"
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const title = process.argv.slice(2).join(' ').trim()
if (!title) {
  console.error('Usage: npm run new "Post title"')
  process.exit(1)
}
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const dir = join('src/content/posts', slug)
if (existsSync(dir)) {
  console.error(`${dir} already exists`)
  process.exit(1)
}
mkdirSync(dir, { recursive: true })
writeFileSync(
  join(dir, 'index.md'),
  `---
title: ${JSON.stringify(title)}
date: ${new Date().toISOString().slice(0, 10)}
tags: []
summary: ""
draft: true
---

Write here. Put your photos in this folder; name the main one cover.jpg.

![Describe the photo](./example.jpg)
`,
)
console.log(`Created ${dir}/index.md\nAdd cover.jpg (and more photos) to that folder, then run "npm run dev".`)
