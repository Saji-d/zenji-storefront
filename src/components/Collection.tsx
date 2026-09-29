import { useState } from 'react'
import styles from './Collection.module.css'
import { PRODUCTS } from '../data/products'
import type { Product } from '../types'
import { ProductCard } from './ProductCard'
import { QuickView } from './QuickView'
import { Reveal } from './motion/Reveal'

export function Collection() {
  const [quickView, setQuickView] = useState<Product | null>(null)

  return (
    <section id="collection" className={styles.section} aria-labelledby="collection-title">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <h2 id="collection-title" className="display">
              The Origin Drop
            </h2>
            <p className="eyebrow">06 designs // limited run // no restocks</p>
          </div>
        </Reveal>

        <div className={styles.grid}>
          {PRODUCTS.map((product, i) => (
            <Reveal
              key={product.id}
              className={`${styles.cell} ${product.featured ? styles.cellFeatured : ''}`}
              delay={(i % 3) * 0.08}
            >
              <ProductCard
                product={product}
                onQuickView={setQuickView}
                priority={i < 2}
                index={i}
              />
            </Reveal>
          ))}
        </div>
      </div>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </section>
  )
}
