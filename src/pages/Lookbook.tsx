import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/motion/Reveal'
import styles from '../components/Lookbook.module.css'

/**
 * Captions.
 *
 * The titles are editorial register — mood, not product. ZENJI publishes no
 * per-look breakdown and there is no way to verify which tee is worn in which
 * frame, so pairing these photographs with named designs would be inventing a
 * fact. Every description line is drawn from specs the brand actually states:
 * 240gsm cotton, oversized fit, garment washed, one graphic, limited runs.
 */
const LOOKS = [
  {
    src: 'look-7',
    title: 'Opening frame',
    note: 'Heavyweight 240gsm cotton, oversized cut.',
  },
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
 * Placement rhythm for the eight frames.
 *
 * The point of the lookbook is that photography dominates, so the sequence
 * deliberately refuses a uniform grid: each frame takes a different column
 * span, alternates sides, and a few are pulled up so neighbouring frames
 * overlap slightly. `shift` is a negative top margin expressed in vh.
 */
const LAYOUT = [
  { start: 1, end: 8, ratio: '4 / 5', shift: 0 },
  { start: 9, end: 13, ratio: '3 / 4', shift: 9 },
  { start: 2, end: 6, ratio: '1 / 1', shift: -4 },
  { start: 7, end: 13, ratio: '4 / 5', shift: 5 },
  { start: 1, end: 5, ratio: '3 / 4', shift: -5 },
  { start: 6, end: 11, ratio: '1 / 1', shift: 4 },
  { start: 3, end: 9, ratio: '4 / 5', shift: -3 },
] as const

export default function Lookbook() {
  const reduce = useReducedMotion()
  const leadRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: leadRef, offset: ['start end', 'end start'] })
  const leadY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  const [lead, ...rest] = LOOKS

  return (
    <section className={styles.section} aria-labelledby="lookbook-title">
      <div className="container">
        <Reveal>
          <div className={styles.pageHead}>
            <h1 id="lookbook-title" className={`statement ${styles.pageTitle}`}>
              Lookbook
            </h1>
            <p className={styles.pageLede}>
              Eight frames from the Origin Drop campaign, shot on the same heavyweight
              cotton the drop ships in.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Immersive, edge-to-edge lead. No frame, no border, no inset — the
          photograph is the page. */}
      <div ref={leadRef} className={styles.leadWrap}>
        <motion.figure className={styles.lead} style={{ y: reduce ? 0 : leadY }}>
          <img
            src={`/lookbook/${lead.src}.webp`}
            alt={`ZENJI Origin Drop campaign, opening frame`}
            className={styles.leadImg}
            width={1200}
            height={1803}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <figcaption className={styles.leadCaption}>
            <span className={styles.lookNo}>Look 01</span>
            <span className={styles.lookTitle}>{lead.title}</span>
            <span className={styles.lookNote}>{lead.note}</span>
          </figcaption>
        </motion.figure>
      </div>

      <div className="container">
        <div className={styles.statementRow}>
          <Reveal>
            <h2 className={`statement ${styles.statementTitle}`}>
              Heavyweight cotton,
              <br />
              worn every day.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={styles.statementCopy}>
              240gsm, oversized through the body, and cut to keep its shape. Once a drop
              sells through it is not reprinted.
            </p>
          </Reveal>
        </div>

        <div className={styles.sequence}>
          {rest.map((look, i) => {
            const slot = LAYOUT[i]
            return (
              <Reveal
                key={look.src}
                className={styles.frame}
                style={
                  {
                    '--col-start': slot.start,
                    '--col-end': slot.end,
                    '--ratio': slot.ratio,
                    '--shift': `${slot.shift}vh`,
                  } as CSSProperties
                }
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
                    <span className={styles.lookNo}>Look {String(i + 2).padStart(2, '0')}</span>
                    <span className={styles.lookTitle}>{look.title}</span>
                    <span className={styles.lookNote}>{look.note}</span>
                  </figcaption>
                </figure>
              </Reveal>
            )
          })}
        </div>

        <div className={styles.outro}>
          <Link to="/drop" className="btn btn--primary">
            Shop the drop
          </Link>
        </div>
      </div>
    </section>
  )
}
