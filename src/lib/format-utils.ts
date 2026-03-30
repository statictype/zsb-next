export function padNum(n: number, len = 2): string {
  return String(n).padStart(len, '0')
}

export function splitInHalf<T>(arr: T[]): [T[], T[]] {
  const mid = Math.ceil(arr.length / 2)
  return [arr.slice(0, mid), arr.slice(mid)]
}

export function toLightboxImages(
  items: { basePath: string; caption: string }[],
): { src: string; caption: string }[] {
  return items.map((item) => ({
    src: `${item.basePath}-1920.webp`,
    caption: item.caption,
  }))
}
