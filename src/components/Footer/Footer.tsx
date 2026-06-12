import Link from 'next/link'
import { CookieSettingsButton } from '@/components/CookieBanner/CookieSettingsButton'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import { getSiteSettings, type SiteSettings } from '@/sanity/lib/settings'
import styles from './Footer.module.css'

const CURRENT_YEAR = new Date().getFullYear()
// Reads like an edition-catalogue stamp — the span the event has run.
const CATALOG_STAMP = `ZSB · 2021—${CURRENT_YEAR}`

// Internal navigation labels are structural, not editorial — they live
// in code so editors don't accidentally rename the link to its own page.
const CONNECT_LINKS = [
  { label: 'Partners', href: '/partners' },
  { label: 'Press', href: '/press' },
  { label: 'Visit', href: '/visit' },
] as const

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (href === '#' || href.startsWith('http') || href.startsWith('mailto:')) {
    return (
      <a href={href} className={styles.link}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={styles.link}>
      {children}
    </Link>
  )
}

export async function Footer({ fetchOptions }: { fetchOptions: DynamicFetchOptions }) {
  return <CachedFooter options={fetchOptions} />
}

async function CachedFooter({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const settings = await getSiteSettings(options)
  return <FooterShell settings={settings} />
}

function FooterShell({ settings }: { settings: SiteSettings | null }) {
  const socials = buildSocialLinks(settings)
  const contactHref = settings?.contactEmail ? `mailto:${settings.contactEmail}` : undefined

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.primary}>
          <div className={styles.badge}>
            <PartnerBadge />
          </div>

          <nav className={styles.navCol} aria-label="Footer">
            <h2 className={styles.colTitle}>Connect</h2>
            {contactHref && <FooterLink href={contactHref}>Contact</FooterLink>}
            {CONNECT_LINKS.map((link) => (
              <FooterLink key={link.label} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </nav>

          {socials.length > 0 && (
            <div className={styles.navCol}>
              <h2 className={styles.colTitle}>Follow</h2>
              {socials.map((link) => (
                <a key={link.label} href={link.href} className={styles.link}>
                  {link.label}
                </a>
              ))}
            </div>
          )}

          <span className={styles.stamp}>{CATALOG_STAMP}</span>
        </div>

        <div className={styles.baseline}>
          <div className={styles.copyright}>&copy; {CURRENT_YEAR} Bucharest Sculpture Days</div>
          <div className={styles.legal}>
            <Link href="/privacy">Privacy Policy</Link>
            <CookieSettingsButton />
          </div>
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
