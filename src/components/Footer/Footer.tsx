import Link from 'next/link'
import type { ReactNode } from 'react'
import { Center, Divider, HStack, Stack, Text, Wrap } from 'styled-system/jsx'
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
      {external ? (
        <a href={href}>
          <Text variant="label">{children}</Text>
        </a>
      ) : (
        <Link href={href}>
          <Text variant="label">{children}</Text>
        </Link>
      )}
    </Button>
  )
}

function LegalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button asChild variant="link">
      <Link href={href}>
        <Text variant="label">{children}</Text>
      </Link>
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
    <>
      <Divider display={{ base: 'none', md: 'block' }} />
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
              <Wrap
                as="nav"
                className={s.navCol}
                aria-label="Footer"
                align="baseline"
                justify="center"
                rowGap="sm"
                columnGap="md"
              >
                <Text as="h2" variant="label" className={s.colTitle}>
                  Connect
                </Text>
                {contactHref && <FooterLink href={contactHref}>Contact</FooterLink>}
                {CONNECT_LINKS.map((link) => (
                  <FooterLink key={link.label} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </Wrap>

              {socials.length > 0 && (
                <Wrap
                  className={s.navCol}
                  align="baseline"
                  justify="center"
                  rowGap="sm"
                  columnGap="md"
                >
                  <Text as="h2" variant="label" className={s.colTitle}>
                    Follow
                  </Text>
                  {socials.map((link) => (
                    <FooterLink key={link.label} href={link.href}>
                      {link.label}
                    </FooterLink>
                  ))}
                </Wrap>
              )}
            </Center>

            <Text variant="label" className={s.stamp}>
              {catalogStamp}
            </Text>
          </Center>

          <Divider />
          <HStack
            className={s.baseline}
            flexDirection={{ base: 'column', md: 'row' }}
            justify={{ md: 'space-between' }}
          >
            <Text as="div" variant="label">
              &copy; {currentYear} Bucharest Sculpture Days
            </Text>
            <Wrap gap="lg">
              <LegalLink href="/privacy">Privacy Policy</LegalLink>
              <Text variant="label">
                <CookieSettingsButton />
              </Text>
            </Wrap>
          </HStack>
        </Stack>
      </footer>
    </>
  )
}

function buildSocialLinks(settings: SiteSettings | null): { label: string; href: string }[] {
  if (!settings) return []
  const links: { label: string; href: string }[] = []
  if (settings.instagramUrl) links.push({ label: 'Instagram', href: settings.instagramUrl })
  if (settings.facebookUrl) links.push({ label: 'Facebook', href: settings.facebookUrl })
  return links
}
