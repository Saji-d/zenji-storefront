/* Decode real image URLs from _next/image wrapper and map galleries. */
import { writeFileSync } from 'node:fs'
import { chromium } from 'playwright-core'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36',
})

const decode = () =>
  [...document.images]
    .map((im) => im.currentSrc || im.src)
    .filter((s) => s.includes('_next/image'))
    .map((s) => {
      try {
        return decodeURIComponent(new URL(s).searchParams.get('url') || '')
      } catch {
        return ''
      }
    })
    .filter((s) => s.startsWith('http'))

const out = {}
for (const slug of [
  'drop/blue-flame-tee',
  'drop/demon-blood-tee',
  'drop/will-of-the-sun-tee',
  'drop/warrior-spirit-tee',
  'drop/bushido-tee',
  'drop/paradise-spirit-tee',
  'lookbook',
]) {
  try {
    await page.goto(`https://zenji.shop/${slug}`, { waitUntil: 'networkidle', timeout: 45000 })
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1200)
    const urls = [...new Set(await page.evaluate(decode))]
    out[slug] = urls
    console.log(`== ${slug}: ${urls.length}`)
    urls.slice(0, 20).forEach((u) => console.log('  ', u.replace('https://res.cloudinary.com/diqbikizp/image/upload/', '').slice(0, 100)))
  } catch (e) {
    console.log(slug, 'ERR', e.message.slice(0, 60))
    out[slug] = []
  }
}

await browser.close()
writeFileSync('qa/decoded-urls.json', JSON.stringify(out, null, 2))
