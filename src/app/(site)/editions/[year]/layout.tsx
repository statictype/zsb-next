// The edition route owns a `@modal` parallel slot so a single event can open as
// a modal over the edition (soft nav, intercepting route) while still having a
// real URL that hard-loads the full edition with the modal over it (ADR 0015).
// `children` already reads request data (draftMode) in page.tsx, so both slots
// at this level render dynamically — satisfying the parallel-routes rule that a
// dynamic slot forces its siblings dynamic too.
export default function EditionLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}
