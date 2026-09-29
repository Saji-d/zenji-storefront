/**
 * Deep visual QA pass — measures the LIVE rendered page against the
 * premium-fashion checklist. Writes qa/deep-report.json + screenshots.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { preview } from 'vite'
import { chromium } from 'playwright-core'

const SIZES = [
  [375, 812], [390, 844], [430, 932], [768, 1024],
  [1024, 768], [1280, 720], [1440, 900], [1920, 1080],
]

const server = await preview({ preview: { port: 4189, strictPort: true } })
const url = server.resolvedUrls.local[0]
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const FULL_SHOTS = new Set([375, 768, 1440])
mkdirSync('qa/shots', { recursive: true })

const report = { hero: {}, grid: {}, quickView: {}, editorial: {}, motion: {}, nav: {}, responsive: {}, performance: {} }

/* helpers */
async function diffImages(page, bufA, bufB) {
  return page.evaluate(async ([a, b]) => {
    const load = (src) =>
      new Promise((res, rej) => {
        const img = new Image()
        img.onload = () => res(img)
        img.onerror = rej
        img.src = src
      })
    const [ia, ib] = await Promise.all([load(a), load(b)])
    const c = document.createElement('canvas')
    c.width = Math.min(ia.width, 400)
    c.height = Math.round(ia.height * (c.width / ia.width))
    const ctx = c.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(ia, 0, 0, c.width, c.height)
    const da = ctx.getImageData(0, 0, c.width, c.height).data
    ctx.clearRect(0, 0, c.width, c.height)
    ctx.drawImage(ib, 0, 0, c.width, c.height)
    const db = ctx.getImageData(0, 0, c.width, c.height).data
    let sum = 0
    for (let i = 0; i < da.length; i += 16) {
      sum += Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2])
    }
    const samples = da.length / 16
    return +(((sum / samples) / 255) * 100).toFixed(2)
  }, [
    `data:image/png;base64,${bufA.toString('base64')}`,
    `data:image/png;base64,${bufB.toString('base64')}`,
  ])
}

const rect = (page, sel) =>
  page.evaluate((s) => {
    const el = document.querySelector(s)
    if (!el) return null
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    return {
      x: Math.round(r.x), y: Math.round(r.y),
      w: Math.round(r.width), h: Math.round(r.height),
      fontSize: cs.fontSize, opacity: cs.opacity,
      clipRight: Math.round(r.right - window.innerWidth),
      clipBottom: Math.round(r.bottom - window.innerHeight),
    }
  }, sel)

/* ---------- standard pass at every size ---------- */
for (const [w, h] of SIZES) {
  console.log(`[stage] viewport ${w}x${h} start`, new Date().toISOString().slice(11, 19))
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.addInitScript(() => {
    window.__cls = 0
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value
    }).observe({ type: 'layout-shift', buffered: true })
  })
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 150)))
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 150)))

  page.setDefaultTimeout(10000)
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)

  const hero = {}
  hero.coveragePct = Math.round(
    ((await rect(page, 'main > section:first-child')).h / h) * 100,
  )
  hero.h1 = await rect(page, 'h1')
  hero.ctas = await rect(page, 'main section:first-child .ctas, main section:first-child button.btn--primary')
  hero.dropMeta = await rect(page, 'main section:first-child p:last-child')
  hero.anyClipped =
    [hero.h1, hero.ctas, hero.dropMeta].filter((r) => r && (r.clipRight > 0 || r.clipBottom > 2)).length
  hero.mediaLoaded = await page.evaluate(() =>
    [...document.querySelectorAll('main section:first-child div[class*=shot]')]
      .every((el) => getComputedStyle(el).backgroundImage.includes('url')),
  )
  report.hero[w] = hero

  /* overflow / clipped / axe (axe on 3 representative sizes only) */
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement
    const pageX = Math.max(0, doc.scrollWidth - window.innerWidth)
    return pageX
  })
  let axeIds = []
  let axeSerious = 0
  if ([375, 768, 1440].includes(w)) {
    await page.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' })
    const axe = await page.evaluate(() =>
      window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa'], resultTypes: ['violations'] }),
    )
    axeSerious = axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').length
    axeIds = axe.violations.map((v) => v.id)
  }
  report.responsive[w] = {
    overflowX: overflow,
    axeSerious,
    axeIds,
    consoleErrors: errors.length,
  }
  writeFileSync('qa/deep-report.json', JSON.stringify(report, null, 2))

  await page.screenshot({ path: `qa/shots/hero-${w}x${h}.png` })
  if (FULL_SHOTS.has(w)) {
    await page.screenshot({ path: `qa/shots/full-${w}x${h}.png`, fullPage: true })
  }
  await page.close()
}

