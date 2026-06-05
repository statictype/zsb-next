export const SITE_URL = 'https://sculpturedays.com'
export const SITE_NAME = 'Bucharest Sculpture Days'

// Global meta-description safety net. Per-page descriptions are authored in
// Sanity (required on every page singleton); this generic line is only used if
// a singleton document is somehow missing at render time.
export const SITE_DESCRIPTION =
  'Bucharest Sculpture Days is Romania’s annual platform for contemporary sculpture, presenting exhibitions, artists, and events at venues across Bucharest.'

export const CONSENT_COOKIE = 'zsb_consent'
export const CONSENT_REOPEN_EVENT = 'zsb:reopen-consent'
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''
