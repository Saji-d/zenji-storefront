import type { Product } from '../types'

/**
 * The Origin Drop — six original designs.
 * Names, artwork and colorways are our own; prices/fit specs mirror the
 * real brand's commerce facts (A$39.99 / A$33.99, 240gsm, XS–XXL).
 */
export const PRODUCTS: Product[] = [
  {
    id: 'blue-flame-tee',
    name: 'Blue Flame Tee',
    colorway: 'Steel Blue',
    accent: '#6f9fd8',
    price: 33.99,
    compareAt: 39.99,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    status: 'last-units',
    tagline: 'Burn cold. Burn twice as bright.',
  },
  {
    id: 'demon-blood-tee',
    name: 'Demon Blood Tee',
    colorway: 'Crimson Pink',
    accent: '#e23d3d',
    price: 33.99,
    compareAt: 39.99,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    status: 'selling-fast',
    tagline: 'The mark you cannot wash out.',
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
  },
  {
    id: 'warrior-spirit-tee',
    name: 'Warrior Spirit Tee',
    colorway: 'Bone White',
    accent: '#e8e4da',
    price: 39.99,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    status: 'selling-fast',
    tagline: 'Discipline is a quiet flex.',
  },
  {
    id: 'shadow-vow-tee',
    name: 'Shadow Vow Tee',
    colorway: 'Deep Violet',
    accent: '#9b6cf6',
    price: 39.99,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    status: 'limited',
    tagline: 'Sworn in silence. Kept in shadow.',
  },
  {
    id: 'ember-vanguard-tee',
    name: 'Ember Vanguard Tee',
    colorway: 'Burnt Ember',
    accent: '#ff7a1a',
    price: 39.99,
    sizes: ['XS', 'S', 'M', 'L'],
    status: 'last-units',
    tagline: 'First into the fire. Last to fall.',
  },
]

export const productById = (id: string): Product | undefined =>
  PRODUCTS.find((p) => p.id === id)
