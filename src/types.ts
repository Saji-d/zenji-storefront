export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

export type ProductStatus = 'last-units' | 'selling-fast' | 'limited'

export interface Product {
  id: string
  name: string
  colorway: string
  /** hex accent used across card + artwork */
  accent: string
  price: number
  /** undefined = not on sale */
  compareAt?: number
  sizes: Size[]
  status: ProductStatus
  tagline: string
}

export interface CartItem {
  productId: string
  size: Size
  qty: number
}

export type CartAction =
  | { type: 'add'; productId: string; size: Size }
  | { type: 'remove'; productId: string; size: Size }
  | { type: 'set-qty'; productId: string; size: Size; qty: number }
  | { type: 'clear' }
  | { type: 'hydrate'; items: CartItem[] }

export interface CartTotals {
  count: number
  subtotal: number
  savings: number
  hasSaleItem: boolean
}

export const FREE_SHIPPING_THRESHOLD = 100
export const MAX_QTY_PER_LINE = 9
export const CURRENCY = 'AUD'
