// Sätteri (Astro's Markdown engine) plugin. Turns paragraphs that contain only images into figures:
//   one image            -> <figure class="figure">
//   two or more images   -> <div class="gallery"> of figures
// An image title (![alt](file.jpg "caption")) becomes a visible caption.
import { defineHastPlugin } from 'satteri'

const isBlank = (n) => (n.type === 'text' && !n.value.trim()) || (n.type === 'element' && n.tagName === 'br')
const isImg = (n) => n.type === 'element' && n.tagName === 'img'

function figure(img, sizes) {
  const { title, ...properties } = img.properties ?? {}
  // Astro has already packed the image attributes into a marker property at this point.
  const marker = properties.__ASTRO_IMAGE_
  if (typeof marker === 'string') properties.__ASTRO_IMAGE_ = JSON.stringify({ ...JSON.parse(marker), sizes })
  else properties.sizes = sizes
  const children = [{ type: 'element', tagName: 'img', properties, children: [] }]
  if (title)
    children.push({ type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: String(title) }] })
  return { type: 'element', tagName: 'figure', properties: { className: ['figure'] }, children }
}

export default defineHastPlugin({
  name: 'figures',
  element: {
    filter: ['p'],
    visit(node, ctx) {
      const content = node.children.filter((c) => !isBlank(c))
      if (!content.length || !content.every(isImg)) return
      if (content.length === 1) return ctx.replaceNode(node, figure(content[0], '(min-width: 48rem) 44rem, 100vw'))
      ctx.replaceNode(node, {
        type: 'element',
        tagName: 'div',
        properties: { className: ['gallery'], style: `--cols:${Math.min(content.length, 3)}` },
        children: content.map((img) => figure(img, '(min-width: 40rem) 20rem, 100vw')),
      })
    },
  },
})
