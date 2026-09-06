import { sva } from 'styled-system/css'

export const partnerStrip = sva({
  slots: ['layout', 'intro', 'viewport', 'track', 'run', 'cell', 'link', 'logo'],
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
    viewport: {
      position: 'relative',
      flex: '1',
      minWidth: '0',
      overflow: 'hidden',
      maskImage: 'linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)',
      _motionReduce: { maskImage: '[none]' },
    },
    track: {
      display: 'flex',
      width: '[max-content]',
      animationName: 'marquee',
      animationTimingFunction: '[linear]',
      animationIterationCount: 'infinite',
      _hover: { animationPlayState: 'paused' },
      _motionReduce: { animation: '[none]', width: 'auto' },
    },
    run: {
      display: 'flex',
      alignItems: 'center',
      gap: '2xl',
      paddingRight: '2xl',
      margin: '0',
      listStyle: 'none',
      _motionReduce: {
        flexWrap: 'wrap',
        rowGap: 'lg',
        paddingRight: '0',
        '&[data-clone]': { display: 'none' },
      },
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
