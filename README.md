# maximilian-walz.com

My personal site: the things I make in my free time. Static, built with [Astro](https://astro.build).

## Add a post

```sh
npm run new "Wooden Mallet"
```

This creates `src/content/posts/wooden-mallet/index.md`. Put the photos in the same folder and name the main one `cover.jpg`.

```markdown
---
title: "Wooden Mallet"
date: 2025-06-21
tags: ["Woodworking"]
summary: "I built a mallet to use with my chisels."
favorite: true      # optional: show under "My Favorites" on the home page
draft: true         # optional: visible in `npm run dev` only
---

Text in plain Markdown.

![A single image becomes a figure](./engraving.jpg "Optional caption")

![Images on consecutive lines](./a.jpg)
![become a gallery](./b.jpg)
```

- Image sizes, formats and dimensions are handled by the build.
- On commit, images are downsized to 3000 px and all metadata (EXIF, GPS) is removed. CI fails if an image slipped past that.
- Need more than Markdown in one post? Rename it to `index.mdx` and add `@astrojs/mdx`.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Local preview with live reload |
| `npm run build` | Build the site into `dist/` |
| `npm run check` | Image check plus build, as CI runs it |
| `npm run images` | Downsize and strip metadata from all content images |

## Deploy

`.github/workflows/deploy.yml` builds every push. Deploying is off until the repository variable `DEPLOY_ENABLED` is `true` and the secrets `SSH_HOST`, `SSH_USER`, `SSH_KEY` are set. Pushes to `main` go to `httpdocs/production`; a manual run can target `httpdocs/test`.
