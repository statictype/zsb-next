import { CookieSettingsButton } from '@/components/CookieBanner/CookieSettingsButton'
import shared from '@/components/Shared.module.css'
import { SITE_NAME } from '@/lib/constants'
import { pageMetadata } from '@/lib/seo'
import styles from './page.module.css'

export const metadata = {
  ...pageMetadata({
    title: 'Privacy & Cookies',
    description: `How ${SITE_NAME} handles your data and which cookies we use.`,
    path: '/privacy',
  }),
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={shared.pageTitle}>
            Privacy &amp; <span className={shared.accent}>Cookies</span>
          </h1>
          <p className={shared.lead}>
            How {SITE_NAME} handles your data. Short version: we use Google Analytics to count
            visitors. No ads, no cross-site tracking, no selling data.
          </p>
        </div>
      </section>

      <section className={`${shared.section} ${shared.sectionDark} ${styles.body}`}>
        <div className={shared.sectionInner}>
          <article className={styles.article}>
            <h2>Who we are</h2>
            <p>
              This site is operated by the organisers of {SITE_NAME} (Zilele Sculpturii București),
              a contemporary sculpture event based in Bucharest, Romania. Contact us at{' '}
              <a href="mailto:office@filialadesculptura.com">office@filialadesculptura.com</a> for
              any privacy question.
            </p>

            <h2>What we collect</h2>
            <p>
              Only what Google Analytics 4 collects when you accept cookies: anonymised IP address,
              page views, device and browser type, and approximate location (city level). We do{' '}
              <strong>not</strong> collect names, email addresses, or payment information through
              this site.
            </p>

            <h2>Cookies we use</h2>
            <ul>
              <li>
                <strong>zsb_consent</strong> — first-party, essential. Stores your consent choice
                (granted or denied). Six-month expiry. Always set.
              </li>
              <li>
                <strong>_ga, _ga_*</strong> — third-party (Google Analytics 4). Distinguishes
                visitors and sessions. Set only after you click <em>Accept</em>. Typical expiry: up
                to two years.
              </li>
            </ul>
            <p>
              If you click <em>Reject</em>, no analytics scripts load and no analytics cookies are
              set.
            </p>

            <h2>Legal basis</h2>
            <p>
              We process analytics data on the basis of your consent (GDPR Art. 6(1)(a) and Law
              506/2004 Art. 4), which you can withdraw at any time using the button below.
            </p>

            <h2>Your rights</h2>
            <p>
              Under GDPR you have the right to access, correct, delete, or export your data, and to
              lodge a complaint with{' '}
              <a href="https://www.dataprotection.ro/" rel="noreferrer noopener" target="_blank">
                ANSPDCP
              </a>
              , the Romanian data protection authority. Email us to exercise any of these rights.
            </p>

            <h2>Change your mind</h2>
            <p>You can withdraw or update your consent at any time:</p>
            <div className={styles.settingsRow}>
              <CookieSettingsButton />
            </div>

            <p className={styles.updated}>Last updated: 24 April 2026.</p>
          </article>
        </div>
      </section>
    </main>
  )
}
