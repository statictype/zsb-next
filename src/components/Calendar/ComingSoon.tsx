import { RiArrowRightUpLine } from '@remixicon/react'
import styles from './ComingSoon.module.css'

export interface SocialLink {
  label: string
  href: string
}

// Stands in for the calendar on a live edition whose events aren't announced
// yet (ZSB-34) — in practice only ever the forthcoming edition, since a past
// one always has its programme. It keeps the calendar's section + "Calendar"
// header so the page reads continuously, then turns the empty schedule into a
// "watch this space" with a way to follow along. Newsletter signup arrives as
// a follow-up once the footer rework (ZSB-11) lands.
export function ComingSoon({ year, socials }: { year: number; socials: SocialLink[] }) {
  return (
    <section className={styles.section} aria-labelledby="calendar-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id="calendar-heading" className={styles.title}>
            Calendar
          </h2>
          <p className={styles.meta}>
            <span className={styles.metaYear}>{year}</span>
            <span className={styles.metaDot} aria-hidden />
            <span className={styles.metaSoon}>Coming soon</span>
          </p>
        </header>

        <div className={styles.notice}>
          <p className={styles.headline}>The programme is taking shape.</p>
          <p className={styles.body}>
            Talks, openings, exhibitions and workshops across the city are being finalised. The full
            calendar lands here soon.
          </p>

          {socials.length > 0 && (
            <div className={styles.follow}>
              <span className={styles.followLabel}>Follow for updates</span>
              <ul className={styles.links}>
                {socials.map((social) => (
                  <li key={social.label}>
                    <a className={styles.link} href={social.href} target="_blank" rel="noreferrer">
                      {social.label} <RiArrowRightUpLine size={15} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
