import { sva } from 'styled-system/css'

/**
 * PillarGrid — shared editorial pillar grid.
 *
 * About and Partners share the same two-column pillar system, but keep distinct
 * border rhythms: About uses bookended cells inside a dark band, Partners uses
 * paired cells in a light grid. The recipe owns those two rhythms explicitly.
 */
export const pillarGrid = sva({
  slots: ['grid', 'item', 'head', 'number', 'title', 'body'],
  base: {
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      borderTop: 'hairline',
      md: { gridTemplateColumns: '1fr 1fr' },
    },
    item: {
      paddingBlock: 'xl',
      borderBottom: 'hairline',
    },
    head: { display: 'flex', alignItems: 'baseline', gap: 'md' },
    number: {
      fontFamily: 'display',
      fontSize: 'md',
      color: 'muted',
      letterSpacing: 'tight',
    },
    title: {
      textStyle: 'labelDisplay',
    },
    body: {
      textStyle: 'prose',
      maxWidth: 'measure',
    },
  },
  variants: {
    rhythm: {
      bookend: {
        grid: { borderBottom: 'hairline' },
        item: {
          '&:last-child': { borderBottom: 'none' },
          md: {
            paddingBlock: 'xl',
            paddingInline: 'xl',
            borderBottom: 'none',
            borderRight: 'hairline',
            marginBlock: '4xl',
            '&:first-child': { paddingLeft: '0' },
            '&:last-child': { paddingRight: '0', borderRight: 'none' },
          },
        },
      },
      pair: {
        item: {
          md: {
            padding: 'xl',
            '&:nth-child(odd)': {
              paddingLeft: '0',
              borderRight: 'hairline',
            },
            '&:nth-child(even)': { paddingRight: '0' },
          },
        },
      },
    },
    titleTone: {
      heading: { title: { color: 'heading' } },
      highlight: { title: { color: 'highlight' } },
    },
    titleScale: {
      standard: { title: { fontSize: 'lg' } },
      responsive: { title: { fontSize: { base: 'lg', xl: 'xl' } } },
    },
  },
  defaultVariants: {
    rhythm: 'bookend',
    titleTone: 'heading',
    titleScale: 'standard',
  },
})
