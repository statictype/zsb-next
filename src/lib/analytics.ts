type EventData = Record<string, string | number>

declare global {
  interface Window {
    umami?: { track: (name: string, data?: EventData) => void }
    gtag?: (command: 'event', name: string, params?: EventData) => void
  }
}

export function trackEvent(name: string, data: EventData = {}) {
  window.umami?.track(name, data)
  window.gtag?.('event', name, data)
}
