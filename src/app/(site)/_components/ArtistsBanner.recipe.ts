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
  slots: ['root', 'inner', 'subtext', 'accent'],
  base: {
    root: {
      position: 'relative',
      display: 'block',
      width: 'full',
      background: 'surface',
      color: 'white',
      textDecoration: 'none',
      overflow: 'hidden',
      paddingBlock: { base: 'xl', md: '2xl' },
      paddingInline: 'gutter',
      scrollMarginTop: '[token(sizes.nav)]',
      transition: '[all {durations.slow} {easings.expo}]',
      // Brand corner wash — fades in on hover.
      _before: {
        content: '""',
        position: 'absolute',
        inset: '0',
        background:
          '[linear-gradient(135deg, color-mix(in oklch, token(colors.pink) 8%, transparent) 0%, transparent 50%, color-mix(in oklch, token(colors.chartreuse) 5%, transparent) 100%)]',
        opacity: '0',
        transitionProperty: '[opacity]',
        transitionDuration: 'slow',
        transitionTimingFunction: 'expo',
      },
      _hover: {
        _before: { opacity: '1' },
        '& [data-part=accent]': { transform: 'scaleX(1)' },
      },
    },
    inner: {
      position: 'relative',
      zIndex: '1',
      width: 'full',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
    },
    subtext: {
      fontFamily: 'body',
      fontSize: 'sm',
      lineHeight: 'body',
      color: 'body',
      maxWidth: { md: 'narrowColumn' },
    },
    accent: {
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: 'full',
      height: 'brushStroke',
      background: '[linear-gradient(90deg, token(colors.action) 0%, token(colors.highlight) 100%)]',
      transformOrigin: 'left',
      transform: 'scaleX(0)',
      transitionProperty: '[transform]',
      transitionDuration: 'slow',
      transitionTimingFunction: 'expo',
    },
  },
})
