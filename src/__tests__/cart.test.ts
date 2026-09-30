import { describe, it, expect } from 'vitest'
import { reducer } from '../context/CartContext'
import { formatPrice } from '../context/CartContext'
import { PRODUCTS, productById, productBySlug } from '../data/products'
import { FLAT_SHIPPING, FREE_SHIPPING_THRESHOLD } from '../types'

const p1 = PRODUCTS[0]
const p2 = PRODUCTS[1]

describe('cart reducer', () => {
  it('adds a new line', () => {
    const state = reducer([], { type: 'add', productId: p1.id, size: 'M' })
    expect(state).toHaveLength(1)
    expect(state[0]).toEqual({ productId: p1.id, size: 'M', qty: 1 })
  })

  it('increments quantity for an existing line, capped at 9', () => {
    let state = reducer([], { type: 'add', productId: p1.id, size: 'M' })
    for (let i = 0; i < 12; i++) {
      state = reducer(state, { type: 'add', productId: p1.id, size: 'M' })
    }
    expect(state).toHaveLength(1)
    expect(state[0].qty).toBe(9)
  })

  it('keeps separate lines per size', () => {
    let state = reducer([], { type: 'add', productId: p1.id, size: 'M' })
    state = reducer(state, { type: 'add', productId: p1.id, size: 'L' })
    expect(state).toHaveLength(2)
  })

  it('set-qty clamps high values and removes at zero', () => {
    let state = reducer([{ productId: p1.id, size: 'M', qty: 2 }], {
      type: 'set-qty',
      productId: p1.id,
      size: 'M',
      qty: 99,
    })
    expect(state[0].qty).toBe(9)

    state = reducer(state, {
      type: 'set-qty',
      productId: p1.id,
      size: 'M',
      qty: 0,
    })
    expect(state).toHaveLength(0)
  })

  it('remove and clear work', () => {
    let state = reducer(
      [
        { productId: p1.id, size: 'M', qty: 1 },
        { productId: p2.id, size: 'L', qty: 2 },
      ],
      { type: 'remove', productId: p1.id, size: 'M' },
    )
    expect(state).toHaveLength(1)
    expect(state[0].productId).toBe(p2.id)

    state = reducer(state, { type: 'clear' })
    expect(state).toHaveLength(0)
  })

  it('caps distinct lines at 12', () => {
    let state: ReturnType<typeof reducer> = []
    for (const p of PRODUCTS) {
      for (const size of ['S', 'M'] as const) {
        state = reducer(state, { type: 'add', productId: p.id, size })
      }
    }
    expect(state).toHaveLength(12)
  })
})

describe('shipping policy', () => {
  const subtotalFor = (qty: number) => qty * p1.price

  it('charges the verified flat rate below the free-shipping threshold', () => {
    const subtotal = subtotalFor(1)
    expect(subtotal).toBeLessThan(FREE_SHIPPING_THRESHOLD)
    expect(FLAT_SHIPPING).toBe(9.99)
  })

  it('ships free once the threshold is met', () => {
    // 3 x 33.99 = 101.97, which clears A$100
    expect(subtotalFor(3)).toBeGreaterThanOrEqual(FREE_SHIPPING_THRESHOLD)
  })

  it('uses the official sale price for sale items', () => {
    const compareAt = p1.compareAt
    expect(compareAt).toBe(39.99)
    expect(Math.round((1 - p1.price / (compareAt as number)) * 100)).toBe(15)
  })
})

describe('catalog integrity', () => {
    it('has ten unique products with valid prices', () => {
    expect(PRODUCTS).toHaveLength(10)
    const ids = new Set(PRODUCTS.map((p) => p.id))
    expect(ids.size).toBe(10)
    for (const p of PRODUCTS) {
      expect(p.price).toBeGreaterThan(0)
      if (p.compareAt) expect(p.compareAt).toBeGreaterThan(p.price)
      expect(p.sizes.length).toBeGreaterThan(0)
    }
  })

  it('resolves every product by id', () => {
    for (const p of PRODUCTS) {
      expect(productById(p.id)).toBeDefined()
    }
  })

  it('marks Warrior Spirit down to the official sale price', () => {
    const warrior = productBySlug('warrior-spirit')
    expect(warrior?.price).toBe(33.99)
    expect(warrior?.compareAt).toBe(39.99)
  })

  it('holds every price to the two published price points', () => {
    for (const p of PRODUCTS) {
      expect([33.99, 39.99]).toContain(p.price)
      if (p.compareAt) expect(p.compareAt).toBe(39.99)
    }
  })

  it('only uses stock states the brand can evidence', () => {
    for (const p of PRODUCTS) {
      expect(['in-stock', 'last-units']).toContain(p.status)
    }
  })
})

describe('formatPrice', () => {
  it('formats AUD prices', () => {
    expect(formatPrice(33.99)).toContain('33.99')
    expect(formatPrice(0)).toMatch(/0(\.00)?/)
  })
})
