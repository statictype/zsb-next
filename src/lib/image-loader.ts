const DEFAULT_WIDTHS = [600, 1200, 1920]

interface ImageLoaderParams {
  src: string
  width: number
  quality?: number
}

export default function imageLoader({ src, width }: ImageLoaderParams): string {
  // External URLs pass through unchanged
  if (src.startsWith('http')) return src

  // Files with standard image extensions pass through unchanged
  if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(src)) return src

  // Parse the src to extract basePath and available widths
  // src format: "/img/2024/optimized/dscf3937" (basePath only)
  // or with metadata suffix: "/img/2024/optimized/dscf3937?widths=600,960,1200,1600,1700"
  const [basePath, query] = src.split('?')
  const params = new URLSearchParams(query || '')
  const widthsParam = params.get('widths')
  const ext = params.get('ext') || 'webp'

  const availableWidths = widthsParam ? widthsParam.split(',').map(Number) : DEFAULT_WIDTHS

  // Snap to nearest available width (round up)
  const snapped =
    availableWidths.find((w) => w >= width) || availableWidths[availableWidths.length - 1]

  return `${basePath}-${snapped}.${ext}`
}
