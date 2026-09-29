import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PRODUCTS } from '../data/products'
import type { Product, ProductStatus } from '../types'
import { ProductCard } from '../components/ProductCard'
import { QuickView } from '../components/QuickView'
import { Reveal } from '../components/motion/Reveal'
import styles from './Shop.module.css'

const STATUS_FILTERS: { key: ProductStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'ALL' },
  { key: 'last-units', label: 'LAST UNITS' },
  { key: 'selling-fast', label: 'SELLING FAST' },
  { key: 'limited', label: 'LIMITED' },
]

const SORTS = [
  { key: 'featured', label: 'FEATURED' },
  { key: 'price-asc', label: 'PRICE ↑' },
  { key: 'price-desc', label: 'PRICE ↓' },
  { key: 'name', label: 'A–Z' },
] as const

type SortKey = (typeof SORTS)[number]['key']

export default function Shop() {
  const [filter, setFilter] = useState<ProductStatus | 'all'>('all')
  const [sort, setSort] = useState<SortKey>('featured')
  const [quickView, setQuickView] = useState<Product | null>(null)

  const items = useMemo(() => {
    const list = PRODUCTS.filter((p) => filter === 'all' || p.status === filter)
    switch (sort) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price)
      case 'name':
        return [...list].sort((a, b) => a.name.localeCompare(b.name))
      default:
        return [...list].sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
    }
  }, [filter, sort])

  return (
    <section className={styles.page} aria-labelledby="shop-title">
      <div className="container">
        <Reveal>
          <p className="eyebrow">The archive // full index</p>
          <h1 id="shop-title" className={`display ${styles.title}`}>THE_DROP</h1>
          <p className={styles.lede}>
            Every design from the Origin Drop. Nine files, one run each —
            when a size is gone, the file closes.
          </p>
        </Reveal>

        <div className={styles.controls}>
          <div className={styles.filters} role="group" aria-label="Filter by availability">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`${styles.filterBtn} ${filter === f.key ? styles.filterActive : ''}`}
                aria-pressed={filter === f.key}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <label className={styles.sortLabel}>
            <span className="sr-only">Sort products</span>
            <select
              className={styles.sort}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>

        <p className={styles.count} aria-live="polite">
          {items.length} DESIGN{items.length === 1 ? '' : 'S'}
        </p>

        <motion.div layout className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {items.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={p} onQuickView={setQuickView} priority={i < 3} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </section>
  )
}
