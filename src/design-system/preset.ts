import { definePattern, definePreset, defineRecipe, defineSlotRecipe } from '@pandacss/dev'

/**
 * Gray ramp generated from ONE anchor (ZSB-70 palette rationalisation).
 *
 * The legacy palette had ~18 hand-picked grays (incl. 350/750/850 half-steps).
 * Measuring them in OKLCH showed a single systematic ramp: a magenta-leaning
 * hue (~345°) at very low chroma, varying only in lightness. So we regenerate
 * it from a fixed hue + chroma and step the L — preserving the brand's warm
 * tint while collapsing the source of truth to a handful of numbers.
 *
 * These are SOLID (not alpha) on purpose: grays sit on text over media
 * (scrims, galleries, Hero), where translucency would read through the image.
 * Alpha is reserved for adaptive solid-surface roles (dividers/overlays) later.
 */
const GRAY_HUE = 345
const GRAY_CHROMA = 0.005
const GRAY_L: Record<string, number> = {
  50: 97,
  100: 94.5,
  200: 90,
  300: 79,
  400: 69,
  500: 61,
  600: 52,
  700: 42,
  800: 32,
  900: 24,
  950: 15,
}
const grayRamp = Object.fromEntries(
  Object.entries(GRAY_L).map(([step, l]) => [
    step,
    { value: `oklch(${l}% ${GRAY_CHROMA} ${GRAY_HUE})` },
  ]),
)

/**
 * Badge — the first unified primitive (ZSB-71 spike proof).
 * Collapses the 8 legacy pill/chip/tape-label/status-badge variants into one
 * recipe with `tone` × `size` × `elevated`.
 */
const badge = defineRecipe({
  jsx: ['Badge'],
  className: 'badge',
  description: 'Unified tag/chip/badge — replaces the legacy pill/chip/tape/status variants',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    width: 'fit-content',
    fontFamily: 'body',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    lineHeight: '1.3',
    whiteSpace: 'nowrap',
  },
  variants: {
    tone: {
      // Solid chartreuse fill, chartreuse hairline chip, solid dark fill. The
      // old `outline` (chartreuse) and `muted` (gray) hairlines were the same
      // role on different grounds — collapsed to one brand-forward hairline.
      highlight: { bg: 'highlight', color: 'black' },
      outline: { color: 'highlight', borderWidth: '1px', borderColor: 'highlightFaint' },
      dark: { bg: 'gray.800', color: 'white' },
    },
    size: {
      // `sm` rides the responsive `2xs` token (8→9→10px) so the chip sweep is
      // lossless across the hand-rolled chips it replaces.
      sm: { fontSize: '2xs', paddingInline: '8px', paddingBlock: '3px' },
      md: { fontSize: '10px', paddingInline: '12px', paddingBlock: '6px' },
    },
    elevated: {
      true: {
        boxShadow: 'badge',
        transform: 'rotate(-0.7deg)',
      },
    },
  },
  defaultVariants: { tone: 'highlight', size: 'md' },
})

/**
 * Eyebrow — unified kicker/label above headings (ZSB-71).
 * Collapses `.eyebrowMuted` (with decorative rule), the carousel-control eyebrow
 * (muted, no rule) and the FeaturedEvents eyebrow (highlight, smaller) into one
 * recipe: `tone` × `size` × `rule`. The rule inherits the text color.
 */
const eyebrow = defineRecipe({
  jsx: ['Eyebrow'],
  className: 'eyebrow',
  description: 'Unified eyebrow/kicker — replaces legacy carousel and FeaturedEvents eyebrows',
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontFamily: 'body',
    textTransform: 'uppercase',
    letterSpacing: 'wide',
    lineHeight: 'heading',
    color: 'muted',
  },
  variants: {
    tone: {
      muted: { color: 'muted' },
      highlight: { color: 'highlight' },
    },
    size: {
      sm: { fontSize: '2xs' },
      md: { fontSize: 'xs' },
    },
    rule: {
      true: {
        _before: {
          content: '""',
          width: '40px',
          height: '2px',
          background: 'currentColor',
          flexShrink: '0',
        },
      },
    },
  },
  defaultVariants: { tone: 'muted', size: 'md', rule: false },
})

