import Link from 'next/link'
import type { ReactNode } from 'react'
import { Center, HStack, Stack } from 'styled-system/jsx'
import { CookieSettingsButton } from '@/components/CookieBanner/CookieSettingsButton'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import { Button } from '@/components/ui/Button/Button'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import { getSiteSettings, type SiteSettings } from '@/sanity/lib/settings'
import { footer } from './Footer.recipe'

const s = footer()

// Internal navigation labels are structural, not editorial — they live
// in code so editors don't accidentally rename the link to its own page.
const CONNECT_LINKS = [
  { label: 'Partners', href: '/partners' },
  { label: 'Press', href: '/press' },
  { label: 'Visit', href: '/visit' },
] as const

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  const external = href === '#' || href.startsWith('http') || href.startsWith('mailto:')
  return (
    <Button asChild variant="link" className={s.link}>
      {external ? <a href={href}>{children}</a> : <Link href={href}>{children}</Link>}
    </Button>
  )
}

function LegalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button asChild variant="link" className={s.legalLink}>
      <Link href={href}>{children}</Link>
    </Button>
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
  // Per render, not module scope: across a year boundary the stamp and © lag
  // only until the next revalidation, not until the next server process.
  const currentYear = new Date().getFullYear()
  // Reads like an edition-catalogue stamp — the span the event has run.
  const catalogStamp = `ZSB · 2021—${currentYear}`

  return (
    <footer className={s.footer}>
      <Stack className={s.inner} gap="xl">
        <Center
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems="center"
          justifyContent={{ md: 'flex-start' }}
          rowGap={{ base: 'lg', md: 'xl' }}
          columnGap={{ base: 'lg', md: '2xl' }}
        >
          <div className={s.badge}>
            <PartnerBadge size="footer" />
          </div>

          <Center
            flexDirection={{ base: 'column', md: 'row' }}
            alignItems={{ base: 'center', md: 'flex-start' }}
            justifyContent={{ base: 'center', md: 'flex-start' }}
            gap={{ base: 'lg', md: '2xl' }}
            alignSelf={{ base: 'stretch', md: 'auto' }}
          >
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
          </Center>

          <span className={s.stamp}>{catalogStamp}</span>
        </Center>

        <HStack
          className={s.baseline}
          flexDirection={{ base: 'column', md: 'row' }}
          justify={{ md: 'space-between' }}
        >
          <div className={s.copyright}>&copy; {currentYear} Bucharest Sculpture Days</div>
          <div className={s.legal}>
            <LegalLink href="/privacy">Privacy Policy</LegalLink>
            <CookieSettingsButton className={s.legalLink} />
          </div>
        </HStack>
      </Stack>
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
