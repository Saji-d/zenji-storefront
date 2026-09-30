import { useCallback, useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useModalFocus } from '../hooks/useModalFocus'
import { Wordmark } from './Wordmark'
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

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close the mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  /* Full-screen menu. The shared hook gives us Escape-to-close, a focus loop
     and focus restoration; we only add the scroll lock behind the panel. */
  const { panelRef } = useModalFocus({ open: menuOpen, onClose: closeMenu })

  useEffect(() => {
    if (!menuOpen) return
    const { body } = document
    const prevOverflow = body.style.overflow
    const prevPad = body.style.paddingRight
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`
    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPad
    }
  }, [menuOpen])

  const cartLabel = `Open cart, ${totals.count} item${totals.count === 1 ? '' : 's'}`
  const wishCount = ids.size

  return (
    <>
      <header className={styles.header} data-scrolled={scrolled}>
        <div className={`container ${styles.inner}`}>
          <Link to="/" className={styles.wordmark} aria-label="ZENJI home">
            <Wordmark />
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.actions}>
            <Link
              to="/wishlist"
              className={styles.iconBtn}
              aria-label={`Wishlist, ${wishCount} item${wishCount === 1 ? '' : 's'}`}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path
                  d="M10 16.5 3.9 10.6a4 4 0 1 1 5.7-5.6l.4.4.4-.4a4 4 0 1 1 5.7 5.6Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.35"
                />
              </svg>
              {wishCount > 0 && (
                <motion.span
                  key={wishCount}
                  className={styles.badge}
                  initial={reduce ? false : { scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                >
                  {wishCount}
                </motion.span>
              )}
            </Link>

            <button
              type="button"
              className={styles.iconBtn}
              onClick={onOpenCart}
              aria-label={cartLabel}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path
                  d="M4.2 6.5h11.6l-.9 10.2H5.1Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.35"
                />
                <path
                  d="M7.3 8.3V5.9a2.7 2.7 0 0 1 5.4 0v2.4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                />
              </svg>
              <AnimatePresence mode="wait" initial={false}>
                {totals.count > 0 && (
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
                )}
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
              <span className={styles.burgerIcon} aria-hidden="true">
                <span className={styles.burgerLine} />
                <span className={styles.burgerLine} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* fullscreen mobile navigation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            className={styles.mobileMenu}
            aria-label="Menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
          >
            <nav className={styles.mobileNav} aria-label="Mobile">
              {[{ to: '/', label: 'Home' }, ...NAV].map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.055, duration: 0.4, ease: EASE }}
                >
                  <Link to={item.to} className={styles.mobileLink} onClick={closeMenu}>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className={styles.mobileFoot}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.34, duration: 0.4 }}
            >
              <Link to="/cart" className={styles.mobileLink} onClick={closeMenu}>
                Cart{totals.count > 0 ? ` (${totals.count})` : ''}
              </Link>
              <Link to="/wishlist" className={styles.mobileLink} onClick={closeMenu}>
                Wishlist{wishCount > 0 ? ` (${wishCount})` : ''}
              </Link>
              <p className={styles.mobileNote}>Free shipping over A$100</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
