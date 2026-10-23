export function askZsbHref(email: string, artist: string, work?: string): string {
  const subject = work ? `About “${work}” by ${artist}` : `About ${artist}`
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`
}
