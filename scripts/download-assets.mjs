/**
 * Download curated public ZENJI imagery from Cloudinary into public/.
 * Uses Cloudinary transforms for right-sized assets; files are self-hosted
 * afterwards (no runtime hotlinking). Read-only consumption of public URLs.
 */
import { mkdirSync, writeFileSync, statSync } from 'node:fs'

const BASE = 'https://res.cloudinary.com/diqbikizp/image/upload'
const PRODUCTS = [
  'Blue-flame',
  'Demon-blood',
  'Will-of-the-sun',
  'Warrior-spirit',
  'Bushido',
  'Paradise-spirit',
]
const LOOKBOOK = [
  'Domain-expansion-2',
  'Water-breathing-4',
  'Free-soul-5',
  'Will-of-the-sun-5',
  'Bushido-2',
  'Demon-blood-1',
  'Paradise-spirit-1',
  'Blue-flame-2',
]

mkdirSync('public/products', { recursive: true })
mkdirSync('public/lookbook', { recursive: true })
mkdirSync('public/hero', { recursive: true })

async function grab(publicId, transform, dest) {
  const url = `${BASE}/${transform}/${publicId}`
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!res.ok) {
      console.log('FAIL', res.status, dest)
      return 0
    }
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 10000) {
      console.log('SKIP tiny', dest, buf.length)
      return 0
    }
    writeFileSync(dest, buf)
    const kb = Math.round(statSync(dest).size / 1024)
    console.log('ok', dest, `${kb}KB`)
    return buf.length
  } catch (e) {
    console.log('ERR', dest, e.message.slice(0, 60))
    return 0
  }
}

let total = 0
let count = 0

// 4 shots per product: 1 front, 2 back/alt, 3-4 gallery/detail
for (const p of PRODUCTS) {
  const slug = p.toLowerCase()
  for (const n of [1, 2, 3, 4]) {
    const size = await grab(`f_auto,q_auto,w_900/zenji/products/${p}-${n}.webp`, '', `public/products/${slug}-${n}.webp`)
    if (size) { total += size; count++ }
  }
}

// hero: two wide cinematic model shots
for (const [i, id] of ['Blue-flame-2', 'Demon-blood-3'].entries()) {
  const size = await grab(`f_auto,q_auto,w_1800/zenji/products/${id}.webp`, '', `public/hero/hero-${i + 1}.webp`)
  if (size) { total += size; count++ }
}

// lookbook editorial shots
for (const [i, id] of LOOKBOOK.entries()) {
  const size = await grab(`f_auto,q_auto,w_1200/zenji/products/${id}.webp`, '', `public/lookbook/look-${i + 1}.webp`)
  if (size) { total += size; count++ }
}

console.log(`\n${count} files, ${Math.round(total / 1024)}KB total`)
