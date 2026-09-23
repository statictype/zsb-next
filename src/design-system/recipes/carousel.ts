import { defineSlotRecipe } from '@pandacss/dev'
import {
  CURRENT_ATTR,
  ENGINE_ATTR,
  ENGINE_IDLE_ATTR,
  MOVING_ATTR,
  SLIDE_CONTENT_ATTR,
} from '@/components/Carousel/carousel-contract'

const engine = `[${ENGINE_ATTR}]`
const content = `[${SLIDE_CONTENT_ATTR}]`
const restingContent = `:not([${ENGINE_IDLE_ATTR}]) > &:not([${CURRENT_ATTR}]) > ${content}`

export const carousel = defineSlotRecipe({
  className: 'carousel',
  jsx: ['Carousel'],
  description: 'GSAP-driven stage and rail carousel contract',
  slots: ['root', 'frame', 'track', 'item', 'control', 'arrows'],
  base: {
    root: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: 'lg',
      width: '100%',
      minWidth: 0,
    },
    frame: { position: 'relative', isolation: 'isolate', overflow: 'hidden' },
    track: {
      display: 'flex',
      alignItems: 'stretch',
      overflowX: 'auto',
      scrollSnapType: 'x mandatory',
      scrollBehavior: 'smooth',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': { display: 'none' },
      _motionReduce: { scrollBehavior: 'auto' },
      [`&${engine}`]: {
        scrollSnapType: 'none',
        cursor: 'grab',
        touchAction: 'pan-y',
        overflowX: 'hidden',
      },
      [`&${engine}:active`]: { cursor: 'grabbing' },
      [`&[${MOVING_ATTR}] ${content}`]: { pointerEvents: 'none' },
      _focusVisible: { outline: 'none' },
    },
    item: {
      flex: 'none',
      minWidth: 0,
      scrollSnapAlign: 'start',
      willChange: 'transform',
      paddingRight: 'md',
      // The item carries GSAP's per-frame transform, so its own transition
      // property must stay empty or the two fight.
      [`& > ${content}`]: { transition: 'develop' },
      [restingContent]: { opacity: '[0.2]' },
    },
    control: { display: 'flex', alignItems: 'center', gap: 'md' },
    arrows: { display: 'flex', alignItems: 'center', gap: 'sm', marginInlineStart: 'auto' },
  },
  variants: {
    mode: {
      stage: {
        frame: {
          aspectRatio: '1 / 1',
          _portraitPhone: {
            '--stage-pitch': '[calc((100% - token(spacing.md)) / 1.125)]',
            aspectRatio: '[auto]',
            height: '[auto]',
          },
          md: {
            '--stage-pitch': '[78%]',
            aspectRatio: '[auto]',
            height: '[auto]',
          },
          '2xl': {
            '--stage-pitch': '[min(calc((100% - 72px) / 2), 900px)]',
            // The hero copy sits over the frame's leading edge (page.recipe.ts),
            // so the slides under it are masked out rather than clipped.
            maskImage: [
              'linear-gradient(90deg,',
              'transparent 0,',
              'transparent calc(var(--stage-pitch) - 440px),',
              'rgb(0 0 0 / 0.06) calc(var(--stage-pitch) - 330px),',
              'rgb(0 0 0 / 0.12) calc(var(--stage-pitch) - 240px),',
              'rgb(0 0 0 / 0.28) calc(var(--stage-pitch) - 160px),',
              'rgb(0 0 0 / 0.66) calc(var(--stage-pitch) - 80px),',
              'black calc(var(--stage-pitch) + 30px),',
              'black 100%)',
            ].join(' '),
          },
        },
        track: { height: '100%' },
        item: {
          width: '100%',
          height: '100%',
          _portraitPhone: {
            width: '[var(--stage-pitch)]',
            height: '[auto]',
          },
          md: { width: '[var(--stage-pitch)]', height: '[auto]' },
          [`& > ${content}`]: {
            width: '100%',
            height: '100%',
            _portraitPhone: {
              height: '[auto]',
              aspectRatio: '1 / 1',
            },
            md: { height: '[auto]', aspectRatio: '3 / 2' },
          },
        },
      },
      rail: {
        track: {
          paddingInline: 'gutter',
          scrollPaddingInline: 'gutter',
          [`&${engine}`]: { paddingInline: '0' },
        },
        control: { paddingInline: 'gutter' },
        item: {
          [`& > ${content}`]: { height: '100%' },
          _portraitPhone: { [restingContent]: { opacity: '[1]' } },
        },
      },
    },
  },
  defaultVariants: { mode: 'rail' },
})
