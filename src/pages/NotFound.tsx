import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <section className={styles.wrap}>
      <p className="eyebrow">_ERROR_404</p>
      <h1 className={`display ${styles.title}`}>
        SIGNAL<span className={styles.accent}>.</span>LOST
      </h1>
      <p className={styles.text}>
        This transmission does not exist — or the file was closed after the drop.
      </p>
      <Link to="/" className="btn btn--primary">
        Return to base →
      </Link>
    </section>
  )
}
