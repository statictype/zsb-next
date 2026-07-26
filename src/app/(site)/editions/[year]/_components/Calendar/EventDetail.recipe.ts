import { sva } from 'styled-system/css'

export const eventDetail = sva({
  slots: [
    'layout',
    'poster',
    'column',
    'facts',
    'name',
    'when',
    'description',
    'types',
    'actions',
    'act',
    'take',
    'freeEntry',
  ],
  base: {
    layout: {
      display: 'grid',
      minWidth: '0',
      md: { gridTemplateColumns: '[minmax(0, 42%) minmax(0, 1fr)]' },
    },

    poster: {
      position: 'relative',
      width: 'full',
      aspectRatio: '3 / 4',
      maxHeight: '[52dvh]',
      overflow: 'hidden',
      background: 'black',
      borderBlockEnd: 'hairline',
      cursor: 'zoom-in',
      '& img': { objectFit: 'contain', transition: 'develop' },
      _hover: { '& img': { transform: 'scale(1.02)' } },
      // The poster is flush to the panel edge, which clips at `overflow:
      // hidden` — the global 4px-offset ring would lose its outer sides.
      _focusVisible: { outlineOffset: 'dialogInset' },
      md: {
        aspectRatio: 'auto',
        maxHeight: '[none]',
        borderBlockEnd: 'none',
        borderInlineEnd: 'hairline',
      },
    },

    column: {
      display: 'grid',
      alignContent: '[safe center]',
      minWidth: '0',
      padding: 'lg',
      xl: { padding: 'xl' },
    },

    facts: { display: 'grid', gap: 'lg' },

    name: {
      textStyle: 'heading',
      color: 'heading',
      textWrap: 'balance',
    },
    when: { color: 'highlight' },
    description: {
      whiteSpace: 'pre-line',
      maxWidth: 'measure',
    },
    types: { marginTop: 'sm' },

    actions: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 'md',
      borderTop: 'hairline',
      paddingInline: 'lg',
      paddingBlock: 'md',
      xl: { paddingInline: 'xl' },
    },
    act: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 'sm',
    },
    take: {
      display: 'flex',
      alignItems: 'center',
      gap: 'sm',
      marginInlineStart: 'auto',
    },
    freeEntry: {
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: '[32px]',
    },
  },
  variants: {
    shell: {
      modal: {
        layout: {
          minHeight: '0',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          md: { overflow: 'hidden' },
        },
        column: {
          md: { overflowY: 'auto', overscrollBehavior: 'contain' },
        },
        facts: { animationStyle: 'enter.snappy', animationDelay: 'fast' },
      },
      page: {
        layout: { md: { minHeight: '[min(70vh, 720px)]' } },
      },
    },
  },
  defaultVariants: { shell: 'modal' },
})
