import { css } from 'styled-system/css'
import { Text } from 'styled-system/jsx'

export function DisableDraftMode() {
  return (
    <a
      href="/api/draft-mode/disable"
      className={css({
        position: 'fixed',
        bottom: 'md',
        right: 'md',
        zIndex: 'draftBadge',
        paddingBlock: 'sm',
        paddingInline: 'md',
        background: 'heading',
        color: 'surface',
        borderRadius: 'pill',
        boxShadow: 'badge',
        transition: 'interactive',
        _hover: { transform: 'translateY(-1px)' },
      })}
    >
      <Text variant="label">Exit preview</Text>
    </a>
  )
}
