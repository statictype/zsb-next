import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { CookieSettingsButton } from '@/components/CookieBanner/CookieSettingsButton'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { Navigation } from '@/components/Navigation/Navigation'
import shared from '@/components/Shared.module.css'
import { makePageMetadata } from '@/lib/seo'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import { getPrivacyPage, type PrivacyPage } from '@/sanity/lib/staticPages'
import styles from './page.module.css'

export const generateMetadata = makePageMetadata(getPrivacyPage, {
  title: 'Privacy & Cookies',
  path: '/privacy',
  robots: { index: true, follow: true },
})

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

export default function PrivacyRoute() {
  return (
    <DraftAware
      cached={(options) => <CachedPrivacy options={options} />}
      fallback={<PrivacyShell />}
    />
  )
}

async function CachedPrivacy({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const page = await getPrivacyPage(options)
  return <PrivacyShell page={page} />
}

function PrivacyShell({ page }: { page?: PrivacyPage | null } = {}) {
  const title = page?.hero?.title ?? ''
  const accent = page?.hero?.titleAccent ?? ''
  const lead = page?.hero?.lead ?? ''
  const body = page?.body ?? null
  const updatedAt = page?.updatedAt ?? ''

  return (
    <>
      <Navigation activeId={null} />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={shared.pageTitle}>
              <AccentSplit text={title} accent={accent} />
            </h1>
            <p className={shared.lead}>{lead}</p>
          </div>
        </section>

        <section className={`${shared.section} ${shared.sectionDark} ${styles.body}`}>
          <div className={shared.sectionInner}>
            <article className={styles.article}>
              {body && <PortableText value={body} components={portableTextComponents} />}

              <h2>Change your mind</h2>
              <p>You can withdraw or update your consent at any time:</p>
              <div className={styles.settingsRow}>
                <CookieSettingsButton />
              </div>

              {updatedAt && (
                <p className={styles.updated}>Last updated: {formatUpdatedAt(updatedAt)}.</p>
              )}
            </article>
          </div>
        </section>
      </main>
    </>
  )
}

function formatUpdatedAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
