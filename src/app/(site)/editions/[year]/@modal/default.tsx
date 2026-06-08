// The `@modal` slot is empty unless an event route is active. On a hard load of
// the bare edition URL (or any route the slot doesn't match), Next renders this
// fallback so the slot resolves to nothing instead of 404-ing (parallel routes).
export default function ModalDefault() {
  return null
}
