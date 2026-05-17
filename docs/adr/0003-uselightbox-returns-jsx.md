# `useLightbox` returns JSX from a hook

`useLightbox(images)` returns `{ open, element }` where `element` is a pre-bound `<LightboxView>` JSX element. Callers do `const lb = useLightbox(images)` and render `{lb.element}` — the hook owns state, wrap-around navigation, body scroll lock, and rendering behind a two-property interface.

The previous shape was a separate `useLightbox()` hook plus a `<Lightbox>` component, with five callers each fanning out the same five props (`images`, `currentIndex`, `onIndexChange`, `isOpen`, `onClose`). The hook was shallow — it exposed raw `setIndex` and the wrap-around math lived in the component, duplicated across the keyboard handler and the click handler. Fusing the hook and the view collapsed each caller's lightbox boilerplate from ~8 lines to 2 and made the seam match the leverage.

The "hook returns JSX" pattern is unusual enough that a future contributor could reasonably split it back. The deletion test points the other way: removing the fused module would re-scatter state + wrap-around math + body-scroll-lock + view across 5 callers.
