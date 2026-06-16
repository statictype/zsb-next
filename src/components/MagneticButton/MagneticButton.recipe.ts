import { sva } from 'styled-system/css'

/**
 * MagneticButton — co-located slot recipe.
 *
 * MagneticButton is now a thin motion wrapper over the shared `button` recipe:
 * the variant/size visuals come from `button()`, this adds only the bits the
 * recipe doesn't model — ripple containment, the arrow-nudge content span, and
 * the optional animated gradient-border ring (the homepage hero CTA).
 *
 * The gradient-border overrides land in the `utilities` layer, so they win over
 * the `button` recipe's resting/hover border + fill without specificity hacks.
 */
export const magneticButton = sva({
  slots: ['root', 'content'],
  base: {
    // overflow clips the ripple; will-change primes the GSAP magnetic transform.
    root: {
      position: 'relative',
      overflow: 'hidden',
      willChange: 'transform',
      _hover: { '& svg': { transform: 'translate(3px, -3px)' } },
    },
    content: {
      position: 'relative',
      zIndex: 1,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      '& svg': { transition: 'transform 0.4s {easings.expo}, color 0.3s ease' },
    },
  },
  variants: {
    gradientBorder: {
      true: {
        // Rest: dark hairline + accent text, no fill. Hover: an animated
        // pink↔chartreuse conic ring (masked to the edge); the recipe's fill is
        // suppressed.
        root: {
          borderColor: 'borderDark',
          color: 'action',
          _after: {
            content: '""',
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            // A sub-pixel frame keeps the masked ring as thin as the hairline.
            padding: '0.5px',
            background:
              'conic-gradient(from var(--mb-angle), token(colors.pink) 0deg, token(colors.pink) 35deg, token(colors.chartreuse) 90deg, token(colors.pink) 145deg, token(colors.pink) 215deg, token(colors.chartreuse) 270deg, token(colors.pink) 325deg, token(colors.pink) 360deg)',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            opacity: 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          },
          _hover: {
            borderColor: 'transparent',
            background: 'transparent',
            color: 'action',
            '& svg': { transform: 'translate(3px, -3px)' },
            _after: { opacity: 1, animation: 'mbGradientSpin 4s linear infinite' },
          },
          '@media (prefers-reduced-motion: reduce)': { '&:hover::after': { animation: 'none' } },
        },
      },
    },
  },
})
