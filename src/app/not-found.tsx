// Root boundary for URLs that match no route at all — those render outside the
// (site) group, so this re-export shows the same 404 UI without site chrome.
// `notFound()` throws inside (site) segments hit `(site)/not-found.tsx` instead,
// which picks up the nav and footer from the site layout.
export { default } from './(site)/not-found'
