/* Download the 3 remaining real designs: Domain-expansion, Free-soul, Limitless. */
import { mkdirSync, writeFileSync, statSync } from 'node:fs'

const BASE = 'https://res.cloudinary.com/diqbikizp/image/upload'
const DESIGNS = ['Domain-expansion', 'Free-soul', 'Limitless']

mkdirSync('public/products', { recursive: true })

async function grab(url, dest) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!res.ok) return 0
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 10000) return 0
    writeFileSync(dest, buf)
    console.log('ok', dest, Math.round(statSync(dest).size / 1024) + 'KB')
    return 1
  } catch {
    return 0
  }
}

let ok = 0
for (const d of DESIGNS) {
  const slug = d.toLowerCase()
  for (const n of [1, 2, 3]) {
    ok += await grab(`${BASE}/f_auto,q_auto,w_900/zenji/products/${d}-${n}.webp`, `public/products/${slug}-${n}.webp`)
  }
}
console.log(`${ok}/9 files`)
