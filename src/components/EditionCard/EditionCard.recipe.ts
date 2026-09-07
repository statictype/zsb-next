import { sva } from 'styled-system/css'

export const editionCard = sva({
  slots: [
    'root',
    'plate',
    'frame',
    'image',
    'body',
    'head',
    'title',
    'theme',
    'prefix',
    'meta',
    'count',
    'arrow',
  ],
  base: {
    root: {
      pressable: 'dim',
      display: 'grid',
      gridTemplateColumns: 'auto minmax(0, 1fr)',
      gridTemplateAreas: '"plate head" "plate meta"',
      columnGap: 'md',
      rowGap: 'md',
      alignItems: 'start',
      color: 'body',
      textDecoration: 'none',
      md: {
        gridTemplateColumns: 'minmax(0, 1fr)',
        gridTemplateAreas: '"plate" "body"',
        columnGap: 'gridGap',
        rowGap: 'lg',
        alignItems: 'stretch',
      },
      lg: {
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        alignItems: 'center',
      },
    },
    plate: {
      gridArea: 'plate',
      position: 'relative',
      width: { base: '[clamp(72px, 22vw, 104px)]', md: 'full' },
      border: 'hairline',
      aspectRatio: { base: '1 / 1', md: '16 / 9', lg: '3 / 2' },
    },
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
    // `contents` promotes head and meta into the root grid, so the thumbnail
    // can sit beside the year alone while the credits run full width.
    body: {
      gridArea: 'body',
      display: { base: 'contents', md: 'flex' },
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'md',
    },
    head: { gridArea: 'head', minWidth: '0', display: 'flex', flexDirection: 'column', gap: 'xs' },
    title: {
      fontVariantNumeric: 'tabular-nums',
      transition: 'interactive',
      'a:hover &, a:focus-visible &': { color: 'action' },
    },
    // Themes are single hashtag words with no wrap opportunity of their own.
    theme: { overflowWrap: 'anywhere' },
    prefix: {
      color: 'muted',
      transition: 'interactive',
      'a:hover &, a:focus-visible &': { color: 'current' },
    },
    meta: { gridArea: 'meta' },
    count: { color: 'heading' },
    arrow: {
      display: 'inline-block',
      marginLeft: '[0.3em]',
      color: 'muted',
      transition: 'interactive',
      '& svg': { width: '[0.5em]', height: '[0.5em]' },
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