/**
 * Button — the one action primitive (ADR 0019).
 * `variant` (primary | secondary | ghost | text | icon) × `size` (sm | md | lg).
 * `primary`/`secondary` are the former solid/outline; `text` is the retired
 * `textLink` recipe (borderless inline link, e.g. footer links).
 */
const button = defineRecipe({
  jsx: ['Button'],
  className: 'btn',
  description: 'The one action primitive — primary | secondary | ghost | text | icon (ADR 0019)',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'body',
    fontWeight: 'semibold',
    textTransform: 'uppercase',
    cursor: 'pointer',
    borderRadius: '0',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    transition:
      'color {durations.normal} ease, background-color {durations.normal} ease, border-color {durations.normal} ease, filter {durations.normal} ease',
    _disabled: { opacity: '0.5', cursor: 'not-allowed' },
    _focusVisible: { outline: '2px solid token(colors.action)', outlineOffset: '2px' },
  },
  variants: {
    variant: {
      primary: {
        bg: 'action',
        color: 'white',
        borderColor: 'action',
        _hover: { filter: 'brightness(1.1)' },
      },
      secondary: {
        bg: 'transparent',
        color: 'action',
        borderColor: 'action',
        _hover: { bg: 'action', color: 'white' },
      },
      ghost: {
        bg: 'transparent',
        color: 'muted',
        borderColor: 'borderDark',
        _hover: { color: 'heading', borderColor: 'heading' },
      },
      // Borderless inline text link (the retired `textLink` recipe). Blends into
      // the surrounding copy — inherits font/size/case/tracking from context —
      // e.g. the footer "Cookie Settings" beside the Privacy Policy link.
      text: {
        display: 'inline',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        fontWeight: 'inherit',
        textTransform: 'inherit',
        letterSpacing: 'inherit',
        borderWidth: '0',
        bg: 'transparent',
        color: 'muted',
        _hover: { color: 'action' },
      },
      icon: {
        width: '44px',
        height: '44px',
        padding: '0',
        background: 'transparent',
        borderWidth: '0',
        color: 'heading',
        transition: 'color {durations.normal} ease, transform {durations.normal} {easings.expo}',
        _hover: { _enabled: { color: 'action' } },
      },
    },
    size: {
      sm: {
        fontSize: { base: '9px', md: '10px' },
        letterSpacing: '1.5px',
        gap: '5px',
        paddingBlock: { base: '6px', md: '8px' },
        paddingInline: { base: '16px', md: '20px' },
      },
      md: {
        fontSize: { base: '10px', lg: '11px', '2xl': '13px' },
        letterSpacing: '2px',
        gap: { base: '8px', md: '10px' },
        paddingBlock: { base: '10px', md: '12px', lg: '14px', '2xl': '16px' },
        paddingInline: { base: '24px', md: '28px', lg: '32px', '2xl': '36px' },
      },
      lg: {
        fontSize: { base: '11px', md: '12px', '2xl': '13px' },
        letterSpacing: { base: '2px', lg: '2.5px' },
        gap: { base: '10px', md: '12px', lg: '14px' },
        paddingBlock: { base: '12px', md: '16px', lg: '20px', '2xl': '24px' },
        paddingInline: { base: '28px', md: '36px', lg: '44px', '2xl': '52px' },
      },
    },
  },
  // The `text` and `icon` variants are sizeless — neutralize the default size.
  compoundVariants: [
    {
      variant: 'text',
      css: { paddingBlock: '0', paddingInline: '0', gap: '0' },
    },
    {
      variant: 'icon',
      css: { padding: '0', gap: '0' },
    },
  ],
  defaultVariants: { variant: 'primary', size: 'md' },
})

