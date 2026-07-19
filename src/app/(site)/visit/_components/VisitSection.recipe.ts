import { sva } from 'styled-system/css'

export const visitSection = sva({
  slots: ['section', 'content'],
  base: {
    section: { width: 'full', paddingBlock: 'sectionY' },
  },
})

export const visitImageFrame = sva({
  slots: ['block', 'frame', 'image'],
  base: {
    block: {
      padding: 'lg',
      maxWidth: 'narrowColumn',
      marginInline: 'auto',
      lg: { maxWidth: '[none]', marginInline: '0' },
    },
    frame: {
      position: 'relative',
      aspectRatio: '4 / 5',
      overflow: 'hidden',
    },
    image: { objectFit: 'cover', background: 'gray.900' },
  },
})

export const visitInfoSummary = sva({
  slots: ['row', 'icon', 'value'],
  base: {
    row: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'lg',
      flexWrap: 'wrap',
      md: { flexDirection: 'row', gap: 'xl' },
    },
    icon: { color: 'action' },
    value: {
      // exception: bright body on dark, lead-style emphasis
      color: 'gray.200',
      // Joined multi-line values (opening hours) render their own '\n' breaks.
      whiteSpace: 'pre-line',
    },
  },
})

export const transportList = sva({
  slots: ['icon', 'from'],
  base: {
    icon: { flexShrink: '0' },
    from: {
      // exception: bright emphasis for city name
      color: 'gray.300',
    },
  },
})
