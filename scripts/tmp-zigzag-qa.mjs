/* Temporary: verify zigzag mosaic and footer signature sizing. */
import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'

const server = spawn('npx', ['vite', 'preview', '--port', '4198', '--strictPort'], {
  stdio: 'ignore',
  shell: true,
})
await new Promise((r) => setTimeout(r, 3500))

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

await page.goto('http://localhost:4198/lookbook', { waitUntil: 'networkidle' })
const mosaic = await page.evaluate(() => {
  const tiles = [...document.querySelectorAll('[class*="tile"]')]
  const boxes = tiles.map((t) => {
    const r = t.getBoundingClientRect()
    const cs = getComputedStyle(t)
    return { left: Math.round(r.left), top: Math.round(r.top + scrollY), col: cs.gridColumnStart, span: cs.gridColumnEnd, ratio: cs.getPropertyValue('--ratio'), m: cs.getPropertyValue('--m') }
  })
  return { count: tiles.length, boxes }
})

await page.evaluate(() => document.querySelector('[class*="mosaic"]')?.scrollIntoView())
await new Promise((r) => setTimeout(r, 900))
await page.screenshot({ path: 'qa/tmp-zig.png' })

// footer
await page.goto('http://localhost:4198/', { waitUntil: 'networkidle' })
await page.evaluate(() => document.querySelector('footer')?.scrollIntoView({ block: 'end' }))
await new Promise((r) => setTimeout(r, 1800))
const footer = await page.evaluate(() => {
  const c = document.querySelector('footer canvas')
  const cr = c?.getBoundingClientRect()
  const ctx = c?.getContext('2d')
  let lit = 0
  let bright = 0
  if (ctx && c) {
    const data = ctx.getImageData(0, 0, c.width, c.height).data
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 40) {
        lit++
        if (data[i] > 200) bright++
      }
    }
  }
  const foot = document.querySelector('footer')?.getBoundingClientRect()
  return {
    canvas: cr ? { w: Math.round(cr.width), h: Math.round(cr.height), top: Math.round(cr.top) } : null,
    footerHeight: foot ? Math.round(foot.height) : null,
    litDots: lit,
    brightDots: bright,
  }
})
await page.screenshot({ path: 'qa/tmp-footer2.png' })

console.log(JSON.stringify({ mosaic, footer }, null, 2))
await browser.close()
server.kill()