/**
 * Card — the one unified card (ZSB-71).
 * Every card on the site is the same object: a hairline-bordered surface — ZSB's
 * signature is that hairline box. `ground` carries the one hairline language onto
 * black (`onDark`) or white (`onLight`); `interactive` adds the single normalized
 * hover shared by all cards (the hairline warms to the accent + a small lift).
 * The shell owns chrome + that hover; title-colour shifts and image zoom stay
 * consumer concerns. Backs editions / events / editions-nav / gallery cards.
 */
const card = defineRecipe({
  jsx: ['Card'],
  className: 'card',
  description: 'Unified hairline card — editions / events / editions-nav / gallery',
  base: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    isolation: 'isolate',
    color: 'inherit',
    textDecoration: 'none',
    borderWidth: '1px',
    borderStyle: 'solid',
  },
  variants: {
    /** The ground the hairline sits on — the same box language on either. */
    ground: {
      onDark: { background: 'transparent', borderColor: 'borderDark' },
      onLight: { background: 'surfaceLight', borderColor: 'borderLight', boxShadow: 'card' },
    },
    /** The one hover every card shares: the hairline warms to the accent.
     *  GPU-safe (border-color only — no lift). */
    interactive: {
      true: {
        cursor: 'pointer',
        transition: 'border-color {durations.normal} {easings.expo}',
        _hover: { borderColor: 'action' },
      },
    },
  },
  defaultVariants: { ground: 'onDark', interactive: false },
})

const section = defineRecipe({
  jsx: ['Section'],
  className: 'section',
  description: 'Section shell — vertical rhythm + optional ground (bg/color)',
  base: {},
  variants: {
    /** The section ground. Omit for a rhythm-only section that inherits the
     *  page's own background (e.g. the press strips). Keyed off the semantic
     *  role tokens, never raw black/white. */
    ground: {
      dark: { background: 'canvas', color: 'heading' },
      light: { background: 'surfaceLight', color: 'headingLight' },
    },
    /** Vertical rhythm — the standard cadence vs the looser breathing-room one
     *  (manifesto, About editorial spreads). */
    rhythm: {
      normal: { paddingBlock: 'sectionY' },
      lg: { paddingBlock: 'sectionYLg' },
    },
  },
  defaultVariants: { rhythm: 'normal' },
})

const accordion = defineSlotRecipe({
  className: 'accordion',
  jsx: ['Accordion'],
  description: 'Site accordion with Ark-owned behavior and normalized disclosure chrome',
  slots: ['root', 'item', 'itemTrigger', 'itemContent', 'itemIndicator'],
  base: {
    root: { width: '100%' },
    item: {
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'borderDark',
      _last: { borderBottomWidth: '0' },
    },
    itemTrigger: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'md',
      paddingBlock: 'md',
      paddingInline: '0',
      border: '0',
      background: 'transparent',
      color: 'heading',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'color {durations.fast} {easings.quint}',
      _hover: { color: 'action' },
      _focusVisible: { outline: '2px solid token(colors.highlight)', outlineOffset: '3px' },
      _motionReduce: { transition: 'none' },
      '& [data-accordion-meta]': {
        marginLeft: 'auto',
        fontFamily: 'body',
        fontSize: '2xs',
        textTransform: 'uppercase',
        letterSpacing: 'label',
        fontWeight: 'semibold',
        color: 'muted',
      },
    },
    itemContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'lg',
      paddingBottom: 'lg',
    },
    itemIndicator: {
      display: 'inline-flex',
      flexShrink: '0',
      color: 'muted',
      transition: 'transform {durations.fast} {easings.quint}',
      '&[data-state=open]': { transform: 'rotate(180deg)' },
      _motionReduce: { transition: 'none' },
    },
  },
  variants: {
    triggerTypography: {
      standard: {
        itemTrigger: {
          fontFamily: 'body',
          fontSize: 'md',
          fontWeight: 'bold',
          lineHeight: 'tight',
        },
      },
      display: {
        itemTrigger: {
          fontFamily: 'display',
          fontSize: { base: 'lg', md: 'xl' },
          lineHeight: 'tight',
        },
      },
    },
  },
  defaultVariants: { triggerTypography: 'standard' },
})

