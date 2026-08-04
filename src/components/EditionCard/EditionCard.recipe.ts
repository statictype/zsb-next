import { sva } from 'styled-system/css'

/** Archive index entry only; the footer rail's imageless plate lives in
 *  EditionRailCard.recipe. */
export const editionCard = sva({
  slots: [
    'root',
    'plate',
    'frame',
    'image',
    'body',
    'head',
    'title',
    'prefix',
    'meta',
    'count',
    'arrow',
  ],
  base: {
    root: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr)',
      gridTemplateAreas: '"plate" "body"',
      columnGap: 'gridGap',
      rowGap: 'lg',
      color: 'body',
      textDecoration: 'none',
      lg: {
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        alignItems: 'center',
      },
    },
    plate: {
      gridArea: 'plate',
      position: 'relative',
      width: 'full',
      border: 'hairline',
      aspectRatio: { base: '1 / 1', md: '16 / 9', lg: '3 / 2' },
      _before: {
        content: '""',
        layerStyle: 'gradientBorder',
        inset: '[calc(token(borderWidths.hairline) * -1)]',
        padding: '[token(borderWidths.hairline)]',
      },
      'a:hover &, a:focus-visible &': {
        borderColor: 'transparent',
        _before: { opacity: 1, animationStyle: 'gradientBorder' },
      },
    },
    // `overflow` clips to the padding box, so the zoom cannot be clipped by
    // `plate` — that would cut the ring, which sits in the border area.
    frame: {
      position: 'absolute',
      inset: '0',
      overflow: 'hidden',
      background: 'gray.900',
    },
    image: {
      objectFit: 'cover',
      background: 'gray.900',
      filter: '[token(assets.mono)]',
      transform: 'scale(1.01)',
      transition: 'develop',
      'a:hover &, a:focus-visible &': {
        filter: '[token(assets.monoHover)]',
        transform: 'scale(1.05)',
      },
    },
    body: {
      gridArea: 'body',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'lg',
    },
    head: { display: 'flex', flexDirection: 'column', gap: 'xs' },
    title: {
      fontVariantNumeric: 'tabular-nums',
      transition: 'interactive',
      'a:hover &, a:focus-visible &': { color: 'action' },
    },
    prefix: {
      color: 'muted',
      transition: 'interactive',
      'a:hover &, a:focus-visible &': { color: 'current' },
    },
    meta: { display: 'grid', gap: 'xs' },
    count: { color: 'heading' },
    arrow: {
      display: 'flex',
      justifySelf: 'start',
      marginTop: 'sm',
      color: 'muted',
      transition: 'interactive',
      'a:hover &, a:focus-visible &': { color: 'action', transform: 'translate(4px, -4px)' },
    },
  },
  variants: {
    media: {
      left: { root: { lg: { gridTemplateAreas: '"plate body"' } } },
      right: { root: { lg: { gridTemplateAreas: '"body plate"' } } },
    },
  },
  defaultVariants: { media: 'left' },
})
