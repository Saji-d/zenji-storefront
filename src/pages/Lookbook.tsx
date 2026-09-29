import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { SmartImage } from '../components/SmartImage'
import { Reveal } from '../components/motion/Reveal'
import styles from '../components/Lookbook.module.css'

const LOOKS = [
  { src: 'look-1', caption: 'LOOK 01 // AFTER HOURS', title: 'Blue Flame — after hours' },
  { src: 'look-2', caption: 'LOOK 02 // FIRST LIGHT', title: 'Warrior Spirit — first light' },
  { src: 'look-3', caption: 'LOOK 03 // NEON DISTRICT', title: 'Demon Blood — neon district' },
  { src: 'look-4', caption: 'LOOK 04 // STATIC BLOOM', title: 'Paradise Spirit — static bloom' },
  { src: 'look-5', caption: 'LOOK 05 // TRAINING GROUNDS', title: 'Bushido — training grounds' },
  { src: 'look-6', caption: 'LOOK 06 // LAST SIGNAL', title: 'Limitless — last signal' },
]

export default function Lookbook() {
  const reduce = useReducedMotion()
  const leadRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: leadRef, offset: ['start end', 'end start'] })
  const leadY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <section className={styles.section} aria-labelledby="lookbook-title">
      <div className="container">
        <Reveal>
          <div className={styles.pageHead}>
            <p className="eyebrow">Campaign // AW26</p>
            <h1 id="lookbook-title" className={`display ${styles.pageTitle}`}>LOOKBOOK</h1>
            <p className={styles.pageLede}>
              Six looks, one transmission. Shot once — the same rule the garments follow.
            </p>
          </div>
        </Reveal>
      </div>

      <div ref={leadRef} className={styles.leadWrap}>
        <motion.figure className={styles.lead} style={{ y: reduce ? 0 : leadY }}>
          <SmartImage
            src="/lookbook/look-1.webp"
            alt="Model wearing the Blue Flame tee in a night city setting"
            className={styles.leadImg}
            loading="eager"
          />
          <figcaption className={styles.leadCaption}>
            <span className={styles.lookNo}>{LOOKS[0].caption}</span>
            <span className={styles.lookName}>{LOOKS[0].title}</span>
          </figcaption>
        </motion.figure>
      </div>

      <div className="container">
        <div className={styles.storyRow}>
          <Reveal>
            <p className={styles.kicker}>THE_ORIGIN_DROP</p>
            <h2 className={styles.headline}>
              Six designs.
              <br />
              One transmission.
              <br />
              <span className={styles.accent}>No reruns.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <div className={styles.storyCopy}>
              <p>
                Shot across neo-Tokyo backdrops, the Origin Drop campaign pairs
                heavyweight cotton with hard light. Each look was captured once —
                the same rule the garments follow.
              </p>
              <p className={styles.lookMeta}>SHOT ON LOCATION // 240GSM // AW26</p>
            </div>
          </Reveal>
        </div>

        {/* remaining looks: alternating editorial rows */}
        <div className={styles.altRows}>
          {LOOKS.slice(1).map((look, i) => (
            <Reveal key={look.src} delay={0.05}>
              <figure className={`${styles.mosaicItem} ${i % 2 === 1 ? styles.rowFlip : ''}`}>
                <SmartImage
                  src={`/lookbook/${look.src}.webp`}
                  alt={`Lookbook — ${look.title}`}
                  className={styles.mosaicImg}
                  loading="lazy"
                />
                <figcaption className={styles.mosaicCaption}>{look.caption}</figcaption>
                <span className={styles.rowTitleOverlay} aria-hidden="true">{look.title}</span>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
