/* Debug: where is focus at each step of the ESC-then-Tab flow? */
import { preview } from 'vite'
import { chromium } from 'playwright-core'

const server = await preview({ preview: { port: 4183, strictPort: true } })
const url = server.resolvedUrls.local[0]
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(url, { waitUntil: 'networkidle' })

const where = (label) =>
  page.evaluate((l) => {
    const el = document.activeElement
    console.log(`[${l}] ${el?.tagName}.${(el?.className || '').toString().slice(0, 30)} "${(el?.textContent || '').trim().slice(0, 20)}"`)
  }, label).then(() => page.on('console', () => {}))

// simpler: evaluate and return
const probe = (label) =>
  page.evaluate((l) => {
    const el = document.activeElement
    return `${l}: ${el?.tagName} ${(el?.className || '').toString().slice(0, 24)} "${(el?.textContent || el?.getAttribute('aria-label') || '').trim().slice(0, 22)}"`
  }, label)

await page.locator('header button[aria-label*="Open cart"]').click()
await page.waitForTimeout(350)
console.log(await probe('after open'))
await page.keyboard.press('Escape')
await page.waitForTimeout(500)
console.log(await probe('after ESC'))
await page.evaluate(() => document.activeElement?.blur?.())
console.log(await probe('after blur'))
await page.keyboard.press('Tab')
console.log(await probe('after Tab'))

await browser.close()
await server.close()