const collapsible = defineSlotRecipe({
  className: 'collapsible',
  jsx: ['Collapsible'],
  description: 'Independent disclosure with Ark-owned state and site archive styling',
  slots: ['root', 'trigger', 'content', 'indicator'],
  base: {
    root: {
      width: '100%',
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: 'borderDark',
    },
    trigger: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 'md',
      paddingBlock: 'lg',
      paddingInline: '0',
      border: '0',
      background: 'transparent',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      color: 'action',
      _hover: {
        '& [data-collapsible-label]': { textDecoration: 'underline', textUnderlineOffset: '3px' },
      },
      _focusVisible: { outline: '2px solid token(colors.highlight)', outlineOffset: '2px' },
      '& [data-collapsible-label=open]': { display: 'none' },
      '&[data-state=open] [data-collapsible-label=closed]': { display: 'none' },
      '&[data-state=open] [data-collapsible-label=open]': { display: 'inline' },
      '& [data-collapsible-meta]': {
        color: 'muted',
        fontVariantNumeric: 'tabular-nums',
      },
    },
    content: { paddingTop: 'md', paddingBottom: 'lg' },
    indicator: {
      display: 'inline-flex',
      marginLeft: 'auto',
      color: 'inherit',
      transition: 'transform {durations.normal} {easings.quint}',
      '&[data-state=open]': { transform: 'rotate(180deg)' },
      _motionReduce: { transition: 'none' },
    },
  },
})

const checkbox = defineSlotRecipe({
  className: 'checkbox',
  jsx: ['Checkbox'],
  description: 'Controlled facet checkbox with Ark-owned interaction and site chip styling',
  slots: ['root', 'control', 'indicator', 'label'],
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '9px',
      minHeight: '36px',
      padding: '8px 14px',
      fontFamily: 'body',
      fontSize: 'xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      color: 'gray.300',
      background: 'transparent',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'gray.700',
      cursor: 'pointer',
      transition:
        'color {durations.fast} {easings.quint}, border-color {durations.fast} {easings.quint}, background {durations.fast} {easings.quint}',
      '&[data-hover]': { color: 'white', borderColor: 'white' },
      '&[data-state=checked]': {
        color: 'white',
        background: 'action',
        borderColor: 'action',
      },
      '&[data-focus-visible]': {
        outline: '2px solid token(colors.highlight)',
        outlineOffset: '2px',
      },
      '& [data-checkbox-count]': {
        fontSize: '2xs',
        fontVariantNumeric: 'tabular-nums',
        opacity: 0.6,
      },
      _motionReduce: { transition: 'none' },
    },
    control: {
      width: '14px',
      height: '14px',
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'currentColor',
      opacity: 0.5,
      transition: 'opacity {durations.fast} {easings.quint}',
      '&[data-hover]': { opacity: 0.8 },
      '&[data-state=checked]': {
        opacity: 1,
        background: 'white',
        color: 'action',
        borderColor: 'white',
      },
      _motionReduce: { transition: 'none' },
    },
    indicator: { display: 'inline-flex' },
    label: { cursor: 'inherit' },
  },
})

const dialog = defineSlotRecipe({
  className: 'dialog',
  jsx: ['Dialog'],
  description: 'Modal shell with panel and fullscreen spatial presentations',
  slots: ['trigger', 'backdrop', 'positioner', 'content', 'title', 'description', 'closeTrigger'],
  base: {
    backdrop: {
      position: 'fixed',
      inset: 0,
      background: 'scrim',
    },
    positioner: {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      position: 'relative',
      width: '100%',
      minWidth: 0,
      _focusVisible: { outline: '2px solid token(colors.highlight)', outlineOffset: '-2px' },
    },
    title: {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      whiteSpace: 'nowrap',
      borderWidth: 0,
    },
  },
  variants: {
    presentation: {
      panel: {
        backdrop: { zIndex: 1100 },
        positioner: { zIndex: 1101, padding: 'lg', overflowY: 'auto' },
        content: {
          maxWidth: '540px',
          maxHeight: 'calc(100dvh - 2 * token(spacing.lg))',
          display: 'flex',
          flexDirection: 'column',
          background: 'black',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'borderDark',
          boxShadow: 'modal',
          overflow: 'hidden',
          md: { flexDirection: 'row', maxWidth: '760px' },
        },
      },
      fullscreen: {
        backdrop: { zIndex: 9998, background: 'transparent' },
        positioner: { zIndex: 9999 },
        content: { width: '100vw', height: '100dvh', overflow: 'hidden' },
      },
    },
  },
  defaultVariants: { presentation: 'panel' },
})

