import styles from './Story.module.css'
import { SmartImage } from './SmartImage'
import { Reveal } from './motion/Reveal'

const CHAPTERS = [
  {
    no: '01',
    jp: '第一章',
    title: 'ORIGIN',
    body: 'ZENJI began with one belief: what you wear should tell a story. Built in Australia for the dreamers, fighters, creators and outsiders who move on their own terms.',
    img: '/lookbook/look-5.webp',
    alt: 'ZENJI tee photographed against concrete',
  },
  {
    no: '02',
    jp: '第二章',
    title: 'THE DROP',
    body: 'Six designs, one run, 200 units each. Every piece is pressed once in 240gsm heavyweight cotton — then the file is closed. What sells out stays gone.',
    img: '/lookbook/look-6.webp',
    alt: 'Detail view of heavyweight ZENJI cotton',
  },
]

const RULES = [
  { n: 'R.01', title: 'One run. Never again.', body: 'Sold out means sold out — nothing is reprinted, ever.' },
  { n: 'R.02', title: 'Heavyweight only.', body: '240gsm cotton, oversized cut, sizes XS–XXL. Holds shape wash after wash.' },
  { n: 'R.03', title: 'Story first.', body: 'Each drop is a chapter. Wear the arc, not a logo.' },
]

export function Story() {
  return (
    <section id="story" className={styles.section} aria-labelledby="story-title">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <h2 id="story-title" className="display">
              Our Story
            </h2>
            <p className="eyebrow">Manifesto // wear the arc</p>
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
              <span className={styles.chapterNo} aria-hidden="true">
                {ch.no}
              </span>
              <p className={styles.chapterKicker}>
                {ch.jp} <span aria-hidden="true">//</span> CHAPTER {ch.no}
              </p>
              <h3 className={styles.chapterTitle}>{ch.title}</h3>
              <p className={styles.chapterBody}>{ch.body}</p>
            </Reveal>
          </div>
        ))}

        {/* rules as manifesto rows, not cards */}
        <div id="rules" className={styles.rules}>
          <Reveal>
            <p className={styles.rulesKicker}>03 / THE RULES <span aria-hidden="true">//</span> 禅</p>
          </Reveal>
          <ol className={styles.ruleList}>
            {RULES.map((rule, i) => (
              <Reveal key={rule.n} as="li" delay={i * 0.06} className={styles.ruleRow}>
                <span className={styles.ruleN} aria-hidden="true">
                  {rule.n}
                </span>
                <h4 className={styles.ruleTitle}>{rule.title}</h4>
                <p className={styles.ruleBody}>{rule.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
