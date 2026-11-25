# Project notes

Static personal portfolio (Astro 7, Tailwind 4, no client framework). Goals in order: fast, small, easy to add posts.

- Posts: `src/content/posts/<slug>/index.md` with images beside it. Schema in `src/content.config.ts`. The folder name is the URL slug; do not rename existing folders (URLs are public).
- Markdown engine is Sätteri (Astro's default), not remark/rehype. The gallery/figure plugin is `src/plugins/figures.mjs`. After changing a Markdown plugin, delete `.astro/` and `node_modules/.astro/data-store.json`, since rendered posts are cached.
- Images: never commit files with EXIF or larger than 3000 px; `npm run images` fixes them, the pre-commit hook does it automatically, `npm run images:check` verifies. The repo is meant to become public.
- No analytics, no cookies, no third-party requests. The legal page states this; keep it true.
- `compressHTML: true` is deliberate: Astro 7's default (`'jsx'`) removes the space before a link that starts on a new line.
- Design: picture-first, no pill-shaped chips or badges (the owner dislikes them); links and tags are plain text.
- Keep client JS minimal. The only script is the lightbox in `src/pages/projects/[slug].astro`. Page transitions are CSS-only (`@view-transition`); a `view-transition-name` must be unique per page.
- Old URLs (`/blog/<slug>`) are redirected in `public/.htaccess` (Apache host).
- Verify with `npm run check`. When taking headless Chromium screenshots, do not use `--virtual-time-budget`: images render blank with it.
- `src/pages/variants/logo.astro` and `src/assets/logo-{d,e}.svg` are logo proposals, and `src/pages/variants/colors.astro` (with the palette script in `Base.astro` and the `[data-palette]` rules in `global.css`) is a colour preview; both under review; remove once decided.
