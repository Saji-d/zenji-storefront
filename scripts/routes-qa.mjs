/* Route-by-route browser QA of the multi-route storefront.
 *
 * Design rules for this script:
 *  - Never build URLs by concatenating a base that already ends in "/"; that
 *    silently requests "//route", which the router correctly renders as 404.
 *  - Assert the app mounted BEFORE any interaction, so a blank screen reports
 *    "app did not render" instead of an opaque locator.click timeout.
 *  - Only assert on controls that are actually visible at the current width
 *    (the desktop nav is display:none below 900px, by design).
 *  - Navigation waits are deterministic: AnimatePresence runs with mode="wait",
 *    so the OUTGOING page stays mounted while it exits. Waiting on "main h1 is
 *    visible" therefore resolves against the old page. Wait for the incoming
 *    heading text instead, then poll real style state until it has settled.
 *  - body has overflow-x:hidden, so documentElement.scrollWidth alone hides
 *    clipped content. Also measure main's own scroll overflow.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { preview } from 'vite'
import { chromium } from 'playwright-core'

const SIZES = [
  [320, 700], [375, 812], [390, 844], [414, 896], [430, 932], [768, 1024],
  [1024, 768], [1280, 720], [1440, 900], [1920, 1080],
]

const ROUTES = [
  '/',
  '/drop',
  '/collection',
  '/collection/the-origin-drop',
  '/collection/marked-down',
  '/collection/final-units',
  '/drop/blue-flame',
  '/drop/demon-blood',
  '/drop/will-of-the-sun',
  '/drop/warrior-spirit',
  '/drop/bushido',
  '/drop/paradise-spirit',
  '/drop/domain-expansion',
  '/drop/free-soul',
  '/drop/limitless',
  '/lookbook',
  '/story',
  '/faq',
  '/wishlist',
  '/cart',
  '/nope',
]

const MOBILE_BREAKPOINT = 900

const server = await preview({ preview: { port: 4197, strictPort: true } })
const BASE = server.resolvedUrls.local[0].replace(/\/+$/, '')
const route = (p) => `${BASE}${p}`

const browser = await chromium.launch({ channel: 'chrome', headless: true })
mkdirSync('qa/shots', { recursive: true })

const report = { viewports: {}, routes: {}, flows: {}, motion: {}, failures: [] }
const FULL_SHOTS = new Set([375, 430, 1440])

function fail(where, msg) {
  report.failures.push(`${where}: ${msg}`)
  console.log(`  !! ${where}: ${msg}`)
}

/** Fail fast and loudly when React never mounted (the blank-screen class of bug). */
async function assertMounted(page, label) {
  const m = await page.evaluate(() => {
    const root = document.getElementById('root')
    return {
      rootChildren: root ? root.childElementCount : -1,
      hasHeader: !!document.querySelector('header'),
      hasMain: !!document.querySelector('main'),
      hasH1: !!document.querySelector('main h1'),
      mainText: (document.querySelector('main')?.textContent ?? '').trim().length,
    }
  })
  if (!m.hasHeader || !m.hasMain || !m.hasH1 || m.mainText === 0) {
    throw new Error(
      `${label}: app did not render (${JSON.stringify(m)}). ` +
        'A blank screen is a build/runtime failure, not a selector problem.',
    )
  }
}

/** Poll real style state until the route transition has actually finished. */
async function settleRoute(page) {
  await page
    .waitForFunction(
      () => {
        const el = document.querySelector('main > *')
        if (!el) return false
        const s = getComputedStyle(el)
        return (
          s.opacity === '1' &&
          (s.transform === 'none' || s.transform === 'matrix(1, 0, 0, 1, 0, 0)')
        )
      },
      null,
      { timeout: 5000 },
    )
    .catch(() => {})
}

/**
 * Wait until the given route has actually finished rendering.
 * AnimatePresence mode="wait" keeps the outgoing page mounted during its exit,
 * so we wait for the incoming heading text rather than mere h1 visibility.
 */
