import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import {
  CURRENCY,
  FREE_SHIPPING_THRESHOLD,
  MAX_QTY_PER_LINE,
  type CartAction,
  type CartItem,
  type CartTotals,
} from '../types'
import { productById } from '../data/products'

const STORAGE_KEY = 'zenji-cart-v1'

const load = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (it): it is CartItem =>
        !!it &&
        typeof it === 'object' &&
        typeof (it as CartItem).productId === 'string' &&
        typeof (it as CartItem).size === 'string' &&
        typeof (it as CartItem).qty === 'number' &&
        productById((it as CartItem).productId) !== undefined,
    )
  } catch {
    return []
  }
}

export const reducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'hydrate':
      return action.items

    case 'add': {
      const existing = state.find(
        (i) => i.productId === action.productId && i.size === action.size,
      )
      if (existing) {
        return state.map((i) =>
          i === existing
            ? { ...i, qty: Math.min(i.qty + 1, MAX_QTY_PER_LINE) }
            : i,
        )
      }
      if (state.length >= 12) return state
      return [...state, { productId: action.productId, size: action.size, qty: 1 }]
    }

    case 'set-qty': {
      if (action.qty <= 0) {
        return state.filter(
          (i) => !(i.productId === action.productId && i.size === action.size),
        )
      }
      const clamped = Math.min(action.qty, MAX_QTY_PER_LINE)
      return state.map((i) =>
        i.productId === action.productId && i.size === action.size
          ? { ...i, qty: clamped }
          : i,
      )
    }

    case 'remove':
      return state.filter(
        (i) => !(i.productId === action.productId && i.size === action.size),
      )

    case 'clear':
      return []

    default:
      return state
  }
}

interface CartContextValue {
  items: CartItem[]
  totals: CartTotals
  add: (productId: string, size: Size) => void
  remove: (productId: string, size: Size) => void
  setQty: (productId: string, size: Size, qty: number) => void
  clear: () => void
}

// Local Size import to avoid circular value import; keep the public API typed.
type Size = CartItem['size']

const CartContext = createContext<CartContextValue | null>(null)

export const formatPrice = (value: number): string =>
  new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: CURRENCY,
  }).format(value)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, null, load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* storage unavailable (private mode) — cart stays in-memory */
    }
  }, [items])

  const value = useMemo<CartContextValue>(() => {
    const totals = items.reduce<CartTotals>(
      (acc, item) => {
        const product = productById(item.productId)
        if (!product) return acc
        acc.count += item.qty
        acc.subtotal += product.price * item.qty
        if (product.compareAt) {
          acc.savings += (product.compareAt - product.price) * item.qty
          acc.hasSaleItem = true
        }
        return acc
      },
      { count: 0, subtotal: 0, savings: 0, hasSaleItem: false },
    )

    return {
      items,
      totals,
      add: (productId, size) => dispatch({ type: 'add', productId, size }),
      remove: (productId, size) => dispatch({ type: 'remove', productId, size }),
      setQty: (productId, size, qty) =>
        dispatch({ type: 'set-qty', productId, size, qty }),
      clear: () => dispatch({ type: 'clear' }),
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within <CartProvider>')
  return ctx
}

export { FREE_SHIPPING_THRESHOLD }
