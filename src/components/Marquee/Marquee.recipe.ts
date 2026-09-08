import { sva } from 'styled-system/css'

export const marquee = sva({
  slots: ['viewport', 'track', 'run'],
  base: {
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
      margin: '0',
      padding: '0',
      listStyle: 'none',
      _motionReduce: {
        flexWrap: 'wrap',
        rowGap: 'lg',
        '&[data-clone]': { display: 'none' },
      },
    },
  },
  variants: {
    gap: {
      lg: { run: { gap: 'lg', paddingRight: 'lg', _motionReduce: { paddingRight: '0' } } },
      xl: { run: { gap: 'xl', paddingRight: 'xl', _motionReduce: { paddingRight: '0' } } },
      '2xl': { run: { gap: '2xl', paddingRight: '2xl', _motionReduce: { paddingRight: '0' } } },
    },
  },
  defaultVariants: { gap: '2xl' },
})
