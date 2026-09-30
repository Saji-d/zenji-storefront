/* Re-encode the existing local campaign images as real WebP.
 *
 * Every file in public/ is named *.webp but contains JPEG bytes (the upstream
 * downloader omitted a WebP Accept header), so the browser content-sniffs and
 * the bytes are far heavier than the extension implies. This transcodes the
 * EXISTING local assets in place — no downloads, no new imagery.
 *
 * Uses headless Chrome as the encoder (canvas.toDataURL) so no new native
 * dependency is introduced.
 */
import { mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { chromium } from 'playwright-core'

const QUALITY = Number(process.env.WEBP_QUALITY ?? 0.84)
const only = process.argv.slice(2)

function walk(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p, acc)
    else if (extname(p).toLowerCase() === '.webp') acc.push(p)
  }
  return acc
}

function isWebp(buf) {
  return buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP'
}

const targets = walk('public').filter((p) => !only.length || only.some((o) => p.includes(o)))
if (!targets.length) {
  console.error('no targets')
  process.exit(1)
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage()
await page.goto('about:blank')

let before = 0
let after = 0
let skipped = 0

for (const file of targets) {
  const src = readFileSync(file)
  before += src.length
  if (isWebp(src)) {
    skipped++
    after += src.length
    continue
  }

  const b64 = src.toString('base64')
  const out = await page.evaluate(
    async ([dataUrl, q]) => {
      const img = new Image()
      img.src = dataUrl
      await img.decode()
      const c = document.createElement('canvas')
      c.width = img.naturalWidth
      c.height = img.naturalHeight
      const ctx = c.getContext('2d', { alpha: false })
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0)
      return c.toDataURL('image/webp', q)
    },
    [`data:image/jpeg;base64,${b64}`, QUALITY],
  )

  const buf = Buffer.from(out.split(',')[1], 'base64')
  if (!isWebp(buf)) throw new Error(`encoder did not produce webp: ${file}`)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, buf)
  after += buf.length
  const rel = file.replace('public\\', '')
  console.log(
    `${rel.padEnd(34)} ${(src.length / 1024).toFixed(0).padStart(5)}KB -> ${(buf.length / 1024).toFixed(0).padStart(5)}KB  (-${Math.round((1 - buf.length / src.length) * 100)}%)`,
  )
}

await browser.close()
console.log(
  `\n${targets.length - skipped} transcoded, ${skipped} already webp` +
    `  |  total ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024 / 1024).toFixed(2)}MB` +
    `  (-${Math.round((1 - after / before) * 100)}%)  quality=${QUALITY}`,
)
