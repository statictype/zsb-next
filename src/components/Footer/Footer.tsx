import Link from 'next/link'
import { cx } from 'styled-system/css'
import { CookieSettingsButton } from '@/components/CookieBanner/CookieSettingsButton'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import { TextLink } from '@/components/ui/TextLink/TextLink'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import { getSiteSettings, type SiteSettings } from '@/sanity/lib/settings'
import { footer } from './Footer.recipe'

const s = footer()

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
  const external = href === '#' || href.startsWith('http') || href.startsWith('mailto:')
  return (
    <TextLink as={external ? 'a' : Link} href={href} className={cx(s.link)}>
      {children}
    </TextLink>
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
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.primary}>
          <div className={s.badge}>
            <PartnerBadge />
          </div>

          <div className={s.cols}>
            <nav className={s.navCol} aria-label="Footer">
              <h2 className={s.colTitle}>Connect</h2>
              {contactHref && <FooterLink href={contactHref}>Contact</FooterLink>}
              {CONNECT_LINKS.map((link) => (
                <FooterLink key={link.label} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </nav>

            {socials.length > 0 && (
              <div className={s.navCol}>
                <h2 className={s.colTitle}>Follow</h2>
                {socials.map((link) => (
                  <FooterLink key={link.label} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </div>
            )}
          </div>

          <span className={s.stamp}>{CATALOG_STAMP}</span>
        </div>

        <div className={s.baseline}>
          <div className={s.copyright}>&copy; {CURRENT_YEAR} Bucharest Sculpture Days</div>
          <div className={s.legal}>
            <TextLink as={Link} href="/privacy" underline="quiet">
              Privacy Policy
            </TextLink>
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
