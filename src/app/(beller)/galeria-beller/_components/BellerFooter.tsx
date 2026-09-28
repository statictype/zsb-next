import { css } from 'styled-system/css'
import { Container, Stack, Text, Wrap } from 'styled-system/jsx'
import { getGaleriaBeller } from '@/sanity/lib/galeria-beller'
import type { DynamicFetchOptions } from '@/sanity/lib/live'
import { getSiteSettings } from '@/sanity/lib/settings'

const footer = css({
  background: 'black',
  color: 'body',
  borderTop: 'hairline',
  borderColor: 'divider',
  paddingBlock: '2xl',
})

const link = css({
  color: 'heading',
  textDecoration: 'underline',
  textUnderlineOffset: '[0.2em]',
  transition: 'colors',
  _hover: { color: 'highlight' },
  _focusVisible: { outline: 'focus', outlineOffset: '[2px]' },
})

export async function BellerFooter({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const [page, settings] = await Promise.all([getGaleriaBeller(options), getSiteSettings(options)])

  const links = [
    { label: 'Zilele Sculpturii București', href: '/' },
    ...(settings?.contactEmail
      ? [{ label: settings.contactEmail, href: `mailto:${settings.contactEmail}` }]
      : []),
    ...(settings?.instagramUrl ? [{ label: 'Instagram', href: settings.instagramUrl }] : []),
    ...(settings?.facebookUrl ? [{ label: 'Facebook', href: settings.facebookUrl }] : []),
  ]

  return (
    <footer className={footer}>
      <Container>
        <Stack gap="lg">
          <Text as="p" variant="title">
            {page?.title ?? 'Galeria Beller'}
          </Text>
          {page?.footerText && (
            <Text as="p" variant="lead">
              {page.footerText}
            </Text>
          )}
          <Wrap as="ul" gap="lg" listStyle="none">
            {links.map(({ label, href }) => (
              <li key={href}>
                <a href={href} className={link}>
                  <Text as="span" variant="label" color="[currentColor]">
                    {label}
                  </Text>
                </a>
              </li>
            ))}
          </Wrap>
        </Stack>
      </Container>
    </footer>
  )
}
