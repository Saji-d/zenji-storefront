import { Link } from 'react-router-dom'
import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { PRODUCTS } from '../data/products'
import type { Product } from '../types'
import { Hero } from '../components/Hero'
import { Marquee } from '../components/Marquee'
import { ProductCard } from '../components/ProductCard'
import { QuickView } from '../components/QuickView'
import { Reveal } from '../components/motion/Reveal'
import { SmartImage } from '../components/SmartImage'
import styles from './Home.module.css'

/** One of each. The wall IS the drop. */
const DROP = PRODUCTS

/** Design names, kept to the mythic register the brand actually uses. */
const CHAPTERS = [
  {
    n: 'I',
    t: 'The Flame',
    d: 'Blue Flame. Steel blue, drawn from the burn that does not waver.',
    slug: 'blue-flame',
    accent: '#6f9fd8',
    img: '/products/blue-flame-1.webp',
  },
  {
    n: 'II',
    t: 'The Blood',
    d: 'Demon Blood. Crimson ink for the ones who fight past their limit.',
    slug: 'demon-blood',
    accent: '#e23d3d',
    img: '/products/demon-blood-1.webp',
  },
  {
    n: 'III',
    t: 'The Sun',
    d: 'Will of the Sun. Sun gold, the resolve that outlasts the season.',
    slug: 'will-of-the-sun',
    accent: '#ffb02e',
    img: '/products/will-of-the-sun-1.webp',
  },
]

const EASE = [0.22, 1, 0.36, 1] as const

/** One word of the kinetic brand statement. */
function Word({
  children,
  delay = 0,
  accent = false,
}: {
  children: string
  delay?: number
  accent?: boolean
}) {
  const reduce = useReducedMotion()
  return (
    <motion.span
      className={[styles.word, accent ? styles.wordAccent : ''].join(' ')}
      initial={reduce ? false : { opacity: 0, y: '0.5em' }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.span>
  )
}

export default function Home() {
  const [quickView, setQuickView] = useState<Product | null>(null)

  return (
    <>
      <Hero />

      {/* ---------- 1. tickertape stack: red / ghost / white ---------- */}
      <Marquee
        phrase="No restocks. Ever. ◆ Limited runs only ◆ Wear your story ◆ "
        tone="accent"
      />
      <Marquee
        phrase="The Origin Drop ◆ Ten designs ◆ One run ◆ Drawn for the story ◆ "
        tone="ghost"
        duration={34}
      />
      <Marquee
        phrase="240gsm heavyweight cotton ◆ Oversized fit ◆ XS–XXL ◆ Shot in Australia ◆ "
        tone="light"
        duration={38}
        reverse
      />

      {/* ---------- 2. the drop wall: every tee, one screen ---------- */}
      <section className={styles.drop} aria-labelledby="drop-title">
        <div className="container">
          <Reveal>
            <div className={styles.dropHead}>
              <div>
                <p className={`eyebrow ${styles.dropEyebrow}`}>The Origin Drop // 全十柄</p>
                <h2 id="drop-title" className={`display ${styles.dropTitle}`}>
                  Ten designs. One run.
                </h2>
              </div>
              <Link to="/drop" className="link-line">
                Shop all ten
              </Link>
            </div>
          </Reveal>

          <div className={styles.dropGrid}>
            {DROP.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.06}>
                <ProductCard product={p} onQuickView={setQuickView} priority={i < 2} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 3. kinetic brand statement ---------- */}
      <section className={styles.statement} aria-labelledby="statement-title">
        <div className={`container ${styles.statementInner}`}>
          <h2 id="statement-title" className={styles.statementType}>
            <Word delay={0.05}>Anime</Word> <Word delay={0.12}>is</Word>{' '}
            <Word delay={0.19}>not</Word> <Word delay={0.26}>a</Word>{' '}
            <Word delay={0.33}>phase.</Word>
            <br />
            <Word delay={0.44} accent>
              It
            </Word>{' '}
            <Word delay={0.51} accent>
              is
            </Word>{' '}
            <Word delay={0.58} accent>
              the
            </Word>{' '}
            <Word delay={0.65} accent>
              plot.
            </Word>
          </h2>
          <Reveal delay={0.2}>
            <p className={styles.statementText}>
              ZENJI makes heavyweight tees for people who actually watch the shows. The
              reference reads as design first. Drawn for the story it belongs to. No stock
              templates, no restocks, ever.
            </p>
            <Link to="/story" className={styles.statementCta}>
              Read our story
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- 5. the chapters: three tees as brand lore ---------- */}
      <section className={styles.chapters} aria-labelledby="chapters-title">
        <div className="container">
          <Reveal>
            <p className={`eyebrow ${styles.dropEyebrow}`}>The lore // 伝説</p>
            <h2 id="chapters-title" className={`display ${styles.chaptersTitle}`}>
              Wear the arc
            </h2>
          </Reveal>
          <div className={styles.chaptersRow}>
            {CHAPTERS.map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.1}>
                <Link to={`/drop/${c.slug}`} className={styles.chapter}>
                  <span className={styles.chapterNum}>{c.n}</span>
                  <span className={styles.chapterMedia}>
                    <SmartImage
                      src={c.img}
                      alt=""
                      className={styles.chapterImg}
                      loading="lazy"
                    />
                    <span className={styles.chapterWash} style={{ background: c.accent }} />
                  </span>
                  <span className={styles.chapterName}>{c.t}</span>
                  <span className={styles.chapterDesc}>{c.d}</span>
                  <span className={styles.chapterCta} style={{ color: c.accent }}>
                    View the tee
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 6. campaign band: the lookbook as a film still ---------- */}
      <section className={styles.campaign} aria-labelledby="campaign-title">
        <Link to="/lookbook" className={styles.campaignLink}>
          <div className={styles.campaignMedia}>
            <SmartImage
              src="/lookbook/look-6.webp"
              alt=""
              className={styles.campaignImg}
              loading="lazy"
            />
            <div className={styles.campaignShade} aria-hidden="true" />
          </div>
          <div className={`container ${styles.campaignContent}`}>
            <Reveal>
              <h2 id="campaign-title" className={`statement ${styles.campaignTitle}`}>
                The lookbook
              </h2>
              <p className={styles.campaignText}>
                Eight frames from the Origin Drop campaign. The cotton, shot on the bodies
                it was cut for.
              </p>
              <span className={styles.campaignCta}>View the lookbook</span>
            </Reveal>
          </div>
        </Link>
      </section>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </>
  )
}
