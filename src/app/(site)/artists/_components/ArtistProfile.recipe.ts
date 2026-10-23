import { sva } from 'styled-system/css'

export const artistProfile = sva({
  slots: [
    'root',
    'plate',
    'plateFrame',
    'plateImage',
    'plateImageActive',
    'plateCaption',
    'column',
    'intro',
    'editions',
    'bio',
    'actions',
    'srOnly',
    'works',
    'work',
    'facts',
    'inlinePlate',
    'inlineImage',
    'description',
    'thumbs',
    'thumb',
    'thumbImage',
  ],
  base: {
    root: {
      paddingTop: 'token(sizes.nav)',
    },
    plate: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      lg: {
        position: 'sticky',
        top: 'token(sizes.nav)',
      },
    },
    plateFrame: {
      position: 'relative',
      overflow: 'hidden',
      aspectRatio: '1 / 1',
      lg: { aspectRatio: '4 / 3' },
    },
    plateImage: {
      objectFit: 'cover',
      opacity: '0',
      transition: 'develop',
    },
    plateImageActive: {
      opacity: '1',
    },
    plateCaption: {
      minHeight: '[2.75em]',
      paddingBlock: 'sm',
      paddingInline: 'gutter',
      lg: { paddingInline: 'lg' },
    },
    column: {
      paddingInline: 'gutter',
      paddingBottom: 'sectionY',
      lg: { paddingInline: 'xl' },
    },
    intro: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
      gap: 'lg',
      paddingBlock: 'xl',
    },
    editions: {
      listStyle: 'none',
      margin: '0',
      padding: '0',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'sm',
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
    srOnly: { layerStyle: 'srOnly' },
    works: {
      listStyle: 'none',
      margin: '0',
      padding: '0',
    },
    work: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
      gap: 'md',
      paddingBlock: 'xl',
      borderTop: 'hairline',
    },
    facts: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'xs',
    },
    inlinePlate: {
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      aspectRatio: '1 / 1',
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
    thumbs: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'sm',
      listStyle: 'none',
      margin: '0',
      padding: '0',
      '& > li:first-child': { display: { base: 'none', lg: 'block' } },
    },
    thumb: {
      position: 'relative',
      overflow: 'hidden',
      width: '[72px]',
      height: '[72px]',
      border: 'hairline',
      transition: 'interactive',
      _hover: { borderColor: 'action' },
      _focusVisible: { borderColor: 'action' },
    },
    thumbImage: {
      objectFit: 'cover',
    },
  },
  variants: {
    withPlate: {
      true: {
        root: {
          lg: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'start',
          },
        },
      },
      false: {
        column: { maxWidth: 'maxWidth', marginInline: 'auto' },
      },
    },
  },
})
