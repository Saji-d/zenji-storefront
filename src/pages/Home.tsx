import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { PRODUCTS } from '../data/products'
import type { Product } from '../types'
import { ProductCard } from '../components/ProductCard'
import { QuickView } from '../components/QuickView'
import { Marquee } from '../components/Marquee'
import { Reveal } from '../components/motion/Reveal'
import { SmartImage } from '../components/SmartImage'
import styles from './Home.module.css'

const EASE = [0.22, 1, 0.36, 1] as const
const SHOTS = ['/hero/hero-1.webp', '/hero/hero-2.webp']

function Hero({ onShopClick }: { onShopClick: () => void }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const veilOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.5])

  return (
    <section ref={ref} className={styles.hero} aria-label="ZENJI — The Origin Drop">
      <motion.div className={styles.media} style={{ y: reduce ? 0 : parallaxY }} aria-hidden="true">
        {SHOTS.map((src, i) => (
          <motion.div
            key={src}
            className={`${styles.shot} ${i === 1 ? styles.shotAlt : ''}`}
            style={{ backgroundImage: `url(${src})` }}
            initial={false}
            animate={reduce ? { opacity: i === 0 ? 1 : 0 } : { opacity: [1, 1, 0, 0, 1] }}
            transition={reduce ? { duration: 0 } : { duration: 17, times: [0, 0.44, 0.5, 0.94, 1], repeat: Infinity, ease: 'linear', delay: i * 8.5 }}
          />
        ))}
        <motion.div className={styles.veil} style={{ opacity: veilOpacity }} />
        <div className={styles.vignette} />
        <div className={styles.scanlines} />
      </motion.div>

      <div className={`container ${styles.content}`}>
        <motion.div className={styles.metaRow} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: EASE }}>
          <span className={styles.metaRule} aria-hidden="true" />
          <p className={styles.meta}>INCOMING TRANSMISSION // THE_ORIGIN_DROP // AU</p>
        </motion.div>

        <motion.h1 className={`display ${styles.title}`} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.24, ease: EASE }}>
          <span className={styles.titleKicker}>Worn by the</span>
          <span className={styles.titleMain}>
            FEARLESS<span className={styles.accent}>.</span>
          </span>
        </motion.h1>

        <motion.p className={styles.lede} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: EASE }}>
          Heavyweight anime streetwear, cut oversized and printed once.
          When a drop sells out, it never comes back.
        </motion.p>

        <motion.div className={styles.ctas} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.54, ease: EASE }}>
          <button type="button" className="btn btn--primary" onClick={onShopClick}>
            Shop the drop
          </button>
          <Link className="btn btn--ghost" to="/lookbook">
            View lookbook →
          </Link>
        </motion.div>

        <motion.p className={styles.dropMeta} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}>
          240GSM HEAVYWEIGHT <span aria-hidden="true">//</span> 09 DESIGNS <span aria-hidden="true">//</span> NO RESTOCKS. EVER.
        </motion.p>
      </div>
    </section>
  )
}

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured)
  const strip = PRODUCTS.slice(0, 3)
  const [quickView, setQuickView] = useState<Product | null>(null)

  return (
    <>
      <Hero onShopClick={() => document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' })} />
      <Marquee />

      {/* latest drops */}
      <section id="latest" className={styles.section} aria-labelledby="latest-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <h2 id="latest-title" className="display">LATEST_DROPS</h2>
              <Link to="/drop" className={styles.headLink}>SHOP ALL →</Link>
            </div>
          </Reveal>
          <div className={styles.teaseGrid}>
            {featured.concat(strip.filter((p) => !p.featured)).slice(0, 3).map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <ProductCard product={p} onQuickView={setQuickView} priority={i === 0} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />

      {/* lookbook strip */}
      <section className={styles.strip} aria-label="Lookbook preview">
        <Link to="/lookbook" className={styles.stripLink}>
          <div className={styles.stripMedia}>
            <SmartImage src="/lookbook/look-2.webp" alt="" className={styles.stripImg} loading="lazy" />
            <div className={styles.stripShade} aria-hidden="true" />
          </div>
          <div className={`container ${styles.stripContent}`}>
            <Reveal>
              <p className="eyebrow">Campaign // AW26</p>
              <p className={styles.stripTitle}>
                EVERY PIECE IS AN ARC.<br />
                <span className={styles.stripAccent}>EVERY ARC IS YOURS.</span>
              </p>
              <span className={styles.stripCta}>ENTER THE LOOKBOOK →</span>
            </Reveal>
          </div>
        </Link>
      </section>

      {/* story teaser */}
      <section className={styles.storyTease} aria-labelledby="story-tease-title">
        <div className={`container ${styles.storyTeaseInner}`}>
          <Reveal>
            <p className="eyebrow">Our story</p>
            <h2 id="story-tease-title" className={`display ${styles.storyTeaseTitle}`}>
              BORN FROM THE<br />WARRIOR SPIRIT
            </h2>
            <p className={styles.storyTeaseText}>
              ZENJI began with one belief: what you wear should tell a story.
              Samurai discipline, anime art, modern street culture — pressed
              into 240gsm cotton, once, and never again.
            </p>
            <Link to="/story" className="btn btn--ghost">Read the manifesto →</Link>
          </Reveal>
          <Reveal delay={0.12}>
            <SmartImage src="/lookbook/look-5.webp" alt="ZENJI tee photographed against concrete" className={styles.storyTeaseImg} loading="lazy" />
          </Reveal>
        </div>
      </section>

      {/* signal CTA */}
      <section className={styles.signal} aria-labelledby="signal-title">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Transmissions // 通信</p>
            <h2 id="signal-title" className={`display ${styles.signalTitle}`}>
              GET THE DROP<br />BEFORE IT&apos;S LORE
            </h2>
            <div className={styles.signalCtas}>
              <Link to="/cart" className="btn btn--primary">View cart</Link>
              <Link to="/faq" className="btn btn--ghost">Read the FAQ →</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