async function waitForRoute(page, expectedPath, headingRe) {
  await page.waitForFunction((p) => location.pathname === p, expectedPath, { timeout: 12000 })
  if (headingRe) {
    await page
      .waitForFunction(
        (src) => new RegExp(src, 'i').test(document.querySelector('main h1')?.textContent || ''),
        headingRe.source,
        { timeout: 12000 },
      )
      .catch(() => {})
  }
  await settleRoute(page)
}

async function openRoute(page, p, headingRe) {
  await page.goto(route(p), { waitUntil: 'networkidle' })
  await assertMounted(page, p)
  await page.locator('main h1').first().waitFor({ state: 'visible' })
  await settleRoute(page)
  if (headingRe) {
    const ok = await page
      .locator('main h1')
      .filter({ hasText: headingRe })
      .first()
      .waitFor({ state: 'visible' })
      .then(() => true)
      .catch(() => false)
    if (!ok) {
      const h1 = await page.locator('main h1').first().textContent()
      fail(p, `expected heading ${headingRe}, got "${h1?.trim()}"`)
    }
  }
}

/**
 * Scroll the whole page so in-view reveals fire, then force every remaining
 * lazy image to load and wait (bounded) for real completion.
 *
 * Chrome defers loading="lazy" images that were scrolled past quickly, so
 * "did the browser happen to fetch this yet" is not a correctness signal. What
 * matters is whether the asset is valid, so promote stragglers to eager and
 * assert on naturalWidth once every image has genuinely completed.
 */
async function loadAllImages(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.7)
    const end = document.documentElement.scrollHeight
    for (let y = 0; y < end; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 30))
    }
    window.scrollTo(0, 0)
    for (const img of document.images) img.loading = 'eager'
  })
  await page
    .waitForFunction(() => [...document.images].every((i) => i.complete), null, {
      timeout: 15000,
    })
    .catch(() => {})
}

/* ---------- viewport sweep: overflow + clipping + images + network + console ---------- */
for (const [w, h] of SIZES) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  page.setDefaultTimeout(12000)
  const errors = []
  const badResponses = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 160)))
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 160)))
  page.on('response', (r) => {
    if (r.status() >= 400) badResponses.push(`${r.status()} ${r.url().replace(BASE, '')}`)
  })

  const routeData = {}
  for (const r of ROUTES) {
    errors.length = 0
    badResponses.length = 0
    await openRoute(page, r)
    await loadAllImages(page)
    await settleRoute(page)

    const info = await page.evaluate(() => {
      const imgs = [...document.images]
      const main = document.querySelector('main')
      return {
        overflowX: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
        // body clips overflow-x, so measure the routed subtree directly
        clippedX: main ? Math.max(0, main.scrollWidth - main.clientWidth) : 0,
        images: imgs.length,
        brokenImgs: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
        pendingImgs: imgs.filter((i) => !i.complete).length,
        videos: document.querySelectorAll('video').length,
        h1: document.querySelector('h1')?.textContent?.trim().slice(0, 60),
        pathname: location.pathname,
        bodyText: document.body.textContent.trim().length,
      }
    })

    const expected404 = r === '/nope'
    if (!expected404 && info.pathname !== r) fail(`${w}px ${r}`, `pathname is "${info.pathname}"`)
    if (expected404 && !/page not found/i.test(info.h1 ?? '')) fail(`${w}px /nope`, `expected 404, got "${info.h1}"`)
    if (info.overflowX > 0) fail(`${w}px ${r}`, `horizontal overflow ${info.overflowX}px`)
    if (info.clippedX > 0) fail(`${w}px ${r}`, `clipped content, main overflows ${info.clippedX}px`)
    if (info.brokenImgs.length) fail(`${w}px ${r}`, `broken images: ${info.brokenImgs.join(', ')}`)
    if (info.pendingImgs) fail(`${w}px ${r}`, `${info.pendingImgs} image(s) never loaded`)
    if (info.videos) fail(`${w}px ${r}`, `unexpected <video> element present`)
    if (badResponses.length) fail(`${w}px ${r}`, `HTTP errors: ${badResponses.join(', ')}`)
    if (errors.length) fail(`${w}px ${r}`, `console errors: ${errors.join(' | ')}`)

    routeData[r] = {
      overflowX: info.overflowX,
      clippedX: info.clippedX,
      images: info.images,
      brokenImgs: info.brokenImgs.length,
      videos: info.videos,
      consoleErrors: errors.length,
      httpErrors: badResponses.length,
      h1: info.h1,
    }

    if (FULL_SHOTS.has(w)) {
      await page.screenshot({
        path: `qa/shots/route-${r.replace(/\//g, '_')}-${w}.png`,
        fullPage: w === 1440,
      })
    }
  }
  report.viewports[w] = routeData

  if ([375, 430, 768, 1440].includes(w)) {
    for (const axeRoute of ['/', '/drop', '/collection', '/drop/blue-flame', '/lookbook', '/story', '/faq', '/cart']) {
      await openRoute(page, axeRoute)
      await page.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' })
      const axe = await page.evaluate(() =>
        window.axe.run(document, {
          runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa'],
          resultTypes: ['violations'],
        }),
      )
      const serious = axe.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      )
      if (!report.viewports[w].axeSerious) {
        report.viewports[w].axeSerious = 0
        report.viewports[w].axeIds = []
        report.viewports[w].axeDetail = {}
      }
      report.viewports[w].axeSerious += serious.length
      for (const v of serious) {
        report.viewports[w].axeIds.push(v.id)
        // keep the failing selectors: a bare violation count is not actionable
        report.viewports[w].axeDetail[`${axeRoute} ${v.id}`] = v.nodes.slice(0, 4).map((n) => ({
          target: n.target,
          why: (n.any?.[0]?.message ?? n.failureSummary ?? '').replace(/\s+/g, ' ').slice(0, 160),
        }))
        fail(`${w}px ${axeRoute}`, `axe ${v.id}: ${v.nodes.length} node(s)`)
      }
    }
  }
  await page.close()
}

