import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import styles from './Hero.module.css'

interface HeroProps {
  onShopClick: () => void
}

const EASE = [0.22, 1, 0.36, 1] as const

const SHOTS = ['/hero/hero-1.webp', '/hero/hero-2.webp']

/**
 * Cinematic hero: layered model photography with a slow crossfade/ken-burns
 * loop, dark editorial veil, scanlines and a parallax type stack.
 */
export function Hero({ onShopClick }: HeroProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const veilOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.55])

  return (
    <section ref={ref} className={styles.hero} aria-label="ZENJI — The Origin Drop">
      {/* layered media */}
      <motion.div className={styles.media} style={{ y: reduce ? 0 : parallaxY }} aria-hidden="true">
        {SHOTS.map((src, i) => (
          <motion.div
            key={src}
            className={styles.shot}
            style={{ backgroundImage: `url(${src})` }}
            initial={false}
            animate={reduce ? { opacity: i === 0 ? 1 : 0 } : { opacity: [1, 1, 0, 0, 1] }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    duration: 16,
                    times: [0, 0.44, 0.5, 0.94, 1],
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 8,
                  }
            }
          />
        ))}
        <motion.div className={styles.veil} style={{ opacity: veilOpacity }} />
        <div className={styles.scanlines} />
      </motion.div>

      {/* editorial type stack */}
      <div className={`container ${styles.content}`}>
        <motion.p
          className={styles.meta}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          INCOMING TRANSMISSION // THE_ORIGIN_DROP // AU
        </motion.p>

        <motion.h1
          className={`display ${styles.title}`}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.22, ease: EASE }}
        >
          Worn by the <span className={styles.accent}>fearless</span>
        </motion.h1>

        <motion.p
          className={styles.lede}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.36, ease: EASE }}
        >
          Heavyweight anime streetwear, cut oversized and printed once.
          When a drop sells out, it never comes back.
        </motion.p>

        <motion.div
          className={styles.ctas}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
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
          transition={{ duration: 1, delay: 0.75 }}
        >
          240GSM HEAVYWEIGHT // 06 DESIGNS // NO RESTOCKS. EVER.
        </motion.p>
      </div>
    </section>
  )
}
