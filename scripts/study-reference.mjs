/* Study the reference storefront's IA and structure. */
import { chromium } from 'playwright-core'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const found = { home: {} }
await page.goto('https://zenji-storefront.vercel.app/', { waitUntil: 'networkidle', timeout: 45000 })
await page.waitForTimeout(1200)
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)) }
})
await page.waitForTimeout(500)

found.home = await page.evaluate(() => ({
  title: document.title,
  h1s: [...document.querySelectorAll('h1,h2')].slice(0, 14).map((h) => h.textContent.trim().slice(0, 60)),
  navLinks: [...document.querySelectorAll('header a, nav a')].map((a) => a.getAttribute('href')).slice(0, 20),
  allLinks: [...new Set([...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')))].slice(0, 30),
  buttons: [...document.querySelectorAll('button')].slice(0, 14).map((b) => b.textContent.trim().slice(0, 26)),
  imgCount: document.images.length,
  videoCount: document.querySelectorAll('video').length,
}))
await page.screenshot({ path: 'qa/reference-home.png', fullPage: true })

/* visit every internal route found */
for (const href of found.home.allLinks) {
  try {
    await page.goto(`https://zenji-storefront.vercel.app${href}`, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(700)
    found[href] = await page.evaluate(() => ({
      title: document.title.slice(0, 50),
      h1: document.querySelector('h1')?.textContent.trim().slice(0, 50) || null,
      h2s: [...document.querySelectorAll('h2')].slice(0, 8).map((h) => h.textContent.trim().slice(0, 44)),
      imgCount: document.images.length,
      hasSizeSelector: !!document.querySelector('[role="radiogroup"], select[name*="size" i], [class*="size" i]'),
      hasAddToCart: [...document.querySelectorAll('button')].some((b) => /add to cart/i.test(b.textContent)),
      hasGallery: document.querySelectorAll('[class*="thumb" i], [class*="gallery" i]').length,
      video: document.querySelectorAll('video').length,
      productLinks: [...new Set([...document.querySelectorAll('a[href*="/product"]')].map((a) => a.getAttribute('href')))].slice(0, 10),
      filterControls: [...document.querySelectorAll('select, [role="radiogroup"], [class*="filter" i], [class*="sort" i]')].length,
    }))
    console.log('==', href, '→', found[href].title)
  } catch (e) {
    console.log('==', href, 'FAILED', e.message.slice(0, 50))
  }
}

await browser.close()
import { writeFileSync } from 'node:fs'
writeFileSync('qa/reference-study.json', JSON.stringify(found, null, 2))
console.log(JSON.stringify(found, null, 1).slice(0, 3500))
