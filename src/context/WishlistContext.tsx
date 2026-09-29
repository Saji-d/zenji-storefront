import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'zenji-wishlist-v1'

interface WishlistContextValue {
  ids: ReadonlySet<string>
  has: (productId: string) => boolean
  toggle: (productId: string) => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<ReadonlySet<string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return new Set()
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed)
        ? new Set(parsed.filter((x): x is string => typeof x === 'string'))
        : new Set()
    } catch {
      return new Set()
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
    } catch {
      /* storage unavailable — wishlist stays in-memory */
    }
  }, [ids])

  const value = useMemo<WishlistContextValue>(
    () => ({
      ids,
      has: (productId) => ids.has(productId),
      toggle: (productId) =>
        setIds((prev) => {
          const next = new Set(prev)
          if (next.has(productId)) next.delete(productId)
          else next.add(productId)
          return next
        }),
    }),
    [ids],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within <WishlistProvider>')
  return ctx
}
