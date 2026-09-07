import { defineSlotRecipe } from '@pandacss/dev'

export const carousel = defineSlotRecipe({
  className: 'carousel',
  jsx: ['Carousel'],
  description: 'GSAP-driven stage and rail carousel contract',
  slots: ['root', 'frame', 'track', 'item', 'control', 'trigger'],
  base: {
    root: { position: 'relative', width: '100%', minWidth: 0 },
    frame: { position: 'relative', isolation: 'isolate', overflow: 'hidden' },
    // `data-engine` is stamped by useCarouselEngine once GSAP owns the
    // transforms; until then the track is its own scroll-snap strip.
    track: {
      display: 'flex',
      alignItems: 'stretch',
      overflowX: 'auto',
      scrollSnapType: 'x mandatory',
      scrollBehavior: 'smooth',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': { display: 'none' },
      _motionReduce: { scrollBehavior: 'auto' },
      '&[data-engine]': { scrollSnapType: 'none', cursor: 'grab', touchAction: 'pan-y' },
      // Looping moves the items and leaves the track still, so the track keeps
      // clipping; the bounded engine translates the track itself, so there the
      // frame has to do the clipping instead.
      '&[data-engine="loop"]': { overflowX: 'hidden' },
      '&[data-engine="bounded"]': { overflow: 'visible' },
      '&[data-engine]:active': { cursor: 'grabbing' },
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
      '& [data-carousel-arrows]': { display: 'flex', alignItems: 'center', gap: 'sm' },
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
          md: { width: '[var(--stage-pitch)]', height: '[auto]' },
          '& > [data-carousel-slide-content]': {
            width: '100%',
            height: '100%',
            md: { height: '[auto]', aspectRatio: '3 / 2' },
          },
        },
      },
      rail: {
        track: { paddingInline: 'gutter' },
        control: { paddingInline: 'gutter' },
        item: { '& > [data-carousel-slide-content]': { height: '100%' } },
      },
    },
  },
  defaultVariants: { mode: 'rail' },
})
