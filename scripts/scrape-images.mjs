/**
 * Discover and download public product/lookbook photography from zenji.shop
 * (public Shopify CDN) into public/products and public/lookbook.
 * Reads only publicly served images; no site code or copy is copied.
 */
import { mkdirSync, writeFileSync, statSync } from 'node:fs'
import { chromium } from 'playwright-core'

const PRODUCT_PAGES = [
  'drop/blue-flame-tee',
  'drop/demon-blood-tee',
  'drop/will-of-the-sun-tee',
  'drop/warrior-spirit-tee',
  'drop/bushido-tee',
  'drop/paradise-spirit-tee',
]

const EDITORIAL_PAGES = ['lookbook', 'our-story']

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
})

const seen = new Set()
const productImages = {}
const editorialImages = []

function collect() {
  return [...document.images]
    .map((im) => im.currentSrc || im.src)
    .filter((s) => /cdn\.shopify\.com/.test(s) && /\.(png|jpe?g|webp)/i.test(s.split('?')[0]))
}

for (const slug of PRODUCT_PAGES) {
  try {
    await page.goto(`https://zenji.shop/${slug}`, { waitUntil: 'networkidle', timeout: 45000 })
    await page.waitForTimeout(800)
    const imgs = await page.evaluate(collect)
    productImages[slug] = [...new Set(imgs)]
    imgs.forEach((u) => seen.add(u))
    console.log(slug, '→', productImages[slug].length, 'images')
  } catch (e) {
    console.log(slug, 'FAILED', e.message.slice(0, 80))
    productImages[slug] = []
  }
}

for (const slug of EDITORIAL_PAGES) {
  try {
    await page.goto(`https://zenji.shop/${slug}`, { waitUntil: 'networkidle', timeout: 45000 })
    await page.waitForTimeout(800)
    const imgs = await page.evaluate(collect)
    editorialImages.push(...imgs.filter((u) => !seen.has(u)))
    console.log(slug, '→', imgs.length, 'images')
  } catch (e) {
    console.log(slug, 'FAILED', e.message.slice(0, 80))
  }
}

await browser.close()
writeFileSync('qa/scraped-urls.json', JSON.stringify({ productImages, editorialImages }, null, 2))
console.log('unique product URLs:', new Set(Object.values(productImages).flat()).size)
console.log('editorial URLs:', editorialImages.length)

/* ---------- download step ---------- */
mkdirSync('public/products', { recursive: true })
mkdirSync('public/lookbook', { recursive: true })

const slugName = (s) => s.replace('drop/', '').replace('-tee', '')
const download = async (url, dest) => {
  // strip Shopify size suffix for the largest variant, request 1200px webp
  const sized = url.replace(/_(\d+x|x\d+|\d+x\d+)\.(png|jpe?g|webp)/i, '_1200x.webp')
  const tryUrls = [sized, url]
  for (const u of tryUrls) {
    try {
      const res = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      if (!res.ok) continue
      const buf = Buffer.from(await res.arrayBuffer())
      if (buf.length < 15000) continue // skip tiny icons
      writeFileSync(dest, buf)
      return statSync(dest).size
    } catch {
      /* try next */
    }
  }
  return 0
}

let ok = 0
for (const [slug, urls] of Object.entries(productImages)) {
  const name = slugName(slug)
  urls.forEach((u, i) => {
    /* front = first, back/alt = subsequent */
  })
  const dest = `public/products/${name}-${urls.length > 1 ? 'front' : 'front'}.webp`
  const size = urls[0] ? await download(urls[0], dest) : 0
  if (size) ok++
  console.log(dest, size || 'FAILED')
  if (urls[1]) {
    const size2 = await download(urls[1], `public/products/${name}-back.webp`)
    if (size2) ok++
    console.log(`public/products/${name}-back.webp`, size2 || 'FAILED')
  }
}

let lok = 0
for (let i = 0; i < Math.min(editorialImages.length, 8); i++) {
  const dest = `public/lookbook/look-${i + 1}.webp`
  const size = await download(editorialImages[i], dest)
  if (size) lok++
  console.log(dest, size || 'FAILED')
}

console.log(`done: ${ok} product files, ${lok} lookbook files`)
