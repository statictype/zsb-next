import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { notFound } from 'next/navigation'
import { css } from 'styled-system/css'
import { section } from 'styled-system/recipes'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { CookieSettingsButton } from '@/components/CookieBanner/CookieSettingsButton'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { PageHero } from '@/components/PageHero/PageHero'
import { makePageMetadata } from '@/lib/seo'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import { getPrivacyPage, type PrivacyView } from '@/sanity/lib/staticPages'
import { privacyPage } from './page.recipe'

const styles = privacyPage()

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
  return <DraftAware cached={(options) => <CachedPrivacy options={options} />} fallback={null} />
}

async function CachedPrivacy({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const page = await getPrivacyPage(options)
  if (!page) notFound()
  return <PrivacyShell view={page} />
}

function PrivacyShell({ view }: { view: PrivacyView }) {
  const { hero, body, updatedAt } = view

  return (
    <>
      <main>
        <PageHero
          title={<AccentSplit text={hero.title} accent={hero.titleAccent} />}
          lead={hero.lead}
        />

        <section className={section({ ground: 'dark' })}>
          <div className={css({ layerStyle: 'sectionInner' })}>
            <article className={styles.article}>
              {body.length > 0 && <PortableText value={body} components={portableTextComponents} />}

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
