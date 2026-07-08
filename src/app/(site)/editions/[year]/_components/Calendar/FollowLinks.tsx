import { cx } from 'styled-system/css'
import { Button } from '@/components/ui/Button/Button'
import { followLinks } from './FollowLinks.recipe'

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
  className,
}: {
  label: string
  socials: SocialLink[]
  layout?: 'inline' | 'stack' | undefined
  className?: string | undefined
}) {
  if (socials.length === 0) return null
  const s = followLinks({ layout })
  return (
    <div className={cx(s.follow, className)}>
      <span className={s.label}>{label}</span>
      <ul className={s.links}>
        {socials.map((social) => (
          <li key={social.label}>
            <Button asChild variant="link">
              <a href={social.href} target="_blank" rel="noreferrer">
                {social.label}
              </a>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
