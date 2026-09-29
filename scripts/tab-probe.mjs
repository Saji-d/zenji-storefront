/* Probe the full tab order to find where the skip link lands */
import { preview } from 'vite'
import { chromium } from 'playwright-core'

const server = await preview({ preview: { port: 4182, strictPort: true } })
const url = server.resolvedUrls.local[0]
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(url, { waitUntil: 'networkidle' })

const sequence = []
for (let i = 0; i < 10; i++) {
  await page.keyboard.press('Tab')
  sequence.push(
    await page.evaluate(() => {
      const el = document.activeElement
      return `${el?.tagName}.${(el?.className || '').toString().split(' ')[0] || '?'} "${(el?.textContent || el?.getAttribute('aria-label') || '').trim().slice(0, 24)}"`
    }),
  )
}
console.log(sequence.map((s, i) => `${i + 1}. ${s}`).join('\n'))

await browser.close()
await server.close()
