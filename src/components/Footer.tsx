import { Link } from 'react-router-dom'
import { FooterSignature } from './FooterSignature'
import styles from './Footer.module.css'

/**
 * Real platform marks rather than the platform name set in type. Each icon
 * carries its own brand colour so the footer gets one small chromatic accent
 * against an otherwise monochrome page, and each link is labelled for anyone
 * who cannot see the glyph.
 */
const SOCIALS = [
  {
    label: 'ZENJI on Instagram',
    href: 'https://www.instagram.com/zenji_.shop/',
    icon: 'instagram',
  },
  {
    label: 'ZENJI on TikTok',
    href: 'https://www.tiktok.com/@zenji_.shop',
    icon: 'tiktok',
  },
  {
    label: 'ZENJI on Facebook',
    href: 'https://www.facebook.com/people/ZENJI/61592433253702/',
    icon: 'facebook',
  },
] as const

const ROUTES = [
  { to: '/drop', label: 'Shop' },
  { to: '/collection', label: 'Collections' },
  { to: '/lookbook', label: 'Lookbook' },
  { to: '/story', label: 'Story' },
  { to: '/faq', label: 'FAQ' },
]

/** The TikTok note, reused three times to build the cyan/red chromatic edge. */
const NOTE =
  'M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.3v13.2a2.65 2.65 0 1 1-1.9-2.53V10.4a5.9 5.9 0 1 0 5.2 5.86V9.01a7.2 7.2 0 0 0 4.2 1.35V7.1a4.06 4.06 0 0 1-3.14-1.28Z'

function SocialIcon({ icon }: { icon: (typeof SOCIALS)[number]['icon'] }) {
  if (icon === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient
            id="zenji-ig"
            x1="2"
            y1="22"
            x2="22"
            y2="2"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#FEDA75" />
            <stop offset="0.33" stopColor="#FA7E1E" />
            <stop offset="0.66" stopColor="#D62976" />
            <stop offset="1" stopColor="#962FBF" />
          </linearGradient>
        </defs>
        <rect
          x="2.6"
          y="2.6"
          width="18.8"
          height="18.8"
          rx="5.4"
          fill="none"
          stroke="url(#zenji-ig)"
          strokeWidth="1.9"
        />
        <circle
          cx="12"
          cy="12"
          r="4.5"
          fill="none"
          stroke="url(#zenji-ig)"
          strokeWidth="1.9"
        />
        <circle cx="17.3" cy="6.7" r="1.3" fill="#D62976" />
      </svg>
    )
  }

  if (icon === 'tiktok') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d={NOTE} fill="#25F4EE" transform="translate(-0.7 0)" />
        <path d={NOTE} fill="#FE2C55" transform="translate(0.7 0)" />
        <path d={NOTE} fill="#FFFFFF" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      <path
        d="M13.9 20.9v-7.4h2.5l.38-2.9H13.9V8.5c0-.84.24-1.41 1.44-1.41h1.54V4.45A20.6 20.6 0 0 0 14.65 4.4c-2.18 0-3.67 1.33-3.67 3.77v2.43H8.5v2.9h2.48v7.4z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <nav className={styles.routeLinks} aria-label="Footer">
          {ROUTES.map((r) => (
            <Link key={r.to} to={r.to} className={styles.routeLink}>
              {r.label}
            </Link>
          ))}
        </nav>

        <ul className={styles.socials}>
          {SOCIALS.map((s) => (
            <li key={s.icon}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className={styles.social}
                title={s.label}
              >
                <span className="sr-only">{s.label}</span>
                <SocialIcon icon={s.icon} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className={`container ${styles.legal}`}>
        <p className={styles.meta}>
          Demo storefront concept for ZENJI · Original design &amp; code · No real payments,
          accounts or orders.
        </p>
        <p className={styles.meta}>
          Inspired by zenji.shop. Not affiliated. Built as a frontend portfolio piece.
        </p>
        <p className={styles.copyright}>
          <span className={styles.copyrightMark}>ZENJI</span> © {year}
        </p>
      </div>

      {/* The signature. Last thing on the page: the wordmark as a particle
          field, repelled by the cursor, settled from a marble-scatter on first
          reveal. */}
      <FooterSignature />
    </footer>
  )
}
