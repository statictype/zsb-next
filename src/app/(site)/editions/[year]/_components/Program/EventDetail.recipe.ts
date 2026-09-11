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
      lg: {
        aspectRatio: 'auto',
        maxHeight: '[none]',
        borderBlockEnd: 'none',
        borderInlineEnd: 'hairline',
      },
    },

    column: {
      display: 'grid',
      minWidth: '0',
      padding: 'lg',
      xl: { padding: 'xl' },
    },

    facts: { display: 'grid', gap: 'lg' },

    name: {
      textStyle: 'detailTitle',
      color: 'heading',
      textWrap: 'balance',
    },
    when: {
      color: 'highlight',
      fontWeight: 'bold',
      lineHeight: '1.4',
      letterSpacing: '[-0.018em]',
    },
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
    poster: {
      true: {
        layout: { lg: { gridTemplateColumns: '[minmax(0, 38%) minmax(0, 1fr)]' } },
      },
      false: {
        column: { justifyItems: 'center' },
        facts: { width: 'full', maxWidth: 'measure' },
      },
    },
    shell: {
      modal: {
        facts: { animationStyle: 'arrive', animationDelay: 'stagger' },

        layout: { lg: { minHeight: '0', overflow: 'hidden' } },
        column: {
          lg: {
            alignContent: '[safe center]',
            overflowY: 'auto',
            overscrollBehavior: 'contain',
          },
        },
      },
      page: {
        layout: { lg: { minHeight: '[min(70vh, 720px)]' } },
        column: { lg: { alignContent: '[safe center]' } },
      },
    },
  },
  defaultVariants: { shell: 'modal', poster: false },
})
