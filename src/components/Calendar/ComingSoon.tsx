import { RiArrowRightUpLine } from '@remixicon/react'
import { comingSoon } from './ComingSoon.recipe'

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
  const s = comingSoon()
  return (
    <section className={s.section} aria-labelledby="calendar-heading">
      <div className={s.inner}>
        <header className={s.header}>
          <h2 id="calendar-heading" className={s.title}>
            Calendar
          </h2>
          <p className={s.meta}>
            <span className={s.metaYear}>{year}</span>
            <span className={s.metaDot} aria-hidden />
            <span className={s.metaSoon}>Coming soon</span>
          </p>
        </header>

        <div className={s.notice}>
          <p className={s.headline}>The programme is taking shape.</p>
          <p className={s.body}>
            Talks, openings, exhibitions and workshops across the city are being finalised. The full
            calendar lands here soon.
          </p>

          {socials.length > 0 && (
            <div className={s.follow}>
              <span className={s.followLabel}>Follow for updates</span>
              <ul className={s.links}>
                {socials.map((social) => (
                  <li key={social.label}>
                    <a className={s.link} href={social.href} target="_blank" rel="noreferrer">
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
