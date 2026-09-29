/* Isolate the outside-click behavior for cart drawer + quick view. */
import { preview } from 'vite'
import { chromium } from 'playwright-core'

const server = await preview({ preview: { port: 4193, strictPort: true } })
const url = server.resolvedUrls.local[0]
const browser = await chromium.launch({ channel: 'chrome', headless: true })

for (const [w, h, touch] of [[1440, 900, false], [375, 812, true]]) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    hasTouch: touch,
    isMobile: touch,
    userAgent: touch
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      : undefined,
  })
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)

  // --- cart drawer --- (full-width on mobile: no outside area, skip)
  if (!touch) {
  await page.locator('header button[aria-label*="Open cart"]').click()
  await page.waitForTimeout(600)
  const cartVisibleBefore = await page.locator('[role="dialog"][aria-label="Shopping cart"]').isVisible()
  await page.mouse.click(8, Math.floor(h / 2)) // left edge, outside drawer
  await page.waitForTimeout(600)
  const cartVisibleAfter = await page
    .locator('[role="dialog"][aria-label="Shopping cart"]')
    .isVisible()
  } else {
    var cartVisibleBefore = 'n/a (full-width sheet)'
    var cartVisibleAfter = 'n/a'
  }

  // --- quick view --- (headless mobile doesn't match @media (hover:none),
  // so Playwright considers the button invisible — use a DOM click there)
  if (touch) {
    await page.evaluate(() =>
      (document.querySelector('article button[aria-label^="Quick view"]') as HTMLElement)?.click(),
    )
  } else {
    await page.locator('article button:has-text("QUICK VIEW")').first().click()
  }
  await page.waitForTimeout(700)
  const qvVisibleBefore = await page.locator('[role="dialog"]:not([aria-label="Shopping cart"])').isVisible()
  // click far corner (outside panel): top-left area
  await page.mouse.click(6, 6)
  await page.waitForTimeout(600)
  const qvVisibleAfter = await page
    .locator('[role="dialog"]:not([aria-label="Shopping cart"])')
    .isVisible()
    .catch(() => 'gone')

  console.log(
    `${w}${touch ? ' (touch)' : ''}: cart open=${cartVisibleBefore} afterOutsideClick=${cartVisibleAfter} | qv open=${qvVisibleBefore} afterOutsideClick=${qvVisibleAfter}`,
  )
  await ctx.close()
}

await browser.close()
await server.close()
