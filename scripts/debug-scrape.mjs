/* Debug: what does zenji.shop actually serve in headless Chrome? */
import { chromium } from 'playwright-core'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
})

const targets = ['drop/blue-flame-tee', 'products/blue-flame-tee', 'collection', 'lookbook']

for (const slug of targets) {
  const url = `https://zenji.shop/${slug}`
  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
    await page.waitForTimeout(2500)
    // scroll to trigger lazy loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1500)
    const info = await page.evaluate(() => ({
      title: document.title.slice(0, 60),
      imgCount: document.images.length,
      srcs: [...document.images].map((im) => im.currentSrc || im.src).slice(0, 8),
      hasCloudflare: !!document.querySelector('#challenge-form, .cf-browser-verification'),
      bodyLen: document.body.innerHTML.length,
    }))
    console.log(`\n== ${slug} [${res?.status()}]`, info.title, `body=${info.bodyLen}`)
    console.log('   imgs:', info.imgCount, 'cloudflare:', info.hasCloudflare)
    info.srcs.forEach((s) => console.log('   -', s.slice(0, 110)))
  } catch (e) {
    console.log(`\n== ${slug} ERROR`, e.message.slice(0, 100))
  }
}

await browser.close()
