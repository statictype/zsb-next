import { sva } from 'styled-system/css'

/**
 * VisitSection — co-located slot recipe.
 *
 * Dark split layout: framed venue image (with scattered decorative pixels) +
 * an info column (address, hours, amenity strip, transport list, directions
 * CTA). Section padding is split the legacy way — vertical rhythm on the
 * outer `section`, the content rail + inline padding on `inner` — rather than
 * the `section` layerStyle, to avoid double inline padding.
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
    'pixel',
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
    section: { width: '100%', paddingBlock: 'sectionY' },
    inner: { layerStyle: 'sectionInner' },

    splitLayout: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2xl',
      alignItems: 'center',
      lg: { gridTemplateColumns: '5fr 6fr', gap: 'gridGap' },
    },

    imageBlock: {
      position: 'relative',
      padding: '24px',
      maxWidth: '500px',
      marginInline: 'auto',
      lg: { maxWidth: 'none', marginInline: '0' },
    },
    imageFrame: {
      position: 'relative',
      aspectRatio: '4 / 5',
      overflow: 'hidden',
    },
    image: { objectFit: 'cover', background: 'gray.900' },
    pixel: { position: 'absolute', pointerEvents: 'none' },

    content: { display: 'flex', flexDirection: 'column', gap: 'lg' },

    infoRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'lg',
      flexWrap: 'wrap',
      md: { flexDirection: 'row', gap: 'xl' },
    },
    infoBlock: { display: 'flex', flexDirection: 'column', gap: '4px' },
    infoIcon: { color: 'action', marginBottom: '4px' },
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
      gap: '6px',
      fontFamily: 'body',
      fontSize: 'xs',
      color: 'body',
      textTransform: 'uppercase',
      letterSpacing: 'wide',
      lg: { fontSize: '2xs' },
    },
    practicalIcon: { color: 'muted' },

    transportList: { display: 'flex', flexDirection: 'column', gap: '6px' },
    transportLine: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontFamily: 'body',
      fontSize: 'xs',
      color: 'body',
      flexWrap: 'wrap',
    },
    transportIcon: { color: 'muted', flexShrink: 0 },
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
