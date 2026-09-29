/* eslint-disable no-console */
/**
 * Visual QA pass — renders the production build in headless Chrome at the
 * requested viewports and inspects the LIVE DOM (not source code):
 *   - horizontal overflow (page + element level)
 *   - clipped / cut-off content
 *   - axe-core accessibility violations
 *   - console errors / page errors
 *   - cart interactions (add, qty, subtotal, remove, ESC/focus)
 *   - keyboard behaviour of the size picker
 * Screenshots are written to qa/shots/ for human review.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { preview } from 'vite'
import { chromium } from 'playwright-core'

const VIEWPORTS = [320, 375, 390, 430, 768, 1024, 1280, 1440]
const HEIGHT = 900
const PORT = 4179

const axePath = 'node_modules/axe-core/axe.min.js'
if (!existsSync(axePath)) {
  console.error('axe-core not installed')
  process.exit(1)
}

mkdirSync('qa/shots', { recursive: true })

async function launch() {
  try {
    return await chromium.launch({ channel: 'chrome', headless: true })
  } catch {
    const exe = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
    return await chromium.launch({ executablePath: exe, headless: true })
  }
}

const server = await preview({ preview: { port: PORT, strictPort: true } })
const url = server.resolvedUrls.local[0]
console.log('serving', url)

const browser = await launch()
const report = { viewports: {}, interactions: {}, consoleByViewport: {} }

function summarizeAxe(violations) {
  return violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
  }))
}

for (const width of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width, height: HEIGHT } })
  const consoleMsgs = []
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') {
      consoleMsgs.push(`${m.type()}: ${m.text().slice(0, 300)}`)
    }
  })
  page.on('pageerror', (e) => consoleMsgs.push(`pageerror: ${e.message}`))

  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)

  const overflow = await page.evaluate(() => {
    const doc = document.documentElement
    window.scrollTo(0, 0)
    const pageOverflowX = Math.max(0, doc.scrollWidth - window.innerWidth)
    const offenders = []
    const all = [...document.querySelectorAll('body *')]
    for (const el of all) {
      if (el.closest('[aria-hidden="true"]')) continue
      const r = el.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) continue
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden') continue
      if (r.right > window.innerWidth + 1 || r.left < -1) {
        // contained if a visible ancestor clips its overflow box over the
        // portion of the element that intersects the viewport
        const clipped = el.parentElement ? ancestors(el).some((a) => {
          const acs = getComputedStyle(a)
          if (!/hidden|clip|auto|scroll/.test(acs.overflowX + acs.overflowY)) return false
          const ar = a.getBoundingClientRect()
          return ar.right >= Math.min(r.right, window.innerWidth) - 1 &&
            ar.left <= Math.max(r.left, 0) + 1
        }) : false
        if (!clipped) {
          offenders.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.getAttribute('class') || '').slice(0, 60),
            text: (el.textContent || '').trim().slice(0, 40),
            left: Math.round(r.left),
            right: Math.round(r.right),
          })
        }
      }
      if (offenders.length >= 6) break
    }
    return { pageOverflowX, offenders }

    function ancestors(el) {
      const list = []
      let cur = el.parentElement
      while (cur && cur !== document.body) {
        list.push(cur)
        cur = cur.parentElement
      }
      return list
    }
  })

  const clipped = await page.evaluate(() => {
    const out = []
    for (const el of document.querySelectorAll('body *')) {
      if (el.closest('[aria-hidden="true"]')) continue
      if (el.classList.contains('sr-only')) continue // intentionally clipped
      if (el.children.length > 0) continue
      const text = (el.textContent || '').trim()
      if (!text) continue
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden') continue
      const clipX = el.scrollWidth - el.clientWidth
      const clipY = el.scrollHeight - el.clientHeight
      if ((clipX > 2 && cs.overflowX !== 'visible') || (clipY > 4 && cs.overflowY !== 'visible')) {
        out.push({ text: text.slice(0, 50), clipX, clipY, cls: (el.getAttribute('class') || '').slice(0, 50) })
      }
      if (out.length >= 6) break
    }
    return out
  })

  const tapTargets = await page.evaluate(() => {
    const small = []
    for (const el of document.querySelectorAll('button, a[href]')) {
      if (el.closest('[aria-hidden="true"]')) continue
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden') continue
      if (r.height > 0 && r.height < 22) {
        small.push({ text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40), h: Math.round(r.height) })
      }
    }
    return small
  })

  await page.addScriptTag({ path: axePath })
  const axe = await page.evaluate(() =>
    window.axe.run(document, {
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa'],
      resultTypes: ['violations'],
    }),
  )

  await page.screenshot({ path: `qa/shots/full-${width}.png`, fullPage: true })
  await page.screenshot({ path: `qa/shots/hero-${width}.png` })

  report.viewports[width] = {
    pageOverflowX: overflow.pageOverflowX,
    offenders: overflow.offenders,
    clipped,
    smallTapTargets: tapTargets,
    axeViolations: summarizeAxe(axe.violations),
    axeInapplicable: axe.inapplicable.length,
    passes: axe.passes.length,
  }
  report.consoleByViewport[width] = consoleMsgs
  await page.close()
}

/* ---------- interaction pass at desktop + mobile ---------- */

