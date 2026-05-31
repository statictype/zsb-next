import Link from 'next/link'
import { CookieSettingsButton } from '@/components/CookieBanner/CookieSettingsButton'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import { getEditionListItems } from '@/data/editions'
import { type EditionListItem } from '@/sanity/lib/editions'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import { getSiteSettings, type SiteSettings } from '@/sanity/lib/settings'
import styles from './Footer.module.css'

const CURRENT_YEAR = new Date().getFullYear()
const BARCODE_LABEL = `ZSB—2021—${CURRENT_YEAR}`

// How many published editions show in the footer Explore column.
const EXPLORE_LIMIT = 4

// Internal navigation labels are structural, not editorial — they live
// in code so editors don't accidentally rename the link to its own page.
const INTERNAL_CONNECT_LINKS = [
  { label: 'Partners', href: '/partners' },
  { label: 'Press', href: '/press' },
  { label: 'Visit', href: '/visit' },
] as const

function FooterLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string | undefined
}) {
  if (href === '#' || href.startsWith('http') || href.startsWith('mailto:')) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

export async function Footer({ fetchOptions }: { fetchOptions: DynamicFetchOptions }) {
  return <CachedFooter options={fetchOptions} />
}

async function CachedFooter({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const [settings, editions] = await Promise.all([
    getSiteSettings(options),
    getEditionListItems(options),
  ])
  return <FooterShell settings={settings} editions={editions} />
}

function FooterShell({
  settings,
  editions,
}: {
  settings: SiteSettings | null
  editions: EditionListItem[]
}) {
  const socials = buildSocialLinks(settings)
  const contactHref = settings?.contactEmail ? `mailto:${settings.contactEmail}` : undefined
  // Explore column: published editions only, most recent first.
  const exploreEditions = editions
    .filter((e) => e.status === 'published')
    .slice(0, EXPLORE_LIMIT)

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.wordmark}>
              ZSB<span className={styles.wordmarkAccent}>.</span>
            </div>
          </div>

          <div className={styles.linksGrid}>
            <div className={styles.linksCol}>
              <div className={styles.linksColTitle}>Explore</div>
              {exploreEditions.map((edition) => (
                <FooterLink
                  key={edition.year}
                  href={`/editions/${edition.year}`}
                  className={styles.link}
                >
                  {edition.theme}
                </FooterLink>
              ))}
            </div>
            <div className={styles.linksCol}>
              <div className={styles.linksColTitle}>Connect</div>
              {contactHref && (
                <FooterLink href={contactHref} className={styles.link}>
                  Contact
                </FooterLink>
              )}
              {INTERNAL_CONNECT_LINKS.map((link) => (
                <FooterLink key={link.label} href={link.href} className={styles.link}>
                  {link.label}
                </FooterLink>
              ))}
            </div>
            <div className={`${styles.linksCol} ${styles.badgeCol}`}>
              <PartnerBadge />
            </div>
          </div>

          <div className={styles.connect}>
            <div className={styles.social}>
              {socials.map((link) => (
                <a key={link.label} href={link.href} className={styles.socialLink}>
                  {link.label}
                </a>
              ))}
            </div>
            <div>
              <div className={styles.barcode} />
              <div className={styles.barcodeLabel}>{BARCODE_LABEL}</div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.legal}>
            <Link href="/privacy">Privacy Policy</Link>
            <CookieSettingsButton />
          </div>
          <div className={styles.tagline}>
            Filiala <span>&times;</span> de <span>&times;</span> Sculptura
          </div>
          <div>&copy; {CURRENT_YEAR} Bucharest Sculpture Days</div>
        </div>
      </div>
    </footer>
  )
}

function buildSocialLinks(settings: SiteSettings | null): { label: string; href: string }[] {
  if (!settings) return []
  const links: { label: string; href: string }[] = []
  if (settings.instagramUrl) links.push({ label: 'Instagram', href: settings.instagramUrl })
  if (settings.facebookUrl) links.push({ label: 'Facebook', href: settings.facebookUrl })
  return links
}
