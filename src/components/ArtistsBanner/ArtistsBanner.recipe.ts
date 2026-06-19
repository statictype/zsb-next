import { sva } from 'styled-system/css'

/**
 * ArtistsBanner — co-located slot recipe.
 *
 * The compound hover (the accent bar draws, the corner wash fades in) lives in
 * one place: the `root` slot's `_hover`, targeting children by `data-part`. The
 * title is the shared `<SectionHeading>`. The brand-tinted corner wash and
 * accent gradient reference the pink/chartreuse anchors via `color-mix`.
 */
export const artistsBanner = sva({
  slots: ['root', 'inner', 'left', 'subtext', 'accent'],
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
    subtext: {
      fontFamily: 'body',
      fontSize: 'sm',
      lineHeight: 'body',
      color: 'body',
      maxWidth: { md: '500px' },
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