const carousel = defineSlotRecipe({
  className: 'carousel',
  jsx: ['Carousel'],
  description: 'Ark-backed stage and rail carousel contract',
  slots: [
    'root',
    'itemGroup',
    'item',
    'control',
    'nextTrigger',
    'prevTrigger',
    'indicatorGroup',
    'indicator',
    'autoplayTrigger',
    'progressText',
    'autoplayIndicator',
  ],
  base: {
    root: { position: 'relative', width: '100%', minWidth: 0 },
    itemGroup: {
      scrollbarWidth: 'none',
      scrollBehavior: 'smooth',
      '&::-webkit-scrollbar': { display: 'none' },
      _focusVisible: { outline: '2px solid token(colors.action)', outlineOffset: '2px' },
      '&[data-dragging]': { cursor: 'grabbing' },
    },
    item: { minWidth: 0 },
    control: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'md',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      '& [data-carousel-arrows]': { display: 'flex', alignItems: 'center', gap: 'sm' },
    },
    prevTrigger: {
      width: '44px',
      height: '44px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 0,
      background: 'transparent',
      color: 'heading',
      cursor: 'pointer',
      _hover: { color: 'action' },
      _disabled: { opacity: 0.5, cursor: 'not-allowed' },
      _focusVisible: { outline: '2px solid token(colors.action)', outlineOffset: '2px' },
    },
    nextTrigger: {
      width: '44px',
      height: '44px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 0,
      background: 'transparent',
      color: 'heading',
      cursor: 'pointer',
      _hover: { color: 'action' },
      _disabled: { opacity: 0.5, cursor: 'not-allowed' },
      _focusVisible: { outline: '2px solid token(colors.action)', outlineOffset: '2px' },
    },
    progressText: {
      textStyle: 'metaLabel',
      color: 'muted',
      fontVariantNumeric: 'tabular-nums',
      marginLeft: 'auto',
    },
    indicatorGroup: { display: 'flex', alignItems: 'center', gap: '10px' },
    indicator: {
      width: '14px',
      height: '2px',
      padding: 0,
      border: 0,
      background: 'onMedia',
      cursor: 'pointer',
      '&[data-current]': { width: '28px', background: 'highlight' },
      _focusVisible: { outline: '2px solid token(colors.action)', outlineOffset: '4px' },
    },
    autoplayTrigger: {
      width: '44px',
      height: '44px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 0,
      background: 'transparent',
      color: 'heading',
      cursor: 'pointer',
      _hover: { color: 'action' },
      _focusVisible: { outline: '2px solid token(colors.action)', outlineOffset: '2px' },
    },
  },
  variants: {
    mode: {
      stage: {
        root: { display: 'flex', flexDirection: 'column', gap: 'md' },
        itemGroup: {
          width: '100%',
          aspectRatio: { base: '4 / 5', md: '16 / 9' },
          background: 'black',
        },
        item: {
          width: '100%',
          height: '100%',
          '& > [data-carousel-slide-content]': { width: '100%', height: '100%' },
        },
      },
      rail: {
        itemGroup: { cursor: 'grab', touchAction: 'pan-x' },
        control: { paddingInline: 'gutter', marginBottom: 'lg' },
        item: { '& > [data-carousel-slide-content]': { height: '100%' } },
      },
    },
  },
  defaultVariants: { mode: 'rail' },
})

const editorialSplit = definePattern({
  description: 'Editorial two-column relationship shared by Manifesto and ThemeArtists',
  transform(props) {
    return {
      display: 'flex',
      flexDirection: 'column',
      ...props,
      lg: {
        display: 'grid',
        gridTemplateColumns: '0.8fr 1.2fr',
        ...props.lg,
      },
      xl: {
        gridTemplateColumns: '1fr 1fr',
        ...props.xl,
      },
    }
  },
})

