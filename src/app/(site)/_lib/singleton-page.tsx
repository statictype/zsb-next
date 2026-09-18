import { HomeShell } from '@site/_components/HomeShell'
import { defineSingleton } from '@site/_lib/singleton'
import { AboutShell } from '@site/about/AboutShell'
import { EditionsListShell } from '@site/editions/EditionsListShell'
import { PartnersShell } from '@site/partners/PartnersShell'
import { PressShell } from '@site/press/PressShell'
import { PrivacyShell } from '@site/privacy/PrivacyShell'
import { VisitShell } from '@site/visit/VisitShell'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { EditionsNav } from '@/components/EditionsNav/EditionsNav'
import { makePageMetadata, pageMetadata } from '@/lib/seo'
import { getEditionSummaries } from '@/sanity/lib/editions'
import { getHomeData, getHomepage } from '@/sanity/lib/homepage'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import {
  getEditionsPressKit,
  getPressAppearances,
  getPressPage,
  getPressReleases,
} from '@/sanity/lib/press'
import { getSiteSettings } from '@/sanity/lib/settings'
import {
  getAboutPage,
  getPartnersPage,
  getPrivacyPage,
  getVisitPage,
} from '@/sanity/lib/staticPages'

const PAGES = {
  home: defineSingleton({
    load: getHomeData,
    Shell: HomeShell,
    generateMetadata: makePageMetadata(getHomepage, { path: '/' }),
  }),
  about: defineSingleton({
    load: async (options) => {
      const view = await getAboutPage(options)
      return view && { view }
    },
    Shell: AboutShell,
    generateMetadata: makePageMetadata(getAboutPage, { title: 'About', path: '/about' }),
    editionsNav: true,
  }),
  partners: defineSingleton({
    load: async (options) => {
      const [view, settings] = await Promise.all([
        getPartnersPage(options),
        getSiteSettings(options),
      ])
      return view && { view, contactEmail: settings?.contactEmail ?? null }
    },
    Shell: PartnersShell,
    generateMetadata: makePageMetadata(getPartnersPage, { title: 'Partners', path: '/partners' }),
    editionsNav: true,
  }),
  visit: defineSingleton({
    load: getVisitPage,
    Shell: VisitShell,
    generateMetadata: makePageMetadata(getVisitPage, { title: 'Visit', path: '/visit' }),
  }),
  press: defineSingleton({
    load: async (options) => {
      const [view, appearances, releases, kit, settings] = await Promise.all([
        getPressPage(options),
        getPressAppearances(options),
        getPressReleases(options),
        getEditionsPressKit(options),
        getSiteSettings(options),
      ])
      return view && { view, appearances, releases, kit, settings }
    },
    Shell: PressShell,
    generateMetadata: makePageMetadata(getPressPage, { title: 'Press', path: '/press' }),
  }),
  privacy: defineSingleton({
    load: async (options) => {
      const view = await getPrivacyPage(options)
      return view && { view }
    },
    Shell: PrivacyShell,
    generateMetadata: makePageMetadata(getPrivacyPage, {
      title: 'Privacy & Cookies',
      path: '/privacy',
      robots: { index: true, follow: true },
    }),
  }),
  editions: defineSingleton({
    load: async (options) => ({
      editions: (await getEditionSummaries(options)).filter((e) => e.status === 'live'),
    }),
    Shell: EditionsListShell,
    generateMetadata: async () =>
      pageMetadata({
        title: 'Editions',
        description: 'Every edition of Bucharest Sculpture Days, from 2021 to today.',
        path: '/editions',
      }),
    fallback: <EditionsListShell />,
  }),
}

type PageKey = keyof typeof PAGES

async function CachedSingleton({ page, options }: { page: PageKey; options: DynamicFetchOptions }) {
  'use cache'
  return PAGES[page].render(options)
}

export function singletonPage(page: PageKey) {
  const { generateMetadata, fallback, editionsNav } = PAGES[page]
  const Route = () => (
    <>
      <DraftAware
        cached={(options) => <CachedSingleton page={page} options={options} />}
        fallback={fallback}
      />
      {editionsNav && <EditionsNav />}
    </>
  )
  return { generateMetadata, Route }
}
