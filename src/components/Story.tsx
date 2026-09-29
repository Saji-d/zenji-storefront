import styles from './Story.module.css'

const RULES = [
  {
    n: '01',
    title: 'One run. Never again.',
    body: 'Every design is pressed once, in one run of 200 units. Sold out means sold out — nothing is reprinted, ever.',
  },
  {
    n: '02',
    title: 'Heavyweight only.',
    body: '240gsm cotton, oversized cut, sizes XS–XXL. Built to sit heavy and hold shape wash after wash.',
  },
  {
    n: '03',
    title: 'Story first.',
    body: 'Each drop is a chapter — samurai discipline, neo-Tokyo signal, warrior spirit. Wear the arc, not a logo.',
  },
]

export function Story() {
  return (
    <>
      <section id="story" className={styles.section} aria-labelledby="story-title">
        <div className={`container ${styles.inner}`}>
          <div>
            <p className="eyebrow">Our story</p>
            <h2 id="story-title" className={`display ${styles.title}`}>
              Born from the warrior spirit
            </h2>
          </div>
          <div className={styles.body}>
            <p>
              ZENJI began with one belief: what you wear should tell a story.
              We cut heavyweight anime streetwear for the dreamers, fighters,
              creators and outsiders who move through the world on their own terms.
            </p>
            <p>
              Inspired by samurai discipline and neo-Tokyo signal, every piece is
              pressed once and never repeated. Your size won&apos;t come back —
              claim it while it&apos;s live.
            </p>
          </div>
        </div>
      </section>

      <section id="rules" className={styles.rules} aria-labelledby="rules-title">
        <div className="container">
          <div className="section-head">
            <h2 id="rules-title" className="display">
              The Rules
            </h2>
            <p className="eyebrow">Drop mechanics // read before you sleep</p>
          </div>
          <ol className={styles.ruleGrid}>
            {RULES.map((rule) => (
              <li key={rule.n} className={styles.rule}>
                <span className={styles.ruleN} aria-hidden="true">
                  {rule.n}
                </span>
                <h3>{rule.title}</h3>
                <p>{rule.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
