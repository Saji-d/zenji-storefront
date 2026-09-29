import { useCart } from '../context/CartContext'
import styles from './Header.module.css'

interface HeaderProps {
  onOpenCart: () => void
}

export function Header({ onOpenCart }: HeaderProps) {
  const { totals } = useCart()

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="#top" className={styles.wordmark} aria-label="ZENJI — back to top">
          ZENJI<span className={styles.kanji}>禅</span>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          <a href="#collection">Collection</a>
          <a href="#story">Story</a>
          <a href="#rules">The Rules</a>
        </nav>

        <button
          type="button"
          className={styles.cartBtn}
          onClick={onOpenCart}
          aria-label={`Open cart, ${totals.count} item${totals.count === 1 ? '' : 's'}`}
        >
          <span aria-hidden="true">CART</span>
          <span className={styles.count} aria-hidden="true">
            {totals.count}
          </span>
        </button>
      </div>
    </header>
  )
}
