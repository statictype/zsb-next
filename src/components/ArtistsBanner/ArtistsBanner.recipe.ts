import { sva } from 'styled-system/css'

/**
 * ArtistsBanner — co-located slot recipe.
 *
 * The compound hover (title warms to the accent, arrow nudges, the underline
 * draws, the corner wash fades in) lives in one place: the `root` slot's
 * `_hover`, targeting the children by `data-part`. The brand-tinted corner wash
 * and accent gradient reference the pink/chartreuse anchors via `color-mix`
 * rather than the old hardcoded `rgba()` literals.
 */
export const artistsBanner = sva({
  slots: ['root', 'inner', 'left', 'title', 'subtext', 'cta', 'ctaText', 'arrow', 'accent'],
  base: {
    root: {
      position: 'relative',
      display: 'block',
      width: '100%',
      background: 'canvas',
      color: 'white',
      textDecoration: 'none',
      overflow: 'hidden',
      paddingBlock: { base: 'xl', md: '2xl' },
      paddingInline: 'gutter',
      scrollMarginTop: 'token(sizes.nav)',
      transition: 'all {durations.slow} {easings.expo}',
      // Brand corner wash — fades in on hover.
      _before: {
        content: '""',
        position: 'absolute',
        inset: '0',
        background:
          'linear-gradient(135deg, color-mix(in oklch, {colors.pink} 8%, transparent) 0%, transparent 50%, color-mix(in oklch, {colors.chartreuse} 5%, transparent) 100%)',
        opacity: '0',
        transition: 'opacity {durations.slow} {easings.expo}',
      },
      _hover: {
        _before: { opacity: '1' },
        '& [data-part=title]': { color: 'highlight' },
        '& [data-part=arrow]': { transform: 'translate(8px, -8px)' },
        '& [data-part=accent]': { transform: 'scaleX(1)' },
      },
    },
    inner: {
      position: 'relative',
      zIndex: '1',
      width: '100%',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      display: 'flex',
      flexDirection: { base: 'column', md: 'row' },
      justifyContent: { md: 'space-between' },
      alignItems: { md: 'center' },
      gap: 'lg',
    },
    left: { display: 'flex', flexDirection: 'column', gap: 'sm' },
    title: {
      textStyle: 'sectionTitle',
      color: 'white',
      marginBottom: 'sm',
      transition: 'color {durations.medium} {easings.expo}',
    },
    subtext: {
      fontFamily: 'body',
      fontSize: 'sm',
      lineHeight: 'body',
      color: 'body',
      maxWidth: { md: '500px' },
    },
    cta: { display: 'flex', alignItems: 'center', gap: 'sm' },
    ctaText: {
      fontFamily: 'display',
      fontSize: 'xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      color: 'action',
    },
    arrow: {
      display: 'inline-flex',
      flexShrink: '0',
      color: 'action',
      transition: 'transform {durations.medium} {easings.expo}',
    },
    accent: {
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '100%',
      height: '3px',
      background: 'linear-gradient(90deg, {colors.action} 0%, {colors.highlight} 100%)',
      transformOrigin: 'left',
      transform: 'scaleX(0)',
      transition: 'transform {durations.slow} {easings.expo}',
    },
  },
})
