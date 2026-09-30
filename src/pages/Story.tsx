import { Link } from 'react-router-dom'
import styles from '../components/Story.module.css'
import { SmartImage } from '../components/SmartImage'
import { Reveal } from '../components/motion/Reveal'

/**
 * Every line here is either the brand's own published copy or a verified
 * product fact. No invented run sizes, seasons or production details.
 */
const CHAPTERS = [
  {
    title: 'Origin',
    body: 'ZENJI was founded in Australia in 2024 for dreamers, fighters, creators and outsiders. People who move through the world on their own terms. What you wear should tell a story.',
    img: '/lookbook/look-5.webp',
    alt: 'ZENJI campaign photograph',
  },
  {
    title: 'The craft',
    body: 'Every piece is 100% heavyweight 240gsm cotton, garment washed and screen-printed, cut oversized from XS to XXL. The build is deliberately plain so the artwork carries the weight.',
    img: '/lookbook/look-6.webp',
    alt: 'ZENJI campaign photograph',
  },
  {
    title: 'The arc',
    body: 'Anime-inspired, gamer-built, community-owned. Each drop is a chapter of the same story, and the story only moves forward. Nothing is reprinted once it sells through.',
    img: '/lookbook/look-3.webp',
    alt: 'ZENJI campaign photograph',
  },
]

const RULES = [
  {
    title: 'No restocks',
    body: 'Every design is printed in a single run. When a size is gone, it stays gone.',
  },
  {
    title: 'Heavyweight only',
    body: '240gsm cotton, oversized cut, XS to XXL. Built to outlast the hype cycle.',
  },
  {
    title: 'Story first',
    body: 'Wear the story, not a logo.',
  },
]

export default function Story() {
  return (
    <section className={styles.section} aria-labelledby="story-title">
      <div className="container">
        <Reveal>
          <div className={styles.pageHead}>
            <p className="eyebrow">Since 2024</p>
            <h1 id="story-title" className={`display ${styles.pageTitle}`}>
              Our story
            </h1>
            <p className={styles.pageLede}>
              Anime-inspired. Gamer-built. Community-owned.
            </p>
          </div>
        </Reveal>

        {CHAPTERS.map((ch, i) => (
          <div key={ch.title} className={`${styles.chapter} ${i % 2 === 1 ? styles.flip : ''}`}>
            <Reveal className={styles.chapterMedia}>
              <SmartImage
                src={ch.img}
                alt={ch.alt}
                className={styles.chapterImg}
                loading="lazy"
                width={900}
                height={1350}
              />
            </Reveal>
            <Reveal delay={0.1} className={styles.chapterCopy}>
              <h2 className={styles.chapterTitle}>{ch.title}</h2>
              <p className={styles.chapterBody}>{ch.body}</p>
            </Reveal>
          </div>
        ))}

        <div className={styles.rules}>
          <Reveal>
            <p className={styles.rulesKicker}>The rules</p>
          </Reveal>
          <ol className={styles.ruleList}>
            {RULES.map((rule, i) => (
              <Reveal key={rule.title} as="li" delay={i * 0.06} className={styles.ruleRow}>
                <h3 className={styles.ruleTitle}>{rule.title}</h3>
                <p className={styles.ruleBody}>{rule.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal>
          <div className={styles.storyCta}>
            <Link to="/drop" className="btn btn--primary">Shop the drop</Link>
            <Link to="/lookbook" className="btn btn--ghost">View the campaign</Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
