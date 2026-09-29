/* Verify every image element resolves with real dimensions. */
import { preview } from 'vite'
import { chromium } from 'playwright-core'

const server = await preview({ preview: { port: 4188, strictPort: true } })
const url = server.resolvedUrls.local[0]
const browser = await chromium.launch({ channel: 'chrome', headless: true })

for (const [w, h] of [[1440, 900], [375, 800]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  const failed = []
  page.on('response', (res) => {
    if (res.status() >= 400) failed.push(`${res.status()} ${res.url().slice(-60)}`)
  })
  await page.goto(url, { waitUntil: 'networkidle' })
  // scroll through the page to trigger all lazy loads
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 90))
    }
  })
  await page.waitForTimeout(800)
  const stats = await page.evaluate(() => {
    const imgs = [...document.images]
    return {
      total: imgs.length,
      loaded: imgs.filter((i) => i.naturalWidth > 0).length,
      broken: imgs.filter((i) => i.naturalWidth === 0).length,
      avgBytes: Math.round(
        performance.getEntriesByType('resource')
          .filter((e) => /\.(webp|png|jpe?g)/.test(e.name))
          .reduce((a, e) => a + e.transferSize, 0) / 1024,
      ),
    }
  })
  console.log(`${w}px:`, JSON.stringify(stats), 'httpErrors:', failed.length ? failed : 'none')
  await page.close()
}

await browser.close()
await server.close()
