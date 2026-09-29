import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import styles from './Header.module.css'

interface HeaderProps {
  onOpenCart: () => void
}

const NAV = [
  { to: '/drop', label: 'Shop' },
  { to: '/collection', label: 'Collections' },
  { to: '/lookbook', label: 'Lookbook' },
  { to: '/story', label: 'Story' },
  { to: '/faq', label: 'FAQ' },
]

const EASE = [0.22, 1, 0.36, 1] as const

export function Header({ onOpenCart }: HeaderProps) {
  const { totals } = useCart()
  const { ids } = useWishlist()
  const { pathname } = useLocation()
  const reduce = useReducedMotion()

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close the mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const cartLabel = `Open cart, ${totals.count} item${totals.count === 1 ? '' : 's'}`

  return (
    <>
      <header className={`${styles.header} ${scrolled || menuOpen ? styles.solid : ''}`}>
        <div className={`container ${styles.inner}`}>
          <Link to="/" className={styles.wordmark} aria-label="ZENJI — home">
            ZENJI<span className={styles.kanji}>禅</span>
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            {NAV.map((item, i) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? styles.active : undefined)}
              >
                <span className={styles.navIndex} aria-hidden="true">
                  0{i + 1}
                </span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.actions}>
            <Link to="/wishlist" className={styles.iconBtn} aria-label={`Wishlist, ${ids.size} item${ids.size === 1 ? '' : 's'}`}>
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
            </Link>

            <button type="button" className={styles.iconBtn} onClick={onOpenCart} aria-label={cartLabel}>
              <span aria-hidden="true">CART</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={totals.count}
                  className={styles.badge}
                  initial={reduce ? false : { scale: 0.55, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.55, opacity: 0, position: 'absolute' }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
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

      {/* fullscreen mobile navigation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className={styles.mobileMenu}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <motion.nav
              aria-label="Mobile"
              style={{ '--i': 0 } as React.CSSProperties}
            >
              {[{ to: '/', label: 'Home' }, ...NAV].map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.06, duration: 0.4, ease: EASE }}
                >
                  <Link to={item.to} onClick={() => setMenuOpen(false)}>
                    <span className={styles.mobileIndex} aria-hidden="true">
                      0{i + 1}
                    </span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
