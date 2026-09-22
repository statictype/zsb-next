import { sva } from 'styled-system/css'

export const partnerStrip = sva({
  slots: ['layout', 'body', 'action', 'cell', 'link', 'logo'],
  base: {
    layout: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'xl',
    },
    body: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2xl',
      md: { flexDirection: 'row', alignItems: 'center', gap: 'xl' },
      lg: { gap: '2xl' },
    },
    action: { flex: 'none', alignSelf: 'flex-start', md: { alignSelf: 'center' } },
    cell: { flex: 'none', display: 'flex', alignItems: 'center' },
    link: { display: 'inline-flex', pressable: 'inline' },
    logo: {
      height: '[29px]',
      width: 'auto',
      objectFit: 'contain',
      filter: '[token(assets.grayscaleFull)]',
      transition: 'develop',
      md: { height: '[40px]' },
      lg: { height: '[50px]' },
      _hover: { filter: '[none]' },
    },
  },
})
