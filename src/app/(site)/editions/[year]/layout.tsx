// `children` reads draftMode in page.tsx, so the dynamic `@modal` slot and
// `children` both render dynamically.
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
