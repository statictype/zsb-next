import {
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
} from '@portabletext/react'
import { notFound } from 'next/navigation'
import { css } from 'styled-system/css'
import { Container, Stack } from 'styled-system/jsx'
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

/** The `link` markDef exactly as PRIVACY_PAGE_QUERY projects it (via
 *  `PrivacyView['body']`), so the mark component reads typegen output instead
 *  of casting. */
type PrivacyLinkMark = NonNullable<PrivacyView['body'][number]['markDefs']>[number]

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2>{children}</h2>,
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => (
      <Stack as="ul" gap="sm">
        {children}
      </Stack>
    ),
    number: ({ children }) => (
      <Stack as="ol" gap="sm">
        {children}
      </Stack>
    ),
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }: PortableTextMarkComponentProps<PrivacyLinkMark>) => {
      const href = value?.href ?? '#'
      const newTab = value?.newTab ?? false
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
          <Container>
            <Stack as="article" className={styles.article}>
              {body.length > 0 && <PortableText value={body} components={portableTextComponents} />}

              <h2>Change your mind</h2>
              <p>You can withdraw or update your consent at any time:</p>
              <div className={styles.settingsRow}>
                <CookieSettingsButton />
              </div>

              {updatedAt && (
                <p className={styles.updated}>Last updated: {formatUpdatedAt(updatedAt)}.</p>
              )}
            </Stack>
          </Container>
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
