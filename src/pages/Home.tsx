import { Link } from 'react-router-dom'
import { useState } from 'react'
import { PRODUCTS } from '../data/products'
import type { Product } from '../types'
import { Hero } from '../components/Hero'
import { ProductCard } from '../components/ProductCard'
import { QuickView } from '../components/QuickView'
import { Reveal } from '../components/motion/Reveal'
import { SmartImage } from '../components/SmartImage'
import styles from './Home.module.css'

/** The featured tee leads the showcase; the rest carry the discovery grid. */
const LEAD = PRODUCTS[0]
const REST = PRODUCTS.slice(1, 4)

/** Only verifiable brand facts are stated. */
const PILLARS = [
  {
    k: '240gsm heavyweight cotton',
    v: 'Garment washed so it keeps its shape through the wash.',
  },
  { k: 'Original artwork', v: 'Drawn for the design it appears on. No stock templates.' },
  { k: 'Shipped Australia-wide', v: 'Dispatched from Australia. Free over A$100.' },
]

export default function Home() {
  const [quickView, setQuickView] = useState<Product | null>(null)

  return (
    <>
      <Hero />

      {/* ---------- 2. the drop, led by an image rather than a paragraph ---------- */}
      <section className={styles.showcase} aria-labelledby="showcase-title">
        <div className={`container ${styles.showcaseGrid}`}>
          <Reveal className={styles.showcaseMedia}>
            <Link to={`/drop/${LEAD.slug}`} className={styles.showcaseLink}>
              <SmartImage
                src={LEAD.images.front}
                alt={`${LEAD.name} tee in ${LEAD.colorway}`}
                className={styles.showcaseImg}
                /* Eager, but never high priority: the preloaded hero frame is the
                   only high-priority image on the page. Two competing LCP
                   candidates would slow both. */
                loading="eager"
              />
            </Link>
          </Reveal>

          <Reveal delay={0.08} className={styles.showcaseBody}>
            <p className="eyebrow">From the Origin Drop</p>
            <h2 id="showcase-title" className={`display ${styles.showcaseTitle}`}>
              {LEAD.name}
            </h2>
            <p className={styles.showcasePrice}>
              <span className="sr-only">Price </span>
              A${LEAD.price.toFixed(2)}
              {LEAD.compareAt && (
                <span className={styles.compare}>
                  <span className="sr-only">Original price </span>A${LEAD.compareAt.toFixed(2)}
                </span>
              )}
            </p>
            <p className={styles.showcaseText}>{LEAD.story}</p>
            <p className={styles.showcaseMeta}>
              240gsm cotton · oversized fit · {LEAD.sizes[0]}–{LEAD.sizes[LEAD.sizes.length - 1]}
            </p>
            <div className={styles.showcaseActions}>
              <Link to={`/drop/${LEAD.slug}`} className="btn btn--primary">
                View the tee
              </Link>
              <Link to="/drop" className="link-line">
                All nine designs
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- 3. product discovery ---------- */}
      <section className={styles.drop} aria-labelledby="drop-title">
        <div className="container">
          <Reveal>
            <div className={styles.dropHead}>
              <h2 id="drop-title" className={`display ${styles.dropHeading}`}>
                More from the drop
              </h2>
              <Link to="/drop" className="link-line">
                Shop all
              </Link>
            </div>
          </Reveal>
          <div className={styles.cardGrid}>
            {REST.map((p) => (
              <Reveal key={p.id}>
                {/* The discovery grid sits a full viewport below the fold, so
                    every card lazy-loads. */}
                <ProductCard product={p} onQuickView={setQuickView} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />

      {/* ---------- 4. why ZENJI: statement left, facts right ---------- */}
      <section className={styles.why} aria-labelledby="why-title">
        <div className={`container ${styles.whyGrid}`}>
          <Reveal className={styles.whyLead}>
            <p className="eyebrow">Why ZENJI</p>
            <h2 id="why-title" className={`display--prose ${styles.whyStatement}`}>
              Heavyweight cotton, muted colourways, one strong graphic — the pieces take
              their subjects from the anime we actually watch.
            </h2>
            <Link to="/story" className={styles.whyCta}>
              Read our story
            </Link>
          </Reveal>

          <Reveal delay={0.1} className={styles.whyList}>
            {PILLARS.map((pillar) => (
              <div key={pillar.k} className={styles.whyItem}>
                <h3 className={styles.whyKey}>{pillar.k}</h3>
                <p className={styles.whyText}>{pillar.v}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- 5. editorial moment ---------- */}
      <section className={styles.editorial} aria-labelledby="editorial-title">
        <Link to="/lookbook" className={styles.editorialLink}>
          <div className={styles.editorialMedia}>
            <SmartImage
              src="/lookbook/look-6.webp"
              alt=""
              className={styles.editorialImg}
              loading="lazy"
            />
            <div className={styles.editorialShade} aria-hidden="true" />
          </div>
          <div className={`container ${styles.editorialContent}`}>
            <Reveal>
              <h2 id="editorial-title" className={`statement ${styles.editorialTitle}`}>
                The lookbook
              </h2>
              <p className={styles.editorialText}>
                Eight frames from the Origin Drop campaign, shot on the same heavyweight
                cotton the drop ships in.
              </p>
              <span className={styles.editorialCta}>View the lookbook</span>
            </Reveal>
          </div>
        </Link>
      </section>

      {/* ---------- 6. closing CTA, held to roughly half a screen ---------- */}
      <section className={styles.lore} aria-labelledby="lore-title">
        <div className={`container ${styles.loreInner}`}>
          <Reveal>
            <h2 id="lore-title" className={`statement ${styles.loreTitle}`}>
              Follow the lore
            </h2>
            <p className={styles.loreText}>
              New drops are announced once and not again. Every drop is a limited run —
              once it sells out it is not reprinted.
            </p>
            <div className={styles.loreActions}>
              <Link to="/drop" className="btn btn--primary">
                Shop the drop
              </Link>
              <Link to="/faq" className="link-line">
                Read the FAQ
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
