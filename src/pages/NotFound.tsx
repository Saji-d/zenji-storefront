import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <section className={styles.wrap}>
      <p className="eyebrow">404</p>
      <h1 className={`display ${styles.title}`}>
        Page not found<span className={styles.accent}>.</span>
      </h1>
      <p className={styles.text}>
        This page does not exist, or the drop it pointed at has sold through and closed
        for good.
      </p>
      <Link to="/" className="btn btn--primary">
        Back to the home page
      </Link>
    </section>
  )
}
