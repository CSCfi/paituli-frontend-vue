import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

/**
 * Reactively track how much horizontal space a component is given, so it can
 * adapt its template to its own size. Pass the component's root ref; we observe
 * its *parent* on purpose: a component's own box is content-sized and shrinks
 * as it compacts, which would feedback-loop (it collapses and never expands back).
 * The parent's width reflects the allocated space instead.
 *
 * Compare the returned `width` against whatever logic a component implements,
 * e.g. a local `enum Width { Compact = 500, etc. }`, or hardcoded values.
 */
export function useCompactness(
  root: Ref<HTMLElement | null | undefined>,
) {
  // Treat as "plenty of room" until the first measurement, so a component
  // starts in its roomiest state rather than flashing compact on mount.
  const width = ref(Infinity)
  const observer = new ResizeObserver(entries => {
    width.value = entries[0].contentRect.width
  })

  // Re-attach whenever the root changes (it is null until mount). We measure
  // the parent, the space the component is allocated — see the note above.
  watch(root, (el, _prev, onCleanup) => {
    const slot = el?.parentElement
    if (!slot) return
    observer.observe(slot)
    onCleanup(() => observer.unobserve(slot))
  }, { immediate: true })

  onBeforeUnmount(() => observer.disconnect())

  // True when the width sits in [lower, higher).
  const between = (lower: number, higher: number) =>
    width.value >= lower && width.value < higher

  return { width, between }
}
