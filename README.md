# maximilian-walz.com

The source of [maximilian-walz.com](https://maximilian-walz.com), where I show the things I make in my free time: woodworking, metalwork and jewelry, stone carving, analog photography and digital art.

The site is built to be fast, small and easy to add to. It is fully static, ships almost no JavaScript, and makes no third-party requests: no analytics, no cookies, no external fonts.

## How it works

- **[Astro](https://astro.build)** generates plain HTML at build time. Everything is written in TypeScript.
- **Posts** are Markdown files, one folder per project, with the photos right beside the text.
- **Images** are resized and converted at build time, so there is no image server. Before a photo enters the repository it is downsized and stripped of all metadata, including GPS.
- **Styling** is [Tailwind CSS](https://tailwindcss.com). Page transitions are CSS only; the single script on the site is the image lightbox.
- **Hosting** is ordinary static web space. GitHub Actions builds the site and uploads it.

Most of the code was written with [Claude Code](https://claude.com/claude-code). The projects, photos and texts are my own.

## Run it locally

Requires Node.js 22.23 or newer.

```sh
npm install
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Local preview with live reload |
| `npm run build` | Build the site into `dist/` |
| `npm run check` | Image check, type check and build, as CI runs it |
| `npm run new "Title"` | Scaffold a new post |
| `npm run images` | Downsize and strip metadata from all content images |

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
favorite: true      # optional: feature it on the home page
draft: true         # optional: visible in `npm run dev` only
---

Text in plain Markdown.

![A single image becomes a figure](./engraving.jpg "Optional caption")

![Images on consecutive lines](./a.jpg)
![become a gallery](./b.jpg)
```

Image sizes and formats are handled by the build. A new tag needs no setup: it appears as a craft on the home page and in the filter on its own.

## Structure

```
src/content/posts/   one folder per project: index.md and its photos
src/pages/           the pages: home, projects, tags, about, legal
src/components/      tiles, craft filter, header, footer
src/plugins/         turns Markdown images into figures and galleries
scripts/             new-post scaffolding and image clean-up
```

## Licence

The code is released under the [MIT licence](LICENSE). The content — texts, photos and the logo under `src/content` and `src/assets` — is © Maximilian Walz, all rights reserved.
