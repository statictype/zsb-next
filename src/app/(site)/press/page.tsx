import { notFound } from 'next/navigation'
import { section } from 'styled-system/recipes'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { PageHero } from '@/components/PageHero/PageHero'
import { Badge } from '@/components/ui/Badge/Badge'
import { LinkList, LinkListItem } from '@/components/ui/LinkList/LinkList'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { makePageMetadata, organizationJsonLd, pressAppearancesJsonLd } from '@/lib/seo'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import {
  getEditionsPressKit,
  getPressAppearances,
  getPressPage,
  getPressReleases,
  type PressAppearance,
  type PressPageView,
  type PressRelease,
} from '@/sanity/lib/press'
import { getSiteSettings, type SiteSettings } from '@/sanity/lib/settings'
import type { MediaKitStripItem } from '@/types/edition'
import { MediaKitStrip } from './_components/MediaKitStrip'
import { pressPage } from './page.recipe'

const styles = pressPage()

export const generateMetadata = makePageMetadata(getPressPage, {
  title: 'Press',
  path: '/press',
})

type Medium = NonNullable<PressAppearance['medium']>

const MEDIUM_LABEL: Record<Medium, string> = {
  article: 'Article',
  video: 'Video',
  audio: 'Audio',
}

export default function PressRoute() {
  return <DraftAware cached={(options) => <CachedPress options={options} />} fallback={null} />
}

async function CachedPress({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const [page, appearances, releases, kit, settings] = await Promise.all([
    getPressPage(options),
    getPressAppearances(options),
    getPressReleases(options),
    getEditionsPressKit(options),
    getSiteSettings(options),
  ])
  if (!page) notFound()
  return (
    <PressShell
      view={page}
      appearances={appearances}
      releases={releases}
      kit={kit}
      settings={settings}
    />
  )
}

interface PressShellProps {
  view: PressPageView
  appearances: PressAppearance[]
  releases: PressRelease[]
  kit: MediaKitStripItem[]
  settings: SiteSettings | null
}

function PressShell({ view, appearances, releases, kit, settings }: PressShellProps) {
  const { hero } = view

  return (
    <>
      <JsonLd
        data={organizationJsonLd({
          sameAs: [settings?.instagramUrl, settings?.facebookUrl],
        })}
      />
      {appearances.length > 0 && <JsonLd data={pressAppearancesJsonLd(appearances)} />}
      <main className={styles.page}>
        {/* ===== Hero ===== */}
        <PageHero
          flush
          title={<AccentSplit text={hero.title} accent={hero.titleAccent} />}
          lead={hero.lead}
        />

        {/* ===== Media Kit Strip ===== */}
        {kit.length > 0 && (
          <section id="media-kit" className={section()}>
            <div className={styles.kitHeader}>
              <SectionHeading flush>Media kit</SectionHeading>
            </div>
            <MediaKitStrip items={kit} />
          </section>
        )}

        {/* ===== Appearances ===== */}
        {appearances.length > 0 && (
          <section className={section()}>
            <div className={styles.appearancesInner}>
              <SectionHeading>Press appearances</SectionHeading>

              <LinkList>
                {appearances.map((item) => {
                  if (!item.medium || !item.url) return null
                  return (
                    <LinkListItem
                      key={item._id}
                      year={item.year}
                      title={item.title}
                      href={item.url}
                      excerpt={item.excerpt}
                      external
                      tags={[
                        <Badge key="tag" tone="outline">
                          {item.tag}
                        </Badge>,
                        <Badge key="medium" tone="outline">
                          {MEDIUM_LABEL[item.medium]}
                        </Badge>,
                      ]}
                    />
                  )
                })}
              </LinkList>
            </div>
          </section>
        )}

        {/* ===== Releases ===== */}
        {releases.length > 0 && (
          <section className={section()}>
            <div className={styles.releasesInner}>
              <SectionHeading>Press releases</SectionHeading>

              <LinkList>
                {releases.map((release) => (
                  <LinkListItem
                    key={release._id}
                    year={release.publishedAt.slice(0, 4)}
                    title={release.title}
                    href={release.pdfUrl ?? undefined}
                    external
                  />
                ))}
              </LinkList>
            </div>
          </section>
        )}
      </main>
    </>
  )
}
