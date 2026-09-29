import type { Product } from '../types'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const

/**
 * The Origin Drop — the six real ZENJI Origin Drop designs, using self-hosted
 * product photography (public/products/*.webp). Shots per product vary 3–4.
 * Shot 1 = front, shot 2 = back/alt (hover), 3–4 = gallery/details.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'blue-flame-tee',
    name: 'Blue Flame Tee',
    colorway: 'Steel Blue',
    accent: '#6f9fd8',
    price: 33.99,
    compareAt: 39.99,
    sizes: [...SIZES],
    status: 'last-units',
    tagline: 'Burn cold. Burn twice as bright.',
    images: {
      front: '/products/blue-flame-1.webp',
      back: '/products/blue-flame-2.webp',
      gallery: ['/products/blue-flame-3.webp'],
    },
    featured: true,
  },
  {
    id: 'demon-blood-tee',
    name: 'Demon Blood Tee',
    colorway: 'Crimson Pink',
    accent: '#e23d3d',
    price: 33.99,
    compareAt: 39.99,
    sizes: [...SIZES],
    status: 'selling-fast',
    tagline: 'The mark you cannot wash out.',
    images: {
      front: '/products/demon-blood-1.webp',
      back: '/products/demon-blood-2.webp',
      gallery: ['/products/demon-blood-3.webp'],
    },
  },
  {
    id: 'will-of-the-sun-tee',
    name: 'Will of the Sun Tee',
    colorway: 'Sun Gold',
    accent: '#ffb02e',
    price: 33.99,
    compareAt: 39.99,
    sizes: ['S', 'M', 'L', 'XL'],
    status: 'limited',
    tagline: 'Rise before the world wakes up.',
    images: {
      front: '/products/will-of-the-sun-1.webp',
      back: '/products/will-of-the-sun-2.webp',
      gallery: ['/products/will-of-the-sun-3.webp', '/products/will-of-the-sun-4.webp'],
    },
  },
  {
    id: 'warrior-spirit-tee',
    name: 'Warrior Spirit Tee',
    colorway: 'Bone White',
    accent: '#e8e4da',
    price: 39.99,
    sizes: [...SIZES],
    status: 'selling-fast',
    tagline: 'Discipline is a quiet flex.',
    images: {
      front: '/products/warrior-spirit-1.webp',
      back: '/products/warrior-spirit-2.webp',
      gallery: ['/products/warrior-spirit-3.webp', '/products/warrior-spirit-4.webp'],
    },
  },
  {
    id: 'bushido-tee',
    name: 'Bushido Tee',
    colorway: 'Ink Black',
    accent: '#9a9aa5',
    price: 39.99,
    sizes: [...SIZES],
    status: 'limited',
    tagline: 'The way of the warrior, worn quiet.',
    images: {
      front: '/products/bushido-1.webp',
      back: '/products/bushido-2.webp',
      gallery: ['/products/bushido-3.webp', '/products/bushido-4.webp'],
    },
  },
  {
    id: 'paradise-spirit-tee',
    name: 'Paradise Spirit Tee',
    colorway: 'Pale Sky',
    accent: '#7fc4c9',
    price: 39.99,
    sizes: [...SIZES],
    status: 'last-units',
    tagline: 'Peace is also a position.',
    images: {
      front: '/products/paradise-spirit-1.webp',
      back: '/products/paradise-spirit-2.webp',
      gallery: ['/products/paradise-spirit-3.webp'],
    },
    featured: true,
  },
]

export const productById = (id: string): Product | undefined =>
  PRODUCTS.find((p) => p.id === id)
