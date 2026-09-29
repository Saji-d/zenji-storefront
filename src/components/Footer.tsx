import { useState, type FormEvent } from 'react'
import styles from './Footer.module.css'

export function Footer() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setEmail('')
  }

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.newsletter}>
          <p className="eyebrow">Transmissions</p>
          <h2 className={`display ${styles.newsTitle}`}>Join the signal</h2>
          <p className={styles.newsText}>
            Drop dates, early access and the pre-drop discount — straight to your inbox.
          </p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="you@signal.au"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn btn--primary">
              Sign up
            </button>
          </form>
          <p className={styles.newsNote}>
            Demo only — no email is sent or stored.
          </p>
        </div>

        <div className={styles.bottom}>
          <p className={styles.wordmark}>
            ZENJI<span className={styles.kanji}>禅</span>
          </p>
          <p className={styles.meta}>
            Demo storefront concept for ZENJI · Original design &amp; code · No real
            payments, accounts or orders.
          </p>
          <p className={styles.meta}>
            Inspired by zenji.shop — not affiliated. Built as a frontend portfolio piece.
          </p>
        </div>
      </div>
    </footer>
  )
}
