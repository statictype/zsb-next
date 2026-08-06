import { Stack, Text, Wrap } from 'styled-system/jsx'
import { Button } from '@/components/ui/Button/Button'

export interface SocialLink {
  label: string
  href: string
}

// A "Follow …" label above/beside a row of social link buttons, shared by the
// finished-edition recap and the ComingSoon notice (STRUCT-2). Renders nothing
// when there are no links; `className` carries call-site spacing (e.g. the
// ComingSoon notice's marginTop).
export function FollowLinks({
  label,
  socials,
  layout,
  emphasis = 'link',
  className,
}: {
  label: string
  socials: SocialLink[]
  layout?: 'inline' | 'stack'
  emphasis?: 'link' | 'button'
  className?: string | undefined
}) {
  if (socials.length === 0) return null
  const links = (
    <Wrap as="ul" gap={emphasis === 'button' ? 'sm' : 'md'} listStyle="none">
      {socials.map((social) => (
        <li key={social.label}>
          <Button asChild variant={emphasis === 'button' ? 'secondary' : 'link'}>
            <a href={social.href} target="_blank" rel="noreferrer">
              {social.label}
            </a>
          </Button>
        </li>
      ))}
    </Wrap>
  )

  const text = (
    <Text variant={emphasis === 'button' ? 'caption' : 'label'} color="muted">
      {label}
    </Text>
  )

  if (layout === 'stack') {
    return (
      <Stack className={className} gap="md" alignItems="flex-start">
        {text}
        {links}
      </Stack>
    )
  }

  return (
    <Wrap className={className} gap="md">
      {text}
      {links}
    </Wrap>
  )
}
