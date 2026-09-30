/* Temporary: verify footer social icon styling (no dim, brand glows) . */
import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'

const server = spawn('npx', ['vite', 'preview', '--port', '4189', '--strictPort'], {
  stdio: 'ignore',
  shell: true,
})
await new Promise((r) => setTimeout(r, 3000))

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:4189/', { waitUntil: 'networkidle' })

const result = await page.evaluate(() => {
  const links = [...document.querySelectorAll('footer ul a')]
  const before = links.map((a) => {
    const cs = getComputedStyle(a)
    return {
      opacity: cs.opacity,
      filter: cs.filter,
      label: a.querySelector('.sr-only')?.textContent ?? '?',
    }
  })
  const first = links[0]
  first.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
  return { count: links.length, before }
})

// real hover via playwright for the :hover pseudo-state
await page.hover('footer ul li:nth-child(1) a')
const hovered = await page.evaluate(() => {
  const a = document.querySelector('footer ul li:nth-child(1) a')
  const cs = getComputedStyle(a)
  const svg = a.querySelector('svg')
  return {
    opacity: cs.opacity,
    filter: cs.filter,
    transform: cs.transform,
    svgVisible: svg ? getComputedStyle(svg).opacity : null,
  }
})

console.log(JSON.stringify({ ...result, hovered }, null, 2))
await browser.close()
server.kill()
