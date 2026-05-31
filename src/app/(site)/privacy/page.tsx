import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { draftMode } from 'next/headers'
import { Suspense } from 'react'
import { CookieSettingsButton } from '@/components/CookieBanner/CookieSettingsButton'
import { Navigation } from '@/components/Navigation/Navigation'
import shared from '@/components/Shared.module.css'
import { SITE_NAME } from '@/lib/constants'
import { pageMetadata } from '@/lib/seo'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
import { getPrivacyPage, type PrivacyPage } from '@/sanity/lib/staticPages'
import styles from './page.module.css'

export const metadata = {
  ...pageMetadata({
    title: 'Privacy & Cookies',
    description: `How ${SITE_NAME} handles your data and which cookies we use.`,
    path: '/privacy',
  }),
  robots: { index: true, follow: true },
}

const FALLBACK = {
  heroTitle: 'Privacy & Cookies',
  heroTitleAccent: 'Cookies',
  heroLead: `How ${SITE_NAME} handles your data. Short version: we use Google Analytics to count visitors. No ads, no cross-site tracking, no selling data.`,
  updatedAt: '2026-04-24',
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2>{children}</h2>,
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => {
      const href = (value as { href?: string } | undefined)?.href ?? '#'
      const newTab = (value as { newTab?: boolean } | undefined)?.newTab ?? false
      if (newTab) {
        return (
          <a href={href} target="_blank" rel="noreferrer noopener">
            {children}
          </a>
        )
      }
      return <a href={href}>{children}</a>
    },
  },
}

export default async function PrivacyRoute() {
  const { isEnabled: isDraftMode } = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense fallback={<PrivacyShell />}>
        <DynamicPrivacy />
      </Suspense>
    )
  }
  return <CachedPrivacy options={{ perspective: 'published', stega: false }} />
}

async function DynamicPrivacy() {
  const options = await getDynamicFetchOptions()
  return <CachedPrivacy options={options} />
}

async function CachedPrivacy({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const page = await getPrivacyPage(options)
  return <PrivacyShell page={page} />
}

function PrivacyShell({ page }: { page?: PrivacyPage | null } = {}) {
  const title = page?.hero?.title ?? FALLBACK.heroTitle
  const accent = page?.hero?.titleAccent ?? FALLBACK.heroTitleAccent
  const lead = page?.hero?.lead ?? FALLBACK.heroLead
  const body = page?.body ?? null
  const updatedAt = page?.updatedAt ?? FALLBACK.updatedAt

  return (
    <>
      <Navigation activeId={null} />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={shared.pageTitle}>
              <HeroTitle title={title} accent={accent} />
            </h1>
            <p className={shared.lead}>{lead}</p>
          </div>
        </section>

        <section className={`${shared.section} ${shared.sectionDark} ${styles.body}`}>
          <div className={shared.sectionInner}>
            <article className={styles.article}>
              {body ? (
                <PortableText value={body} components={portableTextComponents} />
              ) : (
                <FallbackBody />
              )}

              <h2>Change your mind</h2>
              <p>You can withdraw or update your consent at any time:</p>
              <div className={styles.settingsRow}>
                <CookieSettingsButton />
              </div>

              <p className={styles.updated}>
                Last updated: {formatUpdatedAt(updatedAt)}.
              </p>
            </article>
          </div>
        </section>
      </main>
    </>
  )
}

// Fallback rendered before the privacyPage doc has been published.
function FallbackBody() {
  return (
    <>
      <h2>Who we are</h2>
      <p>
        This site is operated by the organisers of {SITE_NAME} (Zilele Sculpturii București), a
        contemporary sculpture event based in Bucharest, Romania. Contact us at{' '}
        <a href="mailto:office@filialadesculptura.com">office@filialadesculptura.com</a> for any
        privacy question.
      </p>

      <h2>What we collect</h2>
      <p>
        Only what Google Analytics 4 collects when you accept cookies: anonymised IP address, page
        views, device and browser type, and approximate location (city level). We do{' '}
        <strong>not</strong> collect names, email addresses, or payment information through this
        site.
      </p>

      <h2>Cookies we use</h2>
      <ul>
        <li>
          <strong>zsb_consent</strong> — first-party, essential. Stores your consent choice
          (granted or denied). Six-month expiry. Always set.
        </li>
        <li>
          <strong>_ga, _ga_*</strong> — third-party (Google Analytics 4). Distinguishes visitors
          and sessions. Set only after you click <em>Accept</em>. Typical expiry: up to two years.
        </li>
      </ul>
      <p>
        If you click <em>Reject</em>, no analytics scripts load and no analytics cookies are set.
      </p>

      <h2>Legal basis</h2>
      <p>
        We process analytics data on the basis of your consent (GDPR Art. 6(1)(a) and Law 506/2004
        Art. 4), which you can withdraw at any time using the button below.
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
    </>
  )
}

function HeroTitle({ title, accent }: { title: string; accent: string }) {
  const idx = title.indexOf(accent)
  if (idx === -1) return <>{title}</>
  const before = title.slice(0, idx)
  return (
    <>
      {before}
      <span className={shared.accent}>{accent}</span>
    </>
  )
}

function formatUpdatedAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
