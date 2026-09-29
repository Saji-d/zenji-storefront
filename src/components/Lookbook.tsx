import styles from './Lookbook.module.css'
import { SmartImage } from './SmartImage'
import { Reveal } from './motion/Reveal'

const CAPTIONS = ['LOOK 03 // NEON DISTRICT', 'LOOK 05 // TRAINING GROUNDS']

export function Lookbook() {
  return (
    <section id="lookbook" className={styles.section} aria-labelledby="lookbook-title">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <h2 id="lookbook-title" className="display">
              Lookbook
            </h2>
            <p className="eyebrow">The Origin Drop // AW26 campaign</p>
          </div>
        </Reveal>

        {/* lead editorial image */}
        <Reveal>
          <figure className={styles.lead}>
            <SmartImage
              src="/lookbook/look-1.webp"
              alt="Model wearing the Blue Flame tee in a night city setting"
              className={styles.leadImg}
              loading="lazy"
            />
            <figcaption className={styles.leadCaption}>
              <span className={styles.lookNo}>LOOK 01</span>
              <span className={styles.lookName}>Blue Flame — after hours</span>
            </figcaption>
          </figure>
        </Reveal>

        {/* headline + story row */}
        <div className={styles.storyRow}>
          <Reveal>
            <p className={styles.kicker}>THE_ORIGIN_DROP</p>
            <h3 className={styles.headline}>
              Six designs.
              <br />
              One transmission.
              <br />
              <span className={styles.accent}>No reruns.</span>
            </h3>
          </Reveal>
          <Reveal delay={0.12}>
            <div className={styles.storyCopy}>
              <p>
                Shot across neo-Tokyo backdrops, the Origin Drop campaign pairs
                heavyweight cotton with hard light. Each look was captured once —
                the same rule the garments follow.
              </p>
              <p className={styles.lookMeta}>SHOT ON LOCATION // 240GSM // AW26</p>
            </div>
          </Reveal>
        </div>

        {/* large + two small composition */}
        <div className={styles.mosaic}>
          <Reveal className={styles.mosaicLarge}>
            <figure className={styles.mosaicItem}>
              <SmartImage
                src="/lookbook/look-2.webp"
                alt="Model wearing a ZENJI heavyweight tee, mid-motion"
                className={styles.mosaicImg}
                loading="lazy"
              />
              <figcaption className={styles.mosaicCaption}>{CAPTIONS[0]}</figcaption>
            </figure>
          </Reveal>
          <div className={styles.mosaicStack}>
            {['look-3', 'look-4'].map((look, i) => (
              <Reveal key={look} delay={0.08 + i * 0.1}>
                <figure className={styles.mosaicItem}>
                  <SmartImage
                    src={`/lookbook/${look}.webp`}
                    alt={`Lookbook view ${i + 2} — ZENJI streetwear on location`}
                    className={styles.mosaicImg}
                    loading="lazy"
                  />
                  <figcaption className={styles.mosaicCaption}>{CAPTIONS[1]}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
