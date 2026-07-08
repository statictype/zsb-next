import { sva } from 'styled-system/css'

/**
 * VisitSection — co-located slot recipe.
 *
 * Dark split layout: venue image + an info column (address, hours, amenity
 * strip, transport list, directions CTA). Section padding is split the legacy
 * way — vertical rhythm on the outer `section`, the content rail + inline
 * padding on `inner` — rather than the `section` layerStyle, to avoid double
 * inline padding.
 *
 * `infoValue`/`transportFrom` keep the legacy raw-gray exceptions (bright body
 * on dark, lead-style emphasis). The unused `eyebrow`/`headline` rules were
 * dropped, not ported.
 */
export const visitSection = sva({
  slots: [
    'section',
    'inner',
    'splitLayout',
    'imageBlock',
    'imageFrame',
    'image',
    'content',
    'infoRow',
    'infoBlock',
    'infoIcon',
    'infoLabel',
    'infoValue',
    'practicalStrip',
    'practicalItem',
    'practicalIcon',
    'transportList',
    'transportLine',
    'transportIcon',
    'transportFrom',
    'transportDot',
    'transportWalk',
    'cta',
  ],
  base: {
    section: { width: 'full', paddingBlock: 'sectionY' },
    inner: { layerStyle: 'sectionInner' },

    splitLayout: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2xl',
      alignItems: 'center',
      lg: { gridTemplateColumns: '5fr 6fr', gap: 'gridGap' },
    },

    imageBlock: {
      padding: 'lg',
      maxWidth: '[500px]',
      marginInline: 'auto',
      lg: { maxWidth: '[none]', marginInline: '0' },
    },
    imageFrame: {
      position: 'relative',
      aspectRatio: '4 / 5',
      overflow: 'hidden',
    },
    image: { objectFit: 'cover', background: 'gray.900' },

    content: { display: 'flex', flexDirection: 'column', gap: 'lg' },

    infoRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'lg',
      flexWrap: 'wrap',
      md: { flexDirection: 'row', gap: 'xl' },
    },
    infoBlock: { display: 'flex', flexDirection: 'column', gap: 'xs' },
    infoIcon: { color: 'action', marginBottom: 'xs' },
    infoLabel: {
      fontFamily: 'body',
      fontSize: 'xs',
      textTransform: 'uppercase',
      letterSpacing: 'wide',
      color: 'muted',
      fontWeight: 'semibold',
    },
    infoValue: {
      fontFamily: 'body',
      fontSize: 'sm',
      // exception: bright body on dark, lead-style emphasis
      color: 'gray.200',
      lineHeight: 'body',
      // Joined multi-line values (opening hours) render their own '\n' breaks.
      whiteSpace: 'pre-line',
    },

    practicalStrip: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'md',
      paddingTop: 'sm',
      borderTop: 'hairline',
      md: { display: 'flex', flexWrap: 'wrap' },
    },
    practicalItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 'sm',
      fontFamily: 'body',
      fontSize: 'xs',
      color: 'body',
      textTransform: 'uppercase',
      letterSpacing: 'wide',
      lg: { fontSize: '2xs' },
    },
    practicalIcon: { color: 'muted' },

    transportList: { display: 'flex', flexDirection: 'column', gap: 'sm' },
    transportLine: {
      display: 'flex',
      alignItems: 'center',
      gap: 'sm',
      fontFamily: 'body',
      fontSize: 'xs',
      color: 'body',
      flexWrap: 'wrap',
    },
    transportIcon: { color: 'muted', flexShrink: '0' },
    transportFrom: {
      // exception: bright emphasis for city name
      color: 'gray.300',
      fontWeight: 'semibold',
    },
    transportDot: { color: 'muted' },
    transportWalk: { color: 'muted' },

    cta: { paddingTop: 'md' },
  },
})