export const designSystemPreset = definePreset({
  name: 'zsb-design-system',
  conditions: {
    extend: {
      motionSafe: '@media (prefers-reduced-motion: no-preference)',
      motionReduce: '@media (prefers-reduced-motion: reduce)',
    },
  },
  patterns: { extend: { editorialSplit } },
  // Mirror the stepped breakpoints from globals.css (mobile-first).
  theme: {
    extend: {
      breakpoints: {
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
        '3xl': '1536px',
        '4xl': '1792px',
      },
      keyframes: {
        // The one entrance reveal. Parameterized by CSS vars (`--enter-y` /
        // `--enter-scale` / `--enter-blur`) set by the `enter()` cva; built
        // from→to with `animation-fill-mode: both` so the element rests in its
        // visible final state and reduced-motion is just `animation: none`.
        // Folds in the former fadeSlideUp / fadeIn / dialogIn / cardIn /
        // imageReveal / cardReveal.
        enter: {
          from: {
            opacity: '0',
            translate: '0 var(--enter-y, 0px)',
            scale: 'var(--enter-scale, 1)',
            filter: 'blur(var(--enter-blur, 0px))',
          },
          to: { opacity: '1', translate: '0 0', scale: '1', filter: 'blur(0px)' },
        },
        // The diagonal sticky-tape entrance (translate x+y beneath a static
        // rotate). Kept distinct from `enter` — Hero/EditionTheme tapes need it.
        tapeIn: { to: { opacity: '1', translate: '0 0' } },
        // PartnerBadge's continuously-rotating text ring.
        spin: { to: { transform: 'rotate(-360deg)' } },
        // Carousel item's animated gradient hover border.
        gradientBorderShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        // Loading-skeleton sweep (edition loading bones + the shared skeleton).
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      tokens: {
        colors: {
          gray: grayRamp,
          // Brand anchors, authored in OKLCH (measured from the legacy hexes).
          pink: { value: 'oklch(61.6% 0.2527 355)' },
          chartreuse: { value: 'oklch(87.9% 0.1981 115)' },
          // One true black. The former magenta-tinted `black` and the pure
          // `black` are merged here — every dark ground is the same `#000`.
          black: { value: 'oklch(0% 0 0)' },
          white: { value: '#fff' },
        },
        fonts: {
          // Reference the next/font CSS variables already set on <html>.
          display: { value: 'var(--font-dela-gothic), sans-serif' },
          body: { value: 'var(--font-montserrat), sans-serif' },
        },
        // Static + already-fluid (clamp) scales port as plain tokens.
        // Stepped-responsive ones live in semanticTokens below.
        fontSizes: {
          md: { value: 'clamp(19px, 18.35px + 0.2038vw, 22px)' },
          lg: { value: 'clamp(22px, 21.35px + 0.2038vw, 25px)' },
          xl: { value: 'clamp(26px, 24.26px + 0.5435vw, 34px)' },
          '2xl': { value: 'clamp(32px, 28.96px + 0.9511vw, 46px)' },
          '3xl': { value: 'clamp(40px, 36.52px + 1.087vw, 56px)' },
          '4xl': { value: 'clamp(48px, 42.35px + 1.766vw, 74px)' },
          '5xl': { value: 'clamp(58px, 50.61px + 2.31vw, 92px)' },
        },
        spacing: {
          xs: { value: '4px' },
          sm: { value: '8px' },
          lg: { value: 'clamp(24px, 18.78px + 1.6304vw, 48px)' },
          xl: { value: 'clamp(32px, 23.3px + 2.7174vw, 72px)' },
        },
        radii: {
          pill: { value: '100px' },
          circle: { value: '50%' },
        },
        sizes: {
          // The site content rail (`.sectionInner` max-width).
          maxWidth: { value: '1800px' },
        },
        lineHeights: {
          display: { value: '1' },
          heading: { value: '1.38' },
          tight: { value: '1.16' },
          body: { value: '1.56' },
          loose: { value: '1.9' },
        },
        letterSpacings: {
          tight: { value: '-0.02em' },
          subtle: { value: '0.6px' },
          label: { value: '1.2px' },
          wide: { value: '4px' },
        },
        fontWeights: {
          light: { value: '300' },
          regular: { value: '400' },
          medium: { value: '500' },
          semibold: { value: '600' },
          bold: { value: '700' },
          black: { value: '900' },
        },
        durations: {
          fast: { value: '200ms' },
          normal: { value: '300ms' },
          medium: { value: '400ms' },
          slow: { value: '500ms' },
          reveal: { value: '600ms' },
          // Slow entrances/reveals (the fadeSlideUp / tape / image-reveal family)
          // and the skeleton sweep — collapsed off the scattered 0.8–1.3s / 1.6–1.8s
          // literals. Continuous loops (spin/glow/etc.) keep their own literal speed.
          entrance: { value: '900ms' },
          sweep: { value: '1600ms' },
        },
        easings: {
          expo: { value: 'cubic-bezier(0.16, 1, 0.3, 1)' },
          quint: { value: 'cubic-bezier(0.23, 1, 0.32, 1)' },
        },
        // Primitive shadows the audit found inlined (ad-hoc opacities): the
        // Card's faint lift, the Badge's pinned-paper elevation, and the one
        // floating-panel lift shared by the modal dialog + cookie banner.
        shadows: {
          card: { value: '0 2px 12px rgb(0 0 0 / 0.03)' },
          badge: { value: '0 1px 0 rgb(255 255 255 / 0.25) inset, 0 6px 16px rgb(0 0 0 / 0.25)' },
          modal: { value: '0 30px 80px rgb(0 0 0 / 0.5)' },
        },
      },
      semanticTokens: {
        colors: {
          canvas: { value: '{colors.black}' },
          // The one light-surface role — white. Every light ground (sections,
          // onLight cards) keys off this, so light-surface drift can't recur.
          surfaceLight: { value: '{colors.white}' },
          heading: { value: '{colors.white}' },
          headingLight: { value: '{colors.black}' },
          body: { value: '{colors.gray.400}' },
          bodyLight: { value: '{colors.gray.700}' },
          muted: { value: '{colors.gray.600}' },
          borderDark: { value: '{colors.gray.900}' },
          borderLight: { value: '{colors.gray.200}' },
          action: { value: '{colors.pink}' },
          highlight: { value: '{colors.chartreuse}' },
          // Two purposeful translucent roles (the audit's scattered ad-hoc
          // opacities collapse to these). `highlightFaint` references the
          // chartreuse anchor so the brand hue stays single-sourced.
          highlightFaint: { value: 'color-mix(in oklch, {colors.chartreuse} 32%, transparent)' }, // chartreuse hairline
          onMedia: { value: 'rgb(255 255 255 / 0.55)' }, // dimmed control foreground over imagery
          scrim: { value: 'rgb(0 0 0 / 0.95)' }, // dark backdrop behind modals / lightbox
        },
        // Stepped-responsive tokens: faithful to the :root media-query overrides.
        fontSizes: {
          base: { value: { base: '16px', lg: '15px', '4xl': '16px' } },
          '2xs': { value: { base: '8px', lg: '9px', '4xl': '10px' } },
          xs: { value: { base: '10px', lg: '11px' } },
          sm: { value: { base: '12px', '4xl': '13px' } },
        },
        sizes: {
          // Fixed-nav height — the page-top offset every hero clears.
          nav: { value: { base: '60px', md: '72px', lg: '84px', xl: '100px' } },
        },
        spacing: {
          md: { value: { base: '16px', md: '20px' } },
          // The vertical rhythm of a standard section (`--section-padding-y`).
          sectionY: { value: { base: '80px', md: '100px', '2xl': '120px' } },
          // Looser section rhythm for breathing-room sections (manifesto, About).
          sectionYLg: { value: { base: '100px', md: '160px', '2xl': '180px' } },
          // Shared grid gutter (`--grid-gap`).
          gridGap: {
            value: {
              base: '16px',
              md: '32px',
              lg: '48px',
              xl: '60px',
              '2xl': '66px',
              '3xl': '72px',
              '4xl': '84px',
            },
          },
          '3xl': {
            value: {
              base: '64px',
              md: '80px',
              lg: '96px',
              xl: '112px',
              '2xl': '120px',
              '3xl': '128px',
              '4xl': '144px',
            },
          },
          // The horizontal section gutter. Lives on the rail (`sectionInner`),
          // not the section shell, so full-bleed children can escape it.
          gutter: {
            value: {
              base: '16px',
              md: '40px',
              lg: '80px',
              '2xl': '88px',
              '3xl': '96px',
              '4xl': '112px',
            },
          },
          '2xl': {
            value: {
              base: '48px',
              md: '56px',
              lg: '64px',
              xl: '80px',
              '2xl': '88px',
              '3xl': '96px',
              '4xl': '112px',
            },
          },
          '4xl': {
            value: {
              base: '96px',
              md: '112px',
              lg: '128px',
              xl: '160px',
              '2xl': '176px',
              '3xl': '192px',
              '4xl': '224px',
            },
          },
        },
      },
      // Typography utilities. Pure type — margins / max-width belong at the call
      // site. Tag/kicker treatments are NOT here: they are the Badge / Eyebrow
      // recipes.
      textStyles: {
        sectionTitle: {
          value: {
            fontFamily: 'display',
            fontSize: { base: 'xl', md: '2xl' },
            lineHeight: 'display',
            textTransform: 'uppercase',
          },
        },
        // textStyles are typography-only — the entrance animation (the legacy
        // `.pageTitle` `fadeSlideUp`) is applied at the call site via
        // `css({ animation: 'fadeSlideUp 1s {easings.expo} 0.2s both' })`.
        pageTitle: {
          value: {
            fontFamily: 'display',
            fontSize: 'clamp(40px, 4.75vw, 100px)',
            lineHeight: '1',
            textTransform: 'uppercase',
          },
        },
        cardTitle: {
          value: {
            fontFamily: 'display',
            fontSize: 'xl',
            lineHeight: 'heading',
            letterSpacing: 'tight',
            textTransform: 'uppercase',
          },
        },
        metaLabel: {
          value: {
            fontFamily: 'body',
            fontSize: '2xs',
            textTransform: 'uppercase',
            letterSpacing: 'label',
            fontWeight: 'semibold',
            color: 'muted',
          },
        },
        lead: {
          value: {
            fontFamily: 'body',
            fontSize: { base: 'base', '3xl': 'md' },
            fontWeight: { '3xl': 'light' },
            lineHeight: 'body',
            textWrap: 'pretty',
          },
        },
        prose: {
          value: { fontFamily: 'body', fontSize: 'base', lineHeight: 'body', color: 'body' },
        },
      },
      // Page-shell layout as layerStyles. The section *shell* (vertical rhythm
      // + ground) is now the `section` recipe; `sectionInner` is the content
      // rail — it owns the horizontal gutter, so full-bleed children placed
      // outside the rail span the shell. `pageHero` defers its gutter to the
      // rail too (its inner is a `sectionInner`).
      layerStyles: {
        sectionInner: {
          value: { maxWidth: 'maxWidth', marginInline: 'auto', paddingInline: 'gutter' },
        },
        pageHero: {
          value: {
            background: 'black',
            color: 'white',
            paddingTop: {
              base: 'calc(token(sizes.nav) + 80px)',
              md: 'calc(token(sizes.nav) + 120px)',
            },
            paddingBottom: { base: '2xl', md: '3xl' },
          },
        },
        // NB layerStyles are surface props only — positioned/animated helpers
        // (e.g. the image skeleton) live in their own `css()` helper, not here.
      },
      recipes: {
        badge,
        eyebrow,
        button,
        card,
        section,
        accordion,
        collapsible,
        checkbox,
        dialog,
        carousel,
      },
    },
  },
})

export default designSystemPreset
