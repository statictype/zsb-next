export function padNum(n: number, len = 2): string {
  return String(n).padStart(len, '0')
}

export function splitInHalf<T>(arr: T[]): [T[], T[]] {
  const mid = Math.ceil(arr.length / 2)
  return [arr.slice(0, mid), arr.slice(mid)]
}

export function toLightboxImages(
  items: { basePath: string; caption: string; ext?: string; widths?: number[] }[],
): { src: string; caption: string }[] {
  return items.map((item) => {
    const ext = item.ext ?? 'webp'
    const widths = item.widths ?? [600, 1200, 1920]
    const largest = widths[widths.length - 1] ?? 1920
    return { src: `${item.basePath}-${largest}.${ext}`, caption: item.caption }
  })
}
