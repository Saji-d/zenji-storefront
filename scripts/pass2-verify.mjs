/* Pass-2 verification: mobile quick-view fit, images, reduced motion, badge overlap */
import { preview } from 'vite'
import { chromium } from 'playwright-core'

const server = await preview({ preview: { port: 4195, strictPort: true } })
const url = server.resolvedUrls.local[0]
const browser = await chromium.launch({ channel: 'chrome', headless: true })

/* 1) mobile quick view: action row reachable without inner scrolling (375x812) */
{
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.evaluate(() => document.querySelector('article button[aria-label^="Quick view"]')?.click())
  await page.waitForTimeout(700)
  const fit = await page.evaluate(() => {
    const add = [...document.querySelectorAll('[role="dialog"] button')].find((b) => /add to cart|select a size/i.test(b.textContent || ''))
    if (!add) return { found: false }
    const r = add.getBoundingClientRect()
    const qv = document.querySelector('[role="dialog"] button[aria-label="Increase quantity"]')?.getBoundingClientRect()
    const wish = document.querySelector('[role="dialog"] button[aria-label*="wishlist"]')?.getBoundingClientRect()
    return {
      found: true,
      addTop: Math.round(r.top), addBottom: Math.round(r.bottom),
      addFullyVisible: r.top >= 0 && r.bottom <= window.innerHeight,
      qtyVisible: !!qv && qv.bottom <= window.innerHeight && qv.height > 0,
      wishVisible: !!wish && wish.bottom <= window.innerHeight && wish.height > 0,
    }
  })
  // also verify with the 4-thumb gallery product (worst case, index 3)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('article button[aria-label^="Quick view"]')]
    btns[3]?.click()
  })
  await page.waitForTimeout(700)
  const fit2 = await page.evaluate(() => {
    const add = [...document.querySelectorAll('[role="dialog"] button')].find((b) => /add to cart|select a size/i.test(b.textContent || ''))
    if (!add) return { found: false }
    const r = add.getBoundingClientRect()
    return { found: true, addFullyVisible: r.top >= 0 && r.bottom <= window.innerHeight, addBottom: Math.round(r.bottom) }
  })
  console.log('mobile quickview fit (product 0):', JSON.stringify(fit))
  console.log('mobile quickview fit (product 3, 4 thumbs):', JSON.stringify(fit2))
  await page.close()
}

/* 2) badge overlap: add twice, count DOM badge spans mid-transition */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.locator('article button:has-text("QUICK VIEW")').first().click()
  await page.waitForTimeout(500)
  await page.locator('[role="dialog"] [role="radio"]').first().click()
  await page.locator('[role="dialog"] button:has-text("Add to cart")').click()
  await page.keyboard.press('Escape')
  await page.waitForTimeout(450)
  // sample badge span count at 6 rapid intervals during a second add
  await page.locator('article button:has-text("QUICK VIEW")').nth(1).click()
  await page.waitForTimeout(500)
  await page.locator('[role="dialog"] [role="radio"]').first().click()
  await page.locator('[role="dialog"] button:has-text("Add to cart")').click()
  const samples = []
  for (let i = 0; i < 6; i++) {
    samples.push(await page.evaluate(() => document.querySelectorAll('header [class*="badge"]').length))
    await page.waitForTimeout(60)
  }
  console.log('badge span count samples during transition (want all 1):', JSON.stringify(samples))
  await page.close()
}

/* 3) reduced motion + image integrity */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const rm = await page.evaluate(() => ({
    marquee: getComputedStyle(document.querySelector('[class*="track"]')).animationName,
    heroShot: getComputedStyle(document.querySelector('[class*="shot"]')).animationName,
  }))
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)) }
  })
  await page.waitForTimeout(700)
  const imgs = await page.evaluate(() => {
    const all = [...document.images]
    return { total: all.length, broken: all.filter((i) => i.naturalWidth === 0).length }
  })
  console.log('reduced motion:', JSON.stringify(rm), '| images:', JSON.stringify(imgs))
  await page.close()
}

await browser.close()
await server.close()
