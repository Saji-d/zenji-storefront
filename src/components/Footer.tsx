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
      {/* signal capture */}
      <div className={`container ${styles.signal}`}>
        <div className={styles.signalCopy}>
          <p className={styles.signalKicker}>TRANSMISSIONS <span aria-hidden="true">//</span> 通信</p>
          <h2 className={styles.signalTitle}>Join the signal</h2>
          <p className={styles.signalText}>
            Drop dates, early access and the pre-drop discount — before anyone else.
          </p>
        </div>
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
        <p className={styles.signalNote}>Demo only — no email is sent or stored.</p>
      </div>

      {/* oversized wordmark */}
      <div className={`container ${styles.markWrap}`} aria-hidden="true">
        <p className={styles.mark}>
          ZENJI<span className={styles.markKanji}>禅</span>
        </p>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p className={styles.meta}>
          Demo storefront concept for ZENJI · Original design &amp; code · No real payments,
          accounts or orders.
        </p>
        <p className={styles.meta}>
          Inspired by zenji.shop — not affiliated. Built as a frontend portfolio piece.
        </p>
        <a href="#top" className={styles.topLink}>
          BACK TO TOP ↑
        </a>
      </div>
    </footer>
  )
}
