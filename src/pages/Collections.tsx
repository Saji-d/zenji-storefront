import { Link } from 'react-router-dom'
import { COLLECTIONS, PRODUCTS } from '../data/products'
import { ProductCard } from '../components/ProductCard'
import { Reveal } from '../components/motion/Reveal'
import { useState } from 'react'
import type { Product } from '../types'
import { QuickView } from '../components/QuickView'
import styles from './Collections.module.css'

/**
 * Covers are drawn from the product photography, not the campaign.
 *
 * The previous version led on look-1.webp — the same frame the Lookbook page
 * opened with, which made the two destinations indistinguishable. This page is
 * about finding a product, so every image here is a garment.
 */
const COVERS = [
  { src: '/products/domain-expansion-1.webp', position: '50% 26%' },
  { src: '/products/bushido-1.webp', position: '50% 22%' },
  { src: '/products/limitless-1.webp', position: '50% 30%' },
] as const

/** A taste of the full run, so the page is browsable and not just a menu. */
const PREVIEW = PRODUCTS.slice(0, 4)

export default function Collections() {
  const [quickView, setQuickView] = useState<Product | null>(null)
  const [lead, ...rest] = COLLECTIONS

  return (
    <section className={styles.page} aria-labelledby="collections-title">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Shop by</p>
          <h1 id="collections-title" className={`display ${styles.title}`}>
            Collections
          </h1>
          <p className={styles.lede}>
            The Origin Drop in full, the designs currently marked down, and the pieces
            closest to selling through.
          </p>
        </Reveal>

        <Reveal delay={0.05} className={styles.lead}>
          <Link to={`/collection/${lead.slug}`} className={styles.card}>
            <span className={styles.media}>
              <img
                src={COVERS[0].src}
                alt=""
                width={1200}
                height={1500}
                loading="eager"
                decoding="async"
                style={{ objectPosition: COVERS[0].position }}
              />
            </span>
            <span className={styles.copy}>
              <span className={styles.cardLabel}>Everything</span>
              <h2 className={styles.cardTitle}>{lead.title}</h2>
              <span className={styles.cardSub}>{lead.subtitle}</span>
              <span className={styles.cardAction}>Shop {lead.count} designs</span>
            </span>
          </Link>
        </Reveal>

        <div className={styles.pair}>
          {rest.map((c, i) => (
            <Reveal key={c.slug} delay={0.05 + i * 0.06} className={styles.pairItem}>
              <Link to={`/collection/${c.slug}`} className={styles.card}>
                <span className={styles.media}>
                  <img
                    src={COVERS[i + 1].src}
                    alt=""
                    width={1200}
                    height={1500}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: COVERS[i + 1].position }}
                  />
                </span>
                <span className={styles.copy}>
                  <span className={styles.cardLabel}>
                    {i === 0 ? 'Reduced' : 'Last units'}
                  </span>
                  <h2 className={`${styles.cardTitle} ${styles.cardTitleSm}`}>{c.title}</h2>
                  <span className={styles.cardSub}>{c.subtitle}</span>
                  <span className={styles.cardAction}>Shop {c.count} designs</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Straight into product discovery — this is a shop, not an index. */}
        <Reveal>
          <div className={styles.previewHead}>
            <h2 className={`display ${styles.previewTitle}`}>In the Origin Drop</h2>
            <Link to="/drop" className="link-line">
              Shop all ten
            </Link>
          </div>
        </Reveal>
        <div className={styles.previewGrid}>
          {PREVIEW.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.05}>
              <ProductCard product={p} onQuickView={setQuickView} />
            </Reveal>
          ))}
        </div>
      </div>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </section>
  )
}
