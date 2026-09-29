import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/zenji_.shop/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@zenji_.shop' },
  { label: 'Facebook', href: 'https://www.facebook.com/people/ZENJI/61592433253702/' },
]

const ROUTES = [
  { to: '/drop', label: 'Shop' },
  { to: '/collection', label: 'Collections' },
  { to: '/lookbook', label: 'Lookbook' },
  { to: '/story', label: 'Story' },
  { to: '/faq', label: 'FAQ' },
]

export function Footer() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setEmail('')
  }

  return (
    <footer className={styles.footer}>
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

      <div className={`container ${styles.markWrap}`} aria-hidden="true">
        <p className={styles.mark}>
          ZENJI<span className={styles.markKanji}>禅</span>
        </p>
      </div>

      <div className={`container ${styles.bottom}`}>
        <nav className={styles.routeLinks} aria-label="Footer">
          {ROUTES.map((r) => (
            <Link key={r.to} to={r.to} className={styles.routeLink}>
              {r.label}
            </Link>
          ))}
        </nav>
        <div className={styles.socials}>
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className={styles.social}>
              {s.label.toUpperCase()} ↗
            </a>
          ))}
        </div>
      </div>

      <div className={`container ${styles.legal}`}>
        <p className={styles.meta}>
          Demo storefront concept for ZENJI · Original design &amp; code · No real payments,
          accounts or orders.
        </p>
        <p className={styles.meta}>
          Inspired by zenji.shop — not affiliated. Built as a frontend portfolio piece.
        </p>
      </div>
    </footer>
  )
}
