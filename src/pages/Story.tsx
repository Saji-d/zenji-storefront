import { Link } from 'react-router-dom'
import styles from '../components/Story.module.css'
import { SmartImage } from '../components/SmartImage'
import { Reveal } from '../components/motion/Reveal'

const CHAPTERS = [
  {
    no: '01',
    jp: '第一章',
    title: 'ORIGIN',
    body: 'ZENJI began with one belief: what you wear should tell a story. Founded in Australia in 2024, the label exists for the dreamers, fighters, creators and outsiders who move through the world on their own terms.',
    img: '/lookbook/look-5.webp',
    alt: 'ZENJI tee photographed against concrete',
  },
  {
    no: '02',
    jp: '第二章',
    title: 'THE CRAFT',
    body: 'Every piece is 100% heavyweight 240gsm cotton, cut oversized from XS to XXL, with original artwork pressed once. The garment is built to outlast the hype cycle that produced it.',
    img: '/lookbook/look-6.webp',
    alt: 'Detail view of heavyweight ZENJI cotton',
  },
  {
    no: '03',
    jp: '第三章',
    title: 'THE ARC',
    body: 'Samurai discipline, anime lineage, modern street culture. Each drop is a chapter of the same story — and the story only moves forward. Nothing is reprinted. Nothing repeats.',
    img: '/lookbook/look-3.webp',
    alt: 'Model in a neon-lit district wearing ZENJI',
  },
]

const RULES = [
  { n: 'R.01', title: 'One run. Never again.', body: 'Every design is pressed once, in one run of 200 units. Sold out means sold out.' },
  { n: 'R.02', title: 'Heavyweight only.', body: '240gsm cotton, oversized cut, sizes XS–XXL. Holds shape wash after wash.' },
  { n: 'R.03', title: 'Story first.', body: 'Each drop is a chapter. Wear the arc, not a logo.' },
]

export default function Story() {
  return (
    <section className={styles.section} aria-labelledby="story-title">
      <div className="container">
        <Reveal>
          <div className={styles.pageHead}>
            <p className="eyebrow">Manifesto // wear the arc</p>
            <h1 id="story-title" className={`display ${styles.pageTitle}`}>OUR STORY</h1>
            <p className={styles.pageLede}>
              What you wear should tell a story. This is ours.
            </p>
          </div>
        </Reveal>

        {CHAPTERS.map((ch, i) => (
          <div key={ch.no} className={`${styles.chapter} ${i % 2 === 1 ? styles.flip : ''}`}>
            <Reveal className={styles.chapterMedia}>
              <SmartImage src={ch.img} alt={ch.alt} className={styles.chapterImg} loading="lazy" />
              <span className={styles.verticalLabel} aria-hidden="true">
                CHAPTER {ch.no} — {ch.jp}
              </span>
            </Reveal>
            <Reveal delay={0.1} className={styles.chapterCopy}>
              <span className={styles.chapterNo} aria-hidden="true">{ch.no}</span>
              <p className={styles.chapterKicker}>
                {ch.jp} <span aria-hidden="true">//</span> CHAPTER {ch.no}
              </p>
              <h2 className={styles.chapterTitle}>{ch.title}</h2>
              <p className={styles.chapterBody}>{ch.body}</p>
            </Reveal>
          </div>
        ))}

        <div className={styles.rules}>
          <Reveal>
            <p className={styles.rulesKicker}>THE RULES <span aria-hidden="true">//</span> 禅</p>
          </Reveal>
          <ol className={styles.ruleList}>
            {RULES.map((rule, i) => (
              <Reveal key={rule.n} as="li" delay={i * 0.06} className={styles.ruleRow}>
                <span className={styles.ruleN} aria-hidden="true">{rule.n}</span>
                <h3 className={styles.ruleTitle}>{rule.title}</h3>
                <p className={styles.ruleBody}>{rule.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal>
          <div className={styles.storyCta}>
            <Link to="/drop" className="btn btn--primary">Shop the drop →</Link>
            <Link to="/lookbook" className="btn btn--ghost">View the campaign →</Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