/* ---------- interaction flows ---------- */
for (const [w, h] of [[1440, 900], [375, 812]]) {
  const isMobile = w <= MOBILE_BREAKPOINT
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  page.setDefaultTimeout(12000)
  const errors = []
  const badResponses = []
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 160)))
  page.on('response', (r) => {
    if (r.status() >= 400) badResponses.push(`${r.status()} ${r.url().replace(BASE, '')}`)
  })
  const F = {}
  const check = (name, ok, detail = '') => {
    F[name] = ok === true ? true : detail || false
    if (ok !== true) fail(`${w}px flow`, `${name} ${detail}`)
  }

  await openRoute(page, '/')

  /* ---------- navigation: desktop navbar or mobile menu ---------- */
  if (isMobile) {
    const navVisible = await page.locator('nav[aria-label="Primary"]').isVisible()
    check('desktopNavHiddenOnMobile', navVisible === false, `expected hidden, got ${navVisible}`)

    const burger = page.locator('button[aria-label="Open menu"]')
    await burger.waitFor({ state: 'visible' })
    await burger.click()
    const menu = page.locator('#mobile-menu')
    await menu.waitFor({ state: 'visible' })
    F.mobileMenuOverflow = await page.evaluate(
      () => Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
    )
    check('mobileMenuNoOverflow', F.mobileMenuOverflow === 0, `${F.mobileMenuOverflow}px`)
    F.mobileMenuLinks = await page.locator('#mobile-menu a').count()
    // Home + the five primary routes + Cart + Wishlist
    check('mobileMenuLinks', F.mobileMenuLinks === 8, `got ${F.mobileMenuLinks}`)

    await page.locator('#mobile-menu a[href="/lookbook"]').click()
    await waitForRoute(page, '/lookbook', /lookbook/i)
    check('mobileMenuNav', true)
    check('mobileMenuClosesOnNav', (await menu.count()) === 0)

    await openRoute(page, '/')
    await page.locator('button[aria-label="Open menu"]').click()
    await menu.waitFor({ state: 'visible' })
    await page.locator('button[aria-label="Close menu"]').click()
    await menu.waitFor({ state: 'detached' })
    check('mobileMenuCloses', true)
  } else {
    const nav = page.locator('nav[aria-label="Primary"]')
    check('desktopNavVisible', await nav.isVisible())

    for (const [href, heading] of [
      ['/drop', /^the drop$/i],
      ['/collection', /^collections$/i],
      ['/lookbook', /^lookbook$/i],
      ['/story', /^our story$/i],
      ['/faq', /^faq$/i],
    ]) {
      await nav.locator(`a[href="${href}"]`).click()
      await waitForRoute(page, href, heading)
      check(`navbar${href.replace(/\//g, '_')}`, true)
    }

    /* collection index + every collection detail */
    await openRoute(page, '/collection', /^collections$/i)
    const collectionRows = await page.locator('main a[href^="/collection/"]').count()
    check('collectionIndexRows', collectionRows === 3, `got ${collectionRows}`)
    for (const [slug, heading] of [
      ['the-origin-drop', /^the origin drop$/i],
      ['marked-down', /^marked down$/i],
      ['final-units', /^final units$/i],
    ]) {
      await openRoute(page, `/collection/${slug}`, heading)
      const n = await page.locator('article').count()
      check(`collection_${slug}`, n > 0, '0 product cards')
    }

    /* shop filters + sort */
    await openRoute(page, '/drop', /^the drop$/i)
    F.shopAll = await page.locator('article').count()
    await page.locator('button:has-text("Last units")').first().click()
    await page.locator('article[style*="opacity: 1"]').first().waitFor().catch(() => {})
    await page.waitForFunction(
      (n) => document.querySelectorAll('article').length < n,
      F.shopAll,
      { timeout: 5000 },
    ).catch(() => {})
    F.filterLastUnits = await page.locator('article').count()
    check('filterLastUnits', F.filterLastUnits > 0 && F.filterLastUnits < F.shopAll, `all=${F.shopAll} filtered=${F.filterLastUnits}`)
    await page.locator('button:has-text("All designs")').first().click()
    await page.waitForFunction((n) => document.querySelectorAll('article').length === n, F.shopAll, {
      timeout: 5000,
    })
    await page.selectOption('select', 'price-asc')
    await page.waitForTimeout(500)
    F.sortPriceAsc = await page.locator('article').count()
    check('sortPriceAsc', F.sortPriceAsc === F.shopAll, `got ${F.sortPriceAsc}`)
  }

  /* ---------- product card → PDP ---------- */
  await openRoute(page, '/drop', /^the drop$/i)
  const firstCardLink = page.locator('article h3 a').first()
  const href = await firstCardLink.getAttribute('href')
  await firstCardLink.click()
  await waitForRoute(page, href, /Blue Flame/i)
  check('productCardNavigates', true)

  /* ---------- PDP: gallery, size keys, qty, add to cart ---------- */
  const thumbs = await page.locator('[role="tab"]').count()
  check('pdpGalleryTabs', thumbs > 1, `got ${thumbs}`)
  if (thumbs > 1) {
    await page.locator('[role="tab"]').nth(1).click()
    // deterministic: wait until the *second* tab reports itself selected
    await page
      .waitForFunction(
        () => {
          const tabs = [...document.querySelectorAll('[role="tab"]')]
          return tabs[1]?.getAttribute('aria-selected') === 'true'
        },
        null,
        { timeout: 5000 },
      )
      .catch(() => {})
    check(
      'pdpThumbSwitch',
      (await page.locator('[role="tab"]').nth(1).getAttribute('aria-selected')) === 'true',
    )
  }
  await page.locator('[role="radio"]').first().focus()
  await page.keyboard.press('ArrowRight')
  check(
    'arrowSelectsSize',
    (await page.evaluate(() => document.activeElement?.getAttribute('aria-checked'))) === 'true',
  )
  // below 900px the sticky bar duplicates the inline add button; .first()
  // is the inline control, which is also the one in DOM order
  const addBtn = page.locator('main button:has-text("Add to bag")').first()
  check('addEnabledAfterSize', await addBtn.isEnabled())
  await page.locator('main button[aria-label="Increase quantity"]').first().click()
  await addBtn.click()

  const toast = page.locator('[role="status"]').filter({ hasText: 'Added —' })
  await toast.waitFor({ state: 'visible' })
  check('toastVisible', true)
  await page
    .waitForFunction(
      () => {
        const btn = document.querySelector('header button[aria-label*="Open cart"]')
        return btn && /2/.test(btn.textContent || '')
      },
      null,
      { timeout: 5000 },
    )
    .catch(() => {})
  F.cartBadgeAfterAdd = (
    await page.locator('header button[aria-label*="Open cart"]').textContent()
  )?.replace(/\D/g, '')
  check('cartBadgeAfterAdd', F.cartBadgeAfterAdd === '2', `got "${F.cartBadgeAfterAdd}"`)

  F.pdpRelated = await page.locator('article').count()
  check('pdpRelated', F.pdpRelated === 3, `got ${F.pdpRelated}`)

  /* ---------- quick view ---------- */
  await openRoute(page, '/drop', /^the drop$/i)
  await page.locator('button[aria-label*="Quick view"]').first().click()
  const dialog = page.locator('[role="dialog"][aria-label*="quick view"]')
  await dialog.waitFor({ state: 'visible' })
  check('quickViewOpens', true)
  await dialog.locator('[role="radio"]').first().click()
  await dialog.locator('button:has-text("Add to cart")').click()
  await page.keyboard.press('Escape')
  await dialog.waitFor({ state: 'detached' })
  check('quickViewClosesOnEscape', true)

  /* ---------- cart drawer ---------- */
  await page.locator('header button[aria-label*="Open cart"]').click()
  const drawer = page.locator('[role="dialog"][aria-label="Shopping cart"]')
  await drawer.waitFor({ state: 'visible' })
  check('cartDrawerOpens', true)
  F.drawerLines = await drawer.locator('li').count()
  check('cartDrawerLines', F.drawerLines > 0, `got ${F.drawerLines}`)
  await drawer.locator('button[aria-label="Close cart"]').click()
  await drawer.waitFor({ state: 'hidden' })
  check('cartDrawerCloses', true)

  /* ---------- toast → cart page ---------- */
  await page.locator('header button[aria-label*="Open cart"]').click()
  await drawer.waitFor({ state: 'visible' })
  await drawer.locator('button[aria-label="Close cart"]').click()
  await drawer.waitFor({ state: 'hidden' })

  await openRoute(page, '/cart', /^(bag|\d+ items?)$/i)
  const lines = page.locator('main ul[class*="lines"] li')
  F.cartPageItems = await lines.count()
  check('cartPageItems', F.cartPageItems > 0, `got ${F.cartPageItems}`)
  // the subtotal is a <dt>/<dd> pair, not an element named "subtotal"
  const subtotal = page.locator('main dt:text-is("Subtotal") + dd').first()
  F.cartPageSubtotal = (await subtotal.textContent())?.trim()
  await page.locator('main button[aria-label*="Increase quantity of"]').first().click()
  await page
    .waitForFunction(
      (prev) => {
        // querySelector has no :text-is(), so locate the dt by its own text
        const dts = [...document.querySelectorAll('main dt')]
        const label = dts.find((d) => d.textContent?.trim() === 'Subtotal')
        return label?.nextElementSibling?.textContent?.trim() !== prev
      },
      F.cartPageSubtotal,
      { timeout: 5000 },
    )
    .catch(() => {})
  F.cartPageQtyUpdated = (await subtotal.textContent())?.trim()
  check('cartPageQtyUpdates', F.cartPageQtyUpdated !== F.cartPageSubtotal, `${F.cartPageSubtotal} -> ${F.cartPageQtyUpdated}`)

  /* cart line → PDP, then browser back */
  await page.locator('main ul[class*="lines"] li a').first().click()
  await waitForRoute(page, /\/drop\/[a-z-]+$/.exec(await page.evaluate(() => location.pathname))?.[0] ?? '', null)
  check('cartLineNavigatesToPdp', /\/drop\/[a-z-]+$/.test(await page.evaluate(() => location.pathname)))
  await page.goBack()
  await waitForRoute(page, '/cart', /^(bag|\d+ items?)$/i)
  check('browserBackWorks', true)

  /* ---------- wishlist ---------- */
  await openRoute(page, '/wishlist', /^wishlist$/i)
  F.wishlistEmpty = await page.evaluate(() =>
    document.body.textContent.includes('Nothing saved yet'),
  )
  check('wishlistEmptyState', F.wishlistEmpty === true, 'expected the empty copy')

  /* ---------- home via wordmark ---------- */
  await page.locator('header a[aria-label*="home"]').click()
  await waitForRoute(page, '/', /wear the arc/i)
  check('wordmarkGoesHome', true)

  F.pageErrors = errors
  F.httpErrors = badResponses
  if (errors.length) fail(`${w}px flow`, `page errors: ${errors.join(' | ')}`)
  if (badResponses.length) fail(`${w}px flow`, `http errors: ${badResponses.join(' | ')}`)
  report.flows[w] = F
  await page.close()
}

