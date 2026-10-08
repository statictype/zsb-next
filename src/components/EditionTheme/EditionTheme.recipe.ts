import { sva } from 'styled-system/css'

export const editionTheme = sva({
  slots: ['heading', 'lead', 'highlight'],
  base: {
    heading: {
      display: 'flex',
      alignItems: 'baseline',
      margin: '0',
      color: 'heading',
    },
    lead: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'xs',
      alignSelf: 'center',
      marginRight: '0.6em',
    },
    highlight: {
      transition: 'interactive',
    },
  },
  variants: {
    size: {
      sub: {
        heading: { maxWidth: '100%', textStyle: 'editionTheme.sub' },
      },
      cell: {
        heading: { maxWidth: '100%', textStyle: 'editionTheme.cell' },
      },
      row: {
        heading: { maxWidth: '100%', textStyle: 'editionTheme.row' },
      },
    },
    interactive: {
      false: {},
      true: { highlight: { 'a:hover &, a:focus-visible &': { color: 'action' } } },
    },
    accent: {
      highlight: {},
      none: {},
    },
    muted: {
      true: { heading: { color: 'muted' } },
      false: {},
    },
  },
  compoundVariants: [
    { interactive: false, accent: 'highlight', css: { highlight: { color: 'highlight' } } },
  ],
  defaultVariants: { interactive: false, accent: 'highlight', muted: false },
})
