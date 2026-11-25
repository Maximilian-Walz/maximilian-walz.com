#!/usr/bin/env node
// Downsizes images and strips all metadata (EXIF, GPS) in place.
//   node scripts/optimize-images.ts [files...]   fix given files (default: all content images)
//   node scripts/optimize-images.ts --check      exit 1 if any image still needs fixing
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import sharp from 'sharp'

const MAX_EDGE = 3000
const ROOTS = ['src/content', 'src/assets']
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp'])

async function walk(dir: string): Promise<string[]> {
  const out: string[] = []
  for (const e of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(p)))
    else if (EXTS.has(extname(e.name).toLowerCase())) out.push(p)
  }
  return out
}

const args = process.argv.slice(2)
const check = args.includes('--check')
let files = args.filter((a) => !a.startsWith('--') && EXTS.has(extname(a).toLowerCase()))
if (!files.length) files = (await Promise.all(ROOTS.map(walk))).flat()

const bad: string[] = []
for (const file of files) {
  const input = await readFile(file)
  const meta = await sharp(input).metadata()
  const tooBig = Math.max(meta.width, meta.height) > MAX_EDGE
  const hasMeta = Boolean(meta.exif || meta.xmp || meta.iptc || (meta.orientation ?? 1) !== 1)
  if (!tooBig && !hasMeta) continue
  bad.push(file)
  if (check) continue
  let img = sharp(input)
    .rotate() // bake in EXIF orientation before metadata is dropped
    .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
  const ext = extname(file).toLowerCase()
  if (ext === '.png') img = img.png({ compressionLevel: 9 })
  else if (ext === '.webp') img = img.webp({ quality: 90 })
  else img = img.jpeg({ quality: 88, mozjpeg: true })
  await writeFile(file, await img.toBuffer())
  console.log(`optimized ${file}`)
}

if (check && bad.length) {
  console.error(`These images are too large or contain metadata (run "npm run images"):\n  ${bad.join('\n  ')}`)
  process.exit(1)
}