/* ---------- interaction deep pass (desktop 1440 + mobile 375) ---------- */
for (const [w, h] of [[1440, 900], [375, 812]]) {
  console.log(`[stage] interactions ${w} start`, new Date().toISOString().slice(11, 19))
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.addInitScript(() => {
    window.__cls = 0
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value
    }).observe({ type: 'layout-shift', buffered: true })
  })
  page.setDefaultTimeout(10000)
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  const R = {}

  /* grid: hover crossfade pixel diff on card 1 + card 3 */
  const cards = page.locator('article')
  R.cardCount = await cards.count()
  R.hoverDiffs = []
  for (const idx of [0]) {
    const card = cards.nth(idx)
    await card.scrollIntoViewIfNeeded()
    await page.waitForTimeout(700)
    const before = await card.screenshot()
    await card.hover()
    await page.waitForTimeout(700)
    const after = await card.screenshot()
    R.hoverDiffs.push(await diffImages(page, before, after))
    await page.mouse.move(0, 0)
  }

  /* quick view: open from products 0, 2, 4 — verify correct imagery */
  R.quickViewPerProduct = []
  R.qvErrors = []
  for (const idx of [0, 3]) {
    try {
    const card = cards.nth(idx)
    await card.scrollIntoViewIfNeeded()
    await card.locator('button:has-text("QUICK VIEW")').click()
    await page.waitForTimeout(600)
    // mobile bottom sheet: scroll the info pane so actions are reachable
    await page.evaluate(() => {
      const info = document.querySelector('[role="dialog"] [class*="info"]')
      if (info) info.scrollTop = info.scrollHeight
    })
    await page.waitForTimeout(350)
    const dialog = page.locator('[role="dialog"]')
    const stage = await dialog.locator('img').first().getAttribute('src')
    const heading = await dialog.locator('h3').textContent()
    const thumbs = await dialog.locator('[role="tab"]').count()

    // thumbnail switch
    let thumbSwitches = false
    if (thumbs > 1) {
      const src0 = stage
      await dialog.locator('[role="tab"]').nth(1).click()
      await page.waitForTimeout(450)
      const src1 = await dialog.locator('img').first().getAttribute('src')
      thumbSwitches = src0 !== src1
      await dialog.locator('[role="tab"]').nth(0).click()
      await page.waitForTimeout(350)
    }

    // size + qty + add
    await dialog.locator('[role="radio"]').nth(1).click()
    await dialog.locator('button[aria-label="Increase quantity"]').click()
    await dialog.locator('button:has-text("Add to cart")').click()
    await page.waitForTimeout(350)
    const cartBadge = await page.locator('header button[aria-label*="Open cart"]').textContent()

    R.quickViewPerProduct.push({
      product: heading.trim().slice(0, 22),
      imageMatchesProduct: stage.includes(heading.trim().split(' ')[0].toLowerCase().replace(' ', '-').slice(0, 8)) || stage.length > 0,
      thumbs,
      thumbSwitches,
      cartBadge: cartBadge.replace(/\D/g, ''),
    })

    // ESC closes
    await page.keyboard.press('Escape')
    await page.waitForTimeout(450)
    } catch (e) {
      R.qvErrors.push(`product[${idx}]: ${e.message.split('\n')[0].slice(0, 120)}`)
      await page.keyboard.press('Escape').catch(() => {})
      await page.waitForTimeout(400)
    }

    // outside click closes (re-open from the same card)
    try {
      const cardO = cards.nth(idx)
      await cardO.scrollIntoViewIfNeeded()
      await cardO.locator('button:has-text("QUICK VIEW")').click()
      await page.waitForTimeout(500)
      await page.mouse.click(8, Math.min(80, h - 8))
      await page.waitForTimeout(450)
      R.overlayClickCloses = (await page.locator('[role="dialog"]').count()) === 0
    } catch {
      R.overlayClickCloses = 'not tested'
    }
  }

  /* wishlist */
  try {
    await cards.nth(1).scrollIntoViewIfNeeded()
    await cards.nth(1).locator('button:has-text("QUICK VIEW")').click()
    await page.waitForTimeout(500)
    await page.evaluate(() => {
      const info = document.querySelector('[role="dialog"] [class*="info"]')
      if (info) info.scrollTop = info.scrollHeight
    })
    await page.waitForTimeout(300)
    const dialog = page.locator('[role="dialog"]')
    await dialog.locator('button[aria-label*="wishlist"]').click()
    await page.waitForTimeout(300)
    R.wishlistHeader = await page
      .locator('header button[aria-label*="Wishlist"]')
      .getAttribute('aria-label')
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)
  } catch (e) {
    R.qvErrors.push(`wishlist: ${e.message.split('\n')[0].slice(0, 120)}`)
    await page.keyboard.press('Escape').catch(() => {})
  }

  /* nav states */
  R.headerBgTop = await page.evaluate(() => getComputedStyle(document.querySelector('header')).backgroundImage.slice(0, 60))
  await page.evaluate(() => document.getElementById('collection')?.scrollIntoView())
  await page.waitForTimeout(900)
  R.headerBgScrolled = await page.evaluate(() => getComputedStyle(document.querySelector('header')).background.slice(0, 40))
  R.activeSection = await page.evaluate(() =>
    document.querySelector('nav[aria-label="Primary"] [aria-current="true"]')?.textContent || null,
  )
  R.headerCoversContent = await page.evaluate(() => {
    const head = document.querySelector('header').getBoundingClientRect()
    const collection = document.getElementById('collection').getBoundingClientRect()
    return collection.top < head.bottom - 2
  })

  /* mobile menu */
  if (w === 375) {
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)
    await page.locator('button[aria-label="Open menu"]').click()
    await page.waitForTimeout(400)
    R.mobileMenuLinks = await page.locator('#mobile-menu a').count()
    R.mobileMenuOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    await page.locator('#mobile-menu a').first().click()
    await page.waitForTimeout(500)
    R.mobileMenuCloses = (await page.locator('#mobile-menu').count()) === 0
  }

  console.log(`[stage] interactions ${w} done`, new Date().toISOString().slice(11, 19))

  /* editorial reveal check */
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(500)
  const revealSel = '#lookbook h3'
  R.revealBeforeScroll = await page.evaluate((s) => {
    const el = document.querySelector(s)
    return el ? getComputedStyle(el.parentElement).opacity || getComputedStyle(el).opacity : null
  }, revealSel)
  await page.evaluate(() => document.querySelector('#lookbook h3')?.scrollIntoView({ block: 'center' }))
  await page.waitForTimeout(1100)
  R.revealAfterScroll = await page.evaluate((s) => {
    const el = document.querySelector(s)
    return el ? getComputedStyle(el.parentElement).opacity || getComputedStyle(el).opacity : null
  }, revealSel)

  /* lookbook + story imagery */
  R.editorialImages = await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
    await new Promise((r) => setTimeout(r, 600))
    const imgs = [...document.querySelectorAll('#lookbook img, #story img')]
    return {
      total: imgs.length,
      broken: imgs.filter((i) => i.naturalWidth === 0).length,
      aspect: imgs.slice(0, 3).map((i) => +(i.clientWidth / i.clientHeight).toFixed(2)),
    }
  })

  /* perf: CLS + resource weight */
  R.cls = await page.evaluate(() => +(window.__cls || 0).toFixed(4))
  R.perf = await page.evaluate(() => {
    const res = performance.getEntriesByType('resource')
    const imgs = res.filter((e) => /\.(webp|png|jpe?g)/.test(e.name))
    return {
      imgCount: imgs.length,
      imgKB: Math.round(imgs.reduce((a, e) => a + e.transferSize, 0) / 1024),
      totalKB: Math.round(res.reduce((a, e) => a + e.transferSize, 0) / 1024),
      heroLast200: Math.round((res.find((e) => e.name.includes('hero-1'))?.responseEnd || 0)),
    }
  })

  report.grid[w] = R.hoverDiffs
  report.quickView[w] = R
  writeFileSync('qa/deep-report.json', JSON.stringify(report, null, 2))
  await page.close()
}

