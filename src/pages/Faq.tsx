import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FAQS } from '../data/faq'
import { Reveal } from '../components/motion/Reveal'
import styles from './Faq.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className={styles.page} aria-labelledby="faq-title">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Before you email</p>
          <h1 id="faq-title" className={`display ${styles.title}`}>FAQ</h1>
          <p className={styles.lede}>
            Fabric, fit, shipping and the no-restock policy, answered.
          </p>
        </Reveal>

        <div className={styles.list}>
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <Reveal key={item.q} delay={i * 0.03}>
                <div className={styles.item}>
                  <button
                    type="button"
                    className={styles.q}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className={styles.qText}>{item.q}</span>
                    <span className={styles.qIcon} aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-a-${i}`}
                        role="region"
                        aria-labelledby={`faq-q-${i}`}
                        className={styles.a}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <p>{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal>
          <div className={styles.more}>
            <p>Still need an answer?</p>
            <div className={styles.moreCtas}>
              <Link to="/drop" className="btn btn--primary">Shop the drop</Link>
              <Link to="/story" className="btn btn--ghost">Read the story</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
