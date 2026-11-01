import { sva } from 'styled-system/css'

export const artistProfile = sva({
  slots: [
    'root',
    'plate',
    'plateLogo',
    'plateFrame',
    'plateImage',
    'plateImageHidden',
    'plateImageShown',
    'plateCaption',
    'column',
    'chapter',
    'workChapter',
    'intro',
    'bio',
    'actions',
    'works',
    'srOnly',
    'facts',
    'term',
    'with',
    'inlinePlate',
    'inlineImage',
    'description',
    'sheet',
    'sheetItem',
    'sheetImage',
  ],
  base: {
    root: {
      paddingTop: 'token(sizes.nav)',
    },
    plate: {
      display: 'flex',
      flexDirection: 'column',
      lg: {
        position: 'sticky',
        top: 'token(sizes.nav)',
        height: '[calc(100dvh - token(sizes.nav))]',
        paddingBlock: 'lg',
      },
    },
    plateLogo: {
      display: 'none',
      lg: {
        display: 'flex',
        position: 'absolute',
        top: '[calc(24px - token(sizes.nav))]',
        left: 'gutter',
        width: '56px',
        height: '56px',
        zIndex: 'nav',
      },
      xl: { width: '60px', height: '60px' },
    },
    plateFrame: {
      position: 'relative',
      overflow: 'hidden',
      aspectRatio: '1 / 1',
      lg: { aspectRatio: 'auto', flex: '1', minHeight: '0' },
    },
    plateImage: {
      objectFit: 'cover',
      transition: 'develop',
    },
    plateImageHidden: {
      clipPath: 'inset(100% 0 0 0)',
    },
    plateImageShown: {
      clipPath: 'inset(0 0 0 0)',
    },
    plateCaption: {
      minHeight: '[2.75em]',
      paddingTop: 'sm',
      paddingInline: 'gutter',
    },
    column: {
      paddingInline: 'gutter',
      paddingBottom: 'sectionY',
    },
    chapter: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
      gap: 'lg',
      paddingBlock: 'xl',
      lg: {
        '&[data-chapter]': {
          minHeight: '[calc(100dvh - token(sizes.nav))]',
          justifyContent: 'center',
          paddingBlock: '2xl',
        },
      },
    },
    workChapter: {
      borderTop: 'hairline',
    },
    intro: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
      gap: 'lg',
    },
    bio: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      maxWidth: 'measure',
    },
    actions: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 'md',
    },
    works: { scrollMarginTop: 'token(sizes.nav)' },
    srOnly: { layerStyle: 'srOnly' },
    facts: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      columnGap: 'lg',
      rowGap: 'sm',
      alignItems: 'baseline',
      maxWidth: 'measure',
      margin: '0',
      '& dd': { margin: '0' },
    },
    term: {
      whiteSpace: 'nowrap',
    },
    with: {
      maxWidth: 'measure',
    },
    inlinePlate: {
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      aspectRatio: '4 / 5',
      lg: { display: 'none' },
    },
    inlineImage: {
      objectFit: 'cover',
    },
    description: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      maxWidth: 'measure',
    },
    sheet: {
      display: 'grid',
      gridTemplateColumns: '[repeat(auto-fill, minmax(clamp(88px, 9vw, 136px), 1fr))]',
      gap: 'sm',
      width: '100%',
      listStyle: 'none',
      margin: '0',
      padding: '0',
      '& > li:first-child': { display: { base: 'none', lg: 'block' } },
    },
    sheetItem: {
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      aspectRatio: '1 / 1',
      border: 'hairline',
      transition: 'interactive',
      _hover: { borderColor: 'action' },
      _focusVisible: { borderColor: 'action' },
    },
    sheetImage: {
      objectFit: 'cover',
      transition: 'develop',
      'button:hover &, button:focus-visible &': { scale: '1.04' },
    },
  },
  variants: {
    withPlate: {
      true: {
        root: {
          lg: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap: '3xl',
            alignItems: 'start',
            paddingRight: 'gutter',
          },
        },
        column: {
          lg: { paddingInline: '0', paddingBottom: '0' },
        },
      },
      false: {
        column: { maxWidth: 'maxWidth', marginInline: 'auto' },
      },
    },
    flush: {
      true: {
        chapter: {
          lg: {
            '&[data-chapter]': { justifyContent: 'start', paddingTop: 'xl' },
          },
        },
      },
    },
  },
})
