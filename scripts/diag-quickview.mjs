/* Diagnose pointer interception inside QuickView at 1440 and 375. */
import { preview } from 'vite'
import { chromium } from 'playwright-core'

const server = await preview({ preview: { port: 4191, strictPort: true } })
const url = server.resolvedUrls.local[0]
const browser = await chromium.launch({ channel: 'chrome', headless: true })

for (const [w, h] of [[1440, 900], [375, 812]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)

  await page.locator('article button:has-text("QUICK VIEW")').first().click()
  await page.waitForTimeout(800)

  const info = await page.evaluate(() => {
    const out = {}
    const probe = (label, sel) => {
      const el = document.querySelector(sel)
      if (!el) return (out[label] = 'NOT FOUND')
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const top = document.elementFromPoint(cx, cy)
      out[label] = {
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        hit: top ? `${top.tagName}.${(top.className || '').toString().slice(0, 40)}` : 'null',
        intercepted: top !== el && !el.contains(top),
      }
    }
    probe('closeBtn', '[role="dialog"] button[aria-label="Close quick view"]')
    probe('firstRadio', '[role="dialog"] [role="radio"]')
    probe('qtyPlus', '[role="dialog"] button[aria-label="Increase quantity"]')
    // has-text() is playwright-only; find the add button by text manually
    const addBtn = [...document.querySelectorAll('[role="dialog"] button')].find((b) =>
      /add to cart|select a size/i.test(b.textContent || ''),
    )
    if (addBtn) {
      const r = addBtn.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const top = document.elementFromPoint(cx, cy)
      out.addBtn = {
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        hit: top ? `${top.tagName}.${(top.className || '').toString().slice(0, 40)}` : 'null',
        intercepted: top !== addBtn && !addBtn.contains(top),
      }
    } else out.addBtn = 'NOT FOUND'
    probe('wishBtn', '[role="dialog"] button[aria-label*="wishlist"]')
    probe('firstThumb', '[role="dialog"] [role="tab"]')
    out.dialogRect = (() => {
      const d = document.querySelector('[role="dialog"]')
      const r = d.getBoundingClientRect()
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
    })()
    out.viewport = { w: innerWidth, h: innerHeight }
    return out
  })

  console.log(`\n===== ${w}x${h} =====`)
  console.log(JSON.stringify(info, null, 1))
  await page.close()
}

await browser.close()
await server.close()
