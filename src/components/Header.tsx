import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useSectionSpy } from '../hooks/useSectionSpy'
import styles from './Header.module.css'

interface HeaderProps {
  onOpenCart: () => void
}

const NAV = [
  { id: 'drop', label: 'Drop' },
  { id: 'collection', label: 'Collection' },
  { id: 'lookbook', label: 'Lookbook' },
  { id: 'story', label: 'Our Story' },
]

export function Header({ onOpenCart }: HeaderProps) {
  const { totals } = useCart()
  const { ids } = useWishlist()
  const active = useSectionSpy(NAV.map((n) => n.id))
  const reduce = useReducedMotion()

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const cartLabel = `Open cart, ${totals.count} item${totals.count === 1 ? '' : 's'}`

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.solid : ''}`}>
        <div className={`container ${styles.inner}`}>
          <a href="#top" className={styles.wordmark} aria-label="ZENJI — back to top">
            ZENJI<span className={styles.kanji}>禅</span>
          </a>

          <nav className={styles.nav} aria-label="Primary">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={active === item.id ? styles.active : undefined}
                aria-current={active === item.id ? 'true' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.iconBtn}
              aria-label={`Wishlist, ${ids.size} item${ids.size === 1 ? '' : 's'}`}
              onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span aria-hidden="true">♥</span>
              {ids.size > 0 && (
                <motion.span
                  key={ids.size}
                  className={styles.badge}
                  initial={reduce ? false : { scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                >
                  {ids.size}
                </motion.span>
              )}
            </button>

            <button type="button" className={styles.iconBtn} onClick={onOpenCart} aria-label={cartLabel}>
              <span aria-hidden="true">CART</span>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={totals.count}
                  className={styles.badge}
                  initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 24 }}
                >
                  {totals.count}
                </motion.span>
              </AnimatePresence>
            </button>

            <button
              type="button"
              className={styles.burger}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className={styles.mobileMenu}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Mobile">
              {NAV.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  style={{ '--i': i } as React.CSSProperties}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
