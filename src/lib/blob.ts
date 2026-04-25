const BASE = process.env.NEXT_PUBLIC_BLOB_URL ?? ''

export function blobUrl(path: string): string {
  return `${BASE}/${path}`
}
