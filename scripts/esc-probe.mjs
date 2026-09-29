/* Ground-truth probe for ESC-close and skip-link tab order */
import { preview } from 'vite'
import { chromium } from 'playwright-core'

const server = await preview({ preview: { port: 4181, strictPort: true } })
const url = server.resolvedUrls.local[0]
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(url, { waitUntil: 'networkidle' })

// open drawer, then ESC
await page.locator('header button[aria-label*="Open cart"]').click()
await page.waitForTimeout(350)
const openBefore = await page.locator('[role="dialog"]').isVisible()

await page.keyboard.press('Escape')
// sample immediately and at intervals — report the actual behaviour
const samples = []
for (const delay of [0, 50, 200, 400]) {
  if (delay) await page.waitForTimeout(delay === 50 ? 50 : delay - (samples.length ? 50 : 0))
  samples.push(await page.locator('[role="dialog"]').isVisible())
}
console.log('dialog visible before ESC:', openBefore)
console.log('dialog visible after ESC samples [0,50,250,450ms]:', JSON.stringify(samples))

// skip link: blur to body, then Tab
await page.evaluate(() => document.activeElement?.blur?.())
await page.keyboard.press('Tab')
const first = await page.evaluate(() => ({
  cls: document.activeElement?.className || '',
  tag: document.activeElement?.tagName || '',
  text: (document.activeElement?.textContent || '').slice(0, 30),
}))
console.log('first tab stop after blur+Tab:', JSON.stringify(first))

await browser.close()
await server.close()
