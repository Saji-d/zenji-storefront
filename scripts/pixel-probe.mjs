/* Pixel-level perceptual analysis of QA screenshots (canvas in headless Chrome). */
import { readFileSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright-core'

const files = process.argv.slice(2)
if (files.length === 0) {
  console.error('usage: node scripts/pixel-probe.mjs img1 img2 ...')
  process.exit(1)
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage()
await page.goto('about:blank')

// all pixel work happens inside the browser; only aggregates cross the boundary
async function analyzeInBrowser(src) {
  return page.evaluate(async (dataUrl) => {
    const img = new Image()
    img.src = dataUrl
    await img.decode()
    const c = document.createElement('canvas')
    const scale = Math.min(1, 1200 / img.naturalWidth)
    c.width = Math.round(img.naturalWidth * scale)
    c.height = Math.round(img.naturalHeight * scale)
    const ctx = c.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(img, 0, 0, c.width, c.height)
    const { data: d, width: w, height: h } = ctx.getImageData(0, 0, c.width, c.height)

    const step = 4
    const keys = new Map()
    let dark = 0, bright = 0, n = 0, lumSum = 0
    const bands = Array.from({ length: 10 }, () => ({ lum: 0, accent: 0, count: 0 }))
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const i = (y * w + x) * 4
        const r = d[i], g = d[i + 1], b = d[i + 2]
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
        lumSum += lum
        n++
        if (lum < 40) dark++
        if (lum > 200) bright++
        const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4)
        keys.set(key, (keys.get(key) || 0) + 1)
        const band = bands[Math.min(9, Math.floor((y / h) * 10))]
        band.lum += lum
        band.count++
        const max = Math.max(r, g, b), min = Math.min(r, g, b)
        if (max - min > 50 && max > 90) band.accent++
      }
    }
    const top = [...keys.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([k, c2]) => {
        const r = ((k >> 8) & 15) * 17, g = ((k >> 4) & 15) * 17, b = (k & 15) * 17
        const hex = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
        return { hex, share: +((c2 / n) * 100).toFixed(1) }
      })
    return {
      w,
      h,
      avgLum: Math.round(lumSum / n),
      darkShare: +((dark / n) * 100).toFixed(1),
      brightShare: +((bright / n) * 100).toFixed(1),
      topColors: top,
      bands: bands.map((b) => ({
        lum: Math.round(b.lum / b.count),
        accentPct: +((b.accent / b.count) * 100).toFixed(1),
      })),
    }
  }, src)
}

const out = {}
for (const f of files) {
  const b64 = readFileSync(f).toString('base64')
  out[f] = await analyzeInBrowser(`data:image/png;base64,${b64}`)
  console.log('analyzed', f, `${out[f].w}x${out[f].h}`)
}

writeFileSync('qa/pixel-report.json', JSON.stringify(out, null, 2))
await browser.close()
console.log('written qa/pixel-report.json')
