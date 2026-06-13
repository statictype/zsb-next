import type { ButtonHTMLAttributes } from 'react'
import { cx } from 'styled-system/css'
import { type IconButtonVariantProps, iconButton } from 'styled-system/recipes'

/**
 * IconButton — unified square icon control (ZSB-71).
 *
 * Replaces the StripControls prev/next, the HeroSlideshow nav, and the Lightbox
 * close + prev/next. `size` (sm|md|lg) × `tone` (default|media) live in the Panda
 * `iconButton` recipe. Pass an `@remixicon/react` icon as the child; per-control
 * icon motion stays on the consumer via `className` + the base transform transition.
 */
type IconButtonProps = IconButtonVariantProps & ButtonHTMLAttributes<HTMLButtonElement>

export function IconButton({ size, tone, className, type = 'button', ...rest }: IconButtonProps) {
  return <button type={type} className={cx(iconButton({ size, tone }), className)} {...rest} />
}