/* ---------- reduced motion ---------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openRoute(page, '/')
  await page.waitForTimeout(8000) // outlive the 7s hero hold

  report.motion.reduced = await page.evaluate(() => {
    // styles.shot is the <img> itself, not a wrapper
    const shots = [...document.querySelectorAll('[class*="shot"]')]
    return {
      heroShots: shots.length,
      visibleShots: shots.filter((s) => getComputedStyle(s).opacity !== '0').length,
      firstShotSrc: shots[0]?.getAttribute('src') ?? null,
      runningAnimations: document.getAnimations().filter((a) => a.playState === 'running').length,
    }
  })
  if (report.motion.reduced.visibleShots !== 1) {
    fail('reduced motion', `expected exactly 1 visible hero frame, got ${report.motion.reduced.visibleShots}`)
  }
  if (report.motion.reduced.firstShotSrc !== '/hero/hero-1.webp') {
    fail('reduced motion', `expected the first frame to be held, got "${report.motion.reduced.firstShotSrc}"`)
  }

  // the same check without the override, to prove the crossfade is real
  const motionPage = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await openRoute(motionPage, '/')
  await motionPage.waitForTimeout(8000)
  report.motion.default = await motionPage.evaluate(() => {
    const shots = [...document.querySelectorAll('[class*="shot"]')]
    return {
      heroShots: shots.length,
      visibleShots: shots.filter((s) => getComputedStyle(s).opacity !== '0').length,
      firstShotSrc: shots[0]?.getAttribute('src') ?? null,
    }
  })
  if (report.motion.default.visibleShots !== 1) {
    fail('default motion', `expected exactly 1 opaque hero frame mid-hold, got ${report.motion.default.visibleShots}`)
  }
  await motionPage.close()
  await page.close()
}

writeFileSync('qa/routes-qa.json', JSON.stringify(report, null, 2))

/* summary */
console.log('\n== VIEWPORTS ==')
for (const [w, routes] of Object.entries(report.viewports)) {
  const maxOv = Math.max(...Object.values(routes).map((r) => r.overflowX || 0))
  const maxClip = Math.max(...Object.values(routes).map((r) => r.clippedX || 0))
  const broken = Object.values(routes).reduce((a, r) => a + (r.brokenImgs || 0), 0)
  const http = Object.values(routes).reduce((a, r) => a + (r.httpErrors || 0), 0)
  const axe = routes.axeSerious !== undefined
    ? ` axeSerious=${routes.axeSerious}${routes.axeIds?.length ? ' [' + [...new Set(routes.axeIds)].join(',') + ']' : ''}`
    : ''
  console.log(`${w}px: routes=${Object.keys(routes).length} overflowX=${maxOv} clippedX=${maxClip} brokenImg=${broken} http4xx=${http}${axe}`)
}
console.log('\n== FLOWS 1440 ==', JSON.stringify(report.flows['1440'], null, 1))
console.log('\n== FLOWS 375 ==', JSON.stringify(report.flows['375'], null, 1))
console.log('\n== MOTION ==', JSON.stringify(report.motion))

await server.close()
await browser.close()

if (report.failures.length) {
  console.log(`\n== ${report.failures.length} FAILURE(S) ==`)
  for (const f of report.failures) console.log(' - ' + f)
  process.exitCode = 1
} else {
  console.log('\n== ALL ROUTE QA CHECKS PASSED ==')
}
console.log('done')
