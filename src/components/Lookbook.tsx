import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import styles from './Lookbook.module.css'
import { SmartImage } from './SmartImage'
import { Reveal } from './motion/Reveal'

/* unique editorial captions — consistent LOOK numbering system */
const LOOKS: Record<string, string> = {
  'look-1': 'LOOK 01 // AFTER HOURS',
  'look-2': 'LOOK 02 // FIRST LIGHT',
  'look-3': 'LOOK 03 // NEON DISTRICT',
  'look-4': 'LOOK 04 // STATIC BLOOM',
  'look-5': 'LOOK 05 // TRAINING GROUNDS',
  'look-6': 'LOOK 06 // LAST SIGNAL',
}

export function Lookbook() {
  const reduce = useReducedMotion()
  const leadRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: leadRef,
    offset: ['start end', 'end start'],
  })
  const leadY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <section id="lookbook" className={styles.section} aria-labelledby="lookbook-title">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <h2 id="lookbook-title" className="display">
              Lookbook
            </h2>
            <p className="eyebrow">The Origin Drop // AW26 campaign</p>
          </div>
        </Reveal>
      </div>

      {/* full-bleed lead with parallax */}
      <div ref={leadRef} className={styles.leadWrap}>
        <motion.figure className={styles.lead} style={{ y: reduce ? 0 : leadY }}>
          <SmartImage
            src="/lookbook/look-1.webp"
            alt="Model wearing the Blue Flame tee in a night city setting"
            className={styles.leadImg}
            loading="lazy"
          />
          <figcaption className={styles.leadCaption}>
            <span className={styles.lookNo}>{LOOKS['look-1']}</span>
            <span className={styles.lookName}>Blue Flame — after hours</span>
          </figcaption>
        </motion.figure>
      </div>

      <div className="container">
        {/* headline + story row */}
        <div className={styles.storyRow}>
          <Reveal>
            <p className={styles.kicker}>THE_ORIGIN_DROP</p>
            <h3 className={styles.headline}>
              Six designs.
              <br />
              One transmission.
              <br />
              <span className={styles.accent}>No reruns.</span>
            </h3>
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

        {/* asymmetric mosaic: large + stacked pair */}
        <div className={styles.mosaic}>
          <Reveal className={styles.mosaicLarge}>
            <figure className={styles.mosaicItem}>
              <SmartImage
                src="/lookbook/look-2.webp"
                alt="Model wearing a ZENJI heavyweight tee, mid-motion"
                className={styles.mosaicImg}
                loading="lazy"
              />
              <figcaption className={styles.mosaicCaption}>{LOOKS['look-2']}</figcaption>
            </figure>
          </Reveal>
          <div className={styles.mosaicStack}>
            {(['look-3', 'look-4'] as const).map((look, i) => (
              <Reveal key={look} delay={0.08 + i * 0.1}>
                <figure className={styles.mosaicItem}>
                  <SmartImage
                    src={`/lookbook/${look}.webp`}
                    alt={`Lookbook — ${LOOKS[look]}`}
                    className={styles.mosaicImg}
                    loading="lazy"
                  />
                  <figcaption className={styles.mosaicCaption}>{LOOKS[look]}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
