import Script from 'next/script'
import { SITE_URL, UMAMI_WEBSITE_ID } from '@/lib/constants'

const HOST = new URL(SITE_URL).hostname

export function Umami() {
  if (UMAMI_WEBSITE_ID === '') return null
  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id={UMAMI_WEBSITE_ID}
      data-domains={`${HOST},www.${HOST}`}
    />
  )
}
