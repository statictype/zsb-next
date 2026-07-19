import {
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
} from '@portabletext/react'
import { notFound } from 'next/navigation'
import { Container, Stack, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { privacyPage } from '@/app/(site)/privacy/page.recipe'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { CookieSettingsButton } from '@/components/CookieBanner/CookieSettingsButton'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { PageHero } from '@/components/PageHero/PageHero'
import { makePageMetadata } from '@/lib/seo'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import { getPrivacyPage, type PrivacyView } from '@/sanity/lib/staticPages'

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
    h2: ({ children }) => (
      <Text as="h2" variant="title">
        {children}
      </Text>
    ),
    normal: ({ children }) => (
      <Text as="p" variant="body">
        {children}
      </Text>
    ),
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
    strong: ({ children }) => (
      <Text as="strong" variant="body">
        {children}
      </Text>
    ),
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
            <Stack as="article" className={styles.article} gap="xl">
              <Stack gap="lg">
                {body.length > 0 && (
                  <PortableText value={body} components={portableTextComponents} />
                )}

                <Text as="h2" variant="title">
                  Change your mind
                </Text>
                <Stack gap="xs">
                  <Text as="p" variant="body">
                    You can withdraw or update your consent at any time:
                  </Text>
                  <div className={styles.settingsRow}>
                    <CookieSettingsButton />
                  </div>
                </Stack>
              </Stack>

              {updatedAt && (
                <Text as="p" variant="label">
                  Last updated: {formatUpdatedAt(updatedAt)}.
                </Text>
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
