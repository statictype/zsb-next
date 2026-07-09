import { sva } from 'styled-system/css'

/**
 * VisitSection — co-located slot recipe.
 *
 * Dark split layout shell for the Visit lead section. The block recipes below
 * keep image, info, amenity, and transport styling separate without splitting
 * this small page into tiny JSX components.
 *
 * `infoValue`/`transportFrom` keep the legacy raw-gray exceptions (bright body
 * on dark, lead-style emphasis). The unused `eyebrow`/`headline` rules were
 * dropped, not ported.
 */
export const visitSection = sva({
  slots: ['section', 'splitLayout', 'content', 'cta'],
  base: {
    section: { width: 'full', paddingBlock: 'sectionY' },

    splitLayout: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2xl',
      alignItems: 'center',
      lg: { gridTemplateColumns: '5fr 6fr', gap: 'gridGap' },
    },

    cta: { paddingTop: 'md' },
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
  slots: ['row', 'icon', 'label', 'value'],
  base: {
    row: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'lg',
      flexWrap: 'wrap',
      md: { flexDirection: 'row', gap: 'xl' },
    },
    icon: { color: 'action', marginBottom: 'xs' },
    label: {
      fontFamily: 'body',
      fontSize: 'xs',
      textTransform: 'uppercase',
      letterSpacing: 'wide',
      color: 'muted',
      fontWeight: 'semibold',
    },
    value: {
      fontFamily: 'body',
      fontSize: 'sm',
      // exception: bright body on dark, lead-style emphasis
      color: 'gray.200',
      lineHeight: 'body',
      // Joined multi-line values (opening hours) render their own '\n' breaks.
      whiteSpace: 'pre-line',
    },
  },
})

export const amenityStrip = sva({
  slots: ['strip', 'item', 'icon'],
  base: {
    strip: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'md',
      paddingTop: 'sm',
      borderTop: 'hairline',
      md: { display: 'flex', flexWrap: 'wrap' },
    },
    item: {
      fontFamily: 'body',
      fontSize: 'xs',
      color: 'body',
      textTransform: 'uppercase',
      letterSpacing: 'wide',
      lg: { fontSize: '2xs' },
    },
    icon: { color: 'muted' },
  },
})

export const transportList = sva({
  slots: ['line', 'icon', 'from', 'dot', 'walk'],
  base: {
    line: {
      fontFamily: 'body',
      fontSize: 'xs',
      color: 'body',
    },
    icon: { color: 'muted', flexShrink: '0' },
    from: {
      // exception: bright emphasis for city name
      color: 'gray.300',
      fontWeight: 'semibold',
    },
    dot: { color: 'muted' },
    walk: { color: 'muted' },
  },
})
