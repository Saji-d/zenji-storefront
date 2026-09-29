import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import styles from './Hero.module.css'

interface HeroProps {
  onShopClick: () => void
}

const EASE = [0.22, 1, 0.36, 1] as const

const SHOTS = ['/hero/hero-1.webp', '/hero/hero-2.webp']

/**
 * Campaign-film hero. No video asset exists in the repo, so the treatment is
 * photographic: two offset slow-pan/ken-burns layers, crossfade, cinematic
 * veil + vignette + grain, and an editorial type stack with parallax.
 */
export function Hero({ onShopClick }: HeroProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const veilOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.5])

  return (
    <section ref={ref} className={styles.hero} aria-label="ZENJI — The Origin Drop">
      {/* layered media */}
      <motion.div className={styles.media} style={{ y: reduce ? 0 : parallaxY }} aria-hidden="true">
        {SHOTS.map((src, i) => (
          <motion.div
            key={src}
            className={`${styles.shot} ${i === 1 ? styles.shotAlt : ''}`}
            style={{ backgroundImage: `url(${src})` }}
            initial={false}
            animate={reduce ? { opacity: i === 0 ? 1 : 0 } : { opacity: [1, 1, 0, 0, 1] }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    duration: 17,
                    times: [0, 0.44, 0.5, 0.94, 1],
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 8.5,
                  }
            }
          />
        ))}
        <motion.div className={styles.veil} style={{ opacity: veilOpacity }} />
        <div className={styles.vignette} />
        <div className={styles.scanlines} />
      </motion.div>

      {/* editorial type stack */}
      <div className={`container ${styles.content}`}>
        <motion.div
          className={styles.metaRow}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          <span className={styles.metaRule} aria-hidden="true" />
          <p className={styles.meta}>INCOMING TRANSMISSION // THE_ORIGIN_DROP // AU</p>
        </motion.div>

        <motion.h1
          className={`display ${styles.title}`}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.24, ease: EASE }}
        >
          <span className={styles.titleKicker}>Worn by the</span>
          <span className={styles.titleMain}>
            FEARLESS<span className={styles.accent}>.</span>
          </span>
        </motion.h1>

        <motion.p
          className={styles.lede}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
        >
          Heavyweight anime streetwear, cut oversized and printed once.
          When a drop sells out, it never comes back.
        </motion.p>

        <motion.div
          className={styles.ctas}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.54, ease: EASE }}
        >
          <button type="button" className="btn btn--primary" onClick={onShopClick}>
            Shop the drop
          </button>
          <a className="btn btn--ghost" href="#lookbook">
            View lookbook →
          </a>
        </motion.div>

        <motion.p
          className={styles.dropMeta}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          240GSM HEAVYWEIGHT <span aria-hidden="true">//</span> 06 DESIGNS{' '}
          <span aria-hidden="true">//</span> NO RESTOCKS. EVER.
        </motion.p>
      </div>
    </section>
  )
}
