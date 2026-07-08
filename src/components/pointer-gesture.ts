/**
 * Pointer travel (px) beyond which a gesture counts as a drag/swipe rather
 * than a static tap or click. Shared by `Carousel` (suppresses the click
 * that ends a mouse drag) and `Lightbox` (locks the swipe axis).
 */
export const POINTER_DRAG_TOLERANCE_PX = 8
