import { sva } from 'styled-system/css'

export const partnerStrip = sva({
  slots: ['layout', 'intro', 'cell', 'link', 'logo'],
  base: {
    layout: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'xl',
      lg: { flexDirection: 'row', alignItems: 'center', gap: '2xl' },
    },
    intro: {
      flex: 'none',
      alignItems: 'flex-start',
      lg: { maxWidth: '[240px]' },
    },
    cell: { flex: 'none', display: 'flex', alignItems: 'center' },
    link: { display: 'inline-flex', pressable: 'inline' },
    logo: {
      height: '[40px]',
      width: 'auto',
      objectFit: 'contain',
      filter: '[token(assets.grayscaleFull)]',
      transition: 'develop',
      md: { height: '[56px]' },
      _hover: { filter: '[none]' },
    },
  },
})
