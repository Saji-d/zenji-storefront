import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PRODUCTS } from '../data/products'
import type { Product } from '../types'
import { ProductCard } from '../components/ProductCard'
import { QuickView } from '../components/QuickView'
import { Reveal } from '../components/motion/Reveal'
import styles from './Shop.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

/** Availability filters map to how the brand actually talks about stock. */
const FILTERS = [
  { key: 'all', label: 'All designs' },
  { key: 'sale', label: 'On sale' },
  { key: 'last-units', label: 'Last units' },
] as const

type FilterKey = (typeof FILTERS)[number]['key']

const SORTS = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price, low to high' },
  { key: 'price-desc', label: 'Price, high to low' },
  { key: 'name', label: 'Alphabetical' },
] as const

type SortKey = (typeof SORTS)[number]['key']

export default function Shop() {
  const [filter, setFilter] = useState<FilterKey>('all')
  const [sort, setSort] = useState<SortKey>('featured')
  const [quickView, setQuickView] = useState<Product | null>(null)

  const items = useMemo(() => {
    let list = PRODUCTS
    if (filter === 'sale') list = list.filter((p) => p.compareAt)
    if (filter === 'last-units') list = list.filter((p) => p.status === 'last-units')

    switch (sort) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price)
      case 'name':
        return [...list].sort((a, b) => a.name.localeCompare(b.name))
      default:
        return [...list].sort(
          (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false),
        )
    }
  }, [filter, sort])

  return (
    <section className={styles.page} aria-labelledby="shop-title">
      <div className="container">
        <Reveal>
          <p className="eyebrow">The Origin Drop</p>
          <h1 id="shop-title" className={`display ${styles.title}`}>
            The drop
          </h1>
          <p className={styles.lede}>
            Every design from the Origin Drop. Each one is printed once. When a size
            sells through, it is not reprinted.
          </p>
        </Reveal>

        <div className={styles.controls}>
          <div className={styles.filters} role="group" aria-label="Filter designs">
            {FILTERS.map((f) => (
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
            <span className="sr-only">Sort designs</span>
            <select
              className={styles.sort}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className={styles.count} aria-live="polite">
          {items.length} design{items.length === 1 ? '' : 's'}
        </p>

        <motion.div layout className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {items.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: i * 0.03, ease: EASE }}
              >
                <ProductCard product={p} onQuickView={setQuickView} priority={i < 3} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </section>
  )
}
