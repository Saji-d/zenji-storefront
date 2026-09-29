export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

export type ProductStatus = 'last-units' | 'selling-fast' | 'limited'

/** shot kinds mapped to files in public/products/<slug>-<n>.webp */
export interface ProductImages {
  /** primary (front/flat) shot */
  front: string
  /** alternate/back shot used for hover + gallery; may equal front when missing */
  back: string
  /** extra gallery shots for quick view (may be empty) */
  gallery: string[]
}

export interface Product {
  id: string
  slug: string
  name: string
  colorway: string
  /** hex accent used for status chips, focus states and fallback art */
  accent: string
  price: number
  /** undefined = not on sale */
  compareAt?: number
  sizes: Size[]
  status: ProductStatus
  tagline: string
  /** PDP editorial copy */
  story: string
  images: ProductImages
  /** editorial grid role */
  featured?: boolean
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
