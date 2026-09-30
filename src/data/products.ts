import type { Product } from '../types'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const

/**
 * The nine ZENJI Origin Drop designs, self-hosted photography
 * (public/products/*.webp). Shot 1 = front, shot 2 = back (hover),
 * 3+ = gallery.
 *
 * Only verifiable facts are stored here: heavyweight 240gsm cotton, oversized
 * fit, XS–XXL, A$39.99 standard / A$33.99 marked down, AU-wide shipping, no
 * restocks. Marketing lines are deliberately plain — no invented scarcity,
 * fictional run counts or urgency claims.
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
    tagline: 'Heavyweight cotton, oversized cut.',
    story:
      'A steel-blue tee from the Origin Drop, printed on heavyweight 240gsm cotton. Oversized through the body with a dropped shoulder, made to sit heavy rather than thin.',
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
    status: 'in-stock',
    tagline: 'Screen-printed on garment-washed cotton.',
    story:
      'Crimson pink on heavyweight 240gsm cotton, garment washed for a softer hand and screen-printed to hold up through the wash cycle. Oversized fit, XS to XXL.',
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
    status: 'in-stock',
    tagline: 'Marked down while units last.',
    story:
      'Sun gold on heavyweight 240gsm cotton. Currently marked down from A$39.99 while units remain. Oversized fit; this colourway runs S to XL.',
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
    price: 33.99,
    compareAt: 39.99,
    sizes: [...SIZES],
    status: 'in-stock',
    tagline: 'Bone white, heavyweight cotton.',
    story:
      'Bone white heavyweight tee, screen-printed on garment-washed 240gsm cotton. Marked down from A$39.99 while units last. Oversized fit, XS to XXL.',
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
    status: 'in-stock',
    tagline: 'Ink black, the standard price.',
    story:
      'Ink black on heavyweight 240gsm cotton with a dropped shoulder and an oversized body. Screen-printed artwork, garment washed. XS to XXL.',
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
    tagline: 'Pale sky blue, last units in some sizes.',
    story:
      'Pale sky on heavyweight 240gsm cotton. Oversized fit from XS to XXL, garment washed and screen-printed. This run is not restocked once sizes sell through.',
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
    status: 'in-stock',
    tagline: 'Void purple, heavyweight cotton.',
    story:
      'Void purple on heavyweight 240gsm cotton. Dropped shoulder, oversized body, screen-printed artwork. Fits XS to XXL.',
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
    status: 'in-stock',
    tagline: 'Washed indigo, oversized fit.',
    story:
      'Washed indigo on garment-washed 240gsm cotton. Loose oversized cut with a dropped shoulder, screen-printed graphic. XS to XXL.',
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
    tagline: 'Monochrome, last units in some sizes.',
    story:
      'Monochrome heavyweight tee on 240gsm cotton. Oversized fit from XS to XXL, screen-printed and garment washed. Sizes are not restocked.',
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

/** PDP "you may also like" — the products that follow, wrapping around */
export const relatedProducts = (slug: string, count = 3): Product[] => {
  const i = PRODUCTS.findIndex((p) => p.slug === slug)
  if (i === -1) return []
  return Array.from({ length: count }, (_, k) => PRODUCTS[(i + 1 + k) % PRODUCTS.length])
}

/** collection views for /collection index */
export const COLLECTIONS = [
  {
    slug: 'the-origin-drop',
    title: 'The Origin Drop',
    subtitle: 'The full run — all nine designs from the first drop.',
    count: PRODUCTS.length,
  },
  {
    slug: 'marked-down',
    title: 'Marked Down',
    subtitle: 'Selected designs at 15% off while units last.',
    count: PRODUCTS.filter((p) => p.compareAt).length,
  },
  {
    slug: 'final-units',
    title: 'Final Units',
    subtitle: 'Last stock before a size sells through for good.',
    count: PRODUCTS.filter((p) => p.status === 'last-units').length,
  },
]