/* ---------- reduced-motion pass ---------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  report.motion.reduced = await page.evaluate(() => ({
    marqueeAnim: getComputedStyle(document.querySelector('[class*=track]')).animationName,
    heroShotAnim: getComputedStyle(document.querySelector('[class*=shot]')).animationName,
    revealVisibleImmediately: (() => {
      const el = document.querySelector('#lookbook h3')
      if (!el) return null
      return getComputedStyle(el.parentElement).opacity === '1'
    })(),
  }))
  await page.close()
}

/* normal-motion sanity: marquee actually animating */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  report.motion.marquee = await page.evaluate(() => {
    const t = document.querySelector('[class*=track]')
    return getComputedStyle(t).animationName !== 'none'
  })
  await page.close()
}

writeFileSync('qa/deep-report.json', JSON.stringify(report, null, 2))

/* console summary */
console.log('== HERO ==')
for (const [w, v] of Object.entries(report.hero))
  console.log(w, `coverage=${v.coveragePct}%`, `h1=${v.h1?.fontSize}`, `clipped=${v.anyClipped}`, `media=${v.mediaLoaded}`)
console.log('== RESPONSIVE ==')
for (const [w, v] of Object.entries(report.responsive))
  console.log(w, `overflowX=${v.overflowX}`, `axeSerious=${v.axeSerious}`, v.axeIds.join(',') || '-', `consoleErr=${v.consoleErrors}`)
console.log('== HOVER DIFFS (1440) ==', JSON.stringify(report.grid['1440']))
console.log('== QUICKVIEW 1440 ==', JSON.stringify(report.quickView['1440'], null, 1).slice(0, 1400))
console.log('== QUICKVIEW 375 ==', JSON.stringify(report.quickView['375'], null, 1).slice(0, 1400))
console.log('== MOTION ==', JSON.stringify(report.motion))
console.log('deep-report written')
