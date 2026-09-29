import type { Product } from '../types'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const

/**
 * THE_ORIGIN_DROP — the nine real ZENJI Origin Drop designs, self-hosted
 * photography (public/products/*.webp). Shot 1 = front, shot 2 = back/alt
 * (hover), 3+ = gallery/details. Facts (240gsm, A$39.99/A$33.99, AU shipping,
 * no restocks) mirror the brand's public material.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'blue-flame-tee',
    slug: 'blue-flame',
    name: 'Blue Flame Tee',
    colorway: 'Steel Blue',
    accent: '#6f9fd8',
    price: 33.99,
    compareAt: 39.99,
    sizes: [...SIZES],
    status: 'last-units',
    tagline: 'Burn cold. Burn twice as bright.',
    story: 'The first transmission of the drop. Blue Flame burns at the moment control becomes power — printed once, never pressed again.',
    images: {
      front: '/products/blue-flame-1.webp',
      back: '/products/blue-flame-2.webp',
      gallery: ['/products/blue-flame-3.webp'],
    },
    featured: true,
  },
  {
    id: 'demon-blood-tee',
    slug: 'demon-blood',
    name: 'Demon Blood Tee',
    colorway: 'Crimson Pink',
    accent: '#e23d3d',
    price: 33.99,
    compareAt: 39.99,
    sizes: [...SIZES],
    status: 'selling-fast',
    tagline: 'The mark you cannot wash out.',
    story: 'A lineage mark in crimson. Demon Blood carries the inheritance theme — power that arrives whether you asked for it or not.',
    images: {
      front: '/products/demon-blood-1.webp',
      back: '/products/demon-blood-2.webp',
      gallery: ['/products/demon-blood-3.webp'],
    },
  },
  {
    id: 'will-of-the-sun-tee',
    slug: 'will-of-the-sun',
    name: 'Will of the Sun Tee',
    colorway: 'Sun Gold',
    accent: '#ffb02e',
    price: 33.99,
    compareAt: 39.99,
    sizes: ['S', 'M', 'L', 'XL'],
    status: 'limited',
    tagline: 'Rise before the world wakes up.',
    story: 'Discipline before daylight. Will of the Sun is for the ones already moving while the city is still dark.',
    images: {
      front: '/products/will-of-the-sun-1.webp',
      back: '/products/will-of-the-sun-2.webp',
      gallery: ['/products/will-of-the-sun-3.webp', '/products/will-of-the-sun-4.webp'],
    },
  },
  {
    id: 'warrior-spirit-tee',
    slug: 'warrior-spirit',
    name: 'Warrior Spirit Tee',
    colorway: 'Bone White',
    accent: '#e8e4da',
    price: 39.99,
    sizes: [...SIZES],
    status: 'selling-fast',
    tagline: 'Discipline is a quiet flex.',
    story: 'The bushido chapter. Warrior Spirit strips the arc back to its spine — training, repetition, refusal to fade.',
    images: {
      front: '/products/warrior-spirit-1.webp',
      back: '/products/warrior-spirit-2.webp',
      gallery: ['/products/warrior-spirit-3.webp', '/products/warrior-spirit-4.webp'],
    },
  },
  {
    id: 'bushido-tee',
    slug: 'bushido',
    name: 'Bushido Tee',
    colorway: 'Ink Black',
    accent: '#9a9aa5',
    price: 39.99,
    sizes: [...SIZES],
    status: 'limited',
    tagline: 'The way of the warrior, worn quiet.',
    story: 'The code, printed. Bushido is the quiet half of the arc — the part nobody sees on stage.',
    images: {
      front: '/products/bushido-1.webp',
      back: '/products/bushido-2.webp',
      gallery: ['/products/bushido-3.webp', '/products/bushido-4.webp'],
    },
  },
  {
    id: 'paradise-spirit-tee',
    slug: 'paradise-spirit',
    name: 'Paradise Spirit Tee',
    colorway: 'Pale Sky',
    accent: '#7fc4c9',
    price: 39.99,
    sizes: [...SIZES],
    status: 'last-units',
    tagline: 'Peace is also a position.',
    story: 'The exhale after the arc. Paradise Spirit holds the stillness at the end of the fight.',
    images: {
      front: '/products/paradise-spirit-1.webp',
      back: '/products/paradise-spirit-2.webp',
      gallery: ['/products/paradise-spirit-3.webp'],
    },
    featured: true,
  },
  {
    id: 'domain-expansion-tee',
    slug: 'domain-expansion',
    name: 'Domain Expansion Tee',
    colorway: 'Void Purple',
    accent: '#8b5cf6',
    price: 39.99,
    sizes: [...SIZES],
    status: 'limited',
    tagline: 'Claim the space around you.',
    story: 'Territory as a statement. Domain Expansion is the moment the world rearranges itself around you.',
    images: {
      front: '/products/domain-expansion-1.webp',
      back: '/products/domain-expansion-2.webp',
      gallery: ['/products/domain-expansion-3.webp'],
    },
  },
  {
    id: 'free-soul-tee',
    slug: 'free-soul',
    name: 'Free Soul Tee',
    colorway: 'Washed Indigo',
    accent: '#7fa8e8',
    price: 39.99,
    sizes: [...SIZES],
    status: 'selling-fast',
    tagline: 'Unbound by design.',
    story: 'The loose chapter. Free Soul is movement without permission — the arc off the leash.',
    images: {
      front: '/products/free-soul-1.webp',
      back: '/products/free-soul-2.webp',
      gallery: ['/products/free-soul-3.webp'],
    },
  },
  {
    id: 'limitless-tee',
    slug: 'limitless',
    name: 'Limitless Tee',
    colorway: 'Monochrome',
    accent: '#d4d4dc',
    price: 39.99,
    sizes: [...SIZES],
    status: 'last-units',
    tagline: 'No ceiling. No permission slip.',
    story: 'The closing frame of the drop. Limitless is the promise the whole arc makes: the ceiling was never real.',
    images: {
      front: '/products/limitless-1.webp',
      back: '/products/limitless-2.webp',
      gallery: ['/products/limitless-3.webp'],
    },
  },
]

export const productById = (id: string): Product | undefined =>
  PRODUCTS.find((p) => p.id === id)

export const productBySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug)

/** PDP "next in the arc" — the products that follow, wrapping around */
export const relatedProducts = (slug: string, count = 3): Product[] => {
  const i = PRODUCTS.findIndex((p) => p.slug === slug)
  if (i === -1) return []
  return Array.from({ length: count }, (_, k) => PRODUCTS[(i + 1 + k) % PRODUCTS.length])
}

/** collection views for /collection index */
export const COLLECTIONS = [
  {
    slug: 'the-origin-drop',
    title: 'THE_ORIGIN_DROP',
    subtitle: 'The full run — nine designs, one transmission',
    count: PRODUCTS.length,
  },
  {
    slug: 'marked-down',
    title: 'MARKED DOWN',
    subtitle: 'Selected pieces at 15% off while units last',
    count: PRODUCTS.filter((p) => p.compareAt).length,
  },
  {
    slug: 'final-units',
    title: 'FINAL UNITS',
    subtitle: 'Last stock before the file closes for good',
    count: PRODUCTS.filter((p) => p.status === 'last-units').length,
  },
]
