export interface Rect {
  left: number
  top: number
  width: number
  height: number
}

interface Size {
  width: number
  height: number
}

export function containRect(natural: Size, container: Rect): Rect {
  if (natural.width <= 0 || natural.height <= 0) return container
  const scale = Math.min(container.width / natural.width, container.height / natural.height)
  const width = natural.width * scale
  const height = natural.height * scale
  return {
    left: container.left + (container.width - width) / 2,
    top: container.top + (container.height - height) / 2,
    width,
    height,
  }
}

export function elementRect(el: Element): Rect {
  const { left, top, width, height } = el.getBoundingClientRect()
  return { left, top, width, height }
}

export function intersectsViewport(rect: Rect): boolean {
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.left < window.innerWidth &&
    rect.top < window.innerHeight &&
    rect.left + rect.width > 0 &&
    rect.top + rect.height > 0
  )
}
