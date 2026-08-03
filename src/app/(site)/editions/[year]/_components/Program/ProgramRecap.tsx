import { FollowLinks, type SocialLink } from '@program/FollowLinks'
import { program } from '@program/Program.recipe'
import { Stack, Text } from 'styled-system/jsx'

const s = program()

/**
 * A finished edition leads with a short recap + follow CTAs; its archive
 * day-by-day list collapses below (ZSB-45). Applies to every finished edition, judged
 * client-side (`ProgramView.ended`) like the rest of the board.
 */
export function ProgramRecap({
  year,
  theme,
  socials,
}: {
  year: number
  theme: string | undefined
  socials: SocialLink[]
}) {
  return (
    <Stack className={s.recap}>
      <Text as="p" variant="body">
        That was{' '}
        <Text as="strong" variant="body" className={s.recapMark}>
          ZSB {year}
        </Text>
        {theme ? ` — ${theme}` : ''}.
      </Text>
      <FollowLinks label="Follow for what’s next" socials={socials} />
    </Stack>
  )
}
