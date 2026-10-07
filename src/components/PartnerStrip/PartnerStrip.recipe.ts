import { sva } from 'styled-system/css'

export const partnerStrip = sva({
  slots: ['root', 'layout', 'title', 'body', 'action', 'cell', 'link', 'logo'],
  base: {
    root: { paddingBlock: 'xl' },
    layout: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'xl',
      xl: { flexDirection: 'row', alignItems: 'center' },
    },
    title: { xl: { flex: 'none', whiteSpace: 'nowrap' } },
    body: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2xl',
      md: { flexDirection: 'row', alignItems: 'center', gap: 'xl' },
      lg: { gap: '2xl' },
      xl: { flex: '1', minWidth: '0' },
    },
    action: { flex: 'none', alignSelf: 'flex-start', md: { alignSelf: 'center' } },
    cell: { flex: 'none', display: 'flex', alignItems: 'center' },
    link: { display: 'inline-flex', pressable: 'inline' },
    logo: {
      height: '29px',
      width: 'auto',
      objectFit: 'contain',
      filter: 'token(assets.grayscaleFull)',
      transition: 'develop',
      sm: { height: '22px' },
      md: { height: '30px' },
      lg: { height: '38px' },
      _hover: { filter: 'none' },
    },
  },
})