for (const width of [1440, 375]) {
  const page = await browser.newPage({ viewport: { width, height: HEIGHT } })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text().slice(0, 200))
  })
  const R = {}
  await page.goto(url, { waitUntil: 'networkidle' })

  // quick view: size radio keyboard support (arrow key moves selection)
  await page.locator('article button:has-text("QUICK VIEW")').first().click()
  await page.waitForTimeout(500)
  await page.locator('[role="dialog"] [role="radio"]').first().focus()
  await page.keyboard.press('ArrowRight')
  R.arrowKeyMovesSelection = await page.evaluate(() => {
    const checked = [...document.querySelectorAll('[role="dialog"] [role="radio"]')].filter(
      (r) => r.getAttribute('aria-checked') === 'true',
    )
    return checked.length === 1 && checked[0].textContent.trim() === 'S'
  })

  // add to cart from quick view, then close via ESC
  await page.locator('[role="dialog"] button:has-text("Add to cart")').click()
  await page.waitForTimeout(300)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)

  // open drawer
  await page.locator('header button[aria-label*="Open cart"]').click()
  await page.waitForTimeout(400)
  R.drawerVisible = await page.locator('[role="dialog"]').isVisible()
  R.lineCount = await page.locator('[role="dialog"] li').count()

  // qty up → subtotal should double (A$33.99 × 2)
  await page.locator('[role="dialog"] button[aria-label*="Increase"]').first().click()
  await page.waitForTimeout(200)
  R.subtotalAfterQtyUp = await page
    .locator('[role="dialog"] .subtotal, [role="dialog"] dd')
    .allTextContents()

  // qty down twice → line removed
  await page.locator('[role="dialog"] button[aria-label*="Decrease"]').first().click()
  await page.locator('[role="dialog"] button[aria-label*="Decrease"]').first().click()
  await page.waitForTimeout(200)
  R.emptyAfterRemove = await page.locator('[role="dialog"]').textContent()
  R.emptyAfterRemove = /_EMPTY/i.test(R.emptyAfterRemove || '')

  // re-add, then ESC closes + focus returns to cart button
  // (visibility flips at the 320ms transition end, so wait past it)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(550)
  R.escCloses = !(await page.locator('[role="dialog"]').isVisible())
  R.focusAfterEsc = await page.evaluate(() =>
    (document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName || '').toString(),
  )

  // keyboard: skip link is first tab stop on a fresh page load
  // (blur()+Tab is unreliable: Chrome keeps the blurred element as the
  // sequential focus navigation starting point)
  await page.reload({ waitUntil: 'networkidle' })
  await page.keyboard.press('Tab')
  R.skipLinkFirst = await page.evaluate(() =>
    document.activeElement?.classList.contains('skip-link') ?? false,
  )

  // cart open screenshot at this width
  await page.locator('header button[aria-label*="Open cart"]').click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `qa/shots/cart-${width}.png` })

  R.pageErrors = errors
  report.interactions[width] = R
  await page.close()
}

await browser.close()
await server.close()
writeFileSync('qa/report.json', JSON.stringify(report, null, 2))

// console summary
for (const [w, r] of Object.entries(report.viewports)) {
  const flags = []
  if (r.pageOverflowX > 0) flags.push(`overflowX=${r.pageOverflowX}px`)
  if (r.offenders.length) flags.push(`offenders=${r.offenders.length}`)
  if (r.clipped.length) flags.push(`clipped=${r.clipped.length}`)
  if (r.smallTapTargets.length) flags.push(`smallTap=${r.smallTapTargets.length}`)
  const serious = r.axeViolations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
  if (serious.length) flags.push(`axeSerious=${serious.length}`)
  console.log(`${w}px: ${flags.length ? flags.join(', ') : 'CLEAN'}`)
}
console.log('--- interactions ---')
console.log(JSON.stringify(report.interactions, null, 1))
console.log('--- console errors (any viewport) ---')
for (const [w, msgs] of Object.entries(report.consoleByViewport)) {
  if (msgs.length) console.log(w, msgs.slice(0, 3))
}
console.log('report written to qa/report.json')
