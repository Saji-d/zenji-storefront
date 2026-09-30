import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/motion/Reveal'
import styles from '../components/Lookbook.module.css'

/**
 * Captions.
 *
 * The titles are editorial register, mood not product. ZENJI publishes no
 * per-look breakdown and there is no way to verify which tee is worn in which
 * frame, so pairing these photographs with named designs would be inventing a
 * fact. Every description line is drawn from specs the brand actually states:
 * 240gsm cotton, oversized fit, garment washed, one graphic, limited runs.
 */
const LOOKS = [
  {
    src: 'look-2',
    title: 'City after dark',
    note: 'The streetwear silhouette behind the drop.',
  },
  {
    src: 'look-3',
    title: 'Quiet frame',
    note: 'The same cotton, shot in flat light.',
  },
  {
    src: 'look-4',
    title: 'Late shift',
    note: 'Muted colourway, one strong graphic.',
  },
  {
    src: 'look-5',
    title: 'Cold light',
    note: 'Garment washed for a softer hand.',
  },
  {
    src: 'look-6',
    title: 'Street level',
    note: 'The kind of piece worn every day.',
  },
  {
    src: 'look-7',
    title: 'The uniform',
    note: 'Heavyweight 240gsm cotton, oversized cut.',
  },
  {
    src: 'look-8',
    title: 'Last frame',
    note: 'Every drop is a limited run. Never reprinted.',
  },
  {
    src: 'look-1',
    title: 'Closing frame',
    note: 'Oversized through the body, XS to XXL.',
  },
] as const

/**
 * Mosaic placement. The gallery reads as an interlocking zigzag: row one
 * descends left to right, row two mirrors it descending right to left, and
 * the final tile swings back to centre as the tail of the wave. `m` is a top
 * margin that sets each piece's height in the staircase; `start` pins the
 * column so the mirror reads correctly.
 */
const MOSAIC = [
  { c: 4, ratio: '4 / 5', m: '0rem' },
  { c: 4, ratio: '1 / 1', m: '3.5rem' },
  { c: 4, ratio: '3 / 4', m: '7rem' },
  { c: 4, start: 9, ratio: '4 / 5', m: '0rem' },
  { c: 4, start: 5, ratio: '1 / 1', m: '3.5rem' },
  { c: 4, start: 1, ratio: '3 / 4', m: '7rem' },
] as const

/** The tail: same tile size, centre column, the wave coming back up. */
const TAIL = { c: 4, start: 5, ratio: '4 / 5', m: '3.5rem' } as const

export default function Lookbook() {
  const reduce = useReducedMotion()
  const leadRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: leadRef, offset: ['start end', 'end start'] })
  const leadY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  const [lead, ...rest] = LOOKS
  const mosaic = rest.slice(0, 6)
  const closer = rest[6]

  const col = (slot: { c: number; start?: number }) =>
    slot.start ? `${slot.start} / span ${slot.c}` : `span ${slot.c}`

  return (
    <section className={styles.section} aria-labelledby="lookbook-title">
      <div className="container">
        <Reveal>
          <div className={styles.pageHead}>
            <p className="eyebrow">The Origin Drop campaign</p>
            <h1 id="lookbook-title" className={`statement ${styles.pageTitle}`}>
              Lookbook
            </h1>
            <p className={styles.pageLede}>
              Eight frames shot on the same heavyweight cotton the drop ships in.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Full-bleed lead. The photograph is the page, and the statement is set
          across it at poster scale. */}
      <div ref={leadRef} className={styles.leadWrap}>
        <motion.figure className={styles.lead} style={{ y: reduce ? 0 : leadY }}>
          <img
            src={`/lookbook/${lead.src}.webp`}
            alt="ZENJI Origin Drop campaign, opening frame"
            className={styles.leadImg}
            width={1200}
            height={1499}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </motion.figure>
        <figcaption className={styles.leadCaption}>
          <span className={styles.lookNo}>Look 01</span>
          <span className={`statement ${styles.leadStatement}`}>
            Heavyweight cotton,
            <br />
            worn every day.
          </span>
          <span className={styles.lookNote}>{lead.note}</span>
        </figcaption>
      </div>

      <div className="container">
        {/* the puzzle: two mirrored staircase rows and a centre tail */}
        <div className={styles.mosaic}>
          {mosaic.map((look, i) => {
            const slot = MOSAIC[i]
            return (
              <Reveal
                key={look.src}
                className={styles.tile}
                style={{
                  /* placement travels as a custom property so the mobile
                     media query can override grid-column cleanly */
                  '--gc': col(slot),
                  '--ratio': slot.ratio,
                  '--m': slot.m,
                } as CSSProperties}
              >
                <figure className={styles.frameInner}>
                  <img
                    src={`/lookbook/${look.src}.webp`}
                    alt={`ZENJI Origin Drop campaign, ${look.title.toLowerCase()}`}
                    className={styles.frameImg}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className={styles.frameCaption}>
                    <span className={styles.lookNo}>
                      Look {String(i + 2).padStart(2, '0')}
                    </span>
                    <span className={styles.lookTitle}>{look.title}</span>
                    <span className={styles.lookNote}>{look.note}</span>
                  </figcaption>
                </figure>
              </Reveal>
            )
          })}

          {/* the tail: same tile size, locking the zigzag closed */}
          <Reveal
            className={styles.tile}
            style={{
              '--gc': col(TAIL),
              '--ratio': TAIL.ratio,
              '--m': TAIL.m,
            } as CSSProperties}
          >
            <figure className={styles.frameInner}>
              <img
                src={`/lookbook/${closer.src}.webp`}
                alt={`ZENJI Origin Drop campaign, ${closer.title.toLowerCase()}`}
                className={styles.frameImg}
                loading="lazy"
                decoding="async"
              />
              <figcaption className={styles.frameCaption}>
                <span className={styles.lookNo}>Look 08</span>
                <span className={styles.lookTitle}>{closer.title}</span>
                <span className={styles.lookNote}>{closer.note}</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <div className={styles.outro}>
          <p className={styles.outroNote}>
            Eight frames. One run. When a size sells through it is not reprinted.
          </p>
          <Link to="/drop" className="btn btn--primary">
            Shop the drop
          </Link>
        </div>
      </div>
    </section>
  )
}
