import { defineSlotRecipe } from '@pandacss/dev'

export const carousel = defineSlotRecipe({
  className: 'carousel',
  jsx: ['Carousel'],
  description: 'GSAP-driven stage and rail carousel contract',
  slots: ['root', 'frame', 'track', 'item', 'control', 'trigger'],
  base: {
    root: { position: 'relative', width: '100%', minWidth: 0 },
    frame: { position: 'relative', isolation: 'isolate', overflow: 'hidden' },
    // `data-engine` and `data-moving` are both stamped by useCarouselEngine —
    // the first once GSAP owns the transforms (until then the track is its own
    // scroll-snap strip), the second for as long as the strip is under way.
    track: {
      display: 'flex',
      alignItems: 'stretch',
      overflowX: 'auto',
      scrollSnapType: 'x mandatory',
      scrollBehavior: 'smooth',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': { display: 'none' },
      _motionReduce: { scrollBehavior: 'auto' },
      '&[data-engine]': {
        scrollSnapType: 'none',
        cursor: 'grab',
        touchAction: 'pan-y',
        overflowX: 'hidden',
      },
      '&[data-engine]:active': { cursor: 'grabbing' },
      '&[data-moving] [data-carousel-slide-content]': { pointerEvents: 'none' },
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
      '& > [data-carousel-slide-content]': { transition: 'develop' },
      '[data-engine] &:not([data-current]) > [data-carousel-slide-content]': { opacity: '[0.2]' },
    },
    control: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'md',
      '& [data-carousel-arrows]': {
        display: 'flex',
        alignItems: 'center',
        gap: 'sm',
        marginInlineStart: 'auto',
      },
    },
    trigger: {
      pressable: 'inline',
      width: 'touch',
      height: 'touch',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 0,
      background: 'transparent',
      color: 'heading',
      cursor: 'pointer',
      _hover: { color: 'action' },
      _disabled: { opacity: 0.5, cursor: 'not-allowed' },
    },
  },
  variants: {
    mode: {
      stage: {
        root: { display: 'flex', flexDirection: 'column', gap: 'md' },
        // `--stage-pitch` is the slide's outer width, and every other stage
        // measurement derives from it: the mask ramp straddles the first slide
        // boundary, and `--carousel-focus-offset` tells the engine that the
        // slide before it is the one the mask is hiding.
        frame: {
          '--carousel-focus-offset': '0',
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
            '--carousel-focus-offset': '1',
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
          '& > [data-carousel-slide-content]': {
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
        // useCarouselEngine reads `--carousel-snap-mode` off the track: only
        // the CSS knows the slide is laid out as one page per image here.
        track: { paddingInline: 'gutter', _portraitPhone: { '--carousel-snap-mode': 'image' } },
        control: { paddingInline: 'gutter' },
        item: {
          '& > [data-carousel-slide-content]': { height: '100%' },
          _portraitPhone: {
            '[data-engine] &:not([data-current]) > [data-carousel-slide-content]': {
              opacity: '[1]',
            },
          },
        },
      },
    },
  },
  defaultVariants: { mode: 'rail' },
})
